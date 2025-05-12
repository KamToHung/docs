# MCP Gateway Architekturübersicht

Bietet einen Überblick über die MCP Gateway-Systemarchitektur, einschließlich des Gateways selbst, des Management-Backends, unterstützender APIs, Speichermechanismen und Integrationsmethoden mit externen Diensten.

---

## Architekturdiagramm

![MCP Gateway Architecture](https://www.mermaidchart.com/raw/32023f97-aaa9-4563-a4fe-2f0f4da28916?theme=light&version=v0.1&format=svg)

---

## Modulbeschreibung

### MCP Gateway (mcp-gateway)
- **Einstiegspunkt**: `/*` Einheitlicher HTTP-Anfragen-Listener, dynamisches Routing basierend auf der Konfiguration auf Anwendungsebene
- **Routing-Schicht**: Routing basierend auf Präfixen und Suffixen `/sse`, `/message`, `/mcp`
- **Protokoll-Analyse**: Analysiert JSON-RPC-Format, extrahiert Methoden und Parameter
- **Tool-Verteilung**: Analysiert Tool-Namen, konstruiert Aufrufparameter
- **Externe Dienstaufrufe**: Initiiert Aufrufe an externe Dienste und analysiert Ergebnisse
- **Konfigurationsspeicher (Lesen)**: Lädt Konfigurationsinformationen

### Management-Backend (web)
- **Proxy-Konfigurationsmodul**: Wird zur Konfiguration von MCP Gateway-Proxies/Tools verwendet
- **Chat-Labor**: Einfacher Chat zum Testen von MCP, hauptsächlich für Entwickler und Benutzer, die es in selbst entwickelte Systeme integrieren müssen
- **Benutzerverwaltungsmodul**: Wartung von Benutzerberechtigungen und -informationen

### Management-Backend-Service (apiserver)
- **Hauptdienstmodul**: Stellt APIs für Konfigurationsverwaltung, Benutzeroberfläche, Chat-Verlauf-Abfrage usw. bereit
- **Konfigurationsspeicher (Schreiben)**: Schreibt Änderungen in die Datenbank
- **Benachrichtiger (Sender)**: Benachrichtigt MCP Gateway über Hot-Updates bei Konfigurationsänderungen

### Konfigurationsspeicher
- Speichert alle MCP-Dienste, Tools, Routen und andere Konfigurationen
- Unterstützt mehrere Implementierungen: Festplatte (yaml), SQLite, PostgreSQL, MySQL usw.

### Web-Datenspeicher
- Speichert Benutzerdaten, Sitzungsaufzeichnungen usw.
- Unterstützt mehrere Implementierungen: SQLite, PostgreSQL, MySQL usw.

### Externe Dienste
- Backend-Dienstsysteme, die für Tool-Aufrufe erforderlich sind 