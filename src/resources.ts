import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Connection, Template } from "./types.js";
import { fetchAPI } from "./helpers.js";

export function registerResources(server: McpServer) {
  server.resource(
    "templates",
    "datamaker://templates",
    {
      description: "Get all templates",
    },
    async (url: URL) => {
      try {
        const templates = await fetchAPI<Template[]>("/templates");
        return {
          contents: [
            {
              text: JSON.stringify(templates, null, 2),
              uri: url.toString(),
              mimeType: "application/json",
            },
          ],
        };
      } catch (error) {
        return {
          contents: [
            {
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
              uri: url.toString(),
              mimeType: "text/plain",
            },
          ],
        };
      }
    }
  );

  server.resource(
    "connections",
    "datamaker://connections",
    {
      description: "Get all connections",
    },
    async (url: URL) => {
      try {
        const connections = await fetchAPI<Connection[]>("/connections");
        return {
          contents: [
            {
              text: JSON.stringify(connections, null, 2),
              uri: url.toString(),
              mimeType: "application/json",
            },
          ],
        };
      } catch (error) {
        return {
          contents: [
            {
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
              uri: url.toString(),
              mimeType: "text/plain",
            },
          ],
        };
      }
    }
  );
}
