# mcp-gateway.yaml

कॉन्फ़िगरेशन फ़ाइल `${VAR:default}` सिंटैक्स का उपयोग करके पर्यावरण चर इंजेक्शन का समर्थन करती है। यदि पर्यावरण चर सेट नहीं है, तो डिफ़ॉल्ट मान का उपयोग किया जाएगा।

सामान्य अभ्यास अलग-अलग `.env`, `.env.development`, `.env.prod` के माध्यम से इंजेक्शन करना है, हालांकि आप सीधे कॉन्फ़िगरेशन को संशोधित करके एक निश्चित मान भी सेट कर सकते हैं

## बुनियादी कॉन्फ़िगरेशन

```yaml
port: ${MCP_GATEWAY_PORT:5235}                      # सेवा लिसनिंग पोर्ट
pid: "${MCP_GATEWAY_PID:/var/run/mcp-gateway.pid}"  # PID फ़ाइल पथ
```

> यहाँ का PID और नीचे वाले PID एक समान होना चाहिए

## स्टोरेज कॉन्फ़िगरेशन

स्टोरेज कॉन्फ़िगरेशन मॉड्यूल मुख्य रूप से गेटवे के प्रॉक्सी कॉन्फ़िगरेशन जानकारी को संग्रहीत करने के लिए उपयोग किया जाता है। वर्तमान में दो स्टोरेज विधियों का समर्थन है:
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
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # डेटाबेस प्रकार (sqlite,postgres, mysql)
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
  role: "${NOTIFIER_ROLE:receiver}" # भूमिका: 'sender' (भेजने वाला) या 'receiver' (प्राप्त करने वाला)
  type: "${NOTIFIER_TYPE:signal}"   # प्रकार: 'signal' (सिग्नल), 'api', 'redis' या 'composite' (कंपोजिट)

  # सिग्नल कॉन्फ़िगरेशन (जब type 'signal' हो)
  signal:
    signal: "${NOTIFIER_SIGNAL:SIGHUP}"                     # भेजने के लिए सिग्नल
    pid: "${NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"  # PID फ़ाइल पथ

  # API कॉन्फ़िगरेशन (जब type 'api' हो)
  api:
    port: ${NOTIFIER_API_PORT:5235}                                         # API पोर्ट
    target_url: "${NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"  # रीलोड एंडपॉइंट

  # Redis कॉन्फ़िगरेशन (जब type 'redis' हो)
  redis:
    addr: "${NOTIFIER_REDIS_ADDR:localhost:6379}"                               # Redis पता
    password: "${NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"     # Redis पासवर्ड
    db: ${NOTIFIER_REDIS_DB:0}                                                  # Redis डेटाबेस नंबर
    topic: "${NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                         # Redis पब्लिश/सब्सक्राइब टॉपिक
```

## सत्र स्टोरेज कॉन्फ़िगरेशन

सत्र स्टोरेज कॉन्फ़िगरेशन MCP में सत्र जानकारी को संग्रहीत करने के लिए उपयोग किया जाता है। वर्तमान में दो स्टोरेज विधियों का समर्थन है:
- memory: मेमोरी स्टोरेज, सिंगल मशीन डिप्लॉयमेंट के लिए उपयुक्त (ध्यान दें, पुनः आरंभ करने पर सत्र जानकारी खो जाएगी)
- redis: Redis स्टोरेज, सिंगल मशीन या क्लस्टर डिप्लॉयमेंट के लिए उपयुक्त

```yaml
session:
  type: "${SESSION_STORAGE_TYPE:memory}"                    # स्टोरेज प्रकार: memory, redis
  redis:
    addr: "${SESSION_REDIS_ADDR:localhost:6379}"            # Redis पता
    password: "${SESSION_REDIS_PASSWORD:}"                  # Redis पासवर्ड
    db: ${SESSION_REDIS_DB:0}                               # Redis डेटाबेस नंबर
    topic: "${SESSION_REDIS_TOPIC:mcp-gateway:session}"     # Redis पब्लिश/सब्सक्राइब टॉपिक
``` 