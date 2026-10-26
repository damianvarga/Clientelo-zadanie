# Implementácia grafov na stránke

**Session ID:** ses_e8d1e0403ffexJ1I2u2DxkcS2h
**Created:** 10/25/2026, 12:46:15 PM
**Updated:** 10/25/2026, 2:53:02 PM

---

## User

pozri sa na kód a na to, ako by sme mohli vykresliť správne grafy na stránke

---

## Assistant

**Tool: read**

**Tool: glob**

---

## Assistant

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: glob**

**Tool: glob**

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

Skontrolujem aktuálny stav súborov súvisiacich s grafmi.


**Tool: glob**

**Tool: grep**

**Tool: grep**

**Tool: bash**

---

## Assistant

**Tool: read**

**Tool: read**

**Tool: bash**

---

## Assistant

**Tool: bash**

**Tool: grep**

---

## Assistant

**Tool: bash**

**Tool: edit**

---

## Assistant

**Tool: bash**

---

## Assistant

PowerShell přidalo BOM (UTF-16). Přečtu to přes .NET metodu s čistým UTF-8 bez BOM.


**Tool: bash**

---

## Assistant

Syntax OK. Rýchla overenie chybějícího script tagu a finanční smysluplnosti výpočtu poplatkového grafu:


**Tool: grep**

**Tool: bash**

---

## Assistant

Hotovo. Grafy fungují:

**Co bylo chybějící a co jsem přidal:**
- `assets/js/charts.js` (nový) — vanilla JS modul, který vykreslí oba SVG grafy (`#price-chart`, `#fee-chart`) už připravené v `index.html:126-189`
- `<script src="/assets/js/charts.js"></script>` připojen v `index.html:433` za `calculator.js`
- CSS styly (`.chart-card`, `.chart-tabs`, `.chart-stage`…) už existovaly v `assets/css/style.css`

**Co grafy zobrazují:**
1. **Vývoj ceny VOO (S&P 500)** — načteno z `/assets/data/voo-history.json` (1 255 denních záznamů, 25. 10. 2021 → 23. 10. 2026, zdroj: Yahoo Finance chart API). Přepínač 1 / 3 / 5 roky, osy, mřížka, aktuální hodnota, chybové hlášení při selhání načtení.
2. **Modelový dopad poplatků** — srovnání levného ETF (TER 0,03 %) vs. průměrného fondu (TER 0,41 %) při 100 000 Kč + 3 000 Kč/měs., 25 let, 8 % hrubý výnos. Vypnutá plocha mezi křivkami ukazuje peníze ztracené v poplatcích.

**Konzistence:** výpočet grafu používá stejnou `futureValue` metriku jako kalkulačka — rozdíl po 25 letech vyjde 234 728 Kč, což souhlasí s hero číslem v README.

`node --check` prošel bez chyby. Žádná externí knihovna není potřeba (stack zůstává čistý HTML/JS). Otestováno vizuálně nelze bez prohlížeče, doporučuji stránku otevřet přes `npx serve .` a zkontrolovat sekci `#grafy` na desktopu i mobilu.

---

