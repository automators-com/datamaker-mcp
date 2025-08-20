import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { config } from "dotenv";
config();

// Environment variables with defaults
const DATAMAKER_API_URL =
  process.env.DATAMAKER_API_URL ?? "https://api.datamaker.dev.automators.com";

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
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
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
    throw new Error(`Failed to get CSRF token: ${response.status}`);
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