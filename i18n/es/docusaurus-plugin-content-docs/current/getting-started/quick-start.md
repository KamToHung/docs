# Inicio rápido

## Configuración de MCP Gateway

1. Crear los directorios necesarios y descargar los archivos de configuración:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> Para dispositivos en China continental, puede usar la imagen de Aliyun
> 
> ```bash
> registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest
> ```

> Los LLMs se pueden cambiar según sea necesario, por ejemplo, a Qwen
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Ejecutar MCP Gateway usando Docker:

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

## Acceso y configuración

1. Acceder a la interfaz web:
   - Abra http://localhost:8080/ en su navegador

2. Agregar MCP Server:
   - Copie el archivo de configuración: https://github.com/mcp-ecosystem/mcp-gateway/blob/main/configs/mock-user-svc.yaml
   - Haga clic en "Add MCP Server" en la interfaz web
   - Pegue la configuración y guarde

   ![Ejemplo de agregar MCP Server](/img/add_mcp_server.png)

## Endpoints disponibles

Una vez configurado, el servicio estará disponible en los siguientes endpoints:

- MCP SSE: http://localhost:5235/mcp/user/sse
- MCP Streamable HTTP: http://localhost:5235/mcp/user/message
- MCP: http://localhost:5235/mcp/user/mcp

## Pruebas

Puede probar el servicio de dos maneras:

1. Usando la página MCP Chat en la interfaz web (requiere configurar API KEY en .env.allinone)
2. Usando su propio MCP Client (**recomendado**) 