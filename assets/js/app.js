/* =========================================================================
   CHARME COLOR — Verhalten
   Kein Framework, keine externen Bibliotheken.
   ========================================================================= */
(function () {
  'use strict';

  var S = window.SALON, T = window.I18N, DAYS = window.I18N_DAYS;
  var LANGS = ['it', 'de', 'en'];
  var lang = 'it';

  document.documentElement.classList.add('js');

  /* ------------------------------------------------------------------ *
   * Sprache
   * ------------------------------------------------------------------ */
  function pickLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (LANGS.indexOf(q) > -1) return q;
    try {
      var saved = localStorage.getItem('cc-lang');
      if (LANGS.indexOf(saved) > -1) return saved;
    } catch (e) { /* Privater Modus: egal */ }
    if (S.defaultLang !== 'auto' && LANGS.indexOf(S.defaultLang) > -1) return S.defaultLang;
    var nav = (navigator.language || 'it').slice(0, 2).toLowerCase();
    return LANGS.indexOf(nav) > -1 ? nav : 'it';
  }

  function t(key) {
    var d = T[lang] || T.it;
    return d[key] !== undefined ? d[key] : (T.it[key] !== undefined ? T.it[key] : key);
  }

  function applyLang(next, push) {
    lang = LANGS.indexOf(next) > -1 ? next : 'it';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });

    var title = document.querySelector('title');
    var desc = document.querySelector('meta[name="description"]');
    if (title) title.textContent = t(document.body.dataset.titleKey || 'meta.title');
    if (desc) desc.setAttribute('content', t('meta.desc'));

    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });

    try { localStorage.setItem('cc-lang', lang); } catch (e) {}

    if (push) {
      var url = new URL(location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    }

    renderHours();
    renderGB();
    wireLinks();
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.dataset.lang, true); closeMenu(); });
  });

  /* ------------------------------------------------------------------ *
   * Kontaktdaten aus config.js in die Seite schreiben
   * ------------------------------------------------------------------ */
  var PLACEHOLDER = /0000|Esempio|Città|Citt|charmecolor\.it$|^https:\/\/(instagram|facebook)\.com\/$/i;

  function fill(sel, fn) {
    document.querySelectorAll(sel).forEach(fn);
  }

  function wireLinks() {
    var wa = 'https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(t('book.greeting'));

    fill('.js-wa', function (a) { a.href = wa; a.target = '_blank'; a.rel = 'noopener'; });
    fill('.js-tel, .js-tel-2', function (a) {
      a.href = 'tel:' + S.phone;
      if (a.classList.contains('js-tel')) a.textContent = S.phoneDisplay;
      if (PLACEHOLDER.test(S.phone)) a.classList.add('todo');
    });
    // Produkt reservieren: dieselbe Logik wie die Terminanfrage —
    // eine fertige Nachricht, nichts wird gespeichert oder abgebucht.
    fill('.js-reserve', function (a) {
      var name = t(a.dataset.prod || '');
      var text = t('shop.greeting') + '\n\n' + name;
      a.href = 'https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(text);
      a.target = '_blank'; a.rel = 'noopener';
    });
    fill('.js-mail', function (a) { a.href = 'mailto:' + S.email; a.textContent = S.email; });
    fill('.js-maps', function (a) { a.href = S.mapsUrl; });
    fill('.js-ig', function (a) { a.href = S.instagram; a.target = '_blank'; a.rel = 'noopener'; });
    fill('.js-fb', function (a) { a.href = S.facebook; a.target = '_blank'; a.rel = 'noopener'; });
    fill('.js-tt', function (a) {
      if (S.tiktok) { a.href = S.tiktok; a.hidden = false; a.target = '_blank'; a.rel = 'noopener'; }
    });
    fill('.js-city', function (el) {
      el.textContent = S.city;
      el.classList.toggle('todo', PLACEHOLDER.test(S.city));
    });
    fill('.js-address', function (el) {
      el.innerHTML = '';
      var ort = S.zip + ' ' + S.city + (S.province ? ' (' + S.province + ')' : '');
      [S.legalName, S.street, ort].forEach(function (line, i) {
        if (i) el.appendChild(document.createElement('br'));
        el.appendChild(document.createTextNode(line));
      });
    });
    fill('.js-vat', function (el) { el.textContent = S.vatId; });
    fill('.js-year', function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ------------------------------------------------------------------ *
   * Öffnungszeiten + Status
   * ------------------------------------------------------------------ */
  var ORDER = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']; // Index = Date#getDay()

  function renderHours() {
    var body = document.querySelector('.js-hours');
    if (!body) return;
    var now = new Date();
    var todayKey = ORDER[now.getDay()];
    var mins = now.getHours() * 60 + now.getMinutes();
    var open = false;

    body.innerHTML = '';
    S.hours.forEach(function (row) {
      var key = row[0], from = row[1], to = row[2];
      var tr = document.createElement('tr');
      if (key === todayKey) {
        tr.className = 'is-today';
        if (from && to && mins >= toMin(from) && mins < toMin(to)) open = true;
      }
      var td1 = document.createElement('td');
      td1.textContent = DAYS[lang][key];
      var td2 = document.createElement('td');
      td2.textContent = from && to ? from + ' – ' + to : t('visit.closed');
      tr.appendChild(td1); tr.appendChild(td2);
      body.appendChild(tr);
    });

    var status = document.querySelector('.js-status');
    if (status) {
      status.textContent = open ? t('visit.open') : t('visit.shut');
      status.classList.toggle('is-open', open);
      status.classList.toggle('is-shut', !open);
    }
  }

  function toMin(hhmm) {
    var p = hhmm.split(':');
    return (+p[0]) * 60 + (+p[1]);
  }

  /* ------------------------------------------------------------------ *
   * Kopfzeile: über dem dunklen Hero transparent, danach hell
   * ------------------------------------------------------------------ */
  var head = document.getElementById('head');
  var hero = document.querySelector('.hero');

  function onScroll() {
    if (!head) return;
    var trigger = hero ? hero.offsetHeight - 90 : 0;
    head.classList.toggle('is-solid', window.scrollY > trigger);
  }
  if (!hero && head) head.classList.add('is-solid');
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ------------------------------------------------------------------ *
   * Mobiles Menü
   * ------------------------------------------------------------------ */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');

  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', t('nav.close'));
    document.body.classList.add('no-scroll');
    var first = menu.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  }
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', t('nav.menu'));
    document.body.classList.remove('no-scroll');
    burger.focus({ preventScroll: true });
  }
  if (burger) {
    burger.addEventListener('click', function () {
      menu.hidden ? openMenu() : closeMenu();
    });
  }
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* Reveal und Scroll-Choreografie liegen in motion.js (GSAP).
     Hier bleibt nur das Verhalten, dort nur die Bewegung. */

  /* ------------------------------------------------------------------ *
   * Terminanfrage → WhatsApp (nichts wird gespeichert oder gesendet)
   * ------------------------------------------------------------------ */
  var send = document.getElementById('f-send');
  if (send) {
    send.addEventListener('click', function () {
      var name = document.getElementById('f-name');
      var err = document.getElementById('f-err');
      if (!name.value.trim()) {
        err.hidden = false;
        name.focus();
        return;
      }
      err.hidden = true;

      var svc = document.getElementById('f-svc');
      var when = document.getElementById('f-when').value.trim();
      var msg = document.getElementById('f-msg').value.trim();

      var lines = [
        t('book.greeting'),
        '',
        t('book.name') + ': ' + name.value.trim(),
        t('book.service') + ': ' + svc.options[svc.selectedIndex].textContent
      ];
      if (when) lines.push(t('book.when') + ': ' + when);
      if (msg) lines.push(t('book.msg') + ': ' + msg);

      window.open('https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }

  /* ------------------------------------------------------------------ *
   * Klick auf eine Leistung übernimmt sie ins Terminformular
   * ------------------------------------------------------------------ */
  document.querySelectorAll('.svc__link').forEach(function (a) {
    a.addEventListener('click', function () {
      var svc = document.getElementById('f-svc');
      var idx = parseInt(a.dataset.svc, 10) - 1;
      if (svc && svc.options[idx]) {
        svc.selectedIndex = idx;
        svc.classList.add('is-picked');
        setTimeout(function () { svc.classList.remove('is-picked'); }, 1200);
      }
    });
  });

  /* ------------------------------------------------------------------ *
   * Gästebuch
   * Die Einträge stehen in gaestebuch.js und werden hier gezeichnet.
   * Neue Nachrichten gehen per WhatsApp oder E-Mail an Nadia — nichts
   * wird hier gespeichert und nichts erscheint ungeprüft.
   * ------------------------------------------------------------------ */
  function renderGB() {
    var list = document.querySelector('.js-gb-list');
    if (!list) return;
    var eintraege = window.GAESTEBUCH || [];
    list.innerHTML = '';
    if (!eintraege.length) {
      var leer = document.createElement('p');
      leer.className = 'gb__empty';
      leer.textContent = t('gb.empty');
      list.appendChild(leer);
      return;
    }
    eintraege.forEach(function (e) {
      var fig = document.createElement('figure');
      fig.className = 'gb__item';
      var q = document.createElement('blockquote');
      q.textContent = e.text;
      var cap = document.createElement('figcaption');
      cap.textContent = e.name + (e.date ? ' · ' + e.date : '');
      fig.appendChild(q); fig.appendChild(cap);
      if (e.service) {
        var sv = document.createElement('span');
        sv.className = 'gb__svc';
        sv.textContent = e.service;
        fig.appendChild(sv);
      }
      list.appendChild(fig);
    });
  }

  var gbSend = document.getElementById('gb-send');
  if (gbSend) {
    var gbName = document.getElementById('gb-name');
    var gbMsg = document.getElementById('gb-msg');
    var gbOk = document.getElementById('gb-ok');
    var gbErr = document.getElementById('gb-err');
    var gbThx = document.getElementById('gb-thanks');
    var gbCount = document.querySelector('.js-gb-count');

    if (gbCount) {
      gbMsg.addEventListener('input', function () {
        gbCount.textContent = gbMsg.value.length;
      });
    }

    function gbText() {
      return t('gb.greeting') + '\n\n' +
             t('gb.name') + ': ' + gbName.value.trim() + '\n' +
             t('gb.msg') + ': ' + gbMsg.value.trim() + '\n\n' +
             '[' + t('gb.consent') + ' — OK]';
    }

    function gbPruefen() {
      var fehler = '';
      if (!gbName.value.trim()) fehler = t('gb.errName');
      else if (gbMsg.value.trim().length < 10) fehler = t('gb.errMsg');
      else if (!gbOk.checked) fehler = t('gb.errOk');
      gbErr.textContent = fehler;
      gbErr.hidden = !fehler;
      return !fehler;
    }

    gbSend.addEventListener('click', function () {
      if (!gbPruefen()) return;
      window.open('https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(gbText()),
                  '_blank', 'noopener');
      gbThx.hidden = false;
    });

    fill('.js-gb-mail', function (a) {
      a.addEventListener('click', function (ev) {
        if (!gbPruefen()) { ev.preventDefault(); return; }
        a.href = 'mailto:' + S.email +
                 '?subject=' + encodeURIComponent(t('gb.kicker') + ' — ' + gbName.value.trim()) +
                 '&body=' + encodeURIComponent(gbText());
        gbThx.hidden = false;
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Strukturierte Daten für Google (aus config.js)
   * ------------------------------------------------------------------ */
  var MAP = { mo: 'Monday', tu: 'Tuesday', we: 'Wednesday', th: 'Thursday', fr: 'Friday', sa: 'Saturday', su: 'Sunday' };
  var ld = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: S.name,
    description: t('meta.desc'),
    telephone: S.phone,
    email: S.email,
    url: location.origin + location.pathname,
    address: {
      '@type': 'PostalAddress',
      streetAddress: S.street,
      postalCode: S.zip,
      addressLocality: S.city,
      addressRegion: S.province || undefined,
      addressCountry: S.country
    },
    openingHoursSpecification: S.hours.filter(function (r) { return r[1]; }).map(function (r) {
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'https://schema.org/' + MAP[r[0]],
        opens: r[1], closes: r[2]
      };
    }),
    sameAs: [S.instagram, S.facebook, S.tiktok].filter(Boolean)
  };
  var tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify(ld);
  document.head.appendChild(tag);

  /* ------------------------------------------------------------------ */
  applyLang(pickLang(), false);
})();
