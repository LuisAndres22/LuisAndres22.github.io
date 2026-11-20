/* =============================================================
   motion.js — capa de movimiento R&R Inmobiliaria
   ES2017 estricto. Solo actúa bajo html.has-motion (snippet del
   <head>: respeta prefers-reduced-motion). Sin JS el contenido es
   visible por defecto: el CSS solo oculta bajo html.has-motion
   Y con [data-rv], atributo que pone ESTE script.
   ============================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  if ((' ' + root.className + ' ').indexOf(' has-motion ') === -1) return;

  /* ---------- Entrada de la página (data-entra) ----------
     Lo que se ve al abrir: la cabecera funde, la portada se acerca y la
     tipografía va subiendo por orden. El atributo viene puesto del <head>
     (antes del primer pintado); aquí se reproduce y se retira. */
  var ENTRADA = [
    '.mo-util', '.mo-nav',
    '.mh-slide.is-active .mh-slide-eyebrow',
    '.mh-slide.is-active .mh-slide-name',
    '.mh-slide.is-active .mh-slide-tag',
    '.mh-slide.is-active .mh-slide-dir',
    '.mh-slide.is-active .mh-slide-actions',
    '.mh-slider-ui', '.mh-slider-scroll',
    '.qs-hero .crumb', '.qs-hero h1', '.qs-hero .lead',
    '.mo-page-head .ix', '.mo-page-head .h-copy',
    '.mc-hero-inner > *', '.mk-hero-panel > *'
  ];

  /* ---------- Reveal on scroll (data-rv) ---------- */
  var REVEAL_SELECTORS = [
    '.mo-section-head', '.mo-card', '.mc-gallery .item',
    '.mo-page-head .h-copy', '.mh-proyectos-head',
    '.mk-form', '.mk-hero-panel .d', '.mh-cta .left', '.mh-cta .right', '.mo-mapa',
    '.qs-tray-lista li', '.qs-pilares-grid article',
    '.qs-valores-grid li', '.qs-grupo-grid article', '.qs-avales',
    '.qs-tray-disco-pie',
    '.pd-ficha-row', '.pd-high-row', '.pd-doc > div', '.pd-info-l', '.pd-info-r',
    '.pd-barra-datos > div', '.pd-visor-ficha', '.pd-ubicacion-txt',
    '.mp-tray-item', '.mc-cta-inner', '.rc-card', '.mo-footer-col'
  ];

  /* ---------- Titulares que suben desde su propia caja ----------
     Solo los que aparecen al hacer scroll: los de la entrada ya tienen su
     propio movimiento y encadenar los dos se pisa. */
  var TITULOS = [
    '.mo-section-head h2', '.mh-proyectos-head h2', '.mh-cta h2'
  ];

  function revealCleanup(el) {
    el.removeAttribute('data-rv');
    el.classList.remove('is-in');
    el.style.transitionDelay = '';
  }

  function revealIn(el) {
    var done = false;
    var delay = parseFloat(el.style.transitionDelay);
    if (!isFinite(delay)) delay = 0;
    var onEnd = function (ev) {
      if (ev.target !== el) return;
      finish();
    };
    var finish = function () {
      if (done) return;
      done = true;
      el.removeEventListener('transitionend', onEnd);
      /* TRAMPA 1 del contrato: retirar data-rv + is-in + delay inline,
         si no, el transform pisa los :hover y el filtro .is-hidden. */
      revealCleanup(el);
    };
    el.addEventListener('transitionend', onEnd);
    el.classList.add('is-in');
    window.setTimeout(finish, 900 + delay);
  }

  function setupReveal() {
    if (typeof IntersectionObserver === 'undefined') return;
    var todos = document.querySelectorAll(REVEAL_SELECTORS.join(', '));
    if (!todos.length) return;

    /* Lo que ya entra con la secuencia de apertura no se revela otra vez:
       los dos efectos mueven el mismo transform y se pisan. */
    var els = [];
    for (var n = 0; n < todos.length; n++) {
      if (todos[n].classList.contains('entra')) continue;
      els.push(todos[n]);
    }
    if (!els.length) return;

    /* Delay escalonado por grupo de hermanos (máx 280ms) */
    var parents = [];
    var counters = [];
    var i, el, p, idx, delay;
    for (i = 0; i < els.length; i++) {
      el = els[i];
      p = el.parentNode;
      idx = parents.indexOf(p);
      if (idx === -1) { parents.push(p); counters.push(0); idx = parents.length - 1; }
      delay = Math.min(counters[idx] * 70, 280);
      counters[idx]++;
      el.setAttribute('data-rv', '');
      if (delay > 0) el.style.transitionDelay = delay + 'ms';
    }

    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        var entry = entries[j];
        /* Revela también lo que quedó por ENCIMA del viewport (saltos con
           ancla, End, restauración de scroll): si no, queda invisible. */
        var passed = entry.boundingClientRect && entry.boundingClientRect.bottom < 0;
        if (!entry.isIntersecting && !passed) continue;
        var target = entry.target;
        io.unobserve(target);
        revealIn(target);
      }
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

    for (i = 0; i < els.length; i++) io.observe(els[i]);
  }

  /* ---------- Contadores del hero ([data-count]) ---------- */
  function animateCounter(el) {
    /* Anima solo el primer nodo de texto con prefijo numérico;
       conserva sufijos y markup (<em> etc). */
    var textNode = null;
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && /\d/.test(n.nodeValue)) { textNode = n; break; }
    }
    if (!textNode) return;
    var raw = textNode.nodeValue;
    var m = raw.match(/^(\s*)(\d+)([\s\S]*)$/);
    if (!m) return;
    var lead = m[1];
    var target = parseInt(m[2], 10);
    var rest = m[3];
    var width = m[2].length;
    if (!isFinite(target) || target <= 0) return;

    var dur = 1200;
    var start = null;
    var frame = function (ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3); /* easeOutCubic */
      var val = Math.round(target * eased);
      textNode.nodeValue = lead + String(val).padStart(width, '0') + rest;
      if (t < 1) window.requestAnimationFrame(frame);
      else textNode.nodeValue = raw;
    };
    textNode.nodeValue = lead + String(0).padStart(width, '0') + rest;
    window.requestAnimationFrame(frame);
  }

  /* Las cifras de trayectoria viven a media página, no en el primer
     viewport: se cuentan cuando entran en pantalla, una sola vez. */
  function setupCounters() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;
    if (typeof IntersectionObserver === 'undefined') {
      for (var i = 0; i < nodes.length; i++) animateCounter(nodes[i]);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (!entries[j].isIntersecting) continue;
        io.unobserve(entries[j].target);
        animateCounter(entries[j].target);
      }
    }, { threshold: 0.4 });
    for (var k = 0; k < nodes.length; k++) io.observe(nodes[k]);
  }

  /* ---------- Trayectoria: el hexágono se traza al entrar en pantalla ----------
     Un punto sale del vértice de arriba, recorre el hexágono dejando la línea
     detrás, el trazo interior lo acompaña en sentido contrario y al volver a
     casa suelta una onda. Mismo trato que el reveal: el atributo lo pone (y lo
     quita) este script, así el CSS nunca deja nada escondido cuando no hay JS.
     El fotograma final coincide con el estado de reposo. */
  function setupHexDraw() {
    var nodos = document.querySelectorAll('[data-hex]');
    if (!nodos.length || typeof IntersectionObserver === 'undefined') return;
    var i;
    for (i = 0; i < nodos.length; i++) nodos[i].setAttribute('data-hex-anim', '');

    var limpiar = function (el) {
      return function () {
        /* TRAMPA 1 del contrato: al terminar, fuera el atributo y la clase.
           El estado final de la animación es idéntico al de reposo, así que
           el cambio no se ve. */
        el.removeAttribute('data-hex-anim');
        el.classList.remove('is-drawn');
      };
    };

    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        var entry = entries[j];
        /* También lo que quedó por encima del viewport (anclas, End). */
        var passed = entry.boundingClientRect && entry.boundingClientRect.bottom < 0;
        if (!entry.isIntersecting && !passed) continue;
        io.unobserve(entry.target);
        entry.target.classList.add('is-drawn');
        /* La onda termina a los 2400ms; se limpia justo después. */
        window.setTimeout(limpiar(entry.target), 2600);
      }
    }, { threshold: 0.3, rootMargin: '0px 0px -8% 0px' });

    for (i = 0; i < nodos.length; i++) io.observe(nodos[i]);
  }

  /* ---------- Nav esconder/mostrar + hilo de progreso ---------- */
  function setupScrollUI() {
    var nav = document.querySelector('.mo-nav');

    var thread = document.createElement('div');
    thread.id = 'read-thread';
    document.body.appendChild(thread);

    var lastY = window.pageYOffset;
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.pageYOffset;
      var max = root.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.max(0, Math.min(y / max, 1)) * 100 : 0;
      thread.style.width = pct + '%';
      if (nav) {
        var esconder = y > 160 && y > lastY;
        var mostrar = y < lastY || y <= 160;
        if (esconder) nav.classList.add('nav-hidden');
        else if (mostrar) nav.classList.remove('nav-hidden');
        /* En el inicio la barra superior también va fija: sin esta marca en
           el <body> se quedaba flotando sola cuando la cabecera se retiraba
           (no hay selector de hermano anterior en CSS). */
        if (esconder) document.body.classList.add('nav-hidden');
        else if (mostrar) document.body.classList.remove('nav-hidden');
      }
      lastY = y;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ---------- Lightbox (galería [data-full]) ---------- */
  function setupLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var img = lb.querySelector('.lb-img');
    var countEl = lb.querySelector('.lb-count');
    var btnPrev = lb.querySelector('.lb-prev');
    var btnNext = lb.querySelector('.lb-next');
    var btnClose = lb.querySelector('.lb-close');
    if (!img) return;

    var group = [];
    var index = 0;

    function collect(trigger) {
      /* El grupo se limita a la SECCIÓN del elemento pulsado: en el detalle
         conviven el carrusel de áreas comunes, la galería y el visor de
         planos, y navegar con las flechas entre los tres es desconcertante.
         Solo elementos VISIBLES: los chips ocultan con .is-hidden
         (display:none → offsetParent null) y esos no deben navegarse. */
      group = [];
      var visible = [];
      var ambito = (trigger && trigger.closest) ? trigger.closest('section') : null;
      var nodes = (ambito || document).querySelectorAll('[data-full]');
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].offsetParent === null) continue;
        visible.push(nodes[i]);
        group.push(nodes[i].getAttribute('data-full'));
      }
      return visible;
    }

    function show(i) {
      if (!group.length) return;
      index = ((i % group.length) + group.length) % group.length;
      img.setAttribute('src', group[index]);
      if (countEl) countEl.textContent = (index + 1) + ' / ' + group.length;
    }

    function open(i) {
      show(i);
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lb-open');
    }

    function close() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lb-open');
    }

    document.addEventListener('click', function (ev) {
      var t = ev.target;
      var trigger = (t && t.closest) ? t.closest('[data-full]') : null;
      if (!trigger) return;
      ev.preventDefault();
      var nodes = collect(trigger);
      var at = 0;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] === trigger) { at = i; break; }
      }
      open(at);
    });

    if (btnPrev) btnPrev.addEventListener('click', function () { show(index - 1); });
    if (btnNext) btnNext.addEventListener('click', function () { show(index + 1); });
    if (btnClose) btnClose.addEventListener('click', close);
    lb.addEventListener('click', function (ev) {
      if (ev.target === lb) close();
    });

    document.addEventListener('keydown', function (ev) {
      if (!lb.classList.contains('is-open')) return;
      if (ev.key === 'Escape') close();
      else if (ev.key === 'ArrowLeft') show(index - 1);
      else if (ev.key === 'ArrowRight') show(index + 1);
    });
  }

  /* ---------- Entrada de la página ----------
     El atributo data-entra ya viene del <head>: si lo pusiéramos aquí se
     vería el contenido aparecer y esconderse. Este script solo reproduce la
     secuencia y limpia; el <head> deja además un relevo por si no llega. */
  function setupEntrada() {
    if (!root.hasAttribute('data-entra')) return [];

    var i, j;
    var cabecera = document.querySelectorAll('.mo-util, .mo-nav');
    for (i = 0; i < cabecera.length; i++) cabecera[i].classList.add('entra-h');

    var els = [];
    for (i = 0; i < ENTRADA.length; i++) {
      var nodos = document.querySelectorAll(ENTRADA[i]);
      for (j = 0; j < nodos.length; j++) {
        if (nodos[j].classList.contains('mo-util')) continue;
        if (nodos[j].classList.contains('mo-nav')) continue;
        if (els.indexOf(nodos[j]) === -1) els.push(nodos[j]);
      }
    }
    /* El orden de aparición lo manda el documento, no el de la lista. */
    els.sort(function (a, b) {
      var pos = a.compareDocumentPosition(b);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });

    var ultimo = 0;
    for (i = 0; i < els.length; i++) {
      els[i].classList.add('entra');
      var d = 200 + Math.min(i * 95, 760);
      els[i].style.setProperty('--d', d + 'ms');
      if (d > ultimo) ultimo = d;
    }

    var limpiar = function () {
      /* TRAMPA 1 del contrato: fuera el atributo, las clases y el delay
         inline. El estado final es el de reposo, así que no se ve el cambio;
         si se quedaran puestos, el transform pisaría los :hover. */
      root.removeAttribute('data-entra');
      root.classList.remove('entra-go');
      for (var k = 0; k < els.length; k++) {
        els[k].classList.remove('entra');
        els[k].style.removeProperty('--d');
      }
      for (var m = 0; m < cabecera.length; m++) cabecera[m].classList.remove('entra-h');
    };

    /* Dos fotogramas de margen: el estado inicial tiene que quedar pintado
       antes de encender las transiciones, si no el navegador las agrupa y
       no se ve nada moverse. */
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        root.classList.add('entra-go');
        /* El acercamiento de la portada dura 2600ms: cortar antes lo dejaría
           a medio camino y terminaría con la transición lenta del carrusel. */
        window.setTimeout(limpiar, Math.max(ultimo + 1200, 2900));
      });
    });

    return els;
  }

  /* ---------- Titulares: la línea sube desde debajo de su caja ---------- */
  function subirTitulo(h) {
    h.classList.add('is-up');
    window.setTimeout(function () {
      h.removeAttribute('data-ln');
      h.classList.remove('is-up');
      var ln = h.firstChild;
      if (!ln || ln.nodeType !== 1 || ln.className !== 'ln') return;
      /* Se deshace el envoltorio: el titular vuelve a ser el del HTML. */
      while (ln.firstChild) h.insertBefore(ln.firstChild, ln);
      h.removeChild(ln);
    }, 1500);
  }

  function setupTitulos() {
    if (typeof IntersectionObserver === 'undefined') return;
    var els = document.querySelectorAll(TITULOS.join(', '));
    if (!els.length) return;

    var listos = [];
    var i;
    for (i = 0; i < els.length; i++) {
      var h = els[i];
      if (h.closest && h.closest('.entra')) continue;
      if (h.querySelector('.ln')) continue;
      var ln = document.createElement('span');
      ln.className = 'ln';
      while (h.firstChild) ln.appendChild(h.firstChild);
      h.appendChild(ln);
      h.setAttribute('data-ln', '');
      listos.push(h);
    }
    if (!listos.length) return;

    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        var entry = entries[j];
        /* También lo que quedó por encima del viewport (anclas, End). */
        var passed = entry.boundingClientRect && entry.boundingClientRect.bottom < 0;
        if (!entry.isIntersecting && !passed) continue;
        io.unobserve(entry.target);
        subirTitulo(entry.target);
      }
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });

    for (i = 0; i < listos.length; i++) io.observe(listos[i]);
  }

  function init() {
    setupEntrada();
    setupReveal();
    setupTitulos();
    setupCounters();
    setupHexDraw();
    setupScrollUI();
    setupLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
