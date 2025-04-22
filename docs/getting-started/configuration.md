---
sidebar_position: 2
---

# 配置说明

## 配置文件结构

MCP Gateway 的配置文件位于 `configs` 目录下，支持 YAML 格式。主要配置项包括：

```yaml
server:
  port: 8080
  host: "0.0.0.0"

gateway:
  routes:
    - path: "/api/v1"
      target: "http://localhost:8081"
      methods: ["GET", "POST"]
      timeout: 5000

logging:
  level: "info"
  format: "json"
```

## 主要配置项说明

### 服务器配置
- `server.port`: 服务监听端口
- `server.host`: 服务监听地址

### 网关配置
- `gateway.routes`: 路由规则配置
  - `path`: API 路径
  - `target`: 目标服务地址
  - `methods`: 支持的 HTTP 方法
  - `timeout`: 请求超时时间（毫秒）

### 日志配置
- `logging.level`: 日志级别
- `logging.format`: 日志格式

## 环境变量配置

除了配置文件，还可以通过环境变量覆盖配置：

```bash
export GATEWAY_PORT=8080
export GATEWAY_HOST=0.0.0.0
export LOG_LEVEL=debug
```

## 配置验证

启动服务时会自动验证配置的有效性。如果配置有误，服务将无法启动并显示具体错误信息。

## 配置热重载

MCP Gateway 支持配置热重载，修改配置文件后无需重启服务：

```bash
curl -X POST http://localhost:8080/reload
```

## 最佳实践

1. 使用版本控制管理配置文件
2. 为不同环境（开发、测试、生产）创建独立的配置文件
3. 敏感信息使用环境变量或配置中心管理
4. 定期备份配置文件

## 下一步

- [API 转换示例](/docs/getting-started/examples)
- [核心功能](/docs/core-features/rest-conversion) 