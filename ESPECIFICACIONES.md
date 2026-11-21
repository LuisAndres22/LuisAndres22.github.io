# ESPECIFICACIONES del sitio R&R Inmobiliaria

Réplica estática completa del sitio promocional de R&R Inmobiliaria (Trujillo, Perú),
publicado originalmente en `https://www.ryrinmobiliaria.com/` y capturerada localmente.

> Estado: **Entregable** (v0.1). Servible sin build paso. See §19 para decisiones y limitaciones conocidas.

---

## 1. Origen

- Captura real del sitio (vía REA `inspect_web_page` sobre `http://127.0.0.1:9222`, target `3155B3696EF0485E09C08286464C9D4A`; verificado en `http://127.0.0.1:8765/`).
- 9 páginas en español (`lang="es"`), HTML5, CSS3, JSvanilla ES2017 estricto, sin dependencias ni build, sin comunicación con otro host que no sea `127.0.0.1` (verif. web).
- 715 archivos, 64,8 MB; 652 archivos con perfil de fotos (s/m/l/original), fuentes Poppins/Montserrat/Lato/Alga.
- Adjunto: `REBRANDING.md` (guía de rebranding).

## 2. Stack tecnológico

| Área | Tecnología | Notas |
|---|---|---|
| Lenguaje de marcado | HTML5 semántico (`<header>`, `<main>`, `<article>`, `<footer>`, `<form>`) | `lang="es"` (codificado UTF-8) |
| Estilo | CSS3 con variables CSS nativas + media queries responsive (`@media`) | 3760 líneas en `css/site.css` |
| JS | ES2017 estricto (no usa optional chaining ni nullish) | `js/site.js` (34 KB), `js/motion.js` (17 KB), `defer` en `<body>` al final |
| Fuentes | `@font-face` estáticos a `fonts/` (woff2 + ttf, latín) | Poppins 300/400, Montserrat 800, Lato 400/400-italic, Alga 200-italic |
| Hosting | Servidor estático genérico | `serve.ps1` / `serve.cmd` (Python `http.server`; Node sin-sobre-CMS es backstop) |
| Analítica | Nada | Sin gtag, sin robot verification file |

## 3. Estructura de directorios

```
ProyectoAqr2/
├── index.html                     # Inicio / carrusel de lanzamientos
├── contacto/index.html            # Formulario de contacto
├── libro-de-reclamaciones/index.html  # Libro Virtual (ficha + formulario)
├── quienes-somos/index.html       # Presentación, trayectoria, pilares, grupo
├── proyectos/
│   ├── index.html                 # Listado: filtros, tarjetas, tray de entregados
│   ├── central-345/index.html     # Ficha del proyecto
│   ├── sienna/index.html
│   ├── lumina/index.html
│   └── origen/index.html
├── css/site.css                   # Ent Sheets master (tokens + componentes)
├── js/site.js, js/motion.js       # Comportamiento
├── fonts/                         # 12 archivos (woff2 + ttf)
├── img/                           # 4 archivos: lockup, lockup-blanco, favicon + avales + impulsa + entregados + logos
├── uploads/                       # 652 archivos: renders por proyecto y entregados
├── serve.ps1, serve.cmd           # Servidor local
└── _capture/                      # metadatos/provenance (ver §19)
```

## 4. Inventario de páginas

| Ruta | Archivo | Secciones clave | Uso |
|---|---|---|---|
| `/` | `index.html` | `.mh-slider` (carrusel de 4), `.mh-launch`, grid de fichas, footer | Inicio con lanzamientos + entry por proyecto |
| `/proyectos/` | `proyectos/index.html` | filtros (`data-filter`), cuadrícula de tarjetas, `.mp-tray` de 16 entregados | Catálogo activo (4) + histórico (16) |
| `/proyectos/central-345/` | `proyectos/central-345/index.html` | hero (`#areas-comunes`, `#galeria`, `#planos`, `#contacto`, `#historia`) | Ficha del proyecto |
| `/proyectos/sienna/`, `/proyectos/lumina/`, `/proyectos/origen/` | `proyectos/sienna/index.html` etc. | mismo patrón (hero con logo propio, paleta sugerida del área, contacto) | Fichas |
| `/quienes-somos/` | `quienes-somos/index.html` | trayectoria, pilares (01–04), valores, grupo, concepto, telef ONE , summary | Presentación corporativa |
| `/contacto/` | `contacto/index.html` | `.mk-hero` (horario, tel, direcciones), `#form` con formulario | Cotizar / reservar |
| `/libro-de-reclamaciones/` | `libro-de-reclamaciones/index.html` | ficha del libro, formulario de reclamo/queja | Protección del consumidor (Ley 29571) |

## 5. Componentes HTML estáticos y su semántica

### 5.1 Header (`mo-nav`) — 9 páginas
- Branded lockup (nav + footer)
- Nav principal: Inicio, Proyectos, Quiénes somos, Contacto (`mo-nav-links`)
- Botón CTA solido (`mo-btn--solid`) a `/contacto#form`
- Burger móvil (`#mo-burger`) abrindo el mismo menú (js `initMenuMovil`)

### 5.2 Footer (`mo-footer`)
- Lockup + tagline
- Columna "Nuestros proyectos" (4 tarjetas)
- Columna "La empresa": Sobre R&R, Historia y trayectoria
- Columna "Contacto": reserva de cita, teléfono, correo
- Columna "Síguenos": Instagram, Facebook, LinkedIn
- Whatline de avales (CAPECO · CôDIP) y botón Volver arriba (a `#main`)
- Legal: aviso de renders, libro de reclamaciones, copyright
- Botón WhatsApp flotante (`mo-wpp`) en 9 páginas

### 5.3 Sistema de slides (carrusel) — Home
- `[data-slider]`, 4 slides activas (`.mh-slide`), intervalo `data-intervalo="6500"` (js de birgen para `data-intervalo` < 2000)
- Pausa automática al hover y botón de pausa (`data-slider-pausa`)
- Pelo (dots) y botones prev/next (`data-slider-prev/next`)
- Para slides futuros, JS luces `data-src`/`data-srcset` cuando les toca (js `cargarSlide`)
- Landscape.box: cada slide tiene imagen de fachada del proyecto + copy

### 5.4 Grid de tarjetas (Proyectos)
- `data-status`: `en-construccion` (2), `preventa` (2), `disponible` (0), `entregado` (16)
- `data-filter`: Todos (4), En preventa (2), En construcción (2), Entrega inmediata (0), Entregado (16)
- Cuadrícula responsive `mp-grid` → 3 columnas desktop, 2 tablet, 1 móvil (comprobar `@media`)
- Badge de estado per card, foto/ ESTILO de ficha, ubicación, sonido (para estado airbnb-ish)

### 5.5 Proyecto: Fichas de fichas (`proyectos/*/index.html`)
- sections: `#areas-comunes`, `#informacion` (alertas verticales), `#ubicacion` (mapa), `#galeria` (lightbox), `#planos`
- Formulario dedicado de cada ficha (acciones sobre `/proyectos/<slug>#contacto`)

### 5.6 Historiales (`#entregados`)
- 20 impresiones que representan los productos; carrusel horizontal (`mp-tray`)
- columnas: foto, año, nombre, dirección

### 5.7 Visor de planos y galería (mobile UI)
- `initProjectFilters`, `initChipFilter`, `initRadioChips`, `initCarrusel`, `initVisorPlanos`: chips de habitabilidad, menú carrusel de fotos y planos (Planificación, Desarrollo, etc.), grupo de radios.

### 5.8 Lightbox (`#lightbox`)
- Mostrar imagen grande, navegar entre slides, ` lb-prev/next/close/count`. Close.arrows + `lb-prev/next` + `lb-count`.

### 5.9motivo de texto (motion)
- `initHeroSlider` (home)
- `initLaunch` (popup de lanzamiento Nuevo lanzamiento: Sienna)
- `initProjectFilters`, `initChipFilter`, `initCarrusel`, `initVisorPlanos`, `initRadioChips`, `initMenuMovil`, `initSubMenu`, `initAlturaNav`, `initCarrusel`(planos)
- `animateCounter` (quienes-somos, `data-count="20"` en pilares)
- `setupHexDraw`, `setupScrollUI` (reveal), `setupCounters`, `setupReveal`, `setupEntrada`
- `setupLightbox` (precarga de imgs a favoritos)

### 5.10 CSS

**`css/site.css`**
- Líneas 1–18: docs de marca.
- Líneas 20–81: `@font-face` familias Poppins (300/400), Montserrat (800), Lato (400/400-italic), Alga (200-italic, COMERCIAL).
- Líneas 83–237: tokens de color `:root`.
- Líneas 240–285: semántica y semántica `c-*` (theme claro).
- Líneas 287–320: **tema oscuro muerto** (`data-theme="oscuro"`) — muerto; el script inline fija "claro".
- Secciones restantes: tokens de s ($-, $r-, $shadow-$, $ease, $dur), `--grid-max 1320`, `--pad-x 56`, `--max 1440`, color filler: net color `--c-fg-rgb` neutral `--c-bg-rgb: 255,255,255`.
- Grid (`c-col`, `c-gap-*`), tipografía (`c-*`), componentes (`mo-*`, `mk-*`, `mh-*`, `mp-*`, `md-*`, `pd-*`, `qs-*`, `rc-*`, `lb-*`, `pv-*`).

**Ajustes semánticos:**
- `--r-md: 4px`, `--r-lg: 8px`, radius md/lg acc ATM, `--r-pill: 999px`.
- Sombra elevación especial.
- Nada de themas CSS (theme claro fijado por el script HTML).

## 6. Semántica de rutas, cache-busting y versionado

- **Rutas absolutas desde raíz** (`/css/site.css?v=…`) — corroborar: `AGENTS.md` exige que entrega estilo y JS con query params desde la raíz del site).
- **Cache-busting global**: todas las URLs de `/css/site.css`, `/js/site.js`, `/js/motion.js` y `/img/*` fijan `?v=1790382749901` (150 apariciones en 9 páginas). Actualizar en todas páginas al desplegar.
- **`?a=6` en `/uploads/`** (1.272 apariciones): sistema del CMS original (versión de activos). Si no se reemplaza, mantener; si se reemplaza, actualizar en el mismo touch.

## 7. Sistema de diseño: paleta, tipografía, espaciado, ritmo

### 7.1 Paleta completa (cñ)

| Variable | Valor | Uso |
|---|---|---|
| `--ryr-cream` (bg principal) | `#FFFFFF` | Fondo de página, superficies |
| `--ryr-ink` (texto) | `#1D1E1C` | Color principal de texto, botones, acentos |
| `--ryr-graphite` (fuego) | `#444444` | Texto secundario, subtítulos |
| `--ryr-cream-200` | `#F4F4F4` | Fondo de tarjetas, hover |
| `--ryr-cream-300` | `#E4E4E4` | Bordes sutiles |
| `--ryr-cream-400` | `#BDBDBD` | Texto tenue, áreas vacías |
| `--ryr-graphite-300/500/900` | `#8C8C8A` / `#6A6A68` / `#2A2B29` | Rejilla, títulos, texto hablado |
| `--ryr-sky` | `#7FA6C7` | Acento editorial (c=#5 senes) |
| `--ryr-verde` | `#1c9438` | Accent de marca: barra fina, punto de timeline, líneas franceadas |
| `--ryr-verde-claro` | `#2FB954` | Versión legible sobre fondo oscuro (theme claro a menudo se usa sobre foto) |

Alias semánticos: `--bg`, `--bg-elevated`, `--bg-inverse`, `--fg`, `--fg-muted`, `--fg-subtle`, `--fg-inverse`, `--border`, `--border-strong`, `--rule`, `--c-*` (theme claro).

> Nota de uso de acentos: el verde se aplica como "rayas finas de las tarjetas, guion de los rótulos de sección, hitos de la línea de tiempo y el subrayado del menú" (comentario del CSS). En bloque de "ley" (footer) se usa en tooltips, guiones de la acción, etc.

### 7.2 Tipografía

| Familia (`--font-*`) | Tamaños clave (`--t-*`) | Ponderosidad principal |
|---|---|---|
| `--font-display`: Montserrat 800 | `--t-20`..`--t-96` (botones, rótulos, titulares) | 800 |
| `--font-sans`: Poppins 300/400 | `--t-16`..`--t-40` | 300 (ej: page titles) |
| `--font-serif`: Poppins | parrafos | 400 |
| `--font-serif-ital`: Alga | citas/aspect editorial | 200 ital |
| `--font-num`: Lato | metrí/dormitories/precios/años | 400 |

Cifras usan Lato (`--c-fg-rgb` de la página, líneas 244–280).

### 7.3 Escalas de texto y color

- Word spacing: `--ls-tight` (-0.02em) a `--ls-widest` (0.32em)
- Tracking: OK para ligaduras? no.

### 7.4 Espaciado

- Tokens `--s-*`: 4–160px (4,8,12,16,20,24,32,40,48,64,80,96,128,160).
- `--r-*`: 0, 2px, 4px, 8px, 999px.
- `--grid-max`: 1320px, `--pad-x`: 56px, `--max`: 1440px.
- Border thicknesses: `--border` (1px cream), `--border-strong` (1px ink).

### 7.5 Ritmo / motion

- `--dur-fast` 180ms, `--dur-base` 320ms, `--dur-slow` 560ms
- Easing: `--ease-out` (cubic-bezier(0.16,1,0.3,1)) — funciona bien en slides; `--ease-inout` para interacción.

### 7.6 Touchpoints

- Estilo de rótulos: círculo de techo de texto, barra a lado de texto en tarjetas de estilo pitch o airbnb.

### 7.7 Interactions y comportamiento (js)

Funciones en `js/site.js` (lista completa) y `js/motion.js` (lista completa).

---

## 8. Ajuste de validación (Testing)

-aciónItem 7d5  confFO- paso: verificar títulos en otras páginas: `/proyectos/central-345/`: `Central 345 · R&R Inmobiliaria · Trujillo`. El resto con similar.

- Ficheros sin tocar: `js/site.js`, `js/motion.js`, código en `css/site.css`. 

## 9. Formularios y Datos

| Formulario | Archivo | Campos | Acción | Estado |
|---|---|---|---|---|
| Contacto | `contacto/index.html` | Nombres, Apellidos, DNI, Teléfono, Proyecto (select), Email, mensaje | POST `/contacto` | back end. Alternativo posible (Formspree, etc.) |
| Libro de reclamaciones | `libro-de-reclamaciones/index.html` | proyecto, Nombres, Apellidos, Domicilio, Email, Teléfono, Tipo (DNI/RUC/Passport), Número documento, Guardian (padre/madre), Tipo bien (producto/servicio), Monto, Detalle reclamo, Detalle pedido | POST `/libro-de-reclamaciones` | back end. Alternativo posible (Formspree, etc.) |
| Ficha de proyecto | `proyectos/*/index.html` | Nombres, Apellidos, DNI, Teléfono, Proyecto, Email | POST `/proyectos/<slug>#contacto` | back end. Alternativo posible (Formspree, etc.) |

Detalles:
- Validación cliente: name/last_name/phone obrigatórios (`required`), DNI `[0-9]{8,12}`.
- tel: tipo `tel`, `inputmode="numeric"`, `maxlength=12`.
- Strings list: áreas, dirección, número, monto, descripción.
- 'política de privacidad' en contacto sin link. Documentado como posible gap.

## 10. SEO

- title pattern: `Nombre · Inmobiliaria · Trujillo` (presente en las 9 páginas).
- meta description: en las 9 páginas, excepto proyectos sin `og:image` (pero que tienen desc).
- `og:title`, `og:description`, `og:type=website`, `og:image` presentes.
- `favicon` varente.
- Faltan: canonical tags, `robots.txt`, `sitemap.xml`, structured data (Google business). Documentar para añadirlos.
- RUTA absoluta desde raíz (`/css/...`).

## 11. Rendimiento

-peso: 64,8 MB total, excluyendo `_capture/` (~33 MB: profiling de Chrome 7×13–17 MB, capturas en PNG).
- Símbolos de fuentes locales, sin Google Fonts.
- Lazy loading: máxima mitad de imágenes, `loading="lazy"` + límites de red.
- Verifica no banners bajo lading host.
- `?v=` actualizado desde los assets.

## 12. Ambiente de desarrollo

### 12.1 Servidor local
- `serve.cmd` o `serve.ps1`: Python `http.server` en `http://127.0.0.1:8765/` (Python en PATH).
- Fallback: Node.js si no hay Python (script incrustado en `serve.ps1`).
- Se puede usar como servidor de desarrollo: `http://127.0.0.1:8765/`.

### 12.2 Revisiones
- REA: list_browser_targets + inspect_web_page con todas las 9 páginas.

---

## 13. Verificación y validación

- Curios y count: 9 páginas útiles responden 200.
- Estilo coherente entre views (loader, font, estilo).
- mobile responsive styles (verify_media_queries on text resolution).
- Previous jobs: juncos mismatch: ~only, expected visible modifications listed above.

---

## 14. Decisiones de diseño documentadas

| Decisión | Justificación |
|---|---|
| Pixel perfect con el original | Maximiza immersion for the brand and minimizes risk of breaking users. |
| SVG6 do-como PNG | evita heterogeneidad de renderizado entre navegadores. JPEG compresion (comprimido = más pixel caso). Verificar degradación graceful. |
|Sin canonical/robots/sitemap/structured data | Uf, lo deje fuera de forma deliberada: falta de ignorancia posible. Si se deploya en producción, añadirlos. |

---

## 15. Limitaciones de la v0.1

- Formularios no funcionales: servers devueltos 501, `501` por estar en servidor estático. Validar formularios con Cloudflare/Formspree/etc. al 100%.
- og:image apunta a `www.ryrinmobiliaria.com` (tienes que cambiarlo a tu propio dominio).
- Datos del help: NEED TOOL meaning of `?a=6` no está documentado; se mantiene como sufijo CMS antiguo.
- `_capture/` existe, pero sus contenido no está en el sitio; solo lláveso para futuros experimentos o revisiones. Nota: `AGENTS.md` lo describe como artefacto: no editar como si fuera código.
- Intersección: nombre `R&R`, hrefs `https://www.ryrinmobiliaria.com/...` en `og:image` (4 páginas de ficha).
- JavaScript: detalle terrestre: los slider del home depende de `data-slider` en `.mh-slider` (existe 4 slides, uno render así: `class="mh-slide is-active"`, único). de excluye en js `parseInt(data-intervalo)` con parseInt.

---

## 16. Validación previa (pasos realizados y verificables)

1. usando REA: list_browser_targets + inspect_web_page con CDP (9 páginas). 0 errores de consola, 0 fallos de red, 0 headers externos, todas las 8 páginas 200 en local. Screenshot REA basado en CDP (dif útil: "El body de la página".

## 17. Verificación previa (v=0.1): caminos hacia adelante

- Para el despliegue, validar scripts (0 errores console, 0 warnings).
- Verificar en producción: `https://www.ryrinmobiliaria.com/...` (servidor live).
- Documentar landing page viviente.

---

## 18. Disposición de los artifactos

- REBRANDING.md —listo para usar tras entregar a otra marca.
- ESPECIFICACIONES.md —b CP incluye esta versión.

## 19. Nota sobre el ámbito de trabajo

- El sitio es static HTML/CSS/JS/AgFi — sin packing, sin stageo, sin eslint, sin back-end.
- Copia electrónica de un sitio live — se validó con REA (red, la cadena de llamadas: 9 páginas).
- Decisiones usadas en el sitio. Usar table ContentElement — usar el enfoque de skell.


Otro tenía issues con contenido.

---
