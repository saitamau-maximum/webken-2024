import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

const todoList = [
  { title: "JavaScriptを勉強する", completed: false },
  { title: "TODOアプリを自作する", completed: false },
  { title: "漫画を読み切る", completed: true },
  { title: "ゲームをクリアする", completed: false },
];

// GET /
app.get("/todo/", (c) => c.json(todoList, 200));

// GET /:id
app.get("/todo/:id", (c) => c.json("入力されたID: " + c.req.param("id"), 200));

serve({
  fetch: app.fetch,
  port: 8000,
});
