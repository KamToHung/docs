# Descripción General de la Arquitectura de MCP Gateway

Proporciona una visión general de la arquitectura del sistema MCP Gateway, incluyendo el gateway en sí, el backend de gestión, las APIs de soporte, los mecanismos de almacenamiento y los métodos de integración con servicios externos.

---

## Diagrama de Arquitectura

![MCP Gateway Architecture](https://www.mermaidchart.com/raw/32023f97-aaa9-4563-a4fe-2f0f4da28916?theme=light&version=v0.1&format=svg)

---

## Descripción de Módulos

### MCP Gateway (mcp-gateway)
- **Punto de Entrada**: `/*` Escucha unificada de todas las solicitudes HTTP, enrutamiento dinámico basado en la configuración a nivel de aplicación
- **Capa de Enrutamiento**: Enrutamiento basado en prefijos y sufijos `/sse`, `/message`, `/mcp`
- **Análisis de Protocolo**: Analiza el formato JSON-RPC, extrae métodos y parámetros
- **Distribución de Herramientas**: Analiza nombres de herramientas, construye parámetros de llamada
- **Llamadas a Servicios Externos**: Inicia llamadas a servicios externos y analiza resultados
- **Almacenamiento de Configuración (Lectura)**: Carga información de configuración

### Backend de Gestión (web)
- **Módulo de Configuración de Proxy**: Utilizado para configurar proxies/herramientas de MCP gateway
- **Laboratorio de Chat**: Chat simple para probar MCP, principalmente para desarrolladores y usuarios que necesitan integrarlo en sistemas autodesarrollados
- **Módulo de Gestión de Usuarios**: Mantenimiento de permisos e información de usuarios

### Servicio Backend de Gestión (apiserver)
- **Módulo de Servicio Principal**: Proporciona APIs para gestión de configuración, interfaz de usuario, consulta de historial de chat, etc.
- **Almacenamiento de Configuración (Escritura)**: Escribe modificaciones en la base de datos
- **Notificador (Emisor)**: Notifica al MCP gateway para actualizaciones en caliente cuando cambia la configuración

### Almacenamiento de Configuración
- Almacena todos los servicios MCP, herramientas, rutas y otras configuraciones
- Soporta múltiples implementaciones: disco (yaml), SQLite, PostgreSQL, MySQL, etc.

### Almacenamiento de Datos Web
- Almacena datos de usuario, registros de sesión, etc.
- Soporta múltiples implementaciones: SQLite, PostgreSQL, MySQL, etc.

### Servicios Externos
- Sistemas de servicios backend requeridos para llamadas de herramientas 