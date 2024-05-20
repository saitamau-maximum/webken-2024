import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const todo = new Hono();

todo.use(
  "*",
  cors({
    origin: "*",
  })
);

let todoList = [
  { id: "1", title: "JavaScriptを勉強する", completed: false },
  { id: "2", title: "TODOアプリを自作する", completed: false },
  { id: "3", title: "漫画を読み切る", completed: true },
  { id: "4", title: "ゲームをクリアする", completed: false },
];

todo.get(
  "/",
  (c) =>
    new Response(JSON.stringify(todoList), {
      headers: { "Content-Type": "application/json" },
    })
);

todo.put("/:id", async (c) => {
  const id = c.req.param("id");
  const todo = todoList.find((todo) => todo.id === id);
  if (!todo) {
    return new Response(JSON.stringify({ message: "not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  const param = await c.req.json();

  todo.title = param.title || todo.title;
  todo.completed =
    param.completed !== undefined ? param.completed : todo.completed;

  return new Response(null, { status: 204 });
});

const app = new Hono();

app.route("/api/todo", todo);

serve({
  fetch: app.fetch,
  port: 8000,
});
