import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

const todoList = [
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

  todoList.push(newTodo);

  return c.json({ message: "Successfully created" }, 200);
});

app.put("/:id", async (c) => {
  const param = await c.req.json();
  const id = c.req.param("id");

  if (!param.title && param.completed === undefined) {
    throw new Error("Either title or completed must be provided");
  }

  const todo = todoList.find((todo) => todo.id === id);
  if (!todo) {
    throw new Error("Failed to update task title");
  }
  
  if (!param.title) {
    todo.title = param.title;
  }

  if (param.completed !== undefined) {
    todo.completed = param.completed;
  }

  return c.json({ message: "Task updated" }, 200);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const todo = todoList.find((todo) => todo.id === id);
  if (!todo) {
    throw new Error("Failed to delete task");
  }
  todoList = todoList.filter((todo) => todo.id !== id);

  return c.json({ message: "Task deleted" }, 200);
});

app.onError((err, c) => {
  return c.json({ message: err.message }, 400);
});

serve({
  fetch: app.fetch,
  port: 8000,
});
