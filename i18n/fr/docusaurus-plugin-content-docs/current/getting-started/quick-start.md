# Démarrage Rapide

## Configuration de MCP Gateway

1. Créez les répertoires nécessaires et téléchargez les fichiers de configuration :

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> Si vous êtes en Chine continentale, vous pouvez extraire les images du registre Alibaba Cloud :
>
> ```bash
> registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest
> ```

> Vous pouvez également remplacer le LLM par défaut si nécessaire, par exemple, passer à Qwen :
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Exécutez MCP Gateway avec Docker :

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

## Accès et Configuration

1. Accédez à l'interface Web :
   - Ouvrez votre navigateur et accédez à http://localhost:8080/

2. Ajoutez un nouveau serveur MCP :
   - Copiez le fichier de configuration : https://github.com/mcp-ecosystem/mcp-gateway/blob/main/configs/mock-user-svc.yaml
   - Cliquez sur "Add MCP Server" dans l'interface Web
   - Collez la configuration et enregistrez

   ![Exemple d'ajout de serveur MCP](/img/add_mcp_server.png)

## Points de Terminaison Disponibles

Une fois configuré, les services seront disponibles aux points de terminaison suivants :

- MCP SSE : http://localhost:5235/mcp/user/sse
- MCP HTTP Streamable : http://localhost:5235/mcp/user/message
- MCP : http://localhost:5235/mcp/user/mcp

## Test

Vous pouvez tester le service de deux façons :

1. Utilisez la page MCP Chat dans l'interface Web (nécessite la configuration d'une clé API dans `.env.allinone`)
2. Utilisez votre propre client MCP (**Recommandé**) 