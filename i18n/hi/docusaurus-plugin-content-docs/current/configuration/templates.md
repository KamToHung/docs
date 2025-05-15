# Go Template उपयोग गाइड

यह दस्तावेज़ MCP Gateway में Go Template का उपयोग करके अनुरोध और प्रतिक्रिया डेटा को संसाधित करने के तरीके का वर्णन करता है। Go Template शक्तिशाली टेम्पलेट क्षमताएं प्रदान करता है जो हमें डेटा परिवर्तन और फॉर्मेटिंग को लचीले ढंग से संसाधित करने में मदद करता है।

## बुनियादी वाक्यविन्यास

Go Template `{{}}` को डिलिमिटर के रूप में उपयोग करता है, जिसके भीतर विभिन्न फ़ंक्शन और वेरिएबल का उपयोग किया जा सकता है। MCP Gateway में, हम मुख्य रूप से निम्नलिखित वेरिएबल का उपयोग करते हैं:

- `.Config`: सेवा-स्तरीय कॉन्फ़िगरेशन
- `.Args`: अनुरोध पैरामीटर
- `.Request`: मूल अनुरोध जानकारी
- `.Response`: अपस्ट्रीम सेवा प्रतिक्रिया जानकारी

## सामान्य उपयोग के मामले

### 1. पर्यावरण चर से कॉन्फ़िगरेशन प्राप्त करना

```yaml
config:
  Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # पर्यावरण चर से कॉन्फ़िगरेशन प्राप्त करें
```

### 2. अनुरोध हेडर से मान निकालना

```yaml
headers:
  Authorization: "{{.Request.Headers.Authorization}}"   # क्लाइंट का Authorization हेडर आगे भेजें
  Cookie: "{{.Config.Cookie}}"                         # सेवा कॉन्फ़िगरेशन से मान का उपयोग करें
```

### 3. अनुरोध बॉडी का निर्माण

```yaml
requestBody: |-
  {
    "username": "{{.Args.username}}",
    "email": "{{.Args.email}}"
  }
```

### 4. प्रतिक्रिया डेटा का संसाधन

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
```

### 5. नेस्टेड प्रतिक्रिया डेटा का संसाधन

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

### 6. सरणी डेटा का संसाधन

प्रतिक्रियाओं में सरणी डेटा को संसाधित करते समय, आप Go Template की range कार्यक्षमता का उपयोग कर सकते हैं:

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

यह उदाहरण दर्शाता है:
1. JSON स्ट्रिंग को पारगम्य वस्तु में बदलने के लिए `fromJSON` फ़ंक्शन का उपयोग
2. सरणी पर पुनरावृत्ति के लिए `range` का उपयोग
3. सरणी की लंबाई प्राप्त करने के लिए `len` फ़ंक्शन का उपयोग
4. गणितीय संचालन के लिए `add` फ़ंक्शन का उपयोग
5. सरणी तत्वों के बीच अल्पविराम विभाजन को नियंत्रित करने के लिए सशर्त कथनों का उपयोग

### 7. URL में पैरामीटर का उपयोग

```yaml
endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
```

### 8. जटिल ऑब्जेक्ट डेटा का संचालन

जब आपको अनुरोध या प्रतिक्रियाओं में ऑब्जेक्ट या एरे जैसी जटिल संरचनाओं को JSON में बदलने की आवश्यकता होती है, तो आप `toJSON` फ़ंक्शन का उपयोग कर सकते हैं:

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

इस मामले में, `settings` एक जटिल ऑब्जेक्ट है जिसे `toJSON` फ़ंक्शन का उपयोग करके स्वचालित रूप से JSON स्ट्रिंग में बदल दिया जाएगा।

## अंतर्निहित फ़ंक्शन

वर्तमान में समर्थित अंतर्निहित फ़ंक्शन:

1. `env`: पर्यावरण चर मान प्राप्त करें
   ```yaml
   Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'
   ```

2. `add`: पूर्णांक जोड़ करें
   ```yaml
   {{ if lt (add $i 1) $len }},{{ end }}
   ```

3. `fromJSON`: JSON स्ट्रिंग को पारगम्य वस्तु में बदलें
   ```yaml
   {{- $rows := fromJSON .Response.Data.rows }}
   ```

4. `toJSON`: ऑब्जेक्ट को JSON स्ट्रिंग में बदलें
   ```yaml
   "settings": {{ toJSON .Args.settings }}
   ```

नए टेम्पलेट फ़ंक्शन जोड़ने के लिए:
1. विशिष्ट उपयोग के मामले का वर्णन करें और एक issue बनाएं
2. PR योगदान का स्वागत है, लेकिन वर्तमान में केवल सामान्य उद्देश्य वाले फ़ंक्शन स्वीकार किए जाते हैं

## अतिरिक्त संसाधन

- [Go Template आधिकारिक दस्तावेज़ीकरण](https://pkg.go.dev/text/template) 