# ETF Poplatky – konverzní landing page (Zadanie B)

Lead magnet pre českého drobného investora: srovnání 6 ETF obchodovaných na NYSE
(VOO, IVV, SPY, QQQ, VTI, SCHD) + kalkulačka dopadu poplatků. Návštěvník dostává
osobní report výměnou za e-mail.

**Stack:** čisté HTML + CSS + vanilla JS, bez build kroku. Nasazení: Vercel
(statické soubory + serverless funkce `api/lead.js`).

---

## 1. Cílová skupina a mechanika konverze

| Otázka | Odpověď |
|---|---|
| Kdo | Čech 25–45 let, mobil, začátečník/mírně pokročilý, měsíčně spoří, zvažuje brokera (Fio, Trading 212, DEGIRO, Portu), bojí se poplatků a daní z dividend |
| Odkud | Meta / Google Ads, studený traffic, ~5 s pozornosti |
| Co dostane výměnou | **Osobní report**: vlastní přepočet ztráty na poplatcích (číslo z kalkulačky) + rozbor 6 ETF + checklist prvních kroků (W-8BEN, broker, první nákup) |
| Kdy žádáme kontakt | **Až po dvou volně přístupných prvcích** – srovnávací tabulka a kalkulačka jsou zdarma, návštěvník už vidí své číslo. Formulář je logický další krok, ne skok |
| Pole formuláře | **1 pole (e-mail)** + GDPR checkbox + honeypot |
| Co následuje po odeslání | okamžitá `thank-you.html` s čísly a checklistem (tisknutelné), e-mail do 2 minut (Resend), další tipy jen na vyžádání/odhlašitelně |

Hodnota je zrejmá **před** vyplněním: tabulka i kalkulačka jsou kompletně
funkční bez e-mailu. E-mail je „jen" pro uložení/odeslání reportu.

---

## 2. Proč v takovém pořadí sekce (odůvodnění)

Návěštěvník přichází z mobilu na 5 sekund = rozhoduje první obrazovka a jeden slib.

1. **Hero (1. obrazovka)** – zrcadlo reklamy (message match). Číselný hook
   „235 000 Kč" (vypočteno, viz §5) + jasný příslib „spočítejte si to za 30 sekund".
   Dvě CTA: primární vede na kalkulačku (okamžitá hodnota), sekundární na tabulku.
   Úmyslně **nevede přímo na formulář** – cold návštěvník není připraven dát e-mail.
2. **Tři fakta** – rychlé „bolesti" čísly se zdroji (0,03 % vs 0,41 %; 3× dráž SPY;
   daň 15 % vs 30 %). Důvěra přes zdroje, ne přes loga klientů, která nemáme.
3. **Srovnávací tabulka (volná)** – první skutečná hodnota. Návštěvník si odnáší
   odpověď bez registrace → důvěra → ochota pokračovat.
4. **Kalkulačka (volná, interaktivní)** – emocionální motor: osobní číslo.
   Zde se mění chování z „zajímavé" na „to se týká mě". Teprve pod ní…
5. **Formulář** – žádost o kontakt v momentě, kdy návštěvník vidí svou ztrátu.
   Přesně pravidlo: hodnota zřejmá → pak formulář.
6. **Jak to funguje (3 kroky)** – odstraňuje strach ze závazku a z „prodeje".
7. **FAQ** – poslední námitky (dane, broker, „není to doporučení") až po formuláři,
   protože lidé čtou FAQ spíš po rozhodnutí než před ním.
8. **Závěrečné CTA** – pro ty, kdo prošli celou stránku.
9. **Sticky mobilní lišta** – po opuštění hero je CTA neustále na dosah palce;
   zmizí uvnitř formulářové sekce, aby nepřekážela.

---

## 3. Meranie celej cesty

Udalosti (`assets/js/main.js`, volají `window.etfTrack` → `dataLayer` + Vercel Analytics `va('track')`):

| Event | Kdy | Co měří |
|---|---|---|
| `page_view` | načtení | 100 % návštěvy |
| `cta_click` (hero / table / calc / sticky / final) | klik na CTA | zájem o pokračování |
| `table_sort` | řazení tabulky | zapojení do obsahu |
| `calc_change` | změna fondu v kalkulačce | osobní zapojení |
| `form_view` | formulář ve viewportu 40 % | dosažení zóny konverze |
| `form_error` | nevalidní e-mail / souhlas / síť | kde se ztrácí leady |
| `form_submit` | úspěšné odeslání | **konverze** |
| `report_view` | zobrazení thank-you | dokončení cesty |

**Atribúcia:** UTM parametre z URL sa ukladajú do `localStorage`
(`etf_utm`) a odosielajú sa spolu s leadom → v logu Vercel funkcie vidíte
`email + utm_source/utm_campaign + vstupy kalkulačky`. Cesta je tedy úplná:
**reklama → príchod → interakcia → formulár → odoslanie → report**, každý lead
nesie zdroj.

**Lievik (očakávanie na 100 návštěv):** 100 page_view → 35–45 `form_view`
→ 8–12 `form_submit`. Overuje sa v dashboardu Vercel Analytics + filtrováním
`[lead]` logů funkce `api/lead`.

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

| Údaj | Hodnota | Zdroj (ověřeno 10/2026) |
|---|---|---|
| TER VOO | 0,03 % | Vanguard fact sheet, 30. 9. 2026 |
| TER IVV | 0,03 % | iShares summary prospectus, 31. 7. 2026 |
| TER SPY | 0,0945 % | State Street product listing, 9. 7. 2026 |
| TER QQQ | 0,18 % | invesco.com (Invesco QQQ) |
| TER VTI | 0,03 % | Vanguard fact sheet, 30. 9. 2026 |
| TER SCHD | 0,060 % | schwabassetmanagement.com, 23. 10. 2026 |
| Průměr indexových fondů S&P 500 | 0,41 % | Vanguard fact sheet (31. 12. 2025) |
| Výnos S&P 500 | ≈ 10 % p.a. od 1957 | Fidelity (2026); Damodaran, NYU Stern: 10,02 % 1928–2025 |
| Daň z dividend USA | 30 % → 15 % s W-8BEN | Smlouva ČR–USA č. 32/1994 Sb., čl. 10 (MF ČR / IRS) |

**Výpočet hero čísla (235 000 Kč):** východiskový scénář kalkulačky
100 000 Kč vklad + 3 000 Kč/měsíc × 25 let, hrubý výnos 8 % p.a.,
měsíční složené úročení. Rozdíl konečné hodnoty při TER 0,41 % vs 0,03 %
= **234 728 Kč** (zaokrouhleno). Kalkulačka počítá stejnou metodou
(`assets/js/calculator.js`, funkce `futureValue`).

---

## 6. Dve verzie reklamy

> Hero stránky je vyladěný na **verzi A** (message match). Při spuštění verze B
> upravte H1 + sub v `index.html` a `og:title` (hypotéza A/B č. 1).

### Verze A – strata (východisková)
- **Primary text:** Váš broker vám každý rok strhává poplatek, který na výpisu
  neuvidíte. Rozdíl mezi fondem za 0,41 % a ETF za 0,03 % je za 25 let
  235 000 Kč. Spočítejte si své číslo za 30 sekund – zdarma.
- **Headline:** 0,41 % nebo 0,03 %? Rozdíl: 235 000 Kč
- **CTA:** Spočítat

### Verze B – jednoduchosť
- **Primary text:** Stačí tři indexové fondy a pravidelná platba. Které ETF je to
  vaše? Porovnejte VOO, IVV, SPY, QQQ, VTI a SCHD na jedné stránce. Bez registrace,
  bez prodeje, čísla přímo od správců fondů.
- **Headline:** VOO, IVV nebo SPY? Porovnejte je za 30 sekund
- **CTA:** Zjistit více

---

## 7. A/B hypotézy (zoradené podľa očakávaného dopadu)

| # | Hypotéza | Varianta A (kontrola) vs. B | Prečo práve tento poradie | Metrika |
|---|---|---|---|---|
| **1** | Číselný hook v hero poráží všeobecný headline | „Vaše ETF vás může připravit o 235 000 Kč" vs. „Srovnání ETF pro českého investora" | Headline je jediný text, ktorý studený mobilný návštevník stihne prečítať; ovplyvňuje bounce aj všetky ďalšie kroky naraz = najväčší multiplikátor | bounce rate + CTR z hero (30 sekúnd) |
| **2** | Formulár s 1 polem konvertuje viac ako e-mail + meno | len e-mail vs. e-mail + meno (meno zvyšuje personalizáciu e-mailu) | priamy vplyv na hlavnú metriku, nízke riziko, ľahko testovateľné | form_submit / form_view |
| **3** | Voľná kalkulačka + formulár pod ňou poráža gate za e-mailom | výsledok viditeľný okamžite vs. výsledok až po zadaní e-mailu | testuje jadro mechaniciky lead magnetu; gate môže zdvihnúť CVR, ale zabiť dôveru a zdieľanie – preto až tretí, vyššie riziko | form_submit / page_view; sekundárne bounce |

Realizácia: oddelené URL varianty (`?v=B`) + rozdielne `utm_campaign`, eventy
sú už napojené na `dataLayer`.

---

## 8. Spuštění (deploy na Vercel)

### 1) Resend kľúč (e-maily)
1. Účet zdarma na <https://resend.com> (3 000 e-mailov/mesiac, 100/deň).
2. V dashboarde → **API Keys** → vytvoriť kľúč, skopírovať.
3. Overiť odosielateľa: bez vlastnej domény funguje len
   `ETF Poplatky <onboarding@resend.dev>` na váš vlastný overený e-mail
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
| `RESEND_FROM` | napr. `ETF Poplatky <report@vasedomena.cz>` (voliteľné) |
| `REPLY_TO` | váš e-mail na odpovede (voliteľné) |

Bez kľúča stránka **plne funguje** – endpoint vracia `200` a loguje `{"mode":"log_only"}`.

### 4) Overenie
- `POST /api/lead` s validným telom → `{"ok":true}`
- odoslanie formulára → presmerovanie na `/thank-you.html` s číslami
- v dashboarde Vercel → Deployments → fungovanie → Logs → riadky `[lead]`
  s `email + utm + calc`

### Lokálny vývoj
```bash
npx serve .          # statický server (formulár pri lokálnom behu presmeruje
                     # na thank-you v demo režime, endpoint nie je dostupný)
npx vercel dev       # plný beh vrátane /api/lead (vyžaduje vercel login)
```

---

## 9. Štruktúra súborov

```
index.html            – landing page (hero → fakta → tabulka → kalkulačka → formulář → FAQ)
thank-you.html        – report po odoslání (čísla + checklist, tisknutelné)
assets/css/style.css  – dizajn systém (editorial fintech, mobil-first)
assets/js/main.js     – UTM, eventy, sticky lišta, odoslanie formulára
assets/js/table.js    – srovnávací tabulka (řazení, data + zdroje)
assets/js/calculator.js – výpočet eroze poplatků (8 % p.a., měsíční složené úročení)
api/lead.js           – serverless endpoint: validace → Resend → fallback do logu
.env.example          – popis premenných
```

## 10. Právne / compliance
- Disclaimer na stránke i v patičke: nie je investičné poradenstvo.
- GDPR: jediné spracúvanie = e-mail na zaslanie reportu, súhlas checkboxom,
  odhlásenie v každom e-maile, žiadne tretie strany.
- Všetky čísla so zdrojom; výnosný predpoklad 8 % p.a. je zrejmý pri kalkulačke.
