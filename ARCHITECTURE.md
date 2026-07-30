# Arquitectura técnica — SCARE (Fase 1)

## Visión general

```
Frontend (React + Vite, PWA)
  │  POST /api/search-reviewers { title, authors, yearFrom, yearTo }
  ▼
Backend (Express local / función serverless en Vercel)
  │
  ├─ api/lib/apis.js         → CrossRef + Semantic Scholar (paralelo)
  ├─ api/lib/searchCore.js   → filtrado por año, exclusión de autores, orquestación
  ├─ api/lib/scholarly.js    → wrapper Node → Python (scholarly_search.py)
  └─ api/lib/scholarly_search.py → scraping de Google Académico (correo/afiliación)
  │
  ▼
JSON de revisores → Frontend renderiza tabla, exporta Excel, genera correos
```

## Decisiones clave

- **Sin base de datos (Fase 1):** todo vive en memoria del proceso backend y del
  estado de React en el frontend. Cerrar la pestaña borra los resultados.
- **`scholarly` vía subproceso Python:** Node no tiene un equivalente directo;
  se invoca `scholarly_search.py` con `child_process.spawn`, con un límite de
  `SCHOLARLY_MAX_SEARCHES` autores por búsqueda y un delay
  (`SCHOLARLY_DELAY_MS`) entre cada uno para reducir bloqueos de Google.
- **Similitud de título:** `titleSimilarity` en `api/lib/apis.js` usa una
  heurística simple de solapamiento de palabras (0-100%). Es un placeholder
  razonable para Fase 1; una versión futura podría usar embeddings.
- **Regla de descarte:** un artículo/autor candidato se descarta si no se
  encuentra un correo de contacto, sin importar si CrossRef/Semantic Scholar
  sí devolvieron metadatos. La afiliación es opcional.

## Estructura de carpetas

Ver sección 9 del documento de producto (`SCARE_PROMPT.md`) para el árbol
completo. Resumen:

- `src/components/` — piezas de UI reutilizables (Header, SearchForm,
  ResultsTable, EmailModal, ProgressBar, Footer).
- `src/pages/` — Home, Guide, Contact.
- `src/services/` — llamadas a la API propia y wrappers cliente de
  CrossRef/Semantic Scholar (para pruebas locales).
- `src/utils/` — export a Excel, template de correo, paleta de colores.
- `api/` — backend: endpoint, middleware (CORS, rate limit) y lib de
  integración con fuentes externas.

## Próximas fases

Ver sección 7 del documento de producto: persistencia con PostgreSQL,
autenticación, envío de correos vía OAuth Gmail, dashboard y planes de pago.
