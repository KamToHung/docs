# Cursor에서 MCP 설정하기 간단 가이드

> **더 자세한 Cursor MCP 설정 튜토리얼은 공식 문서를 참조하세요:**  
> https://docs.cursor.com/context/model-context-protocol

여기서는 기본적인 설정 방법을 보여드리겠습니다. 먼저 필요한 디렉토리와 파일을 생성했는지 확인하세요:

```bash
mkdir -p .cursor
touch .cursor/mcp.json
```

그런 다음 MCP 서버를 구성합니다. 여기서는 테스트를 위해 자체 모의 사용자 서비스를 사용합니다:

![.cursor/mcp.json](/img/cursor.mcp.json.png)

```json
{
  "mcpServers": {
    "user": {
      "url": "http://localhost:5235/mcp/user/sse"
    }
  }
}
```

다음으로 Cursor 설정을 열고 **MCP** 섹션에서 이 MCP 서버를 활성화합니다. 활성화되면 작은 녹색 점으로 변하고 사용 가능한 도구도 나열됩니다.

![.cursor/mcp.json](/img/cursor.mcp.servers.png)

마지막으로 채팅 창에서 시도해볼 수 있습니다. 예를 들어, 사용자 등록을 도와달라고 요청하고 해당 사용자의 정보를 조회하는 등의 작업을 수행할 수 있습니다. 작동하면 완료입니다!

예를 들어, 다음과 같이 입력할 수 있습니다:
```
사용자 ifuryst@gmail.com을 조회해주세요. 찾을 수 없다면 사용자 이름 Leo로 등록해주세요
``` 
