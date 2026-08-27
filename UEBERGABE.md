# Charme Color — Übergabe

Website für **Charme Color · Hair Stylist Nadia Bosco**, dreisprachig (Italiano · Deutsch · English).
Statisches HTML/CSS/JS — kein Framework, kein Build, keine Datenbank. Einfach hochladen.

---

## 1. Sofort ausfüllen (5 Minuten)

Alles Änderbare steht in **einer** Datei: `assets/js/config.js`.
Dort ist jede Zeile mit `AUSFÜLLEN` markiert.

| Feld | Was rein muss |
|---|---|
| `phone` / `phoneDisplay` | Telefonnummer international (`+39…`) und in Anzeigeform |
| `whatsapp` | WhatsApp-Nummer, nur Ziffern mit Vorwahl, **ohne** `+` |
| `email` | E-Mail-Adresse |
| `street`, `zip`, `city` | Adresse des Studios |
| `mapsUrl` | Link zum Google-Maps-Eintrag |
| `instagram`, `facebook`, `tiktok` | Profil-Links (`tiktok` leer lassen = Link verschwindet) |
| `hours` | Öffnungszeiten, geschlossen = `[tag, null, null]` |
| `legalName`, `vatId` | Firmierung und P. IVA fürs Impressum |
| `defaultLang` | `'auto'` = Browsersprache; sonst `'it'`, `'de'` oder `'en'` |

Diese Werte laufen automatisch an **alle** Stellen: Kopfzeile, Öffnungszeiten mit
Live-Status, Adresse, Impressum, WhatsApp-Links und die strukturierten Daten für Google.

## 2. Die Bilder sind Beispielbilder

**Wichtig:** Die acht Fotos auf der Seite sind **KI-generierte Beispielbilder**
(FLUX.2 [Pro]). Sie zeigen keine echten Gäste und nicht Nadia. Sie stehen dort,
damit das Layout mit echten Bildern beurteilt werden kann — und gehören vor dem
Livegang durch eigene Aufnahmen ersetzt.

Ersetzen heißt: gleiche Dateinamen, gleiches Seitenverhältnis, dann muss am Code
nichts geändert werden.

| Datei | Verhältnis | Motiv |
|---|---|---|
| `hero.webp` (+ `hero-sm.webp`) | 3:4 | Porträt, warmes Seitenlicht |
| `nadia.webp` (+ `-sm`) | 4:5 | Nadia bei der Arbeit, Hände und Haar |
| `work-1.webp` (+ `-sm`) | 4:5 | Balayage im Tageslicht |
| `work-2.webp` (+ `-sm`) | 1:1 | Farbergebnis von hinten |
| `work-3.webp` (+ `-sm`) | 1:1 | Detail: Ansatz und Reflex |
| `work-4.webp` (+ `-sm`) | 4:5 | Schnitt in Bewegung |
| `work-5.webp` (+ `-sm`) | 1:1 | Brautfrisur |
| `work-6.webp` (+ `-sm`) | 1:1 | Das Studio |

Die große Datei ist ~800 px breit, die `-sm`-Datei ~500 px (für Handys).
Beide werden über `srcset` ausgeliefert — wer nur eine Datei tauscht, hat auf
dem Handy noch das alte Bild.

Damit alles wie aus einem Guss wirkt: **gleiche Lichtrichtung, gleiche
Farbtemperatur**, Haar immer vor ruhigem Hintergrund. Lieber sechs stimmige
Bilder als zehn gemischte. Format WebP oder JPG, unter 200 KB je Bild.

## 3. Inhalte, die noch fehlen

Alles Fehlende ist auf der Seite sichtbar markiert — **magenta gepunktet** oder in `⟨spitzen Klammern⟩`.

- **12 Preise** — in `index.html` steht jeweils `<b class="todo">–</b>`. Zahl eintragen und
  `class="todo"` entfernen, damit die Markierung verschwindet.
- **Text über Nadia**: Ausbildung, Marken, Berufsjahre (`about.p2` in `assets/js/i18n.js`, in allen drei Sprachen).
- **2 Bewertungen** von Gästen (`voices.q1/q2`, `voices.a1/a2`).
- **Hosting-Anbieter** fürs Impressum (`legal.hostP`).
- **Produktnamen, Preise und Fotos** im Produktbereich — siehe Abschnitt 10.
- **8 eigene Fotos** statt der Beispielbilder — siehe Abschnitt 2.

## 4. Sprachen pflegen

Alle Texte stehen in `assets/js/i18n.js` — ein Block je Sprache, gleiche Schlüssel.
Wer einen Text ändert, ändert ihn in **allen drei** Blöcken. Fehlt ein Schlüssel,
fällt die Seite still auf Italienisch zurück.

- Sprachwahl: Umschalter im Kopf, Browsersprache wird beim ersten Besuch erkannt,
  die Wahl bleibt gespeichert.
- Direktlinks funktionieren: `…/?lang=de`, `…/?lang=en` — praktisch für deutsche Gäste.
- Das Layout ist gegen +40 % Textlänge geprüft (Deutsch läuft am längsten).

## 5. Design-DNA — "Editorial Blanc"

```
Haltung:      eine italienische Modestrecke. Ruhig, hell, teuer.
Farbe:        Papierweiß trägt alles. Karmin ist der einzige Akzent und
              erscheint sparsam — je seltener, desto stärker. Eine einzige
              Tintenfläche im ganzen Verlauf (Il metodo), als Zäsur.
Typografie:   Fraunces Light für alles Große, mit Kursiv als Betonung,
              Inter für Fließtext. Kein Fettdruck, keine Versalien-Titel.
Raum:         großzügig bis zur Unbequemlichkeit — Weißraum ist hier
              Gestaltung, keine Lücke.
Kanten:       Haarlinien statt Kästen, keine Radien außer bei Knöpfen.
Material:     nichts glänzt, nichts wirft Schatten. Bilder liegen nicht auf
              dem Papier, sie sind Teil davon.
Nicht:        keine Schlagschatten, keine Bilderrahmen, kein Korn, keine
              Vignette, kein Laufband, keine Karten.
```

Alle Farben, Größen und Abstände stehen zentral in `assets/css/style.css`
unter `:root`. Wer dort `--accent` ändert, ändert den Akzent auf der ganzen
Seite.

**Die filmischen Gesten (`assets/js/motion.js`):** Es gibt genau vier, und jede
hat eine Aufgabe.

1. **Der Vorhang.** Bilder werden nicht eingeblendet, sie werden freigegeben:
   eine Kante fährt hoch, dahinter steht das Motiv schon fertig. Dazu ein sehr
   langsamer Push-in, damit der Schnitt Tiefe bekommt.
2. **Der Schnitt ins Dunkle.** Vor „Il metodo" zieht eine helle Fläche nach oben
   weg und gibt die Tinte frei, statt dass die Farbe umspringt.
3. **Das Lookbook.** Bei „Lavori" wird die Sektion festgehalten und der
   Bildstreifen wandert quer durchs Bild — die eine große Bewegung der Seite.
   Die Abzüge haben alle dasselbe Format (4:5) und dieselbe Größe. Wichtig
   beim Ersetzen der Fotos: **Seitenverhältnis 4:5 einhalten**, sonst bricht
   die Reihe.

**Der Rahmen (`.framed`)** ist ein Bauteil für alle Fotos der Seite: Hero,
Nadia, Lookbook und die Produktplätze. Passepartout aus Papier, außen eine
Messing-Haarlinie, darunter ein heller Grat, innen eine zweite feine Goldlinie
am Bildrand. Aufliegend wirkt es durch die Schattenstaffelung — kurzer harter
Kontaktschatten an der Kante, darunter der weiche Wurf. **Schräg liegt nur das
Lookbook** (ein halbes Grad, abwechselnd); alles andere steht gerade. Wer ein
Foto einsetzt: `class="framed"` bleibt am `<figure>`, das `<img>` kommt hinein.
Gold ist bewusst auf Haarlinienstärke beschränkt — mehr würde mit dem Karmin um
den Blick streiten.
   Nur am Bildschirm ab 56 rem: Auf dem Handy bleibt es eine Spalte, weil
   seitliches Wischen neben vertikalem Scrollen dort eine Zumutung ist.
4. **Zeitstrahl und Kapitel.** Oben eine Haarlinie für den Verlauf, unten links
   die laufende Kapitelnummer mit Sektionsnamen. Beides Orientierung, keine
   Dekoration; auf dem Handy ist die Kapitelanzeige ausgeblendet.

Wer Sektionen umsortiert, muss die Reihenfolge in der Liste `secs` in
`motion.js` mitziehen — sie liefert die römischen Ziffern.

**Schrift, die über dem Papier schwebt:** Überschriften bekommen drei weiche
Schattenlagen mit wachsendem Abstand — nah und kräftig, mittel, weit und blass.
Zwei Dinge sind dabei wichtig und sollten nicht "verbessert" werden:

1. **Keine harten Lagen ohne Weichzeichnung.** Sie erzeugen eine versetzte
   Zweitschrift, die an den Unterkanten abbricht — bei einer dünnen Kursiven
   sieht das aus wie ein Druckfehler.
2. **Die Zeilenmaske muss weg, sobald die Zeile oben ist.** Der Aufstieg der
   Überschriften arbeitet mit einem Rahmen aus `overflow:hidden`; bleibt er
   stehen, schneidet er den Schatten an der Unterkante ab. `unmask()` in
   `motion.js` löst ihn nach der Animation auf.

Vier Stufen stehen in `:root` (`--lift-lg`, `--lift-sm`, `--lift-dark`,
`--lift-accent`); auf schmalen Bildschirmen und bei den kursiven Zitaten trägt
die flache Variante.

**Die Grundhaltung dabei:** bewusst zurückhaltend — eine Modestrecke
blättert man um, sie tanzt nicht. Es gibt nur zwei Gesten: Überschriftenzeilen
steigen unter der Kante hervor, Flächen blenden mit minimalem Versatz ein.
Bilder blenden ohne Bewegung auf; ein Bild, das hereinfliegt, wirkt wie Werbung.
Kein Parallax, kein Skalieren, kein Smooth-Scroll. Bei
`prefers-reduced-motion` steht alles sofort da, und fällt GSAP aus, macht
`motion.js` die Seite vollständig sichtbar.

**Klickbare Leistungen:** Ein Klick auf eine Zeile in der Preisliste springt zum
Terminformular und wählt die Leistung dort aus. Wer eine Leistung umbenennt oder
verschiebt, muss `data-svc="N"` im Titel-Link und die Reihenfolge der
`<option>`-Einträge im Formular gleich halten.

## 6. Technik

- **Schriften selbst gehostet** (`assets/fonts/`) — Fraunces und Inter, keine
  Anfrage an Google, damit datenschutzrechtlich unkritisch und schneller.
- **Terminformular ohne Server**: baut eine fertige WhatsApp-Nachricht. Es wird nichts
  gespeichert und nichts verschickt, bis Nadia die Nachricht in WhatsApp abschickt.
- **Kein Tracking, keine Cookies** — deshalb auch kein Cookie-Banner nötig.
- **Strukturierte Daten** (`HairSalon`) entstehen automatisch aus `config.js`:
  Name, Adresse, Telefon, Öffnungszeiten, Social-Profile.
- Ohne JavaScript bleibt die Seite vollständig lesbar.
- `robots.txt` und `sitemap.xml` liegen bei — vor dem Livegang die Domain darin
  sowie in den `hreflang`- und `canonical`-Zeilen von `index.html` anpassen.

## 7. Messwerte beim Launch

Playwright, CPU 4× gedrosselt, Breakpoints 360 / 414 / 768 / 1280 / 1920:

| | Wert |
|---|---|
| LCP | 564–1812 ms |
| CLS | ≤ 0,0045 |
| Seitengewicht | 492–534 KB · 13–14 Requests |
| Bildrate beim Scrollen | 60 fps in allen Abschnitten, auch während der Lookbook-Fahrt |
| Kontraste | 4,83–17,77 — WCAG AA durchgehend erfüllt |
| Konsolenfehler | 0 |
| Overflow | keiner |
| Reduced Motion | sauber, Inhalt sofort sichtbar |

Das Seitengewicht enthält GSAP, ScrollTrigger und SplitText (zusammen rund
50 KB komprimiert). Lenis ist mit dem neuen Design entfallen: Smooth-Scroll
passt nicht zu einer Seite, die auf Ruhe setzt.

Diese Zahlen sind der Referenzstand. Wenn nach dem Tausch der Fotos das
Seitengewicht über ~600 KB steigt, sind die Bilder zu groß komprimiert.

## 8. Hochladen

Den kompletten Ordner in das Web-Verzeichnis kopieren (`public_html`, `htdocs` o. ä.).
Nichts zu bauen, nichts zu installieren. Empfehlenswert: HTTPS erzwingen und
`assets/` mit langer Cache-Zeit ausliefern.

## 10. Der Produktbereich

Unter „Prodotti / Produkte / Products" liegt ein Katalog mit sechs Plätzen.
Er ist bewusst **kein Webshop mit Kasse**, sondern eine Reservierung:
Ein Klick öffnet WhatsApp mit einer fertigen Nachricht, in der das Produkt
schon steht. Bezahlt und abgeholt wird im Salon. Damit entsteht der
Kaufvertrag im Laden — es gilt kein Fernabsatzrecht, und die Seite braucht
weder Zahlungsabwicklung noch Widerrufsbelehrung.

**Was einzutragen ist**
- Produktnamen und Beschreibungen: `shop.1t`–`shop.6t` und `shop.1p`–`shop.6p`
  in `assets/js/i18n.js`, in allen drei Sprachen. Die jetzigen Texte sind
  Beispiele für typische Salonprodukte.
- Preise: in `index.html` je `<span class="todo">–</span>`
- Produktfotos: das `<div class="prod__shot">` durch ein `<img>` ersetzen
  (4:5, heller ruhiger Hintergrund). Der Kommentar über jedem Platz sagt es.
  **Keine KI-Bilder für Produkte** — sie müssten die echte Ware zeigen, sonst
  ist es irreführend und bei Markenware zusätzlich heikel.
- Mehr oder weniger als sechs Produkte: Block kopieren bzw. löschen, dabei
  `data-prod="shop.Nt"` und die Nummer im `prod__n` mitziehen.

**Wenn später wirklich online verkauft werden soll**, ist das mit dieser
Struktur ein kleiner Schritt — aber es braucht vorher:
- Partita IVA und Gewerbemeldung für den Onlinehandel
- AGB, Widerrufsbelehrung, Versand- und Rückgabebedingungen
- eine Zahlungsanbindung. In eine statische Seite lassen sich einhängen:
  **Stripe Payment Links** (ein Link je Produkt, kein Code), **SumUp** oder
  **PayPal-Buttons** (einfach, keine laufenden Kosten), oder **Ecwid** bzw.
  **Snipcart** für einen echten Warenkorb (Skript plus Attribute an den
  Produkten, monatliche Gebühr).
Der Aufwand liegt dann nicht in der Technik, sondern im Rechtlichen.

## 11. Die Karte

Unter „Orari e contatti" liegt eine **selbst gezeichnete Karte**, kein
eingebetteter Google-Kartenausschnitt. Gründe: keine fremden Skripte, keine
Cookies, kein Einwilligungsbanner, kein Nachladen — und sie nimmt Farben,
Schrift und Ruhe der übrigen Seite an.

Sie ist ein SVG (`assets/img/karte.svg`, im HTML direkt eingebettet, damit sie
animierbar ist), gezeichnet aus echten Straßendaten von OpenStreetMap im
Umkreis von 330 Metern. Beim Hereinscrollen legt sich zuerst das Straßennetz an,
dann fährt der Straßenzug der Via Cesare Sessa nach, zuletzt setzt sich der
Punkt und die Orientierungsmarken erscheinen — die Reihenfolge einer
Wegbeschreibung. Der Punkt schlägt danach ruhig weiter.

**Pflicht:** Der Hinweis „Kartendaten © OpenStreetMap" unter der Karte muss
stehen bleiben. Die Daten stehen unter der ODbL-Lizenz, die Namensnennung ist
Bedingung der Nutzung.

**Wenn die Adresse sich ändert**, muss die Karte neu gezeichnet werden — sie ist
auf die Koordinaten 37,3191 / 13,6662 projiziert. Die drei Entfernungsangaben
darunter (Statua Padre Pio 211 m, Farmacia Bongiorno 262 m, Hausnummer 76) sind
aus den Koordinaten gerechnet, nicht geschätzt.

## 9. Bekannte Grenzen / nächste Ausbaustufe

- Die Bilder sind Beispielbilder aus einer KI. Sie dürfen so nicht live gehen: Gäste würden Motive sehen, die es im Studio nie gab. Eigene Aufnahmen sind der größte Hebel, alles andere ist Feinschliff.
- Preise, Bewertungen und der Text über Nadia fehlen; bis dahin bitte nicht live schalten.
- Zwei Beispielbilder (Blond-Balayage, Bob in Bewegung) sind im Beauty-Stil mit nackten Schultern — falls das für den Salon zu editorial ist, austauschen.
- Online-Buchung mit Kalender ist **nicht** enthalten (WhatsApp ist der Weg). Falls später
  gewünscht, lässt sich ein Buchungsdienst an derselben Stelle einhängen.
- Ein Google-Maps-Kartenausschnitt ist bewusst nicht eingebettet (Ladezeit und Datenschutz);
  stattdessen ein Link. Bei Bedarf nachrüstbar mit Klick-zum-Laden.
- Sinnvolle nächste Schritte: Google-Unternehmensprofil verknüpfen, OG-Bild aus den
  echten Fotos bauen, eine kurze Preisliste als PDF zum Mitnehmen.
