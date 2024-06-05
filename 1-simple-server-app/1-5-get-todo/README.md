# 1-simple-server-app

## 1-5-get-todo

### 実行環境

`1-simple-server-app/1-5-get-todo` に `cd` した上で、以下のコマンドを実行する必要があります:

```bash
npm install
```

### 実行方法

```bash
npm run start
```

#### TODO追加コマンド

以下のコマンドを実行後にブラウザをリロードすると、TODOが追加されていることが確認できます。

```bash
curl -X POST -H "Content-Type: application/json" -d '{"title": "次回のWeb研に出席する"}' http://localhost:8000
```

#### ステータスコード早見表

| status | 意味 | 状況                     |
| ------ | ---- | ------------------------ |
| 200    | OK   | リクエストが成功した場合 |
