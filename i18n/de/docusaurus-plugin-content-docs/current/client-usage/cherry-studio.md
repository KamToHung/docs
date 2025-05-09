# Cherry Studio MCP-Konfigurationsanleitung
Cherry Studio ist ein Desktop-Client, der mehrere Large Language Model (LLM)-Dienstanbieter unterstützt und mit Windows-, Mac- und Linux-Systemen kompatibel ist.
Cherry Studio Github: [cherry-studio/docs/README.zh.md](https://github.com/CherryHQ/cherry-studio/blob/main/docs/README.zh.md)

> **Für eine detailliertere Cherry Studio MCP-Konfigurationsanleitung lesen Sie bitte die offizielle Dokumentation:**  
> https://docs.cherry-ai.com/advanced-basic/mcp

Zuerst konfigurieren wir den MCP-Server in den **MCP-Server**-Einstellungen. Hier verwenden wir unseren eigenen simulierten Benutzerdienst zum Testen:
![cherrystudio.mcp.servers.png](/img/cherrystudio.mcp.servers.png)

Als Nächstes klicken Sie nach der Aktivierung über die Schaltfläche oben rechts auf **Werkzeuge**, um die Werkzeuge in diesem MCP-Dienst sowie deren Parameter und Parametertypen zu sehen.

![cherrystudio.mcp.tools.png](/img/cherrystudio.mcp.tools.png)

Schließlich können Sie es im Chat-Fenster ausprobieren. Bitten Sie es zum Beispiel, einen Benutzer zu registrieren und dann die Informationen dieses Benutzers abzufragen. Wenn es funktioniert, sind Sie fertig.

Sie können zum Beispiel Folgendes eingeben:
```
Helfen Sie mir, einen Benutzer Leo ifuryst@gmail.com zu registrieren
```

```
Helfen Sie mir, den Benutzer ifuryst@gmail.com abzufragen. Wenn er nicht gefunden wird, registrieren Sie bitte einen mit dem Benutzernamen Leo
```

![cherrystudio.usecase.png](/img/cherrystudio.usecase.png)

> **Beim Chatten mit LLM können Sie sehen, dass es während des Interaktionsprozesses Aufgabenabsichten intelligent erkennt und automatisch die optimalen Werkzeuge aus dem Werkzeugsatz für automatisierte Aufrufe auswählt**

👇👇👇👇👇👇 Wenn Sie bei der Verbesserung dieser Dokumentation helfen möchten, können Sie gerne einen Beitrag leisten. Vielen Dank ❤️ 