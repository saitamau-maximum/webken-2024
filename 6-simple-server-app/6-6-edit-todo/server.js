const { serve } = require("@hono/node-server");
const { Hono } = require("hono");

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

app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const todo = todoList.find((todo) => todo.id === id);
  if (!todo) {
    return c.json({ message: "not found" }, 404);
  }
  const param = await c.req.json();
  todo.title = param.title || todo.title;
  todo.completed = param.completed || todo.completed;
  return c.json(null, 204);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const todo = todoList.find((todo) => todo.id === id);
  if (!todo) {
    return c.json({ message: "not found" }, 404);
  }
  todoList = todoList.filter((todo) => todo.id !== id);

  return new Response(null, { status: 204 });
});

serve({
  fetch: app.fetch,
  port: 8000,
});
