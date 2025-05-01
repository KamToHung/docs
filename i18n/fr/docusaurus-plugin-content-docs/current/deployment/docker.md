# Docker

## Aperçu des Images

MCP Gateway propose deux méthodes de déploiement :
1. **Déploiement Tout-en-Un** : Tous les services sont regroupés dans un seul conteneur, adapté aux déploiements locaux ou à nœud unique.
2. **Déploiement Multi-Conteneurs** : Chaque service est déployé séparément, adapté aux environnements de production ou en cluster.

### Registres d'Images

Les images sont publiées dans les registres suivants :
- Docker Hub : `docker.io/ifuryst/mcp-gateway-*`
- GitHub Container Registry : `ghcr.io/mcp-ecosystem/mcp-gateway/*`
- Alibaba Cloud Container Registry : `registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-*`

*Le GitHub Container Registry prend en charge les répertoires multi-niveaux pour une organisation plus claire, tandis que Docker Hub et les registres Alibaba Cloud utilisent une nomenclature plate avec des tirets.*

### Tags d'Images

- `latest` : Dernière version
- `vX.Y.Z` : Version spécifique

> ⚡ **Note** : MCP Gateway est en développement rapide ! Il est recommandé d'utiliser des tags de version spécifiques pour des déploiements plus fiables.

### Images Disponibles

```bash
# Version Tout-en-Un
docker pull docker.io/ifuryst/mcp-gateway-allinone:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# Serveur API
docker pull docker.io/ifuryst/mcp-gateway-apiserver:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/apiserver:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-apiserver:latest

# MCP Gateway
docker pull docker.io/ifuryst/mcp-gateway-mcp-gateway:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mcp-gateway:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mcp-gateway:latest

# Service Utilisateur Mock
docker pull docker.io/ifuryst/mcp-gateway-mock-user-svc:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mock-user-svc:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mock-user-svc:latest

# Interface Web
docker pull docker.io/ifuryst/mcp-gateway-web:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/web:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-web:latest
```

## Déploiement

### Déploiement Tout-en-Un

Le déploiement Tout-en-Un regroupe tous les services dans un seul conteneur, idéal pour les déploiements à nœud unique ou locaux. Il comprend les services suivants :
- **Serveur API** : Backend de gestion (Plan de Contrôle)
- **MCP Gateway** : Service principal gérant le trafic de la passerelle (Plan de Données)
- **Service Utilisateur Mock** : Service utilisateur simulé pour les tests (vous pouvez le remplacer par votre service API existant)
- **Interface Web** : Interface de gestion basée sur le web
- **Nginx** : Proxy inverse pour les services internes

Les processus sont gérés à l'aide de Supervisor, et tous les logs sont envoyés vers stdout.

#### Ports

- `8080` : Interface Web
- `5234` : Serveur API
- `5235` : MCP Gateway
- `5335` : MCP Gateway Admin (points de terminaison internes comme le rechargement ; NE PAS exposer en production)
- `5236` : Service Utilisateur Mock

#### Persistance des Données

Il est recommandé de monter les répertoires suivants :
- `/app/configs` : Fichiers de configuration
- `/app/data` : Stockage des données
- `/app/.env` : Fichier de variables d'environnement

#### Exemples de Commandes

1. Créez les répertoires nécessaires et téléchargez les fichiers de configuration :

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> Vous pouvez remplacer le LLM par défaut si nécessaire (doit être compatible avec OpenAI), par exemple, utiliser Qwen :
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Exécutez MCP Gateway avec Docker :

```bash
# Utilisation du registre Alibaba Cloud (recommandé pour les serveurs/appareils en Chine)
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
           registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# Utilisation du GitHub Container Registry
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

#### Notes

1. Assurez-vous que les fichiers de configuration et le fichier d'environnement sont correctement configurés.
2. Il est recommandé d'utiliser un tag de version spécifique au lieu de `latest`.
3. Définissez des limites de ressources appropriées pour les déploiements en production.
4. Assurez-vous que les répertoires montés ont les permissions appropriées. 