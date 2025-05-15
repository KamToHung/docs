# Go Template Anleitung

Dieses Dokument beschreibt die Verwendung von Go Template in MCP Gateway zur Verarbeitung von Anfrage- und Antwortdaten. Go Template bietet leistungsstarke Template-Funktionen, die uns helfen, Daten flexibel zu transformieren und zu formatieren.

## Grundlegende Syntax

Go Template verwendet `{{}}` als Begrenzer, innerhalb derer verschiedene Funktionen und Variablen verwendet werden können. In MCP Gateway verwenden wir hauptsächlich die folgenden Variablen:

- `.Config`: Service-Level-Konfiguration
- `.Args`: Anfrageparameter
- `.Request`: Originale Anfrageinformationen
- `.Response`: Upstream-Service-Antwortinformationen

## Häufige Anwendungsfälle

### 1. Konfiguration aus Umgebungsvariablen abrufen

```yaml
config:
  Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Konfiguration aus Umgebungsvariable abrufen
```

### 2. Werte aus Anfrage-Headern extrahieren

```yaml
headers:
  Authorization: "{{.Request.Headers.Authorization}}"   # Authorization-Header des Clients weiterleiten
  Cookie: "{{.Config.Cookie}}"                         # Wert aus der Service-Konfiguration verwenden
```

### 3. Anfrage-Body erstellen

```yaml
requestBody: |-
  {
    "username": "{{.Args.username}}",
    "email": "{{.Args.email}}"
  }
```

### 4. Antwortdaten verarbeiten

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
```

### 5. Verschachtelte Antwortdaten verarbeiten

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

### 6. Array-Daten verarbeiten

Bei der Verarbeitung von Array-Daten in Antworten können Sie die range-Funktionalität von Go Template verwenden:

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

Dieses Beispiel zeigt:
1. Verwendung der `fromJSON`-Funktion zum Konvertieren eines JSON-Strings in ein durchsuchbares Objekt
2. Verwendung von `range` zum Durchlaufen des Arrays
3. Verwendung der `len`-Funktion zum Abrufen der Array-Länge
4. Verwendung der `add`-Funktion für mathematische Operationen
5. Verwendung von bedingten Anweisungen zur Steuerung der Kommatrennung zwischen Array-Elementen

### 7. Parameter in URLs verwenden

```yaml
endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
```

## Eingebaute Funktionen

Aktuell unterstützte eingebaute Funktionen:

1. `env`: Umgebungsvariablenwert abrufen
   ```yaml
   Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'
   ```

2. `add`: Ganzzahladdition durchführen
   ```yaml
   {{ if lt (add $i 1) $len }},{{ end }}
   ```

3. `fromJSON`: JSON-String in durchsuchbares Objekt konvertieren
   ```yaml
   {{- $rows := fromJSON .Response.Data.rows }}
   ```

Um neue Template-Funktionen hinzuzufügen:
1. Spezifischen Anwendungsfall beschreiben und ein Issue erstellen
2. PR-Beiträge sind willkommen, aber derzeit werden nur allgemeine Funktionen akzeptiert

## Weitere Ressourcen

- [Offizielle Go Template Dokumentation](https://pkg.go.dev/text/template) 