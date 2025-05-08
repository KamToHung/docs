# Einfache Anleitung zur MCP-Konfiguration in Cursor

> **Für ein detaillierteres Tutorial zur MCP-Konfiguration in Cursor, lesen Sie bitte die offizielle Dokumentation:**  
> https://docs.cursor.com/context/model-context-protocol

Hier zeige ich Ihnen eine grundlegende Konfigurationsmethode. Stellen Sie sicher, dass Sie die erforderlichen Verzeichnisse und Dateien erstellt haben:

```bash
mkdir -p .cursor
touch .cursor/mcp.json
```

Konfigurieren Sie dann den MCP-Server. Hier verwenden wir unseren Mock-Benutzerdienst für Tests:

![.cursor/mcp.json](/img/cursor.mcp.json.png)

```json
{
  "mcpServers": {
    "user": {
      "url": "http://localhost:5235/mcp/user/sse"
    }
  }
}
```

Öffnen Sie als Nächstes die Cursor-Einstellungen und aktivieren Sie diesen MCP-Server im Abschnitt **MCP**. Nach der Aktivierung wird er zu einem kleinen grünen Punkt und zeigt auch die verfügbaren Tools an.

![.cursor/mcp.json](/img/cursor.mcp.servers.png)

Schließlich können Sie es im Chat-Fenster ausprobieren. Bitten Sie es zum Beispiel, Ihnen bei der Registrierung eines Benutzers zu helfen und dann die Informationen dieses Benutzers abzufragen. Wenn es funktioniert, sind Sie fertig.

Sie können Folgendes eingeben:
```
Helfen Sie mir, einen Benutzer Leo ifuryst@gmail.com zu registrieren
```

Bitte suchen Sie nach dem Benutzer ifuryst@gmail.com, wenn nicht gefunden, registrieren Sie einen mit dem Benutzernamen Leo

> **Durch praktische Tests haben wir festgestellt, dass dieser Mock-Dienst in einigen Fällen aufgrund der Verarbeitung von Namen und E-Mails Modellfehler verursachen kann, die ignoriert werden können. Sie können stattdessen Ihre tatsächliche API verwenden.**

![cursor usecase](/img/cursor.usecase.png) 
