/* =========================================================================
   CHARME COLOR — Choreografie
   Scroll ist hier keine Seitennavigation, sondern eine Zeitleiste.
   Ein Motion-System für alles: GSAP + ScrollTrigger + SplitText,
   Lenis nur für die Trägheit des Scrollens selbst.

   Regeln, die hier gelten:
   - Nur transform, opacity und clip-path werden animiert (kein Layout).
   - Jede Bewegung hat eine Richtung: Licht und Blick kommen von oben links.
   - Wege bleiben kurz. Was weit fliegt, wirkt billig.
   - Bei prefers-reduced-motion steht alles sofort da — ohne Ausnahme.
   - Fällt GSAP aus, wird die Seite trotzdem vollständig sichtbar.
   ========================================================================= */
(function () {
  'use strict';

  var reveals = document.querySelectorAll('.reveal');

  function showEverything() {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
    document.documentElement.classList.add('motion-off');
  }

  // Notausgang: ohne GSAP keine unsichtbare Seite.
  if (!window.gsap || !window.ScrollTrigger) { showEverything(); return; }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { showEverything(); return; }

  /* ------------------------------------------------------------------ *
   * Adaptive Qualität
   * Schwache Geräte bekommen dieselbe Seite, nur ohne die Schichten,
   * die am meisten kosten. Das Erlebnis wird reduziert, nie entfernt.
   * Zusätzlich misst die Seite die ersten Sekunden mit: bricht die
   * Bildrate ein, schaltet sie selbst herunter.
   * ------------------------------------------------------------------ */
  var root = document.documentElement;
  var weak = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
             (navigator.deviceMemory && navigator.deviceMemory <= 4);
  if (weak) root.classList.add('lite');

  if (!weak) {
    var samples = 0, slow = 0, prev = performance.now();
    var watch = function (t) {
      var d = t - prev; prev = t;
      if (d > 34) slow++;
      if (++samples < 180) requestAnimationFrame(watch);
      else if (slow / samples > .5) root.classList.add('lite');
    };
    requestAnimationFrame(watch);
  }

  /* ------------------------------------------------------------------ *
   * Lenis — Trägheit, nicht Schwerkraft.
   * Werte bewusst zurückhaltend: Scrollen soll sich schwerer anfühlen,
   * nicht rutschig. Auf Touch bleibt das native Scrollen unangetastet.
   * ------------------------------------------------------------------ */
  var lenis = null;
  var wantsSmooth = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  function withLenis(done) {
    if (!wantsSmooth) return;                 // Touch behält natives Scrollen
    if (window.Lenis) return done();
    var tag = document.createElement('script');
    tag.src = 'assets/js/vendor/lenis.min.js';
    tag.onload = function () { if (window.Lenis) done(); };
    document.head.appendChild(tag);
  }

  withLenis(function () {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: .9, touchMultiplier: 1.4 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Ankerlinks müssen weiter funktionieren
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -88, duration: 1.2 });
      });
    });

    // Das Laufband reagiert erst mit, wenn Lenis wirklich da ist
    var track = document.querySelector('.marquee__track');
    if (track) {
      var skew = gsap.quickTo(track, 'skewX', { duration: .5, ease: 'power3.out' });
      var shift = gsap.quickTo(track, 'x', { duration: .6, ease: 'power3.out' });
      lenis.on('scroll', function (e) {
        var v = gsap.utils.clamp(-6, 6, e.velocity * .12);
        skew(v * .5);
        shift(v * 6);
      });
    }
  });

  /* ------------------------------------------------------------------ *
   * Werkzeug: Zeilen maskiert aufsteigen lassen (Filmtitel-Geste)
   * ------------------------------------------------------------------ */
  function lines(el) {
    if (!window.SplitText || !el) return null;
    return SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, linesClass: 'line' });
  }

  var EASE = 'power3.out';

  // Der Anti-Flimmer-Schleier wird abgenommen — ab hier steuert GSAP
  // die Sichtbarkeit, nicht mehr das Stylesheet.
  gsap.set(reveals, { opacity: 1 });

  /* ================================================================== *
   * SZENE 1 — Eröffnung
   * Reihenfolge erzählt die Hierarchie: Marke, Ort, Versprechen,
   * Erklärung, Handlung. Das Bild fährt als letzter Schnitt herein.
   * ================================================================== */
  var heroLogo = document.querySelector('.hero__logo-wrap');
  var heroH1 = document.querySelector('.hero h1');
  var heroFig = document.querySelector('.hero__figure');
  var splitH1 = lines(heroH1);

  gsap.set('.hero__text .eyebrow, .hero .lead, .hero__cta, .hero .micro', { opacity: 0, y: 16 });
  if (heroLogo) gsap.set(heroLogo, { opacity: 0, y: 22, scale: .985 });
  if (splitH1) gsap.set(splitH1.lines, { yPercent: 115 });
  if (heroFig) gsap.set(heroFig, { opacity: 0, scale: 1.06, clipPath: 'inset(0% 0% 100% 0%)' });

  // Die Sequenz ist bewusst kurz gehalten: jede Zehntelsekunde, die der
  // Titel später steht, verschlechtert den Ladewert messbar. Gehalten
  // wird nur, was die Reihenfolge erzählt — Marke, Versprechen, Bild.
  var open = gsap.timeline({ defaults: { ease: EASE }, delay: .05 });
  if (heroLogo) open.to(heroLogo, { opacity: 1, y: 0, scale: 1, duration: .8 });
  open.to('.hero__text .eyebrow', { opacity: 1, y: 0, duration: .5 }, '-=.5');
  if (splitH1) open.to(splitH1.lines, { yPercent: 0, duration: .8, stagger: .07 }, '-=.42');
  open.to('.hero .lead', { opacity: 1, y: 0, duration: .6 }, '-=.5')
      .to('.hero__cta', { opacity: 1, y: 0, duration: .55 }, '-=.4')
      .to('.hero .micro', { opacity: 1, y: 0, duration: .5 }, '-=.38');
  if (heroFig) {
    open.to(heroFig, {
      opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.15, ease: 'power2.out'
    }, .2);
  }

  /* ================================================================== *
   * SZENE 2 — Die Kamera fährt weg
   * Text und Bild laufen beim Scrollen unterschiedlich schnell:
   * daraus entsteht Tiefe, ohne dass etwas "parallaxt".
   * ================================================================== */
  var mm = gsap.matchMedia();

  mm.add('(min-width: 52rem)', function () {
    gsap.to('.hero__text', {
      yPercent: -14, opacity: .35, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    });
    // Kamerafahrt: das Bild sinkt und fährt zugleich sanft heran.
    // Push-in und Parallax aus einer Hand, nur beim Scrollen aktiv.
    gsap.to('.hero__figure', {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    });
    gsap.fromTo('.hero__figure > img', { scale: 1 }, {
      scale: 1.07, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 }
    });
  });

  // Dauerläufer im Hero anhalten, sobald er aus dem Bild ist
  ScrollTrigger.create({
    trigger: '.hero', start: 'bottom top',
    onEnter: function () { document.documentElement.classList.add('hero-out'); },
    onLeaveBack: function () { document.documentElement.classList.remove('hero-out'); }
  });

  /* ================================================================== *
   * SZENE 3 — Überschriften
   * Jede Sektion beginnt mit demselben Schnitt: Zeilen steigen unter
   * der Kante hervor. Wiederholung schafft Rhythmus.
   * ================================================================== */
  document.querySelectorAll('.sec__head h2, .about__text h2, .book h2').forEach(function (h2) {
    var sp = lines(h2);
    if (!sp) return;
    gsap.set(sp.lines, { yPercent: 110 });
    gsap.to(sp.lines, {
      yPercent: 0, duration: 1, ease: EASE, stagger: .08,
      scrollTrigger: { trigger: h2, start: 'top 88%' }
    });
  });

  /* ================================================================== *
   * SZENE 4 — Inhalte treten ein
   * Kurze Wege, leichter Versatz, nie mehr als vier Elemente gestaffelt.
   * ================================================================== */
  function enter(selector, vars) {
    document.querySelectorAll(selector).forEach(function (el) {
      var to = Object.assign({
        opacity: 1, y: 0, duration: .9, ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      }, vars || {});
      gsap.fromTo(el, { opacity: 0, y: to.y === 0 ? 24 : to.y }, to);
    });
  }

  enter('.sec__head .kicker, .sec__head .sec__lead, .about__text > p, .book .sec__lead');

  document.querySelectorAll('.svc__group').forEach(function (group) {
    gsap.fromTo(group.querySelectorAll('h3, li'), { opacity: 0, y: 18 }, {
      opacity: 1, y: 0, duration: .7, ease: EASE, stagger: .06,
      scrollTrigger: { trigger: group, start: 'top 85%' }
    });
  });

  document.querySelectorAll('.steps li').forEach(function (li, i) {
    var tl = gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 85%' } });
    tl.fromTo(li, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .8, ease: EASE, delay: i * .08 })
      .fromTo(li.querySelector('.steps__n'), { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: .8, ease: 'power2.out' }, '-=.6');
  });

  enter('.stats > div', { duration: .7 });
  enter('.voices figure', {});
  enter('.visit > div', {});
  enter('.form .field, .form__foot', { duration: .6 });
  enter('.foot__grid > *', { duration: .6 });

  /* ================================================================== *
   * SZENE 5 — Die Abzüge
   * Jedes Bild bewegt sich im Rahmen, nicht mit ihm. Der Rahmen bleibt
   * ruhig, das Motiv wandert — so wirkt der Rahmen wirklich wie Papier.
   * ================================================================== */
  document.querySelectorAll('.grid .shot').forEach(function (fig) {
    gsap.fromTo(fig, { opacity: 0, y: 34 }, {
      opacity: 1, y: 0, duration: 1, ease: EASE,
      scrollTrigger: { trigger: fig, start: 'top 90%' }
    });
    var img = fig.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -5 }, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: .8 }
    });
  });

  var aboutShot = document.querySelector('#about .shot img');
  if (aboutShot) {
    gsap.fromTo(aboutShot, { yPercent: -4 }, {
      yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: .8 }
    });
  }

  /* ================================================================== *
   * SZENE 6 — Blende zwischen den Welten
   * Der Wechsel von Papier zu Tiefe ist ein Schnitt: Die dunkle Sektion
   * kommt aus dem Schwarz hoch, statt einfach da zu sein.
   * ================================================================== */
  document.querySelectorAll('.sec--ink').forEach(function (sec) {
    var fade = document.createElement('span');
    fade.className = 'cut';
    fade.setAttribute('aria-hidden', 'true');
    sec.appendChild(fade);
    gsap.fromTo(fade, { opacity: 1 }, {
      opacity: 0, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 55%', scrub: .5 }
    });
  });

  /* ------------------------------------------------------------------ *
   * Nach dem Laden der Bilder und Schriften neu vermessen
   * ------------------------------------------------------------------ */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
