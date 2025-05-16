# 本地开发环境搭建指南

本文档介绍如何在本地设置和启动完整的 MCP Gateway 开发环境，包括启动所有必要的服务组件。

## 前提条件

在开始之前，请确保你的系统已安装以下软件：

- Git
- Go 1.24.1 或更高版本
- Node.js v20.18.0 或更高版本
- npm

## 项目架构概览

MCP Gateway 项目由以下几个核心组件组成：

1. **apiserver** - 提供配置管理、用户接口等 API 服务
2. **mcp-gateway** - 核心网关服务，处理 MCP 协议转换
3. **mock-user-svc** - 模拟用户服务，用于开发测试
4. **web** - 管理界面前端

## 启动开发环境

### 1. 克隆项目

访问 [MCP Gateway 代码仓库](https://github.com/mcp-ecosystem/mcp-gateway)，点击 `Fork` 按钮，将项目 fork 到你的 GitHub 账户下。

### 2. 克隆到本地

克隆你 fork 的仓库到本地：

```bash
git clone https://github.com/your-github-username/mcp-gateway.git
```

### 3. 初始化环境依赖

进入项目目录：
```bash
cd mcp-gateway
```

安装依赖：

```bash
go mod tidy
cd web
npm i
```

### 4. 启动开发环境

```bash
cp .env.example .env
cd web
cp .env.example .env
```

**注意**：可以不修改任何东西，使用默认配置启动就可以开始开发，但是你同样可以修改配置文件来满足你的环境或者开发需求，比如里面可以切换Disk、DB等


**注意**：你可能需要4个终端窗口来运行所有服务，这种在宿主机上运行多个服务的方式，在开发过程中可以轻松的重启调试等

#### 4.1 启动 mcp-gateway

```bash
go run cmd/gateway/main.go
```

mcp-gateway 默认会在 `http://localhost:5235` 上启动，用于处理 MCP 协议请求。

#### 4.2 启动 apiserver 

```bash
go run cmd/apiserver/main.go
```

apiserver 默认会在 `http://localhost:5234` 上启动。

#### 4.3 启动 mock-user-svc

```bash
go run cmd/mock-user-svc/main.go
```

mock-user-svc 默认会在 `http://localhost:5235` 上启动。

#### 4.4 启动 web 前端

```bash
npm run dev
```

web 前端默认会在 `http://localhost:5236` 上启动。

此时你就可以在浏览器中访问 http://localhost:5236 来访问管理界面了，默认用户名和密码根据你环境变量（根目录的.env文件）来决定，环境变量是`SUPER_ADMIN_USERNAME`和`SUPER_ADMIN_PASSWORD`，登录后可以在管理界面中修改用户名和密码


## 常见问题

### 环境变量设置

某些服务可能需要特定的环境变量才能正常工作。可以创建 `.env` 文件或在启动命令前设置这些变量：

```bash
# 示例
export OPENAI_API_KEY="your_api_key"
export OPENAI_MODEL="gpt-4o-mini"
export APISERVER_JWT_SECRET_KEY="your_secret_key"
```

## 下一步

成功启动本地开发环境后，你可以：

- 查看 [架构文档](./architecture) 深入了解系统组件
- 阅读 [配置指南](../configuration/gateways) 学习如何配置网关