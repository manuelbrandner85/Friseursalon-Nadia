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

## 2a. Das Studio-Foto (echt)

Das Breitband **ganz oben — noch vor der Überschrift** zeigt **das echte Studio** — das erste
richtige Foto auf der Seite. Es läuft über die volle Fensterbreite, gerahmt von
zwei Messing-Haarlinien, und fährt beim Scrollen langsam heran. Der Ausschnitt ist so gesetzt, dass das Logo an der Wand im Bild bleibt
(`object-position: center 42%`); auf dem Handy zeigt er stattdessen den
Spiegelplatz, weil das Wandlogo dort halb hinter der Kopfzeile läge.

**Die Menüzeile liegt durchscheinend darüber** (58 % Deckkraft plus
Weichzeichner), nach dem Scrollen wird sie dichter und bekommt eine Haarlinie.
Wo der Weichzeichner nicht unterstützt wird, greift automatisch mehr Deckkraft.
Die Marke in der Kopfzeile ist sichtbar — außer wenn der Briefkopf im Hero
gerade in der Bildmitte steht, dann tritt sie zurück, damit die Marke nicht
doppelt erscheint. Derselbe Aufnahme liefert auch das Galeriebild „Das Studio" — dort
als 4:5-Ausschnitt der rechten Bildhälfte. Beide Fassungen liegen in drei
Größen vor, der Browser wählt die passende.

## 2. Die übrigen Bilder sind Beispielbilder

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
- **Erste Gästebuch-Einträge** in `assets/js/gaestebuch.js`; den Musterblock löschen.
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

**Der Hero:** Der Text steht mittig in seiner Spalte — Überschrift, Fließtext,
Knöpfe und Metazeile auf einer Achse. Ein Logo steht dort nicht mehr; die Marke
trägt die Kopfzeile, dazu das Wandlogo im Studio-Foto darüber. Das Foto rechts
hat kein festes Seitenverhältnis, sondern nimmt die Höhe der Textspalte an
(`align-items: stretch`), damit Ober- und Unterkante bei **jeder**
Bildschirmbreite auf einer Linie liegen. Wichtig, falls jemand dort etwas
ändert: `min-width: 0` auf den Hero-Spalten und `min-height: 0` für das Foto im
Handy-Bereich müssen bleiben, sonst rechnet der Browser aus Mindesthöhe und
Seitenverhältnis eine zu große Breite und zoomt die ganze Seite heraus.

Die Marke in der Kopfzeile hat zwei Fassungen,
mit einer feinen Goldlinie, die nach dem Auftritt aufzieht. Sie wird
freigegeben statt eingeblendet (dieselbe Vorhang-Geste wie bei den Bildern),
danach läuft einmal ein Lichtschein darüber — einmalig, denn ein Logo, das
dauernd glänzt, wirkt billig.

**Zu den Logo-Dateien:** Sie sind aus dem Original neu freigestellt, mit hartem
Alpha-Schnitt. Die alten Fassungen hatten **keinen einzigen voll transparenten
Pixel** (überall Alpha ≥ 1); zusammen mit einem hellen Schatten legte das eine
weiße Fläche unter das gesamte Bildrechteck — auf dem Papierton als Kasten
sichtbar. Wer die Dateien neu erzeugt: nach jeder Skalierung und nach jeder
Farbreduktion den Alphakanal erneut schneiden, sonst kommt der Kasten zurück.

**Die Marke in der Kopfzeile** hat zwei Fassungen: Oben auf der Seite steht das
volle Logo — dort ist Platz und die Wortmarke ist lesbar. Sobald die Kopfzeile
beim Scrollen schrumpft, blendet sie zur Bildmarke mit gesetztem Namen über; ein
40 Pixel hohes Vollogo wäre Matsch. Beim Laden wird das Logo freigegeben statt
eingeblendet (dieselbe Vorhang-Geste wie bei den Bildern), danach läuft einmal
ein feiner Lichtschein darüber. Beide Fassungen liegen in derselben Rasterzelle,
damit die breitere den Platzbedarf bestimmt und nichts die Navigation überlappt.

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
| LCP | 568–2004 ms |
| CLS | ≤ 0,0045 |
| Seitengewicht | 594–645 KB · 18 Requests |
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

## 12. Das Gästebuch

Es sieht aus wie ein Buch und verhält sich auch so: Der Einband liegt zu und
klappt auf, sobald man ihn anklickt oder er beim Scrollen mittig ins Bild kommt.
Dabei fährt die Kamera zurück und das Buch rückt nach rechts, damit links Platz
für den Deckel entsteht; ein Schatten wandert über die linke Seite mit.

**Warum der Deckel nicht ganz umschlägt:** Durch die Perspektive wird eine
umklappende Fläche breiter als das Buch selbst — nachgemessen ragte sie bis zu
800 px über den Fensterrand und wurde dort abgeschnitten. Der Deckel richtet
sich deshalb bis knapp 70 Grad auf und blendet dabei aus, solange er sicher im
Bild steht. Geprüft bei 1024, 1280 und 1440 px: Der linkeste Punkt liegt immer
im sichtbaren Bereich. Wer die Winkel ändert, sollte das nachmessen.
Das Aufklappen dauert bewusst rund vier Sekunden — erst gibt der Deckel zögernd
nach, dann fällt er, während das Buch leicht nach rechts rückt und die
Doppelseite aus dem Halbdunkel kommt. Der Deckel dreht bis gut über die
Senkrechte und blendet dann aus: Ein voll umgeschlagener Deckel bräuchte links
die ganze Buchbreite und würde am Seitenrand abgeschnitten — genau das war beim
ersten Versuch der Fehler. Wer die Geschwindigkeit ändern will, findet die
Dauern in `motion.js` in der Funktion `oeffnen()` an einer Stelle beisammen.
Innen zwei Seiten mit je einem Eintrag, Seitenzahlen unten, geblättert wird mit
den Pfeilen oder den Pfeiltasten — das Blatt dreht sich dabei über den Bund, und
der Inhalt wechselt genau dann, wenn es hochkant steht. Unter jedem Eintrag
zeichnet sich ein Federstrich wie eine Unterschrift. Auf dem Handy zeigt das
Buch eine Seite statt zwei; ohne JavaScript und bei reduzierter Bewegung liegt
es von vornherein offen da.

### Damit Einträge für alle sichtbar sind

Eine Seite auf GitHub Pages kann nichts entgegennehmen — sie liefert nur
Dateien aus. Für ein öffentliches Gästebuch braucht es einen Speicher. Die
Anbindung ist fertig eingebaut, es fehlen nur zwei Werte:

1. Auf **supabase.com** ein kostenloses Konto und ein Projekt anlegen.
2. Im Projekt unter *SQL Editor* dieses Skript ausführen:

```sql
create table guestbook (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null check (char_length(name) between 1 and 40),
  message text not null check (char_length(message) between 10 and 400),
  service text
);
alter table guestbook enable row level security;
create policy "jeder darf lesen"    on guestbook for select to anon using (true);
create policy "jeder darf schreiben" on guestbook for insert to anon with check (true);
```

3. Unter *Project Settings → API* die **Project URL** und den **anon public key**
   kopieren und in `assets/js/config.js` bei `guestbook` eintragen. Fertig —
   ab dann sieht jeder Besucher jeden Eintrag.

Der anon-Schlüssel darf öffentlich im Code stehen; er kann nur das, was die
Richtlinien oben erlauben (lesen und schreiben in dieser einen Tabelle).

**Solange nichts eingetragen ist**, läuft das Buch im lokalen Modus: Der Eintrag
bleibt auf dem Gerät des Schreibers und ist dort mit dem Hinweis „nur auf diesem
Gerät" gekennzeichnet. Das ist zum Ausprobieren gedacht — nicht als Dauerlösung,
sonst schreiben Gäste ins Leere.

### Spam

Eingebaut sind eine unsichtbare Falle für Bots und eine Sperre von zehn Minuten
je Gerät. Das hält automatisierte Einträge auf, aber keinen entschlossenen
Menschen. Wer auf Nummer sicher gehen will, setzt in der Tabelle eine Spalte
`approved boolean default false`, ändert die Leserichtlinie auf
`using (approved)` und gibt Einträge in Supabase von Hand frei.

### Grundbestand

`assets/js/gaestebuch.js` enthält feste Einträge, die immer hinter den
online geschriebenen stehen — gedacht für die ersten Stimmen von Hand.
Der Musterblock mit den ⟨spitzen Klammern⟩ muss vor dem Livegang raus.

## 13. Was beim Teilen und in der Suche passiert

- **Teilbild** (`assets/img/og-bild.jpg`, 1200×630): Wird angezeigt, wenn jemand
  den Link in WhatsApp, Facebook oder Instagram schickt. Es ist mit den echten
  Schriften der Seite gebaut, nicht mit einem Bildbearbeitungsprogramm — die
  Vorlage steht als HTML im Verlauf und lässt sich jederzeit neu rendern.
  **Wichtig:** Die Adresse in `og:image` muss absolut sein (mit `https://…`);
  relative Pfade werden von diesen Diensten nicht aufgelöst. Bei einem
  Domainwechsel also mit anpassen.
- **Symbole**: `favicon.ico` (16/32/48), `apple-touch-icon.png` (180),
  `icon-192/512` und ein maskierbares Symbol für Android. Alle zeigen nur das
  `cc`-Zeichen — das Vollogo wäre bei 32 Pixeln unlesbar.
- **manifest.webmanifest**: Damit lässt sich die Seite auf dem Handy als
  Verknüpfung auf den Startbildschirm legen und startet dann ohne Browserleiste.
- **Strukturierte Daten**: Der Eintrag für Google enthält jetzt Bild, Logo,
  Koordinaten, Preisniveau, Sprachen, Einzugsgebiet und **alle 13 Leistungen als
  Angebotskatalog**. Die Leistungen werden dabei aus der Seite selbst gelesen —
  wer eine umbenennt, muss nichts nachpflegen.
- **404-Seite**: Eigene Seite im Stil der Website, dreisprachig, mit Weg zurück
  und WhatsApp-Knopf.

## 14. Die lebende Fläche im Hero (WebGL)

Hinter dem Hero-Text liegt ein Shader: langsam strömende Bahnen in Papierton
mit einem Hauch Karmin, wie Strähnen, die im Licht liegen. Sie folgen träge dem
Mauszeiger.

**Ohne Bibliothek gebaut.** Für eine Fläche braucht es kein Three.js — der rohe
WebGL-Aufruf ist `assets/js/weave.js` und wiegt **3 KB komprimiert** statt 150.
Die Farben wurden vorab durchgerechnet, nicht geschätzt: Helligkeitsspanne 71
von 255, Textkontrast auf der dunkelsten Stelle 6,7 — die Fläche ist sichtbar,
und die Schrift steht trotzdem sicher darauf.

**Sie schaltet sich selbst ab**, und zwar geprüft:
- bei `prefers-reduced-motion` · bei aktiviertem Datensparmodus
- auf Geräten mit ≤ 2 Kernen oder < 4 GB Speicher
- wenn der Hero aus dem Bild ist oder der Tab im Hintergrund läuft
- wenn die Bildrate über längere Zeit einbricht (dann entfernt sie sich ganz)
- wenn WebGL fehlt — dann bleibt der ruhige Verlauf aus dem Stylesheet stehen

Die Auflösung ist auf das 1,5-fache gedeckelt: Mehr bringt bei einer weichen
Fläche nichts Sichtbares, kostet aber quadratisch Rechenzeit.

**Zum Ändern:** Farben und Tempo stehen im Shader-Text oben in `weave.js`
(`papier`, `sand`, `karmin`, `zeit*.075`). Wer sie kräftiger will, sollte den
Textkontrast nachrechnen — die Fläche liegt direkt unter der Überschrift.

## 15. Das Schattensystem

Alle Höhen laufen über **eine Datei**: `assets/css/schatten.css`. Dort stehen
vier Ebenen (`--e1` bis `--e4`), die Hairline (`--kante`) und zwei
Schriftschatten. In den Bauteilen steht kein einziger eigener Schattenwert mehr
— vorher waren es fünfzehn gewachsene Varianten auf 107 Elementen.

**Die drei Stellschrauben** stehen oben in der Datei:
- `--sh: 45 38 31` — die Schattenfarbe, aus dem Papierton 250/248/246
  abgeleitet: Farbton behalten, Helligkeit auf 15 %. Reines Schwarz wirkt auf
  warmem Papier grau und schmutzig.
- `--sh-kante: .07` — Deckkraft der Hairline
- `--sh-faktor: 1.6` — Gesamtstärke. Auf so hellem Papier trägt ein Schatten
  wenig; bei 1.05 wirkten die gerahmten Abzüge flach.

**Zuordnung:** Bilder und Knöpfe liegen auf Ebene 2, im Hover auf 3, gedrückt
auf 1. Die Kopfzeile hat keine Höhe und bekommt sie erst beim Scrollen. Jedes
Bauteil bewegt sich um genau eine Ebene.

**Zwei bewusste Abweichungen**, damit sie niemand versehentlich „korrigiert":
1. Die gerahmten Abzüge bekommen **keine** Hairline — die Messinglinie ist
   bereits ihre Kontur, beides zusammen ergäbe einen doppelten Rand.
2. Die vier Schatten mit x-Versatz in den Buchseiten bilden den **Bund** ab.
   Sie sind Material, keine Höhe. Alle echten Höhenschatten haben ausschließlich
   y-Versatz, wie es die eine Lichtquelle verlangt.

Farbige Bauteile tragen einen eigenen Schattenton (`--sh` lokal überschrieben):
der dunkle Knopf und der Buchdeckel. Ein grauer Schatten unter einer kräftig
gefärbten Fläche lässt sie ausgestanzt wirken statt aufliegend.

## 16. Durchsicht vom 30.08.2026 — was verbessert wurde

- **Echte Formulare.** Termin und Gästebuch stehen jetzt in `<form>`-Elementen.
  Damit löst die Eingabetaste aus, Browser bieten das Ausfüllen an und
  Screenreader kündigen den Formularkontext an. Abgeschickt wird weiterhin
  nichts an einen Server — das `submit`-Ereignis wird abgefangen und die
  Nachricht geht über WhatsApp.
- **Titel je Sprache.** Vorher stand in allen drei Sprachen derselbe Titel.
  Jetzt nennt jeder Titel Leistung und Ort („Friseur in Favara · Farbe und
  Balayage"), was für die lokale Suche entscheidend ist. Die 404-Seite hat
  einen eigenen Titel; sie trug zuvor den der Startseite, weil das Skript ihn
  überschrieb.
- **Tippziele.** Sprachwahl, Fußzeilenlinks und das Einwilligungshäkchen waren
  auf dem Handy 17–23 px hoch. Sie sind jetzt über 44 px treffbar — der
  Trefferbereich wächst über ein unsichtbares Pseudoelement, die Optik bleibt.
- **Ballast entfernt.** 16 verwaiste Dateien aus den Umbauten (altes
  Salonbild, ungenutzte Logo-Größen, helle Bildmarke) und Lenis, das seit dem
  Designwechsel nicht mehr eingebunden war. Zusammen rund 380 KB.
- **Toter Verweis.** Das Impressum lud per `preload` eine Schriftdatei, die es
  seit dem Designwechsel nicht mehr gibt — ein 404 bei jedem Aufruf.

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
