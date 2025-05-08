# Guía Simple para Configurar MCP en Cursor

> **Para un tutorial más detallado sobre la configuración de MCP en Cursor, consulte la documentación oficial:**  
> https://docs.cursor.com/context/model-context-protocol

Aquí te mostraré un método básico de configuración. Asegúrate de haber creado los directorios y archivos necesarios:

```bash
mkdir -p .cursor
touch .cursor/mcp.json
```

Luego, configura el Servidor MCP. Aquí usaremos nuestro servicio de usuario simulado para pruebas:

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

A continuación, abre la configuración de Cursor y habilita este Servidor MCP en la sección **MCP**. Después de habilitarlo, verás que se convierte en un pequeño punto verde y también mostrará las herramientas disponibles.

![.cursor/mcp.json](/img/cursor.mcp.servers.png)

Finalmente, puedes probarlo en la ventana de Chat. Por ejemplo, pídele que te ayude a registrar un usuario y luego consultar la información de ese usuario. Si funciona, ¡todo está listo!

Puedes intentar escribir:
```
Ayúdame a registrar un usuario Leo ifuryst@gmail.com
```

```
Ayúdame a consultar el usuario ifuryst@gmail.com, si no se encuentra por favor regístralo con el nombre de usuario Leo
```

> **A través de pruebas reales, descubrimos que este servicio simulado puede causar errores del modelo en algunos casos debido al manejo de nombres y correos electrónicos, lo cual puede ignorarse. Puedes usar tu API real en su lugar.**

![cursor usecase](/img/cursor.usecase.png) 
