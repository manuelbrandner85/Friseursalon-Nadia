/* =========================================================================
   CHARME COLOR — Choreografie (Editorial Blanc)
   Bewegung ist hier zurückhaltend: eine Modestrecke blättert man um,
   sie tanzt nicht. Nur zwei Gesten kommen vor —
   Zeilen steigen unter der Kante hervor, Flächen treten leise ein.
   Kein Parallax, kein Skalieren, kein Smooth-Scroll.
   ========================================================================= */
(function () {
  'use strict';

  var reveals = document.querySelectorAll('.reveal');

  function showEverything() {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
    document.documentElement.classList.add('motion-off');
  }

  // Ohne GSAP darf die Seite nicht unsichtbar bleiben.
  if (!window.gsap || !window.ScrollTrigger) { showEverything(); return; }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { showEverything(); return; }

  var EASE = 'power3.out';
  gsap.set(reveals, { opacity: 1 });   // Schleier ab hier nicht mehr nötig

  function lines(el) {
    if (!window.SplitText || !el) return null;
    return SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true });
  }

  /* Die Zeilenmaske ist nur für den Aufstieg da. Bleibt sie stehen,
     schneidet ihr overflow:hidden den Schlagschatten an der Unterkante
     ab — sichtbar als harte Kante quer durch die Schrift. Also wird sie
     entfernt, sobald die Zeile oben ist. */
  function unmask(sp) {
    if (!sp || !sp.lines) return;
    sp.lines.forEach(function (line) {
      if (line.parentNode && line.parentNode !== document.body) {
        line.parentNode.style.overflow = 'visible';
      }
    });
  }

  /* ---------------------------------------------------------------- *
   * Eröffnung — nur die Überschrift bewegt sich, alles andere
   * erscheint schlicht. Weniger wäre nichts, mehr wäre zu viel.
   * ---------------------------------------------------------------- */
  var h1 = document.querySelector('.hero h1');
  var split = lines(h1);
  var shot = document.querySelector('.hero__shot img');

  gsap.set('.hero__eyebrow, .hero .lead, .hero__cta, .hero__meta', { opacity: 0, y: 14 });
  if (split) gsap.set(split.lines, { yPercent: 110 });
  // Der Rahmen steht von Anfang an — nur das Motiv wird freigegeben.
  if (shot) gsap.set(shot, { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.1 });

  var tl = gsap.timeline({ defaults: { ease: EASE }, delay: .15 });
  tl.to('.hero__eyebrow', { opacity: 1, y: 0, duration: .6 });
  if (split) tl.to(split.lines, {
    yPercent: 0, duration: .95, stagger: .08,
    onComplete: function () { unmask(split); }
  }, '-=.35');
  if (shot) tl.to(shot, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power3.inOut' }, '-=.9')
              .to(shot, { scale: 1, duration: 2.2, ease: 'power2.out' }, '<');
  tl.to('.hero .lead', { opacity: 1, y: 0, duration: .6 }, '-=.75')
    .to('.hero__cta', { opacity: 1, y: 0, duration: .55 }, '-=.45')
    .to('.hero__meta', { opacity: 1, y: 0, duration: .5 }, '-=.4');

  /* ---------------------------------------------------------------- *
   * Die Marke tritt auf
   * Sie wird nicht eingeblendet, sondern freigegeben — dieselbe Geste
   * wie bei den Bildern, damit die Seite eine Handschrift hat. Danach
   * läuft einmal ein feiner Lichtschein darüber; er bleibt so schwach,
   * dass er nur beim ersten Blick auffällt.
   * ---------------------------------------------------------------- */
  /* ---------------------------------------------------------------- *
   * Überschriften — dieselbe Geste in jeder Sektion, das gibt Takt.
   * ---------------------------------------------------------------- */
  document.querySelectorAll('.sec__head h2, .about__text h2, .book h2').forEach(function (h2) {
    var sp = lines(h2);
    if (!sp) return;
    gsap.set(sp.lines, { yPercent: 110 });
    gsap.to(sp.lines, {
      yPercent: 0, duration: 1, ease: EASE, stagger: .07,
      onComplete: function () { unmask(sp); },
      scrollTrigger: { trigger: h2, start: 'top 88%' }
    });
  });

  /* ---------------------------------------------------------------- *
   * Inhalte — kurze Wege, kein Versatz nach oben, nur ein Aufblenden
   * mit minimaler Verschiebung. Bilder blenden ohne Bewegung auf.
   * ---------------------------------------------------------------- */
  function enter(selector, y, stagger) {
    document.querySelectorAll(selector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: y === undefined ? 18 : y }, {
        opacity: 1, y: 0, duration: .9, ease: EASE, stagger: stagger || 0,
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });
  }

  enter('.sec__head .kicker, .sec__head .lead, .about__text > p, .book .lead');
  enter('.stats > div', 14, .06);
  enter('.prod', 20, .06);
  enter('.prods__foot', 12);
  /* ---------------------------------------------------------------- *
   * Das Gästebuch schlägt auf
   * Der Einband dreht sich über den Bund nach links weg — mit Perspektive,
   * damit es wie ein Buch wirkt und nicht wie eine wegfliegende Karte.
   * Geblättert wird mit einem eigenen Blatt, dessen Rückseite die neue
   * Seite ist; der Inhalt wechselt genau in dem Moment, in dem es hochkant
   * steht und niemand hineinsehen kann.
   * ---------------------------------------------------------------- */
  var buch = document.getElementById('gb-book');
  if (buch) {
    var cover = document.getElementById('gb-open');
    var leaf = document.getElementById('gb-leaf');
    var offen = false, blaettert = false;

    gsap.set(cover, { transformOrigin: 'left center' });
    gsap.set('.book3d__stage', { transformOrigin: '50% 50%' });

    function oeffnen(sofort) {
      if (offen) return;
      offen = true;

      // Bewusst langsam: gut vier Sekunden, mit einem kurzen Zögern am
      // Anfang — so wie ein schwerer Deckel erst nachgibt und dann fällt.
      var schatten = buch.querySelector('.book3d__deckelschatten');
      var tl = gsap.timeline();

      // Die Kamera fährt beim Öffnen zurück und das Buch rückt nach
      // rechts: so bleibt links Platz für den Deckel. Je schmaler das
      // Fenster, desto weiter zurück.
      var w = window.innerWidth;
      var zoom = w < 1100 ? .72 : (w < 1300 ? .78 : .84);
      var ruck = w < 1100 ? 22 : (w < 1300 ? 18 : 13);

      tl.to('.book3d__stage', { scale: zoom, xPercent: ruck, rotateY: 0,
                                duration: 1.6, ease: 'power2.inOut' }, 0)
        .to('.book3d__stage', { scale: 1, xPercent: 0,
                                duration: 1.8, ease: 'power2.inOut' }, 4.6);

      // Der Deckel richtet sich auf und verschwindet dabei. Vollständig
      // umschlagen kann er nicht: Durch die Perspektive wird die Fläche
      // beim Umlegen breiter als das Buch selbst — nachgemessen ragte sie
      // dann bis zu 800 px über den Rand und wurde abgeschnitten. Das
      // Ausblenden ist deshalb fertig, solange er noch schräg steht.
      tl.to(cover, { rotateY: -14, duration: 1, ease: 'power1.in' }, 0)
        .to(cover, { rotateY: -68, duration: sofort ? 1.4 : 2.3, ease: 'power2.inOut' })
        .to(cover, { opacity: 0, duration: .45, ease: 'power1.out' })
        .to(cover, { rotateY: -92, duration: .8, ease: 'power1.out' }, '<')
        .set(cover, { pointerEvents: 'none' })
        .add(function () { cover.setAttribute('aria-hidden', 'true'); });

      // Der Schatten des Deckels wandert über die linke Seite und
      // verschwindet mit ihm — das gibt der Bewegung Gewicht.
      if (schatten) {
        tl.fromTo(schatten, { opacity: 0 }, { opacity: 1, duration: 1.1, ease: 'none' }, .9)
          .to(schatten, { opacity: 0, duration: 1.5, ease: 'power2.out' }, 2.6);
      }

      tl.fromTo('.book3d__spread',
        { filter: 'brightness(.66)' },
        { filter: 'brightness(1)', duration: 2.8, ease: 'power2.out' }, 1);

      tl.add(federn, sofort ? 1.8 : 3.6);
    }

    // Die Unterschriften auf den sichtbaren Seiten zeichnen sich
    function federn() {
      buch.querySelectorAll('.book3d__page .gb__flourish path').forEach(function (pth) {
        var len = pth.getTotalLength();
        gsap.fromTo(pth, { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', delay: .25 });
      });
    }
    window.CC_BOOK = { oeffnen: oeffnen, federn: federn };

    cover.addEventListener('click', function () { oeffnen(); });

    // Aufschlagen, sobald das Buch gut im Bild steht
    // Erst aufschlagen, wenn das Buch mittig im Bild steht — und mit einer
    // kurzen Pause davor, damit der Blick vorher ankommt.
    ScrollTrigger.create({ trigger: buch, start: 'center 72%', once: true,
      onEnter: function () { gsap.delayedCall(.7, oeffnen); } });

    function blaettern(richtung) {
      if (blaettert || !window.CC_GB) return;
      var breit = window.matchMedia('(min-width: 56rem)').matches;
      if (!breit) { if (window.CC_GB.blaettern(richtung)) { window.CC_GB.zeichnen(); } return; }
      if (!window.CC_GB.blaettern(richtung)) return;
      blaettert = true;
      gsap.set(leaf, { opacity: 1, rotateY: richtung > 0 ? 0 : -180, transformOrigin: 'left center' });
      gsap.to(leaf, {
        rotateY: richtung > 0 ? -180 : 0, duration: .95, ease: 'power2.inOut',
        onUpdate: function () {
          // Inhalt genau dann tauschen, wenn das Blatt hochkant steht
          var r = Math.abs(gsap.getProperty(leaf, 'rotateY'));
          if (!this._getriggert && ((richtung > 0 && r > 90) || (richtung < 0 && r < 90))) {
            this._getriggert = true; window.CC_GB.zeichnen();
          }
        },
        onComplete: function () { gsap.set(leaf, { opacity: 0 }); blaettert = false; }
      });
    }

    var prev = document.getElementById('gb-prev'), next = document.getElementById('gb-next');
    if (prev) prev.addEventListener('click', function () { blaettern(-1); });
    if (next) next.addEventListener('click', function () { blaettern(1); });
    // Pfeiltasten blättern, sobald der Fokus irgendwo im Buch liegt —
    // auf dem Rahmen selbst oder auf einem der Knöpfe darunter.
    buch.addEventListener('keydown', function (e) {
      if (e.target.matches('input, textarea, select')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); blaettern(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); blaettern(1); }
    });
  }

  enter('.gb__invite', 14);
  enter('.gb__form .field, .gb__ok, .gb__form .form__foot', 12, .05);
  enter('.visit > div', 18);
  enter('.form .field, .form__foot', 12, .05);
  enter('.foot__grid > *', 12, .05);

  document.querySelectorAll('.svc__group').forEach(function (group) {
    gsap.fromTo(group.querySelectorAll('h3, li'), { opacity: 0, y: 14 }, {
      opacity: 1, y: 0, duration: .7, ease: EASE, stagger: .05,
      scrollTrigger: { trigger: group, start: 'top 86%' }
    });
  });

  document.querySelectorAll('.steps li').forEach(function (li, i) {
    gsap.fromTo(li, { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: .8, ease: EASE, delay: i * .1,
      scrollTrigger: { trigger: li, start: 'top 86%' }
    });
  });

  /* ---------------------------------------------------------------- *
   * Der Vorhang — die filmische Grundgeste dieser Seite.
   * Das Bild wird nicht eingeblendet, es wird freigegeben: eine Kante
   * fährt hoch, dahinter steht das Motiv schon fertig. Gleichzeitig
   * läuft ein sehr langsamer Push-in, damit der Schnitt Tiefe bekommt.
   * ---------------------------------------------------------------- */
  function curtain(el, delay) {
    var img = el.querySelector('img') || el;
    gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.35, ease: 'power3.inOut',
      delay: delay || 0,
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
    gsap.fromTo(img, { scale: 1.08 }, {
      scale: 1, duration: 1.9, ease: 'power2.out', delay: delay || 0,
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  }
  document.querySelectorAll('.plate img, .about__shot > img').forEach(function (el) {
    curtain(el);
  });

  /* ---------------------------------------------------------------- *
   * Das Breitband des Studios
   * Erst gibt ein Vorhang das Bild frei, dann fährt die Kamera über die
   * ganze Sektion langsam heran — eine einzige, lange Bewegung statt
   * vieler kleiner. Der Ausschnitt wandert dabei leicht nach oben, so
   * bleibt das Logo an der Wand im Bild.
   * ---------------------------------------------------------------- */
  var salone = document.querySelector('.salone__frame');
  if (salone) {
    var sImg = salone.querySelector('img');
    gsap.fromTo(salone, { clipPath: 'inset(0% 0% 100% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power3.inOut',
      scrollTrigger: { trigger: salone, start: 'top 88%' }
    });
    gsap.fromTo(sImg, { scale: 1.14, yPercent: 3 }, {
      scale: 1, yPercent: -3, ease: 'none',
      scrollTrigger: { trigger: '.salone', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
    gsap.fromTo('.salone__cap', { opacity: 0, y: 14 }, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: salone, start: 'top 78%' }
    });
  }

  /* ---------------------------------------------------------------- *
   * Der Schnitt ins Dunkle
   * Die helle Fläche zieht nach oben weg und gibt die Tinte frei.
   * ---------------------------------------------------------------- */
  document.querySelectorAll('.sec--ink').forEach(function (sec) {
    var cut = document.createElement('span');
    cut.className = 'cut';
    cut.setAttribute('aria-hidden', 'true');
    sec.appendChild(cut);
    gsap.fromTo(cut, { scaleY: 1 }, {
      scaleY: 0, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 42%', scrub: .4 }
    });
  });

  /* ---------------------------------------------------------------- *
   * Das Lookbook — die eine große Bewegung der Seite
   * Die Sektion wird festgehalten, der Streifen wandert quer durchs
   * Bild. Nur am Bildschirm: auf dem Handy wäre seitliches Wischen
   * neben vertikalem Scrollen eine Zumutung.
   * ---------------------------------------------------------------- */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 56rem)', function () {
    var box = document.querySelector('[data-lookbook]');
    var track = box && box.querySelector('.lookbook__track');
    if (!track) return;

    var distance = function () { return track.scrollWidth - box.clientWidth; };
    if (distance() <= 0) return;

    gsap.to(track, {
      x: function () { return -distance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: box,
        start: 'center center',
        end: function () { return '+=' + distance(); },
        pin: true,
        scrub: .8,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
  });

  /* ---------------------------------------------------------------- *
   * Zeitstrahl und Kapitelanzeige
   * ---------------------------------------------------------------- */
  var bar = document.querySelector('.progress__bar');
  if (bar) {
    gsap.to(bar, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: .3 }
    });
  }

  var chap = document.querySelector('.chapter');
  if (chap) {
    var nums = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    var secs = document.querySelectorAll('#salone, #services, #method, #about, #gallery, #shop, #voices, #visit, #book');
    var nEl = chap.querySelector('.chapter__n');
    var tEl = chap.querySelector('.chapter__t');
    var current = null;

    function paint(el, i) {
      current = { el: el, i: i };
      var label = el.querySelector('.kicker') || el.querySelector('.salone__k');
      nEl.textContent = nums[i] || '';
      tEl.textContent = label ? label.textContent : '';
      chap.hidden = false;
    }

    secs.forEach(function (sec, i) {
      ScrollTrigger.create({
        trigger: sec, start: 'top 60%', end: 'bottom 40%',
        onEnter: function () { paint(sec, i); },
        onEnterBack: function () { paint(sec, i); },
        onLeaveBack: function () { if (i === 0) chap.hidden = true; }
      });
    });

    // Nach einem Sprachwechsel stimmt die Beschriftung sonst nicht mehr
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () {
        setTimeout(function () { if (current) paint(current.el, current.i); }, 60);
      });
    });
  }

  /* ---------------------------------------------------------------- *
   * Die Karte zeichnet sich
   * Erst legt sich das Straßennetz an, dann fährt der Straßenzug des
   * Salons nach, zuletzt setzt sich der Punkt und die Orientierungs-
   * marken erscheinen. Reihenfolge = Leserichtung einer Wegbeschreibung.
   * ---------------------------------------------------------------- */
  var mapa = document.querySelector('.mapa');
  if (mapa) {
    var roads = mapa.querySelectorAll('.road');
    var via = mapa.querySelectorAll('.via');
    var lms = mapa.querySelectorAll('.lm');
    var here = mapa.querySelector('.here');
    var deco = mapa.querySelector('.deco');

    gsap.set(roads, { opacity: 0 });
    gsap.set(lms, { opacity: 0, y: 6 });
    gsap.set(here, { opacity: 0 });
    gsap.set(deco, { opacity: 0 });

    // Die Zielstraße wird als Strich gezeichnet: Länge messen, Lücke
    // auf volle Länge setzen und den Versatz zurückfahren.
    via.forEach(function (path) {
      var len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    });

    var mtl = gsap.timeline({
      scrollTrigger: { trigger: mapa, start: 'top 78%' }
    });
    mtl.to(roads, { opacity: 1, duration: 1.1, stagger: .12, ease: 'power2.out' })
       .to(via, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, '-=.5')
       .to(here, { opacity: 1, duration: .5 }, '-=.5')
       .to(lms, { opacity: 1, y: 0, duration: .6, stagger: .12 }, '-=.3')
       .to(deco, { opacity: 1, duration: .6 }, '-=.4');

    // Der Punkt schlägt ruhig — zwei Ringe, versetzt, endlos.
    mtl.add(function () {
      gsap.to(mapa.querySelectorAll('.pulse'), {
        attr: { r: 34 }, opacity: 0, duration: 2.6, ease: 'power1.out',
        repeat: -1, stagger: 1.3,
        onStart: function () { gsap.set(mapa.querySelectorAll('.pulse'), { opacity: .45 }); }
      });
    });

    enter('.steps--way li', 14, .1);
  }

  /* ---------------------------------------------------------------- *
   * Klick auf eine Leistung übernimmt sie ins Terminformular
   * ---------------------------------------------------------------- */
  document.querySelectorAll('.svc__name').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = document.getElementById('f-svc');
      var idx = parseInt(a.dataset.svc, 10) - 1;
      if (sel && sel.options[idx]) {
        sel.selectedIndex = idx;
        sel.classList.add('is-picked');
        setTimeout(function () { sel.classList.remove('is-picked'); }, 1400);
      }
    });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
