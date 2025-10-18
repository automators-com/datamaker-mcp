import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPrompts(server: McpServer) {
  // Prompt for generating synthetic data from a template
  server.prompt(
    "generate-synthetic-data",
    "Guide for generating synthetic data using DataMaker templates",
    {
      template_name: z
        .string()
        .optional()
        .describe("Optional name of the template to use"),
      quantity: z
        .string()
        .optional()
        .describe("Optional number of records to generate"),
    },
    async ({ template_name, quantity }) => {
      const quantityText = quantity ? quantity : "10";
      const templateText = template_name
        ? `the "${template_name}" template`
        : "a template";

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I need to generate ${quantityText} records of synthetic data using ${templateText}. Can you help me:

1. First, list all available templates using the get_templates tool
2. Find the template ID for ${template_name ? `"${template_name}"` : "the template I want to use"}
3. Generate the data using the generate_from_id tool with the template ID and quantity of ${quantityText}

Please execute these steps and show me the generated data.`,
            },
          },
        ],
      };
    }
  );

  // Prompt for exporting data to an endpoint
  server.prompt(
    "export-data-workflow",
    "Guide for exporting generated data to a DataMaker endpoint",
    {
      endpoint_name: z
        .string()
        .optional()
        .describe("Optional name of the endpoint to export to"),
    },
    async ({ endpoint_name }) => {
      const endpointText = endpoint_name
        ? `the "${endpoint_name}" endpoint`
        : "an endpoint";

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I need to export data to ${endpointText}. Can you help me:

1. List all available endpoints using the get_endpoints tool
2. Find the endpoint ID for ${endpoint_name ? `"${endpoint_name}"` : "the endpoint I want"}
3. Guide me through using the export_to_endpoint tool with the correct endpoint ID and data format

Please walk me through these steps.`,
            },
          },
        ],
      };
    }
  );

  // Prompt for template management
  server.prompt(
    "template-management",
    "Guide for understanding and managing DataMaker templates",
    async () => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I want to understand and work with DataMaker templates. Can you help me:

1. Show me all available templates using the get_templates tool
2. Explain what templates are and how they work
3. Show me how to view detailed information about a specific template using get_template_by_id
4. Explain the different field types available in DataMaker templates (like Words, UUID, Number, Name, Email, etc.)

Please provide a comprehensive overview of template management.`,
            },
          },
        ],
      };
    }
  );

  // Prompt for connection management
  server.prompt(
    "connection-management",
    "Guide for managing DataMaker database connections",
    async () => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I want to manage database connections in DataMaker. Can you help me:

1. List all available connections using the get_connections tool
2. Explain how to view details of a specific connection using get_connection_by_id
3. Show me how to create a new connection using the create_connection tool
4. Explain how to update an existing connection using the update_connection tool
5. Explain how to delete a connection using the delete_connection tool

Please provide a comprehensive guide for connection management.`,
            },
          },
        ],
      };
    }
  );

  // Prompt for endpoint workflow
  server.prompt(
    "endpoint-data-workflow",
    "Guide for fetching and working with data from endpoints",
    {
      endpoint_name: z
        .string()
        .optional()
        .describe("Optional name of the endpoint to fetch from"),
    },
    async ({ endpoint_name }) => {
      const endpointText = endpoint_name
        ? `the "${endpoint_name}" endpoint`
        : "an endpoint";

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I want to fetch and work with data from ${endpointText}. Can you help me:

1. List all available endpoints using the get_endpoints tool
2. Find the endpoint ID for ${endpoint_name ? `"${endpoint_name}"` : "the endpoint I want"}
3. Fetch data from the endpoint using the fetch_from_endpoint tool
4. If the data is in a nested format, show me how to use the flatten_json tool to make it easier to work with

Please guide me through fetching and processing endpoint data.`,
            },
          },
        ],
      };
    }
  );

  // Prompt for scenario workflows
  server.prompt(
    "scenario-workflow",
    "Guide for working with DataMaker scenarios (Python code execution)",
    {
      scenario_name: z
        .string()
        .optional()
        .describe("Optional name of the scenario"),
    },
    async ({ scenario_name }) => {
      const scenarioText = scenario_name
        ? `"${scenario_name}"`
        : "a scenario";

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I want to work with DataMaker scenarios. Can you help me with ${scenarioText}:

1. List all available scenarios using the get_scenarios tool
2. ${scenario_name ? `Find the scenario ID for "${scenario_name}"` : "Show me how to find a scenario by ID"}
3. Explain how to save a new scenario using the save_scenario tool with Python code
4. Show me how to execute a scenario using the execute_scenario tool with the scenario ID and project ID

Scenarios allow you to run custom Python code for advanced data generation and transformation workflows.`,
            },
          },
        ],
      };
    }
  );

  // Prompt for getting started with DataMaker
  server.prompt(
    "getting-started",
    "Complete guide for getting started with DataMaker MCP server",
    async () => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I'm new to DataMaker and want to get started. Can you provide a comprehensive introduction that covers:

1. **What is DataMaker?** - Explain the purpose and capabilities
2. **Available Tools** - Overview of all the tools I can use:
   - Template management (get_templates, get_template_by_id, generate_from_id)
   - Connection management (get_connections, create_connection, update_connection, delete_connection)
   - Endpoint management (get_endpoints, get_endpoint_by_id, export_to_endpoint, fetch_from_endpoint)
   - Scenario management (get_scenarios, get_scenario_by_id, save_scenario, execute_scenario)
   - Utility tools (flatten_json)
3. **Common Workflows** - Show me typical use cases:
   - Generating synthetic data from a template
   - Exporting generated data to an endpoint
   - Fetching data from external sources
   - Working with scenarios for advanced data generation
4. **Best Practices** - Tips for effective use

Please provide a beginner-friendly introduction to DataMaker.`,
            },
          },
        ],
      };
    }
  );
}
