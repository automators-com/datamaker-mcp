import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Template, DataMakerResponse, Connection, Endpoint, Scenario } from "./types.js";
import {
  fetchAPI,
  storeToS3AndSummarize,
  isSapEndpoint,
  parseResponseData,
  countTokens,
  convertToObjectArray,
} from "./helpers.js";
import { config } from "dotenv";
import { RESPONSE_TOKEN_THRESHOLD } from "./lib/config.js";

config();
const tokenThreshold = RESPONSE_TOKEN_THRESHOLD;

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

        // Filter to ensure inactive fields are not returned
        const activeFields = template.fields.filter(
          (field: any) => field.active === undefined || field.active === true
        );

        // Generate data from the template
        const response = await fetchAPI<DataMakerResponse>(
          "/datamaker",
          "POST",
          {
            fields: activeFields,
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

  server.tool(
    "get_templates",
    "Get all templates",
    {
      projectId: z.string().optional().describe("A valid datamaker project id"),
    },
    async ({ projectId }, context) => {
      const ctx = context as any;
      try {
        const queryParams = projectId ? `?projectId=${projectId}` : "";
        const templates = await fetchAPI<Template[]>(
          `/templates${queryParams}`,
          "GET",
          undefined,
          ctx?.jwtToken
        );

        const tokens = countTokens(JSON.stringify(templates, null, 2));

        if (tokens > tokenThreshold) {
          const result = await storeToS3AndSummarize(templates, "templates");
          return {
            content: [
              {
                type: "text",
                text: `Available templates (${result.totalCount} templates) are too large to show. Showing first ${result.summary.length} templates:\n\n${JSON.stringify(result.summary, null, 2)}\n\nFull dataset stored to S3\n🔗 **View all templates in a link that opens in a new tab: ${result.viewUrl}\n\nThis link expires in 24 hours.`,
              },
            ],
          };
        }

        const simplifiedTemplateObjects = templates.map((template) => ({
          id: template.id,
          name: template.name,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(simplifiedTemplateObjects, null, 2),
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
    "get_template_by_id",
    "Get a template by id",
    {
      template_id: z.string().describe("A valid datamaker template id"),
    },
    async ({ template_id }, context) => {
      const ctx = context as any;
      try {
        const template = await fetchAPI<Template>(
          `/templates/${template_id}`,
          "GET",
          undefined,
          ctx?.jwtToken
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(template, null, 2),
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

        const simplifiedConnectionObjects = connections.map((connection) => ({
          id: connection.id,
          name: connection.name,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(simplifiedConnectionObjects, null, 2),
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
    "delete_connection",
    "Delete a connection by id",
    {
      connection_id: z.string().describe("A valid datamaker connection id"),
    },
    async ({ connection_id }, context) => {
      const ctx = context as any;
      try {
        const response = await fetchAPI<{ message: string }>(
          `/connections/${connection_id}`,
          "DELETE",
          undefined,
          ctx?.jwtToken
        );

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
    "create_connection",
    "Create a new connection",
    {
      name: z.string().describe("Name of the connection"),
      connectionString: z
        .string()
        .describe("Connection string for the database"),
      type: z
        .string()
        .describe(
          "Type of the connection (e.g., 'postgresql', 'mysql', 'mongodb')"
        ),
    },
    async ({ name, connectionString, type }, context) => {
      const ctx = context as any;
      try {
        const connection = await fetchAPI<Connection>(
          "/connections",
          "POST",
          {
            name,
            connectionString,
            type,
          },
          ctx?.jwtToken
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(connection, null, 2),
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
    "update_connection",
    "Update a connection by id",
    {
      connection_id: z.string().describe("A valid datamaker connection id"),
      name: z.string().optional().describe("Name of the connection"),
      connectionString: z
        .string()
        .optional()
        .describe("Connection string for the database"),
      type: z
        .string()
        .optional()
        .describe(
          "Type of the connection (e.g., 'postgresql', 'mysql', 'mongodb')"
        ),
    },
    async ({ connection_id, name, connectionString, type }, context) => {
      const ctx = context as any;
      try {
        // Build update data object with only provided fields
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (connectionString !== undefined)
          updateData.connectionString = connectionString;
        if (type !== undefined) updateData.type = type;

        const connection = await fetchAPI<Connection>(
          `/connections/${connection_id}`,
          "PUT",
          updateData,
          ctx?.jwtToken
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(connection, null, 2),
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
    "get_connection_by_id",
    "Get a connection by id",
    {
      connection_id: z.string().describe("A valid datamaker connection id"),
    },
    async ({ connection_id }, context) => {
      const ctx = context as any;
      try {
        const connection = await fetchAPI<Connection>(
          `/connections/${connection_id}`,
          "GET",
          undefined,
          ctx?.jwtToken
        );

        const simplifiedConnectionObject = {
          id: connection.id,
          name: connection.name,
          conectionString: connection.connectionString,
          type: connection.type,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(simplifiedConnectionObject, null, 2),
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
      const tokens = countTokens(JSON.stringify(endpoints, null, 2));

      if (tokens > tokenThreshold) {
        const result = await storeToS3AndSummarize(endpoints, "endpoints");
        return {
          content: [
            {
              type: "text",
              text: `Available endpoints (${result.totalCount} endpoints) are too large to show. Showing first ${result.summary.length} endpoints:\n\n${JSON.stringify(result.summary, null, 2)}\n\nFull dataset stored to S3\n🔗 **View all endpoints in a link that opens in a new tab: ${result.viewUrl}\n\nThis link expires in 24 hours.`,
            },
          ],
        };
      }

      const simplifiedEndpointObjects = endpoints.map((endpoint) => ({
        id: endpoint.id,
        name: endpoint.name,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(simplifiedEndpointObjects, null, 2),
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
    "get_endpoint_by_id",
    "Get an endpoint by id",
    {
      endpoint_id: z.string().describe("A valid datamaker endpoint id"),
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

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(endpoint, null, 2),
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

        // Check if this is a SAP endpoint and return early error
        if (isSapEndpoint(endpoint.url)) {
          return {
            content: [
              {
                type: "text",
                text: "Error: This tool was incorrectly used for a SAP endpoint. Please use the appropriate tool for SAP endpoints instead.",
              },
            ],
          };
        }

        // Handle non-SAP endpoints
        const response = await fetch(endpoint.url, {
          method: endpoint.method as "GET" | "POST" | "PUT" | "DELETE",
          headers: endpoint.headers,
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, response: ${errorText}`
          );
        }

        const responseData = await parseResponseData(response);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(responseData, null, 2),
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
      filter: z
        .any()
        .optional()
        .describe(
          "Filter object with field names as keys and objects with value and operator properties"
        ),
    },
    async ({ endpoint_id, filter }, context) => {
      const ctx = context as any;
      try {
        const endpoint = await fetchAPI<Endpoint>(
          `/endpoints/${endpoint_id}`,
          "GET",
          undefined,
          ctx?.jwtToken
        );

        // Check if this is a SAP endpoint and return early error
        if (isSapEndpoint(endpoint?.url)) {
          return {
            content: [
              {
                type: "text",
                text: "Error: This tool was incorrectly used for a SAP endpoint. Please use the appropriate tool for SAP endpoints instead.",
              },
            ],
          };
        }

        // Handle non-SAP endpoints
        const response = await fetch(endpoint.url, {
          method: endpoint.method as "GET" | "POST" | "PUT" | "DELETE",
          headers: endpoint.headers,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, response: ${errorText}`
          );
        }

        const responseData = await parseResponseData(response);
        const tokens = countTokens(JSON.stringify(responseData, null, 2));

        if (tokens > tokenThreshold) {
          // Convert the response data to an array of objects for S3 storage
          const objectArray = convertToObjectArray(responseData);
          const result = await storeToS3AndSummarize(
            objectArray,
            "endpoint-responses"
          );
          return {
            content: [
              {
                type: "text",
                text: `Response data (${result.totalCount} items) is too large to show. Showing first ${result.summary.length} items:\n\n${JSON.stringify(result.summary, null, 2)}\n\nFull dataset stored to S3\n🔗 **View all data in a link that opens in a new tab: ${result.viewUrl}\n\nThis link expires in 24 hours.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(responseData, null, 2),
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

server.tool(
    "save_scenario",
    "Save Datamaker scenario into database",
    {
      code: z.string().describe("Python code for the scenario"),
      name: z.string().describe("Name of the scenario")      
    },
    async ({ code, name }, context) => {
      const ctx = context as any;
      try {
        const scenario = await fetchAPI<Promise<Scenario>>(
          `/scenarios/save`,
          "POST",
          { code, name },
          ctx?.jwtToken
        );       

        if (!scenario) {
          throw new Error(
            "Failed to save scenario."
          );
        };
       
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(scenario, null, 2),
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
    "execute_scenario",
    "Execute a Datamaker scenario",
    {
      scenarioId: z.string().describe("A valid datamaker scenario id"),
    },
    async ({ scenarioId }, context) => {
      const ctx = context as any;
      try {
        const response = await fetchAPI<any>(
          `/scenarios/execute`,
          "POST",
          { scenarioId },
          ctx?.jwtToken
        );

        console.log("response", response);

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
    "get_scenario_by_id",
    "Get a scenario by id",
    {
      scenarioId: z.string().describe("A valid datamaker scenario id"),
    },
    async ({ scenarioId }, context) => {
      const ctx = context as any;
      try {
        const scenario = await fetchAPI<Scenario>(
          `/scenarios/${scenarioId}`,
          "GET",
          undefined,
          ctx?.jwtToken
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(scenario, null, 2),
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
    "get_scenarios",
    "Get all scenarios",
    {},
    async ({}, context) => {
      const ctx = context as any;
      try {
        const scenarios = await fetchAPI<Scenario[]>(
          "/scenarios",
          "GET",
          undefined,
          ctx?.jwtToken
        );

        const tokens = countTokens(JSON.stringify(scenarios, null, 2));

        if (tokens > tokenThreshold) {
          const result = await storeToS3AndSummarize(scenarios, "scenarios");
          return {
            content: [
              {
                type: "text",
                text: `Available scenarios (${result.totalCount} scenarios) are too large to show. Showing first ${result.summary.length} scenarios:\n\n${JSON.stringify(result.summary, null, 2)}\n\nFull dataset stored to S3\n🔗 **View all scenarios in a link that opens in a new tab: ${result.viewUrl}\n\nThis link expires in 24 hours.`,
              },
            ],
          };
        }

        const simplifiedScenarioObjects = scenarios.map((scenario) => ({
          id: scenario.id,
          name: scenario.name,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(simplifiedScenarioObjects, null, 2),
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
