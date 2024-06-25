# 3-sqlite-server

## 3-3-todo-api

### 実行環境

`3-3-todo-api` に `cd` した上で、以下のコマンドを実行する必要があります:

```bash
npm install
```

### 実行方法

```bash
npm run start
```

### 動作確認

#### TODO一覧表示コマンド

以下のコマンドを実行後にブラウザをリロードすると、TODO一覧が表示されていることが確認できます。

```bash
curl -X GET http://localhost:8000/api/todo
```

#### TODO追加コマンド

以下のコマンドを実行後にブラウザをリロードすると、TODOが追加されていることが確認できます。

```bash
curl -X POST -H "Content-Type: application/json" -d '{"title": "次回のWeb研に出席する"}' http://localhost:8000/api/todo
```

#### TODO変更コマンド

以下のコマンドを実行後にブラウザをリロードすると、「TODOアプリを自作する」のタスクが完了済みになっていることが確認できます。

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"completed": true}' http://localhost:8000/api/todo/2
```

また、以下のコマンドを実行後にブラウザをリロードすると、「JavaScriptを勉強する」のタイトルが「Node.jsを勉強する」になっていることが確認できます。

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"title": "Node.jsを勉強する"}' http://localhost:8000/api/todo/1
```

#### TODO削除コマンド

以下のコマンドを実行後にブラウザをリロードすると、「漫画を読み切る」のタスクが削除されていることが確認できます。

```bash
curl -X DELETE http://localhost:8000/api/todo/3
```

#### ステータスコード早見表

| status | 意味        | 状況                     |
| ------ | ----------- | ------------------------ |
| 200    | OK          | リクエストが成功した場合 |
| 400    | Bad Request | リクエストが不正な場合   |
