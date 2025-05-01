# Cursor配置MCP简易指南

> **更详细的 Cursor 配置 MCP 教程请查看官方文档：**  
> https://docs.cursor.com/context/model-context-protocol

这边我简单展示一个最基础的配置方式，确保你已经创建了相关的目录和文件：

```bash
mkdir -p .cursor
touch .cursor/mcp.json
```

然后配置 MCP Server，这里我们直接用自己的模拟用户服务来试：

![.cursor/mcp.json](/img/cursor.mcp.json.png)

```json
{
  "mcpServers": {
    "user": {
      "url": "http://localhost:5235/mcp/user/sse"
    }
  }
}
```

接下来，打开 Cursor 设置，在 **MCP** 栏里启用这个 MCP Server。启用之后你会看到它变成一个小绿点，同时还会列出可用的 Tools。


![.cursor/mcp.json](/img/cursor.mcp.servers.png)

最后就可以在 Chat 窗口里试一下，比如让它帮你注册一个用户，然后再查询这个用户的信息，跑通就 OK 了。

比如你可以输入：
```
帮我查询一下用户ifuryst@gmail.com，如果没查到帮我注册一下，用户名是Leo
```

