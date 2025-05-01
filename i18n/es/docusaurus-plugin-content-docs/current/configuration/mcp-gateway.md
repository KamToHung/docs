# mcp-gateway.yaml

El archivo de configuración admite la inyección de variables de entorno usando la sintaxis `${VAR:default}`. Si la variable de entorno no está configurada, se utilizará el valor predeterminado.

La práctica común es inyectar a través de diferentes archivos `.env`, `.env.development`, `.env.prod`, aunque también se puede modificar directamente la configuración con un valor fijo.

## Configuración básica

```yaml
port: ${MCP_GATEWAY_PORT:5235}                      # Puerto de escucha del servicio
pid: "${MCP_GATEWAY_PID:/var/run/mcp-gateway.pid}"  # Ruta del archivo PID
```

> El PID aquí debe coincidir con el PID mencionado a continuación

## Configuración de almacenamiento

El módulo de configuración de almacenamiento se utiliza principalmente para almacenar la información de configuración del proxy del gateway. Actualmente admite dos métodos de almacenamiento:
- disk: La configuración se almacena en el disco en forma de archivos, cada configuración en un archivo separado, similar a los vhost de nginx, por ejemplo `svc-a.yaml`, `svc-b.yaml`
- db: Almacenamiento en base de datos, cada configuración es un registro. Actualmente admite tres bases de datos:
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # Tipo de almacenamiento: db, disk
  
  # Configuración de base de datos (usado cuando type es 'db')
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # Tipo de base de datos (sqlite,postgres, myslq)
    host: "${GATEWAY_DB_HOST:localhost}"                # Dirección del host de la base de datos
    port: ${GATEWAY_DB_PORT:5432}                       # Puerto de la base de datos
    user: "${GATEWAY_DB_USER:postgres}"                 # Usuario de la base de datos
    password: "${GATEWAY_DB_PASSWORD:example}"          # Contraseña de la base de datos
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # Nombre de la base de datos o ruta del archivo
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # Modo SSL de la conexión a la base de datos
  
  # Configuración de disco (usado cuando type es 'disk')
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # Ruta de almacenamiento de archivos de datos
```

## Configuración de notificación

El módulo de configuración de notificación se utiliza principalmente para notificar a `mcp-gateway` cuando hay actualizaciones de configuración, permitiendo la recarga en caliente sin necesidad de reiniciar el servicio.

Actualmente admite 4 métodos de notificación:
- signal: Notificación mediante señales del sistema operativo, similar a `kill -SIGHUP <pid>` o `nginx -s reload`, se puede llamar mediante el comando `mcp-gateway reload`, adecuado para despliegues en una sola máquina
- api: Notificación mediante una llamada API, `mcp-gateway` escuchará en un puerto independiente y realizará una recarga en caliente cuando reciba la solicitud, se puede llamar directamente con `curl http://localhost:5235/_reload`, adecuado para despliegues en una sola máquina o en clúster
- redis: Notificación mediante la funcionalidad de publicación/suscripción de Redis, adecuado para despliegues en una sola máquina o en clúster
- composite: Notificación combinada, mediante múltiples métodos, por defecto `signal` y `api` siempre están habilitados, se pueden combinar con otros métodos. Adecuado para despliegues en una sola máquina o en clúster, también es el método predeterminado recomendado

La notificación distingue roles:
- sender: Remitente, responsable de enviar notificaciones, `apiserver` solo puede usar este modo
- receiver: Receptor, responsable de recibir notificaciones, se recomienda que `mcp-gateway` en una sola máquina use solo este modo
- both: Tanto remitente como receptor, `mcp-gateway` en despliegue en clúster puede usar este modo

```yaml
notifier:
  role: "${NOTIFIER_ROLE:receiver}" # Rol: 'sender' (remitente) o 'receiver' (receptor)
  type: "${NOTIFIER_TYPE:signal}"   # Tipo: 'signal' (señal), 'api', 'redis' o 'composite' (combinado)

  # Configuración de señal (usado cuando type es 'signal')
  signal:
    signal: "${NOTIFIER_SIGNAL:SIGHUP}"                     # Señal a enviar
    pid: "${NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"  # Ruta del archivo PID

  # Configuración de API (usado cuando type es 'api')
  api:
    port: ${NOTIFIER_API_PORT:5235}                                         # Puerto de la API
    target_url: "${NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"  # Endpoint de recarga

  # Configuración de Redis (usado cuando type es 'redis')
  redis:
    addr: "${NOTIFIER_REDIS_ADDR:localhost:6379}"                               # Dirección de Redis
    password: "${NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"     # Contraseña de Redis
    db: ${NOTIFIER_REDIS_DB:0}                                                  # Número de base de datos de Redis
    topic: "${NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                         # Tema de publicación/suscripción de Redis
```

## Configuración de almacenamiento de sesión

La configuración de almacenamiento de sesión se utiliza para almacenar la información de sesión en MCP. Actualmente admite dos métodos de almacenamiento:
- memory: Almacenamiento en memoria, adecuado para despliegues en una sola máquina (tenga en cuenta que se perderá la información de la sesión al reiniciar)
- redis: Almacenamiento en Redis, adecuado para despliegues en una sola máquina o en clúster

```yaml
session:
  type: "${SESSION_STORAGE_TYPE:memory}"                    # Tipo de almacenamiento: memory, redis
  redis:
    addr: "${SESSION_REDIS_ADDR:localhost:6379}"            # Dirección de Redis
    password: "${SESSION_REDIS_PASSWORD:}"                  # Contraseña de Redis
    db: ${SESSION_REDIS_DB:0}                               # Número de base de datos de Redis
    topic: "${SESSION_REDIS_TOPIC:mcp-gateway:session}"     # Tema de publicación/suscripción de Redis
``` 