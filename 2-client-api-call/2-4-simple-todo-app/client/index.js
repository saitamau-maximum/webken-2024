// サーバーからTODOリストを取得して表示する
const fetchAndDisplayTodoList = async () => {
  const response = await fetch("http://localhost:8000/api/todo");
  const todoList = await response.json();

  const todoListElement = document.getElementById("todo-list");
  todoListElement.innerHTML = "";

  todoList.forEach((todo) => {
    const todoElement = document.createElement("div");
    todoElement.innerHTML = `
      <input type="checkbox" ${
        todo.completed ? "checked" : ""
      } onchange="updateTodoStatus('${todo.id}', this.checked)">
      <input type="text" value="${todo.title}" onchange="updateTodoTitle('${
      todo.id
    }', this.value)">
      <button onclick="deleteTodo('${todo.id}')">削除</button>
    `;
    todoListElement.appendChild(todoElement);
  });
};

// サーバー上のTODOアイテムの completed を更新する
const updateTodoStatus = async (id, completed) => {
  const response = await fetch(`http://localhost:8000/api/todo/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });

  if (response.status === 204) {
    fetchAndDisplayTodoList();
  }
};

// サーバー上のTODOアイテムの title を更新する
const updateTodoTitle = async (id, title) => {
  const response = await fetch(`http://localhost:8000/api/todo/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (response.status === 204) {
    fetchAndDisplayTodoList();
  }
};

// サーバーに新しいTODOアイテムを追加する
const addTodo = async () => {
  const todoTitleInput = document.getElementById("todo-title");
  const todoTitle = todoTitleInput.value;

  if (todoTitle) {
    const response = await fetch("http://localhost:8000/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: todoTitle }),
    });

    if (response.status === 201) {
      todoTitleInput.value = "";
      fetchAndDisplayTodoList();
    }
  }
};

// サーバーからTODOアイテムを削除する
const deleteTodo = async (id) => {
  const response = await fetch(`http://localhost:8000/api/todo/${id}`, {
    method: "DELETE",
  });

  if (response.status === 204) {
    fetchAndDisplayTodoList();
  }
};

// ボタンが押されたときにaddTodo関数を呼び出す
const addButton = document.getElementById("add-button");
addButton.addEventListener("click", addTodo);

document.addEventListener("DOMContentLoaded", fetchAndDisplayTodoList);
