#!/usr/bin/env node
import { config } from "dotenv";
config();
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPTransport } from "@hono/mcp";
import { Hono } from "hono";
import { HttpBindings, serve } from "@hono/node-server";

import { registerTools } from "./tools.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8001;
// Create server instance
const mcpServer = new McpServer({
  name: "DataMaker",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register all tools and resources
registerTools(mcpServer);

const app = new Hono<{ Bindings: HttpBindings }>();

app.all("/", async (c) => {
  const transport = new StreamableHTTPTransport();
  await mcpServer.connect(transport);
  return transport.handleRequest(c);
});

const server = serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`MCP server is running on http://localhost:${PORT}`);

// Graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});