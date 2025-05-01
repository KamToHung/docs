# गेटवे प्रॉक्सी सेवा कॉन्फ़िगरेशन


## क्रॉस-ओरिजिन (CORS)
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

> **ध्यान दें:** `allowHeaders` और `exposeHeaders` में `Mcp-Session-Id` को स्पष्ट रूप से कॉन्फ़िगर करना आवश्यक है, अन्यथा क्लाइंट प्रतिक्रिया हेडर में `Mcp-Session-Id` को सही ढंग से अनुरोध और पढ़ नहीं सकता है।


## प्रतिक्रिया प्रसंस्करण

वर्तमान में **दो प्रतिक्रिया प्रसंस्करण मोड** का समर्थन है:

### 1. पास-थ्रू प्रतिक्रिया बॉडी

बैकएंड प्रतिक्रिया को किसी भी प्रकार के प्रसंस्करण के बिना सीधे क्लाइंट को अग्रेषित करता है। टेम्पलेट उदाहरण:

```yaml
responseBody: |-
  {{.Response.Body}}
```

### 2. कस्टम फ़ील्ड प्रतिक्रिया (फ़ील्ड मैपिंग)

बैकएंड प्रतिक्रिया बॉडी को JSON संरचना के रूप में पार्स करता है, विशिष्ट फ़ील्ड्स को निकालता है और फिर वापस करता है। टेम्पलेट उदाहरण:

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
``` 