# apiserver.yaml

Le fichier de configuration prend en charge l'injection de variables d'environnement en utilisant la syntaxe `${VAR:default}`. Si la variable d'environnement n'est pas définie, la valeur par défaut sera utilisée.

La pratique courante consiste à injecter les valeurs via différents fichiers `.env`, `.env.development`, `.env.prod`, ou vous pouvez modifier directement la configuration avec des valeurs codées en dur.

## Configuration de la Base de Données des Messages de Chat

Cette configuration est spécifiquement pour stocker les messages de chat dans le backend (bien qu'elle puisse partager la même base de données avec les configurations du proxy). Elle correspond aux informations montrées dans l'image ci-dessous :

![Chat Sessions and Messages](/img/chat_histories.png)

Actuellement, 3 types de bases de données sont pris en charge :
- SQLite3
- PostgreSQL
- MySQL

Si vous avez besoin d'ajouter la prise en charge de bases de données supplémentaires, vous pouvez le demander dans la section [Issue](https://github.com/mcp-ecosystem/mcp-gateway/issues), ou vous pouvez implémenter l'implémentation correspondante et soumettre une PR :)

```yaml
database:
  type: "${APISERVER_DB_TYPE:sqlite}"               # Type de base de données (sqlite, postgres, mysql)
  host: "${APISERVER_DB_HOST:localhost}"            # Adresse de l'hôte de la base de données
  port: ${APISERVER_DB_PORT:5432}                   # Port de la base de données
  user: "${APISERVER_DB_USER:postgres}"             # Nom d'utilisateur de la base de données
  password: "${APISERVER_DB_PASSWORD:example}"      # Mot de passe de la base de données
  dbname: "${APISERVER_DB_NAME:./mcp-gateway.db}"   # Nom de la base de données ou chemin du fichier
  sslmode: "${APISERVER_DB_SSL_MODE:disable}"       # Mode SSL pour la connexion à la base de données
```

## Configuration du Stockage du Proxy de la Passerelle

Ceci est utilisé pour stocker les configurations du proxy de la passerelle, spécifiquement les mappages de MCP vers API, comme montré dans l'image ci-dessous :

![Gateway Proxy Configuration](/img/gateway_proxies.png)

Actuellement, 2 types sont pris en charge :
- disk : Les configurations sont stockées sous forme de fichiers sur le disque, chaque configuration dans un fichier séparé, similaire au concept de vhost de nginx, par exemple `svc-a.yaml`, `svc-b.yaml`
- db : Stockage en base de données, chaque configuration est un enregistrement. Actuellement, trois types de bases de données sont prises en charge :
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # Type de stockage : db, disk
  
  # Configuration de la base de données (utilisée lorsque le type est 'db')
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # Type de base de données (sqlite, postgres, mysql)
    host: "${GATEWAY_DB_HOST:localhost}"                # Adresse de l'hôte de la base de données
    port: ${GATEWAY_DB_PORT:5432}                       # Port de la base de données
    user: "${GATEWAY_DB_USER:postgres}"                 # Nom d'utilisateur de la base de données
    password: "${GATEWAY_DB_PASSWORD:example}"          # Mot de passe de la base de données
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # Nom de la base de données ou chemin du fichier
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # Mode SSL pour la connexion à la base de données
  
  # Configuration du disque (utilisée lorsque le type est 'disk')
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # Chemin de stockage des fichiers de données
```

## Configuration des Notifications

Le module de notification est principalement utilisé pour notifier `mcp-gateway` des mises à jour de configuration et déclencher des rechargements à chaud sans nécessiter le redémarrage du service.

Actuellement, 4 méthodes de notification sont prises en charge :
- signal : Notification via des signaux du système d'exploitation, similaire à `kill -SIGHUP <pid>` ou `nginx -s reload`. Peut être déclenché via la commande `mcp-gateway reload`, adapté au déploiement sur une seule machine
- api : Notification via un appel API. `mcp-gateway` écoute sur un port séparé et effectue un rechargement à chaud lors de la réception des requêtes. Peut être déclenché via `curl http://localhost:5235/_reload`, adapté au déploiement sur une seule machine et en cluster
- redis : Notification via la fonctionnalité pub/sub de Redis, adaptée au déploiement sur une seule machine et en cluster
- composite : Notification combinée, utilisant plusieurs méthodes. Par défaut, `signal` et `api` sont toujours activés, et peuvent être combinés avec d'autres méthodes. Adaptée au déploiement sur une seule machine et en cluster, et est l'approche par défaut recommandée

Rôles de notification :
- sender : Rôle d'expéditeur, responsable de l'envoi des notifications. `apiserver` ne peut utiliser que ce mode
- receiver : Rôle de récepteur, responsable de la réception des notifications. Il est recommandé que `mcp-gateway` sur une seule machine n'utilise que ce mode
- both : Rôles d'expéditeur et de récepteur. `mcp-gateway` déployé en cluster peut utiliser ce mode

```yaml
notifier:
  role: "${APISERVER_NOTIFIER_ROLE:sender}"              # Rôle : sender, receiver, ou both
  type: "${APISERVER_NOTIFIER_TYPE:signal}"              # Type : signal, api, redis, ou composite

  # Configuration du signal (utilisée lorsque le type est 'signal')
  signal:
    signal: "${APISERVER_NOTIFIER_SIGNAL:SIGHUP}"                       # Signal à envoyer
    pid: "${APISERVER_NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"    # Chemin du fichier PID

  # Configuration de l'API (utilisée lorsque le type est 'api')
  api:
    port: ${APISERVER_NOTIFIER_API_PORT:5235}                                           # Port de l'API
    target_url: "${APISERVER_NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"    # Point de terminaison de rechargement

  # Configuration de Redis (utilisée lorsque le type est 'redis')
  redis:
    addr: "${APISERVER_NOTIFIER_REDIS_ADDR:localhost:6379}"                             # Adresse Redis
    password: "${APISERVER_NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"   # Mot de passe Redis
    db: ${APISERVER_NOTIFIER_REDIS_DB:0}                                                # Numéro de la base de données Redis
    topic: "${APISERVER_NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                       # Sujet pub/sub Redis
```

## Configuration de l'API OpenAI

Le bloc de configuration OpenAI définit les paramètres pour l'intégration de l'API OpenAI :

```yaml
openai:
  api_key: "${OPENAI_API_KEY}"                                  # Clé API OpenAI (requise)
  model: "${OPENAI_MODEL:gpt-4.1}"                              # Modèle à utiliser
  base_url: "${OPENAI_BASE_URL:https://api.openai.com/v1/}"     # URL de base de l'API
```

Actuellement, seules les appels LLM compatibles avec l'API OpenAI sont intégrés 