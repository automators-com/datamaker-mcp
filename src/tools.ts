import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Template, DataMakerResponse, Connection } from "./types.js";
import { fetchDM } from "./helpers.js";

export function registerTools(server: McpServer) {
  server.tool(
    "generate_from_id",
    "Generate data from a datamaker template id",
    {
      template_id: z.string().describe("A valid datamaker template id"),
      quantity: z
        .number()
        .default(10)
        .describe("Number of records to generate"),
    },
    async ({ template_id, quantity }) => {
      try {
        // Get all templates
        const templates = await fetchDM<Template[]>("/templates");

        // Find the template with the given id
        const template = templates.find((t) => t.id === template_id);
        if (!template) {
          throw new Error(`Template with id ${template_id} not found`);
        }

        // Generate data from the template
        const response = await fetchDM<DataMakerResponse>(
          "/datamaker",
          "POST",
          {
            fields: template.fields,
            quantity,
          }
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.live_data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
        };
      }
    }
  );

  server.tool("get_templates", "Get all templates", {}, async () => {
    try {
      const templates = await fetchDM<Template[]>("/templates");
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(templates, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      };
    }
  });

  server.tool("get_connections", "Get all connections", {}, async () => {
    try {
      const connections = await fetchDM<Connection[]>("/connections");
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(connections, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      };
    }
  });
}
