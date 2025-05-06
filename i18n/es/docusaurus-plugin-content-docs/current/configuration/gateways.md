# Configuración del Servicio Proxy Gateway

## Ejemplo de Configuración

Aquí hay un ejemplo completo de configuración que incluye enrutamiento, CORS, procesamiento de respuestas y otras configuraciones:

```yaml
name: "mock-user-svc"                 # Nombre del servicio proxy, globalmente único

# Configuración de enrutamiento
routers:
  - server: "mock-user-svc"     # Nombre del servicio
    prefix: "/mcp/user"         # Prefijo de ruta, globalmente único, no debe duplicarse, se recomienda diferenciar por servicio o dominio+módulo

    # Configuración CORS
    cors:
      allowOrigins:             # Abrir completamente en entornos de desarrollo/prueba, abrir selectivamente en producción (la mayoría de los clientes MCP no necesitan CORS)
        - "*"
      allowMethods:             # Métodos de solicitud permitidos, abrir según sea necesario, para MCP (SSE y Streamable) generalmente solo se necesitan estos 3 métodos
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"        # Debe estar permitido
        - "Authorization"       # Requerido si se necesita autenticación
        - "Mcp-Session-Id"      # Para MCP, esta clave debe ser soportada en las solicitudes, de lo contrario Streamable HTTP no funcionará correctamente
      exposeHeaders:
        - "Mcp-Session-Id"      # Para MCP, esta clave debe ser expuesta cuando CORS está habilitado, de lo contrario Streamable HTTP no funcionará correctamente
      allowCredentials: true    # Si se debe agregar el encabezado Access-Control-Allow-Credentials: true

# Configuración del servicio
servers:
  - name: "mock-user-svc"             # Nombre del servicio, debe coincidir con server en routers
    namespace: "user-service"         # Namespace del servicio, usado para agrupar servicios
    description: "Mock User Service"  # Descripción del servicio
    allowedTools:                     # Lista de herramientas permitidas (subconjunto de tools)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # Configuración a nivel de servicio, puede ser referenciada en tools a través de {{.Config}}
      Cookie: 123                                     # Configuración codificada
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Configuración desde variables de entorno, el uso es '{{ env "ENV_VAR_NAME" }}'

# Configuración de herramientas
tools:
  - name: "register_user"                                   # Nombre de la herramienta
    description: "Register a new user"                      # Descripción de la herramienta
    method: "POST"                                          # Método HTTP para solicitudes al servicio objetivo (upstream, backend)
    endpoint: "http://localhost:5236/users"                 # Dirección del servicio objetivo
    headers:                                                # Configuración de encabezados de solicitud, encabezados a incluir en solicitudes al servicio objetivo
      Content-Type: "application/json"                      # Encabezado codificado
      Authorization: "{{.Request.Headers.Authorization}}"   # Uso del encabezado Authorization extraído de la solicitud del cliente (para escenarios de paso a través)
      Cookie: "{{.Config.Cookie}}"                          # Uso del valor desde la configuración del servicio
    args:                         # Configuración de parámetros
      - name: "username"          # Nombre del parámetro
        position: "body"          # Posición del parámetro: header, query, path, body
        required: true            # Si el parámetro es requerido
        type: "string"            # Tipo del parámetro
        description: "Username"   # Descripción del parámetro
        default: ""               # Valor por defecto
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # Plantilla del cuerpo de solicitud, para generación dinámica del cuerpo de solicitud, ej. valores extraídos de parámetros (argumentos de solicitud MCP)
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # Plantilla del cuerpo de respuesta, para generación dinámica del cuerpo de respuesta, ej. valores extraídos de la respuesta
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

## Descripción de la Configuración

### 1. Configuración Básica

- `name`: Nombre del servicio proxy, globalmente único, usado para identificar diferentes servicios proxy
- `routers`: Lista de configuraciones de enrutamiento, define reglas de reenvío de solicitudes
- `servers`: Lista de configuraciones de servicio, define metadatos del servicio y herramientas permitidas
- `tools`: Lista de configuraciones de herramientas, define reglas específicas de llamada API

Una configuración puede considerarse como un namespace, se recomienda diferenciar por servicio o dominio, donde un servicio contiene muchas interfaces API, cada una correspondiente a una herramienta

### 2. Configuración de Enrutamiento

La configuración de enrutamiento se usa para definir reglas de reenvío de solicitudes:

```yaml
routers:
  - server: "mock-user-svc"     # Nombre del servicio, debe coincidir con name en servers
    prefix: "/mcp/user"         # Prefijo de ruta, globalmente único, no debe duplicarse
```

Por defecto, se derivan tres endpoints del `prefix`:
- SSE: `${prefix}/sse`, ej. `/mcp/user/sse`
- SSE: `${prefix}/message`, ej. `/mcp/user/message`
- StreamableHTTP: `${prefix}/mcp`, ej. `/mcp/user/mcp`

### 3. Configuración CORS

La configuración Cross-Origin Resource Sharing (CORS) se usa para controlar los permisos de acceso para solicitudes cross-origin:

```yaml
cors:
  allowOrigins:             # Abrir completamente en entornos de desarrollo/prueba, abrir selectivamente en producción (la mayoría de los clientes MCP no necesitan CORS)
    - "*"
  allowMethods:             # Métodos de solicitud permitidos, abrir según sea necesario, para MCP (SSE y Streamable) generalmente solo se necesitan estos 3 métodos
    - "GET"
    - "POST"
    - "OPTIONS"
  allowHeaders:
    - "Content-Type"        # Debe estar permitido
    - "Authorization"       # Requerido si se necesita autenticación
    - "Mcp-Session-Id"      # Para MCP, esta clave debe ser soportada en las solicitudes, de lo contrario Streamable HTTP no funcionará correctamente
  exposeHeaders:
    - "Mcp-Session-Id"      # Para MCP, esta clave debe ser expuesta cuando CORS está habilitado, de lo contrario Streamable HTTP no funcionará correctamente
  allowCredentials: true    # Si se debe agregar el encabezado Access-Control-Allow-Credentials: true
```

> **Normalmente, los clientes MCP no necesitan CORS habilitado**

### 4. Configuración del Servicio

La configuración del servicio se usa para definir metadatos del servicio, listas de herramientas asociadas y configuraciones a nivel de servicio:

```yaml
servers:
  - name: "mock-user-svc"             # Nombre del servicio, debe coincidir con server en routers
    namespace: "user-service"         # Namespace del servicio, usado para agrupar servicios
    description: "Mock User Service"  # Descripción del servicio
    allowedTools:                     # Lista de herramientas permitidas (subconjunto de tools)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # Configuración a nivel de servicio, puede ser referenciada en tools a través de {{.Config}}
      Cookie: 123                                     # Configuración codificada
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Configuración desde variables de entorno, el uso es '{{ env "ENV_VAR_NAME" }}'
```

Las configuraciones a nivel de servicio pueden ser referenciadas en tools a través de `{{.Config}}`. Aquí puede codificar valores en el archivo de configuración o recuperarlos desde variables de entorno. Para la inyección de variables de entorno, use el formato `{{ env "ENV_VAR_NAME" }}`

### 5. Configuración de Herramientas

La configuración de herramientas se usa para definir reglas específicas de llamada API:

```yaml
tools:
  - name: "register_user"                                   # Nombre de la herramienta
    description: "Register a new user"                      # Descripción de la herramienta
    method: "POST"                                          # Método HTTP para solicitudes al servicio objetivo (upstream, backend)
    endpoint: "http://localhost:5236/users"                 # Dirección del servicio objetivo
    headers:                                                # Configuración de encabezados de solicitud, encabezados a incluir en solicitudes al servicio objetivo
      Content-Type: "application/json"                      # Encabezado codificado
      Authorization: "{{.Request.Headers.Authorization}}"   # Uso del encabezado Authorization extraído de la solicitud del cliente (para escenarios de paso a través)
      Cookie: "{{.Config.Cookie}}"                          # Uso del valor desde la configuración del servicio
    args:                         # Configuración de parámetros
      - name: "username"          # Nombre del parámetro
        position: "body"          # Posición del parámetro: header, query, path, body
        required: true            # Si el parámetro es requerido
        type: "string"            # Tipo del parámetro
        description: "Username"   # Descripción del parámetro
        default: ""               # Valor por defecto
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # Plantilla del cuerpo de solicitud, para generación dinámica del cuerpo de solicitud, ej. valores extraídos de parámetros (argumentos de solicitud MCP)
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # Plantilla del cuerpo de respuesta, para generación dinámica del cuerpo de respuesta, ej. valores extraídos de la respuesta
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

#### 5.1 Ensamblaje de Parámetros de Solicitud

Al realizar solicitudes al servicio objetivo, los parámetros deben ser ensamblados. Actualmente, existen las siguientes fuentes:
1. `.Config`: Extraer valores de configuraciones a nivel de servicio
2. `.Args`: Extraer valores directamente de parámetros de solicitud
3. `.Request`: Extraer valores de la solicitud, incluyendo encabezados `.Request.Headers`, cuerpo `.Request.Body`, etc.

El ensamblaje se realiza en `requestBody`, por ejemplo:
```yaml
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
```

`endpoint` (dirección objetivo) también puede usar las fuentes anteriores para extraer valores, por ejemplo `http://localhost:5236/users/{{.Args.email}}/preferences` extrae valores de parámetros de solicitud

#### 5.2 Ensamblaje de Parámetros de Respuesta

El ensamblaje del cuerpo de respuesta es similar al ensamblaje del cuerpo de solicitud:
1. `.Response.Data`: Extraer valores de la respuesta, la respuesta debe estar en formato JSON
2. `.Response.Body`: Transmitir directamente todo el cuerpo de respuesta, ignorar el formato del contenido de la respuesta y transmitirlo directamente al cliente

Todo se extrae a través de `.Response`, por ejemplo:
```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
``` 

## Almacenamiento de la Configuración

La configuración del proxy gateway puede almacenarse de dos maneras:

1. Almacenamiento en base de datos (recomendado):
    - Soporta SQLite3, PostgreSQL, MySQL
    - Cada configuración se almacena como un registro
    - Soporta actualizaciones dinámicas y recarga en caliente

2. Almacenamiento en archivos:
    - Cada configuración se almacena como un archivo YAML separado
    - Similar al enfoque de configuración vhost de Nginx
    - El nombre del archivo debe usar el nombre del servicio, ej. `mock-user-svc.yaml` 
