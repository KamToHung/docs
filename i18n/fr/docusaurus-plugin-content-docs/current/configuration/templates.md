# Guide d'utilisation de Go Template

Ce document présente comment utiliser Go Template dans MCP Gateway pour gérer les données de requête et de réponse. Go Template offre des capacités de modélisation puissantes qui nous aident à traiter de manière flexible la transformation et le formatage des données.

## Syntaxe de base

Go Template utilise `{{}}` comme délimiteurs, dans lesquels diverses fonctions et variables peuvent être utilisées. Dans MCP Gateway, nous utilisons principalement les variables suivantes :

- `.Config`: Configuration au niveau du service
- `.Args`: Paramètres de requête
- `.Request`: Informations de requête originales
- `.Response`: Informations de réponse du service en amont

## Cas d'utilisation courants

### 1. Obtention de la configuration depuis les variables d'environnement

```yaml
config:
  Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Obtenir la configuration depuis la variable d'environnement
```

### 2. Extraction des valeurs depuis les en-têtes de requête

```yaml
headers:
  Authorization: "{{.Request.Headers.Authorization}}"   # Transmettre l'en-tête Authorization du client
  Cookie: "{{.Config.Cookie}}"                         # Utiliser la valeur de la configuration du service
```

### 3. Construction du corps de la requête

```yaml
requestBody: |-
  {
    "username": "{{.Args.username}}",
    "email": "{{.Args.email}}"
  }
```

### 4. Traitement des données de réponse

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
```

### 5. Traitement des données de réponse imbriquées

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

### 6. Traitement des données de tableau

Lors du traitement des données de tableau dans les réponses, vous pouvez utiliser la fonctionnalité range de Go Template :

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

Cet exemple démontre :
1. L'utilisation de la fonction `fromJSON` pour convertir une chaîne JSON en objet traversable
2. L'utilisation de `range` pour itérer sur le tableau
3. L'utilisation de la fonction `len` pour obtenir la longueur du tableau
4. L'utilisation de la fonction `add` pour les opérations mathématiques
5. L'utilisation d'instructions conditionnelles pour contrôler la séparation par virgule entre les éléments du tableau

### 7. Utilisation des paramètres dans les URLs

```yaml
endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
```

### 8. Traitement des données d'objets complexes

Lorsque vous devez convertir des structures complexes comme des objets ou des tableaux dans les requêtes ou les réponses en JSON, vous pouvez utiliser la fonction `toJSON` :

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

Dans ce cas, `settings` est un objet complexe qui sera automatiquement converti en chaîne JSON à l'aide de la fonction `toJSON`.

## Fonctions intégrées

Fonctions intégrées actuellement supportées :

1. `env`: Obtenir la valeur d'une variable d'environnement
   ```yaml
   Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'
   ```

2. `add`: Effectuer une addition d'entiers
   ```yaml
   {{ if lt (add $i 1) $len }},{{ end }}
   ```

3. `fromJSON`: Convertir une chaîne JSON en objet traversable
   ```yaml
   {{- $rows := fromJSON .Response.Data.rows }}
   ```

4. `toJSON`: Convertir un objet en chaîne JSON
   ```yaml
   "settings": {{ toJSON .Args.settings }}
   ```

Pour ajouter de nouvelles fonctions de template :
1. Décrire le cas d'utilisation spécifique et créer un issue
2. Les contributions PR sont les bienvenues, mais seules les fonctions à usage général sont actuellement acceptées

## Ressources supplémentaires

- [Documentation officielle de Go Template](https://pkg.go.dev/text/template) 