# Vue d'ensemble de l'architecture de la passerelle MCP

Présente une vue d'ensemble de l'architecture du système MCP Gateway, y compris la passerelle elle-même, le backend de gestion, les API de support, les mécanismes de stockage et les méthodes d'intégration avec les services externes.

---

## Diagramme d'architecture

![MCP Gateway Architecture](https://www.mermaidchart.com/raw/32023f97-aaa9-4563-a4fe-2f0f4da28916?theme=light&version=v0.1&format=svg)

---

## Description des modules

### Passerelle MCP (mcp-gateway)
- **Point d'entrée** : `/*` Écoute unifiée de toutes les requêtes HTTP, routage dynamique basé sur la configuration au niveau de l'application
- **Couche de routage** : Routage basé sur les préfixes et suffixes `/sse`, `/message`, `/mcp`
- **Analyse de protocole** : Analyse du format JSON-RPC, extraction des méthodes et paramètres
- **Distribution d'outils** : Analyse des noms d'outils, construction des paramètres d'appel
- **Appels aux services externes** : Lancement des appels aux services externes et analyse des résultats
- **Stockage de configuration (lecture)** : Chargement des informations de configuration

### Backend de gestion (web)
- **Module de configuration des proxies** : Utilisé pour configurer les proxies/outils de la passerelle MCP
- **Laboratoire de chat** : Chat simple pour tester MCP, principalement destiné aux développeurs et aux utilisateurs qui doivent l'intégrer dans des systèmes auto-développés
- **Module de gestion des utilisateurs** : Maintenance des permissions et informations utilisateur

### Service backend de gestion (apiserver)
- **Module de service principal** : Fournit des API pour la gestion de la configuration, l'interface utilisateur, la requête d'historique de chat, etc.
- **Stockage de configuration (écriture)** : Écrit les modifications dans la base de données
- **Notificateur (émetteur)** : Notifie la passerelle MCP pour les mises à jour à chaud lors des changements de configuration

### Stockage de configuration
- Stocke toutes les configurations des services MCP, outils, routes, etc.
- Prend en charge plusieurs implémentations : disque (yaml), SQLite, PostgreSQL, MySQL, etc.

### Stockage de données Web
- Stocke les données utilisateur, les enregistrements de session, etc.
- Prend en charge plusieurs implémentations : SQLite, PostgreSQL, MySQL, etc.

### Services externes
- Systèmes de services backend requis pour les appels d'outils 