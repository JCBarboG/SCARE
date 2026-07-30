# SCARE - Sistema de Búsqueda de Autores y Revisores Expertos
## Prompt Completo del Proyecto
---
## 1. INFORMACIÓN GENERAL DEL PROYECTO
**Nombre:** SCARE  
**Significado:** Sistema de búsqueda de Autores y Revisores Expertos  
**Tipo:** PWA (Progressive Web App) React  
**Plataforma Complementaria:** EBO (Extracción Bibliográfica y Organizacional)  
**Carpeta GitHub:** `/scare`  
**Modelo:** Completamente gratuito, sin servidor, sin base de datos (Fase 1)  
**Propósito:** Automatizar la búsqueda de revisores expertos para artículos académicos, eliminando el proceso manual de buscar en Google Académico y contactar autores.
---
## 2. FLUJO PRINCIPAL DE USO
### 2.1 Entrada de Datos
El usuario llega a la plataforma SCARE y completa **3 campos principales:**
1. **Título del artículo** (textarea)
   - El usuario pega el título completo del artículo a revisar
   - Ejemplo: "La lista negra"
2. **Autores del artículo** (textarea)
   - El usuario pega los autores originales, separados por comas
   - Ejemplo: "Giancarlo Barbosa González"
   - **Propósito:** Excluir automáticamente estos autores de los resultados
   - **Razón:** Un autor no puede revisar su propio trabajo
3. **Rango de años** (dos campos numéricos)
   - "Desde:" (ej. 2020)
   - "Hasta:" (ej. 2026)
   - **Propósito:** Filtrar por año de publicación
   - **Razón:** Asegurar que los revisores potenciales están activos recientemente
**Botón:** "🔍 Buscar revisores" (submit)
### 2.2 Procesamiento Backend
Cuando el usuario presiona buscar, el backend ejecuta la siguiente lógica:
1. **Búsqueda en APIs simultáneas**
   - Envía petición a **CrossRef** con el título
   - Envía petición a **Semantic Scholar** con el título
   - Ambas búsquedas ocurren en paralelo
2. **Filtrado por año**
   - Descarta automáticamente cualquier artículo fuera del rango de años especificado
3. **Exclusión de autores originales**
   - Para cada artículo encontrado, verifica si alguno de los autores originales aparece como autor (principal o secundario)
   - Si coincide, descarta completamente ese artículo
   - Continúa buscando otros
4. **Extracción de correos**
   - Para cada artículo que pasó los filtros, usa **Scholarly** para raspar Google Académico
   - Scholarly busca cada autor del artículo y extrae:
     - Nombre completo
     - Afiliación institucional
     - Correo electrónico
   
5. **Validación de correos**
   - **Si el artículo NO tiene autores con correo disponible:** Se descarta completamente
   - **Si el artículo SÍ tiene autores con correo:** Se incluye en resultados
   - **Nota:** Afiliación es opcional (puede decir "No se encontró")
6. **Devolución de resultados**
   - Devuelve un JSON al frontend con los revisores encontrados
   - Información por revisor: nombre, afiliación, correo, título del artículo similar, % similitud
### 2.3 Presentación de Resultados
El frontend renderiza una **tabla interactiva** con las siguientes columnas:
| Columna | Contenido | Notas |
|---------|-----------|-------|
| ☐ | Checkbox | Para seleccionar revisores |
| Autor | Nombre completo | Ej: "Dr. Steven Rodriguez" |
| Afiliación | Institución | O "No se encontró" si no disponible |
| Correo | Email | En formato monoespaciado destacado |
| Artículo similar | Título del artículo | Por qué es revisor potencial |
| % Similitud | Número | Ej: 94% de relevancia |
**Características de la tabla:**
- Filas alternadas (colores claros/oscuros para legibilidad)
- Responsive: se convierte en cards en móvil
- Hover effect: opacidad suave
- Editable: usuario puede eliminar filas si lo desea
- Copiable: usuario puede copiar datos individuales de cada celda
### 2.4 Opciones de Exportación
**Opción 1: Descargar Excel**
- Botón "Descargar Excel" en header de la tabla
- Genera archivo .xlsx con todas las filas (excepto eliminadas)
- Mantiene el formato original de la tabla
**Opción 2: Copiar datos**
- Usuario selecciona fila con checkbox
- Puede copiar nombre, correo, afiliación, etc. individualmente
- Usa copy-to-clipboard del navegador
**Opción 3: Generar correo**
- Usuario selecciona fila con checkbox
- Presiona botón "Generar correo"
- Se abre modal con template de correo pre-llenado
### 2.5 Generador de Correos (Modal)
**Flujo:**
1. Usuario selecciona una fila y presiona "Generar correo"
2. Se abre un modal con:
   - Título: "Generar correo para revisor"
   - Textarea grande con template de correo pre-llenado
   - Botones: "Copiar correo" y "Cerrar"
**Template del correo:**
```
Buenas tardes, Doctor [NOMBRE_REVISOR],
Espero que se encuentre bien. Le escribo para invitarle cordialmente a ser revisor de nuestro artículo titulado:
"[TÍTULO_ARTÍCULO]"
Su experiencia en temas relacionados a [TEMA_AUTOMÁTICO] lo hace un candidato ideal para realizar una revisión exhaustiva de nuestro trabajo.
Si acepta esta invitación, le solicitaríamos que complete un formulario de evaluación con sus recomendaciones y comentarios constructivos.
Agradecemos de antemano su tiempo y dedicación.
Saludos cordiales,
[Su nombre]
[Su institución]
```
**Campos auto-completados:**
- `[NOMBRE_REVISOR]` → Se sustituye automáticamente con el nombre de la fila seleccionada
- `[TÍTULO_ARTÍCULO]` → Se sustituye automáticamente con el título del artículo original
- `[TEMA_AUTOMÁTICO]` → Se intenta extraer del título si es posible
**Características del template:**
- Totalmente editable: usuario puede cambiar, eliminar o agregar texto
- Botón "Copiar correo" copia todo al portapapeles
- Usuario pega en su cliente de correo (Gmail, Outlook, etc.)
- Usuario envía manualmente desde su cuenta
- Sin historial: si cierra y reabre, vuelve al template original
---
## 3. PROBLEMAS TÉCNICOS Y SOLUCIONES
### 3.1 Google Académico bloquea rasping masivo
**Problema:** Google detecta y bloquea automatización masiva de Scholarly
**Soluciones implementadas:**
- **Delay entre búsquedas:** 3-5 segundos entre cada petición a Scholarly
- **Límite de búsquedas:** Máximo 5 búsquedas por sesión
- **Mensaje de progreso:** Barra de progreso muestra que la plataforma está trabajando, no colgada
**Resultado:** Con delays altos + límite bajo, Google raramente bloquea
### 3.2 APIs no siempre devuelven correos
**Problema:** CrossRef y Semantic Scholar no incluyen siempre correos de autores
**Solución:** 
- Scholarly raspa Google Académico como fallback
- Si Scholarly tampoco encuentra correo, ese artículo se descarta completamente
- Garantiza que TODO revisor mostrado tiene correo contactable
### 3.3 Correos desactualizados
**Problema:** Un autor cambió de institución hace años, su correo viejo aparece en Google Académico
**Solución:**
- Usuario verifica antes de contactar
- Correos desactualizados rara vez están 100% inválidos (redireccionamientos activos)
- Si un correo falla, usuario intenta siguiente
### 3.4 Precisión de búsqueda
**Problema:** Títulos genéricos traen resultados poco relevantes
**Solución:**
- Usuario mejora el título antes de buscar
- Rango de años filtro automáticamente
- % similitud en tabla ayuda a identificar relevancia
### 3.5 Tiempos de respuesta
**Problema:** Con delays 3-5s + múltiples APIs, búsqueda puede tardar 15-30 segundos
**Solución:**
- Barra de progreso visible (user feedback)
- Usuario espera conociendo que se está haciendo trabajo
- Para usuario es más rápido que buscar manualmente (~20 min)
---
## 4. TECNOLOGÍA Y STACK
### 4.1 Frontend
- **Framework:** React 18+
- **Estilos:** Tailwind CSS
- **Iconos:** Lucide React
- **Fuentes:** Lora (serif), Inter (sans), IBM Plex Mono (mono)
- **Estado:** React Hooks (useState, useEffect)
- **PWA:** Manifest + Service Worker
### 4.2 Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (o similiar)
- **Hosting:** Vercel o Railway (ambos gratis)
- **Librería HTTP:** Axios o Fetch
### 4.3 APIs Externas
- **CrossRef** (gratis)
  - Búsqueda de artículos por título
  - Retorna metadatos: autores, año, DOI
  - Endpoint: `https://api.crossref.org/works`
  
- **Semantic Scholar** (gratis)
  - Búsqueda de artículos académicos
  - Retorna relevancia, citas, resumen
  - Endpoint: `https://api.semanticscholar.org/graph/v1/paper/search`
- **Scholarly** (gratis, con limitaciones)
  - Biblioteca Python que raspa Google Académico
  - Extrae: nombre autor, afiliación, correo, artículos
  - Implementación: Wrapper en Node.js o Python backend
### 4.4 Base de Datos
- **Fase 1:** NONE (completamente sin servidor)
- **Histórico:** NO se guarda nada
- **Persistencia:** Solo en memoria de sesión
- **Cuando cierra pestaña:** Todo desaparece
### 4.5 Despliegue
- **Frontend:** Vercel, Netlify o GitHub Pages
- **Backend:** Vercel Functions, Railway, Render (todos gratis)
- **Dominio:** Custom domain ($1-3 USD/mes, opcional)
---
## 5. DISEÑO Y UX
### 5.1 Paleta de Colores (EBO-compatible)
```
Navy:        #14395f (primario, backgrounds)
Navy-deep:   #0d2842 (footer, énfasis)
Brass:       #a9812f (acentos, borders)
Papel:       #f2ede1 (fondo general, texto claro)
Slate-100:   #f8fafc (backgrounds alternos)
Slate-200:   #e2e8f0 (borders)
Slate-400:   #94a3b8 (texto secundario)
Slate-600:   #475569 (texto body)
Slate-900:   #0f172a (texto primario)
```
### 5.2 Tipografía
- **Títulos (H1, H2):** Lora 400/600 italic, letter-spacing amplio
- **UI (botones, inputs):** Inter 400/500/600/700
- **Datos (tablas, código):** IBM Plex Mono 400/600
### 5.3 Componentes Principales
**Header**
- Background: Navy (#14395f)
- Border-bottom: 3px Brass
- Logo: "SCARE" en serif itálico con icono cuadrado
- Navegación: Inicio | Guía | Contacto
- Mobile: Hamburger menu colapsable
**Main Content**
- Hero section: "Busca revisores expertos"
- Input section con 3 campos + botón buscar
- Progress bar durante búsqueda
- Tabla de resultados con scrollable horizontal en móvil
- Cards en móvil en lugar de tabla
**Modal de correo**
- Header: Navy con border brass
- Textarea para editar template
- Botones: Copiar | Cerrar
- Backdrop: Semitransparente negro
**Footer**
- Background: Navy-deep (#0d2842)
- Border-top: 3px Brass
- Copyright centrado
### 5.4 Responsive Design
- **Mobile-first:** Diseño comienza en 320px width
- **Breakpoints:**
  - `sm`: 640px (tablets pequeñas)
  - `md`: 768px (tablets)
  - `lg`: 1024px (desktop)
  - `xl`: 1280px (desktop grande)
  
- **Tabla desktop:** Grid 6 columnas
- **Tabla móvil:** Cards verticales, 1 por fila
### 5.5 PWA Features
- Instalable en home screen (iOS y Android)
- Funciona offline con caché
- Notificaciones push (opcional)
- Shorcuts personalizados
- Share target (opcional)
---
## 6. ARQUITECTURA DETALLADA
### 6.1 Flujo de datos Frontend → Backend
```
Frontend (React)
  ↓ (fetch POST)
  Envía: { title, authors, yearFrom, yearTo }
  ↓
Backend (Node.js)
  ↓ Paso 1: Buscar en CrossRef
  ↓ Paso 2: Buscar en Semantic Scholar
  ↓ (paralelo)
  ↓ Paso 3: Filtrar por año
  ↓ Paso 4: Excluir autores originales
  ↓ Paso 5: Raspar con Scholarly para correos
  ↓ Paso 6: Validar correos (descartar sin correo)
  ↓ (respuesta con delays)
  Devuelve: [ { author, affiliation, email, articleTitle, similarity }, ... ]
  ↓ (JSON)
Frontend (React)
  ↓
Renderiza tabla interactiva
```
### 6.2 Endpoint del Backend
**POST /api/search-reviewers**
Request:
```json
{
  "title": "La lista negra",
  "authors": ["Giancarlo Barbosa González"],
  "yearFrom": 2020,
  "yearTo": 2026
}
```
Response (200 OK):
```json
{
  "success": true,
  "reviewers": [
    {
      "id": 1,
      "author": "Dr. Steven Rodriguez",
      "affiliation": "Universidad Nacional de Colombia",
      "email": "s.rodriguez@unal.edu.co",
      "articleTitle": "Seguridad y listas negras en sistemas distribuidos",
      "similarity": 94
    },
    {
      "id": 2,
      "author": "Dra. María López García",
      "affiliation": "No se encontró",
      "email": "maria.lopez@research.edu",
      "articleTitle": "Protección de datos en redes académicas",
      "similarity": 87
    }
  ],
  "totalFound": 3,
  "processingTime": "28s"
}
```
### 6.3 Service Worker (Offline)
- Cache strategy: Network-first para APIs, cache-first para assets
- Sincronización automática cuando vuelve conexión
- Notificaciones push cuando hay actualización disponible
---
## 7. FASES DE DESARROLLO
### Fase 1 (MVP - Actual)
- Frontend React completo
- Backend mínimo con delays
- APIs: CrossRef + Semantic Scholar + Scholarly
- PWA manifest + service worker
- Sin autenticación, sin base de datos
- Despliegue en Vercel + Railway
- **Tiempo estimado:** 2-3 semanas
### Fase 2 (1-2 meses después)
- Agregar Vercel backend persistente
- PostgreSQL para historial sincronizado
- Login/Registro con JWT
- Búsquedas guardadas por usuario
- **Costo:** ~$25-50/mes
### Fase 3 (2-3 meses después)
- Integración directa de correos (OAuth Gmail)
- Envío automático de correos sin copy-paste
- Tracking de respuestas de revisores
- **Costo:** ~$50-100/mes
### Fase 4 (3-4 meses después)
- Dashboard con estadísticas
- Reporte de tasa de respuesta
- Integración con Stripe para pagos
- Plan Premium con features avanzados
- **Costo:** ~$100-200/mes
---
## 8. CONSIDERACIONES FINALES
### 8.1 Limitaciones Conocidas
- Google puede bloquear Scholarly temporalmente
- Scholarly es lenta (2-5s por búsqueda)
- Correos pueden estar desactualizados
- APIs tienen límites de rate (pero generosos para uso no comercial)
### 8.2 Ventajas Competitivas
- Completamente GRATIS en Fase 1
- Sin servidor = sin costo infrastructura
- Búsqueda de revisores en segundos vs horas manuales
- Tabla editable y exportable
- Generador de correos integrado
- Funciona offline (PWA)
### 8.3 Seguridad
- Sin almacenamiento de datos sensibles
- Sin contraseñas (Fase 1)
- HTTPS obligatorio
- CSP headers configurado
- Rate limiting en backend
### 8.4 Mantenimiento
- Monitoreo de APIs (CrossRef, Semantic Scholar)
- Monitoreo de Scholarly (Google bloqueos)
- Updates de dependencias npm
- Backups automáticos (Vercel)
---
## 9. ARCHIVOS A GENERAR
```
/scare/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── favicon.svg            # Logo SCARE
│   └── icons/
│       ├── icon-192.svg
│       ├── icon-512.svg
│       └── icon-maskable.svg
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── SearchForm.jsx
│   │   ├── ResultsTable.jsx
│   │   ├── EmailModal.jsx
│   │   ├── ProgressBar.jsx
│   │   └── Footer.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Guide.jsx
│   │   └── Contact.jsx
│   │
│   ├── services/
│   │   ├── api.js             # Calls backend
│   │   ├── crossref.js        # CrossRef integration
│   │   ├── semanticScholar.js # Semantic Scholar integration
│   │   └── storage.js         # localStorage helpers
│   │
│   ├── styles/
│   │   └── globals.css        # Tailwind + custom
│   │
│   ├── utils/
│   │   ├── colors.js          # Color constants
│   │   ├── excel-export.js    # SheetJS export
│   │   └── email-template.js  # Email template
│   │
│   ├── App.jsx                # Main app component
│   └── index.jsx              # React entry point
│
├── api/                       # Vercel serverless
│   ├── search-reviewers.js    # Main endpoint
│   ├── middleware/
│   │   ├── cors.js
│   │   └── rate-limit.js
│   └── lib/
│       ├── scholarly.js       # Scholarly wrapper
│       └── apis.js            # CrossRef, Semantic Scholar
│
├── package.json
├── vite.config.js            # Si usa Vite
├── tailwind.config.js
├── .env.example
├── README.md
└── ARCHITECTURE.md           # Documentación técnica
```
---
## 10. NOMBRES Y CONVENCIONES
- **Proyecto:** SCARE
- **Carpeta GitHub:** `/scare`
- **Nombre en código:** `scare` (minúsculas)
- **Logo:** Icono cuadrado con letra "S" o símbolo de búsqueda
- **Tagline:** "Sistema de búsqueda de Autores y Revisores Expertos"
- **Commits:** `[SCARE] descripción cambio`
- **Issues:** `[SCARE] Titulo del issue`
---
## 11. PRÓXIMOS PASOS
1. ✅ Definir arquitectura (COMPLETADO)
2. ⬜ Crear repositorio GitHub `/scare`
3. ⬜ Implementar frontend React con componentes
4. ⬜ Implementar backend Node.js con endpoints
5. ⬜ Integrar CrossRef + Semantic Scholar
6. ⬜ Integrar Scholarly con delays
7. ⬜ Crear PWA manifest + service worker
8. ⬜ Testing en desarrollo local
9. ⬜ Deploy a Vercel + Railway
10. ⬜ Testing en producción
11. ⬜ Documentación oficial
12. ⬜ Lanzamiento beta
---
**Última actualización:** 30 de julio de 2026  
**Estado:** Listo para desarrollo  
**Responsable:** Barboza (bibliotecólogo)
