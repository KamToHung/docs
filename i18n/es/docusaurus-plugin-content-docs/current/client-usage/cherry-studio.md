# Guía de configuración MCP de Cherry Studio
Cherry Studio es un cliente de escritorio que admite múltiples proveedores de servicios de modelos de lenguaje a gran escala (LLM), compatible con sistemas Windows, Mac y Linux.
Cherry Studio Github: [cherry-studio/docs/README.zh.md](https://github.com/CherryHQ/cherry-studio/blob/main/docs/README.zh.md)

> **Para un tutorial más detallado sobre la configuración MCP de Cherry Studio, consulte la documentación oficial:**  
> https://docs.cherry-ai.com/advanced-basic/mcp

Primero, configuramos el servidor MCP en la configuración de **Servidores MCP**. Aquí usamos nuestro propio servicio de usuario simulado para pruebas:
![cherrystudio.mcp.servers.png](/img/cherrystudio.mcp.servers.png)

A continuación, después de activarlo haciendo clic en el botón en la esquina superior derecha, haga clic en **Herramientas** para ver las herramientas en este servicio MCP, junto con sus parámetros y tipos de parámetros.

![cherrystudio.mcp.tools.png](/img/cherrystudio.mcp.tools.png)

Finalmente, puede probarlo en la ventana de chat. Por ejemplo, pídale que registre un usuario y luego consulte la información de ese usuario. Si funciona, está listo.

Por ejemplo, puede escribir:
```
Ayúdame a registrar un usuario Leo ifuryst@gmail.com
```

```
Ayúdame a consultar el usuario ifuryst@gmail.com, si no se encuentra, por favor regístralo con el nombre de usuario Leo
```

![cherrystudio.usecase.png](/img/cherrystudio.usecase.png)

> **Al chatear con LLM, puede ver que durante el proceso de interacción, reconoce inteligentemente las intenciones de las tareas y selecciona automáticamente las herramientas óptimas del conjunto de herramientas para llamadas automatizadas**

👇👇👇👇👇👇 Si deseas ayudar a mejorar esta documentación, puedes hacerlo aquí, ¡muchas gracias! ❤️ 