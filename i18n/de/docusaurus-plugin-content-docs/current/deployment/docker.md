# Docker

## Image-Übersicht

MCP Gateway bietet zwei Bereitstellungsmethoden:
1. **All-in-One-Bereitstellung**: Alle Dienste sind in einem einzigen Container verpackt, geeignet für lokale oder Einzelknoten-Bereitstellungen.
2. **Multi-Container-Bereitstellung**: Jeder Dienst wird separat bereitgestellt, geeignet für Produktions- oder Cluster-Umgebungen.

### Image-Repositories

Images werden in den folgenden Registries veröffentlicht:
- Docker Hub: `docker.io/ifuryst/mcp-gateway-*`
- GitHub Container Registry: `ghcr.io/mcp-ecosystem/mcp-gateway/*`
- Alibaba Cloud Container Registry: `registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-*`

*GitHub Container Registry unterstützt mehrstufige Verzeichnisse für eine übersichtlichere Organisation, während Docker Hub und Alibaba Cloud Registries flache Benennung mit Bindestrichen verwenden.*

### Image-Tags

- `latest`: Neueste Version
- `vX.Y.Z`: Spezifische Version

> ⚡ **Hinweis**: MCP Gateway befindet sich in schneller Entwicklung! Es wird empfohlen, spezifische Versions-Tags für zuverlässigere Bereitstellungen zu verwenden.

### Verfügbare Images

```bash
# All-in-One-Version
docker pull docker.io/ifuryst/mcp-gateway-allinone:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# API-Server
docker pull docker.io/ifuryst/mcp-gateway-apiserver:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/apiserver:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-apiserver:latest

# MCP Gateway
docker pull docker.io/ifuryst/mcp-gateway-mcp-gateway:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mcp-gateway:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mcp-gateway:latest

# Mock-Benutzerdienst
docker pull docker.io/ifuryst/mcp-gateway-mock-server:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mock-server:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mock-server:latest

# Web-Frontend
docker pull docker.io/ifuryst/mcp-gateway-web:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/web:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-web:latest
```

## Bereitstellung

### All-in-One-Bereitstellung

Die All-in-One-Bereitstellung verpackt alle Dienste in einem einzigen Container, ideal für Einzelknoten- oder lokale Bereitstellungen. Sie enthält die folgenden Dienste:
- **API-Server**: Management-Backend (Kontrollebene)
- **MCP Gateway**: Kerndienst für die Verarbeitung des Gateway-Verkehrs (Datenebene)
- **Mock-Benutzerdienst**: Simulierter Benutzerdienst für Tests (Sie können ihn durch Ihren tatsächlichen bestehenden API-Dienst ersetzen)
- **Web-Frontend**: Webbasierte Verwaltungsoberfläche
- **Nginx**: Reverse Proxy für interne Dienste

Prozesse werden mit Supervisor verwaltet, und alle Logs werden nach stdout ausgegeben.

#### Ports

- `8080`: Web-UI
- `5234`: API-Server
- `5235`: MCP Gateway
- `5335`: MCP Gateway Admin (interne Endpunkte wie Reload; NICHT in Produktion exponieren)
- `5236`: Mock-Benutzerdienst

#### Datenpersistenz

Es wird empfohlen, die folgenden Verzeichnisse zu mounten:
- `/app/configs`: Konfigurationsdateien
- `/app/data`: Datenspeicherung
- `/app/.env`: Umgebungsvariablendatei

#### Beispielbefehle

1. Erstellen Sie die notwendigen Verzeichnisse und laden Sie Konfigurationsdateien herunter:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> Sie können das Standard-LLM bei Bedarf ersetzen (muss OpenAI-kompatibel sein), z.B. Qwen verwenden:
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Führen Sie MCP Gateway mit Docker aus:

```bash
# Verwendung der Alibaba Cloud Registry (empfohlen für Server/Geräte in China)
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
           registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# Verwendung der GitHub Container Registry
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

#### Hinweise

1. Stellen Sie sicher, dass die Konfigurationsdateien und die Umgebungsdatei korrekt eingerichtet sind.
2. Es wird empfohlen, einen spezifischen Versions-Tag anstelle von `latest` zu verwenden.
3. Setzen Sie angemessene Ressourcenbeschränkungen für Produktionsbereitstellungen.
4. Stellen Sie sicher, dass gemountete Verzeichnisse die richtigen Berechtigungen haben. 