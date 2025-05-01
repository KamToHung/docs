# apiserver.yaml

設定ファイルは `${VAR:default}` 構文を使用して環境変数の注入をサポートしています。環境変数が設定されていない場合、デフォルト値が使用されます。

一般的な方法は、異なる `.env`、`.env.development`、`.env.prod` ファイルを通じて値を注入するか、ハードコードされた値で直接設定を変更することです。

## チャットメッセージデータベース設定

この設定は、バックエンドでチャットメッセージを保存するために特別に設計されています（プロキシ設定と同じデータベースを共有することができます）。以下の画像に示される情報に対応しています：

![Chat Sessions and Messages](/img/chat_histories.png)

現在、3種類のデータベースをサポートしています：
- SQLite3
- PostgreSQL
- MySQL

追加のデータベースのサポートが必要な場合は、[Issue](https://github.com/mcp-ecosystem/mcp-gateway/issues)セクションでリクエストするか、対応する実装を自身で実装してPRを提出することができます :)

```yaml
database:
  type: "${APISERVER_DB_TYPE:sqlite}"               # データベースタイプ（sqlite, postgres, mysql）
  host: "${APISERVER_DB_HOST:localhost}"            # データベースホストアドレス
  port: ${APISERVER_DB_PORT:5432}                   # データベースポート
  user: "${APISERVER_DB_USER:postgres}"             # データベースユーザー名
  password: "${APISERVER_DB_PASSWORD:example}"      # データベースパスワード
  dbname: "${APISERVER_DB_NAME:./mcp-gateway.db}"   # データベース名またはファイルパス
  sslmode: "${APISERVER_DB_SSL_MODE:disable}"       # データベース接続のSSLモード
```

## ゲートウェイプロキシストレージ設定

これは、ゲートウェイプロキシ設定を保存するために使用され、特にMCPからAPIへのマッピングを保存します。以下の画像に示されています：

![Gateway Proxy Configuration](/img/gateway_proxies.png)

現在、2つのタイプをサポートしています：
- disk: 設定はディスク上のファイルとして保存され、各設定は個別のファイルに保存されます。nginxのvhostの概念と同様で、例えば `svc-a.yaml`、`svc-b.yaml` などです
- db: データベースに保存し、各設定は1つのレコードとなります。現在、3種類のデータベースをサポートしています：
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # ストレージタイプ: db, disk
  
  # データベース設定（typeが'db'の場合に使用）
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # データベースタイプ（sqlite, postgres, mysql）
    host: "${GATEWAY_DB_HOST:localhost}"                # データベースホストアドレス
    port: ${GATEWAY_DB_PORT:5432}                       # データベースポート
    user: "${GATEWAY_DB_USER:postgres}"                 # データベースユーザー名
    password: "${GATEWAY_DB_PASSWORD:example}"          # データベースパスワード
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # データベース名またはファイルパス
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # データベース接続のSSLモード
  
  # ディスク設定（typeが'disk'の場合に使用）
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # データファイル保存パス
```

## 通知設定

通知モジュールは主に、`mcp-gateway` に設定更新を通知し、サービスの再起動を必要とせずにホットリロードをトリガーするために使用されます。

現在、4つの通知方法をサポートしています：
- signal: オペレーティングシステムのシグナルを通じて通知します。`kill -SIGHUP <pid>` や `nginx -s reload` と同様です。`mcp-gateway reload` コマンドを通じてトリガーでき、シングルマシンデプロイメントに適しています
- api: API呼び出しを通じて通知します。`mcp-gateway` は別のポートでリッスンし、リクエストを受信するとホットリロードを実行します。`curl http://localhost:5235/_reload` を通じてトリガーでき、シングルマシンおよびクラスターデプロイメントに適しています
- redis: Redisのpub/sub機能を通じて通知します。シングルマシンおよびクラスターデプロイメントに適しています
- composite: 複数の方法を使用する組み合わせ通知です。デフォルトで `signal` と `api` が常に有効になっており、他の方法と組み合わせることができます。シングルマシンおよびクラスターデプロイメントに適しており、推奨されるデフォルトのアプローチです

通知ロール：
- sender: 送信者ロールで、通知の送信を担当します。`apiserver` はこのモードのみ使用できます
- receiver: 受信者ロールで、通知の受信を担当します。シングルマシンの `mcp-gateway` はこのモードのみ使用することを推奨します
- both: 送信者と受信者の両方のロールです。クラスターデプロイされた `mcp-gateway` はこのモードを使用できます

```yaml
notifier:
  role: "${APISERVER_NOTIFIER_ROLE:sender}"              # ロール: sender, receiver, または both
  type: "${APISERVER_NOTIFIER_TYPE:signal}"              # タイプ: signal, api, redis, または composite

  # シグナル設定（typeが'signal'の場合に使用）
  signal:
    signal: "${APISERVER_NOTIFIER_SIGNAL:SIGHUP}"                       # 送信するシグナル
    pid: "${APISERVER_NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"    # PIDファイルパス

  # API設定（typeが'api'の場合に使用）
  api:
    port: ${APISERVER_NOTIFIER_API_PORT:5235}                                           # APIポート
    target_url: "${APISERVER_NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"    # リロードエンドポイント

  # Redis設定（typeが'redis'の場合に使用）
  redis:
    addr: "${APISERVER_NOTIFIER_REDIS_ADDR:localhost:6379}"                             # Redisアドレス
    password: "${APISERVER_NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"   # Redisパスワード
    db: ${APISERVER_NOTIFIER_REDIS_DB:0}                                                # Redisデータベース番号
    topic: "${APISERVER_NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                       # Redisパブ/サブトピック
```

## OpenAI API設定

OpenAI設定ブロックは、OpenAI APIの統合のための設定を定義します：

```yaml
openai:
  api_key: "${OPENAI_API_KEY}"                                  # OpenAI APIキー（必須）
  model: "${OPENAI_MODEL:gpt-4.1}"                              # 使用するモデル
  base_url: "${OPENAI_BASE_URL:https://api.openai.com/v1/}"     # APIベースURL
```

現在、OpenAI API互換のLLM呼び出しのみが統合されています 