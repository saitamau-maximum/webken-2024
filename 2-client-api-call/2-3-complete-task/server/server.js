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

todo.get("/", (c) => c.json(todoList, 200));

todo.put("/:id", async (c) => {
  const param = await c.req.json();
  const id = c.req.param("id");

  if (!param.title && !param.completed) {
    throw new Error("Either title or completed must be provided");
  }

  if (param.title) {
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

todo.onError((err, c) => {
  return c.json({ message: err.message }, 400);
});

const app = new Hono();

app.route("/api/todo", todo);

serve({
  fetch: app.fetch,
  port: 8000,
});
