# Cherry Studio MCP 설정 가이드
Cherry Studio는 Windows, Mac 및 Linux 시스템과 호환되는 여러 대규모 언어 모델(LLM) 서비스 제공업체를 지원하는 데스크톱 클라이언트입니다.
Cherry Studio Github: [cherry-studio/docs/README.zh.md](https://github.com/CherryHQ/cherry-studio/blob/main/docs/README.zh.md)

> **더 자세한 Cherry Studio MCP 설정 튜토리얼은 공식 문서를 참조하세요:**  
> https://docs.cherry-ai.com/advanced-basic/mcp

먼저 **MCP 서버** 설정에서 MCP 서버를 구성합니다. 여기서는 자체 시뮬레이션 사용자 서비스를 사용하여 테스트합니다:
![cherrystudio.mcp.servers.png](../../../../../static/img/cherrystudio.mcp.servers.png)

다음으로, 오른쪽 상단의 버튼을 클릭하여 활성화한 후 **도구**를 클릭하면 이 MCP 서비스의 도구와 해당 매개변수 및 매개변수 유형이 표시됩니다.

![cherrystudio.mcp.tools.png](../../../../../static/img/cherrystudio.mcp.tools.png)

마지막으로 채팅 창에서 시도해볼 수 있습니다. 예를 들어, 사용자를 등록하고 해당 사용자 정보를 조회하도록 요청합니다. 작동하면 완료된 것입니다.

예를 들어, 다음과 같이 입력할 수 있습니다:
```
사용자 Leo ifuryst@gmail.com을 등록해주세요
```

```
사용자 ifuryst@gmail.com을 조회해주세요. 찾을 수 없다면 사용자 이름 Leo로 등록해주세요
```

![cherrystudio.mcp.servers.choose.png](../../../../../static/img/cherrystudio.mcp.servers.choose.png)
![cherrystudio.usecase.png](../../../../../static/img/cherrystudio.usecase.png)

> **LLM과 채팅할 때, 상호작용 과정에서 작업 의도를 지능적으로 인식하고 도구 세트에서 최적의 도구를 자동으로 선택하여 자동화된 호출을 수행하는 것을 볼 수 있습니다**

👇👇👇👇👇👇 이 문서의 개선에 기여하고 싶으시다면, 기여해 주시기 바랍니다. 감사합니다 ❤️ 