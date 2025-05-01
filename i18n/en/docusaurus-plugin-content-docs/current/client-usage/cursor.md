# Simple Guide to Configure MCP in Cursor

> **For more detailed Cursor MCP configuration tutorial, please refer to the official documentation:**  
> https://docs.cursor.com/context/model-context-protocol

Here I'll show you a basic configuration method. First, make sure you've created the necessary directories and files:

```bash
mkdir -p .cursor
touch .cursor/mcp.json
```

Then configure the MCP Server. Here we'll use our own mock user service for testing:

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

Next, open Cursor settings and enable this MCP Server in the **MCP** section. Once enabled, you'll see it turn into a small green dot, and it will also list the available Tools.

![.cursor/mcp.json](/img/cursor.mcp.servers.png)

Finally, you can try it in the Chat window, for example, by asking it to help you register a user and then query that user's information. If it works, you're all set!

For example, you can type:
```
Help me query the user ifuryst@gmail.com, if not found, please register one with username Leo
```
