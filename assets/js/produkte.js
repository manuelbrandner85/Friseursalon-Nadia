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
    bild: '',
    marke: '',
    preis: '',
    it: { name: 'Shampoo per capelli colorati',
          text: 'Deterge senza spegnere il riflesso. Il colore resta più a lungo.' },
    de: { name: 'Shampoo für gefärbtes Haar',
          text: 'Reinigt, ohne den Reflex auszuwaschen. Die Farbe hält länger.' },
    en: { name: 'Shampoo for coloured hair',
          text: 'Cleans without washing out the reflect. The colour lasts longer.' }
  },

  {
    bild: '',
    marke: '',
    preis: '',
    it: { name: 'Maschera di ricostruzione',
          text: 'Una volta a settimana, per lunghezze stressate da schiariture o piastra.' },
    de: { name: 'Aufbaumaske',
          text: 'Einmal die Woche, für Längen, die unter Blondierung oder Glätteisen gelitten haben.' },
    en: { name: 'Rebuilding mask',
          text: 'Once a week, for lengths worn down by bleach or flat irons.' }
  },

  {
    bild: '',
    marke: '',
    preis: '',
    it: { name: 'Olio per le punte',
          text: 'Poche gocce sul capello umido: meno crespo, niente effetto unto.' },
    de: { name: 'Spitzenöl',
          text: 'Wenige Tropfen ins feuchte Haar: weniger Frizz, kein fettiger Ansatz.' },
    en: { name: 'Ends oil',
          text: 'A few drops on damp hair: less frizz, no greasy roots.' }
  },

  {
    bild: '',
    marke: '',
    preis: '',
    it: { name: 'Spray termoprotettivo',
          text: 'Prima del phon o della piastra. Il passaggio che quasi tutte saltano.' },
    de: { name: 'Hitzeschutzspray',
          text: 'Vor Föhn und Glätteisen. Der Schritt, den fast alle auslassen.' },
    en: { name: 'Heat protection spray',
          text: 'Before the dryer or the iron. The step almost everyone skips.' }
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
