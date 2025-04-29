# 网关代理服务配置


## 跨域
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

> **注意：** 必须在 `allowHeaders` 和 `exposeHeaders` 中显式配置 `Mcp-Session-Id`，否则客户端无法正确请求和读取响应头中的 `Mcp-Session-Id`。


## 响应处理

目前支持 **两种响应处理模式**：

### 1. 透传响应体（Pass-through）

不对后端响应做任何处理，直接转发给客户端。模板示例：

```yaml
responseBody: |-
  {{.Response.Body}}
```

### 2. 自定义字段响应（Field Mapping）

将后端响应体按 JSON 结构解析，提取特定字段后再返回。模板示例：

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
```
