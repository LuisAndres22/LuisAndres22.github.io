# Guía de rebranding

Cómo convertir esta réplica en el sitio de **otra inmobiliaria** conservando estructura, diseño y comportamiento.

El sitio está pensado como plantilla: casi toda la identidad vive en unos pocos archivos (assets, tokens CSS y textos repetidos). La estructura HTML, las clases, los atributos `data-*` y los scripts **no dependen de la marca**.

---

## 1. Regla de oro

| Sí cambiar | No cambiar |
|---|---|
| Imágenes de marca (`img/ryr-*`, `img/logos/*`, `img/favicon.png`) | Nombres de clase (`mo-nav`, `mo-card`, `mk-form`, …) |
| Variables CSS `--ryr-*` (valores) | Nombres de variables (opcional renombrar) |
| Textos, datos de contacto, enlaces sociales | Estructura HTML y orden de secciones |
| `<title>`, `meta description`, `og:*` | Atributos `data-slider`, `data-filter`, `data-rv`, `data-src`, … |
| Slugs y fichas de proyecto (si cambia el catálogo) | `js/site.js`, `js/motion.js` |
| `?v=` de cache-busting | Rutas absolutas desde raíz (`/css/…`, `/uploads/…`) |

Si se conservan los **nombres de archivo** de los assets, se evita editar 37 referencias al lockup y más de 1.200 URLs de imágenes.

---

## 2. Inventario de marca

| Qué | Dónde | Apariciones | Acción |
|---|---|---|---|
| Lockup principal (tinta) | `/img/ryr-lockup.png` (1200×481) | 37 | Sustituir bytes, mismo ratio |
| Lockup blanco | `/img/ryr-lockup-blanco.png` (1200×481) | 19 | Sustituir bytes |
| Favicon | `/img/favicon.png` | 9 | Sustituir |
| Logos de proyecto | `/img/logos/{central-345,sienna,lumina,origen}.png` | 4 páginas + home | Sustituir por los de la nueva marca |
| Avales | `/img/avales/capeco-codip.png` | 9 | Reemplazar o eliminar el bloque |
| Segunda marca del grupo | `/img/impulsa.png` | 1 (`quienes-somos`) | Reemplazar o eliminar |
| Fotos corporativas | `/uploads/{s,m,l/}ryr-equipo-*.jpg` | 2 secciones | Reemplazar por fotos propias |
| Proyectos entregados | `/img/entregados/*` (16 fotos + 16 logos) | 1 página | Reemplazar o vaciar el listado |
| Nombre | HTML (títulos, alts, footer) | ~80 | Reemplazo global |
| Razón social | `R&R Inmobiliaria S.A.C.` en los 9 footers | 9 | Reemplazo global |
| Teléfono | `999697779` / `999 697 779` | 19 / 10 | Reemplazo global |
| WhatsApp | `wa.me/51999697779` + texto precargado | 9 | Reemplazo global (ver §6) |
| Correo | `contacto@gruporyr.com` | 20 | Reemplazo global |
| Instagram / Facebook / LinkedIn | 9 footers | 27 | Reemplazo global |

> `_capture/` contiene evidencia del sitio original (HTML fuente, capturas, listas de assets). **No forma parte del sitio publicado** y debe eliminarse al entregar una versión con otra marca.

---

## 3. Identidad visual

### 3.1 Reemplazo de imágenes

Requisitos para que el diseño no se rompa:

- **Lockup**: PNG con transparencia, proporción ≈ 2,5:1 (el actual es 1200×481). Se usa a 120–140 px de ancho en la barra y a ~200 px en el footer.
- **Lockup blanco**: misma pieza en blanco puro (se muestra sobre fondos oscuros y fotos).
- **Favicon**: PNG cuadrado, 512×512 recomendado.
- **Logos de proyecto**: PNG con transparencia, alto útil uniforme; se muestran sobre foto con velo.
- **Fotos**: JPG; si se conserva el esquema responsive, entregar 4 versiones (`640`, `800`, `1600`, `2400` px de ancho) en `/uploads/s/`, `/uploads/m/`, `/uploads/l/` y `/uploads/`.

El CSS alterna lockup tinta/blanco con las clases `.lk-ink` y `.lk-blanco`; ambas imágenes deben existir siempre (aunque una sea una copia).

### 3.2 Si se renombran archivos

Actualizar todas las referencias:

```powershell
Get-ChildItem -Recurse -Filter *.html |
  Select-String -Pattern 'ryr-lockup|favicon\.png|ryr-equipo'
```

---

## 4. Color y tipografía

Todo el sistema visual está en `css/site.css`, bloque `:root` (**líneas 83–237**) y en los `@font-face` (**líneas 20–81**).

### 4.1 Variables de color

| Variable | Valor actual | Rol | Cambiar |
|---|---|---|---|
| `--ryr-cream` | `#FFFFFF` | Fondo principal | Sí |
| `--ryr-ink` | `#1D1E1C` | Texto y fondos oscuros | Sí |
| `--ryr-graphite` | `#444444` | Texto secundario | Sí |
| `--ryr-cream-200` | `#F4F4F4` | Superficies y hover | Sí |
| `--ryr-cream-300` | `#E4E4E4` | Bordes | Sí |
| `--ryr-cream-400` | `#BDBDBD` | Texto tenue | Sí |
| `--ryr-graphite-300/500/900` | `#8C8C8A` / `#6A6A68` / `#2A2B29` | Escala neutra | Sí |
| `--ryr-sky` | `#7FA6C7` | Acento editorial | Opcional |
| `--ryr-verde` | `#1c9438` | Acento de marca: líneas finas, subrayado del menú, hitos | Sí |
| `--ryr-verde-claro` | `#2FB954` | Mismo acento sobre fondo oscuro | Sí |

Los alias semánticos (`--bg`, `--fg`, `--border`, `--rule`, …) apuntan a esas variables: cambiando las `--ryr-*` se recolorea casi todo el sitio.

Buenas prácticas:

- Mantener **contraste AA**: `--ryr-ink` sobre `--ryr-cream` y viceversa. El acento se usa en líneas y detalles, no en texto corrido.
- Hay **65 literales hex** fuera del bloque de tokens (sombras, tema oscuro muerto, algunos detalles). Buscar `#[0-9A-Fa-f]{3,8}` si se quiere coherencia total.
- Renombrar el prefijo `--ryr-` es opcional; son 62 apariciones y un reemplazo global seguro (`--ryr-` → `--marca-`).
- El tema oscuro existe en CSS pero está desactivado: cada página fija `data-theme="claro"` en un script inline (líneas 12–23). No es necesario tocarlo.

### 4.2 Tipografía

| Familia | Pesos | Uso | Licencia |
|---|---|---|---|
| Poppins | 300, 400 | Texto y titulares | SIL OFL |
| Montserrat | 800 | Botones, rótulos, cifras destacadas | SIL OFL |
| Lato | 400, 400 itálica | Cifras y metrajes | SIL OFL |
| Alga | 200 itálica | Cursivas editoriales (`--font-serif-ital`) | **Comercial** |

- **Alga requiere licencia.** Si la nueva marca no la tiene, sustituir el archivo `/fonts/Alga-ExtralightItalic.*` y/o cambiar `--font-serif-ital` por otra serif itálica.
- Para cambiar de familia: reemplazar los archivos en `/fonts/`, ajustar los `@font-face` y las variables `--font-sans`, `--font-display`, `--font-serif`, `--font-serif-ital`, `--font-num`.
- No declarar un rango de pesos (`100 900`) para archivos estáticos: el navegador dejaría de sintetizar la negrita.

### 4.3 Tokens de forma y ritmo

| Token | Valor | Efecto |
|---|---|---|
| `--r-sm/md/lg` | `2px / 4px / 8px` | Radio de esquinas (marcas redondeadas: subir) |
| `--shadow-*` | sombras neutras | Profundidad de tarjetas |
| `--grid-max` | `1320px` | Ancho de la retícula de contenido |
| `--max` | `1440px` | Ancho máximo de sección |
| `--pad-x` | `56px` | Margen lateral en escritorio |
| `--dur-*`, `--ease-*` | 180/320/560 ms | Ritmo de animaciones |

---

## 5. Textos de marca

Cadenas a revisar (todas en HTML):

| Cadena | Apariciones | Dónde |
|---|---|---|
| `R&R Inmobiliaria` / `R&amp;R Inmobiliaria` | ~30 | `<title>`, `alt`, `aria-label`, footer |
| `R&R` / `r&r` | ~50 | Títulos, alts, “Sobre R&R”, “Grupo R&R” |
| `R&R Inmobiliaria S.A.C.` | 9 | Copyright del footer |
| `vive como siempre imaginaste.` | 17 | Footer (minúscula) y `meta description` (mayúscula) |
| `Cada proyecto es un lugar donde alguien va a vivir. Por eso construimos con esa responsabilidad.` | 9 | Footer |
| `Grupo inmobiliario R&R.` | 1 | `quienes-somos` |
| `Sobre R&R` | 9 | Columna “La empresa” del footer |
| `Al enviar aceptas nuestra política de privacidad y autorizas a R&R Inmobiliaria…` | 5 | Formularios |
| Aviso legal de renders y precios | 9 | Footer |
| Misión, visión, propósito, valores e historia | 1 | `quienes-somos` |
| Descripciones, amenidades, precios y metrajes | 4 | Fichas de proyecto |

Reemplazo global sugerido (respetando mayúsculas y `&amp;`):

```powershell
$files = Get-ChildItem -Recurse -Filter *.html | Where-Object { $_.FullName -notlike '*_capture*' }
foreach ($f in $files) {
  $t = [IO.File]::ReadAllText($f.FullName, [Text.Encoding]::UTF8)
  $t = $t.Replace('R&amp;R', 'NUEVA MARCA').Replace('R&R', 'NUEVA MARCA') `
        .Replace('NUEVA MARCA Inmobiliaria S.A.C.', 'NUEVA MARCA S.A.C.')
  [IO.File]::WriteAllText($f.FullName, $t, (New-Object Text.UTF8Encoding($false)))
}
```

> El “Grupo R&R” y la marca `Impulsa` de `quienes-somos` deben revisarse a mano: la nueva marca puede no tener grupo ni segunda inmobiliaria. Si no aplica, eliminar la sección `.qs-grupo` completa.

---

## 6. Contacto y redes

| Dato | Valor actual | Dónde |
|---|---|---|
| Teléfono visible | `999 697 779` | Header CTA, contacto, footer ×9 |
| Teléfono `tel:` | `tel:999697779` | ×19 |
| WhatsApp flotante | `https://wa.me/51999697779?text=Hola%20R%26R%2C…` | ×9 (todas las páginas) |
| Correo | `contacto@gruporyr.com` | ×20 |
| Sedes | Av. Guillermo Ganoza 280 · Av. España 345 | `contacto` |
| Horario | L–V 9:00–20:00 · S–D 9:30–18:30 | `contacto` |
| Instagram | `instagram.com/ryrinmobiliaria_?igsh=…` | ×9 |
| Facebook | `facebook.com/share/1Bt1UQ6Y7y/` | ×9 |
| LinkedIn | `linkedin.com/company/r-r-inmobiliaria` | ×9 |

El texto precargado de WhatsApp está **doble-codificado** (`R%26R` = `R&R`). Al cambiarlo, volver a codificar el `&` como `%26` y los espacios como `%20`.

---

## 7. SEO y metadatos

Cada una de las 9 páginas tiene `<title>` con el patrón `Página · R&R Inmobiliaria · Trujillo` y su `meta description` (la misma descripción genérica en varias). Cambiar:

1. `<title>` y `meta name="description"`.
2. `og:title` y `og:description`.
3. **`og:image` de las 4 fichas de proyecto**: hoy apunta en absoluto a producción:
   ```
   https://www.ryrinmobiliaria.com/uploads/…
   ```
   Reemplazar por el dominio nuevo o por una ruta relativa/absoluta del sitio.
4. `favicon` (en `<head>` de las 9 páginas).
5. `lang="es"` se mantiene; si el mercado cambia, ajustar a `es-PE`, `es-MX`, etc.

No hay `canonical`, `robots.txt`, `sitemap.xml` ni datos estructurados; si se despliega en producción conviene añadirlos.

---

## 8. Catálogo de proyectos (opcional)

El sitio modela **4 proyectos activos + 16 entregados**. Si la nueva marca tiene otro catálogo:

1. **Slugs**: renombrar `proyectos/<slug>/` y actualizar todos los enlaces (`/proyectos/<slug>`), el slider del home, las tarjetas, el footer, los `<option>` del formulario de contacto y los `action` de los formularios de ficha.
2. **Tarjetas** en `proyectos/index.html`: cada `<article class="mo-card" data-status="…">` con su badge.
3. **Contadores de filtros**: `Todos · 04`, `En preventa · 02`, `En construcción · 02`, `Entrega inmediata · 00`, `Entregado · 16` (texto y `data-filter`).
4. **Entregados**: `<li class="mp-tray-item">` con logo y fachada en `/img/entregados/`.
5. **Ficha**: hero con logo, tagline, dirección; secciones `#areas-comunes`, `#informacion`, `#ubicacion`, `#galeria`, `#planos`, `#contacto`; tabla de tipologías y precios.
6. **Home**: 4 slides en `.mh-slider` (imagen, logo, tagline, dirección, enlace) y el popup de lanzamiento (`.mh-launch`).
7. **Formularios**: `<option>` de proyecto en `contacto/index.html`.
8. **Imágenes**: respetar el esquema `s/m/l/original` y el sufijo `?a=6` de las URLs.

---

## 9. Legal y formularios

- **Libro de Reclamaciones** (`/libro-de-reclamaciones/`): cambia la razón social en la descripción, el texto legal y el pie; el articulado (Ley 29571, D.S. 011-2011-PCM, plazo de 15 días hábiles) se mantiene si se opera en Perú.
- **Formularios**: los 6 formularios hacen `POST` a `/contacto`, `/libro-de-reclamaciones` o `/proyectos/<slug>#contacto`. En un hosting estático devuelven 501. Al rebrandear hay que decidir el backend (endpoint propio, Formspree, Netlify Forms, etc.) y ajustar `action`/`method`, o dejarlos como maqueta.
- **Privacidad**: el texto “política de privacidad” **no enlaza** a ninguna página. Si la nueva marca la necesita, crear `/politica-de-privacidad/` y enlazarla en los 5 formularios y en el footer.
- **Aviso de renders**: mantenerlo; es un escudo legal habitual del sector.

---

## 10. Caché y verificación

- Subir la versión de los assets: reemplazar `v=1790382749901` por un timestamp nuevo en las 9 páginas (**150 apariciones**).
- El sufijo `?a=6` de `/uploads/` (**1.272 apariciones**) puede quedarse si no se reemplazan los archivos.
- Comprobar que no queden restos de la marca anterior:

```powershell
Get-ChildItem -Recurse -File -Include *.html,*.css,*.js |
  Where-Object { $_.FullName -notlike '*_capture*' } |
  Select-String -Pattern 'R&R|R&amp;R|ryr|gruporyr|999697779|ryrinmobiliaria'
```

- Verificar en local: `serve.cmd` → `http://127.0.0.1:8765/` → recorrer las 9 rutas, consola sin errores, imágenes del slider y de las galerías cargando.

---

## 11. Checklist de rebranding

- [ ] Lockups (tinta y blanco), favicon y logos de proyecto reemplazados.
- [ ] Avales y segunda marca del grupo revisados/eliminados.
- [ ] Fotos del equipo y de entregados reemplazadas.
- [ ] Variables `--ryr-*` con la paleta nueva y contraste verificado.
- [ ] Tipografías licenciadas; `Alga` sustituida si no hay licencia.
- [ ] Nombre, razón social, tagline y textos globales reemplazados.
- [ ] Teléfono, WhatsApp, correo, sedes, horario y redes actualizados.
- [ ] `<title>`, `description`, `og:*` y `og:image` por página.
- [ ] Catálogo de proyectos y contadores de filtros coherentes.
- [ ] Formularios con `action` válido o decisión de dejarlos como maqueta.
- [ ] Libro de Reclamaciones con la razón social nueva.
- [ ] `?v=` actualizado y búsqueda de restos en cero.
- [ ] `_capture/` eliminado de la entrega.
