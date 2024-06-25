import http from "http";
import { StringDecoder } from "string_decoder";

const todoList = [
  { title: "JavaScriptを勉強する", completed: false },
  { title: "TODOアプリを自作する", completed: false },
  { title: "漫画を読み切る", completed: true },
  { title: "ゲームをクリアする", completed: false },
];

const server = http.createServer((req, res) => {
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    const headers = {
      "Content-Type": "application/json",
    };

    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, headers);
      res.end(JSON.stringify(todoList));
    } else if (req.method === "POST" && req.url === "/") {
      try {
        const data = JSON.parse(buffer);
        if (!data.title) {
          throw new Error("Title must be provided");
        }

        const newTodo = {
          title: data.title,
          completed: !!data.completed,
        };

        todoList.push(newTodo);
        res.writeHead(200, headers);
        res.end(JSON.stringify({ message: "Successfully created" }));
      } catch (err) {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ message: err.message }));
      }
    } else {
      res.writeHead(404, headers);
      res.end(JSON.stringify({ message: "Not Found" }));
    }
  });
});

server.listen(8000, () => {
  console.log("Server running on port 8000");
});
