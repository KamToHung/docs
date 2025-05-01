# 빠른 시작

## MCP Gateway 설정

1. 필요한 디렉토리를 생성하고 설정 파일을 다운로드합니다:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> 중국 본토에 있는 경우, Alibaba Cloud 레지스트리에서 이미지를 가져올 수 있습니다:
>
> ```bash
> registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest
> ```

> 필요한 경우 기본 LLM을 교체할 수 있습니다. 예를 들어, Qwen으로 전환하는 경우:
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Docker로 MCP Gateway를 실행합니다:

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

## 접근 및 설정

1. Web UI에 접근합니다:
   - 브라우저를 열고 http://localhost:8080/ 에 접속합니다

2. 새로운 MCP 서버를 추가합니다:
   - 설정 파일을 복사합니다: https://github.com/mcp-ecosystem/mcp-gateway/blob/main/configs/mock-user-svc.yaml
   - Web UI에서 "Add MCP Server"를 클릭합니다
   - 설정을 붙여넣고 저장합니다

   ![MCP 서버 추가 예시](/img/add_mcp_server.png)

## 사용 가능한 엔드포인트

설정이 완료되면 다음 엔드포인트에서 서비스를 사용할 수 있습니다:

- MCP SSE: http://localhost:5235/mcp/user/sse
- MCP HTTP Streamable: http://localhost:5235/mcp/user/message
- MCP: http://localhost:5235/mcp/user/mcp

## 테스트

서비스는 두 가지 방법으로 테스트할 수 있습니다:

1. Web UI의 MCP Chat 페이지 사용 (`.env.allinone`에서 API 키 설정 필요)
2. 자체 MCP 클라이언트 사용 (**권장**) 