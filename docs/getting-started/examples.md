---
sidebar_position: 3
---

# API 转换示例

## RESTful API 转换

### 基本转换

将 RESTful API 转换为 MCP-Server 格式：

```yaml
routes:
  - path: "/api/users"
    target: "http://user-service:8080"
    methods: ["GET", "POST"]
    transform:
      request:
        body:
          type: "object"
          properties:
            name: { type: "string" }
            age: { type: "number" }
      response:
        body:
          type: "object"
          properties:
            id: { type: "string" }
            name: { type: "string" }
            age: { type: "number" }
```

### 路径参数转换

处理带路径参数的 API：

```yaml
routes:
  - path: "/api/users/{userId}"
    target: "http://user-service:8080/users/{userId}"
    methods: ["GET", "PUT", "DELETE"]
    transform:
      request:
        path:
          userId: { type: "string" }
```

## gRPC API 转换

### 基本转换

将 gRPC 服务转换为 MCP-Server：

```yaml
routes:
  - path: "/grpc/user"
    target: "grpc://user-service:50051"
    service: "UserService"
    method: "GetUser"
    transform:
      request:
        body:
          type: "object"
          properties:
            id: { type: "string" }
      response:
        body:
          type: "object"
          properties:
            user: { type: "object" }
```

## 请求/响应转换

### 请求转换

修改请求体格式：

```yaml
transform:
  request:
    body:
      type: "object"
      properties:
        input:
          type: "object"
          properties:
            data: { type: "string" }
    headers:
      Authorization: "Bearer {token}"
```

### 响应转换

修改响应体格式：

```yaml
transform:
  response:
    body:
      type: "object"
      properties:
        result:
          type: "object"
          properties:
            status: { type: "string" }
            data: { type: "object" }
    headers:
      Content-Type: "application/json"
```

## 完整示例

### 用户服务 API 转换

```yaml
routes:
  - path: "/api/v1/users"
    target: "http://user-service:8080"
    methods: ["GET", "POST"]
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
      response:
        body:
          type: "object"
          properties:
            user:
              type: "object"
              properties:
                id: { type: "string" }
                name: { type: "string" }
                email: { type: "string" }
                createdAt: { type: "string" }
```

## 下一步

- [RESTful API 转换](/docs/core-features/rest-conversion)
- [gRPC API 转换](/docs/core-features/grpc-conversion) 