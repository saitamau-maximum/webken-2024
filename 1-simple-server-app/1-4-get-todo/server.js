port { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

let todoList = [
  { id: "1", title: "JavaScriptを勉強する", completed: false },
  { id: "2", title: "TODOアプリを自作する", completed: false },
  { id: "3", title: "漫画を読み切る", completed: true },
  { id: "4", title: "ゲームをクリアする", completed: false },
];

app.get("/", (c) => c.json(todoList));

app.post("/", async (c) => {
  const param = await c.req.json();
  const newTodo = {
    id: String(todoList.length + 1),
    completed: false,
    title: param.title,
  };
  todoList = [...todoList, newTodo];

  return c.json(newTodo, 201);
});

serve({
  fetch: app.fetch,
  port: 8000,
});
