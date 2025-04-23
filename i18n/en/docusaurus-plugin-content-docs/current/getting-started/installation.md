---
sidebar_position: 1
---

# Installation Guide

## Prerequisites

- Go 1.20 or later
- Docker (optional, for containerized deployment)
- Kubernetes cluster (optional, for Kubernetes deployment)

## Installation Methods

### 1. Using Go

```bash
go install github.com/mcp-ecosystem/mcp-gateway@latest
```

### 2. Using Docker

```bash
docker pull mcp-ecosystem/mcp-gateway:latest
```

### 3. Using Kubernetes

```bash
kubectl apply -f https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/main/deploy/kubernetes/deployment.yaml
```

## Configuration

After installation, you need to configure the gateway. The default configuration file is located at:

- Linux/Mac: `~/.mcp-gateway/config.yaml`
- Windows: `%APPDATA%\mcp-gateway\config.yaml`

## Next Steps

- [Configuration Guide](/docs/getting-started/configuration)
- [API Conversion Examples](/docs/getting-started/examples) 