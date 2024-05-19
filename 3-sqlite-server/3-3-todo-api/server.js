import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import sqlite3 from "sqlite3";
import * as queries from "./queries.js";

const todo = new Hono();

todo.use(
  "*",
  cors({
    origin: "null",
  })
);

const db = new sqlite3.Database("test.db");

const migrate = () => {
  db.serialize(() => {
    db.run(queries.Tasks.createTable);
  });
}

todo.get("/", async (c) => {
  const tasks = await new Promise((resolve) => {
    db.all(queries.Tasks.readAll, (err, rows) => {
      resolve(rows);
    });
  });

  return c.json(tasks);
});

todo.post("/", async (c) => {
  const param = await c.req.json();

  await new Promise((resolve) => {
    db.run(queries.Tasks.create, param.title, param.completed || false, (err) => {
      if (err) {
      throw err;
      }
      resolve();
    });
  }).catch((err) => {
    return c.json({ message: err.message }, {  
      status: 400,  
    });  
  });

  return c.body(null, { status: 201 });
});

todo.put("/:id", async (c) => {
  const param = await c.req.json();
  const id = c.req.param("id");

  if (param.title !== undefined) {
    await new Promise((resolve) => {
      db.run(queries.Tasks.updateTitleById, param.title, id, (err) => {
        if (err) {
          throw err;
        }
        resolve();
      });
    }).catch((err) => {
      return c.json({ message: err.message }, {  
        status: 400,  
      });
    });
  }

  if (param.completed !== undefined) {
    await new Promise((resolve) => {
      db.run(queries.Tasks.setCompleteStateById, param.completed ? "1" : "0", id, (err) => {
        if (err) {
          throw err;
        }
        resolve();
      });
    }).catch((err) => {
      return c.json({ message: err.message }, {  
        status: 400,  
      });
    });
  }

  return c.body(null, { status: 204 });
});

todo.delete("/:id", async (c) => {
  const id = c.req.param("id");

  await new Promise((resolve) => {
    db.run(queries.Tasks.deleteById, id, (err) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  }).catch((err) => {
    return c.json({ message: err.message }, {  
      status: 400,  
    });
  });

  return c.body(null, { status: 204 });
});

const app = new Hono();

app.route("/api/todo", todo);

migrate();

serve({
  fetch: app.fetch,
  port: 8000,
});
