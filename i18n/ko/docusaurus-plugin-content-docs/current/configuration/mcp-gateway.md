# mcp-gateway.yaml

설정 파일은 `${VAR:default}` 구문을 사용하여 환경 변수 주입을 지원합니다. 환경 변수가 설정되지 않은 경우 기본값이 사용됩니다.

일반적인 방법은 다양한 `.env`, `.env.development`, `.env.prod` 파일을 통해 주입하거나, 고정 값으로 직접 설정을 변경하는 것입니다.

## 기본 설정

```yaml
port: ${MCP_GATEWAY_PORT:5235}                      # 서비스 리스닝 포트
pid: "${MCP_GATEWAY_PID:/var/run/mcp-gateway.pid}"  # PID 파일 경로
```

> 여기의 PID는 아래에서 언급된 PID와 일치해야 합니다

## 스토리지 설정

스토리지 설정 모듈은 주로 게이트웨이 프록시 설정 정보를 저장하는 데 사용됩니다. 현재 두 가지 스토리지 방법을 지원합니다:
- disk: 설정은 디스크의 파일로 저장되며, 각 설정은 별도의 파일에 저장됩니다. nginx의 vhost 개념과 유사하며, 예를 들어 `svc-a.yaml`, `svc-b.yaml` 등입니다
- db: 데이터베이스에 저장하며, 각 설정은 하나의 레코드입니다. 현재 세 가지 데이터베이스를 지원합니다:
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # 스토리지 유형: db, disk
  
  # 데이터베이스 설정 (type이 'db'일 때 사용)
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # 데이터베이스 유형 (sqlite, postgres, mysql)
    host: "${GATEWAY_DB_HOST:localhost}"                # 데이터베이스 호스트 주소
    port: ${GATEWAY_DB_PORT:5432}                       # 데이터베이스 포트
    user: "${GATEWAY_DB_USER:postgres}"                 # 데이터베이스 사용자 이름
    password: "${GATEWAY_DB_PASSWORD:example}"          # 데이터베이스 비밀번호
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # 데이터베이스 이름 또는 파일 경로
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # 데이터베이스 SSL 모드
  
  # 디스크 설정 (type이 'disk'일 때 사용)
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # 데이터 파일 저장 경로
```

## 알림 설정

알림 설정 모듈은 `mcp-gateway`에 설정 업데이트를 알리고 서비스를 재시작하지 않고 핫 리로드를 트리거하는 데 사용됩니다.

현재 네 가지 알림 방법을 지원합니다:
- signal: 운영 체제 신호를 통해 알림을 보냅니다. `kill -SIGHUP <pid>` 또는 `nginx -s reload`와 유사하며, `mcp-gateway reload` 명령을 통해 호출할 수 있습니다. 단일 머신 배포에 적합합니다
- api: API 호출을 통해 알림을 보냅니다. `mcp-gateway`는 별도의 포트에서 수신 대기하고 요청을 받으면 핫 리로드를 수행합니다. `curl http://localhost:5235/_reload`를 통해 직접 호출할 수 있습니다. 단일 머신 및 클러스터 배포에 적합합니다
- redis: Redis의 pub/sub 기능을 통해 알림을 보냅니다. 단일 머신 및 클러스터 배포에 적합합니다
- composite: 여러 방법을 사용하는 복합 알림입니다. 기본적으로 `signal`과 `api`가 활성화되어 있으며 다른 방법과 결합할 수 있습니다. 단일 머신 및 클러스터 배포에 적합하며 기본 방법으로 권장됩니다

알림 역할:
- sender: 발신자로, 알림 전송을 담당합니다. `apiserver`는 이 모드만 사용할 수 있습니다
- receiver: 수신자로, 알림 수신을 담당합니다. 단일 머신의 `mcp-gateway`는 이 모드만 사용하는 것이 좋습니다
- both: 발신자와 수신자 모두입니다. 클러스터 배포된 `mcp-gateway`는 이 모드를 사용할 수 있습니다

```yaml
notifier:
  role: "${NOTIFIER_ROLE:receiver}" # 역할: 'sender' 또는 'receiver'
  type: "${NOTIFIER_TYPE:signal}"   # 유형: 'signal', 'api', 'redis' 또는 'composite'

  # 신호 설정 (type이 'signal'일 때 사용)
  signal:
    signal: "${NOTIFIER_SIGNAL:SIGHUP}"                     # 전송할 신호
    pid: "${NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"  # PID 파일 경로

  # API 설정 (type이 'api'일 때 사용)
  api:
    port: ${NOTIFIER_API_PORT:5235}                                         # API 포트
    target_url: "${NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"  # 리로드 엔드포인트

  # Redis 설정 (type이 'redis'일 때 사용)
  redis:
    addr: "${NOTIFIER_REDIS_ADDR:localhost:6379}"                               # Redis 주소
    password: "${NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"     # Redis 비밀번호
    db: ${NOTIFIER_REDIS_DB:0}                                                  # Redis 데이터베이스 번호
    topic: "${NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                         # Redis pub/sub 토픽
```

## 세션 스토리지 설정

세션 스토리지 설정은 MCP 세션 정보를 저장하는 데 사용됩니다. 현재 두 가지 스토리지 방법을 지원합니다:
- memory: 메모리 내 스토리지로, 단일 머신 배포에 적합합니다 (참고: 세션 정보는 재시작 시 손실됩니다)
- redis: Redis 스토리지로, 단일 머신 및 클러스터 배포에 적합합니다

```yaml
session:
  type: "${SESSION_STORAGE_TYPE:memory}"                    # 스토리지 유형: memory, redis
  redis:
    addr: "${SESSION_REDIS_ADDR:localhost:6379}"            # Redis 주소
    password: "${SESSION_REDIS_PASSWORD:}"                  # Redis 비밀번호
    db: ${SESSION_REDIS_DB:0}                               # Redis 데이터베이스 번호
    topic: "${SESSION_REDIS_TOPIC:mcp-gateway:session}"     # Redis pub/sub 토픽
``` 