import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

let todoList = [
  { id: "1", title: "JavaScriptを勉強する", completed: false },
  { id: "2", title: "TODOアプリを自作する", completed: false },
  { id: "3", title: "漫画を読み切る", completed: true },
  { id: "4", title: "ゲームをクリアする", completed: false },
];

let currentId = 1;

app.get("/", (c) => c.json(todoList, 200));

app.post("/", async (c) => {
  const param = await c.req.json();

  if (!param.title) {
    throw new Error("Title must be provided");
  }
  
  const newTodo = {
    id: String(currentId++),
    completed: param.completed ? 1 : 0,
    title: param.title,
  };
  todoList = [...todoList, newTodo];

  return c.json({ message: "Successfully created" }, 200);
});

app.onError((err, c) => {
  return c.json({ message: err.message }, 400);
});

serve({
  fetch: app.fetch,
  port: 8000,
});
