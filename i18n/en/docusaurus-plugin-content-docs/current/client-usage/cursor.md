# Simple Guide to Configure MCP in Cursor

> **For more detailed Cursor MCP configuration tutorial, please refer to the official documentation:**  
> https://docs.cursor.com/context/model-context-protocol

Here I'll show you a basic configuration method. Make sure you've created the necessary directories and files:

```bash
mkdir -p .cursor
touch .cursor/mcp.json
```

Then configure the MCP Server. Here we'll use our mock user service for testing:

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

Next, open Cursor settings and enable this MCP Server in the **MCP** section. After enabling, you'll see it turn into a small green dot, and it will also list the available Tools.

![.cursor/mcp.json](/img/cursor.mcp.servers.png)

Finally, you can try it in the Chat window. For example, ask it to help you register a user and then query that user's information. If it works, you're all set.

You can try typing:
```
Help me register a user Leo ifuryst@gmail.com
```

```
Help me query the user ifuryst@gmail.com, if not found please register one with username Leo
```

> **Through actual testing, we found that this mock service may cause model errors in some cases due to name and email handling, which can be ignored. You can use your actual API instead.**

![cursor usecase](/img/cursor.usecase.png)
