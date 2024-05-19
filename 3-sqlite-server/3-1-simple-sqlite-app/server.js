import sqlite3 from "sqlite3";

const db = new sqlite3.Database("test.db");

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

db.serialize(() => {
  // tasksテーブルが存在しない場合は作成
  db.run(createTable);

  // タスクを追加
  db.run(createTask, "SQLiteの操作に慣れる", false);

  // タスクを全て取得
  db.each(readAllTasks, (err, row) => {
    if (err) {
      throw err;
    }
    console.log(row);
  });
});

db.close();
