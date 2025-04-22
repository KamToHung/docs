---
sidebar_position: 1
---

# 安装指南

## 环境要求

- Go 1.20 或更高版本
- Node.js 16 或更高版本（用于前端开发）
- Docker（可选，用于容器化部署）
- Kubernetes（可选，用于集群部署）

## 后端服务安装

### 网关服务

1. 克隆项目
```bash
git clone https://github.com/mcp-ecosystem/mcp-gateway.git
cd mcp-gateway
```

2. 安装依赖
```bash
go mod download
```

3. 运行服务
```bash
go run ./cmd/mcp-gateway/main.go
```

### 管理服务

1. 进入管理服务目录
```bash
cd mcp-gateway
```

2. 安装依赖
```bash
go mod download
```

3. 运行服务
```bash
go run cmd/apiserver/main.go
```

## 前端开发环境

1. 进入前端目录
```bash
cd web
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

## Docker 部署

1. 构建 Docker 镜像
```bash
docker build -t mcp-gateway .
```

2. 运行容器
```bash
docker run -d -p 8080:8080 mcp-gateway
```

## 验证安装

安装完成后，你可以通过以下方式验证服务是否正常运行：

1. 访问管理界面：`http://localhost:3000`
2. 检查网关服务状态：`http://localhost:8080/health`
3. 检查管理服务状态：`http://localhost:8081/health`

## 常见问题

### 端口冲突
如果默认端口（8080, 8081）被占用，可以通过环境变量修改：
```bash
export GATEWAY_PORT=8082
export API_SERVER_PORT=8083
```

### 依赖安装失败
如果遇到依赖安装问题，可以尝试：
```bash
go mod tidy
npm cache clean --force
```

## 下一步

- [配置说明](/docs/getting-started/configuration)
- [API 转换示例](/docs/getting-started/examples) 