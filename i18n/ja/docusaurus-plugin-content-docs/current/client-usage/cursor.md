# CursorでのMCP設定簡易ガイド

> **より詳細なCursor MCP設定チュートリアルについては、公式ドキュメントをご参照ください：**  
> https://docs.cursor.com/context/model-context-protocol

ここでは基本的な設定方法をご紹介します。必要なディレクトリとファイルを作成してください：

```bash
mkdir -p .cursor
touch .cursor/mcp.json
```

次に、MCPサーバーを設定します。ここではモックユーザーサービスを使用してテストを行います：

![.cursor/mcp.json](/img/cursor.mcp.json.png)

```json
{
  "mcpServers": {
    "user": {
      "url": "http://localhost:5235/mcp/user/sse"
    }
  }
}
```

次に、Cursorの設定を開き、**MCP**セクションでこのMCPサーバーを有効にします。有効にすると、小さな緑の点に変わり、利用可能なツールも表示されます。

![.cursor/mcp.json](/img/cursor.mcp.servers.png)

最後に、チャットウィンドウで試してみましょう。例えば、ユーザーの登録を手伝ってもらい、そのユーザー情報を照会するなどです。動作すれば設定完了です。

以下のように入力してみてください：
```
ユーザーLeo ifuryst@gmail.comを登録してください
```

```
ユーザーifuryst@gmail.comを検索してください。見つからない場合は、ユーザー名Leoで登録してください
```

> **実際のテストでは、このモックサービスは名前とメールアドレスの処理により、場合によってモデルエラーを引き起こす可能性がありますが、これは無視して構いません。実際のAPIを使用することをお勧めします。**

![cursor usecase](/img/cursor.usecase.png) 
