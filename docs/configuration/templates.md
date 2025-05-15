# Go Template 使用指南

本文档介绍在 MCP Gateway 中如何使用 Go Template 来处理请求和响应数据。Go Template 提供了强大的模板功能，可以帮助我们灵活地处理数据转换和格式化。

## 基础语法

Go Template 使用 `{{}}` 作为定界符，在定界符内可以使用各种函数和变量。在 MCP Gateway 中，我们主要使用以下几种变量：

- `.Config`: 服务级别的配置
- `.Args`: 请求参数
- `.Request`: 原始请求信息
- `.Response`: 上游服务响应信息

## 常见用例

### 1. 从环境变量获取配置

```yaml
config:
  Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # 从环境变量中获取配置
```

### 2. 从请求头中提取值

```yaml
headers:
  Authorization: "{{.Request.Headers.Authorization}}"   # 透传客户端的 Authorization 头
  Cookie: "{{.Config.Cookie}}"                          # 使用服务配置中的值
```

### 3. 构建请求体

```yaml
requestBody: |-
  {
    "username": "{{.Args.username}}",
    "email": "{{.Args.email}}"
  }
```

### 4. 处理响应数据

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
```

### 5. 处理嵌套的响应数据

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

### 6. 处理数组数据

当需要处理响应中的数组数据时，可以使用 Go Template 的 range 功能：

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

这个例子展示了如何：
1. 使用 `fromJSON` 函数将 JSON 字符串转换为可遍历的对象
2. 使用 `range` 遍历数组
3. 使用 `len` 函数获取数组长度
4. 使用 `add` 函数进行数学运算
5. 使用条件语句 `if` 来控制数组元素之间的逗号分隔

### 7. 在 URL 中使用参数

```yaml
endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
```

### 8. 处理复杂对象数据

当需要将请求或者响应的对象、数组之类的复杂结构转成JSON的话，可以使用 `toJSON` 函数：

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

此处的`settings`是一个复杂对象，使用`toJSON`函数后，会自动将`settings`转换为JSON字符串

## 内置函数

目前支持以下内置函数：

1. `env`: 获取环境变量的值
   ```yaml
   Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'
   ```

2. `add`: 执行整数加法运算
   ```yaml
   {{ if lt (add $i 1) $len }},{{ end }}
   ```

3. `fromJSON`: 将 JSON 字符串转换为可遍历的对象
   ```yaml
   {{- $rows := fromJSON .Response.Data.rows }}
   ```

4. `toJSON`: 将对象转换为 JSON 字符串
   ```yaml
   "settings": {{ toJSON .Args.settings }}
   ```

如果需要添加新的模板函数，可以
1. 描述具体的使用场景，创建 issue 说明需求
3. 欢迎实现后PR，但目前只接受通用用途的函数

## 更多资源

- [Go Template 官方文档](https://pkg.go.dev/text/template)
