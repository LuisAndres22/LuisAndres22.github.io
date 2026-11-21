# Pendientes de assets — rebranding R+A

Lista de archivos y datos que faltan para completar el rebranding según
`especificaciones_de_marca_y_rebranding_web.md`. Todo lo que no está aquí ya
quedó aplicado en el sitio.

## 1. Logos (bloquea el cambio visible de marca)

| Archivo | Especificación |
| --- | --- |
| `img/ryr-lockup.png` | Lockup R+A Inmobiliaria, tinta `#141413` + dorado `#C59B43`, PNG transparente, **1200×481 px** (ratio 2.5:1). |
| `img/ryr-lockup-blanco.png` | Misma pieza en blanco puro `#FFFFFF`, PNG transparente, **1200×481 px**. |
| `img/favicon.png` | **512×512 px**. El actual es 128×128. |
| `img/logos/safiro.png` | Logo de Urbanización Safiro, PNG transparente. Ratio recomendado 2.5–3.4:1 (referencia de los actuales: central-345 1300×380, sienna 709×400, lumina 800×316, origen 800×271). |
| `img/logos/vallereal.png`, `img/logos/terraluz.png` | Solo si se publican esos proyectos en preventa. |

Mientras no existan, el sitio sigue mostrando los lockups R&R actuales: los
`<img>` ya apuntan a los nombres definitivos, así que basta reemplazar los
archivos para que el cambio sea visible.

## 2. Imágenes de Safiro

`/uploads/{s,m,l}/` y la raíz, con los mismos nombres que usa hoy
`central-345` (fachada, lobby, áreas comunes, planos) y `?a=6` intacto.
Sin ellas, renombrar la carpeta `/proyectos/central-345/` deja la ficha con
renders y dirección del proyecto anterior.

## 3. Tipografía Montserrat

Solo hay `Montserrat-ExtraBold` (800) en `fonts/`. Faltan:

- `Montserrat-Regular.woff2` / `.ttf` (400)
- `Montserrat-SemiBold.woff2` / `.ttf` (600)
- `Montserrat-Bold.woff2` / `.ttf` (700)
- `Montserrat-Italic.woff2` / `.ttf` (400 italic)

Los stacks CSS no se tocaron a propósito: sin estos archivos el navegador
caería a una fuente de sistema y el sitio se vería peor que ahora.

## 4. Datos de contacto y legales

- Dominio definitivo (hoy `og:image` y canonizan a `www.ryrinmobiliaria.com`).
- Teléfono, WhatsApp, correo y dirección de cada sede.
- Redes sociales (el handle de Instagram actual es `ryrinmobiliaria_`).
- RUC / razón social exacta para el pie y el Libro de Reclamaciones.
- Textos de Política de Privacidad y Términos.
- URL del formulario real (el sitio es estático: hoy el POST devuelve 501).

## 5. Contenido de Safiro

- Nombre comercial, tagline, descripción y argumentos (sección 2.1 del manual).
- Dirección, etapas y fechas.
- Tabla de tipologías y metrajes.
- Precio de lanzamiento y condiciones de preventa, si se publican.

## 6. Decisiones abiertas

- ¿Se publica solo Safiro (`Todos · 01`) o también Valle Real y Terra Luz
  (`Todos · 03`)? Afecta los contadores de `proyectos/index.html` y las
  `<option>` de `contacto/index.html`.
- ¿Se conservan los 18 proyectos entregados de la línea de tiempo?
- ¿Se elimina `_capture/` del repo (33 MB de material de captura)?
- ¿Se renombra `/proyectos/central-345/` a `/proyectos/urbanizacion-safiro/`
  en cuanto existan los assets del punto 2?
