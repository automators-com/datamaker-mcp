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
    resources: {},
    tools: {},
  },
});

// Register all tools and resources
registerTools(server);
// TODO: Resources are not something that is used as yet
// registerResources(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
