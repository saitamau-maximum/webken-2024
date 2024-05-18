import sqlite3 from "sqlite3";
import * as queries from "./queries.js";
import fs from "fs";

const dbPath = "./test.db";

if (fs.existsSync(dbPath)) {
  console.log("test.dbが存在するので削除します...\n");

  fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database("test.db");

const displayAllTasks = (db, title) => {
  db.all(queries.Tasks.readAll, (err, rows) => {
    if (err) {
      throw err;
    }
    console.log(`---- ${title} ----`);
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
  displayAllTasks(db, "初期状態");

  // タスクを完了にする
  db.run(queries.Tasks.setCompleteStateById, "1", 1);
  displayAllTasks(db, "タスク1を完了にした状態");

  // タスクのタイトルを更新
  db.run(queries.Tasks.updateTitleById, "Node.jsの操作に慣れること", 1);
  displayAllTasks(db, "タスク1のタイトルを更新した状態");

  // タスクを削除
  db.run(queries.Tasks.deleteById, 2);
  displayAllTasks(db, "タスク2を削除した状態");

});

db.close();
