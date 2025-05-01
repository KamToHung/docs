# Guide Simple pour Configurer MCP dans Cursor

> **Pour un tutoriel plus détaillé sur la configuration MCP de Cursor, veuillez consulter la documentation officielle :**  
> https://docs.cursor.com/context/model-context-protocol

Je vais vous montrer une méthode de configuration basique. D'abord, assurez-vous d'avoir créé les répertoires et fichiers nécessaires :

```bash
mkdir -p .cursor
touch .cursor/mcp.json
```

Ensuite, configurez le Serveur MCP. Ici, nous utiliserons notre propre service utilisateur simulé pour les tests :

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

Ensuite, ouvrez les paramètres de Cursor et activez ce Serveur MCP dans la section **MCP**. Une fois activé, vous le verrez se transformer en un petit point vert, et il listera également les Outils disponibles.

![.cursor/mcp.json](/img/cursor.mcp.servers.png)

Enfin, vous pouvez l'essayer dans la fenêtre de Chat, par exemple en lui demandant de vous aider à enregistrer un utilisateur puis à interroger les informations de cet utilisateur. Si cela fonctionne, vous êtes prêt !

Par exemple, vous pouvez taper :
```
Aidez-moi à interroger l'utilisateur ifuryst@gmail.com, s'il n'est pas trouvé, inscrivez-le avec le nom d'utilisateur Leo
``` 
