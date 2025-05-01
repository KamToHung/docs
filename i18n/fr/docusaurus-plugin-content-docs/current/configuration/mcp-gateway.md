# mcp-gateway.yaml

Les fichiers de configuration prennent en charge l'injection de variables d'environnement en utilisant la syntaxe `${VAR:default}`. Si la variable d'environnement n'est pas définie, la valeur par défaut sera utilisée.

La pratique courante consiste à injecter via différents fichiers `.env`, `.env.development`, `.env.prod`, ou vous pouvez modifier directement la configuration avec une valeur fixe.

## Configuration de Base

```yaml
port: ${MCP_GATEWAY_PORT:5235}                      # Port d'écoute du service
pid: "${MCP_GATEWAY_PID:/var/run/mcp-gateway.pid}"  # Chemin du fichier PID
```

> Le PID ici doit être cohérent avec le PID mentionné ci-dessous

## Configuration du Stockage

Le module de configuration du stockage est principalement utilisé pour stocker les informations de configuration du proxy de la passerelle. Actuellement, deux méthodes de stockage sont prises en charge :
- disk : Les configurations sont stockées sous forme de fichiers sur le disque, chaque configuration dans un fichier séparé, similaire au concept de vhost de nginx, par exemple `svc-a.yaml`, `svc-b.yaml`
- db : Stockage en base de données, chaque configuration étant un enregistrement. Actuellement, trois bases de données sont prises en charge :
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
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # Mode SSL de la base de données
  
  # Configuration du disque (utilisée lorsque le type est 'disk')
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # Chemin de stockage des fichiers de données
```

## Configuration du Notificateur

Le module de configuration du notificateur est utilisé pour notifier `mcp-gateway` des mises à jour de configuration et déclencher un rechargement à chaud sans redémarrer le service.

Actuellement, quatre méthodes de notification sont prises en charge :
- signal : Notification via des signaux du système d'exploitation, similaire à `kill -SIGHUP <pid>` ou `nginx -s reload`, peut être appelée via la commande `mcp-gateway reload`, adaptée au déploiement sur une seule machine
- api : Notification via des appels API, `mcp-gateway` écoute sur un port séparé et effectue un rechargement à chaud lors de la réception des requêtes, peut être appelée directement via `curl http://localhost:5235/_reload`, adaptée au déploiement sur une seule machine et en cluster
- redis : Notification via la fonctionnalité pub/sub de Redis, adaptée au déploiement sur une seule machine et en cluster
- composite : Notification combinée, utilisant plusieurs méthodes, avec `signal` et `api` activés par défaut, peut être combinée avec d'autres méthodes. Adaptée au déploiement sur une seule machine et en cluster, recommandée comme méthode par défaut

Rôles de notification :
- sender : Expéditeur, responsable de l'envoi des notifications, `apiserver` ne peut utiliser que ce mode
- receiver : Récepteur, responsable de la réception des notifications, il est recommandé que `mcp-gateway` sur une seule machine n'utilise que ce mode
- both : À la fois expéditeur et récepteur, `mcp-gateway` déployé en cluster peut utiliser ce mode

```yaml
notifier:
  role: "${NOTIFIER_ROLE:receiver}" # Rôle : 'sender' ou 'receiver'
  type: "${NOTIFIER_TYPE:signal}"   # Type : 'signal', 'api', 'redis', ou 'composite'

  # Configuration du signal (utilisée lorsque le type est 'signal')
  signal:
    signal: "${NOTIFIER_SIGNAL:SIGHUP}"                     # Signal à envoyer
    pid: "${NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"  # Chemin du fichier PID

  # Configuration de l'API (utilisée lorsque le type est 'api')
  api:
    port: ${NOTIFIER_API_PORT:5235}                                         # Port de l'API
    target_url: "${NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"  # Point de terminaison de rechargement

  # Configuration de Redis (utilisée lorsque le type est 'redis')
  redis:
    addr: "${NOTIFIER_REDIS_ADDR:localhost:6379}"                               # Adresse Redis
    password: "${NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"     # Mot de passe Redis
    db: ${NOTIFIER_REDIS_DB:0}                                                  # Numéro de la base de données Redis
    topic: "${NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                         # Sujet pub/sub Redis
```

## Configuration du Stockage des Sessions

La configuration du stockage des sessions est utilisée pour stocker les informations de session MCP. Actuellement, deux méthodes de stockage sont prises en charge :
- memory : Stockage en mémoire, adapté au déploiement sur une seule machine (note : les informations de session seront perdues au redémarrage)
- redis : Stockage Redis, adapté au déploiement sur une seule machine et en cluster

```yaml
session:
  type: "${SESSION_STORAGE_TYPE:memory}"                    # Type de stockage : memory, redis
  redis:
    addr: "${SESSION_REDIS_ADDR:localhost:6379}"            # Adresse Redis
    password: "${SESSION_REDIS_PASSWORD:}"                  # Mot de passe Redis
    db: ${SESSION_REDIS_DB:0}                               # Numéro de la base de données Redis
    topic: "${SESSION_REDIS_TOPIC:mcp-gateway:session}"     # Sujet pub/sub Redis
``` 