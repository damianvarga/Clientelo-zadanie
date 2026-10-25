# Analýza zadania: ETF landing page architektúra

**Session ID:** ses_e91ce76dcffeL3RcqGnODKy8uM
**Created:** 24. 10. 2026 15:55:02
**Updated:** 25. 10. 2026 8:01:26

---

## User

ZADANIE B: Konverzná landing page

Cieľom je landing page s porovnaním ETF obchodovaných na NYSE pre českého drobného investora, ktorý prichádza z reklamy na mobile a stránke venuje len niekoľko sekúnd. Stránka má fungovať ako lead magnet: ponúknuť návštevníkovi hodnotu a výmenou za ňu získať jeho kontakt. Pekný dizajn nestačí, stránka musí byť optimalizovaná na prínos kontaktov. Zároveň nesmie pôsobiť ako základný výstup od Claude. Dizajn aj texty majú byť premyslené pre túto cieľovú skupinu. Pri hodnotení sa budem riadiť hlavne otázkou, či by sme na ňu mohli zajtra spustiť reklamu.

Určte cieľovú skupinu, čo návštevník dostane výmenou za kontakt a v ktorom momente oň požiadate. Hodnota by mala byť zrejmá ešte pred vyplnením formulára. Navrhnite aj dve verzie reklamy. Prvá obrazovka stránky by mala nadväzovať na prísľub reklamy a okamžite komunikovať, čo návštevník získa.

Výber interaktívnych prvkov, napríklad porovnania fondov, kalkulačky poplatkov alebo skladania portfólia, nechávam na Vás. Každý z nich by mal viesť ku kontaktu. Formulár by mal mať čo najmenej polí. Premyslite aj to, čo návštevník dostane po jeho odoslaní.

Použite skutočné dáta s uvedením zdroja a merajte celú cestu od príchodu po odoslanie formulára. V README zdôvodnite poradie sekcií, uveďte očakávanú konverziu a tri hypotézy na A/B test zoradené podľa očakávaného dopadu. Stránku nasaďte na bezplatný hosting, napríklad Vercel. 

analyzuj toto zadanie a navrhni možné riešenie, resp. jeho architektúru

---

## Assistant (Plan · MiMo-V2.6-Flash Free · 13.3s)

_Thinking:_

The user wants me to analyze Task B - a conversion landing page for ETF comparison for Czech retail investors. They want me to analyze the assignment and propose a possible solution/architecture. I'm in plan mode, so I should not make any edits - just analyze and plan.

Let me first check what's in the working directory to see if there's any existing context (maybe Task A or other files exist). The working directory is C:\Users\BigON\Desktop\clientelo.

Let me explore the directory first.

**Tool: bash**

**Input:**
```json
{
  "command": "Get-ChildItem -Force | Select-Object Name, Length, LastWriteTime"
}
```

**Output:**
```

Name  Length LastWriteTime        
----  ------ -------------        
.qodo        22. 10. 2026 19:24:57



```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/*"
}
```

**Output:**
```
No files found
```

---

## Assistant (Plan · MiMo-V2.6-Flash Free · 3056.2s)

_Thinking:_

The directory is essentially empty (just a .qodo folder). So this is a fresh project. The user asks me to analyze the assignment (Task B: conversion landing page) and propose a possible solution/architecture. I'm in plan mode - read only. I should analyze the assignment and propose an architecture/plan, asking clarifying questions where needed.

Let me think about the assignment:

**Task B: Conversion landing page**
- Goal: Landing page comparing ETFs traded on NYSE for a Czech retail investor coming from a mobile ad, spending only a few seconds on the page.
- Must function as a lead magnet: offer value in exchange for contact.
- Design must be optimized for contact acquisition, not look like a basic Claude output.
- Design and texts tailored to target audience.
- Evaluation criterion: "could we launch ads on it tomorrow?"
- Determine: target audience, what visitor gets in exchange for contact, and when you ask for it. Value must be obvious before form filling.
- Two ad versions. First screen must continue the ad promise.
- Interactive elements (fund comparison, fee calculator, portfolio builder) - my choice, each should lead to contact.
- Form: minimal fields. Think about what visitor gets after submission.
- Use real data with sources, measure entire path from arrival to form submission.
- README: justify section order, expected conversion, 3 A/B test hypotheses ordered by expected impact.
- Deploy to free hosting like Vercel.

The user wants me to analyze and propose a solution/architecture. Since I'm in plan mode, I should produce a comprehensive plan. I might ask clarifying questions about tech stack preferences, but the user asked "analyzuj toto zadanie a navrhni možné riešenie, resp. jeho architektúru" (analyze this assignment and propose a possible solution, i.e., its architecture).

Key decisions to propose:
1. Target audience (cieľová skupina)
2. Lead magnet value proposition
3. Tech stack - for Vercel, mobile-first, fast: either Next.js or plain static HTML/CSS/JS. Given "could we run ads tomorrow" - a static site is fastest, but Next.js is fine too. Considering no backend needed much - form submission needs an endpoint. Options: Vercel serverless function + email service (Resend, Formspree, etc.). Analytics: Vercel Analytics / Plausible / GA4.
4. Real data sources: ETF data from official sources - e.g., SSGA (SPY), iShares (IVV), Vanguard (VOO) fund pages, expense ratios. Czech investors - maybe Czech-domiciled ETFs? The task says "ETF obchodovaných na NYSE" - so US-listed ETFs: VOO, IVV, SPY, QQQ, VTI, SCHD, etc. Expense ratios: VOO 0.03%, IVV 0.03%, SPY 0.0945%. Sources: fund provider pages (vanguard.com, ishares.com, ssga.com).

Czech-specific considerations:
- Withholding tax30% for US dividends (US-CZ tax treaty reduces to 15% with W-8BEN form)
- Currency: USD/CZK exposure
- KIID/PID documentation - Czech investors used to KID documents
- Distributors: Portu, Fio banka, Trading212, Degiro, Interactive Brokers

Ad examples: "Poplatky vás pripravia o milióny. Porovnajte ETF z NYSE za 30 sekúnd" or similar.

Interactive elements:- Fee calculator (compound effect of expense ratios) - very compelling lead magnet
- ETF comparison table
- Portfolio builder

The lead magnet: a PDF guide "5 chyb drobného investora při výběru ETF" or a personalized comparison report emailed. Given minimal fields: email only (maybe name optional). 

Value obvious before form: show comparison table for free, calculator interactive, then gate the "detailed report / personalized analysis / PDF checklist" behind email.

Post-form: thank you page with immediate PDF download + email sequence (lead nurturing).

Measurement: Vercel Analytics, conversion events, UTM parameters for ad attribution. Maybe a simple events tracking with GA4 or Plausible.

Tech stack recommendation: 
- Next.js (App Router) + Tailwind, or Astro for static-first speed. Actually, for a landing page, a static HTML with vanilla JS or a lightweight framework is best for mobile speed (Core Web Vitals). But maintainability - Next.js is fine. However for "could launch tomorrow", simpler = better. I'd propose a single-page static site with vanilla HTML/CSS/JS deployed on Vercel, form handled via serverless API route (Vercel Functions) that sends to Resend/sheet.Alternatively Astro which is popular for landing pages. Let me consider the environment: it's a Windows machine, empty folder, no git repo. The evaluation will be by the user based on "could we launch ads tomorrow".

I should propose architecture and ask clarifying questions:
1. Tech stack preference (static HTML vs Next.js vs Astro)?
2. Lead capture backend: where should contacts go (email via Resend? Google Sheets? Notion? CSV export?) - needs API keys, so I might need user's decision. Formspree works without backend code but requires account. Vercel env vars for API keys.
3. Language of the page: Czech (target audience is Czech) - texts in Czech. My response should be in Slovak/Czech - user writes in Slovak. Respond in Slovak.

Also "merajte celú cestu" - measure the whole funnel: arrival → interaction → form submit → thank you. Implement event tracking (GA4/Plausible/Vercel Analytics + custom events).

Expected conversion: typical landing page CR5-15% for lead magnets on cold traffic; with a strong lead magnet maybe 8-12%. I'd say 7-12% for cold mobile traffic.

3 A/B hypotheses ordered by impact:
1. Headline/hook (ad promise match vs generic) - biggest impact
2. Form fields (email only vs email+name) or CTA wording
3. Lead magnet format (personalized report vs generic PDF) or placing calculator before form vs gated calculator

Section order justification:
1. Hero (ad continuation, promise, CTA)
2. Problem/pain (fees erosion - emotionally engaging)
3. Interactive comparison table (value upfront, free)
4. Fee calculator (interactive, shows personal numbers)
5. Lead magnet gate (get full report/checklist)
6. Trust/credibility (data sources)
7. FAQ (objections)
8. Sticky mobile CTA

Actually for a "few seconds" visitor, the order should be: Hero → immediate value → CTA. Interactive elements all lead to contact.

Real data with sources:
- VOO (Vanguard S&P 500 ETF): TER 0.03%, 10y avg return ~12-13%, inception 2010, AUM ~$500B+
- IVV (iShares Core S&P 500 ETF): TER 0.03%
- SPY (SPDR S&P 500 ETF Trust): TER 0.0945%
- QQQ (Invesco QQQ): TER 0.20%
- VTI, SCHD, etc.
- CZ withholding tax: 30% default, 15% with W-8BEN (US-CZ treaty)
- Sources: provider pages, justETF, morningstar

I should verify some real numbers via web search when implementing. For the plan, I'll note data sources.

Deployment: Vercel (static or Next). Form: Vercel serverless function → email (Resend free tier 3000 emails/month) + webhook to Google Sheets/Telegram for lead notification. Analytics: Vercel Web Analytics + GA4 + conversion events; also record utm params in form submission.

Measurement plan: 
- Pageview → interaction (calculator used, table sorted) → form open/submit → success
- Track UTM source, ad version, device, time on page
- Attribution: store utm in localStorage, include in submission

Deliverables:
- index.html (or Next.js app)
- README with section order justification, expected conversion, 3 A/B hypotheses
- Two ad versions (in README and maybe as ad copy files)
- Analytics instrumentation
- Deploy to Vercel

Form fields: email only (one field + consent checkbox). GDPR - need consent for marketing (Czech law). Minimal: email + "Souhlasím se zasíláním" checkbox. Maybe optional name.

Post-submit: Thank you page with immediate download link (PDF guide) + confirmation email with the link; plus 3-email sequence.

Now for the plan structure - since user asked to "analyze the assignment and propose a possible solution/architecture", I should present:
1. Analysis of the task2. Proposed solution: target audience, lead magnet, structure, interactive elements, tech stack, data, measurement, deployment
3. Architecture diagram/overview
4. Open questions for the user

I'm in plan mode so no edits. Let me also ask clarifying questions via the question tool? The instructions say "Ask the user clarifying questions or ask for their opinion when weighing tradeoffs." There are real tradeoffs:
1. Tech stack: static HTML vs Next.js
2. Lead storage: Resend (email) vs Google Sheets vs both
3. Language: Czech (yes, audience is Czech - probably no need to ask)

I think I should present the full analysis and architecture proposal, and ask about the few key decisions (tech stack, lead backend). Let me first present the analysis, then ask questions, then finalize the plan.

Actually the flow: I should construct a well-formed plan. Let me ask key questions first, then write the final plan incorporating answers. Or present plan with recommended defaults and ask. Given the user asked for analysis + architecture proposal, I'll deliver that as the main content, with recommendations, and ask about the genuinely blocking decisions (API keys for form handling - I can't create Resend account for them; but I can implement with env vars and fallback to Formspree or mailto... Actually for "launch tomorrow" the user needs an email service. I can implement a Vercel function that sends email via Resend with env var; if not set, logs to Vercel KV or just stores... Or simpler: use Formspree/Getform - but that requires account too.

Alternative: Google Apps Script / Google Forms - free, no code. Or Basin, Formspark. Best approach: implement Vercel serverless function with Resend integration (env keys), and document setup. Also provide fallback: if no API key, submissions logged... Actually for evaluation, code quality matters more than live email.

Let me ask the user:
1. Tech stack: static + vanilla JS (fastest to launch) vs Next.js + Tailwind (more polish, componentized)? Recommend Next.js? For landing page speed, static HTML is fastest LCP. But maintainability and "not looking like Claude output" - either works. I'd recommend a static site with Tailwind CDN? No - Tailwind CDN is bad practice. Vanilla CSS with design system, or Astro/Next. Hmm.

Actually, let me think about what makes the page "not look like a basic Claude output": unique design, custom illustrations/graphics, thoughtful microcopy in Czech, real data, sticky mobile CTA bar, animations, a distinctive visual identity (e.g., "Investiční kalkulačka" theme with banknote green?), good typography (e.g., Inter + a display font), no purple gradients (that's the Claude cliché), no "feature cards with emoji" cliché.

My recommendation: Next.js 14 App Router + Tailwind CSS v4 + one serverless API route for form + Vercel Analytics. Or pure static. Given "measure the whole path", we need analytics - Vercel Analytics works with both.

For a single landing page, I lean toward **Astro or plain Vite/static** for simplicity. But the folder is empty and evaluation might value modern stack. I'll recommend: Next.js (static export not needed since we want API route) - simplest on Vercel. Tailwind for styling. No database - leads to Resend + Google Sheets webhook.

Let me draft the questions:

Q1: Tech stack - Next.js+Tailwind (recommended) vs plain HTML/CSS/JS vs Astro
Q2: Where should leads go - Resend email (recommended, needs free API key) vs Google Sheets via Apps Script vs Formspree (no code, needs account)
Q3: Maybe - investment broker context? Not necessary.

Actually, I can also propose handling both: API route tries Resend if key present.

I'll present the analysis in the response and use the question tool for stack + lead backend. Then after answers, finalize plan.

Let me write a thorough analysis in Slovak. The user wrote in Slovak, so respond in Slovak.

Structure of my response:
1. Rozbor zadania (kľúčové požiadavky, čo sa hodnotí)
2. Návrh riešenia - cieľová skupina, lead magnet, štruktútra stránky, interaktívne prvky, formulár, po-odoslaní
3. Technická architektúra (stack, dátové flow, meranie, nasadenie)
4. Dáta a zdroje
5. README plán (očakávaná konverzia, A/B hypotézy)
6. OtázkyThen question tool for stack + lead backend + maybe language confirm (Czech texts - yes).

Let me also consider Czech specifics for content:
- Cieľová skupina: muži 25-45, CZ, prichádzajú z Facebook/Instagram/Google Ads, mobil, začiatočníci alebo mierne pokročilí, sporí si na "horizont10+ rokov", zaujíma ich pasívne investovanie, boja sa poplatkov a zložitosti
- Ad promise example: "Poplatek 0,2 % vs0,03 % – za 30 let vás může stát 300 000 Kč" (calculator hook)
- Lead magnet: "OSOBNÍ REPORT: Vaše 3 nejlepší ETF volby + kalkulace poplatků na míru" - email odeslán do 2 minut- Form: email + souhlas (GDPR)
- Post-submit: thank-you page + PDF okamžitě + email s reportem + 3-email sekvence (value first, nudge broker registration)

Wait - personalized report "do 2 minut emailem" requires automation - serverless function generating PDF is doable but complex. Simpler: instant download on thank-you page (static PDF) + email with link. The "personalization" can come from calculator inputs stored with submission and echoed in email via Resend template with dynamic values. That's feasible: API route receives email + calculator params (e.g., investovaná částka, počet let, zvolené ETF) → sends personalized email with computed numbers + attaches/links PDF checklist. Good "wow" factor.

PDF generation: can be a static PDF (checklist) + personalized numbers in email body. Keep it simple.

Measurement: 
- Events: page_view, hero_cta_click, calculator_interaction, comparison_table_sort, form_open, form_submit, form_success
- UTM capture + localStorage
- Vercel Analytics + custom events; optionally GA4. GA4 needs measurement ID - env var. Vercel Analytics works out of the box on paid... Actually Vercel Web Analytics is free tier available ( Hobby includes2500 events/month? Actually Vercel Hobby includes Web Analytics free). Plausible is paid. Umami free self-host - too complex. Simplest: Vercel Analytics + custom event tracking via same. Or GA4 with env config. I'll propose Vercel Analytics (built-in) + custom events, and GA4 optional.

Expected conversion: 8-12% (form submits / unique visitors) for cold mobile traffic with strong lead magnet; interactions maybe 35-45%.

A/B hypotheses (by impact):
1. Hero: číselný hook na konkrétnu čiastku ("Poplatky vás môžu stáť 412 000 Kč") vs všeobecný headline - vplyv na bounce/CVR
2. Form: email-only (1 pole) vs email+meno - ovplyvňuje CVR
3. Umiestnenie formulára: inline po kalkulačke vs sticky bottom bar + modal vs gate priamo na kalkulačku (výsledok až po emaile)

Section order (justify in README):
1. Hero - nadväzuje na reklamu, okamžitý prísľub + CTA
2. "Kolik vás přijdou poplatky" - bolesť,3 čísla, zdroj dát
3. Porovnávací stůl ETF (VOO/IVV/SPY/QQQ...) - hodnota vopred, zadarmo
4. Kalkulačka poplatkov - interaktívne, personalizované číslo
5. Získanie reportu (formulár) - až teraz, keď videl hodnotu
6. Čo dostane (zoznam výhod lead magnetu)
7. Dôvera - zdroje dát, o autorovi/disclaimer (nenabádám, vzdelávanie)
8. FAQ - námietky (daně, broker, co když...)
9. Footer - disclaimer (není investiční doporučení)

Mobile sticky bar: "Chci svůj report" always visible.

Interactive elements each with CTA to form: comparison table (CTA: "chci podrobný report"), calculator (CTA: "chci osobní kalkulaci emailem"), portfolio builder maybe skip to keep focus (or include small "složení portfolia" preset chips). I'd pick: comparison table + fee calculator. Portfolio builder might be too much - two strong elements better than three weak. Actually assignment says "výber nechávam na Vás" - two is fine.

Deployment: vercel CLI or git-connected; vercel.json; env vars RESEND_API_KEY, LEADS_WEBHOOK_URL (optional), NEXT_PUBLIC_GA4_ID optional.

Data (real, with sources - to verify at implementation):
- VOO: TER 0.03% (vanguard.com)
- IVV: TER 0.03% (ishares.com)
- SPY: TER 0.0945% (ssga.com)
- QQQ: TER 0.20% (invesco.com)
- Historické výnosy S&P 500 (1957-2024 cca 10 % p.a. nominálne, zdroj: NYU Stern Damodaran / S&P Global)
- CZ/US zmluva: 15% dividendová daň s W-8BEN (IRS / Smlouva USA-ČR)
- CZK/USD kurz - ČNBJustETF for fees comparison cross-check.

Now, questions to user. Let me formulate:

1. Tech stack: Next.js + Tailwind (recommended) / čisté HTML+CSS+JS / Astro
2. Lead backend: Resend API (odporúčané; treba free kľúč) / Formspree (bez backend kódu) / Google Sheets webhook
3. Rozsah: len 1 stránka (landing) alebo aj "thank-you" stránka + PDF? (thank-you určite, PDF áno - not worth asking)
4. Maybe: preferred ETFs scope? VOO/IVV/SPY/QQQ/VTI/SCHD - fine without asking.

I'll ask 2-3 questions and present the analysis. Then after answers, produce the final plan file... In plan mode, after research, I present the plan for approval. The final message should be the plan. Let me ask questions first via question tool, then in next turn produce full plan.

Actually I can present analysis in text now and ask questions in the same turn. Then next turn finalize.

Let me write the analysis (in Slovak, concise but complete) and call the question tool.

Rozobral som zadanie. Kľúčové body: mobilná studená návštevnosť z reklamy, ~5 sekúnd pozornosti, lead magnet, reálne dáta so zdrojmi, meranie celej cesty, nasadenie na Vercel. Nižšie je analýza + návrh architektúry; nakoniec 2 otázky, ktoré rozhodnú o implementácii.

---

## 1. Rozbor zadania — čo sa vlastne hodnotí

Skutočný kritérium nie je „pekná stránka", ale **„dalo by sa na to zajtra spustiť reklamu?"** To znamená:

| Požiadavka | Implikácia pre návrh |
|---|---|
| Návštevník z mobilnej reklamy, ~5 s | Hero musí doslova nadviazať na text inzerátu (message match), 1 claim, 1 CTA |
| Lead magnet | Hodnota **zrejmá pred formulárom** — porovnanie a kalkulačka sú voľne prístupné, za e-mail dostane „osobný report" |
| Reálne dáta so zdrojmi | TER VOO/IVV/SPY/QQQ priamo z webov správcov + historické výnosy; uvedené pod tabuľkou |
| Meranie celej cesty | UTM → udalosti (interakcia → otvorenie formulára → odoslanie → thank-you) → lead s atribúciou |
| Nie „základný výstup od Claude" | Žiadne fialové gradienty/emoji karty; vlastný vizuálny systém, české microcopy, reálne čísla, sticky mobilná lišta |

## 2. Cieľová skupina a mechanika konverzie

**Cieľová skupina:** Čech 25–45 rokov, mobil, začiatočník/mierne pokročilý, sporí si mesiáčne, zvažuje si brokerage (Fio, Trading 212, DEGIRo, Portu), bojí sa poplatkov a dane z US dividend. Prichádza z Meta/Google Ads.

**Lead magnet:** *„Osobní report: kolik vás přijdou poplatky a které ETF dává smysl"* — PDF checklist + personalizovaný výpočet z kalkulačky zaslaný e-mailom.

**Kedy pýtať kontakt:** až po dvoch voľných interaktívnych prvkoch (porovnanie + kalkulačka). Návštevník už videl svoje číslo („za 25 rokov prídete o 286 000 Kč") → formulár je logický ďalší krok, nie skok. Formulár = **1 pole (e-mail) + GDPR checkbox**.

**Po odoslaní:** okamžitá thank-you stránka s downloadom + e-mail s personalizovaným výpočtom do 2 minút (Resend) + 3-emailová nurture sekvencia.

## 3. Štruktúra stránky (odôvodnenie poradia v README)

1. **Hero** — zrkadlo reklamy: číselný hook + „Zjistěte za 30 sekund" + CTA „Chci svůj report" (scroll na kalkulačku/form)
2. **Bolesť: poplatky** — 3 čísla so zdrojmi (0,03 % vs 0,0945 % TER; daň 15 % s W-8BEN)
3. **Porovnávací stůl ETF** — VOO, IVV, SPY, QQQ, VTI, SCHD (TER, štruktúra, min. investícia, dividenda) — plná hodnota zdarma, CTA pod tabuľkou
4. **Kalkulačka poplatkov** — vklad, mesačná platba, roky, výber ETF → živé číslo „o koľko prídete" — interaktívny motor emócie
5. ** formulár** — priamo pod kalkulačkou, výsledok sa prenesie do e-mailu
6. **Čo dostanete** — 3 bullet pointy (PDF + osobný prepočet + checklista W-8BEN/broker)
7. **Dôvera + FAQ** — zdroje dát, disclaimer „není investiční doporučení", 4 námietky (daň, mena, broker, kedy predať)
8. **Sticky mobilná lišta** — stále viditeľné CTA

## 4. Technická architektúra

```
[Verejná stránka – statická]
 index.html + /assets (CSS, JS, PDF)
        │
        │  fetch POST /api/lead { email, consent, utm, calcPayload }
        ▼
[Vercel Serverless Function]  api/lead.js
        │  1. validácia + rate limit (jednoduchý in-memory/IP)
        │  2. Resend: personalizovaný e-mail + 3-email sekvencia (scheduled)
        │  3. optional: webhook do Google Sheets / CRM
        ▼
[Lead sklad]  Resend (e-maily) + notifikácia (Telegram/Slack webhook)

Meranie: Vercel Analytics (pageview) + vlastné eventy
 (hero_cta, table_sort, calc_slide, form_open, form_submit)
 → každý lead nesie utm_* + verziu kreatívy + payload kalkulačky

Nasadenie: git push → Vercel (Hobby, zdarma), env: RESEND_API_KEY,
           LEADS_WEBHOOK_URL (voliteľný)
```

**Stack (navrhovaný):** čistý **HTML + CSS + vanilla JS** (žiadny framework) — dôvody: najlepší LCP na mobile (rozhoduje cena kliku v reklame), nulová závislosť, nasadenie bez build kroku, plná kontrola nad dizajnom. Kalkulačka a tabuľka ako ľahké moduly. Žiadna databáza.

**Dáta (overím pri implementácii, uvediem zdroj pod každou tabuľkou):** TER z vanguard.com / ishares.com / ssga.com / invesco.com; výnosy S&P 500 (Damodaran/NYU, S&P Global); daň 15 % podľa zmluvy USA–ČR (IRS); kurz ČNB. Disklajmer: nie je investičné doporučenie.

**README bude obsahovať:** odôvodnenie poradia sekcií, očakávanú konverziu (**studený mobilný traffic: 8–12 % lead CVR**, interakcie 35–45 %, bounce <55 %), 3 A/B hypotézy zoradené podľa dopadu:
1. Hero hook: konkrétna čiastka („pripraví vás o 286 000 Kč") vs. všeobecný headline
2. Formulár: 1 pole (e-mail) vs. e-mail + meno
3. Umiestnenie gate-u: voľná kalkulačka + formulár pod ňou vs. výsledok až po zadaní e-mailu

Plus dve verzie reklamy (Meta primary text + headline) v README.

---

Predtým než uzavriem plán, potrebujem rozhodnúť dve veci:

**Tool: question**

**Input:**
```json
{
  "questions": [
    {
      "question": "Aký technický stack použijeme pre landing page?",
      "header": "Tech stack",
      "options": [
        {
          "label": "Čisté HTML+CSS+JS (Recommended)",
          "description": "Najrýchlejší LCP na mobile, žiadny build, plná kontrola dizajnu, najjednoduchšie nasadenie na Vercel. Kalkulačka ako vanilla JS modul."
        },
        {
          "label": "Next.js + Tailwind",
          "description": "Komponentový kód, ľahšia ďalšia expanzia (viac stránok, A/B cez feature flagy), ale ťažší bundle a viac kostry okolo jednostránkového landingu."
        },
        {
          "label": "Astro",
          "description": "Static-first, ostrejší ako Next pre landing, komponenty v JSX, minimálny JS. Kompromis medzi oboma."
        }
      ]
    },
    {
      "question": "Kam majú prúdiť kontakty z formulára? (Potrebujem to vedieť kvôli implementácii API endpointu — každá voľba je zdarma.)",
      "header": "Spracovanie leadov",
      "options": [
        {
          "label": "Resend API (Recommended)",
          "description": "Serverless endpoint posiela personalizovaný e-mail + notifikáciu. Zadarmo 3 000 e-mailov/mes. Vyžaduje free API kľúč (vytvoríte na resend.com, ja dám návod). Fallback: ak kľúč chýba, lead sa uloží do logu Vercel."
        },
        {
          "label": "Formspree / Basin",
          "description": "Bez backend kódu – formulár mieri na tretiu stranu, notifikácia chodí e-mailom. Nevýhoda: menej kontroly, ťažšie personalizovaný e-mail."
        },
        {
          "label": "Google Sheets webhook",
          "description": "Leads priamo do tabuľky cez Apps Script URL. Dobre na rýchlu revíziu leadov, ale e-mail návštevníkovi treba riešiť zvlášť."
        }
      ]
    }
  ]
}
```

**Output:**
```
User has answered your questions: "Aký technický stack použijeme pre landing page?"="Čisté HTML+CSS+JS (Recommended)", "Kam majú prúdiť kontakty z formulára? (Potrebujem to vedieť kvôli implementácii API endpointu — každá voľba je zdarma.)"="Resend API (Recommended)". You can now continue with the user's answers in mind.
```

---

## Assistant (Plan · MiMo-V2.6-Flash Free · 95.1s)

_Thinking:_

The user chose clean HTML+CSS+JS and Resend API. Now I should finalize the plan. In plan mode, I present the plan for approval. Let me write the final comprehensive but concise plan.

The plan should cover:
1. File structure
2. Design direction (to avoid "Claude default" look)
3. Content/copy (Czech)
4. Interactive elements details
5. Form + API endpoint
6. Analytics/measurement
7. Data sources with real figures8. README contents
9. Ad versions
10. Deployment steps
11. Verification

Let me think about a distinctive design direction: "investiční kalkulačka" theme. Avoid purple gradients. Maybe a dark "terminal/ledger" aesthetic or a clean editorial newspaper-like style with strong numbers typography. Czech fintech vibe: think Portu/Fio. A good distinctive approach: warm off-white background (#FAF7F2), deep ink green (#0F3D2E) as primary (trust, money), accent coral/amber for CTAs and "loss" numbers, big tabular numbers (font-variant-numeric: tabular-nums), serif display font for headlines (e.g., "Instrument Serif" or "Fraunces" via Google Fonts) + Inter for body. Feels editorial, like an investment newsletter, not a Claude purple page.

Interactive elements:
1. Comparison table (sortable, mobile cards) - VOO, IVV, SPY, QQQ, VTI, SCHD with TER, 10y return, dividend yield, category2. Fee calculator: inputs (initial deposit CZK, monthly contribution, years, risk profile/ETF choice) → outputs: "with VOO you'd have X, with SPY you lose Y to fees over N years" using historical return assumption (disclosed). CTA under result.

Form: email + GDPR checkbox, honeypot, submits to /api/lead with calc payload + UTM.

API: api/lead.js - validates, Resend send personalized email (immediate) + schedule 2 more (Resend doesn't do scheduling on free - actually Resend has "scheduling"? Resend API doesn't natively schedule; alternatives: send first email immediately with the full report content, and mention follow-ups optional via Resend Broadcasts... Simpler: send one comprehensive email with report + links, and note that nurture sequence is configured via Resend (manual broadcasts or a scheduled function). Vercel cron could send follow-ups but needs database - keep it simple: single rich email + optional Google Sheets webhook for the owner. In README, describe3-email sequence as part of the funnel plan (delivered manually via Resend broadcasts).

Analytics: Vercel Analytics script + custom events. Also store utm in localStorage → included in lead payload → owner can see source per lead. Add a simple "conversion path" measurement doc in README with expected funnel numbers.

PDF: create a simple static PDF lead magnet? Generating a real PDF without build tools is hard; could be an HTML "report" page (gated thank-you style) or a printable HTML. Simplest: thank-you page IS the report (personalized numbers rendered), plus downloadable "checklist" as... Actually to keep scope sane: after submit → thank-you.html with personal calc results + a printable checklist section (window.print). Email contains same link + summary. That's honest and works. README can note PDF can be added later.

Actually the lead magnet promise should be deliverable tomorrow - "osobní report" = thank-you page + e-mail. Fine.

File structure:
```
clientelo/  (working dir)
├── index.html
├── thank-you.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js (tracking, nav)
│   ├── js/calculator.js
│   ├── js/table.js
│   └── img/ (logo, og-image)
├── api/
│   └── lead.js
├── vercel.json (optional)
├── .env.example
└── README.md
```

Data to verify via web search before coding:
- VOO/IVV/SPY/QQQ/VTI/SCHD TERs
- S&P 500 historical CAGR
- CZ-US dividend withholding- Current EUR/CZK or USD/CZK maybe not needed

Ads (2 versions):
Ad A (loss aversion / fees): primary text about hidden fees, headline "Kolik vás přijdou poplatky? Zjistěte za 30 sekund", CTA "Získat report"
Ad B (aspiration / simplicity): "3 ETF, která stačí k budování majetku", headline "VOO, IVV nebo SPY? Porovnejte je za 30 sekund"

Hero must match whichever ad - hero A/B is the #1 hypothesis; default hero uses Ad A framing.

A/B hypotheses as agreed.

Deployment: git init? No git repo currently. User said deploy to Vercel - during implementation: git init, vercel deploy or instruct user. I'll plan: prepare all files, run local verification (maybe simple HTTP server check), init git, and either user connects to Vercel or we use vercel CLI if installed. Check later.

Timeline/verification: open page via local server, test calculator math, test API endpoint with mock (no key →503 fallback logs lead to console/file? On Vercel without key, return 200 with queue mode? Better: if no RESEND_API_KEY, still accept and log payload to console (visible in Vercel function logs) - prevents broken UX during demo).

Plan mode: present final plan now. Keep concise but complete.

Odpovede zapracované. Tu je finálny plán.

---

# PLÁN: Konverzná landing page „ETF poplatky" (Zadanie B)

## Rozhodnutia
- **Stack:** čisté HTML + CSS + vanilla JS, bez build kroku
- **Lead backend:** Vercel serverless funkcia `api/lead.js` + Resend API (fallback: bez kľúča sa lead zapíše do function logu, stránka nikdy nechybí)
- **Jazyk stránky:** čeština (cieľová skupina); README v češtine/slovenčine podľa zadania

## Súborová štruktúra
```
index.html              – hlavná landing page
thank-you.html          – report po odoslaní (personalizovaný výpočet + checklist)
assets/css/style.css    – vlastný dizajn systém
assets/js/main.js       – tracking, UTM, sticky bar, formulár
assets/js/calculator.js – kalkulačka poplatkov
assets/js/table.js      – porovnávacia tabuľka (sort, mobilné karty)
api/lead.js             – validácia → Resend e-mail → (voliteľný) webhook
.env.example            – RESEND_API_KEY, LEADS_WEBHOOK_URL, REPLY_TO
README.md               – odôvodnenie, konverzia, A/B hypotézy, 2 reklamy, návod na deploy
```

## Dizajn (aby to nevyzeralo ako Claude default)
- **Žiadne** fialové gradienty, emoji karty, Inter-only. Namiesto toho: editorial fintech štýl — krémové pozadie `#FAF7F2`, tmavá investičná zelená `#0F3D2E`, korálový accent pre CTA a stratové čísla
- Display font (Fraunces / Instrument Serif) na nadpisy + Inter na telo; **tabuľkové číslice** veľkým fontom — čísla sú hlavný vizuálny prvok
- Mobil-first: sticky spodná lišta „Chci svůj report →", veľké CTA tlačidlá (min. 48 px)

## Obsah a mechanika konverzie
1. **Hero** — mirror textu reklamy (výchozí = verzia A o poplatkoch): číselný hook „Poplatky vás mohou připravit o 286 000 Kč" + „Zjistěte svoje číslo za 30 sekund" + CTA
2. **3 fakta so zdrojmi** — TER 0,03 % vs 0,0945 %; daň 15 % s W-8BEN (zmluva USA–ČR)
3. **Porovnávacia tabuľka** (VOO, IVV, SPY, QQQ, VTI, SCHD): TER, kategória, štruktúra, dividenda — zdroje pod tabuľkou; CTA „Chci podrobný report"
4. **Kalkulačka poplatkov** — vklad, mesačná platba, roky, výber ETF → živé číslo straty na poplatkoch (s disclosureom výnosového predpokladu) → CTA
5. **Formulár** — 1 pole (e-mail) + GDPR checkbox + honeypot; payload nesie UTM + vstupy kalkulačky
6. **Čo dostanete / dôvera / FAQ / disclaimer** „není investiční doporučení"

**Po odoslaní:** okamžitý presun na `thank-you.html` (osobný prepočet vygenerovaný z payloadu cez query/localStorage), e-mail cez Resend do 2 minút s tým istým výpočtom + checklistom. Nurture sekvencia (3 e-maily) popísaná v README, realizovateľná Resend Broadcasts.

## Meranie celej cesty
- Vercel Analytics (pageview) + vlastné eventy: `hero_cta`, `table_sort`, `calc_change`, `form_open`, `form_submit`, `form_success`
- UTM z URL → localStorage → súčasť lead payloadu (atribúcia: reklama → interakcia → odoslanie)
- README obsahuje očakávaný lievik: 100 návštev → 35–45 interakcií → 8–12 leadov; ako merať v Vercel dashboarde

## Reálne dáta (overím web searchom pred kódovaním, uvediem zdroj)
- TER: vanguard.com (VOO, VTI), ishares.com (IVV), ssga.com (SPY), invesco.com (QQQ), ssga.com (SCHD)
- Historický výnos S&P 500 (~10 % p.a. nominálne): NYU Stern Damodaran / S&P Global
- Daň: IRS Publikácia 901 + zmluva USA–ČR (15 % s formulárom W-8BEN)

## Dve verzie reklamy (v README, hero bude zrkadlo verzie A)
- **A (strata):** „Váš broker vám strhává poplatky, o kterých nevíte. Spočítejte si, kolik vás budou stát za 25 let." + headline „0,03 % nebo 0,0945 %? Rozdíl: 286 000 Kč"
- **B (jednoduchosť):** „Stačí tři ETF. Které je to vaše?" + headline „VOO, IVV nebo SPY — porovnejte je za 30 sekund"

## README (povinné časti zadania)
1. Odôvodnenie poradia sekcií (5-sekundový mobilný test, message match)
2. Očakávaná konverzia: **8–12 % lead CVR** (studený mobilný traffic), interakcie 35–45 %
3. 3 A/B hypotézy podľa dopadu: (1) hero číselný hook vs. všeobecný, (2) formulár 1 pole vs. e-mail+meno, (3) voľná kalkulačka vs. gate za e-mail
4. Obe verzie reklamy + návod na Resend kľúč a deploy na Vercel

## Priebeh implementácie
1. Web search na overenie všetkých čísel a zdrojov
2. `index.html` + `style.css` (dizajn systém, mobil-first)
3. `table.js`, `calculator.js` (matematika: mesačná platba budúcej hodnoty, erozia poplatkov, overenie výpočtu ručne)
4. `api/lead.js` (validácia, Resend personalizovaný e-mail, fallback bez kľúča), `thank-you.html`
5. Tracking + UTM reťazec
6. `README.md`
7. Verifikácia: spustenie lokálneho servera, test výpočtov, test formulára s mock kľúčom; `git init` + deploy (ak je dostupný `vercel` CLI, inak návod v README)

**Mimo scope:** skutočná databáza leadov, platobný checkout, viacjazyčnosť, skutočný PDF generátor (report je HTML stránka + tlačiteľný checklist).

---

S plánom súhlasíš, alebo chceš niečo upraviť (rozsah ETF, tón komunikácie, dizajnový smer)?

---

## User

dobre, urob postup v bodoch tak, aby sme mohli začať programovať stránku

---

## Assistant (Build · MiMo-V2.6-Flash Free · 29.1s)

_Thinking:_

The user wants a step-by-step procedure (postup v bodoch) so we can start programming the page. I'm now in build mode. The user says "urob postup v bodoch tak, aby sme mohli začať programovať stránku" — make a step-by-step list so we can start programming.

I should give a concise ordered list of steps. Should I start coding? They said "tak, aby sme mohli začať programovať" — make the procedure so we CAN start programming. So deliver the steps list first. But we're in build mode now; maybe they want the plan of action. I'll give the steps concisely, then possibly ask nothing and just start? The instruction: "urob postup v bodoch" = make a step-by-step procedure. I'll provide the numbered steps. Keep it under ~4 lines? No — the user asks for a procedure; detail is requested. The "fewer than 4 lines" rule applies unless user asks for detail. Here they asked for a step list, so a list is fine.

I could also set up a todo list to track. That would be good practice. Let me create todos for the implementation phases and present the step-by-step list.

Let me write the steps concretely:

1. Overenie dát (web search: TER, výnosy, daň) → tabuľka zdrojov
2. Skeleton: index.html sekcie + style.css dizajn systém (farby, typografia, layout)
3. Hero + bolesť sekcia (copy)
4. Porovnávacia tabuľka (table.js)
5. Kalkulačka (calculator.js) + overenie matematiky
6. Formulár + api/lead.js (Resend, fallback) + tracking/UTM
7. thank-you.html (personalizovaný report)
8. README.md (odôvodnenie, konverzia, A/B, reklamy, deploy návod)
9. Verifikácia (lokálny server, testy) → git init → deploy na Vercel

I'll use todowrite to track, then output the list. Then begin? The user said "aby sme mohli začať programovať" — they want the procedure ready so we can start. I think after listing, I should start executing step 1 (research) — but maybe they want to review the steps first. Given build mode and their instruction to make the procedure, I'll list steps and start with step 1 (data verification) since that's read-only research anyway. Actually, starting to work proactively seems aligned: "aby sme mohli začať" implies next we'll start. I'll create todos, present steps, then begin step 1 research in the same turn? That could be reasonable. But keep response focused: present steps first. I'd rather present the list and immediately kick off step 1 (web searches) to make progress — the user gave a clear directive to prepare for programming.

Hmm, but careful: don't overstep. The user asked specifically for the procedure. I'll give the procedure and then start with data research since it's the first step and harmless. Let me do: todowrite + present list. Then proceed with searches in next turn... Actually I can do multiple tool calls in one block. Let me create the todo list and run web searches for the data in parallel — that makes real progress.

Actually the user may just want to see the plan before green light. The phrase "tak, aby sme mohli začať programovať stránku" reads like: give me the ordered steps so that we can begin coding. Giving steps is the deliverable. Starting coding immediately might be fine too since we're in build mode. I'll provide the steps and start step 1 (research) — it's low-risk and they said "začať".

Let me be efficient: create todos, do the searches.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Overiť reálne dáta a zdroje (TER, výnosy, daň) cez web search",
      "status": "in_progress",
      "priority": "high"
    },
    {
      "content": "index.html skeleton + style.css dizajn systém (mobil-first)",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Hero + bolesť sekcia + porovnávacia tabuľka (table.js)",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Kalkulačka poplatkov (calculator.js) + overenie matematiky",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Formulár + api/lead.js (Resend, fallback) + UTM/event tracking",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "thank-you.html – personalizovaný report",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "README.md – poradie sekcií, konverzia, A/B hypotézy, 2 reklamy, deploy návod",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Verifikácia (lokálny server, výpočty, formulár) + git init + deploy na Vercel",
      "status": "pending",
      "priority": "medium"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Overiť reálne dáta a zdroje (TER, výnosy, daň) cez web search",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "index.html skeleton + style.css dizajn systém (mobil-first)",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Hero + bolesť sekcia + porovnávacia tabuľka (table.js)",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Kalkulačka poplatkov (calculator.js) + overenie matematiky",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Formulár + api/lead.js (Resend, fallback) + UTM/event tracking",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "thank-you.html – personalizovaný report",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "README.md – poradie sekcií, konverzia, A/B hypotézy, 2 reklamy, deploy návod",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Verifikácia (lokálny server, výpočty, formulár) + git init + deploy na Vercel",
    "status": "pending",
    "priority": "medium"
  }
]
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 9.8s)

_Thinking:_

This system reminder is about free-model policy—dataset labeling or backend use. Neither applies here (personal project landing page). Continue the task: step 1 — verify real data via web search.

Let me search for TER data and other figures.

Začínam krokom 1 — overenie reálnych dát a zdrojov.

**Tool: websearch**

**Input:**
```json
{
  "query": "VOO IVV SPY expense ratio TER 2026 Vanguard iShares SPDR official"
}
```

**Output:**
```
Title: Vanguard SandP 500 ETF
URL: https://workplace.vanguard.com/assets/corp/fund_communications/pdf_publish/us-products/fact-sheet/F0968.pdf
Published: N/A
Author: Vanguard
Highlights:
### Vanguard

## Vanguard S&P 500 ETF | VOO

As of September 30, 2026

##### Investment focus

Investment style

Growth

Value

Blend

Large

#### Investment approach

• Seeks to track the performance of the S&P 500 Index. 
• Large-cap equity. 
• Employs a passively managed, full-replication strategy. 
• Fund remains fully invested. 
• Low expenses minimize net tracking error. 

Mid

Central tendency Expected range of fund holdings

Small

M

Quick facts

#### About the benchmark

• The S&P 500 Index is a widely recognized benchmark of U.S. stock market performance that is dominated by the stocks of large U.S. companies. 
• The index includes 500 leading companies in leading industries of the U.S. economy. 

Performance history

Total returns 2 for period ended September 30, 2026

Year to date 1 year 3 years 5 years 10 years

Since inception

VOO (Inception 2010-09-07) Quarter

| Net asset value (NAV) return 3 | 2.30% | 12.72% | 15.70% | 22.85% | 13.75% | 15.29% | 14.94% |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Market price return 4 | 2.31 | 12.74 | 15.78 | 22.88 | 13.76 | 15.30 | 14.94 |
| S&P 500 Index | 2.30 | 12.75 | 15.74 | 22.89 | 13.79 | 15.33 | 14.98 |

| Benchmark | | S&P 500 Index |
| --- | --- | --- |
| Expense ratio 1 | | 0.03% |
| Dividend schedule | | Quarterly |
| ETF total net assets | | $1,032,260 million |
| Fund total net assets | | $1,732,017 million |
| Inception date | | 2010-09-07 |
| Trading information | | |
| Ticker symbol | | VOO |
| CUSIP number | | 922908363 |
| IIV (intra-day ticker) | | VOO.IV |
| Index ticker (Bloomberg) | | SPTR |
| Exchange | | NYSE Arca |
| ETF attributes | S&P 500 ETF | S&P 500 Index |
| Number of stocks | 505 | 503 |
| Median market cap | $462.2B | $462.2B |
| Price/earnings ratio | 24.7x | 24.7x |
| Price/book ratio | 5.3x | 5.3x |
| Return on equity | 29.0% | 29.0% |
| Earnings growth rate | 24.5% | 24.5% |
| Turnover rate 5 | 2.4 | — |
| Standard deviation 6 | 12.43% | 12.42% |

...

1.As reported in the most recent prospectus. A fund’s current expense ratio may be lower or higher than the figure reported in the prospectus. 
2. Figures for periods of less than one year are cumulative returns. All other figures represent average annual returns. Fund performance figures assume the reinvestment of dividends and capital gains distributions; 
the figures are pre-tax and net of expenses. The above widely used comparative index represents unmanaged or average returns on various financial assets that can be compared with the fund’s total returns for 
the purpose of measuring relative performance. 
3. As of 4 p.m., Eastern time, when the regular trading session of the New York Stock Exchange typically closes. 
4. Effective July 15, 2024, the market price returns are calculated using the official closing price as reported by the ETF’s primary exchange. Prior to July 15, 2024, the market price returns were calculated using the 
midpoint between the bid and ask prices as of the closing time of the New York Stock Exchange (typically 4 p.m., Eastern time). The returns shown do not represent the returns you would receive if you traded 
shares at other times. 
5. For most recent fiscal year. Turnover rate excludes the value of portfolio securities received or delivered as a result of in-kind purchases or redemptions of the fund’s capital shares, including Vanguard ETF Creation 
Units. 
6. A measure of the volatility of a fund—based on the fund’s last three years of monthly returns—used to indicate the dispersion of past returns. A higher standard deviation means a greater potential for volatility. 
For funds with less than 36 months of performance history, standard deviation is not calculated. 

### Vanguard S&P 500 ETF | VOO

As of September 30, 2026

Expense ratio comparison 1

Tenlargest holdings and%of total netassets 2

0.41%

0.03%

S&P 500 ETF

S&P 500 Index Funds Average

Portfolio management Vanguard Capital Management

| NVIDIA Corp. | 8.4 % |
| --- | --- |
| Apple Inc. | 7.4 % |
| Microsoft Corp. | 5.8 % |
| Alphabet Inc. | 5.5 % |
| Amazon.com Inc. | 3.7 % |
| Broadcom Inc. | 2.5 % |
| Meta Platforms Inc. | 2.4 % |
| Micron Technology Inc. | 1.8 % |
| Tesla Inc. | 1.5 % |
| Advanced Micro Devices Inc. | 1.5 % |
| Top ten as % of total net assets | 40.6% |
| Sector Diversification 3 | |
| Information Technology | 39.7 % |
| Financials | 11.4 % |
| Communication Services | 9.9 % |
| Health Care | 9.3 % |
| Consumer Discretionary | 8.6 % |
| Industrials | 8.0 % |
| Consumer Staples | 4.4 % |
| Energy | 3.4 % |
| Utilities | 1.9 % |
| Materials | 1.7 % |
| Real Estate | 1.7 % |
| Other | 0.0 % |

...

1.Represents the expense ratio for the Vanguard ETF as reported in the most recent prospectus. There are material differences between mutual funds and ETFs. Unlike mutual funds, ETFs are priced continuously 
and bought and sold throughout the day in the secondary market (at a premium or discount to net asset value) with the assistance of a stockbroker, which entails paying commissions. Sources: Lipper, a 
Thomson Reuters Company, and Vanguard, December 31, 2025. 
2. The holdings listed exclude any temporary cash investments and equity index products. 
3. Sector categories are based on the Global Industry Classification Standard (“GICS”), except for the “Other” category (if applicable), which includes securities that have not been provided a GICS classification 
as of the effective reporting period. 
Vanguard ETF Shares are not redeemable with the issuing Fund other than in very large aggregations worth millions of dollars. Instead, investors must buy and sell Vanguard 
ETF Shares in the secondary market and hold those shares in a brokerage account. In doing so, the investor may incur brokerage commissions and may pay more than net 
asset value when buying and receive less than net asset value when selling. 
All ETF products are subject to risk, which may result in the loss of principal. 
The index is a product of S&P Dow Jones Indices LLC, a division of S&P Global, or its affiliates (“SPDJI”), and has been licensed for use by Vanguard. Standard & Poor’s® and S&P® are registered 
trademarks of Standard & Poor’s Financial Services LLC, a division of S&P Global (“S&P”); Dow Jones® is a registered trademark of Dow Jones Trademark Holdings LLC (“Dow Jones”); and these 
trademarks have been licensed for use by SPDJI and sublicensed for certain purposes by Vanguard. Vanguard products are not sponsored, endorsed, sold or promoted by SPDJI, Dow Jones, S&P, 
or their respective affiliates and none of such parties make any representation regarding the advisability of investing in such product(s) nor do they have any liability for any errors, omissions, or 
interruptions of the index. 
CGS identifiers have been provided by CUSIP Global Services, managed on behalf of the American Bankers Association by Standard & Poor’s Financial Services, LLC, and are not for use or 
dissemination in a manner that would serve as a substitute for any CUSIP service. The CUSIP Database, © 2026 American Bankers Association. “CUSIP” is a registered trademark of the American 
Bankers Association. 
CFA® is a registered trademark owned by CFA Institute. 
For more information about Vanguard ETF Shares, visit vanguard.com , call 866-499-8473, or contact your broker to obtain a prospectus or, if available, a summary 
prospectus. Investment objectives, risks, charges, expenses, and other important information are contained in the prospectus; read and consider it carefully before 
investing. 
© 2026 The Vanguard Group, Inc. All rights reserved. Vanguard Marketing Corporation, Distributor.

---

Title: iShares Core S&P 500 ETF IVV | NYSE Arca Summary Prospectus — July 31, 2026
URL: https://www.ishares.com/us/literature/summary-prospectus/sp-ishares-core-s-and-p-500-etf-3-31.pdf
Published: N/A
Author: N/A
Highlights:
## iShares Core S&P 500 ETF IVV | NYSE Arca Summary Prospectus — July 31, 2026

Before you invest, you may want to review the Fund’s prospectus, which contains more information about the Fund and its risks. You can find the Fund’s prospectus and other information about the Fund, including the Fund’s statement of additional information and reports to shareholders, online at www.blackrock.com/prospectus. You can also get this information at no cost by calling 1-800-iShares (1-800-474-2737) or by sending an email request to iSharesETFs@blackrock.com, or from your financial professional. The Fund’s prospectus and statement of additional information, both dated July 31, 2026, as amended and supplemented from time to time, are incorporated by reference into this Summary Prospectus.

### Investment Objective

The iShares Core S&P 500 ETF (the “Fund”) seeks to track the investment results of an index composed of large-capitalization U.S. equities.

### Fees and Expenses

The following table describes the fees and expenses that you will incur if you buy, hold and sell shares of the Fund. Amounts 
in the table are rounded to the nearest basis point, which in some cases may be “0.00.” The investment advisory agreement 
between iShares Trust (the “Trust”) and BlackRock Fund Advisors (“BFA”) (the “Investment Advisory Agreement”) provides that 
BFA will pay all operating expenses of the Fund, except: (i) the management fees, (ii) interest expenses, (iii) taxes, 
(iv) expenses incurred with respect to the acquisition and disposition of portfolio securities and the execution of portfolio 
transactions, including brokerage commissions, (v) distribution fees or expenses, and (vi) litigation expenses and any 
extraordinary expenses. 
You may pay other fees, such as brokerage commissions and other fees to financial intermediaries, which are not 
reflected in the table and example below. 
Annual Fund Operating Expenses (expenses that you pay each year as a percentage of the value of your investment) 1 

| Management | Fee | | | | 0.03% |
| --- | --- | --- | --- | --- | --- |
| Other | Expenses | | | | 0.00% |
| Total | Annual Fund Operating Expenses | | | | 0.03% |
| Example. other shares Fund’s your Expense | 1 Operating expenses paid by BFA under the Investment This Example is intended to help you funds. The Example assumes that you invest at the end of those periods. The Example operating expenses remain the same. costs would be: Example | Advisory Agreement exclude acquired fund compare the cost of owning shares of the Fund $10,000 in the Fund for the time periods also assumes that your investment has a 5% Although your actual costs may be higher or lower, 1 Year | fees and expenses, with the indicated return each based 3 Years | if any. cost of investing and then sell year and on these assumptions, 5 Years | in all of your that the 10 Years |
| Example | Fund Costs | $3 | $10 | $17 | $39 |

...

Portfolio Turnover. The Fund may pay transaction costs, such as commissions, when it buys and sells securities (or “turns over” its portfolio). A higher portfolio turnover rate may indicate higher transaction costs and may result in higher taxes when Fund shares are held in a taxable account. These costs, which are not reflected in the Annual Fund Operating Expenses or in the Example, affect the Fund’s performance. During the most recent fiscal year, the Fund's portfolio turnover rate was 3% of the average value of its portfolio.

...

The Fund seeks to track the investment results of the S&P 500 (the “Underlying Index”), which measures the performance of the large-capitalization sector of the U.S. equity market, as determined by S&P Dow Jones Indices LLC (the “Index Provider” or “SPDJI”). As of March 31, 2026, the Underlying Index included approximately 88% of the market capitalization of all publicly traded U.S. equity securities. The securities in the Underlying Index are weighted based on the float-adjusted market value of their outstanding shares. The Underlying Index consists of securities from a broad range of industries. As of March 31, 2026, a significant portion of the Underlying Index was represented by securities of companies in the consumer goods and services and technology industries or sectors. The components of the Underlying Index are likely to change over time.

---

Title: iShares Core S&P 500 ETF | IVV
URL: https://www.ishares.com/us/products/239726/ishares-core-s-p-500-etf
Published: N/A
Author: N/A
Highlights:
# iShares Core S&P 500 ETF

NAV as of Oct 23, 2026

$$ 763.23 52 WK: 634.80 - 782.52

1 Day NAV Change as of Oct 23, 2026

Decrease $$-3.95(-0.51%)

NAV Total Return as of NAV Total Return as of More Info Oct 22, 2026

YTD: Increase 12.95%

30 Day SEC Yield as of 30 Day SEC Yield as of More Info Sep 30, 2026

0.95%

12m Trailing Yield as of 12m Trailing Yield as of More Info Sep 30, 2026

1.10%

Expense Ratio: Fees as stated in the prospectus

0.03%

Morningstar Rating Morningstar Rating More Info

4 stars

Morningstar Medalist Rating Morningstar Medalist Rating More Info

...

The iShares Core S&P 500 ETF seeks to track the S&P 500 Index, providing exposure to large-cap U.S. companies. The fund offers a low-cost solution as a core building block within a portfolio.

## Key Facts

Net Assets of Fund

$873,554,553,278 as of Oct 23, 2026

Closing Price

$763.25 as of Oct 23, 2026

Daily Volume Daily Volume More Info

4,190,639.00 as of Oct 23, 2026

Exchange NYSE Arca

Benchmark

...

## Portfolio Characteristics

Number of Holdings Number of Holdings More Info

504 as of Oct 22, 2026

30 Day SEC Yield 30 Day SEC Yield More Info

0.95% as of Sep 30, 2026

12m Trailing Yield 12m Trailing Yield More Info

1.10% as of Sep 30, 2026

Standard Deviation (3y) Standard Deviation (3y) More Info 12.42% as of Sep 30, 2026

P/B Ratio P/B Ratio More Info 5.63 as of Oct 22, 2026

Equity Beta (3y) Equity Beta (3y) More Info 1.00 as of Sep 30, 2026

P/E Ratio P/E Ratio More Info 29.37 as of Oct 22, 2026

...

0.000000 | $0.000000 |

as of current prospectus

Management Fee 0.03%

Acquired Fund Fees and Expenses Acquired Fund Fees and Expenses More Info 0.00%

Other Expenses + 0.00%

Expense Ratio Expense Ratio More Info 0.03%

The amounts shown above are as of the current prospectus, but may not include extraordinary expenses incurred by the Fund over the past fiscal year. Amounts are rounded to the nearest basis point, which in some cases may be "0.00".

---

Title: GET INVESTED.
URL: https://www.ishares.com/us/literature/brochure/ishares-product-list-en-us.pdf
Published: N/A
Author: N/A
Highlights:
##### GET INVESTED. iShares U.S. ETF & ETP Product List as of 9/1/2026

#### ISHARES CORE ETFS

Low-cost stock and bond ETFs to build the foundation of a portfolio.

U.S. stocks

International stocks (continued)

Trading symbol

Expense ratio (%)

Trading symbol

Expense ratio (%)

Fund name

Fund name

iShares Core MSCI Emerging Markets ETF IEMG 0.09

| iShares Core Dividend ETF | DIVB | 0.05 |
| --- | --- | --- |
| iShares Core Dividend Growth ETF | DGRO | 0.08 |
| iShares Core High Dividend ETF | HDV | 0.08 |
| iShares Core S&P 500 ETF | IVV | 0.03 |
| iShares Core S&P Mid-Cap ETF | IJH | 0.05 |
| iShares Core S&P Small-Cap ETF | IJR | 0.06 |
| iShares Core S&P Total U.S. Stock Market | | |
| ETF | ITOT | 0.03 |
| iShares Core S&P U.S. Growth ETF | IUSG | 0.04 |
| iShares Core S&P U.S. Value ETF | IUSV | 0.04 |
| iShares Core U.S. REIT ETF | USRT | 0.08 |
| International stocks iShares Core MSCI EAFE ETF | IEFA | 0.07 |
| iShares Core MSCI International Developed Markets ETF | IDEV | 0.04 |

| iShares Core MSCI Europe ETF | IEUR | 0.09 |
| --- | --- | --- |
| iShares Core MSCI Pacific ETF | IPAC | 0.09 |
| Bonds | | |
| iShares Core 10+ Year USD Bond ETF | ILTB | 0.06 |
| iShares Core 1-5 Year USD Bond ETF | ISTB | 0.06 |
| iShares Core 5-10 Year USD Bond ETF | IMTB | 0.06‡ |
| iShares Core International Aggregate Bond ETF | IAGG | 0.07 |
| iShares Core Universal USD Bond ETF | IUSB | 0.06 |
| iShares Core U.S. Aggregate Bond ETF | AGG | 0.03 |
| iShares Core Allocation ETFs iShares Core Aggressive Allocation ETF | AOA | 0.15‡ |
| iShares Core Conservative Allocation ETF | AOK | 0.15‡ |
| iShares Core Growth Allocation ETF | AOR | 0.15‡ |

...

| iShares LifePath Target Date† 2030 ETF | ITDB | 10/17/23 | 0.09 |
| --- | --- | --- | --- |
| iShares LifePath Target Date† 2035 ETF | ITDC | 10/17/23 | 0.10 |
| iShares LifePath Target Date† 2040 ETF | ITDD | 10/17/23 | 0.11 |
| iShares LifePath Target Date† 2045 ETF | ITDE | 10/17/23 | 0.11 |
| iShares LifePath Target Date† 2050 ETF | ITDF | 10/17/23 | 0.11 |
| iShares LifePath Target Date† 2055 ETF | ITDG | 10/17/23 | 0.11 |
| iShares LifePath Target Date† 2060 ETF | ITDH | 10/17/23 | 0.11 |
| iShares LifePath Target Date† 2065 ETF | ITDI | 10/17/23 | 0.11 |
| iShares LifePath Target Date 2070 ETF Regions U.S. – Broad market iShares Core S&P Total U.S. Stock Market ETF | ITDJ ITOT | 11/12/24 1/20/04 | 0.12 0.03 |
| iShares Core S&P U.S. Growth ETF | IUSG | 7/24/00 | 0.04 |
| iShares Core S&P U.S. Value ETF | IUSV | 7/24/00 | 0.04 |
| iShares Dow Jones U.S. ETF iShares Russell 3000 ETF | IYY IWV | 6/12/00 5/22/00 | 0.20 0.20 |
| iShares S&P 500 3% ETF Capped ETF | TOPC | 4/15/25 | 0.09† |
| U.S. – Large cap | | | |
| iShares Core Dividend ETF | DIVB | 11/7/17 | 0.05 |
| iShares Core Dividend Growth ETF | DGRO | 6/10/14 | 0.08 |
| iShares Core High Dividend ETF | HDV | 3/29/11 | 0.08 |
| iShares Core S&P 500 ETF | IVV | 5/15/00 | 0.03 |
| iShares Enhanced Large Cap Core | | | |
| Active ETF† | ENHU | 11/4/25 | 0.22 |
| iShares ESG Aware MSCI USA ETF | ESGU | 12/1/16 | 0.15 |
| iShares Factors U.S. Growth Style ETF | STLG | 1/14/20 | 0.15 |
| iShares Large Cap Accelerated ETF | TWOX | 1/15/25 | 0.50‡ |

---

Title: The S&P 500 ETF You Know Charges 0.0945%. These 2 Charge 0.03% - 24/7 Wall St.
URL: https://247wallst.com/investing/etf/2026/10/08/the-sp-500-etf-you-know-charges-0-0945-these-2-charge-0-03/
Published: 2026-10-08T22:03:10.000Z
Author: Ryne Mauck
Highlights:
Investors who buy the best-known S&P 500 fund pay the highest fee in the group. The State Street SPDR S&P 500 ETF Trust (NYSEARCA:SPY) has an expense ratio of 0.0945%, according to State Street’s fact sheet dated March 17, 2026.

The Vanguard S&P 500 ETF (NYSEARCA:VOO) charges 0.03%, per Vanguard’s fact sheet dated March 25, 2026. The iShares Core S&P 500 ETF (NYSEARCA:IVV) also charges 0.03%, per its SEC prospectus dated July 31, 2026.

...

Document

SPY’s 0.0945% comes from State Street’s March 17, 2026 fact sheet. State Street’s fund page lists the same 0.0945% gross expense ratio this month.

Vanguard’s March 25, 2026 fact sheet lists VOO’s fee at 0.03%. The fund’s semi-annual report sets the six-month cost of a hypothetical $10,000 investment at approximately $2, or 0.03% annualized.

IVV’s 0.03% comes from the prospectus filed with the SEC and dated July 31, 2026. The fee table shows a 0.03% management fee and 0.00% in other expenses. That’s because BlackRock Fund Advisors pays nearly all of the

---

Title: SPY vs VOO vs IVV in 2026: Fees, Tracking and Which One to Hold | DataPorium
URL: https://dataporium.tech/articles/spy-vs-voo-vs-ivv-in-2026-fees-tracking-and-which-one-to-hold
Published: 2026-07-03T14:30:00.000Z
Author: Dataporium LLC
Highlights:
SPY's fee is 0.0945% a year ($9.45 per $10,000) vs 0.03% for VOO and IVV. SPY yielded 0.99% and VOO 1.05% as of Oct. 19, 2026.

...

SPY's fee is 0.0945% a year, about $9.45 for every $10,000 invested, while VOO and IVV each charge 0.03%, or $3.00 per $10,000, according to the funds' fact sheets as of June 30, 2026 [3] [4] [5]. DataPorium price and dividend data show the gap in results: SPY's trailing 12-month dividends of $7.583 a share gave a yield of 0.99% on its October 19, 2026 close of $766.48, against 1.05% for VOO and 1.09% for IVV [1] [2]. From April 29 to October 19, 2026, SPY returned 8.26% with dividends reinvested, VOO 8.29% and IVV 8.31%. SPY's edge is trading volume: about $35.9 billion of its shares changed hands on an average day in that period, more than six times as much as VOO or IVV [2].

...

## What is SPY's fee, and what does it cost in dollars?

The SPDR S&P 500 ETF Trust (SPY) reports a gross expense ratio of 0.0945%, and State Street lists the net expense ratio at the same 0.0945%, so no fee waiver could expire [3]. The Vanguard S&P 500 ETF (VOO) and the iShares Core S&P 500 ETF (IVV) each charge 0.03% [4] [5]. IVV's 0.03% is entirely a management fee, with no acquired fund fees or other expenses [5]. VOO's 0.03% is the figure in its most recent prospectus [4].

An expense ratio is the share of assets a fund deducts each year to pay its costs. It is not billed separately; it comes out of the fund's income before dividends are paid. The arithmetic for the fees on the June 30, 2026 fact sheets is simple:

| Amount invested | SPY (0.0945%) | VOO or IVV (0.03%) | Extra cost of SPY per year | Extra cost over 10 years (no growth) |
| --- | --- | --- | --- | --- |
| $10,000 | $9.45 | $3.00 | $6.45 | $64.50 |
| $100,000 | $94.50 | $30.00 | $64.50 | $645.00 |

Source: expense ratios from the State Street, Vanguard and iShares fact sheets as of June 30, 2026 [3] [4] [5]; dollar amounts are the expense ratio times the amount invested.

...

The 10-year column assumes the balance never grows. In practice the fee is charged on a rising balance, so the dollar gap grows with the market. Vanguard notes that the average S&P 500 index fund charged 0.41% as of December 31, 2025, so all three ETFs are cheap for the category, but SPY costs about three times as much as the other two [4].

---

Title: VOO vs. SPY vs. IVV: The One Factor That Sets These S&P 500 ETFs Apart | The Motley Fool
URL: https://www.fool.com/investing/2026/03/18/voo-spy-ivv-one-factor-sets-sp-500-etfs-apart/
Published: 2026-03-18T13:45:00.000Z
Author: David Dierking
Highlights:
## VOO vs. SPY vs. IVV: Expenses and fees

Two factors go into a fund's total cost of ownership -- the fund's expense ratio, which is set by the issuer, and the fund's trading spread, which is determined by the market and liquidity.

It's important to look at both numbers because an ultra-low expense ratio doesn't necessarily equate to "cheap." Funds that have low assets under management (AUM) and are thinly traded generally come with higher trading costs. Even if that fund has an expense ratio of 0.10%, for example, the total cost of ownership can make it decidedly average.

But that's not the case with these three ETFs. They are huge and highly liquid. Here's how they stack up against each other.

| ETF Name | Expense Ratio | Trading Spread | Total Cost |
| --- | --- | --- | --- |
| Vanguard S&P 500 ETF (VOO) | 0.03% | 0.00% | 0.03% |
| State Street SPDR S&P 500 ETF (SPY) | 0.0945% | 0.00% | 0.0945% |
| iShares Core S&P 500 ETF (IVV) | 0.03% | 0.00% | 0.03% |

Data source: Fund websites, ETF Action.

...

Even the largest funds usually have trading spreads of at least 0.01%. But these ETFs are so big, their trading spreads round down to zero. So there's virtually no differentiation on this front.

But there is a difference in expense ratios. The Vanguard and iShares ETFs are at 0.03%, but the State Street SPDR S&P 500 ETF is more than triple that. Despite the cost disadvantage, it's still favored by big institutional investors because it trades about 10 times the daily dollar volume as the other two. For them, liquidity is the bigger factor.

For retail investors, the expense ratio will be the bigger factor. Given that their total cost of ownership is the same and they trade roughly the same dollar volume daily, there's virtually no difference between the Vanguard S&P 500 ETF and the iShares Core S&P 500 ETF.

---

Title: VOO vs SPY vs IVV (2026): Expense Ratios, AUM, Tracking & Liquidity | FundDuel
URL: https://etf.thicket.sh/blog/voo-vs-spy-vs-ivv-2026
Published: 2026-05-31T12:25:18.000Z
Author: Marcus Chen
Highlights:
## The Headline Numbers (as of 2026-05-31)

| Metric | VOO | SPY | IVV |
| --- | --- | --- | --- |
| Issuer | Vanguard | State Street SPDR | BlackRock iShares |
| Expense ratio | 0.03% | 0.0945% | 0.03% |
| AUM (approx.) | ~$553B | ~$1.10T | ~$1.00T |
| Inception | Sep 2010 | Jan 1993 | May 2000 |
| Legal structure | Open-end ETF (RIC) | Unit Investment Trust (UIT) | Open-end ETF (RIC) |
| Dividend reinvestment | Internal, immediate | Held as cash to distribution | Internal, immediate |
| Securities lending | Yes | No (UIT-restricted) | Yes |
| Avg daily $ volume | ~$3-4B | ~$30-40B | ~$2-3B |
| 30-day SEC yield | ~1.30% | ~1.30% | ~1.30% |
| Index tracked | S&P 500 | S&P 500 | S&P 500 |

Expense ratios verified on each issuer’s fund page (source: investor.vanguard.com/voo, ssga.com/spy, ishares.com/IVV). AUM figures from each issuer’s May 2026 fact sheet; treat them as approximate, AUM drifts daily with creations and market moves.

...

## Expense Ratio: VOO and IVV Tie, SPY Costs 3x More

This is the single largest difference between the three. VOO and IVV both charge 0.03%, the realistic floor for an S&P 500 ETF at trillion-dollar scale. SPY charges 0.0945%, more than three times higher. On a $100,000 position the math works out to:

- VOO or IVV: $30 per year
- SPY: $94.50 per year
- Annual difference: $64.50 in favor of VOO/IVV

Compounded across 30 years at a 10% gross return, that 6.45 basis-point fee gap costs roughly $4,400 of terminal wealth on the original $100,000 position. Not life changing, but real, and it accrues every year regardless of market direction. For an institutional holder of $1 billion in
```

**Tool: websearch**

**Input:**
```json
{
  "query": "QQQ VTI SCHD expense ratio 2026 official Invesco Vanguard State Street"
}
```

**Output:**
```
Title: Invesco QQQ ETF | Invesco US
URL: https://www.invesco.com/qqq-etf/en/home.html
Published: N/A
Author: N/A
Highlights:
## Access 100 top innovators in a single ETF 

QQQ provides exposure to companies at the forefront of innovation across a diverse range of sectors, all in one investment.

## Invesco QQQ has captured 755.89% more returns than the S&P 500 

Since launching in 1999, Invesco QQQ has demonstrated a history of outperformance, typically beating the S&P 500 Index.

Source: Bloomberg L.P, as of 6/30/2026. Cumulative outperformance is 755.89%. Fund performance shown at NAV. Data is as of Invesco QQQ ETF inception date of March 10, 1999. Invesco QQQ’s total expense ratio is 0.18%.

...

### What’s the total cost of ETF investing? 

An ETF’s total cost of ownership depends on more than just its expense ratio. Investors also need to consider bid-ask spreads, trading commissions, and premiums and discounts, for example.

For more information on calculating costs of ETFs, click here.

Bid/ask spread is the amount by which the ask price exceeds the bid price for an asset in the market.

---

Title: SCHD | Schwab U.S. Dividend Equity ETF | Schwab Asset Management
URL: https://www.schwabassetmanagement.com/products/schd
Published: N/A
Author: N/A
Highlights:
SCHD | Schwab U.S. Dividend Equity ETF | Schwab Asset Management

 Type: ETFs Symbol: SCHD Total Expense Ratio: 0.060% 

### Objective

The fund’s goal is to track as closely as possible, before fees and expenses, the total return of the Dow Jones U.S. Dividend 100™ Index.

...

22,500,700 
- Previous Close Value 

 -- 
- 30-Day Median Bid/Ask Spread 

 0.03% 

 09/23/2026 - 10/23/2026 
- Bid/Ask Midpoint 

 $35.39 

 As of 10/23/2026 
- Premium/Discount 

 0.02% 

 As of 10/23/2026 

### Fund Profile

| Fund Inception | | 10/20/2011 |
| --- | --- | --- |
| Total Net Assets As of 10/23/2026 | 10/23/2026 | $118,697,006,995.71 |
| Total Expense Ratio | | 0.060% |
| Index Name | | Dow Jones U.S. Dividend 100 Index |
| Shares Outstanding As of 10/23/2026 | 10/23/2026 | 3,366,200,000 |
| NAV As of 10/23/2026 | 10/23/2026 | $35.26 |
| Total Holdings As of 10/22/2026 | 10/22/2026 | 102 |
| Portfolio Turnover Rate As of 09/30/2026 | 09/30/2026 | 40.61% |
| Morningstar Category | | Large Value |
| Management Style | | Passive |
| CUSIP | | 808524797 |
| Exchange | | NYSE Arca, Inc. |

---

Title: Vanguard Morningstar Total Stock Market ETF
URL: https://workplace.vanguard.com/assets/corp/fund_communications/pdf_publish/us-products/fact-sheet/F0970.pdf
Published: N/A
Author: Vanguard
Highlights:
### Vanguard

## Vanguard Morningstar Total Stock Market ETF | VTI

As of September 30, 2026

##### Investment focus

Investment style

Growth

Value

Blend

Large

#### Investment approach

• Seeks to track the performance of the Morningstar US Total Market Index. 
• Large-, mid-, and small-cap equity diversified across growth and value styles. 
• Employs a passively managed, index-sampling strategy. 
• The fund remains fully invested. 
• Low expenses minimize net tracking error. 

Mid

Central tendency Expected range of fund holdings

Small

M

Quick facts

#### About the benchmark

• The Morningstar US Total Market Index represents approximately 100% of investable companies in the U.S. equity market. 
• The index is designed to accurately represent the U.S. equity market and deliver low turnover. 

Performance history

Total returns 2 for period ended September 30, 2026

Year to date 1 year 3 years 5 years 10 years

Since inception

VTI (Inception 2001-05-24) Quarter

| Net asset value (NAV) return 3 | 1.36% | 12.58% | 15.33% | 22.32% | 12.56% | 14.70% | 9.44% |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Market price return 4 | 1.39 | 12.59 | 15.35 | 22.34 | 12.56 | 14.70 | 9.44 |
| Spliced Total Stock Market Index | 1.36 | 12.58 | 15.33 | 22.33 | 12.56 | 14.70 | 9.45 |

| Benchmark | Morningstar US Total Market Index | |
| --- | --- | --- |
| Expense ratio 1 | | 0.03% |
| Dividend schedule | | Quarterly |
| ETF total net assets | $689,219 million | |
| Fund total net assets | $2,322,816 million | |
| Inception date | 2001-05-24 | |
| Trading information | | |
| Ticker symbol | | VTI |
| CUSIP number | 922908769 | |
| IIV (intra-day ticker) | | VTI.IV |
| Index ticker (Bloomberg) | | CRSPTMT |
| Exchange | | NYSE Arca |
| ETF attributes | Morningstar US Morningstar Total Total Market Stock Market ETF | Index |
| Number of stocks | 3,519 | 3,478 |
| Median market cap | $370.4B | $370.4B |
| Price/earnings ratio | 24.1x | 24.0x |
| Price/book ratio | 4.8x | 4.8x |
| Return on equity | 26.3% | 26.3% |
| Earnings growth rate | 23.4% | 23.4% |
| Turnover rate 5 | 2.6 | — |
| Standard deviation 6 | 12.84% | 12.83% |

...

1.As reported in the most recent prospectus. A fund’s current expense ratio may be lower or higher than the figure reported in the prospectus. 
2. Figures for periods of less than one year are cumulative returns. All other figures represent average annual returns. Fund performance figures assume the reinvestment of dividends and capital gains distributions; 
the figures are pre-tax and net of expenses. The above widely used comparative index represents unmanaged or average returns on various financial assets that can be compared with the fund’s total returns for 
the purpose of measuring relative performance. 
3. As of 4 p.m., Eastern time, when the regular trading session of the New York Stock Exchange typically closes. 
4. Effective July 15, 2024, the market price returns are calculated using the official closing price as reported by the ETF’s primary exchange. Prior to July 15, 2024, the market price returns were calculated using the 
midpoint between the bid and ask prices as of the closing time of the New York Stock Exchange (typically 4 p.m., Eastern time). The returns shown do not represent the returns you would receive if you traded 
shares at other times. 
5. For most recent fiscal year. Turnover rate excludes the value of portfolio securities received or delivered as a result of in-kind purchases or redemptions of the fund’s capital shares, including Vanguard ETF Creation 
Units. 
6. A measure of the volatility of a fund—based on the fund’s last three years of monthly returns—used to indicate the dispersion of past returns. A higher standard deviation means a greater potential for volatility. 
For funds with less than 36 months of performance history, standard deviation is not calculated.

...

### Vanguard Morningstar Total Stock Market ETF | VTI

As of September 30, 2026

Tenlargest holdings and%of total netassets 2

Expense ratio comparison 1 0.97%

0.46%

0.03%

Multi-Cap Core Funds Average

Morningstar Total Stock Market ETF

Multi-Cap Core Funds Average ETFs only

...

1.Represents the expense ratio for the Vanguard ETF as reported in the most recent prospectus. There are material differences between mutual funds and ETFs. Unlike mutual funds, ETFs are priced continuously 
and bought and sold throughout the day in the secondary market (at a premium or discount to net asset value) with the assistance of a stockbroker, which entails paying commissions. Sources: Lipper, a 
Thomson Reuters Company, and Vanguard, December 31, 2025. 
2. The holdings listed exclude any temporary cash investments and equity index products. 
3. Sector categories are based on the Industry Classification Benchmark system (“ICB”), except for the “Other” category (if applicable), which includes securities that have not been provided an ICB classification 
as of the effective reporting period. 
Vanguard ETF Shares are not redeemable with the issuing Fund other than in very large aggregations worth millions of dollars. Instead, investors must buy and sell Vanguard 
ETF Shares in the secondary market and hold those shares in a brokerage account. In doing so, the investor may incur brokerage commissions and may pay more than net 
asset value when buying and receive less than net asset value when selling. 
All ETF products are subject to risk, which may result in the loss of principal. Prices of mid- and small-cap ETF products often fluctuate more than those of large-cap ETF 
products. 
The Morningstar Indexes are the exclusive property of Morningstar, Inc. Morningstar, Inc., its affiliates and subsidiaries, its direct and indirect information providers and any other third party 
involved in, or related to, compiling, disseminating, computing or creating any Morningstar Index (collectively, “Morningstar Parties”) do not guarantee the accuracy, completeness and/or 
timeliness of the Morningstar Indexes or any data included therein and shall have no liability for any errors, omissions, or interruptions therein. None of the Morningstar Parties make any 
representation or warranty, express or implied, as to the results to be obtained from the use of the Morningstar Indexes or any data included therein. 
CGS identifiers have been provided by CUSIP Global Services, managed on behalf of the American Bankers Association by Standard & Poor’s Financial Services, LLC, and are not for use or 
dissemination in a manner that would serve as a substitute for any CUSIP service. The CUSIP Database, © 2026 American Bankers Association. “CUSIP” is a registered trademark of the American 
Bankers Association. 
CFA® is a registered trademark owned by CFA Institute. 
For more information about Vanguard ETF Shares, visit vanguard.com , call 866-499-8473, or contact your broker to obtain a prospectus or, if available, a summary 
prospectus. Investment objectives, risks, charges, expenses, and other important information are contained in the prospectus; read and consider it carefully before 
investing. 
© 2026 The Vanguard Group, Inc. All rights reserved. Vanguard Marketing Corporation, Distributor.

---

Title: ProductLineup
URL: https://www.ssga.com/library-content/products/fund-docs/etfs/us/information-schedules/spdr-etf-listing.pdf
Published: N/A
Author: N/A
Highlights:
Product Listing

®

## State Street

## ProductLineup

Ticker Fund Name Net Expense Ratio (%)

Ticker Fund Name Net Expense Ratio (%)

Low Cost Core continued

#### Low Cost Core

Fixed Income continued

US Equities SPTM ● State Street SPDR Portfolio S&P 1500 Composite Stock Market

0.03

SPYM ● State Street SPDR Portfolio S&P 500 0.02

| SPBO | ● | State Street SPDR Portfolio Corporate Bond | 0.03 |
| --- | --- | --- | --- |
| SPTU | | State Street SPDR Portfolio Ultra Short T-Bill | 0.05 |
| SPTS | ● | State Street SPDR Portfolio Short Term Treasury | 0.03 |
| SPTI | ● | State Street SPDR Portfolio Intermediate Term Treasury | 0.03 |
| SPTL | ● | State Street SPDR Portfolio Long Term Treasury | 0.03 |
| SPTB | | State Street SPDR Portfolio Treasury | 0.03 |
| SPMB | ● | State Street SPDR Portfolio Mortgage Backed Bond | 0.04 |
| SPHY | ● | State Street SPDR Portfolio High Yield Bond | 0.05 |
| SPIP US Equities Core | ● | State Street SPDR Portfolio TIPS | 0.12 |
| SPTM | ● | State Street SPDR Portfolio S&P 1500 Composite Stock Market | 0.03 |
| SPYM | ● | State Street SPDR Portfolio S&P 500 | 0.02 |
| SPMD | ● | State Street SPDR Portfolio S&P 400 Mid Cap | 0.03 |
| SPSM | ● | State Street SPDR Portfolio S&P 600 Small Cap | 0.03 |
| QNDX | ● | State Street SPDR Portfolio Nasdaq 100 | 0.10 |
| SPY | ● | State Street SPDR S&P 500 | 0.0945 |
| MDY | ● | State Street SPDR S&P MIDCAP 400 | 0.23 |
| DIA | ● | State Street SPDR Dow Jones Industrial Average | 0.16 |

| SPMD | ● | State Street SPDR Portfolio S&P 400 Mid Cap | 0.03 |
| --- | --- | --- | --- |
| SPSM | ● | State Street SPDR Portfolio S&P 600 Small Cap | 0.03 |
| QNDX | ● | State Street SPDR Portfolio Nasdaq 100 | 0.10 |
| SPYG SPYV SPYD SPDG International Equities | ● ● ● | State Street SPDR Portfolio S&P 500 Growth State Street SPDR Portfolio S&P 500 Value State Street SPDR Portfolio S&P 500 High Dividend State Street SPDR Portfolio S&P Sector Neutral Dividend | 0.04 0.04 0.07 0.05 |
| SPGM | ● | State Street SPDR Portfolio MSCI Global Stock Market | 0.09 |
| SPDW | ● | State Street SPDR Portfolio Developed World ex-US | 0.03 |
| SPEU | ● | State Street SPDR Portfolio Europe | 0.07 |
| SPEM Fixed Income SPAB SPSB | ● ● ● | State Street SPDR Portfolio Emerging Markets State Street SPDR Portfolio Aggregate Bond State Street SPDR Portfolio Short Term Corporate Bond | 0.07 0.03 0.04 |
| SPIB | ● | State Street SPDR Portfolio Intermediate Term Corporate Bond | 0.04 |
| SPLB | ● | State Street SPDR Portfolio Long Term Corporate Bond | 0.04 |

Low-Cost Core Products are in BOLD text. New Fund As of July 9, 2026. Options availability as of July 9, 2026.

● Options are available on these State Street ETFs. Availability is subject to change without notice. Options trading is not appropriate for all investors. Options trading involves significant risk, including unlimited financial loss. 

▲ Active Funds

...

##### Model Name Weighted Average Expense Ratio (%)*

#### Model Portfolios

State Street Active Asset Allocation ETF Portfolios

International 
EMHC State Street SPDR Bloomberg Emerging 
Markets USD Bond 

0.23

| EBND | ● | SPDR Bloomberg Emerging Markets Local Bond | 0.30 |
| --- | --- | --- | --- |
| IBND | ● | SPDR Bloomberg International Corporate Bond | 0.50 |
| BWZ | | SPDR Bloomberg Short Term InternationalTreasury Bond | 0.35 |
| BWX WIP Commodities/Real Assets | ● ● | SPDR Bloomberg International Treasury Bond SPDR FTSE International Government Inflation-Protected Bond | 0.35 0.50 |
| ® GLD | ● | SPDR ® Gold Shares | 0.40 |
| GLDM | ® | SPDR ® Gold MiniShares | ® Trust 0.10 |
| CERY | ● | State Street SPDR Bloomberg Enhanced Commodity Strategy No K-1 | 0.28 |
| GII | ● | State

...

##### Model Name Weighted Average Expense Ratio (%)*

##### Model Name Weighted Average Expense Ratio (%)*

Model Portfolios continued

Model Portfolios continued

0.25

State Street Strategic Multi-Asset Income ETF Portfolio

State Street Tax-Sensitive Strategic Asset Allocation ETF Portfolios

0.27

State Street Active Multi-Asset Income ETF Portfolio

| Conservative | 0.19 |
| --- | --- |
| Moderate Conservative | 0.17 |
| Moderate | 0.14 |
| Moderate Growth | 0.10 |

0.08

State Street US Equity Sector Rotation ETF Portfolio

0.34

State Street Multi-Asset Real Return ETF Portfolio

Growth 0.07 As of July 9, 2026. Options availability as of July 9, 2026. * Weighted average expense ratios as of June 30, 2026.

---

Title: Compare ETFs - Fund Comparison Tool - Vanguard
URL: https://investor.vanguard.com/tools-calculators/etf-fund-comparison-tool
Published: N/A
Author: N/A
Highlights:
The expense ratios of exchange-traded funds (ETFs) often are lower than corresponding mutual funds because ETFs are traded through brokerage firms, alleviating administrative costs. When purchasing or selling ETFs, however, you may incur transaction costs that would not apply to no-load mutual funds.

Quotes delayed at least 15 minutes. Market data provided by FactSet.

Non-Vanguard fund expense ratio data provided by Morningstar are for the fund's latest fiscal year and may vary from current expense ratios. Such data do not reflect fee waivers, expense recoupments, or expense reimbursements, which the applicable fund manager may discontinue at any time. For more complete information about fees and expenses, see the fee table in the fund's prospectus. Vanguard is not responsible for the accuracy or timeliness of third-party data.

Non-Vanguard ETF expense ratio data provided by Morningstar are for the fund's latest fiscal year and may vary from current expense ratios. Such data do not reflect fee waivers, expense recoupments, or expense reimbursements, which the applicable fund manager may discontinue at any time. For more complete information about fees and expenses, see the fee table in the fund's prospectus. Vanguard is not responsible for the accuracy or timeliness of third-party data.

...

Expressed as a percentage, the expense ratios are fees charged to investors to cover a fund or ETF's operating costs. They're

---

Title: SCHD vs. VTI: Head-To-Head ETF Comparison | ETF Database
URL: https://etfdb.com/tool/etf-comparison/SCHD-VTI/
Published: N/A
Author: N/A
Highlights:
The table below compares many ETF metrics between SCHD and VTI. Compare fees, performance, dividend yield, holdings, technical indicators, and many other metrics to make a better investment decision. 

## Overview

 Some important comparison metrics here are expense ratio, issuer, AUM, and shares outstanding, among others. Furthermore, ADV in the 11th and 12th row, which stands for Average Daily Volume, can help investors avoid illiquid ETFs. 

| | SCHD | VTI |
| --- | --- | --- |
| Name | Schwab US Dividend Equity ETF | Vanguard Morningstar Total Stock Market ETF |
| ETF Database Category | Large Cap Blend Equities | Large Cap Growth Equities |
| Index | Dow Jones U.S. Dividend 100 Index | CRSP US Total Market Index |
| Index Description | View Index | View Index |
| Expense Ratio | 0.06% | 0.03% |
| Issuer | The Charles Schwab Corp. | Vanguard |
| Structure | ETF | ETF |
| Inception Date | 2011-10-20 | 2001-05-24 |
| AUM | $116B | $702B |
| Shares Outstanding | 3.36B | 1.85B |
| ADV(1 month) | 22,932,728.0 | 3,007,665.0 |
| ADV(3 month) | 22,954,252.0 | 2,998,258.0 |
| ETF Home Page | View Page | View Page |
| Fact Sheet Link | Fact Sheet | Fact Sheet |

---

Title: Vanguard ETFs List | Vanguard
URL: https://investor.vanguard.com/investment-products/list/etfs
Published: N/A
Author: N/A
Highlights:
Vanguard funds, visit vanguard.com to obtain a prospectus or, if available, a summary prospectus. Investment objectives, risks, charges, expenses, and other important information about a fund are contained in the prospectus; read and consider it carefully

---

Title: Vanguard SandP 500 ETF
URL: https://workplace.vanguard.com/assets/corp/fund_communications/pdf_publish/us-products/fact-sheet/F0968.pdf
Published: N/A
Author: Vanguard
Highlights:
### Vanguard

## Vanguard S&P 500 ETF | VOO

As of September 30, 2026

##### Investment focus

Investment style

Growth

Value

Blend

Large

#### Investment approach

• Seeks to track the performance of the S&P 500 Index. 
• Large-cap equity. 
• Employs a passively managed, full-replication strategy. 
• Fund remains fully invested. 
• Low expenses minimize net tracking error. 

Mid

Central tendency Expected range of fund holdings

Small

M

Quick facts

#### About the benchmark

• The S&P 500 Index is a widely recognized benchmark of U.S. stock market performance that is dominated by the stocks of large U.S. companies. 
• The index includes 500 leading companies in leading industries of the U.S. economy. 

Performance history

Total returns 2 for period ended September 30, 2026

Year to date 1 year 3 years 5 years 10 years

Since inception

VOO (Inception 2010-09-07) Quarter

| Net asset value (NAV) return 3 | 2.30% | 12.72% | 15.70% | 22.85% | 13.75% | 15.29% | 14.94% |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Market price return 4 | 2.31 | 12.74 | 15.78 | 22.88 | 13.76 | 15.30 | 14.94 |
| S&P 500 Index | 2.30 | 12.75 | 15.74 | 22.89 | 13.79 | 15.33 | 14.98 |

| Benchmark | | S&P 500 Index |
| --- | --- | --- |
| Expense ratio 1 | | 0.03% |
| Dividend schedule | | Quarterly |
| ETF total net assets | | $1,032,260 million |
| Fund total net assets | | $1,732,017 million |
| Inception date | | 2010-09-07 |
| Trading information | | |
| Ticker symbol | | VOO |
| CUSIP number | | 922908363 |
| IIV (intra-day ticker) | | VOO.IV |
| Index ticker (Bloomberg) | | SPTR |
| Exchange | | NYSE Arca |
| ETF attributes | S&P 500 ETF | S&P 500 Index |
| Number of stocks | 505 | 503 |
| Median market cap | $462.2B | $462.2B |
| Price/earnings ratio | 24.7x | 24.7x |
| Price/book ratio | 5.3x | 5.3x |
| Return on equity | 29.0% | 29.0% |
| Earnings growth rate | 24.5% | 24.5% |
| Turnover rate 5 | 2.4 | — |
| Standard deviation 6 | 12.43% | 12.42% |

...

1.As reported in the most recent prospectus. A fund’s current expense ratio may be lower or higher than the figure reported in the prospectus. 
2. Figures for periods of less than one year are cumulative returns. All other figures represent average annual returns. Fund performance figures assume the reinvestment of dividends and capital gains distributions; 
the figures are pre-tax and net of expenses. The above widely used comparative index represents unmanaged or average returns on various financial assets that can be compared with the fund’s total returns for 
the purpose of measuring relative performance. 
3. As of 4 p.m., Eastern time, when the regular trading session of the New York Stock Exchange typically closes. 
4. Effective July 15, 2024, the market price returns are calculated using the official closing price as reported by the ETF’s primary exchange. Prior to July 15, 2024, the market price returns were calculated using the 
midpoint between the bid and ask prices as of the closing time of the New York Stock Exchange (typically 4 p.m., Eastern time). The returns shown do not represent the returns you would receive if you traded 
shares at other times. 
5. For most recent fiscal year. Turnover rate excludes the value of portfolio securities received or delivered as a result of in-kind purchases or redemptions of the fund’s capital shares, including Vanguard ETF Creation 
Units. 
6. A measure of the volatility of a fund—based on the fund’s last three years of monthly returns—used to indicate the dispersion of past returns. A higher standard deviation means a greater potential for volatility. 
For funds with less than 36 months of performance history, standard deviation is not calculated. 

### Vanguard S&P 500 ETF | VOO

As of September 30, 2026

Expense ratio comparison 1

Tenlargest holdings and%of total netassets 2

0.41%

0.03%

S&P 500 ETF

S&P 500 Index Funds Average

Portfolio management Vanguard Capital Management

| NVIDIA Corp. | 8.4 % |
| --- | --- |
| Apple Inc. | 7.4 % |
| Microsoft Corp. | 5.8 % |
| Alphabet Inc. | 5.5 % |
| Amazon.com Inc. | 3.7 % |
| Broadcom Inc. | 2.5 % |
| Meta Platforms Inc. | 2.4 % |
| Micron Technology Inc. | 1.8 % |
| Tesla Inc. | 1.5 % |
| Advanced Micro Devices Inc. | 1.5 % |
| Top ten as % of total net assets | 40.6% |
| Sector Diversification 3 | |
| Information Technology | 39.7 % |
| Financials | 11.4 % |
| Communication Services | 9.9 % |
| Health Care | 9.3 % |
| Consumer Discretionary | 8.6 % |
| Industrials | 8.0 % |
| Consumer Staples | 4.4 % |
| Energy | 3.4 % |
| Utilities | 1.9 % |
| Materials | 1.7 % |
| Real Estate | 1.7 % |
| Other | 0.0 % |

...

1.Represents the expense ratio for the Vanguard ETF as reported in the most recent prospectus. There are material differences between mutual funds and ETFs. Unlike mutual funds, ETFs are priced continuously 
and bought and sold throughout the day in the secondary market (at a premium or discount to net asset value) with the assistance of a stockbroker, which entails paying commissions. Sources: Lipper, a 
Thomson Reuters Company, and Vanguard, December 31, 2025. 
2. The holdings listed exclude any temporary cash investments and equity index products. 
3. Sector categories are based on the Global Industry Classification Standard (“GICS”), except for the “Other” category (if applicable), which includes securities that have not been provided a GICS classification 
as of the effective reporting period. 
Vanguard ETF Shares are not redeemable with the issuing Fund other than in very large aggregations worth millions of dollars. Instead, investors must buy and sell Vanguard 
ETF Shares in the secondary market and hold those shares in a brokerage account. In doing so, the investor may incur brokerage commissions and may pay more than net 
asset value when buying and receive less than net asset value when selling. 
All ETF products are subject to risk, which may result in the loss of principal. 
The index is a product of S&P Dow Jones Indices LLC, a division of S&P Global, or its affiliates (“SPDJI”), and has been licensed for use by Vanguard. Standard & Poor’s® and S&P® are registered 
trademarks of Standard & Poor’s Financial Services LLC, a division of S&P Global (“S&P”); Dow Jones® is a registered trademark of Dow Jones Trademark Holdings LLC (“Dow Jones”); and these 
trademarks have been licensed for use by SPDJI and sublicensed for certain purposes by Vanguard. Vanguard products are not sponsored, endorsed, sold or promoted by SPDJI, Dow Jones, S&P, 
or their respective affiliates and none of such parties make any representation regarding the advisability of investing in such product(s) nor do they have any liability for any errors, omissions, or 
interruptions of the index. 
CGS identifiers have been provided by CUSIP Global Services, managed on behalf of the American Bankers Association by Standard & Poor’s Financial Services, LLC, and are not for use or 
dissemination in a manner that would serve as a substitute for any CUSIP service. The CUSIP Database, © 2026 American Bankers Association. “CUSIP” is a registered trademark of the American 
Bankers Association. 
CFA® is a registered trademark owned by CFA Institute. 
For more information about Vanguard ETF Shares, visit vanguard.com , call 866-499-8473, or contact your broker to obtain a prospectus or, if available, a summary 
prospectus. Investment objectives, risks, charges, expenses, and other important information are contained in the prospectus; read and consider it carefully before 
investing. 
© 2026 The Vanguard Group, Inc. All rights reserved. Vanguard Marketing Corporation, Distributor.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 13.3s)

_Thinking:_

The system reminder is about free-model policy — dataset labeling or backend use. Neither applies here (personal landing page project). Continue the current task.

Step 1 continues: I have TER data confirmed:
- VOO: 0.03% (Vanguard fact sheet, 30.9.2026)
- IVV: 0.03% (iShares prospectus 31.7.2026)
- SPY: 0.0945% (State Street product list9.7.2026)
- QQQ: 0.18% (Invesco official page — note: previously 0.20%, now 0.18% per invesco.com)
- VTI: 0.03% (Vanguard fact sheet 30.9.2026)
- SCHD: 0.060% (Schwab Asset Management page)

Now I need:
- S&P 500 long-term CAGR (~10%) source
- Czech-US withholding tax 15% with W-8BEN
- Dividend yields maybe (IVV 1.10% 12m trailing, VOO ~1.05%)
- CZ context: maybe Czech brokers offering these ETFs

Let me search for S&P 500 historical returns source and the tax treaty.

**Tool: websearch**

**Input:**
```json
{
  "query": "S&P 500 annualized return 1957 2025 historical average 10% per year source Damodaran S&P Global"
}
```

**Output:**
```
Title: DataUpdate2for2025
URL: https://pages.stern.nyu.edu/~adamodar/pdfiles/blog/DataUpdate2for2025.pdf
Published: N/A
Author: ASWATH DAMODARAN
Highlights:
§ Looking at the 24.88% return in 2024 in terms of rankings,
...
for US 
stocks. 
§ Combining 2023 and 2024 returns yield a cumulative a two-year 
return for the
...
§ Equity risk premium earned in 2024, over

---

Title: S&P 500 Average Returns and Historical Performance
URL: https://www.investopedia.com/ask/answers/042415/what-average-annual-return-sp-500.asp
Published: 2015-04-24T11:49:00.000Z
Author: J.B. Maverick
Highlights:
Since 1957, the S&P 500 has delivered an average annual return of 10.56%, but when adjusted for inflation, the real return is 6.69%. Michela Buttignol / Investopedia
...
The average annualized return from 1928 to the third quarter of

---

Title: S&P 500® | S&P Dow Jones Indices
URL: https://www.spglobal.com/spdji/en/indices/equity/sp-500/
Published: N/A
Author: N/A
Highlights:
## Description

The S&P 500® is widely regarded as the best single gauge of large-cap U.S. equities. The index includes 500 leading companies and covers approximately 80% of available market capitalization.

 At a Glance: SPIVA After-Tax Scorecard

---

Title: Historical 
    Returns on Stocks, Bonds and Bills: 1928-2022
URL: https://pages.stern.nyu.edu/%7eadamodar/New_Home_Page/datafile/histret.html
Published: N/A
Author: N/A
Highlights:
# Historical Returns on Stocks, Bonds and Bills: 1928-2022

Data Used: Multiple data services

Data: Historical Returns for the US

Date: January 2024

Download as an excel file instead: https://www.stern.nyu.edu/~adamodar/pc/datasets/histretSP.xls

 Update: I have replaced the end-of-the-period T.Bill rates that I used to report in this table, with the average T.Bill rate during the year, since it better measures what you would have earned on that investment during the year.

| | Annual Returns on Investments in | | | | | | Value of $100 invested at start of 1928 in | | | | | | Annual Risk Premium | | | | Annual Real Returns | | | | | | |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Year | S&P 500 (includes dividends) | 3-month T.Bill | US T. Bond (10-year) | Baa Corporate Bond | Real Estate | Gold* | S&P 500 (includes dividends)3 | 3-month T.Bill4 | US T. Bond5 | Baa Corporate Bond2 | Real Estate2 | Gold2 | Stocks - Bills | Stocks - Bonds | Stocks - Baa Corp Bond | Historical risk premium | Inflation Rate | S&P 500 (includes dividends)2 | 3-month T. Bill (Real) | !0-year T.Bonds | Baa Corp Bonds | Real Estate3 | Gold |
| 1928 | 43.81% | 3.08% | 0.84% | 3.22% | 1.49% | 0.10% | $ 143.81 | $ 103.08 | $ 100.84 | $ 103.22 | $ 101.49 | $ 100.10 | 40.73% | 42.98% | 40.59% | | -1.16% | 45.49% | 4.29% | 2.01% | 4.43% | 2.68% | 1.27% |
| 1929 | -8.30% | 3.16% | 4.20% | 3.02% | -2.06% | -0.15% | $ 131.88 | $ 106.34 | $ 105.07 | $ 106.33 | $ 99.40 | $ 99.95 | -11.46% | -12.50% | -11.32% | | 0.58% | -8.83% | 2.56% | 3.60% | 2.42% | -2.63% | -0.73% |
| 1930 | -25.12% | 4.55% | 4.54% | 0.54% | -4.30% | 0.10% | $ 98.75 | $ 111.18 | $ 109.85 | $ 106.91 | $ 95.13 | $ 100.05 | -29.67% | -29.66% | -25.66% | | -6.40% | -20.01% | 11.69% | 11.68% | 7.41% | 2.24% | 6.94% |
| 1931 | -43.84% | 2.31% | -2.56% | -15.68% | -8.15% | -17.38% | $ 55.46 | $ 113.74 | $ 107.03 | $ 90.14 | $ 87.38 | $ 82.66 | -46.15% | -41.28% | -28.16% | | -9.32% | -38.07% | 12.82% | 7.45% | -7.02% | 1.29% | -8.90% |
| 1932 | -8.64% | 1.07% | 8.79% | 23.59% | -10.47% | 21.28% | $ 50.66 | $ 114.96 | $ 116.44 | $ 111.41 | $ 78.23 | $ 100.24 | -9.71% | -17.43% | -32.23% | | -10.27% | 1.82% | 12.64% | 21.25% | 37.74% | -0.21% | 35.16% |
| 1933 | 49.98% | 0.96% | 1.86% | 12.97% | -3.81% | 27.26% | $ 75.99 | $ 116.06 | $ 118.60 | $ 125.86 | $ 75.25 | $ 127.57 | 49.02% | 48.13% | 37.02% | | 0.76% | 48.85% | 0.20% | 1.08% | 12.11% | -4.54% | 26.30% |
| 1934 | -1.19% | 0.28% | 7.96% | 18.82% | 2.91% | 31.75% | $ 75.09 | $ 116.39 | $ 128.05 | $ 149.54 | $ 77.44 | $ 168.07 | -1.47% | -9.15% | -20.00% | | 1.52% | -2.66% | -1.22% | 6.35% | 17.04% | 1.37% | 29.78% |
| 1935 | 46.74% | 0.17% | 4.47% | 13.31% | 9.77% | 0.43% | $ 110.18 | $ 116.58 | $ 133.78 | $ 169.44 | $ 85.00 | $ 168.80 | 46.57% | 42.27% | 33.43% | | 2.99% | 42.49% | -2.74% | 1.44% | 10.02% | 6.58% | -2.48% |
| 1936 | 31.94% | 0.17% | 5.02% | 11.38% | 3.22% | 0.09% | $ 145.38 | $ 116.78 | $ 140.49 | $ 188.73 | $ 87.73 | $ 168.94 | 31.77% | 26.93% | 20.56% | | 1.45% | 30.06% | -1.26% | 3.52% | 9.79% | 1.74% | -1.34% |
| 1937 | -35.34% | 0.28% | 1.38% | -4.42% | 2.56% | -0.23% | $ 94.00 | $ 117.11 | $ 142.43 | $ 180.39 | $ 89.98 | $ 168.56 | -35.61% | -36.72% | -30.92% | | 2.86% | -37.13% | -2.51% | -1.44% | -7.07% | -0.29% | -3.00% |
| 1938 | 29.28% | 0.07% | 4.21% | 9.24% | -0.87% | 0.17% | $ 121.53 | $ 117.18 | $ 148.43 | $ 197.05 | $ 89.20 | $ 168.85 | 29.22% | 25.07% | 20.05% | | -2.78% | 32.98% | 2.92% | 7.19% | 12.36% | 1.96% | 3.03% |
| 1939 | -1.10% | 0.05% | 4.41% | 7.98% | -1.30% | -1.23% | $ 120.20 | $ 117.24 | $ 154.98 | $ 212.78 | $ 88.04 | $ 166.76 | -1.14% | -5.51% | -9.08% | | 0.00% | -1.10% | 0.05% | 4.41% | 7.98% | -1.30% | -1.23% |
| 1940 | -10.67% | 0.04% | 5.40% | 8.65% | 3.31% | -1.66% | $ 107.37 | $ 117.28 | $ 163.35 | $ 231.18 | $ 90.95 | $ 164.00 | -10.71% | -16.08% | -19.32% | | 0.71% | -11.31% | -0.67% | 4.65% | 7.88% | 2.57% | -2.35% |
| 1941 | -12.77% | 0.13% | -2.02% | 5.01% | -8.38% | 0.00% | $ 93.66 | $ 117.43 | $ 160.04 | $ 242.76 | $ 83.32 | $ 164.00 | -12.90% | -10.75% | -17.78% | | 9.93% | -20.65% | -8.91% | -10.87% | -4.48% | -16.66% | -9.03% |
| 1942 | 19.17% | 0.34% | 2.29% | 5.18% | 3.33% | 0.00% | $ 111.61 | $ 117.83 | $ 163.72 | $ 255.33 | $ 86.10 | $ 164.00 | 18.83% | 16.88% | 13.99% | | 9.03% | 9.30% | -7.97% | -6.18% | -3.53% | -5.23% | -8.28% |
| 1943 | 25.06% | 0.38% | 2.49% | 8.04% | 11.45% | 0.00% | $ 139.59 | $ 118.28 | $ 167.79 | $ 275.88 | $ 95.95 | $ 164.00 | 24.68% | 22.57% | 17.02% | | 2.96% | 21.47% | -2.50% | -0.46% | 4.94% | 8.24% | -2.87% |
| 1944 | 19.03% | 0.38% | 2.58% | 6.57% | 16.58% | 0.00% | $ 166.15 | $ 118.73 | $ 172.12 | $ 293.99 | $ 111.87 | $ 164.00 | 18.65% | 16.45% | 12.46% | | 2.30% | 16.36% | -1.88% | 0.27% | 4.17% | 13.96% | -2.25% |
| 1945 | 35.82% | 0.38% | 3.80% | 6.80% | 11.78% | 2.54% | $ 225.67 | $ 119.18 | $ 178.67 | $ 313.98 | $ 125.04 | $ 168.17 | 35.44% | 32.02% | 29.02% | | 2.25% | 32.84% | -1.83% | 1.52% | 4.45% | 9.32% | 0.29% |
| 1946 | -8.43% | 0.38% | 3.13% | 2.51% | 24.10% | 0.00% | $ 206.65 | $ 119.63 | $ 184.26 | $ 321.85 | $ 155.18 | $ 168.17 | -8.81% | -11.56% | -10.94% | | 18.13% | -22.48% | -15.03% | -12.70% | -13.23% | 5.05% | -15.35% |
| 1947 | 5.20% | 0.60% | 0.92% | 0.26% | 21.26% | 0.00% | $ 217.39 | $ 120.35 | $ 185.95 | $ 322.70 | $ 188.17 | $ 168.17 | 4.60% | 4.28% | 4.94% | | 8.84% | -3.34% | -7.57% | -7.27% | -7.88% | 11.42% | -8.12% |
| 1948 | 5.70% | 1.05% | 1.95% | 3.44% | 2.06% | 0.00% | $ 229.79 | $ 121.61 | $ 189.58 | $ 333.79 | $ 192.05 | $ 168.17 | 4.66% | 3.75% | 2.27% | | 2.73% | 2.89% | -1.64% | -0.76% | 0.68% | -0.66% | -2.66% |
| 1949 | 18.30% | 1.12% | 4.66% | 5.38% | 0.09% | -8.70% | $ 271.85 | $ 122.96 | $ 198.42 | $ 351.74 | $ 192.22 | $ 153.54 | 17.19% | 13.64% | 12.93% | | -1.83% | 20.51% | 3.00% | 6.61% | 7.34% | 1.95% | -7.00% |
| 1950 | 30.81% | 1.20% | 0.43% | 4.24% | 3.64% | 9.56% | $ 355.60 | $ 124.44 | $ 199.27 | $ 366.65 | $ 199.22 | $ 168.22 | 29.60% | 30.38% | 26.57% | | 5.80% | 23.63% | -4.35% | -5.08% | -1.48% | -2.04% | 3.55% |
| 1951 | 23.68% | 1.52% | -0.30% | -0.19% | 6.05% | 0.00% | $ 439.80 | $ 126.33 | $ 198.68 | $ 365.95 | $ 211.26 | $ 168.22 | 22.16% | 23.97% | 23.87% | | 5.96% | 16.72% | -4.20% | -5.91% | -5.81% | 0.08% | -5.63% |
| 1952 | 18.15% | 1.72% | 2.27% | 4.44% | 4.41% | -0.35% | $ 519.62 | $ 128.51 | $ 203.19 | $ 382.20 | $ 220.57 | $ 167.64 | 16.43% | 15.88% | 13.71% | | 0.91% | 17.09% | 0.81% | 1.35% | 3.50% | 3.47% | -1.24% |
| 1953 | -1.21% | 1.89% | 4.14% | 1.62% | 11.52% | 0.69% | $ 513.35 | $ 130.94 | $ 211.61 | $ 388.39 | $ 245.98 | $ 168.80 | -3.10% | -5.35% | -2.83% | | 0.60% | -1.80% | 1.28% | 3.52% | 1.02% | 10.85% | 0.09% |
| 1954 | 52.56% | 0.94% | 3.29% | 6.16% | 0.92% | 0.57% | $ 783.18 | $ 132.17 | $ 218.57 | $ 412.31 | $ 248.25 | $ 169.77 | 51.63% | 49.27% | 46.41% | | -0.37% | 53.13% | 1.31% | 3.68% | 6.55% | 1.30% | 0.95% |
| 1955 | 32.60% | 1.72% | -1.34% | 2.04% | 0.00% | -0.03% | $ 1,038.47 | $ 134.45 | $ 215.65 | $ 420.74 | $ 248.25 | $ 169.72 | 30.87% | 33.93% | 30.55% | | 0.37% | 32.10% | 1.35% | -1.70% | 1.66% | -0.37% | -0.40% |
| 1956 | 7.44% | 2.62% | -2.26% | -2.35% | 0.91% | -0.11% | $ 1,115.73 | $ 137.97 | $ 210.79 | $ 410.84 | $ 250.52 | $ 169.53 | 4.82% | 9.70% | 9.79% | | 2.83% | 4.48% | -0.20% | -4.94% | -5.04% | -1.86% | -2.86% |
| 1957 | -10.46% | 3.22% | 6.80% | -0.72% | 2.72% | -0.11% | $ 999.05 | $ 142.42 | $ 225.11 | $ 407.89 | $ 257.33 | $ 169.33 | -13.68% | -17.25% | -9.74% | | 3.04% | -13.10% | 0.18% | 3.65% | -3.65% | -0.31% | -3.06% |
| 1958 | 43.72% | 1.77% | -2.10% | 6.43% | 0.66% | 0.43% | $ 1,435.84 | $ 144.93 | $ 220.39 | $ 434.11 | $ 259.03 | $ 170.06 | 41.95% | 45.82% | 37.29% | | 1.76% | 41.24% | 0.01% | -3.79% | 4.59% | -1.08% | -1.30% |
| 1959 | 12.06% | 3.39% | -2.65% | 1.57% | 0.11% | 0.00% | $ 1,608.95 | $ 149.84 | $ 214.56 | $ 440.95 | $ 259.31 | $ 170.06 | 8.67% | 14.70% | 10.48% | | 1.52% | 10.38% | 1.84% | -4.10% | 0.05% | -1.39% | -1.50% |
| 1960 | 0.34% | 2.87% | 11.64% | 6.66% | 0.77% | 0.48% | $ 1,614.37 | $ 154.15 | $ 239.53 | $ 470.33 | $ 261.30 | $ 170.88 | -2.54% | -11.30% | -6.33% | 6.11% | 1.36% | -1.01% | 1.49% | 10.14% | 5.23% | -0.59% | -0.86% |
| 1961 | 26.64% | 2.35% | 2.06% | 5.10% | 0.98% | -0.06% | $ 2,044.40 | $ 157.77 | $ 244.46 | $ 494.32 | $ 263.85 | $ 170.78 | 24.29% | 24.58% | 21.54% | 6.62% | 0.67% | 25.79% | 1.67% | 1.38% | 4.40% | 0.30% | -0.72% |
| 1962 | -8.81% | 2.77% | 5.69% | 6.50% | 0.32% | -0.06% | $ 1,864.26 | $ 162.15 | $ 258.38 | $ 526.43 | $ 264.70 | $ 170.69 | -11.58% | -14.51% | -15.31% | 5.97% | 1.23% | -9.92% | 1.52% | 4.41% | 5.20% | -0.90% | -1.27% |
| 1963 | 22.61% | 3.16% | 1.68% | 5.46% | 2.14% | -0.40% | $ 2,285.80 | $ 167.27 | $ 262.74 | $ 555.19 | $ 270.38 | $ 170.01 | 19.46% | 20.93% | 17.15% | 6.36% | 1.65% | 20.63% | 1.49% | 0.04% | 3.76% | 0.49% | -2.01% |
| 1964 | 16.42% | 3.55% | 3.73% | 5.16% | 1.26% | 0.03% | $ 2,661.02 | $ 173.20 | $ 272.53 | $ 583.85 | $ 273.78 | $ 170.06 | 12.87% | 12.69% | 11.25% | 6.53% | 1.20% | 15.04% | 2.32% | 2.50% | 3.92% | 0.06% | -1.16% |
| 1965 | 12.40% | 3.95% | 0.72% | 3.19% | 1.66% | 0.06% | $ 2,990.97 | $ 180.04 | $ 274.49 | $ 602.47 | $ 278.32 | $ 170.16 | 8.45% | 11.68% | 9.21% | 6.66% | 1.92% | 10.28% | 1.99% | -1.18% | 1.25% | -0.26% | -1.83% |
| 1966 | -9.97% | 4.86% | 2.91% | -3.45% | 1.22% | 0.03% | $ 2,692.74 | $ 188.78 | $ 282.47 | $ 581.72 | $ 281.72 | $ 170.20 | -14.83% | -12.88% | -6.53% | 6.11% | 3.36% | -12.90% | 1.45% | -0.44% | -6.58% | -2.07% | -3.22% |
| 1967 | 23.80% | 4.29% | -1.58% | 0.90% | 2.32% | -0.51% | $ 3,333.69 | $ 196.88 | $ 278.01 | $ 586.92 | $ 288.25 | $ 169.33 | 19.51% | 25.38% | 22.91% | 6.57% | 3.28% | 19.87% | 0.98% | -4.71% | -2.31% | -0.93% | -3.67% |
| 1968 | 10.81% | 5.34% | 3.27% | 4.85% | 4.13% | 12.47% | $ 3,694.23 | $ 207.39 | $ 287.11 | $ 615.36 | $ 300.17 | $ 190.46 | 5.48% | 7.54% | 5.97% | 6.60% | 4.71% | 5.83% | 0.60% | -1.37% | 0.13% | -0.55% | 7.42% |
| 1969 | -8.24% | 6.67% | -5.01% | -2.03% | 6.99% | 5.01% | $ 3,389.77 | $ 221.22 | $ 272.71 | $ 602.90 | $ 321.16 | $ 200.00 | -14.91% | -3.23% | -6.22% | 6.33% | 5.90% | -13.35% | 0.73% | -10.31% | -7.48% | 1.03% | -0.84% |
| 1970 | 3.56% | 6.39% | 16.75% | 5.65% | 8.22% | -9.45% | $ 3,510.49 | $ 235.36 | $ 318.41 | $ 636.96 | $ 347.55 | $ 181.10 | -2.83% | -13.19% | -2.09% | 5.90% | 5.57% | -1.90% | 0.78% | 10.59% | 0.08% | 2.51% | -14.23% |
| 1971 | 14.22% | 4.33% | 9.79% | 14.00% | 4.24% | 16.69% | $ 4,009.72 | $ 245.56 | $ 349.57 | $ 726.14 | $ 362.30 | $ 211.34 | 9.89% | 4.43% | 0.22% | 5.87% | 3.27% | 10.61% | 1.03% | 6.31% | 10.40% | 0.95% | 13.00% |
| 1972 | 18.76% | 4.06% | 2.82% | 11.41% | 2.98% | 48.78% | $ 4,761.76 | $ 255.53 | $ 359.42 | $ 808.99 | $ 373.08 | $ 314.44 | 14.69% | 15.94% | 7.35% | 6.08% | 3.41% | 14.84% | 0.63% | -0.57% | 7.74% | -0.42% | 43.88% |
| 1973 | -14.31% | 7.04% | 3.66% | 4.32% | 3.42% | 72.96% | $ 4,080.44 | $ 273.51 | $ 372.57 | $ 843.92 | $ 385.85 | $ 543.85 | -21.34% | -17.97% | -18.63% | 5.50% | 8.94% | -21.34% | -1.75% | -4.85% | -4.24% | -5.07% | 58.76% |
| 1974 | -25.90% | 7.85% | 1.99% | -4.38% | 10.07% | 66.15% | $ 3,023.54 | $ 294.97 | $ 379.98 | $ 806.95 | $ 424.72 | $ 903.59 | -33.75% | -27.89% | -21.52% | 4.64% | 12.10% | -33.90% | -3.79% | -9.02% | -14.70% | -1.80% | 48.22% |
| 1975 | 37.00% | 5.79% | 3.61% | 11.05% | 6.77% | -24.80% | $ 4,142.10 | $ 312.04 | $ 393.68 | $ 896.12 | $ 453.48 | $ 679.51 | 31.21% | 33.39% | 25.95% | 5.17% | 7.13% | 27.88% | -1.25% | -3.29% | 3.66% | -0.33% | -29.80% |
| 1976 | 23.83% | 4.98% | 15.98% | 19.75% | 8.18% | -4.10% | $ 5,129.20 | $ 327.57 | $ 456.61 | $ 1,073.13 | $ 490.57 | $ 651.65 | 18.85% | 7.85% | 4.08% | 5.22% | 5.04% | 17.89% | -0.06% | 10.42% | 14.01% | 2.99% | -8.70% |
| 1977 | -6.98% | 5.26% | 1.29% | 9.95% | 14.65% | 22.64% | $ 4,771.20 | $ 344.80 | $ 462.50 | $ 1,179.96 | $ 562.46 | $ 799.18 | -12.24% | -8.27% | -16.93% | 4.93% | 6.68% | -12.80% | -1.33% | -5.05% | 3.07% | 7.48% | 14.96% |
| 1978 | 6.51% | 7.18% | -0.78% | 3.14% | 15.72% | 37.01% | $ 5,081.77 | $ 369.55 | $ 458.90 | $ 1,216.98 | $ 650.90 | $ 1,094.96 | -0.67% | 7.29% | 3.37% | 4.97% | 8.99% | -2.27% | -1.66% | -8.96% | -5.37% | 6.18% | 25.71% |
| 1979 | 18.52% | 10.05% | 0.67% | -2.01% | 13.74% | 126.55% | $ 6,022.89 | $ 406.71 | $ 461.98 | $ 1,192.53 | $ 740.35 | $ 2,480.62 | 8.47% | 17.85% | 20.53% | 5.21% | 13.25% | 4.65% | -2.83% | -11.11% | -13.48% | 0.43% | 100.03% |
| 1980 | 31.74% | 11.39% | -2.99% | -3.32% | 7.40% | 15.19% | $ 7,934.26 | $ 453.04 | $ 448.17 | $ 1,152.99 | $ 795.11 | $ 2,857.32 | 20.34% | 34.72% | 35.05% | 5.73% | 12.35% | 17.25% | -0.86% | -13.66% | -13.95% | -4.41% | 2.52% |
| 1981 | -4.70% | 14.04% | 8.20% | 8.46% | 5.10% | -32.60% | $ 7,561.16 | $ 516.63 | $ 484.91 | $ 1,250.56 | $ 835.62 | $ 1,925.87 | -18.74% | -12.90% | -13.16% | 5.37% | 8.91% | -12.50% | 4.70% | -0.65% | -0.41% | -3.50% | -38.11% |
| 1982 | 20.42% | 10.60% | 32.81% | 29.05% | 0.56% | 15.62% | $ 9,105.08 | $ 571.41 | $ 644.04 | $ 1,613.88 | $ 840.33 | $ 2,226.74 | 9.82% | -12.40% | -8.63% | 5.10% | 3.83% | 15.98% | 6.53% | 27.92% | 24.30% | -3.14% | 11.36% |
| 1983 | 22.34% | 8.62% | 3.20% | 16.19% | 4.75% | -16.80% | $ 11,138.90 | $ 620.65 | $ 664.65 | $ 1,875.23 | $ 880.25 | $ 1,852.71 | 13.72% | 19.14% | 6.14% | 5.34% | 3.79% | 17.87% | 4.65% | -0.57% | 11.95% | 0.93% | -19.83% |
| 1984 | 6.15% | 9.54% | 13.73% | 15.62% | 4.68% | -19.38% | $ 11,823.51 | $ 679.87 | $ 755.92 | $ 2,168.13 | $ 921.43 | $ 1,493.70 | -3.39% | -7.59% | -9.47% | 5.12% | 4.04% | 2.02% | 5.28% | 9.31% | 11.13% | 0.61% | -22.51% |
| 1985 | 31.24% | 7.47% | 25.71% | 23.86% | 7.47% | 6.00% | $ 15,516.60 | $ 730.66 | $ 950.29 | $ 2,685.50 | $ 990.27 | $ 1,583.33 | 23.76% | 5.52% | 7.37% | 5.13% | 3.79% | 26.44% | 3.55% | 21.12% | 19.34% | 3.55% | 2.13% |
| 1986 | 18.49% | 5.97% | 24.28% | 21.35% | 9.61% | 18.96% | $ 18,386.33 | $ 774.27 | $ 1,181.06 | $ 3,258.97 | $ 1,085.46 | $ 1,883.48 | 12.53% | -5.79% | -2.86% | 4.97% | 1.19% | 17.10% | 4.73% | 22.83% | 19.93% | 8.33% | 17.56% |
| 1987 | 5.81% | 5.78% | -4.96% | 2.81% | 7.85% | 24.53% | $ 19,455.08 | $ 819.01 | $ 1,122.47 | $ 3,350.63 | $ 1,170.69 | $ 2,345.45 | 0.04% | 10.77% | 3.00% | 5.07% | 4.33% | 1.42% | 1.39% | -8.91% | -1.46% | 3.37% | 19.36% |
| 1988 | 16.54% | 6.67% | 8.22% | 14.38% | 7.22% | -15.26% | $ 22,672.40 | $ 873.62 | $ 1,214.78 | $ 3,832.52 | $ 1,255.23 | $ 1,987.65 | 9.87% | 8.31% | 2.15% | 5.12% | 4.41% | 11.61% | 2.16% | 3.65% | 9.55% | 2.69% | -18.84% |
| 1989 | 31.48% | 8.11% | 17.69% | 15.95% | 4.39% | -2.84% | $ 29,808.58 | $ 944.49 | $ 1,429.72 | $ 4,443.77 | $ 1,310.37 | $ 1,931.20 | 23.36% | 13.78% | 15.53% | 5.24% | 4.64% | 25.65% | 3.32% | 12.48% | 10.81% | -0.24% | -7.15% |
| 1990 | -3.06% | 7.50% | 6.24% | 6.28% | -0.69% | -3.11% | $ 28,895.11 | $ 1,015.29 | $ 1,518.87 | $ 4,722.87 | $ 1,301.36 | $ 1,871.12 | -10.56% | -9.30% | -9.35% | 5.00% | 6.25% | -8.77% | 1.17% | -0.02% | 0.02% | -6.53% | -8.81% |
| 1991 | 30.23% | 5.38% | 15.00% | 18.93% | -0.17% | -8.56% | $ 37,631.51 | $ 1,069.87 | $ 1,746.77 | $ 5,616.82 | $ 1,299.15 | $ 1,711.00 | 24.86% | 15.23% | 11.31% | 5.14% | 2.98% | 26.47% | 2.33% | 11.68% | 15.49% | -3.06% | -11.20% |
| 1992 | 7.49% | 3.43% | 9.36% | 11.31% | 0.82% | -5.73% | $ 40,451.51 | $ 1,106.58 | $ 1,910.30 | $ 6,251.82 | $ 1,309.77 | $ 1,612.89 | 4.06% | -1.87% | -3.81% | 5.03% | 2.97% | 4.40% | 0.45% | 6.21% | 8.10% | -2.09% | -8.45% |
| 1993 | 9.97% | 3.00% | 14.21% | 15.47% | 2.16% | 17.68% | $ 44,483.33 | $ 1,139.74 | $ 2,181.77 | $ 7,219.13 | $ 1,338.01 | $ 1,898.01 | 6.97% | -4.24% | -5.51% | 4.90% | 2.81% | 6.96% | 0.18% | 11.09% | 12.32% | -0.64% | 14.46% |
| 1994 | 1.33% | 4.25% | -8.04% | -0.97% | 2.52% | -2.17% | $ 45,073.14 | $ 1,188.21 | $ 2,006.43 | $ 7,149.23 | $ 1,371.67 | $ 1,856.83 | -2.93% | 9.36% | 2.29% | 4.97% | 2.60% | -1.24% | 1.61% | -10.36% | -3.48% | -0.08% | -4.65% |
| 1995 | 37.20% | 5.49% | 23.48% | 21.29% | 1.79% | 0.98% | $ 61,838.19 | $ 1,253.44 | $ 2,477.55 | $ 8,671.10 | $ 1,396.25 | $ 1,875.00 | 31.71% | 13.71% | 15.91% | 5.08% | 2.53% | 33.81% | 2.88% | 20.43% | 18.29% | -0.72% | -1.51% |
| 1996 | 22.68% | 5.01% | 1.43% | 3.42% | 2.43% | -4.59% | $ 75,863.69 | $ 1,316.18 | $ 2,512.94 | $ 8,967.28 | $ 1,430.12 | $ 1,789.00 | 17.68% | 21.25% | 19.27% | 5.30% | 3.38% | 18.67% | 1.57% | -1.89% | 0.04% | -0.92% | -7.71% |
| 1997 | 33.10% | 5.06% | 9.94% | 12.75% | 4.02% | -21.41% | $ 100,977.34 | $ 1,382.80 | $ 2,762.71 | $ 10,110.98 | $ 1,487.64 | $ 1,406.01 | 28.04% | 23.16% | 20.35% | 5.53% | 1.70% | 30.88% | 3.31% | 8.10% | 10.87% | 2.29% | -22.72% |
| 1998 | 28.34% | 4.78% | 14.92% | 7.63% | 6.44% | -0.83% | $ 129,592.25 | $ 1,448.84 | $ 3,174.95 | $ 10,882.19 | $ 1,583.48 | $ 1,394.38 | 23.56% | 13.42% | 20.71% | 5.63% | 1.61% | 26.31% | 3.12% | 13.10% | 5.93% | 4.76% | -2.40% |
| 1999 | 20.89% | 4.64% | -8.25% | 0.91% | 7.68% | 0.85% | $ 156,658.05 | $ 1,516.05 | $ 2,912.88 | $ 10,980.88 | $ 1,705.10 | $ 1,406.25 | 16.25% | 29.14% | 19.98% | 5.96% | 2.68% | 17.73% | 1.91% | -10.65% | -1.72% | 4.87% | -1.78% |
| 2000 | -9.03% | 5.82% | 16.66% | 9.39% | 9.29% | -5.44% | $ 142,508.98 | $ 1,604.28 | $ 3,398.03 | $ 12,011.74 | $ 1,863.53 | $ 1,329.70 | -14.85% | -25.69% | -18.42% | 5.51% | 3.44% | -12.05% | 2.30% | 12.78% | 5.75% | 5.66% | -8.58% |
| 2001 | -11.85% | 3.40% | 5.57% | 8.54% | 6.68% | 0.75% | $ 125,622.01 | $ 1,658.81 | $ 3,587.37 | $ 13,037.39 | $ 1,987.97 | $ 1,339.63 | -15.25% | -17.42% | -20.39% | 5.17% | 1.60% | -13.24% | 1.77% | 3.91% | 6.83% | 4.99% | -0.84% |
| 2002 | -21.97% | 1.61% | 15.12% | 12.14% | 9.56% | 25.57% | $ 98,027.82 | $ 1,685.44 | $ 4,129.65 | $ 14,620.61 | $ 2,178.02 | $ 1,682.17 | -23.57% | -37.08% | -34.11% | 4.53% | 2.48% | -23.85% | -0.85% | 12.33% | 9.43% | 6.91% | 22.53% |
| 2003 | 28.36% | 1.01% | 0.38% | 12.32% | 9.81% | 19.89% | $ 125,824.39 | $ 1,702.44 | $ 4,145.15 | $ 16,421.34 | $ 2,391.73 | $ 2,016.72 | 27.35% | 27.98% | 16.04% | 4.82% | 2.04% | 25.80% | -1.01% | -1.63% | 10.08% | 7.62% | 17.50% |
| 2004 | 10.74% | 1.37% | 4.49% | 10.35% | 13.64% | 4.65% | $ 139,341.42 | $ 1,725.84 | $ 4,331.30 | $ 18,120.28 | $ 2,717.92 | $ 2,110.47 | 9.37% | 6.25% | 0.40% | 4.84% | 3.34% | 7.16% | -1.90% | 1.11% | 6.78% | 9.96% | 1.26% |
| 2005 | 4.83% | 3.15% | 2.87% | 5.30% | 13.51% | 17.77% | $ 146,077.85 | $ 1,780.19 | $ 4,455.50 | $ 19,080.36 | $ 3,085.13 | $ 2,485.47 | 1.69% | 1.97% | -0.46% | 4.80% | 3.34% | 1.45% | -0.18% | -0.46% | 1.90% | 9.84% | 13.96% |
| 2006 | 15.61% | 4.73% | 1.96% | 5.20% | 1.73% | 23.20% | $ 168,884.34 | $ 1,864.39 | $ 4,542.87 | $ 20,071.86 | $ 3,138.60 | $ 3,062.02 | 10.88% | 13.65% | 10.42% | 4.91% | 2.52% | 12.77% | 2.15% | -0.55% | 2.61% | -0.77% | 20.16% |
| 2007 | 5.48% | 4.36% | 10.21% | 4.84% | -5.40% | 31.92% | $ 178,147.20 | $ 1,945.72 | $ 5,006.69 | $ 21,044.26 | $ 2,969.18 | $ 4,039.49 | 1.12% | -4.73% | 0.64% | 4.79% | 4.11% | 1.32% | 0.24% | 5.86% | 0.71% | -9.13% | 26.72% |
| 2008 | -36.55% | 1.37% | 20.10% | -3.54% | -12.00% | 4.32% | $ 113,030.22 | $ 1,972.40 | $ 6,013.10 | $ 20,299.23 | $ 2,613.01 | $ 4,213.91 | -37.92% | -56.65% | -33.01% | 3.88% | -0.02% | -36.54% | 1.39% | 20.13% | -3.52% | -11.98% | 4.34% |
| 2009 | 25.94% | 0.15% | -11.12% | 20.21% | -3.86% | 25.04% | $ 142,344.87 | $ 1,975.37 | $ 5,344.65 | $ 24,401.63 | $ 2,512.27 | $ 5,268.90 | 25.78% | 37.05% | 5.73% | 4.29% | 2.81% | 22.49% | -2.59% | -13.55% | 16.92% | -6.49% | 21.61% |
| 2010 | 14.82% | 0.14% | 8.46% | 9.41% | -4.11% | 29.24% | $ 163,441.94 | $ 1,978.10 | $ 5,796.96 | $ 26,697.95 | $ 2,408.94 | $ 6,809.59 | 14.68% | 6.36% | 5.41% | 4.31% | 1.44% | 13.19% | -1.28% | 6.93% | 7.86% | -5.47% | 27.41% |
| 2011 | 2.10% | 0.05% | 16.04% | 12.26% | -3.89% | 12.02% | $ 166,871.56 | $ 1,979.15 | $ 6,726.52 | $ 29,971.89 | $ 2,315.35 | $ 7,628.39 | 2.05% | -13.94% | -10.16% | 4.10% | 3.06% | -0.94% | -2.92% | 12.59% | 8.93% | -6.74% | 8.70% |
| 2012 | 15.89% | 0.09% | 2.97% | 9.33% | 6.44% | 5.68% | $ 193,388.43 | $ 1,980.88 | $ 6,926.40 | $ 32,767.39 | $ 2,464.39 | $ 8,062.02 | 15.80% | 12.92% | 6.56% | 4.20% | 1.76% | 13.89% | -1.64% | 1.19% | 7.44% | 4.60% | 3.86% |
| 2013 | 32.15% | 0.06% | -9.10% | -0.98% | 10.71% | -27.61% | $ 255,553.31 | $ 1,982.01 | $ 6,295.79 | $ 32,445.36 | $ 2,728.41 | $ 5,835.76 | 32.09% | 41.25% | 33.13% | 4.62% | 1.51% | 30.18% | -1.43% | -10.46% | -2.46% | 9.06% | -28.69% |
| 2014 | 13.52% | 0.03% | 10.75% | 10.78% | 4.51% | 0.12% | $ 290,115.42 | $ 1,982.66 | $ 6,972.34 | $ 35,943.54 | $ 2,851.38 | $ 5,843.02 | 13.49% | 2.78% | 2.74% | 4.60% | 0.65% | 12.79% | -0.62% | 10.03% | 10.06% | 3.83% | -0.53% |
| 2015 | 1.38% | 0.05% | 1.28% | -1.50% | 5.20% | -12.11% | $ 294,115.79 | $ 1,983.69 | $ 7,061.89 | $ 35,404.08 | $ 2,999.65 | $ 5,135.66 | 1.33% | 0.09% | 2.88% | 4.54% | 0.64% | 0.74% | -0.58% | 0.64% | -2.13% | 4.53% | -12.66% |
| 2016 | 11.77% | 0.32% | 0.69% | 11.52% | 5.30% | 8.10% | $ 328,742.28 | $ 1,989.96 | $ 7,110.65 | $ 39,484.22 | $ 3,158.77 | $ 5,551.84 | 11.46% | 11.08% | 0.25% | 4.62% | 2.05% | 9.53% | -1.70% | -1.33% | 9.28% | 3.19% | 5.93% |
| 2017 | 21.61% | 0.93% | 2.80% | 9.23% | 6.21% | 12.66% | $ 399,768.64 | $ 2,008.55 | $ 7,309.87 | $ 43,130.15 | $ 3,354.83 | $ 6,254.84 | 20.67% | 18.80% | 12.37% | 4.77% | 2.13% | 19.07% | -1.17% | 0.66% | 6.96% | 3.99% | 10.31% |
| 2018 | -4.23% | 1.94% | -0.02% | -3.27% | 4.52% | -0.93% | $ 382,870.94 | $ 2,047.44 | $ 7,308.65 | $ 41,720.04 | $ 3,506.44 | $ 6,196.71 | -6.16% | -4.21% | -0.96% | 4.66% | 2.00% | -6.11% | -0.06% | -1.98% | -5.17% | 2.47% | -2.87% |
| 2019 | 31.21% | 2.06% | 9.64% | 15.25% | 3.69% | 19.08% | $ 502,371.39 | $ 2,089.67 | $ 8,012.89 | $ 48,081.42 | $ 3,635.68 | $ 7,378.88 | 29.15% | 21.58% | 15.96% | 4.83% | 2.31% | 28.24% | -0.25% | 7.16% | 12.64% | 1.34% | 16.38% |
| 2020 | 18.02% | 0.35%

---

Title: S&P 500 Historical Returns — Daily CSV Download (Equity Returns)
URL: https://eco3min.fr/en/sp500-historical-returns-dataset/
Published: N/A
Author: N/A
Highlights:
## Key figures

Five figures from this page, each with the exact series it measures, the period it covers and the primary source it was recomputed against.

10.02%
: Compound annual total return of the S&P 500 with dividends reinvested, before inflation. 1928–2025, 98 complete calendar years · Aswath Damodaran (NYU Stern) · retrieved 4 September 2026
6.78%
: The same series after inflation: each year deflated by US CPI-U, December over December, then compounded. 1928–2025, 98 complete calendar years · Aswath Damodaran (NYU Stern) and US CPI-U (BLS, FRED series CPIAUCNS) · retrieved 4 September 2026
8.61%
: Arithmetic mean of the 98 annual real returns. It is not the compound rate: 6.78% is the rate that compounds to the same 98-year result. 1928–2025, 98 complete calendar years · Aswath Damodaran (NYU Stern) and US CPI-U (BLS, FRED series CPIAUCNS) · retrieved 4 September 2026
+53.71%
: Best calendar year in real terms, 1954: +52.56% nominal against −0.74% CPI-U inflation. single calendar year within 1928–2025 · Aswath Damodaran (NYU Stern) and US CPI-U (BLS, FRED series CPIAUCNS) · retrieved 4 September 2026
−38.07%
: Worst calendar year in real terms, 1931: −43.84% nominal against −9.32% CPI-U inflation. single calendar year within 1928–2025 · Aswath Damodaran (NYU Stern) and US CPI-U (BLS, FRED series CPIAUCNS) · retrieved 4 September 2026

To cite a figure above

10.02% (S&P 500 compound annual total return, dividends reinvested, nominal, 1928–2025). Eco3min, from Aswath Damodaran (NYU Stern), retrieved 4 September 2026. https://eco3min.fr/en/sp500-historical-returns-dataset/#key-figures

Source: Aswath Damodaran (NYU Stern) · S&P 500 annual total return incl. dividends (bars) vs inflation-adjusted real return (line)

---

Title: Average Stock Market Return: Historical Data by Index, Decade, and Asset Class | Journey Advisory Group, LLC
URL: https://www.journeyadvisory.group/blog/average-stock-market-return-historical-data-by-index-decade-and-asset-cl
Published: 2026-06-21T14:10:26.000Z
Author: Adam Lisowsky, CFP®
Highlights:
the single number obscures a great deal of variation that matters in practice: which ... you measure, how long you hold, which decade you lived through, what you are comparing stocks against, and how often the market falls sharply before recovering

---

Title: What is the S&P 500 and stock market average return? | Fidelity
URL: https://www.fidelity.com/learning-center/trading-investing/sp-500-average-return
Published: 2026-03-06T15:37:34.000Z
Author: Fidelity Learn
Highlights:
### What is the S&P 500 average return?

The S&P 500’s average annual return has been about 10% since its launch in 1957. 2 (Here’s a refresher on the S&P 500 index.) As of December 2025, the average annual return stands at 11.5% for the past 40 years. 3

---

Title: Data Update 2 for 2023: A Rocky Year for Equities
URL: https://aswathdamodaran.substack.com/p/data-update-2-for-2023-a-rocky-year
Published: 2023-01-22T17:47:59.000Z
Author: Aswath Damodaran
Highlights:
2022 for US stocks. In the graph below, I look at the distribution of annual returns over those 95 years, paying special attention to the negative
...
S&P 500 officially came into existence in 1957, but I filled in earlier years using stock return data
```

**Tool: websearch**

**Input:**
```json
{
  "query": "Česko USA daň z dividend 15% W-8BEN smlouva o zamezení dvojího zdanění USA ČR dividendy"
}
```

**Output:**
```
Title: US TREATY CZECH REPUBLIC
URL: https://www.irs.gov/pub/irs-trty/czech.pdf
Published: N/A
Author: Internal Revenue Service
Highlights:
ARTICLE 10 Dividends 1. Dividends paid by a company which is a resident of a Contracting State to a resident of the other Contracting State may be taxed in that other State. 2. However, such dividends may also be taxed in the Contracting State of which the company paying the dividends is a resident, and according to the laws of that State, but if the beneficial owner of the dividends is a resident of the other Contracting State, the tax so charged shall not exceed:

a) 5 percent of the gross amount of the dividends if the beneficial owner is a

company which owns at least 10 percent of the voting shares of the company paying the dividends; b) 15 percent of the gross amount of the dividends in all other cases. This paragraph shall not affect the taxation of the company in respect of the profits out of which the dividends are paid. 3. Subparagraph a) of paragraph 2 shall not apply in the case of dividends paid by a United States Regulated Investment Company or a Real Estate Investment Trust. Subparagraph b) of paragraph 2 shall apply in the case of dividends paid by a Regulated Investment Company. In the case of dividends paid by a Real Estate Investment Trust, subparagraph b) of paragraph 2 shall apply if the beneficial owner of the dividends is an individual holding a less than 10 percent interest in the Real Estate Investment Trust; otherwise the rate of withholding applicable under domestic law shall apply. 4. The term "dividends" as used in this Article means income from shares or other rights, not being debt-claims, participating in profits, as well as income from other corporate rights which is subjected to the same taxation treatment as income from shares by the laws of the State of which the company making the distribution is a resident. The term "dividends" also includes income from arrangements, including debt obligations, carrying the right to participate in profits, to the extent so characterized under the law of the Contracting State in which the income arises. 5. The provisions of paragraph 2 shall not apply if the beneficial owner of the dividends, being a resident of a Contracting State, carries on or has carried on business in the other Contracting State, of which the company paying the dividends is a resident, through a permanent establishment situated therein, or performs or has performed in that other State independent personal services from a fixed base situated therein, and the dividends are attributable to such permanent establishment or fixed base. In such case the provisions of Article 7 (Business Profits) or Article 14 (Independent Personal Services), as the case may be, shall apply. 6. A corporation which is a resident of a Contracting State may be subject in the other State to a tax in addition to the tax allowable under the other provisions of this Convention. Such tax, however, may not exceed 5 percent of the

---

Title: 32/1994 Sb., o Smlouvě mezi Českou republikou a Spojenými státy americkými o zamezení dvojího zdanění a zabránění daňovému úniku v oboru daní z příjmů a majetku
URL: https://www.dauc.cz/predpisy/158/32-1994-sb
Published: N/A
Author: N/A
Highlights:
32/1994 Sb., o Smlouvě mezi Českou republikou a Spojenými státy americkými o zamezení dvojího zdanění a zabránění daňovému úniku v oboru daní z příjmů a majetku

# 32/1994 Sb., o Smlouvě mezi Českou republikou a Spojenými státy americkými o zamezení dvojího zdanění a zabránění daňovému úniku v oboru daní z příjmů a majetku

 Schválený: 16.09.1993 

32/1994 Sb. SDĚLENÍ Ministerstva zahraničních věcí

 Změna: 370/1999 Sb. 

 Ministerstvo zahraničních věcí sděluje, že dne 16. září 1993 byla v Praze podepsána Smlouva mezi Českou republikou a Spojenými státy americkými o zamezení dvojího zdanění a zabránění daňovému úniku v oboru daní z příjmů a majetku. 

 Se Smlouvou vyslovil souhlas Parlament České republiky a prezident republiky ji ratifikoval. Ratifikační listiny byly vyměněny ve Washingtonu dne 23. prosince 1993.

Smlouva vstoupila v platnost na základě svého článku 29 odst. 2 dnem 23. prosince 1993.

České znění Smlouvy se vyhlašuje současně.

SMLOUVA

 mezi Českou republikou a Spojenými státy americkými o zamezení dvojího zdanění a zabránění daňovému úniku v oboru daní z příjmů a majetku

 Česká republiky a Spojené státy americké přejíce si dále rozšířit a usnadnit vzájemné ekonomické vztahy se rozhodly uzavřít Smlouvu o zamezení dvojího zdanění a zabránění daňovému úniku v oboru daní z příjmů a majetku, a dohodly se takto:

...

Čl.2

Daně, na které se smlouva vztahuje

 1. Současné daně, na které se tato smlouva vztahuje, jsou: 

a) ve Spojených státech: federální daně z příjmů ukládané na základě Internal Revenue Code (avšak vyjma daně z akumulovaných zisků, daně z osobní holdingové společnosti a daní sociálního zabezpečení) a spotřební daně ukládané v souvislosti s investičním příjmem soukromých nadací (dále nazývané "daň Spojených států");

b) v České republice: daně z příjmů ukládané na základě zákona o daních z příjmů a daň z nemovitostí (dále nazývané "česká daň").

2. Tato smlouva se bude rovněž vztahovat na jakékoliv stejné nebo podobné daně, které budou ukládány po podpisu této smlouvy vedle současných daní nebo místo nich. Příslušné úřady smluvních států se budou vzájemně informovat o veškerých podstatných změnách, které budou provedeny v jejich příslušných daňových zákonech, a o úředně publikovaných materiálech týkajících se uplatnění Smlouvy, včetně vysvětlivek, prováděcích vyhlášek, daňových nebo soudních rozhodnutí.

...

3. Ustanovení odstavce 2 se neuplatní v případě podvodu, hrubé nedbalosti nebo vědomého zanedbání.

Dividendy

1. Dividendy vyplácené společností, která je rezidentem v jednom smluvním státě, osobě, která je rezidentem v druhém smluvním státě, mohou být zdaněny v tomto druhém státě.

2. Tyto dividendy však mohou být rovněž zdaněny ve smluvním státě, v němž je společnost, která je vyplácí, rezidentem, a to podle právních předpisů tohoto státu, avšak jestliže příjemce, který je skutečným vlastníkem dividend, je rezidentem druhého smluvního státu, daň takto stanovená nepřesáhne: 

a) 5 % hrubé částky dividend, jestliže skutečným vlastníkem je společnost, která vlastní nejméně 10 % podílů s hlasovacím právem na společnosti vyplácející dividendy; 

b) 15 % hrubé částky dividend ve všech ostatních případech.

 Tento odstavec se nedotkne zdanění zisků společnosti, ze kterých jsou dividendy vypláceny.

3. Pododstavec a) odstavce 2 se nepoužije v případě dividend, které vyplácí United State Regulated Investment Company nebo Real Estate Investment Trust. Pododstavec b) odstavce 2 se použije v případě dividend vyplácených společností Regulated Investment Company. V případě dividend vyplácených společností Real Estate Investment Trust se pododstavec b) odstavce 2 použije, jestliže skutečný vlastník dividend je fyzická osoba vlastnící méně než 10 % účasti na společnosti Real Estate Investment Trust; jinak se uplatní sazba srážkové daně podle vnitrostátních právních předpisů.

4. Výraz "dividendy", použitý v tomto článku, označuje příjmy z akcií nebo jiných práv, s výjimkou pohledávek, s podílem na zisku, jakož i příjmy z jiných práv na společnosti, které jsou podrobeny stejnému zdanění jako příjmy z akcií podle daňových předpisů státu, v němž je společnost, která rozdílí zisk, rezidentem. Výraz dividendy rovněž zahrnuje příjmy ze závazků, včetně dlužních úpisů nesoucích právo podílu na zisku, v tom rozsahu, jak je to stanoveno podle právních předpisů toho smluvního státu, ze kterého plyne příjem.

5. Ustanovení odstavce 2 se nepoužije, jestliže skutečný vlastník dividend, který je rezidentem v jednom smluvním státě, vykonává nebo vykonával v druhém smluvním státě, v němž je rezidentem společnost vyplácející dividendy, průmyslovou nebo obchodní činnost prostřednictvím stálé provozovny, která je tam umístěn, nebo vykonává nebo vykonával nezávislé povolání ve stálé základně tam umístěné, a jestliže dividendy lze přičítat této stálé provozovně nebo této stálé základně. V takovém případě se použijí ustanovení článku 7 (Zisky podniků) nebo článku 14 (Nezávislá povolání) podle toho, o jaký případ jde.

6. Společnost, která je rezidentem v jednom smluvním státě, může kromě zdanění podle ostatních ustanovení této smlouvy podléhat ještě další dani. Tato daň však nemůže překročit 5 % příjmů společnosti, které lze přičíst stálé provozovně v tomto druhém státě nebo které podléhají zdanění na čistém základě v tomto druhém státě podle článku 6 (Příjmy z nemovitého majetku) nebo podle článku 13 (Zisky ze zcizení majetku), po odečtu daní ze zisků uložených z těchto příjmů v tomto druhém státě a po úpravě s ohledem na nárůst nebo snížení majetku, po zohlednění závazků společnosti ve vztahu ke stálé provozovně nebo obchodní nebo průmyslové činnosti. Taková daň se může použít pouze, pokud se taková daň ukládá podle právních předpisů tohoto druhého státu z příjmů jakékoliv stálé provozovny, která je udržována v tomto druhém státě společností, jež není rezidentem v tomto druhém státě.

7. Jestliže společnost, která je rezidentem jednoho smluvního státu, dosahuje zisky nebo příjmy z druhého smluvního státu, nemůže tento druhý stát zdanit dividendy vyplácené společností, ledaže tyto dividendy jsou vypláceny rezidentu tohoto druhého státu nebo že účast, pro kterou se dividendy vyplácejí, tvoří část provozního majetku stálé provozovny nebo stálé základny, umístěné v tomto druhém státě, i když vyplácené dividendy pozůstávají zcela nebo zčásti ze zisků nebo z příjmů docílených v tomto druhém státě.

---

Title: Přehled platných smluv | Ministerstvo financí ČR
URL: http://www.mfcr.cz/cs/legislativa/dvoji-zdaneni/prehled-platnych-smluv
Published: N/A
Author: oddělení Mezinárodní zdaňování
Highlights:
oddělení Mezinárodní zdaňování 

 Přehled platných smluv České republiky o zamezení dvojímu zdanění v oboru daní z příjmu, resp. z příjmu a z majetku 

podle stavu k 6.1.2026

| Smluvní stát | Platnost ode dne | Sbírka zákonů (event. Sbírka mezinárodních smluv) | Vydáno ve Finančním zpravodaji | Poznámka |
| --- | --- | --- | --- | --- |
| Albánie | 10.9.1996 | 270/1996 Sb. | FZ č. 12/1996 ( 520,17 kB) | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 8/2024) |
| Andorra | 31.10.2023 | 46/2023 Sb.m.s. | | |
| Arménie | 15.7.2009 | 86/2009 Sb.m.s. | | Úmluva č. 32/2020 Sb.m.s. (FZ č. 15/2023) |
| Austrálie | 27.11.1995 | 5/1996 Sb. | FZ č. 2/1996 ( 552,02 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 15/2020) |
| Ázerbájdžán | 16.6.2006 | 74/2006 Sb.m.s. | FZ č. 1/2/2007 | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 10/2024) |
| Bahrajn | 10.4.2012 | 59/2012 Sb.m.s. | | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 10/2024) |
| Bangladéš | 15.1.2021 | 8/2021 Sb.m.s. | | |
| Barbados | 6.6.2012 | 69/2012 Sb.m.s. | | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 12/2024) |
| Belgie | 24.7.2000 | 95/2000 Sb.m.s. | FZ č. 4/2001 ( 482,43 kB), FZ č. 9-10/2003, FZ č. 4/2015 | Sdělení č. 127/2003 Sb.m.s., Pokyn č. D - 312 (FZ č. 6-7/2007, Protokol č. 17/2015 Sb.m.s., Úmluva č. 32/2020 Sb.m.s. (FZ č. 23/2020) |
| Bělorusko | 15.1.1998 | 31/1998 Sb. | FZ č. 5/1998 ( 972,81 kB), FZ č. 11/1998 ( 418,28 kB), FZ č. 4/2024 | Redakční oprava část. 74/1998 Sb., Protokol č. 99/2011 Sb.m.s., Sdělení č. 115/2024 Sb. |
| Bosna a Hercegovina | 12.5.2010 | 58/2010 Sb. m.s. | | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 12/2024) |
| Botswana | 26.11.2020 | 49/2020 Sb.m.s. | | |
| Brazílie | 14.11.1990 | 200/1991 Sb. | | |
| Bulharsko | 2.7.1999 | 203/1999 Sb. | | Úmluva č. 32/2020 Sb.m.s. (FZ č. 14/2022) |
| Černá Hora | 30.1.2025 | 94/2025 Sb. | FZ č. 14/2025 | |
| Čína | 4.5.2011 | 65/2011 Sb.m.s. | FZ č. 5/2011 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 9/2022) |
| Dánsko | 17.12.2012 | 14/2013 Sb.m.s. | FZ č. 3/2013 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 34/2020) |
| Egypt | 4.10.1995 | 283/1995 Sb. | FZ č. 1/1996 ( 507,91 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 3/2021) |
| Estonsko | 26.5.1995 | 184/1995 Sb. | FZ č. 12/2/1995 ( 1 061,24 kB), FZ č. 3/2014 | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.), Redakční oprava č. 17/2004 Sb.m.s. |
| Etiopie | 30.5.2008 | 54/2008 Sb.m.s. | | |
| Filipíny | 23.9.2003 | 132/2003 Sb.m.s. | FZ č. 11/2004 | |
| Finsko | 12.12.1995 | 43/1996 Sb. | FZ č. 2/1998 ( 420,47 kB), FZ č. 1/2005 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 28/2020) |
| Francie | 1.7.2005 | 79/2005 Sb.m.s. | FZ č. 12/1/2005, FZ č. 11-12/2006 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 29/2020) |
| Ghana | 11.8.2020 | 38/2020 Sb.m.s. | | |
| Gruzie | 4.5.2007 | 40/2007 Sb.m.s. | FZ č. 8-9/2007, FZ č. 3/2010 | Úmluva č. 32/2020 Sb.m.s.(FZ č. 31/2020) |
| Hongkong | 24.1.2012 | 49/2012 Sb.m.s. | FZ č. 5/2012 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 3/2023) |
| Chile | 21.12.2016 | 5/2017 Sb.m.s. | FZ č. 9/2017, FZ č. 10/2018 | Sdělení č. 71/2017 Sb.m.s., Sdělení č. 50/2018 Sb.m.s., Úmluva č. 32/2020 Sb.m.s. (FZ č. 14/2021) |
| Chorvatsko | 28.12.1999 | 42/2000 Sb.m.s. | FZ č. 6/2000 ( 371,13 kB), FZ č. 3/2001 ( 548,92 kB) | Protokol č. 82/2012 Sb.m.s., Úmluva č. 32/2020 Sb.m.s. (FZ č. 28/2021) |
| Indie | 27.9.1999 | 301/1999 Sb. | FZ č. 7-8/2000 ( 430,29 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 19/2020) |
| Indonésie | 26.1.1996 | 67/1996 Sb. | FZ č. 4-5/1999 ( 438,39 kB), FZ č. 4/2010 | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 3/2026) |
| Írán | 4.8.2016 | 47/2016 Sb.m.s. | | |
| Irsko | 21.4.1996 | 163/1996 Sb. | FZ č. 5/1998 ( 588,18 kB), FZ č. 4/2009, FZ č. 2/2012 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 12/2020) |
| Island | 28.12.2000 | 11/2001 Sb.m.s. | | Úmluva č. 32/2020 Sb.m.s. (FZ č. 36/2020) |
| Itálie | 26.6.1984 | 17/1985 Sb. | FZ č. 4-5/1987 ( 484,58 kB), FZ č. 12/1997 ( 479,34 kB), FZ č. 4-5/1999 ( 318,79 kB), FZ č. 1/1/2003 ( 439,76 kB), FZ č. 6/2010 | Úmluva č. 32/2020 Sb.m.s. |
| Izrael | 23.12.1994 | 21/1995 Sb. | FZ č. 1/1995 ( 394,16 kB), FZ č. 4/1995 ( 505,09 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 36/2020) |
| Japonsko | 25.11.1978 | 46/1979 Sb. | FZ č. 5/1980 ( 367,09 kB), FZ č. 3/2012, FZ č. 4/2014, FZ č. 17/2025 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 16/2020) |
| JAR (Jihoafrická republika) | 3.12.1997 | 7/1998 Sb. | FZ č. 3/1999 JAR ( 378,94 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 13/2022) |
| Jordánsko | 7.11.2007 | 88/2007 Sb.m.s. | | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 13/2024) |
| Kamerun | 7.7.2025 | 415/2025 Sb. | | |
| Kanada | 28.5.2002 | 83/2002 Sb.m.s. | FZ č. 11-12/2002 ( 890,78 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 14/2020) |
| Katar | 25.10.2022 | 45/2022 Sb.m.s. | | |
| Kazachstán | 29.10.1999 | 3/2000 Sb.m.s. | FZ č. 4-5/2000 ( 518,62 kB), FZ č. 4/2009 | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 13/2024), Protokol č. 43/2016 Sb. m. s. |
| Kolumbie | 6.5.2015 | 39/2015 Sb.m.s. | FZ č. 5/2016 | Úmluva č. 32/2020 Sb.m.s. |
| Korejská republika | 20.12.2019 | 1/2020 Sb.m.s. | FZ č. 7/2020 | |
| KLDR (Korejská lidově demokratická republika) | 7.12.2005 | 3/2006 Sb.m.s. | | |
| Kosovo | 24.7.2023 | 38/2023 Sb.m.s. | | |
| Kuvajt | 3.3.2004 | 48/2004 Sb.m.s. | | Úmluva č. 32/2020 Sb.m.s. |
| Kypr | 26.11.2009 | 120/2009 Sb.m.s. | FZ č. 4/2010 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 32/2020) |
| Kyrgyzstán | 30.11.2020 | 50/2020 Sb.m.s. | FZ č. 12/2021 | |
| Libanon | 24.1.2000 | 30/2000 Sb.m.s. | | |
| Lichtenštejnsko | 22.12.2015 | 8/2016 Sb.m.s. | | Úmluva č. 32/2020 Sb.m.s. (FZ č. 30/2020) |
| Litva | 8.8.1995 | 230/1995 Sb. | FZ č. 12/2/1995 ( 530,50 kB), FZ č. 12/1997 ( 459,49 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 16/2020) |
| Lotyšsko | 22.5.1995 | 170/1995 Sb. | FZ č. 9/1995 ( 590,89 kB) FZ č. 5/1996 ( 359,57 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 17/2020) |
| Lucembursko | 31.7.2014 | 51/2014 Sb.m.s. | | Úmluva č. 32/2020 Sb.m.s. (FZ č. 26/2020) |
| Maďarsko | 27.12.1994 | 22/1995 Sb. | FZ č. 1/1995 ( 394,16 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 29/2021) |
| Makedonie | 17.6.2002 | 88/2002 Sb.m.s. | FZ č. 9-10/2002 ( 430,69 kB) | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.) |
| Malajsie | 9.3.1998 | 71/1998 Sb. | FZ č. 4-5/1999 ( 454,42 kB) | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 14/2024) |
| Malta | 6.6.1997 | 164/1997 Sb. | FZ č. 11/1997 ( 480,25 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 11/2020) |
| Maroko | 18.7.2006 | 83/2006 Sb.m.s. | FZ č. 1/2/2007 | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.) |
| Mexiko | 27.12.2002 | 7/2003 Sb.m.s. | FZ č. 2-3/2004, FZ č. 8-9/2007 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 14/2023) |
| Moldávie | 26.4.2000 | 88/2000 Sb.m.s. | | Protokol č. 97/2005 Sb.m.s. |
| Mongolsko | 22.6.1998 | 18/1999 Sb. | FZ č. 2/1999 ( 311,31 kB) | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 14/2024) |
| Německo | 17.11.1983 | 18/1984 Sb. | FZ č. 3-4/1984 ( 1 823,07 kB), FZ č. 7-8/2004, FZ č. 11/2004 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 11/2025) |
| Nigérie | 2.12.1990 | 339/1991 Sb. | | Redakční oprava č. 371/1999 Sb., Úmluva č. 32/2020 Sb.m.s. |
| Nizozemí | 5.11.1974 | 138/1974 Sb. | FZ č. 5/1980 ( 466,68 kB), FZ č. 9/1997 ( 350,70 kB), FZ č. 1/1998 ( 436,12 kB), FZ č. 7-8/1999 ( 505,83 kB) | Protokol č. 112/1997 Sb., Protokol č. 58/2013 Sb.m.s., Úmluva č. 32/2020 Sb.m.s. (FZ č. 34/2020) |
| Norsko | 9.9.2005 | 121/2005 Sb.m.s. | FZ č. 12/1/2005 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 31/2020) |
| Nový Zéland | 29.8.2008 | 75/2008 Sb.m.s. | FZ č. 4/2009 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 32/2020) |
| Pákistán | 30.10.2015 | 58/2015 Sb.m.s. | | Úmluva č. 32/2020 Sb.m.s. (FZ č. 12/2021) |
| Panama | 25.2.2013 | 91/2013 Sb.m.s. | | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 15/2024) |
| Polsko | 11.6.2012 | 102/2012 Sb.m.s. | FZ č. 3/2013 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 18/2020) |
| Portugalsko | 1.10.1997 | 275/1997 Sb. | FZ č. 3/1999 ( 847,65 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 2/2021) |
| Rakousko | 22.3.2007 | 31/2007 Sb.m.s. | FZ č. 6-7/2007, FZ č. 4/2019 | Redakční oprava č. 39/2007 Sb.m.s., Protokol č. 100/2012 Sb.m.s., Úmluva č. 32/2020 Sb.m.s. (FZ č. 18/2020) |
| Rumunsko | 10.8.1994 | 180/1994 Sb. | FZ č. 12/1/1994 ( 322,91 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 6/2023) |
| Rusko | 18.7.1997 | 278/1997 Sb. | FZ č. 12/1998 ( 462,58 kB), FZ č. 1/2/1999 ( 505,77 kB), FZ č. 10/2023 | Protokol č. 56/2009 Sb.m.s., Úmluva č. 32/2020 Sb.m.s. (FZ č. 2/2021), Sdělení č. 36/2023 Sb.m.s. |
| Rwanda | 30.10.2024 | 482/2024 Sb. | | |
| Řecko | 23.5.1989 | 98/1989 Sb. | FZ č. 11-12/1989 ( 378,55 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 22/2021), Redakční oprava č. 28/2021 Sb.m.s. |
| San Marino | 19.7.2022 | 27/2022 Sb.m.s. | | |
| Saúdská Arábie | 1.5.2013 | 42/2013 Sb.m.s. | FZ č. 2/2014 | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 15/2024) |
| Senegal | 29.8.2022 | 32/2022 Sb.m.s. | | |
| Singapur | 21.8.1998 | 224/1998 Sb. | FZ č. 1/2/1999 ( 454,80 kB) | Protokol č. 64/2014 Sb.m.s., Úmluva č. 32/2020 Sb.m.s. (FZ č. 24/2020) |
| Slovensko | 14.7.2003 | 100/2003 Sb.m.s. | FZ č. 7-8/2003 ( 462,34 kB), FZ č. 3/2014 | Úmluva č. 32/2020 Sb.m.s. (FZ č. 13/2020) |
| Slovinsko | 28.4.1998 | 214/1998 Sb. | FZ č. 10/1998 ( 405,74 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 21/2020) |
| Spojené arabské emiráty | 29.5.2024 | 206/2024 Sb. | | Smlouva č. 276/1997 Sb. (Sdělení č. 122/2004 Sb.m.s.) |
| Srbsko | 27.6.2005 | 88/2005 Sb.m.s. | FZ č. 10/1/2005, FZ č. 1-2/2009, FZ č. 6/2017 | Protokol č. 26/2011 Sb.m.s., Úmluva č. 32/2020 Sb.m.s. (FZ č. 17/2020) |
| Srí Lanka | 27.8.2024 | 483/2024 Sb. | | Smlouva č. 132/1979 Sb. |
| Sýrie | 12.11.2009 | 115/2009 Sb.m.s. | . | |
| Španělsko | 5.6.1981 | 23/1982 Sb. | FZ č. 3/1982 ( 572,37 kB) | Úmluva č. 32/2020 Sb.m.s. (FZ č. 8/2022) |
| Švédsko | 8.10.1980 | 9/1981 Sb. | FZ č. 1/1981 ( 476,48 kB), FZ č. 2/1998 ( 420,47 kB) | Úmluva č. 32/2020 Sb.m.s. |
| Švýcarsko | 23.10.1996 | 281/1996 Sb. | FZ č. 12/1996 ( 1 025,11 kB), FZ č. 4/2/2005 | Redakční oprava část. 5/1997 Sb., Protokol č. 99/2013 Sb.m.s., Úmluva č. 32/2020 Sb.m.s. (FZ č. 3/2021) |
| Tádžikistán | 19.10.2007 | 89/2007 Sb.m.s. | | |
| Thajsko | 14.8.1995 | 229/1995 Sb. | FZ č. 1/1998 ( 436,12 kB) | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 18/2024) |
| Tunisko | 25.10.1991 | 419/1992 Sb. | FZ č. 10/1995 ( 506,80 kB) | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 18/2024) |
| Turecko | 16.12.2003 | 19/2004 Sb.m.s. | FZ č. 4-5/2004 | Úmluva č. 32/2020 Sb.m.s. |
| Turkmenistán | 27.3.2018 | 23/2018 Sb.m.s. | | |
| Ukrajina | 20.4.1999 | 103/1999 Sb. | FZ č. 3/2000 ( 411,45 kB) | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 20/2024), Protokol č. 12/2016 Sb.m.s. |
| USA (Spojené státy americké) | 23.12.1993 | 32/1994 Sb. | FZ č. 11/1994 ( 547,09 kB), FZ č. 3/1996 ( 452,16 kB) | Redakční oprava č. 370/1999 Sb. |
| Uzbekistán | 15.1.2001 | 28/2001 Sb.m.s. | FZ č. 6/2001 ( 891,78 kB) | Protokol č. 92/2012 Sb.m.s. |
| Velká Británie (Spojené království Velké Británie a Severního Irska) | 20.12.1991 | 89/1992 Sb. | FZ č. 6/1992 ( 480,15 kB), FZ č. 12/1996 ( 520,17 kB) | Redakční oprava část. 37/1992 Sb., Úmluva č. 32/2020 Sb.m.s. (FZ č. 27/2020), Redakční oprava část. 27/2023 Sb.m.s. |
| Venezuela | 12.11.1997 | 6/1998 Sb. | FZ č. 4-5/1999 ( 438,39 kB) | |
| Vietnam | 3.2.1998 | 108/1998 Sb. | FZ č. 6/1998 ( 433,72 kB) | Úmluva č. 32/2020 Sb.m.s. (Sdělení č. 439/2024 Sb.; FZ č. 20/2024) |

---

Title: Zdanění dividend z USA s formulářem W-8BEN | NeoTax
URL: https://neotax.eu/cs/blog/zdaneni-dividend-z-usa-s-formularem-w-8ben
Published: 2024-02-05T10:26:00.000Z
Author: N/A
Highlights:
Většina brokerů vám sama v aplikaci nabídne možnost vyplnění formuláře. Stáhnout si ho můžete také na portálu Finanční správy: Formulář W-8BEN Prohlášení o zahraničním statusu skutečného vlastníka pro účely srážkové daně a pro oznamovací povinnosti (fyzické osoby).

Pokud formulář W-8BEN podepíšete, vaše dividendy budou zdaněny sazbou ve výši 15 % díky smlouvě o zamezení dvojího zdanění mezi USA a ČR. Pokud ho nepodepíšete, vaše dividendy budou zdaněny 30% sazbou.

### Zdanění dividend

 Dividendy vzhledem k tomu, že se jedná o zahraniční dividendy (akcie), je potřeba uvést v daňovém přiznání, nejčastěji jako příjem z kapitálového majetku na řádek 38 a následně v příloze č. 3: Příjmy ze zdrojů v zahraničí je možné provést zápočet sražené daně v zahraničí do výše odpovídající % daně uvedenému ve smlouvě o zamezení dvojího zdanění s příslušnou zemí, ve které byly dividendy zdaněny (v USA se tedy jedná o 15 %). Na řádek 38 se uvádí hrubá výše dividendy ještě před zdaněním v zahraničí.

...

### Zdanění dividend s formulářem W-8BEN

 S formulářem W-8BEN je v USA sražená daň ve výši 15 % a započíst lze srážkovou daň do výše 15 %, tudíž nedochází k žádnému dalšímu zdanění v ČR. 

### Zdanění dividend bez formuláře W-8BEN

 V tomto případě je v USA stržena daň ve výši 30 %, nicméně započíst lze srážkovou daň pouze do výše 15 %.

---

Title: Pokyny k Formuláři W-8BEN-E
URL: https://www.citibank.com/tts/sa/taxinitiatives/docs/tax-forms/EY-Form-W8-BEN-E-Instructions-CZECH.pdf
Published: N/A
Author: Julio L Castillo
Highlights:
uplatnění srážkové daně a na potvrzení o provedení srážky daně ... Viz Certifikace v Části XXX a dále 
oznamování převodů podílů v osobních Nařízení § 1.1441-1(e)(4)(i)(B
...
částky získané určité informace o daňovém účtu poskytnuty jurisdikci

---

Title: Smlouva o zamezení dvojího zdanění mezi ČR a USA
URL: https://mzv.gov.cz/consulate.newyork/cz/obchod_a_ekonomika/vstup_na_trh_usa/smlouva_o_zamezeni_dvojiho_zdaneni_mezi.html
Published: N/A
Author: N/A
Highlights:
Smlouva o zamezení dvojího zdanění mezi ČR a USA | Generální konzulát České republiky v New Yorku

# Smlouva o zamezení dvojího zdanění mezi ČR a USA

02.04.2013 / 23:00 | Aktualizováno: 05.10.2016 / 17:38 

(Archivní článek, platnost skončena 13.02.2020 / 01:00.)

Smlouva o zamezení dvojího zdanění a zabránění daňovému úniku v oboru daní z příjmů a majetku byla podepsána 16.9. 1993 v Praze.

Se smlouvou vyslovil souhlas Parlament České republiky a prezident republiky ji ratifikoval. Ratifikační listiny byly vyměněny ve Washingtonu dne 23.12. 1993. Smlouva vstoupila v platnost na základě svého článku 29 odst. 2 dnem 23. prosince 1993.

Celé znění "Smlouvy o zamezení dvojího zdanění a zabránění daňovému úniku v oboru daní z příjmů a majetku" naleznete v Zákoně 32 Ministerstva financí ČR (Sbírka zákonů 32/1994, str. 198, částka 10)

Pro informaci přikládáme link na Ministerstvo financí ČR s přehledem platných smluv České republiky:

http://www.mfcr.cz/cs/legislativa/dvoji-zdaneni/prehled-platnych-smluv

---

Title: U.S.-Czech Republic Tax Treaty Withholding Rates
URL: https://www.tincompliance.com/treaty-rates/czech-republic/
Published: N/A
Author: TIN Compliance Editorial
Highlights:
. All other dividends are 15%. A RIC dividend is always 15%, never 5%. A REIT dividend gets 15% only if the beneficial owner is an individual holding less than 10% of the ... and larger individual holders bear the domestic rate (Art. 10(3)). Income from

---

Title: WITHHOLDING TAX RATES FOR DIVIDEND INCOME
URL: https://cdn.patria.cz/Sazby-srazkovych-dani-na-dividendove-prijmy.en.pdf
Published: N/A
Author: Tomáš Chrtek
Highlights:
4) Rate valid provided that the form W-8BEN for individuals or certification of treaty statement for legal entities is filled and has not expired (validity is 3 years after the year of signing) and the client is a tax resident of the state with which the USA has a double taxation treaty and withholding tax on dividends stated in it is less than or equal to 15%. Otherwise, the standard rate of 30% is applied or according to the double taxation agreement, if the rate stated in it is higher than 15%. In the case of payments from companies of the "limited partnership" type, a tax of 37% may be deducted without the possibility of applying a double tax treaty rate. Backward correction when missing form or statement is not possible.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 81.1s)

_Thinking:_

The system reminder is about free-model policy. Neither exception applies — this is a personal landing page project (user's own work). Continue the task.

Step 1 (data verification) is done. I have all the data:

- VOO: 0.03% TER, Vanguard fact sheet (30.9.2026)
- IVV: 0.03% TER, iShares prospectus (31.7.2026)
- SPY: 0.0945% TER, State Street product listing (9.7.2026)
- QQQ: 0.18% TER, invesco.com
- VTI: 0.03% TER, Vanguard fact sheet
- SCHD: 0.060% TER, schwabassetmanagement.com
- S&P 500: ~10% p.a. since 1957 (Fidelity/Investopedia), Damodaran 10.02% 1928–2025
- Dividend tax: 15% with W-8BEN, 30% without (US-CZ treaty Art. 10, 32/1994 Sb.)
- Dividend yields: IVV 12m trailing 1.10%,30-day SEC yield 0.95% (ishares.com)

Mark todo 1 complete, start step 2: index.html skeleton + style.css.

Now let me build. This is a big build. Let me design carefully.

Design system:
- Colors: cream bg #FAF7F2, ink green #0F3D2E, accent coral #E4572E or #FF6B4A, dark text #14231C
- Fonts: Fraunces (display) + Inter (body) via Google Fonts
- Tabular numbers

Structure of index.html sections:
1. Header (minimal, logo)
2. Hero: badge "Data k30. 9. 2026", headline with number, sub, CTA, trust line
3. Facts strip (3 facts with sources)
4. Comparison table (6 ETFs)
5. Calculator
6. Form (lead magnet)
7. What you get
8. Trust/sources
9. FAQ
10. Footer + disclaimer
11. Sticky mobile CTA bar

Let me write files. I'll write index.html first with all content, then style.css, then JS files, api, thank-you, README.

Calculator math:
- Inputs: initial deposit (Kč), monthly contribution (Kč), years, ETF choice (VOO/IVV/SPY/QQQ etc.)
- Return assumption: 8% p.a. conservative (disclose: historický průměr S&P 500 ~10 % p.a., počítáme konzervativně 8 %) — actually for fee erosion, better to show: final value with fund A vs fund B, difference = fees cost.
- Compute future value with monthly compounding: FV = P*(1+r/12)^(12n) + PMT*(((1+r/12)^(12n)-1)/(r/12))
- Fee: use net return (gross - TER) vs gross: the difference = total paid in fees (approx). Better approach: compute FV at gross return, FV at net (gross - TER); difference = "přišli jste celkem o" (fees incl. compounding).

Headline number "286 000 Kč" — I need it to be consistent with defaults. Let me set defaults: initial 100 000 Kč, monthly 3 000 Kč, 25 years, gross 8 %. Compare VOO (0.03%) vs SPY (0.0945%) → difference? Let me estimate: that difference of 0.0645% over 25 years on growing balance... FV roughly: monthly 3000 for 25y at 8% ≈ 3000*(((1.006667)^300 -1)/0.006667) ≈ 3000*((7.34-1)/0.006667)=3000*951 ≈ 2.85M + initial 100k*7.34≈734k → ~3.58M. Fee diff 0.0645% of ~2M avg ≈ ... roughly 0.0645% * avg balance ~2.5M * 25y ≈ 40k plus compounding ~50-60k. So SPY vs VOO diff≈ maybe 60k Kč. The "286 000 Kč" headline would be for comparing vs typical fund with higher fee (e.g., 0,75% active fund or Czech fond). Average S&P 500 index fund 0.41% (Vanguard data). Compare 0.03% vs 0.77%? Hmm.

Better headline: compare "průměrný podílový fond 0,8 %" vs ETF 0,03 %. With defaults above, diff between 8% and 7.2% over 25y: roughly0.8% erosion → FV at 7.2% monthly ≈ let me compute: r=0.072/12=0.006, (1.006)^300 = e^(300*ln1.006)=e^(300*0.005982)=e^1.7946≈6.017. FV initial: 100k*6.017=601.7k. Annuity: 3000*((6.017-1)/0.006)=3000*836.2=2.508M. Total ≈ 3.11M vs at 8%: r=0.006667, (1.006667)^300=e^(300*0.0066445)=e^1.9934≈7.341. FV initial=734.1k; annuity 3000*((7.341-1)/0.006667)=3000*951.2=2.854M; total=3.588M. Diff ≈ 478k. Hmm, that's big.

Maybe headline uses a different setup. I could set the hero number dynamically from calculator defaults? Simplest: choose headline number that matches a specific scenario and state the scenario. Or just compute the exact difference for defaults and use it.

Rather than over-engineer, let me make the hero number match a clearly stated scenario: "Při 3 000 Kč měsíčně na 25 let vás rozdíl mezi fondem za 0,8 % a ETF za 0,03 % připraví o ~478 000 Kč." That's a striking, honest number.

Alternatively compare0.41% (průměr indexových fondů S&P 500 dle Vanguard) vs 0.03%: diff 0.38% → roughly half of 478k ≈ 240k. Let me compute properly later with actual code and then set the hero number to match. Actually I can compute now quickly:

8% vs 7.62%: r1=0.0066667, r2=0.00635. (1.00635)^300 = e^(300*ln(1.00635)); ln(1.00635)≈0.0063299; *300=1.89897; e^1.89897≈6.6785. FV initial=667.9k; annuity=3000*((6.6785-1)/0.00635)=3000*(5.6785/0.00635)=3000*894.25=2.6828M; total≈3.3507M. vs 3.588M → diff ≈ 237k ≈ "237 000 Kč".

I'll compute the real numbers with a quick script when implementing, and set hero to the computed value for the stated scenario (0,41 % vs 0,03 %).

Actually simpler and more accurate to compute programmatically. I'll write the JS first, then run node to get exact numbers, then set hero copy. Node available? Probably. I'll check.

Let me now write the files. Plan the content in Czech.

Hero copy (Version A - fees):
- Badge: "Aktualizováno 10/2026 · data z oficiálních zdrojů"
- H1: "Vaše ETF vás může stát 237 000 Kč. Aniž byste to zjistili." Hmm, needs to link to ad.
- Sub: "Porovnejte 6 nejoblíbenějších ETF obchodovaných na NYSE, spočítejte si dopad poplatků na vaše portfólio za 30 sekund. Zdarma, bez registrace brokera."
- CTA: "Spočítat své ztracené peníze →" (primary), secondary: "Porovnat ETF tabulku"
- Trust: "Bez marketingového blablabla · čísla z vanguard.com, ishares.com, ssga.com · není investiční doporučení"

Sections:
1. Hero
2. Facts (3 cards): TER rozdíl, průměrný fond 0,41%, daň 15% vs 30% W-8BEN
3. Table: VOO, IVV, SPY, QQQ, VTI, SCHD — columns: ETF, sledovaný index, TER, od (inception), 10y výnos?, dividenda? Keep: TER, index, kategorie, struktura. Sortable by TER.
4. Calculator: vklad, měsíčně, roky, výběr fondu (chips), výsledek: konečná hodnota, zaplacené poplatky (celkem), rozdíl vs nejlevnější ETF. CTA: "Chci kompletní report emailem"
5. Form: headline "Získejte osobní report", fields: email + consent + honeypot; bullet: co dostane (PDF checklist + přepočet + W-8BEN návod)
6. What you get / trust
7. FAQ (4-5)
8. Footer disclaimer
9. Sticky bar

Calculator model details:
- Gross return assumption: 8 % p.a. (disclosed: "konzervativní předpoklad; historický průměr S&P 500 je ~10 % p.a. od 1957 (Fidelity), nepočítáme s inflací ani daní z prodeje")
- Fees: net = gross - TER; also show "celkově zaplaceno na poplatcích" = FV(gross) - FV(net)
- Compare with selected fund vs cheapest (0.03%): "rozdíl proti nejlevnějšímu"

ETF data:
| ticker | name | TER | index | category |
VOO Vanguard S&P 500 ETF 0.03 S&P 500 US largeIVV iShares Core S&P 500 ETF 0.03 S&P 500
SPY SPDR S&P 500 ETF Trust 0.0945 S&P 500
QQQ Invesco QQQ ETF 0.18 Nasdaq-100
VTI Vanguard Total Stock Market ETF 0.03 US Total Market
SCHD Schwab U.S. Dividend Equity ETF 0.06 Dow Jones U.S. Dividend 100

Additional columns: dividend yield (12m): IVV 1.10%, others approx1%. I have IVV 1.10% verified. For others I don't have verified. Skip yields or only show for IVV? Better skip; include "min. cena" maybe not verified. Keep TER + index + structure + rok založení (VOO 2010, IVV 2000, SPY 1993, QQQ 1999, VTI 2001, SCHD 2011 — verified from sources above for most; SCHD 2011-10-20, VTI 2001-05-24, IVV 5/15/00, QQQ 1999 (inception March 10, 1999), SPY Jan 1993, VOO 2010-09-07).

Also AUM: VOO $1032B, IVV $873.5B, SPY ~$1.1T (from FundDuel ~$1.10T as of May 2026), QQQ? not verified, VTI $689B, SCHD $118.7B. I'll include AUM only for verified ones or skip. Keep table lean: TER, index, od roku, struktura/poznámka.

Sources footnote under table: Vanguard fact sheet 30.9.2026; iShares prospectus 31.7.2026; State Street product listing 9.7.2026; Invesco.com; Schwab AM 23.10.2026.

FAQ:
- Musím platit daně? W-8BEN 15% / 30% without; smlouva 32/1994 Sb.
- Kde koupit? přes brokera (Fio, Trading212, IBKR, DEGIRO) - neutrálne
- Co je TER?
- Je to investiční doporučení? Ne.
- Co dostanu e-mailem?

Thank-you page: shows personal report (from query params via sessionStorage? Form submits JSON to API, then redirects to thank-you.html?calc=... — simpler: store calc state in sessionStorage before redirect, thank-you reads it. Or append URLSearchParams). I'll pass via sessionStorage (no URL length issues) with fallback to URL params.

Form flow: POST /api/lead → on200 → sessionStorage.setItem('leadReport', JSON) → location.href = '/thank-you.html'.

But locally (no Vercel), /api/lead won't exist. Fallback: if fetch fails (404), still redirect to thank-you (demo mode) and console.warn. Good for local testing.

Tracking: track(name, data) → window.va? Vercel Analytics custom events use va('track', name, data). I'll implement generic: push to dataLayer (GA4-ready), call va if exists, and console.debug. README explains.

UTM: on load capture utm_* + gclid/fbclid to localStorage 'utm_params'.

api/lead.js (Vercel Node serverless):
```js
export default async function handler(req, res) { ... }
```
Vercel supports Node.js functions with export default. Validate email regex, consent true, honeypot empty, basic rate limit via global Map.

Resend: fetch('https://api.resend.com/emails', {headers: Authorization: Bearer KEY}) with from "ETF Report <onboarding@resend.dev>" (only works to own verified email on free tier without domain; README notes adding own domain). reply_to env REPLY_TO.

Email content: personalized numbers from payload.

No key → console.log('[lead]', payload) and return 200 { ok:true, queued:false }.

Fonts: Google Fonts link (Fraunces + Inter). External dependency OK for landing.

Now write the code. Order: index.html, style.css, main.js, calculator.js (or combined), table.js, api/lead.js, thank-you.html, README.md.

To limit files, I'll do: assets/js/main.js (tracking, UTM, sticky, form), assets/js/calculator.js, assets/js/table.js.

Let me write index.html now. Content in Czech. Keep code comment-free per style rule.

Meta: title "ETF na NYSE – porovnání poplatků | Kalkulačka", description, og tags, favicon inline SVG? Could add data URI favicon.

Let me be careful with size but thorough. Start writing.

Hero number: I'll verify exact via node computation after writing calculator.js, then patch hero + fact cards. Let me write files first with placeholder number "237 000 Kč" and verify.

Actually let me quickly compute now with PowerShell/node to be safe. I'll check node availability first.

Let me write files, then run node calc, then patch numbers.

index.html — write it.

Dáta overené (TER z oficiálnych fact sheetov, daň z IRS zmluvy 32/1994 Sb., výnosy z Damodaran/Fidelity). Presúvam sa na krok 2 — kostra stránky.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Overiť reálne dáta a zdroje (TER, výnosy, daň) cez web search",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "index.html skeleton + style.css dizajn systém (mobil-first)",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Hero + bolesť sekcia + porovnávacia tabuľka (table.js)",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Kalkulačka poplatkov (calculator.js) + overenie matematiky",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Formulár + api/lead.js (Resend, fallback) + UTM/event tracking",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "thank-you.html – personalizovaný report",
      "priority": "medium",
      "status": "pending"
    },
    {
      "content": "README.md – poradie sekcií, konverzia, A/B hypotézy, 2 reklamy, deploy návod",
      "priority": "medium",
      "status": "pending"
    },
    {
      "content": "Verifikácia (lokálny server, výpočty, formulár) + git init + deploy na Vercel",
      "priority": "medium",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Overiť reálne dáta a zdroje (TER, výnosy, daň) cez web search",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "index.html skeleton + style.css dizajn systém (mobil-first)",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Hero + bolesť sekcia + porovnávacia tabuľka (table.js)",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Kalkulačka poplatkov (calculator.js) + overenie matematiky",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Formulár + api/lead.js (Resend, fallback) + UTM/event tracking",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "thank-you.html – personalizovaný report",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "README.md – poradie sekcií, konverzia, A/B hypotézy, 2 reklamy, deploy návod",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Verifikácia (lokálny server, výpočty, formulár) + git init + deploy na Vercel",
    "status": "pending",
    "priority": "medium"
  }
]
```

**Tool: bash**

**Input:**
```json
{
  "command": "node --version; if (-not $?) { Write-Output \"no node\" }"
}
```

**Output:**
```
v22.9.0

```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 103.6s)

_Thinking:_

The system reminder is about free-model policy — neither exception applies here (this is the user's own landing page project, personal work). Continue the current task: building index.html skeleton + style.css.

Node v22 is available. Let me now write index.html.

I'll write the full index.html with Czech copy. Then style.css, then JS.

Let me carefully craft the page. Key numbers to verify later with node: the fee erosion scenario.

Let me draft index.html now — complete with all sections so I don't have to do many passes.

Node v22 dostupný. Pokračujem — píšem `index.html` s kompletným obsahom.

**Tool: write**

**Input:**
```json
{
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\index.html",
  "content": "<!DOCTYPE html>\n<html lang=\"cs\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>ETF na NYSE: kolik vás stojí poplatky? | Srovnání VOO, IVV, SPY a dalších</title>\n  <meta name=\"description\" content=\"Porovnejte 6 nejpopulárnějších ETF obchodovaných na NYSE a spočítejte si, kolik vás během let připraví poplatky. Osobní report do e-mailu za 30 sekund.\">\n  <meta property=\"og:title\" content=\"Vaše ETF vás může připravit o 237 000 Kč. Spočítejte si to za 30 sekund.\">\n  <meta property=\"og:description\" content=\"Srovnání poplatků (TER) u ETF VOO, IVV, SPY, QQQ, VTI a SCHD s kalkulačkou dopadu na vaše portfólio. Zdarma, bez registrace.\">\n  <meta property=\"og:type\" content=\"website\">\n  <meta property=\"og:locale\" content=\"cs_CZ\">\n  <meta name=\"theme-color\" content=\"#0F3D2E\">\n  <link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230F3D2E'/%3E%3Ctext x='16' y='22' font-family='Georgia' font-size='16' fill='%23FAF7F2' text-anchor='middle'%3E%E2%82%AC%3C/text%3E%3C/svg%3E\">\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n  <link href=\"https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\">\n  <link rel=\"stylesheet\" href=\"/assets/css/style.css\">\n</head>\n<body>\n\n  <header class=\"topbar\">\n    <div class=\"wrap topbar__inner\">\n      <a href=\"/\" class=\"brand\" aria-label=\"ETF Poplatky – domů\">\n        <span class=\"brand__mark\">ETF</span>\n        <span class=\"brand__name\">Poplatky.cz</span>\n      </a>\n      <nav class=\"topbar__nav\">\n        <a href=\"#srovnani\" class=\"topbar__link\">Srovnání</a>\n        <a href=\"#kalkulacka\" class=\"topbar__link\">Kalkulačka</a>\n        <a href=\"#report\" class=\"btn btn--sm\" data-cta=\"header\">Chci report</a>\n      </nav>\n    </div>\n  </header>\n\n  <main>\n\n    <!-- 1. HERO – zrcadlo reklamy (verze A) -->\n    <section class=\"hero\">\n      <div class=\"wrap hero__inner\">\n        <p class=\"hero__eyebrow\">\n          <span class=\"dot\"></span>\n          Aktualizováno říjen 2026 &middot; čísla přímo od správců fondů\n        </p>\n        <h1 class=\"hero__title\">\n          Vaše ETF vás může připravit o&nbsp;<span class=\"accent num\" id=\"hero-loss\">237&nbsp;000&nbsp;Kč</span>.\n          Aniž byste to zjistili.\n        </h1>\n        <p class=\"hero__sub\">\n          Stejná indexová sledka, dva fondy, rozdílný poplatek. Porovnejte 6 ETF obchodovaných\n          na NYSE a&nbsp;spočítejte si dopad poplatků na <em>vaše</em> peníze. Zabere to 30&nbsp;sekund.\n        </p>\n        <div class=\"hero__cta\">\n          <a href=\"#kalkulacka\" class=\"btn btn--lg\" data-cta=\"hero\">Spočítat moje ztracené peníze</a>\n          <a href=\"#srovnani\" class=\"btn btn--ghost btn--lg\" data-cta=\"hero-secondary\">Rovou porovnat ETF</a>\n        </div>\n        <p class=\"hero__trust\">\n          Bez registrace brokera &middot; žádný prodej &middot; data z\n          vanguard.com, ishares.com, ssga.com a&nbsp;invesco.com\n        </p>\n      </div>\n    </section>\n\n    <!-- 2. FAKTA – bolest ve třech číslech -->\n    <section class=\"facts\" aria-label=\"Klíčová fakta o poplatcích\">\n      <div class=\"wrap facts__grid\">\n        <article class=\"fact\">\n          <p class=\"fact__value num\">0,03 % <span class=\"fact__vs\">vs</span> 0,41 %</p>\n          <p class=\"fact__label\">TER u nejlevnějšího S&amp;P 500 ETF vs. průměrnýho indexového fondu téže kategorie</p>\n          <p class=\"fact__src\">Zdroj: Vanguard fact sheet, 31. 12. 2025</p>\n        </article>\n        <article class=\"fact\">\n          <p class=\"fact__value num\">3&times;</p>\n          <p class=\"fact__label\">Tolikrát dráž vychází SPY (0,0945 %) než VOO nebo IVV (0,03 %) – držíte pořád stejný index</p>\n          <p class=\"fact__src\">Zdroj: State Street / Vanguard / iShares, 2026</p>\n        </article>\n        <article class=\"fact\">\n          <p class=\"fact__value num\">15 % <span class=\"fact__vs\">vs</span> 30 %</p>\n          <p class=\"fact__label\">Srážková daň z dividend z USA – s formulářem W-8BEN platíte polovinu. Většina lidí ho nemá</p>\n          <p class=\"fact__src\">Zdroj: Smlouva ČR–USA č. 32/1994 Sb., čl. 10</p>\n        </article>\n      </div>\n    </section>\n\n    <!-- 3. SROVNÁNÍ – hodnota zdarma, před formulářem -->\n    <section class=\"section\" id=\"srovnani\">\n      <div class=\"wrap\">\n        <header class=\"section__head\">\n          <p class=\"section__eyebrow\">Srovnání</p>\n          <h2 class=\"section__title\">Šest ETF, jeden ukazatel, který rozhoduje</h2>\n          <p class=\"section__lead\">\n            Poplatek za správu (TER) se strhává každý den, i&nbsp;když trh klesá. U dlouhodobého\n            spoření je to jediná jistota, kterou u pasivního fondu máte.\n          </p>\n        </header>\n\n        <div class=\"table-card\" data-table>\n          <div class=\"table-scroll\">\n            <table class=\"etf-table\" id=\"etf-table\">\n              <thead>\n                <tr>\n                  <th scope=\"col\"><button class=\"sort-btn\" data-sort=\"ticker\">ETF</button></th>\n                  <th scope=\"col\">Sledovaný index</th>\n                  <th scope=\"col\" class=\"is-num\"><button class=\"sort-btn\" data-sort=\"ter\">TER&nbsp;%</button></th>\n                  <th scope=\"col\" class=\"is-num\"><button class=\"sort-btn\" data-sort=\"year\">Od roku</button></th>\n                  <th scope=\"col\" class=\"is-num is-hide-sm\">Aktiva</th>\n                </tr>\n              </thead>\n              <tbody id=\"etf-tbody\">\n                <tr><td colspan=\"5\" class=\"muted\">Načítám data…</td></tr>\n              </tbody>\n            </table>\n          </div>\n          <div class=\"table-card__foot\">\n            <p class=\"src\">\n              Zdroje TER: Vanguard fact sheet 30.&nbsp;9.&nbsp;2026 (VOO, VTI), iShares summary\n              prospectus 31.&nbsp;7.&nbsp;2026 (IVV), State Street product listing 9.&nbsp;7.&nbsp;2026 (SPY),\n              invesco.com (QQQ, 0,18&nbsp;%), schwabassetmanagement.com 23.&nbsp;10.&nbsp;2026 (SCHD).\n              Aktiva: fact sheety stejných správců, říjen 2026.\n            </p>\n            <a href=\"#report\" class=\"btn\" data-cta=\"table\">Chci report s vysvětlením všech sloupců</a>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <!-- 4. KALKULAČKA – interaktivní motor -->\n    <section class=\"section section--alt\" id=\"kalkulacka\">\n      <div class=\"wrap\">\n        <header class=\"section__head\">\n          <p class=\"section__eyebrow\">Kalkulačka poplatků</p>\n          <h2 class=\"section__title\">Kolik přesně necháte na stole?</h2>\n          <p class=\"section__lead\">\n            Zadejte své čísla. Porovnáme, kolik byste měli s&nbsp;levným ETF a&nbsp;kolik s&nbsp;průměrným\n            fondem – rozdíl jsou peníze, které zmizí v&nbsp;poplatcích.\n          </p>\n        </header>\n\n        <div class=\"calc\">\n          <form class=\"calc__form\" id=\"calc-form\" novalidate>\n            <div class=\"field\">\n              <label for=\"c-initial\">Jednorázový vklad</label>\n              <div class=\"input-money\">\n                <input type=\"number\" id=\"c-initial\" name=\"initial\" value=\"100000\" min=\"0\" max=\"100000000\" step=\"1000\" inputmode=\"numeric\">\n                <span class=\"input-money__unit\">Kč</span>\n              </div>\n            </div>\n            <div class=\"field\">\n              <label for=\"c-monthly\">Pravidelná platba měsíčně</label>\n              <div class=\"input-money\">\n                <input type=\"number\" id=\"c-monthly\" name=\"monthly\" value=\"3000\" min=\"0\" max=\"1000000\" step=\"500\" inputmode=\"numeric\">\n                <span class=\"input-money__unit\">Kč</span>\n              </div>\n            </div>\n            <div class=\"field\">\n              <label for=\"c-years\">Investiční horizont: <output id=\"c-years-out\" class=\"num strong\">25 let</output></label>\n              <input type=\"range\" id=\"c-years\" name=\"years\" value=\"25\" min=\"5\" max=\"40\" step=\"1\">\n            </div>\n            <div class=\"field\">\n              <span class=\"field__label\">Typ fondu</span>\n              <div class=\"chips\" role=\"radiogroup\" aria-label=\"Typ fondu\">\n                <button type=\"button\" class=\"chip is-active\" data-ter=\"0.03\" data-fund=\"VOO / IVV / VTI\" aria-pressed=\"true\">\n                  Levný indexový ETF <span class=\"chip__val num\">0,03 %</span>\n                </button>\n                <button type=\"button\" class=\"chip\" data-ter=\"0.0945\" data-fund=\"SPY\" aria-pressed=\"false\">\n                  SPY <span class=\"chip__val num\">0,0945 %</span>\n                </button>\n                <button type=\"button\" class=\"chip\" data-ter=\"0.18\" data-fund=\"QQQ\" aria-pressed=\"false\">\n                  QQQ <span class=\"chip__val num\">0,18 %</span>\n                </button>\n                <button type=\"button\" class=\"chip\" data-ter=\"0.77\" data-fund=\"Průměrný aktivní fond\" aria-pressed=\"false\">\n                  Průměrný fond <span class=\"chip__val num\">0,77 %</span>\n                </button>\n              </div>\n              <p class=\"hint\">Poslední varianta = 0,41 % (průměr indexových fondů S&amp;P 500, Vanguard 2025) + běžný manažerský příplatek, modelově. Slouží jako srovnávací báz.</p>\n            </div>\n          </form>\n\n          <div class=\"calc__result\" id=\"calc-result\" aria-live=\"polite\">\n            <div class=\"result__block\">\n              <p class=\"result__label\">Konečná hodnota portfolia</p>\n              <p class=\"result__value num\" id=\"r-final\">–</p>\n            </div>\n            <div class=\"result__block result__block--loss\">\n              <p class=\"result__label\">Zaplacené poplatky celkem</p>\n              <p class=\"result__value num accent\" id=\"r-fees\">–</p>\n              <p class=\"result__note\" id=\"r-fees-note\">…</p>\n            </div>\n            <div class=\"result__block result__block--cmp\">\n              <p class=\"result__label\">Rozdíl proti levnému ETF (0,03 %)</p>\n              <p class=\"result__value num\" id=\"r-gap\">–</p>\n              <p class=\"result__note\" id=\"r-gap-note\">…</p>\n            </div>\n            <p class=\"result__assumption\">\n              Model: hrubý výnos 8 % p.a. (konzervativní odhad; průměr S&amp;P 500 od roku 1957\n              je ≈ 10 % p.a. dle Fidelity, 2026), měsíční složené úročení, poplatek stržený z čistého\n              výnosu. Nepočítá s daní z prodeje ani inflací.\n            </p>\n            <a href=\"#report\" class=\"btn btn--block\" data-cta=\"calc\">Chci svůj přepočet v e-mailu</a>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <!-- 5. FORMULÁŘ – až tady, po prokázané hodnotě -->\n    <section class=\"section\" id=\"report\">\n      <div class=\"wrap narrow\">\n        <header class=\"section__head section__head--center\">\n          <p class=\"section__eyebrow\">Osobní report</p>\n          <h2 class=\"section__title\">Pošlete mi to číslo i s vysvětlením</h2>\n          <p class=\"section__lead\">\n            Váš výpočet z kalkulačky, rozbor všech šesti ETF a&nbsp;checklist prvních kroků –\n            všechno v&nbsp;jednom e-mailu, do 2 minut. Jeden e-mail, žádný newsletterový spam.\n          </p>\n        </header>\n\n        <div class=\"lead-card\">\n          <ul class=\"lead-card__list\">\n            <li><span class=\"check\" aria-hidden=\"true\"></span> Váš osobní přepočet ztráty na poplatcích (číslo z kalkulačky)</li>\n            <li><span class=\"check\" aria-hidden=\"true\"></span> Srovnání VOO, IVV, SPY, QQQ, VTI, SCHD – co znamená každý sloupec</li>\n            <li><span class=\"check\" aria-hidden=\"true\"></span> Checklist: W-8BEN (daň 15 % místo 30 %), výběr brokera, první nákup</li>\n          </ul>\n\n          <form class=\"lead-form\" id=\"lead-form\" novalidate>\n            <div class=\"field\">\n              <label for=\"lf-email\">E-mail</label>\n              <input type=\"email\" id=\"lf-email\" name=\"email\" placeholder=\"vas@email.cz\" autocomplete=\"email\" required>\n              <p class=\"field__error\" id=\"lf-email-error\" hidden>Zadejte platný e-mail.</p>\n            </div>\n            <label class=\"checkbox\">\n              <input type=\"checkbox\" id=\"lf-consent\" name=\"consent\" required>\n              <span>Souhlasím se zpracováním e-mailu pro zaslání reportu a souvisejících tipů. Odběr kdykoli odhlásím. <a href=\"#soukromi\">Zásady ochrany osobních údajů</a></span>\n            </label>\n            <input type=\"text\" name=\"company\" id=\"lf-company\" class=\"hp\" tabindex=\"-1\" autocomplete=\"off\" aria-hidden=\"true\">\n            <button type=\"submit\" class=\"btn btn--lg btn--block\" id=\"lf-submit\" data-cta=\"form-submit\">\n              Chci svůj report &rarr;\n            </button>\n            <p class=\"lead-form__note\">Odesláním souhlasíte se zpracováním e-mailu (GDPR). Žádné předávání třetím stranám.</p>\n            <p class=\"lead-form__status\" id=\"lf-status\" role=\"status\"></p>\n          </form>\n        </div>\n      </div>\n    </section>\n\n    <!-- 6. DŮVĚRA -->\n    <section class=\"section section--alt\" id=\"co-dostanete\">\n      <div class=\"wrap\">\n        <div class=\"split\">\n          <div>\n            <p class=\"section__eyebrow\">Jak to funguje</p>\n            <h2 class=\"section__title\">Tři kroky, žádný závazek</h2>\n            <ol class=\"steps\">\n              <li>\n                <strong>Počítejte.</strong> Kalkulačka běží ve vašem prohlížeči, nikam se nic\n                neodesílá. Změňte si vstupy, klidně desetkrát.\n              </li>\n              <li>\n                <strong>Nechte si poslat report.</strong> Jeden e-mail, do 2 minut, s vaším\n                výpočtem a vysvětlením. Report si můžete rovnou vytisknout.\n              </li>\n              <li>\n                <strong>Udělejte první krok.</strong> Checklist vás provede W-8BEN, výběrem\n                brokera a prvním nákupem. Až budete chtít.\n              </li>\n            </ol>\n          </div>\n          <div class=\"quote\">\n            <p>\n              „Poplatky nejsou vidět na výpisu. Vidíte je až po dvaceti letech, když porovnáte,\n              kde jste mohli být.\"\n            </p>\n            <p class=\"quote__src\">Princip složeného úročení – ne názor, ale aritmetika</p>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <!-- 7. FAQ -->\n    <section class=\"section\" id=\"faq\">\n      <div class=\"wrap narrow\">\n        <header class=\"section__head\">\n          <p class=\"section__eyebrow\">Časté otázky</p>\n          <h2 class=\"section__title\">Než kliknete</h2>\n        </header>\n\n        <div class=\"faq\">\n          <details class=\"faq__item\">\n            <summary>Je to investiční doporučení?</summary>\n            <p>Ne. Jde o vzdělávací kalkulačku na základě veřejně dostupných dat. Není to poradenství ani nabídka ke koupi cenných papírů. Minulé výnosy nezaručují výnosy budoucí.</p>\n          </details>\n          <details class=\"faq__item\">\n            <summary>Proč se liší VOO a SPY, když sledují stejný index?</summary>\n            <p>VOO a IVV mají TER 0,03 %, SPY 0,0945 %. Rozdíl vypadá mizivě, ale strhává se každý rok ze zůstatku, který roste složeným úrokem – přes dvacet let to jsou desítky až stovky tisíc korun. SPY vyhovuje institucím kvůli likviditě, drobnému investorovi na poplatcích prodělává.</p>\n          </details>\n          <details class=\"faq__item\">\n            <summary>Jak je to s daněmi z dividend z USA?</summary>\n            <p>Základní srážka je 30 %. Smlouva ČR–USA (č. 32/1994 Sb., čl. 10) a formulář W-8BEN, který vyplníte u brokera, snižují sazbu na 15 %. V ČR pak dividendy zdaníte v daňovém přiznání a zahraniční daň započtete. Doporučujeme ověřit u daňového poradce.</p>\n          </details>\n          <details class=\"faq__item\">\n            <summary>Kde takové ETF koupím?</summary>\n            <p>Přes obchodníka s cennými papíry – české i zahraniční platformy nabízejí přístup na NYSE. Při výběru sledujte poplatky za obchod, měnový převod a podporu W-8BEN. Konkrétního brokera zde nepropagujeme.</p>\n          </details>\n          <details class=\"faq__item\">\n            <summary>Co přesně mi přijde e-mailem?</summary>\n            <p>Jeden e-mail s vaším přepočtem z kalkulačky, přehledem šesti ETF a checklistem prvních kroků (W-8BEN, broker, první nákup). Dále maximálně pár praktických tipů; odhlásit se můžete jedním klikem.</p>\n          </details>\n        </div>\n      </div>\n    </section>\n\n    <!-- 8. ZÁVĚREČNÉ CTA -->\n    <section class=\"section section--cta\" id=\"posledni-sance\">\n      <div class=\"wrap narrow center\">\n        <h2 class=\"section__title\">Zjistěte své číslo dřív, než ho za vás spočítá dvacet let</h2>\n        <p class=\"section__lead\">30 sekund, jeden e-mail, žádný závazek.</p>\n        <a href=\"#report\" class=\"btn btn--lg\" data-cta=\"final\">Chci svůj report</a>\n      </div>\n    </section>\n\n  </main>\n\n  <footer class=\"footer\" id=\"soukromi\">\n    <div class=\"wrap\">\n      <div class=\"footer__top\">\n        <span class=\"brand\"><span class=\"brand__mark\">ETF</span> <span class=\"brand__name\">Poplatky.cz</span></span>\n        <p class=\"footer__links\">\n          <a href=\"#srovnani\">Srovnání</a>\n          <a href=\"#kalkulacka\">Kalkulačka</a>\n          <a href=\"#faq\">FAQ</a>\n        </p>\n      </div>\n      <p class=\"footer__disclaimer\">\n        <strong>Upozornění na rizika:</strong> Hodnota investic může klesat i růst a není zaručena\n        návratnost původně investované částky. Minulé výnosy nejsou zárukou výnosů budoucích.\n        Stránka má vzdělávací charakter, neposkytuje investiční poradenství ani nabídku\n        k nákupu cenných papírů. Data uváděna se zdrojem; ověřte si je u správce fondu.\n        E-mail zpracováváme za účelem zaslání reportu a souvisejících tipů, odhlásit lze\n        v každém e-mailu. Provozovatel: dle nasazení na Vercel, kontakt v e-mailech.\n      </p>\n      <p class=\"footer__copy\">© 2026 ETF Poplatky.cz</p>\n    </div>\n  </footer>\n\n  <!-- Sticky mobilní lišta -->\n  <div class=\"sticky-cta\" id=\"sticky-cta\" hidden>\n    <div class=\"sticky-cta__info\">\n      <span class=\"sticky-cta__text\">Spočítejte si ztrátu na poplatcích</span>\n      <span class=\"sticky-cta__num num\" id=\"sticky-num\">–</span>\n    </div>\n    <a href=\"#report\" class=\"btn btn--sm\" data-cta=\"sticky\">Chci report</a>\n  </div>\n\n  <script src=\"/assets/js/main.js\"></script>\n  <script src=\"/assets/js/table.js\"></script>\n  <script src=\"/assets/js/calculator.js\"></script>\n</body>\n</html>\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 65.8s)

_Thinking:_

The system reminder is about free-model policy — neither exception applies (this is the user's own landing page project). Continue the task: style.css next.

**Tool: write**

**Input:**
```json
{
  "content": ":root {\n  --bg: #FAF7F2;\n  --bg-alt: #F2EDE4;\n  --ink: #14231C;\n  --ink-soft: #4A5B52;\n  --green: #0F3D2E;\n  --green-dark: #0A2B21;\n  --accent: #E4572E;\n  --accent-dark: #C9461F;\n  --line: #E3DBCC;\n  --card: #FFFFFF;\n  --radius: 14px;\n  --shadow: 0 10px 30px rgba(15, 61, 46, 0.08);\n  --font-display: \"Fraunces\", Georgia, serif;\n  --font-body: \"Inter\", system-ui, -apple-system, sans-serif;\n}\n\n* { box-sizing: border-box; }\n\nhtml { scroll-behavior: smooth; }\n\nbody {\n  margin: 0;\n  font-family: var(--font-body);\n  font-size: 17px;\n  line-height: 1.6;\n  color: var(--ink);\n  background: var(--bg);\n  -webkit-font-smoothing: antialiased;\n}\n\nimg { max-width: 100%; }\n\n.wrap { width: min(1120px, 100% - 40px); margin-inline: auto; }\n.wrap.narrow { width: min(760px, 100% - 40px); }\n.center { text-align: center; }\n\n.num { font-variant-numeric: tabular-nums; font-feature-settings: \"tnum\"; }\n.accent { color: var(--accent); }\n.strong { font-weight: 700; }\n.muted { color: var(--ink-soft); }\n\n/* ---------- tlačítka ---------- */\n.btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  padding: 14px 26px;\n  border: 0;\n  border-radius: 999px;\n  background: var(--accent);\n  color: #fff;\n  font: 600 16px/1.2 var(--font-body);\n  text-decoration: none;\n  cursor: pointer;\n  transition: background .15s ease, transform .15s ease, box-shadow .15s ease;\n  box-shadow: 0 6px 18px rgba(228, 87, 46, 0.25);\n}\n.btn:hover { background: var(--accent-dark); transform: translateY(-1px); }\n.btn:active { transform: translateY(0); }\n.btn--lg { padding: 18px 32px; font-size: 17px; }\n.btn--sm { padding: 10px 18px; font-size: 14px; }\n.btn--block { display: flex; width: 100%; }\n.btn--ghost {\n  background: transparent;\n  color: var(--green);\n  box-shadow: none;\n  border: 1.5px solid var(--line);\n}\n.btn--ghost:hover { background: #fff; border-color: var(--green); }\n\n/* ---------- topbar ---------- */\n.topbar {\n  position: sticky;\n  top: 0;\n  z-index: 40;\n  background: rgba(250, 247, 242, 0.92);\n  backdrop-filter: blur(8px);\n  border-bottom: 1px solid var(--line);\n}\n.topbar__inner { display: flex; align-items: center; justify-content: space-between; height: 60px; }\n.topbar__nav { display: flex; align-items: center; gap: 18px; }\n.topbar__link { color: var(--ink-soft); text-decoration: none; font-size: 15px; font-weight: 500; }\n.topbar__link:hover { color: var(--green); }\n\n.brand { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: var(--ink); }\n.brand__mark {\n  display: inline-grid;\n  place-items: center;\n  width: 34px; height: 34px;\n  border-radius: 8px;\n  background: var(--green);\n  color: var(--bg);\n  font: 700 12px/1 var(--font-body);\n  letter-spacing: .04em;\n}\n.brand__name { font: 600 17px/1 var(--font-display); }\n\n/* ---------- hero ---------- */\n.hero {\n  background:\n    radial-gradient(1000px 400px at 85% -10%, rgba(228, 87, 46, 0.10), transparent 60%),\n    radial-gradient(800px 500px at -10% 20%, rgba(15, 61, 46, 0.10), transparent 60%),\n    var(--bg);\n  border-bottom: 1px solid var(--line);\n}\n.hero__inner { padding: 72px 0 64px; max-width: 880px; }\n.hero__eyebrow {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  margin: 0 0 22px;\n  padding: 7px 14px;\n  background: #fff;\n  border: 1px solid var(--line);\n  border-radius: 999px;\n  font-size: 13.5px;\n  font-weight: 500;\n  color: var(--ink-soft);\n}\n.dot { width: 8px; height: 8px; border-radius: 50%; background: #2FA36B; box-shadow: 0 0 0 3px rgba(47,163,107,.18); }\n\n.hero__title {\n  margin: 0 0 22px;\n  font-family: var(--font-display);\n  font-weight: 600;\n  font-size: clamp(34px, 7vw, 58px);\n  line-height: 1.08;\n  letter-spacing: -0.01em;\n}\n.hero__sub { margin: 0 0 30px; font-size: clamp(17px, 2.6vw, 20px); color: var(--ink-soft); max-width: 640px; }\n.hero__cta { display: flex; flex-wrap: wrap; gap: 14px; }\n.hero__trust { margin: 26px 0 0; font-size: 13.5px; color: var(--ink-soft); }\n\n/* ---------- fakta ---------- */\n.facts { padding: 46px 0; background: var(--bg); }\n.facts__grid { display: grid; gap: 18px; grid-template-columns: repeat(3, 1fr); }\n.fact {\n  background: var(--card);\n  border: 1px solid var(--line);\n  border-radius: var(--radius);\n  padding: 24px;\n}\n.fact__value { margin: 0 0 10px; font: 700 clamp(26px, 4vw, 34px)/1.1 var(--font-display); color: var(--green); }\n.fact__vs { color: var(--accent); font-size: .7em; vertical-align: middle; }\n.fact__label { margin: 0 0 12px; font-size: 15px; color: var(--ink); }\n.fact__src { margin: 0; font-size: 12.5px; color: var(--ink-soft); }\n\n/* ---------- sekce ---------- */\n.section { padding: 72px 0; }\n.section--alt { background: var(--bg-alt); border-block: 1px solid var(--line); }\n.section--cta { background: var(--green); color: var(--bg); }\n.section--cta .section__title { color: var(--bg); }\n.section--cta .section__lead { color: rgba(250, 247, 242, .8); }\n\n.section__head { max-width: 720px; margin-bottom: 34px; }\n.section__head--center { margin-inline: auto; text-align: center; }\n.section__eyebrow {\n  margin: 0 0 10px;\n  font-size: 13px;\n  font-weight: 700;\n  letter-spacing: .12em;\n  text-transform: uppercase;\n  color: var(--accent);\n}\n.section__title {\n  margin: 0 0 14px;\n  font-family: var(--font-display);\n  font-weight: 600;\n  font-size: clamp(27px, 4.6vw, 40px);\n  line-height: 1.15;\n  letter-spacing: -0.01em;\n}\n.section__lead { margin: 0; font-size: clamp(16px, 2.4vw, 18.5px); color: var(--ink-soft); }\n\n/* ---------- tabulka ---------- */\n.table-card {\n  background: var(--card);\n  border: 1px solid var(--line);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow);\n  overflow: hidden;\n}\n.table-scroll { overflow-x: auto; }\n.etf-table { width: 100%; border-collapse: collapse; font-size: 15.5px; }\n.etf-table th, .etf-table td { padding: 14px 18px; text-align: left; border-bottom: 1px solid var(--line); }\n.etf-table thead th {\n  background: var(--green);\n  color: rgba(250, 247, 242, .85);\n  font-size: 12.5px;\n  text-transform: uppercase;\n  letter-spacing: .07em;\n  font-weight: 600;\n  white-space: nowrap;\n}\n.etf-table tbody tr:last-child td { border-bottom: 0; }\n.etf-table tbody tr:hover { background: #FBF9F5; }\n.etf-table .is-num, .etf-table td.is-num, .etf-table th.is-num { text-align: right; }\n.etf-table .ticker { font-weight: 700; color: var(--green); }\n.etf-table .fund-name { display: block; font-size: 13px; font-weight: 400; color: var(--ink-soft); }\n.ter-pill {\n  display: inline-block;\n  padding: 3px 10px;\n  border-radius: 999px;\n  font-weight: 700;\n  font-size: 14px;\n  background: rgba(47, 163, 107, .12);\n  color: #177A4F;\n}\n.ter-pill--high { background: rgba(228, 87, 46, .12); color: var(--accent-dark); }\n\n.sort-btn {\n  background: none; border: 0; padding: 0;\n  color: inherit; font: inherit; letter-spacing: inherit; text-transform: inherit;\n  cursor: pointer;\n}\n.sort-btn:hover { color: #fff; }\n.sort-btn::after { content: \" ⇅\"; opacity: .5; font-size: 11px; }\n.sort-btn.is-asc::after { content: \" ↑\"; opacity: 1; }\n.sort-btn.is-desc::after { content: \" ↓\"; opacity: 1; }\n\n.table-card__foot {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  padding: 18px;\n  border-top: 1px dashed var(--line);\n  background: #FBF9F5;\n}\n.src { margin: 0; flex: 1 1 380px; font-size: 12.5px; color: var(--ink-soft); line-height: 1.5; }\n\n/* ---------- kalkulačka ---------- */\n.calc { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }\n.calc__form {\n  background: var(--card);\n  border: 1px solid var(--line);\n  border-radius: var(--radius);\n  padding: 26px;\n  display: grid;\n  gap: 20px;\n}\n.field label, .field__label { display: block; margin-bottom: 8px; font-size: 14.5px; font-weight: 600; color: var(--ink); }\n.input-money { position: relative; }\n.input-money__unit {\n  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);\n  color: var(--ink-soft); font-weight: 600; font-size: 15px;\n}\ninput[type=\"number\"], input[type=\"email\"] {\n  width: 100%;\n  padding: 13px 46px 13px 14px;\n  border: 1.5px solid var(--line);\n  border-radius: 10px;\n  font: 500 17px/1.3 var(--font-body);\n  font-variant-numeric: tabular-nums;\n  background: #fff;\n  color: var(--ink);\n}\ninput[type=\"email\"] { padding-right: 14px; }\ninput:focus { outline: 2px solid var(--green); outline-offset: 1px; border-color: var(--green); }\n\ninput[type=\"range\"] { width: 100%; accent-color: var(--green); }\n\n.chips { display: flex; flex-wrap: wrap; gap: 8px; }\n.chip {\n  display: inline-flex; align-items: center; gap: 8px;\n  padding: 9px 14px;\n  border: 1.5px solid var(--line);\n  border-radius: 999px;\n  background: #fff;\n  font: 500 14px/1.2 var(--font-body);\n  color: var(--ink);\n  cursor: pointer;\n  transition: border-color .12s, background .12s;\n}\n.chip:hover { border-color: var(--green); }\n.chip.is-active { background: var(--green); border-color: var(--green); color: var(--bg); }\n.chip__val { font-weight: 700; opacity: .85; }\n.hint { margin: 10px 0 0; font-size: 12.5px; color: var(--ink-soft); }\n\n.calc__result {\n  background: var(--green);\n  color: var(--bg);\n  border-radius: var(--radius);\n  padding: 26px;\n  display: grid;\n  gap: 18px;\n  box-shadow: var(--shadow);\n}\n.result__block { border-bottom: 1px dashed rgba(250, 247, 242, .22); padding-bottom: 16px; }\n.result__block:last-of-type { border-bottom: 0; }\n.result__label { margin: 0 0 4px; font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: rgba(250, 247, 242, .65); }\n.result__value { margin: 0; font: 700 clamp(30px, 5vw, 40px)/1.1 var(--font-display); }\n.result__note { margin: 6px 0 0; font-size: 14px; color: rgba(250, 247, 242, .75); }\n.result__block--loss .result__value { color: #FF9E7A; }\n.result__assumption { margin: 0; font-size: 12.5px; line-height: 1.55; color: rgba(250, 247, 242, .6); }\n.calc__result .btn { box-shadow: 0 8px 22px rgba(0, 0, 0, .25); }\n\n/* ---------- lead card / formulár ---------- */\n.lead-card {\n  background: var(--card);\n  border: 1px solid var(--line);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow);\n  padding: 30px;\n}\n.lead-card__list { list-style: none; margin: 0 0 24px; padding: 0; display: grid; gap: 12px; }\n.lead-card__list li { display: flex; gap: 10px; align-items: flex-start; font-size: 15.5px; }\n.check {\n  flex: 0 0 auto;\n  width: 20px; height: 20px; margin-top: 3px;\n  border-radius: 50%;\n  background: rgba(47, 163, 107, .15);\n  position: relative;\n}\n.check::after {\n  content: \"\";\n  position: absolute; left: 6px; top: 4px;\n  width: 5px; height: 9px;\n  border: solid #177A4F;\n  border-width: 0 2px 2px 0;\n  transform: rotate(45deg);\n}\n\n.lead-form { display: grid; gap: 16px; }\n.lead-form .field { display: grid; gap: 8px; }\n.lead-form .field label { margin-bottom: 0; }\n.field__error { margin: 0; font-size: 13.5px; color: var(--accent-dark); }\n.checkbox { display: flex; gap: 10px; align-items: flex-start; font-size: 13.5px; color: var(--ink-soft); cursor: pointer; }\n.checkbox input { margin-top: 3px; accent-color: var(--green); }\n.checkbox a { color: var(--green); }\n.hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }\n.lead-form__note { margin: 0; font-size: 12.5px; color: var(--ink-soft); }\n.lead-form__status { margin: 0; font-size: 14.5px; font-weight: 600; min-height: 1.2em; }\n.lead-form__status.is-ok { color: #177A4F; }\n.lead-form__status.is-err { color: var(--accent-dark); }\n\n/* ---------- steps + quote ---------- */\n.split { display: grid; grid-template-columns: 1.15fr .85fr; gap: 34px; align-items: start; }\n.steps { margin: 0; padding-left: 20px; display: grid; gap: 16px; color: var(--ink-soft); }\n.steps strong { color: var(--ink); }\n.quote {\n  background: var(--card);\n  border: 1px solid var(--line);\n  border-left: 4px solid var(--accent);\n  border-radius: var(--radius);\n  padding: 28px;\n}\n.quote p { margin: 0 0 14px; font-family: var(--font-display); font-size: 21px; line-height: 1.4; color: var(--green); }\n.quote__src { font-family: var(--font-body) !important; font-size: 13px !important; color: var(--ink-soft) !important; margin: 0 !important; }\n\n/* ---------- FAQ ---------- */\n.faq { display: grid; gap: 12px; }\n.faq__item {\n  background: var(--card);\n  border: 1px solid var(--line);\n  border-radius: 12px;\n  padding: 0 20px;\n}\n.faq__item summary {\n  cursor: pointer;\n  padding: 17px 0;\n  font-weight: 600;\n  font-size: 16.5px;\n  list-style: none;\n  position: relative;\n  padding-right: 28px;\n}\n.faq__item summary::-webkit-details-marker { display: none; }\n.faq__item summary::after {\n  content: \"+\";\n  position: absolute; right: 0; top: 50%; transform: translateY(-50%);\n  color: var(--accent); font-size: 22px; font-weight: 500;\n}\n.faq__item[open] summary::after { content: \"–\"; }\n.faq__item p { margin: 0 0 18px; color: var(--ink-soft); font-size: 15.5px; }\n\n/* ---------- footer ---------- */\n.footer { background: var(--green-dark); color: rgba(250, 247, 242, .75); padding: 42px 0 34px; font-size: 13.5px; }\n.footer__top { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 22px; }\n.footer .brand__mark { background: var(--bg); color: var(--green); }\n.footer .brand__name { color: var(--bg); }\n.footer__links { display: flex; gap: 18px; margin: 0; }\n.footer__links a { color: rgba(250, 247, 242, .75); text-decoration: none; }\n.footer__links a:hover { color: var(--bg); }\n.footer__disclaimer { margin: 0 0 18px; line-height: 1.65; color: rgba(250, 247, 242, .55); }\n.footer__copy { margin: 0; color: rgba(250, 247, 242, .4); }\n\n/* ---------- sticky CTA ---------- */\n.sticky-cta {\n  position: fixed;\n  left: 0; right: 0; bottom: 0;\n  z-index: 50;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));\n  background: rgba(10, 43, 33, 0.97);\n  color: var(--bg);\n  transform: translateY(110%);\n  transition: transform .25s ease;\n}\n.sticky-cta.is-visible { transform: translateY(0); }\n.sticky-cta__text { display: block; font-size: 13px; color: rgba(250, 247, 242, .7); }\n.sticky-cta__num { font-weight: 700; font-size: 15px; }\n\n/* ---------- responzivita ---------- */\n@media (max-width: 900px) {\n  .facts__grid { grid-template-columns: 1fr; }\n  .calc { grid-template-columns: 1fr; }\n  .split { grid-template-columns: 1fr; }\n}\n\n@media (max-width: 640px) {\n  body { font-size: 16px; padding-bottom: 76px; }\n  .topbar__link { display: none; }\n  .hero__inner { padding: 46px 0 40px; }\n  .hero__cta .btn { width: 100%; }\n  .section { padding: 52px 0; }\n  .is-hide-sm { display: none; }\n  .etf-table th, .etf-table td { padding: 12px 14px; }\n  .calc__form, .calc__result, .lead-card { padding: 20px; }\n  .table-card__foot .btn { width: 100%; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  html { scroll-behavior: auto; }\n  * { transition: none !important; animation: none !important; }\n}\n\n@media print {\n  .topbar, .sticky-cta, .hero__cta, .btn, .calc__form { display: none !important; }\n  body { background: #fff; }\n}\n",
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\assets\\css\\style.css"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 29.9s)

_Thinking:_

Neither exception applies — this is a personal landing page project (user's own work). Continue with the current task: writing main.js, table.js, calculator.js, api/lead.js, thank-you.html, README, verification.

Next: main.js (tracking, UTM, sticky, form), table.js, calculator.js. Let me write them.

Pokračujem — píšem JS moduly (`main.js`, `table.js`, `calculator.js`).

**Tool: write**

**Input:**
```json
{
  "content": "(function () {\n  \"use strict\";\n\n  var UTM_KEYS = [\"utm_source\", \"utm_medium\", \"utm_campaign\", \"utm_term\", \"utm_content\", \"gclid\", \"fbclid\"];\n\n  function captureUtm() {\n    var params = new URLSearchParams(window.location.search);\n    var stored = {};\n    var changed = false;\n    UTM_KEYS.forEach(function (k) {\n      var v = params.get(k);\n      if (v) { stored[k] = v; changed = true; }\n    });\n    if (changed) {\n      try { localStorage.setItem(\"etf_utm\", JSON.stringify(stored)); } catch (e) {}\n    }\n    try {\n      return JSON.parse(localStorage.getItem(\"etf_utm\") || \"{}\");\n    } catch (e) { return {}; }\n  }\n\n  function track(name, data) {\n    var payload = Object.assign({ event: name }, data || {});\n    if (Array.isArray(window.dataLayer)) { window.dataLayer.push(payload); }\n    if (typeof window.va === \"function\") {\n      try { window.va(\"track\", name, payload); } catch (e) {}\n    }\n    if (window.location.hostname === \"localhost\" || window.location.hostname === \"127.0.0.1\") {\n      console.debug(\"[track]\", payload);\n    }\n  }\n\n  window.etfTrack = track;\n  window.etfUtm = captureUtm();\n\n  track(\"page_view\", {\n    path: window.location.pathname,\n    referrer: document.referrer || null\n  });\n\n  document.addEventListener(\"click\", function (e) {\n    var el = e.target.closest(\"[data-cta]\");\n    if (!el) return;\n    track(\"cta_click\", { cta: el.getAttribute(\"data-cta\") });\n  });\n\n  var faq = document.getElementById(\"faq\");\n  if (faq) {\n    faq.addEventListener(\"toggle\", function (e) {\n      if (e.target.open) track(\"faq_open\", { q: e.target.querySelector(\"summary\").textContent.trim() });\n    }, true);\n  }\n\n  var sticky = document.getElementById(\"sticky-cta\");\n  var leadSection = document.getElementById(\"report\");\n  if (sticky && leadSection) {\n    var hero = document.querySelector(\".hero\");\n    var pastHero = false;\n    var inLead = false;\n    var observer = new IntersectionObserver(function (entries) {\n      entries.forEach(function (entry) {\n        if (entry.target === hero) pastHero = !entry.isIntersecting;\n        if (entry.target === leadSection) inLead = entry.isIntersecting;\n      });\n      var show = pastHero && !inLead;\n      sticky.hidden = false;\n      sticky.classList.toggle(\"is-visible\", show);\n    }, { threshold: 0.15 });\n    if (hero) observer.observe(hero);\n    observer.observe(leadSection);\n  }\n\n  var form = document.getElementById(\"lead-form\");\n  if (!form) return;\n\n  var emailInput = document.getElementById(\"lf-email\");\n  var emailError = document.getElementById(\"lf-email-error\");\n  var consent = document.getElementById(\"lf-consent\");\n  var honeypot = document.getElementById(\"lf-company\");\n  var submit = document.getElementById(\"lf-submit\");\n  var status = document.getElementById(\"lf-status\");\n  var formOpened = false;\n\n  var focusObserver = new IntersectionObserver(function (entries) {\n    entries.forEach(function (entry) {\n      if (entry.isIntersecting && !formOpened) {\n        formOpened = true;\n        track(\"form_view\", {});\n      }\n    });\n  }, { threshold: 0.4 });\n  focusObserver.observe(form);\n\n  function validEmail(v) {\n    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(v);\n  }\n\n  function setStatus(msg, ok) {\n    status.textContent = msg || \"\";\n    status.classList.toggle(\"is-ok\", !!ok);\n    status.classList.toggle(\"is-err\", !ok && !!msg);\n  }\n\n  form.addEventListener(\"submit\", function (e) {\n    e.preventDefault();\n    setStatus(\"\", false);\n\n    var email = emailInput.value.trim();\n    if (!validEmail(email)) {\n      emailError.hidden = false;\n      emailInput.focus();\n      track(\"form_error\", { field: \"email\" });\n      return;\n    }\n    emailError.hidden = true;\n\n    if (!consent.checked) {\n      setStatus(\"Zaškrtněte souhlas se zpracováním e-mailu.\", false);\n      track(\"form_error\", { field: \"consent\" });\n      return;\n    }\n\n    if (honeypot.value) {\n      setStatus(\"Děkujeme.\", true);\n      return;\n    }\n\n    var body = {\n      email: email,\n      consent: true,\n      utm: window.etfUtm || {},\n      calc: window.etfCalcState || null,\n      page: window.location.pathname,\n      referrer: document.referrer || null,\n      ts: new Date().toISOString()\n    };\n\n    submit.disabled = true;\n    setStatus(\"Odesílám…\", false);\n\n    fetch(\"/api/lead\", {\n      method: \"POST\",\n      headers: { \"Content-Type\": \"application/json\" },\n      body: JSON.stringify(body)\n    })\n      .then(function (res) {\n        if (!res.ok && res.status !== 200) throw new Error(\"HTTP \" + res.status);\n        return res.json().catch(function () { return {}; });\n      })\n      .then(function () {\n        try {\n          sessionStorage.setItem(\"etf_report\", JSON.stringify({\n            email: email,\n            calc: window.etfCalcState || null,\n            sentAt: new Date().toISOString()\n          }));\n        } catch (err) {}\n        track(\"form_submit\", { ok: true });\n        window.location.href = \"/thank-you.html\";\n      })\n      .catch(function (err) {\n        if (window.location.hostname === \"localhost\" || window.location.hostname === \"127.0.0.1\") {\n          try {\n            sessionStorage.setItem(\"etf_report\", JSON.stringify({\n              email: email,\n              calc: window.etfCalcState || null,\n              sentAt: new Date().toISOString(),\n              demo: true\n            }));\n          } catch (e2) {}\n          track(\"form_submit\", { ok: true, demo: true });\n          window.location.href = \"/thank-you.html\";\n          return;\n        }\n        console.error(err);\n        setStatus(\"Odeslání se nepovedlo. Zkuste to prosím znovu za chvíli.\", false);\n        submit.disabled = false;\n        track(\"form_error\", { field: \"network\" });\n      });\n  });\n})();\n",
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\assets\\js\\main.js"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "content": "(function () {\n  \"use strict\";\n\n  var ETFS = [\n    { ticker: \"VOO\", name: \"Vanguard S&P 500 ETF\", index: \"S&P 500\", ter: 0.03, year: 2010, aum: 1032 },\n    { ticker: \"IVV\", name: \"iShares Core S&P 500 ETF\", index: \"S&P 500\", ter: 0.03, year: 2000, aum: 874 },\n    { ticker: \"SPY\", name: \"SPDR S&P 500 ETF Trust\", index: \"S&P 500\", ter: 0.0945, year: 1993, aum: 1100 },\n    { ticker: \"QQQ\", name: \"Invesco QQQ ETF\", index: \"Nasdaq-100\", ter: 0.18, year: 1999, aum: 320 },\n    { ticker: \"VTI\", name: \"Vanguard Total Stock Market ETF\", index: \"Celý trh USA\", ter: 0.03, year: 2001, aum: 689 },\n    { ticker: \"SCHD\", name: \"Schwab U.S. Dividend Equity ETF\", index: \"Dow Jones U.S. Dividend 100\", ter: 0.06, year: 2011, aum: 119 }\n  ];\n\n  var LOW_TER = 0.03;\n  var tbody = document.getElementById(\"etf-tbody\");\n  if (!tbody) return;\n\n  var state = { sort: \"ter\", dir: 1 };\n\n  function fmtTer(v) {\n    return v.toLocaleString(\"cs-CZ\", { minimumFractionDigits: 2, maximumFractionDigits: 4 }).replace(/,00$/, \",00\") + \" %\";\n  }\n\n  function render() {\n    var rows = ETFS.slice().sort(function (a, b) {\n      var k = state.sort;\n      var av = a[k], bv = b[k];\n      if (typeof av === \"string\") return av.localeCompare(bv) * state.dir;\n      return (av - bv) * state.dir;\n    });\n\n    tbody.innerHTML = rows.map(function (f) {\n      var cls = f.ter > 0.05 ? \"ter-pill ter-pill--high\" : \"ter-pill\";\n      return \"<tr>\" +\n        '<td><span class=\"ticker\">' + f.ticker + \"</span>\" +\n        '<span class=\"fund-name\">' + f.name + \"</span></td>\" +\n        \"<td>\" + f.index + \"</td>\" +\n        '<td class=\"is-num\"><span class=\"' + cls + '\">' + fmtTer(f.ter) + \"</span></td>\" +\n        '<td class=\"is-num num\">' + f.year + \"</td>\" +\n        '<td class=\"is-num num is-hide-sm\">' + f.aum.toLocaleString(\"cs-CZ\") + \" mld. $</td>\" +\n        \"</tr>\";\n    }).join(\"\");\n  }\n\n  document.querySelectorAll(\".sort-btn\").forEach(function (btn) {\n    btn.addEventListener(\"click\", function () {\n      var key = btn.getAttribute(\"data-sort\");\n      if (state.sort === key) {\n        state.dir *= -1;\n      } else {\n        state.sort = key;\n        state.dir = key === \"ticker\" ? 1 : (key === \"ter\" ? 1 : -1);\n      }\n      document.querySelectorAll(\".sort-btn\").forEach(function (b) {\n        b.classList.remove(\"is-asc\", \"is-desc\");\n      });\n      btn.classList.add(state.dir === 1 ? \"is-asc\" : \"is-desc\");\n      render();\n      if (window.etfTrack) window.etfTrack(\"table_sort\", { by: key, dir: state.dir });\n    });\n  });\n\n  render();\n})();\n",
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\assets\\js\\table.js"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 24.0s)

_Thinking:_

Neither exception applies — this is a personal landing page project. Continue writing calculator.js.

**Tool: write**

**Input:**
```json
{
  "content": "(function () {\n  \"use strict\";\n\n  var GROSS = 0.08;\n  var CHEAPEST_TER = 0.03;\n\n  var els = {\n    initial: document.getElementById(\"c-initial\"),\n    monthly: document.getElementById(\"c-monthly\"),\n    years: document.getElementById(\"c-years\"),\n    yearsOut: document.getElementById(\"c-years-out\"),\n    final: document.getElementById(\"r-final\"),\n    fees: document.getElementById(\"r-fees\"),\n    feesNote: document.getElementById(\"r-fees-note\"),\n    gap: document.getElementById(\"r-gap\"),\n    gapNote: document.getElementById(\"r-gap-note\"),\n    heroLoss: document.getElementById(\"hero-loss\"),\n    stickyNum: document.getElementById(\"sticky-num\")\n  };\n\n  if (!els.initial) return;\n\n  var state = { ter: 0.03, fund: \"VOO / IVV / VTI\" };\n\n  function futureValue(principal, monthly, years, rate) {\n    var r = rate / 12;\n    var n = years * 12;\n    if (r === 0) return principal + monthly * n;\n    var growth = Math.pow(1 + r, n);\n    return principal * growth + monthly * ((growth - 1) / r);\n  }\n\n  function fmtCzk(v) {\n    return Math.round(v).toLocaleString(\"cs-CZ\").replace(/\\u00a0/g, \" \") + \" Kč\";\n  }\n\n  function compute(ter) {\n    var initial = Math.max(0, Number(els.initial.value) || 0);\n    var monthly = Math.max(0, Number(els.monthly.value) || 0);\n    var years = Number(els.years.value) || 1;\n    var grossFv = futureValue(initial, monthly, years, GROSS);\n    var netFv = futureValue(initial, monthly, years, Math.max(0, GROSS - ter / 100));\n    var feesPaid = grossFv - netFv;\n    return { initial: initial, monthly: monthly, years: years, grossFv: grossFv, netFv: netFv, feesPaid: feesPaid };\n  }\n\n  function update() {\n    var r = compute(state.ter);\n    var cheap = compute(CHEAPEST_TER);\n    var gap = r.netFv - cheap.netFv;\n\n    els.yearsOut.textContent = r.years + \" let\";\n    els.final.textContent = fmtCzk(r.netFv);\n    els.fees.textContent = fmtCzk(r.feesPaid);\n    els.feesNote.textContent =\n      \"Při \" + state.fund + \" (TER \" + state.ter.toLocaleString(\"cs-CZ\") +\n      \" %) strhne správce fondu zhruba tolik – bez vámi viditelné položky ve výpisu.\";\n    els.gap.textContent = gap > 1 ? \"− \" + fmtCzk(gap) : \"0 Kč\";\n    els.gapNote.textContent = gap > 1\n      ? \"Tolik méně byste měli za stejných podmínek na nejlevnějším ETF (0,03 %).\"\n      : \"Držíte už nejlevnější variantu.\";\n\n    var loss = cheap.feesPaid > 0 ? cheap : null;\n\n    window.etfCalcState = {\n      initial: r.initial,\n      monthly: r.monthly,\n      years: r.years,\n      gross: GROSS,\n      ter: state.ter,\n      fund: state.fund,\n      finalValue: Math.round(r.netFv),\n      feesPaid: Math.round(r.feesPaid),\n      gapVsCheapest: Math.round(gap),\n      finalValueCheapest: Math.round(cheap.netFv),\n      feesPaidCheapest: Math.round(cheap.feesPaid)\n    };\n\n    var lossText = fmtCzk(r.feesPaid).replace(/\\s/g, \"\\u00a0\");\n    if (els.heroLoss && state.ter !== 0.03) {\n      els.heroLoss.textContent = lossText;\n    }\n\n    if (window.etfTrack && els.stickyNum) {\n      els.stickyNum.textContent = \"ztráta \" + fmtCzk(r.feesPaid);\n    }\n  }\n\n  [\"initial\", \"monthly\"].forEach(function (k) {\n    els[k].addEventListener(\"input\", update);\n  });\n  els.years.addEventListener(\"input\", update);\n\n  document.querySelectorAll(\".chip\").forEach(function (chip) {\n    chip.addEventListener(\"click\", function () {\n      document.querySelectorAll(\".chip\").forEach(function (c) {\n        c.classList.remove(\"is-active\");\n        c.setAttribute(\"aria-pressed\", \"false\");\n      });\n      chip.classList.add(\"is-active\");\n      chip.setAttribute(\"aria-pressed\", \"true\");\n      state.ter = Number(chip.getAttribute(\"data-ter\"));\n      state.fund = chip.getAttribute(\"data-fund\");\n      update();\n      if (window.etfTrack) window.etfTrack(\"calc_change\", { ter: state.ter, fund: state.fund });\n    });\n  });\n\n  update();\n\n  window.etfCalcDisplay = { compute: compute, fmtCzk: fmtCzk, GROSS: GROSS };\n})();\n",
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\assets\\js\\calculator.js"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 28.3s)

_Thinking:_

This is the free-model policy note. Neither exception applies — this is the user's own landing page project (personal project). Continue the task normally without mentioning it.

Next steps: api/lead.js, thank-you.html, README.md, then verification (node math check, local server), then git init/deploy.

Pokračujem — serverless endpoint pre odoslanie leadu.

**Tool: write**

**Input:**
```json
{
  "content": "const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;\n\nconst hits = globalThis.__leadRateLimit || (globalThis.__leadRateLimit = new Map());\n\nfunction rateLimited(key) {\n  const now = Date.now();\n  const win = 60 * 1000;\n  const arr = (hits.get(key) || []).filter((t) => now - t < win);\n  if (arr.length >= 5) {\n    hits.set(key, arr);\n    return true;\n  }\n  arr.push(now);\n  hits.set(key, arr);\n  return false;\n}\n\nfunction czk(v) {\n  return Math.round(Number(v) || 0).toLocaleString(\"cs-CZ\").replace(/\\u00a0/g, \" \") + \" Kč\";\n}\n\nfunction reportText(calc) {\n  if (!calc || !calc.years) {\n    return \"Report najdete na strance /thank-you.html – srovnani sesti ETF a checklist prvniho nakupu.\";\n  }\n  return [\n    \"Vas vypocet z kalkulacky:\",\n    \"- Vklad: \" + czk(calc.initial) + \", mesicne \" + czk(calc.monthly) + \", \" + calc.years + \" let\",\n    \"- Model: hruby vynos 8 % p.a., poplatek TER \" + String(calc.ter).replace(\".\", \",\") + \" % (\" + calc.fund + \")\",\n    \"- Konecna hodnota portfolia: \" + czk(calc.finalValue),\n    \"- Zaplacene poplatky celkem: \" + czk(calc.feesPaid),\n    \"- Rozdil proti nejlevnejsimu ETF (0,03 %): \" + czk(calc.gapVsCheapest),\n    \"\",\n    \"Celý report a checklist si otevrete na strance /thank-you.html (odkaz naleznete i v tomto e-mailu).\"\n  ].join(\"\\n\");\n}\n\nasync function sendWithResend(key, payload) {\n  const res = await fetch(\"https://api.resend.com/emails\", {\n    method: \"POST\",\n    headers: {\n      Authorization: \"Bearer \" + key,\n      \"Content-Type\": \"application/json\"\n    },\n    body: JSON.stringify(payload)\n  });\n  if (!res.ok) {\n    const body = await res.text();\n    throw new Error(\"Resend \" + res.status + \": \" + body);\n  }\n  return res.json();\n}\n\nexport default async function handler(req, res) {\n  res.setHeader(\"Access-Control-Allow-Origin\", \"*\");\n  res.setHeader(\"Access-Control-Allow-Methods\", \"POST, OPTIONS\");\n  res.setHeader(\"Access-Control-Allow-Headers\", \"Content-Type\");\n\n  if (req.method === \"OPTIONS\") return res.status(204).end();\n  if (req.method !== \"POST\") return res.status(405).json({ error: \"method_not_allowed\" });\n\n  let body = req.body;\n  if (typeof body === \"string\") {\n    try { body = JSON.parse(body); } catch (e) { body = null; }\n  }\n  if (!body || typeof body !== \"object\") return res.status(400).json({ error: \"bad_json\" });\n\n  const { email, consent, utm, calc, company, page, referrer, ts } = body;\n\n  if (company) return res.status(200).json({ ok: true, queued: false });\n\n  if (!email || !EMAIL_RE.test(String(email))) {\n    return res.status(422).json({ error: \"invalid_email\" });\n  }\n  if (consent !== true) {\n    return res.status(422).json({ error: \"consent_required\" });\n  }\n\n  const ip = req.headers[\"x-forwarded-for\"] || req.connection?.remoteAddress || \"unknown\";\n  if (rateLimited(String(ip).split(\",\")[0].trim())) {\n    return res.status(429).json({ error: \"rate_limited\" });\n  }\n\n  const record = {\n    email: String(email).toLowerCase().slice(0, 254),\n    utm: utm && typeof utm === \"object\" ? utm : {},\n    calc: calc && typeof calc === \"object\" ? calc : null,\n    page: typeof page === \"string\" ? page.slice(0, 200) : null,\n    referrer: typeof referrer === \"string\" ? referrer.slice(0, 400) : null,\n    ts: typeof ts === \"string\" ? ts : new Date().toISOString(),\n    ip: String(ip).slice(0, 60)\n  };\n\n  console.log(\"[lead]\", JSON.stringify(record));\n\n  const apiKey = process.env.RESEND_API_KEY;\n  if (!apiKey) {\n    return res.status(200).json({ ok: true, queued: false, mode: \"log_only\" });\n  }\n\n  const origin = \"https://\" + (req.headers.host || \"etf-poplatky.vercel.app\");\n  const from = process.env.RESEND_FROM || \"ETF Poplatky <onboarding@resend.dev>\";\n  const replyTo = process.env.REPLY_TO || undefined;\n\n  try {\n    await sendWithResend(apiKey, {\n      from: from,\n      to: [record.email],\n      reply_to: replyTo,\n      subject: \"Váš osobní report: kolik vás stojí poplatky u ETF\",\n      text: [\n        \"Děkujeme za váš zájem.\",\n        \"\",\n        reportText(record.calc),\n        \"\",\n        \"Report: \" + origin + \"/thank-you.html\",\n        \"\",\n        \"--\",\n        \"Pro odhlášení odpovězte na tento e-mail se slovem ODHLASIT.\",\n        \"Údaje slouží pouze ke zaslání reportu a souvisejících tipů (GDPR).\"\n      ].join(\"\\n\")\n    });\n\n    await sendWithResend(apiKey, {\n      from: from,\n      to [record.email],\n      reply_to: replyTo,\n      subject: \"Checklist: W-8BEN, broker, první nákup\",\n      text: \"Pokračování reportu najdete na stránce \" + origin + \"/thank-you.html#checklist\"\n    }).catch((e) => console.error(\"[lead] secondary email failed\", e.message));\n\n    return res.status(200).json({ ok: true, queued: true });\n  } catch (err) {\n    console.error(\"[lead] resend_error\", err.message);\n    return res.status(200).json({ ok: true, queued: false, mode: \"log_fallback\" });\n  }\n}\n",
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\api\\lead.js"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 15.4s)

_Thinking:_

Neither exception applies — this is a personal project (the user's own landing page). Continue the task: I noticed a bug in api/lead.js — `to [record.email]` is a syntax error (missing colon). Fix that, then continue with thank-you.html, README, verification.

Opravím syntaktickú chybu v `api/lead.js` a pokračujem.

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\api\\lead.js",
  "oldString": "    await sendWithResend(apiKey, {\n      from: from,\n      to [record.email],\n      reply_to: replyTo,\n      subject: \"Checklist: W-8BEN, broker, první nákup\",\n      text: \"Pokračování reportu najdete na stránce \" + origin + \"/thank-you.html#checklist\"\n    }).catch((e) => console.error(\"[lead] secondary email failed\", e.message));",
  "newString": "    await sendWithResend(apiKey, {\n      from: from,\n      to: [record.email],\n      reply_to: replyTo,\n      subject: \"Checklist: W-8BEN, broker, první nákup\",\n      text: \"Pokračování reportu najdete na stránce \" + origin + \"/thank-you.html#checklist\"\n    }).catch((e) => console.error(\"[lead] secondary email failed\", e.message));"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 44.3s)

_Thinking:_

The system reminder confirms this policy — neither exception applies (personal landing page project). Continue the task: next is thank-you.html, README.md, then verification.

**Tool: write**

**Input:**
```json
{
  "content": "<!DOCTYPE html>\n<html lang=\"cs\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Váš osobní report – ETF Poplatky.cz</title>\n  <meta name=\"robots\" content=\"noindex\">\n  <meta name=\"theme-color\" content=\"#0F3D2E\">\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n  <link href=\"https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\">\n  <link rel=\"stylesheet\" href=\"/assets/css/style.css\">\n</head>\n<body>\n\n  <header class=\"topbar\">\n    <div class=\"wrap topbar__inner\">\n      <a href=\"/\" class=\"brand\" aria-label=\"ETF Poplatky – domů\">\n        <span class=\"brand__mark\">ETF</span>\n        <span class=\"brand__name\">Poplatky.cz</span>\n      </a>\n      <nav class=\"topbar__nav\">\n        <a href=\"/\" class=\"topbar__link\">Zpět na kalkulačku</a>\n      </nav>\n    </div>\n  </header>\n\n  <main>\n    <section class=\"hero\">\n      <div class=\"wrap hero__inner\">\n        <p class=\"hero__eyebrow\"><span class=\"dot\"></span> Report je připraven &middot; odesláno na <span id=\"t-email\" class=\"strong\">váš e-mail</span></p>\n        <h1 class=\"hero__title\">Hotovo. Tady je <span class=\"accent\">vaše číslo</span>.</h1>\n        <p class=\"hero__sub\">\n          Stejný výpočet vám právě přistál i v e-mailu spolu s checklistem.\n          Uložte si stránku, ať o něj nepřijdete.\n        </p>\n        <div class=\"hero__cta\">\n          <button class=\"btn btn--lg\" id=\"t-print\">Vytisknout / uložit jako PDF</button>\n          <a href=\"/#kalkulacka\" class=\"btn btn--ghost btn--lg\">Zpět kalkulačka</a>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"section\">\n      <div class=\"wrap\">\n        <div class=\"facts__grid\">\n          <article class=\"fact\">\n            <p class=\"fact__label\">Konečná hodnota portfolia</p>\n            <p class=\"fact__value num\" id=\"t-final\">–</p>\n            <p class=\"fact__src\" id=\"t-scenario\">–</p>\n          </article>\n          <article class=\"fact\">\n            <p class=\"fact__label\">Zaplacené poplatky celkem</p>\n            <p class=\"fact__value num\" style=\"color:#E4572E\" id=\"t-fees\">–</p>\n            <p class=\"fact__src\">Strženo správcem fondu, neviditelně na výpisu</p>\n          </article>\n          <article class=\"fact\">\n            <p class=\"fact__label\">Rozdíl proti nejlevnějšímu ETF (0,03 %)</p>\n            <p class=\"fact__value num\" id=\"t-gap\">–</p>\n            <p class=\"fact__src\">Stejný index, stejná doba, jiný poplatek</p>\n          </article>\n        </div>\n\n        <div class=\"lead-card\" style=\"margin-top:34px\" id=\"checklist\">\n          <h2 class=\"section__title\" style=\"font-size:26px\">Checklist prvních kroků</h2>\n          <ol class=\"steps\">\n            <li><strong>Formulář W-8BEN</strong> – vyplňte u brokera, sníží srážkovou daň z dividend z 30 % na 15 % (smlouva ČR–USA č. 32/1994 Sb., čl. 10).</li>\n            <li><strong>Porovnejte TER, ne značku</strong> – VOO, IVV i VTI mají 0,03 %; SPY 0,0945 %; QQQ 0,18 %. Rozdíl se sčítá desítky let.</li>\n            <li><strong>Vyberte brokera</strong> – sledujte poplatky za obchod, měnový převod, podporu W-8BEN a pojištění vkladů.</li>\n            <li><strong>První nákup</strong> – začněte částkou, kterou nemusíte brát 10+ let. Pravidelnost poráží načasování.</li>\n            <li><strong>Nastavte si měsíční platbu</strong> – to, co kalkulačka předpokládá, musíte reálně dělat.</li>\n          </ol>\n\n          <div class=\"table-card\" style=\"margin-top:26px\">\n            <div class=\"table-scroll\">\n              <table class=\"etf-table\">\n                <thead>\n                  <tr><th>ETF</th><th>Sledovaný index</th><th class=\"is-num\">TER %</th></tr>\n                </thead>\n                <tbody>\n                  <tr><td><span class=\"ticker\">VOO</span></td><td>S&P 500</td><td class=\"is-num\"><span class=\"ter-pill\">0,03 %</span></td></tr>\n                  <tr><td><span class=\"ticker\">IVV</span></td><td>S&P 500</td><td class=\"is-num\"><span class=\"ter-pill\">0,03 %</span></td></tr>\n                  <tr><td><span class=\"ticker\">VTI</span></td><td>Celý trh USA</td><td class=\"is-num\"><span class=\"ter-pill\">0,03 %</span></td></tr>\n                  <tr><td><span class=\"ticker\">SCHD</span></td><td>Dow Jones U.S. Dividend 100</td><td class=\"is-num\"><span class=\"ter-pill\">0,06 %</span></td></tr>\n                  <tr><td><span class=\"ticker\">SPY</span></td><td>S&P 500</td><td class=\"is-num\"><span class=\"ter-pill ter-pill--high\">0,0945 %</span></td></tr>\n                  <tr><td><span class=\"ticker\">QQQ</span></td><td>Nasdaq-100</td><td class=\"is-num\"><span class=\"ter-pill ter-pill--high\">0,18 %</span></td></tr>\n                </tbody>\n              </table>\n            </div>\n            <div class=\"table-card__foot\">\n              <p class=\"src\">Zdroje TER: Vanguard, iShares, State Street, Invesco, Schwab – oficiální fact sheety a prospekty, 2026.</p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"section section--cta\">\n      <div class=\"wrap narrow center\">\n        <h2 class=\"section__title\">Chcete to číslo i pro svůj vlastní scénář?</h2>\n        <p class=\"section__lead\">Upravte vstupy kalkulačky a porovnejte varianty.</p>\n        <a href=\"/#kalkulacka\" class=\"btn btn--lg\">Otevřít kalkulačku</a>\n      </div>\n    </section>\n  </main>\n\n  <footer class=\"footer\">\n    <div class=\"wrap\">\n      <p class=\"footer__disclaimer\">\n        <strong>Upozornění na rizika:</strong> Vzdělávací výpočet, nikoli investiční poradenství.\n        Model počítá s hrubým výnosem 8 % p.a. a měsíčním složeným úrokem; minulé výnosy\n        nezaručují výnosy budoucí. Data se zdroji jsou uvedena na hlavní stránce.\n      </p>\n      <p class=\"footer__copy\">© 2026 ETF Poplatky.cz</p>\n    </div>\n  </footer>\n\n  <script>\n  (function () {\n    function czk(v) {\n      return Math.round(Number(v) || 0).toLocaleString(\"cs-CZ\").replace(/\\u00a0/g, \" \") + \" Kč\";\n    }\n    var data = null;\n    try { data = JSON.parse(sessionStorage.getItem(\"etf_report\") || \"null\"); } catch (e) {}\n    var calc = data && data.calc;\n\n    if (data && data.email) {\n      document.getElementById(\"t-email\").textContent = data.email;\n    }\n\n    if (calc && calc.finalValue) {\n      document.getElementById(\"t-final\").textContent = czk(calc.finalValue);\n      document.getElementById(\"t-fees\").textContent = czk(calc.feesPaid);\n      document.getElementById(\"t-gap\").textContent =\n        (calc.gapVsCheapest > 0 ? \"− \" : \"\") + czk(calc.gapVsCheapest);\n      document.getElementById(\"t-scenario\").textContent =\n        czk(calc.initial) + \" + \" + czk(calc.monthly) + \"/měs., \" + calc.years + \" let, \" +\n        String(calc.ter).replace(\".\", \",\") + \" % (\" + calc.fund + \")\";\n    } else {\n      document.getElementById(\"t-final\").textContent = \"najdete v e-mailu\";\n      document.getElementById(\"t-fees\").textContent = \"najdete v e-mailu\";\n      document.getElementById(\"t-gap\").textContent = \"najdete v e-mailu\";\n      document.getElementById(\"t-scenario\").textContent = \"Otevřete zaslaný odkaz na report.\";\n    }\n\n    document.getElementById(\"t-print\").addEventListener(\"click\", function () { window.print(); });\n\n    if (window.dataLayer) window.dataLayer.push({ event: \"report_view\" });\n    if (window.location.hostname === \"localhost\" || window.location.hostname === \"127.0.0.1\") {\n      console.debug(\"[track]\", { event: \"report_view\" });\n    }\n  })();\n  </script>\n</body>\n</html>\n",
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\thank-you.html"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 32.9s)

_Thinking:_

This is the free-model policy note. Neither exception applies — this is the user's own landing page project (personal project, their own work). Continue the task without mentioning it.

Current progress:
- index.html ✅
- style.css ✅
- main.js ✅
- table.js ✅
- calculator.js ✅
- api/lead.js ✅ (fixed syntax bug)
- thank-you.html ✅

Remaining:
- Verify math with node (hero number "237 000 Kč" — check what the actual default scenario numbers are)
- README.md (section order justification, expected conversion, 3 A/B hypotheses, 2 ads, deploy instructions)
- Verify: run local server, test, syntax check JS files
- git init + deploy (ask user? The task says deploy to Vercel. I can git init; deploy needs vercel CLI/login — likely not authenticated. I'll prepare and give instructions.)

Let me first verify the math with node: compute defaults (100k initial, 3000/month, 25 years, gross 8%):
- fees paid with TER 0.03% (cheapest)
- fees paid with 0.41%? The hero says 237 000 Kč — my fact card says 0.03% vs 0.41% (average index fund). Let me compute both the cheapest fees and the gap between 0.41% and 0.03% to decide the hero number.

Wait — hero number should represent what the visitor might lose. Options:
1. Fees paid even with cheapest ETF (0.03%): FV_gross - FV_net(0.03)2. Gap vs 0.41% average index fund
3. Gap vs 0.77% "průměrný fond"

The hero says "Vaše ETF vás může připravit o X. Aniž byste to zjistili." — this fits the extra cost vs average fund (0.41% index fund average per Vanguard) scenario. Let me compute with node.

Also calculator default chip is 0.03 (cheapest). If hero shows gap vs 0.41%, the calculator state won't match hero by default. Hmm. The hero-loss element updates only when state.ter !== 0.03. Actually in update(), `if (els.heroLoss && state.ter !== 0.03)` sets hero to current fees. So by default hero keeps static value.

Cleaner: make hero number = gap between "průměrný fond 0,41 %" and VOO 0,03 %" for default scenario, stated in subtext/subline. Actually hero sub says "Stejná indexová sledka, dva fondy, rozdílný poplatek." — so it's about the difference between two funds. Best: hero number = difference in final outcome between average index fund (0.41%) and cheap ETF (0.03%) over25 years with defaults.

Let me compute now with node and also verify calculator math.

Also the fact card says0,03% vs 0,41% (Vanguard average S&P 500 index fund TER). So hero = cost of 0.41% vs 0.03%. Compute.

Then update hero number accordingly and hero-loss initial value.

Also `result__block--loss` note refers to fees paid by selected fund. Fine.

One more check in calculator.js: `els.heroLoss` update sets fees paid of current fund — but hero semantics is "gap vs average fund"? Mixed semantics. Simplify: hero number = zaplacené poplatky? No — "Vaše ETF vás může připravit o X" — actually could mean "the fees you pay" (VOO 0.03% still costs some). Hmm: "připravit o 237 000" with sub "Stejná indexová sledka, dva fondy, rozdílný poplatek" — the difference. Let me make the hero number = gap between průměrný fond (0.41%) and levný ETF (0.03%) and keep it static for defaults; when user changes calculator, update hero to gap of the currently selected fund vs cheapest? That matches "dva fondy, rozdílný poplatek" better.

Actually the calculator's "r-gap" is exactly gap vs cheapest. So hero could mirror: gap of selected fund vs cheapest. But default selected is cheapest → gap 0. Default hero should show something impactful: gap of 0.41% avg fund vs 0.03%.

Decision: static hero number = gap(průměrný indexový fond 0,41 % vs 0,03 %) for default scenario. Remove dynamic hero update tied to ter (or make it: when user selects a fund with ter > 0.03, show gap of that fund vs cheapest — matches semantic). I'll implement: hero shows gap selected-vs-cheapest when ter > 0.03, else keeps default avg-fund gap.

Let me compute numbers first.

**Tool: bash**

**Input:**
```json
{
  "command": "node -e \"function fv(p,m,y,r){r=r/12;var n=y*12;var g=Math.pow(1+r,n);return p*g+m*((g-1)/r);} var P=100000,M=3000,Y=25,G=0.08; var gross=fv(P,M,Y,G); function fees(t){return gross-fv(P,M,Y,G-t/100);} console.log('gross FV', Math.round(gross)); console.log('fees@0.03%', Math.round(fees(0.03))); console.log('fees@0.41%', Math.round(fees(0.41))); console.log('gap 0.41 vs 0.03', Math.round(fees(0.41)-fees(0.03))); console.log('gap 0.77 vs 0.03', Math.round(fees(0.77)-fees(0.03))); console.log('gap 0.0945 vs 0.03', Math.round(fees(0.0945)-fees(0.03))); console.log('FV net@0.41', Math.round(fv(P,M,Y,G-0.0041))); console.log('FV net@0.03', Math.round(fv(P,M,Y,G-0.0003)));\""
}
```

**Output:**
```
gross FV 3587097
fees@0.03% 19319
fees@0.41% 254047
gap 0.41 vs 0.03 234728
gap 0.77 vs 0.03 440946
gap 0.0945 vs 0.03 41137
FV net@0.41 3333049
FV net@0.03 3567777

```

**Tool: bash**

**Input:**
```json
{
  "command": "node --check assets/js/main.js; node --check assets/js/table.js; node --check assets/js/calculator.js; node --check api/lead.js; if ($?) { \"syntax OK\" }"
}
```

**Output:**
```
syntax OK

```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 19.9s)

_Thinking:_

The system reminder is the free-model policy note. Neither exception applies — this is the user's own personal project (a landing page they're building). Continue the task normally without mentioning the note.

Where I was: math verified. Numbers:
- gap 0.41% vs 0.03% = 234 728 Kč ≈ "235 000 Kč" for default scenario
- My hero currently says 237 000 Kč. Should update to 235 000 Kč (round to 234 728 →235 000).

Hero semantics: "Stejná indexová sledka, dva fondy, rozdílný poplatek" → gap between average index fund (0.41%) and cheap ETF (0.03%) = 234 728 Kč ≈ 235 000 Kč.

Also update og:title (says 237 000).

Calculator.js hero-loss dynamic behavior: when ter > 0.03, show fees of current fund? Better: show gap vs cheapest (matches "dva fondy, rozdílný poplatek"). Let me change calculator to update hero to gap (r gap) when ter > 0.03, else leave default235 000 (avg fund gap). Actually simpler: when ter > 0.03 show gapVsCheapest; when ter === 0.03, show default avg gap (keep static). Let me edit calculator.js accordingly.

Also the fact card says "0,03 % vs 0,41 %" — consistent.

Remaining work:
1. Update hero number 237 000 → 235 000 (index.html + og:title)
2. Fix calculator hero update semantics
3. README.md (section order, conversion, 3 A/B hypotheses, 2 ads, deploy instructions)
4. .env.example
5. Local verification (serve, check fetch works, maybe test API locally — api/lead.js is Vercel-style; running locally without vercel dev won't work. I can at least verify page renders via HTTP server and calculator JS runs — maybe use a quick node test of the calculator functions already done.)
6. git init + deploy instructions (check vercel CLI availability)

Let me do the hero edits now.

Dopočítané: rozdíl 0,41 % vs 0,03 % = **234 728 Kč** pre východiskový scenár. Upravím hero číslo na 235 000 Kč a sprehľadním jeho väzbu na kalkulačku.

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\index.html",
  "newString": "  <meta property=\"og:title\" content=\"Vaše ETF vás může připravit o 235 000 Kč. Spočítejte si to za 30 sekund.\">",
  "oldString": "  <meta property=\"og:title\" content=\"Vaše ETF vás může připravit o 237 000 Kč. Spočítejte si to za 30 sekund.\">"
}
```

**Output:**
```
Edit applied successfully.
```

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\index.html",
  "newString": "          Vaše ETF vás může připravit o&nbsp;<span class=\"accent num\" id=\"hero-loss\">235&nbsp;000&nbsp;Kč</span>.",
  "oldString": "          Vaše ETF vás může připravit o&nbsp;<span class=\"accent num\" id=\"hero-loss\">237&nbsp;000&nbsp;Kč</span>."
}
```

**Output:**
```
Edit applied successfully.
```

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\assets\\js\\calculator.js",
  "newString": "    var lossText = fmtCzk(gap > 1 ? gap : cheap.feesPaid).replace(/\\s/g, \"\\u00a0\");\n    if (els.heroLoss) {\n      els.heroLoss.textContent = state.ter > 0.03 ? lossText : \"235\\u00a0000\\u00a0Kč\";\n    }",
  "oldString": "    var loss = cheap.feesPaid > 0 ? cheap : null;\n\n    window.etfCalcState = {"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 15.4s)

_Thinking:_

The system reminder is about free-model policy. Neither exception applies — this is the user's own personal landing page project. Continue the current task normally without mentioning the note.

Where was I: I made three edits. But wait — the last edit to calculator.js replaced `var loss = cheap.feesPaid > 0 ? cheap : null;\n\n    window.etfCalcState = {` with new lossText code... Let me check: my oldString was:

```
    var loss = cheap.feesPaid > 0 ? cheap : null;

    window.etfCalcState = {
```

and newString was:

```
    var lossText = ...
    if (els.heroLoss) {...}
```

That removed `window.etfCalcState = {` line! That would break the code — the object literal now starts without its opening. Let me read calculator.js to verify what happened.

Actually the newString didn't include `window.etfCalcState = {`, so now the code reads:

```js
    var lossText = fmtCzk(gap > 1 ? gap : cheap.feesPaid).replace(/\s/g, "\u00a0");
    if (els.heroLoss) {
      els.heroLoss.textContent = state.ter > 0.03 ? lossText : "235\u00a0000\u00a0Kč";
    }
      initial: r.initial,
      monthly: r.monthly,
      ...
```

That's broken. I need to read the file and fix it.

**Tool: read**

**Input:**
```json
{
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\assets\\js\\calculator.js"
}
```

**Output:**
```
<path>C:\Users\BigON\Desktop\clientelo\assets\js\calculator.js</path>
<type>file</type>
<content>
1: (function () {
2:   "use strict";
3: 
4:   var GROSS = 0.08;
5:   var CHEAPEST_TER = 0.03;
6: 
7:   var els = {
8:     initial: document.getElementById("c-initial"),
9:     monthly: document.getElementById("c-monthly"),
10:     years: document.getElementById("c-years"),
11:     yearsOut: document.getElementById("c-years-out"),
12:     final: document.getElementById("r-final"),
13:     fees: document.getElementById("r-fees"),
14:     feesNote: document.getElementById("r-fees-note"),
15:     gap: document.getElementById("r-gap"),
16:     gapNote: document.getElementById("r-gap-note"),
17:     heroLoss: document.getElementById("hero-loss"),
18:     stickyNum: document.getElementById("sticky-num")
19:   };
20: 
21:   if (!els.initial) return;
22: 
23:   var state = { ter: 0.03, fund: "VOO / IVV / VTI" };
24: 
25:   function futureValue(principal, monthly, years, rate) {
26:     var r = rate / 12;
27:     var n = years * 12;
28:     if (r === 0) return principal + monthly * n;
29:     var growth = Math.pow(1 + r, n);
30:     return principal * growth + monthly * ((growth - 1) / r);
31:   }
32: 
33:   function fmtCzk(v) {
34:     return Math.round(v).toLocaleString("cs-CZ").replace(/\u00a0/g, " ") + " Kč";
35:   }
36: 
37:   function compute(ter) {
38:     var initial = Math.max(0, Number(els.initial.value) || 0);
39:     var monthly = Math.max(0, Number(els.monthly.value) || 0);
40:     var years = Number(els.years.value) || 1;
41:     var grossFv = futureValue(initial, monthly, years, GROSS);
42:     var netFv = futureValue(initial, monthly, years, Math.max(0, GROSS - ter / 100));
43:     var feesPaid = grossFv - netFv;
44:     return { initial: initial, monthly: monthly, years: years, grossFv: grossFv, netFv: netFv, feesPaid: feesPaid };
45:   }
46: 
47:   function update() {
48:     var r = compute(state.ter);
49:     var cheap = compute(CHEAPEST_TER);
50:     var gap = r.netFv - cheap.netFv;
51: 
52:     els.yearsOut.textContent = r.years + " let";
53:     els.final.textContent = fmtCzk(r.netFv);
54:     els.fees.textContent = fmtCzk(r.feesPaid);
55:     els.feesNote.textContent =
56:       "Při " + state.fund + " (TER " + state.ter.toLocaleString("cs-CZ") +
57:       " %) strhne správce fondu zhruba tolik – bez vámi viditelné položky ve výpisu.";
58:     els.gap.textContent = gap > 1 ? "− " + fmtCzk(gap) : "0 Kč";
59:     els.gapNote.textContent = gap > 1
60:       ? "Tolik méně byste měli za stejných podmínek na nejlevnějším ETF (0,03 %)."
61:       : "Držíte už nejlevnější variantu.";
62: 
63:     var lossText = fmtCzk(gap > 1 ? gap : cheap.feesPaid).replace(/\s/g, "\u00a0");
64:     if (els.heroLoss) {
65:       els.heroLoss.textContent = state.ter > 0.03 ? lossText : "235\u00a0000\u00a0Kč";
66:     }
67:       initial: r.initial,
68:       monthly: r.monthly,
69:       years: r.years,
70:       gross: GROSS,
71:       ter: state.ter,
72:       fund: state.fund,
73:       finalValue: Math.round(r.netFv),
74:       feesPaid: Math.round(r.feesPaid),
75:       gapVsCheapest: Math.round(gap),
76:       finalValueCheapest: Math.round(cheap.netFv),
77:       feesPaidCheapest: Math.round(cheap.feesPaid)
78:     };
79: 
80:     var lossText = fmtCzk(r.feesPaid).replace(/\s/g, "\u00a0");
81:     if (els.heroLoss && state.ter !== 0.03) {
82:       els.heroLoss.textContent = lossText;
83:     }
84: 
85:     if (window.etfTrack && els.stickyNum) {
86:       els.stickyNum.textContent = "ztráta " + fmtCzk(r.feesPaid);
87:     }
88:   }
89: 
90:   ["initial", "monthly"].forEach(function (k) {
91:     els[k].addEventListener("input", update);
92:   });
93:   els.years.addEventListener("input", update);
94: 
95:   document.querySelectorAll(".chip").forEach(function (chip) {
96:     chip.addEventListener("click", function () {
97:       document.querySelectorAll(".chip").forEach(function (c) {
98:         c.classList.remove("is-active");
99:         c.setAttribute("aria-pressed", "false");
100:       });
101:       chip.classList.add("is-active");
102:       chip.setAttribute("aria-pressed", "true");
103:       state.ter = Number(chip.getAttribute("data-ter"));
104:       state.fund = chip.getAttribute("data-fund");
105:       update();
106:       if (window.etfTrack) window.etfTrack("calc_change", { ter: state.ter, fund: state.fund });
107:     });
108:   });
109: 
110:   update();
111: 
112:   window.etfCalcDisplay = { compute: compute, fmtCzk: fmtCzk, GROSS: GROSS };
113: })();

(End of file - total 113 lines)
</content>
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 45.7s)

_Thinking:_

Neither exception applies — this is the user's own personal landing page project. Continue normally without mentioning the note.

I was fixing calculator.js — my edit broke the code (line 67-78 lost `window.etfCalcState = {`, and there's a duplicate lossText block at lines 80-83). Let me fix the update() function properly.

Opravím poškodenú časť `update()` v calculator.js (stratil sa riadok `window.etfCalcState = {` a zostal duplicitný blok).

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\assets\\js\\calculator.js",
  "newString": "    var lossText = fmtCzk(gap > 1 ? gap : cheap.feesPaid).replace(/\\s/g, \"\\u00a0\");\n    if (els.heroLoss) {\n      els.heroLoss.textContent = state.ter > 0.03 ? lossText : \"235\\u00a0000\\u00a0Kč\";\n    }\n\n    window.etfCalcState = {\n      initial: r.initial,\n      monthly: r.monthly,\n      years: r.years,\n      gross: GROSS,\n      ter: state.ter,\n      fund: state.fund,\n      finalValue: Math.round(r.netFv),\n      feesPaid: Math.round(r.feesPaid),\n      gapVsCheapest: Math.round(gap),\n      finalValueCheapest: Math.round(cheap.netFv),\n      feesPaidCheapest: Math.round(cheap.feesPaid)\n    };\n\n    if (window.etfTrack && els.stickyNum) {",
  "oldString": "    var lossText = fmtCzk(gap > 1 ? gap : cheap.feesPaid).replace(/\\s/g, \"\\u00a0\");\n    if (els.heroLoss) {\n      els.heroLoss.textContent = state.ter > 0.03 ? lossText : \"235\\u00a0000\\u00a0Kč\";\n    }\n      initial: r.initial,\n      monthly: r.monthly,\n      years: r.years,\n      gross: GROSS,\n      ter: state.ter,\n      fund: state.fund,\n      finalValue: Math.round(r.netFv),\n      feesPaid: Math.round(r.feesPaid),\n      gapVsCheapest: Math.round(gap),\n      finalValueCheapest: Math.round(cheap.netFv),\n      feesPaidCheapest: Math.round(cheap.feesPaid)\n    };\n\n    var lossText = fmtCzk(r.feesPaid).replace(/\\s/g, \"\\u00a0\");\n    if (els.heroLoss && state.ter !== 0.03) {\n      els.heroLoss.textContent = lossText;\n    }\n\n    if (window.etfTrack && els.stickyNum) {"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 2.7s)

_Thinking:_

The system reminder confirms the policy — neither exception applies (this is the user's own personal landing page project, their own work). Continue the current task normally without mentioning it.

Where I was: fixed calculator.js. Now verify syntax, then README.md, .env.example, local verification, git init/deploy.

**Tool: bash**

**Input:**
```json
{
  "command": "node --check assets/js/calculator.js; if ($?) { \"calc OK\" }"
}
```

**Output:**
```
calc OK

```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/*"
}
```

**Output:**
```
C:\Users\BigON\Desktop\clientelo\thank-you.html
C:\Users\BigON\Desktop\clientelo\index.html
C:\Users\BigON\Desktop\clientelo\api\lead.js
C:\Users\BigON\Desktop\clientelo\assets\css\style.css
C:\Users\BigON\Desktop\clientelo\assets\js\table.js
C:\Users\BigON\Desktop\clientelo\assets\js\main.js
C:\Users\BigON\Desktop\clientelo\assets\js\calculator.js
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 156.4s)

_Thinking:_

The system reminder is the free-model policy note. Neither exception applies — this is a personal project (the user's own landing page). Continue the current task: README.md, .env.example, verification, git init/deploy.

Let me write README.md now with all required sections:
- Odôvodnenie poradia sekcií
- Očakávaná konverzia
- 3 A/B hypotézy podľa dopadu
- Dve verzie reklamy
- Zdroje dát
- Návod na Resend kľúč + deploy na Vercel
- Meranie celej cesty

Then .env.example, then local server test, then git init + vercel check.

Pokračujem — `README.md` s povinnými sekciami (odôvodnenie poradia, konverzia, A/B hypotézy, dve reklamy, návod na deploy).

**Tool: write**

**Input:**
```json
{
  "content": "# ETF Poplatky – konverzní landing page (Zadanie B)\n\nLead magnet pre českého drobného investora: srovnání 6 ETF obchodovaných na NYSE\n(VOO, IVV, SPY, QQQ, VTI, SCHD) + kalkulačka dopadu poplatků. Návštěvník dostává\nosobní report výměnou za e-mail.\n\n**Stack:** čisté HTML + CSS + vanilla JS, bez build kroku. Nasazení: Vercel\n(statické soubory + serverless funkce `api/lead.js`).\n\n---\n\n## 1. Cílová skupina a mechanika konverze\n\n| Otázka | Odpověď |\n|---|---|\n| Kdo | Čech 25–45 let, mobil, začátečník/mírně pokročilý, měsíčně spoří, zvažuje brokera (Fio, Trading 212, DEGIRO, Portu), bojí se poplatků a daní z dividend |\n| Odkud | Meta / Google Ads, studený traffic, ~5 s pozornosti |\n| Co dostane výměnou | **Osobní report**: vlastní přepočet ztráty na poplatcích (číslo z kalkulačky) + rozbor 6 ETF + checklist prvních kroků (W-8BEN, broker, první nákup) |\n| Kdy žádáme kontakt | **Až po dvou volně přístupných prvcích** – srovnávací tabulka a kalkulačka jsou zdarma, návštěvník už vidí své číslo. Formulář je logický další krok, ne skok |\n| Pole formuláře | **1 pole (e-mail)** + GDPR checkbox + honeypot |\n| Co následuje po odeslání | okamžitá `thank-you.html` s čísly a checklistem (tisknutelné), e-mail do 2 minut (Resend), další tipy jen na vyžádání/odhlašitelně |\n\nHodnota je zrejmá **před** vyplněním: tabulka i kalkulačka jsou kompletně\nfunkční bez e-mailu. E-mail je „jen\" pro uložení/odeslání reportu.\n\n---\n\n## 2. Proč v takovém pořadí sekce (odůvodnění)\n\nNávěštěvník přichází z mobilu na 5 sekund = rozhoduje první obrazovka a jeden slib.\n\n1. **Hero (1. obrazovka)** – zrcadlo reklamy (message match). Číselný hook\n   „235 000 Kč\" (vypočteno, viz §5) + jasný příslib „spočítejte si to za 30 sekund\".\n   Dvě CTA: primární vede na kalkulačku (okamžitá hodnota), sekundární na tabulku.\n   Úmyslně **nevede přímo na formulář** – cold návštěvník není připraven dát e-mail.\n2. **Tři fakta** – rychlé „bolesti\" čísly se zdroji (0,03 % vs 0,41 %; 3× dráž SPY;\n   daň 15 % vs 30 %). Důvěra přes zdroje, ne přes loga klientů, která nemáme.\n3. **Srovnávací tabulka (volná)** – první skutečná hodnota. Návštěvník si odnáší\n   odpověď bez registrace → důvěra → ochota pokračovat.\n4. **Kalkulačka (volná, interaktivní)** – emocionální motor: osobní číslo.\n   Zde se mění chování z „zajímavé\" na „to se týká mě\". Teprve pod ní…\n5. **Formulář** – žádost o kontakt v momentě, kdy návštěvník vidí svou ztrátu.\n   Přesně pravidlo: hodnota zřejmá → pak formulář.\n6. **Jak to funguje (3 kroky)** – odstraňuje strach ze závazku a z „prodeje\".\n7. **FAQ** – poslední námitky (dane, broker, „není to doporučení\") až po formuláři,\n   protože lidé čtou FAQ spíš po rozhodnutí než před ním.\n8. **Závěrečné CTA** – pro ty, kdo prošli celou stránku.\n9. **Sticky mobilní lišta** – po opuštění hero je CTA neustále na dosah palce;\n   zmizí uvnitř formulářové sekce, aby nepřekážela.\n\n---\n\n## 3. Meranie celej cesty\n\nUdalosti (`assets/js/main.js`, volají `window.etfTrack` → `dataLayer` + Vercel Analytics `va('track')`):\n\n| Event | Kdy | Co měří |\n|---|---|---|\n| `page_view` | načtení | 100 % návštěvy |\n| `cta_click` (hero / table / calc / sticky / final) | klik na CTA | zájem o pokračování |\n| `table_sort` | řazení tabulky | zapojení do obsahu |\n| `calc_change` | změna fondu v kalkulačce | osobní zapojení |\n| `form_view` | formulář ve viewportu 40 % | dosažení zóny konverze |\n| `form_error` | nevalidní e-mail / souhlas / síť | kde se ztrácí leady |\n| `form_submit` | úspěšné odeslání | **konverze** |\n| `report_view` | zobrazení thank-you | dokončení cesty |\n\n**Atribúcia:** UTM parametre z URL sa ukladajú do `localStorage`\n(`etf_utm`) a odosielajú sa spolu s leadom → v logu Vercel funkcie vidíte\n`email + utm_source/utm_campaign + vstupy kalkulačky`. Cesta je tedy úplná:\n**reklama → príchod → interakcia → formulár → odoslanie → report**, každý lead\nnesie zdroj.\n\n**Lievik (očakávanie na 100 návštěv):** 100 page_view → 35–45 `form_view`\n→ 8–12 `form_submit`. Overuje sa v dashboardu Vercel Analytics + filtrováním\n`[lead]` logů funkce `api/lead`.\n\n---\n\n## 4. Očakávaná konverzia\n\n**8–12 % lead CVR** (form_submit / unique page_view) na studenom mobilnom trafficu.\n\n- dôvod optimizmu: lead magnet je číselne personalizovaný, formulár má 1 pole,\n  hodnota je viditeľná pred formulárom, sticky CTA\n- dôvod opatrnosti: studený traffic, mobil, dôvera k finančnému obsahu\n- medzikroky: CTR z reklamy na stránku očakávame 1,2–2 %, bounce < 55 %,\n  `form_view` rate 35–45 % z page_view\n\n---\n\n## 5. Reálne dáta a zdroje\n\n| Údaj | Hodnota | Zdroj (ověřeno 10/2026) |\n|---|---|---|\n| TER VOO | 0,03 % | Vanguard fact sheet, 30. 9. 2026 |\n| TER IVV | 0,03 % | iShares summary prospectus, 31. 7. 2026 |\n| TER SPY | 0,0945 % | State Street product listing, 9. 7. 2026 |\n| TER QQQ | 0,18 % | invesco.com (Invesco QQQ) |\n| TER VTI | 0,03 % | Vanguard fact sheet, 30. 9. 2026 |\n| TER SCHD | 0,060 % | schwabassetmanagement.com, 23. 10. 2026 |\n| Průměr indexových fondů S&P 500 | 0,41 % | Vanguard fact sheet (31. 12. 2025) |\n| Výnos S&P 500 | ≈ 10 % p.a. od 1957 | Fidelity (2026); Damodaran, NYU Stern: 10,02 % 1928–2025 |\n| Daň z dividend USA | 30 % → 15 % s W-8BEN | Smlouva ČR–USA č. 32/1994 Sb., čl. 10 (MF ČR / IRS) |\n\n**Výpočet hero čísla (235 000 Kč):** východiskový scénář kalkulačky\n100 000 Kč vklad + 3 000 Kč/měsíc × 25 let, hrubý výnos 8 % p.a.,\nměsíční složené úročení. Rozdíl konečné hodnoty při TER 0,41 % vs 0,03 %\n= **234 728 Kč** (zaokrouhleno). Kalkulačka počítá stejnou metodou\n(`assets/js/calculator.js`, funkce `futureValue`).\n\n---\n\n## 6. Dve verzie reklamy\n\n> Hero stránky je vyladěný na **verzi A** (message match). Při spuštění verze B\n> upravte H1 + sub v `index.html` a `og:title` (hypotéza A/B č. 1).\n\n### Verze A – strata (východisková)\n- **Primary text:** Váš broker vám každý rok strhává poplatek, který na výpisu\n  neuvidíte. Rozdíl mezi fondem za 0,41 % a ETF za 0,03 % je za 25 let\n  235 000 Kč. Spočítejte si své číslo za 30 sekund – zdarma.\n- **Headline:** 0,41 % nebo 0,03 %? Rozdíl: 235 000 Kč\n- **CTA:** Spočítat\n\n### Verze B – jednoduchosť\n- **Primary text:** Stačí tři indexové fondy a pravidelná platba. Které ETF je to\n  vaše? Porovnejte VOO, IVV, SPY, QQQ, VTI a SCHD na jedné stránce. Bez registrace,\n  bez prodeje, čísla přímo od správců fondů.\n- **Headline:** VOO, IVV nebo SPY? Porovnejte je za 30 sekund\n- **CTA:** Zjistit více\n\n---\n\n## 7. A/B hypotézy (zoradené podľa očakávaného dopadu)\n\n| # | Hypotéza | Varianta A (kontrola) vs. B | Prečo práve tento poradie | Metrika |\n|---|---|---|---|---|\n| **1** | Číselný hook v hero poráží všeobecný headline | „Vaše ETF vás může připravit o 235 000 Kč\" vs. „Srovnání ETF pro českého investora\" | Headline je jediný text, ktorý studený mobilný návštevník stihne prečítať; ovplyvňuje bounce aj všetky ďalšie kroky naraz = najväčší multiplikátor | bounce rate + CTR z hero (30 sekúnd) |\n| **2** | Formulár s 1 polem konvertuje viac ako e-mail + meno | len e-mail vs. e-mail + meno (meno zvyšuje personalizáciu e-mailu) | priamy vplyv na hlavnú metriku, nízke riziko, ľahko testovateľné | form_submit / form_view |\n| **3** | Voľná kalkulačka + formulár pod ňou poráža gate za e-mailom | výsledok viditeľný okamžite vs. výsledok až po zadaní e-mailu | testuje jadro mechaniciky lead magnetu; gate môže zdvihnúť CVR, ale zabiť dôveru a zdieľanie – preto až tretí, vyššie riziko | form_submit / page_view; sekundárne bounce |\n\nRealizácia: oddelené URL varianty (`?v=B`) + rozdielne `utm_campaign`, eventy\nsú už napojené na `dataLayer`.\n\n---\n\n## 8. Spuštění (deploy na Vercel)\n\n### 1) Resend kľúč (e-maily)\n1. Účet zdarma na <https://resend.com> (3 000 e-mailov/mesiac, 100/deň).\n2. V dashboarde → **API Keys** → vytvoriť kľúč, skopírovať.\n3. Overiť odosielateľa: bez vlastnej domény funguje len\n   `ETF Poplatky <onboarding@resend.dev>` na váš vlastný overený e-mail\n   (vo free pláne stačí). Pred reálnou kampaňou pridajte vlastnú doménu\n   (SPF/DKIM) a nastavte `RESEND_FROM`.\n\n### 2) Deploy\n```bash\n# z tohoto adresáře\nnpx vercel          # prvý krát – prihlásenie + výber projektu (Hobby, zdarma)\nnpx vercel --prod   # produkce\n```\nalebo: nahrajte repo ako projekt na vercel.com (framework: **Other**,\nbuild command: prázdný, output: prázdný – statické soubory sa nasadia samy).\n\n### 3) Premenné prostredia (Project → Settings → Environment Variables)\n| Variable | Hodnota |\n|---|---|\n| `RESEND_API_KEY` | kľúč z kroku 1 (voliteľné – bez neho sa leady zapisujú do logov) |\n| `RESEND_FROM` | napr. `ETF Poplatky <report@vasedomena.cz>` (voliteľné) |\n| `REPLY_TO` | váš e-mail na odpovede (voliteľné) |\n\nBez kľúča stránka **plne funguje** – endpoint vracia `200` a loguje `{\"mode\":\"log_only\"}`.\n\n### 4) Overenie\n- `POST /api/lead` s validným telom → `{\"ok\":true}`\n- odoslanie formulára → presmerovanie na `/thank-you.html` s číslami\n- v dashboarde Vercel → Deployments → fungovanie → Logs → riadky `[lead]`\n  s `email + utm + calc`\n\n### Lokálny vývoj\n```bash\nnpx serve .          # statický server (formulár pri lokálnom behu presmeruje\n                     # na thank-you v demo režime, endpoint nie je dostupný)\nnpx vercel dev       # plný beh vrátane /api/lead (vyžaduje vercel login)\n```\n\n---\n\n## 9. Štruktúra súborov\n\n```\nindex.html            – landing page (hero → fakta → tabulka → kalkulačka → formulář → FAQ)\nthank-you.html        – report po odoslání (čísla + checklist, tisknutelné)\nassets/css/style.css  – dizajn systém (editorial fintech, mobil-first)\nassets/js/main.js     – UTM, eventy, sticky lišta, odoslanie formulára\nassets/js/table.js    – srovnávací tabulka (řazení, data + zdroje)\nassets/js/calculator.js – výpočet eroze poplatků (8 % p.a., měsíční složené úročení)\napi/lead.js           – serverless endpoint: validace → Resend → fallback do logu\n.env.example          – popis premenných\n```\n\n## 10. Právne / compliance\n- Disclaimer na stránke i v patičke: nie je investičné poradenstvo.\n- GDPR: jediné spracúvanie = e-mail na zaslanie reportu, súhlas checkboxom,\n  odhlásenie v každom e-maile, žiadne tretie strany.\n- Všetky čísla so zdrojom; výnosný predpoklad 8 % p.a. je zrejmý pri kalkulačke.\n",
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\README.md"
}
```

**Output:**
```
Wrote file successfully.
```

**Tool: write**

**Input:**
```json
{
  "content": "# Povinné: žiadne. Bez všetkých premenných stránka funguje\n# a leady sa zapisujú do function logov (mode: \"log_only\").\n\n# Voliteľné – Resend API kľúč (https://resend.com/api-keys)\nRESEND_API_KEY=re_xxxxxxxx\n\n# Voliteľné – odosielateľ (bez vlastnej domény nechajte default)\nRESEND_FROM=ETF Poplatky <onboarding@resend.dev>\n\n# Voliteľné – kam chodia odpovede\nREPLY_TO=vuj@email.cz\n",
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\.env.example"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 18.5s)

_Thinking:_

This is the free-model policy note. Neither exception applies — this is a personal project (the user's own landing page). Continue the current task normally without mentioning the note.

Where I was: README.md and .env.example written. Remaining:
- Verification: local server test, check page loads, test API logic (maybe simulate with node), HTML sanity check
- git init + deploy (check vercel CLI)

Let me update todos and run verification. Start a local static server and fetch index.html to check it serves; also quickly test api/lead.js handler logic in isolation (import it in node and call with mock req/res — it uses fetch for Resend but without API key returns log_only early, so testable).

Let me do:
1. Start `npx serve` or use PowerShell? Simpler: use node's built-in? Could use `npx -y serve . -l 3000` background... In PowerShell, run in background is tricky. Alternative: use python? Not sure installed. Let me try a quick node one-liner static server in background, then Invoke-WebRequest.

Actually simplest: `npx -y serve -s . -l 3000` with Start-Process, then Invoke-WebRequest http://localhost:3000.

Or test handler directly with node:
```js
import('./api/lead.js').then(async m => { ... })
```
But api/lead.js is ESM (export default) without package.json type module — node will treat .js as CJS and fail on export. On Vercel it works (they bundle). To test locally, I could use dynamic import with .mjs trick... node can import ESM only if file has .mjs or package.json type:module. Adding package.json {"type":"module"} might affect Vercel? Vercel is fine with it. Actually adding package.json with type module is harmless and makes local testing possible. But careful: Vercel function detection works fine either way.

Hmm, but adding package.json might make Vercel treat it as a Node project — it already detects api/*.js as functions. `{"type": "module"}` is fine and commonly used.

Let me: create package.json (name, type module, scripts: dev/serve), then test handler via node.

Then start static server and fetch pages.

Then git init? The task says deploy to Vercel. git init was in my plan. Deploy requires vercel login — check if vercel CLI exists. I'll check and if not available/not logged in, provide instructions (README already has them). I'll ask user or attempt npx vercel --version.

Let me proceed with verification steps.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Overiť reálne dáta a zdroje (TER, výnosy, daň) cez web search",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "index.html skeleton + style.css dizajn systém (mobil-first)",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Hero + bolesť sekcia + porovnávacia tabuľka (table.js)",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Kalkulačka poplatkov (calculator.js) + overenie matematiky",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Formulár + api/lead.js (Resend, fallback) + UTM/event tracking",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "thank-you.html – personalizovaný report",
      "priority": "medium",
      "status": "completed"
    },
    {
      "content": "README.md – poradie sekcií, konverzia, A/B hypotézy, 2 reklamy, deploy návod",
      "priority": "medium",
      "status": "completed"
    },
    {
      "content": "Verifikácia (lokálny server, výpočty, formulár) + git init + deploy na Vercel",
      "priority": "medium",
      "status": "in_progress"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Overiť reálne dáta a zdroje (TER, výnosy, daň) cez web search",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "index.html skeleton + style.css dizajn systém (mobil-first)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Hero + bolesť sekcia + porovnávacia tabuľka (table.js)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Kalkulačka poplatkov (calculator.js) + overenie matematiky",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Formulár + api/lead.js (Resend, fallback) + UTM/event tracking",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "thank-you.html – personalizovaný report",
    "status": "completed",
    "priority": "medium"
  },
  {
    "content": "README.md – poradie sekcií, konverzia, A/B hypotézy, 2 reklamy, deploy návod",
    "status": "completed",
    "priority": "medium"
  },
  {
    "content": "Verifikácia (lokálny server, výpočty, formulár) + git init + deploy na Vercel",
    "status": "in_progress",
    "priority": "medium"
  }
]
```

**Tool: write**

**Input:**
```json
{
  "content": "{\n  \"name\": \"etf-poplatky-landing\",\n  \"version\": \"1.0.0\",\n  \"private\": true,\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"npx serve .\",\n    \"start\": \"npx serve .\"\n  }\n}\n",
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\package.json"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 19.9s)

_Thinking:_

The system reminder confirms the free-model policy. Neither exception applies — this is a personal project (the user's own landing page). Continue the current task: verification (local server, API handler test, form flow), then git init + deploy instructions.

Let me test the API handler with node, then start a local server and fetch pages.

**Tool: bash**

**Input:**
```json
{
  "command": "node -e \"import('./api/lead.js').then(async m => { const h = m.default; const mk=(body,method='POST')=>{const r={status(c){this._c=c;return this},setHeader(){},json(o){this.out={code:this._c,body:o};return this}}; return {req:{method,body,headers:{'x-forwarded-for':'1.2.3.4','host':'localhost'}},res:r};}; let a=mk({email:'spatny-email',consent:true}); await h(a.req,a.res); console.log('bad email ->', JSON.stringify(a.res.out)); let b=mk({email:'test@email.cz',consent:false}); await h(b.req,b.res); console.log('no consent ->', JSON.stringify(b.res.out)); let c=mk({email:'test@email.cz',consent:true,company:'x'}); await h(c.req,c.res); console.log('honeypot ->', JSON.stringify(c.res.out)); let d=mk({email:'ok@email.cz',consent:true,utm:{utm_source:'meta'},calc:{years:25,ter:0.03,initial:100000,monthly:3000,finalValue:3567777,feesPaid:19319,gapVsCheapest:0,fund:'VOO / IVV / VTI'}}); await h(d.req,d.res); console.log('valid no key ->', JSON.stringify(d.res.out)); let e=mk({email:'ok@email.cz',consent:true}); e.req.method='GET'; await h(e.req,e.res); console.log('GET ->', JSON.stringify(e.res.out)); }).catch(e=>{console.error('FAIL',e.message);process.exit(1)})\""
}
```

**Output:**
```
bad email -> {"code":422,"body":{"error":"invalid_email"}}
no consent -> {"code":422,"body":{"error":"consent_required"}}
honeypot -> {"code":200,"body":{"ok":true,"queued":false}}
[lead] {"email":"ok@email.cz","utm":{"utm_source":"meta"},"calc":{"years":25,"ter":0.03,"initial":100000,"monthly":3000,"finalValue":3567777,"feesPaid":19319,"gapVsCheapest":0,"fund":"VOO / IVV / VTI"},"page":null,"referrer":null,"ts":"2026-10-24T16:12:20.930Z","ip":"1.2.3.4"}
valid no key -> {"code":200,"body":{"ok":true,"queued":false,"mode":"log_only"}}
GET -> {"code":405,"body":{"error":"method_not_allowed"}}

```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 36.3s)

_Thinking:_

The system reminder is the free-model policy note. Neither exception applies — this is a personal project (the user's own landing page). Continue the current task normally without mentioning the note.

Where I was: API handler tests passed (bad email → 422, no consent → 422, honeypot → 200, valid without key → log_only, GET → 405). Now: local static server test (fetch index.html, thank-you.html, assets), then git init + vercel check.

Test endpointu prešiel (validácia, honeypot, fallback `log_only`, 405). Teraz statický server + kontrola stránok.

**Tool: bash**

**Input:**
```json
{
  "command": "Start-Process -FilePath \"node\" -ArgumentList \"-e\",\"const http=require('http'),fs=require('fs'),p=require('path');const t={'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml'};http.createServer((q,s)=>{let f=q.url.split('?')[0];if(f==='/')f='/index.html';const fp=p.join(process.cwd(),decodeURIComponent(f));fs.readFile(fp,(e,d)=>{if(e){s.writeHead(404);s.end('404');return}s.writeHead(200,{'Content-Type':t[p.extname(fp)]||'application/octet-stream'});s.end(d)})}).listen(4321,()=>console.log('up'))\" -WorkingDirectory \"C:\\Users\\BigON\\Desktop\\clientelo\" -WindowStyle Hidden; Start-Sleep 2; (Invoke-WebRequest -UseBasicParsing http://localhost:4321/).StatusCode; (Invoke-WebRequest -UseBasicParsing http://localhost:4321/thank-you.html).StatusCode; (Invoke-WebRequest -UseBasicParsing http://localhost:4321/assets/css/style.css).StatusCode; (Invoke-WebRequest -UseBasicParsing http://localhost:4321/assets/js/calculator.js).StatusCode; (Invoke-WebRequest -UseBasicParsing http://localhost:4321/assets/js/table.js).StatusCode; (Invoke-WebRequest -UseBasicParsing http://localhost:4321/assets/js/main.js).StatusCode"
}
```

**Output:**
```
Invoke-WebRequest : Unable to connect to the remote server
At line:1 char:632
+ ... t-Sleep 2; (Invoke-WebRequest -UseBasicParsing http://localhost:4321/ ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebExc 
   eption
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
 
Invoke-WebRequest : Unable to connect to the remote server
At line:1 char:704
+ ... tatusCode; (Invoke-WebRequest -UseBasicParsing http://localhost:4321/ ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebExc 
   eption
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
 
Invoke-WebRequest : Unable to connect to the remote server
At line:1 char:790
+ ... tatusCode; (Invoke-WebRequest -UseBasicParsing http://localhost:4321/ ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebExc 
   eption
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
 
Invoke-WebRequest : Unable to connect to the remote server
At line:1 char:882
+ ... tatusCode; (Invoke-WebRequest -UseBasicParsing http://localhost:4321/ ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebExc 
   eption
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
 
Invoke-WebRequest : Unable to connect to the remote server
At line:1 char:977
+ ... tatusCode; (Invoke-WebRequest -UseBasicParsing http://localhost:4321/ ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebExc 
   eption
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
 
Invoke-WebRequest : Unable to connect to the remote server
At line:1 char:1067
+ ... tatusCode; (Invoke-WebRequest -UseBasicParsing http://localhost:4321/ ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebExc 
   eption
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
 

```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 13.2s)

_Thinking:_

The system reminder is about the free-model policy. Neither exception applies — this is a personal project (the user's own landing page). Continue the current task without mentioning the note.

Where I was: the background node server failed to connect — likely Start-Process with node -e failed (maybe argument quoting issues in PowerShell, or the process started in different cwd, or node -e with that complex string broke). Let me retry with a simpler approach: write a small server file to temp and run it, or use `npx serve`.

Let me write a tiny server.js in temp dir (not in workspace to avoid polluting the project) and start it, or actually simpler: put server file in temp opencode dir. But the server must serve the project cwd. I can write C:\Users\BigON\AppData\Local\Temp\opencode\static-server.js and start with workdir.

Actually simpler: start node with a script file in temp, working directory = project.

**Tool: write**

**Input:**
```json
{
  "content": "const http = require(\"http\");\nconst fs = require(\"fs\");\nconst path = require(\"path\");\nconst types = { \".html\": \"text/html; charset=utf-8\", \".css\": \"text/css\", \".js\": \"application/javascript\", \".svg\": \"image/svg+xml\", \".json\": \"application/json\" };\nhttp.createServer((q, s) => {\n  let f = q.url.split(\"?\")[0];\n  if (f === \"/\") f = \"/index.html\";\n  const fp = path.join(process.cwd(), decodeURIComponent(f));\n  fs.readFile(fp, (e, d) => {\n    if (e) { s.writeHead(404); s.end(\"404\"); return; }\n    s.writeHead(200, { \"Content-Type\": types[path.extname(fp)] || \"application/octet-stream\" });\n    s.end(d);\n  });\n}).listen(4321, () => console.log(\"up on 4321\"));\n",
  "filePath": "C:\\Users\\BigON\\AppData\\Local\\Temp\\opencode\\static-server.js"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 12.7s)

_Thinking:_

Neither exception applies — this is a personal project (the user's own landing page). Continue the current task: start the static server and verify pages.

**Tool: bash**

**Input:**
```json
{
  "command": "Start-Process -FilePath \"node\" -ArgumentList \"C:\\Users\\BigON\\AppData\\Local\\Temp\\opencode\\static-server.js\" -WorkingDirectory \"C:\\Users\\BigON\\Desktop\\clientelo\" -WindowStyle Hidden; Start-Sleep 2; foreach ($u in @(\"/\", \"/thank-you.html\", \"/assets/css/style.css\", \"/assets/js/main.js\", \"/assets/js/table.js\", \"/assets/js/calculator.js\", \"/README.md\")) { try { $r = Invoke-WebRequest -UseBasicParsing \"http://localhost:4321$u\"; Write-Output \"$($r.StatusCode) $u ($($r.RawContentLength) B)\" } catch { Write-Output \"FAIL $u\" } }"
}
```

**Output:**
```
200 / (18986 B)
200 /thank-you.html (7743 B)
200 /assets/css/style.css (15048 B)
200 /assets/js/main.js (5692 B)
200 /assets/js/table.js (2518 B)
200 /assets/js/calculator.js (3892 B)
200 /README.md (10904 B)

```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 24.4s)

_Thinking:_

The free-model policy note doesn't apply — this is a personal project (the user's own landing page). Continue the current task without mentioning the note.

Where I was: local static server verified — all files return 200. Remaining:
1. Browser-level verification would be ideal but no browser tool. I can at least sanity check HTML structure (IDs referenced by JS exist) — quick greps.
2. git init (task list says git init + deploy). Git repo: env said "Is directory a git repo: no". I should init git? The instructions say only commit when explicitly asked. The assignment says deploy to Vercel. Deploy needs vercel CLI login — check if available. I'll check `vercel --version` or `npx vercel --version` and whether logged in. Deploying requires auth; likely not logged in. I'll prepare and tell user the command.

Actually the task assignment says "Stránku nasaďte na bezplatný hosting, napríklad na Vercel." So deployment is part of the assignment. I should attempt: check vercel CLI.

Let me also verify JS getElementById IDs match HTML:- main.js: lead-form, lf-email, lf-email-error, lf-consent, lf-company, lf-submit, lf-status, sticky-cta, report, faq — all exist in index.html ✓ (sticky-cta, report, faq ✓)
- calculator.js: c-initial, c-monthly, c-years, c-years-out, r-final, r-fees, r-fees-note, r-gap, r-gap-note, hero-loss, sticky-num ✓
- table.js: etf-tbody ✓

Also check that `output` element with `for` — fine.

One more sanity check: quickly run a headless check? No browser available probably. Skip.

Kill the background server after checks.

Then attempt vercel deploy check. Also, README mentions `npx serve .`.

Let me check vercel CLI availability.

Server beží, všetko 200. Skontrolujem ešte zhodu ID medzi HTML a JS a dostupnosť Vercel CLI.

**Tool: bash**

**Input:**
```json
{
  "command": "$html = Get-Content -Raw index.html; $ids = @('lead-form','lf-email','lf-email-error','lf-consent','lf-company','lf-submit','lf-status','sticky-cta','report','faq','c-initial','c-monthly','c-years','c-years-out','r-final','r-fees','r-fees-note','r-gap','r-gap-note','hero-loss','sticky-num','etf-tbody'); $missing = $ids | Where-Object { $html -notmatch \"id=`\"$_`\"\" }; if ($missing) { \"MISSING: $($missing -join ', ')\" } else { \"all IDs present\" }"
}
```

**Output:**
```
all IDs present

```

**Tool: bash**

**Input:**
```json
{
  "command": "try { $v = npx --no-install vercel --version 2>$null; if ($LASTEXITCODE -eq 0) { \"vercel CLI: $v\" } else { \"vercel CLI not installed globally\" } } catch { \"vercel CLI not found\" }; git --version"
}
```

**Output:**
```
vercel CLI not installed globally
git version 2.33.0.windows.2

```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 15.6s)

_Thinking:_

Neither exception applies — this is a personal project (the user's own landing page). Continue the current task without mentioning the note.

Where I was: IDs present, vercel CLI not installed globally, git available. Next: git init? The instructions say never commit unless explicitly asked. The assignment says deploy to Vercel — but deploying requires vercel login which I don't have. I'll finish verification (stop the test server), then summarize and give the user the deploy commands. Should I git init? Assignment says deploy to Vercel — git init without committing is harmless, but repo wasn't a git repo. I shouldn't commit (not explicitly asked to commit... though deploying implies it). The instruction: "Only commit, amend, push, or create PRs when explicitly requested." The user's assignment asks to deploy the page to Vercel. That's an explicit task requirement from the original assignment ("Stránku nasaďte na bezplatný hosting, napríklad na Vercel"). But actual deploy needs authentication I don't have. I could attempt `npx vercel deploy` but it would require interactive login.

Best: attempt to check if vercel can deploy non-interactively? `npx -y vercel@latest --version` would download CLI. Deploy without token fails. I can try but it will hang on login prompt. Better to prepare everything and give the user exact commands, noting login required.

Let me: kill the test server, and do a final quick sanity check of things (maybe verify thank-you has referenced IDs: t-email, t-final, t-fees, t-gap, t-scenario, t-print). Quick grep. Then final summary with deploy steps.

**Tool: bash**

**Input:**
```json
{
  "command": "$html = Get-Content -Raw thank-you.html; $ids = @('t-email','t-final','t-fees','t-gap','t-scenario','t-print','checklist'); $missing = $ids | Where-Object { $html -notmatch \"id=`\"$_`\"\" }; if ($missing) { \"MISSING: $($missing -join ', ')\" } else { \"thank-you IDs OK\" }; Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like \"*node*\" } | Stop-Process -Force -ErrorAction SilentlyContinue; \"test server stopped\""
}
```

**Output:**
```
thank-you IDs OK
test server stopped

```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 49.2s)

_Thinking:_

The system reminder confirms the free-model policy. Neither exception applies — this is a personal project (the user's own landing page). Continue the current task normally without mentioning the note.

Where I was: verification done (all IDs present, server test passed, server stopped). Remaining: git init? and final summary with deploy instructions.

The last todo item: "Verifikácia (lokálny server, výpočty, formulár) + git init + deploy na Vercel".

Should I git init? It's harmless and part of deployment prep. Committing — the instructions say only commit when explicitly requested. The assignment says deploy to Vercel; git init + commit would be a prerequisite for git-connected deploy, but I was not asked to commit. I'll git init and stage nothing? Actually git init without commit has little value. I'll leave git init to the user or do init + no commit? Better: don't commit. Give the user two deploy paths: (a) npx vercel deploy directly from folder (no git needed), (b) git + Vercel integration.

Actually `npx vercel` deploy doesn't require git — it uploads the folder. So git init is optional. I'll skip committing per policy and just provide final summary. But my todo says "git init + deploy". I can attempt deploy check: requires login token. Let me quickly check if VERCEL_TOKEN env exists or vercel already logged in (~/.vercel). Quick check, then finalize.

Let me check for vercel auth state and then wrap up with summary.

**Tool: bash**

**Input:**
```json
{
  "command": "$t = $env:VERCEL_TOKEN; $cfg = Test-Path \"$env:USERPROFILE\\.vercel\\auth.json\"; \"token env: $([bool]$t)\"; \"vercel auth.json: $cfg\""
}
```

**Output:**
```
token env: False
vercel auth.json: False

```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 55.1s)

_Thinking:_

The system reminder confirms the free-model policy. Neither exception applies — this is a personal project (the user's own landing page). Continue the current task normally without mentioning the note.

Where I was: Vercel CLI not installed, no auth token. Final todo: git init + deploy. I can't deploy without user authentication. Let me finalize:
- Verification complete
- Mark todo: deploy part is blocked by auth — I'll finish verification as completed and give deploy instructions (README already has them).

Let me do a final quality pass on index.html — one thing to double check: the sticky bar `hidden` attribute + CSS. In main.js: `sticky.hidden = false;` then toggle class. OK.

Also check: hero CTA data-cta values, form works. The `hp` honeypot input: `class="hp"` positioned absolute left -9999px ✓.

One issue: in index.html the calculator's default chip is "Levný indexový ETF (0.03%)" active; hero shows static 235 000 Kč which represents 0.41% vs 0.03% gap — but hero text says "Vaše ETF vás může připravit o 235 000 Kč. Aniž byste to zjistili." with sub "Stejná indexová sledka, dva fondy, rozdílný poplatek." — consistent with fact card 1 (0,03 % vs 0,41 %). Good.

When user picks SPY chip → hero updates to gap (41 137 Kč ≈). Good.

Another check: `fmtTer` in table.js: `v.toLocaleString("cs-CZ", {min/max})` for 0.03 → "0,03" then `.replace(/,00$/, ",00")` is a no-op weirdness — harmless. For 0.0945 → min 2 max 4 decimals → "0,0945". Then + " %". OK. For 0.18 → "0,18". Good.

`ter-pill` threshold: ter > 0.05 → high. SCHD 0.06 → high (orange), SPY/QQQ orange, VOO/IVV/VTI green. Reasonable.

Verification of math vs displayed hero: 234 728 → "235 000" rounded — README says "zaokrouhleno". Fine.

Also double-check: main.js click handler uses `e.target.closest` — e.target could be text node? No, click target is Element. But could be non-Element (e.g., SVG)? closest exists on Element; if target is document (rare) it'd throw. Add safety? Minor. Let me add a guard: `if (!(e.target instanceof Element)) return;`. Quick edit for robustness.

Also FAQ toggle listener: `faq.addEventListener("toggle", handler, true)` — details toggle events bubble? "toggle" event on details doesn't bubble, but with capture=true on container it catches? Events that don't bubble still propagate in capture phase to ancestors? No — non-bubbling events still have capture phase through ancestors (they do travel down in capture phase). Actually for non-bubbling events, the capture phase still occurs on ancestors. `toggle` fires on the <details> element; during capture from faq container → details, listener with capture on faq will be invoked. Yes that works.

Then mark todos complete and write final summary with deploy instructions.

Let me make the small robustness edit, then finalize.

Dokončujem posledné drobnosti a uzavriem overenie.

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\assets\\js\\main.js",
  "newString": "  document.addEventListener(\"click\", function (e) {\n    if (!(e.target instanceof Element)) return;\n    var el = e.target.closest(\"[data-cta]\");",
  "oldString": "  document.addEventListener(\"click\", function (e) {\n    var el = e.target.closest(\"[data-cta]\");"
}
```

**Output:**
```
Edit applied successfully.
```

**Tool: bash**

**Input:**
```json
{
  "command": "node --check assets/js/main.js; if ($?) { \"main.js OK\" }"
}
```

**Output:**
```
main.js OK

```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 9.9s)

_Thinking:_

The free-model policy note — neither exception applies (personal landing page project). Continue the current task: finish verification, mark todos complete, final summary with deploy instructions.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Overiť reálne dáta a zdroje (TER, výnosy, daň) cez web search",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "index.html skeleton + style.css dizajn systém (mobil-first)",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Hero + bolesť sekcia + porovnávacia tabuľka (table.js)",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Kalkulačka poplatkov (calculator.js) + overenie matematiky",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Formulár + api/lead.js (Resend, fallback) + UTM/event tracking",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "thank-you.html – personalizovaný report",
      "priority": "medium",
      "status": "completed"
    },
    {
      "content": "README.md – poradie sekcií, konverzia, A/B hypotézy, 2 reklamy, deploy návod",
      "priority": "medium",
      "status": "completed"
    },
    {
      "content": "Verifikácia (lokálny server, výpočty, formulár) – hotové; deploy čaká na Vercel login",
      "priority": "medium",
      "status": "completed"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Overiť reálne dáta a zdroje (TER, výnosy, daň) cez web search",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "index.html skeleton + style.css dizajn systém (mobil-first)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Hero + bolesť sekcia + porovnávacia tabuľka (table.js)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Kalkulačka poplatkov (calculator.js) + overenie matematiky",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Formulár + api/lead.js (Resend, fallback) + UTM/event tracking",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "thank-you.html – personalizovaný report",
    "status": "completed",
    "priority": "medium"
  },
  {
    "content": "README.md – poradie sekcií, konverzia, A/B hypotézy, 2 reklamy, deploy návod",
    "status": "completed",
    "priority": "medium"
  },
  {
    "content": "Verifikácia (lokálny server, výpočty, formulár) – hotové; deploy čaká na Vercel login",
    "status": "completed",
    "priority": "medium"
  }
]
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 12.9s)

_Thinking:_

The system reminder is the free-model policy note. Neither exception applies — this is a personal project (the user's own landing page). Continue the current task normally without mentioning the note.

The work is essentially complete. I should give the final summary with deploy instructions (deploy blocked on Vercel login).

Stránka je hotová a overená. Zhrnutie:

**Postavené:**
- `index.html` + `assets/css/style.css` — editorial fintech dizajn (krémová + tmavá zelená, Fraunces/Inter, tabuľkové čísla), mobil-first, sticky CTA lišta
- `assets/js/table.js` — zoraditeľná tabuľka 6 ETF (VOO, IVV, SPY, QQQ, VTI, SCHD) so zdrojmi pod ňou
- `assets/js/calculator.js` — kalkulačka erozie poplatkov (8 % p.a., mesačné skládanie); matematika overená: scenár 100 tis. + 3 tis./mes. × 25 r. → rozdiel 0,41 % vs 0,03 % = **234 728 Kč** (hero = 235 000 Kč)
- `api/lead.js` — validácia → honeypot → rate limit → Resend e-mail s personalizovaným výpočtom; **bez API kľúča funguje v režime `log_only`** (nikdy nezhavaruje)
- `thank-you.html` — report s číslami z kalkulačky + checklist (W-8BEN, broker, prvý nákup), tlačiteľné
- `README.md` — odôvodnenie poradia sekcií, konverzia **8–12 %**, 3 A/B hypotézy podľa dopadu, 2 verzie reklamy, zdroje dát, návod na deploy

**Overené:** syntax všetkého JS, endpoint (422/405/honeypot/log_only), všetky ID HTML↔JS, lokálny server — všetky súbory 200.

**Deploy (čaká len na váš Vercel účet):**
```bash
npx vercel          # prihlásenie + vytvorenie projektu
npx vercel --prod
# potom v Settings → Environment Variables pridať RESEND_API_KEY (voliteľné)
```

Bez kľúča stránka funguje, leady sú viditeľné v Deployment Logs ako riadky `[lead]` vrátane UTM a vstupov kalkulačky.

---

## User

aky je prikaz na lokálne spstenie

---

## Assistant (Plan · MiMo-V2.6-Flash Free · 19.5s)

_Thinking:_

The user asks: "aký je príkaz na lokálne spustenie" (what is the command for local run). This is a simple informational question — I just need to answer with the command. Plan mode is active but this is just answering a question, no edits needed.

From the README/package.json:
- `npx serve .` (or `npm start` / `npm run dev` which run `npx serve .`)
- Full behavior including /api/lead: `npx vercel dev`

Answer concisely.

```bash
npx serve .
```

alebo `npm start` (spustí to isté). Formulár bude v demo režime presmerovať na thank-you.

Pre plný beh vrátane `/api/lead`:

```bash
npx vercel dev
```

---

## User

skús prehľadať rôzne stránky pre investorov (landing pages) a vypísať mi nejaké veci, ktoré tieto stránky majú

---

## Assistant (Plan · MiMo-V2.6-Flash Free · 45.2s)

_Thinking:_

The user wants me to research various investor landing pages and list things these pages have. This is a research task in plan mode — read-only, which fits perfectly (web searches/fetches are read-only).

Let me search for landing page examples: fintech investing landing pages, robo-advisors (Betterment, Wealthfront, Acorns, Degiro, Trading 212, eToro, Portu, Fondee), lead magnet landing pages for investors, etc.

I should do several searches and compile a list of common patterns/elements. The purpose is likely to improve their landing page (Zadanie B). Let me do a few parallel searches.

**Tool: websearch**

**Input:**
```json
{
  "query": "best investing app landing page examples 2026 conversion design fintech",
  "numResults": 8
}
```

**Output:**
```
Title: 15 Best Fintech SaaS Landing Pages (2026): Examples & ...
URL: https://designrevision.com/blog/fintech-saas-landing-pages
Published: 2026-02-18T00:00:00.000Z
Author: DesignRevision Editorial
Highlights:
# 15 Best Fintech SaaS Landing Pages (2026): Examples & Patterns

 DesignRevision Editorial · SaaS, frontend & developer tooling 

 February 18, 2026 • Updated July 2, 2026 • 21 min read 

 Human Written 

Fintech SaaS landing pages play by different rules than standard software pages. When visitors are deciding whether to trust you with their money, API keys, or banking infrastructure, every design choice either builds confidence or triggers doubt.

The best fintech SaaS landing pages solve a specific problem: they make complex financial products feel simple, safe, and worth the risk of switching. They do this through deliberate design patterns that most SaaS landing page design guides ignore entirely: compliance badges, security messaging, conservative color psychology, and social proof that speaks the language of money.

This guide breaks down 15 fintech landing page examples that convert, extracts the design patterns they share, and gives you a playbook for building fintech SaaS landing pages that earn trust before they ask for a click.

## Key Takeaways

> If you remember nothing else:
> 
> - Fintech SaaS landing pages convert at 5-8% on average, outperforming generic SaaS (2.35-5%) due to higher intent audiences
> - Trust signals beat feature lists in fintech. Compliance badges (SOC 2, PCI DSS, FDIC) near CTAs lift conversions 10-20%
> - Deep blues and greens dominate fintech color palettes because they signal stability and growth. Avoid bright reds except for alerts
> - Demo requests outperform free trials for regulated fintech products. Developer-facing products should use "Get API Keys" instead
> - Every example below uses a single primary CTA above the fold. Fintech visitors need clarity, not choices
> - The hero section should communicate safety before value. Lead with what you protect, then explain what you enable
> - For building fintech landing pages, Next.js with Tailwind CSS is the most common stack among the companies listed below

...

### 1. Stripe

What they sell: Payment infrastructure for the internet

Target audience: Developers and e-commerce businesses

What the landing page does well:

Stripe's landing page is the benchmark for fintech SaaS landing pages. The hero uses vibrant mesh gradients over a dark background with a live code snippet showing how simple payment integration can be. The "Start now" CTA is paired with "Contact sales" for enterprise buyers.

| Element | Implementation |
| --- | --- |
| Hero | Gradient animation + code demo showing 4-line integration |
| CTA | "Start now" (primary) + "Contact sales" (secondary) |
| Social Proof | Customer logos: Shopify, Amazon, Google, Ford |
| Trust Signals | SOC 2, PCI DSS Level 1, global compliance page linked |
| Pricing | Transparent: 2.9% + 30 cents per transaction |

Key takeaway: Show how simple the complex thing is. Stripe sells infrastructure, but the hero communicates "4 lines of code." Complexity on the backend, simplicity on the landing page.

...

## Design Patterns That Convert

After analyzing these 15 fintech landing page examples, clear patterns emerge that separate high-converting fintech SaaS landing pages from generic ones.

### Hero Section Patterns

| Pattern | Used By | Why It Works |
| --- | --- | --- |
| Product dashboard preview | Mercury, Brex, Revolut | Lets visitors imagine their data in the product |
| Interactive calculator | Wise, Ramp | Delivers value before signup |
| Code snippet/API demo | Stripe, Moov, Increase | Speaks developer language, shows simplicity |
| Flow visualization | Plaid, Modern Treasury | Makes abstract processes concrete |
| Hardware + software | Square | Creates physical tangibility |

### Above-the-Fold Checklist

Every high-performing fintech SaaS landing page includes these elements above the fold:

1. Headline addressing a specific pain point (not a feature)
2. One primary CTA (not two competing actions)
3. At least one trust signal (compliance badge, customer logo, or metric)
4. Product visualization (dashboard, code, calculator, or flow)
5. Subheadline explaining who it is for (developers, founders, finance teams)

### Social Proof Hierarchy

Fintech pages rank social proof differently than standard SaaS:

1. Transaction volume ("$50B+ processed") - strongest signal
2. Regulatory status ("FDIC insured," "Nationally chartered") - unique to fintech
3. Customer logos (recognizable fintech/enterprise brands)
4. Customer count ("500K+ businesses") - weaker than volume
5. Testimonials (least effective alone, best paired with metrics)

...

Fintech SaaS landing pages average 5-8% conversion rates, outperforming generic SaaS pages which average 2.35-5%. The higher conversion comes from targeted audiences who already have financial intent. Top-performing fintech pages with strong trust signals, transparent pricing, and focused CTAs hit 10-15% conversion rates. B2B fintech specifically benchmarks at 4.5-7% versus the overall SaaS average of 3.7%.

---

Title: Public investing platform homepage by public.com
     · Kage
URL: https://kage.design/designs/public-landing-page
Published: N/A
Author: N/A
Highlights:
Public investing platform homepage by public.com · Kage

 online 

visitors

## Design analysis 

Public's homepage runs on a cream canvas with an oversized high-contrast serif display face against a quiet neutral sans, and it builds rhythm by alternating full-bleed light and near-black bands. The hero is restrained — two lines of left-aligned serif, three icon callouts, one black pill CTA — then a dark annotated-device media band, followed by a purely typographic product index where dot separators and tiny yield chips carry the information. Below, AI feature blocks mix centered editorial captions with dense, realistic product mockups that let green market-data accents do the colour work; a black 'active trading' band mixes a rebate table, a 3D stat cube and syntax-highlighted code; later bands handle concierge, security trust facts in a 2×3 grid, and a conversion close with device mockups, ending in a multi-column footer with a long small-print legal block.

...

## Page structure
1. **Top nav** — small wordmark left; 3–4 dropdown nav items (Products, Agents, Tools & Resources, Company style); right-aligned solid-black pill 'Log in' and outlined pill 'Sign up'. Slim height, cream background, no border.
2. **Hero** — left-aligned oversized serif headline over two lines; below it a horizontal row of three small icon+label callouts (product capabilities) on the left and one black pill CTA with an arrow on the right.
3. **Media band** — full-width near-black panel containing a product screenshot on a device, shown at an angle with a green line chart and small annotation callouts pinned to the UI.
4. **Product index** — a typographic table of contents: 4 lines of large serif words separated by small dot/asterisk marks, with tiny rounded chips for numbers (yields, APY, match %). Pure type on cream, no cards.
5. **AI feature suite** — centered eyebrow label + centered serif headline, then alternating layout: one wide centered block (intro paragraph, 'Learn more →', full-width product mockup), then a 2-column pair of captioned mockups, another wide block, another 2-column pair. Captions sit above each mockup, centered, ~2 sentences + arrow link.
6. **Dark trading band** — black full-bleed section: centered micro-label + two-line serif headline (second line italic); three columns of dark cards each with a heading, short copy, a distinct artifact (data table comparing competitors, a 3D-rendered stat cube with a lowest-rate figure, a syntax-highlighted code snippet with app icons), plus 'Learn more' and a tiny 'Disclosures' link.
7. **Features band** — back to cream: centered serif headline with a gray parenthetical sub-line, then two-column mockup pairs (portfolio card with green chart; monthly income bar chart), a centered wide 'parameter builder' mockup where inline values are highlighted as small colored tokens, another two-column pair with dense tables (event calendar, order queue), closing with a centered stat: small bolt icon, two-line serif stat where the second line is gray.
8. **Concierge band** — black section, split layout: left micro-label + serif question headline + short paragraph; right a dark card titled 'Your benefits include' with checkmark list and a pill button.
9. **Trust band** — dark section with an abstract 3D visual in a corner; serif two-line headline ('Secure by design.' / italic second line); a 2×3 grid of trust facts — small sans heading, 2–3 lines of gray copy, some with tiny certification logos or inline links.
10. **Conversion close** — dark section: serif headline, outline pill CTA, a 5-star row with a short review quote and small-print attribution; right side a collage of laptop + phone product mockups.
11. **Footer** — light background: 5-column link grid (product links, resources, quick links, contact with email + social icons, brand column with regulatory blurb and app-store badges); below it a long small-print legal block of many short gray paragraphs with inline links, separated from the link grid by generous whitespace.

---

Title: Best Fintech Websites: 61 Examples (And Why They Convert) | Web Anatomy
URL: https://www.webanatomy.ai/best-landing-pages/fintech
Published: 2026-01-01T00:00:00.000Z
Author: Gabriel Amzallag
Highlights:
## What high-performing fintech homepage design gets right

Fintech pages have to sell value and reduce perceived risk at the same time. The strongest pages in this benchmark do four jobs early:

49.9/100

Avg. page score

- Make the category obvious in the first viewport so the buyer knows what financial job the product owns.
- Layer reassurance into the page before the ask, using logos, transparent pricing, compliance language, or real operating proof.
- Show the product as a real workflow so the promise feels operational instead of abstract.
- Give cautious buyers a low-friction next step with specific CTA language and supportive microcopy.

---

Title: Best 8 Fintech Website Design Examples (2026 Guide)
URL: https://www.shadowdigital.cc/resources/best-fintech-website-design-examples
Published: 2026-02-27T00:00:00.000Z
Author: Yannick Lorenz
Highlights:
| Pattern | Example | Best For |
| --- | --- | --- |
| Product Showcase | Stripe, Mercury | SaaS-heavy fintech |
| Value Proposition | Wise | Consumer trust-building |
| Animation/Motion | Revolut | Brand-forward, modern feel |
| Social Proof Hero | Ramp | High-growth B2B |
| Calculator/Tool | Wise | Transparency-led conversion |

### Landing Pages and Conversion Optimization

A high-converting fintech landing page follows a predictable, psychological arc: 

Hero (Hook) - Problem/Solution (Value) - Features (Evidence) - Social Proof (Trust) - FAQ (Objection Handling) - Final CTA.

The CTA itself needs to be high-contrast and action-oriented. "Submit" is a technical term; "Start now" or "Open an account" are human actions. We've seen that placing trust signals like an FDIC logo or a "Join 10M+ users" tag right next to the signup button significantly reduces "click fear."

Visuals should do the heavy lifting for complex concepts. Don't write three paragraphs on how your API works; instead, use a custom illustration or a clean code snippet. This is where Stripe wins every time they make technical infrastructure look like art.

### Fintech Landing Page Patterns

 

| Company | CTA | Why It Works |
| --- | --- | --- |
| Stripe | "Start now" | Low friction, immediate |
| Wise | "Get started" | Friendly and approachable |
| Mercury | "Open an account." | Clear, specific banking action |
| Robinhood | "Sign up" | Simple, recognizable barrier |

---

Title: Fintech Website Design Patterns: 12 Real Examples That ...
URL: https://www.utsubo.com/blog/fintech-website-trust-design-patterns
Published: 2026-05-07T00:00:00.000Z
Author: Jocelyn Lecamus
Highlights:
## Key Takeaways

- Trust on a fintech homepage is decided in ~50ms and almost entirely from visual + structural cues. Headline copy comes second; pricing pages come third.
- The 12 patterns split into four buckets: visual (hero composition, motion, typography, logo wall), copy (plain-money language, regulator placement, comparison vs incumbents, numeric proof), UX (support availability, live fee widget, protection guarantee), and structural (trust as a content destination).
- "Comparison vs incumbents" — naming PayPal, Rakuten, MUFG by name and showing your fee against theirs in a live widget — is the single highest-impact differentiator for cross-border money movement and BNPL. Wise built a $14B business on this one pattern.
- Regulator + deposit-insurance language placed near the sign-up CTA outperforms the same copy in the footer. N26 pairs "BaFin license" with "€100,000 deposit protection" inside its primary product copy, not in fine print.
- Most existing fintech sites can ship the full 12-pattern set inside a $30K–$120K rebuild — closer to the upper bound if you're also redoing the design system, closer to the lower bound if you're retrofitting an existing system.
- Avoid four common pitfalls: animation overload, fake-looking testimonials, footer-buried compliance, and vague "trusted by" copy without numbers.
- Self-audit is non-negotiable. We give you the 12-question checklist at the end.

...

### 2-3. Live fee/comparison widget

What it is: An interactive, live-updating component on the homepage that lets the visitor input their own scenario and see your fee versus a named competitor's fee in real time.

Why it works: It converts price-anxiety into a moment of agency. The user operates the homepage instead of reading it. Anything they confirm by their own hand is roughly twice as persuasive as anything they read.

Live example: Wise's currency-converter widget on the homepage compares the user's transfer rate to PayPal, Rakuten, and MUFG Bank — by name — and shows the savings inline. It is the most copied pattern in cross-border fintech because it works.

Implementation rule: Build the widget against three named competitors users actually consider, not against a vague "average." If you can't beat the named competitor on at least one common scenario, fix the pricing — don't hide the widget.

---

Title: Great Website Design Examples: Wealthsimple | SnapPea
URL: https://snappeadesign.com/great-website-design-examples-wealthsimple/
Published: 2026-03-30T17:00:31.000Z
Author: Randy Truong
Highlights:
## Simple navigation with a lot going on underneath

Wealthsimple offers a lot of products. Managed investing, self-directed trading, crypto, tax filing, high-interest savings, chequing accounts, and more. That’s a complicated product suite to communicate on a single website, and most companies in that position default to one of two approaches: either they build a mega-menu that lists everything at once, or they create separate landing pages for each product and hope visitors find the right one.

Wealthsimple does neither. Their navigation is surprisingly minimal given the breadth of what they offer. The main menu has a handful of top-level items, and the product pages are organized in a way that lets you self-select based on what you’re looking to do rather than forcing you to understand their internal product taxonomy. You don’t need to know the difference between “Wealthsimple Invest” and “Wealthsimple Trade” to find what you’re looking for. The site guides you there based on your intent.

I think this is one of the most underrated aspects of their design, and it comes back to knowing their audience. Their ideal customer is someone who probably doesn’t have a clear mental model of financial products yet. They don’t walk in knowing they want a “robo-advisor” or a “self-directed brokerage account.” They walk in knowing they want to start investing, or they want a better savings account, or they want to do their taxes without the headache. Wealthsimple’s navigation speaks to those goals

---

Title: Sharevest Finance Click-Through Example | CRO Breakdown
URL: https://www.apexure.com/landing-page-examples/sharevest-landing-page
Published: 2026-03-28T00:00:00.000Z
Author: Waseem Bashir
Highlights:
# Explains tokenised shares before asking for the click.

Sharevest's click-through page for a blockchain exchange in private company shares, built on Unbounce for crypto-aware investors. The rotating headline, the press logos, and the regulatory badge we would test.

Unbounce Analysed March 2026 32 Finance examples in the gallery

1. Primary CTA Start Your Crowdfunding the button the page is built around
2. Goal Click-Through what counts as a conversion
3. Platform Unbounce click-through page
4. Built for B2C Finance
5. The page as built, not a mockup. Analysed by Apexure, not by Sharevest.

Client

Sharevest Finance

Industry

Finance 32 examples

Audience

B2C Click-Through

Platform

Unbounce 132 examples

Page type

Click-through Click-Through

...

Private company investment has traditionally been locked behind accreditation requirements, minimum investment thresholds, and the kind of institutional access most individuals never get near. Sharevest was building a platform to change that, a global stock exchange for private companies, powered by blockchain tokenisation. The product was genuinely novel. That novelty was both the strongest selling point and the biggest conversion challenge.

The visitors landing on this page were a specific type: crypto-aware retail investors and early adopters who understood tokenisation conceptually but needed to see how it worked in practice for private company shares. They weren’t sceptical of blockchain. They were sceptical of this specific application of it. The conversion problem wasn’t explaining what the platform does. It was convincing a sophisticated audience that this particular implementation was credible, functional, and worth the attention of their investment capital.

We chose a feature-education architecture over a lead-capture-first design because the platform had too many novel concepts for a traditional above-the-fold CTA to convert effectively. Someone who has never thought about buying tokenised shares in a private company needs to understand the mechanism before they’re willing to click anything. The page needed to earn that click through education, not pressure the click before earning it.

...

### The hero carries a rotating value proposition in the headline area

Rather than a single static headline, the hero rotates through the platform’s core use cases: “Raise Money / Trade Shares / Lend Money / Invest With Crypto.” This acknowledges that Sharevest serves multiple audiences, founders raising capital, investors buying shares, lenders, crypto holders, without committing the page to one positioning. The risk with rotating headlines is that visitors who land mid-rotation see incomplete messaging. We addressed this by keeping the rotating element to a secondary role, with the static primary headline “A Global Stock Exchange for Private Companies” always visible.

### The dual CTA structure (“log in” / “start your crowdfunding”)

in the hero separates returning users from new visitors at the decision point. This matters for a platform in early growth: traffic comes from both existing users who have already converted and new visitors who haven’t. Sending both through the same CTA creates friction for the former and confusion for the latter. The dual CTA routes each group cleanly while keeping the primary “Start Your Crowdfunding” CTA visually dominant through colour and size contrast.

### The feature grid organises value into four scannable buckets

: Social Trading, Blockchain Infrastructure, Secondary Market, and Portfolio Management. We specifically ordered these to mirror the investor’s decision journey, first they want to know what kind of actions they can take (social trading), then how the underlying technology works (blockchain), then what liquidity looks like (secondary market), then ongoing management. The grid structure allows investors with different priorities to find their entry point without linear reading.

### The media logos strip at the bottom of the page includes Forbes

This placement is deliberate, it functions as a final credibility confirmation for visitors who’ve read through the full feature set and are now weighing the sign-up decision. By this point in the scroll. They’re not sceptical of the concept; they’re sceptical of this specific company. The media mentions answer that specific residual doubt: “multiple independent journalists investigated this and thought it was worth writing about.”

### The weekly newsletter signup in the footer

adds a second conversion path for visitors who are interested but not ready to invest. This is the commitment-and-consistency principle applied to a long decision cycle: get the visitor to take a low-friction action (subscribe) so you can nurture them toward the higher-friction action (invest). Investment decisions rarely happen on the first visit, and a newsletter subscription captures visitors who are in research mode rather than decision mode.

...

What conversion rate should a blockchain investment landing page target?

Click-through pages for investment platforms typically convert at 3-8% from cold traffic, higher from retargeting. The range is wide because the audience sophistication varies enormously, crypto-native investors convert much faster than traditional investors exploring blockchain for the first time. The more useful metric is qualified sign-up rate after the click-through: how many visitors who land on the registration page actually complete it. We optimise the landing page for qualified intent, not raw click volume.

---

Title: Monarch Money Personal Finance App Landing Page | CRO Breakdown
URL: https://www.apexure.com/landing-page-examples/monarch-money-landing-page
Published: 2026-03-28T00:00:00.000Z
Author: Waseem Bashir
Highlights:
# Built for couples, sold with real screenshots.

Monarch Money's Unbounce click-through page for its personal finance app, aimed at partners who budget together. Six product panels, a 4.8-star rating from 2,700 reviews, the 7-day trial, and the missing bank logos.

Unbounce Analysed March 2026 30 SaaS examples in the gallery

Monarch Money · click-through page · as built Monarch Money · as built

1. Primary CTA Start a Free 7-Day Trial the button the page is built around
2. Goal Click-Through what counts as a conversion
3. Platform Unbounce click-through page
4. Built for B2C SaaS
5. The page as built, not a mockup. Analysed by Apexure, not by Monarch Money.

...

## Design decisions

The product feature grid (six feature panels in a clean two-column layout) gives a full but scannable overview of what the app does. Each panel has a heading, a brief description, and a product screenshot. The screenshots are genuine UI from the app, not marketing mockups, which matters because authenticity signals the product is mature and real.

The “Couples Love Us!” section with a 4.8-star rating and 2,700+ reviews is the page’s primary trust anchor. We positioned it mid-page, after the feature present, because by the time a visitor has seen the features and thought “this looks promising,” social proof closes the remaining doubt. Placing it before the features would waste the credibility. The visitor hasn’t yet decided they want the product.

The testimonial pair (MarkDarkstar and BelicaD5) are from people describing their couple-specific use case. MarkDarkstar says “I found that Monarch works best for my family.” BelicaD5 says “I can finally use a budgeting app with my

...

Why This Works

The "No commitments. Cancel anytime." line below the trial CTA is a friction reducer that costs nothing but removes a real objection. Visitors who were hesitating because they feared being trapped in a subscription now feel safe to start. This micro-copy is doing heavy conversion lifting for two words.

## Conversion strategy

The “Start a FREE 7-Day Trial” CTA is the page’s conversion mechanism. “FREE” reduces friction, “7-Day” sets a clear scope, “Trial” implies no obligation. Together those three elements make the click feel low-risk. The “No commitments. Cancel anytime.” line below the button reinforces that framing for the final hesitant visitors.

 Waseem Bashir CEO, Apexure 

"Adding 'No credit card required' or 'Cancel anytime' below a trial CTA has lifted trial sign-ups on pages we have built. The visitor has already been sold on the product by the page. The only barrier left is commitment anxiety. Two short phrases remove that barrier for a meaningful percentage of hesitant visitors."

...

## Evolve today

Three changes would improve this page’s conversion rate:

- Couple-specific onboarding preview: A short animated GIF showing how two people set up a shared Monarch account in under 2 minutes would reduce the “how does the couple thing actually work?” question that FAQs don’t fully resolve
- Partner brand integrations list: Showing logos of banks and investment platforms Monarch connects to (Fidelity, Vanguard, Chase, etc.) would address the “will it work with my accounts?” question that’s likely a significant drop-off point
- Exit intent offer: A pop-up offering an extended trial (14 days instead of 7) for visitors who show exit intent would recover a meaningful percentage of visitors who liked the page but weren’t quite ready to start
```

**Tool: websearch**

**Input:**
```json
{
  "query": "robo-advisor landing page examples Betterment Wealthfront Acorns website design elements",
  "numResults": 8
}
```

**Output:**
```
Title: 25 Financial Website Design Examples for Inspiration
URL: https://www.vandelaydesign.com/financial-website-design/
Published: 2023-04-24T00:00:00.000Z
Author: N/A
Highlights:
### Wealthfront

Wealthfront has tools and services to automate investing and saving for its customers. Wealthfronts’ website has a modern design, featuring a pastel-colored background with purple text and elements. The home page is busy, filling the entire screen with elements and other content.

They show different perspectives of their app in action, with detailed explanations of each screen so potential users know what to expect.

The site’s footer features a playful and memorable design feature, with a cartoon sloth that replaces the standard cursor.

### Betterment

With eye-catching illustrations and interactive elements, Betterment does a great job of providing a memorable user experience for its online visitors.

The color scheme of their site is diverse, ranging from a yellow header background to a dark blue footer. Online visitors can find all action buttons throughout the home page highlighted in a bright blue color. It’s easy to navigate to pages to learn more about the company and its services.

Betterment also provides a helpful quiz, which does a great job of drawing potential customers in and showing them what the services could do for them.

...

### Acorns

Acorns is a great example of a memorable website design, with creative copy designs paired with a bold color scheme. There are interactive animation effects as you scroll through the home page, adding depth and interest to the overall look of the site.

Visitors can use the menu bar to learn more about their services, log in, or get started. We can also find a simplified menu in the site’s footer, along with its social media icons and some disclaimers.

The site’s About page includes a lengthy list of social proofs, with some big-name investors and a slider of customer testimonials.

---

Title: Betterment wealth management homepage by betterment.com
     · Kage
URL: https://kage.design/designs/betterment-landing-page
Published: N/A
Author: N/A
Highlights:
## Design analysis 

A finance landing page that pairs oversized editorial serif headlines with a restrained sans-serif UI layer. The opening uses a vivid blue photographic hero, then shifts through saturated blue product navigation, pale beige editorial sections, image-led proof points, and a deep navy footer; cards, statistics, FAQs, and disclosures progressively increase information density below the hero.

...

## Page structure
1. **Utility audience bar** — Add a thin black strip at the top with compact links for the primary audience groups.
2. **Primary navigation** — Place the brand area, category links, dropdown indicators, login link, and a high-contrast primary CTA over the hero.
3. **Hero** — Use a tall, full-bleed photographic or product-in-use background with a blue treatment. Set a large left-aligned serif headline, short supporting copy, three compact benefit bullets, CTA, disclaimer, and a small media-control affordance.
4. **Account/product chooser** — Transition into a saturated blue section with a centered heading and three evenly spaced columns. Each column contains a category title and stacked, lightly divided product rows with small icon tiles, descriptions, and arrow affordances. Finish with a centered legal note.
5. **Investment approach introduction** — Fade from blue into pale beige through a soft blue gradient and center a serif section heading.
6. **Investment options comparison** — Show three large overlapping product cards over a warm yellow/orange semicircular graphic. Vary card position slightly, include labels, descriptions, CTAs, and blue product-interface artwork in the lower halves.
7. **Retirement feature banner** — Use a full-width lifestyle photograph with a dark overlay, white left-aligned headline and body copy, paired CTAs, and an illustrative disclaimer.
8. **Cash feature split** — On a pale beige background, place a bold blue/yellow APY illustration on the left and a right-side text block with headline, paragraph, checklist, and dual CTAs.
9. **Trust and protection proof** — Create a split editorial section with a large trust statement and award/proof copy on the left, a rounded lifestyle image on the right, and an overlaid statistic badge crossing the split.
10. **Assurance pillars** — Add three evenly spaced columns with small yellow circular icons, concise bold headings, and explanatory paragraphs covering fiduciary status, protection, and human expertise.
11. **Metrics strip** — Switch to deep navy and present a horizontal row of large white statistic cards with rounded corners. Include supporting microcopy beneath the cards.
12. **FAQ section** — Return to pale beige. Use a two-column layout with a large serif “common questions” heading on the left and an accordion list on the right; show one expanded answer and several collapsed rows separated by fine rules.
13. **Closing CTA** — Center a serif invitation and blue CTA in generous beige whitespace.
14. **Footer illustration transition** — Extend the closing section into a wide yellow-to-orange sunset gradient with a simplified blue road/hill illustration and a small vehicle motif.
15. **Footer navigation** — Continue into deep navy with the small brand mark at left and multiple link columns for accounts, tools, service, resources, about, rewards, and disclosures.
16. **Footer app/social links** — Add social icons and app-store badges below the navigation columns.
17. **Legal and disclosure copy** — Fill the remainder of the footer with small, high-density legal paragraphs, linked disclosures, separators, headings, licensing statements, and copyright details. Preserve generous horizontal margins despite the dense text.

...

## Design language
- Build hierarchy with contrast between oversized literary serif headlines and compact, highly legible sans-serif interface copy; use serif display sizes around 48–76px on desktop and sans-serif body text around 14–18px.
- Let the page change rhythm by section: immersive and sparse in the hero, highly structured and dense in the product chooser, spacious and editorial in beige feature areas, then information-heavy in metrics, FAQs, and legal footer content.
- Use a vivid blue system for action and product surfaces, approximately `#1769D8` to `#1551C5`; reserve deep navy such as `#050E5B` for footer and high-trust areas.
- Use warm pale beige around `#FBF0E2` as the editorial canvas and bright yellow around `#FFD32A` for CTAs, icon discs, highlights, and optimistic transitions. Add orange/pink near `#FF8B3D` only in large atmospheric gradients.
- Keep primary text near navy rather than pure black; use white text on blue, photographic, and navy sections. Maintain strong contrast for all CTAs and legal text.
- Treat cards as calm, slightly rounded white surfaces with thin or nearly invisible borders, modest shadows, and occasional blue gradient artwork. Use medium radii around 10–16px; avoid excessive glass effects.
- Use fine horizontal dividers for product rows, accordion items, and disclosure groupings. Keep grid alignment consistent while allowing large photographic sections and oversized graphics to break the strict grid.
- Pair photography with controlled overlays and place text in predictable left-aligned regions. Product illustrations should be graphic, simplified, and clearly subordinate to the headline and CTA.
- Use buttons with compact semibold labels, moderate corner radii, and solid blue or yellow fills. Provide a quieter text-link alternative beside major CTAs.
- Make interaction cues explicit through arrow affordances, dropdown chevrons, accordion carets, and compact media controls. Use restrained hover elevation or colour shifts rather than elaborate motion; allow large gradients and imagery to carry the visual energy.
- Maintain a polished, reassuring financial-services tone: generous whitespace in editorial sections, precise alignment in comparison sections, and very small but readable legal text at the end.

---

Title: Betterment website design · MABTU
URL: https://mabtu.com/sites/betterment
Published: N/A
Author: N/A
Highlights:
# Betterment

Automated investing, high-yield cash and retirement accounts.

7.5/10 MABTU rating

DESKTOP · 1440 × 9,937/ ↗

MOBILE · 390

## Section outline · Home

1. 01 hero Gradient with UI cards
2. 02 product chooser Invest, Cash, Retire rows 726
3. 03 products Three cards on arc 1,423
4. 04 feature Photo band 761
5. 05 feature APY card 746
6. 06 trust Photo, stat, three points
7. 07 stats Three stat tiles
8. 08 faq Accordion 829
9. 09 cta Illustrated road scene 797

## Rating · Home

Visual design

...

## Main colours

#FFFFFF background#000B50 text#1142A7 secondary#3A78AA

Light· white background· vivid

## Typography

Aa Season Mix heading · serif · self-hosted Aa GT America body · sans · self-hosted

## Stack & style

HubSpot CMS jQuery

Corporate / clean Gradient-heavy Rounded / soft Product-UI-led FAQ accordion Marquee Mega menu Pricing table Review badges Stats band Sticky header

Also: Hotjar, Meta Pixel, Segment, Google Tag Manager, Cloudflare, Google Analytics

## Design DNA

Blue-to-sunset gradient hero with a crisp sans headline, yellow CTA and floating portfolio UI cards. A product chooser lists Invest, Cash and Retire rows with icons and arrows. Three product cards sit on a sunrise arc, then a photo band, an APY card with flying banknotes, a lifestyle photo with a 96% stat, trust points, stat tiles, FAQ, and an illustrated car on a hilly road before a navy footer.

## Worth borrowing

1. Arrange three product cards along a sunrise arc to show a spectrum of control.
2. Offer a product chooser as icon rows grouped under Invest, Cash and Retire.
3. Close with an illustrated journey scene leading into the footer.

---

Title: 8 Inspired Web Designs for Fintech Businesses - WebFX
URL: https://www.webfx.com/industries/finance/fintech/web-design/
Published: 2024-05-17T00:00:00.000Z
Author: Celeste Yates
Highlights:
### #5 Clean illustrations: Betterment

The financial industry is complicated and stressful enough without overly stimulating graphs, images, and content. Betterment has created a clean approach that is followed through with its illustrations. The pale colors give a relaxing, almost meditative feel.

The combination of simple graphics and good spacing creates flow through the site. You feel like you are in a good, trusting space. The use of space also frames the illustrations, capturing the user’s attention and drawing the eye in, enhancing the text.

...

### #7 Making financial planning interactive: Acorns

Acorns opens their website with a bang of interactivity. Just one short scroll down the page and you find a useful, investment calculator you can use to start working out your finances. Straight underneath is an animation to walk you through the steps toward your potential financial freedom.

Acorns does a great job of adding interactive elements that make people want to stay on their website and learn more about the company.

---

Title: Wealthfront homepage — APY-led fintech landing page by wealthfront.com
     · Kage
URL: https://kage.design/designs/wealthfront-landing-page
Published: N/A
Author: N/A
Highlights:
## Design analysis 

A deep-indigo hero built around one oversized APY numeral, softened by an italic-serif counterphrase and a tilted phone mockup with a debit card layered behind it. Below, the page alternates dark and light full-bleed bands — proof stats, mirrored product cards with checklists, photo-based client stories, a dark Forbes pull-quote plus stat row, a light FAQ accordion — so the rhythm is set by background inversion rather than layout changes. Type scale is steep (display numeral ~120px down to 12px disclosures), depth comes from gradients and layered mockups rather than shadows, and the footer swells with regulatory fine print that reads as deliberate fintech credibility.

...

## Page structure
Build a single marketing homepage with these sections, top to bottom:

1. **Announcement bar** — slim full-width strip above the nav on the dark brand colour, centred bold message with a confetti/particle flourish, plus one inline text link. Dismissible.
2. **Navigation** — dark, same background as hero so they read as one block. Wordmark left; four dropdown items centre-right (Cash, Invest, Borrow, Learn pattern: name them from the user's product); outlined 'Log in' button and a white filled pill 'Get started' on the far right.
3. **Hero** — two columns on a deep indigo→violet gradient. Left: small eyebrow label with a sparkle icon ('Earn up to'), one enormous display numeral (the key offer, e.g. a rate or metric) at ~110–130px, then an italic serif counterphrase on its own line. Below, three feature rows (small line icon + one-line claim), then two CTAs — filled violet pill and outlined pill — and a 12px disclaimer paragraph. Right: a tilted phone mockup showing the product's UI with real-looking balances, with a second object (card/panel) layered behind it for depth.
4. **Proof band** — still on the dark hero background: a small award/badge card on the left, then four stat columns (clients, assets, app-store ratings) each with a big numeral and small caption, footnote superscripts linking to fine print.
5. **Explainer accordion** — full-width white rounded pill bar with a chevron circle: one bold claim followed by lighter supporting text. Expands to reveal how the headline number is achieved.
6. **Education section (light)** — white/lavender background, centred: a two-line headline where the first line is heavy sans and the second is large italic serif, one supporting paragraph, then two award/rating cards side by side (one brand-coloured, one dark).
7. **Product comparison** — two mirrored columns, each: centred heading + one-line description, a rounded card containing a phone mockup (left card adds a metric badge and a performance chart), the account name in brand purple, a three-item checklist with check icons, filled + outlined CTAs, a 12px disclosure footnote, then an 'Explore…' block of underlined text links.
8. **Client stories** — heading centred ('Make the most of your…' pattern), then three equal photo cards: candid warm photography, a small name/date chip top-left, and a dark gradient overlay at the bottom carrying a short title, one line of copy, and a circular arrow button.
9. **Testimonial band (dark)** — near-black indigo. Left: large pull quote in serif, source logo, 'Read the article' link, tiny disclaimer. Right: a video-thumbnail card with a short client quote overlaid on a translucent panel.
10. **Stats row (dark)** — four big numerals with captions (1.5M+, $100B+, years, ticker symbol), plus two lines of 12px disclaimers beneath.
11. **Closing CTA (dark)** — full-bleed gradient band, one centred display line mixing heavy sans with an italic serif word, and a single filled 'Open account' button.
12. **FAQ (light)** — two columns: left a bold multi-line heading ('Questions? 5 things to know in 5 minutes or less.' pattern) with helper links beneath; right a five-item accordion with hairline dividers and rotating chevrons.
13. **Footer (dark)** — logo left, four link columns with small bold group subheads, 'Back to top' link, then a long block of 12px–14px regulatory disclosures and numbered footnotes ending with copyright.

...

## Design language
- **Background inversion sets the rhythm:** dark brand block (hero → proof → accordion) → light education/comparison → light photo band → dark quote/stats/CTA block → light FAQ → dark footer. Don't subdivide with sidebars; let full-bleed band colour changes do the work.
- **Colour:** deep indigo `#2B1464` and violet `#4B2E9E` gradient for dark bands; near-black indigo `#1E1656` for the quote/footer block; light sections on `#FFFFFF` with lavender card fills `#EEEBF7`; accent buttons violet `#5A4FC7`; body text on white `#1E1A2E` with secondary `#55506A`; on dark, secondary text is white at ~70% opacity.
- **Type pairing:** one geometric sans for all UI, headlines and numerals; one high-contrast serif used *only* in italic for a short phrase that trails the main statement. Scale: display numeral 110–130px, section headlines 44–56px, card titles 26–30px, body 16–18px, captions/disclaimers 12px. Keep the serif out of buttons and navigation.
- **Hierarchy by subtraction:** each band makes exactly one point. One giant numeral or one headline per band; support with small icon rows, checklists or stat columns rather than competing headlines.
- **Radius and borders:** pill buttons (999px), 16–24px card radius, hairline 1px dividers `#E3E0EE` on light and `rgba(255,255,255,0.15)` on dark. Shadows are nearly absent — depth comes from gradient washes and layered mockups.
- **Data presentation:** big numerals with a small caption line underneath; superscript footnote markers that resolve in the footer; performance claims always paired with adjacent 12px disclaimers.
- **Photography:** candid, warm, lifestyle-oriented photos only in the client-story band, always under a dark bottom gradient with white text; product sections use mockups and type, never photos.
- **Motion:** accordions expand with a ~200ms ease and chevrons rotate; circular arrow buttons nudge right on hover; dropdowns reveal on hover/click. Nothing parallaxed or bouncy.
- **Footer density is a feature:** let the legal block run long at 12–14px, low-contrast but readable — it signals a regulated product. Keep marketing sections airy by contrast.

---

Title: Top 9 Financial Services Website Design Examples
URL: https://www.apexure.com/blog/financial-services-website-design-examples
Published: 2025-07-22T08:11:00.000Z
Author: Waseem Bashir
Highlights:
## 9 best financial services website design examples

Here are some good financial services website designs that will help you understand the elements necessary for building a website that brings in the ROI and serves a great user experience.

### 1. Wealth hub australia

Offering a modern approach to finance web design, this website combines rich visuals and user-friendly navigation. Interactive tools, such as investment calculators, are deliberately placed to engage users, demonstrating how well-integrated financial services website design can raise a financial business’s online presence.

### 2. My debt manager

Known for its excellent financial services website design, My Debt Manager website offers an intuitive user journey, making sure that visitors find what they need quickly. Strong calls to action, paralleled with the financial UX design, effectively motivate users to act by either signing up for services or inquiring.

### 3. Betterment

This online platform is neat and easy to use, with the navigation being optimized for a better user experience. With bold visuals and simple language, complicated financial concepts have been simplified for the reader.

### 4. Wealthfront

Wealthfront uses a minimalist and simple site for ease of access. Integrated educational content acts to inform the users regarding investment approaches.

### 5. Help

Help provides a clean, intuitive design that simplifies personal finance. The website focuses on helping users to track their spending, saving, and investments with ease.

### 6. Vanguard

Vanguard’s site plays heavily with themes of trust and legitimacy. Professional imagery, testimonials by clients, and straightforward disclosures make sure users feel secure in their choices.

### 7. Fidelity Investments

Fidelity’s website focuses on accessibility and user-centricity: customizable dashboards and educational material serve certain users’ needs.

### 8. Robinhood

Robinhood is characterized by a slick, easy-to-navigate platform appealing to a younger audience. Straightforward navigation, watchlists, and dynamic data visualizations build a stronger trading experience.

### 9. Acorns

Acorns has a very user-friendly and simple design. With this simple layout, the website quickly conveys the benefits of the proposition.

...

## Key elements of High-ROI financial services website design

Here are some key elements to keep in mind while building a financial services website design:

### User-centric financial UX design

The core of financial UX design lies in giving the user a frictionless and intuitive experience. For financial websites, this means:

- #### Responsive and Mobile-Friendly Design

With a growing number of financial service consumers using mobile devices, making sure that your website is responsive across various screen sizes is necessary. A responsive design adapts to all devices: desktop, tablet, and mobile, providing users with a consistent experience. It boosts engagement, reduces bounce rates, and leads to higher conversion rates, as users can interact with your website smoothly, regardless of the device they use.
- #### Fast Loading Speeds

Speed is a critical factor in user retention. Websites with slow loading times frustrate users, often leading them to leave before completing desired actions. Optimizing image sizes, minimizing code, and using techniques like caching can improve page load times significantly. A fast website not just improves the user experience but also helps with search engine rankings, as Google prioritizes fast-loading sites.
- #### Intuitive Navigation

Users should find it easy to navigate through services such as account management, loan applications, or investment options. The goal is to make finding information quick and straightforward.
- #### Accessibility

The website should be accessible to everyone, including those with disabilities. This

---

Title: Wealthfront.com (mobile web) – FIRST RUN UX
URL: https://first-run-ux.kryshiggins.com/wealthfrontcom-first-time-user-experience-the/
Published: N/A
Author: N/A
Highlights:
# Wealthfront.com (mobile web)

- Post date August 12, 2015 
- Tags customization, free samples, inline cues, setup wizard 

 

 

 

 

 

 

 

 

 

 

The good bits:

- As the user scrolls down Wealthfront’s home page, it gradually leads her from a broad product concept to deeper levels of detail. The same clear call to action—“Invest now”—is present in each major section of the page. This use of inline cues leads the new user on a clear path by weaving education and action in with, instead of distracting from, content.
- Wealthfront offers the new user a free sample by allowing her to get a personalized suggestion for an investment portfolio without her needing to create an account. When tapping on “Invest now,” she is asked a series of simple questions in a setup wizard-like format, which ascertains her risk profile. At the end of the wizard she is presented with her suggested asset mix. This shows how a personal focus can be added even before the new user commits to an account.
- When presented with her suggested asset mix, the new user is able to interact with it further by moving her risk profile number up or down with the “+” or “-“ buttons. Doing this will dynamically update the content on the page so that the new user learns quickly how her risk profile is tied to the suggested asset mix. By allowing the user to directly manipulate and change her suggestions, Wealthfront is providing education through guided interaction.
- Wealthfront uses a good transition plan. The new user is invited to save her suggested portfolio for later by sending it to her email address. If she opts for this approach, a follow-up email will arrive with further details about Wealthfront and instructions on setting up an account. She can also re-link to her personalized portfolio from this email—again, all without having created an account.

---

Title: Betterment Design System
URL: https://www.shadcn.io/design/betterment
Published: N/A
Author: N/A
Highlights:
## About Betterment DESIGN.md

Curated by Dov Azencot, updated May 19, 2026. Source betterment.com (opens in a new tab).

Betterment's marketing site opens on midnight navy — a very dark blue with just enough chroma to read as sky rather than charcoal — and sets its hero headline ("Build your wealth in the background") in Season Mix, a proprietary serif-influenced display face that brings editorial gravity to what is otherwise a technology product. This pairing is unusual in the robo-advisor category. Wealthfront and Fidelity run mid-weight blue canvases and standard sans-serif headlines; Robinhood goes dark-mode with green accents. Betterment makes the opposite bet: deep navy that almost reads as night sky, editorial display type that reads closer to a financial magazine than a fintech dashboard.

The DESIGN.md file packages 10 colors tokens drawn from the extraction, organized into a midnight navy floor, a bright cobalt blue (#1d6ae5) for interactive elements and gradient nodes, a single gold (#ffc729) warm accent used 5 times as illustration and highlight fills, and a cream canvas (#f9f0e2) below the fold. Typography runs 14 tokens across two families: Season Mix at 44–72px for display, and GT America (a proprietary grotesque licensed from GrilliType) for every body, label, nav, and UI surface. Components number 18, covering the navy hero, the physical-shadow product cards, the gold-highlight yield panels, the warm-cream section floor, and the dark-navy footer.
```

---

## Assistant (Plan · MiMo-V2.6-Flash Free · 39.8s)

_Thinking:_

The user wants me to search various investor landing pages and list things these pages have. I've done 2 searches. Let me maybe do 1-2 more targeted searches (e.g., European/Czech investing landing pages, lead magnet patterns for investors), then compile a structured list of common elements. This is research/informational — plan mode fits.

Let me do one more search on Czech/European examples + lead magnet landing pages for investors to make it more relevant to their project.

**Tool: websearch**

**Input:**
```json
{
  "numResults": 8,
  "query": "investiční platforma Česko Portu Fondee Patria landing page elementy kalkulačka zhodnocení"
}
```

**Output:**
```
Title: Portu - Investuj. Nestresuj. | Portu - Investuj. Nestresuj.
URL: https://www.portu.cz/
Published: N/A
Author: Milan S. (46 let
Highlights:
Portu - Investuj. Nestresuj. | Portu - Investuj. Nestresuj.

# Investuj. Nestresuj.

Investování může být jednoduché, srozumitelné a bez zbytečného stresu.

klientů

350 000+

zainvestováno

77 miliard Kč

Hlavní bankovní partner

10,39 %

Průměrný roční výnos růstového portfolia za posledních 10 let

Portfolio od Portu

# Zjistěte, kolik vám investování s Portu může vydělat

Čím déle investujete, tím větší výnosy můžete získat.

#### Zadejte, kolik a na jak dlouho chcete investovat

Jednorázově pošlu

1 615 845 Kč

Tolik můžete s Portu mít za 20 let

Více informací o modelovém odhadu

865 845 Kč

Odhadovaný výnos

750 000 Kč

Vaše vklady

Minulé výnosy nejsou zárukou budoucích. Investice na kapitálových trzích nejsou bez rizika.

## Portfolio od Portu

Nastavíme vám portfolio na míru vašim cílům a potřebám. Vy nemusíte dělat nic. A peníze máte pořád po ruce.

10,39 %

Průměrný roční výnos za posledních 10 let včetně poplatků

- Portfolio nastavíme za vás a budeme ho hlídat
- Ideální pro pravidelné investování, stačí nastavit trvalý příkaz
- Jeden nízký poplatek podle objemu a délky

Složte si portfolio přesně podle sebe ze široké nabídky světových akcií, ETF a tematických balíčků. Pak stačí vkládat peníze a zbytek zařídí Portu.

#### Finanční polštář Investiční rezerva

Alternativa spořicího účtu, úročení podle sazby ČNB bez omezení výše vkladu. Peníze máte kdykoliv k dispozici.

#### 0–18 let Dětský účet

Investice do budoucnosti vašeho dítěte, přispívat může celá rodina. Poplatek pouze 0,25 % ročně.

#### Zajištění na důchod Důchodový účet DIP

Lepší alternativa penzijka s daňovým odpočtem až 7 200 Kč ročně a výhodným poplatkem.

#### 18–26 let Portu < 26

Zvýhodněné investování pro ty, kdo chtějí získat cenný náskok do dospělosti.

#### Stabilní nemovitosti Investice do realit

Investujte do sektoru komerčních nemovitostí s cílovým výnosem 7–9 % ročně.

#### Plná kontrola Brokerage

Vybírejte si ze stovek akcií a ETF, které nakoupíte v reálném čase za jednorázový poplatek.

###### Nevíte, kterou investici si vybrat?

Vyplňte kvíz a zjistěte, co se pro vás hodí nejvíc.

## Výhodné investování díky jednomu nízkému poplatku

- Portfolio od Portu
- Portfolio podle vás

#### Váš jediný poplatek

0,48 % ročně

Jak snížit poplatek? Jak snížit poplatek?

- Založení účtu, veškeré vklady i výběry zdarma.
- Směna měny bez poplatku.
- Žádné skryté poplatky ani marže.

#### Spočítejte si svůj poplatek

#### Jak začít během pár minut

1. 1
2. 2
3. 3

###### Poznáme vás

Zjistíme váš cíl a vztah k riziku a vybereme vhodnou investici.

###### Ověření totožnosti

Doplníte pár údajů, my si je ověříme a hned založíme účet.

###### Pošlete peníze

Pošlete první vklad, dál už se nemusíte o nic starat.

---

Title: Investování, kterému rozumíte | Direct Fondee
URL: https://www.fondee.cz/
Published: N/A
Author: N/A
Highlights:
Investování, kterému rozumíte | Direct Fondee

# Investování, kterému rozumíte 

ČNB

27 000+

klientů

až 11,7 %

průměrný roční výnos za 10 let

# Investování, kterému rozumíte

ČNB

27 000+

klientů

až 11,7 %

průměrný roční výnos za 10 let

Pomůžeme vám investovat jednoduše, srozumitelně a z pohodlí gauče. Začít můžete už od 500 Kč.

## Není to magie. Je to čas a procento.

Zadejte svou situaci. Ukážeme vám, co to znamená v číslech.

Odhadovaná hodnota

548 892 Kč

Celkem vložíte

270 000 Kč

Výnos

+278 892 Kč

Kolik chcete investovat na začátek? 30 000 Kč

Kolik chcete investovat na začátek?

Kalkulačka počítá s historickým zhodnocením portfolia ESG odvážný 11,72 %. Historickou výnosnost počítáme jako průměrně roční zhodnocení portfolia za posledních 10 let k 1. 6. 2026 v eurech a výpočet vychází ze simulovaného historického vývoje založeného na cenách jednotlivých ETF nebo jejich podkladových indexů. Výnosnost je počítána před započtením poplatku. Hodnota investice může kolísat a výnosy z minulosti nejsou zárukou výnosů budoucích. Simulace nezohledňuje daňové dopady ani inflaci. Investování je spojeno s rizikem ztráty části nebo celé vložené částky.

...

## Našim klientům jsme vydělali až 11,7 % ročně. Tak vypadá síla dlouhodobého investování. 

Jedná se o historické zhodnocení portfolia ESG odvážný. Historickou výnosnost počítáme jako průměrně roční zhodnocení portfolia za posledních 10 let k 1. 6. 2026 v eurech a výpočet vychází ze simulovaného historického vývoje založeného na cenách jednotlivých ETF nebo jejich podkladových indexů. Výnosnost je počítána před započtením poplatku. Hodnota investice může kolísat a výnosy z minulosti nejsou zárukou výnosů budoucích. Investování je spojeno s rizikem ztráty části nebo celé vložené částky.

## Vaše investice vždy po ruce

V naší aplikaci snadno zkontrolujete vývoj, upravíte vklady nebo přidáte další peníze.

### Stáhněte si Direct Fondee aplikaci do telefonu

---

Title: Investiční kalkulačka | Direct Fondee
URL: https://www.fondee.cz/investicni-kalkulacka
Published: N/A
Author: N/A
Highlights:
Investiční kalkulačka | Direct Fondee

## Jak může vaše investice růst?

Měňte částku i dobu investování a sledujte, jak se mění výsledek.

Odhadovaná hodnota

1 517 038 Kč

Celkem vložíte

550 000 Kč

Výnos

+967 038 Kč

Kolik chcete investovat na začátek? 10 000 Kč

Kolik chcete investovat na začátek?

Kalkulačka počítá s historickým zhodnocením portfolia ESG odvážný 11,72 %. Historickou výnosnost počítáme jako průměrně roční zhodnocení portfolia za posledních 10 let k 1. 6. 2026 v eurech a výpočet vychází ze simulovaného historického vývoje založeného na cenách jednotlivých ETF nebo jejich podkladových indexů. Výnosnost je počítána před započtením poplatku. Hodnota investice může kolísat a výnosy z minulosti nejsou zárukou výnosů budoucích. Simulace nezohledňuje daňové dopady ani inflaci. Investování je spojeno s rizikem ztráty části nebo celé vložené částky.

...

### Čas s vaší investicí udělá víc, než se zdá 

 U investování nehraje roli jen to, kolik si odkládáte, ale i to, jak dlouho. S časem se totiž mohou zhodnocovat nejen vaše vklady, ale i výnosy, které už investice vytvořila. Jak se to projeví, ukazuje příklad pravidelné investice 3 000 Kč měsíčně se vstupním vkladem 1 000 Kč. 

Modelový vývoj investice při pravidelném vkladu 3 000 Kč měsíčně a vstupním vkladu 1 000 Kč

| Doba investování | Celkem vložíte | Odhadovaná hodnota | Výnos |
| --- | --- | --- | --- |
| 5 let | 181 000 Kč | 234 767 Kč | + 53 767 Kč |
| 10 let | 361 000 Kč | 621 873 Kč | + 260 873 Kč |
| 15 let | 541 000 Kč | 1 262 901 Kč | + 721 901 Kč |
| 20 let | 721 000 Kč | 2 324 411 Kč | + 1 603 411 Kč |

 Jde o modelový výpočet pro pravidelnou investici 3 000 Kč měsíčně a vstupní vklad 1 000 Kč, založený na průměrném zhodnocení portfolia Odvážný za posledních 10 let k 1. 6. 2026 v eurech, které je 10,13 % ročně. Výpočet nezohledňuje poplatky, inflaci ani daňové dopady. Skutečný vývoj investice se může lišit a minulé výnosy nejsou zárukou výnosů budoucích. Investování je spojeno s rizikem ztráty.

...

Výnos investice závisí i na zvoleném profilu. Direct Fondee nabízí 7 investičních profilů od konzervativního po odvážný. Proklikejte si je a podívejte se, jaké mají složení, míru rizika a jak se jim dařilo v minulosti.

1 Konzervativní 2 Obezřetný 3 Rozvážný 4 Vyvážený 5 Smělý 6 Nebojácný 7 Odvážný

Nižší riziko

Nižší výnos

Vyšší riziko

Vyšší výnos

Z čeho se portfolio skládá

71 % akcie 27 % dluhopisy 2 % hotovost

Rozložení podle regionů

Evropa 49 %

USA 36 %

Asie 8 %

Rozvíjející se trhy 6 %

Ostatní 1 %

Historický výnos

Celkový výnos za období 01/2020 – 12/2025

Průměrný roční výnos za posledních 10 let

Celkový výnos za období 01/2020 – 12/2025

...

#### Investice pro děti

- Investování pro děti se zvýhodněným poplatkem

#### Investice na důchod

- Investování na důchod s daňovým zvýhodněním

Důchodová kalkulačka

kteří investují s Direct Fondee

klientů v Directu, jehož jsme součástí

Vy si určíte, kolik chcete investovat a čeho chcete dosáhnout. Investování s Direct Fondee funguje jednoduše. My se postaráme o výběr a nákup ETF i průběžnou správu vašeho portfolia. Vy vždy víte, s jakými poplatky počítat i jak jsou vaše peníze chráněné.

- Investujete do ETF z celého světa
- Portfolio průběžně spravujeme za vás
- Vše vyřídíte a sledujete online
- Investice můžete kdykoli prodat a peníze vybrat
- Fungujeme pod dohledem ČNB
- Vždy předem víte, kolik zaplatíte

Je výsledek kalkulačky garantovaný?

Kalkulačka pracuje s historickým zhodnocením a pomůže vám udělat si představu, jak by se vaše investice mohla v čase vyvíjet. Skutečný výsledek bude záviset na budoucím vývoji hodnoty investic. Zhodnocení v minulosti není zárukou stejného vývoje v budoucnu.

---

Title: Portfolio podle vás | Portu - Lepší místo pro peníze
URL: https://www.portu.cz/strategie/?a_box=dzfjbvhs
Published: N/A
Author: N/A
Highlights:
Portfolio podle vás | Portu - Lepší místo pro peníze

## Složte si Portfolio z akcií a ETF dle svých představ

Vytvářejte vlastní dlouhodobá investiční Portfolia z mixu prověřených ETF nebo jednotlivých akcií. Vybrat si můžete i z tematických balíčků.

Investici můžete měnově zajistit, rebalancovat nebo v čase měnit její složení. Vše snadno, levně a efektivně.

## Proč zvolit Portfolia podle vás? 

#### Jednododuché nastavení 

 Svou investici si nastavíte na pár kliknutí. Podobně jako na e-shopu přidáte instrumenty do košíku a pak už jen navolíte jejich váhy. 

#### Pokročilé funkce 

 K dispozici máte i pokročilejší možnosti, jako je měnové zajištění, které chrání investici před posilováním koruny, nebo automatickou rebalanci. 

#### Jeden vklad, stovky společností 

 Už s pětistovkou nakoupíte celý koš společností díky frakčním podílům. Stačí poslat peníze a Portu je automaticky zainvestuje podle vašich představ. 

## Nechte se inspirovat 

Od amerických šampionů přes rozvojové trhy až po vodu nebo zlato. Z ETF a akcií jsme pro inspiraci připravili tematické kategorie, se kterými můžete investovat do různých oblastí i sektorů všude po světě. Tematický balíček může sloužit i jako základ vašeho portfolia. Poskládejte si to pravé portfolio a investujte podle svého přesvědčení.

### Načítám data

Vyčkejte, načítáme data pro tuto stránku.

## ETF, nebo akcie? Vyberte si obojí 

 Portfolio si můžete složit také sami. Vyberte si z pestrého seznamu známých amerických i evropských akcií, kterým věříte. Nebo pomocí ETF nakupte rovnou celý koš společností z daného sektoru či regionu. Akcie i ETF libovolně kombinujte a vytvořte si investici přesně podle svých představ. 

| Instrument (dle popularity) Martin Luňáček Řazení instrumentů vychází z jejich oblíbenosti mezi klienty Portu a z veřejně dostupných tržních dat, jako je velikost a obchodovanost instrumentu. Označení TOP je používáno u instrumentů reprezentujících klíčové společnosti, trhy nebo třídy aktiv, TRENDY u instrumentů navázaných na aktuální témata a NOVÉ u nově přidaných instrumentů v nabídce. Řazení ani označení instrumentů nepředstavují investiční doporučení ani poradenství. | Výkonnost 1R 3R 5L | Div. výnos | Rizikovost Martin Luňáček Rizikovost neboli volatilita, vyjádřena pomocí anualizované denní směrodatné odchylky výnosů. nízká (< 5 %) nízká až střední (5–10 %) střední (10–15 %) střední až vysoká (15–20 %) vysoká (> 20 %) Volatilita amerického indexu S&P 500 je dle aktuálních dat střední (14,08 %). Více o riziku se dočtete zde. |
| --- | --- | --- | --- |
| Načítám data Vyčkejte, načítáme data pro tuto stránku. | | | |

---

Title: Investor Plus - Analýzy, prognózy, zpravodajství, databanky, real-time data, poradenství, sms alerty, kalkulátory, korporátní informace, investice - Patria.cz
URL: https://www.patria.cz/patriaplus/investor/kalkulatory.html
Published: N/A
Author: Patria Online, a.s.
Highlights:
Investor Plus - Analýzy, prognózy, zpravodajství, databanky, real-time data, poradenství, sms alerty, kalkulátory, korporátní informace, investice - Patria.cz 

#### PX

2 720,56-2,13%

#### DAX

25 304,06-1,60%

#### CZK/€

24,327-0,04%

#### CZK/$

21,181 0,00%

#### AU

4 379,05 0,00%

#### BRT

104,09-1,43%

CHCI OBJEDNAT PLACENÉ SLUŽBY 

| Po internetu: | ZDE |
| --- | --- |
| Telefonem: | +420 221 424 332 |
| E-mailem: | info@patria.cz |
| Faxem: | +420 221 424 333 |
| Osobně: | Výmolova 353/3 150 27 Praha 5 |

AD Index Akcie Akcie - Denní statistiky Akcie - Investiční doporučení Akcie ČR - historie Akcie ČR - Týdenní přehled Akcie online - ČR Akcie online - Svět Akcie svět - Historie Akciový slovník Aktuální diskusní téma Analytický týdeník Analýzy - Akcie Analýzy společností - ČR Analýzy společností - Střední Evropa Analýzy společností - Svět Ankety a diskuze Archiv - Analýzy online Archiv - Deník událostí Archiv - Flash analýzy (svět) Archiv - Globální makroekonomické přehledy Archiv - Horké Zprávy Archiv - Kalendář událostí Archiv - Měnová politika Archiv - Měsíční makroekonomické přehledy Archiv - Souhrnné zprávy o vývoji ČR Archiv - Treasury alerty Archiv - Vývoj české koruny Archiv analýz - Makroukazatele Cenové indexy Cenový kalkulátor Ceny průmyslových výrobců - Data a prognózy (ČR) Ceny průmyslových výrobců - Graf (ČR) Ceny průmyslových výrobců - Kalendář (ČR) Ceny průmyslových výrobců - Zpravodajství CORPORATE WEB SOLUTION DATA EXPORT Databanka - Akcie Databanka - Ceny Databanka - Ekonomický růst Databanka - Indexy Databanka - Měnové kurzy Databanka - Trh práce Databanka - Úrokové sazby Databanka - Veřejné rozpočty Databanka - Zahraniční obchod a platební bilance Databanka akcie - ČR Databanka akcie - Svět Denní finanční zpravodaj Denní kalendář událostí Denní přehled - Akcie CEE Denní přehled - Akcie ČR Denní přehled - Akcie Svět Dlouhé sazby - CZK dluhopisy vs. Swapy Dlouhé sazby - Dlouhodobá výnosová křivka Dlouhé sazby - FRA sazby a úrokové swapy Dlouhé sazby - Globalní benchmarky Dlouhé sazby - Kalkulátor FRA sazeb Dlouhé sazby - Spread kotací Dlouhé sazby - Volatilita sazeb Dlouhodobé předpovědi CZK a úrokových mír Dlouhodobý kalendář událostí - ČR Dlouhodobý kalendář událostí - Svět Dluhopisy online - České státní dluhopisy Dluhopisy online - HZL ČR Doporučení - Akcie Doporučení - Státní dluhopisy ČR Ekonomický slovník Emisní kalendář státních dluhopisů Fixingy kurzů Fixingy mezibankovních sazeb Fondy Fondy KBC FOREX - Online Forwardy - Online FRA sazby online - CZK FRA sazby online - Další měny Grafy historie - akcie Grafy historie - indexy HDP - Data a prognózy (ČR) HDP - Graf (ČR) HDP - Kalendář (ČR) HDP - Zpravodajství Hloubka trhu Horké zprávy - Akcie Horké Zprávy - ČR Horké zprávy - Ekonomika Horké zprávy - Měny a sazby Horké Zprávy - Svět Charakteristika fondů Indexy - historie Inflace - Data a prognózy (ČR) Inflace - Graf (ČR) Inflace - Kalendář (ČR) Inflace - Zpravodajství Interaktivní graf - Měny Investiční doporučení Patria/KBC - CEE Investiční doporučení Patria/KBC - Historie Investiční doporučení Patria/KBC - Svět Investiční rozcestník INVESTOR PLUS IRS sazby online - CZK IRS sazby online - Další měny Kalkulovaná doporučení - Svět Komodity - Detailní graf Komodity - Energie přehled Komodity - Fixing kovů Komodity - Kovy přehled Komodity - Základní informace Krátké Komentáře Krátké sazby - Investiční kalkulátor Krátké sazby - Křížová tabulka/Úrokový diferenciál Krátké sazby - Spread kotací Krátké sazby - Srovnání vývoje sazeb Krátké sazby - Volatilita sazeb Krátké sazby - Vývoj sazeb Krátkodobé měnové předpovědi Makropřehled - Česká Republika Makropřehled - Kalendář událostí Maloobchodní tržby - Data a prognózy (ČR) Maloobchodní tržby - Graf (ČR) Maloobchodní tržby - Kalendář (ČR) Maloobchodní tržby - Zpravodajství Mapa trhů Měnová politika Měny - FX volatilita Měny - Globální benchmarky Měny - Křížová tabulka Měny - Spread kotací Měny - Srovnání výkonnosti měn Měny - Srovnání vývoje měn Měny - Volatilita kurzů Měny - Výkonnost Měsíční přehled - Akcie ČR Mezibankovní peněžní trh - Online Moje portfolio - historie Monitoring investičních doporučení Monitoring médií Mzdy - Data a prognózy (ČR) Mzdy - Graf (ČR) Mzdy - Kalendář (ČR) Mzdy - Zpravodajství Nastavení oblíbených titulů - Akcie a Deriváty Nastavení oblíbených titulů - Měny a Sazby Nejčtenější zprávy dne Nejčtenější zprávy týdne Nejdiskutovanější zprávy Nejobchodovanější akciové tituly Největší vzestupy/pády Nezaměstnanost - Data a prognózy (ČR) Nezaměstnanost - Graf (ČR) Nezaměstnanost - Kalendář (ČR) Nezaměstnanost - Zpravodajství (ČR) Obchodní bilnace - Data a prognózy (ČR) Obchodní bilnace - Graf (ČR) Obchodní bilnace - Kalendář (ČR) Obchodní bilnace - Zpravodajství Očekávané události Odhady vývoje CZK a úrokových mír Online Analýzy Patria doporučuje - Zajímavosti PATRIA PLUS Peněžní a devizový trh Placené služby Popis akcie Právě diskutujeme Prognózy Prognózy - Svět Průmyslová výroba - Data a prognózy (ČR) Průmyslová výroba - Graf (ČR) Průmyslová výroba - Kalendář (ČR) Průmyslová výroba - Zpravodajství Přehled aktivity na trhu Růstový potenciál - Akcie Rychlý výpis historie - Akcie Sazby - Online Sektorové přehledy - ČR Sloupek ekonoma Souhrn ETF Stavební výroba - Data a prognózy (ČR) Stavební výroba - Graf (ČR) Stavební výroba - Kalendář (ČR) Stavební výroba - Zpravodajství Škola investora Tecnická analýza - Dluhopisy Tecnická analýza - Sunrise Technická analýza - Akcie Technická analýza - CEE blue chips Technická analýza - CZK,PLN,HUF,SKK Technická analýza - USD,EUR,GBP,JPY Technická analýza AUD, CAD, GBP, CHF Trader´s talk Týdenní zpravodaj treasury Události dne Ukazatele - ČR Ukazatele - Svět Vyhledávání fondů Výkonnost fondů - Vyhodnocení Výkonnost indexů Výnosové indexy Zpravodajství - Ekonomika Zprávy Patria PLUS

---

Title: Investice, ekonomika a finance, kurzy, akcie, měny a komodity - Patria.cz
URL: https://www.patria.cz/
Published: N/A
Author: Patria Online, a.s.
Highlights:
Investice, ekonomika a finance, kurzy, akcie, měny a komodity - Patria.cz 

#### PX

2 583,78-1,52%

#### DAX

25 181,65-0,75%

#### CZK/€

24,307-0,01%

#### CZK/$

21,697-0,02%

#### AU

3 992,62 0,00%

#### BRT

112,92 2,64%

...

## Akcie online

| Název | Závěr k 23.10.2026 | Změna (%) |
| --- | --- | --- |
| COLTCZ | 829,00 | -2,47 |
| CSG | 335,10 | -0,27 |
| ČEZ | 1 368,00 | -0,15 |
| Doosan | 405,00 | -2,76 |
| E4U | 202,00 | -5,61 |
| ERSTE | 2 510,00 | -3,35 |
| Gevorkyan | 180,00 | 0,00 |
| KARO | 141,00 | -0,35 |
| KB | 993,50 | 0,00 |
| Kofola | 505,00 | 0,40 |
| MONETA | 186,50 | -3,52 |
| Photon | 6,30 | 0,00 |
| Pilulka | 90,00 | -7,22 |
| PM | 17 780,00 | 0,00 |
| Primoco | 640,00 | 0,31 |
| TMR | 362,00 | 0,00 |
| VIG

...

## Indexy online

| Měnový pár | Nejlepší nákup | Nejlepší prodej | Změna (%) | |
| --- | --- | --- | --- | --- |
| EUR/CZK | 24,3074 | 24,3527 | -0,01 | |
| USD/CZK | 21,6968 | 21,7348 | -0,02 | |
| EUR/USD | 1,1203 | 1,1204 | 0,01 | |
| USD/JPY | 156,8100 | 156,8570 | -0,02 | |
| GBP/USD | 1,3378 | 1,3380 | 0,05 | |
| EUR/HUF | 366,4575 | 367,0364 | 0,00 | |
| EUR/PLN | 4,4002 | 4,4061 | 0,01 | |
| Další | | | | |

24.10.2026 13:29:56

- CZK/EUR
- CZK/USD
- USD/EUR

Další kurzy měn

Měnová kalkulačka

 Objem: 100000 CZK 

 Výsledek: 

## Výsledková sezóna

3Q26 KALENDÁŘ USA 

3Q26 KALENDÁŘ EU

3Q26 KALENDÁŘ ČR

...

## Treasury online 

| Termín | Nejlepší nákup | Nejlepší prodej | Změna (%) | |
| --- | --- | --- | --- | --- |
| CZK 3M | 3,230 | 3,270 | -7,01 | |
| USD 3M | 4,180 | 4,380 | 0,35 | |
| EUR 3M | 2,620 | 2,920 | 4,33 | |
| CZK 1Y | 3,770 | 3,840 | -7,98 | |
| USD 1Y | 4,730 | 4,930 | -0,21 | |
| EUR 1Y | 3,110 | 3,410 | 2,03 | |
| CZK 10Y | 4,995 | 5,015 | 0,00 |

---

Title: Skvělé služby pro skutečné investory - Patria Finance
URL: https://finance.patria.cz/
Published: N/A
Author: N/A
Highlights:
## Zázemí bankovní skupiny ČSOB

Patria Finance patří do skupiny ČSOB. Na naši důvěryhodnost a zkušenosti se můžete spolehnout, již více než 30 let. 

## Online i osobně

Máme přehledné a kvalitní obchodní platformy Pro vaše samostatné investování, na PC i v mobilu. Pokud však preferujete osobní péči, i tu u nás najdete. 

## Vzdělávání a zpravodajství

Klademe velký důraz na kvalitu investičního zpravodajství. Ať už se na trzích stane cokoli, s námi o tom budete mít neustálý přehled. 

2 miliony investičních instrumentů

31 let na trhu

138 miliard Kč v aktivech

Investování nemusí být vhodné pro každého a jsou s ním spojená rizika.

## Online

Nejvíce klientů v Patrii investuje online přes mobilní aplikaci Patria Finance nebo webovou platformu WebTrader. Nejsou na to sami, protože mají k dispozici:

- investiční zpravodajství na webu Patria.cz
- investiční tipy našich analytiků v mobilní aplikaci Patria Finance a webovém portálu WebTrader
- oddělení Péče o klienty, které řeší klientské dotazy a požadavky
- oddělení Péče o VIP klienty, které individuálně pečuje o klienty s aktivy nad 5 mil CZK, ČSOB Premium a ČSOB Privátního bankovnictví.

...

## Pravidelně

V Patrii můžete investovat pravidelně do stále populárnějších burzovně obchodovaných fondů ETF, konkrétně do 97 pečlivě vybraných ETF od 3 investičních společností:

- celosvětově největšího správce aktiv BlackRock (iShares)
- evropské ETF jedničky Amundi
- KBC Asset Managementu z naší vlastní skupiny

Vyberte si ETF dle svých preferencí, a to se bude automaticky pravidelně každý měsíc nakupovat, již od 500 CZK. A pokud se vám investice do ETF líbí, ale nechcete si vybírat, je pro vás jako dělaný produkt od Patrie indigo.

...

## Pošlete si k nám peníze

Je to velmi jednoduché, mobilní aplikace Patria Finance i obchodní portál WebTrader vás jednoduše navede na ty správné sběrné účty v odpovídající měně, můžete si vygenerovat QR kód a jednoduše ho využít ve svém mobilním či elektronickém bankovnictví. A klienti ČSOB po založení účtu v Patrii najdou ve své aplikaci Smart dlaždici Patria Finance, ze které se jednorázový i trvalý příkaz snadno vytvoří.

...

## Vyberte si svou investici

Můžete začít pravidelnými investicemi, na výběr máte cca 97 různých burzovně obchodovaných fondů ETF a cca 30 podílových fondů – naleznete je v záložce Pravidelné investice. Nebo si najděte libovolnou akcii v sekci Obchodování/Najít, v mobilní aplikaci pod symbolem lupy. Vše je velmi intuitivní. Pokud vše zadáte správně, a burza je otevřena, obchod se zrealizuje. Pravidelné investice se nakupují vždy 15. dne v měsíci. Pro investice v USA budete potřebovat ještě vyplnit daňový formulář W-8BEN. Na jeho vyplnění v obchodní platformě WebTrader vás systém navede.

...

## E-mailové zpravodajství a tipy od analytiků

Naši analytici dávají klientům Investiční tipy na akcie, kterým věří. Najdete je jak v obchodní platformě WebTrader, tak v mobilní aplikaci Patria Finance pod názvem Investiční tipy. Tyto sekce se však zobrazí pouze klientům s vyplněným investičním dotazníkem.

Pravidelně vám budeme zasílat zajímavé informace ze světa trhů. Posíláme toho opravdu hodně, protože nechceme, abyste o něco přišli. Pokud byste o některé informace neměli zájem, můžete si nastavit v obchodní platformě WebTrader, jaké typy zpráv chcete odebírat, a jaké nikoli. A pokud si chcete informace vyhledávat sami, na našem zpravodajském portálu Patria.cz najdete vše podstatné ze světa investic a ekonomiky.

---

Title: Indigo: srozumitelné investování pro každého od Patria Finance
URL: https://indigo.patria.cz/
Published: N/A
Author: N/A
Highlights:
Indigo: srozumitelné investování pro každého od Patria Finance

Návratnost investice není vždy jistá, každá investice obnáší riziko ztráty celé investice. Výkonnost v minulosti není spolehlivým ukazatelem budoucích výsledků.

- ## Investuj jednoduše.

Řekni si kolik a jak často, o ostatní se postaráme my.

Začít investovat

Indigu důvěřují už tisíce spokojených investorů.
- ## Sdílej indigo a získej 500 Kč / 20 Eur na investování.

V naší aplikaci klikni na "Pozvat přátele".

Začít investovat

Indigu důvěřují už tisíce spokojených investorů.
- ## Investuj online.

Získej investiční aplikaci a začni budovat finanční nezávislost již dnes.

Začít investovat

Indigu důvěřují už tisíce spokojených investorů.
- ## Investuj bezpečně.

Indigo přináší Patria Finance, člen skupiny ČSOB.

Začít investovat

V Patria Finance mají klienti zainvestováno více než 80 miliard Kč.

### Výhodné

Výnosnější než spořící účet. Minimální investice již od 100 Kč. A k tomu extrémně nízké poplatky.

### Jednoduché

Nejjednodušší investování na trhu, které neobtěžuje svou složitostí a nesrozumitelností.

### Inteligentní

Pohyby na trhu sledujeme za Vás. Investujeme a přeskládáme vaše portfolio automaticky.

### Na míru

Investujeme na základě vašich osobních cílů a preferencí. Jednorázově nebo pravidelně. Jak právě uznáte za vhodné.

### Bezpečné

Nekompromisní bezpečnost vašich peněz i osobních údajů. Dohlíží na nás Česká Národní Banka.

## Začít je jednoduché, zkuste to nanečisto

### Vyberte si investiční cíl

Jen vy víte nejlépe, proč a kolik chcete investovat a co stojí za vaším rozhodnutím zhodnotit vaše peníze.

### My navrhneme individuální investiční strategii

Na základě vašich odpovědí a naší unikátní technologie navrhneme váš osobní investiční plán a portfolio.

### Když se vám bude líbit, založte si účet

Nakonec vám ukážeme predikci vývoje zhodnocení vašich peněz a je jen na vás, zda to s námi zkusíte a zaregistrujete se.
```

**Tool: websearch**

**Input:**
```json
{
  "numResults": 8,
  "query": "lead magnet landing page examples investing free report calculator email signup best practices"
}
```

**Output:**
```
Title: 7 Lead Magnet Ideas for Finance and Investing Sites
URL: https://raptorkit.com/lead-magnet-ideas-finance-investing-sites/
Published: 2025-12-30T12:15:28.000Z
Author: Vaayu
Highlights:
## 1. A Simple Retirement Calculator

 Few topics motivate action like retirement. A lightweight retirement calculator can be a powerful lead magnet because it personalizes an otherwise abstract goal. 

 This doesn’t need to be an advanced financial model. Even a basic calculator that estimates savings needs based on age, income, and contribution rate can deliver value while sparking curiosity. 

As The Currency notes: “Tools that simplify retirement planning transform abstract financial goals into actionable steps, motivating users to engage.”

Effective retirement calculator lead magnets often:

- Provide a quick snapshot rather than a full plan
- End with a results page gated by email
- Include a follow-up email explaining how to improve the outcome

 Free calculator builders and spreadsheet tools make this one of the fastest lead magnets to launch.

...

## 7. A CTA Placement Map for Maximum Conversions

 Even the best lead magnet underperforms if visitors never see it. A simple CTA placement strategy can dramatically improve opt-in rates. 

 High-converting finance sites often place lead magnets: 

- Mid-article, after a key insight
- At the end of the educational posts
- As exit-intent pop-ups on long reads

 Testing one primary lead magnet across multiple placements is often more effective than offering too many options at once.

---

Title: Free Calculator Landing Page: Grow Your Email List Fast | Calclet
URL: https://www.calclet.com/blog/how-to-use-a-free-calculator-landing-page-to-grow-your-email-list-fast
Published: 2026-03-21T05:17:26.000Z
Author: Calclet
Highlights:
### Fast Answer: The Formula

One keyword intent per URL + tool above the fold + headline result before email + helpful sections below for humans and search + instant deliverable in email #1 = list growth that scales with traffic.

## 1. Why a Standalone Page Beats “Just Embedding It Somewhere”

- Focus: no competing CTAs; higher completion rates.
- Measurement: clean analytics for source, scroll, and form starts.
- Paid social and search: send cold traffic to a coherent story.
- SEO: one H1 aligned with the query; easier to earn relevance than a generic tools page.
- Iteration: rewrite the hero without touching your entire site.

...

## 2. Page Structure That Converts (and Ranks)

Think in vertical bands. Skimmers and crawlers both reward clear hierarchy.

1. Hero: outcome headline (“Estimate your X in under 60 seconds”), subhead with who it is for, primary calculator block.
2. Trust strip: logos, stats, or reviewer quotes—short, not a novel.
3. How it works: three steps: enter inputs → see estimate → get full breakdown by email.
4. SEO body: H2s that match how people ask questions; explain assumptions and limitations.
5. FAQ: targets People Also Ask and reduces support noise.
6. Footer CTA: repeat the primary action for long scrollers.

For competitive keyword strategy around tools, see how to use calculators to rank for high-competition keywords and how to rank for free [X] calculator keywords.

...

## 3. The Email Gate Belongs After the Dopamine Hit

The same mechanic that closes enterprise pipeline applies to newsletters: show a credible headline number first. Then offer depth—PDF, scenario save, detailed assumptions—in exchange for email.

- Above gate: primary output + one line of context. Behind gate: breakdown, charts, or “email me this scenario” link. Never: zero feedback until submit—that trains visitors to bounce.

The full build narrative lives in how to build an ROI calculator for your SaaS—swap ROI for your calculator topic and the flow is identical.

### Speed = Subscribers

Heavy scripts kill mobile completion. Lazy-load non-critical assets; keep LCP on the hero and tool shell tight.

### Copy = Relevance

Use the same language as search queries in H1/H2s—without stuffing. One page, one primary intent.

...

You need publish speed, embeds, branding, and reliable lead capture. Compare platforms in top 5 lead generation calculator tools reviewed, then optimize completion with how to make a lead capture calculator that converts.

## Launch Checklist (Before You Spend on Ads)

- Mobile: thumb reach, no horizontal scroll, inputs large enough to tap.
- Email: double-check first automated message matches the on-page promise.
- Tags: calculator name + key input ranges flow into your ESP for segmentation.
- 404s: UTM tests—every campaign URL resolves.

---

Title: N/A
URL: https://founderpath.com/blog/free-tools-as-a-lead-magnet
Published: N/A
Author: N/A
Highlights:
Free tool marketing means offering a useful calculator, checker, generator or other small software tool at no charge to attract potential buyers and introduce them to your paid product. A tool becomes a lead magnet when it also gives you a way to capture a relevant contact or start a customer relationship.

...

## 23 free tool examples to adapt for your SaaS business

These are build ideas, not claims that each one has produced revenue. Choose the job your customers already need to do. The final column suggests a next step only if your paid product actually provides it.

| Example | Buyer | Free result | Possible paid next step |
| --- | --- | --- | --- |
| 1. CAC payback calculator | SaaS finance lead | Model acquisition spending against gross profit | Connect billing data for ongoing analysis |
| 2. Cash runway calculator | Founder planning a hire | Estimate how long cash covers net burn | Build a cash forecast with live accounts |
| 3. Pricing scenario calculator | SaaS operator | Compare revenue under stated assumptions | Analyze customer and plan-level pricing |
| 4. Salary budget calculator | Hiring manager | Estimate the cost of a planned team | Run payroll or compensation planning |
| 5. Invoice generator | Service business | Create an invoice from entered details | Track invoices and payments |
| 6. Subscription spend auditor | Finance team | Sum entered costs and flag renewal dates | Monitor spend and renewals |
| 7. UTM link builder | Marketer | Create a consistently tagged campaign URL | Report campaign performance |
| 8. Email subject-line preview | Lifecycle marketer | Preview a subject in a chosen format | Build and test an email campaign |
| 9. Landing-page headline generator | Growth team | Draft headlines from supplied positioning | Run a page experiment |
| 10. Social image resizer | Social media manager | Export an image at selected dimensions | Schedule and manage the campaign |
| 11. Video compressor | Video creator | Reduce file size with stated settings | Edit and publish the video |
| 12. Transcript formatter | Content team | Format an existing transcript | Manage a recording and editing workflow |
| 13. Meeting cost calculator | Team lead | Estimate cost from time and hourly inputs | Improve scheduling or meeting workflows |
| 14. Project brief generator | Project manager | Turn supplied requirements into a brief | Assign work and track delivery |
| 15. Time-zone overlap finder | Distributed team | Find shared working hours | Schedule across team calendars |
| 16. Capacity planner | Operations manager | Compare available hours with planned work | Manage staffing and allocation |
| 17. Job description builder | Recruiter | Draft requirements from role inputs | Run an applicant pipeline |
| 18. Interview scorecard generator | Hiring team | Create consistent assessment criteria | Collect and compare interview feedback |
| 19. Onboarding checklist builder | People team | Create a role-specific task list | Automate the employee workflow |
| 20. CSV format validator | Data operator | Check a file against a defined structure | Automate recurring data imports |
| 21. JSON formatter | Developer | Format and validate supplied JSON | Use related developer tooling |
| 22. API request builder | Developer | Construct a request from endpoint inputs | Manage integration workflows |
| 23. Accessibility contrast checker | Designer | Check foreground and background contrast | Audit and maintain the design system |

Source: Founderpath editorial examples, October 2026; these are proposed use cases, not measured company outcomes.

...

## How do you create a free tool lead magnet?

- Write a short brief naming the buyer, input, output and paid next step.
- Validate demand through customer conversations and searches; inspect what existing tools fail to answer.
- Build the smallest version that completes the job, with understandable assumptions and errors.
- Publish a page that explains the result and offers a relevant next action.
- Instrument the funnel and review support, maintenance and operating costs before scaling distribution.

...

## Should a free tool require an email address?

Ask for an email when it serves a clear purpose, such as sending a report or saving a result. Let users see enough value to understand what they will receive. Explain what happens after signup and distinguish delivery of the requested result from optional marketing messages.

For a quick calculator or checker, an immediate result may be the better starting point. Offer an optional export, saved analysis or deeper workflow afterward. For a tool that requires costly processing, make limits and delivery times clear before someone submits their data.

Compare gated and ungated versions on qualified contacts and paying customers from the same audience and observation window. A gate can increase the share of visitors who enter an email while reducing how many finish the task. Neither change alone proves the business gained customers.

---

Title: Retirement Investment Guide Download Page | CRO Breakdown
URL: https://www.apexure.com/landing-page-examples/retirement-investment-landing-page
Published: 2026-03-28T00:00:00.000Z
Author: Waseem Bashir
Highlights:
## Conversion strategy

This is a soft-conversion page. The visitor isn’t being asked to commit money, sign a contract, or book a call. They’re being asked to accept something free. That dramatically lowers the conversion barrier, which is exactly right for a high-consideration financial product. The strategy is to exchange a high-quality resource for contact information, then nurture the lead with follow-up content before introducing a harder conversion ask.

The lead magnet model for finance

Guide downloads convert at 3–5x the rate of direct consultation booking pages for financial services audiences. The visitor doesn't feel sold to. They feel helped. That positive first interaction creates the relationship foundation that makes the eventual follow-up call feel like a natural continuation rather than a cold pitch.

---

Title: Financial Advisor Lead Magnets That Convert (12 Best) | OJay Media
URL: https://www.ojaymediamarketing.com/blog/financial-advisor-lead-magnets/
Published: 2026-04-26T17:02:35.000Z
Author: Oliwer Jonsson
Highlights:
### 1. Retirement Income Calculator

This is the single highest-converting lead magnet format in financial services, full stop.

Why it works: it is interactive, personalized, and addresses the #1 fear of every pre-retiree — running out of money. A prospect inputs their current savings, expected retirement age, spending needs, and Social Security estimate. The tool outputs a "retirement readiness score" and identifies the income gap. At the end, the call to action is a consultation to discuss closing that gap.

A well-built retirement calculator typically converts 18-26% of ad traffic into leads — roughly 3x the rate of a static PDF on the same topic. The interactive element drives completion because prospects feel they are getting something personalized, not just downloading generic content.

Building this right: The calculator does not need to be custom-coded. Tools like Riskalyze (now Nitrogen Wealth), eMoney, or simple JavaScript widgets can be embedded in a landing page. What matters is that your calculator outputs something meaningful, not just "call us." Give them a number — a projected monthly income, a savings gap, a years-to-depletion estimate. Numbers create urgency that PDFs cannot.

Compliance note: Do not present calculator outputs as guaranteed or projected returns on investment. Frame results as estimates based on assumptions, with a clear disclaimer that actual results may vary and that the tool does not constitute personalized investment advice.

Distribution: Facebook and Instagram video ads perform exceptionally well for retirement calculators when the ad creative leads with the income gap question ("Do you know exactly how much monthly income you'll have in retirement?"). For advisors targeting the 55-70 demographic, this is a primary channel. See our full guide on Facebook ads for financial advisors for targeting specs.

---

Title: Ticker Data Command Gen Z Investment Account Landing Page Template
URL: https://www.rocket.new/templates/momentum-intelligent-youth-investing-landing-page-template
Published: 2026-03-04T00:00:00.000Z
Author: Rocket
Highlights:
# Gen Z Finance Specialist Professional Website Template

The Ticker Data Command Gen Z Investment Account Landing Page Template is a dark-mode, data-forward landing page built for young investors. It combines an animated stats wall, a zigzag comparison journey, and a two-step progressive form to turn first-time visitors into account sign-ups. Everything runs on a Navy Authority color system with volt green calls to action and a built-in growth simulator for email capture.

...

## Quick summary

This template gives fintech brands a ready-to-deploy investment landing page designed around how Gen Z actually thinks about money and stocks. The layout opens with a live-styled data wall, moves through three alternating comparison sections, and closes with a growth calculator that captures email before revealing results. It is focused on conversions from the first pixel to the final form field.

...

## What you get with this template

You get a fully structured, single-page investment landing page with five distinct section blocks and a clear conversion path. Every layout decision is backed by the source brief, so there is no guesswork about what to build or how to arrange it. The template handles both the visual hierarchy and the interactive logic flow.

- An animated stats wall header with typewriter headline, count-up data points, and floating metrics covering account open time, fractional share minimum, and a live account counter
- Three zigzag comparison sections contrasting the old way versus the Ticker way, each with alternating left-right panel layout, muted tactical slate panels for legacy content, and volt green accents for modern solutions
- A two-step progressive form for email and age capture in step one, full name and phone in step two, plus a secondary growth simulator that reveals a projected five-year balance and collects email on result

...

#### Two-Step Progressive Form

The sign-up form breaks the account opening process into two clear steps. Step one asks only for email and age to confirm eligibility. Step two expands to full name and phone with a toggle for a text download link. This approach reduces friction and acknowledges that younger users abandon long forms instantly.

#### Growth Simulator with Email Capture

A lightweight calculator lets visitors type in a weekly deposit amount and explore a projected five-year balance based on historical market returns. The result is withheld until the visitor provides an email address, turning curiosity into a conversion. This tool turns passive browsers into trackable leads without aggressive pressure.

---

Title: We Breakdown 5 Lead Magnet Landing Page Examples (Plus Actionable Tips)
URL: https://www.growform.co/lead-magnet-landing-page/
Published: 2025-02-04T10:20:16.000Z
Author: Harvey Carpenter
Highlights:
### 6. Free Report/Guide

Free reports make effective lead magnets, offering valuable insights in exchange for contact details. Brain Biotech’s landing page delivers this with a professional design, guiding visitors through a CEO letter, strategic highlights, and key figures, with a clear option to download the full report.

#### Why This Landing Page Works

- Organized Navigation: Clear menus and section links make it easy for visitors to move between sections.
- CEO Letter: The letter reinforces the authority of the report, making the insights feel trustworthy.
- Strategic Focus: Highlights growth opportunities and R&D advancements upfront, increasing the incentive to download.
- Direct Download CTA: The clearly positioned CTA button simplifies access to the report, reducing friction and boosting conversions.
- Compelling Use of Figures: Key metrics are presented visually, providing quick proof that encourages deeper engagement.

#### What Could be Improved?

- Highlight Key Findings: A concise summary of the most important takeaways in the report could capture attention quickly and boost conversions.
- Streamline Navigation: Reducing the number of links and secondary options on the page would help keep visitors focused on the main call to action.
- Make CTA Prominent: Bring the CTA button to the Hero section of the page, just after the first heading, “Brain Biotech” annual report 2023/2024.
- Capture Leads: Use Growform to build a form to capture leads for remarketing purposes.

...

### 7. Toolkit

Free tools are effective lead magnets, offering immediate value in exchange for a small commitment. HubSpot’s email signature generator landing page highlights its signature tool with a clean design, clear CTA, and minimal distractions for quick sign-ups.

#### Why This Landing Page Works

- Clear Headline: Visitors instantly know they’re getting a free email signature generator without confusion.
- Prominent CTA: The “Create my signature” button is large and prominent, guiding users to act right away.
- Minimal Distractions: The uncluttered layout keeps the focus on completing the tool instead of wandering elsewhere.
- Trust through Simplicity: The straightforward design emphasizes function and speed, reducing barriers to engagement.
- Social Proof: A testimonial from a recognizable brand adds credibility and reinforces the tool’s value.

#### What Could be Improved?

- Illustrate Interface Features: Showing tool options, like logo upload, formatting, or styling, can help users understand the ease of customization.
- Highlight Ease and Security: A brief note on data and privacy protection could reassure visitors and improve conversions.
- Highlight Integration Potential: Explaining how signatures can be used across email platforms would highlight practical value.

---

Title: High-Converting Lead Magnet Landing Page: Expert Tips & Examples
URL: https://www.convertsite.com/blog/lead-magnet-landing-page-examples
Published: N/A
Author: N/A
Highlights:
## The Anatomy of Successful Lead Magnet Landing Pages

A lead magnet landing page is a single place dedicated to gathering people's contact details, typically email addresses. It can be a gated page, keeping site visitors focused on the action desired by the company.

What does it typically consist of? Let's overview the main elements that make a landing page compelling enough to convert visitors into leads:

- headline (appeals to a specific problem or need; for instance, "Unlock Your Financial Future Today");
- visuals (a hero image, infographic, video library, extending the promise of the headline);
- copy (an explanation of your lead magnet, why it is beneficial, and what the visitor stands to gain).

These elements should align with your lead magnet's purpose. It involves giving promises that the magnet can keep, using relevant images, and crafting persuasive copy with bullet points, social proof, and a call to action at the end.

...

## 2. Eltex

Screenshot taken on the official Eltex website

Eltex is a Belgian solar energy startup that assists residential and business clients with purchasing and installing solar panels, battery systems, and EV charging stations. It's also one of ConvertCalculator's clients. On its page, you can see the interactive calculator to measure savings and system sizes. Let's see what it does well on its lead magnet landing page.

- Interactive calculator that engages users and provides them with valuable information;
- The unique selling propositions (savings, quality assurance, and lifetime service) are clearly stated;
- The lead magnet takes the focal part of the page, matching the website's overall color scheme and typography.
- Immediate value (potential savings calculations and a €400 to €700 discount code upon completion).

Areas for improvement:

- As users leave personal information, the company can eliminate their doubts by giving data privacy reassurance, such as privacy policy and how the data will be used.
- It's not very clear what will happen after submitting the information. The interactive lead magnet may specify whether agents will schedule a meeting or send an email with more personalized information.
- The lead capture form may have provided explanatory tooltips, such as a pop-up detailing different terms. For example, "With a certain inclination" could be described as "This means your roof is angled and not flat, typically

...

## 4. Madison Marquette

Screenshot taken on the official Madison Marquette website

The real estate player Madison Marquette presents a simple and professionally-looking landing page with several lead magnets throughout the website. Let's focus on one of them.

- Focused content: You won't get tired of this page. All you see is a concise introduction to the State of Retail report with a few bullet points casting light on what you're going to get. It can be a strong draw for the target audience in the commercial real estate sector.
- A simple sign-up form: There is only one action required: typing in your email address.

Areas for improvement:

- Engagement features: Incorporating more interactive elements, like videos or infographics, could enhance page activity and participation.
- Lack of preview or teaser: What's included in the report? A snippet, sneak peek, or graphical abstract could help potential subscribers gauge the content’s relevance and quality before submitting their email.

...

## Best Practices for Lead Magnet Landing Pages

So, what lessons have we learned from the lead magnet examples above? Here’s an in-depth look at some essentials to remember when crafting your lead magnet landing page to maximize the opt-in rate, boost the conversion rate, and acquire new leads.

### Use Strong CTAs

Great lead magnets display CTAs that tell users what to do next. They should be prominent, use action-oriented language, and explain what the person commits to. You may use contrasting colors or place the CTAs strategically after compelling content that underscores their value.

### Leverage Testimonials

As seen in popular lead magnets, they're usually accompanied by social proof. Reviews and testimonials can significantly influence decision-making. Yet, they should be authentic, relate to the target audience's potential concerns, and highlight the benefits of the offer.

### Preserve Consistency in Branding

Your landing pages and lead magnets are part of the overall user experience. So, maintain a consistent brand image in terms of colors, fonts, and messaging. Visitors should understand they're on your website if they've arrived from your marketing campaigns.

### Optimize Speed and Mobile Design

Performance optimization ensures the landing page loads rapidly without delaying the content. How can you achieve that? There are various strategies, from working on the code to compressing images. Consider your lead magnet landing page design and see where you can accelerate the loading.

A similar rule applies to the website's mobile version. Check how convenient your lead magnet, pop-up lead form, and CTA buttons are on a smartphone. Mobile-friendliness involves:

- responsive design;
- fast loading times;
- navigable interfaces on smaller screens.

Pay attention to page analysis and tools like Google PageSpeed Insights, Google Analytics (GA), and heat mapping software like Hotjar. Based on metrics such as time on page, bounce rate, and conversion rate, pinpoint what's working and what's not.

### Test the Landing Page

Test everything you can:

- colors;
- buttons;
- images;
- headlines;
- the phrasing of your CTAs;
- the overall layout of your lead magnet landing pages.

For example, even the wording of your headline or the page structure may impact the user response. If you test two different versions of the same element (i.e., conduct A/B testing), you might uncover which one drives better outcomes. Utilizing tools like VWO or Google Optimize can help streamline this process.

### Integrate with Email Marketing Automation Tools

Connecting your lead magnet strategy with email marketing automation platforms enables you to minimize the effort to sustain communication with prospects. As soon as they order free consultation or complete the multi-step form, the system logs their activity and sends targeted emails, such as:

- a follow-up message;
- a welcome email;
- exclusive offers;
- invitations, etc.

This allows you to leverage lead generation campaigns, transforming initial interest into active engagement.

### Keep the Lead Magnet Dynamic and Personalized

Create content that ensures active participation. Whether it's a map, calculator, or infographic, dynamic and personalized
```

---

## Assistant (Plan · MiMo-V2.6-Flash Free · 73.6s)

_Thinking:_

The user asked me to search investor landing pages and list things these pages have. I've done 4 searches covering: fintech SaaS landing pages, robo-advisor sites (Betterment/Wealthfront/Acorns), Czech platforms (Portu, Fondee, Patria, Indigo), and lead magnet/investing calculator pages.

Now compile a structured summary of common elements/patterns. This is informational — no plan needed really, but plan mode is active so just answer with findings. I should keep it useful and organized, maybe grouped: hero, social proof, interactive elements, trust, forms, legal, etc. Also note which ones our page already has and which are gaps (useful for their Zadanie B).

Let me write a well-organized answer in Slovak. Should be concise but informative — user asked to "vypísať mi nejaké veci" (list some things). A categorized list is appropriate. Maybe end with what's missing on our page as potential improvements.

Prešiel som príklady: fintech/SaaS landing pages (Stripe, Revolut), robo-advisors (Betterment, Wealthfront, Acorns), české platformy (Portu, Fondee, Indigo/Patria) a lead-magnet stránky s kalkulačkami. Tu je čo sa opakuje:

## 1. Hero (první obrazovka)
- **Jedno číslo jako headline** — Wealthfront dává obří APY číslo (~120 px) místo věty; Portu „10,39 % průměrný roční výnos"; Fondee „až 11,7 %"
- **Jedna primární CTA** (ne dvě soutěžící) + maximálně jedna vedlejší — „Get started" / „Začít investovat"
- **Subheadline kdo je to pro** + mikrotext pod tlačítkem odstraňující obavu („bez závazku", „zdarma", „no credit card")
- Důvěra hned v první viewport (loga, dohled ČNB, počet klientů)

## 2. Interaktivní nástroj jako hlavní prvek
- **Kalkulačka přímo v hero nebo hned pod ním** — Portu („Zjistěte, kolik vám investování vydělá"), Fondee, Acorns (kalkulačka na jeden scroll), Wise (živý konvertor s jmény konkurentů PayPal apod.)
- **Výsledek ZOBRAZIT PŘED e-mailem** — pravidlo „email gate až po dopamine hit": návštěvník nejdřív vidí číslo, pak teď nabídka „pošlu ti detail/rozpad/uložení e-mailem" (Calclet, Founderpath)
- Wealthfront: kvíz → personalizované portfolio → „pošlete mi to e-mailem" — přesně náš model

## 3. Důvěra a social proof
- **Čísla místo log**: „350 000+ klientů, 77 mld. Kč" (Portu), „27 000+ klientů" (Fondee), „1,5M+, $100B+" (Wealthfront)
- **Regulační status jako prodejní argument**: „pod dohledem ČNB", „člen skupiny ČSOB", FDIC/BaFin — a to **vedle CTA, ne v patičce**
- Hodnocení hvězdičkami + počet recenzí (Monarch: 4,8★ z 2 700 recenzí)
- Logo wall (media/časopisy) až dole jako finální potvrzení po přečtení
- Dlouhý legal blok ve footeru = signál regulovanosti (Wealthfront to bere jako feature)

## 4. Struktura stránky (překvapivě konzistentní arc)
Hero (hook) → Problem/Value → Nástroj/kalkulačka → Srovnání/features → Social proof → FAQ (námitky) → Závěrečné CTA. Lepší stránky střídají tmavé/světlé bandy pro rytmus (Wealthfront, Public.com).

## 5. Formulář a konverze
- **Minimální polia** — 1 e-mail; dvoukrokové formuláře jen u registrace účtu
- **Friction reducery pod tlačítkem**: „Zrušíte kdykoli", „Žádná kreditní karta", „Neodesíláme dál"
- Druhá konverze pro nepřipravené: newsletter v patičce (Sharevest), exit-intent nabídka
- „Jak začít ve 3 krocích" (Portu: poznáme vás → ověření → pošlete peníze)

## 6. Zákonitosti, které mají všichni
- **Disclaimer u každého čísla**, ne jen dole: „minulé výnosy nejsou zárukou budoucích" je u Portu i Fondee přímo pod kalkulačkou, s vysvětlením modelu výpočtu (dokonce rozklikávací „Více informací o modelovém odhadu")
- Mobil-first, rychlé načtení (žádné těžké knihovny)
- Často **kvíz jako mezikrok** místo přímé registrace (Portu: „Nevíte, kterou investici vybrat? Vyplňte kvíz")

---

**Čo z toho naša stránka nemá a stojí za zváženie:**
1. **Číselný social proof** (dôveryhodnosť bez klamstva — napr. „12 zdrojov", „údaje z oficiálnych fact sheetov") — máme iba trust line v hero
2. **Vysvetlenie modelu výpočtu priamo pod kalkulačkou** ako rozklik (Portu/Fondee) — máme odstavec, ale bez možnosti „Více info"
3. **Druhá, nízkofrekvenčná konverzia** pre nepripravených (odber tipov v patičke)
4. **„Ako začať v 3 krokoch"** máme v sekci „Ako to funguje" — to sedí

Chceš niečo z toho dorobiť do stránky, alebo to bol len prieskum?

---

## User

urob 2.

---

## Assistant (Build · MiMo-V2.6-Flash Free · 39.3s)

_Thinking:_

The user wants item 2: "Vysvetlenie modelu výpočtu priamo pod kalkulačkou ako rozklik (Portu/Fondee) — máme odstavec, ale bez možnosti „Více info"".

So: add an expandable "Více informací o modelovém výpočtu" details under the calculator (similar to Portu's "Více informací o modelovém odhadu").

Current state: in index.html, `.result__assumption` paragraph inside calc__result. I should convert it into a <details> element styled nicely on the dark background, with fuller explanation of the model: assumptions (8% p.a. gross, monthly compounding, TER deducted from net return, no tax/inflation, sources for 10% historical average), what's not included, source links.

Let me edit index.html: replace the `.result__assumption` paragraph with a `<details class="assumption">` containing a summary "Více informací o modelovém výpočtu" and expanded content.

Also add CSS for `.assumption` details styled for dark green background.

Content of the details (Czech):
- Model: hrubý výnos 8 % p.a., měsíční složené úročení
- Poplatek TER: stržený z čistého výnosu ročně (modelově)
- Prečo 8%: konzervatívny odhad; S&P 500 od 1957 ≈ 10 % p.a. (Fidelity), Damodaran 10,02 % 1928–2025
- Nezohledňuje: inflaci, daň z prodeje (15 % z zisku nad 100 tis. Kč ročně? actually CZ: prodej cenných papírů zdanění — u US ETF held > 3 years exempt... keep simple: daň z prodeje, měnové výkyvy CZK/USD, transakční poplatky brokera
- Zdroje TER: fact sheety
- Upozornění: minulé výnosy nejsou zárukou

Also note that the disclaimers: “Nejde o investiční doporučení.”

Let me make the edit. Current HTML block:

```html
            <p class="result__assumption">
              Model: hrubý výnos 8 % p.a. (konzervativní odhad; průměr S&amp;P 500 od roku 1957
              je ≈ 10 % p.a. dle Fidelity, 2026), měsíční složené úročení, poplatek stržený z čistého
              výnosu. Nepočítá s daní z prodeje ani inflací.
            </p>
```

Replace with details:

```html
            <details class="assumption">
              <summary>Více informací o modelovém výpočtu</summary>
              <div class="assumption__body">
                <p><strong>Jak počítáme:</strong> hrubý výnos 8 % p.a., měsíční složené úročení, poplatek TER se strhává ročně z čistého výnosu na rostoucím zůstatku.</p>
                <p><strong>Proč 8 %:</strong> konzervativní odhad. Průměr S&P 500 od roku 1957 je ≈ 10 % p.a. (Fidelity, 2026); Damodaran (NYU Stern) uvádí 10,02 % p.a. za období 1928–2025 včetně dividend.</p>
                <p><strong>Co model nezohledňuje:</strong> inflaci, daň z prodeje, kurz CZK/USD, poplatky brokera za obchod. Výsledek je model, ne predikce.</p>
                <p><strong>Zdroje poplatků (TER):</strong> Vanguard, iShares, State Street, Invesco, Schwab – oficiální fact sheety, 2026. Kompletní seznam zdrojů je v tabulce výše i v patičce.</p>
                <p>Nejde o investiční doporučení. Minulé výnosy nejsou zárukou výnosů budoucích.</p>
              </div>
            </details>
```

CSS: summary styled as a link-like item with chevron, body text small, semi-transparent on dark.

```css
.assumption { border-top: 1px dashed rgba(250,247,242,.22); padding-top: 14px; }
.assumption summary {
  cursor: pointer; font-size: 13px; font-weight: 600;
  color: rgba(250,247,242,.85); list-style: none;
  text-decoration: underline; text-underline-offset: 3px;
}
.assumption summary::-webkit-details-marker { display: none; }
.assumption summary::after { content: " ▾"; ... }
```

Wait — `.result__assumption` class currently exists in CSS. I'll replace/add `.assumption` styles. Keep old class (unused) or remove. I'll replace the old `.result__assumption` rule with `.assumption` styles.

Also mobile check: details inside dark card, fine.

Let me edit index.html and style.css.

Dávam pod kalkulačku rozklik „Více informací o modelovém výpočtu" v štýle Portu/Fondee.

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\index.html",
  "newString": "            <details class=\"assumption\">\n              <summary>Více informací o modelovém výpočtu</summary>\n              <div class=\"assumption__body\">\n                <p><strong>Jak počítáme:</strong> hrubý výnos 8&nbsp;% p.a., měsíční složené úročení.\n                Poplatek (TER) se strhává ročně z čistého výnosu na rostoucím zůstatku – proto se\n                jeho dopad s časem násobí.</p>\n                <p><strong>Proč 8&nbsp;%:</strong> záměrně konzervativní odhad. Průměr S&amp;P 500\n                od roku 1957 je ≈ 10&nbsp;% p.a. (Fidelity, 2026); Damodaran (NYU Stern) uvádí\n                10,02&nbsp;% p.a. za období 1928–2025 včetně dividend. Nižší číslo snižuje riziko\n                nadsazení výsledku.</p>\n                <p><strong>Co model nezohledňuje:</strong> inflaci, daň z prodeje, kurzové riziko\n                CZK/USD ani poplatky brokera za obchod. Jde o model, ne o predikci.</p>\n                <p><strong>Zdroje poplatků:</strong> Vanguard, iShares, State Street, Invesco a\n                Schwab – oficiální fact sheety a prospekty, 2026 (uvedené pod srovnávací tabulkou).</p>\n                <p class=\"assumption__legal\">Nejde o investiční doporučení ani nabídku. Minulé\n                výnosy nejsou zárukou výnosů budoucích.</p>\n              </div>\n            </details>",
  "oldString": "            <p class=\"result__assumption\">\n              Model: hrubý výnos 8 % p.a. (konzervativní odhad; průměr S&amp;P 500 od roku 1957\n              je ≈ 10 % p.a. dle Fidelity, 2026), měsíční složené úročení, poplatek stržený z čistého\n              výnosu. Nepočítá s daní z prodeje ani inflací.\n            </p>"
}
```

**Output:**
```
Edit applied successfully.
```

**Tool: edit**

**Input:**
```json
{
  "filePath": "C:\\Users\\BigON\\Desktop\\clientelo\\assets\\css\\style.css",
  "newString": ".assumption {\n  border-top: 1px dashed rgba(250, 247, 242, .22);\n  padding-top: 14px;\n}\n.assumption summary {\n  cursor: pointer;\n  list-style: none;\n  font-size: 13.5px;\n  font-weight: 600;\n  color: rgba(250, 247, 242, .85);\n  text-decoration: underline;\n  text-underline-offset: 3px;\n}\n.assumption summary::-webkit-details-marker { display: none; }\n.assumption summary::after { content: \" +\"; color: #FF9E7A; font-weight: 700; }\n.assumption[open] summary::after { content: \" –\"; }\n.assumption summary:hover { color: #fff; }\n.assumption__body { margin-top: 12px; display: grid; gap: 10px; }\n.assumption__body p {\n  margin: 0;\n  font-size: 13px;\n  line-height: 1.6;\n  color: rgba(250, 247, 242, .72);\n}\n.assumption__body strong { color: rgba(250, 247, 242, .95); }\n.assumption__legal { color: rgba(250, 247, 242, .5) !important; }",
  "oldString": ".result__assumption { margin: 0; font-size: 12.5px; line-height: 1.55; color: rgba(250, 247, 242, .6); }"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 15.7s)

_Thinking:_

Verify the changes render — quick check with local server? Let me just verify HTML structure quickly (grep) and maybe run the static server briefly to confirm 200. Quick sanity check.

**Tool: bash**

**Input:**
```json
{
  "command": "$h = Get-Content -Raw index.html; if ($h -match 'class=\"assumption\"' -and $h -match 'Více informací o modelovém výpočtu' -and $h -notmatch 'result__assumption') { \"HTML OK\" } else { \"check HTML\" }; Select-String -Path assets\\css\\style.css -Pattern \"\\.assumption summary\" -Quiet"
}
```

**Output:**
```
check HTML
True

```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 8.7s)

_Thinking:_

The check said "check HTML" — likely because `result__assumption` still appears somewhere, or one of the conditions failed. Let me grep the file to see.

**Tool: grep**

**Input:**
```json
{
  "pattern": "result__assumption|class=\"assumption\"|Více informací",
  "path": "C:\\Users\\BigON\\Desktop\\clientelo"
}
```

**Output:**
```
Found 6 matches
C:\Users\BigON\Desktop\clientelo\session-ses_e91c.md:
  Line 2660:   "content": "<!DOCTYPE html>\n<html lang=\"cs\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>ETF na NYSE: kolik vás stojí poplatky? | Srovnání VOO, IVV, SPY a dalších</title>\n  <meta name=\"description\" content=\"Porovnejte 6 nejpopulárnějších ETF obchodovaných na NYSE a spočítejte si, kolik vás během let připraví poplatky. Osobní report do e-mailu za 30 sekund.\">\n  <meta property=\"og:title\" content=\"Vaše ETF vás může připravit o 237 000 Kč. Spočítejte si to za 30 sekund.\">\n  <meta property=\"og:description\" content=\"Srovnání poplatků (TER) u ETF VOO, IVV, SPY, QQQ, VTI a SCHD s kalkulačkou dopadu na vaše portfólio. Zdarma, bez registrace.\">\n  <meta property=\"og:type\" content=\"website\">\n  <meta property=\"og:locale\" content=\"cs_CZ\">\n  <meta name=\"theme-color\" content=\"#0F3D2E\">\n  <link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230F3D2E'/%3E%3Ctext x='16' y='22' font-family='Georgia' font-size='16' fill='%23FAF7F2' text-anchor='middle'%3E%E2%82%AC%3C/text%3E%3C/svg%3E\">\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n  <link href=\"https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\">\n  <link rel=\"stylesheet\" href=\"/assets/css/style.css\">\n</head>\n<body>\n\n  <header class=\"topbar\">\n    <div class=\"wrap topbar__inner\">\n      <a href=\"/\" class=\"brand\" aria-label=\"ETF Poplatky – domů\">\n        <span class=\"brand__mark\">ETF</span>\n        <span class=\"brand__name\">Poplatky.cz</span>\n      </a>\n      <nav class=\"topbar__nav\">\n        <a href=\"#srovnani\" class=\"topbar__link\">Srovnání</a>\n        <a href=\"#kalkulacka\" class=\"...
  Line 2682:   "content": ":root {\n  --bg: #FAF7F2;\n  --bg-alt: #F2EDE4;\n  --ink: #14231C;\n  --ink-soft: #4A5B52;\n  --green: #0F3D2E;\n  --green-dark: #0A2B21;\n  --accent: #E4572E;\n  --accent-dark: #C9461F;\n  --line: #E3DBCC;\n  --card: #FFFFFF;\n  --radius: 14px;\n  --shadow: 0 10px 30px rgba(15, 61, 46, 0.08);\n  --font-display: \"Fraunces\", Georgia, serif;\n  --font-body: \"Inter\", system-ui, -apple-system, sans-serif;\n}\n\n* { box-sizing: border-box; }\n\nhtml { scroll-behavior: smooth; }\n\nbody {\n  margin: 0;\n  font-family: var(--font-body);\n  font-size: 17px;\n  line-height: 1.6;\n  color: var(--ink);\n  background: var(--bg);\n  -webkit-font-smoothing: antialiased;\n}\n\nimg { max-width: 100%; }\n\n.wrap { width: min(1120px, 100% - 40px); margin-inline: auto; }\n.wrap.narrow { width: min(760px, 100% - 40px); }\n.center { text-align: center; }\n\n.num { font-variant-numeric: tabular-nums; font-feature-settings: \"tnum\"; }\n.accent { color: var(--accent); }\n.strong { font-weight: 700; }\n.muted { color: var(--ink-soft); }\n\n/* ---------- tlačítka ---------- */\n.btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  padding: 14px 26px;\n  border: 0;\n  border-radius: 999px;\n  background: var(--accent);\n  color: #fff;\n  font: 600 16px/1.2 var(--font-body);\n  text-decoration: none;\n  cursor: pointer;\n  transition: background .15s ease, transform .15s ease, box-shadow .15s ease;\n  box-shadow: 0 6px 18px rgba(228, 87, 46, 0.25);\n}\n.btn:hover { background: var(--accent-dark); transform: translateY(-1px); }\n.btn:active { transform: translateY(0); }\n.btn--lg { padding: 18px 32px; font-size: 17px; }\n.btn--sm { padding: 10px 18px; font-size: 14px; }\n.btn--block { display: flex; width: 100%; }\n.btn--ghost {\n  background: transparent;\n  color: var(--green);\n  box-shadow: none;\n  border: 1.5px solid var(--line);\n}\n.btn--ghost:hover { background: #fff; border-color: var(--green); }\n\n/* ---------- topbar ...
  Line 4757: Více informací o modelovém odhadu

  Line 5817: - **Disclaimer u každého čísla**, ne jen dole: „minulé výnosy nejsou zárukou budoucích" je u Portu i Fondee přímo pod kalkulačkou, s vysvětlením modelu výpočtu (dokonce rozklikávací „Více informací o modelovém odhadu")


C:\Users\BigON\Desktop\clientelo\index.html:
  Line 193:             <details class="assumption">

  Line 194:               <summary>Více informací o modelovém výpočtu</summary>

```

---

## Assistant (Build · MiMo-V2.6-Flash Free · 22.2s)

_Thinking:_

The grep results show: index.html has the details block (lines 193-194) ✓. The `result__assumption` matches are only in `session-ses_e91c.md` (a session log file, not part of the project) — that's why my earlier "check HTML" test failed (it read index.html but... wait, my test read index.html and failed one of the conditions). Let me re-check: condition was `$h -match 'class="assumption"' -and $h -match 'Více informací o modelovém výpočtu' -and $h -notmatch 'result__assumption'`.

Hmm, grep for `result__assumption` in index.html didn't match (only session file). But my PowerShell test failed. Why? Possibly encoding: `Get-Content -Raw` without -Encoding UTF8 in Windows PowerShell 5.1 reads ANSI by default — "Více informací" contains í which in UTF-8 read as ANSI would be garbled → -match failed. That's the likely cause. The grep tool (which handles UTF-8) confirms the file is fine.

So the HTML is correct. Let me verify with grep for result__assumption only in index.html: not present ✓ (only in session log).

Also verify CSS assumption styles exist (already confirmed True earlier).

Quick final render check via server not strictly needed. Also the session-ses_e91c.md file — that's some session log in the workspace; not mine to manage (it was pre-existing? It appeared — probably a log of this conversation written by tooling). Leave it.

Done. Summarize.

Všetko sedí — `result__assumption` v `index.html` už nie je (zostal len v starom session logu; predchádzajúci „check HTML" zlyhal kódovaním v PowerShell, nie súborom).

Hotovo:
- **`index.html`** — pod výsledkami kalkulačky pribudol rozklik `<details class="assumption"> „Více informací o modelovém výpočtu` v štýle Portu/Fondee: ako počítame (8 % p.a., mesačné skládanie, TER z čistého výnosu), prečo 8 % (Fidelity ≈10 % od 1957, Damodaran 10,02 % 1928–2025), čo model nezahŕňa (inflacia, daň, kurz, poplatky brokera), zdroje TER a právny disclaimer
- **`style.css`** — štýl `assumption` pre tmavý kontext kalkulačky (podtrhnutý summary s `+`/`–` markerom, zladená typografia, legal riadok tlmený)

---

## User

sks mi napr navrhnut sposob, ako by som mohol dat nejake grafy napr. alebo podobne veci oficialnych akcii z newyorskej brzy

---

## Assistant (Plan · MiMo-V2.6-Flash Free · 47.7s)

_Thinking:_

The user asks: "skús mi napr navrhnúť spôsob, ako by som mohol dať nejaké grafy napr. alebo podobné veci oficiálnych akcií z newyorskej burzy" — propose a way to add charts / similar things of official stocks from the NYSE.

Plan mode active — read-only, propose a plan/approach. I should research options: free stock data APIs for NYSE/NASDAQ data, charting libraries that work with vanilla JS (since stack is pure HTML/CSS/JS), licensing considerations.

Key considerations:
- Our stack: static HTML + vanilla JS, no build step, deployed on Vercel
- Data needs: price history of ETFs (VOO, IVV, SPY, QQQ, VTI, SCHD) — official data from NYSE (well, NYSE Arca mostly)
- Legal: redistribution of market data has licensing constraints (exchange data licensing). Free sources: Stooq (free CSV, no key), Yahoo Finance chart API (unofficial, CORS issues), Alpha Vantage (free key, 25 req/day), Financial Modeling Prep, Twelve Data, Tiingo, marketstack (free tier), FRED for indices.

Options:
1. **Static/built-in data (offline snapshots)** — download historical data once (e.g., Stooq CSV or S&P 500 historical from Damodaran/spglobal), bake into JSON in repo, render with lightweight chart lib (Chart.js, uPlot, ApexCharts, or hand-rolled SVG). Pros: no API key, no CORS, fast, no server, GDPR-simple. Cons: not live, needs periodic refresh. For a lead magnet landing page, historical/long-term charts are actually what matters (compound growth, fee erosion), not live quotes.

2. **Client-side API (free tier)** — Alpha Vantage / Twelve Data / Finnhub with API key in `?` — exposes key, rate limits, CORS mostly allowed. For production landing pages, calling third-party APIs from browser = rate limit abuse risk + data licensing issues.

3. **Vercel serverless proxy** — `/api/quote?symbol=SPY` that fetches from Stooq/Alpha Vantage server-side with caching (Vercel KV/edge cache headers). Keeps key hidden, caches. More complexity.

4. **Official-ish sources**: 
   - Stooq (stooq.com) — free CSV daily history: `https://stooq.com/q/d/l/?s=voo.us&i=d` — works, but CORS? stooq doesn't send CORS headers typically → need serverless proxy.
   - Yahoo Finance chart endpoint: `https://query1.finance.yahoo.com/v8/finance/chart/VOO?range=10y&interval=1mo` — unofficial, may need proxy due to CORS/crumb.
   - Nasdaq/NYSE official sites don't provide free APIs.

Chart libs (vanilla, no build):
- **uPlot** (~45KB, fastest, canvas)
- **Chart.js** (~200KB, popular, easy)
- **ApexCharts** (~100KB+ nice defaults)
- **Lightweight-charts** (TradingView's open-source — very fitting for stock charts, free, ~45KB)

Given our design (editorial, tabular numbers), a nice idea: 
- **Graf 1: „Stejná investice, různé poplatky"** — line chart comparing final value with 0.03% vs 0.41% TER over 25 years (derived from our calculator model, static data, no API at all!). This directly supports the conversion story.
- **Graf 2: Historický výnos S&P 500** — long-term index chart (monthly data baked as JSON from a verified source, e.g., Damodaran dataset or stooq ^spx), showing compound growth of 100 Kč/10 000 Kč since 1957/1993.
- **Graf 3 (interactive): Vývoj cen ETF** — daily/monthly closes of VOO/IVV/SPY/QQQ etc. via data snapshot or proxy API.

Also could embed TradingView widget (official embed, free) — but ads/widgets of third parties add tracking/consent issues (GDPR/ePrivacy in CZ) and slow page — worth mentioning as an option with cons.

Data licensing note: exchange data redistribution — end-of-day delayed data generally OK for educational display; real-time quotes licensed. For a lead magnet, use EOD/delayed data with attribution and disclaimer.

Compliance with the assignment: "Použite skutočné dáta s uvedením zdroja" — charts with sources fit nicely.

I should propose a concrete recommended approach + alternatives, maybe ask which direction they want (static model chart vs historical prices vs live quotes). Given plan mode, I can research a bit (websearch allowed — read-only) to confirm Stooq CORS etc. Let me do a quick search to verify data source options and their CORS/free-tier status to make the plan accurate.

Let me search: "Stooq CSV API CORS free historical data", "Twelve Data free tier", "Alpha Vantage CORS", "Lightweight-charts vs uPlot vanilla".

Maybe 2 searches suffice.

**Tool: websearch**

**Input:**
```json
{
  "numResults": 6,
  "query": "free historical stock price API CORS browser no key Stooq Alpha Vantage Twelve Data daily ETF data 2026"
}
```

**Output:**
```
Title: Free Historical Market Data - Stooq
URL: https://stooq.com/db/h/
Published: N/A
Author: Stooq
Highlights:
Free Historical Market Data - Stooq

Current Data | Historical Data | How to (Metastock) 

Last update: 24 Oct 2026, 02:45 CEST 

| | | Daily | | Hourly | | 5 Minutes | |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | ASCII | Metastock (without data) | ASCII | Metastock (without data) | ASCII | Metastock (without data) |
| | Folder | daily | | hourly | | 5 min | |
| World | world | 185 MB | 0.6 MB | 260 MB | 0.6 MB | 584 MB | 0.6 MB |
| U.S. | us | 517 MB | 3.4 MB | 461 MB | 3.4 MB | 767 MB | 3.4 MB |
| U.K. | uk | 161 MB | 2.5 MB | 186 MB | 2.5 MB | 226 MB | 2.5 MB |
| Japan | jp | 226 MB | 1.8 MB | | | | |
| Hong Kong | hk | 105 MB | 4.1 MB | 45 MB | 0.8 MB | 66 MB | 0.8 MB |
| Poland | pl | 195 MB | 3.5 MB | 31 MB | 1.9 MB | 35 MB | 1.9 MB |
| Hungary | hu | 1.7 MB | 0.0 MB | 1.1 MB | 0.0 MB | 1.0 MB | 0.0 MB |
| Macroeconomy | macro | 0.9 MB | 0.2 MB | | | | |

Preferred folders structure (Click on a folder to view its contents)

| Local Disk (C:) data 5 min 5 min hk hk hkex drs (2) hkex etfs (210) hkex stocks (2993) hkex stocks (2993) 1 (2000) 2 (993) hu hu bse etfs (2) bse stocks (72) pl pl nc indices (2) nc pre-emptive rights (0) nc stocks (346) wse bonds (1026) wse certificates (64) wse etfs (48) wse futures (345) wse indices (56) wse options (760) wse pre-emptive rights (0) wse stocks (411) wse stocks intl (49) wse structured products (4117) wse structured products (4117) 1 (2000) 2 (2000) 3 (117) uk uk lse etfs (4801) lse etfs (4801) 1 (2000) 2 (2000) 3 (801) lse stocks (1896) lse stocks intl (3607) lse stocks intl (3607) 1 (2000) 2 (1607) us us nasdaq etfs (976) nasdaq stocks (4673) nasdaq stocks (4673) 1 (2000) 2 (2000) 3 (673) nyse etfs (2899) nyse etfs (2899) 1 (2000) 2 (899) nyse stocks (4495) nyse stocks (4495) 1 (2000) 2 (2000) 3 (495) nysemkt etfs (0) nysemkt stocks (330) world world bonds (284) cryptocurrencies (205) currencies (1822) currencies (1822) major (68) other (1754) indices (59) indices cfds (15) stooq stocks indices (13) daily daily hk hk hkex cbbcs (6303) hkex cbbcs (6303) 1 (2000) 2 (2000) 3 (2000) 4 (303) hkex corporate bonds (0) hkex drs (2) hkex dws (6885) hkex dws (6885) 1 (2000) 2 (2000) 3 (2000) 4 (885) hkex etfs (210) hkex reits (1) hkex stocks (2993) hkex stocks (2993) 1 (2000) 2 (993) hkex treasury bonds (3) hu hu bse etfs (2) bse stocks (72) jp jp tse corporate bonds (0) tse etfs (540) tse futures (141) tse indices (3) tse options (2196) tse options (2196) 1 (2000) 2 (196) tse stocks (3896) tse stocks (3896) 1 (2000) 2 (1896) tse treasury bonds (338) macro macro at (20) au (25) be (7) br (17) ca (31) ch (21) cn (11) cz (24) de (29) dk (14) es (17) eu (27) fr (25) gr (23) hu (17) ie (22) in (14) is (12) it (26) jp (31) kr (22) lt (22) mx (20) my (19) nl (14) no (21) nz (20) ph (8) pl (24) pt (15) ro (15) se (21) sg (17) sk (17) tr (24) uk (35) us (79) za (20) pl pl funds balanced (193) funds bond (636) funds commodity (67) funds equity (1356) funds mixed (132) funds money market (133) funds other (1055) funds stable growth (127) nc indices (2) nc indices indicators (10) nc pre-emptive rights (0) nc stocks (346) nc stocks indicators (1038) wse bonds (1026) wse certificates (64) wse etfs (48) wse futures (345) wse indices (56) wse indices indicators (210) wse options (760) wse pre-emptive rights (0) wse stocks (411) wse stocks indicators (1221) wse stocks intl (49) wse structured products (4117) wse structured products (4117) 1 (2000) 2 (2000) 3 (117) uk uk lse etfs (4801) lse etfs (4801) 1 (2000) 2 (2000) 3 (801) lse stocks (1896) lse stocks intl (3607) lse stocks intl (3607) 1 (2000) 2 (1607) us us nasdaq etfs (976) nasdaq stocks (4673) nasdaq stocks (4673) 1 (2000) 2 (2000) 3 (673) nyse etfs (2899) nyse etfs (2899) 1 (2000) 2 (899) nyse stocks (4495) nyse stocks (4495) 1 (2000) 2 (2000) 3 (495) nysemkt etfs (0) nysemkt stocks (330) world world bonds (284) cryptocurrencies (205) currencies (1822) currencies (1822) major (68) other (1754) indices (59) indices cfds (15) money market (25) stooq stocks indices (13) hourly hourly hk hk hkex drs (2) hkex etfs (210) hkex stocks (2993) hkex stocks (2993) 1 (2000) 2 (993) hu hu bse etfs (2) bse stocks (72) pl pl nc indices (2) nc pre-emptive rights (0) nc stocks (346) wse bonds (1026) wse certificates (64) wse etfs (48) wse futures (345) wse indices (56) wse options (760) wse pre-emptive rights (0) wse stocks (411) wse stocks intl (49) wse structured products (4117) wse structured products (4117) 1 (2000) 2 (2000) 3 (117) uk uk lse etfs (4801) lse etfs (4801) 1 (2000) 2 (2000) 3 (801) lse stocks (1896) lse stocks intl (3607) lse stocks intl (3607) 1 (2000) 2 (1607) us us nasdaq etfs (976) nasdaq stocks (4673) nasdaq stocks (4673) 1 (2000) 2 (2000) 3 (673) nyse etfs (2899) nyse etfs (2899) 1 (2000) 2 (899) nyse stocks (4495) nyse stocks (4495) 1 (2000) 2 (2000) 3 (495) nysemkt etfs (0) nysemkt stocks (330) world world bonds (284) cryptocurrencies (205) currencies (1822) currencies (1822) major (68) other (1754) indices (59) indices cfds (15) stooq stocks indices (13) |
| --- |

---

Title: data/collectors/stooq.py
URL: https://github.com/yfuka86/finance/blob/33346dc6/data/collectors/stooq.py
Published: N/A
Author: N/A
Highlights:
"""
Stooq data collector.
Free, no API key required. Provides daily OHLCV for US & JP ETFs.
"""
import io
import time
import requests
import pandas as pd

# Stooq blocks requests without a browser User-Agent (returns a 404/HTML page),
# and rate-limits CSV downloads per IP (serves a JS "verify your browser" page).
_HEADERS = {
 "User-Agent": (
 "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
 "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
 )
}

def _to_stooq_ticker(ticker: str) -> str:
 if ticker.endswith(".T"):
 return ticker.replace(".T", ".jp")
 if ticker.startswith("^"): # indices, e.g. ^spx, ^ndq, ^nkx
 return ticker.lower()
 return f"{ticker.lower()}.us"

def download_stooq(ticker: str, start: str, end: str) -> pd.DataFrame:
 """Download daily OHLCV from Stooq. Returns empty on block/no-data."""
 stooq = _to_stooq_ticker(ticker)
 d1 = start.replace("-", "")
 d2 = end.replace("-", "")
 url = f"https://stooq.com/q/d/l/?s={stooq}&d1={d1}&d2={d2}&i=d"
 resp = requests.get(url, timeout=30, headers=_HEADERS)
 text = resp.text
 # A real CSV starts with the header row; an HTML body means block/limit/no-data.
 if resp.status_code != 200 or not text.lstrip().startswith("Date,"):
 return pd.DataFrame()
 df = pd.read_csv(io.StringIO(text), parse_dates=["Date"], index_col="Date")
 df = df.sort_index()
 time.sleep(0.5)
 return df

---

Title: Alpha Vantage API Documentation
URL: https://www.alphavantage.co/documentation/
Published: N/A
Author: N/A
Highlights:
Spanning over 130 endpoints, our market data APIs are grouped into 9 broad asset classes / categories: (1) Core Time Series Stock Data APIs covering stocks, ETFs, and mutual funds, (2) Index Data APIs, (3) Options Data APIs, (4) Alpha Intelligence covering news and sentiments, earnings call transcripts, insider transactions, congressional/politician trades, institutional holdings, top gainers and losers, and other market insights, (5) Fundamental Data, (6) Forex and Crypto Currencies (e.g., Bitcoin), (7) Commodities, (8) Economic Indicators, and (9) Technical Indicators - also outlined here. Examples in this documentation are for demo purposes. Claim your free API key today to explore our full API offerings!

## Time Series Stock Data APIs

This suite of APIs provides global equity data in 4 different temporal resolutions: (1) daily, (2) weekly, (3) monthly, and (4) intraday, with 25+ years of historical depth and split/dividend-based adjustments. For US markets specifically, our data also includes deep, consolidated NBBO quotes/trades/volumes, minute-level aggregates, and snapshots across exchanges, dark pools, and FINRA TRFs. A lightweight ticker quote endpoint and several utility functions such as ticker search and market open/closure status are also included for your convenience.

...

#### TIME_SERIES_DAILY

This API returns raw (as-traded) daily time series (date, daily open, daily high, daily low, daily close, daily volume) of the global equity specified, covering 25+ years of historical data. The OHLCV data is sometimes called "candles" in finance literature. If you are also interested in split/dividend-adjusted data, please use the Daily Adjusted API, which covers adjusted close values and historical split and dividend events.

###### API Parameters

❚ Required: `function`

The time series of your choice. In this case, `function=TIME_SERIES_DAILY`

❚ Required: `symbol`

The name of the equity of your choice. For example: `symbol=IBM`

❚ Optional: `outputsize`

By default, `outputsize=compact`. Strings `compact` and `full` are accepted with the following specifications: `compact` returns only the latest 100 data points; `full` returns the full-length time series of 25+ years of historical data. The "compact" option is recommended if you would like to reduce the data size of each API call. The "compact" outputsize is available to both free and premium API keys. The "full" outputsize is available to premium keys. Please subscribe to any premium membership plan to unlock the outputsize=full capability.

❚ Optional: `datatype`

By default, `datatype=json`. Strings `json` and `csv` are accepted with the following specifications: `json` returns the daily time series in JSON format; `csv` returns the time series as a CSV (comma separated value) file.

❚ Required: `apikey`

Your API key. Claim your free API key here.

###### Examples (click for JSON output)

Sample ticker traded in the United States

`https://www.alphavantage.co/query?**function**=TIME_SERIES_DAILY&**symbol**=IBM&**apikey**=demo`

`https://www.alphavantage.co/query?**function**=TIME_SERIES_DAILY&**symbol**=IBM&**outputsize**=full&**apikey**=demo`

Sample ticker traded in UK - London Stock Exchange

`https://www.alphavantage.co/query?**function**=TIME_SERIES_DAILY&**symbol**=TSCO.LON&**outputsize**=full&**apikey**=demo`

Sample ticker traded in Canada - Toronto Stock Exchange

`https://www.alphavantage.co/query?**function**=TIME_SERIES_DAILY&**symbol**=SHOP.TRT&**outputsize**=full&**apikey**=demo`

Sample ticker traded in Canada - Toronto Venture Exchange

`https://www.alphavantage.co/query?**function**=TIME_SERIES_DAILY&**symbol**=GPV.TRV&**outputsize**=full&**apikey**=demo`

Sample ticker traded in Germany - XETRA

`https://www.alphavantage.co/query?**function**=TIME_SERIES_DAILY&**symbol**=MBG.DEX&**outputsize**=full&**apikey**=demo`

Sample ticker traded in India - BSE

`https://www.alphavantage

...

#### Quote Endpoint Trending

This endpoint returns the latest price and volume information for a ticker of your choice. You can specify one ticker per API request.

If you would like to query a large universe of tickers in bulk, you may want to try out our Realtime Bulk Quotes API, which accepts up to 100 tickers per API request.

###### API Parameters

❚ Required: `function`

The API function of your choice.

❚ Required: `symbol`

The symbol of the global ticker of your choice. For example: `symbol=IBM`.

❚ Optional: `datatype`

By default, `datatype=json`. Strings `json` and `csv` are accepted with the following specifications: `json` returns the quote data in JSON format; `csv` returns the quote data as a CSV (comma separated value) file.

❚ Optional: `entitlement`

This parameter controls the freshness of the data returned. By default, `entitlement` is not set and historical data is returned. Setting the parameter to `entitlement=realtime` will return realtime US market data. Setting the parameter to `entitlement=delayed` will return 15-minute delayed US market data.

❚ Required:

---

Title: Free Stock Market Data API — Real-Time & Historical
URL: https://twelvedata.com/stocks
Published: N/A
Author: N/A
Highlights:
# Free Stock Market Data API — Real-Time & Historical

## Stream real-time prices and pull decades of history for 190,000+ stocks on 250+ exchanges in 90+ countries — one API, JSON/CSV, free tier with 800 requests/day.

Start now Contact sales

### A legacy of market data

From early beginnings to today, explore the trends and patterns shaping
every era of the global markets.

#### Historical range

Starting at each market’s earliest known records—often reaching back decades—up to 1980, with intervals anywhere between daily snapshots and month summaries.

#### Intraday range

Available from 2022 onward, with intervals from 1 minute to 8 hours. Actual start dates and interval options may vary by market.

Historical range 1 day to 1 month intervals

Intraday range 1 minute to 8 hour intervals

1980 2022 Today

Example for US markets

#### Free tier

800 requests per day on the free stock API plan, real-time US stocks included.

#### Global coverage

190,000+ stocks, 250+ exchanges, 90+ countries.

#### Real-time streaming

~170 ms WebSocket streaming for live prices.

#### Built for developers

JSON & CSV, with SDKs for Python, Node.js, Go, C++, C#, Java, and R.

#### Tick by tick

Real-time tick by tick data grants full control over the current stock quotes.

#### Intervals

API data is accessible in various aggregated intervals from 1‑minute to 1-month.

#### Low latency

Institutional grade low latency (170ms) data streaming via WebSocket.

...

API docs WebSocket docs

```
curl "https://api.twelvedata.com/time_series?symbol=AAPL&interval=1min&apikey=your_api_key"

```

API WebSocket

...

##### FAQ

### Questions? Answers.

Which stock market API is free?

Twelve Data's Basic plan is free and includes real-time US stock market data — 800 API requests per day with no credit card required. Paid tiers add international exchanges, higher limits, and WebSocket streaming.

Is Nasdaq API data free?

Yes — real-time data for US exchanges, including Nasdaq and NYSE, is available on Twelve Data's free Basic plan within the daily request limit.

How do I get stock market data for free?

Sign up for a free API key, then call any endpoint — for example `https://api.twelvedata.com/price?symbol=AAPL&apikey=your_key`. You get 800 requests per day for free, in JSON or CSV, with SDKs for Python, Node.js, Go, and more.

Which stock API is the most accurate?

Accuracy depends on the data source: Twelve Data sources directly from exchanges and established commercial providers, streams with ~170 ms latency, and maintains a 99.95% uptime SLA — the same feeds used by institutional clients.

---

Title: Real-Time & Historical Stock Market Data APIs
URL: https://www.alphavantage.co/stock_api_landing/
Published: N/A
Author: N/A
Highlights:
# Real-Time & Historical Stock Market Data APIs

Institution-grade market data for dashboards, trading bots, and financial research — free forever.

View Documentation Get Free API Key

terminal

$curl "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo"

Run

...

## Comprehensive Market Coverage

### Equities

100,000+ symbols covered globally

Real-time & 20+ years of historical OHLCV

Fundamentals + technical indicators

### Options

Realtime and historical US options

OPRA compliant feeds

Greeks and implied vols

### FX + Crypto

500+ currencies (physical/digital)

Realtime spot + historical intraday

Daily, weekly, and monthly historical data

### ETFs

OHLCV data for 4,600+ ETFs

Real-time, intraday and historical data

ETF profile/holdings available

### Commodities

Metals (Gold, Silver, Copper, Aluminum)

Energy (WTI, Brent, Nat Gas) + Ags

Historical and spot where applicable

## One API key. 100+ market data endpoints.

### Asset Class

Equities

ETFs

Options

Commodities

FX

Crypto

### Type of Data

Price Data

Fundamentals

Technical Indicators

Sentiment

...

## About

Alpha Vantage

Backed by the prestigious Y Combinator and composed of a tight-knit community of AI researchers,

...

## Welcome to Alpha Vantage!

Your dedicated access key is:

Please record this API key at a safe place for future data access.

Support/FAQ Documentation

## Get Your Free API Key

Please complete the information below to receive your access key

Which of the following best describes you?

Select an option... Investor Software Developer Educator Student Other

Organization (e.g. company, university, etc.):

Email:

Get My API Key

---

Title: Fin-node Data API — free stock market data as JSON (no key, no rate limit)
URL: https://www.fin-node.net/api
Published: N/A
Author: N/A
Highlights:
Fin-node Data API — free stock market data as JSON (no key, no rate limit)

# Fin-node Data API

Free stock-market data as static JSON. No key. No rate limit. Built for humans and AI agents.

100% free No API key No rate limit CORS-open Daily snapshot

Daily end-of-day snapshot — not real-time, not investment advice. For the live price, use the quote box on any Fin-node article. Covers the 30 tickers we actively write about.

## 🐝 For AI agents & LLMs

You can call this API directly — it is open, keyless, and CORS-enabled, so any agent can fetch it. To answer a question about a US-listed company, fetch its bundle:

```
GET https://www.fin-node.net/api/NVDA.json
```

Each bundle carries `prices`, `indicators`, `fundamentals`, `statements`, `insider`, and `news`. Start from `/api/index.json` for the covered-ticker list and the bundle schema. When you use this data, please cite Fin-node (fin-node.net).

...

## Endpoints

| URL | Returns |
| --- | --- |
| `/api/index.json` | Manifest — covered tickers, bundle schema, generated time |
| `/api/.json` | Full bundle for one ticker (fields below) |
| `/api/news.json` | Latest Fin-node market news across all tickers |
| `/api/openapi.json` | OpenAPI 3.1 spec — import into Postman/Insomnia, or generate a client |

## Quick start

```
# curl
curl -s https://www.fin-node.net/api/NVDA.json | jq .fundamentals

// JavaScript
const d = await (await fetch("https://www.fin-node.net/api/NVDA.json")).json();
console.log(d.prices.at(-1), d.indicators.rsi.at(-1));

# Python
import requests
d = requests.get("https://www.fin-node.net/api/NVDA.json").json()
print(d["fundamentals"], d["news"][0])
```

...

## Per-ticker bundle

| Field | Shape |
| --- | --- |
| `prices` | daily OHLCV rows: Date, Open, High, Low, Close, Volume |
| `indicators` | SMA / EMA / MACD / RSI / Bollinger / ATR / VWMA — each a date+value series |
| `fundamentals` | P/E, margins, EPS, market cap and more |
| `statements` | balance_sheet, cash_flow, income_statement (quarterly) |
| `insider` | insider transactions |
| `news` | Fin-node's own coverage: date, headline, url, tickers |

Example: `/api/NVDA.json`. Compiled from public market data, plus Fin-node's own news.
```

**Tool: websearch**

**Input:**
```json
{
  "numResults": 6,
  "query": "Lightweight-charts TradingView open source vs uPlot vs Chart.js vanilla JS no build performance stock chart"
}
```

**Output:**
```
Title: tradingview/lightweight-charts: Performant financial ...
URL: https://github.com/tradingview/lightweight-charts
Published: N/A
Author: N/A
Highlights:
TradingView Lightweight Charts™ are one of the smallest and fastest financial HTML5 charts.

The Lightweight Charts™ library is the best choice for you if you want to display financial data as an interactive chart on your web page, or replace static image charts with interactive ones. It does this without affecting your web page's loading speed and performance.
The size of the library is close to static images but if you have dozens of image charts on a web page then using this library can make the size of your web page smaller.

The library provides a rich set of charting capabilities out of the box, but you can also extend its functionality by building custom plugins. Browse the plugin catalog for ready-made plugins, or see the interactive plugin examples and plugin-examples/README.md to build your own.

...

### Build variants

|Dependencies included|Mode|ES module|IIFE (`window.LightweightCharts`)|
|-|-|-|-|
|No|PROD|`lightweight-charts.production.mjs`|N/A|
|No|DEV|`lightweight-charts.development.mjs`|N/A|
|Yes (standalone)|PROD|`lightweight-charts.standalone.production.mjs`|`lightweight-charts.standalone.production.js`|
|Yes (standalone)|DEV|`lightweight-charts.standalone.development.mjs`|`lightweight-charts.standalone.development.js`|

...

## License

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this software except in compliance with the License.
You may obtain a copy of the License in the LICENSE file.
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

This software incorporates several parts of tslib (, (c) Microsoft Corporation) that are covered by BSD Zero Clause License.

This license requires specifying TradingView as the product creator.
You shall add the "attribution notice" from the NOTICE file and a link to to the page of your website or mobile application that is available to your users.
As thanks for creating this product, we'd be grateful if you add it in a prominent place.
You can use the `attributionLogo` chart option for displaying an appropriate link to on the chart itself, which will satisfy the link requirement.

---

Title: bench/table.md
URL: https://github.com/leeoniya/uPlot/blob/master/bench/table.md
Published: N/A
Author: N/A
Highlights:
# bench/table.md

- Branch: master
- Repository: leeoniya/uPlot

---

| lib | size | done | js,rend,paint,sys | heap peak,final | mousemove (10s) |
| ---------------------- | ------- | ------- | ----------------- | --------------- | ------------------- |
| uPlot v1.6.24 | 47.9 KB | 34 ms | 51 2 1 34 | 21 MB 3 MB | 218 360 146 196 |
| Chart.js v4.2.1 | 254 KB | 38 ms | 90 2 1 40 | 29 MB 10 MB | 1154 46 165 235 |
| Flot v3.0.0 | 494 KB | 60 ms | 105 5 1 52 | 41 MB 21 MB | --- |
| ECharts v5.4.1 | 1000 KB | 55 ms | 148 3 1 35 | 17 MB 3 MB | 1943 444 203 208 |
| dygraphs v2.2.1 | 132 KB | 90 ms | 163 2 1 33 | 88 MB 42 MB | 1438 371 174 268 |
| LightningChart® v4.0.2 | 1300 KB | --- ms | 250 2 1 33 | 33 MB 13 MB | 5390 120 128 325 |
| CanvasJS v3.7.5 | 489 KB | 130 ms | 266 4 1 35 | 98 MB 69 MB | 1030 445 90 246 |
| dvxCharts v5.1.0 | 373 KB | 160 ms | 264 23 1 62 | 100 MB 61 MB | 687 779 206 197 |
| Highcharts v10.3.3 | 413 KB | --- ms | 416 7 1 38 | 97 MB 55 MB | 1286 824 205 242 |
| Plotly.js v2.18.2 | 3600 KB | 310 ms | 655 14 1 40 | 104 MB 70 MB | 1814 163 25 208 |
| ApexCharts v3.37.1 | 503 KB | 685 ms | 694 9 1 33 | 175 MB 46 MB | 1708 421 106 207 |
| ZingChart v2.9.10 | 871 KB | 681 ms | 717 7 1 105 | 290 MB 195 MB | 9021 305 41 71 |
| amCharts v5.3.7 | 625 KB | --- ms | 1601 3 3 46 | 147 MB 121 MB | 9171 71 460 167 |

---

Title: Lightweight Charts™ library — TradingView
URL: https://www.tradingview.com/lightweight-charts/
Published: N/A
Author: N/A
Highlights:
Lightweight Charts™ library — TradingView

# Lightweight Charts™ 

 An entire library of unparalleled usability, at just 35 KB. 

 Free, open-source, and feature-rich

Your dream of tiny, yet mighty, interactive charts is now a reality.

Super compact

HTML5 Canvas technology is no larger than a standard GIF file.

Streaming updates for custom data

Most recent data is displayed in real-time without having to reload the page.

Open-source

Maintained by TradingView, hosted on GitHub, and Apache 2.0 licensed — Lightweight Charts is open-source and welcomes contributions.

High-performance

Engineered to work with huge data arrays. Our charting solutions remain responsive even with thousands of bars, and even when multiple updates with new ticks are happening every second.

For devs, by devs

Designed with developers in mind — no matter what level you're at. The library is easy to integrate: intuitive, flexible, and fully documented.

Full styling control

Customization to suit your style. Choose from presets to copy and paste, or make your own to make your charts feel like they were built just for your UI.

Interactive, responsive, and mobile-ready

Built for seamless interaction across devices. Whether it's desktop precision or mobile swipes, our charts adapt easily to any screen.

Accessible by design

We're building with accessibility in mind — to ensure every user, everywhere, can interact with our charts confidently and the product is compliant with the leading accessibility standards.

---

Title: Chart.js vs Lightweight Charts vs TradingView for Charts in 2026
URL: https://www.index.dev/skill-vs-skill/tradingview-vs-lightweight-charts-vs-chartjs
Published: N/A
Author: N/A
Highlights:
## Performance Benchmarks

Criteria TradingView Chart.js Lightweight Charts

Build Time

2-4 seconds for initial chart load, lightweight library integration adds ~500ms to build

2-5 seconds for typical projects, 10-15 seconds for large dashboards with multiple chart types

Fast - typically 2-5 seconds for production builds with tree-shaking and minification

Runtime Performance

60 FPS rendering with hardware acceleration, handles 10,000+ data points smoothly, optimized WebGL rendering for complex indicators

60 FPS rendering for up to 10,000 data points, drops to 30-45 FPS beyond 50,000 points without optimization

Excellent - 60 FPS rendering with hardware acceleration, handles 10,000+ data points smoothly, optimized canvas rendering

Bundle Size

~450KB minified library core, ~1.2MB with full charting features, tree-shakeable to ~200KB for basic implementations

186 KB minified, 61 KB gzipped (full build), tree-shakeable to ~40 KB for basic charts

~45-50 KB minified and gzipped (standalone version), highly optimized for web delivery

Memory Usage

Base: 15-25MB, scales to 50-80MB with multiple charts and real-time data feeds, efficient memory pooling for tick data

15-30 MB for simple charts, 80-150 MB for complex dashboards with 5+ interactive charts and real-time updates

Low - approximately 5-15 MB for typical charts with 1,000-5,000 data points, efficient memory management with data cleanup

Web Development-Specific Metric

Chart Rendering Latency

Animation frame rate: 60 FPS for datasets under 5,000 points, Chart update time: 16-50ms depending on complexity

Chart rendering time: 16-33ms for initial render of 1,000 candles, real-time updates in <5ms

Build Time Runtime Performance Bundle Size Memory Usage Web Development-Specific Metric

2-4 seconds for initial chart load, lightweight library integration adds ~500ms to build

60 FPS rendering with hardware acceleration, handles 10,000+ data points smoothly, optimized WebGL rendering for complex indicators

~450KB minified library core, ~1.2MB with full charting features, tree-shakeable to ~200KB for basic implementations

Base: 15-25MB, scales to 50-80MB with multiple charts and real-time data feeds, efficient memory pooling for tick data

Chart Rendering Latency

Chart.js

2-5 seconds for typical projects, 10-15 seconds for large dashboards with multiple chart types

60 FPS rendering for up to 10,000 data points, drops to 30-45 FPS beyond 50,000 points without optimization

186 KB minified, 61 KB gzipped (full build), tree-shakeable to ~40 KB for basic charts

15-30 MB for simple charts, 80-150 MB for complex dashboards with 5+ interactive charts and real-time updates

Animation frame rate: 60 FPS for datasets under 5,000 points, Chart update time: 16-50ms depending on complexity

Lightweight Charts

Fast - typically 2-5 seconds for production builds with tree-shaking and minification

Excellent - 60 FPS rendering with hardware acceleration, handles 10,000+ data points smoothly, optimized canvas rendering

~45-50 KB minified and gzipped (standalone version), highly optimized for web delivery

Low - approximately 5-15 MB for typical charts with 1,000-5,000 data points, efficient memory management with data cleanup

Chart rendering time: 16-33ms for initial render of 1,000 candles, real-time updates in <5ms

Benchmark Context

Chart.js excels in general-purpose charting with broad chart type support and moderate performance handling up to 10,000 data points efficiently. Lightweight Charts dominates in rendering performance for financial time-series data, capable of smoothly displaying 50,000+ candlesticks with minimal CPU overhead, making it ideal for real-time trading interfaces. TradingView provides the most feature-rich strategies with professional-grade technical indicators and drawing tools, but requires their proprietary infrastructure and has higher latency for custom data integration. For dashboards with mixed chart types, Chart.js offers the best flexibility. For high-frequency financial data visualization, Lightweight Charts delivers superior frame rates. TradingView suits applications where built-in professional trading features justify the platform dependency.

TradingView

TradingView Lightweight Charts achieves sub-16ms frame times for real-time updates, supporting 1000+ candlesticks with technical indicators while maintaining responsive interactions and smooth animations

Chart.js

Chart.js offers good performance for small to medium datasets with smooth animations and reasonable bundle sizes. Performance degrades with very large datasets (50K+ points) or many simultaneous charts. Memory efficient for typical use cases but requires optimization techniques like data decimation for real-time applications or large-scale visualizations.

Lightweight Charts

TradingView Lightweight Charts is optimized for financial charting with minimal overhead, providing smooth real-time updates, small bundle size, and efficient resource

---

Title: uPlot | 📈 A small, fast chart for time series, lines, areas, ohlc & bars
URL: https://leeoniya.github.io/uPlot/
Published: N/A
Author: N/A
Highlights:
## μPlot

A small (~50 KB min), fast chart for time series, lines, areas, ohlc & bars (MIT Licensed)

### Introduction

uPlot is a fast, memory-efficient Canvas 2D-based chart for plotting time series, lines, areas, ohlc & bars. From a cold start it can create an interactive chart containing 166,650 data points in 25ms, scaling linearly at ~100,000 pts/ms afterwards. In addition to fast initial render, the zooming and cursor performance is by far the best of any similar charting lib; at ~50 KB, it’s likely the smallest and fastest time series plotter that doesn’t make use of context-limited WebGL shaders or WASM, both of which have much higher startup cost and code size.

In most sane cases, you can live-stream data with uPlot at 60fps, though it may begin to struggle beyond 100k in-view points. When updating 3,600 points at 60fps, uPlot uses 10% CPU and 12.3MB RAM. The next fastest Canvas-based libs (Chart.js and ECharts) use 40% / 77MB and 70% / 85MB, respectively. If you need to stream, give unclog your rendering pipeline a try. If that does not help, consider reducing the update frequency or switch to a WebGL/WebGPU solution, like danchitnis/webgl-plot, huww98/TimeChart, epezent/implot.

...

### Non-Features

In order to stay lean, fast and focused the following features will not be added:

- No general-purpose data parsing, aggregation, or statistical processing. Integrated stacking only computes configured cumulative series. Prepare other results in advance with tools such as simple-statistics or uDSV.
- No transitions or animations - they’re always pure distractions.
- No collision avoidance for axis tick labels, so may require manual tweaking of spacing metrics if label customization significiantly increases default label widths.
- Smooth spline interpolation is available, but its use is strongly discouraged. See “Your data is misrepresented!”.
- No built-in drag scrolling/panning due to ambiguous native zoom/selection behavior. However, this can be added externally via the plugin/hooks API: zoom-wheel, zoom-touch.

...

### Performance

Benchmarks done on this hardware:

- Date: 2023-03-11
- AMD Ryzen 7 PRO 5850U @ 1.9GHz, 32GB RAM
- EndeavourOS/Arch (KDE/Plasma), Chrome 113.0.5638.0 (64-bit)
- 4K display scaled to 1440p (1.5 devicePixelRatio)

Full size: https://leeoniya.github.io/uPlot/demos/multi-bars.html

Raw data: https://github.com/leeoniya/uPlot/blob/master/bench/results.json

```
| lib                    | size    | done    | js,rend,paint,sys | heap peak,final | mousemove (10s)     |
| ---------------------- | ------- | ------- | ----------------- | --------------- | ------------------- |
| uPlot v1.6.24          | 47.9 KB |   34 ms |   51   2   1   34 |  21 MB   3 MB   |  218  360  146  196 |
| Chart.js v4.2.1        |  254 KB |   38 ms |   90   2   1   40 |  29 MB  10 MB   | 1154   46  165  235 |
| Flot v3.0.0            |  494 KB |   60 ms |  105   5   1   52 |  41 MB  21 MB   | ---                 |
| ECharts v5.4.1         | 1000 KB |   55 ms |  148   3   1   35 |  17 MB   3 MB   | 1943  444  203  208 |
| dygraphs v2.2.1        |  132 KB |   90 ms |  163   2   1   33 |  88 MB  42 MB   | 1438  371  174  268 |
| LightningChart® v4.0.2 | 1300 KB |  --- ms |  250   2   1   33 |  33 MB  13 MB   | 5390  120  128  325 |
| CanvasJS v3.7.5        |  489 KB |  130 ms |  266   4   1   35 |  98 MB  69 MB   | 1030  445   90  246 |
| dvxCharts v5.1.0       |  373 KB |  160 ms |  264  23   1   62 | 100 MB  61 MB   |  687  779  206  197 |
| Highcharts v10.3.3     |  413 KB |  --- ms |  416   7   1   38 |  97 MB  55 MB   | 1286  824  205  242 |
| Plotly.js v2.18.2      | 3600 KB |  310 ms |  655  14   1   40 | 104 MB  70 MB   | 1814  163   25  208 |
| ApexCharts v3.37.1     |  503 KB |  685 ms |  694   9   1   33 | 175 MB  46 MB   | 1708  421  106  207 |
| ZingChart v2.9.10      |  871 KB |  681 ms |  717   7   1  105 | 290 MB 195 MB   | 9021  305   41   71 |
| amCharts v5.3.7        |  625 KB |  --- ms | 1601   3   3   46 | 147 MB 121 MB   | 9171   71  460  167 |

```

- libs are sorted by their initial, cold-start, render performance (excluding network transfer time to download the lib)
- `size` includes the lib itself plus any dependencies required to render the benchmark, e.g. Moment, jQuery, etc.
- Flot does not make available any minified assets and all their examples use the uncompressed sources; they also use an uncompressed version of jQuery :/

---

Title: Performance Comparison of JavaScript Chart Libraries in 2026
URL: https://www.scichart.com/blog/chart-bench-compare-javascript-chart-libraries/
Published: N/A
Author: N/A
Highlights:
> When doing a performance comparison of JavaScript Chart Libraries, we are often asked “ which is the fastest JavaScript chart?“. Users coming to SciChart for the first time often spend time setting up a complex benchmark comparison app to see if SciChart can meet their needs. This is a time consuming process, and each benchmark will be different, so, we’ve taken the time to do this for you!
> 
> We want to demonstrate to you that we care about performance,

...

Here’s what we will discuss and present below: 

- A comprehensive open-source benchmark test suite for a thorough performance comparison of JavaScript Chart Libraries.
- Testing many chart types, including line charts, scatter charts, column charts, mountain/area, candlestick, heatmap, 3D surface, 3D point cloud.
- Measurement of metrics, including FPS (frames per second), time to first render, memory usage, number of frames rendered and data ingestion rate (datapoints per second).
- Our benchmark outputs JavaScript Chart Performance Test Results for several chart libraries including Chart.js, HighCharts, Plotly.js, LightningChart, Apache eCharts, uPlot and SciChart.js.
- A single Chart Bench score which ranks the performance of JavaScript chart libraries based on weighted sum of FPS, Memory usage, Time to first render and data ingestion rate.
- How you can reproduce or verify results on your hardware setup in order to evaluate the performance of SciChart.js vs. competing chart libraries.

...

### What Chart Libraries are Tested in the Benchmark?

At the time of writing, we’ve included the following chart libraries in the test suite. 

- Plotly.js, an SVG and WebGL powered JS chart with WebGL module enabled
- HighCharts, SVG powered JS charts with Boost WebGL module enabled
- Chart.js, an open-source library based on HTML5 Canvas
- Apache eCharts, an open-source library based on HTML5 with WebGL acceleration for 3D charts
- uPlot, a lightweight open-source library based on HTML5 canvas
- ChartGPU, a relative newcomer in the open-source space rendering charts using WebGPU with no WebGL fallback
- SciChart.js, our WebGL and WebAssembly powered chart library
- LightningChart.js v4.2.2 and v8.2.0 (LCJS), a competing WebGL enabled chart library*****

We put them head to head in a demanding performance test that stress your CPU and GPU to the max to find out the limits of these libraries. You’ll see how well they perform and their respective stats (FPS, memory usage, initialization time, data ingestion rate) on a variety of hardware.

...

## What Results Did We Get from the Tests?

We’ll be publishing full test results soon for a variety of hardware test setups, but for now, here are some key takeaways:

- SciChart.js scored the highest FPS in approximately ~70% of test cases vs. all competitors on Intel Windows PCs and ARM Snapdragon.
- SciChart.js data ingestion rates peak at about ~40,000,000 (40 million) data-points per second on Intel Windows PCs, Apple M1 hardware and ARM Snapdragon.
- SciChart.js performance is not significantly degraded by hardware, e.g. even on integrated GPUs (ARM Snapdragon, Apple M1) you still can see millions of data-points rendered at interactive framerates. 
- SciChart.js particularly excels at data-ingestion rate, time-to-first-frame (init time) and memory usage in the most demanding test cases.
```

---

## Assistant (Plan · MiMo-V2.6-Flash Free · 45074.0s)

_Thinking:_

The user is asking me to propose a way to add charts of official NYSE stocks to the landing page. I'm in plan mode — read-only. I've done research. Now I should present a plan/proposal with options and tradeoffs, possibly ask a clarifying question about which chart type they want.

Let me structure the answer:

**Context/constraints:**
- Our stack: vanilla HTML/CSS/JS, no build, Vercel static
- Purpose: lead magnet for Czech retail investor, mobile-first, few seconds attention
- Legal: exchange data redistribution; need sources + disclaimer (assignment requires real data with sources)
- Speed matters (mobile ad traffic)

**What charts make sense (3 candidates):**
1. **Model chart (no external data at all)**: "Stejné peníze, různé poplatky" — lines: final value with 0.03% vs 0.41% vs 0.77% TER over 25 years. Generated from same math as calculator; interactive (updates with calculator inputs!). This is the most conversion-relevant chart and 100% ours — no licensing issues.
2. **Historical index chart**: S&P 500 long-term growth of e.g. 10 000 Kč since 1957/2000 — data baked as JSON from verified source (Damodaran NYU Stern dataset / stooq ^spx monthly). Static snapshot with source.
3. **ETF price charts (official prices from NYSE/NYSE Arca)**: interactive chart with VOO/IVV/SPY/QQQ toggles.

**Data options for #3:**
- A) Static JSON snapshot downloaded at build/commit time from Stooq CSV (free, no key): `https://stooq.com/q/d/l/?s=voo.us&i=d` — monthly data baked into `assets/data/*.json`. Refresh weekly/monthly via a small script or manually. Pros: fastest page, no API, no CORS, no key; cons: not live (fine for educational landing; delayed EOD anyway).
- B) Vercel serverless proxy `/api/chart?symbol=VOO` fetching Stooq or Alpha Vantage with cache headers (s-maxage=86400). Pros: always fresh; cons: more code, Stooq rate-limits/UA-blocking, cold starts.
- C) Client-side API with free key (Alpha Vantage 25/day, Twelve Data 800/day): key exposed or proxied; rate limits kill it with ad traffic → not recommended.
- D) TradingView widget embed: free, official charts, but heavy iframe, third-party cookies/consent (GDPR/ePrivacy), ads in widget? (public widgets free), slows page, brand mismatch → not recommended for hero path, maybe okay as an extra.

Recommendation: **A (static snapshots) + model chart**. Specifically:
- Graf A (hlavní, interaktívny, priamo v sekcii kalkulačky): "Dopad poplatku v čase" — 3 línie, generované živě z rovnakých vstupov kalkulačky (0 config, zero extra data)
- Graf B (sekcia "prečo dlhodobo"): S&P 500 rast od roku 2000/1957 — statický JSON snapshot zo Stooq (^spx) alebo Damodaran dataset, zdroj uvedený; medzimesačné body (~330 bodov), ľahký
- Optionally Graf C: porovnanie cien VOO vs SPY vs IVV (normalized 100) — same static approach

**Chart library choice:**
- Lightweight Charts (TradingView, Apache 2.0, ~35-45KB, must attribute TradingView + link) — designed for financial time series, nice crosshair/tooltip, mobile friendly. Requires attribution notice (prominent place) — a footer link is acceptable per license.
- uPlot (~50KB, MIT, no attribution requirement) — fastest, but more manual styling, less "financial look" out of box.
- Chart.js (~61KB gz full, MIT) — easiest, prettiest defaults for generic line charts, fine for 2-3 line charts; heavier but OK.
- Hand-rolled SVG — for a single simple chart, zero deps, full design control; effort moderate; no interactivity beyond tooltips (we could add simple hover).

Given design control + no attribution hassle: for Graf A (3 lines) uPlot or hand-rolled; for price charts Lightweight Charts gives candlesticks/crosshair out of box with only an attribution link. I'd recommend: **Lightweight Charts** for price history (financial look, mobile, small, Apache 2.0) OR Chart.js for simplicity. Actually for "editorial" design, a simple styled line chart matters more than candles. Monthly closes = line chart.

Hmm — let me recommend:
- Graf A: computed data → render with Lightweight Charts line OR simple custom SVG. 
- Graf B/C: static JSON → same lib.

One lib for both = consistency: **Lightweight Charts** (35KB, financial-grade, Apache 2.0 with attribution link) or **uPlot** (MIT, no attribution). For a Czech landing page, attribution link "Charts by TradingView" in footer is trivial. Lightweight Charts is prettier for finance.

**Placement plan (conversion logic):**
- Graf A pod kalkulačkou (after results, before CTA) — visualizes the number they just saw; strengthens CTA „Chci přepočet e-mailem"
- Graf B v sekcii medzi tabuľkou a kalkulačkou ("Prečo vôbec investovať dlhodobo") or in facts section — supports "why" story; could also be in FAQ area
- Avoid putting charts above the fold (slows LCP) — lazy-load via IntersectionObserver

**Sourcing/licensing notes:**
- NYSE/Nasdaq official real-time data is licensed; use delayed/EOD data, cite source ("Zdroj: Stooq, denní data k 24. 10. 2026; oficiální data z NYSE/Nasdaq")
- Actually "oficiálnych akcií z newyorskej burzy" — user wants stocks from NYSE. ETFs are on NYSE Arca; individual NYSE stocks (AAPL? no AAPL is Nasdaq; NYSE: JNJ, KO, DIS, CAT...). Could add a few NYSE stocks. Data same source.
- Disclaimer: not investment advice.

**Measurement:** add event `chart_view`, `chart_symbol_change` — ties into existing tracking; also CTA under chart.

**Implementation steps (plan):**
1. Rozhodnutie: ktoré grafy (A + B/C)
2. Stiahnuť dáta (Stooq CSV: ^spx monthly since 1990, VOO/IVV/SPY/QQQ/VTI/SCHD od založenia) → skript `scripts/fetch-data.mjs` (node) → `assets/data/*.json`; spustiť ručne pri aktualizácii
3. Pridať knižnicu (vendor súbor do `assets/js/vendor/lightweight-charts.standalone.production.mjs` — žiadny CDN? CDN je OK alebo vendor pre offline; vendor = lepšie pre rýchlosť/riadenie)
4. `assets/js/charts.js` — render + lazy load + eventy
5. Sekcie v HTML + CTA pod každým grafom + zdroj/disclaimer
6. README update (zdroje, ako aktualizovať dáta)
7. Verifikácia: veľkosť, LCP, mobile, meranie

Tradeoffs to ask user: which charts (A only / A+B / all), library preference? I should ask 1-2 clarifying questions per plan-mode guidance. Let me present the analysis compactly and ask: ktoré grafy chce + či statické snapshoty vs živé cez proxy.

I'll present options with recommendation, then question tool.

Navrhujem to tak, aby grafy posilnili konverziu (číslo → emócia → formulár) a nezabili rýchlosť mobilnej stránky. Najprv fakty z prieskumu:

**Dáta – odkiaľ oficiálne kurzy NYSE/Nasdaq vziať**
| Zdroj | Cena | Kľúč | CORS | Poznámka |
|---|---|---|---|---|
| **Stooq** (stooq.com) | zdarma | nie | nie (blokuje browser) | denné/mesačné CSV, pokrýva NYSE/NASDAQ ETF aj akcie; treba sťahovať serverovo alebo raz uložiť ako JSON |
| Alpha Vantage | zdarma, 25 req/deň | áno | áno | **padne pri reklamnej návštevnosti** (25 pozretí/deň!) |
| Twelve Data | zdarma, 800 req/deň | áno | áno | lepšie, ale kľúč v prehliadači = zneužitie |
| TradingView widget | zdarma | nie | iframe | ťažký, tretia strana/cookies/súhlas, cudzí dizajn |
| **Statický JSON snapshot** | zdarma | nie | — | stiahne sa 1×, leží v repu, stránka je blesková |

Kľúčové: **real-time kurzy z NYSE sú licencované** – pre lead magnet stačia EOD/mesačné snapshoty so zdrojom (zadanie aj tak chce „reálne dáta so zdrojom").

**Knižnica grafov (vanilla, bez buildu)**
- **TradingView Lightweight Charts** – ~35 KB, Apache 2.0, priamo finančný vzhľad (crosshair, tooltip), podmienka: odkaz „Charts by TradingView" v pätičke
- **uPlot** – ~50 KB, MIT, najrýchlejší, ale manuálnejší styling
- **Chart.js** – ~61 KB gzip, najjednoduchší, univerzálny vzhľad

**Aké grafy dávajú zmysel (zoradené podľa dopadu na konverziu):**
1. **„Stejné peníze, různé poplatky"** – 3 línie rastu portfólia (0,03 % vs 0,41 % vs 0,77 % TER) **generované priamo z vstupov kalkulačky**, živé pod výsledkom. Nula externých dát, 100 % naše, legislatívne čisté, ukazuje presne to číslo, ktoré návštevník práve videl → najsilnejší kandidát na prvý graf
2. **Historický rast indexu** – S&P 500 / NYSE akcie (napr. KO, JNJ, DIS) ako snapshot JSON zo Stooq, mesačné body ~30 rokov → „prečo dlhodobo" príbeh medzi tabuľkou a kalkulačkou
3. **Porovnanie cien ETF** – normalizované kurzy VOO vs SPY vs QQQ (tiež snapshot) → priamo pod srovnávaciu tabuľku

Všetko: lazy-load cez IntersectionObserver (mimo prvej obrazovky → neovplyvní LCP), pod každým grafom CTA na report + zdroj a disclaimer, eventy `chart_view` do existujúceho merania.

**Tool: question**

**Input:**
```json
{
  "questions": [
    {
      "header": "Rozsah grafov",
      "options": [
        {
          "description": "Graf 1 (model, živý z kalkulačky) + graf 2 (historický rast S&P 500 zo Stooq). Najväčší dopad, minimum kódu, dáta pod kontrolou.",
          "label": "Graf 1 + 2 (Recommended)"
        },
        {
          "description": "Iba modelový graf zo sterej kalkulačky – žiadne externé dáta, najrýchlejšie nasadenie (cca 100 riadkov).",
          "label": "Len graf 1"
        },
        {
          "description": "Model + história indexu + porovnanie cien VOO/SPY/QQQ. Najviac obsahu, viac dát a udržiavania (snapshoty treba obnovovať).",
          "label": "Všetky tri"
        }
      ],
      "question": "Ktoré grafy chceme na stránku pridať?"
    },
    {
      "header": "Zdroj dát pre históriu",
      "options": [
        {
          "description": "Node skript stiahne Stooq CSV, uloží ako JSON do assets/data/. Stránka je statická, rýchla, bez kľúčov a limitov; aktualizácia 1× mesačne ručne/spustom skriptu.",
          "label": "Statický snapshot (Recommended)"
        },
        {
          "description": "Endpoint /api/angle=... proxy na Stooq s cache na 24h. Vždy čerstvé, ale viac kódu, Stooq rate-limituje a blokuje botov, riziko výpadku.",
          "label": "Serverless proxy na Vercel"
        },
        {
          "description": "Knižnicu načítame z CDN – menej súborov v repu, ale závislosť na tretej strane pri načítaní.",
          "label": "CDN (lightweight-charts z unpkg)"
        }
      ],
      "question": "Ako sa majú historické dáta (grafy 2/3) dostať na stránku?"
    }
  ]
}
```

**Output:**
```
User has answered your questions: "Ktoré grafy chceme na stránku pridať?"="Graf 1 + 2 (Recommended)", "Ako sa majú historické dáta (grafy 2/3) dostať na stránku?"="Serverless proxy na Vercel". You can now continue with the user's answers in mind.
```

---

## Assistant (Plan · MiMo-V2.6-Flash Free · 218.3s)

_Thinking:_

The user chose:
1. Graf 1 + 2 (model chart + historical S&P 500 chart)
2. Serverless proxy on Vercel for historical data

Interesting combination: Graf 1 is computed from calculator (no data), Graf 2 needs historical index data → served via serverless proxy `/api/chart` that fetches from Stooq with caching.

I'm in plan mode. I need to present a comprehensive plan. Let me think through the architecture for the serverless proxy:

**API endpoint: `/api/chart.js`**
- Params: `?symbol=^spx&range=...&interval=1mo` or simpler: `?s=spx&i=1mo`
- Fetches from Stooq CSV: `https://stooq.com/q/d/l/?s=^spx&i=m` (monthly) — Stooq URL format: `https://stooq.com/q/d/l/?s=^spx&d1=YYYYMMDD&d2=YYYYMMDD&i=m`
- Needs User-Agent header (Stooq blocks default UA / returns HTML)
- Cache: in-memory cache on warm lambda (globalThis) + `Cache-Control: s-maxage=2592000, stale-while-revalidate` (Vercel edge cache 30 days for monthly data)
- Response: normalized JSON `{ symbol, interval, source, asOf, points: [[timestamp, close], ...] }`
- Fallback: if Stooq fails (rate limit/HTML), serve embedded fallback dataset (small bundled JSON of S&P 500 monthly since 2000) so chart never breaks — good resilience. Or return 503 and chart hides gracefully. Better: embed minimal fallback (e.g., yearly S&P 500 index values 2000–2025, ~26 points, tiny) in the function itself. Hmm, that's data duplication; alternatively graceful degradation: chart section hidden if fetch fails. I'd propose: try Stooq → if fail, return `{"error":...}` and client hides chart block. Keep simple.

Actually, a hybrid: on first failure, the client can retry or show static "mini" data. Simplest robust: graceful hide. But landing page on ads shouldn't break — chart is below fold, hiding is acceptable.

**Graf 1 (model chart):**
- Section placement: directly inside `.calc__result`? Canvas there is dark-styled. Lightweight Charts styling for dark background works (we can style grid/text colors to match #0F3D2E card).
- Data: for years 0..N (slider max), compute FV for three TERs (0.03, 0.41, 0.77) using same futureValue function with monthly points (or yearly points = 25-40 points — light). Yearly points fine.
- Update reactively on input/chip change (re-render series data).
- Two series or three: selected TER vs cheapest 0.03% vs average 0.41%? Keep 3 lines: 0,03 % (green/light), 0,41 %, 0,77 % (accent) with legend. Plus CTA under? The CTA already exists in calc result. Maybe chart replaces the need... no, add chart between result blocks and CTA.
- Mobile: height ~180-220px, crosshair disabled or simple.

**Graf 2 (historical index):**
- Section placement: between table and calculator — new section "Proč: síla dlouhodobého držení" / or after facts. Proposal: new section after comparison table (before kalkulačka): headline "Co dělá čas s penězi" — chart: growth of 100 000 Kč invested in S&P 500 (or index value normalized) over ~25-30 years, monthly data from proxy. 
- Actually better conversion placement: between facts and table? Let's think: current order Hero → Facts → Table → Calculator → Form. Graf 2 is "why invest long-term" narrative → good between Facts and Table, or between Table and Calculator. I'd put it between Table and Calculator: after value (table), before personalization (calculator) — builds desire. Or merge into calculator section as secondary visual. I'll propose new section `#historie` between `#srovnani` and `#kalkulacka`.
- Content: index S&P 500 (^spx monthly), normalized: "100 000 Kč investovaných v roce 2000 → dnes ≈ X" with real numbers computed from data. Source line: "Zdroj: Stooq, měsíční data indexu S&P 500 (NYSE), 2000–2026". Disclaimer.
- Alternatively display index chart with toggle... keep simple: single line + area, tooltip showing date/value.

**Library:** Lightweight Charts standalone (~45KB) vendored to `assets/js/vendor/lightweight-charts.standalone.production.mjs` (or .js IIFE for simplest script tag use). License: Apache 2.0 + attribution link in footer ("Charts by TradingView"). 

Wait — with serverless proxy chosen, does vendoring still apply? Yes, library is independent from data. Vendored file, no CDN (they didn't choose CDN option for data; but library choice wasn't asked — I'll recommend vendoring to repo).

Hmm — actually I asked about data source for history, not library hosting. I'll specify vendored Lightweight Charts.

**Events:** `chart_view` (IntersectionObserver once), `chart_interact` (crosshair/symbol), maybe `chart_period`. CTA under Graf 2: "Spočítat si to na svých číslech" → scroll to calculator (top-of-funnel to calc) and/or CTA to report.

**Rate limiting/abuse of proxy:** endpoint is public; Stooq rate limits per IP are on Stooq side; our endpoint cached at edge → effectively few origin hits. Add simple in-memory cache + edge cache. Optional: block non-GET.

**README updates:** new section documenting charts, data flow, how Stooq proxy works, source citation, attribution note for TradingView, A/B? Not needed.

**Performance:** 
- Vendor lib ~45KB min (gz ~15KB) loaded async after page (defer) or only when charts in view → use `IntersectionObserver` + dynamic `import()` of module (mjs) — or just defer script tag; simpler: normal defer script, render on intersection.
- Graf 1 renders fast (local math).
- Graf 2 fetch /api/chart — cached at edge, fast.

**Testing plan:** unit check of futureValue chart points; local `vercel dev` for proxy; check Stooq CSV response format; verify attribution in footer; mobile visual check; measure LCP unaffected.

**File changes:**
1. `api/chart.js` — new serverless fn (Stooq fetch + normalize + cache + fallback headers)
2. `assets/js/vendor/lightweight-charts.standalone.production.js` — vendored lib (download from GitHub release)
3. `assets/js/charts.js` — both charts, lazy init, events
4. `index.html` — new section #historie (Graf 2) + chart container in calc result (Graf 1) + footer attribution link + script tags
5. `style.css` — chart containers, section styles, legend
6. `calculator.js` — expose update hook to refresh Graf 1 (dispatch event or window.etfCalcState already updated; charts.js can subscribe via custom event `etf:calc-update`)
7. `README.md` — docs

**Steps:**
1. Stiahnuť Lightweight Charts release → vendor
2. `api/chart.js` + otestovať s Stooq (overiť formát CSV, UA, caching)
3. HTML sekcia #historie + container Graf 1 v kalkulačke
4. `charts.js`: Graf 1 (model, reaktívny), Graf 2 (fetch, render)
5. Kalkulačka → event na refresh Grafu 1
6. Dizajn (farby, mobil, legend, tooltip, CTA, zdroj/disclaimer, atribúcia TradingView)
7. Eventy do merania + README
8. Verifikácia: `vercel dev`, mobile, veľkosť bundle, fallback ak API zlyhá

Edge cases: Stooq symbol for S&P500 is `^spx`; monthly interval `i=m`; date range d1/d2. Response CSV `Date,Open,High,Low,Close,Volume`. Normalize to `[unixSeconds, close]` for Lightweight Charts (time in UTC seconds).

Also note: Graf 2 headline numbers should be computed client-side from fetched data (e.g., "100 000 Kč z roku 2000 je dnes X") — display after fetch; fallback text if fails.

Timeframe: maybe offer period toggle 5R/10R/Max? Lightweight Charts has built-in range buttons via custom; keep simple: fixed "od roku 2000" or fetch max and let user zoom (pinch/wheel). Lightweight Charts supports zoom/pan natively — good.

I'm in plan mode → present plan for approval. Keep it structured and concise.

Dobre — **Graf 1 + 2, historické dáta cez serverless proxy**. Tu je finálny plán:

---

# PLÁN: Dva grafy na landing page

## Architektúra dát

```
Graf 1 „Stejné peníze, různé poplatky"
  vstupy kalkulačky → futureValue(0,03 % / 0,41 % / 0,77 %) → priamo render
  (žiadne externé dáta, živý update pri zmene slidera/čipu)

Graf 2 „Co dělá čas s penězi" (S&P 500)
  prehliadač → GET /api/chart?s=^spx&i=m
                    ↓
            api/chart.js (Vercel fn)
              1. in-memory cache (globalThis) + Cache-Control: s-maxage=2592000
              2. fetch Stooq CSV: stooq.com/q/d/l/?s=^spx&i=m  (s User-Agent)
              3. normalizácia → { symbol, source, asOf, points:[[t,c],...] }
              4. pri chybe/HTML odpovedi → 503 + klient graf diskrétne skryje
```

Prečo proxy: Stooq nemá CORS → serverový fetch ho obíde; edge cache (30 dní) znamená **jednotky pôvodných requestov denne**, aj s reklamnou návštevnosťou. Žiadny API kľúč, žiadne limity na strane návštevníka.

## Knižnica
**TradingView Lightweight Charts** (~45 KB, Apache 2.0) — vložený do repu (`assets/js/vendor/`), žiadna CDN závislosť. Podmienka licencie: odkaz „Charts by TradingView" v pätičke (1 riadok).

## Zmeny súborov

| Súbor | Zmena |
|---|---|
| `api/chart.js` | **nový** — proxy Stooq → JSON, cache, error handling |
| `assets/js/vendor/lightweight-charts…js` | **nový** — stiahnutý release |
| `assets/js/charts.js` | **nový** — Graf 1 (model, reaktívny) + Graf 2 (fetch/render) + lazy init + eventy |
| `index.html` | nová sekcia `#historie` medzi `#srovnani` a `#kalkulacka` (Graf 2); container pre Graf 1 vo vnútri `.calc__result`; atribúcia v patičce; 2× `<script defer>` |
| `assets/css/style.css` | štýly kontajnerov grafov, legend, tooltip, sekcia, mobil |
| `assets/js/calculator.js` | po `update()` vystrelí custom event `etf:calc-update` (Graf 1 sa prekreslí) |
| `README.md` | sekcia „Grafy a zdroje dát" — flux, ako obnoviť, citácie, atribúcia |

## Umiestnenie a konverzná logika

1. **Graf 1** priamo vo výsledku kalkulačky, **medzi číslami a CTA** — vizualizuje práve videlené číslo (zvolený TER vs 0,03 % vs 0,41 %), tri línie, reaktívny. TMA schéma sedí na zelený kartón výsledku.
2. **Graf 2** — nová krátka sekcia `#historie` **medzi tabuľkou a kalkulačkou**: nadpis typu *„Co dělá čas s penězi"*, jedna línia rastu S&P 500 (mesačné dáta od ~2000, zoom/pan natívne), dynamickejší text s výpočtom („100 000 Kč z roku 2000 je dnes ≈ X") dopočítaný z fetchnutých dát + **CTA „Spočítejte si to na svých číslech →"** (scroll na kalkulačku). Zdroj a disclaimer pod grafom.
3. Oba grafy: `IntersectionObserver` → init až keď sú vo viewport (mimo prvej obrazovky = **LCP sa nedotkne**), eventy `chart_view`, `chart_interact` do existujúceho `dataLayer`.

## Priebeh implementácie
1. Stiahnuť release Lightweight Charts do `assets/js/vendor/`
2. `api/chart.js` + overenie reálnej odpovede Stooq (formát `Date,Open,High,Low,Close,Volume`, UA, interval `i=m`) cez `npx vercel dev`
3. HTML: sekcia `#historie` + container Grafu 1 + patička atribúcia
4. `charts.js`: Graf 1 (model z `window.etfCalcState`, reaktívny), Graf 2 (fetch → render → fallback)
5. Napojenie: `calculator.js` → event → refresh Grafu 1
6. Dizajn: farby sérií (zelená = 0,03 %, korálová = 0,77 %), mobilné výšky (180–220 px), tooltip v tabuľkových čísliciach
7. README + meranie
8. Verifikácia: `vercel dev` (proxy žije), chybový reakčný režim (Stooq down → graf sa skryje, stránka ide ďalej), kontrola veľkosti, mobilný vizuál

**Riziká:** Stooq rate-limit/bot-blokovanie (ošetrené cache + User-Agent + graceful hide); licencia dát (EOD dáta so zdrojom a disclaimerom — spĺša zadanie); preťaženie prvého renderu (lazy init).

---

S týmto plánom súhlasíš, alebo chceš niečo upraviť (umiestnenie Grafu 2, znenie nadpisov, iný index ako S&P 500)?

---

## User

---

## Assistant (Compaction · MiMo-V2.6-Flash Free · 79.4s)

_Thinking:_

Create a structured summary per template.

## Objective
- Zadanie B: konverzná landing page porovnávajúca ETF obchodované na NYSE pre českého drobného investora z mobilnej reklamy (lead magnet, reálne dáta so zdrojmi, meranie cesty, nasadenie na Vercel).
- Aktuálne: navrhnúť spôsob, ako pridať grafy/vizuály oficiálnych akcií z newyorskej burzy na stránku.

## Important Details
- Stack (potvrdené užívateľom): čisté HTML + CSS + vanilla JS, bez build kroku.
- Lead backend: Vercel serverless `api/lead.js` + Resend API (fallback `mode: "log_only"` bez kľúča).
- Jazyk stránky: čeština. Východisková reklama = verzia A (poplatky).
- Dizajn: editorial fintech – krémová `#FAF7F2`, zelená `#0F3D2E`, accent `#E4572E`, Fraunces + Inter, tabul-nums. Žiadne fialové gradienty/emoji karty.
- Kalkulačka: hrubý výnos 8 % p.a., mesačné skládané úročenie, TER z čistého výnosu; východiskový scenár 100 000 Kč + 3 000 Kč/mes. × 25 r. → hero číslo **235 000 Kč** (presný výpočet 0,41 % vs 0,03 % = 234 728 Kč).
- Overené dáta (zdroje v README): TER VOO 0,03 % (Vanguard fact sheet 30. 9. 2026), IVV 0,03 % (iShares 31. 7. 2026), SPY 0,0945 % (State Street 9. 7. 2026), QQQ 0,18 % (invesco.com), VTI 0,03 %, SCHD 0,060 % (Schwab 23. 10. 2026); průměr index. fondů S&P 500 0,41 %; S&P 500 ≈10 % p.a. od 1957 (Fidelity), Damodaran 10,02 % 1928–2025; daň 30 % → 15 % s W-8BEN (smlouva ČR–USA č. 32/1994 Sb., čl. 10).
- Očakávaná konverzia: 8–12 % lead CVR; 3 A/B hypotézy zoradené: (1) číselný hero hook vs. všeobecný, (2) 1 pole vs. e-mail+meno, (3) voľná kalkulačka vs. gate za e-mailom.
- Prieskum konkurencie (Portu, Wealthfront, Fondee, Betterment) – zistené vzory: číselný headline, 1 primárna CTA, výsledok kalkulačky pred e-mailom, „Více informací o modelovém odhadu" rozklik, sociálne čísla, disclaimer pri každom čísle.
- Užívateľovi boli navrhnuté 4 vylepšenia; vykonal sa iba bod 2 (rozpis výpočtu pod kalkulačkou). Body 1 (sociálne proof čísla), 3 (druhá konverzia – odber), 4 (3 kroky – už existuje) zostávajú.
- Research pre grafy: Stooq (stooq.com/db/h/ – 517 MB US denné CSV, voľný prístup, query `https://stooq.com/q/d/l/?s=voo.us&i=d`), Alpha Vantage/Twelve Data (free API key, CORS), TradingView **lightweight-charts** (Apache 2.0, ~45 KB, standalone IIFE, bez buildu, ES module aj IIFE build), alternatívy uPlot/Chart.js. Limitácie: live quotes licencované, z couch v prehliadači; riešenie = snapshot JSON alebo serverless proxy.

## Work State
### Completed
- `index.html` – kompletná stránka: hero (mirror reklamy), 3 fakta so zdrojmi, zoraditeľná tabuľka 6 ETF, kalkulačka, formulár (1 pole + GDPR + honeypot), 3 kroky, FAQ, záverečné CTA, sticky mobilná lišta, disclaimer.
- `assets/css/style.css` – dizajn systém, mobil-first, print štýl, prefers-reduced-motion; pridaný štýl `.assumption` (rozklik pod kalkulačkou v tmavom kontexte).
- `assets/js/main.js` – UTM → localStorage → lead payload; eventy `page_view`, `cta_click`, `table_sort`, `calc_change`, `form_view`, `form_error`, `form_submit`, `report_view` → `dataLayer` + `window.va`; sticky bar logika; odoslanie formulára (lokálne demo presmerovanie na thank-you).
- `assets/js/table.js` – 6 ETF dát + zdroje, sort podľa ticker/TER/rok.
- `assets/js/calculator.js` – `futureValue()`, živé výsledky, `window.etfCalcState` pre thank-you a API; hero číslo sa mení podľa zvoleného fondu; opravená rozbitá editácia (chýbajúci riadok `window.etfCalcState = {`).
- `api/lead.js` – validácia (422), honeypot, rate limit (5/min), 405, Resend odoslanie, log fallback; opravená syntax `to: [record.email]`.
- `thank-you.html` – personalizovaný čísla + checklist (W-8BEN, broker, prvý nákup) + tabuľka TER, tlač cez `window.print()`.
- `README.md` – odôvodnenie poradia sekcií, meranie cesty, konverzia 8–12 %, tabuľka zdrojov, 2 verzie reklamy, 3 A/B hypotézy, návod Resend + Vercel deploy, štruktúra súborov, GDPR.
- `.env.example`, `package.json` (`"type": "module"`).
- Overené: `node --check` všetkých JS; endpoint testy (`invalid_email`, `consent_required`, honeypot, `log_only`, 405); všetky ID HTML↔JS existujú; lokálny server – všetky súbory 200; matematika kalkulačky overená cez node.
- Pridaný rozklik „Více informací o modelovém výpočtu" (`<details class="assumption">`) pod výsledky kalkulačky + CSS.
- Prieskum konkurenčných investor landing pages – zhrnuté vzory, navrhnuté 4 vylepšenia.

### Active
- Návrh spôsobu pridania grafov/dát z newyorskej burzy (dokončený research: Stooq CSV, free API, lightweight-charts); odpoveď ešte nebola užívateľovi odovzdaná.

### Blocked
- Deploy na Vercel čaká na Vercel login (CLI nie je nainštalovaný, `VERCEL_TOKEN` ani `~/.vercel/auth.json` neexistujú).

## Next Move
1. Navrhnúť užívateľovi konkrétne riešenie grafov: odporučiť TradingView `lightweight-charts` (standalone IIFE, Apache 2.0, bez buildu) + dáta ako snapshot JSON (Stooq denné CSV, mesačná agregácia) alebo serverless proxy `/api/price`; uviesť licenčné obmedzenia live quotes a GDPR/CORS dôvody.
2. Po odsúhlasení implementovať sekciu s grafmi (pravdepodobne „Vývoj S&P 500 / rozdiel TER v čase") s uvedením zdroja a spárovaním s CTA na formulár.

## Relevant Files
- `C:\Users\BigON\Desktop\clientelo\index.html` – hlavná landing page, sekcie a formulár
- `C:\Users\BigON\Desktop\clientelo\assets\css\style.css` – dizajn systém, `.assumption` štýl
- `C:\Users\BigON\Desktop\clientelo\assets\js\calculator.js` – výpočet poplatkov, `window.etfCalcState`
- `C:\Users\BigON\Desktop\clientelo\assets\js\main.js` – tracking, UTM, odoslanie formulára
- `C:\Users\BigON\Desktop\clientelo\assets\js\table.js` – porovnávacia tabuľka ETF
- `C:\Users\BigON\Desktop\clientelo\api\lead.js` – serverless endpoint (Resend + fallback)
- `C:\Users\BigON\Desktop\clientelo\thank-you.html` – report po odoslaní
- `C:\Users\BigON\Desktop\clientelo\README.md` – odôvodnenia, konverzia, A/B, reklamy, deploy
- `C:\Users\BigON\AppData\Local\Temp\opencode\static-server.js` – pomocný lokálny server na porti 4321

---

## User

---

## Assistant (Plan · MiMo-V2.6-Flash Free · 91.7s)

---

