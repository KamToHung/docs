# apiserver.yaml

Die Konfigurationsdatei unterstützt die Einbindung von Umgebungsvariablen mit der Syntax `${VAR:default}`. Wenn die Umgebungsvariable nicht gesetzt ist, wird der Standardwert verwendet.

Die übliche Praxis ist die Einbindung von Werten über verschiedene `.env`, `.env.development`, `.env.prod` Dateien, oder Sie können die Konfiguration direkt mit hartcodierten Werten ändern.

## Chat-Nachrichten-Datenbankkonfiguration

Diese Konfiguration ist speziell für die Speicherung von Chat-Nachrichten im Backend (obwohl sie die gleiche Datenbank mit Proxy-Konfigurationen teilen kann). Sie entspricht den Informationen, die im Bild unten gezeigt werden:

![Chat Sessions and Messages](/img/chat_histories.png)

Derzeit werden 3 Datenbanktypen unterstützt:
- SQLite3
- PostgreSQL
- MySQL

Wenn Sie Unterstützung für zusätzliche Datenbanken benötigen, können Sie dies im [Issue](https://github.com/mcp-ecosystem/mcp-gateway/issues)-Bereich anfordern, oder Sie können die entsprechende Implementierung selbst implementieren und einen PR einreichen :)

```yaml
database:
  type: "${APISERVER_DB_TYPE:sqlite}"               # Datenbanktyp (sqlite, postgres, mysql)
  host: "${APISERVER_DB_HOST:localhost}"            # Datenbank-Host-Adresse
  port: ${APISERVER_DB_PORT:5432}                   # Datenbankport
  user: "${APISERVER_DB_USER:postgres}"             # Datenbankbenutzername
  password: "${APISERVER_DB_PASSWORD:example}"      # Datenbankpasswort
  dbname: "${APISERVER_DB_NAME:./mcp-gateway.db}"   # Datenbankname oder Dateipfad
  sslmode: "${APISERVER_DB_SSL_MODE:disable}"       # SSL-Modus für Datenbankverbindung
```

## Gateway-Proxy-Speicherkonfiguration

Dies wird verwendet, um Gateway-Proxy-Konfigurationen zu speichern, insbesondere die Zuordnungen von MCP zu API, wie im Bild unten gezeigt:

![Gateway Proxy Configuration](/img/gateway_proxies.png)

Derzeit werden 2 Typen unterstützt:
- disk: Konfigurationen werden als Dateien auf der Festplatte gespeichert, wobei jede Konfiguration in einer separaten Datei liegt, ähnlich dem vhost-Konzept von nginx, z.B. `svc-a.yaml`, `svc-b.yaml`
- db: Speicherung in Datenbank, jede Konfiguration ist ein Datensatz. Derzeit werden drei Datenbanktypen unterstützt:
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # Speichertyp: db, disk
  
  # Datenbankkonfiguration (verwendet wenn type 'db' ist)
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # Datenbanktyp (sqlite, postgres, mysql)
    host: "${GATEWAY_DB_HOST:localhost}"                # Datenbank-Host-Adresse
    port: ${GATEWAY_DB_PORT:5432}                       # Datenbankport
    user: "${GATEWAY_DB_USER:postgres}"                 # Datenbankbenutzername
    password: "${GATEWAY_DB_PASSWORD:example}"          # Datenbankpasswort
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # Datenbankname oder Dateipfad
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # SSL-Modus für Datenbankverbindung
  
  # Festplattenkonfiguration (verwendet wenn type 'disk' ist)
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # Datenspeicherungspfad
```

## Benachrichtigungskonfiguration

Das Benachrichtigungsmodul wird hauptsächlich verwendet, um `mcp-gateway` über Konfigurationsaktualisierungen zu informieren und Hot-Reloads ohne Neustart des Dienstes auszulösen.

Derzeit werden 4 Benachrichtigungsmethoden unterstützt:
- signal: Benachrichtigung über Betriebssystemsignale, ähnlich wie `kill -SIGHUP <pid>` oder `nginx -s reload`. Kann über den Befehl `mcp-gateway reload` ausgelöst werden, geeignet für Einzelmaschinen-Deployment
- api: Benachrichtigung über einen API-Aufruf. `mcp-gateway` hört auf einem separaten Port und führt Hot-Reload bei Empfang von Anfragen durch. Kann über `curl http://localhost:5235/_reload` ausgelöst werden, geeignet für Einzelmaschinen- und Cluster-Deployments
- redis: Benachrichtigung über Redis-Pub/Sub-Funktionalität, geeignet für Einzelmaschinen- und Cluster-Deployments
- composite: Kombinierte Benachrichtigung, verwendet mehrere Methoden. Standardmäßig sind `signal` und `api` immer aktiviert und können mit anderen Methoden kombiniert werden. Geeignet für Einzelmaschinen- und Cluster-Deployments und ist der empfohlene Standardansatz

Benachrichtigungsrollen:
- sender: Sender-Rolle, verantwortlich für das Senden von Benachrichtigungen. `apiserver` kann nur diesen Modus verwenden
- receiver: Empfänger-Rolle, verantwortlich für den Empfang von Benachrichtigungen. Einzelmaschinen-`mcp-gateway` sollte nur diesen Modus verwenden
- both: Sowohl Sender- als auch Empfänger-Rolle. Cluster-deployed `mcp-gateway` kann diesen Modus verwenden

```yaml
notifier:
  role: "${APISERVER_NOTIFIER_ROLE:sender}"              # Rolle: sender, receiver oder both
  type: "${APISERVER_NOTIFIER_TYPE:signal}"              # Typ: signal, api, redis oder composite

  # Signalkonfiguration (verwendet wenn type 'signal' ist)
  signal:
    signal: "${APISERVER_NOTIFIER_SIGNAL:SIGHUP}"                       # Zu sendendes Signal
    pid: "${APISERVER_NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"    # PID-Dateipfad

  # API-Konfiguration (verwendet wenn type 'api' ist)
  api:
    port: ${APISERVER_NOTIFIER_API_PORT:5235}                                           # API-Port
    target_url: "${APISERVER_NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"    # Reload-Endpunkt

  # Redis-Konfiguration (verwendet wenn type 'redis' ist)
  redis:
    addr: "${APISERVER_NOTIFIER_REDIS_ADDR:localhost:6379}"                             # Redis-Adresse
    password: "${APISERVER_NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"   # Redis-Passwort
    db: ${APISERVER_NOTIFIER_REDIS_DB:0}                                                # Redis-Datenbanknummer
    topic: "${APISERVER_NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                       # Redis-Pub/Sub-Thema
```

## OpenAI API-Konfiguration

Der OpenAI-Konfigurationsblock definiert Einstellungen für die OpenAI API-Integration:

```yaml
openai:
  api_key: "${OPENAI_API_KEY}"                                  # OpenAI API-Schlüssel (erforderlich)
  model: "${OPENAI_MODEL:gpt-4.1}"                              # Zu verwendendes Modell
  base_url: "${OPENAI_BASE_URL:https://api.openai.com/v1/}"     # API-Basis-URL
```

Derzeit werden nur OpenAI API-kompatible LLM-Aufrufe integriert 