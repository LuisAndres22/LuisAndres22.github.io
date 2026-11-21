# Manual de Marca y Guía de Implementación Web: R+A Inmobiliaria

Este documento define las especificaciones de identidad visual, paleta cromática corporativa, colores representativos por proyecto y el mapeo técnico necesario para adaptar la plantilla web (según los lineamientos de `REBRANDING.md`).

---

## 1. Identidad de la Empresa Promotora

* **Marca Comercial:** R+A Inmobiliaria
* **Razón Social (para footer y documentos legales):** R+A Inmobiliaria S.A.C.
* **Ubicación Operativa:** Trujillo, La Libertad, Perú.
* **Equipo Promotor / Autores:** Luis Andrés Rodríguez Agreda & Jeremías P. Rodríguez Chiques.
* **Filosofía y Propuesta de Valor (para sección `quienes-somos`):**
  > *"R+A Inmobiliaria nace con una visión diferente del mercado inmobiliario: entender que una vivienda no es simplemente una propiedad, sino el lugar donde las personas construyen sus historias, comparten momentos y desarrollan sus proyectos de vida."*

### 1.1 Paleta Cromática Corporativa (R+A Inmobiliaria)

Extraída directamente del logotipo oficial de la empresa promotora (Lámina 05):

| Rol en Identidad | Nombre del Color | HEX | RGB | Aplicación en la Web (`css/site.css`) |
| :--- | :--- | :--- | :--- | :--- |
| **Primario Oscuro** | Negro Corporativo | `#141413` | `20, 20, 19` | `--ryr-ink`: Textos principales, fondos oscuros, footer y lockup en tinta. |
| **Acento Principal** | Dorado Metálico R+A | `#C59B43` | `197, 155, 67` | `--ryr-verde`: Líneas finas, subrayado activo del menú, hitos y detalles de marca. |
| **Acento Luminoso** | Dorado Brillo | `#E0BD6B` | `224, 189, 107` | `--ryr-verde-claro`: Estados `:hover` y acentos sobre fondos oscuros. |
| **Acento Profundo** | Bronce / Dorado Sombra | `#9E7628` | `158, 118, 40` | Degradados metálicos del isotipo y bordes de énfasis. |
| **Base Clara** | Blanco Puro | `#FFFFFF` | `255, 255, 255` | `--ryr-cream`: Fondo principal de todas las páginas. |
| **Superficie Neutra** | Gris Concreto / Piedra | `#A6A6A4` | `166, 166, 164` | `--ryr-graphite-300`: Textos secundarios, separadores y fondos de apoyo. |

---

## 2. Colores Representativos y Ficha por Proyecto

De acuerdo con la evaluación de marca de la Lámina 05, **Urbanización Safiro** es la propuesta ganadora (14/15 puntos) y constituye el proyecto principal del sitio. Se incluyen también las paletas de **Valle Real** y **Terra Luz** en caso de incorporarlos como proyectos en etapa de preventa o próximos lanzamientos en el catálogo.

### 2.1 Proyecto Principal (Ganador): Urbanización Safiro

* **Subtítulo / Sector:** Natasha Alta – Trujillo, La Libertad.
* **Lema Oficial:** *"Donde comienza tu mejor vida."*
* **Atributos de Comunicación:**
  * **Moderno:** Propuesta urbana y funcional.
  * **Aspiracional:** Promueve un mejor y moderno espacio.
  * **Cercano:** Lenguaje claro y amable enfocado en las personas.
  * **Confiable:** Transmite seguridad, planificación y respaldo del proyecto.

#### Paleta Cromática Oficial (Urbanización Safiro — Lámina 05)

| Nivel | Nombre | HEX | RGB | Uso en la Ficha del Proyecto y UI |
| :--- | :--- | :--- | :--- | :--- |
| **Tono 1 (Oscuro)** | Azul Safiro Profundo | `#0D3459` | `13, 52, 89` | Encabezados de sección, botones principales del proyecto y badges de estado. |
| **Tono 2 (Medio)** | Azul Safiro Corporativo | `#1867A9` | `24, 103, 169` | Color identificador del proyecto, iconos de amenidades y bordes activos. |
| **Tono 3 (Claro)** | Azul Safiro Cielo | `#53A5E0` | `83, 165, 224` | `--ryr-sky`: Acentos editoriales, destacados en gráficos y etiquetas. |
| **Tono 4 (Neutro)** | Azul Safiro Grisáceo | `#B3BDC6` | `179, 189, 198` | Fondos de tablas de tipologías, tarjetas técnicas y divisores suaves. |

#### Datos Técnico-Comerciales (Para Ficha de Proyecto y Tabla de Metrajes)

* **Tipo de habilitación:** Residencial de densidad media (Segmento Socioeconómico A).
* **Superficie total:** Área bruta de $13.914\text{ ha}$ ($139,140\text{ m}^2$) | Área vendible de $57,750\text{ m}^2$.
* **Capacidad total:** $274$ lotes distribuidos en tres tipologías:
  1. **Lotes Unifamiliares:** $205$ unidades ($10\text{ m}$ frente $\times$ $21\text{ m}$ fondo = $210\text{ m}^2$ c/u | Subtotal: $43,050\text{ m}^2$). Precio referencial competitivo: $\approx \text{US\$ } 850/\text{m}^2$.
  2. **Lotes Multifamiliares:** $68$ unidades ($10\text{ m}$ frente $\times$ $21\text{ m}$ fondo = $210\text{ m}^2$ c/u | Subtotal: $14,280\text{ m}^2$ — Departamentos amplios de aprox. $120\text{ m}^2$). Precio referencial competitivo: $\approx \text{US\$ } 1,180/\text{m}^2$.
  3. **Comercio Vecinal:** $1$ lote ($20\text{ m}$ frente $\times$ $21\text{ m}$ fondo = $420\text{ m}^2$).
* **Infraestructura y Equipamiento:** Agua potable, alcantarillado, energía eléctrica, alumbrado público, vías pavimentadas, parques, áreas recreativas y ubicación estratégica frente a centro comercial (a $1.5\text{ km}$ de colegios, centros de salud y comercio, con acceso por Av. Mansiche y Av. América).
* **Etapas del Proyecto:**
  1. Planificación y aprobación
  2. Habilitación urbana
  3. Comercialización de lotes
  4. Entrega y consolidación

---

### 2.2 Proyecto Complementario B: Urbanización Valle Real

* **Ubicación:** Natasha Alta – Trujillo.
* **Enfoque Visual:** Entorno natural, amplitud residencial y áreas verdes integradas.
* **Colores Representativos:**

| Rol | Nombre | HEX | RGB | Aplicación Sugerida |
| :--- | :--- | :--- | :--- | :--- |
| **Principal** | Verde Oliva / Bosque | `#6C8D2B` | `108, 141, 43` | Color identificativo de tarjeta, iconos y botones del proyecto. |
| **Acento** | Amarillo Solar | `#E6B83A` | `230, 184, 58` | Detalles gráficos, etiquetas de preventa e iluminación visual. |
| **Secundario** | Gris Pizarra | `#58595B` | `88, 89, 91` | Tipografía de título del proyecto y líneas estructurales. |

---

### 2.3 Proyecto Complementario C: Urbanización Terra Luz

* **Ubicación:** Natasha Alta – Trujillo.
* **Enfoque Visual:** Arquitectura contemporánea, calidez y proyección urbana.
* **Colores Representativos:**

| Rol | Nombre | HEX | RGB | Aplicación Sugerida |
| :--- | :--- | :--- | :--- | :--- |
| **Principal** | Dorado Tierra / Ocre | `#C39A45` | `195, 154, 69` | Color identificativo de tarjeta, bordes y destacados del proyecto. |
| **Contraste** | Carbón Urbano | `#3C3C3B` | `60, 60, 59` | Tipografía de título y contraste estructural. |
| **Fondo Suave** | Arena Claro | `#E7D7B9` | `231, 215, 185` | Superficies de apoyo y fondos de ficha técnica. |

---

## 3. Sistema Tipográfico

Según la Lámina 05, la identidad utiliza **Montserrat** de forma integral. Para cumplir con la sección **4.2 de `REBRANDING.md`** y evitar el uso de fuentes con licencia comercial (`Alga`), se establece la siguiente correspondencia en `css/site.css`:

| Variable CSS en Plantilla | Fuente Anterior | Nueva Fuente (R+A / Safiro) | Pesos Recomendados |
| :--- | :--- | :--- | :--- |
| `--font-display` | Montserrat (800) | **Montserrat** | `700` (Bold) / `800` (ExtraBold) |
| `--font-sans` | Poppins (300, 400) | **Montserrat** | `400` (Regular) / `600` (SemiBold) |
| `--font-num` | Lato (400) | **Montserrat** | `600` (SemiBold) / `700` (Bold) |
| `--font-serif-ital` | Alga (Comercial) | **Montserrat Italic** *(o Lora Italic)* | `400 Italic` / `500 Italic` |

---

## 4. Guía de Cambios en la Página Web (Mapeo con `REBRANDING.md`)

### 4.1 Variables CSS (`css/site.css`, líneas 83–237)

Sustituye los valores dentro del bloque `:root` conservando los nombres de las variables para no alterar el resto de las hojas de estilo:

```css
:root {
  /* Paleta Base Corporativa R+A Inmobiliaria */
  --ryr-cream: #FFFFFF;
  --ryr-ink: #141413;
  --ryr-graphite: #3C3C3B;
  --ryr-cream-200: #F5F5F4;
  --ryr-cream-300: #E4E4E2;
  --ryr-cream-400: #BDBDBD;
  --ryr-graphite-300: #A6A6A4;
  --ryr-graphite-500: #6A6A68;
  --ryr-graphite-900: #262625;

  /* Acentos de Marca (Dorado R+A + Azul Safiro) */
  --ryr-sky: #53A5E0;          /* Azul Safiro Cielo (acento editorial) */
  --ryr-verde: #C59B43;        /* Dorado R+A (líneas finas, menú activo, hitos) */
  --ryr-verde-claro: #E0BD6B;  /* Dorado Brillo (acento sobre fondo oscuro) */

  /* Tokens adicionales por proyecto (para clases personalizadas en fichas) */
  --proyecto-safiro-dark: #0D3459;
  --proyecto-safiro-main: #1867A9;
  --proyecto-safiro-light: #53A5E0;
  --proyecto-safiro-muted: #B3BDC6;

  --proyecto-vallereal-main: #6C8D2B;
  --proyecto-vallereal-accent: #E6B83A;

  --proyecto-terraluz-main: #C39A45;
  --proyecto-terraluz-dark: #3C3C3B;
}
```

### 4.2 Reemplazo de Assets Gráficos (`/img/`)

Para mantener intactas las 37 referencias en el HTML sin romper la maquetación:

1. **Lockup Principal (`/img/ryr-lockup.png`):** Exportar logotipo **R+A Inmobiliaria** en negro (`#141413`) y dorado (`#C59B43`) con fondo transparente, dimensión exacta `1200 × 481 px` (ratio `2.5:1`).
2. **Lockup Blanco (`/img/ryr-lockup-blanco.png`):** Exportar la misma pieza en blanco puro (`#FFFFFF`) para fondos oscuros y sliders (`1200 × 481 px`).
3. **Favicon (`/img/favicon.png`):** Exportar el isotipo `R+A` en formato cuadrado de `512 × 512 px`.
4. **Logos de Proyecto (`/img/logos/`):**
   * Reemplazar `/img/logos/central-345.png` por el logo de **Urbanización Safiro** en versión blanca/clara (para superponer sobre el render del hero).
   * Si se muestran los otros proyectos en el catálogo, reemplazar `sienna.png` y `lumina.png` por **Valle Real** y **Terra Luz**.
5. **Renders y Fotos (`/uploads/`):** Subir los renders exteriores e interiores de **Urbanización Safiro** (Lámina 05, punto 3) respetando las variantes de tamaño (`s/`, `m/`, `l/` y original).

### 4.3 Reemplazo de Textos Globales y Metadatos

| Elemento / Ubicación | Texto Actual (Plantilla) | Nuevo Texto (R+A Inmobiliaria) |
| :--- | :--- | :--- |
| **Nombre de Marca** | `R&R Inmobiliaria` / `R&amp;R` | `R+A Inmobiliaria` |
| **Razón Social (Footer / Legal)** | `R&R Inmobiliaria S.A.C.` | `R+A Inmobiliaria S.A.C.` |
| **Tagline Principal (Footer / Meta)** | `vive como siempre imaginaste.` | `Donde comienza tu mejor vida.` |
| **Bajada Corporativa (Footer)** | `Cada proyecto es un lugar donde alguien va a vivir...` | `El lugar donde las personas construyen sus historias, comparten momentos y desarrollan sus proyectos de vida.` |
| **Enlace Empresa (Footer)** | `Sobre R&R` | `Sobre R+A` |
| **Patrón `<title>` SEO** | `Página · R&R Inmobiliaria · Trujillo` | `Página · R+A Inmobiliaria · Trujillo` |
| **Bloque Grupo / Segunda Marca** | `.qs-grupo` (`Impulsa`) en `quienes-somos` | Eliminar sección `.qs-grupo` si no aplica segunda empresa. |

### 4.4 Ajustes en Catálogo y Formularios

1. **Slugs de Proyectos:** Renombrar la carpeta principal `/proyectos/central-345/` a `/proyectos/urbanizacion-safiro/` y actualizar enlaces en `index.html`, `proyectos/index.html`, `contacto/index.html` y el footer.
2. **Contadores de Filtros (`proyectos/index.html`):** Actualizar los valores de `data-filter` para que coincidan con los proyectos activos publicados (por ejemplo, `Todos · 01` si solo se publica Safiro, o `Todos · 03` si se incluyen Valle Real y Terra Luz en preventa).
3. **Opciones de Formulario (`contacto/index.html`):** Actualizar las etiquetas `<option>` del selector de proyectos con:
   * `Urbanización Safiro — Natasha Alta, Trujillo`
   * *(Opcional)* `Urbanización Valle Real` / `Urbanización Terra Luz`
4. **Cache-busting y Limpieza:** Actualizar el parámetro `?v=` en las 9 páginas HTML y eliminar la carpeta `_capture/` antes del despliegue final.