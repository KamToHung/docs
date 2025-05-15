# Guía de uso de Go Template

Este documento explica cómo usar Go Template en MCP Gateway para manejar datos de solicitud y respuesta. Go Template proporciona capacidades de plantilla potentes que nos ayudan a procesar de manera flexible la transformación y el formateo de datos.

## Sintaxis básica

Go Template usa `{{}}` como delimitadores, dentro de los cuales se pueden usar varias funciones y variables. En MCP Gateway, principalmente usamos las siguientes variables:

- `.Config`: Configuración a nivel de servicio
- `.Args`: Parámetros de solicitud
- `.Request`: Información de solicitud original
- `.Response`: Información de respuesta del servicio upstream

## Casos de uso comunes

### 1. Obtener configuración desde variables de entorno

```yaml
config:
  Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Obtener configuración desde variable de entorno
```

### 2. Extraer valores desde encabezados de solicitud

```yaml
headers:
  Authorization: "{{.Request.Headers.Authorization}}"   # Reenviar encabezado Authorization del cliente
  Cookie: "{{.Config.Cookie}}"                         # Usar valor de la configuración del servicio
```

### 3. Construir cuerpo de solicitud

```yaml
requestBody: |-
  {
    "username": "{{.Args.username}}",
    "email": "{{.Args.email}}"
  }
```

### 4. Procesar datos de respuesta

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
```

### 5. Procesar datos de respuesta anidados

```yaml
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

### 6. Procesar datos de array

Al procesar datos de array en respuestas, puedes usar la funcionalidad range de Go Template:

```yaml
responseBody: |-
  {
    "total": "{{.Response.Data.total}}",
    "rows": [
      {{- $len := len .Response.Data.rows -}}
      {{- $rows := fromJSON .Response.Data.rows }}
      {{- range $i, $e := $rows }}
      {
        "id": {{ $e.id }},
        "detail": "{{ $e.detail }}",
        "deviceName": "{{ $e.deviceName }}"
      }{{ if lt (add $i 1) $len }},{{ end }}
      {{- end }}
    ]
  }
```

Este ejemplo demuestra:
1. Usar la función `fromJSON` para convertir una cadena JSON en un objeto recorrible
2. Usar `range` para iterar sobre el array
3. Usar la función `len` para obtener la longitud del array
4. Usar la función `add` para operaciones matemáticas
5. Usar declaraciones condicionales para controlar la separación por comas entre elementos del array

### 7. Usar parámetros en URLs

```yaml
endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
```

### 8. Manejar datos de objetos complejos

Cuando necesites convertir estructuras complejas como objetos o arrays en solicitudes o respuestas a JSON, puedes usar la función `toJSON`:

```yaml
requestBody: |-
  {
    "isPublic": {{.Args.isPublic}},
    "showEmail": {{.Args.showEmail}},
    "theme": "{{.Args.theme}}",
    "tags": {{.Args.tags}},
    "settings": {{ toJSON .Args.settings }}
  }
```

En este caso, `settings` es un objeto complejo que será convertido automáticamente a una cadena JSON usando la función `toJSON`.

## Funciones incorporadas

Funciones incorporadas actualmente soportadas:

1. `env`: Obtener valor de variable de entorno
   ```yaml
   Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'
   ```

2. `add`: Realizar suma de enteros
   ```yaml
   {{ if lt (add $i 1) $len }},{{ end }}
   ```

3. `fromJSON`: Convertir cadena JSON en objeto recorrible
   ```yaml
   {{- $rows := fromJSON .Response.Data.rows }}
   ```

4. `toJSON`: Convertir un objeto a cadena JSON
   ```yaml
   "settings": {{ toJSON .Args.settings }}
   ```

Para agregar nuevas funciones de plantilla:
1. Describir el caso de uso específico y crear un issue
2. Se aceptan contribuciones PR, pero actualmente solo se aceptan funciones de propósito general

## Recursos adicionales

- [Documentación oficial de Go Template](https://pkg.go.dev/text/template) 