import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Template, DataMakerResponse, Connection, Endpoint } from "./types.js";
import { fetchAPI } from "./helpers.js";
import { DataMakerFieldsSchema } from "./fieldSchema.js";

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
    async ({ template_id, quantity }, context) => {
      const ctx = context as any;
      try {
        // Get all templates
        const templates = await fetchAPI<Template[]>(
          "/templates",
          "GET",
          undefined,
          ctx?.jwtToken
        );

        // Find the template with the given id
        const template = templates.find((t) => t.id === template_id);
        if (!template) {
          throw new Error(`Template with id ${template_id} not found`);
        }

        // Generate data from the template
        const response = await fetchAPI<DataMakerResponse>(
          "/datamaker",
          "POST",
          {
            fields: template.fields,
            quantity,
          },
          ctx?.jwtToken
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

  server.tool("get_templates", "Get all templates", {}, async ({}, context) => {
    const ctx = context as any;
    try {
      const templates = await fetchAPI<Template[]>(
        "/templates",
        "GET",
        undefined,
        ctx?.jwtToken
      );
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

  server.tool(
    "get_connections",
    "Get all connections",
    {},
    async ({}, context) => {
      const ctx = context as any;
      try {
        const connections = await fetchAPI<Connection[]>(
          "/connections",
          "GET",
          undefined,
          ctx?.jwtToken
        );
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
    }
  );

  server.tool("get_endpoints", "Get all endpoints", {}, async ({}, context) => {
    const ctx = context as any;
    try {
      const endpoints = await fetchAPI<Endpoint[]>(
        "/endpoints",
        "GET",
        undefined,
        ctx?.jwtToken
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(endpoints, null, 2),
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

  server.tool(
    "export_to_endpoint",
    "Export data to an endpoint",
    {
      endpoint_id: z.string().describe("A valid datamaker endpoint id"),
      data: z.any().describe("The data to export"),
    },
    async ({ endpoint_id, data }, context) => {
      const ctx = context as any;
      try {
        // get the endpoint info
        const endpoint = await fetchAPI<Endpoint>(
          `/endpoints/${endpoint_id}`,
          "GET",
          undefined,
          ctx?.jwtToken
        );

        // export the data
        const response = await fetch(endpoint.url, {
          method: endpoint.method as "GET" | "POST" | "PUT" | "DELETE",
          headers: endpoint.headers,
          body: JSON.stringify(data),
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
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

  server.tool(
    "fetch_from_endpoint",
    "Fetch data from one of the user defined endpoints from datamaker.",
    {
      endpoint_id: z.string().describe("A valid endpoint id"),
    },
    async ({ endpoint_id }, context) => {
      const ctx = context as any;
      try {
        const endpoint = await fetchAPI<Endpoint>(
          `/endpoints/${endpoint_id}`,
          "GET",
          undefined,
          ctx?.jwtToken
        );

        const response = await fetch(endpoint.url, {
          method: endpoint.method as "GET" | "POST" | "PUT" | "DELETE",
          headers: endpoint.headers,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.json(), null, 2),
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

  // server.tool(
  //   "generate_from_template",
  //   "Generate data from a datamaker template.",
  //   {
  //     fields: DataMakerFieldsSchema.describe(
  //       "Fields for the datamaker template"
  //     ),
  //     quantity: z
  //       .number()
  //       .default(10)
  //       .describe("Number of records to generate"),
  //   },
  //   async ({ fields, quantity }, context) => {
  //   const ctx = context as any;
  //     try {
  //       const response = await fetchAPI<DataMakerResponse>(
  //         "/datamaker",
  //         "POST",
  //         { fields, quantity },
  //          ctx?.jwtToken
  //       );
  //       return {
  //         content: [
  //           {
  //             type: "text",
  //             text: JSON.stringify(response.live_data ?? response, null, 2),
  //           },
  //         ],
  //       };
  //     } catch (error) {
  //       return {
  //         content: [
  //           {
  //             type: "text",
  //             text: `Error: ${
  //               error instanceof Error ? error.message : "Unknown error"
  //             }`,
  //           },
  //         ],
  //       };
  //     }
  //   }
  // );

  server.tool(
    "flatten_json",
    "Flatten a nested JSON object so that nested keys are joined by dots (e.g., {user: {name: 'John Doe'}} becomes {'user.name': 'John Doe'}).",
    {
      data: z.any().describe("The nested JSON object to flatten"),
    },
    async ({ data }) => {
      function flatten(
        obj: Record<string, any>,
        prefix = "",
        res: Record<string, any> = {}
      ): Record<string, any> {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (
              typeof value === "object" &&
              value !== null &&
              !Array.isArray(value)
            ) {
              flatten(value, newKey, res);
            } else {
              res[newKey] = value;
            }
          }
        }
        return res;
      }
      try {
        const flattened = flatten(data);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(flattened, null, 2),
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
}
