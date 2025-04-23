---
sidebar_position: 1
---

# REST API Conversion

## Overview

MCP Gateway provides powerful capabilities to convert RESTful APIs into MCP-Server format. This feature allows you to:

- Transform HTTP methods and paths into MCP method calls
- Map request parameters and body to MCP parameters
- Handle response transformation
- Support various authentication methods
- Implement rate limiting and caching

## Basic Conversion

### HTTP Method Mapping

```yaml
conversion:
  - name: basic-mapping
    source:
      type: rest
      method: GET    # Maps to MCP method
      path: /api/data
    target:
      type: mcp
      method: get_data
```

### Path Parameters

```yaml
conversion:
  - name: path-params
    source:
      type: rest
      method: GET
      path: /api/users/{userId}/orders/{orderId}
    target:
      type: mcp
      method: get_user_order
      params:
        user_id: ${path.userId}
        order_id: ${path.orderId}
```

## Advanced Features

### Request Transformation

```yaml
conversion:
  - name: complex-transformation
    source:
      type: rest
      method: POST
      path: /api/complex
    transform:
      request:
        - operation: map
          from: body.data
          to: params.input
        - operation: set
          field: params.timestamp
          value: ${now()}
    target:
      type: mcp
      method: process_complex
```

### Response Transformation

```yaml
conversion:
  - name: response-transform
    source:
      type: rest
      method: GET
      path: /api/transformed
    target:
      type: mcp
      method: get_transformed
    transform:
      response:
        - operation: map
          from: result.data
          to: data
        - operation: set
          field: metadata.timestamp
          value: ${now()}
```

## Security Features

### Authentication

```yaml
conversion:
  - name: authenticated
    source:
      type: rest
      method: GET
      path: /api/secure
    auth:
      type: jwt
      header: Authorization
      prefix: Bearer
    target:
      type: mcp
      method: get_secure_data
```

### Rate Limiting

```yaml
conversion:
  - name: rate-limited
    source:
      type: rest
      method: POST
      path: /api/limited
    rate_limit:
      requests_per_minute: 100
      burst_size: 20
    target:
      type: mcp
      method: process_limited
```

## Best Practices

1. **Use Meaningful Names**
   - Choose descriptive names for your conversion rules
   - Follow consistent naming conventions

2. **Error Handling**
   - Define clear error responses
   - Include helpful error messages
   - Map MCP errors to appropriate HTTP status codes

3. **Documentation**
   - Document all conversion rules
   - Include examples in your documentation
   - Maintain a changelog of modifications

## Next Steps

- [Configuration Guide](/docs/getting-started/configuration)
- [API Examples](/docs/getting-started/examples) 