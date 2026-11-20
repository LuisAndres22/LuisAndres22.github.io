/* =============================================================
   site.js — interacciones públicas R&R Inmobiliaria
   ES2017 estricto: sin optional chaining, nullish coalescing,
   spread de objetos ni catch sin binding.
   Cada bloque tiene su guard y solo actúa si su DOM existe.
   ============================================================= */
(function () {
  'use strict';

  var CON_MOVIMIENTO = document.documentElement.classList.contains('has-motion');

  /* ---------- Nav: sombra al hacer scroll ----------
     La clase va también en el <body> porque en el inicio la barra superior
     y la cabecera arrancan transparentes sobre la foto y se vuelven sólidas
     recién al bajar: son dos elementos distintos y el CSS necesita un
     ancestro común para gobernar a los dos. */
  function initNavScrolled() {
    var nav = document.querySelector('.mo-nav');
    if (!nav) return;
    var body = document.body;
    var update = function () {
      var bajado = window.pageYOffset > 12;
      nav.classList.toggle('is-scrolled', bajado);
      body.classList.toggle('is-scrolled', bajado);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* =============================================================
     INICIO · transición entre proyectos
     El inicio "son los proyectos": una lámina por proyecto que se
     va pasando sola. Sin JS queda la primera visible y sus enlaces
     funcionan igual, así que nunca hay una portada en blanco.
     ============================================================= */
  function initHeroSlider() {
    var raiz = document.querySelector('[data-slider]');
    if (!raiz) return;
    var slides = raiz.querySelectorAll('.mh-slide');
    if (slides.length < 2) return;

    var dots = raiz.querySelectorAll('[data-slider-go]');
    var btnPrev = raiz.querySelector('[data-slider-prev]');
    var btnNext = raiz.querySelector('[data-slider-next]');
    var btnPausa = raiz.querySelector('[data-slider-pausa]');

    var intervalo = parseInt(raiz.getAttribute('data-intervalo'), 10);
    if (!isFinite(intervalo) || intervalo < 2000) intervalo = 6500;
    raiz.style.setProperty('--slider-dur', intervalo + 'ms');

    /* ---------- Las láminas se piden de una en una ----------
       Las seis están superpuestas y DENTRO de la pantalla, así que para el
       navegador todas son visibles y `loading="lazy"` no aplazaba nada: se
       bajaba los seis renders a la vez —4,4 MB— y la portada tardaba una
       eternidad en aparecer en el móvil. Aquí solo la primera nace con `src`;
       al resto se les pone cuando les toca. */
    function cargarSlide(n) {
      var slide = slides[n];
      if (!slide) return;
      var imgs = slide.querySelectorAll('img[data-src]');
      for (var i = 0; i < imgs.length; i++) {
        var im = imgs[i];
        var ss = im.getAttribute('data-srcset');
        var sz = im.getAttribute('data-sizes');
        /* sizes y srcset ANTES que src: al revés el navegador arranca la
           descarga del src y luego la tira para volver a elegir. */
        if (sz) { im.setAttribute('sizes', sz); im.removeAttribute('data-sizes'); }
        if (ss) { im.setAttribute('srcset', ss); im.removeAttribute('data-srcset'); }
        im.setAttribute('src', im.getAttribute('data-src'));
        im.removeAttribute('data-src');
      }
    }

    var actual = 0;
    var timer = null;
    /* Tres motivos distintos para frenar (el usuario, el puntero y la
       pestaña/viewport). Se cuentan por separado: si se guardaran en un
       solo booleano, salir del hover reanudaría algo que el usuario había
       pausado a propósito. */
    var pausadoUsuario = !CON_MOVIMIENTO;
    var pausadoHover = false;
    var pausadoFuera = false;

    /* La lámina SIGUIENTE se adelanta —si no, al pasar de una a otra se vería
       el hueco mientras baja—, pero nunca antes de que la página haya
       terminado de cargar: primero la portada que el visitante está mirando.
       Mientras esto no se abre, `pintar()` carga solo la lámina que entra. */
    var precargaAbierta = false;
    function abrirPrecarga() {
      if (precargaAbierta) return;
      precargaAbierta = true;
      cargarSlide((actual + 1) % slides.length);
    }
    if (document.readyState === 'complete') window.setTimeout(abrirPrecarga, 500);
    else window.addEventListener('load', function () { window.setTimeout(abrirPrecarga, 500); });

    function corriendo() {
      return !pausadoUsuario && !pausadoHover && !pausadoFuera;
    }

    function pintar(n, mover) {
      /* La que entra, siempre —puede haber llegado de un salto, con un clic
         en un punto—. La siguiente solo cuando la página ya terminó de
         cargar: en el primer pintado no, que ahí lo único que importa es que
         se vea la portada. */
      cargarSlide(n);
      if (precargaAbierta) cargarSlide((n + 1) % slides.length);
      for (var i = 0; i < slides.length; i++) {
        var on = i === n;
        slides[i].classList.toggle('is-active', on);
        if (on) slides[i].removeAttribute('aria-hidden');
        else slides[i].setAttribute('aria-hidden', 'true');
      }
      for (var j = 0; j < dots.length; j++) {
        if (j === n) dots[j].setAttribute('aria-current', 'true');
        else dots[j].removeAttribute('aria-current');
        dots[j].parentNode.classList.toggle('is-active', j === n);
      }
      actual = n;
      if (mover) reiniciarBarra();
    }

    /* La barra del punto activo se anima con CSS. Para relanzarla en cada
       cambio hay que sacar y volver a poner la clase forzando un reflow:
       sin eso el navegador reutiliza la animación anterior y no reinicia. */
    function reiniciarBarra() {
      for (var i = 0; i < dots.length; i++) {
        var barra = dots[i].querySelector('.bar > i');
        if (!barra) continue;
        barra.classList.remove('is-run');
        void barra.offsetWidth;
        if (i === actual && corriendo()) barra.classList.add('is-run');
      }
    }

    function ir(n) {
      var total = slides.length;
      pintar(((n % total) + total) % total, true);
    }
    function siguiente() { ir(actual + 1); }

    function arrancar() {
      parar();
      if (!corriendo()) { reiniciarBarra(); return; }
      timer = window.setInterval(siguiente, intervalo);
      reiniciarBarra();
    }
    function parar() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    function sincronizarPausa() {
      if (corriendo()) arrancar();
      else { parar(); reiniciarBarra(); }
      if (btnPausa) {
        btnPausa.classList.toggle('is-paused', pausadoUsuario);
        var lbl = pausadoUsuario ? btnPausa.getAttribute('data-lbl-sigue') : btnPausa.getAttribute('data-lbl-pausa');
        if (lbl) btnPausa.setAttribute('aria-label', lbl);
      }
    }

    if (btnPrev) btnPrev.addEventListener('click', function () { ir(actual - 1); arrancar(); });
    if (btnNext) btnNext.addEventListener('click', function () { ir(actual + 1); arrancar(); });
    if (btnPausa) {
      btnPausa.addEventListener('click', function () {
        pausadoUsuario = !pausadoUsuario;
        sincronizarPausa();
      });
    }
    var bindDot = function (btn, idx) {
      btn.addEventListener('click', function () { ir(idx); arrancar(); });
    };
    for (var d = 0; d < dots.length; d++) bindDot(dots[d], d);

    /* Con el puntero encima o el foco dentro, la lámina se queda quieta:
       nadie quiere que el botón se le mueva mientras lo va a pulsar. */
    raiz.addEventListener('mouseenter', function () { pausadoHover = true; sincronizarPausa(); });
    raiz.addEventListener('mouseleave', function () { pausadoHover = false; sincronizarPausa(); });
    raiz.addEventListener('focusin', function () { pausadoHover = true; sincronizarPausa(); });
    raiz.addEventListener('focusout', function () {
      if (!raiz.contains(document.activeElement)) { pausadoHover = false; sincronizarPausa(); }
    });

    document.addEventListener('visibilitychange', function () {
      pausadoFuera = document.hidden;
      sincronizarPausa();
    });

    if (typeof IntersectionObserver !== 'undefined') {
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          pausadoFuera = !entries[i].isIntersecting || document.hidden;
        }
        sincronizarPausa();
      }, { threshold: 0.15 });
      io.observe(raiz);
    }

    /* Flechas del teclado cuando el foco está en los controles. */
    raiz.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowLeft') { ir(actual - 1); arrancar(); }
      else if (ev.key === 'ArrowRight') { ir(actual + 1); arrancar(); }
    });

    pintar(0, false);
    sincronizarPausa();
  }

  /* ---------- Inicio: pieza de lanzamiento ----------
     Se muestra una vez por sesión y por proyecto: si el visitante la cerró,
     no vuelve a aparecer hasta que cambie la pieza o cierre el navegador. */
  function initLaunch() {
    var caja = document.querySelector('[data-launch]');
    if (!caja) return;
    var clave = 'ryr-launch-' + (caja.getAttribute('data-launch-key') || 'x');
    var visto = null;
    try { visto = sessionStorage.getItem(clave); } catch (e) {}
    if (visto) return;

    var antes = document.activeElement;
    var cerrar = function () {
      caja.hidden = true;
      caja.classList.remove('is-open');
      document.documentElement.classList.remove('sin-scroll');
      try { sessionStorage.setItem(clave, '1'); } catch (e) {}
      if (antes && antes.focus) antes.focus();
    };

    var abrir = function () {
      caja.hidden = false;
      /* La clase va en el frame siguiente para que la transición de entrada
         tenga un estado inicial del que partir. */
      window.requestAnimationFrame(function () { caja.classList.add('is-open'); });
      document.documentElement.classList.add('sin-scroll');
      var x = caja.querySelector('[data-launch-close]');
      if (x && x.focus) x.focus();
    };

    var botones = caja.querySelectorAll('[data-launch-close]');
    for (var i = 0; i < botones.length; i++) botones[i].addEventListener('click', cerrar);
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !caja.hidden) cerrar();
    });
    /* Al entrar al proyecto la pieza ya cumplió: se marca como vista. */
    var cta = caja.querySelector('a[href]');
    if (cta) cta.addEventListener('click', function () {
      try { sessionStorage.setItem(clave, '1'); } catch (e) {}
    });

    /* Con la secuencia de apertura en marcha la pieza espera a que termine:
       a los 900ms tapaba justo la entrada de la portada. */
    var espera = document.documentElement.hasAttribute('data-entra') ? 2800 : 900;
    window.setTimeout(abrir, espera);
  }

  /* ---------- Proyectos: filtros por estado ---------- */
  function initProjectFilters() {
    var wrap = document.getElementById('mp-filters');
    if (!wrap) return;
    var buttons = wrap.querySelectorAll('.mp-tabs button');
    var countEl = document.getElementById('mp-count');
    var cards = document.querySelectorAll('#mp-cards .mo-card');
    if (!buttons.length || !cards.length) return;

    /* Las obras entregadas no son tarjetas de `projects`: viven en su propia
       rejilla, alimentada por la línea de tiempo. Por eso el filtro maneja
       DOS conjuntos y solo uno está a la vista cada vez. */
    var entregados = document.getElementById('mp-entregados');
    var entregadosN = entregados ? entregados.children.length : 0;

    function apply(filter) {
      var esEntregado = filter === 'entregado' && !!entregados;
      var visible = 0;
      for (var i = 0; i < cards.length; i++) {
        /* Ojo: en «entregado» las tarjetas de proyecto SIGUEN contando. Antes
           esta línea llevaba un `!esEntregado` delante que las escondía todas,
           y desde agosto de 2026 los estados se administran desde el panel: en
           cuanto la empresa pasara un edificio a «Entregado» —que es el
           ejemplo que puso la reunión— ese edificio desaparecía de su propia
           pestaña. Ahora conviven: primero los que siguen en la tabla de
           proyectos y debajo la rejilla histórica. */
        var show = filter === 'todos' || cards[i].getAttribute('data-status') === filter;
        if (show) { cards[i].classList.remove('is-hidden'); visible++; }
        else { cards[i].classList.add('is-hidden'); }
      }
      if (entregados) {
        entregados.classList.toggle('is-hidden', !esEntregado);
        if (esEntregado) visible += entregadosN;
      }
      if (countEl) {
        countEl.textContent = String(visible).padStart(2, '0') +
          (visible === 1 ? ' Proyecto' : ' Proyectos');
      }
    }

    /* ---------- En el móvil, un menú ----------
       Las cuatro pastillas no caben en un teléfono: la barra se desbordaba y
       la última palabra quedaba partida contra el borde, sin nada que dijera
       que aquello se arrastra con el dedo. La empresa lo describió exacto:
       «parece que estuviese cortado… tal vez como un menú». Pues un menú: un
       botón con el filtro puesto y la lista al tocarlo.
       Se enciende desde aquí y no desde la plantilla porque sin JS un botón
       que no abre nada es peor que la barra de antes. */
    var btnMenu = wrap.querySelector('[data-mp-menu]');
    var etiquetaMenu = wrap.querySelector('[data-mp-menu-label]');
    if (btnMenu) {
      wrap.classList.add('is-menu');
      btnMenu.hidden = false;

      var cerrarMenu = function () {
        wrap.classList.remove('is-open');
        btnMenu.setAttribute('aria-expanded', 'false');
      };
      btnMenu.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var abierto = wrap.classList.toggle('is-open');
        btnMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      });
      /* Tocar fuera o el Escape lo cierran: en un teléfono no hay «pasar el
         ratón por fuera» y un panel que se queda abierto tapa la rejilla. */
      document.addEventListener('click', function (ev) {
        if (wrap.classList.contains('is-open') && !wrap.contains(ev.target)) cerrarMenu();
      });
      document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && wrap.classList.contains('is-open')) {
          cerrarMenu();
          btnMenu.focus();
        }
      });
    }

    function bind(btn) {
      btn.addEventListener('click', function () {
        for (var j = 0; j < buttons.length; j++) buttons[j].classList.remove('is-active');
        btn.classList.add('is-active');
        apply(btn.getAttribute('data-filter') || 'todos');
        /* El botón del menú pasa a decir qué filtro está puesto, que es la
           única forma de saberlo con la lista cerrada. */
        if (etiquetaMenu) etiquetaMenu.textContent = btn.textContent.trim();
        if (btnMenu) {
          wrap.classList.remove('is-open');
          btnMenu.setAttribute('aria-expanded', 'false');
        }
      });
    }
    for (var i = 0; i < buttons.length; i++) bind(buttons[i]);
  }

  /* ---------- Chips de filtro genéricos (galería de renders, planos) ----------
     Un grupo [data-chips="x"] filtra los hijos [data-cat] del contenedor
     [data-chip-scope="x"] con .is-hidden. Sin JS los chips son inertes
     y todo el contenido queda visible. */
  function initChipFilter() {
    var groups = document.querySelectorAll('[data-chips]');
    if (!groups.length) return;

    function bindGroup(group) {
      var name = group.getAttribute('data-chips');
      var scope = document.querySelector('[data-chip-scope="' + name + '"]');
      if (!scope) return;
      var buttons = group.querySelectorAll('button[data-chip]');
      var items = scope.querySelectorAll('[data-cat]');
      if (!buttons.length || !items.length) return;

      function apply(cat) {
        for (var i = 0; i < items.length; i++) {
          var show = cat === '__all' || items[i].getAttribute('data-cat') === cat;
          if (show) items[i].classList.remove('is-hidden');
          else items[i].classList.add('is-hidden');
        }
        if (scope.scrollLeft) scope.scrollLeft = 0;
        /* El visor de planos tiene que saltar al primer plano que quedó
           visible: si no, la ficha sigue mostrando uno que ya no está. */
        if (name === 'planos' && typeof scope.__visorPrimero === 'function') scope.__visorPrimero();
      }

      function bind(btn) {
        btn.addEventListener('click', function () {
          for (var j = 0; j < buttons.length; j++) buttons[j].classList.remove('is-active');
          btn.classList.add('is-active');
          apply(btn.getAttribute('data-chip') || '__all');
        });
      }
      for (var k = 0; k < buttons.length; k++) bind(buttons[k]);
    }

    for (var g = 0; g < groups.length; g++) bindGroup(groups[g]);
  }

  /* =============================================================
     DETALLE · carrusel de áreas comunes
     Una imagen a sangre por área, con su nombre encima. La pista usa
     scroll-snap, así que sin JS se pasa arrastrando igual; el JS solo
     agrega flechas, contador y el resaltado del elemento activo.
     ============================================================= */
  function initCarrusel() {
    var raices = document.querySelectorAll('[data-carrusel]');
    if (!raices.length) return;

    function bind(raiz) {
      var pista = raiz.querySelector('[data-carrusel-pista]');
      if (!pista) return;
      var items = pista.querySelectorAll('[data-carrusel-item]');
      if (items.length < 1) return;
      var prev = raiz.querySelector('[data-carrusel-prev]');
      var next = raiz.querySelector('[data-carrusel-next]');
      var cuenta = raiz.querySelector('[data-carrusel-cuenta]');
      var tiras = raiz.querySelectorAll('[data-carrusel-ir]');
      var indice = 0;

      function pintar(n) {
        indice = Math.max(0, Math.min(items.length - 1, n));
        for (var i = 0; i < items.length; i++) items[i].classList.toggle('is-active', i === indice);
        for (var t = 0; t < tiras.length; t++) {
          var activa = Number(tiras[t].getAttribute('data-carrusel-ir')) === indice;
          tiras[t].classList.toggle('is-active', activa);
          if (activa) tiras[t].setAttribute('aria-current', 'true');
          else tiras[t].removeAttribute('aria-current');
        }
        if (cuenta) {
          var el = cuenta.querySelector('.i');
          if (el) el.textContent = String(indice + 1).padStart(2, '0');
        }
        /* Las flechas dan la vuelta: con la lámina del centro y las vecinas
           asomando, un botón apagado en el extremo parece que se rompió. */
        if (prev) prev.disabled = false;
        if (next) next.disabled = false;
      }

      /* La lámina activa va CENTRADA en la pista, no pegada a su borde
         izquierdo: es lo que deja sitio a las vecinas por los dos lados. */
      function centro(el) {
        return el.offsetLeft - (pista.clientWidth - el.offsetWidth) / 2;
      }

      function irA(n) {
        var total = items.length;
        var idx = ((n % total) + total) % total;   /* da la vuelta */
        var destino = items[idx];
        if (!destino) return;
        pista.scrollTo({ left: centro(destino), behavior: CON_MOVIMIENTO ? 'smooth' : 'auto' });
        pintar(idx);
      }

      if (prev) prev.addEventListener('click', function () { irA(indice - 1); });
      if (next) next.addEventListener('click', function () { irA(indice + 1); });
      for (var k = 0; k < tiras.length; k++) {
        (function (btn) {
          btn.addEventListener('click', function () { irA(Number(btn.getAttribute('data-carrusel-ir'))); });
        })(tiras[k]);
      }

      /* Las áreas comunes pasan solas: en móvil el carrusel llena la pantalla
         y nadie descubría que había más de una foto. Se detiene en cuanto el
         visitante toca, arrastra o pasa el ratón, y mientras no se ve. */
      if (items.length > 1 && CON_MOVIMIENTO && raiz.hasAttribute('data-carrusel-auto')) {
        var reloj = null;
        var quieto = { usuario: false, encima: false, fuera: false };
        var parado = function () { return quieto.usuario || quieto.encima || quieto.fuera; };
        var latir = function () {
          if (parado()) return;
          irA(indice >= items.length - 1 ? 0 : indice + 1);
        };
        var arrancar = function () {
          if (reloj) window.clearInterval(reloj);
          reloj = window.setInterval(latir, 5200);
        };
        var frenar = function (motivo) {
          quieto[motivo] = true;
          if (motivo === 'usuario' && reloj) { window.clearInterval(reloj); reloj = null; }
        };
        raiz.addEventListener('mouseenter', function () { quieto.encima = true; });
        raiz.addEventListener('mouseleave', function () { quieto.encima = false; });
        raiz.addEventListener('pointerdown', function () { frenar('usuario'); });
        if (prev) prev.addEventListener('click', function () { frenar('usuario'); });
        if (next) next.addEventListener('click', function () { frenar('usuario'); });
        if (typeof IntersectionObserver !== 'undefined') {
          new IntersectionObserver(function (entries) {
            quieto.fuera = !entries[0].isIntersecting;
          }, { threshold: 0.35 }).observe(raiz);
        }
        arrancar();
      }

      /* Al arrastrar, el índice lo manda el scroll: se recalcula por cercanía
         al CENTRO de la pista, que es donde vive ahora la lámina activa. */
      var pendiente = null;
      pista.addEventListener('scroll', function () {
        if (pendiente) window.clearTimeout(pendiente);
        pendiente = window.setTimeout(function () {
          var mejor = 0;
          var dist = Infinity;
          var eje = pista.scrollLeft + pista.clientWidth / 2;
          for (var i = 0; i < items.length; i++) {
            var d = Math.abs(items[i].offsetLeft + items[i].offsetWidth / 2 - eje);
            if (d < dist) { dist = d; mejor = i; }
          }
          pintar(mejor);
        }, 90);
      }, { passive: true });

      /* El primer centrado va sin animación y después del primer pintado:
         antes de que el navegador reparta el ancho, offsetWidth es 0. */
      pintar(0);
      window.requestAnimationFrame(function () {
        pista.scrollTo({ left: centro(items[0]), behavior: 'auto' });
      });
    }

    for (var i = 0; i < raices.length; i++) bind(raices[i]);
  }

  /* =============================================================
     DETALLE · visor de planos
     La ficha (tipo, área, dormitorios, baños) se lee de los data-* de
     la propia tira, no de un JSON aparte: así el HTML servido ya es la
     fuente de verdad y sin JS la tira sigue siendo una lista de enlaces
     al plano a tamaño completo.
     ============================================================= */
  function initVisorPlanos() {
    var raiz = document.querySelector('[data-visor]');
    if (!raiz) return;
    var tira = raiz.querySelector('.pd-visor-tira');
    var enlaces = raiz.querySelectorAll('[data-visor-go]');
    var img = raiz.querySelector('[data-visor-img]');
    if (!tira || !enlaces.length || !img) return;

    var prev = raiz.querySelector('[data-visor-prev]');
    var next = raiz.querySelector('[data-visor-next]');
    var zoom = raiz.querySelector('[data-visor-zoom]');
    var cinta = raiz.querySelector('.pd-visor-cinta');
    var tipos = raiz.querySelectorAll('[data-visor-tipo]');
    var areas = raiz.querySelectorAll('[data-visor-area]');
    var dorms = raiz.querySelectorAll('[data-visor-dorms]');
    var banos = raiz.querySelectorAll('[data-visor-banos]');
    var notas = raiz.querySelectorAll('[data-visor-nota]');
    var paso = raiz.querySelector('[data-visor-n]');
    var indice = 0;

    /* La tira de miniaturas se retira de la vista EN CUANTO el JS toma el
       mando: ensuciaba el visor y repetía lo que hacen las flechas. Sigue en
       el DOM porque es de donde salen los datos, y sin JS —que es cuando esta
       línea no corre— es la única forma de llegar a cada plano. */
    tira.classList.add('is-oculta');

    /* Escribe el valor. Con `ocultable`, además esconde la fila entera si el
       plano no trae el dato: los niveles y los sótanos no tienen área ni
       dormitorios y tres guiones sueltos no informan de nada.
       El rótulo del tipo NO es ocultable: su padre es la ficha completa. */
    function poner(lista, texto, ocultable) {
      var vacio = !texto;
      for (var i = 0; i < lista.length; i++) {
        lista[i].textContent = texto || '—';
        if (!ocultable) continue;
        var fila = lista[i].parentNode;
        if (fila) fila.classList.toggle('is-empty', vacio);
      }
    }

    function visible(el) {
      var li = el.parentNode;
      return !(li && li.classList.contains('is-hidden'));
    }

    function pintar(n, conFundido) {
      var el = enlaces[n];
      if (!el) return;
      indice = n;
      /* El `href` es siempre el original —es el enlace real del plano y lo que
         abre la lupa—; para el visor se usa el ancho mediano y su srcset, que
         es lo que evita bajarse 2400 px cada vez que se pasa de plano.
         El srcset se cambia ANTES que el src: si se dejara el del plano
         anterior, el navegador lo respetaría y seguiría enseñando el viejo. */
      var src = el.getAttribute('href');
      var visorSrc = el.getAttribute('data-visor-src') || src;
      var visorSet = el.getAttribute('data-visor-srcset') || '';
      var cambiar = function () {
        if (visorSet) img.setAttribute('srcset', visorSet);
        else img.removeAttribute('srcset');
        img.setAttribute('src', visorSrc);
        img.setAttribute('data-full', src);
        img.setAttribute('alt', el.getAttribute('data-label') || '');
      };
      if (conFundido && CON_MOVIMIENTO) {
        img.classList.add('is-swap');
        window.setTimeout(function () {
          cambiar();
          window.requestAnimationFrame(function () { img.classList.remove('is-swap'); });
        }, 180);
      } else {
        cambiar();
      }
      poner(tipos, el.getAttribute('data-label'), false);
      poner(areas, el.getAttribute('data-area'), true);
      poner(dorms, el.getAttribute('data-dorms'), true);
      poner(banos, el.getAttribute('data-banos'), true);
      /* Sin ningún dato, la cinta oscura se va completa. */
      if (cinta) {
        cinta.classList.toggle('is-empty', !el.getAttribute('data-area') &&
          !el.getAttribute('data-dorms') && !el.getAttribute('data-banos'));
      }
      for (var k = 0; k < notas.length; k++) notas[k].textContent = el.getAttribute('data-nota') || '';
      /* El contador sustituye a la tira: sin ella no había forma de saber
         cuántos planos hay ni por cuál se va. Cuenta solo los visibles, que
         es lo que recorren las flechas cuando hay chips activos. */
      if (paso) {
        var vistos = 0, puesto = 0;
        for (var q = 0; q < enlaces.length; q++) {
          if (!visible(enlaces[q])) continue;
          vistos++;
          if (q === n) puesto = vistos;
        }
        paso.textContent = String(puesto).padStart(2, '0');
        var total = paso.parentNode ? paso.parentNode.querySelector('.t') : null;
        if (total) total.textContent = String(vistos).padStart(2, '0');
      }
      for (var i = 0; i < enlaces.length; i++) {
        enlaces[i].classList.toggle('is-active', i === n);
        if (i === n) enlaces[i].setAttribute('aria-current', 'true');
        else enlaces[i].removeAttribute('aria-current');
      }
      /* La miniatura activa se trae al centro de la tira MOVIENDO SOLO LA
         TIRA. Con scrollIntoView se movían todos los contenedores de arriba,
         la página incluida: al abrir un proyecto se pintaba el primer plano y
         el visitante aterrizaba 5.400 px más abajo, en mitad del visor, en vez
         de en la portada del proyecto. */
      if (tira && tira.scrollTo) {
        var centro = el.offsetLeft - (tira.clientWidth - el.offsetWidth) / 2;
        tira.scrollTo({ left: Math.max(0, centro), behavior: CON_MOVIMIENTO ? 'smooth' : 'auto' });
      }
    }

    /* Salta al siguiente/anterior SALTÁNDOSE los ocultos por los chips. */
    function mover(paso) {
      var n = indice;
      for (var intentos = 0; intentos < enlaces.length; intentos++) {
        n = (n + paso + enlaces.length) % enlaces.length;
        if (visible(enlaces[n])) { pintar(n, true); return; }
      }
    }

    var bind = function (el, idx) {
      el.addEventListener('click', function (ev) {
        ev.preventDefault();
        pintar(idx, true);
      });
    };
    for (var i = 0; i < enlaces.length; i++) bind(enlaces[i], i);

    if (prev) prev.addEventListener('click', function () { mover(-1); });
    if (next) next.addEventListener('click', function () { mover(1); });
    if (zoom) {
      zoom.addEventListener('click', function () {
        /* El lightbox global escucha clics en [data-full]. */
        img.click();
      });
    }

    /* Gancho para los chips: al filtrar, saltar al primero que quedó visible. */
    tira.__visorPrimero = function () {
      if (visible(enlaces[indice])) return;
      for (var i = 0; i < enlaces.length; i++) {
        if (visible(enlaces[i])) { pintar(i, true); return; }
      }
    };

    pintar(0, false);
  }

  /* ---------- Grupos de radios con aspecto de chip ---------- */
  function initRadioChips() {
    var wraps = document.querySelectorAll('#mk-pref, #rc-tipo');
    if (!wraps.length) return;
    function bind(wrap) {
      var labels = wrap.querySelectorAll('label');
      function sync() {
        for (var i = 0; i < labels.length; i++) {
          var input = labels[i].querySelector('input[type="radio"]');
          if (!input) continue;
          if (input.checked) labels[i].classList.add('is-active');
          else labels[i].classList.remove('is-active');
        }
      }
      wrap.addEventListener('change', sync);
      sync();
    }
    for (var i = 0; i < wraps.length; i++) bind(wraps[i]);
  }

  /* ---------- Menú de móvil ---------- */
  function initMenuMovil() {
    var burger = document.getElementById('mo-burger');
    var menu = document.getElementById('mo-menu');
    if (!burger || !menu) return;
    burger.addEventListener('click', function () {
      var abierto = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      burger.setAttribute('aria-label', abierto ? 'Cerrar el menú' : 'Abrir el menú');
    });
    /* Al elegir una sección el panel se cierra solo; si no, tapa el destino. */
    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Abrir el menú');
      });
    }
  }

  /* ---------- Alto real de la barra principal ----------
     El sub-menú del detalle se pega justo debajo del header, y las secciones
     tienen que frenar por debajo de los dos. La altura no es fija (cambia con
     el ancho y con el logo), así que se mide y se publica como variable CSS
     en vez de hardcodear un número que se desincroniza. */
  function initAlturaNav() {
    var nav = document.querySelector('.mo-nav');
    if (!nav) return;
    var sub = document.getElementById('pd-sub');
    var util = document.querySelector('.mo-util');
    var medir = function () {
      var raiz = document.documentElement;
      raiz.style.setProperty('--nav-h', Math.round(nav.getBoundingClientRect().height) + 'px');
      /* En el inicio la cabecera va fija sobre la foto: la barra superior deja
         de ocupar sitio y la nav tiene que colgar justo debajo de ella. */
      raiz.style.setProperty('--util-h', util ? Math.round(util.getBoundingClientRect().height) + 'px' : '0px');
      if (sub) raiz.style.setProperty('--sub-h', Math.round(sub.getBoundingClientRect().height) + 'px');
    };
    medir();
    window.addEventListener('resize', medir);
    /* Las fuentes de marca cargan después y cambian el alto del logo. */
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(medir);
    }
  }

  /* ---------- Sub-menú de proyecto: marca la sección visible ----------
     Sin IntersectionObserver el menú sigue funcionando: son anclas normales,
     solo que ninguna queda resaltada. */
  function initSubMenu() {
    var barra = document.getElementById('pd-sub');
    if (!barra || typeof IntersectionObserver === 'undefined') return;
    var links = barra.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    var porId = {};
    var secciones = [];
    for (var i = 0; i < links.length; i++) {
      var id = links[i].getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (!sec) continue;
      porId[id] = links[i];
      secciones.push(sec);
    }
    if (!secciones.length) return;

    var visibles = {};
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        visibles[entries[j].target.id] = entries[j].isIntersecting;
      }
      /* Gana la primera sección visible en orden de documento: al hacer
         scroll rápido puede haber dos cruzando el umbral a la vez. */
      var activa = null;
      for (var k = 0; k < secciones.length; k++) {
        if (visibles[secciones[k].id]) { activa = secciones[k].id; break; }
      }
      for (var id2 in porId) {
        if (Object.prototype.hasOwnProperty.call(porId, id2)) {
          porId[id2].classList.toggle('is-active', id2 === activa);
        }
      }
    }, {
      /* El borde superior del observador arranca por debajo de las dos barras
         pegajosas: si no, una sección se marca activa mientras todavía está
         tapada por el header. */
      rootMargin: '-' + (barra.getBoundingClientRect().bottom + 8) + 'px 0px -55% 0px',
      threshold: 0
    });

    for (var m = 0; m < secciones.length; m++) io.observe(secciones[m]);
  }

  function init() {
    initNavScrolled();
    initAlturaNav();
    initMenuMovil();
    initSubMenu();
    initHeroSlider();
    initLaunch();
    initProjectFilters();
    initChipFilter();
    initCarrusel();
    initVisorPlanos();
    initRadioChips();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
