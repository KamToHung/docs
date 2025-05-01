# mcp-gateway.yaml

Die Konfigurationsdateien unterstützen die Einbindung von Umgebungsvariablen mit der Syntax `${VAR:default}`. Wenn die Umgebungsvariable nicht gesetzt ist, wird der Standardwert verwendet.

Die übliche Praxis ist die Einbindung über verschiedene `.env`, `.env.development`, `.env.prod` Dateien, oder Sie können die Konfiguration direkt mit einem festen Wert ändern.

## Grundkonfiguration

```yaml
port: ${MCP_GATEWAY_PORT:5235}                      # Service-Listening-Port
pid: "${MCP_GATEWAY_PID:/var/run/mcp-gateway.pid}"  # PID-Dateipfad
```

> Die PID hier sollte mit der unten erwähnten PID übereinstimmen

## Speicherkonfiguration

Das Speicherkonfigurationsmodul wird hauptsächlich zur Speicherung von Gateway-Proxy-Konfigurationsinformationen verwendet. Derzeit werden zwei Speichermethoden unterstützt:
- disk: Konfigurationen werden als Dateien auf der Festplatte gespeichert, wobei jede Konfiguration in einer separaten Datei liegt, ähnlich dem vhost-Konzept von nginx, z.B. `svc-a.yaml`, `svc-b.yaml`
- db: Speicherung in Datenbank, wobei jede Konfiguration ein Datensatz ist. Derzeit werden drei Datenbanken unterstützt:
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
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # Datenbank-SSL-Modus
  
  # Festplattenkonfiguration (verwendet wenn type 'disk' ist)
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # Datenspeicherungspfad
```

## Benachrichtigungskonfiguration

Das Benachrichtigungskonfigurationsmodul wird verwendet, um `mcp-gateway` über Konfigurationsaktualisierungen zu informieren und Hot-Reload ohne Neustart des Dienstes auszulösen.

Derzeit werden vier Benachrichtigungsmethoden unterstützt:
- signal: Benachrichtigung über Betriebssystemsignale, ähnlich wie `kill -SIGHUP <pid>` oder `nginx -s reload`, kann über den Befehl `mcp-gateway reload` aufgerufen werden, geeignet für Einzelmaschinen-Deployment
- api: Benachrichtigung über API-Aufrufe, `mcp-gateway` hört auf einem separaten Port und führt Hot-Reload bei Empfang von Anfragen durch, kann direkt über `curl http://localhost:5235/_reload` aufgerufen werden, geeignet für Einzelmaschinen- und Cluster-Deployment
- redis: Benachrichtigung über Redis-Pub/Sub-Funktionalität, geeignet für Einzelmaschinen- und Cluster-Deployment
- composite: Kombinierte Benachrichtigung, verwendet mehrere Methoden, mit standardmäßig aktiviertem `signal` und `api`, kann mit anderen Methoden kombiniert werden. Geeignet für Einzelmaschinen- und Cluster-Deployment, empfohlen als Standardmethode

Benachrichtigungsrollen:
- sender: Sender, verantwortlich für das Senden von Benachrichtigungen, `apiserver` kann nur diesen Modus verwenden
- receiver: Empfänger, verantwortlich für den Empfang von Benachrichtigungen, Einzelmaschinen-`mcp-gateway` sollte nur diesen Modus verwenden
- both: Sowohl Sender als auch Empfänger, Cluster-deployed `mcp-gateway` kann diesen Modus verwenden

```yaml
notifier:
  role: "${NOTIFIER_ROLE:receiver}" # Rolle: 'sender' oder 'receiver'
  type: "${NOTIFIER_TYPE:signal}"   # Typ: 'signal', 'api', 'redis' oder 'composite'

  # Signalkonfiguration (verwendet wenn type 'signal' ist)
  signal:
    signal: "${NOTIFIER_SIGNAL:SIGHUP}"                     # Zu sendendes Signal
    pid: "${NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"  # PID-Dateipfad

  # API-Konfiguration (verwendet wenn type 'api' ist)
  api:
    port: ${NOTIFIER_API_PORT:5235}                                         # API-Port
    target_url: "${NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"  # Reload-Endpunkt

  # Redis-Konfiguration (verwendet wenn type 'redis' ist)
  redis:
    addr: "${NOTIFIER_REDIS_ADDR:localhost:6379}"                               # Redis-Adresse
    password: "${NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"     # Redis-Passwort
    db: ${NOTIFIER_REDIS_DB:0}                                                  # Redis-Datenbanknummer
    topic: "${NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                         # Redis-Pub/Sub-Thema
```

## Sitzungsspeicherkonfiguration

Die Sitzungsspeicherkonfiguration wird zur Speicherung von MCP-Sitzungsinformationen verwendet. Derzeit werden zwei Speichermethoden unterstützt:
- memory: In-Memory-Speicherung, geeignet für Einzelmaschinen-Deployment (Hinweis: Sitzungsinformationen gehen beim Neustart verloren)
- redis: Redis-Speicherung, geeignet für Einzelmaschinen- und Cluster-Deployment

```yaml
session:
  type: "${SESSION_STORAGE_TYPE:memory}"                    # Speichertyp: memory, redis
  redis:
    addr: "${SESSION_REDIS_ADDR:localhost:6379}"            # Redis-Adresse
    password: "${SESSION_REDIS_PASSWORD:}"                  # Redis-Passwort
    db: ${SESSION_REDIS_DB:0}                               # Redis-Datenbanknummer
    topic: "${SESSION_REDIS_TOPIC:mcp-gateway:session}"     # Redis-Pub/Sub-Thema
``` 