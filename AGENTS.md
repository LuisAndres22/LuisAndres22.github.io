# AGENTS.md

Sitio web estático (HTML/CSS/JS) de R&R Inmobiliaria. No hay package.json, build, tests, lint, typecheck ni CI.

## Ejecutar localmente

- Windows PowerShell: `.\serve.ps1`
- Windows CMD: `serve.cmd`
- Sirve en `http://127.0.0.1:8765/` (usa Python `http.server` o Node.js si Python no está)

## Estructura clave

- `index.html` — portada
- `contacto/index.html`, `quienes-somos/index.html`, `libro-de-reclamaciones/index.html` — páginas internas
- `proyectos/` — páginas de proyecto individuales
- `css/site.css`, `js/site.js`, `js/motion.js` — estilos y scripts
- `img/`, `uploads/` — assets (imágenes, logos, planos)
- `serve.ps1` / `serve.cmd` — servidor local de desarrollo

## `_capture/`

Contiene artefactos de captura de navegador (logs de Chrome/CDP, capturas de pantalla, perfiles). No son parte del sitio publicado; no editar como si fueran código de la aplicación.

## Estado del repo

Solo los 13 archivos de `_capture/` están actualmente rastreados en git. El resto del sitio (`index.html`, `css/`, `js/`, `img/`, `serve.*`, etc.) está sin rastrear. Si el agente va a hacer cambios al sitio, considere agregar esos archivos al seguimiento y revisar si `_capture/` debería ir en `.gitignore`.

## Convenciones

- Idioma del sitio: español (`lang="es"`).
- Enlaces internos usan rutas absolutas desde la raíz (`/proyectos/sienna`, `/contacto#form`).
- CSS y JS se referencian con query param de cache-busting (`?v=1790382749901`).
