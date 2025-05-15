# Go Template 使用ガイド

このドキュメントでは、MCP Gateway で Go Template を使用してリクエストとレスポンスデータを処理する方法を説明します。Go Template は強力なテンプレート機能を提供し、データの変換とフォーマットを柔軟に処理することができます。

## 基本構文

Go Template は `{{}}` を区切り文字として使用し、その中で様々な関数や変数を使用できます。MCP Gateway では、主に以下の変数を使用します：

- `.Config`: サービスレベルの設定
- `.Args`: リクエストパラメータ
- `.Request`: 元のリクエスト情報
- `.Response`: アップストリームサービスのレスポンス情報

## 一般的な使用例

### 1. 環境変数から設定を取得

```yaml
config:
  Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # 環境変数から設定を取得
```

### 2. リクエストヘッダーから値を抽出

```yaml
headers:
  Authorization: "{{.Request.Headers.Authorization}}"   # クライアントの Authorization ヘッダーを転送
  Cookie: "{{.Config.Cookie}}"                         # サービス設定の値を使用
```

### 3. リクエストボディの構築

```yaml
requestBody: |-
  {
    "username": "{{.Args.username}}",
    "email": "{{.Args.email}}"
  }
```

### 4. レスポンスデータの処理

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
```

### 5. ネストされたレスポンスデータの処理

```yaml
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

### 6. 配列データの処理

レスポンスの配列データを処理する場合、Go Template の range 機能を使用できます：

```yaml
responseBody: |-
  {
    "total": "{{.Response.Data.total}}",
    "rows": [
      {{- $len := len .Response.Data.rows -}}
      {{- $rows := fromJSON .Response.Data.rows }}
      {{- range $i, $e := $rows }}
      {
        "id": {{ $e.id }},
        "detail": "{{ $e.detail }}",
        "deviceName": "{{ $e.deviceName }}"
      }{{ if lt (add $i 1) $len }},{{ end }}
      {{- end }}
    ]
  }
```

この例では以下のことを示しています：
1. `fromJSON` 関数を使用して JSON 文字列を走査可能なオブジェクトに変換
2. `range` を使用して配列を反復処理
3. `len` 関数を使用して配列の長さを取得
4. `add` 関数を使用して数学演算を実行
5. 条件文を使用して配列要素間のカンマ区切りを制御

### 7. URL でのパラメータの使用

```yaml
endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
```

## 組み込み関数

現在サポートされている組み込み関数：

1. `env`: 環境変数の値を取得
   ```yaml
   Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'
   ```

2. `add`: 整数の加算を実行
   ```yaml
   {{ if lt (add $i 1) $len }},{{ end }}
   ```

3. `fromJSON`: JSON 文字列を走査可能なオブジェクトに変換
   ```yaml
   {{- $rows := fromJSON .Response.Data.rows }}
   ```

新しいテンプレート関数を追加するには：
1. 具体的な使用例を説明し、issue を作成
2. PR の貢献を歓迎しますが、現在は汎用的な関数のみを受け付けています

## 追加リソース

- [Go Template 公式ドキュメント](https://pkg.go.dev/text/template) 