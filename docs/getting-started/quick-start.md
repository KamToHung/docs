# 快速开始

## 设置 MCP Gateway

1. 创建必要的目录并下载配置文件：

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> 在中国境内的设备可以拉阿里云仓库的镜像
> 
> ```bash
> registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest
> ```

> LLMs可以按需更换，如换成千问
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. 使用 Docker 运行 MCP Gateway：

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

## 访问和配置

1. 访问 Web 界面：
   - 在浏览器中打开 http://localhost:8080/

2. 添加 MCP Server：
   - 复制配置文件：https://github.com/mcp-ecosystem/mcp-gateway/blob/main/configs/mock-user-svc.yaml
   - 在 Web 界面上点击 "Add MCP Server"
   - 粘贴配置并保存

   ![添加 MCP Server 示例](/img/add_mcp_server.png)

## 可用端点

配置完成后，服务将在以下端点可用：

- MCP SSE: http://localhost:5235/mcp/user/sse
- MCP Streamable HTTP: http://localhost:5235/mcp/user/message
- MCP: http://localhost:5235/mcp/user/mcp

## 测试

您可以通过以下两种方式测试服务：

1. 使用 Web 界面中的 MCP Chat 页面（需要在 .env.allinone 中配置 API KEY）
2. 使用您自己的 MCP Client（**推荐**）
