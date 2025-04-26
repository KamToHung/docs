# Docker

## Image Overview

MCP Gateway offers two deployment methods:
1. **All-in-One Deployment**: All services are packaged into a single container, suitable for local or single-node deployments.
2. **Multi-Container Deployment**: Each service is deployed separately, suitable for production or cluster environments.

### Image Repositories

Images are published to the following registries:
- Docker Hub: `docker.io/ifuryst/mcp-gateway-*`
- GitHub Container Registry: `ghcr.io/mcp-ecosystem/mcp-gateway/*`
- Alibaba Cloud Container Registry: `registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-*`

*GitHub Container Registry supports multi-level directories for clearer organization, while Docker Hub and Alibaba Cloud registries use flat naming with hyphens.*

### Image Tags

- `latest`: Latest version
- `vX.Y.Z`: Specific version

> ⚡ **Note**: MCP Gateway is under rapid development! It is recommended to use specific version tags for more reliable deployments.

### Available Images

```bash
# All-in-One version
docker pull docker.io/ifuryst/mcp-gateway-allinone:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# API Server
docker pull docker.io/ifuryst/mcp-gateway-apiserver:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/apiserver:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-apiserver:latest

# MCP Gateway
docker pull docker.io/ifuryst/mcp-gateway-mcp-gateway:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mcp-gateway:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mcp-gateway:latest

# Mock User Service
docker pull docker.io/ifuryst/mcp-gateway-mock-user-svc:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mock-user-svc:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mock-user-svc:latest

# Web Frontend
docker pull docker.io/ifuryst/mcp-gateway-web:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/web:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-web:latest
```

## Deployment

### All-in-One Deployment

The All-in-One deployment packages all services into a single container, ideal for single-node or local deployments. It includes the following services:
- **API Server**: Management backend (Control Plane)
- **MCP Gateway**: Core service handling gateway traffic (Data Plane)
- **Mock User Service**: Simulated user service for testing (you can replace it with your actual existing API service)
- **Web Frontend**: Web-based management interface
- **Nginx**: Reverse proxy for internal services

Processes are managed using Supervisor, and all logs are output to stdout.

#### Ports

- `8080`: Web UI
- `5234`: API Server
- `5235`: MCP Gateway
- `5335`: MCP Gateway Admin (internal endpoints like reload; DO NOT expose in production)
- `5236`: Mock User Service

#### Data Persistence

It is recommended to mount the following directories:
- `/app/configs`: Configuration files
- `/app/data`: Data storage
- `/app/.env`: Environment variable file

#### Example Commands

1. Create necessary directories and download configuration files:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> You can replace the default LLM if needed (must be OpenAI compatible), e.g., use Qwen:
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Run MCP Gateway with Docker:

```bash
# Using Alibaba Cloud registry (recommended for servers/devices in China)
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
           registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# Using GitHub Container Registry
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

#### Notes

1. Ensure the configuration files and environment file are correctly set up.
2. It is recommended to use a specific version tag instead of `latest`.
3. Set appropriate resource limits for production deployments.
4. Ensure mounted directories have proper permissions.
