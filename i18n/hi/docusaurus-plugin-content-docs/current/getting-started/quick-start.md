# त्वरित प्रारंभ

## MCP Gateway सेटअप

1. आवश्यक निर्देशिकाएँ बनाएँ और कॉन्फ़िगरेशन फ़ाइलें डाउनलोड करें:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> चीन के भीतर के उपकरणों के लिए अली क्लाउड रिपॉजिटरी से इमेज प्राप्त कर सकते हैं
> 
> ```bash
> registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest
> ```

> LLMs को आवश्यकतानुसार बदला जा सकता है, जैसे कि Qwen
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Docker का उपयोग करके MCP Gateway चलाएँ:

```bash
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

## पहुँच और कॉन्फ़िगरेशन

1. वेब इंटरफ़ेस तक पहुँच:
   - ब्राउज़र में http://localhost:8080/ खोलें

2. MCP Server जोड़ें:
   - कॉन्फ़िगरेशन फ़ाइल कॉपी करें: https://github.com/mcp-ecosystem/mcp-gateway/blob/main/configs/mock-user-svc.yaml
   - वेब इंटरफ़ेस पर "Add MCP Server" पर क्लिक करें
   - कॉन्फ़िगरेशन पेस्ट करें और सेव करें

   ![MCP Server जोड़ने का उदाहरण](/img/add_mcp_server.png)

## उपलब्ध एंडपॉइंट्स

कॉन्फ़िगरेशन पूरा होने के बाद, सेवा निम्नलिखित एंडपॉइंट्स पर उपलब्ध होगी:

- MCP SSE: http://localhost:5235/mcp/user/sse
- MCP Streamable HTTP: http://localhost:5235/mcp/user/message
- MCP: http://localhost:5235/mcp/user/mcp

## परीक्षण

आप निम्नलिखित दो तरीकों से सेवा का परीक्षण कर सकते हैं:

1. वेब इंटरफ़ेस के MCP Chat पेज का उपयोग करें (API KEY को .env.allinone में कॉन्फ़िगर करना आवश्यक है)
2. अपने स्वयं के MCP Client का उपयोग करें (**अनुशंसित**) 