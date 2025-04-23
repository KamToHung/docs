---
sidebar_position: 3
---

# API Conversion Examples

## RESTful API to MCP-Server

### Example 1: Simple GET Request

```yaml
conversion:
  - name: user-profile
    source:
      type: rest
      method: GET
      path: /api/users/{id}
    target:
      type: mcp
      method: get_user
      params:
        user_id: ${path.id}
```

### Example 2: POST Request with Body Transformation

```yaml
conversion:
  - name: create-user
    source:
      type: rest
      method: POST
      path: /api/users
    target:
      type: mcp
      method: create_user
      params:
        name: ${body.name}
        email: ${body.email}
        role: ${body.role || 'user'}
```

## gRPC API to MCP-Server

### Example 1: Unary RPC

```yaml
conversion:
  - name: get-product
    source:
      type: grpc
      service: ProductService
      method: GetProduct
    target:
      type: mcp
      method: get_product
      params:
        product_id: ${request.id}
```

### Example 2: Server Streaming

```yaml
conversion:
  - name: stream-products
    source:
      type: grpc
      service: ProductService
      method: StreamProducts
    target:
      type: mcp
      method: stream_products
      params:
        category: ${request.category}
        limit: ${request.limit || 10}
```

## Advanced Examples

### Error Handling

```yaml
conversion:
  - name: safe-operation
    source:
      type: rest
      method: POST
      path: /api/operations
    target:
      type: mcp
      method: perform_operation
      params:
        operation: ${body.operation}
      error_handling:
        - status: 400
          message: Invalid operation
        - status: 500
          message: Internal server error
```

### Request Validation

```yaml
conversion:
  - name: validate-user
    source:
      type: rest
      method: POST
      path: /api/validate
    validation:
      body:
        required:
          - username
          - password
        properties:
          username:
            type: string
            minLength: 3
          password:
            type: string
            minLength: 8
    target:
      type: mcp
      method: validate_user
      params:
        username: ${body.username}
        password: ${body.password}
```

## Next Steps

- [Core Features](/docs/core-features/rest-conversion)
- [Configuration Guide](/docs/getting-started/configuration) 