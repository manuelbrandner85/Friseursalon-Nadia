/* =========================================================================
   CHARME COLOR — Produkte
   -------------------------------------------------------------------------
   Alles, was im Salon zu haben ist. Die Seite baut den Bereich aus dieser
   Liste — es müssen keine HTML-Dateien angefasst werden.

   Ein neues Produkt: den Block kopieren, ausfüllen, mit Komma anhängen.
   Ein Produkt entfernen: Block löschen. Reihenfolge = Reihenfolge hier.

   bild    Dateiname in assets/img/. Leer lassen, solange kein Foto da ist —
           dann erscheint eine ruhige Fläche mit der laufenden Nummer.
           Format 4:5 (z. B. 800 × 1000), sonst bricht die Reihe.
   preis   Zahl (35) → "ab 35 €" · '' → "auf Anfrage"
   marke   optional, erscheint klein über dem Namen
   ========================================================================= */

window.PRODUKTE = [

  {
    video: 'ghd-dryer',
    bild: 'ghd-dryer.webp',
    marke: 'ghd',
    preis: '',
    it: { name: 'Asciugacapelli professionale',
          text: 'Motore professionale, aria calda controllata: asciuga in fretta senza cuocere il capello. Quello che trovi in salone.' },
    de: { name: 'Profi-Föhn',
          text: 'Profimotor mit kontrollierter Hitze: trocknet schnell, ohne das Haar auszubrennen. Der, mit dem im Salon gearbeitet wird.' },
    en: { name: 'Professional dryer',
          text: 'Professional motor with controlled heat: dries fast without cooking the hair. The one used in the salon.' }
  },

  {
    video: 'ghd-speed',
    bild: 'ghd-speed.webp',
    marke: 'ghd',
    preis: '',
    it: { name: 'speed — asciugacapelli',
          text: 'Getto forte e mirato: asciuga in meno tempo, quindi il capello sta meno sotto il calore.' },
    de: { name: 'speed — Föhn',
          text: 'Kräftiger, gerichteter Luftstrom: trocknet in kürzerer Zeit — das Haar steht also weniger lang unter Hitze.' },
    en: { name: 'speed — dryer',
          text: 'Strong, directed airflow: dries in less time, so the hair spends less time under heat.' }
  },

  {
    // Bewegte Vorschau: läuft stumm und nur, solange die Karte im Bild ist.
    // 'bild' ist gleichzeitig das Standbild, das vor dem Laden erscheint.
    video: 'ghd-sculpt',   // ohne Endung: es werden .webm und .mp4 angeboten
    bild: 'ghd-sculpt.webp',
    marke: 'ghd',
    preis: '',
    it: { name: 'Piastra sculpt',
          text: 'Piastra professionale a temperatura costante: liscia, onde e boccoli con lo stesso attrezzo. Quella che uso in salone.' },
    de: { name: 'Glätteisen sculpt',
          text: 'Profigerät mit konstanter Temperatur: glatt, Wellen und Locken mit demselben Gerät. Das, womit ich im Salon arbeite.' },
    en: { name: 'Sculpt styler',
          text: 'Professional styler at a constant temperature: straight, waves and curls with one tool. The one I use in the salon.' }
  },

  {
    video: 'ghd-wand',
    bild: 'ghd-wand.webp',
    marke: 'ghd',
    preis: '',
    it: { name: 'Ferro arricciacapelli',
          text: 'Boccoli morbidi o onde larghe, a temperatura costante: la piega tiene senza seccare il capello.' },
    de: { name: 'Lockenstab',
          text: 'Weiche Locken oder breite Wellen bei konstanter Temperatur: Die Form hält, ohne das Haar auszutrocknen.' },
    en: { name: 'Curling wand',
          text: 'Soft curls or wide waves at a constant temperature: the shape holds without drying the hair out.' }
  },

  {
    video: 'sp-hydrate',
    bild: 'sp-hydrate.webp',
    marke: 'System Professional',
    preis: '',
    it: { name: 'Hydrate Shampoo H1',
          text: 'Deterge in modo delicato e restituisce idratazione: per capelli secchi che si sentono ruvidi al tatto.' },
    de: { name: 'Hydrate Shampoo H1',
          text: 'Reinigt mild und gibt Feuchtigkeit zurück — für trockenes Haar, das sich stumpf anfühlt.' },
    en: { name: 'Hydrate Shampoo H1',
          text: 'Cleanses gently and restores moisture — for dry hair that feels rough to the touch.' }
  },

  {
    video: 'sp-luxeoil',
    bild: 'sp-luxeoil.webp',
    marke: 'System Professional',
    preis: '',
    it: { name: 'LuxeOil Keratin Protect Shampoo',
          text: 'Protegge la cheratina del capello durante il lavaggio: pensato per lunghezze trattate con il colore.' },
    de: { name: 'LuxeOil Keratin Protect Shampoo',
          text: 'Schützt das Keratin beim Waschen — gedacht für Längen, die gefärbt oder aufgehellt sind.' },
    en: { name: 'LuxeOil Keratin Protect Shampoo',
          text: 'Protects the hair’s keratin while washing — made for coloured or lightened lengths.' }
  },

  {
    video: 'sp-luxeoil-mask',
    bild: 'sp-luxeoil-mask.webp',
    marke: 'System Professional',
    preis: '',
    it: { name: 'LuxeOil Keratin Protect Intense Mask',
          text: 'La maschera che va con lo shampoo: una volta a settimana sulle lunghezze, dieci minuti, poi risciacqui.' },
    de: { name: 'LuxeOil Keratin Protect Intense Mask',
          text: 'Die Maske zum Shampoo: einmal die Woche in die Längen, zehn Minuten einwirken, dann ausspülen.' },
    en: { name: 'LuxeOil Keratin Protect Intense Mask',
          text: 'The mask that goes with the shampoo: once a week on the lengths, ten minutes, then rinse.' }
  },

  {
    video: 'sp-mist',
    bild: 'sp-mist.webp',
    marke: 'System Professional',
    preis: '',
    it: { name: 'Hydrate Quenching Mist H15',
          text: 'Spray leave-in da 125 ml: districa, idrata e prepara alla piega senza appesantire.' },
    de: { name: 'Hydrate Quenching Mist H15',
          text: 'Leave-in-Spray, 125 ml: entwirrt, spendet Feuchtigkeit und bereitet aufs Föhnen vor, ohne zu beschweren.' },
    en: { name: 'Hydrate Quenching Mist H15',
          text: 'Leave-in spray, 125 ml: detangles, hydrates and preps for blow-drying without weighing hair down.' }
  },

  {
    video: 'ghd-bodyguard',
    bild: 'ghd-bodyguard.webp',
    marke: 'ghd',
    preis: '',
    it: { name: 'bodyguard — spray termoprotettivo',
          text: 'Da mettere prima del phon o della piastra: protegge fino a 230 °C. Il passaggio che quasi tutte saltano.' },
    de: { name: 'bodyguard — Hitzeschutzspray',
          text: 'Vor Föhn und Glätteisen aufsprühen: schützt bis 230 °C. Der Schritt, den fast alle auslassen.' },
    en: { name: 'bodyguard — heat protect spray',
          text: 'Spray before the dryer or the iron: protects up to 230 °C. The step almost everyone skips.' }
  },

  {
    bild: '',
    marke: '',
    preis: '',
    it: { name: 'Shampoo secco',
          text: 'Per il giorno in più tra un lavaggio e l’altro, senza polvere bianca.' },
    de: { name: 'Trockenshampoo',
          text: 'Für den Tag zwischen zwei Wäschen, ohne weißen Schleier.' },
    en: { name: 'Dry shampoo',
          text: 'For the extra day between washes, without the white haze.' }
  },

  {
    bild: '',
    marke: '',
    preis: '',
    it: { name: 'Spazzola districante',
          text: 'Setole flessibili: scioglie i nodi senza tirare, anche sul bagnato.' },
    de: { name: 'Entwirrbürste',
          text: 'Flexible Borsten: löst Knoten ohne Ziehen, auch im nassen Haar.' },
    en: { name: 'Detangling brush',
          text: 'Flexible bristles: works through knots without pulling, wet or dry.' }
  }

];
