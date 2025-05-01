---
sidebar_position: 1
---

# Documentación de MCP Gateway

MCP Gateway es un servicio de puerta de enlace ligero y de alta disponibilidad, desarrollado en Go, diseñado para ayudar a individuos y empresas a convertir fácilmente sus servicios API existentes (RESTful, gRPC, etc.) en MCP-Server mediante configuración.

## Características principales

- 🌐 **Independiente de plataforma**: Se puede integrar fácilmente en cualquier entorno, incluyendo máquinas físicas, máquinas virtuales, ECS, K8s, sin necesidad de modificar la infraestructura
- 🔁 **Conversión multi-protocolo**: Soporta la conversión de APIs RESTful y gRPC a MCP-Server mediante configuración
- ⚡️ **Alto rendimiento y amigable para replicación**: Diseño ligero que mantiene alta disponibilidad y rendimiento
- 🧭 **Interfaz de administración amigable**: Reduce los costos de aprendizaje y mantenimiento

## Comenzar rápidamente

- [Guía de instalación](/docs/getting-started/installation)
- [Configuración](/docs/getting-started/configuration)
- [Ejemplos de conversión de API](/docs/getting-started/examples)

## Estructura de la documentación

1. **Guía de inicio**
   - Instalación y configuración
   - Conceptos básicos
   - Inicio rápido

2. **Funcionalidades principales**
   - Conversión de API RESTful
   - Conversión de API gRPC
   - Transformación de solicitudes/respuestas
   - Gestión de sesiones

3. **Despliegue y operaciones**
   - Despliegue con Docker
   - Integración con Kubernetes
   - Monitoreo y registros
   - Optimización de rendimiento

4. **Referencia de API**
   - Interfaz de administración
   - Reglas de conversión
   - Parámetros de configuración

## Guía de contribución

¡Bienvenimos cualquier tipo de contribución! Si encuentras algún problema en la documentación o deseas agregar nuevo contenido, no dudes en enviar un Pull Request.

## Contáctanos

Si tienes alguna pregunta o sugerencia, contáctanos a través de:

- [GitHub Issues](https://github.com/mcp-ecosystem/mcp-gateway/issues)
- Soporte por correo electrónico
- Foro de la comunidad 