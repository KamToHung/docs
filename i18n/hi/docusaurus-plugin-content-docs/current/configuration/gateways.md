# गेटवे प्रॉक्सी सेवा कॉन्फ़िगरेशन

## कॉन्फ़िगरेशन उदाहरण

यहां एक पूर्ण कॉन्फ़िगरेशन उदाहरण है जिसमें राउटिंग, CORS, प्रतिक्रिया प्रसंस्करण और अन्य कॉन्फ़िगरेशन शामिल हैं:

```yaml
name: "mock-user-svc"                 # प्रॉक्सी सेवा का नाम, वैश्विक रूप से अद्वितीय

# राउटिंग कॉन्फ़िगरेशन
routers:
  - server: "mock-user-svc"     # सेवा का नाम
    prefix: "/mcp/user"         # रूट प्रीफिक्स, वैश्विक रूप से अद्वितीय, डुप्लिकेट नहीं होना चाहिए, सेवा या डोमेन+मॉड्यूल द्वारा अंतर करने की अनुशंसा की जाती है

    # CORS कॉन्फ़िगरेशन
    cors:
      allowOrigins:             # विकास/परीक्षण वातावरण में पूरी तरह से खोलें, उत्पादन में चयनात्मक रूप से खोलें (अधिकांश MCP क्लाइंट को CORS की आवश्यकता नहीं होती)
        - "*"
      allowMethods:             # अनुमत अनुरोध विधियां, आवश्यकतानुसार खोलें, MCP (SSE और Streamable) के लिए आमतौर पर केवल ये 3 विधियां आवश्यक होती हैं
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"        # अनुमत होना चाहिए
        - "Authorization"       # प्रमाणीकरण की आवश्यकता होने पर आवश्यक
        - "Mcp-Session-Id"      # MCP के लिए, यह कुंजी अनुरोधों में समर्थित होनी चाहिए, अन्यथा Streamable HTTP सही ढंग से काम नहीं करेगा
      exposeHeaders:
        - "Mcp-Session-Id"      # MCP के लिए, CORS सक्षम होने पर यह कुंजी एक्सपोज़ की जानी चाहिए, अन्यथा Streamable HTTP सही ढंग से काम नहीं करेगा
      allowCredentials: true    # क्या Access-Control-Allow-Credentials: true हेडर जोड़ना है

# सेवा कॉन्फ़िगरेशन
servers:
  - name: "mock-user-svc"             # सेवा का नाम, routers में server से मेल खाना चाहिए
    namespace: "user-service"         # सेवा नेमस्पेस, सेवा समूहीकरण के लिए उपयोग किया जाता है
    description: "Mock User Service"  # सेवा विवरण
    allowedTools:                     # अनुमत उपकरणों की सूची (tools का उपसमुच्चय)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # सेवा-स्तरीय कॉन्फ़िगरेशन, tools में {{.Config}} के माध्यम से संदर्भित किया जा सकता है
      Cookie: 123                                     # हार्डकोडेड कॉन्फ़िगरेशन
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # पर्यावरण चर से कॉन्फ़िगरेशन, उपयोग '{{ env "ENV_VAR_NAME" }}' है

# उपकरण कॉन्फ़िगरेशन
tools:
  - name: "register_user"                                   # उपकरण का नाम
    description: "Register a new user"                      # उपकरण विवरण
    method: "POST"                                          # लक्ष्य (अपस्ट्रीम, बैकएंड) सेवा के लिए HTTP विधि
    endpoint: "http://localhost:5236/users"                 # लक्ष्य सेवा पता
    headers:                                                # अनुरोध हेडर कॉन्फ़िगरेशन, लक्ष्य सेवा के लिए अनुरोधों में शामिल करने के लिए हेडर
      Content-Type: "application/json"                      # हार्डकोडेड हेडर
      Authorization: "{{.Request.Headers.Authorization}}"   # क्लाइंट अनुरोध से निकाले गए Authorization हेडर का उपयोग (पास-थ्रू परिदृश्यों के लिए)
      Cookie: "{{.Config.Cookie}}"                          # सेवा कॉन्फ़िगरेशन से मान का उपयोग
    args:                         # पैरामीटर कॉन्फ़िगरेशन
      - name: "username"          # पैरामीटर का नाम
        position: "body"          # पैरामीटर स्थिति: header, query, path, body
        required: true            # क्या पैरामीटर आवश्यक है
        type: "string"            # पैरामीटर प्रकार
        description: "Username"   # पैरामीटर विवरण
        default: ""               # डिफ़ॉल्ट मान
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # अनुरोध बॉडी टेम्पलेट, अनुरोध बॉडी के गतिशील जनन के लिए, उदा. पैरामीटरों से निकाले गए मान (MCP अनुरोध तर्क)
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # प्रतिक्रिया बॉडी टेम्पलेट, प्रतिक्रिया बॉडी के गतिशील जनन के लिए, उदा. प्रतिक्रिया से निकाले गए मान
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

## कॉन्फ़िगरेशन विवरण

### 1. मूल कॉन्फ़िगरेशन

- `name`: प्रॉक्सी सेवा का नाम, वैश्विक रूप से अद्वितीय, विभिन्न प्रॉक्सी सेवाओं की पहचान के लिए उपयोग किया जाता है
- `routers`: राउटिंग कॉन्फ़िगरेशन की सूची, अनुरोध अग्रेषण नियमों को परिभाषित करती है
- `servers`: सेवा कॉन्फ़िगरेशन की सूची, सेवा मेटाडेटा और अनुमत उपकरणों को परिभाषित करती है
- `tools`: उपकरण कॉन्फ़िगरेशन की सूची, विशिष्ट API कॉल नियमों को परिभाषित करती है

एक कॉन्फ़िगरेशन को नेमस्पेस के रूप में माना जा सकता है, सेवा या डोमेन द्वारा अंतर करने की अनुशंसा की जाती है, जहां एक सेवा में कई API इंटरफेस होते हैं, प्रत्येक एक उपकरण के अनुरूप होता है

### 2. राउटिंग कॉन्फ़िगरेशन

राउटिंग कॉन्फ़िगरेशन का उपयोग अनुरोध अग्रेषण नियमों को परिभाषित करने के लिए किया जाता है:

```yaml
routers:
  - server: "mock-user-svc"     # सेवा का नाम, servers में name से मेल खाना चाहिए
    prefix: "/mcp/user"         # रूट प्रीफिक्स, वैश्विक रूप से अद्वितीय, डुप्लिकेट नहीं होना चाहिए
```

डिफ़ॉल्ट रूप से, `prefix` से तीन एंडपॉइंट व्युत्पन्न होते हैं:
- SSE: `${prefix}/sse`, उदा. `/mcp/user/sse`
- SSE: `${prefix}/message`, उदा. `/mcp/user/message`
- StreamableHTTP: `${prefix}/mcp`, उदा. `/mcp/user/mcp`

### 3. CORS कॉन्फ़िगरेशन

क्रॉस-ओरिजिन रिसोर्स शेयरिंग (CORS) कॉन्फ़िगरेशन का उपयोग क्रॉस-ओरिजिन अनुरोधों के लिए पहुंच अनुमतियों को नियंत्रित करने के लिए किया जाता है:

```yaml
cors:
  allowOrigins:             # विकास/परीक्षण वातावरण में पूरी तरह से खोलें, उत्पादन में चयनात्मक रूप से खोलें (अधिकांश MCP क्लाइंट को CORS की आवश्यकता नहीं होती)
    - "*"
  allowMethods:             # अनुमत अनुरोध विधियां, आवश्यकतानुसार खोलें, MCP (SSE और Streamable) के लिए आमतौर पर केवल ये 3 विधियां आवश्यक होती हैं
    - "GET"
    - "POST"
    - "OPTIONS"
  allowHeaders:
    - "Content-Type"        # अनुमत होना चाहिए
    - "Authorization"       # प्रमाणीकरण की आवश्यकता होने पर आवश्यक
    - "Mcp-Session-Id"      # MCP के लिए, यह कुंजी अनुरोधों में समर्थित होनी चाहिए, अन्यथा Streamable HTTP सही ढंग से काम नहीं करेगा
  exposeHeaders:
    - "Mcp-Session-Id"      # MCP के लिए, CORS सक्षम होने पर यह कुंजी एक्सपोज़ की जानी चाहिए, अन्यथा Streamable HTTP सही ढंग से काम नहीं करेगा
  allowCredentials: true    # क्या Access-Control-Allow-Credentials: true हेडर जोड़ना है
```

> **सामान्यतः, MCP क्लाइंट को CORS सक्षम करने की आवश्यकता नहीं होती**

### 4. सेवा कॉन्फ़िगरेशन

सेवा कॉन्फ़िगरेशन का उपयोग सेवा मेटाडेटा, संबंधित उपकरण सूचियों और सेवा-स्तरीय कॉन्फ़िगरेशन को परिभाषित करने के लिए किया जाता है:

```yaml
servers:
  - name: "mock-user-svc"             # सेवा का नाम, routers में server से मेल खाना चाहिए
    namespace: "user-service"         # सेवा नेमस्पेस, सेवा समूहीकरण के लिए उपयोग किया जाता है
    description: "Mock User Service"  # सेवा विवरण
    allowedTools:                     # अनुमत उपकरणों की सूची (tools का उपसमुच्चय)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # सेवा-स्तरीय कॉन्फ़िगरेशन, tools में {{.Config}} के माध्यम से संदर्भित किया जा सकता है
      Cookie: 123                                     # हार्डकोडेड कॉन्फ़िगरेशन
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # पर्यावरण चर से कॉन्फ़िगरेशन, उपयोग '{{ env "ENV_VAR_NAME" }}' है
```

सेवा-स्तरीय कॉन्फ़िगरेशन tools में `{{.Config}}` के माध्यम से संदर्भित किए जा सकते हैं। यहां आप या तो कॉन्फ़िगरेशन फ़ाइल में मान हार्डकोड कर सकते हैं या उन्हें पर्यावरण चर से प्राप्त कर सकते हैं। पर्यावरण चर इंजेक्शन के लिए, `{{ env "ENV_VAR_NAME" }}` प्रारूप का उपयोग करें

### 5. उपकरण कॉन्फ़िगरेशन

उपकरण कॉन्फ़िगरेशन का उपयोग विशिष्ट API कॉल नियमों को परिभाषित करने के लिए किया जाता है:

```yaml
tools:
  - name: "register_user"                                   # उपकरण का नाम
    description: "Register a new user"                      # उपकरण विवरण
    method: "POST"                                          # लक्ष्य (अपस्ट्रीम, बैकएंड) सेवा के लिए HTTP विधि
    endpoint: "http://localhost:5236/users"                 # लक्ष्य सेवा पता
    headers:                                                # अनुरोध हेडर कॉन्फ़िगरेशन, लक्ष्य सेवा के लिए अनुरोधों में शामिल करने के लिए हेडर
      Content-Type: "application/json"                      # हार्डकोडेड हेडर
      Authorization: "{{.Request.Headers.Authorization}}"   # क्लाइंट अनुरोध से निकाले गए Authorization हेडर का उपयोग (पास-थ्रू परिदृश्यों के लिए)
      Cookie: "{{.Config.Cookie}}"                          # सेवा कॉन्फ़िगरेशन से मान का उपयोग
    args:                         # पैरामीटर कॉन्फ़िगरेशन
      - name: "username"          # पैरामीटर का नाम
        position: "body"          # पैरामीटर स्थिति: header, query, path, body
        required: true            # क्या पैरामीटर आवश्यक है
        type: "string"            # पैरामीटर प्रकार
        description: "Username"   # पैरामीटर विवरण
        default: ""               # डिफ़ॉल्ट मान
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # अनुरोध बॉडी टेम्पलेट, अनुरोध बॉडी के गतिशील जनन के लिए, उदा. पैरामीटरों से निकाले गए मान (MCP अनुरोध तर्क)
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # प्रतिक्रिया बॉडी टेम्पलेट, प्रतिक्रिया बॉडी के गतिशील जनन के लिए, उदा. प्रतिक्रिया से निकाले गए मान
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

#### 5.1 अनुरोध पैरामीटर संयोजन

लक्ष्य सेवा के लिए अनुरोध करते समय, पैरामीटरों को संयोजित किया जाना चाहिए। वर्तमान में, निम्नलिखित स्रोत हैं:
1. `.Config`: सेवा-स्तरीय कॉन्फ़िगरेशन से मान निकालें
2. `.Args`: सीधे अनुरोध पैरामीटरों से मान निकालें
3. `.Request`: अनुरोध से मान निकालें, जिसमें हेडर `.Request.Headers`, बॉडी `.Request.Body`, आदि शामिल हैं

संयोजन `requestBody` में किया जाता है, उदाहरण के लिए:
```yaml
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
```

`endpoint` (लक्ष्य पता) भी उपरोक्त स्रोतों का उपयोग मान निकालने के लिए कर सकता है, उदाहरण के लिए `http://localhost:5236/users/{{.Args.email}}/preferences` अनुरोध पैरामीटरों से मान निकालता है

#### 5.2 प्रतिक्रिया पैरामीटर संयोजन

प्रतिक्रिया बॉडी संयोजन अनुरोध बॉडी संयोजन के समान है:
1. `.Response.Data`: प्रतिक्रिया से मान निकालें, प्रतिक्रिया JSON प्रारूप में होनी चाहिए
2. `.Response.Body`: पूरी प्रतिक्रिया बॉडी को सीधे पास करें, प्रतिक्रिया सामग्री प्रारूप को अनदेखा करें और सीधे क्लाइंट को पास करें

सब कुछ `.Response` के माध्यम से निकाला जाता है, उदाहरण के लिए:
```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
``` 

## कॉन्फ़िगरेशन भंडारण

गेटवे प्रॉक्सी कॉन्फ़िगरेशन दो तरीकों से संग्रहीत किया जा सकता है:

1. डेटाबेस भंडारण (अनुशंसित):
    - SQLite3, PostgreSQL, MySQL का समर्थन करता है
    - प्रत्येक कॉन्फ़िगरेशन एक रिकॉर्ड के रूप में संग्रहीत किया जाता है
    - गतिशील अपडेट और हॉट-रीलोड का समर्थन करता है

2. फ़ाइल भंडारण:
    - प्रत्येक कॉन्फ़िगरेशन एक अलग YAML फ़ाइल के रूप में संग्रहीत किया जाता है
    - Nginx के vhost कॉन्फ़िगरेशन दृष्टिकोण के समान
    - फ़ाइल नाम सेवा के नाम का उपयोग करना चाहिए, उदा. `mock-user-svc.yaml` 
