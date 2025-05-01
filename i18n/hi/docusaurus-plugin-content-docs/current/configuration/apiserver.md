# apiserver.yaml

## बेसिक कॉन्फ़िगरेशन

```yaml
server:
  port: 8080
  host: "0.0.0.0"
  timeout: 30s
  readTimeout: 10s
  writeTimeout: 10s
  idleTimeout: 120s
  maxHeaderBytes: 1048576
  tls:
    enabled: false
    certFile: ""
    keyFile: ""
```

## लॉगिंग कॉन्फ़िगरेशन

```yaml
log:
  level: "info"
  format: "json"
  output: "stdout"
  file:
    enabled: false
    path: ""
    maxSize: 100
    maxBackups: 3
    maxAge: 7
    compress: true
```

## मेट्रिक्स कॉन्फ़िगरेशन

```yaml
metrics:
  enabled: true
  path: "/metrics"
  port: 9090
  host: "0.0.0.0"
```

## स्वास्थ्य जांच कॉन्फ़िगरेशन

```yaml
health:
  enabled: true
  path: "/health"
  port: 8081
  host: "0.0.0.0"
```

## CORS कॉन्फ़िगरेशन

```yaml
cors:
  enabled: true
  allowOrigins:
    - "*"
  allowMethods:
    - "GET"
    - "POST"
    - "PUT"
    - "DELETE"
    - "OPTIONS"
  allowHeaders:
    - "Content-Type"
    - "Authorization"
  exposeHeaders:
    - "Content-Length"
  allowCredentials: true
  maxAge: 86400
```

## रेट लिमिटिंग कॉन्फ़िगरेशन

```yaml
rateLimit:
  enabled: true
  rate: 100
  burst: 200
  period: "1m"
```

## कैश कॉन्फ़िगरेशन

```yaml
cache:
  enabled: true
  type: "memory"
  ttl: "5m"
  maxSize: 1000
  redis:
    enabled: false
    addr: "localhost:6379"
    password: ""
    db: 0
    poolSize: 10
    minIdleConns: 5
```

## JWT कॉन्फ़िगरेशन

```yaml
jwt:
  enabled: true
  secret: "your-secret-key"
  issuer: "mcp"
  audience: "mcp-client"
  expiresIn: "24h"
  refreshExpiresIn: "168h"
```

## डेटाबेस कॉन्फ़िगरेशन

```yaml
database:
  type: "sqlite"
  dsn: "file:mcp.db?cache=shared&_fk=1"
  maxOpenConns: 10
  maxIdleConns: 5
  connMaxLifetime: "1h"
  connMaxIdleTime: "30m"
```

## रेडिस कॉन्फ़िगरेशन

```yaml
redis:
  enabled: false
  addr: "localhost:6379"
  password: ""
  db: 0
  poolSize: 10
  minIdleConns: 5
  maxRetries: 3
  dialTimeout: "5s"
  readTimeout: "3s"
  writeTimeout: "3s"
```

## क्लस्टर कॉन्फ़िगरेशन

```yaml
cluster:
  enabled: false
  name: "mcp"
  addr: "localhost:7946"
  bindAddr: "0.0.0.0:7946"
  advertiseAddr: ""
  join: []
  leaveTimeout: "5s"
  updateInterval: "1s"
  pushPullInterval: "30s"
  gossipInterval: "200ms"
  probeInterval: "1s"
  probeTimeout: "500ms"
  suspicionMult: 4
  retransmitMult: 4
  reconnectInterval: "1s"
  reconnectTimeout: "5s"
  tombstoneTimeout: "24h"
```

## सर्विस डिस्कवरी कॉन्फ़िगरेशन

```yaml
discovery:
  enabled: false
  type: "consul"
  consul:
    addr: "localhost:8500"
    scheme: "http"
    datacenter: "dc1"
    token: ""
    serviceName: "mcp"
    serviceId: "mcp-1"
    serviceAddress: ""
    servicePort: 8080
    serviceTags: []
    serviceMeta: {}
    checkInterval: "10s"
    checkTimeout: "5s"
    checkDeregisterCriticalServiceAfter: "30s"
```

## ट्रेसिंग कॉन्फ़िगरेशन

```yaml
tracing:
  enabled: false
  type: "jaeger"
  jaeger:
    serviceName: "mcp"
    sampler:
      type: "const"
      param: 1
    reporter:
      localAgentHostPort: "localhost:6831"
      logSpans: true
    headers:
      jaegerDebugHeader: "jaeger-debug-id"
      jaegerBaggageHeader: "jaeger-baggage"
      traceBaggageHeaderPrefix: "uberctx-"
    baggageRestrictions:
      denyBaggageOnInitializationFailure: false
      hostPort: ""
```

## प्रोमेथियस कॉन्फ़िगरेशन

```yaml
prometheus:
  enabled: true
  path: "/metrics"
  port: 9090
  host: "0.0.0.0"
  namespace: "mcp"
  subsystem: "api"
  labels:
    app: "mcp"
    env: "prod"
```

## स्टैकड्राइवर कॉन्फ़िगरेशन

```yaml
stackdriver:
  enabled: false
  projectId: ""
  credentialsFile: ""
  logLevel: "info"
  metricPrefix: "custom.googleapis.com/mcp"
  labels:
    app: "mcp"
    env: "prod"
```

## सेंट्री कॉन्फ़िगरेशन

```yaml
sentry:
  enabled: false
  dsn: ""
  environment: "production"
  release: ""
  debug: false
  sampleRate: 1.0
  tracesSampleRate: 1.0
  attachStacktrace: true
  maxBreadcrumbs: 100
  beforeSend: ""
  beforeBreadcrumb: ""
  integrations: []
  ignoreErrors: []
  includeLocalVariables: true
  inAppInclude: []
  inAppExclude: []
  contextLines: 5
  maxSpans: 1000
  transport: "http"
  httpProxy: ""
  httpsProxy: ""
  caCerts: ""
  serverName: ""
  dist: ""
  enableTracing: true
  tracesSampler: ""
  profilesSampleRate: 1.0
  autoSessionTracking: true
  sessionTrackingIntervalMillis: 30000
  attachServerName: true
  sendDefaultPii: false
  serverName: ""
  dist: ""
  environment: "production"
  release: ""
  debug: false
  sampleRate: 1.0
  tracesSampleRate: 1.0
  attachStacktrace: true
  maxBreadcrumbs: 100
  beforeSend: ""
  beforeBreadcrumb: ""
  integrations: []
  ignoreErrors: []
  includeLocalVariables: true
  inAppInclude: []
  inAppExclude: []
  contextLines: 5
  maxSpans: 1000
  transport: "http"
  httpProxy: ""
  httpsProxy: ""
  caCerts: ""
  serverName: ""
  dist: ""
  enableTracing: true
  tracesSampler: ""
  profilesSampleRate: 1.0
  autoSessionTracking: true
  sessionTrackingIntervalMillis: 30000
  attachServerName: true
  sendDefaultPii: false
```

# apiserver.yaml

कॉन्फ़िगरेशन फ़ाइल `${VAR:default}` सिंटैक्स का उपयोग करके पर्यावरण चर इंजेक्शन का समर्थन करती है। यदि पर्यावरण चर सेट नहीं है, तो डिफ़ॉल्ट मान का उपयोग किया जाएगा।

सामान्य अभ्यास अलग-अलग `.env`, `.env.development`, `.env.prod` के माध्यम से इंजेक्शन करना है, हालांकि आप सीधे कॉन्फ़िगरेशन को संशोधित करके एक निश्चित मान भी सेट कर सकते हैं

## चैट संदेश डेटाबेस कॉन्फ़िगरेशन

यह कॉन्फ़िगरेशन मुख्य रूप से बैकएंड में चैट संदेश स्टोरेज के लिए है (यह प्रॉक्सी कॉन्फ़िगरेशन के साथ एक ही डेटाबेस में संग्रहीत किया जा सकता है), जैसा कि नीचे दिए गए चित्र में दिखाया गया है:

![चैट सत्र और संदेश](/img/chat_histories.png)

वर्तमान में तीन डेटाबेस का समर्थन है:
- SQLite3
- PostgreSQL
- MySQL

यदि अतिरिक्त डेटाबेस समर्थन की आवश्यकता है, तो आप [Issue](https://github.com/mcp-ecosystem/mcp-gateway/issues) में अनुरोध कर सकते हैं, या सीधे संबंधित impl को लागू करके PR जमा कर सकते हैं :)

```yaml
database:
  type: "${APISERVER_DB_TYPE:sqlite}"               # डेटाबेस प्रकार (sqlite,postgres, myslq)
  host: "${APISERVER_DB_HOST:localhost}"            # डेटाबेस होस्ट पता
  port: ${APISERVER_DB_PORT:5432}                   # डेटाबेस पोर्ट
  user: "${APISERVER_DB_USER:postgres}"             # डेटाबेस उपयोगकर्ता नाम
  password: "${APISERVER_DB_PASSWORD:example}"      # डेटाबेस पासवर्ड
  dbname: "${APISERVER_DB_NAME:./mcp-gateway.db}"   # डेटाबेस नाम या फ़ाइल पथ
  sslmode: "${APISERVER_DB_SSL_MODE:disable}"       # डेटाबेस कनेक्शन का SSL मोड
```

## गेटवे प्रॉक्सी स्टोरेज कॉन्फ़िगरेशन

यह गेटवे प्रॉक्सी कॉन्फ़िगरेशन को संग्रहीत करने के लिए है, जो MCP से API मैपिंग का कॉन्फ़िगरेशन है, जैसा कि नीचे दिए गए चित्र में दिखाया गया है:

![गेटवे प्रॉक्सी कॉन्फ़िगरेशन](/img/gateway_proxies.png)

वर्तमान में दो प्रकार का समर्थन है:
- disk: कॉन्फ़िगरेशन डिस्क में फ़ाइल के रूप में संग्रहीत किया जाएगा, प्रत्येक कॉन्फ़िगरेशन एक अलग फ़ाइल में होगा, इसे nginx के vhost की तरह समझा जा सकता है, जैसे `svc-a.yaml`, `svc-b.yaml`
- db: डेटाबेस में संग्रहीत, प्रत्येक कॉन्फ़िगरेशन एक रिकॉर्ड है। वर्तमान में तीन डेटाबेस का समर्थन है:
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # स्टोरेज प्रकार: db, disk
  
  # डेटाबेस कॉन्फ़िगरेशन (जब type 'db' हो)
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # डेटाबेस प्रकार (sqlite,postgres, myslq)
    host: "${GATEWAY_DB_HOST:localhost}"                # डेटाबेस होस्ट पता
    port: ${GATEWAY_DB_PORT:5432}                       # डेटाबेस पोर्ट
    user: "${GATEWAY_DB_USER:postgres}"                 # डेटाबेस उपयोगकर्ता नाम
    password: "${GATEWAY_DB_PASSWORD:example}"          # डेटाबेस पासवर्ड
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # डेटाबेस नाम या फ़ाइल पथ
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # डेटाबेस कनेक्शन का SSL मोड
  
  # डिस्क कॉन्फ़िगरेशन (जब type 'disk' हो)
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # डेटा फ़ाइल स्टोरेज पथ
```

## नोटिफिकेशन कॉन्फ़िगरेशन

नोटिफिकेशन कॉन्फ़िगरेशन मॉड्यूल मुख्य रूप से कॉन्फ़िगरेशन अपडेट होने पर `mcp-gateway` को अपडेट का पता लगाने और सेवा को पुनः आरंभ किए बिना हॉट रीलोड करने के लिए उपयोग किया जाता है।

वर्तमान में 4 नोटिफिकेशन विधियों का समर्थन है:
- signal: ऑपरेटिंग सिस्टम सिग्नल के माध्यम से नोटिफिकेशन, जैसे `kill -SIGHUP <pid>` या `nginx -s reload`, `mcp-gateway reload` कमांड के माध्यम से कॉल किया जा सकता है, सिंगल मशीन डिप्लॉयमेंट के लिए उपयुक्त
- api: API कॉल के माध्यम से नोटिफिकेशन, `mcp-gateway` एक अलग पोर्ट पर लिसन करेगा, जब अनुरोध प्राप्त होगा तो हॉट रीलोड होगा, `curl http://localhost:5235/_reload` के माध्यम से सीधे कॉल किया जा सकता है, सिंगल मशीन और क्लस्टर डिप्लॉयमेंट के लिए उपयुक्त
- redis: redis के पब्लिश/सब्सक्राइब फंक्शन के माध्यम से नोटिफिकेशन, सिंगल मशीन या क्लस्टर डिप्लॉयमेंट के लिए उपयुक्त
- composite: कंपोजिट नोटिफिकेशन, कई विधियों के संयोजन के माध्यम से, डिफ़ॉल्ट रूप से `signal` और `api` अवश्य चालू होंगे, अन्य विधियों के साथ संयोजन किया जा सकता है। सिंगल मशीन और क्लस्टर डिप्लॉयमेंट के लिए उपयुक्त, और यह अनुशंसित डिफ़ॉल्ट विधि भी है

नोटिफिकेशन में भूमिकाएँ:
- sender: भेजने वाला, नोटिफिकेशन भेजने के लिए जिम्मेदार, `apiserver` केवल इस मोड का उपयोग कर सकता है
- receiver: प्राप्त करने वाला, नोटिफिकेशन प्राप्त करने के लिए जिम्मेदार, सिंगल मशीन `mcp-gateway` के लिए केवल इस मोड का उपयोग करने की अनुशंसा की जाती है
- both: भेजने वाला और प्राप्त करने वाला दोनों, क्लस्टर डिप्लॉयमेंट के लिए `mcp-gateway` इस विधि का उपयोग कर सकता है

```yaml
notifier:
  role: "${APISERVER_NOTIFIER_ROLE:sender}"  # भूमिका: 'sender' (भेजने वाला) या 'receiver' (प्राप्त करने वाला)
  type: "${APISERVER_NOTIFIER_TYPE:signal}"  # प्रकार: 'signal' (सिग्नल), 'api', 'redis' या 'composite' (कंपोजिट)

  # सिग्नल कॉन्फ़िगरेशन (जब type 'signal' हो)
  signal:
    signal: "${APISERVER_NOTIFIER_SIGNAL:SIGHUP}"                       # भेजने के लिए सिग्नल
    pid: "${APISERVER_NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"    # PID फ़ाइल पथ

  # API कॉन्फ़िगरेशन (जब type 'api' हो)
  api:
    port: ${APISERVER_NOTIFIER_API_PORT:5235}                                           # API पोर्ट
    target_url: "${APISERVER_NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"    # रीलोड एंडपॉइंट

  # Redis कॉन्फ़िगरेशन (जब type 'redis' हो)
  redis:
    addr: "${APISERVER_NOTIFIER_REDIS_ADDR:localhost:6379}"                             # Redis पता
    password: "${APISERVER_NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"   # Redis पासवर्ड
    db: ${APISERVER_NOTIFIER_REDIS_DB:0}                                                # Redis डेटाबेस नंबर
    topic: "${APISERVER_NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                       # Redis पब्लिश/सब्सक्राइब टॉपिक
```

## OpenAI API कॉन्फ़िगरेशन

OpenAI कॉन्फ़िगरेशन ब्लॉक OpenAI API एकीकरण के लिए सेटिंग्स को परिभाषित करता है:

```yaml
openai:
  api_key: "${OPENAI_API_KEY}"                                  # OpenAI API कुंजी (आवश्यक)
  model: "${OPENAI_MODEL:gpt-4.1}"                              # उपयोग किया जाने वाला मॉडल
  base_url: "${OPENAI_BASE_URL:https://api.openai.com/v1/}"     # API बेस URL
```

वर्तमान में केवल OpenAI API संगत LLMs कॉल का एकीकरण किया गया है 
