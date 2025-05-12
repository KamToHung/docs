# MCP Gateway Architecture Overview

Provides an overview of the MCP Gateway system architecture, including the gateway itself, management backend, supporting APIs, storage mechanisms, and integration methods with external services.

---

## Architecture Diagram

![MCP Gateway Architecture](https://www.mermaidchart.com/raw/32023f97-aaa9-4563-a4fe-2f0f4da28916?theme=light&version=v0.1&format=svg)

---

## Module Description

### MCP Gateway (mcp-gateway)
- **Entry Point**: `/*` Unified HTTP request listener, dynamically routes based on configuration at the application layer
- **Routing Layer**: Routes based on prefixes and suffixes `/sse`, `/message`, `/mcp`
- **Protocol Parsing**: Parses JSON-RPC format, extracts methods and parameters
- **Tool Distribution**: Parses tool names, constructs call parameters
- **External Service Calls**: Initiates calls to external services and parses results
- **Configuration Storage (Read)**: Loads configuration information

### Management Backend (web)
- **Proxy Configuration Module**: Used for configuring MCP gateway proxies/tools
- **Chat Lab**: Simple Chat for testing MCP, mainly for developers and users who need to integrate into self-developed systems
- **User Management Module**: User permissions and information maintenance

### Management Backend Service (apiserver)
- **Main Service Module**: Provides APIs for configuration management, user interface, chat history query, etc.
- **Configuration Storage (Write)**: Writes modifications to the database
- **Notifier (Sender)**: Notifies MCP gateway for hot updates when configuration changes

### Configuration Storage
- Stores all MCP services, tools, routes, and other configurations
- Supports multiple implementations: disk (yaml), SQLite, PostgreSQL, MySQL, etc.

### Web Data Storage
- Stores user data, session records, etc.
- Supports multiple implementations: SQLite, PostgreSQL, MySQL, etc.

### External Services
- Backend service systems required for tool calls 