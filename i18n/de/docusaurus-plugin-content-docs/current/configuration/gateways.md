# Gateway-Dienst Konfiguration

## Konfigurationsbeispiel

Nachfolgend finden Sie ein vollständiges Konfigurationsbeispiel, das Routing, CORS, Antwortverarbeitung und andere Einstellungen umfasst:

```yaml
name: "mock-server"             # Proxy-Dienstname, global eindeutig

# Router-Konfiguration
routers:
  - server: "mock-server"       # Dienstname
    prefix: "/mcp/user"         # Routenpräfix, global eindeutig, kann nicht wiederholt werden, empfohlen zur Unterscheidung nach Dienst oder Domäne+Modul

    # CORS-Konfiguration
    cors:
      allowOrigins:             # Für Entwicklungs- und Testumgebungen kann alles geöffnet werden; für die Produktion ist es am besten, nach Bedarf zu öffnen. (Die meisten MCP-Clients benötigen kein CORS)
        - "*"
      allowMethods:             # Erlaubte Anfragemethoden, nach Bedarf öffnen. Für MCP (SSE und Streamable) werden normalerweise nur diese 3 Methoden benötigt
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"        # Muss erlaubt sein
        - "Authorization"       # Muss diesen Schlüssel in der Anfrage für Authentifizierungsbedürfnisse unterstützen
        - "Mcp-Session-Id"      # Für MCP ist es notwendig, diesen Schlüssel in der Anfrage zu unterstützen, andernfalls kann Streamable HTTP nicht normal verwendet werden
      exposeHeaders:
        - "Mcp-Session-Id"      # Für MCP muss dieser Schlüssel bei aktiviertem CORS exponiert werden, andernfalls kann Streamable HTTP nicht normal verwendet werden
      allowCredentials: true    # Ob der Header Access-Control-Allow-Credentials: true hinzugefügt werden soll
```

### 1. Grundkonfiguration

- `name`: Proxy-Dienstname, global eindeutig, verwendet zur Identifizierung verschiedener Proxy-Dienste
- `routers`: Router-Konfigurationsliste, definiert Anfrageweiterleitungsregeln
- `servers`: Server-Konfigurationsliste, definiert Dienst-Metadaten und erlaubte Tools
- `tools`: Tool-Konfigurationsliste, definiert spezifische API-Aufrufregeln

Sie können eine Konfiguration als Namespace behandeln, empfohlen zur Unterscheidung nach Dienst oder Domäne. Ein Dienst enthält viele API-Schnittstellen, jede API-Schnittstelle entspricht einem Tool.

### 2. Router-Konfiguration

Die Router-Konfiguration wird verwendet, um Anfrageweiterleitungsregeln zu definieren:

```yaml
routers:
  - server: "mock-server"       # Dienstname, muss mit dem Namen in servers übereinstimmen
    prefix: "/mcp/user"         # Routenpräfix, global eindeutig, kann nicht wiederholt werden
```

- `body`: Parameter werden im JSON-Anfragekörper platziert
- `form-data`: Parameter werden im multipart/form-data-Anfragekörper platziert, verwendet für Datei-Uploads und andere Szenarien

Jeder Parameter kann einen Standardwert haben. Wenn ein Parameter in der MCP-Anfrage nicht angegeben wird, wird der Standardwert automatisch verwendet. Auch wenn der Standardwert eine leere Zeichenfolge ("") ist, wird er verwendet. Zum Beispiel:

```yaml
args:
  - name: "theme"
    position: "body"
    required: true
    type: "string"
    description: "User interface theme"
    default: "light"    # Wenn der theme-Parameter in der Anfrage nicht angegeben wird, wird "light" als Standardwert verwendet
```

Wenn `form-data` als Parameterposition verwendet wird, muss `requestBody` nicht angegeben werden, das System assembliert die Parameter automatisch im multipart/form-data-Format. Zum Beispiel: 