# Configuración del Servicio de Gateway

## Ejemplo de Configuración

A continuación se muestra un ejemplo completo de configuración, que incluye enrutamiento, CORS, manejo de respuestas y otras configuraciones:

```yaml
name: "mock-user-svc"                 # Nombre del servicio proxy, único globalmente

# Configuración del Router
routers:
  - server: "mock-user-svc"     # Nombre del servicio
    prefix: "/mcp/user"         # Prefijo de ruta, único globalmente, no puede repetirse, se recomienda distinguir por servicio o dominio+módulo

    # Configuración CORS
    cors:
      allowOrigins:             # Para entornos de desarrollo y pruebas, todo puede abrirse; para producción, es mejor abrir según sea necesario. (La mayoría de los Clientes MCP no necesitan CORS)
        - "*"
      allowMethods:             # Métodos de solicitud permitidos, abrir según sea necesario. Para MCP (SSE y Streamable), generalmente solo se requieren estos 3 métodos
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"        # Debe permitirse
        - "Authorization"       # Necesita soportar llevar esta clave en la solicitud para necesidades de autenticación
        - "Mcp-Session-Id"      # Para MCP, es necesario soportar llevar esta clave en la solicitud, de lo contrario Streamable HTTP no puede usarse normalmente
      exposeHeaders:
        - "Mcp-Session-Id"      # Para MCP, esta clave debe exponerse cuando CORS está habilitado, de lo contrario Streamable HTTP no puede usarse normalmente
      allowCredentials: true    # Si se debe agregar el encabezado Access-Control-Allow-Credentials: true
```

### 1. Configuración Básica

- `name`: Nombre del servicio proxy, único globalmente, utilizado para identificar diferentes servicios proxy
- `routers`: Lista de configuración de router, define reglas de reenvío de solicitudes
- `servers`: Lista de configuración de servidor, define metadatos de servicio y herramientas permitidas
- `tools`: Lista de configuración de herramientas, define reglas específicas de llamada a API

Puede tratar una configuración como un espacio de nombres, recomendado para distinguir por servicio o dominio. Un servicio contiene muchas interfaces API, cada interfaz API corresponde a una Herramienta.

### 2. Configuración del Router

La configuración del router se utiliza para definir reglas de reenvío de solicitudes:

```yaml
routers:
  - server: "mock-user-svc"     # Nombre del servicio, debe ser coherente con el nombre en servers
    prefix: "/mcp/user"         # Prefijo de ruta, único globalmente, no puede repetirse
```

- `body`: Los parámetros se colocarán en el cuerpo de la solicitud JSON
- `form-data`: Los parámetros se colocarán en el cuerpo de la solicitud multipart/form-data, utilizado para cargas de archivos y otros escenarios

Cada parámetro puede tener un valor predeterminado. Cuando no se proporciona un parámetro en la solicitud MCP, se utilizará automáticamente el valor predeterminado. Incluso si el valor predeterminado es una cadena vacía (""), se utilizará. Por ejemplo:

```yaml
args:
  - name: "theme"
    position: "body"
    required: true
    type: "string"
    description: "User interface theme"
    default: "light"    # Cuando no se proporciona el parámetro theme en la solicitud, se usará "light" como valor predeterminado
```

Cuando se usa `form-data` como posición del parámetro, no es necesario especificar `requestBody`, el sistema ensamblará automáticamente los parámetros en formato multipart/form-data. Por ejemplo: 