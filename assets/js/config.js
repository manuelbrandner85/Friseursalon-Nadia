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
  phone: '+390000000000',            // AUSFÜLLEN
  phoneDisplay: '+39 000 000 0000',  // AUSFÜLLEN (Anzeigeform)

  // WhatsApp-Nummer, nur Ziffern mit Ländervorwahl, ohne + : z. B. '39XXXXXXXXXX'
  whatsapp: '390000000000',          // AUSFÜLLEN

  email: 'info@charmecolor.it',      // AUSFÜLLEN

  // --- Adresse -----------------------------------------------------------
  street: 'Via Esempio 1',           // AUSFÜLLEN
  zip: '00000',                      // AUSFÜLLEN
  city: 'Città',                     // AUSFÜLLEN
  country: 'IT',
  mapsUrl: 'https://maps.google.com/?q=Charme+Color',  // AUSFÜLLEN

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
  legalName: 'Charme Color di Nadia Bosco',  // AUSFÜLLEN
  vatId: 'IT00000000000',                    // AUSFÜLLEN (P. IVA / USt-IdNr.)

  // --- Startsprache ------------------------------------------------------
  // 'auto' = Browsersprache, sonst 'it' | 'de' | 'en'
  defaultLang: 'auto'
};
