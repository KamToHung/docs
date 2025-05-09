# Cherry Studio配置MCP简易指南
Cherry Studio 是一款支持多个大语言模型（LLM）服务商的桌面客户端，兼容 Windows、Mac 和 Linux 系统。
Cherry Studio Github：[cherry-studio/docs/README.zh.md](https://github.com/CherryHQ/cherry-studio/blob/main/docs/README.zh.md)

> **更详细的 Cherry Studio 配置 MCP 教程请查看官方文档：**  
> https://docs.cherry-ai.com/advanced-basic/mcp

首先我们在设置的 **MCP 服务器** 中配置 MCP Server，这里我们直接用自己的模拟用户服务来试：
![cherrystudio.mcp.servers.png](/img/cherrystudio.mcp.servers.png)

接下来，点击右上角按钮启用后，点击 **工具** 可以看到此MCP服务中的tools，并且参数以及参数类型都会展示。

![cherrystudio.mcp.tools.png](/img/cherrystudio.mcp.tools.png)

最后就可以在 Chat 窗口里试一下，比如让它帮你注册一个用户，然后再查询这个用户的信息，跑通就 OK 了。

比如你可以输入：
```
帮我注册一个用户 Leo ifuryst@gmail.com
```

```
帮我查询一下用户ifuryst@gmail.com，如果没查到帮我注册一下，用户名是Leo
```

![cherrystudio.usecase.png](/img/cherrystudio.usecase.png)


> **和LLM进行聊天，可以看到在与LLM交互过程中，能够智能识别任务意图，并从工具集中选择最优工具进行自动化调用**