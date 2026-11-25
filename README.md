# Sistema POS - Night Club Champagne

**Inversiones JYL S.A.C.S**

Sistema web simple para control de boletas, notas de ventas, gestión de productos, chicas (fichas/comisiones) y contabilidad para el Night Club Champagne.

## Características

- Gestión de productos (precios editables, ficha default)
- Registro de chicas
- Creación de boletas con múltiples productos y múltiples chicas
- División automática de la ficha entre las chicas de la boleta
- Contabilidad completa (ventas y fichas por chica) siempre en el sistema
- Impresión de boletas:
  - Opción para incluir o **no** incluir nombres de chicas y montos de ficha en la boleta impresa
  - Soporte especial para papel de **58 mm** (rollo POS clásico)
  - Ancho de papel configurable
- Historial de boletas
- Datos guardados en el navegador (localStorage)

## Cómo usar

1. Abre `index.html` en un navegador (Chrome, Edge, etc. recomendado para impresión).
2. Configura productos y chicas en sus pestañas.
3. En "Nueva Boleta":
   - Agrega productos y cantidades
   - Agrega las chicas que participan
   - Define el monto total de ficha (se divide automáticamente)
   - Crea la boleta
4. En el modal de impresión, marca o desmarca "Incluir nombres de chicas..." según si quieres que salga en la boleta o no.
5. Imprime. El sistema usa estilos optimizados para 58mm.

## Impresión 58mm

- Ve a Configuración y ajusta el ancho si es necesario.
- Al imprimir, el navegador debe estar configurado para papel térmico o personalizado.
- Los estilos `@media print` ocultan la interfaz y muestran solo la boleta.

## Datos de ejemplo

Al iniciar por primera vez carga productos de ejemplo (Jarra de Cerveza S/50 con ficha 20, etc.) y chicas de ejemplo.

---

Desarrollado para el Night Club Champagne. Todos los datos quedan en el navegador local.