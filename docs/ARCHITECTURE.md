# Arquitectura inicial

## Enfoque
La primera versión será una aplicación web responsive/PWA para validar el producto rápidamente en móvil y escritorio. La arquitectura debe permitir evolucionar a una app móvil nativa o empaquetada sin rehacer la lógica de negocio.

## Capas
- UI: dashboard y formularios mobile-first.
- Dominio: clientes, proyectos, partidas, presupuestos y cálculos.
- Persistencia: capa de datos desacoplada de la interfaz.
- IA: servicio independiente, incorporado después del núcleo funcional.

## Reglas
- No guardar claves/API secrets en el repositorio.
- Validar entradas y unidades antes de calcular.
- Mantener cálculos deterministas y auditables.
- Preparar internacionalización desde el inicio.
- Registrar decisiones técnicas importantes en `docs/`.
