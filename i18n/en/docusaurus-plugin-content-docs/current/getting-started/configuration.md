---
sidebar_position: 2
---

# Configuration Guide

## Basic Configuration

The MCP Gateway configuration file is in YAML format. Here's a basic example:

```yaml
server:
  port: 8080
  host: 0.0.0.0

logging:
  level: info
  format: json

api:
  timeout: 30s
  max_retries: 3
```

## Advanced Configuration

### Authentication

```yaml
auth:
  type: jwt
  secret: your-secret-key
  expires_in: 24h
```

### Rate Limiting

```yaml
rate_limit:
  enabled: true
  requests_per_minute: 100
  burst_size: 20
```

### Caching

```yaml
cache:
  enabled: true
  ttl: 5m
  max_size: 1000
```

## Environment Variables

You can also use environment variables for configuration:

```bash
export MCP_GATEWAY_SERVER_PORT=8080
export MCP_GATEWAY_LOGGING_LEVEL=debug
```

## Next Steps

- [API Conversion Examples](/docs/getting-started/examples)
- [Core Features](/docs/core-features/rest-conversion) 