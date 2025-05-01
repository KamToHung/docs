# Configuración del servicio de proxy de gateway

## CORS (Cross-Origin Resource Sharing)
```yaml
routers:
  - server: "user"
    prefix: "/mcp/user"
    cors:
      allowOrigins:
        - "*"
      allowMethods:
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"
        - "Authorization"
        - "Mcp-Session-Id"
      exposeHeaders:
        - "Mcp-Session-Id"
      allowCredentials: true
```

> **Nota:** Es necesario configurar explícitamente `Mcp-Session-Id` en `allowHeaders` y `exposeHeaders`, de lo contrario, el cliente no podrá solicitar y leer correctamente el encabezado `Mcp-Session-Id` en la respuesta.

## Procesamiento de respuestas

Actualmente se admiten **dos modos de procesamiento de respuestas**:

### 1. Pasar a través del cuerpo de la respuesta (Pass-through)

No se realiza ningún procesamiento en la respuesta del backend, se reenvía directamente al cliente. Ejemplo de plantilla:

```yaml
responseBody: |-
  {{.Response.Body}}
```

### 2. Respuesta con mapeo de campos personalizado (Field Mapping)

Analiza el cuerpo de la respuesta del backend como estructura JSON, extrae campos específicos y luego los devuelve. Ejemplo de plantilla:

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
``` 