# Quick Start

## Set Up MCP Gateway

1. Create the necessary directories and download the configuration files:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> If you are in mainland China, you can pull images from Alibaba Cloud registry:
>
> ```bash
> registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest
> ```

> You can also replace the default LLM if needed, for example, switch to Qwen:
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Run MCP Gateway with Docker:

```bash
docker run -d \
           --name mcp-gateway \
           -p 8080:80 \
           -p 5234:5234 \
           -p 5235:5235 \
           -p 5335:5335 \
           -p 5236:5236 \
           -e ENV=production \
           -v $(pwd)/configs:/app/configs \
           -v $(pwd)/data:/app/data \
           -v $(pwd)/.env.allinone:/app/.env \
           --restart unless-stopped \
           ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
```

## Access and Configuration

1. Access the Web UI:
   - Open your browser and navigate to http://localhost:8080/

2. Add a new MCP Server:
   - Copy the configuration file: https://github.com/mcp-ecosystem/mcp-gateway/blob/main/configs/mock-user-svc.yaml
   - Click "Add MCP Server" in the Web UI
   - Paste the configuration and save

   ![Add MCP Server Example](/img/add_mcp_server.png)

## Available Endpoints

Once configured, the services will be available at the following endpoints:

- MCP SSE: http://localhost:5235/mcp/user/sse
- MCP Streamable HTTP: http://localhost:5235/mcp/user/message
- MCP: http://localhost:5235/mcp/user/mcp

## Testing

You can test the service in two ways:

1. Use the MCP Chat page in the Web UI (requires configuring an API KEY in `.env.allinone`)
2. Use your own MCP Client (**Recommended**)
