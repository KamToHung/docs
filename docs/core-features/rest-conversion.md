---
sidebar_position: 1
---

# RESTful API 转换

## 概述

MCP Gateway 支持将现有的 RESTful API 转换为 MCP-Server 格式，无需修改原有服务代码。转换过程通过配置文件完成，支持请求和响应的格式转换。

## 基本配置

### 路由配置

```yaml
routes:
  - path: "/api/users"
    target: "http://user-service:8080"
    methods: ["GET", "POST"]
```

### 请求转换

```yaml
transform:
  request:
    body:
      type: "object"
      properties:
        name: { type: "string" }
        age: { type: "number" }
    headers:
      Authorization: "Bearer {token}"
```

### 响应转换

```yaml
transform:
  response:
    body:
      type: "object"
      properties:
        id: { type: "string" }
        name: { type: "string" }
        age: { type: "number" }
    headers:
      Content-Type: "application/json"
```

## 高级特性

### 路径参数

支持 RESTful 风格的路径参数：

```yaml
routes:
  - path: "/api/users/{userId}/posts/{postId}"
    target: "http://user-service:8080/users/{userId}/posts/{postId}"
    methods: ["GET"]
```

### 查询参数

支持查询参数的转换：

```yaml
transform:
  request:
    query:
      page: { type: "number" }
      limit: { type: "number" }
```

### 请求体转换

支持复杂的请求体转换：

```yaml
transform:
  request:
    body:
      type: "object"
      properties:
        user:
          type: "object"
          properties:
            name: { type: "string" }
            email: { type: "string" }
            address:
              type: "object"
              properties:
                street: { type: "string" }
                city: { type: "string" }
```

### 响应体转换

支持复杂的响应体转换：

```yaml
transform:
  response:
    body:
      type: "object"
      properties:
        data:
          type: "array"
          items:
            type: "object"
            properties:
              id: { type: "string" }
              name: { type: "string" }
        meta:
          type: "object"
          properties:
            total: { type: "number" }
            page: { type: "number" }
```

## 错误处理

### 错误响应转换

```yaml
transform:
  response:
    error:
      type: "object"
      properties:
        code: { type: "string" }
        message: { type: "string" }
        details: { type: "object" }
```

## 最佳实践

1. 使用语义化的路径命名
2. 保持 API 版本控制
3. 使用适当的 HTTP 方法
4. 实现合理的错误处理
5. 考虑性能优化

## 下一步

- [gRPC API 转换](/docs/core-features/grpc-conversion)
- [请求/响应转换](/docs/core-features/request-response) 