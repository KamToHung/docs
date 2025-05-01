# Docker डिप्लॉयमेंट

## इमेज विवरण

MCP Gateway दो प्रकार के डिप्लॉयमेंट प्रदान करता है:
1. All-in-One डिप्लॉयमेंट: सभी सेवाएँ एक कंटेनर में पैक की जाती हैं, सिंगल मशीन डिप्लॉयमेंट या लोकल उपयोग के लिए उपयुक्त
2. मल्टी-कंटेनर डिप्लॉयमेंट: प्रत्येक सेवा स्वतंत्र रूप से डिप्लॉय की जाती है, प्रोडक्शन एनवायरनमेंट या क्लस्टर डिप्लॉयमेंट के लिए उपयुक्त

### इमेज रजिस्ट्री

इमेज निम्नलिखित तीन रजिस्ट्री में प्रकाशित की जाती हैं:
- Docker Hub: `docker.io/ifuryst/mcp-gateway-*`
- GitHub Container Registry: `ghcr.io/mcp-ecosystem/mcp-gateway/*`
- अलीक्लाउड कंटेनर इमेज सर्विस: `registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-*`

*ghcr मल्टी-लेयर डायरेक्टरी का समर्थन करता है, इसलिए संगठन अधिक स्पष्ट है, Docker और अलीक्लाउड के रजिस्ट्री में केवल एक लेयर डायरेक्टरी हो सकती है, इसलिए इमेज नाम में - का उपयोग किया जाता है*

### इमेज टैग

- `latest`: नवीनतम संस्करण
- `vX.Y.Z`: विशिष्ट संस्करण संख्या

> ⚡ **नोट**: वर्तमान में MCP Gateway तेजी से विकसित हो रहा है! इसलिए संस्करण संख्या के माध्यम से डिप्लॉयमेंट अधिक विश्वसनीय होगा

### उपलब्ध इमेज

```bash
# All-in-One संस्करण
docker pull docker.io/ifuryst/mcp-gateway-allinone:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# API Server
docker pull docker.io/ifuryst/mcp-gateway-apiserver:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/apiserver:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-apiserver:latest

# MCP Gateway
docker pull docker.io/ifuryst/mcp-gateway-mcp-gateway:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mcp-gateway:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mcp-gateway:latest

# Mock User Service
docker pull docker.io/ifuryst/mcp-gateway-mock-user-svc:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mock-user-svc:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mock-user-svc:latest

# Web फ्रंटएंड
docker pull docker.io/ifuryst/mcp-gateway-web:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/web:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-web:latest
```

## डिप्लॉयमेंट

### All-in-One डिप्लॉयमेंट

All-in-One डिप्लॉयमेंट सभी सेवाओं को एक कंटेनर में पैक करता है, सिंगल मशीन डिप्लॉयमेंट या लोकल उपयोग के लिए उपयुक्त। इसमें निम्नलिखित सेवाएँ शामिल हैं:
- **API Server**: प्रबंधन प्लेटफॉर्म बैकएंड, कंट्रोल प्लेन के रूप में समझा जा सकता है
- **MCP Gateway**: कोर सेवा, वास्तविक गेटवे सेवा के लिए जिम्मेदार, डेटा प्लेन के रूप में समझा जा सकता है
- **Mock User Service**: मॉक यूजर सेवा, परीक्षण के लिए यूजर सेवा प्रदान करता है (आपकी मौजूदा API सेवा इसी तरह की हो सकती है)
- **Web फ्रंटएंड**: प्रबंधन प्लेटफॉर्म फ्रंटएंड, विजुअल प्रबंधन इंटरफेस प्रदान करता है
- **Nginx**: अन्य सेवाओं के लिए रिवर्स प्रॉक्सी

सेवा प्रक्रियाओं को प्रबंधित करने के लिए Supervisor का उपयोग किया जाता है। सभी लॉग stdout में आउटपुट होते हैं

#### पोर्ट विवरण

- `8080`: Web इंटरफेस पोर्ट
- `5234`: API Server पोर्ट
- `5235`: MCP Gateway पोर्ट
- `5335`: MCP Gateway प्रबंधन पोर्ट (reload जैसे आंतरिक इंटरफेस के लिए, प्रोडक्शन एनवायरनमेंट में बाहरी एक्सपोज न करें)
- `5236`: Mock User Service पोर्ट

#### डेटा पर्सिस्टेंस

निम्नलिखित डायरेक्टरी को माउंट करने की सलाह दी जाती है:
- `/app/configs`: कॉन्फ़िगरेशन फ़ाइल डायरेक्टरी
- `/app/data`: डेटा डायरेक्टरी
- `/app/.env`: एनवायरनमेंट वेरिएबल फ़ाइल

#### उदाहरण कमांड

1. आवश्यक निर्देशिकाएँ बनाएँ और कॉन्फ़िगरेशन फ़ाइलें डाउनलोड करें:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> LLMs को आवश्यकतानुसार बदला जा सकता है, जैसे कि कियानवेन (OpenAI के साथ संगत होना चाहिए)
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Docker का उपयोग करके MCP Gateway चलाएँ:

```bash
# अलीक्लाउड कंटेनर इमेज सर्विस इमेज का उपयोग करें (चीन के भीतर के सर्वर या डिवाइस के लिए अनुशंसित)
docker run -d \
           --name mcp-gateway \
           -p 8080:80 \
           -p 5234:5234 \
           -p 5235:5235 \
           -p 5335:5335 \
           -p 5236:5236 \
           -e ENV=production \
           -v $(pwd)/configs:/app/configs \
           -v $(pwd)/data:/app/data \
           -v $(pwd)/.env.allinone:/app/.env \
           --restart unless-stopped \
           registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# GitHub Container Registry इमेज का उपयोग करें
docker run -d \
           --name mcp-gateway \
           -p 8080:80 \
           -p 5234:5234 \
           -p 5235:5235 \
           -p 5335:5335 \
           -p 5236:5236 \
           -e ENV=production \
           -v $(pwd)/configs:/app/configs \
           -v $(pwd)/data:/app/data \
           -v $(pwd)/.env.allinone:/app/.env \
           --restart unless-stopped \
           ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
```

#### सावधानियाँ

1. सुनिश्चित करें कि कॉन्फ़िगरेशन फ़ाइलें और एनवायरनमेंट वेरिएबल फ़ाइलें सही ढंग से कॉन्फ़िगर की गई हैं
2. latest के बजाय संस्करण संख्या टैग का उपयोग करने की सलाह दी जाती है
3. प्रोडक्शन एनवायरनमेंट में उचित रिसोर्स सीमाएँ कॉन्फ़िगर करने की सलाह दी जाती है
4. सुनिश्चित करें कि माउंट की गई निर्देशिकाओं के पास सही अनुमतियाँ हैं 