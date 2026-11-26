# R+A Inmobiliaria — Sitio web

Sitio corporativo y de proyectos de **R+A Inmobiliaria** (Trujillo, Perú).
Es un sitio **estático** (HTML5 + CSS3 + JavaScript vanilla) sin build, sin
dependencias y sin backend: se sirve tal cual desde cualquier hosting de
archivos.

> Nació como réplica del sitio de R&R Inmobiliaria y hoy está rebrandeado a
> R+A. La estructura, las clases y los scripts no dependen de la marca, así que
> sirve también como plantilla para otra inmobiliaria (ver `REBRANDING.md`).

**Sitio publicado (GitHub Pages):** https://luisandres22.github.io/

---

## Inicio rápido

```powershell
.\serve.ps1        # PowerShell
serve.cmd          # CMD
```

Luego abre **http://127.0.0.1:8765/**

- Requiere **Python** (preferido) o **Node.js** en el `PATH`.
- No hay `npm install`, ni build, ni tests: los archivos son el entregable.

## Stack

| Área | Tecnología |
| --- | --- |
| Marcado | HTML5 semántico, `lang="es"`, UTF-8 |
| Estilos | CSS3 con variables nativas y media queries (`css/site.css`) |
| Comportamiento | JS vanilla **ES2017 estricto** (`js/site.js`, `js/motion.js`) — sin `?.` ni `??` |
| Fuentes | `@font-face` locales en `fonts/` (Poppins, Montserrat, Lato, Alga) |
| Servidor local | `serve.ps1` / `serve.cmd` (Python `http.server` con fallback a Node) |
| Despliegue | GitHub Pages (`main` → rama publicada) |

## Estructura

```
.
├── index.html                        # Inicio: carrusel de lanzamientos + fichas
├── proyectos/
│   ├── index.html                    # Catálogo con filtros y línea de entregados
│   ├── urbanizacion-safiro/index.html
│   ├── sienna/index.html
│   ├── lumina/index.html
│   └── origen/index.html
├── quienes-somos/index.html          # Presentación, trayectoria, pilares, grupo
├── contacto/index.html               # Datos de contacto + formulario
├── libro-de-reclamaciones/index.html # Libro de reclamaciones virtual
├── css/site.css                      # Design system y componentes
├── js/site.js                        # Slider, filtros, carruseles, menú, visor
├── js/motion.js                      # Reveals, contadores, lightbox, entrada
├── fonts/                            # Fuentes locales (woff2 + ttf)
├── img/                              # Lockups, favicon, logos, avales, entregados
├── uploads/                          # Renders por proyecto (s/, m/, l/, originales)
├── serve.ps1 / serve.cmd             # Servidor local
├── _capture/                         # Evidencia de la captura original (no se publica)
└── *.md                              # Documentación (ignorada por git, ver abajo)
```

## Páginas

| Ruta | Contenido |
| --- | --- |
| `/` | Carrusel de lanzamientos, tarjetas de proyectos, bloque de marca |
| `/proyectos/` | Filtros por estado (Todos · 04, En preventa · 02, En construcción · 02, Entregado · 16) |
| `/proyectos/urbanizacion-safiro/` | Ficha: áreas comunes, galería, planos, ubicación, contacto |
| `/proyectos/sienna/`, `/proyectos/lumina/`, `/proyectos/origen/` | Mismas secciones con su propio logo y contenido |
| `/quienes-somos/` | Trayectoria, pilares, valores, grupo, visión |
| `/contacto/` | Horarios, teléfonos, sedes y formulario |
| `/libro-de-reclamaciones/` | Ficha y formulario (Ley 29571) |

## Convenciones del proyecto

- **Rutas absolutas desde la raíz** (`/css/site.css`, `/proyectos/sienna`,
  `/contacto#form`). Las rutas relativas rompen las fichas anidadas.
- **Cache-busting**: todo CSS/JS/imagen de `img/` lleva `?v=<timestamp>`
  (hoy `?v=1795301495356`). Al desplegar cambios de estilo o script, actualiza
  el token en las 9 páginas.
- **`?a=6` en `/uploads/`**: sufijo heredado del CMS original; no se toca.
- **Tema claro fijo**: un script inline en el `<head>` lo fuerza. El bloque
  `data-theme="oscuro"` de `site.css` está muerto; ignóralo.
- **Idioma**: todo el contenido y los comentarios en español.
- **JS ES2017**: nada de optional chaining, nullish coalescing ni módulos.

## Identidad visual

- Tinta `#141413`, blanco `#FFFFFF`, dorado de marca `#C59B43`
  (`--ryr-verde` / `--ryr-verde-claro` en `css/site.css`).
- Tipografías: **Montserrat 800** (títulos), **Poppins** 300/400 (texto),
  **Lato** (cifras), **Alga** (citas).
- Grilla: `--grid-max: 1320px`, `--pad-x: 56px`, tokens de espaciado `--s-*`.

## Formularios

Los tres formularios (contacto, ficha de proyecto y libro de reclamaciones)
hacen `POST` a rutas del propio sitio, por lo que en un servidor estático
devuelven **501**. Para que funcionen hay que conectarlos a un servicio
(Formspree, Netlify Forms, un endpoint propio, etc.). Ver
`PENDIENTES_ASSETS.md` §4.

## Documentación

| Archivo | Para qué |
| --- | --- |
| `AGENTS.md` | Guía operativa para agentes/colaboradores: comandos, convenciones, errores comunes |
| `ESPECIFICACIONES.md` | Inventario detallado de páginas, componentes, tokens y estado del entregable |
| `REBRANDING.md` | Paso a paso para cambiar la identidad a otra marca |
| `especificaciones_de_marca_y_rebranding_web.md` | Manual de marca y decisiones del rebranding R+A |
| `PENDIENTES_ASSETS.md` | Assets, datos y decisiones que faltan para cerrar el rebranding |

> Los `*.md` están excluidos en `.gitignore` (no se publican en Pages). Si
> necesitas versionar uno, usa `git add -f <archivo>`.

## Pendientes conocidos

- Conectar los formularios a un backend real.
- Reemplazar los lockups heredados `img/ryr-lockup*.png` por los definitivos
  R+A cuando existan los assets finales.
- Datos de contacto y legales definitivos (dominio, RUC, teléfono, redes,
  políticas de privacidad y términos).
- SEO pendiente: `canonical`, `robots.txt`, `sitemap.xml` y datos estructurados.
- `og:image` sigue apuntando a `www.ryrinmobiliaria.com` en algunas fichas.
- Decidir si se elimina `_capture/` (~33 MB de evidencia de la captura).

## Despliegue

El remoto es `https://github.com/LuisAndres22/LuisAndres22.github.io.git`
(sitio de usuario de GitHub Pages): lo que esté en `main` se publica en
`https://luisandres22.github.io/`. No hay workflow de CI; basta con hacer
commit y push. El archivo `.nojekyll` evita el procesamiento de Jekyll.
