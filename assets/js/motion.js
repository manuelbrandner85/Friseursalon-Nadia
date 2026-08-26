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

  /* ---------------------------------------------------------------- *
   * Eröffnung — nur die Überschrift bewegt sich, alles andere
   * erscheint schlicht. Weniger wäre nichts, mehr wäre zu viel.
   * ---------------------------------------------------------------- */
  var h1 = document.querySelector('.hero h1');
  var split = lines(h1);
  var shot = document.querySelector('.hero__shot img');

  gsap.set('.hero__eyebrow, .hero .lead, .hero__cta, .hero__meta', { opacity: 0, y: 14 });
  if (split) gsap.set(split.lines, { yPercent: 110 });
  if (shot) gsap.set(shot, { opacity: 0 });

  var tl = gsap.timeline({ defaults: { ease: EASE }, delay: .05 });
  tl.to('.hero__eyebrow', { opacity: 1, y: 0, duration: .6 });
  if (split) tl.to(split.lines, { yPercent: 0, duration: .95, stagger: .08 }, '-=.35');
  if (shot) tl.to(shot, { opacity: 1, duration: 1.1, ease: 'power2.out' }, '-=.85');
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

  // Bilder: nur Aufblenden. Ein Bild, das hereinfliegt, wirkt wie Werbung.
  document.querySelectorAll('.plate, .about__shot').forEach(function (el) {
    gsap.fromTo(el, { opacity: 0 }, {
      opacity: 1, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%' }
    });
  });

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
