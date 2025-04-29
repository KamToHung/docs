# Gateway Proxy Service Configuration

## Cross-Origin Resource Sharing (CORS)
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

> **Note:** You must explicitly configure `Mcp-Session-Id` in both `allowHeaders` and `exposeHeaders`, otherwise the client will not be able to correctly request and read the `Mcp-Session-Id` in the response headers.

## Response Handling

Currently, there are **two response handling modes** supported:

### 1. Pass-through Response Body

No processing is done on the backend response, and it is directly forwarded to the client. Template example:

```yaml
responseBody: |-
  {{.Response.Body}}
```

### 2. Custom Field Response (Field Mapping)

Parse the backend response body as JSON structure, extract specific fields, and then return. Template example:

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
``` 