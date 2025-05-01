# クイックスタート

## MCP Gatewayのセットアップ

1. 必要なディレクトリを作成し、設定ファイルをダウンロードします：

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> 中国本土にいる場合は、Alibaba Cloudレジストリからイメージを取得できます：
>
> ```bash
> registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest
> ```

> 必要に応じてデフォルトのLLMを置き換えることもできます。例えば、Qwenに切り替える場合：
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. DockerでMCP Gatewayを実行します：

```bash
docker run -d \
           --name mcp-gateway \
           -p 8080:80 \
           -p 5234:5234 \
           -p 5235:5235 \
           -p 5335:5335 \
           -p 5236:5236 \
           -e ENV=production \
           -v $(pwd)/configs:/app/configs \
           -v $(pwd)/data:/app/data \
           -v $(pwd)/.env.allinone:/app/.env \
           --restart unless-stopped \
           ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
```

## アクセスと設定

1. Web UIにアクセスします：
   - ブラウザを開き、http://localhost:8080/ にアクセスします

2. 新しいMCPサーバーを追加します：
   - 設定ファイルをコピーします：https://github.com/mcp-ecosystem/mcp-gateway/blob/main/configs/mock-user-svc.yaml
   - Web UIで "Add MCP Server" をクリックします
   - 設定を貼り付けて保存します

   ![MCPサーバー追加の例](/img/add_mcp_server.png)

## 利用可能なエンドポイント

設定が完了すると、以下のエンドポイントでサービスが利用可能になります：

- MCP SSE: http://localhost:5235/mcp/user/sse
- MCP HTTP Streamable: http://localhost:5235/mcp/user/message
- MCP: http://localhost:5235/mcp/user/mcp

## テスト

サービスは2つの方法でテストできます：

1. Web UIのMCP Chatページを使用（`.env.allinone` でAPIキーの設定が必要）
2. 独自のMCPクライアントを使用（**推奨**） 