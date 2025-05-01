# CursorでのMCP設定の簡単ガイド

> **より詳細なCursor MCP設定チュートリアルについては、公式ドキュメントを参照してください：**  
> https://docs.cursor.com/context/model-context-protocol

ここでは基本的な設定方法をご紹介します。まず、必要なディレクトリとファイルを作成してください：

```bash
mkdir -p .cursor
touch .cursor/mcp.json
```

次に、MCPサーバーを設定します。ここではテスト用に独自のモックユーザーサービスを使用します：

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

最後に、チャットウィンドウで試してみることができます。例えば、ユーザーの登録を手伝ってもらい、そのユーザーの情報を照会するなどです。動作すれば完了です！

例えば、以下のように入力できます：
```
ユーザーifuryst@gmail.comを照会してください。見つからない場合は、ユーザー名Leoで登録してください
``` 
