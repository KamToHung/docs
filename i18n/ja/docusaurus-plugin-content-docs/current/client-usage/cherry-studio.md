# Cherry Studio MCP設定ガイド
Cherry Studioは、Windows、Mac、Linuxシステムに対応した複数の大規模言語モデル（LLM）サービスプロバイダーをサポートするデスクトップクライアントです。
Cherry Studio Github: [cherry-studio/docs/README.zh.md](https://github.com/CherryHQ/cherry-studio/blob/main/docs/README.zh.md)

> **より詳細なCherry Studio MCP設定チュートリアルについては、公式ドキュメントをご覧ください：**  
> https://docs.cherry-ai.com/advanced-basic/mcp

まず、**MCPサーバー**設定でMCPサーバーを設定します。ここでは独自のシミュレーションユーザーサービスを使用してテストを行います：
![cherrystudio.mcp.servers.png](/img/cherrystudio.mcp.servers.png)

次に、右上のボタンをクリックして有効にした後、**ツール**をクリックすると、このMCPサービスのツールとそのパラメータ、パラメータタイプが表示されます。

![cherrystudio.mcp.tools.png](/img/cherrystudio.mcp.tools.png)

最後に、チャットウィンドウで試してみることができます。例えば、ユーザーを登録し、そのユーザー情報を照会するように依頼します。動作すれば完了です。

例えば、以下のように入力できます：
```
ユーザーLeo ifuryst@gmail.comを登録してください
```

```
ユーザーifuryst@gmail.comを検索してください。見つからない場合は、ユーザー名Leoで登録してください
```

![cherrystudio.usecase.png](/img/cherrystudio.usecase.png)

> **LLMとのチャットでは、対話プロセス中にタスクの意図をインテリジェントに認識し、ツールセットから最適なツールを自動的に選択して自動呼び出しを行うことができます**

👇👇👇👇👇👇 このドキュメントの改善にご協力いただける場合は、ぜひご貢献ください。ありがとうございます ❤️ 