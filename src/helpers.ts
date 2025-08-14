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
  getJwt: () => string | undefined
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
        const extendedContext = {
          ...context,
          jwtToken,
        };
        return cb(args, extendedContext);
      }
    );
  };
}