/* =========================================================================
   CHARME COLOR — zentrale Konfiguration
   Alles, was Nadia später ändern muss, steht HIER und nirgendwo sonst.
   Nach dem Ausfüllen: die Werte mit "AUSFÜLLEN" ersetzen, fertig.
   ========================================================================= */

window.SALON = {
  name: 'Charme Color',
  owner: 'Nadia Bosco',

  // --- Kontakt -----------------------------------------------------------
  // Telefonnummer international, ohne Leerzeichen: z. B. '+39XXXXXXXXXX'
  phone: '+393287866416',            // AUSFÜLLEN
  phoneDisplay: '+39 328 786 6416',

  // WhatsApp-Nummer, nur Ziffern mit Ländervorwahl, ohne + : z. B. '39XXXXXXXXXX'
  whatsapp: '393287866416',          // dieselbe Nummer wie oben

  email: 'info@charme-color.it',     // eingetragen 26.08.2026

  // --- Adresse -----------------------------------------------------------
  street: 'Via Cesare Sessa 76',
  zip: '92026',
  city: 'Favara',
  province: 'AG',                    // Provinzkürzel, erscheint in Klammern
  country: 'IT',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Via+Cesare+Sessa+76,+92026+Favara+AG',
  // Koordinaten des Salons — sie stehen auch in der gezeichneten Karte.
  geo: { lat: 37.31913, lon: 13.66622 },

  // --- Social ------------------------------------------------------------
  instagram: 'https://instagram.com/',   // AUSFÜLLEN
  facebook: 'https://facebook.com/',     // AUSFÜLLEN
  tiktok: '',                            // optional, leer = Link wird ausgeblendet

  // --- Öffnungszeiten ----------------------------------------------------
  // Wird sowohl angezeigt als auch für Google (JSON-LD) verwendet.
  // Format: [Kürzel, 'HH:MM', 'HH:MM'] — geschlossen: [Kürzel, null, null]
  hours: [
    ['mo', null, null],
    ['tu', '09:00', '18:00'],
    ['we', '09:00', '18:00'],
    ['th', '09:00', '20:00'],
    ['fr', '09:00', '18:00'],
    ['sa', '08:30', '17:00'],
    ['su', null, null]
  ],

  // --- Rechtliches (für legal.html) --------------------------------------
  legalName: 'Charme Color di Bosco Nadia',  // amtliche Firmierung
  vatId: '02984690848',                      // Partita IVA

  // --- Gästebuch ---------------------------------------------------------
  // Damit Einträge für ALLE sichtbar sind, braucht es einen Speicher.
  // Solange hier nichts steht, läuft das Gästebuch im lokalen Modus:
  // ein Eintrag ist nur auf dem Gerät sichtbar, auf dem er geschrieben wurde.
  // Anleitung zum Verbinden: siehe UEBERGABE.md, Abschnitt 12.
  guestbook: {
    url: '',                         // z. B. 'https://xxxx.supabase.co'
    key: '',                         // der öffentliche "anon"-Schlüssel
    table: 'guestbook'
  },

  // --- Startsprache ------------------------------------------------------
  // 'auto' = Browsersprache, sonst 'it' | 'de' | 'en'
  defaultLang: 'auto'
};
