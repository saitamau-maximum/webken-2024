import Database from "better-sqlite3";
import * as queries from "./queries.js";
import fs from "fs";

const dbPath = "./test.db";

if (fs.existsSync(dbPath)) {
  console.log("test.dbが存在するので削除します...\n");

  fs.unlinkSync(dbPath);
}

const db = new Database("test.db");

const displayAllTasks = (db, title) => {
  const rows = db.prepare(queries.Tasks.readAll).all();
  console.log(`---- ${title} ----`);
  rows.forEach((row) => {
    console.log(`${row.id}: ${row.title} (completed: ${row.completed})`);
  });
  console.log();
};

db.transaction(() => {
  // tasksテーブルが存在しない場合は作成
  db.exec(queries.Tasks.createTable);

  // タスクを追加
  db.prepare(queries.Tasks.create).run("SQLiteの操作に慣れる", "0");
  db.prepare(queries.Tasks.create).run("TODOアプリを完成させる", "0");
  db.prepare(queries.Tasks.create).run("ICPCに参加する", "0");
})();

// タスクを全て取得
displayAllTasks(db, "初期状態");

db.transaction(() => {
  // タスクを完了にする
  db.prepare(queries.Tasks.setCompleteStateById).run("1", 1);
  displayAllTasks(db, "タスク1を完了にした状態");

  // タスクのタイトルを更新
  db.prepare(queries.Tasks.updateTitleById).run("Node.jsの操作に慣れること", 1);
  displayAllTasks(db, "タスク1のタイトルを更新した状態");

  // タスクを削除
  db.prepare(queries.Tasks.deleteById).run(2);
  displayAllTasks(db, "タスク2を削除した状態");
})();

db.close();
