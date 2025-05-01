# Docker 배포

## 이미지 설명

MCP Gateway는 두 가지 배포 방식을 제공합니다:
1. All-in-One 배포: 모든 서비스가 하나의 컨테이너에 패키징되어 있어 단일 서버 배포나 로컬 사용에 적합합니다
2. 다중 컨테이너 배포: 각 서비스가 독립적으로 배포되어 프로덕션 환경이나 클러스터 배포에 적합합니다

### 이미지 레지스트리

이미지는 다음 세 개의 레지스트리에 게시됩니다:
- Docker Hub: `docker.io/ifuryst/mcp-gateway-*`
- GitHub Container Registry: `ghcr.io/mcp-ecosystem/mcp-gateway/*`
- Alibaba Cloud Container Registry: `registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-*`

*ghcr는 다중 디렉토리를 지원하므로 구조가 더 명확하지만, Docker와 Alibaba Cloud 레지스트리는 단일 디렉토리만 지원하므로 이미지 이름에 하이픈(-)을 사용합니다*

### 이미지 태그

- `latest`: 최신 버전
- `vX.Y.Z`: 특정 버전 번호

> ⚡ **참고**: 현재 MCP Gateway는 빠르게 개발 중입니다! 따라서 버전 번호를 사용한 배포가 더 안정적입니다

### 사용 가능한 이미지

```bash
# All-in-One 버전
docker pull docker.io/ifuryst/mcp-gateway-allinone:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# API Server
docker pull docker.io/ifuryst/mcp-gateway-apiserver:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/apiserver:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-apiserver:latest

# MCP Gateway
docker pull docker.io/ifuryst/mcp-gateway-mcp-gateway:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mcp-gateway:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mcp-gateway:latest

# Mock User Service
docker pull docker.io/ifuryst/mcp-gateway-mock-user-svc:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mock-user-svc:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mock-user-svc:latest

# Web 프론트엔드
docker pull docker.io/ifuryst/mcp-gateway-web:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/web:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-web:latest
```

## 배포

### All-in-One 배포

All-in-One 배포는 모든 서비스를 하나의 컨테이너에 패키징하여 단일 서버 배포나 로컬 사용에 적합합니다. 다음 서비스들이 포함됩니다:
- **API Server**: 관리 플랫폼 백엔드, 제어 평면으로 이해할 수 있습니다
- **MCP Gateway**: 핵심 서비스, 실제 게이트웨이 서비스를 담당하는 데이터 평면입니다
- **Mock User Service**: 사용자 서비스를 시뮬레이션하는 테스트용 서비스입니다 (기존 API 서비스가 이와 유사할 수 있습니다)
- **Web 프론트엔드**: 관리 플랫폼 프론트엔드, 시각적 관리 인터페이스를 제공합니다
- **Nginx**: 다른 서비스들을 위한 리버스 프록시입니다

Supervisor를 사용하여 서비스 프로세스를 관리합니다. 모든 로그는 stdout으로 출력됩니다

#### 포트 설명

- `8080`: Web 인터페이스 포트
- `5234`: API Server 포트
- `5235`: MCP Gateway 포트
- `5335`: MCP Gateway 관리 포트 (reload와 같은 내부 인터페이스를 처리하며, 프로덕션 환경에서는 외부에 노출하지 마세요)
- `5236`: Mock User Service 포트

#### 데이터 지속성

다음 디렉토리를 마운트하는 것을 권장합니다:
- `/app/configs`: 설정 파일 디렉토리
- `/app/data`: 데이터 디렉토리
- `/app/.env`: 환경 변수 파일

#### 예제 명령어

1. 필요한 디렉토리를 생성하고 설정 파일을 다운로드합니다:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> 필요한 경우 LLM을 교체할 수 있습니다. 예를 들어, Qwen으로 전환하는 경우 (OpenAI 호환 필요):
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Docker로 MCP Gateway를 실행합니다:

```bash
# Alibaba Cloud Container Registry 이미지 사용 (중국 본토의 서버나 장치에 권장)
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

# GitHub Container Registry 이미지 사용
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

#### 주의사항

1. 설정 파일과 환경 변수 파일이 올바르게 구성되어 있는지 확인하세요
2. latest 태그보다는 버전 번호 태그를 사용하는 것이 좋습니다
3. 프로덕션 환경에서는 적절한 리소스 제한을 설정하는 것이 좋습니다
4. 마운트된 디렉토리에 올바른 권한이 있는지 확인하세요 