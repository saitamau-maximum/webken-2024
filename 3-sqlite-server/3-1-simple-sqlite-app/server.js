import sqlite3 from "sqlite3";
import * as queries from "./queries.js";

const db = new sqlite3.Database("test.db");

db.serialize(() => {
  // tasksテーブルが存在しない場合は作成
  db.run(queries.Tasks.createTable);

  // タスクを追加
  db.run(queries.Tasks.create, "SQLiteの操作に慣れる", false);

  // タスクを全て取得
  db.each(queries.Tasks.readAll, (err, row) => {
    if (err) {
      throw err;
    }
    console.log(row);
  });
});

db.close();
