import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { s3Client } from "./lib/s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { ENV } from "./lib/config.js";

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
    throw new Error(`HTTP error! status: ${response.status}, response: ${errorBody}`);
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

    return {
      summary: data.slice(0, 5),
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
};

/**
 * Fetches the CSRF token using DataMaker API
 * @param url - The URL of the SAP endpoint
 * @param jwtToken - The JWT token for the user
 * @returns The CSRF data
 */
export async function fetchCsrfToken(url: string, authorization: string) {
  const response = await fetch(`${process.env.DATAMAKER_APP_URL || 'https://datamaker.automators.com'}/api/getCsrfToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',      
    },
    body: JSON.stringify({
      sapUrl: url,
      authorization: authorization || ""
    }),
  });  

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get CSRF token: ${response.status}, response: ${errorText}`);
  }

  return response.json() as Promise<{
    csrf_token: string;
    cookie_name: string;
    cookie_value: string;
  }>;
};

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
      throw new Error(`Failed to parse response from endpoint. JSON parse error: ${parseError}, Text parse error: ${textError}`);
    }
  }
}

/**
 * Creates SAP headers for the CSRF token and cookie
 * @param csrfData - The CSRF data from the fetchCsrfToken function
 * @returns The SAP headers
 */
export function createSapHeaders(csrfData: {
  csrf_token: string;
  cookie_name: string;
  cookie_value: string;
}) {
  return {
    "x-csrf-token": csrfData.csrf_token,
    "Cookie": csrfData.cookie_name + "=" + csrfData.cookie_value,
  };
}