# ETF Clientelo – konverzná landing page (Zadanie B)

Lead magnet pre českého drobného investora: porovnanie 6 ETF obchodovaných na NYSE
(VOO, IVV, SPY, QQQ, VTI, SCHD) + kalkulačka dopadu poplatkov. Návštevník dostáva
osobný report výměnou za e-mail.

**Stack:** čisté HTML + CSS + vanilla JS, bez build kroku. Nasadenie: Vercel
(statické súbory + serverless funkcie).

---

## 1. Cieľová skupina a mechanika konverzie

| Otázka | Odpoveď |
|---|---|
| Kto | Čech/Češka 25–45 rokov, mobil, začiatočník/pokročilý, mesačne odkladá, zvažuje brokera (Fio, Trading 212, DEGIRO, Portu), bojí sa poplatkov a dane z dividend |
| Odkiaľ | Meta / Google Ads, studený traffic, ~5 s pozornosti |
| Čo dostanete výmenou | **Osobný report**: vlastný prepočet straty na poplatkoch (číslo z kalkulačky) + rozbor 6 ETF + checklist prvých krokov (W-8BEN, broker, prvý nákup) |
| Kedy žiadame kontakt | Až po voľne prístupných prvkoch – porovnávacia tabuľka, grafy a kalkulačky. Formulár je logický ďalší krok, nie skok |
| Polia formulára | **1 pole (e-mail)** + GDPR checkbox + honeypot |
| Čo nasleduje po odoslaní | okamžitá `thank-you.html?id=…` zobrazujúca PDF zhodné s prílohou e-mailu. Do Redis sa ukladá **len model** vstupov; PDF sa z neho vygeneruje znova cez `/api/report`. |

Hodnota je zrejmá pred vyplnením: tabuľka i kalkulačka sú funkčné bez e-mailu. E-mail je potrebný na uloženie/odoslanie reportu.

---

## 2. Dôvod poradia sekcií

Návštevník prichádza z mobilu na 5 sekúnd = rozhoduje prvá obrazovka a jeden sľub.

1. **Hero (1. obrazovka)** – zrkadlo reklamy (message match). Číselný hák „235 000 Kč" (vypočítané, viz §5) + jasný prísľub „spočítajte si to za 30 sekúnd". Dve CTA: primárna vedie na kalkulačku (okamžitá hodnota), sekundárna na tabuľku. Úmyselne **nevedie priamo na formulár** – studený návštevník nie je pripravený dať e-mail.
2. **Tri fakty** – číselné údaje so zdrojmi (0,03 % vs 0,41 %; 3× dráž SPY; daň 15 % vs 30 %). Dôvera cez zdroje, nie cez logá klientov, ktoré nemáme.
3. **Porovnávacia tabuľka (voľná)** – prvá skutočná hodnota. Návštevník si odnáša odpoveď bez registrácie → dôvera → ochota pokračovať.
4. **Grafy (voľné)** – historický vývoj VOO + modelový dopad poplatkov (sekcia `#grafy`).
5. **Kalkulačka dane z dividend / W-8BEN (voľná)** – sekcia `#dan`.
6. **Kalkulačka portfólia (voľná)** – sekcia `#portfolio`.
7. **Kalkulačka poplatkov (voľná, interaktívna)** – emocionálny motor: osobné číslo. Tu sa mení správanie z „zaujímavé" na „to sa týka mňa".
8. **Formulár** – žiadosť o kontakt v momente, keď návštevník vidí svoju stratu.
9. **Ako to funguje (3 kroky)** – odstraňuje strach zo záväzku a z „predaja".
10. **FAQ** – posledné námietky (dane, broker, „nie je to odporúčanie") až po formulári, pretože ľudia čítajú FAQ skôr po rozhodnutí než pred ním.
11. **Záverečné CTA** – pre tých, čo prešli celú stránku.
12. **Sticky mobilná lišta** – po opustení hero je CTA neustále na dosah palca; zmizne vnútri sekcie formulára, aby neprekážala.

---

## 3. Meranie celej cesty

Udalosti (`assets/js/main.js` → `window.etfTrack`):

> **Stav merania:** skript Vercel Analytics (`/_vercel/insights/script.js`) sa načíta **až po súhlase** v cookie lište (`consent.js`; `localStorage` kľúč `etf_consent`). Custom eventy z `window.etfTrack()` idú cez `window.va('track')` len ak je súhlas udelený a Web Analytics zapnuté vo Vercel dashboarde. UTM z URL sa pre aktuálnu návštevu použijú v lead payloade vždy; ukladanie do `localStorage` (`etf_utm`) len so súhlasom. `dataLayer` (GTM) stránka neinicializuje. Na localhoste sa eventy logujú len do konzoly. **`report_view` sa nemerá** – `thank-you.html` ho pushuje len do (neinicializovaného) `dataLayer` a do konzoly.

| Event | Kedy | Čo meria |
|---|---|---|
| `page_view` | načítanie | 100 % návštev |
| `cta_click` (hero / tabuľka / kalkulačka / sticky / finálny) | kliknutie na CTA | záujem o pokračovanie |
| `table_sort` | triedenie tabuľky | zapojenie do obsahu |
| `calc_change` | zmena fondu v kalkulačke | osobné zapojenie |
| `portfolio_complete` | vyplnené váhy portfólia (súčet 100 %) | dokončenie kalkulačky portfólia |
| `faq_open` | rozbalenie otázky v FAQ | čo návštevníka zaujíma |
| `form_view` | formulár vo viewportu 40 % | dosiahnutie zóny konverzie |
| `form_error` | nevalidný e-mail / súhlas / sieť | kde sa stratia leady |
| `form_submit` | úspešné odoslanie | **konverzia** |
| `report_view` | zobrazenie thank-you | **len lokálne v konzole** – do analytiky sa neposiela |

**Atribúcia:** UTM parametre z URL sa ukladajú do `localStorage`
(`etf_utm`) a odosielajú sa spolu s leadom. V logu Vercel funkcie `[lead]`
vidíte `email + utm` a **boolean prítomnosti sekcií**
(`sections: {calc: true/false, portfolio: …, tax: …}`) – nie konkrétne vstupy
kalkulačky (tie sú len v uloženom modeli v Redis). Cesta **teda** v kóde je
úplná: **reklama → príchod → interakcia → formulár → odoslanie → report**,
každý lead nesie zdroj – ale vizualizáciu cesty v dashboarde treba ešte
napojiť.

**Hypotéza (očakávanie na 100 návštev):** 100 page_view → 35–45 `form_view`
→ 8–12 `form_submit`. Overuje sa (až po zapnutí analytiky) v dashboarde +
filtrovaním `[lead]` logov funkcie `api/lead`.

---

## 4. Očakávaná konverzia

**8–12 % lead CVR** (form_submit / unique page_view) na studenom mobilnom trafficu.

- dôvod optimizmu: lead magnet je číselne personalizovaný, formulár má 1 pole, hodnota je viditeľná pred formulárom, sticky CTA
- dôvod opatrnosti: studený traffic, mobil, dôvera k finančnému obsahu
- medzikroky: CTR z reklamy na stránku očakávame 1,2–2 %, bounce < 55 %, `form_view` rate 35–45 % z page_view

---

## 5. Reálne dáta a zdroje

| Údaj | Hodnota | Zdroj (overené 10/2026) |
|---|---|---|
| TER VOO | 0,03 % | Vanguard fact sheet, 30. 9. 2026 |
| TER IVV | 0,03 % | iShares summary prospectus, 31. 7. 2026 |
| TER SPY | 0,0945 % | State Street product listing, 9. 7. 2026 |
| TER QQQ | 0,18 % | invesco.com (Invesco QQQ) |
| TER VTI | 0,03 % | Vanguard fact sheet, 30. 9. 2026 |
| TER SCHD | 0,060 % | schwabassetmanagement.com, 23. 10. 2026 |
| Priemerný indexových fondov S&P 500 | 0,41 % | Vanguard fact sheet (31. 12. 2025) |
| Výnos S&P 500 | ≈ 10 % p.a. od 1957 | Fidelity (2026); Damodaran, NYU Stern: 10,02 % 1928–2025 |
| Daň z dividend USA | 30 % → 15 % s W-8BEN | Zmluva ČR–USA č. 32/1994 z.z., čl. 10 (MF ČR / IRS) |

**Výpočet hero čísla (235 000 Kč):** východiskový scénár kalkulačky
100 000 Kč vklad + 3 000 Kč/mesiac × 25 rokov, hrubý výnos 8 % p.a.,
mesačné zložené úročenie. Rozdiel konečnej hodnoty pri TER 0,41 % vs 0,03 %
= **234 728 Kč** (zaokruhlené). Kalkulačka používa rovnakú metódu
(`assets/js/calculator.js`, funkcia `futureValue`).

---

## 6. Dve verzie reklamy

> Hero stránky je vyladený na **verzii A** (message match). Pri spustení verzie B upravte H1 + sub v `index.html` a `og:title` (hypotéza A/B č. 1).

### Verzia A – strata (východisková, aktuálne nasadená)
- **Headline (H1 v `index.html`):** Vaše ETF vás může připravit o 235 000 Kč. Aniž byste to zjistili.
- **Sub:** Stejná indexová sledka, dva fondy, rozdílný poplatek. Porovnejte 6 ETF obchodovaných na NYSE a spočítejte si dopad poplatků na vaše peníze. Zabere to 30 sekund.
- **CTA:** Spočítat moje ztracené peníze (primárna) + Rovnou porovnat ETF (sekundárna)

### Verzia B – jednoduchosť
- **Headline:** První kroky s ETF bez zbytečných poplatků: osobní report + checklist.
- **Text:** Nevíte, který broker si vybrat? Porovnali jsme 6 fondů na NYSE, přepočitali dopad poplatků a připravili checklist prvních kroků (W-8BEN, broker, první nákup). Zadejte e-mail a dostanete osobní report.

- **CTA:** Zjistit více

---

## 7. A/B hypotézy (zoradené podľa očakávaného dopadu)

| # | Hypotéza | Varianta A (kontrola) vs. B | Prečo práve toto poradie | Metrika |
|---|---|---|---|---|
| **1** | Číselný hook v hero poráža všeobecný headline | „Vaše ETF vás může připravit o 235 000 Kč" vs. „Srovnání ETF pro českého investora" | Headline je jediný text, ktorý studený mobilný návštevník stihne prečítať; ovplyvňuje bounce aj všetky ďalšie kroky naraz = najväčší multiplikátor | bounce rate + CTR z hero (30 sekúnd) |
| **2** | Formulár s 1 poľom konvertuje viac ako e-mail + meno | len e-mail vs. e-mail + meno (meno zvyšuje personalizáciu e-mailu) | priamy vplyv na hlavnú metriku, nízke riziko, ľahko testovateľné | form_submit / form_view |
| **3** | Voľná kalkulačka + formulár pod ňou poráža gate za e-mailom | výsledok viditeľný okamžite vs. výsledok až po zadaní e-mailu | gate môže zdvihnúť konverzný pomer, ale zabiť dôveru a zdieľanie – preto až tretí, vyššie riziko | form_submit / page_view; sekundárne bounce |

Realizácia: `utm_campaign` (a ostatné UTM) sa zachytí z URL, uloží do `localStorage` (`etf_utm`) a pošle spolu s leadom na `/api/lead`. Oddelené URL varianty (`?v=B`) a dynamická zmena obsahu podľa varianty **nie sú ešte implementované** — treba pridať logiku, ktorá podľa `?v=A`/`?v=B` zmení H1/sub v hero. Eventy (`page_view`, `cta_click`, `table_sort`, `form_view`, `form_submit`, `form_error`) volá `window.etfTrack()`; do Vercel Analytics sa reálne dostanú cez `window.va('track')` (skript je vložený, treba zapnutý Web Analytics, viď §3).

---

## 8. Spustenie (deploy na Vercel)

### 1) Resend kľúč (e-maily)
1. Účet zdarma na <https://resend.com> (3 000 e-mailov/mesiac, 100/deň).
2. V dashboarde → **API Keys** → vytvoriť kľúč, skopírovať.
3. Overiť odosielateľa: bez vlastnej domény funguje len
   `ETF Clientelo <onboarding@resend.dev>` na váš vlastný overený e-mail
   (vo free pláne stačí). Pred reálnou kampaňou pridajte vlastnú doménu
   (SPF/DKIM) a nastavte `RESEND_FROM`.

### 2) Deploy
```bash
# z tohoto adresára
npx vercel          # prvýkrát – prihlásenie + výber projektu (Hobby, zdarma)
npx vercel --prod   # produkcia
```
alebo: nahrajte repo ako projekt na vercel.com (framework: Other, build command: prázdny, output: prázdny – statické súbory sa nasadia samé).

### 3) Premenné prostredia (Project → Settings → Environment Variables)
| Variable | Hodnota |
|---|---|
| `RESEND_API_KEY` | kľúč z kroku 1 (voliteľné – bez neho sa leady ukladajú do Redis a vracia sa `mode: "log_only"`, e-mail sa nepošle) |
| `RESEND_FROM` | napr. `ETF Clientelo  <onboarding@resend.dev>` (voliteľné) |
| `REPLY_TO` | e-mail na odpovede (voliteľné) |
| `UPSTASH_REDIS_REST_URL` | REST URL z Upstash (**potrebné pre fungujúci flow** – bez neho endpoint vracia `503 db_not_configured` a formulár pre používateľa zlyhá) |
| `UPSTASH_REDIS_REST_TOKEN` | REST token z Upstash (rovnako potrebné) |
| `UNSUBSCRIBE_SECRET` | voliteľné – podpis odkazov na odhlásenie v e-mailoch (bez neho sa použije `RESEND_API_KEY`) |

**Bez `RESEND_API_KEY`** (s nakonfigurovaným Redis) endpoint vracia `200` a loguje `mode: "log_only"` – lead je uložený, reportId vrátené, e-mail neodíde.
**Bez `UPSTASH_*`** endpoint vracia `503` s telom `{ "error": "db_not_configured" }` – konverzný flow **nefunguje**.

### Odhlásenie (unsubscribe)
Každý odoslaný e-mail obsahuje odkaz `/api/unsubscribe?token=…` (HMAC-podpísaný e-mail) a hlavičky
`List-Unsubscribe` + `List-Unsubscribe-Post` (one-click, RFC 8058). Kliknutie alebo POST z e-mailového
klienta zmaže lead z Redis (`newsletter:lead:<email>` + `newsletter:emails`). Endpoint vracia
`400` bez tokenu, `401` pri zlom podpise, `503` bez Redis.

### Upstash Redis (databáza leadov)
1. Účet zdarma na <https://upstash.com> → **Create database** (free tier).
2. V sekcii **REST API** skopírovať `UPSTASH_REDIS_REST_URL` a `UPSTASH_REDIS_REST_TOKEN`.
3. Pridať ako environment variables (vyššie) a redeploy.

Lead sa uloží **iba keď používateľ zaškrtol súhlas** (overené aj serverom –
bez `consent: true` vracia endpoint `422 consent_required` a neuloží nič).
Každý záznam obsahuje e-mail, čas súhlasu, IP, UTM, stránku a referrer
(klúč `newsletter:lead:<email>` + index `newsletter:emails`). Bez premenných
(`UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`) endpoint vracia HTTP 503
s telom `{ "error": "db_not_configured" }`.

### 4) Overenie
- `POST /api/lead` s validným telom a nakonfigurovaným Redis → `{"ok":true, "stored":true, "reportId":"…"}` (bez Redis → `503 db_not_configured`)
- odoslanie formulára → presmerovanie na `/thank-you.html?id=…`
- v dashboarde Vercel → Deployments → fungovanie → Logs → riadky `[lead]` s `email + utm + sections` (boolean, nie hodnoty kalkulačky)

### Lokálny vývoj
```bash
npm test             # testy modelu, PDF a endpointov (bez siete)
npx serve .          # IBA statický náhľad – formulár sa lokálne NEODOŠLE
                     # (žiadne /api), zobrazí sa jasná chybová hláška
npx vercel dev       # plný beh vrátane /api/lead a /api/report
                     # (vyžaduje vercel login + UPSTASH env premenné;
                     #  RESEND voliteľný – bez neho log_only)
```

Celý flow (odoslanie → uložený model → regenerované PDF → zobrazenie v `thank-you.html?id=…` → e-mail) funguje až v prostredí, ktoré má serverless funkcie – teda na Vercel deployi, alebo lokálne cez `npx vercel dev`. PDF sa neukladá do Redis trvalo; ukladá sa len model (vstupy kalkulačky/portfóla/dane) a PDF sa z neho vygeneruje znova pri každom načítaní `thank-you.html?id=…` cez endpoint `/api/report`. E-mail dostane PDF ako prílohu priamo počas odosielania formulára.

---

## 9. Štruktúra súborov

```
index.html            – landing page (hero → fakty → tabuľka → grafy → daň →
                        portfólio → kalkulačka → formulár → FAQ → finálne CTA)
thank-you.html        – stránka s reportom (iframe cez /api/report?id=…)
soukromi.html         – zásady ochrany osobných údajov (vrátane zoznamu
                        spracovateľov: Resend, Upstash, Vercel)
assets/css/style.css  – dizajn (editorial fintech, mobil-first)
assets/data/          – statické dáta (napr. voo-history.json pre graf)
assets/js/main.js     – UTM, eventy, sticky lišta, odoslanie formulára (presmerovanie na ?id=)
assets/js/consent.js  – cookie lišta; Vercel Analytics a UTM localStorage len po súhlase
assets/js/table.js    – porovnávacia tabuľka (radenie, dáta + zdroje)
assets/js/calculator.js – výpočet erózie poplatkov (8 % p.a., mesačné zložené úročenie)
assets/js/portfolio.js – kalkulačka váh portfólia
assets/js/tax-calculator.js – kalkulačka dane z dividend (W-8BEN)
assets/js/charts.js   – grafy (cena VOO + modelový dopad poplatkov)
lib/report.js          – JEDINÝ zdroj pravdy: sanitizácia vstupov + model + texty sekcií reportu
lib/report-pdf.js      – PDF generátor (pdfkit + DejaVu, česká diakritika)
lib/store.js           – ukladanie/načítanie modelov reportov v Upstash Redis
                        (kľúč report:<id>, TTL 30 dní; PDF sa neukladá)
api/lead.js            – serverless endpoint: validácia → uloženie leadu → 1 PDF
                        (len na prílohu e-mailu) → model do Redis → Resend → reportId
api/report.js          – servírovanie PDF vygenerovaného z uloženého modelu
                        (zhodný obsah ako e-mailová príloha)
api/unsubscribe.js     – one-click odhlásenie (GET/POST ?token=, List-Unsubscribe)
lib/unsubscribe.js     – HMAC podpis/overenie tokenu + zmazanie leadu z Redis
scripts/fetch-voo.cjs  – načítanie histórie cien VOO do assets/data
tests/                 – node --test (model, PDF, endpointy, regenerácia PDF
                         z modelu, validácia vstupov)
.env.example           – popis premenných
```

## 10. Právne / compliance
- Disclaimer na stránke i v pätičke: nie je investičné poradenstvo.
- GDPR: účel spracovania = e-mail na zaslanie reportu (+ súvisiace tipy), súhlas checkboxom, odhlásenie odkazom v e-maile (one-click).
  **Spracovatelia (tretie strany):** Resend (odosielanie), Upstash Redis (ukladanie: e-mail, čas súhlasu, IP, UTM, stránka, referrer), Vercel (hosting + serverless), Google Fonts (písma). Zoznam je aj v `soukromi.html` – tvrdenie „žiadne tretie strany" by bolo nepravdivé.
  **Cookies:** cookie lišta (`consent.js`) – Vercel Analytics a `localStorage` (`etf_utm`) len po súhlase; bez súhlasu sa meranie nespúšťa.
- Všetky čísla so zdrojom; výnosný predpoklad 8 % p.a. je zrejmý pri kalkulačke.

## 11. Práca s AI agentmi

### Ako som dával pokyny agentom

- **Rozdelenie dlhých zadaní** – ak to bolo potrebné, zadania som rozdelil na kroky. Najkomplexnejšie úlohy som nechával analyzovať ChatGPT, ktorý vedel vytvoriť prompty pre tieto úlohy pre iných AI agentov, príp. ich rozdeliť na menšie časti.
- **Presné a štruktúrované zadania** – buď som rozdelil zadania, ako opísané v predchádzajúcom bode, alebo som sa snažil odovzdávať agentom pokyny tak, aby riešili len jednu jednoduchú opravu, kým danú vec neurobili. 
- **Overenie pred ukončením** – niekedy som požiadal aj samotného AI agenta o overenie výstupu, no implementované funkcie som otestoval aj manuálne.

### Ako som kontroloval výstup

Výstup AI agentov som kontroloval manuálne tak, že som zadal agentovi napr. jednu väčšiu, alebo 2-3 menšie funkcie, ktoré mal implementovať, a ktoré som potom otestoval. Ak išlo len o vizuálne opravy, kontrola bola jednoduchá a okamžitá. Po tom, čo už bol funkčný e-mailový formulár, som už ale testoval funkcie až po commite/deployi, keďže mi na localhoste nefungovalo odosielanie e-mailov.

Ak sa ukázalo, že nejaká funkcionalita nefungovala tak, ako mala, agentovi som to oznámil a povedal mu, aby to opravil. To som robil dovtedy, kým daná funkcia nebola správne naprogrovaná. Raz sa ale stalo aj to, že som musel zmeniť samotný nástroj na AI (z KiloCode na OpenCode), lebo KiloCode sa zasekol a odmietol naprogramovať danú funkciu.

### Kde sa agenti pomýlili

| Chyba | Kontext | Ako som to opravil |
|---|---|---|
| **Miešanie češtiny a slovenčiny** | UI texty v kóde boli česko-slovensky | Preložil som texty do češtiny. |
| **HTML nesting bug – skrytá celá stránka** | V `ses_e839` bolo otvorené `<section id="dan" hidden>` bez uzatváracieho tagu, čo schovalo celý obsah pod ním (kalkulačka, portfólio, tabuľka atď.) | Odstránil som neuzavretú sekciu #dan. |
| **PDF text zarovnaný vpravo (checklist)** | Predchádzajúca inštrukcia nechala kurzor na pravej strane suboru, takže checklist bol v úzkej pravej štvrtine | Opravené – pridané `doc.x = PAGE_MARGIN` na začiatok `sectionTitle()` (`lib/report-pdf.js:64`), takže každý nadpis sekcie (vrátane checklistu) začína na ľavom okraji ako ostatné prvky; posledná oprava fungovala |
| **Dva nezávislé PDF generátory** | V `ses_e78e` existovali dva rozdielne PDF generátory, jeden pre PDF na stránke, druhý pre PDF v e-maili, každý s vlastnou štruktúrou dát. | Generátory som zjednotil do jedného, ktorý generuje jedno spoločné PDF. |
| **Tlačidlo W-8BEN neposúvalo na sekciu e-mailu** | Opravované viacnásobne, bez výsledku | Nakoniec som danú časť nechal AI zmazať a urobiť nanovo |
| **E-mailový formulár sa nedalo odoslať na localhoste** | Endpoint `/api/lead` nie je dostupný bez Vercela | Testoval som až po commite/deployi, ako je uvedené na začiatku tejto časti |
| **Nefungujúce odosielanie e-mailov po prerobení DB** | Po tom, čo som implementoval pomocou AI to, aby sa už base64 PDF súbora neukladalo do databázy, sa prestali odosielať e-maily | Deklarovanú konštantu som presunul mimo try block, keďže to spôsobovalo chybu pri pokuse o odoslanie prílohy.
| **Nepochopenie požiadavky** | Namiesto úpravy README.md podľa stavu stránky začal agent opravovať stránku podľa README.md. | Požiadal som agenta, aby vrátil stránku do predošlého stavu a upresnil som požiadavku.

## 12. Čo sa mi nepodarilo a možnosti pokračovania vývoja

- zobraziť vo Verceli pokročilé štatistiky,
- doplniť logiku, ktorá podľa `?v=A`/`?v=B` bude vedieť urobiť A/B testovanie,
- vylepšiť dizajn stránky tak, aby vyzeral profesionálnejšie (napr. pridaním ilustračných obrázkov)
- rozdelenie obsahu hlavnej stránky na podstránky
- pridanie ďalších investičných kalkulačiek a nástrojov
