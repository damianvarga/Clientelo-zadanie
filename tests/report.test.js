import test from "node:test";
import assert from "node:assert/strict";
import {
  buildReportModel,
  buildReportContent,
  sanitizeCalc,
  sanitizePortfolio,
  sanitizeTax,
  formatCzk,
  formatTer,
  formatRate,
  REPORT_STATIC_TEXT
} from "../lib/report.js";
import { generateReportPdf } from "../lib/report-pdf.js";

const FULL_CALC = {
  initial: 100000,
  monthly: 3000,
  years: 25,
  gross: 0.08,
  ter: 0.0945,
  fund: "SPY",
  finalValue: 5541000,
  feesPaid: 420000,
  gapVsCheapest: 234728,
  finalValueCheapest: 5775728,
  feesPaidCheapest: 185272
};

const FULL_PORTFOLIO = {
  allocations: { VOO: 60, IVV: 40, SPY: 0, QQQ: 0, VTI: 0, SCHD: 0 },
  weightedTer: 0.03,
  yourFinalValue: 5775728,
  cheapFinalValue: 5775728,
  avgFinalValue: 5000000,
  gapVsCheapest: 0,
  gapVsAverage: 775728,
  years: 25,
  initial: 100000,
  monthly: 3000
};

const FULL_TAX = {
  annualDividend: 24000,
  hasW8ben: true,
  taxRate: 0.15,
  taxWithheld: 3600,
  netAmount: 20400,
  annualSavings: 3600,
  savings10yr: 36000,
  savings20yr: 72000
};

test("formatovanie českých čísel a mien", () => {
  assert.equal(formatCzk(123456.4), "123 456 Kč");
  assert.equal(formatCzk(0), "0 Kč");
  assert.ok(!formatCzk(1234567).includes(" "));
  assert.equal(formatTer(0.0945), "0,0945 %");
  assert.equal(formatTer(0.03), "0,03 %");
  assert.equal(formatRate(0.15), "15 %");
  assert.equal(formatRate(0.3), "30 %");
});

test("sanitizeCalc: prázdny/neúplný vstup → null (žiadne predvolené hodnoty)", () => {
  assert.equal(sanitizeCalc(null), null);
  assert.equal(sanitizeCalc({}), null);
  assert.equal(sanitizeCalc({ initial: 100000, monthly: 3000, years: 25 }), null);
  assert.equal(sanitizeCalc({ finalValue: "abc", years: 25, ter: 0.03 }), null);
  assert.equal(sanitizeCalc({ finalValue: 0, years: 25, ter: 0.03 }), null);
});

test("sanitizeCalc: vyplnený vstup sa zachová (vrátane zaokrúhlenia)", () => {
  const calc = sanitizeCalc(FULL_CALC);
  assert.equal(calc.initial, 100000);
  assert.equal(calc.monthly, 3000);
  assert.equal(calc.years, 25);
  assert.equal(calc.ter, 0.0945);
  assert.equal(calc.fund, "SPY");
  assert.equal(calc.finalValue, 5541000);
  assert.equal(calc.feesPaid, 420000);
  assert.equal(calc.gapVsCheapest, 234728);
});

test("sanitizePortfolio: neúplné váhy (súčet ≠ 100) → null", () => {
  assert.equal(sanitizePortfolio(null), null);
  assert.equal(sanitizePortfolio({ allocations: { VOO: 50 } }), null);
  assert.equal(sanitizePortfolio({ allocations: { VOO: 60, IVV: 30 }, weightedTer: 0.03, yourFinalValue: 100 }), null);
});

test("sanitizePortfolio: súčet 100 → sekcia je vyplnená", () => {
  const p = sanitizePortfolio(FULL_PORTFOLIO);
  assert.equal(p.weightedTer, 0.03);
  assert.equal(p.allocations.VOO, 60);
  assert.equal(p.allocations.IVV, 40);
  assert.equal(p.yourFinalValue, 5775728);
});

test("sanitizeTax: nulový alebo chýbajúci príjem → null", () => {
  assert.equal(sanitizeTax(null), null);
  assert.equal(sanitizeTax({ annualDividend: 0, taxRate: 0.15 }), null);
  assert.equal(sanitizeTax({ annualDividend: 24000 }), null);
});

test("sanitizeTax: vyplnený vstup sa zachová", () => {
  const t = sanitizeTax(FULL_TAX);
  assert.equal(t.annualDividend, 24000);
  assert.equal(t.taxRate, 0.15);
  assert.equal(t.taxWithheld, 3600);
});

test("buildReportModel: prázdny body → všetky voliteľné sekcie null", () => {
  const model = buildReportModel({}, new Date("2026-01-01T10:00:00Z"));
  assert.equal(model.calc, null);
  assert.equal(model.portfolio, null);
  assert.equal(model.tax, null);
});

test("buildReportContent: povinné sekcie sú vždy prítomné a presné", () => {
  const content = buildReportContent(buildReportModel({}));
  const ids = content.sections.map((s) => s.id);
  assert.deepEqual(ids, ["etf-comparison", "checklist", "risk-warning"]);

  const etf = content.sections.find((s) => s.id === "etf-comparison");
  assert.deepEqual(etf.headers, ["ETF", "Sledovaný index", "TER %"]);
  assert.deepEqual(etf.rows, REPORT_STATIC_TEXT.etfRows);
  assert.equal(etf.rows.length, 6);
  assert.deepEqual(etf.rows[0], ["VOO", "S&P 500", "0,03 %"]);
  assert.deepEqual(etf.rows[2], ["VTI", "Celý trh USA", "0,03 %"]);
  assert.deepEqual(etf.rows[3], ["SCHD", "Dow Jones U.S. Dividend 100", "0,06 %"]);
  assert.deepEqual(etf.rows[4], ["SPY", "S&P 500", "0,0945 %"]);
  assert.deepEqual(etf.rows[5], ["QQQ", "Nasdaq-100", "0,18 %"]);

  const checklist = content.sections.find((s) => s.id === "checklist");
  assert.equal(checklist.title, "Checklist prvních kroků");
  assert.equal(checklist.items.length, 5);
  assert.ok(checklist.items[0].includes("W-8BEN"));
  assert.ok(checklist.items[0].includes("32/1994 Sb."));
  assert.ok(checklist.items[1].includes("SCHD 0,06 %"));
  assert.ok(checklist.items[4].includes("měsíční platbu"));

  const risk = content.sections.find((s) => s.id === "risk-warning");
  assert.equal(risk.text, REPORT_STATIC_TEXT.riskWarning);
  assert.ok(risk.text.startsWith("Upozornění na rizika:"));
});

test("buildReportContent: nevyplnené sekcie sa nezobrazia (žiadne pomlčky/nuly)", () => {
  const content = buildReportContent(buildReportModel({ calc: {}, portfolio: {}, tax: { annualDividend: 0 } }));
  const ids = content.sections.map((s) => s.id);
  assert.ok(!ids.includes("calc"));
  assert.ok(!ids.includes("portfolio"));
  assert.ok(!ids.includes("tax"));
  for (const section of content.sections) {
    if (section.kind === "kv") {
      for (const row of section.rows) {
        assert.notEqual(row[1], "–");
        assert.notEqual(row[1], "-");
      }
    }
  }
});

test("buildReportContent: vyplnené sekcie obsahujú aktuálne hodnoty kalkulačiek", () => {
  const model = buildReportModel({
    calc: FULL_CALC,
    portfolio: FULL_PORTFOLIO,
    tax: FULL_TAX
  });
  const content = buildReportContent(model);
  const ids = content.sections.map((s) => s.id);
  assert.deepEqual(ids, ["calc", "portfolio", "tax", "etf-comparison", "checklist", "risk-warning"]);

  const calcRows = Object.fromEntries(content.sections.find((s) => s.id === "calc").rows);
  assert.equal(calcRows["Koncová hodnota portfolia"], "5 541 000 Kč");
  assert.equal(calcRows["Zaplacené poplatky celkem"], "420 000 Kč");
  assert.equal(calcRows["Rozdíl proti nejlevnějšímu ETF (0,03 %)"], "− 234 728 Kč");
  assert.equal(calcRows["Typ fondu"], "SPY (TER 0,0945 %)");

  const portfolioRows = Object.fromEntries(content.sections.find((s) => s.id === "portfolio").rows);
  assert.equal(portfolioRows["Váhované TER"], "0,03 %");
  assert.equal(portfolioRows["Rozdělení vah"], "VOO 60 %, IVV 40 %");

  const taxRows = Object.fromEntries(content.sections.find((s) => s.id === "tax").rows);
  assert.equal(taxRows["Roční dividendový příjem"], "24 000 Kč");
  assert.equal(taxRows["Srážková sazba"], "15 %");
  assert.equal(taxRows["Úspora s W-8BEN ročně"], "3 600 Kč");
});

test("PDF: generátor vytvorí jeden platný, deterministický súbor", async () => {
  const model = buildReportModel({ calc: FULL_CALC, portfolio: FULL_PORTFOLIO, tax: FULL_TAX }, new Date("2026-01-01T10:00:00Z"));
  const a = await generateReportPdf(model);
  const b = await generateReportPdf(model);
  assert.ok(a.subarray(0, 5).toString() === "%PDF-");
  assert.ok(a.length > 5000);
  assert.ok(Buffer.compare(a, b) === 0, "PDF z rovnakého modelu musí byť bitovo identické");
});

test("PDF: česká diakritika je zakódovaná v embedded fonte (nie transliterovaná)", async () => {
  const model = buildReportModel({ tax: FULL_TAX }, new Date("2026-01-01T10:00:00Z"));
  const pdf = await generateReportPdf(model);
  const content = buildReportContent(model);
  const checklist = content.sections.find((s) => s.id === "checklist");
  assert.ok(checklist.items[0].includes("č") || checklist.items[0].includes("ř"));
  assert.ok(!/Formular W-8BEN/.test(JSON.stringify(content)), "text nesmie byť bez diakritiky");
  assert.ok(pdf.includes(Buffer.from("/FontFile2")), "PDF musí obsahovať vložený TTF font");
});
