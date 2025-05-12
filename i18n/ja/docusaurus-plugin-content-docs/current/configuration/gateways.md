# ゲートウェイプロキシサービス設定

## 設定例

以下は、ルーティング、CORS、レスポンス処理などを含む完全な設定例です：

```yaml
name: "mock-user-svc"                 # プロキシサービス名、グローバルで一意

# ルーティング設定
routers:
  - server: "mock-user-svc"     # サービス名
    prefix: "/mcp/user"         # ルートプレフィックス、グローバルで一意、重複不可、サービスまたはドメイン+モジュールで区別することを推奨

    # CORS設定
    cors:
      allowOrigins:             # 開発/テスト環境では完全に開放可能、本番環境では選択的に開放することを推奨（ほとんどのMCPクライアントはCORSを必要としません）
        - "*"
      allowMethods:             # 許可するリクエストメソッド、必要に応じて開放、MCP（SSEとStreamable）では通常この3つのメソッドのみ必要
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"        # 必須
        - "Authorization"       # 認証が必要な場合は必須
        - "Mcp-Session-Id"      # MCPでは、リクエストでこのKeyをサポートする必要があります、そうしないとStreamable HTTPが正常に動作しません
      exposeHeaders:
        - "Mcp-Session-Id"      # MCPでは、CORSが有効な場合、このKeyを公開する必要があります、そうしないとStreamable HTTPが正常に動作しません
      allowCredentials: true    # Access-Control-Allow-Credentials: true ヘッダーを追加するかどうか

# サービス設定
servers:
  - name: "mock-user-svc"             # サービス名、routersのserverと一致する必要があります
    namespace: "user-service"         # サービス名前空間、サービスグループ化に使用
    description: "Mock User Service"  # サービス説明
    allowedTools:                     # 許可するツールリスト（toolsのサブセット）
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # サービスレベルの設定、toolsで{{.Config}}を使用して参照可能
      Cookie: 123                                     # ハードコードされた設定
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # 環境変数からの設定、使用法は'{{ env "ENV_VAR_NAME" }}'

# ツール設定
tools:
  - name: "register_user"                                   # ツール名
    description: "Register a new user"                      # ツール説明
    method: "POST"                                          # ターゲット（アップストリーム、バックエンド）サービスへのHTTPメソッド
    endpoint: "http://localhost:5236/users"                 # ターゲットサービスアドレス
    headers:                                                # リクエストヘッダー設定、ターゲットサービスへのリクエスト時に付与するヘッダー
      Content-Type: "application/json"                      # ハードコードされたヘッダー
      Authorization: "{{.Request.Headers.Authorization}}"   # クライアントリクエストから抽出したAuthorizationヘッダーを使用（パススルーシナリオ用）
      Cookie: "{{.Config.Cookie}}"                          # サービス設定の値を使用
    args:                         # パラメータ設定
      - name: "username"          # パラメータ名
        position: "body"          # パラメータ位置：header, query, path, body
        required: true            # パラメータが必須かどうか
        type: "string"            # パラメータ型
        description: "Username"   # パラメータ説明
        default: ""               # デフォルト値
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # リクエストボディテンプレート、パラメータ（MCPリクエストのarguments）から値を抽出して動的に生成
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # レスポンスボディテンプレート、レスポンスから値を抽出して動的に生成
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }

  - name: "get_user_by_email"
    description: "Get user by email"
    method: "GET"
    endpoint: "http://localhost:5236/users/email/{{.Args.email}}"
    args:
      - name: "email"
        position: "path"
        required: true
        type: "string"
        description: "Email"
        default: ""
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }

  - name: "update_user_preferences"
    description: "Update user preferences"
    method: "PUT"
    endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
    headers:
      Content-Type: "application/json"
      Authorization: "{{.Request.Headers.Authorization}}"
      Cookie: "{{.Config.Cookie}}"
    args:
      - name: "email"
        position: "path"
        required: true
        type: "string"
        description: "Email"
        default: ""
      - name: "isPublic"
        position: "body"
        required: true
        type: "boolean"
        description: "Whether the user profile is public"
        default: "false"
      - name: "showEmail"
        position: "body"
        required: true
        type: "boolean"
        description: "Whether to show email in profile"
        default: "true"
      - name: "theme"
        position: "body"
        required: true
        type: "string"
        description: "User interface theme"
        default: "light"
      - name: "tags"
        position: "body"
        required: true
        type: "array"
        items:
           type: "string"
           enum: ["developer", "designer", "manager", "tester"]
        description: "User role tags"
        default: "[]"
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}",
        "preferences": {
          "isPublic": {{.Response.Data.preferences.isPublic}},
          "showEmail": {{.Response.Data.preferences.showEmail}},
          "theme": "{{.Response.Data.preferences.theme}}",
          "tags": {{.Response.Data.preferences.tags}}
        }
      }
```

## 設定説明

### 1. 基本設定

- `name`: プロキシサービス名、グローバルで一意、異なるプロキシサービスを識別するために使用
- `routers`: ルーティング設定のリスト、リクエスト転送ルールを定義
- `servers`: サービス設定のリスト、サービスメタデータと許可されたツールを定義
- `tools`: ツール設定のリスト、具体的なAPI呼び出しルールを定義

設定は名前空間と見なすことができ、サービスまたはドメインで区別することを推奨します。サービスには多くのAPIインターフェースが含まれ、各APIインターフェースは1つのToolに対応します

### 2. ルーティング構成

ルーティング構成はリクエストの転送ルールを定義するために使用されます：

```yaml
routers:
  - server: "mock-user-svc"    # サービス名、serversのnameと一致する必要があります
    prefix: "/mcp/user"        # ルートプレフィックス、グローバルに一意、重複不可
```

デフォルトでは、`prefix`から3つのエンドポイントが派生します：
- SSE: `${prefix}/sse`、例：`/mcp/user/sse`
- SSE Message: `${prefix}/message`、例：`/mcp/user/message`
- StreamableHTTP: `${prefix}/mcp`、例：`/mcp/user/mcp`

### 3. CORS設定

クロスオリジンリソース共有（CORS）設定は、クロスオリジンリクエストのアクセス権限を制御するために使用されます：

```yaml
cors:
  allowOrigins:             # 開発/テスト環境では完全に開放可能、本番環境では選択的に開放することを推奨（ほとんどのMCPクライアントはCORSを必要としません）
    - "*"
  allowMethods:             # 許可するリクエストメソッド、必要に応じて開放、MCP（SSEとStreamable）では通常この3つのメソッドのみ必要
    - "GET"
    - "POST"
    - "OPTIONS"
  allowHeaders:
    - "Content-Type"        # 必須
    - "Authorization"       # 認証が必要な場合は必須
    - "Mcp-Session-Id"      # MCPでは、リクエストでこのKeyをサポートする必要があります、そうしないとStreamable HTTPが正常に動作しません
  exposeHeaders:
    - "Mcp-Session-Id"      # MCPでは、CORSが有効な場合、このKeyを公開する必要があります、そうしないとStreamable HTTPが正常に動作しません
  allowCredentials: true    # Access-Control-Allow-Credentials: true ヘッダーを追加するかどうか
```

> **通常、MCPクライアントはCORSを有効にする必要はありません**

### 4. サービス設定

サービス設定は、サービスメタデータ、関連するツールリスト、およびサービスレベルの設定を定義するために使用されます：

```yaml
servers:
  - name: "mock-user-svc"             # サービス名、routersのserverと一致する必要があります
    namespace: "user-service"         # サービス名前空間、サービスグループ化に使用
    description: "Mock User Service"  # サービス説明
    allowedTools:                     # 許可するツールリスト（toolsのサブセット）
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # サービスレベルの設定、toolsで{{.Config}}を使用して参照可能
      Cookie: 123                                     # ハードコードされた設定
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # 環境変数からの設定、使用法は'{{ env "ENV_VAR_NAME" }}'
```

サービスレベルの設定は、toolsで `{{.Config}}` を使用して参照できます。ここでは、設定ファイルにハードコードするか、環境変数から取得することができます。環境変数注入の場合は、`{{ env "ENV_VAR_NAME" }}`の形式を使用します

### 5. ツール設定

ツール設定は、具体的なAPI呼び出しルールを定義するために使用されます：

```yaml
tools:
  - name: "register_user"                                   # ツール名
    description: "Register a new user"                      # ツール説明
    method: "POST"                                          # ターゲット（アップストリーム、バックエンド）サービスへのHTTPメソッド
    endpoint: "http://localhost:5236/users"                 # ターゲットサービスアドレス
    headers:                                                # リクエストヘッダー設定、ターゲットサービスへのリクエスト時に付与するヘッダー
      Content-Type: "application/json"                      # ハードコードされたヘッダー
      Authorization: "{{.Request.Headers.Authorization}}"   # クライアントリクエストから抽出したAuthorizationヘッダーを使用（パススルーシナリオ用）
      Cookie: "{{.Config.Cookie}}"                          # サービス設定の値を使用
    args:                         # パラメータ設定
      - name: "username"          # パラメータ名
        position: "body"          # パラメータ位置：header, query, path, body
        required: true            # パラメータが必須かどうか
        type: "string"            # パラメータ型
        description: "Username"   # パラメータ説明
        default: ""               # デフォルト値
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # リクエストボディテンプレート、パラメータ（MCPリクエストのarguments）から値を抽出して動的に生成
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # レスポンスボディテンプレート、レスポンスから値を抽出して動的に生成
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

#### 5.1 リクエストパラメータの組み立て

ターゲットサービスへのリクエスト時、パラメータを組み立てる必要があります。現在、以下のソースがあります：
1. `.Config`: サービスレベルの設定から値を抽出
2. `.Args`: リクエストパラメータから直接値を抽出
3. `.Request`: リクエストから値を抽出、ヘッダー`.Request.Headers`、ボディ`.Request.Body`など

組み立ては`requestBody`で行われます、例えば：
```yaml
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
```

`endpoint`（ターゲットアドレス）も上記のソースを使用して値を抽出できます、例えば`http://localhost:5236/users/{{.Args.email}}/preferences`はリクエストパラメータから値を抽出します

#### 5.2 レスポンスパラメータの組み立て

レスポンスボディの組み立てはリクエストボディの組み立てと同様です：
1. `.Response.Data`: レスポンスから値を抽出、レスポンスはJSON形式である必要があります
2. `.Response.Body`: レスポンスボディ全体を直接パススルー、レスポンス内容の形式を無視し、クライアントに直接渡します

すべて`.Response`を使用して抽出します、例えば：
```yaml
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

## 設定の保存

ゲートウェイプロキシ設定は以下の2つの方法で保存できます：

1. データベース保存（推奨）：
    - SQLite3、PostgreSQL、MySQLをサポート
    - 各設定を1つのレコードとして保存
    - 動的更新とホットリロードをサポート

2. ファイル保存：
    - 各設定を個別のYAMLファイルとして保存
    - Nginxのvhost設定方式に類似
    - ファイル名はサービス名を使用することを推奨、例：`mock-user-svc.yaml` 
