# Configuration du Service Proxy de la Passerelle

## Partage des Ressources entre Origines (CORS)
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

> **Note :** Vous devez explicitement configurer `Mcp-Session-Id` à la fois dans `allowHeaders` et `exposeHeaders`, sinon le client ne pourra pas correctement demander et lire le `Mcp-Session-Id` dans les en-têtes de réponse.

## Gestion des Réponses

Actuellement, **deux modes de gestion des réponses** sont pris en charge :

### 1. Corps de Réponse Transparent

Aucun traitement n'est effectué sur la réponse du backend, elle est directement transmise au client. Exemple de modèle :

```yaml
responseBody: |-
  {{.Response.Body}}
```

### 2. Réponse de Champs Personnalisés (Mapping de Champs)

Analyser le corps de la réponse du backend comme une structure JSON, extraire des champs spécifiques, puis les renvoyer. Exemple de modèle :

```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
``` 