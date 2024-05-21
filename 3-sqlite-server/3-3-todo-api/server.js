import { serve } from "@hono/node-server";
import { Hono } from "hono";
import Database from "better-sqlite3";
import { TaskQuery } from "./queries.js";

const todo = new Hono();

const db = new Database("test.db");

db.exec(TaskQuery.createTable);

const readAllStmt = db.prepare(TaskQuery.readAll);
const insertStmt = db.prepare(TaskQuery.create);
const updateTitleStmt = db.prepare(TaskQuery.updateTitleById);
const setCompleteStateStmt = db.prepare(TaskQuery.setCompleteStateById);
const deleteStmt = db.prepare(TaskQuery.deleteById);

todo.get("/", (c) => {
  const tasks = readAllStmt.all();
  return c.json(tasks, 200);
});

todo.post("/", async (c) => {
  const param = await c.req.json();
  if (!param.title) {
    throw new Error("Title must be provided");
  }

  const insertResult = insertStmt.run(param.title, param.completed ? 1 : 0);

  if (insertResult.changes === 0) {
    throw new Error("Failed to create task");
  }

  return c.json({ message: "Successfully created" }, 200);
});

todo.put("/:id", async (c) => {
  const param = await c.req.json();
  const id = c.req.param("id");

  if (!param.title && param.completed === undefined) {
    throw new Error("Either title or completed must be provided");
  }

  if (!param.title) {
    const updateTitleResult = updateTitleStmt.run(param.title, id);

    if (updateTitleResult.changes === 0) {
      throw new Error("Failed to update task title");
    }
  }

  if (param.completed !== undefined) {
    const setCompleteStateResult = setCompleteStateStmt.run(
      param.completed ? 1 : 0,
      id
    );

    if (setCompleteStateResult.changes === 0) {
      throw new Error("Failed to update task completion state");
    }
  }

  return c.json({ message: "Task updated" }, 200);
});

todo.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const deleteResult = deleteStmt.run(id);

  if (deleteResult.changes === 0) {
    throw new Error("Failed to delete task");
  }

  return c.json({ message: "Task deleted" }, 200);
});

// error handling
todo.onError((err, c) => {
  return c.json({ message: err.message }, 400);
});

const app = new Hono();

app.route("/api/todo", todo);

serve({
  fetch: app.fetch,
  port: 8000,
});
