# Cherry Studio MCP Configuration Guide
Cherry Studio is a desktop client that supports multiple Large Language Model (LLM) service providers, compatible with Windows, Mac, and Linux systems.
Cherry Studio Github: [cherry-studio/docs/README.zh.md](https://github.com/CherryHQ/cherry-studio/blob/main/docs/README.zh.md)

> **For more detailed Cherry Studio MCP configuration tutorial, please refer to the official documentation:**  
> https://docs.cherry-ai.com/advanced-basic/mcp

First, we configure the MCP Server in the **MCP Servers** settings. Here we'll use our own simulated user service for testing:
![cherrystudio.mcp.servers.png](../../../../../static/img/cherrystudio.mcp.servers.png)

Next, after enabling it by clicking the button in the top right corner, click on **Tools** to see the tools in this MCP service, along with their parameters and parameter types.

![cherrystudio.mcp.tools.png](../../../../../static/img/cherrystudio.mcp.tools.png)

Finally, you can try it out in the Chat window. For example, ask it to register a user and then query that user's information. If it works, you're all set.

For example, you can type:
```
Help me register a user Leo ifuryst@gmail.com
```

```
Help me query the user ifuryst@gmail.com, if not found, please register one with username Leo
```

![cherrystudio.mcp.servers.choose.png](../../../../../static/img/cherrystudio.mcp.servers.choose.png)
![cherrystudio.usecase.png](../../../../../static/img/cherrystudio.usecase.png)

> **When chatting with LLM, you can see that during the interaction process, it intelligently recognizes task intentions and automatically selects the optimal tools from the toolset for automated calls**