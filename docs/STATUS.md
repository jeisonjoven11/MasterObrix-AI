# MasterObrix AI — Estado del proyecto

## Visión
Aplicación de gestión para profesionales de la construcción, inicialmente orientada a EE. UU., México y España. El objetivo es ayudar a gestionar obras, clientes, presupuestos, costos y rentabilidad, incorporando IA después de validar el núcleo del producto.

## Estado actual
- React + Vite configurado.
- Dashboard mobile-first creado.
- Proyectos: crear, listar, eliminar y persistir localmente.
- Clientes: crear, listar, eliminar y persistir localmente.
- Arquitectura inicial separada en `components/` y `services/`.
- Servicio de almacenamiento local para proyectos, clientes y presupuestos.
- Editor de presupuestos creado con partidas, categorías, cantidad, unidad, precio, subtotal, margen de utilidad y total.

## Próximos pasos
1. Conectar `BudgetEditor` al Dashboard y al almacenamiento.
2. Crear lista y detalle de presupuestos.
3. Asociar clientes y proyectos de forma estructurada.
4. Añadir control de gastos reales.
5. Calcular rentabilidad de cada obra.
6. Crear cotización/PDF para cliente.
7. Convertir la aplicación en PWA instalable.
8. Preparar APK Android para pruebas externas.
9. Añadir IA de MasterObrix.
10. Validar monetización antes de publicar en Google Play.

## Distribución inicial
Se priorizará PWA + APK para validación temprana. Google Play quedará para una etapa posterior, cuando el producto tenga usuarios y una propuesta de valor validada.

## Regla de producto
Priorizar funciones que ahorren tiempo o ayuden a controlar dinero de una obra. No añadir IA por decoración: debe resolver tareas concretas.
