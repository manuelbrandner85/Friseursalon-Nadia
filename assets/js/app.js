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

  // Fehlt ein Schlüssel, wird null geliefert — der im HTML stehende Text
  // bleibt dann einfach stehen. Sonst sähen Besucher mit einer veralteten
  // Sprachdatei im Zwischenspeicher rohe Schlüssel wie "gb.h2" auf der Seite.
  function t(key) {
    var d = T[lang] || T.it;
    if (d[key] !== undefined) return d[key];
    if (T.it[key] !== undefined) return T.it[key];
    return null;
  }
  function tf(key) {            // mit Rückfall auf den Schlüssel, für Meldungen
    var v = t(key);
    return v === null ? '' : v;
  }

  function applyLang(next, push) {
    lang = LANGS.indexOf(next) > -1 ? next : 'it';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v !== null) el.textContent = v;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        if (p.length !== 2) return;
        var v = t(p[1].trim());
        if (v !== null) el.setAttribute(p[0].trim(), v);
      });
    });

    var title = document.querySelector('title');
    var desc = document.querySelector('meta[name="description"]');
    var tv = t(document.body.dataset.titleKey || 'meta.title');
    if (title && tv) title.textContent = tv;
    var dv = t('meta.desc');
    if (desc && dv) desc.setAttribute('content', dv);

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
    produkteZeichnen();
    preiseFuellen();
    gbZeichnen();
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
    var wa = 'https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(tf('book.greeting'));

    fill('.js-wa', function (a) { a.href = wa; a.target = '_blank'; a.rel = 'noopener'; });
    fill('.js-tel, .js-tel-2', function (a) {
      a.href = 'tel:' + S.phone;
      if (a.classList.contains('js-tel')) a.textContent = S.phoneDisplay;
      if (PLACEHOLDER.test(S.phone)) a.classList.add('todo');
    });
    // Produkt reservieren: dieselbe Logik wie die Terminanfrage —
    // eine fertige Nachricht, nichts wird gespeichert oder abgebucht.
    fill('.js-reserve', function (a) {
      var name = a.dataset.prodName || tf(a.dataset.prod || '');
      var text = tf('shop.greeting') + '\n\n' + name;
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
    fill('.js-vat', function (el) {
      el.textContent = S.vatId;
      el.classList.toggle('todo', PLACEHOLDER.test(S.vatId));
    });
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
      td2.textContent = from && to ? from + ' – ' + to : tf('visit.closed');
      tr.appendChild(td1); tr.appendChild(td2);
      body.appendChild(tr);
    });

    var status = document.querySelector('.js-status');
    if (status) {
      status.textContent = open ? tf('visit.open') : tf('visit.shut');
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
    // Ohne Hero (Impressum, 404) bleibt die Kopfzeile dauerhaft hell —
    // sonst nahm der Scroll-Test ihr die Klasse gleich wieder weg und
    // die Marke blieb unsichtbar.
    if (!hero) { head.classList.add('is-solid'); return; }
    // Das Studio-Band steht über dem Hero — seine Höhe zählt mit.
    var band = document.querySelector('.salone');
    var punkt = (band ? band.offsetHeight : 0) + hero.offsetHeight - 90;
    head.classList.toggle('is-solid', window.scrollY > punkt);
  }
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
  var fForm = document.getElementById('f-form');
  if (send) {
    // Am Formular statt am Knopf: So löst auch die Eingabetaste aus, und
    // der Browser darf beim Ausfüllen helfen. Abgeschickt wird nichts an
    // einen Server — die Anfrage geht über WhatsApp.
    (fForm || send).addEventListener(fForm ? 'submit' : 'click', function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
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
        tf('book.greeting'),
        '',
        tf('book.name') + ': ' + name.value.trim(),
        tf('book.service') + ': ' + svc.options[svc.selectedIndex].textContent
      ];
      if (when) lines.push(tf('book.when') + ': ' + when);
      if (msg) lines.push(tf('book.msg') + ': ' + msg);

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
   * Preise
   * Alle Werte kommen aus preise.js. Fehlt einer, steht dort „auf
   * Anfrage" — das ist eine Aussage. Ein Gedankenstrich sah aus, als
   * wäre die Seite kaputt.
   * ------------------------------------------------------------------ */
  function preiseFuellen() {
    var P = window.PREISE || {};
    function schreiben(el, wert) {
      if (!el) return;
      el.innerHTML = '';
      if (wert === '' || wert === undefined || wert === 'preventivo') {
        var a = document.createElement('i');
        a.textContent = tf(wert === 'preventivo' ? 'svc.quote' : 'svc.ask');
        el.appendChild(a);
        return;
      }
      var von = document.createElement('i');
      von.textContent = tf('svc.from');
      el.appendChild(von);
      el.appendChild(document.createTextNode(' ' + wert + ' €'));
    }
    document.querySelectorAll('.svc__list li').forEach(function (li) {
      var a = li.querySelector('.svc__name');
      if (a) schreiben(li.querySelector('.price'), P['s' + a.dataset.svc]);
    });

  }

  /* ------------------------------------------------------------------ *
   * Produkte
   * Die Karten entstehen aus assets/js/produkte.js. Wer eines ergänzt,
   * fasst nur diese Datei an — kein HTML, keine Sprachdatei.
   * ------------------------------------------------------------------ */
  function produkteZeichnen() {
    var box = document.querySelector('.js-prods');
    if (!box) return;
    var liste = window.PRODUKTE || [];
    box.innerHTML = '';

    liste.forEach(function (prod, i) {
      var t = prod[lang] || prod.it || {};
      var art = document.createElement('article');
      art.className = 'prod reveal';

      var shot = document.createElement('div');
      shot.className = 'prod__shot framed';
      var nr = document.createElement('span');
      nr.className = 'prod__n';
      nr.textContent = String(i + 1).padStart(2, '0');
      shot.appendChild(nr);

      if (prod.video && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Bewegte Vorschau: stumm, ohne Bedienleiste, und sie läuft nur,
        // solange die Karte im Bild ist. Geladen wird erst dann — sonst
        // zahlt jeder Besucher für Videos, die er nie sieht.
        var vid = document.createElement('video');
        // Zwei Fassungen: WebM für Chrome und Firefox, MP4 für Safari und
        // iPhone. Mit nur einer bleibt bei einem Teil der Geräte das
        // Standbild stehen — im Test war genau das der Fall.
        ['webm', 'mp4'].forEach(function (typ) {
          var q = document.createElement('source');
          q.src = 'assets/img/' + prod.video + '.' + typ;
          q.type = 'video/' + typ;
          vid.appendChild(q);
        });
        if (prod.bild) vid.poster = 'assets/img/' + prod.bild;
        vid.muted = true; vid.loop = true; vid.playsInline = true;
        vid.setAttribute('muted', '');
        vid.setAttribute('playsinline', '');
        vid.preload = 'none';
        vid.setAttribute('aria-label', t.name || '');
        vid.width = 800; vid.height = 1000;
        shot.appendChild(vid);
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (eintraege) {
            eintraege.forEach(function (e) {
              if (e.isIntersecting) {
                if (vid.preload !== 'auto') { vid.preload = 'auto'; vid.load(); }
                vid.play().catch(function () {});
              }
              else { vid.pause(); }
            });
          }, { rootMargin: '160px' }).observe(vid);
        }
      } else if (prod.bild) {
        var img = document.createElement('img');
        img.src = 'assets/img/' + prod.bild;
        img.alt = t.name || '';
        img.width = 800; img.height = 1000;
        img.loading = 'lazy'; img.decoding = 'async';
        shot.appendChild(img);
      } else {
        var ph = document.createElement('span');
        ph.className = 'prod__ph';
        ph.textContent = 'Foto';
        shot.appendChild(ph);
      }
      art.appendChild(shot);

      var mk = document.createElement('span');
      mk.className = 'prod__marke';
      mk.textContent = prod.marke || '';
      if (!prod.marke) mk.setAttribute('aria-hidden', 'true');
      art.appendChild(mk);

      var h3 = document.createElement('h3');
      h3.textContent = t.name || '';
      art.appendChild(h3);

      var p = document.createElement('p');
      p.textContent = t.text || '';
      art.appendChild(p);

      var foot = document.createElement('p');
      foot.className = 'prod__foot';
      var preis = document.createElement('span');
      preis.className = 'price';
      if (prod.preis === '' || prod.preis === undefined) {
        var i1 = document.createElement('i'); i1.textContent = tf('svc.ask'); preis.appendChild(i1);
      } else {
        var i2 = document.createElement('i'); i2.textContent = tf('svc.from');
        preis.appendChild(i2);
        preis.appendChild(document.createTextNode(' ' + prod.preis + ' €'));
      }
      var a = document.createElement('a');
      a.className = 'link js-reserve';
      a.href = '#';
      a.dataset.prodName = t.name || '';
      a.textContent = tf('shop.reserve');
      foot.appendChild(preis); foot.appendChild(a);
      art.appendChild(foot);

      box.appendChild(art);
    });
  }

  /* ------------------------------------------------------------------ *
   * Gästebuch
   * Einträge liegen in einem Speicher außerhalb der Seite (Supabase),
   * damit jeder Besucher sie sieht. Ist keiner eingerichtet, läuft das
   * Buch im lokalen Modus: der Eintrag bleibt auf dem Gerät und wird als
   * solcher gekennzeichnet — lieber ehrlich als so tun, als wäre er
   * veröffentlicht.
   * ------------------------------------------------------------------ */
  var GB = (S.guestbook || {});
  var gbOnline = !!(GB.url && GB.key);
  var gbAlle = [];          // alle Einträge, neueste zuerst
  var gbSeite = 0;          // 0 = erste Doppelseite
  var GB_PRO_SEITE = 2;     // ein Eintrag je Buchseite

  function gbLokal() {
    try { return JSON.parse(localStorage.getItem('cc-gb') || '[]'); }
    catch (e) { return []; }
  }
  function gbLokalSpeichern(eintrag) {
    try {
      var a = gbLokal(); a.unshift(eintrag);
      localStorage.setItem('cc-gb', JSON.stringify(a.slice(0, 20)));
    } catch (e) {}
  }

  function gbLaden() {
    var fest = (window.GAESTEBUCH || []).map(function (e) {
      return { name: e.name, text: e.text, date: e.date, service: e.service, lokal: false };
    });
    if (!gbOnline) {
      gbAlle = gbLokal().concat(fest);
      gbZeichnen();
      return;
    }
    fetch(GB.url + '/rest/v1/' + (GB.table || 'guestbook') +
          '?select=name,message,service,created_at&order=created_at.desc&limit=100', {
      headers: { apikey: GB.key, Authorization: 'Bearer ' + GB.key }
    })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        gbAlle = rows.map(function (r) {
          return { name: r.name, text: r.message, service: r.service,
                   date: (r.created_at || '').slice(0, 4), lokal: false };
        }).concat(fest);
        gbZeichnen();
      })
      .catch(function () { gbAlle = fest; gbZeichnen(); });
  }

  function gbEintragEl(e) {
    var fig = document.createElement('figure');
    fig.className = 'gb__item';
    var q = document.createElement('blockquote');
    q.textContent = e.text;
    var fl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    fl.setAttribute('class', 'gb__flourish');
    fl.setAttribute('viewBox', '0 0 220 26');
    fl.setAttribute('aria-hidden', 'true');
    var pth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pth.setAttribute('d', 'M4 18 C 26 4, 52 4, 74 14 S 122 26, 146 14 S 196 2, 216 10');
    fl.appendChild(pth);
    var cap = document.createElement('figcaption');
    cap.textContent = e.name + (e.date ? ' · ' + e.date : '');
    fig.appendChild(q); fig.appendChild(fl); fig.appendChild(cap);
    if (e.service) {
      var sv = document.createElement('span');
      sv.className = 'gb__svc'; sv.textContent = e.service;
      fig.appendChild(sv);
    }
    if (e.lokal) {
      var note = document.createElement('span');
      note.className = 'gb__note'; note.textContent = tf('gb.localNote');
      fig.appendChild(note);
    }
    return fig;
  }

  function gbZeichnen() {
    var L = document.querySelector('.js-gb-page-l');
    var R = document.querySelector('.js-gb-page-r');
    if (!L) return;
    var max = Math.max(1, Math.ceil(gbAlle.length / GB_PRO_SEITE));
    if (gbSeite > max - 1) gbSeite = max - 1;
    var i = gbSeite * GB_PRO_SEITE;
    [[L, gbAlle[i]], [R, gbAlle[i + 1]]].forEach(function (paar) {
      var ziel = paar[0], eintrag = paar[1];
      if (!ziel) return;
      ziel.innerHTML = '';
      if (eintrag) ziel.appendChild(gbEintragEl(eintrag));
      else if (ziel === L && !gbAlle.length) {
        var leer = document.createElement('p');
        leer.className = 'gb__empty'; leer.textContent = tf('gb.empty');
        ziel.appendChild(leer);
      }
    });
    var noL = document.querySelector('.js-gb-no-l'), noR = document.querySelector('.js-gb-no-r');
    if (noL) noL.textContent = i + 1;
    if (noR) noR.textContent = i + 2;
    var cur = document.querySelector('.js-gb-cur'), mx = document.querySelector('.js-gb-max');
    if (cur) cur.textContent = gbSeite + 1;
    if (mx) mx.textContent = max;
    var prev = document.getElementById('gb-prev'), next = document.getElementById('gb-next');
    if (prev) prev.disabled = gbSeite === 0;
    if (next) next.disabled = gbSeite >= max - 1;
    if (window.CC_BOOK && window.CC_BOOK.federn) window.CC_BOOK.federn();
  }

  window.CC_GB = {
    zeichnen: gbZeichnen,
    blaettern: function (richtung) {
      var max = Math.max(1, Math.ceil(gbAlle.length / GB_PRO_SEITE));
      var ziel = gbSeite + richtung;
      if (ziel < 0 || ziel > max - 1) return false;
      gbSeite = ziel;
      return true;
    },
    zurAnfang: function () { gbSeite = 0; }
  };

  var gbSend = document.getElementById('gb-send');
  if (gbSend) {
    var gbName = document.getElementById('gb-name');
    var gbMsg = document.getElementById('gb-msg');
    var gbOk = document.getElementById('gb-ok');
    var gbTrap = document.getElementById('gb-web');
    var gbErr = document.getElementById('gb-err');
    var gbThx = document.getElementById('gb-thanks');
    var gbCount = document.querySelector('.js-gb-count');

    if (gbCount) gbMsg.addEventListener('input', function () { gbCount.textContent = gbMsg.value.length; });

    fill('.js-gb-mode', function (el) {
      el.textContent = gbOnline ? '' : tf('gb.localNote');
    });

    function gbPruefen() {
      var fehler = '';
      if (!gbName.value.trim()) fehler = tf('gb.errName');
      else if (gbMsg.value.trim().length < 10) fehler = tf('gb.errMsg');
      else if (!gbOk.checked) fehler = tf('gb.errOk');
      else if (gbTrap && gbTrap.value) fehler = tf('gb.failed');   // Falle für Bots
      else {
        try {
          var letzte = +(localStorage.getItem('cc-gb-zeit') || 0);
          if (Date.now() - letzte < 10 * 60 * 1000) fehler = tf('gb.tooFast');
        } catch (e) {}
      }
      gbErr.textContent = fehler; gbErr.hidden = !fehler;
      return !fehler;
    }

    function nachSpeichern(eintrag) {
      try { localStorage.setItem('cc-gb-zeit', String(Date.now())); } catch (e) {}
      gbAlle.unshift(eintrag);
      gbSeite = 0;
      gbZeichnen();
      gbThx.textContent = tf('gb.saved') + (gbOnline ? '' : ' ' + tf('gb.localNote'));
      gbThx.hidden = false;
      gbName.value = ''; gbMsg.value = ''; gbOk.checked = false;
      if (gbCount) gbCount.textContent = '0';
      if (window.CC_BOOK) window.CC_BOOK.oeffnen(true);
    }

    var gbForm = document.getElementById('gb-form');
    (gbForm || gbSend).addEventListener(gbForm ? 'submit' : 'click', function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      if (!gbPruefen()) return;
      var eintrag = {
        name: gbName.value.trim(),
        text: gbMsg.value.trim(),
        date: String(new Date().getFullYear()),
        lokal: !gbOnline
      };
      if (!gbOnline) { gbLokalSpeichern(eintrag); nachSpeichern(eintrag); return; }

      gbSend.disabled = true;
      gbThx.textContent = tf('gb.sending'); gbThx.hidden = false;
      fetch(GB.url + '/rest/v1/' + (GB.table || 'guestbook'), {
        method: 'POST',
        headers: { apikey: GB.key, Authorization: 'Bearer ' + GB.key,
                   'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ name: eintrag.name, message: eintrag.text })
      }).then(function (r) {
        gbSend.disabled = false;
        if (!r.ok) { gbErr.textContent = tf('gb.failed'); gbErr.hidden = false; gbThx.hidden = true; return; }
        nachSpeichern(eintrag);
      }).catch(function () {
        gbSend.disabled = false;
        gbErr.textContent = tf('gb.failed'); gbErr.hidden = false; gbThx.hidden = true;
      });
    });
  }

  var gbJump = document.getElementById('gb-jump');
  if (gbJump) {
    gbJump.addEventListener('click', function () {
      var ziel = document.getElementById('gb-write');
      if (ziel) ziel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var f = document.getElementById('gb-name');
      if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 500);
    });
  }

  /* ------------------------------------------------------------------ *
   * Strukturierte Daten für Google (aus config.js)
   * ------------------------------------------------------------------ */
  var MAP = { mo: 'Monday', tu: 'Tuesday', we: 'Wednesday', th: 'Thursday', fr: 'Friday', sa: 'Saturday', su: 'Sunday' };
  var basis = location.origin + location.pathname.replace(/index\.html$/, '');

  // Leistungen aus der Seite lesen, damit die Daten für Google nicht
  // getrennt gepflegt werden müssen und nie auseinanderlaufen.
  var angebote = [];
  document.querySelectorAll('.svc__group').forEach(function (g) {
    var gruppe = g.querySelector('h3');
    g.querySelectorAll('.svc__name').forEach(function (a) {
      angebote.push({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: a.textContent.trim(),
          category: gruppe ? gruppe.textContent.trim() : undefined
        }
      });
    });
  });

  var ld = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': basis + '#salon',
    name: S.name,
    alternateName: S.legalName,
    description: tf('meta.desc'),
    image: basis + 'assets/img/og-bild.jpg',
    logo: basis + 'assets/img/logo-600.png',
    telephone: S.phone,
    email: S.email,
    url: basis,
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    knowsLanguage: ['it', 'de', 'en'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: S.street,
      postalCode: S.zip,
      addressLocality: S.city,
      addressRegion: S.province || undefined,
      addressCountry: S.country
    },
    geo: (S.geo && S.geo.lat) ? {
      '@type': 'GeoCoordinates', latitude: S.geo.lat, longitude: S.geo.lon
    } : undefined,
    areaServed: { '@type': 'City', name: S.city },
    openingHoursSpecification: S.hours.filter(function (r) { return r[1]; }).map(function (r) {
      return { '@type': 'OpeningHoursSpecification',
               dayOfWeek: 'https://schema.org/' + MAP[r[0]], opens: r[1], closes: r[2] };
    }),
    hasOfferCatalog: angebote.length ? {
      '@type': 'OfferCatalog', name: tf('svc.kicker'), itemListElement: angebote
    } : undefined,
    sameAs: [S.instagram, S.facebook, S.tiktok].filter(Boolean)
  };

  var tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify(ld);
  document.head.appendChild(tag);

  /* ------------------------------------------------------------------ */
  applyLang(pickLang(), false);
  gbLaden();
})();
