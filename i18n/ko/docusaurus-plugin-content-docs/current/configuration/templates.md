# Go Template 사용 가이드

이 문서는 MCP Gateway에서 Go Template을 사용하여 요청 및 응답 데이터를 처리하는 방법을 설명합니다. Go Template은 강력한 템플릿 기능을 제공하여 데이터 변환과 포맷팅을 유연하게 처리할 수 있게 해줍니다.

## 기본 구문

Go Template은 `{{}}`를 구분자로 사용하며, 그 안에서 다양한 함수와 변수를 사용할 수 있습니다. MCP Gateway에서는 주로 다음 변수들을 사용합니다:

- `.Config`: 서비스 수준의 설정
- `.Args`: 요청 매개변수
- `.Request`: 원본 요청 정보
- `.Response`: 업스트림 서비스 응답 정보

## 일반적인 사용 사례

### 1. 환경 변수에서 설정 가져오기

```yaml
config:
  Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # 환경 변수에서 설정 가져오기
```

### 2. 요청 헤더에서 값 추출

```yaml
headers:
  Authorization: "{{.Request.Headers.Authorization}}"   # 클라이언트의 Authorization 헤더 전달
  Cookie: "{{.Config.Cookie}}"                         # 서비스 설정의 값 사용
```

### 3. 요청 본문 구성

```yaml
requestBody: |-
  {
    "username": "{{.Args.username}}",
    "email": "{{.Args.email}}"
  }
```

### 4. 응답 데이터 처리

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
```

### 5. 중첩된 응답 데이터 처리

```yaml
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

### 6. 배열 데이터 처리

응답의 배열 데이터를 처리할 때는 Go Template의 range 기능을 사용할 수 있습니다:

```yaml
responseBody: |-
  {
    "total": "{{.Response.Data.total}}",
    "rows": [
      {{- $len := len .Response.Data.rows -}}
      {{- $rows := fromJSON .Response.Data.rows }}
      {{- range $i, $e := $rows }}
      {
        "id": {{ $e.id }},
        "detail": "{{ $e.detail }}",
        "deviceName": "{{ $e.deviceName }}"
      }{{ if lt (add $i 1) $len }},{{ end }}
      {{- end }}
    ]
  }
```

이 예제는 다음을 보여줍니다:
1. `fromJSON` 함수를 사용하여 JSON 문자열을 순회 가능한 객체로 변환
2. `range`를 사용하여 배열 순회
3. `len` 함수를 사용하여 배열 길이 가져오기
4. `add` 함수를 사용하여 수학 연산 수행
5. 조건문을 사용하여 배열 요소 간의 쉼표 구분 제어

### 7. URL에서 매개변수 사용

```yaml
endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
```

### 8. 복잡한 객체 데이터 처리

요청이나 응답의 복잡한 객체, 배열과 같은 구조를 JSON으로 변환해야 할 때는 `toJSON` 함수를 사용할 수 있습니다:

```yaml
requestBody: |-
  {
    "isPublic": {{.Args.isPublic}},
    "showEmail": {{.Args.showEmail}},
    "theme": "{{.Args.theme}}",
    "tags": {{.Args.tags}},
    "settings": {{ toJSON .Args.settings }}
  }
```

이 경우, `settings`는 복잡한 객체로, `toJSON` 함수를 사용하면 자동으로 JSON 문자열로 변환됩니다.

## 내장 함수

현재 지원되는 내장 함수:

1. `env`: 환경 변수 값 가져오기
   ```yaml
   Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'
   ```

2. `add`: 정수 덧셈 수행
   ```yaml
   {{ if lt (add $i 1) $len }},{{ end }}
   ```

3. `fromJSON`: JSON 문자열을 순회 가능한 객체로 변환
   ```yaml
   {{- $rows := fromJSON .Response.Data.rows }}
   ```

4. `toJSON`: 객체를 JSON 문자열로 변환
   ```yaml
   "settings": {{ toJSON .Args.settings }}
   ```

새로운 템플릿 함수를 추가하려면:
1. 구체적인 사용 사례를 설명하고 issue 생성
2. PR 기여를 환영하지만, 현재는 일반적인 용도의 함수만 수락합니다

## 추가 리소스

- [Go Template 공식 문서](https://pkg.go.dev/text/template) 