# Quick Start Guide

## Setup MCP Gateway

1. Create necessary directories and download configuration files:

```bash
mkdir mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

2. Run MCP Gateway using Docker:

```bash
docker run -d \
  --name mcp-gateway \
  -p 80:80 \
  -p 5234:5234 \
  -p 5235:5235 \
  -p 5236:5236 \
  -e ENV=production \
  -e VITE_MCP_GATEWAY_URL=VITE_MCP_GATEWAY_URL \
  -v $(pwd)/configs:/app/configs \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/.env.allinone:/app/.env \
  --restart unless-stopped \
  ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
```

## Access and Configuration

1. Access the web interface:
   - Open http://localhost/ in your browser

2. Add MCP Server:
   - Copy the configuration from: https://github.com/mcp-ecosystem/mcp-gateway/blob/main/configs/mock-user-svc.yaml
   - Click "Add MCP Server" on the web interface
   - Paste the configuration and save

   ![Add MCP Server Example](/img/add_mcp_server.png)

## Available Endpoints

After configuration, the service will be available at the following endpoints:

- MCP SSE: http://localhost/api/v1/user/sse
- MCP Streamable HTTP: http://localhost/api/v1/user/message
- MCP: http://localhost/api/v1/user/mcp

## Testing

You can test the service in two ways:

1. Using the MCP Chat page in the web interface (requires API KEY configuration in .env.allinone)
2. Using your own MCP Client
