# mcp-gateway.yaml

Configuration files support environment variable injection using the `${VAR:default}` syntax. If the environment variable is not set, the default value will be used.

Common practice is to inject through different `.env`, `.env.development`, `.env.prod` files, or you can directly modify the configuration with a fixed value.

## Basic Configuration

```yaml
port: ${MCP_GATEWAY_PORT:5235}                      # Service listening port
pid: "${MCP_GATEWAY_PID:/var/run/mcp-gateway.pid}"  # PID file path
```

> The PID here should be consistent with the PID mentioned below

## Storage Configuration

The storage configuration module is mainly used to store gateway proxy configuration information. Currently supports two storage methods:
- disk: Configurations are stored as files on disk, with each configuration in a separate file, similar to nginx's vhost concept, e.g., `svc-a.yaml`, `svc-b.yaml`
- db: Store in database, with each configuration as a record. Currently supports three databases:
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # Storage type: db, disk
  
  # Database configuration (used when type is 'db')
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # Database type (sqlite, postgres, mysql)
    host: "${GATEWAY_DB_HOST:localhost}"                # Database host address
    port: ${GATEWAY_DB_PORT:5432}                       # Database port
    user: "${GATEWAY_DB_USER:postgres}"                 # Database username
    password: "${GATEWAY_DB_PASSWORD:example}"          # Database password
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # Database name or file path
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # Database SSL mode
  
  # Disk configuration (used when type is 'disk')
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # Data file storage path
```

## Notifier Configuration

The notifier configuration module is used to notify `mcp-gateway` of configuration updates and trigger hot reload without restarting the service.

Currently supports four notification methods:
- signal: Notify through operating system signals, similar to `kill -SIGHUP <pid>` or `nginx -s reload`, can be called via `mcp-gateway reload` command, suitable for single-machine deployment
- api: Notify through API calls, `mcp-gateway` listens on a separate port and performs hot reload when receiving requests, can be called directly via `curl http://localhost:5235/_reload`, suitable for both single-machine and cluster deployment
- redis: Notify through Redis pub/sub functionality, suitable for both single-machine and cluster deployment
- composite: Combined notification, using multiple methods, with `signal` and `api` enabled by default, can be combined with other methods. Suitable for both single-machine and cluster deployment, recommended as the default method

Notification roles:
- sender: Sender, responsible for sending notifications, `apiserver` can only use this mode
- receiver: Receiver, responsible for receiving notifications, single-machine `mcp-gateway` is recommended to use only this mode
- both: Both sender and receiver, cluster-deployed `mcp-gateway` can use this mode

```yaml
notifier:
  role: "${NOTIFIER_ROLE:receiver}" # Role: 'sender' or 'receiver'
  type: "${NOTIFIER_TYPE:signal}"   # Type: 'signal', 'api', 'redis', or 'composite'

  # Signal configuration (used when type is 'signal')
  signal:
    signal: "${NOTIFIER_SIGNAL:SIGHUP}"                     # Signal to send
    pid: "${NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"  # PID file path

  # API configuration (used when type is 'api')
  api:
    port: ${NOTIFIER_API_PORT:5235}                                         # API port
    target_url: "${NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"  # Reload endpoint

  # Redis configuration (used when type is 'redis')
  redis:
    addr: "${NOTIFIER_REDIS_ADDR:localhost:6379}"                               # Redis address
    password: "${NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"     # Redis password
    db: ${NOTIFIER_REDIS_DB:0}                                                  # Redis database number
    topic: "${NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                         # Redis pub/sub topic
```

## Session Storage Configuration

Session storage configuration is used to store MCP session information. Currently supports two storage methods:
- memory: In-memory storage, suitable for single-machine deployment (note: session information will be lost on restart)
- redis: Redis storage, suitable for both single-machine and cluster deployment

```yaml
session:
  type: "${SESSION_STORAGE_TYPE:memory}"                    # Storage type: memory, redis
  redis:
    addr: "${SESSION_REDIS_ADDR:localhost:6379}"            # Redis address
    password: "${SESSION_REDIS_PASSWORD:}"                  # Redis password
    db: ${SESSION_REDIS_DB:0}                               # Redis database number
    topic: "${SESSION_REDIS_TOPIC:mcp-gateway:session}"     # Redis pub/sub topic
```
