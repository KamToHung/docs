# Configuration du Service Proxy Gateway

## Exemple de Configuration

Voici un exemple complet de configuration qui inclut le routage, CORS, le traitement des réponses et d'autres configurations :

```yaml
name: "mock-user-svc"                 # Nom du service proxy, globalement unique

# Configuration du routage
routers:
  - server: "mock-user-svc"     # Nom du service
    prefix: "/mcp/user"         # Préfixe de route, globalement unique, ne doit pas être dupliqué, recommandé de différencier par service ou domaine+module

    # Configuration CORS
    cors:
      allowOrigins:             # Ouvrir complètement en environnement de développement/test, ouvrir sélectivement en production (la plupart des clients MCP n'ont pas besoin de CORS)
        - "*"
      allowMethods:             # Méthodes de requête autorisées, ouvrir selon les besoins, pour MCP (SSE et Streamable) seules ces 3 méthodes sont généralement nécessaires
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"        # Doit être autorisé
        - "Authorization"       # Requis si l'authentification est nécessaire
        - "Mcp-Session-Id"      # Pour MCP, cette clé doit être supportée dans les requêtes, sinon Streamable HTTP ne fonctionnera pas correctement
      exposeHeaders:
        - "Mcp-Session-Id"      # Pour MCP, cette clé doit être exposée lorsque CORS est activé, sinon Streamable HTTP ne fonctionnera pas correctement
      allowCredentials: true    # S'il faut ajouter l'en-tête Access-Control-Allow-Credentials: true

# Configuration du service
servers:
  - name: "mock-user-svc"             # Nom du service, doit correspondre à server dans routers
    namespace: "user-service"         # Namespace du service, utilisé pour le regroupement des services
    description: "Mock User Service"  # Description du service
    allowedTools:                     # Liste des outils autorisés (sous-ensemble de tools)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # Configuration au niveau du service, peut être référencée dans tools via {{.Config}}
      Cookie: 123                                     # Configuration codée en dur
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Configuration depuis les variables d'environnement, l'utilisation est '{{ env "ENV_VAR_NAME" }}'

# Configuration des outils
tools:
  - name: "register_user"                                   # Nom de l'outil
    description: "Register a new user"                      # Description de l'outil
    method: "POST"                                          # Méthode HTTP pour les requêtes vers le service cible (upstream, backend)
    endpoint: "http://localhost:5236/users"                 # Adresse du service cible
    headers:                                                # Configuration des en-têtes de requête, en-têtes à inclure dans les requêtes vers le service cible
      Content-Type: "application/json"                      # En-tête codé en dur
      Authorization: "{{.Request.Headers.Authorization}}"   # Utilisation de l'en-tête Authorization extrait de la requête client (pour les scénarios de transmission)
      Cookie: "{{.Config.Cookie}}"                          # Utilisation de la valeur depuis la configuration du service
    args:                         # Configuration des paramètres
      - name: "username"          # Nom du paramètre
        position: "body"          # Position du paramètre : header, query, path, body
        required: true            # Si le paramètre est requis
        type: "string"            # Type du paramètre
        description: "Username"   # Description du paramètre
        default: ""               # Valeur par défaut
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # Template du corps de requête, pour la génération dynamique du corps de requête, ex. valeurs extraites des paramètres (arguments de requête MCP)
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # Template du corps de réponse, pour la génération dynamique du corps de réponse, ex. valeurs extraites de la réponse
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

## Description de la Configuration

### 1. Configuration de Base

- `name`: Nom du service proxy, globalement unique, utilisé pour identifier différents services proxy
- `routers`: Liste des configurations de routage, définit les règles de transfert des requêtes
- `servers`: Liste des configurations de service, définit les métadonnées du service et les outils autorisés
- `tools`: Liste des configurations d'outils, définit les règles d'appel API spécifiques

Une configuration peut être considérée comme un namespace, il est recommandé de différencier par service ou domaine, où un service contient de nombreuses interfaces API, chacune correspondant à un outil

### 2. Configuration du Routage

La configuration du routage est utilisée pour définir les règles de transfert des requêtes :

```yaml
routers:
  - server: "mock-user-svc"     # Nom du service, doit correspondre à name dans servers
    prefix: "/mcp/user"         # Préfixe de route, globalement unique, ne doit pas être dupliqué
```

Par défaut, trois points de terminaison sont dérivés du `prefix` :
- SSE: `${prefix}/sse`, ex. `/mcp/user/sse`
- SSE: `${prefix}/message`, ex. `/mcp/user/message`
- StreamableHTTP: `${prefix}/mcp`, ex. `/mcp/user/mcp`

### 3. Configuration CORS

La configuration Cross-Origin Resource Sharing (CORS) est utilisée pour contrôler les autorisations d'accès pour les requêtes cross-origin :

```yaml
cors:
  allowOrigins:             # Ouvrir complètement en environnement de développement/test, ouvrir sélectivement en production (la plupart des clients MCP n'ont pas besoin de CORS)
    - "*"
  allowMethods:             # Méthodes de requête autorisées, ouvrir selon les besoins, pour MCP (SSE et Streamable) seules ces 3 méthodes sont généralement nécessaires
    - "GET"
    - "POST"
    - "OPTIONS"
  allowHeaders:
    - "Content-Type"        # Doit être autorisé
    - "Authorization"       # Requis si l'authentification est nécessaire
    - "Mcp-Session-Id"      # Pour MCP, cette clé doit être supportée dans les requêtes, sinon Streamable HTTP ne fonctionnera pas correctement
  exposeHeaders:
    - "Mcp-Session-Id"      # Pour MCP, cette clé doit être exposée lorsque CORS est activé, sinon Streamable HTTP ne fonctionnera pas correctement
  allowCredentials: true    # S'il faut ajouter l'en-tête Access-Control-Allow-Credentials: true
```

> **Normalement, les clients MCP n'ont pas besoin de CORS activé**

### 4. Configuration du Service

La configuration du service est utilisée pour définir les métadonnées du service, les listes d'outils associées et les configurations au niveau du service :

```yaml
servers:
  - name: "mock-user-svc"             # Nom du service, doit correspondre à server dans routers
    namespace: "user-service"         # Namespace du service, utilisé pour le regroupement des services
    description: "Mock User Service"  # Description du service
    allowedTools:                     # Liste des outils autorisés (sous-ensemble de tools)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # Configuration au niveau du service, peut être référencée dans tools via {{.Config}}
      Cookie: 123                                     # Configuration codée en dur
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Configuration depuis les variables d'environnement, l'utilisation est '{{ env "ENV_VAR_NAME" }}'
```

Les configurations au niveau du service peuvent être référencées dans tools via `{{.Config}}`. Ici, vous pouvez soit coder en dur les valeurs dans le fichier de configuration, soit les récupérer depuis les variables d'environnement. Pour l'injection de variables d'environnement, utilisez le format `{{ env "ENV_VAR_NAME" }}`

### 5. Configuration des Outils

La configuration des outils est utilisée pour définir les règles d'appel API spécifiques :

```yaml
tools:
  - name: "register_user"                                   # Nom de l'outil
    description: "Register a new user"                      # Description de l'outil
    method: "POST"                                          # Méthode HTTP pour les requêtes vers le service cible (upstream, backend)
    endpoint: "http://localhost:5236/users"                 # Adresse du service cible
    headers:                                                # Configuration des en-têtes de requête, en-têtes à inclure dans les requêtes vers le service cible
      Content-Type: "application/json"                      # En-tête codé en dur
      Authorization: "{{.Request.Headers.Authorization}}"   # Utilisation de l'en-tête Authorization extrait de la requête client (pour les scénarios de transmission)
      Cookie: "{{.Config.Cookie}}"                          # Utilisation de la valeur depuis la configuration du service
    args:                         # Configuration des paramètres
      - name: "username"          # Nom du paramètre
        position: "body"          # Position du paramètre : header, query, path, body
        required: true            # Si le paramètre est requis
        type: "string"            # Type du paramètre
        description: "Username"   # Description du paramètre
        default: ""               # Valeur par défaut
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # Template du corps de requête, pour la génération dynamique du corps de requête, ex. valeurs extraites des paramètres (arguments de requête MCP)
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # Template du corps de réponse, pour la génération dynamique du corps de réponse, ex. valeurs extraites de la réponse
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

#### 5.1 Assemblage des Paramètres de Requête

Lors des requêtes vers le service cible, les paramètres doivent être assemblés. Actuellement, il existe les sources suivantes :
1. `.Config`: Extraire les valeurs des configurations au niveau du service
2. `.Args`: Extraire les valeurs directement des paramètres de requête
3. `.Request`: Extraire les valeurs de la requête, y compris les en-têtes `.Request.Headers`, le corps `.Request.Body`, etc.

L'assemblage se fait dans `requestBody`, par exemple :
```yaml
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
```

`endpoint` (adresse cible) peut également utiliser les sources ci-dessus pour extraire des valeurs, par exemple `http://localhost:5236/users/{{.Args.email}}/preferences` extrait des valeurs des paramètres de requête

#### 5.2 Assemblage des Paramètres de Réponse

L'assemblage du corps de réponse est similaire à l'assemblage du corps de requête :
1. `.Response.Data`: Extraire les valeurs de la réponse, la réponse doit être au format JSON
2. `.Response.Body`: Transmettre directement tout le corps de réponse, ignorer le format du contenu de la réponse et le transmettre directement au client

Tout est extrait via `.Response`, par exemple :
```yaml
responseBody: |-
  {
    "id": "{{.Response.Data.id}}",
    "username": "{{.Response.Data.username}}",
    "email": "{{.Response.Data.email}}",
    "createdAt": "{{.Response.Data.createdAt}}"
  }
``` 

## Stockage de la Configuration

La configuration du proxy gateway peut être stockée de deux manières :

1. Stockage en base de données (recommandé) :
    - Prend en charge SQLite3, PostgreSQL, MySQL
    - Chaque configuration est stockée comme un enregistrement
    - Prend en charge les mises à jour dynamiques et le rechargement à chaud

2. Stockage en fichiers :
    - Chaque configuration est stockée comme un fichier YAML séparé
    - Similaire à l'approche de configuration vhost de Nginx
    - Le nom du fichier doit utiliser le nom du service, ex. `mock-user-svc.yaml` 
