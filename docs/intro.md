---
sidebar_position: 1
---

# MCP Gateway 文档

MCP Gateway 是一个轻量级且高可用的网关服务，使用 Go 语言开发，旨在帮助个人和企业轻松地将现有的 API 服务（RESTful、gRPC 等）通过配置转换为 MCP-Server。

## 主要特性

- 🌐 **平台无关**：可以在任何环境中轻松集成，包括裸机、虚拟机、ECS、K8s，无需修改基础设施
- 🔁 **多协议转换**：支持通过配置将 RESTful 和 gRPC API 转换为 MCP-Server
- ⚡️ **高性能和复制友好**：轻量级设计，同时保持高可用性和性能
- 🧭 **用户友好的管理界面**：降低学习和维护成本

## 快速开始

- [安装指南](/docs/getting-started/installation)
- [配置说明](/docs/getting-started/configuration)
- [API 转换示例](/docs/getting-started/examples)

## 文档结构

1. **入门指南**
   - 安装与配置
   - 基本概念
   - 快速上手

2. **核心功能**
   - RESTful API 转换
   - gRPC API 转换
   - 请求/响应转换
   - 会话管理

3. **部署与运维**
   - Docker 部署
   - Kubernetes 集成
   - 监控与日志
   - 性能优化

4. **API 参考**
   - 管理接口
   - 转换规则
   - 配置参数

## 贡献指南

我们欢迎任何形式的贡献！如果你发现文档中有任何问题或想要添加新的内容，请随时提交 Pull Request。

## 联系我们

如果你有任何问题或建议，请通过以下方式联系我们：

- [GitHub Issues](https://github.com/mcp-ecosystem/mcp-gateway/issues)
- 邮件支持
- 社区论坛
