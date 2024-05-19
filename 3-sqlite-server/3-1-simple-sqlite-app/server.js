import Database from "better-sqlite3";

const db = new Database("test.db");

// テーブル作成するSQL
const createTable = `
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL
);
`;

// タスクを追加するSQL
const createTask = `INSERT INTO tasks (title, completed) VALUES (?, ?);`;

// タスクを全て取得するSQL
const readAllTasks = `SELECT * FROM tasks;`;

// tasksテーブルが存在しない場合は作成
db.prepare(createTable).run();

// タスクを追加
db.prepare(createTask).run("SQLiteの操作に慣れる", "0");

// タスクを全て取得
const tasks = db.prepare(readAllTasks).all();

console.log(tasks);

db.close();
