import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello, Hono.js!");
});

serve({
  fetch: app.fetch,
  port: 8000,
});
