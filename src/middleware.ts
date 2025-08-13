import { createMiddleware } from "hono/factory";

export const jwtMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    let jwtToken = authHeader.slice(7);
    c.set("mcpContext", jwtToken);
  }
  await next();
});
