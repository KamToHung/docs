# Docker

## イメージの概要

MCP Gatewayは2つのデプロイメント方法を提供しています：
1. **オールインワンデプロイメント**: すべてのサービスが1つのコンテナにパッケージ化され、ローカルまたはシングルノードデプロイメントに適しています。
2. **マルチコンテナデプロイメント**: 各サービスが個別にデプロイされ、本番環境やクラスター環境に適しています。

### イメージレジストリ

イメージは以下のレジストリに公開されています：
- Docker Hub: `docker.io/ifuryst/mcp-gateway-*`
- GitHub Container Registry: `ghcr.io/mcp-ecosystem/mcp-gateway/*`
- Alibaba Cloud Container Registry: `registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-*`

*GitHub Container Registryは、より明確な組織化のためにマルチレベルディレクトリをサポートしていますが、Docker HubとAlibaba Cloudレジストリはハイフンを使用したフラットな命名を使用しています。*

### イメージタグ

- `latest`: 最新バージョン
- `vX.Y.Z`: 特定のバージョン

> ⚡ **注意**: MCP Gatewayは急速に開発が進んでいます！より信頼性の高いデプロイメントのために、特定のバージョンタグを使用することを推奨します。

### 利用可能なイメージ

```bash
# オールインワンバージョン
docker pull docker.io/ifuryst/mcp-gateway-allinone:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# APIサーバー
docker pull docker.io/ifuryst/mcp-gateway-apiserver:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/apiserver:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-apiserver:latest

# MCP Gateway
docker pull docker.io/ifuryst/mcp-gateway-mcp-gateway:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mcp-gateway:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mcp-gateway:latest

# モックユーザーサービス
docker pull docker.io/ifuryst/mcp-gateway-mock-user-svc:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mock-user-svc:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mock-user-svc:latest

# Webフロントエンド
docker pull docker.io/ifuryst/mcp-gateway-web:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/web:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-web:latest
```

## デプロイメント

### オールインワンデプロイメント

オールインワンデプロイメントは、すべてのサービスを1つのコンテナにパッケージ化し、シングルノードまたはローカルデプロイメントに最適です。以下のサービスが含まれています：
- **APIサーバー**: 管理バックエンド（コントロールプレーン）
- **MCP Gateway**: ゲートウェイトラフィックを処理するコアサービス（データプレーン）
- **モックユーザーサービス**: テスト用の模擬ユーザーサービス（実際の既存のAPIサービスに置き換えることができます）
- **Webフロントエンド**: Webベースの管理インターフェース
- **Nginx**: 内部サービス用のリバースプロキシ

プロセスはSupervisorで管理され、すべてのログはstdoutに出力されます。

#### ポート

- `8080`: Web UI
- `5234`: APIサーバー
- `5235`: MCP Gateway
- `5335`: MCP Gateway Admin（リロードなどの内部エンドポイント；本番環境では公開しないでください）
- `5236`: モックユーザーサービス

#### データの永続化

以下のディレクトリをマウントすることを推奨します：
- `/app/configs`: 設定ファイル
- `/app/data`: データストレージ
- `/app/.env`: 環境変数ファイル

#### コマンド例

1. 必要なディレクトリを作成し、設定ファイルをダウンロードします：

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> 必要に応じてデフォルトのLLMを置き換えることができます（OpenAI互換である必要があります）。例えば、Qwenを使用する場合：
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. DockerでMCP Gatewayを実行します：

```bash
# Alibaba Cloudレジストリの使用（中国のサーバー/デバイスに推奨）
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
           registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# GitHub Container Registryの使用
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

#### 注意事項

1. 設定ファイルと環境ファイルが正しく設定されていることを確認してください。
2. `latest` の代わりに特定のバージョンタグを使用することを推奨します。
3. 本番環境デプロイメントには適切なリソース制限を設定してください。
4. マウントされたディレクトリに適切な権限が設定されていることを確認してください。 