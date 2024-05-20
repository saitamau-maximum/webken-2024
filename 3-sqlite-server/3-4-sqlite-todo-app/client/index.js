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
      <input type="text" class="task-textbox" value="${todo.title}" onchange="updateTodoTitle('${
      todo.id
    }', this.value)">
      <button class="delete-button" onclick="deleteTodo('${todo.id}')">削除</button>
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

  if (response.status === 200) {
    fetchTodoList();
  }
}

// サーバー上のTODOアイテムの title を更新する
async function updateTodoTitle(id, title) {
  const response = await fetch(`http://localhost:8000/api/todo/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (response.status === 200) {
    fetchTodoList();
  }
}

// サーバーに新しいTODOアイテムを追加する
async function addTodo() {
  const todoTitleInput = document.getElementById("todoTitle");
  const todoTitle = todoTitleInput.value;

  if (todoTitle) {
    const response = await fetch("http://localhost:8000/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: todoTitle }),
    });

    if (response.status === 200) {
      todoTitleInput.value = "";
      fetchTodoList();
    }
  }
}

// サーバーからTODOアイテムを削除する
async function deleteTodo(id) {
  const response = await fetch(`http://localhost:8000/api/todo/${id}`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    fetchTodoList();
  }
}

// フォームが送信されたときにaddTodo関数を呼び出す
const addTodoForm = document.getElementById("addTodoForm");
addTodoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addTodo();
});

document.addEventListener("DOMContentLoaded", fetchTodoList);
