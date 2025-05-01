# Einfache Anleitung zur MCP-Konfiguration in Cursor

> **Für ein detaillierteres Cursor MCP-Konfigurationstutorial lesen Sie bitte die offizielle Dokumentation:**  
> https://docs.cursor.com/context/model-context-protocol

Hier zeige ich Ihnen eine grundlegende Konfigurationsmethode. Stellen Sie zunächst sicher, dass Sie die erforderlichen Verzeichnisse und Dateien erstellt haben:

```bash
mkdir -p .cursor
touch .cursor/mcp.json
```

Konfigurieren Sie dann den MCP-Server. Hier verwenden wir unseren eigenen Mock-Benutzerdienst zum Testen:

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

Öffnen Sie als Nächstes die Cursor-Einstellungen und aktivieren Sie diesen MCP-Server im Abschnitt **MCP**. Nach der Aktivierung sehen Sie ihn als kleinen grünen Punkt, und es werden auch die verfügbaren Tools aufgelistet.

![.cursor/mcp.json](/img/cursor.mcp.servers.png)

Schließlich können Sie es im Chat-Fenster ausprobieren, zum Beispiel indem Sie es bitten, einen Benutzer zu registrieren und dann die Informationen dieses Benutzers abzufragen. Wenn es funktioniert, sind Sie fertig!

Sie können zum Beispiel Folgendes eingeben:
```
Helfen Sie mir, den Benutzer ifuryst@gmail.com abzufragen, und wenn er nicht gefunden wird, registrieren Sie einen mit dem Benutzernamen Leo
``` 
