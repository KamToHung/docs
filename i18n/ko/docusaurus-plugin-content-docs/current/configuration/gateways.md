# 게이트웨이 프록시 서비스 설정

## CORS (Cross-Origin Resource Sharing)
```yaml
routers:
  - server: "user"
    prefix: "/mcp/user"
    cors:
      allowOrigins:
        - "*"
      allowMethods:
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"
        - "Authorization"
        - "Mcp-Session-Id"
      exposeHeaders:
        - "Mcp-Session-Id"
      allowCredentials: true
```

> **참고:** `allowHeaders`와 `exposeHeaders`에 `Mcp-Session-Id`를 명시적으로 설정해야 합니다. 그렇지 않으면 클라이언트가 `Mcp-Session-Id`를 요청 헤더에 포함하거나 응답 헤더에서 읽을 수 없습니다.

## 응답 처리

현재 **두 가지 응답 처리 모드**를 지원합니다:

### 1. 응답 본문 통과 (Pass-through)

백엔드 응답을 처리하지 않고 클라이언트에게 직접 전달합니다. 템플릿 예시:

```yaml
responseBody: |-
  {{.Response.Body}}
```

### 2. 사용자 정의 필드 응답 (Field Mapping)

백엔드 응답 본문을 JSON 구조로 파싱하여 특정 필드를 추출한 후 반환합니다. 템플릿 예시:

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
``` 