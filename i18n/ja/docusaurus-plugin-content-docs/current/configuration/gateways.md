# ゲートウェイプロキシサービス設定

## クロスオリジンリソース共有（CORS）
```yaml
routers:
  - server: "user"
    prefix: "/mcp/user"
    cors:
      allowOrigins:
        - "*"
      allowMethods:
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"
        - "Authorization"
        - "Mcp-Session-Id"
      exposeHeaders:
        - "Mcp-Session-Id"
      allowCredentials: true
```

> **注意:** `Mcp-Session-Id` を `allowHeaders` と `exposeHeaders` の両方に明示的に設定する必要があります。そうしないと、クライアントはレスポンスヘッダーから `Mcp-Session-Id` を正しくリクエストして読み取ることができません。

## レスポンス処理

現在、**2つのレスポンス処理モード**がサポートされています：

### 1. 直接レスポンスボディ

バックエンドのレスポンスに対する処理は行わず、クライアントに直接転送されます。テンプレート例：

```yaml
responseBody: |-
  {{.Response.Body}}
```

### 2. カスタムフィールドレスポンス（フィールドマッピング）

バックエンドのレスポンスボディをJSON構造として解析し、特定のフィールドを抽出して返します。テンプレート例：

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
``` 