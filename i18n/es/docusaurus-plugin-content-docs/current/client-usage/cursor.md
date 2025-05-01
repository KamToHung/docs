# Guía Simple para Configurar MCP en Cursor

> **Para un tutorial más detallado sobre la configuración de MCP en Cursor, consulte la documentación oficial:**  
> https://docs.cursor.com/context/model-context-protocol

Aquí te mostraré un método básico de configuración. Primero, asegúrate de haber creado los directorios y archivos necesarios:

```bash
mkdir -p .cursor
touch .cursor/mcp.json
```

Luego configura el Servidor MCP. Aquí usaremos nuestro propio servicio de usuario simulado para pruebas:

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

A continuación, abre la configuración de Cursor y habilita este Servidor MCP en la sección **MCP**. Una vez habilitado, verás que se convierte en un pequeño punto verde y también listará las Herramientas disponibles.

![.cursor/mcp.json](/img/cursor.mcp.servers.png)

Finalmente, puedes probarlo en la ventana de Chat, por ejemplo, pidiéndole que te ayude a registrar un usuario y luego consultar la información de ese usuario. Si funciona, ¡estás listo!

Por ejemplo, puedes escribir:
```
Ayúdame a consultar el usuario ifuryst@gmail.com, si no se encuentra, regístralo con el nombre de usuario Leo
``` 
