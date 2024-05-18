// サーバーからTODOリストを取得して表示する
async function fetchTodoList() {
  const response = await fetch("http://localhost:8000/api/todo");
  const todoList = await response.json();

  const todoListElement = document.getElementById("todoList");
  todoListElement.innerHTML = "";

  todoList.forEach((todo) => {
    const todoElement = document.createElement("div");
    todoElement.innerHTML = `
      <input type="checkbox" ${
        todo.completed ? "checked" : ""
      } onchange="updateTodoStatus('${todo.id}', this.checked)">
      <span>${todo.title}</span>
    `;
    todoListElement.appendChild(todoElement);
  });
}

// サーバー上のTODOアイテムの completed を更新する
async function updateTodoStatus(id, completed) {
  const response = await fetch(`http://localhost:8000/api/todo/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });

  if (response.status === 204) {
    fetchTodoList();
  }
}

document.addEventListener("DOMContentLoaded", fetchTodoList);
