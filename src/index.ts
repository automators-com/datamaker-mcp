#!/usr/bin/env node
// Import config first to ensure environment variables are loaded
import { ENV } from "./lib/config.js";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPTransport } from "@hono/mcp";
import { Hono } from "hono";
import { HttpBindings, serve } from "@hono/node-server";
import { registerTools } from "./tools.js";
import { registerPrompts } from "./prompts.js";
import { jwtMiddleware, projectIdMiddleware } from "./middleware.js";
import { injectHonoVar } from "./helpers.js";

const PORT = ENV.PORT;
// Create server instance
const mcpServer = new McpServer({
  name: "DataMaker",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

let lastJwtToken: string | undefined;
let projectId: string | undefined;

injectHonoVar(
  mcpServer,
  () => lastJwtToken,
  () => projectId
);

// Register all tools, resources, and prompts
registerTools(mcpServer);
registerPrompts(mcpServer);

type AppVariables = {
  mcpContext?: string;
  projectId?: string;
};

const app = new Hono<{ Bindings: HttpBindings; Variables: AppVariables }>();

app.use(jwtMiddleware);
app.use(projectIdMiddleware);

app.get("/health", async (c) => {
  // check if we can access the api
  const res = await fetch(`${ENV.DATAMAKER_API_URL}/health`)
    .then((r) => r.json())
    .catch(() => false);

  return c.json({ status: "ok", api: res ? "reachable" : "unreachable" });
});

app.all("/", async (c) => {
  lastJwtToken = c.get("mcpContext");
  projectId = c.get("projectId");
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
