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
  var shotFig = document.querySelector('[data-curtain]');
  if (shotFig) gsap.set(shotFig, { clipPath: 'inset(0% 0% 100% 0%)' });
  if (shot) gsap.set(shot, { scale: 1.1 });

  var tl = gsap.timeline({ defaults: { ease: EASE }, delay: .05 });
  tl.to('.hero__eyebrow', { opacity: 1, y: 0, duration: .6 });
  if (split) tl.to(split.lines, {
    yPercent: 0, duration: .95, stagger: .08,
    onComplete: function () { unmask(split); }
  }, '-=.35');
  if (shotFig) tl.to(shotFig, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power3.inOut' }, '-=.9');
  if (shot) tl.to(shot, { scale: 1, duration: 2.2, ease: 'power2.out' }, '<');
  tl.to('.hero .lead', { opacity: 1, y: 0, duration: .6 }, '-=.75')
    .to('.hero__cta', { opacity: 1, y: 0, duration: .55 }, '-=.45')
    .to('.hero__meta', { opacity: 1, y: 0, duration: .5 }, '-=.4');

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
  enter('.voices figure', 20);
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
  document.querySelectorAll('.plate figure, .about__shot').forEach(function (el) {
    curtain(el);
  });

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
    var nums = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
    var secs = document.querySelectorAll('#services, #method, #about, #gallery, #shop, #voices, #visit, #book');
    var nEl = chap.querySelector('.chapter__n');
    var tEl = chap.querySelector('.chapter__t');
    var current = null;

    function paint(el, i) {
      current = { el: el, i: i };
      var label = el.querySelector('.kicker');
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
