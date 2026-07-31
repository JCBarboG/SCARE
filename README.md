# SCARE — Sistema de búsqueda de Autores y Revisores Expertos

PWA en React que automatiza la búsqueda de revisores expertos para artículos
académicos, combinando CrossRef, Semantic Scholar y Google Académico
(vía `scholarly`) para encontrar candidatos con correo de contacto verificable.

Plataforma complementaria de **EBO** (Extracción Bibliográfica y Organizacional).

## Requisitos

- Node.js 18+
- Python 3.9+ con la librería `scholarly` instalada (`pip install scholarly`)

## Instalación

```bash
npm install
cp .env.example .env
```

## Desarrollo local

Se necesitan dos procesos: el frontend (Vite) y el backend (Express).

```bash
# Terminal 1 — backend
npm run server

# Terminal 2 — frontend
npm run dev
```

El frontend corre en `http://localhost:5173` y proxea `/api` hacia
`http://localhost:3001` (ver `vite.config.js`).

## Flujo de búsqueda

1. El usuario ingresa título, autores originales (a excluir) y rango de años.
2. El backend consulta CrossRef y Semantic Scholar en paralelo.
3. Filtra por año y descarta artículos donde aparezcan los autores originales.
4. Usa `scholarly` para enriquecer autores candidatos con afiliación/correo,
   con un delay configurable entre búsquedas (evita bloqueos de Google).
5. Descarta cualquier candidato sin correo encontrado.
6. Devuelve la lista final al frontend, que la muestra en una tabla exportable
   a Excel y con generador de correos de invitación.

Ver `ARCHITECTURE.md` para el detalle técnico y `SCARE_PROMPT.md` para el
documento de producto original.

## Despliegue

**Importante:** el backend depende de `scholarly` (Python) invocado como
subproceso desde Node (`api/lib/scholarly.js`). Ninguna plataforma de
funciones serverless (Vercel, Netlify Functions, GitHub Pages, etc.) soporta
eso: no tienen Python disponible ni permiten spawnear procesos arbitrarios.
Por eso el frontend (estático, en GitHub Pages) y el backend (proceso Docker
persistente, en Railway/Render/Fly) se despliegan por separado.

### Frontend → GitHub Pages
Repositorio: https://github.com/JCBarboG/SCARE

1. En GitHub: **Settings → Pages → Source: "GitHub Actions"**.
2. En **Settings → Secrets and variables → Actions → Variables**, crea la
   variable `VITE_API_URL` con la URL pública del backend (ver siguiente
   sección), por ejemplo: `https://scare-api.up.railway.app/api`.
3. El workflow `.github/workflows/deploy-pages.yml` compila con Vite y
   publica `dist/` en GitHub Pages automáticamente en cada push a `main`
   (o manualmente desde la pestaña Actions → "Deploy frontend to GitHub
   Pages" → Run workflow).
4. El sitio queda publicado en `https://JCBarboG.github.io/SCARE/`.
5. `vite.config.js` ya tiene `base: '/SCARE/'` configurado para que las
   rutas de assets funcionen bajo ese subpath (necesario porque GitHub
   Pages no sirve el proyecto desde la raíz del dominio).

### Backend (Express + scholarly) → Railway, Render o Fly.io con Docker
El repo incluye un `Dockerfile` que instala Node 18 + Python3 + `scholarly`
en la misma imagen, así que cualquier host que soporte "Deploy from
Dockerfile" funciona sin configuración extra:

1. Conecta el repo de GitHub en Railway/Render/Fly y selecciona "Docker" como
   método de build (detectan el `Dockerfile` automáticamente).
2. Variables de entorno a configurar en el host (ver `.env.example`):
   - `FRONTEND_URL` → `https://JCBarboG.github.io` (para CORS; sin el
     `/SCARE/` final)
   - `SCHOLARLY_MAX_SEARCHES`, `SCHOLARLY_DELAY_MS`
   - `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`
3. El contenedor expone el puerto `3001` (`PORT` es configurable).
4. Usa un plan con timeout de request largo (mín. 30-60s): la búsqueda con
   varios autores + delays de `scholarly` puede tardar ese tiempo.
5. Una vez desplegado, copia la URL pública del backend y pégala como
   variable `VITE_API_URL` en GitHub (paso 2 de la sección anterior), luego
   vuelve a correr el workflow de Pages para que el frontend la tome.

### CI
- `.github/workflows/ci.yml` corre `npm install && npm run build` en cada
  push/PR a `main` para detectar errores de build antes de mergear.
- `.github/workflows/deploy-pages.yml` construye y publica el frontend en
  GitHub Pages en cada push a `main`.

### Subir cambios a GitHub
```bash
git add .
git commit -m "[SCARE] descripción del cambio"
git push
```

## Limitaciones conocidas

- Google Académico puede bloquear temporalmente el scraping de `scholarly`.
- Los correos encontrados pueden estar desactualizados.
- Fase 1 no tiene base de datos: nada se persiste entre sesiones.
