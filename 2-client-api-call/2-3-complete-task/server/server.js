import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors({ origin: "*" }));

let todoList = [
  { id: "1", title: "JavaScriptを勉強する", completed: false },
  { id: "2", title: "TODOアプリを自作する", completed: false },
  { id: "3", title: "漫画を読み切る", completed: true },
  { id: "4", title: "ゲームをクリアする", completed: false },
];

app.get("/api/todo/", (c) => c.json(todoList, 200));

app.put("/api/todo/:id", async (c) => {
  const param = await c.req.json();
  const id = c.req.param("id");

  if (!param.title && param.completed === undefined) {
    throw new Error("Either title or completed must be provided");
  }

  if (!param.title) {
    const todo = todoList.find((todo) => todo.id === id);
    if (!todo) {
      throw new Error("Failed to update task title");
    }
    todo.title = param.title;
  }

  if (param.completed !== undefined) {
    const todo = todoList.find((todo) => todo.id === id);
    if (!todo) {
      throw new Error("Failed to update task completion state");
    }
    todo.completed = param.completed;
  }

  return c.json({ message: "Task updated" }, 200);
});

app.onError((err, c) => {
  return c.json({ message: err.message }, 400);
});

serve({
  fetch: app.fetch,
  port: 8000,
});
