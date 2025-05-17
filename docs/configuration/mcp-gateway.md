# mcp-gateway.yaml

配置文件支持使用 `${VAR:default}` 语法进行环境变量注入。如果环境变量未设置，将使用默认值。

常见的做法是通过不同的`.env`, `.env.development`, `.env.prod`进行注入，当然也可以直接修改配置写死一个值

## 基础配置

```yaml
port: ${MCP_GATEWAY_PORT:5235}                      # 服务监听端口
pid: "${MCP_GATEWAY_PID:/var/run/mcp-gateway.pid}"  # PID文件路径
```

> 这里的PID和下面涉及的PID保持一致

## 存储配置

存储配置模块主要用于存储网关的代理配置信息。目前支持两种存储方式：
- disk: 配置会以文件的形式存放在磁盘里，每个配置单独一个文件，可以理解跟nginx的vhost一个道理，比如 `svc-a.yaml`, `svc-b.yaml`
- db: 存到数据库，每个配置是一条记录。目前支持三种数据库：
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # 存储类型：db, disk
  
  # 数据库配置（当 type 为 'db' 时使用）
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # 数据库类型（sqlite,postgres, mysql）
    host: "${GATEWAY_DB_HOST:localhost}"                # 数据库主机地址
    port: ${GATEWAY_DB_PORT:5432}                       # 数据库端口
    user: "${GATEWAY_DB_USER:postgres}"                 # 数据库用户名
    password: "${GATEWAY_DB_PASSWORD:example}"          # 数据库密码
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # 数据库名称或文件路径
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # 数据库连接的 SSL 模式
  
  # 磁盘配置（当 type 为 'disk' 时使用）
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # 数据文件存储路径
```

## 通知配置

通知配置模块主要是用来当配置更新的时候如何让`mcp-gateway`感知到更新并进行热重载而无需重启服务。

目前支持4种通知方式：
- signal: 通过发送操作系统信号量来通知，类似`kill -SIGHUP <pid>`或者`nginx -s reload`这种方式，可通过`mcp-gateway reload`命令调用，适合单机部署时使用
- api: 通过调用一个api的方式通知，`mcp-gateway`会监听一个独立的端口，当收到请求时会进行热重载，可通过`curl http://localhost:5235/_reload`直接调用，适合单机和集群部署时使用
- redis: 通过redis的发布/订阅功能通知，适合单机或集群部署时使用
- composite: 组合通知，通过多种方式组合，默认`signal`和`api`一定会开启，可以在配合其他方式。适合单机和集群部署时使用，也是推荐的默认的方式

通知区分角色：
- sender: 发送者，负责发送通知，`apiserver`只能走这个模式
- receiver: 接收者，负责接收通知，单机的`mcp-gateway`建议只走这个模式
- both: 既是发送者又是接收者，集群部署的`mcp-gateway`可以走这个方式

```yaml
notifier:
  role: "${NOTIFIER_ROLE:receiver}" # 角色：'sender'（发送者）或 'receiver'（接收者）
  type: "${NOTIFIER_TYPE:signal}"   # 类型：'signal'（信号）、'api'、'redis' 或 'composite'（组合）

  # 信号配置（当 type 为 'signal' 时使用）
  signal:
    signal: "${NOTIFIER_SIGNAL:SIGHUP}"                     # 要发送的信号
    pid: "${NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"  # PID 文件路径

  # API 配置（当 type 为 'api' 时使用）
  api:
    port: ${NOTIFIER_API_PORT:5235}                                         # API 端口
    target_url: "${NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"  # 重载端点

  # Redis 配置（当 type 为 'redis' 时使用）
  redis:
    addr: "${NOTIFIER_REDIS_ADDR:localhost:6379}"                               # Redis 地址
    password: "${NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"     # Redis 密码
    db: ${NOTIFIER_REDIS_DB:0}                                                  # Redis 数据库编号
    topic: "${NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                         # Redis 发布/订阅主题
```

## 会话存储配置

会话存储配置用于存储MCP中的会话信息。目前支持两种存储方式：
- memory: 内存存储，适合单机部署（需注意，重启会失去会话信息）
- redis: Redis存储，适合单机或集群部署

```yaml
session:
  type: "${SESSION_STORAGE_TYPE:memory}"                    # 存储类型：memory, redis
  redis:
    addr: "${SESSION_REDIS_ADDR:localhost:6379}"            # Redis 地址
    password: "${SESSION_REDIS_PASSWORD:}"                  # Redis 密码
    db: ${SESSION_REDIS_DB:0}                               # Redis 数据库编号
    topic: "${SESSION_REDIS_TOPIC:mcp-gateway:session}"     # Redis 发布/订阅主题
```

