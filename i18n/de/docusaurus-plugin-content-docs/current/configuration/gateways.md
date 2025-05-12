# Gateway-Proxy-Service-Konfiguration

## Konfigurationsbeispiel

Hier ist ein vollständiges Konfigurationsbeispiel, das Routing, CORS, Antwortverarbeitung und andere Konfigurationen enthält:

```yaml
name: "mock-user-svc"                 # Proxy-Service-Name, global eindeutig

# Routing-Konfiguration
routers:
  - server: "mock-user-svc"     # Service-Name
    prefix: "/mcp/user"         # Routenpräfix, global eindeutig, darf nicht dupliziert werden, empfohlen nach Service oder Domain+Modul zu unterscheiden

    # CORS-Konfiguration
    cors:
      allowOrigins:             # In Entwicklungs-/Testumgebungen vollständig öffnen, in Produktionsumgebungen selektiv öffnen (die meisten MCP-Clients benötigen kein CORS)
        - "*"
      allowMethods:             # Erlaubte Anforderungsmethoden, nach Bedarf öffnen, für MCP (SSE und Streamable) werden normalerweise nur diese 3 Methoden benötigt
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"        # Muss erlaubt sein
        - "Authorization"       # Erforderlich, wenn Authentifizierung benötigt wird
        - "Mcp-Session-Id"      # Für MCP muss dieser Key in Anfragen unterstützt werden, sonst funktioniert Streamable HTTP nicht richtig
      exposeHeaders:
        - "Mcp-Session-Id"      # Für MCP muss dieser Key bei aktiviertem CORS freigegeben werden, sonst funktioniert Streamable HTTP nicht richtig
      allowCredentials: true    # Ob der Access-Control-Allow-Credentials: true Header hinzugefügt werden soll

# Service-Konfiguration
servers:
  - name: "mock-user-svc"             # Service-Name, muss mit server in routers übereinstimmen
    namespace: "user-service"         # Service-Namespace, für Service-Gruppierung verwendet
    description: "Mock User Service"  # Service-Beschreibung
    allowedTools:                     # Liste der erlaubten Tools (Teilmenge von tools)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # Service-Level-Konfiguration, kann in tools über {{.Config}} referenziert werden
      Cookie: 123                                     # Fest codierte Konfiguration
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Konfiguration aus Umgebungsvariablen, Verwendung ist '{{ env "ENV_VAR_NAME" }}'

# Tool-Konfiguration
tools:
  - name: "register_user"                                   # Tool-Name
    description: "Register a new user"                      # Tool-Beschreibung
    method: "POST"                                          # HTTP-Methode für Anforderungen an den Ziel- (Upstream-, Backend-) Service
    endpoint: "http://localhost:5236/users"                 # Ziel-Service-Adresse
    headers:                                                # Anforderungsheader-Konfiguration, Header, die bei Anforderungen an den Ziel-Service mitgeführt werden
      Content-Type: "application/json"                      # Fest codierter Header
      Authorization: "{{.Request.Headers.Authorization}}"   # Verwendung des aus der Client-Anforderung extrahierten Authorization-Headers (für Passthrough-Szenarien)
      Cookie: "{{.Config.Cookie}}"                          # Verwendung des Werts aus der Service-Konfiguration
    args:                         # Parameter-Konfiguration
      - name: "username"          # Parameter-Name
        position: "body"          # Parameter-Position: header, query, path, body
        required: true            # Ob der Parameter erforderlich ist
        type: "string"            # Parameter-Typ
        description: "Username"   # Parameter-Beschreibung
        default: ""               # Standardwert
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # Anforderungskörper-Template, für dynamische Generierung des Anforderungskörpers, z.B. aus Parametern (MCP-Anforderungsargumenten) extrahierte Werte
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # Antwortkörper-Template, für dynamische Generierung des Antwortkörpers, z.B. aus der Antwort extrahierte Werte
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

## Konfigurationsbeschreibung

### 1. Grundlegende Konfiguration

- `name`: Proxy-Service-Name, global eindeutig, wird zur Identifizierung verschiedener Proxy-Services verwendet
- `routers`: Liste der Routing-Konfigurationen, definiert Anforderungsweiterleitungsregeln
- `servers`: Liste der Service-Konfigurationen, definiert Service-Metadaten und erlaubte Tools
- `tools`: Liste der Tool-Konfigurationen, definiert spezifische API-Aufrufregeln

Eine Konfiguration kann als Namespace betrachtet werden, empfohlen wird die Unterscheidung nach Service oder Domain, wobei ein Service viele API-Schnittstellen enthält, von denen jede einem Tool entspricht

### 2. Routing-Konfiguration

Die Routing-Konfiguration wird verwendet, um Regeln für die Weiterleitung von Anfragen zu definieren:

```yaml
routers:
  - server: "mock-user-svc"     # Dienstname, muss mit Name in servers übereinstimmen
    prefix: "/mcp/user"         # Routenpräfix, global eindeutig, kann nicht dupliziert werden
```

Standardmäßig werden drei Endpunkte vom `prefix` abgeleitet:
- SSE: `${prefix}/sse`, z.B. `/mcp/user/sse`
- SSE Message: `${prefix}/message`, z.B. `/mcp/user/message`
- StreamableHTTP: `${prefix}/mcp`, z.B. `/mcp/user/mcp`

### 3. CORS-Konfiguration

Die Cross-Origin Resource Sharing (CORS)-Konfiguration wird verwendet, um die Zugriffsberechtigungen für Cross-Origin-Anfragen zu steuern:

```yaml
cors:
  allowOrigins:             # In Entwicklungs-/Testumgebungen vollständig öffnen, in Produktionsumgebungen selektiv öffnen (die meisten MCP-Clients benötigen kein CORS)
    - "*"
  allowMethods:             # Erlaubte Anforderungsmethoden, nach Bedarf öffnen, für MCP (SSE und Streamable) werden normalerweise nur diese 3 Methoden benötigt
    - "GET"
    - "POST"
    - "OPTIONS"
  allowHeaders:
    - "Content-Type"        # Muss erlaubt sein
    - "Authorization"       # Erforderlich, wenn Authentifizierung benötigt wird
    - "Mcp-Session-Id"      # Für MCP muss dieser Key in Anfragen unterstützt werden, sonst funktioniert Streamable HTTP nicht richtig
  exposeHeaders:
    - "Mcp-Session-Id"      # Für MCP muss dieser Key bei aktiviertem CORS freigegeben werden, sonst funktioniert Streamable HTTP nicht richtig
  allowCredentials: true    # Ob der Access-Control-Allow-Credentials: true Header hinzugefügt werden soll
```

> **Normalerweise benötigen MCP-Clients kein aktiviertes CORS**

### 4. Service-Konfiguration

Die Service-Konfiguration wird verwendet, um Service-Metadaten, zugehörige Tool-Listen und Service-Level-Konfigurationen zu definieren:

```yaml
servers:
  - name: "mock-user-svc"             # Service-Name, muss mit server in routers übereinstimmen
    namespace: "user-service"         # Service-Namespace, für Service-Gruppierung verwendet
    description: "Mock User Service"  # Service-Beschreibung
    allowedTools:                     # Liste der erlaubten Tools (Teilmenge von tools)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # Service-Level-Konfiguration, kann in tools über {{.Config}} referenziert werden
      Cookie: 123                                     # Fest codierte Konfiguration
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Konfiguration aus Umgebungsvariablen, Verwendung ist '{{ env "ENV_VAR_NAME" }}'
```

Service-Level-Konfigurationen können in tools über `{{.Config}}` referenziert werden. Hier können Sie entweder Werte in der Konfigurationsdatei fest codieren oder sie aus Umgebungsvariablen abrufen. Für Umgebungsvariablen-Injektion verwenden Sie das Format `{{ env "ENV_VAR_NAME" }}`

### 5. Tool-Konfiguration

Die Tool-Konfiguration wird verwendet, um spezifische API-Aufrufregeln zu definieren:

```yaml
tools:
  - name: "register_user"                                   # Tool-Name
    description: "Register a new user"                      # Tool-Beschreibung
    method: "POST"                                          # HTTP-Methode für Anforderungen an den Ziel- (Upstream-, Backend-) Service
    endpoint: "http://localhost:5236/users"                 # Ziel-Service-Adresse
    headers:                                                # Anforderungsheader-Konfiguration, Header, die bei Anforderungen an den Ziel-Service mitgeführt werden
      Content-Type: "application/json"                      # Fest codierter Header
      Authorization: "{{.Request.Headers.Authorization}}"   # Verwendung des aus der Client-Anforderung extrahierten Authorization-Headers (für Passthrough-Szenarien)
      Cookie: "{{.Config.Cookie}}"                          # Verwendung des Werts aus der Service-Konfiguration
    args:                         # Parameter-Konfiguration
      - name: "username"          # Parameter-Name
        position: "body"          # Parameter-Position: header, query, path, body
        required: true            # Ob der Parameter erforderlich ist
        type: "string"            # Parameter-Typ
        description: "Username"   # Parameter-Beschreibung
        default: ""               # Standardwert
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # Anforderungskörper-Template, für dynamische Generierung des Anforderungskörpers, z.B. aus Parametern (MCP-Anforderungsargumenten) extrahierte Werte
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # Antwortkörper-Template, für dynamische Generierung des Antwortkörpers, z.B. aus der Antwort extrahierte Werte
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

#### 5.1 Anforderungsparameter-Zusammenstellung

Bei Anforderungen an den Ziel-Service müssen Parameter zusammengestellt werden. Derzeit gibt es folgende Quellen:
1. `.Config`: Werte aus Service-Level-Konfigurationen extrahieren
2. `.Args`: Werte direkt aus Anforderungsparametern extrahieren
3. `.Request`: Werte aus der Anforderung extrahieren, einschließlich Header `.Request.Headers`, Body `.Request.Body` usw.

Die Zusammenstellung erfolgt in `requestBody`, zum Beispiel:
```yaml
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
```

Auch `endpoint` (Zieladresse) kann die obigen Quellen verwenden, um Werte zu extrahieren, zum Beispiel extrahiert `http://localhost:5236/users/{{.Args.email}}/preferences` Werte aus Anforderungsparametern

#### 5.2 Antwortparameter-Zusammenstellung

Die Antwortkörper-Zusammenstellung ist ähnlich wie die Anforderungskörper-Zusammenstellung:
1. `.Response.Data`: Werte aus der Antwort extrahieren, die Antwort muss im JSON-Format sein
2. `.Response.Body`: Den gesamten Antwortkörper direkt durchreichen, das Antwortinhaltformat ignorieren und direkt an den Client übergeben

Alle werden über `.Response` extrahiert, zum Beispiel:
```yaml
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

## Konfigurationsspeicherung

Die Gateway-Proxy-Konfiguration kann auf zwei Arten gespeichert werden:

1. Datenbankspeicherung (empfohlen):
    - Unterstützt SQLite3, PostgreSQL, MySQL
    - Jede Konfiguration wird als ein Datensatz gespeichert
    - Unterstützt dynamische Updates und Hot-Reload

2. Dateispeicherung:
    - Jede Konfiguration wird als separate YAML-Datei gespeichert
    - Ähnlich wie Nginx's vhost-Konfigurationsansatz
    - Dateiname sollte den Service-Namen verwenden, z.B. `mock-user-svc.yaml` 
