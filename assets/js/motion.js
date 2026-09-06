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
      // Der aufgeklappte Deckel braucht links dieselbe Breite wie das Buch.
      // Deshalb fährt die Kamera weiter zurück und das Buch rückt nach rechts.
      var zoom = w < 1100 ? .54 : (w < 1300 ? .58 : .62);
      var ruck = w < 1100 ? 42 : (w < 1300 ? 38 : 34);

      // Feste Zeitpunkte für alles: Ohne sie hängt sich jede weitere
      // Bewegung ans Ende der Zeitleiste — die Kamerafahrt reichte bis 6,4 s,
      // und der Deckel blieb so lange auf halbem Weg stehen.
      tl.to('.book3d__stage', { scale: zoom, xPercent: ruck, rotateY: 0,
                                duration: 1.4, ease: 'power2.inOut' }, 0)
        .to('.book3d__stage', { scale: 1, xPercent: 0,
                                duration: 1.6, ease: 'power2.inOut' }, 4.2);

      // Der Deckel richtet sich auf und verschwindet dabei. Vollständig
      // umschlagen kann er nicht: Durch die Perspektive wird die Fläche
      // beim Umlegen breiter als das Buch selbst — nachgemessen ragte sie
      // dann bis zu 800 px über den Rand und wurde abgeschnitten. Das
      // Ausblenden ist deshalb fertig, solange er noch schräg steht.
      // Der Deckel schlägt wirklich auf: erst nachgeben, dann durchklappen,
      // bis er links neben dem Buch liegt. Vorher wurde er auf halbem Weg
      // ausgeblendet — das sah aus, als verschwände er einfach.
      var lang = sofort ? 1.2 : 1.9;
      tl.to(cover, { rotateY: -14, duration: .8, ease: 'power1.in' }, 0)
        .to(cover, { rotateY: -104, duration: lang, ease: 'power2.inOut' }, .8)
        .to(cover, { rotateY: -178, duration: .9, ease: 'power2.out' }, .8 + lang)
        // Kein filter auf dem Deckel: Er hebt die 3D-Darstellung auf, und der
        // Browser zeigt dann die Vorderseite gespiegelt statt des
        // Vorsatzpapiers auf der Innenseite.
        .set(cover, { pointerEvents: 'none', zIndex: 0 }, .8 + lang + .9)
        .add(function () { cover.setAttribute('aria-hidden', 'true'); }, .8 + lang + .9);

      // Der Schatten des Deckels wandert über die linke Seite und
      // verschwindet mit ihm — das gibt der Bewegung Gewicht.
      if (schatten) {
        tl.fromTo(schatten, { opacity: 0 }, { opacity: 1, duration: 1.1, ease: 'none' }, .9)
          .to(schatten, { opacity: 0, duration: 1.5, ease: 'power2.out' }, 2.6);
      }

      tl.fromTo('.book3d__spread',
        { filter: 'brightness(.66)' },
        { filter: 'brightness(1)', duration: 2.8, ease: 'power2.out' }, 1);

      tl.add(federn, sofort ? 1.8 : 3.4);
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

    // Aufschlagen, sobald das Buch gut im Bild steht.
    // Bewusst ein Sichtbarkeitsbeobachter statt eines Scroll-Auslösers: Die
    // Seite wächst nach dem Laden noch (Produktkarten, Gästebuch), und ein
    // Auslöser mit fester Position zündet dann an der falschen Stelle oder
    // gar nicht mehr. Der Beobachter misst selbst.
    if ('IntersectionObserver' in window) {
      var buchAuge = new IntersectionObserver(function (eintraege) {
        eintraege.forEach(function (e) {
          if (e.isIntersecting) {
            buchAuge.disconnect();
            gsap.delayedCall(.7, oeffnen);
          }
        });
      }, { threshold: 0.45 });
      buchAuge.observe(buch);
    } else {
      gsap.delayedCall(1.2, oeffnen);
    }

    /* ------------------------------------------------------------ *
     * Blättern von Hand
     * Das Blatt hängt am Zeiger: Winkel und Wölbung folgen der
     * Bewegung, ein Lichtschein wandert über die Rundung, und beim
     * Loslassen entscheidet der Schwung — wie bei einem echten Buch,
     * das man halb umschlägt und wieder zurückfallen lässt.
     * ------------------------------------------------------------ */
    var vorne = leaf.querySelector('.book3d__leaf__f');
    var hinten = leaf.querySelector('.book3d__leaf__b');
    var schatten = document.createElement('span');
    schatten.className = 'book3d__leafshadow';
    schatten.setAttribute('aria-hidden', 'true');
    leaf.parentNode.insertBefore(schatten, leaf);

    var zieht = false, zeigerId = null, startX = 0, spanne = 1;
    var winkel = 0, richtung = 0, getauscht = false;
    var letzteZeit = 0, letzteX = 0, tempo = 0;
    var sanft = matchMedia('(prefers-reduced-motion: reduce)');

    function stellen(w) {
      // w: 0 … 1 — wie weit die Seite umgeschlagen ist
      var grad = richtung > 0 ? -180 * w : -180 * (1 - w);
      // Wölbung: in der Mitte am stärksten, an den Enden flach
      var bauch = Math.sin(w * Math.PI);
      leaf.style.transform =
        'rotateY(' + grad.toFixed(2) + 'deg) skewY(' + (bauch * (richtung > 0 ? -3.2 : 3.2)).toFixed(2) + 'deg)';
      leaf.style.setProperty('--bauch', bauch.toFixed(3));
      // Der Schatten, den das Blatt auf die Seite darunter wirft
      schatten.style.opacity = (bauch * .5).toFixed(3);
      schatten.style.transform = 'scaleX(' + (0.25 + bauch * 0.75).toFixed(3) + ')';
      // Inhalt genau dann tauschen, wenn das Blatt hochkant steht — und
      // zurücktauschen, wenn man es wieder zurückzieht. Die Seitenzahl
      // wandert dabei mit; vorher wurde nur neu gezeichnet, ohne zu zählen.
      if (!getauscht && w > .5) {
        if (window.CC_GB.blaettern(richtung)) { getauscht = true; window.CC_GB.zeichnen(); }
      } else if (getauscht && w <= .5) {
        if (window.CC_GB.blaettern(-richtung)) { getauscht = false; window.CC_GB.zeichnen(); }
      }
    }

    function loesen(w, geschwindigkeit) {
      // Durchziehen, wenn über die Hälfte oder mit Schwung geworfen
      var durch = w > .5 || geschwindigkeit > 0.9;
      var ziel = durch ? 1 : 0;
      var dauer = Math.min(.85, Math.max(.32, Math.abs(ziel - w) / Math.max(.6, geschwindigkeit * 2.4)));
      gsap.to({ v: w }, {
        v: ziel, duration: dauer, ease: durch ? 'power2.out' : 'power2.inOut',
        onUpdate: function () { stellen(this.targets()[0].v); },
        onComplete: function () {
          if (!durch && getauscht) {
            // zurückgefallen: Seitenzahl wieder herstellen
            window.CC_GB.blaettern(-richtung); window.CC_GB.zeichnen(); getauscht = false;
          }
          leaf.style.opacity = '0';
          schatten.style.opacity = '0';
          leaf.style.transform = '';
          blaettert = false;
        }
      });
    }

    var pruefeRichtung = false, startY = 0;

    function greifen(e) {
      if (blaettert || !window.CC_GB) return;
      if (e.target.closest('button, a, input, textarea')) return;
      var box = buch.querySelector('.book3d__spread').getBoundingClientRect();
      var mitte = box.left + box.width / 2;
      richtung = e.clientX >= mitte ? 1 : -1;                  // rechts blättert vor
      if (!window.CC_GB.kann(richtung)) return;                // an der letzten Seite bleibt es liegen
      zieht = true; getauscht = false;
      // Auf Fingergeräten erst nach ein paar Pixeln entscheiden, ob quer
      // gezogen (blättern) oder hoch gewischt wird (scrollen).
      pruefeRichtung = e.pointerType !== 'mouse';
      blaettert = !pruefeRichtung;
      zeigerId = e.pointerId;
      startX = e.clientX; startY = e.clientY;
      letzteX = e.clientX; letzteZeit = performance.now(); tempo = 0;
      spanne = Math.max(120, box.width / 2);
      if (!pruefeRichtung) {
        leaf.style.opacity = '1';
        leaf.style.transformOrigin = 'left center';
        buch.setPointerCapture && buch.setPointerCapture(e.pointerId);
        stellen(0);
      }
    }

    function ziehen(e) {
      if (!zieht || e.pointerId !== zeigerId) return;
      if (pruefeRichtung) {
        var dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx < 10 && dy < 10) return;             // noch nicht entschieden
        if (dy > dx) { zieht = false; return; }     // hoch gewischt: scrollen lassen
        pruefeRichtung = false; blaettert = true;
        leaf.style.opacity = '1';
        leaf.style.transformOrigin = 'left center';
        buch.setPointerCapture && buch.setPointerCapture(e.pointerId);
        startX = e.clientX;                          // ab hier zählt der Weg
        stellen(0);
      }
      e.preventDefault();
      var weg = (startX - e.clientX) * richtung;               // in Blätterrichtung positiv
      winkel = Math.min(1, Math.max(0, weg / spanne));
      var jetzt = performance.now(), dt = jetzt - letzteZeit;
      if (dt > 8) {
        tempo = Math.abs(e.clientX - letzteX) / dt;            // px je ms
        letzteX = e.clientX; letzteZeit = jetzt;
      }
      stellen(winkel);
    }

    function loslassen(e) {
      if (!zieht || (e && e.pointerId !== zeigerId)) return;
      zieht = false;
      if (pruefeRichtung) { pruefeRichtung = false; blaettert = false; return; }
      loesen(winkel, tempo);
    }

    buch.addEventListener('pointerdown', greifen);
    buch.addEventListener('pointermove', ziehen, { passive: false });
    buch.addEventListener('pointerup', loslassen);
    buch.addEventListener('pointercancel', loslassen);
    buch.addEventListener('lostpointercapture', loslassen);

    // Knöpfe und Tasten: dieselbe Bewegung, nur ohne Hand
    function blaettern(r) {
      if (blaettert || !window.CC_GB) return;
      if (sanft.matches) {
        if (window.CC_GB.blaettern(r)) window.CC_GB.zeichnen();
        return;
      }
      if (!window.CC_GB.kann(r)) return;
      richtung = r; getauscht = false; blaettert = true;
      leaf.style.opacity = '1';
      leaf.style.transformOrigin = 'left center';
      stellen(0);
      gsap.to({ v: 0 }, {
        v: 1, duration: .95, ease: 'power2.inOut',
        onUpdate: function () { stellen(this.targets()[0].v); },
        onComplete: function () {
          leaf.style.opacity = '0'; schatten.style.opacity = '0';
          leaf.style.transform = ''; blaettert = false;
        }
      });
    }

    var prev = document.getElementById('gb-prev'), next = document.getElementById('gb-next');
    if (prev) prev.addEventListener('click', function () { blaettern(-1); });
    if (next) next.addEventListener('click', function () { blaettern(1); });
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
    // Der Maßstab bleibt immer über 1: Bei genau 1 deckt das Bild den
    // Rahmen exakt ab, und die gleichzeitige Verschiebung gab unten den
    // dunklen Sektionsgrund frei — als schwarzer Balken sichtbar.
    gsap.fromTo(sImg, { scale: 1.16, yPercent: 3 }, {
      scale: 1.07, yPercent: -3, ease: 'none',
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
      // Für Screenreader und Tastatur: welcher Menüpunkt gerade gilt.
      document.querySelectorAll('.nav a, .menu a').forEach(function (a) {
        var passt = a.getAttribute('href') === '#' + el.id;
        if (passt) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      var label = el.querySelector('.kicker') || el.querySelector('.salone__k');
      nEl.textContent = nums[i] || '';
      // Ohne die Ziffer im Kicker — sonst steht sie doppelt da („IX IXTermin").
      var txt = '';
      if (label) {
        label.childNodes.forEach(function (k) {
          if (k.nodeType === 3) txt += k.textContent;
          else if (k.nodeType === 1 && !k.classList.contains('kicker__n')) txt += k.textContent;
        });
      }
      tEl.textContent = txt.trim();
      chap.hidden = false;
    }

    // Dieselbe Ziffer steht auch am Kapitel selbst — die Kapitelanzeige
    // unten links ist dann kein separates Element, sondern ein Verweis.
    secs.forEach(function (sec, i) {
      var kicker = sec.querySelector('.kicker');
      if (kicker && nums[i] && !kicker.querySelector('.kicker__n')) {
        var n = document.createElement('span');
        n.className = 'kicker__n';
        n.setAttribute('aria-hidden', 'true');
        n.textContent = nums[i];
        kicker.insertBefore(n, kicker.firstChild);
      }
    });

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
