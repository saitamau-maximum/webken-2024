const { serve } = require("@hono/node-server");
const { Hono } = require("hono");

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello, Hono.js!");
});

serve({
  fetch: app.fetch,
  port: 8000,
});
