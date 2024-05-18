import sqlite3 from "sqlite3";
import * as queries from "./queries.js";

const db = new sqlite3.Database("test.db");

const displayAllTasks = (db) => {
  db.all(queries.Tasks.readAll, (err, rows) => {
    if (err) {
      throw err;
    }
    console.log("---- Tasks ----");
    rows.forEach((row) => {
      console.log(`${row.id}: ${row.title} (completed: ${row.completed})`);
    });
    console.log();
  });
};

db.serialize(() => {
  // tasksテーブルが存在しない場合は作成
  db.run(queries.Tasks.createTable);

  // タスクを追加
  db.run(queries.Tasks.create, "SQLiteの操作に慣れる", false);
  db.run(queries.Tasks.create, "TODOアプリを完成させる", false);
  db.run(queries.Tasks.create, "ICPCに参加する", false);

  // タスクを全て取得
  displayAllTasks(db);

  // タスクを完了にする
  db.run(queries.Tasks.setCompleteStateById, "1", 1);

  // タスクを全て取得
  displayAllTasks(db);
});

db.close();
