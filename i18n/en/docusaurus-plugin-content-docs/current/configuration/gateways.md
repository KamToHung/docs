# Gateway Proxy Service Configuration

## Configuration Example

Here is a complete configuration example, including routing, CORS, response handling, and other configurations:

```yaml
name: "mock-user-svc"                 # Proxy service name, globally unique

# Routing configuration
routers:
  - server: "mock-user-svc"     # Service name
    prefix: "/mcp/user"         # Route prefix, globally unique, cannot be duplicated, recommended to distinguish by service or domain+module

    # CORS configuration
    cors:
      allowOrigins:             # Can be fully open in development/test environments, better to open selectively in production (most MCP Clients don't need CORS)
        - "*"
      allowMethods:             # Allowed request methods, open as needed, for MCP (SSE and Streamable) usually only these 3 methods are needed
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"        # Must be allowed
        - "Authorization"       # Required if authentication is needed
        - "Mcp-Session-Id"      # For MCP, must support this Key in requests, otherwise Streamable HTTP won't work properly
      exposeHeaders:
        - "Mcp-Session-Id"      # For MCP, must expose this Key when CORS is enabled, otherwise Streamable HTTP won't work properly
      allowCredentials: true    # Whether to add Access-Control-Allow-Credentials: true header

# Service configuration
servers:
  - name: "mock-user-svc"             # Service name, must match server in routers
    namespace: "user-service"         # Service namespace, used for service grouping
    description: "Mock User Service"  # Service description
    allowedTools:                     # List of allowed tools (subset of tools)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # Service-level configuration, can be referenced in tools via {{.Config}}
      Cookie: 123                                     # Hard-coded configuration
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Configuration from environment variables, usage is '{{ env "ENV_VAR_NAME" }}'

# Tool configuration
tools:
  - name: "register_user"                                   # Tool name
    description: "Register a new user"                      # Tool description
    method: "POST"                                          # HTTP method for requesting target (upstream, backend) service
    endpoint: "http://localhost:5236/users"                 # Target service address
    headers:                                                # Request header configuration, headers to carry when requesting target service
      Content-Type: "application/json"                      # Hard-coded header
      Authorization: "{{.Request.Headers.Authorization}}"   # Use Authorization header extracted from client request (for passthrough scenarios)
      Cookie: "{{.Config.Cookie}}"                          # Use value from service configuration
    args:                         # Parameter configuration
      - name: "username"          # Parameter name
        position: "body"          # Parameter position: header, query, path, body
        required: true            # Whether parameter is required
        type: "string"            # Parameter type
        description: "Username"   # Parameter description
        default: ""               # Default value
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # Request body template, for dynamically generating request body, e.g., values extracted from parameters (MCP request arguments)
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # Response body template, for dynamically generating response body, e.g., values extracted from response
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }

  - name: "get_user_by_email"
    description: "Get user by email"
    method: "GET"
    endpoint: "http://localhost:5236/users/email/{{.Args.email}}"
    args:
      - name: "email"
        position: "path"
        required: true
        type: "string"
        description: "Email"
        default: ""
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }

  - name: "update_user_preferences"
    description: "Update user preferences"
    method: "PUT"
    endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
    headers:
      Content-Type: "application/json"
      Authorization: "{{.Request.Headers.Authorization}}"
      Cookie: "{{.Config.Cookie}}"
    args:
      - name: "email"
        position: "path"
        required: true
        type: "string"
        description: "Email"
        default: ""
      - name: "isPublic"
        position: "body"
        required: true
        type: "boolean"
        description: "Whether the user profile is public"
        default: "false"
      - name: "showEmail"
        position: "body"
        required: true
        type: "boolean"
        description: "Whether to show email in profile"
        default: "true"
      - name: "theme"
        position: "body"
        required: true
        type: "string"
        description: "User interface theme"
        default: "light"
      - name: "tags"
        position: "body"
        required: true
        type: "array"
        items:
           type: "string"
           enum: ["developer", "designer", "manager", "tester"]
        description: "User role tags"
        default: "[]"
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}",
        "preferences": {
          "isPublic": {{.Response.Data.preferences.isPublic}},
          "showEmail": {{.Response.Data.preferences.showEmail}},
          "theme": "{{.Response.Data.preferences.theme}}",
          "tags": {{.Response.Data.preferences.tags}}
        }
      }
```

## Configuration Description

### 1. Basic Configuration

- `name`: Proxy service name, globally unique, used to identify different proxy services
- `routers`: List of routing configurations, defining request forwarding rules
- `servers`: List of service configurations, defining service metadata and allowed tools
- `tools`: List of tool configurations, defining specific API call rules

A configuration can be considered as a namespace, recommended to distinguish by service or domain, where a service contains many API interfaces, each API interface corresponding to a Tool

### 2. Routing Configuration

Routing configuration is used to define request forwarding rules:

```yaml
routers:
  - server: "mock-user-svc"     # Service name, must match name in servers
    prefix: "/mcp/user"         # Route prefix, globally unique, cannot be duplicated
```

By default, three endpoints will be derived from the `prefix`:
- SSE: `${prefix}/sse`, e.g., `/mcp/user/sse`
- SSE: `${prefix}/message`, e.g., `/mcp/user/message`
- StreamableHTTP: `${prefix}/mcp`, e.g., `/mcp/user/mcp`

### 3. CORS Configuration

Cross-Origin Resource Sharing (CORS) configuration is used to control cross-origin request access permissions:

```yaml
cors:
  allowOrigins:             # Can be fully open in development/test environments, better to open selectively in production (most MCP Clients don't need CORS)
    - "*"
  allowMethods:             # Allowed request methods, open as needed, for MCP (SSE and Streamable) usually only these 3 methods are needed
    - "GET"
    - "POST"
    - "OPTIONS"
  allowHeaders:
    - "Content-Type"        # Must be allowed
    - "Authorization"       # Required if authentication is needed
    - "Mcp-Session-Id"      # For MCP, must support this Key in requests, otherwise Streamable HTTP won't work properly
  exposeHeaders:
    - "Mcp-Session-Id"      # For MCP, must expose this Key when CORS is enabled, otherwise Streamable HTTP won't work properly
  allowCredentials: true    # Whether to add Access-Control-Allow-Credentials: true header
```

> **Usually, MCP Clients don't need CORS enabled**

### 4. Service Configuration

Service configuration is used to define service metadata, associated tool list, and service-level configuration:

```yaml
servers:
  - name: "mock-user-svc"             # Service name, must match server in routers
    namespace: "user-service"         # Service namespace, used for service grouping
    description: "Mock User Service"  # Service description
    allowedTools:                     # List of allowed tools (subset of tools)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # Service-level configuration, can be referenced in tools via {{.Config}}
      Cookie: 123                                     # Hard-coded configuration
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Configuration from environment variables, usage is '{{ env "ENV_VAR_NAME" }}'
```

Service-level configuration can be referenced in tools via `{{.Config}}`. Here you can either hard-code values in the configuration file or get them from environment variables. For environment variable injection, use the format `{{ env "ENV_VAR_NAME" }}`

### 5. Tool Configuration

Tool configuration is used to define specific API call rules:

```yaml
tools:
  - name: "register_user"                                   # Tool name
    description: "Register a new user"                      # Tool description
    method: "POST"                                          # HTTP method for requesting target (upstream, backend) service
    endpoint: "http://localhost:5236/users"                 # Target service address
    headers:                                                # Request header configuration, headers to carry when requesting target service
      Content-Type: "application/json"                      # Hard-coded header
      Authorization: "{{.Request.Headers.Authorization}}"   # Use Authorization header extracted from client request (for passthrough scenarios)
      Cookie: "{{.Config.Cookie}}"                          # Use value from service configuration
    args:                         # Parameter configuration
      - name: "username"          # Parameter name
        position: "body"          # Parameter position: header, query, path, body
        required: true            # Whether parameter is required
        type: "string"            # Parameter type
        description: "Username"   # Parameter description
        default: ""               # Default value
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # Request body template, for dynamically generating request body, e.g., values extracted from parameters (MCP request arguments)
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # Response body template, for dynamically generating response body, e.g., values extracted from response
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

#### 5.1 Request Parameter Assembly

When requesting the target service, parameters need to be assembled. Currently, there are several sources:
1. `.Config`: Extract values from service-level configuration
2. `.Args`: Extract values directly from request parameters
3. `.Request`: Extract values from the request, including headers `.Request.Headers`, body `.Request.Body`, etc.

Assembly is done in `requestBody`, for example:
```yaml
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
```

Including `endpoint` (target address) can also use the above sources to extract values, for example `http://localhost:5236/users/{{.Args.email}}/preferences` extracts values from request parameters

#### 5.2 Response Parameter Assembly

Response body assembly is similar to request body assembly:
1. `.Response.Data`: Extract values from response, response must be in JSON format to extract
2. `.Response.Body`: Directly pass through the entire response body, ignoring response content format, directly passed to client

All are extracted via `.Response`, for example:
```yaml
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

## Configuration Storage

Gateway proxy configuration can be stored in two ways:

1. Database storage (recommended):
    - Supports SQLite3, PostgreSQL, MySQL
    - Each configuration stored as a record
    - Supports dynamic updates and hot reload

2. File storage:
    - Each configuration stored as a separate YAML file
    - Similar to Nginx's vhost configuration approach
    - Filename recommended to use service name, e.g., `mock-user-svc.yaml` 
