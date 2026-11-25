# Sistema POS - Night Club Champagne

**Inversiones JYL S.A.C.S**

Sistema web simple para control de boletas, notas de ventas, gestión de productos, chicas (fichas/comisiones) y contabilidad para el Night Club Champagne.

## Características

- Gestión de productos (precio + ficha por unidad)
- Registro de chicas
- **Ficha automática por producto**: cada producto ya tiene su ficha definida
- En cada boleta, **por cada producto** puedes asignar la ficha a:
  - Una sola chica
  - Varias chicas (se divide entre ellas)
  - Ninguna (solo cliente, nadie se lleva ficha de ese producto)
- Contabilidad completa siempre en el sistema (aunque no se imprima)
- Impresión de boletas:
  - Opción para incluir o **no** incluir nombres de chicas y fichas
  - Soporte especial para papel de **58 mm**
  - Ancho de papel configurable
- Historial de boletas
- Datos guardados en el navegador (localStorage)

## Cómo usar

1. Abre `index.html` en un navegador (Chrome o Edge recomendado).
2. Configura productos (con su ficha) y chicas.
3. En **Nueva Boleta**:
   - Agrega productos y cantidad
   - En cada producto marca las chicas que se llevan la ficha de ese producto (o no marques ninguna)
   - El resumen se actualiza solo
   - Crea la boleta
4. Al imprimir elige si quieres que salgan las chicas o no.

## Ejemplo

- Jarra de Cerveza (ficha S/20) → marcas 2 chicas → S/10 cada una
- Agua (ficha S/0 o la que pongas) → no marcas ninguna chica → solo cliente

Todo queda registrado en Contabilidad.

---

Desarrollado para el Night Club Champagne.