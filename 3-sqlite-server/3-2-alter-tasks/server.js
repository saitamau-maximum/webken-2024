import Database from "better-sqlite3";
import { Tasks } from "./queries.js";

const db = new Database("test.db");

const displayAllTasks = (title) => {
  const rows = db.prepare(Tasks.readAll).all();
  console.log(`---- ${title} ----`);
  rows.forEach((row) => {
    console.log(`${row.id}: ${row.title} (completed: ${row.completed})`);
  });
  console.log();
};

db.transaction(() => {
  // tasksテーブルが存在しない場合は作成
  db.exec(Tasks.createTable);

  // タスクを追加
  db.prepare(Tasks.create).run("SQLiteの操作に慣れる", "0");
  db.prepare(Tasks.create).run("TODOアプリを完成させる", "0");
  db.prepare(Tasks.create).run("ICPCに参加する", "0");
})();

// タスクを全て取得
displayAllTasks("初期状態");

db.transaction(() => {
  // タスクを完了にする
  db.prepare(Tasks.setCompleteStateById).run("1", 1);
  displayAllTasks("タスク1を完了にした状態");

  // タスクのタイトルを更新
  db.prepare(Tasks.updateTitleById).run("Node.jsの操作に慣れること", 1);
  displayAllTasks("タスク1のタイトルを更新した状態");

  // タスクを削除
  db.prepare(Tasks.deleteById).run(2);
  displayAllTasks("タスク2を削除した状態");
})();

db.close();
