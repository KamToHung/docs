# Gateway Proxy Service Konfiguration

## Cross-Origin Resource Sharing (CORS)
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

> **Hinweis:** Sie müssen `Mcp-Session-Id` explizit sowohl in `allowHeaders` als auch in `exposeHeaders` konfigurieren, andernfalls kann der Client die `Mcp-Session-Id` in den Antwort-Headers nicht korrekt anfordern und lesen.

## Antwortverarbeitung

Derzeit werden **zwei Antwortverarbeitungsmodi** unterstützt:

### 1. Durchgängige Antwort-Body

Es wird keine Verarbeitung der Backend-Antwort durchgeführt, sie wird direkt an den Client weitergeleitet. Vorlagenbeispiel:

```yaml
responseBody: |-
  {{.Response.Body}}
```

### 2. Benutzerdefinierte Feldantwort (Feldabbildung)

Analysiert den Backend-Antwort-Body als JSON-Struktur, extrahiert spezifische Felder und gibt diese zurück. Vorlagenbeispiel:

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
``` 