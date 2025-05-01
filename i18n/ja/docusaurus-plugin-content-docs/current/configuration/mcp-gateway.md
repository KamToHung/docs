# mcp-gateway.yaml

設定ファイルは `${VAR:default}` 構文を使用して環境変数の注入をサポートしています。環境変数が設定されていない場合、デフォルト値が使用されます。

一般的な方法は、異なる `.env`、`.env.development`、`.env.prod` ファイルを通じて注入するか、固定値で直接設定を変更することです。

## 基本設定

```yaml
port: ${MCP_GATEWAY_PORT:5235}                      # サービスリスニングポート
pid: "${MCP_GATEWAY_PID:/var/run/mcp-gateway.pid}"  # PIDファイルパス
```

> ここのPIDは下記で言及されるPIDと一致している必要があります

## ストレージ設定

ストレージ設定モジュールは主にゲートウェイプロキシ設定情報を保存するために使用されます。現在、2つのストレージ方法をサポートしています：
- disk: 設定はディスク上のファイルとして保存され、各設定は個別のファイルに保存されます。nginxのvhostの概念と同様で、例えば `svc-a.yaml`、`svc-b.yaml` などです
- db: データベースに保存し、各設定は1つのレコードとなります。現在、3つのデータベースをサポートしています：
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
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # データベースSSLモード
  
  # ディスク設定（typeが'disk'の場合に使用）
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # データファイル保存パス
```

## 通知設定

通知設定モジュールは、`mcp-gateway` に設定更新を通知し、サービスを再起動せずにホットリロードをトリガーするために使用されます。

現在、4つの通知方法をサポートしています：
- signal: オペレーティングシステムのシグナルを通じて通知します。`kill -SIGHUP <pid>` や `nginx -s reload` と同様で、`mcp-gateway reload` コマンドを通じて呼び出すことができます。シングルマシンデプロイメントに適しています
- api: API呼び出しを通じて通知します。`mcp-gateway` は別のポートでリッスンし、リクエストを受信するとホットリロードを実行します。`curl http://localhost:5235/_reload` を通じて直接呼び出すことができます。シングルマシンおよびクラスターデプロイメントに適しています
- redis: Redisのpub/sub機能を通じて通知します。シングルマシンおよびクラスターデプロイメントに適しています
- composite: 複数の方法を使用する組み合わせ通知です。デフォルトで `signal` と `api` が有効になっており、他の方法と組み合わせることができます。シングルマシンおよびクラスターデプロイメントに適しており、デフォルトの方法として推奨されています

通知ロール：
- sender: 送信者で、通知の送信を担当します。`apiserver` はこのモードのみ使用できます
- receiver: 受信者で、通知の受信を担当します。シングルマシンの `mcp-gateway` はこのモードのみ使用することを推奨します
- both: 送信者と受信者の両方です。クラスターデプロイされた `mcp-gateway` はこのモードを使用できます

```yaml
notifier:
  role: "${NOTIFIER_ROLE:receiver}" # ロール: 'sender' または 'receiver'
  type: "${NOTIFIER_TYPE:signal}"   # タイプ: 'signal', 'api', 'redis', または 'composite'

  # シグナル設定（typeが'signal'の場合に使用）
  signal:
    signal: "${NOTIFIER_SIGNAL:SIGHUP}"                     # 送信するシグナル
    pid: "${NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"  # PIDファイルパス

  # API設定（typeが'api'の場合に使用）
  api:
    port: ${NOTIFIER_API_PORT:5235}                                         # APIポート
    target_url: "${NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"  # リロードエンドポイント

  # Redis設定（typeが'redis'の場合に使用）
  redis:
    addr: "${NOTIFIER_REDIS_ADDR:localhost:6379}"                               # Redisアドレス
    password: "${NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"     # Redisパスワード
    db: ${NOTIFIER_REDIS_DB:0}                                                  # Redisデータベース番号
    topic: "${NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                         # Redisパブ/サブトピック
```

## セッションストレージ設定

セッションストレージ設定は、MCPセッション情報を保存するために使用されます。現在、2つのストレージ方法をサポートしています：
- memory: メモリ内ストレージで、シングルマシンデプロイメントに適しています（注：セッション情報は再起動時に失われます）
- redis: Redisストレージで、シングルマシンおよびクラスターデプロイメントに適しています

```yaml
session:
  type: "${SESSION_STORAGE_TYPE:memory}"                    # ストレージタイプ: memory, redis
  redis:
    addr: "${SESSION_REDIS_ADDR:localhost:6379}"            # Redisアドレス
    password: "${SESSION_REDIS_PASSWORD:}"                  # Redisパスワード
    db: ${SESSION_REDIS_DB:0}                               # Redisデータベース番号
    topic: "${SESSION_REDIS_TOPIC:mcp-gateway:session}"     # Redisパブ/サブトピック
``` 