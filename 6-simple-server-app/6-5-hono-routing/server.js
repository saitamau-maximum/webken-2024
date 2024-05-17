const { serve } = require("@hono/node-server");
const { Hono } = require("hono");

const todo = new Hono();

const todoList = [
  { id: "1", title: "JavaScriptを勉強する", completed: false },
  { id: "2", title: "TODOアプリを自作する", completed: false },
  { id: "3", title: "漫画を読み切る", completed: true },
  { id: "4", title: "ゲームをクリアする", completed: false },
];

// GET /
todo.get("/", (c) => c.json(todoList, 200));

// GET /:id
todo.get("/:id", (c) => c.json("入力されたID: " + c.req.param("id"), 200));

// パス名には正規表現を使うことができる
// https://hono.dev/api/routing
todo.get('/:date{[0-9]+}/:title{[a-z]+}', (c) => {
  const { date, title } = c.req.param()
  return c.json({ date, title }, 200)
});

const app = new Hono();

// todo.getのURLの前に、/api/todoを挿入
// これによって、 /api/todo と /api/todo/:id でアクセスできるようになる
app.route("/api/todo", todo);

app.get("/", (c) => c.text("TODOアプリへようこそ"));

serve({
  fetch: app.fetch,
  port: 8000,
});
