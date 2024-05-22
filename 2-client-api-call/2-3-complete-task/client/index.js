// サーバーからTODOリストを取得して表示する
const fetchAndDisplayTodoList = async () => {
  const response = await fetch("http://localhost:8000/api/todo");
  const todoList = await response.json();

  const todoListElement = document.getElementById("todo-list");
  todoListElement.innerHTML = "";

  todoList.forEach((todo) => {
    // inputタグを生成
    // <input />
    const checkboxElement = document.createElement("input");
    // <input type="checkbox" />
    checkboxElement.type = "checkbox";
    // <input type="checkbox" checked />
    checkboxElement.checked = todo.completed;

    // inputタグの状態が変更されたときに、updateTodoStatus関数を呼び出す
    checkboxElement.addEventListener("change", function () {
      updateTodoStatus(todo.id, this.checked);
    });

    // spanタグを生成
    // <span></span>
    const span = document.createElement("span");
    // <span>...</span>
    span.textContent = todo.title;

    // divタグを生成
    // <div></div>
    const todoElement = document.createElement("div");

    // divタグの子要素として、作成したinputタグとspanタグを追加
    // <span>
    //   <input type="checkbox" checked />
    //   <span>...</span>
    // </span>
    todoElement.appendChild(checkboxElement);
    todoElement.appendChild(span);

    // idが"todo-list"のdivタグの子要素として、上で作成したdivタグを追加
    // <div id=""todo-list">
    //   <div>
    //     <input type="checkbox" checked />
    //     <span>...</span>
    //   </div>
    // </div>
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

document.addEventListener("DOMContentLoaded", fetchAndDisplayTodoList);
