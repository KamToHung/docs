# Guide de configuration MCP de Cherry Studio
Cherry Studio est un client de bureau qui prend en charge plusieurs fournisseurs de services de modèles de langage à grande échelle (LLM), compatible avec les systèmes Windows, Mac et Linux.
Cherry Studio Github: [cherry-studio/docs/README.zh.md](https://github.com/CherryHQ/cherry-studio/blob/main/docs/README.zh.md)

> **Pour un tutoriel plus détaillé sur la configuration MCP de Cherry Studio, veuillez consulter la documentation officielle :**  
> https://docs.cherry-ai.com/advanced-basic/mcp

D'abord, nous configurons le serveur MCP dans les paramètres **Serveurs MCP**. Ici, nous utilisons notre propre service utilisateur simulé pour les tests :
![cherrystudio.mcp.servers.png](../../../../../static/img/cherrystudio.mcp.servers.png)

Ensuite, après l'avoir activé en cliquant sur le bouton en haut à droite, cliquez sur **Outils** pour voir les outils de ce service MCP, ainsi que leurs paramètres et types de paramètres.

![cherrystudio.mcp.tools.png](../../../../../static/img/cherrystudio.mcp.tools.png)

Enfin, vous pouvez l'essayer dans la fenêtre de chat. Par exemple, demandez-lui d'enregistrer un utilisateur, puis de consulter les informations de cet utilisateur. Si cela fonctionne, c'est terminé.

Par exemple, vous pouvez taper :
```
Aidez-moi à enregistrer un utilisateur Leo ifuryst@gmail.com
```

```
Aidez-moi à rechercher l'utilisateur ifuryst@gmail.com, s'il n'est pas trouvé, veuillez l'enregistrer avec le nom d'utilisateur Leo
```

![cherrystudio.mcp.servers.choose.png](../../../../../static/img/cherrystudio.mcp.servers.choose.png)
![cherrystudio.usecase.png](../../../../../static/img/cherrystudio.usecase.png)

> **Lors de la conversation avec LLM, vous pouvez voir que pendant le processus d'interaction, il reconnaît intelligemment les intentions des tâches et sélectionne automatiquement les outils optimaux de l'ensemble d'outils pour des appels automatisés**

👇👇👇👇👇👇 Si vous souhaitez contribuer à l'amélioration de cette documentation, n'hésitez pas à participer. Merci beaucoup ❤️ 