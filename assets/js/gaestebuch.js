/* =========================================================================
   CHARME COLOR — Gästebuch
   -------------------------------------------------------------------------
   Hier stehen die freigegebenen Einträge. Neue Nachrichten kommen per
   WhatsApp oder E-Mail bei Nadia an; sie trägt sie hier ein. Dieser
   Zwischenschritt ist Absicht: ein Gästebuch, in das jeder ungeprüft
   schreiben kann, ist nach wenigen Tagen voller Werbung — und für die
   Veröffentlichung fremder Namen braucht es deren Einverständnis.

   Ein neuer Eintrag: Block kopieren, ausfüllen, oben einfügen.
   Das Datum bestimmt nur die Anzeige, sortiert wird nach Reihenfolge hier.
   ========================================================================= */

window.GAESTEBUCH = [
  // --- Muster: so sieht ein Eintrag aus. Vor dem Livegang ersetzen. ---
  {
    name: '⟨Vorname⟩',
    date: '2026',
    text: '⟨Nachricht der Kundin, zwei bis drei Zeilen. Nur eintragen, wenn sie ' +
          'einverstanden ist, dass Vorname und Text hier stehen.⟩',
    service: ''          // optional, z. B. 'Balayage' — erscheint klein darunter
  }
];
