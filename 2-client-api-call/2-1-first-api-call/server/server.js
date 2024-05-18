import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "null",
  })
);

app.get("/", (c) => {
  return c.text("Hello from Node.js server!");
});

serve({
  fetch: app.fetch,
  port: 8000,
});
