# Guide Simple pour Configurer MCP dans Cursor

> **Pour un tutoriel plus détaillé sur la configuration MCP de Cursor, veuillez consulter la documentation officielle :**  
> https://docs.cursor.com/context/model-context-protocol

Je vais vous montrer une méthode de configuration de base. Assurez-vous d'avoir créé les répertoires et fichiers nécessaires :

```bash
mkdir -p .cursor
touch .cursor/mcp.json
```

Ensuite, configurez le Serveur MCP. Ici, nous utiliserons notre service utilisateur simulé pour les tests :

![.cursor/mcp.json](/img/cursor.mcp.json.png)

```json
{
  "mcpServers": {
    "user": {
      "url": "http://localhost:5235/mcp/user/sse"
    }
  }
}
```

Ensuite, ouvrez les paramètres de Cursor et activez ce Serveur MCP dans la section **MCP**. Après l'activation, vous verrez qu'il se transforme en un petit point vert et affichera également les outils disponibles.

![.cursor/mcp.json](/img/cursor.mcp.servers.png)

Enfin, vous pouvez l'essayer dans la fenêtre de Chat. Par exemple, demandez-lui de vous aider à enregistrer un utilisateur puis à interroger les informations de cet utilisateur. Si cela fonctionne, vous êtes prêt.

Vous pouvez essayer de taper :
```
Aidez-moi à enregistrer un utilisateur Leo ifuryst@gmail.com
```

```
Aidez-moi à interroger l'utilisateur ifuryst@gmail.com, si non trouvé, veuillez l'enregistrer avec le nom d'utilisateur Leo
```

> **Grâce à des tests réels, nous avons découvert que ce service simulé peut causer des erreurs de modèle dans certains cas en raison du traitement des noms et des e-mails, ce qui peut être ignoré. Vous pouvez utiliser votre API réelle à la place.**

![cursor usecase](/img/cursor.usecase.png) 
