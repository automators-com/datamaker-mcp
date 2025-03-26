#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { registerTools } from "./tools.js";
import { registerResources } from "./resources.js";

// Create server instance
const server = new McpServer({
  name: "DataMaker",
  version: "1.0.0",
  capabilities: {
    resources: {
      "datamaker://templates": {
        description: "Get all templates",
      },
      "datamaker://templates/{template_id}": {
        description: "Get a template by ID",
        parameters: {
          template_id: z.string().describe("Template ID"),
        },
      },
      "datamaker://connections": {
        description: "Get all connections",
      },
      "datamaker://connections/{connection_id}": {
        description: "Get a connection by ID",
        parameters: {
          connection_id: z.string().describe("Connection ID"),
        },
      },
    },
    tools: {},
  },
});

// Register all tools and resources
registerTools(server);
registerResources(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
