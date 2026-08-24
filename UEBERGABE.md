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
- **8 eigene Fotos** statt der Beispielbilder — siehe Abschnitt 2.

## 4. Sprachen pflegen

Alle Texte stehen in `assets/js/i18n.js` — ein Block je Sprache, gleiche Schlüssel.
Wer einen Text ändert, ändert ihn in **allen drei** Blöcken. Fehlt ein Schlüssel,
fällt die Seite still auf Italienisch zurück.

- Sprachwahl: Umschalter im Kopf, Browsersprache wird beim ersten Besuch erkannt,
  die Wahl bleibt gespeichert.
- Direktlinks funktionieren: `…/?lang=de`, `…/?lang=en` — praktisch für deutsche Gäste.
- Das Layout ist gegen +40 % Textlänge geprüft (Deutsch läuft am längsten).

## 5. Design-DNA

```
Haltung:      filmisch, kontrastreich, präzise
Farbe:        Aubergine-Kohle (Tiefe) · Alabaster (Papier) · ein Akzent (Magenta)
              Kein reines Schwarz (wirkte flach) und kein Beige (zog das Magenta
              ins Schmutzige und nahm der Schrift den Biss).
Typografie:   Archivo 800 Versalien (Display) + Inter (Text), Skala 1.25,
              Überschriften mit gestaffeltem Schlagschatten (Licht von oben links)
Raster:       Grundmaß 4 px, Container 78 rem, asymmetrisch
Materialität: filmisch — Lichtführung statt flacher Flächen, weiche Vignette,
              feines Korn über der ganzen Seite, eine Farbgradierung für alle Bilder
Motion:       träge einschwingend, max. 18 px Weg, kein Bounce, kein Parallax
Nicht:        kein Rosa-Verlauf, keine drei gleichen Cards, kein Karussell
```

**Das Logo** trägt den ersten Bildschirm: groß, mit Schlagschatten, in der
Originalversion auf hellem Grund. Die Kopfzeile hält sich darüber zurück und
blendet ihr kleines Logo erst ein, wenn der Hero weggescrollt ist — so steht
die Marke nie doppelt übereinander.

**Gerahmte Abzüge:** Jedes Foto sitzt in einem Passepartout aus Papier, minimal
gedreht, mit gestaffeltem Schatten — ein harter Kontaktschatten direkt an der
Kante, darunter der weiche Wurfschatten. Genau diese Staffelung lässt etwas
aufliegen statt zu schweben. Im Rollover richtet sich der Abzug auf und hebt ab;
die Bildunterschrift erscheint auf dem Rand, nicht auf dem Bild. Auf schmalen
Bildschirmen ist die Drehung aus (`--tilt: 0`), sonst entsteht seitliches Scrollen.

**Plastische Schrift:** Überschriften bekommen eine kurze Extrusion nach unten
rechts, eine Lichtkante an der Oberseite und darunter den Wurfschatten — Licht
kommt auf der ganzen Seite von oben links. Es gibt vier Stufen
(`--type-shadow-light`, `-dark`, `-accent`, plus die flacheren `-sm`-Varianten):
dieselbe Tiefe wie bei 80 px wirkt bei 26 px wie eine Schmiererei, deshalb
tragen H3 und Zahlen die flache Variante. Die Magenta-Zeile im Hero hat
zusätzlich Halation — Bloom nur dort, wo im Bild eine Lichtquelle wäre.

**Filmische Schicht:** Über der ganzen Seite liegt `.film` — eine weiche
Vignette und feines Korn, beides fest am Viewport. Dazu bekommt jedes Foto
dieselbe Gradierung (Kontrast, Sättigung, Split-Tone: Schatten ins Violett,
Lichter warm). Das ist der Grund, warum die Bilder wie eine Serie wirken und
nicht wie eine Sammlung. Wer eigene Fotos einsetzt, muss sie deshalb **nicht**
vorher angleichen — die Seite tut das.

Im Hero liegt ein weicher Lichtkegel, der sehr langsam driftet, das Bild hat
eine kaum merkliche Ken-Burns-Bewegung, und das Logo bekommt beim Laden einen
einmaligen Lichtsweep. Überschriften fahren wie ein Filmtitel unter der Kante
hervor. Alles davon schaltet sich bei `prefers-reduced-motion` ab.
Die Stellschrauben stehen in `:root`: `--vignette`, `--grain-opacity`,
`--grade-shadows`, `--grade-lights`.

**Rollover mit Aufgabe:** Jede Zeile in der Preisliste ist anklickbar. Beim
Überfahren fährt eine Fläche von links ein, der Titel rückt nach, der Preis
wird magenta und ein Pfeil erscheint. Ein Klick springt zum Terminformular und
wählt die Leistung dort aus. Galeriebilder zoomen sanft und zeigen ihre
Bildunterschrift, die Zeitentabelle hebt die Zeile unter dem Cursor.
Wer eine Leistung umbenennt oder verschiebt, muss `data-svc="N"` im Titel-Link
und die Reihenfolge der `<option>`-Einträge im Formular gleich halten.

Alle Farben, Größen, Abstände und Zeiten stehen zentral in `assets/css/style.css`
unter `:root`. Wer dort das Magenta ändert, ändert es auf der ganzen Seite.

## 6. Technik

- **Schriften selbst gehostet** (`assets/fonts/`) — keine Anfrage an Google, damit
  datenschutzrechtlich unkritisch und schneller.
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
| LCP | 580–2008 ms |
| CLS | ≤ 0,0006 |
| Seitengewicht | 251–377 KB · 12–13 Requests |
| Konsolenfehler | 0 |
| Overflow | keiner |
| Reduced Motion | sauber, Inhalt sofort sichtbar |

Diese Zahlen sind der Referenzstand. Wenn nach dem Tausch der Fotos das
Seitengewicht über ~600 KB steigt, sind die Bilder zu groß komprimiert.

## 8. Hochladen

Den kompletten Ordner in das Web-Verzeichnis kopieren (`public_html`, `htdocs` o. ä.).
Nichts zu bauen, nichts zu installieren. Empfehlenswert: HTTPS erzwingen und
`assets/` mit langer Cache-Zeit ausliefern.

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
