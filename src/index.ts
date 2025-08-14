#!/usr/bin/env node
import { config } from "dotenv";
config();
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPTransport } from "@hono/mcp";
import { Hono } from "hono";
import { HttpBindings, serve } from "@hono/node-server";
import { registerTools } from "./tools.js";
import { jwtMiddleware } from "./middleware.js";
import { injectHonoVar } from "./helpers.js";

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

let lastJwtToken: string | undefined;

injectHonoVar(mcpServer, () => lastJwtToken);
// Register all tools and resources
registerTools(mcpServer);

type AppVariables = {
  mcpContext?: string;
};

const app = new Hono<{ Bindings: HttpBindings; Variables: AppVariables }>();

app.use(jwtMiddleware);

app.get("/healthcheck", (c) => {
  return c.text("");
});

app.all("/", async (c) => {
  lastJwtToken = c.get("mcpContext");
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
