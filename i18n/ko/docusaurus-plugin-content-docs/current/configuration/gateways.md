# 게이트웨이 프록시 서비스 구성

## 구성 예제

다음은 라우팅, CORS, 응답 처리 등을 포함한 완전한 구성 예제입니다:

```yaml
name: "mock-user-svc"                 # 프록시 서비스 이름, 전역적으로 고유

# 라우팅 구성
routers:
  - server: "mock-user-svc"     # 서비스 이름
    prefix: "/mcp/user"         # 라우트 접두사, 전역적으로 고유, 중복 불가, 서비스 또는 도메인+모듈로 구분하는 것을 권장

    # CORS 구성
    cors:
      allowOrigins:             # 개발/테스트 환경에서는 완전히 개방 가능, 프로덕션 환경에서는 선택적으로 개방하는 것을 권장 (대부분의 MCP 클라이언트는 CORS가 필요하지 않음)
        - "*"
      allowMethods:             # 허용된 요청 메서드, 필요에 따라 개방, MCP(SSE 및 Streamable)의 경우 일반적으로 이 3가지 메서드만 필요
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"        # 필수
        - "Authorization"       # 인증이 필요한 경우 필수
        - "Mcp-Session-Id"      # MCP의 경우, 요청에서 이 Key를 지원해야 하며, 그렇지 않으면 Streamable HTTP가 정상적으로 작동하지 않음
      exposeHeaders:
        - "Mcp-Session-Id"      # MCP의 경우, CORS가 활성화된 경우 이 Key를 노출해야 하며, 그렇지 않으면 Streamable HTTP가 정상적으로 작동하지 않음
      allowCredentials: true    # Access-Control-Allow-Credentials: true 헤더를 추가할지 여부

# 서비스 구성
servers:
  - name: "mock-user-svc"             # 서비스 이름, routers의 server와 일치해야 함
    namespace: "user-service"         # 서비스 네임스페이스, 서비스 그룹화에 사용
    description: "Mock User Service"  # 서비스 설명
    allowedTools:                     # 허용된 도구 목록 (tools의 하위 집합)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # 서비스 수준 구성, tools에서 {{.Config}}를 사용하여 참조 가능
      Cookie: 123                                     # 하드코딩된 구성
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # 환경 변수에서 가져온 구성, 사용법은 '{{ env "ENV_VAR_NAME" }}'

# 도구 구성
tools:
  - name: "register_user"                                   # 도구 이름
    description: "Register a new user"                      # 도구 설명
    method: "POST"                                          # 대상(업스트림, 백엔드) 서비스에 대한 HTTP 메서드
    endpoint: "http://localhost:5236/users"                 # 대상 서비스 주소
    headers:                                                # 요청 헤더 구성, 대상 서비스에 요청할 때 전달할 헤더
      Content-Type: "application/json"                      # 하드코딩된 헤더
      Authorization: "{{.Request.Headers.Authorization}}"   # 클라이언트 요청에서 추출한 Authorization 헤더 사용 (패스스루 시나리오용)
      Cookie: "{{.Config.Cookie}}"                          # 서비스 구성의 값 사용
    args:                         # 매개변수 구성
      - name: "username"          # 매개변수 이름
        position: "body"          # 매개변수 위치: header, query, path, body
        required: true            # 매개변수가 필수인지 여부
        type: "string"            # 매개변수 유형
        description: "Username"   # 매개변수 설명
        default: ""               # 기본값
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # 요청 본문 템플릿, 매개변수(MCP 요청의 arguments)에서 값을 추출하여 동적으로 생성
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # 응답 본문 템플릿, 응답에서 값을 추출하여 동적으로 생성
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }

  - name: "get_user_by_email"
    description: "Get user by email"
    method: "GET"
    endpoint: "http://localhost:5236/users/email/{{.Args.email}}"
    args:
      - name: "email"
        position: "path"
        required: true
        type: "string"
        description: "Email"
        default: ""
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }

  - name: "update_user_preferences"
    description: "Update user preferences"
    method: "PUT"
    endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
    headers:
      Content-Type: "application/json"
      Authorization: "{{.Request.Headers.Authorization}}"
      Cookie: "{{.Config.Cookie}}"
    args:
      - name: "email"
        position: "path"
        required: true
        type: "string"
        description: "Email"
        default: ""
      - name: "isPublic"
        position: "body"
        required: true
        type: "boolean"
        description: "Whether the user profile is public"
        default: "false"
      - name: "showEmail"
        position: "body"
        required: true
        type: "boolean"
        description: "Whether to show email in profile"
        default: "true"
      - name: "theme"
        position: "body"
        required: true
        type: "string"
        description: "User interface theme"
        default: "light"
      - name: "tags"
        position: "body"
        required: true
        type: "array"
        items:
           type: "string"
           enum: ["developer", "designer", "manager", "tester"]
        description: "User role tags"
        default: "[]"
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}",
        "preferences": {
          "isPublic": {{.Response.Data.preferences.isPublic}},
          "showEmail": {{.Response.Data.preferences.showEmail}},
          "theme": "{{.Response.Data.preferences.theme}}",
          "tags": {{.Response.Data.preferences.tags}}
        }
      }
```

## 구성 설명

### 1. 기본 구성

- `name`: 프록시 서비스 이름, 전역적으로 고유, 다른 프록시 서비스를 식별하는 데 사용
- `routers`: 라우팅 구성 목록, 요청 전달 규칙 정의
- `servers`: 서비스 구성 목록, 서비스 메타데이터 및 허용된 도구 정의
- `tools`: 도구 구성 목록, 구체적인 API 호출 규칙 정의

구성은 네임스페이스로 간주할 수 있으며, 서비스 또는 도메인으로 구분하는 것을 권장합니다. 서비스에는 많은 API 인터페이스가 포함되어 있으며, 각 API 인터페이스는 하나의 Tool에 해당합니다

### 2. 라우팅 구성

라우팅 구성은 요청 전달 규칙을 정의하는 데 사용됩니다:

```yaml
routers:
  - server: "mock-user-svc"     # 서비스 이름, servers의 name과 일치해야 함
    prefix: "/mcp/user"         # 라우트 접두사, 전역적으로 고유해야 하며 중복 불가
```

기본적으로 `prefix`에서 3개의 엔드포인트가 파생됩니다:
- SSE: `${prefix}/sse`, 예: `/mcp/user/sse`
- SSE Message: `${prefix}/message`, 예: `/mcp/user/message`
- StreamableHTTP: `${prefix}/mcp`, 예: `/mcp/user/mcp`

### 3. CORS 구성

교차 출처 리소스 공유(CORS) 구성은 교차 출처 요청의 액세스 권한을 제어하는 데 사용됩니다:

```yaml
cors:
  allowOrigins:             # 개발/테스트 환경에서는 완전히 개방 가능, 프로덕션 환경에서는 선택적으로 개방하는 것을 권장 (대부분의 MCP 클라이언트는 CORS가 필요하지 않음)
    - "*"
  allowMethods:             # 허용된 요청 메서드, 필요에 따라 개방, MCP(SSE 및 Streamable)의 경우 일반적으로 이 3가지 메서드만 필요
    - "GET"
    - "POST"
    - "OPTIONS"
  allowHeaders:
    - "Content-Type"        # 필수
    - "Authorization"       # 인증이 필요한 경우 필수
    - "Mcp-Session-Id"      # MCP의 경우, 요청에서 이 Key를 지원해야 하며, 그렇지 않으면 Streamable HTTP가 정상적으로 작동하지 않음
  exposeHeaders:
    - "Mcp-Session-Id"      # MCP의 경우, CORS가 활성화된 경우 이 Key를 노출해야 하며, 그렇지 않으면 Streamable HTTP가 정상적으로 작동하지 않음
  allowCredentials: true    # Access-Control-Allow-Credentials: true 헤더를 추가할지 여부
```

> **일반적으로 MCP 클라이언트는 CORS를 활성화할 필요가 없습니다**

### 4. 서비스 구성

서비스 구성은 서비스 메타데이터, 관련 도구 목록 및 서비스 수준 구성을 정의하는 데 사용됩니다:

```yaml
servers:
  - name: "mock-user-svc"             # 서비스 이름, routers의 server와 일치해야 함
    namespace: "user-service"         # 서비스 네임스페이스, 서비스 그룹화에 사용
    description: "Mock User Service"  # 서비스 설명
    allowedTools:                     # 허용된 도구 목록 (tools의 하위 집합)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # 서비스 수준 구성, tools에서 {{.Config}}를 사용하여 참조 가능
      Cookie: 123                                     # 하드코딩된 구성
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # 환경 변수에서 가져온 구성, 사용법은 '{{ env "ENV_VAR_NAME" }}'
```

서비스 수준 구성은 tools에서 `{{.Config}}` 를 사용하여 참조할 수 있습니다. 여기서는 구성 파일에 하드코딩하거나 환경 변수에서 가져올 수 있습니다. 환경 변수 주입의 경우 `{{ env "ENV_VAR_NAME" }}` 형식을 사용합니다

### 5. 도구 구성

도구 구성은 구체적인 API 호출 규칙을 정의하는 데 사용됩니다:

```yaml
tools:
  - name: "register_user"                                   # 도구 이름
    description: "Register a new user"                      # 도구 설명
    method: "POST"                                          # 대상(업스트림, 백엔드) 서비스에 대한 HTTP 메서드
    endpoint: "http://localhost:5236/users"                 # 대상 서비스 주소
    headers:                                                # 요청 헤더 구성, 대상 서비스에 요청할 때 전달할 헤더
      Content-Type: "application/json"                      # 하드코딩된 헤더
      Authorization: "{{.Request.Headers.Authorization}}"   # 클라이언트 요청에서 추출한 Authorization 헤더 사용 (패스스루 시나리오용)
      Cookie: "{{.Config.Cookie}}"                          # 서비스 구성의 값 사용
    args:                         # 매개변수 구성
      - name: "username"          # 매개변수 이름
        position: "body"          # 매개변수 위치: header, query, path, body
        required: true            # 매개변수가 필수인지 여부
        type: "string"            # 매개변수 유형
        description: "Username"   # 매개변수 설명
        default: ""               # 기본값
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # 요청 본문 템플릿, 매개변수(MCP 요청의 arguments)에서 값을 추출하여 동적으로 생성
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # 응답 본문 템플릿, 응답에서 값을 추출하여 동적으로 생성
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

#### 5.1 요청 매개변수 조립

대상 서비스에 요청할 때 매개변수를 조립해야 합니다. 현재 다음과 같은 소스가 있습니다:
1. `.Config`: 서비스 수준 구성에서 값을 추출
2. `.Args`: 요청 매개변수에서 직접 값을 추출
3. `.Request`: 요청에서 값을 추출, 헤더 `.Request.Headers`, 본문 `.Request.Body` 등

조립은 `requestBody`에서 수행됩니다, 예:
```yaml
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
```

`endpoint`(대상 주소)도 위의 소스를 사용하여 값을 추출할 수 있습니다, 예를 들어 `http://localhost:5236/users/{{.Args.email}}/preferences`는 요청 매개변수에서 값을 추출합니다

#### 5.2 응답 매개변수 조립

응답 본문 조립은 요청 본문 조립과 유사합니다:
1. `.Response.Data`: 응답에서 값을 추출, 응답은 JSON 형식이어야 함
2. `.Response.Body`: 응답 본문 전체를 직접 패스스루, 응답 내용 형식을 무시하고 클라이언트에 직접 전달

모두 `.Response`를 사용하여 추출합니다, 예:
```yaml
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

## 구성 저장

게이트웨이 프록시 구성은 다음과 같은 두 가지 방법으로 저장할 수 있습니다:

1. 데이터베이스 저장(권장):
    - SQLite3, PostgreSQL, MySQL 지원
    - 각 구성을 하나의 레코드로 저장
    - 동적 업데이트 및 핫 리로드 지원

2. 파일 저장:
    - 각 구성을 별도의 YAML 파일로 저장
    - Nginx의 vhost 구성 방식과 유사
    - 파일 이름은 서비스 이름을 사용하는 것을 권장, 예: `mock-user-svc.yaml` 
