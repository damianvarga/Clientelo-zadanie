# ETF Clientelo – konverzná landing page (Zadanie B)

Lead magnet pre českého drobného investora: porovnanie 6 ETF obchodovaných na NYSE
(VOO, IVV, SPY, QQQ, VTI, SCHD) + kalkulačka dopadu poplatkov. Návštevník dostáva
osobný report výměnou za e-mail.

**Stack:** čisté HTML + CSS + vanilla JS, bez build kroku. Nasadenie: Vercel
(statické soubory + serverless funkcie `api/lead.js`).

---

## 1. Cieľová skupina a mechanika konverzie

| Otázka | Odpoveď |
|---|---|
| Kto | Slovák/Slovenka 25–45 rokov, mobil, začiatočník/pokročilý, mesačne odkladá, zvažuje brokera (Fio, Trading 212, DEGIRO, Portu), bojí sa poplatkov a dane z dividend |
| Odkiaľ | Meta / Google Ads, studený traffic, ~5 s pozornosti |
| Čo dostanete výmenou | **Osobný report**: vlastný prepočet straty na poplatkoch (číslo z kalkulačky) + rozbor 6 ETF + checklist prvých krokov (W-8BEN, broker, prvý nákup) |
| Kedy žiadame kontakt | **Až po dvoch voľne prístupných prvkoch** – srovnávacia tabuľka a kalkulačka sú zadarmo, návštevníka už vidí svoje číslo. Formulár je logický ďalší krok, nie skok |
| Polia formulára | **1 pole (e-mail)** + GDPR checkbox + honeypot |
| Čo nasleduje po odoslaní | okamžitá `thank-you.html?id=…` zobrazujúca **ten istý PDF súbor**, ktorý je prílohou e-mailu (generuje sa raz na serveri, uloží sa v Redis), e-mail do 2 minút (Resend) |

Hodnota je zrejmé **pred** vyplnením: tabuľka i kalkulačka sú kompletné funkčné bez e-mailu. E-mail je „iba" na uloženie/odoslanie reportu.

---

## 2. Prečo v takom poradí sekcií (odôvodnenie)

Návštevník prichádza z mobilu na 5 sekúnd = rozhoduje prvý obrazovka a jeden slib.

1. **Hero (1. obrazovka)** – zrkadlo reklamy (message match). Číselný hák „235 000 Kč" (vypočítané, viz §5) + jasný prísľub „spočítajte si to za 30 sekúnd". Dve CTA: primárna vedie na kalkulačku (okamžitá hodnota), sekundárna na tabuľku. Úmyselne **nevedie priamo na formulár** – studený návštevník nie je pripravený dať e-mail.
2. **Tri fakta** – rýchle „bolesti" číslami so zdrojmi (0,03 % vs 0,41 %; 3× dráž SPY; daň 15 % vs 30 %). Dôvera cez zdroje, nie cez logá klientov, ktoré nemáme.
3. **Porovnávacia tabuľka (voľná)** – prvá skutočná hodnota. Návštevník si odnáša odpoveď bez registrácie → dôvera → ochota pokračovať.
4. **Kalkulačka (voľná, interaktívna)** – emocionálny motor: osobné číslo. Tu sa mení správanie z „zaujímavé" na „to sa týka mňa". Teprv pod ňou…
5. **Formulár** – žiadosť o kontakt v momente, keď návštevník vidí svoju stratu. Presne pravidlo: hodnota zrejmé → potom formulár.
6. **Ako to funguje (3 kroky)** – odstraňuje strach zo záväzku a z „predaja".
7. **FAQ** – posledné námietky (dane, broker, „nie je to odporúčanie") až po formulári, pretože ľudia čítajú FAQ skôr po rozhodnutí než pred ním.
8. **Záväerné CTA** – pre tých, čo prešli celú stránku.
9. **Sticky mobilná lišta** – po opustení hero je CTA neustále na dosah palca; zmizne vnútri sekcie formulára, aby neprekážala.

---

## 3. Meranie celej cesty

Udalosti (`assets/js/main.js`, volajú `window.etfTrack` → `dataLayer` + Vercel Analytics `va('track')`):

| Event | Kedy | Čo meria |
|---|---|---|
| `page_view` | načítanie | 100 % návštev |
| `cta_click` (hero / tabuľka / kalkulačka / sticky / finálny) | kliknutie na CTA | záujem o pokračovanie |
| `table_sort` | triedenie tabuľky | zapojenie do obsahu |
| `calc_change` | zmena fondu v kalkulačke | osobné zapojenie |
| `form_view` | formulár vo viewportu 40 % | dosiahnutie zóny konverzie |
| `form_error` | nevalidný e-mail / súhlas / sieť | kde sa stratia leady |
| `form_submit` | úspešné odoslanie | **konverzia** |
| `report_view` | zobrazenie thank-you | dokončenie cesty |

**Atribúcia:** UTM parametre z URL sa ukladajú do `localStorage`
(`etf_utm`) a odosielajú sa spolu s leadom → v logu Vercel funkcie vidíte
`email + utm_source/utm_campaign + vstupy kalkulačky`. Cesta je **teda** úplná:
**reklama → príchod → interakcia → formulár → odoslanie → report**, každý lead
nesie zdroj.

**Lievik (očakávanie na 100 návštev):** 100 page_view → 35–45 `form_view`
→ 8–12 `form_submit`. Overuje sa v dashboardu Vercel Analytics + filtrovaním
`[lead]` logov funkcie `api/lead`.

---

## 4. Očakávaná konverzia

**8–12 % lead CVR** (form_submit / unique page_view) na studenom mobilnom trafficu.

- dôvod optimizmu: lead magnet je číselne personalizovaný, formulár má 1 pole,
  hodnota je viditeľná pred formulárom, sticky CTA
- dôvod opatrnosti: studený traffic, mobil, dôvera k finančnému obsahu
- medzikroky: CTR z reklamy na stránku očakávame 1,2–2 %, bounce < 55 %,
  `form_view` rate 35–45 % z page_view

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

> Hero stránky je vyladěný na **verzi A** (message match). Při spuštění verze B
> upravte H1 + sub v `index.html` a `og:title` (hypotéza A/B č. 1).

### Verzia A – strata (východisková)
- **Headline:** Poplatky vás připraví o 235 000 Kč. Spočítajte si to za 30 sekúnd.
- **Text:**  Šest najpopulárnejších ETF (VOO, IVV, SPY, QQQ, VTI, SCHD) má rozdielne poplatky. Zjistěte, kolik vás v čase stojí TER a daň z dividend – a kolik ušetríte s W-8BEN. 

Získat osobný report zdarma ->
- **CTA:** Spočítat

### Verzia B – jednoduchosť
- **Headline:** První kroky s ETF bez zbytečných poplatků: osobní report + checklist.
- **Text:** Nevíte, který broker si vybrat? Porovnali sme 6 fondů na NYSE, přepočitali dopad poplatků a připravili checklist prvních kroků (W-8BEN, broker, první nákup). Zadejte e-mail a dostanete osobní report.

Získat osobní report zdarma ->
- **CTA:** Zjistit více

---

## 7. A/B hypotézy (zoradené podľa očakávaného dopadu)

| # | Hypotéza | Varianta A (kontrola) vs. B | Prečo práve toto poradie | Metrika |
|---|---|---|---|---|
| **1** | Číselný hook v hero poráží všeobecný headline | „Vaše ETF vás může připravit o 235 000 Kč" vs. „Srovnání ETF pro českého investora" | Headline je jediný text, ktorý studený mobilný návštevník stihne prečítať; ovplyvňuje bounce aj všetky ďalšie kroky naraz = najväčší multiplikátor | bounce rate + CTR z hero (30 sekúnd) |
| **2** | Formulár s 1 poľom konvertuje viac ako e-mail + meno | len e-mail vs. e-mail + meno (meno zvyšuje personalizáciu e-mailu) | priamy vplyv na hlavnú metriku, nízke riziko, ľahko testovateľné | form_submit / form_view |
| **3** | Voľná kalkulačka + formulár pod ňou poráža gate za e-mailom | výsledok viditeľný okamžite vs. výsledok až po zadaní e-mailu | testuje jadro mechaniciky lead magnetu; gate môže zdvihnúť CVR, ale zabiť dôveru a zdieľanie – preto až tretí, vyššie riziko | form_submit / page_view; sekundárne bounce |

Realizácia: oddelené URL varianty (`?v=B`) + rozdielne `utm_campaign`, eventy
sú už napojené na `dataLayer`.

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
# z tohoto adresáře
npx vercel          # prvý krát – prihlásenie + výber projektu (Hobby, zdarma)
npx vercel --prod   # produkce
```
alebo: nahrajte repo ako projekt na vercel.com (framework: **Other**,
build command: prázdný, output: prázdný – statické soubory sa nasadia samy).

### 3) Premenné prostredia (Project → Settings → Environment Variables)
| Variable | Hodnota |
|---|---|
| `RESEND_API_KEY` | kľúč z kroku 1 (voliteľné – bez neho sa leady zapisujú do logov) |
| `RESEND_FROM` | napr. `ETF Clientelo <report@vasedomena.cz>` (voliteľné) |
| `REPLY_TO` | váš e-mail na odpovede (voliteľné) |
| `UPSTASH_REDIS_REST_URL` | REST URL z Upstash (voliteľné – bez neho sa leady neukladajú do DB) |
| `UPSTASH_REDIS_REST_TOKEN` | REST token z Upstash (voliteľné) |

Bez kľúča stránka **plne funguje** – endpoint vracia `200` a loguje `{"mode":"log_only"}`.

### Upstash Redis (databáza leadov)
1. Účet zdarma na <https://upstash.com> → **Create database** (free tier).
2. V sekcii **REST API** skopírovať `UPSTASH_REDIS_REST_URL` a `UPSTASH_REDIS_REST_TOKEN`.
3. Pridať ako environment variables (vyššie) a redeploy.

Lead sa uloží **iba keď používateľ zaškrtol súhlas** (overené aj serverom –
bez `consent: true` vracia endpoint `422 consent_required` a neuloží nič).
Každý záznam obsahuje e-mail, čas súhlasu, IP, UTM, stránku a referrer
(klúč `lead:<email>` + index `leads:index`). Bez premenných je odpoveď
`{"ok":true,"stored":false}`.

### 4) Overenie
- `POST /api/lead` s validným telom → `{"ok":true}`
- odoslanie formulára → presmerovanie na `/thank-you.html` s číslami
- v dashboarde Vercel → Deployments → fungovanie → Logs → riadky `[lead]`
  s `email + utm + calc`

### Lokálny vývoj
```bash
npm test             # testy modelu, PDF a endpointov (bez siete)
npx serve .          # IBA statický náhľad – formulár sa lokálne NEODOŠLE
                     # (žiadne /api), zobrazí sa jasná chybová hláška
npx vercel dev       # plný beh vrátane /api/lead a /api/report
                     # (vyžaduje vercel login + UPSTASH/RESEND env premmenné)
```

Celý flow (odoslanie → uložené PDF → zobrazenie v `thank-you.html?id=…` → e-mail)
funguje až v prostredí, ktoré má serverless funkcie – teda na Vercel deployi
alebo lokálne cez `npx vercel dev`. Obidva endpointy pracujú s **tým istým
uloženým PDF súborom** v Upstash Redis.

---

## 9. Štruktúra súborov

```
index.html            – landing page (hero → fakta → tabulka → kalkulačka → formulár → FAQ)
thank-you.html        – stránka s reportom (zobrazuje uložený PDF súbor cez /api/report)
assets/css/style.css  – dizajn systém (editorial fintech, mobil-first)
assets/js/main.js     – UTM, eventy, sticky lišta, odoslanie formulára (presmerovanie na ?id=)
assets/js/table.js    – srovnávací tabulka (řazení, data + zdroje)
assets/js/calculator.js – výpočet eroze poplatků (8 % p.a., měsíční složené úročení)
lib/report.js          – JEDINÝ zdroj pravdy: sanitizácia vstupov + model + texty sekcií reportu
lib/report-pdf.js      – jediný PDF generátor (pdfkit + DejaVu, česká diakritika)
lib/store.js           – ukladanie/načítanie PDF reportov v Upstash Redis
api/lead.js            – serverless endpoint: validácia → 1 PDF → Redis → Resend → reportId
api/report.js          – servírovanie uloženého PDF (ten istý súbor ako e-mailová príloha)
tests/                 – node --test (model, PDF, endpointy, identita PDF pre web/e-mail)
.env.example           – popis premenných
```

## 10. Právne / compliance
- Disclaimer na stránke i v pätičke: nie je investičné poradenstvo.
- GDPR: jediné spracovanie = e-mail na zaslanie reportu, súhlas checkboxom, odhlásenie v každom e-maile, žiadne tretie strany.
- Všetky čísla so zdrojom; výnosný predpoklad 8 % p.a. je zrejmý pri kalkulačke.

## 11. Práca s AI agentmi

### Ako som dával pokyny agentom

- **Rozdelenie dlhých zadaní** – ak to bolo potrebné, zadania som rozdelil na kroky. Najkmplexnejšie úlohy som nechával analyzovať ChatGPT, ktorý vedel vytvoriť prompty pre tieto úlohy pre iných AI agentov, príp. ich rozdeliť na menšie časti.
- **Presné a štruktúrované zadania** – buď som rozdelil zadania, ako opísané v predchádzajúcom bode, alebo som sa snažil odovzdávať agentom pokyny tak, aby riešili len jednu jednoduchú opravu, kým danú vec neurobili. 
- **Overenie pred ukončením** – niekedy som požiadal aj samotného AI agenta o overenie výstupu, no implementované funkcie som otestoval aj manuálne.

### Ako som kontroloval výstup

Výstup AI agentov som kontroloval manuálne tak, že som zadal agentovi napr. jednu väčšiu, alebo 2-3 menšie funkcie, ktoré mal implementovať, a ktoré som potom otestoval. Ak išlo len o vizuálne opravy, kontrola bola jednoduchá a okamžitá. Po tom, čo už bol funkčný e-mailový formulár, som už ale testoval funkcie až po commite/deployi, keďže mi na localhoste nefungovalo odosielanie e-mailov.

Ak sa ukázalo, že nejaká funkcionalita nefungovala tak, ako mala, agentovi som to oznámil a povedal mu, aby to opravil. To som robil dovtedy, kým daná funkcia nebola správne naprogrovaná. Raz sa ale stalo aj to, že som musel zmeniť samotný nástroj na AI (z KiloCode na OpenCode), lebo KiloCode sa zasekol a odmietol naprogramovať danú funkciu.

### Kde sa agenti pomýlili

| Chyba | Kontext | Ako som to opravil |
|---|---|---|
| **Miešanie češtiny a slovenčiny** | UI texty v kóde boli česko-slovensky | Preložil som texty do češtiny. |
| **HTML nesting bug – skrytá celá stránka** | V `ses_e839` bolo otvorené `<section id="dan" hidden>` bez uzatváracieho tagu, čo schovalo celý obsah pod ním (kalkulačka, portfólio, tabuľka atď.) | Odstránil som zatváraciu zatvorku a nechal sekcie viditeľné |
| **PDF text zarovnaný vpravo (checklist)** | V `ses_e789` `renderList` používalo `continued: true` bez resetu `doc.x`; predchádzajúca `renderTable` nechala kurzor na x≈435, takže checklist bol v úzkej pravé štvrtine | V `lib/report-pdf.js:124` som pred každou položkou nastavil `doc.x = PAGE_MARGIN` a `align: "justify"` |
| **Dva nezávislé PDF generátory** | V `ses_e78e` existovali dva rozdielne PDF generátory, jeden pre PDF na stránke, druhý pre PDF v e-maili, každý s vlastnou štruktúrou dát. | Generátory som zjednotil do jedného, ktorý generuje jedno spoločné PDF. |
| **Tlačidlo W-8BEN neposúvalo na sekciu e-mailu** | Opravované viacnásobne, bez výsledku | Nakoniec som danú časť nechal AI zmazať a urobiť nanovo |
| **E-mailový formulár sa nedalo odoslať na localhoste** | Endpoint `/api/lead` nie je dostupný bez Vercela | Testoval som až po commite/deployi, ako je uvedené na začiatku tejto časti |

