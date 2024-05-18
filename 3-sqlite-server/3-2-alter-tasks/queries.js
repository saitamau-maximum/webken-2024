export const Tasks = {
  createTable: `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN NOT NULL
    );
  `,
  create: `INSERT INTO tasks (title, completed) VALUES (?, ?);`,
  readAll: `SELECT * FROM tasks;`,
  setCompleteStateById: `UPDATE tasks SET completed = ? WHERE id = ?;`,
};
