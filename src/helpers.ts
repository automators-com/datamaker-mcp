import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { s3Client } from "./lib/s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { ENV, RESPONSE_TOKEN_THRESHOLD } from "./lib/config.js";
import { get_encoding } from "tiktoken";

// Use centralized config
const DATAMAKER_API_URL = ENV.DATAMAKER_API_URL;
const S3_BUCKET = ENV.S3_BUCKET_NAME;

export async function fetchAPI<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  jwtToken?: string
): Promise<T> {
  const fullUrl = `${DATAMAKER_API_URL.replace(/\/+$/, "")}/${endpoint.replace(
    /^\/+/,
    ""
  )}`;

  let jwt = jwtToken!;

  const response = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorBody = await response.text();
    try {
      errorBody = JSON.parse(errorBody);
    } catch (e) {
      // Do nothing
      console.error(
        JSON.stringify({
          status: response.status,
          body: errorBody,
        })
      );
    }
    throw new Error(
      `HTTP error! status: ${response.status}, response: ${errorBody}`
    );
  }

  return response.json() as Promise<T>;
}

export async function storeToS3AndSummarize(
  data: any[],
  prefix: string = "endpoints"
): Promise<{
  summary: any[];
  totalCount: number;
  s3Key: string;
  viewUrl: string;
}> {
  try {
    // Generate a unique key for the S3 object
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const s3Key = `${prefix}/${timestamp}.json`;
    const tokenThreshold = RESPONSE_TOKEN_THRESHOLD;

    const putCommand = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json",
      Metadata: {
        "total-count": data.length.toString(),
        "stored-at": timestamp,
      },
    });

    await s3Client.send(putCommand);

    const getCommand = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
    });

    const viewUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 86400,
    }); // 24 hours
    
    let tokenCount = 0;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const tokens = countTokens(JSON.stringify(item, null, 2));
      
      tokenCount += tokens;
      if (tokenCount > tokenThreshold) {
        // Slice to return at least 1 item
        const slicedData = i > 1 ? data.slice(0, i) : data.slice(0, 1);  
        
        return {
          summary: slicedData,
          totalCount: data.length,
          s3Key,
          viewUrl,
        };
      }
    }   

    return {
      summary: data,
      totalCount: data.length,
      s3Key,
      viewUrl,
    };    
  } catch (error) {
    console.error("Error storing data to S3:", error);
    throw new Error(
      `Failed to store data to S3: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// Allows the injecting of variables(JWT Token from headers) into MCP tools context
export function injectHonoVar(
  server: McpServer,
  getJwt: () => string | undefined,
  getProjectId?: () => string | undefined
) {
  const originalTool = server.tool.bind(server);

  (server as any).tool = (
    name: string,
    description: any,
    paramsSchemaOrAnnotations: any,
    cb: any
  ) => {
    return originalTool(
      name,
      description,
      paramsSchemaOrAnnotations,
      async (args: any, context: any) => {
        const jwtToken = getJwt(); // from closure
        const projectId = getProjectId?.();
        const extendedContext = {
          ...context,
          jwtToken,
          projectId,
        };
        return cb(args, extendedContext);
      }
    );
  };
}

/**
 * Checks if the endpoint is a SAP endpoint
 * @param url - The URL of the endpoint
 * @returns True if the endpoint is a SAP endpoint, false otherwise
 */
export function isSapEndpoint(url: string) {
  return /\/sap\/opu\//.test(url);
}

/**
 * Parses the response data into proper format
 * @param response - The original response from the endpoint
 * @returns The response data
 */
export async function parseResponseData(response: Response) {
  // Clone the response so we can read it multiple times if needed
  const responseClone = response.clone();

  let responseData;
  try {
    responseData = await response.json();
    return responseData;
  } catch (parseError) {
    // Try to get text response instead from the cloned response
    try {
      const textResponse = await responseClone.text();
      return textResponse;
    } catch (textError) {
      throw new Error(
        `Failed to parse response from endpoint. JSON parse error: ${parseError}, Text parse error: ${textError}`
      );
    }
  }
}

/**
 * Counts the number of tokens in a text
 * @param text - The text to count the tokens of
 * @returns The number of tokens in the text
 */
export function countTokens(text: string) {
  const encoding = get_encoding("cl100k_base");
  const tokens = encoding.encode(text);
  return tokens.length;
}

/**
 * Converts unknown data structures into an array of objects for S3 storage and summarization.
 * This function handles various data formats and attempts to extract meaningful objects.
 * @param data - The data to convert (can be array, object, nested structure, etc.)
 * @returns An array of objects that can be used with storeToS3AndSummarize
 */
export function convertToObjectArray(data: any): any[] {
  // Handle null or undefined
  if (data === null || data === undefined) {
    return [];
  }

  // If it's already an array, return as-is
  if (Array.isArray(data)) {
    return data;
  }

  // If it's a primitive value (string, number, boolean), wrap it in an object
  if (typeof data !== 'object') {
    return [{ value: data }];
  }

  // If it's an object, we need to decide how to convert it
  const obj = data as Record<string, any>;

  // Check if the object has common array-like properties
  const arrayLikeKeys = ['data', 'items', 'results', 'records', 'list', 'array'];
  for (const key of arrayLikeKeys) {
    if (obj[key] && Array.isArray(obj[key])) {
      return obj[key];
    }
  }

  // Check if the object has pagination structure with data array
  if (obj.data && Array.isArray(obj.data)) {
    return obj.data;
  }

  // Check if the object has nested objects that could be treated as separate items
  const nestedObjects = Object.values(obj).filter(
    value => typeof value === 'object' && value !== null && !Array.isArray(value)
  );

  // If there are multiple nested objects, treat them as separate items
  if (nestedObjects.length > 1) {
    return nestedObjects;
  }

  // If there's only one nested object, check if it contains arrays
  if (nestedObjects.length === 1) {
    const nestedObj = nestedObjects[0] as Record<string, any>;
    for (const key of arrayLikeKeys) {
      if (nestedObj[key] && Array.isArray(nestedObj[key])) {
        return nestedObj[key];
      }
    }
  }

  // Check if any property contains an array
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value) && value.length > 0) {
      // If the array contains objects, return it
      if (typeof value[0] === 'object' && value[0] !== null) {
        return value;
      }
      // If the array contains primitives, wrap each in an object
      return value.map(item => ({ [key]: item }));
    }
  }

  // If none of the above patterns match, treat the entire object as a single item
  return [obj];
}