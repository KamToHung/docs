# Schnellstart

## MCP Gateway einrichten

1. Erstellen Sie die erforderlichen Verzeichnisse und laden Sie die Konfigurationsdateien herunter:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> Wenn Sie sich in China befinden, können Sie das Image aus dem Alibaba Cloud Registry beziehen:
>
> ```bash
> registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest
> ```

> Bei Bedarf können Sie das Standard-LLM ersetzen. Zum Beispiel für den Wechsel zu Qwen:
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Starten Sie MCP Gateway mit Docker:

```bash
docker run -d \
           --name mcp-gateway \
           -p 8080:80 \
           -p 5234:5234 \
           -p 5235:5235 \
           -p 5335:5335 \
           -p 5236:5236 \
           -e ENV=production \
           -v $(pwd)/configs:/app/configs \
           -v $(pwd)/data:/app/data \
           -v $(pwd)/.env.allinone:/app/.env \
           --restart unless-stopped \
           ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
```

## Zugriff und Konfiguration

1. Greifen Sie auf die Web-UI zu:
   - Öffnen Sie einen Browser und navigieren Sie zu http://localhost:8080/

2. Fügen Sie einen neuen MCP-Server hinzu:
   - Kopieren Sie die Konfigurationsdatei: https://github.com/mcp-ecosystem/mcp-gateway/blob/main/configs/mock-user-svc.yaml
   - Klicken Sie in der Web-UI auf "Add MCP Server"
   - Fügen Sie die Konfiguration ein und speichern Sie sie

   ![Beispiel für das Hinzufügen eines MCP-Servers](/img/add_mcp_server.png)

## Verfügbare Endpunkte

Nach der Konfiguration können Sie den Service über folgende Endpunkte nutzen:

- MCP SSE: http://localhost:5235/mcp/user/sse
- MCP HTTP Streamable: http://localhost:5235/mcp/user/message
- MCP: http://localhost:5235/mcp/user/mcp

## Testen

Der Service kann auf zwei Arten getestet werden:

1. Verwenden Sie die MCP Chat-Seite in der Web-UI (API-Schlüssel in `.env.allinone` erforderlich)
2. Verwenden Sie Ihren eigenen MCP-Client (**empfohlen**) 