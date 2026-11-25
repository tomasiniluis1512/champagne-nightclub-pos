# POS Champagne - Aplicativo de Escritorio

**Inversiones JYL S.A.C.S**

## Cómo convertirlo en un programa (sin navegador)

### Requisitos
1. Instala Node.js desde https://nodejs.org (versión LTS)

### Pasos
1. Descarga este repositorio (ZIP) y extráelo.
2. Abre una terminal (CMD o PowerShell) dentro de la carpeta.
3. Ejecuta estos comandos:

```bash
npm install
npm start
```

Se abrirá como un programa normal (ventana propia, sin navegador).

### Para crear el instalador .exe
```bash
npm run build
```
El instalador saldrá en la carpeta `dist/`.

## Notas
- Todos los datos se guardan localmente (igual que antes).
- No necesita internet para funcionar.
- El archivo `index.html` es el mismo sistema que ya usabas.

---

Desarrollado para el Night Club Champagne.