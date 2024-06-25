// サーバーからTODOリストを取得して表示する
const fetchAndDisplayTodoList = async () => {
  const response = await fetch("http://localhost:8000/api/todo");
  const todoList = await response.json();

  const todoListElement = document.getElementById("todo-list");
  todoListElement.innerHTML = "";

  todoList.forEach((todo) => {
    // チェックボックスを生成
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    // チェックボックスの状態が変更されたときに、updateTodoStatus関数を呼び出す
    checkbox.addEventListener("change", function () {
      updateTodoStatus(todo.id, this.checked);
    });

    // テキストボックスを生成
    // <input type="text" value="..." />
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = todo.title;

    // テキストボックスの値が変更されたときに、updateTodoTitle関数を呼び出す
    inputElement.addEventListener("change", function () {
      updateTodoTitle(todo.id, this.value);
    });

    // 削除ボタンを生成
    // <button>削除</button>
    const deleteButtonElement = document.createElement("button");
    deleteButtonElement.textContent = "削除";

    // 削除ボタンがクリックされたときに、deleteTodo関数を呼び出す
    deleteButtonElement.addEventListener("click", function () {
      deleteTodo(todo.id);
    });

    // <div>
    //   <input type="checkbox" />
    //   <input type="text" value="..." />
    //   <button>削除</button>
    // </div>
    const todoElement = document.createElement("div");
    todoElement.appendChild(checkbox);
    todoElement.appendChild(inputElement);
    todoElement.appendChild(deleteButtonElement);

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

  if (response.status === 200) {
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

  if (response.status === 200) {
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

    if (response.status === 200) {
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

  if (response.status === 200) {
    fetchAndDisplayTodoList();
  }
};

// ボタンが押されたときにaddTodo関数を呼び出す
const addButton = document.getElementById("add-button");
addButton.addEventListener("click", addTodo);

document.addEventListener("DOMContentLoaded", fetchAndDisplayTodoList);
