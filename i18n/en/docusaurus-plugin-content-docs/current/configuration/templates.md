# Go Template Usage Guide

This document introduces how to use Go Template in MCP Gateway to handle request and response data. Go Template provides powerful templating capabilities that help us flexibly process data transformation and formatting.

## Basic Syntax

Go Template uses `{{}}` as delimiters, within which various functions and variables can be used. In MCP Gateway, we mainly use the following variables:

- `.Config`: Service-level configuration
- `.Args`: Request parameters
- `.Request`: Original request information
- `.Response`: Upstream service response information

## Common Use Cases

### 1. Getting Configuration from Environment Variables

```yaml
config:
  Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Get configuration from environment variable
```

### 2. Extracting Values from Request Headers

```yaml
headers:
  Authorization: "{{.Request.Headers.Authorization}}"   # Forward client's Authorization header
  Cookie: "{{.Config.Cookie}}"                         # Use value from service configuration
```

### 3. Building Request Body

```yaml
requestBody: |-
  {
    "username": "{{.Args.username}}",
    "email": "{{.Args.email}}"
  }
```

### 4. Processing Response Data

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
```

### 5. Processing Nested Response Data

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

### 6. Processing Array Data

When processing array data in responses, you can use Go Template's range functionality:

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

This example demonstrates:
1. Using `fromJSON` function to convert JSON string to traversable object
2. Using `range` to iterate over array
3. Using `len` function to get array length
4. Using `add` function for mathematical operations
5. Using conditional statements to control comma separation between array elements

### 7. Using Parameters in URLs

```yaml
endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
```

### 8. Handling Complex Object Data

When you need to convert complex structures like objects or arrays in requests or responses to JSON, you can use the `toJSON` function:

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

In this case, `settings` is a complex object that will be automatically converted to a JSON string using the `toJSON` function.

## Built-in Functions

Currently supported built-in functions:

1. `env`: Get environment variable value
   ```yaml
   Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'
   ```

2. `add`: Perform integer addition
   ```yaml
   {{ if lt (add $i 1) $len }},{{ end }}
   ```

3. `fromJSON`: Convert JSON string to traversable object
   ```yaml
   {{- $rows := fromJSON .Response.Data.rows }}
   ```

4. `toJSON`: Convert an object to a JSON string
   ```yaml
   "settings": {{ toJSON .Args.settings }}
   ```

To add new template functions:
1. Describe the specific use case and create an issue
2. Welcome PR contributions, but currently only accepting general-purpose functions

## Additional Resources

- [Go Template Official Documentation](https://pkg.go.dev/text/template) 