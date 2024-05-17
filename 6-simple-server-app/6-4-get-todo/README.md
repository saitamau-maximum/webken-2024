# 4-get-todo
## 環境構築
`6-simple-server` に `cd` した上で、以下のコマンドを実行すること:
```bash
npm install hono @hono/node-server
```

## 実行
### サーバーの実行
```bash
node server.js
```

### TODO追加コマンド
以下のコマンドを実行後にブラウザをリロードすると、TODOが追加されていることが確認できる。
```bash
curl -X POST -H "Content-Type: application/json" -d '{"title": "次回のWeb研に出席する"}' http://localhost:8000
```
