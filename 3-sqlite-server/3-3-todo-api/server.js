import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import Database from "better-sqlite3";
import { Tasks } from "./queries.js";

const todo = new Hono();

todo.use(
  "*",
  cors({
    origin: "null",
  })
);

const db = new Database("test.db");

const migrate = () => {
  db.exec(Tasks.createTable);
};

const readAllStmt = db.prepare(Tasks.readAll);
const insertStmt = db.prepare(Tasks.create);
const updateTitleStmt = db.prepare(Tasks.updateTitleById);
const setCompleteStateStmt = db.prepare(Tasks.setCompleteStateById);
const deleteStmt = db.prepare(Tasks.deleteById);

todo.get("/", async (c) => {
  const tasks = await readAllStmt.all();
  return c.json(tasks);
});

todo.post("/", async (c) => {
  const param = await c.req.json();
  const insertResult = insertStmt.run(param.title, param.completed ? "1" : "0");

  if (insertResult.changes === 0) {
    throw new Error("Failed to create task");
  }

  return c.body({ message: "Successfully created" }, 200);
});

todo.put("/:id", async (c) => {
  const param = await c.req.json();
  const id = c.req.param("id");

  if (!param.title && !param.completed) {
    throw new Error("Either title or completed must be provided");
  }

  if (param.title) {
    const updateTitleResult = updateTitleStmt.run(param.title, id);

    if (updateTitleResult.changes === 0) {
      throw new Error("Failed to update task title");
    }
  }

  if (param.completed) {
    const setCompleteStateResult = setCompleteStateStmt.run(
      param.completed ? "1" : "0",
      id
    );

    if (setCompleteStateResult.changes === 0) {
      throw new Error("Failed to update task completion state");
    }
  }

  return c.body({ message: "Task updated" }, 200);
});

todo.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const deleteResult = deleteStmt.run(id);

  if (deleteResult.changes === 0) {
    throw new Error("Failed to delete task");
  }

  return c.body({ message: "Task deleted" }, 200);
});

// error handling
todo.onError((err, c) => {
  return c.json({ message: err.message }, 400);
});

const app = new Hono();

app.route("/api/todo", todo);

migrate();

serve({
  fetch: app.fetch,
  port: 8000,
});
