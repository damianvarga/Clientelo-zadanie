const ETF_ROWS = [
  ["VOO", "S&P 500", "0,03 %"],
  ["IVV", "S&P 500", "0,03 %"],
  ["VTI", "Celý trh USA", "0,03 %"],
  ["SCHD", "Dow Jones U.S. Dividend 100", "0,06 %"],
  ["SPY", "S&P 500", "0,0945 %"],
  ["QQQ", "Nasdaq-100", "0,18 %"]
];

const CHECKLIST_ITEMS = [
  "Formulář W-8BEN – vyplňte jej u brokera, aby se za podmínek příslušné smlouvy snížila americká srážková daň z dividend z 30 % na 15 %. Viz smlouva ČR–USA č. 32/1994 Sb., čl. 10.",
  "Porovnávejte TER, ne značku – VOO, IVV i VTI mají TER 0,03 %; SCHD 0,06 %; SPY 0,0945 %; QQQ 0,18 %.",
  "Vyberte brokera – sledujte poplatky za obchod, měnovou konverzi, podporu W-8BEN a ochranu klientských aktiv.",
  "První nákup – začněte částkou, kterou nebudete potřebovat alespoň 10 let. Pravidelné investování neodstraňuje tržní riziko ani nezaručuje lepší výsledek.",
  "Nastavte si měsíční platbu – pokud počítáte s pravidelným investováním, nastavte si odpovídající platbu a ověřte, že odpovídá vašim finančním možnostem."
];

const RISK_WARNING =
  "Upozornění na rizika: Tento report má vzdělávací a informační charakter a nepředstavuje investiční poradenství ani doporučení k nákupu či prodeji cenných papírů. Modelové výpočty používají předpoklady uvedené u příslušné kalkulačky; pokud je použit modelový hrubý výnos 8 % p.a. a měsíční složené úročení, jde pouze o hypotetický scénář, nikoli o předpověď výnosu. Hodnota investic může růst i klesat a návratnost vložených prostředků není zaručena. Minulé výnosy nezaručují výnosy budoucí. Skutečné výsledky ovlivňují také daně, transakční náklady, měnové kurzy a další faktory. Údaje o ETF a jejich poplatcích ověřte u příslušného správce fondu.";

const REPORT_TITLE = "Osobní report: dopad poplatků ETF";
const REPORT_SUBTITLE = "ETF Poplatky.cz — vzdělávací výpočet, nikoli investiční poradenství";

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function round(v) {
  return Math.round(v);
}

export function formatCzk(v) {
  return Math.round(Number(v) || 0).toLocaleString("cs-CZ").replace(/ /g, " ") + " Kč";
}

export function formatTer(v) {
  return Number(v).toLocaleString("cs-CZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).replace(/ /g, " ") + " %";
}

export function formatRate(rate) {
  return (Math.round(Number(rate) * 10000) / 100).toLocaleString("cs-CZ").replace(/ /g, " ") + " %";
}

export function sanitizeCalc(input) {
  if (!input || typeof input !== "object") return null;
  const finalValue = num(input.finalValue);
  const years = num(input.years);
  const ter = num(input.ter);
  if (finalValue === null || finalValue <= 0) return null;
  if (years === null || years < 1) return null;
  if (ter === null || ter <= 0) return null;
  return {
    initial: Math.max(0, num(input.initial) || 0),
    monthly: Math.max(0, num(input.monthly) || 0),
    years: round(years),
    ter: ter,
    fund: typeof input.fund === "string" && input.fund.trim() ? input.fund.trim().slice(0, 60) : "VOO / IVV / VTI",
    finalValue: round(finalValue),
    feesPaid: round(num(input.feesPaid) || 0),
    gapVsCheapest: round(num(input.gapVsCheapest) || 0)
  };
}

export function sanitizePortfolio(input) {
  if (!input || typeof input !== "object") return null;
  if (!input.allocations || typeof input.allocations !== "object") return null;
  const allocations = {};
  let sum = 0;
  Object.entries(input.allocations).forEach(function (entry) {
    const ticker = String(entry[0]).toUpperCase();
    const weight = num(entry[1]);
    if (weight === null || weight <= 0) return;
    if (!/^[A-Z]{2,6}$/.test(ticker)) return;
    allocations[ticker] = Math.round(weight * 100) / 100;
    sum += weight;
  });
  if (Math.abs(sum - 100) > 0.51) return null;
  const weightedTer = num(input.weightedTer);
  const yourFinalValue = num(input.yourFinalValue);
  if (weightedTer === null || weightedTer < 0) return null;
  if (yourFinalValue === null || yourFinalValue <= 0) return null;
  return {
    allocations: allocations,
    weightedTer: weightedTer,
    yourFinalValue: round(yourFinalValue),
    cheapFinalValue: round(num(input.cheapFinalValue) || 0),
    avgFinalValue: round(num(input.avgFinalValue) || 0),
    gapVsCheapest: round(num(input.gapVsCheapest) || 0),
    gapVsAverage: round(num(input.gapVsAverage) || 0),
    years: round(num(input.years) || 25),
    initial: Math.max(0, num(input.initial) || 0),
    monthly: Math.max(0, num(input.monthly) || 0)
  };
}

export function sanitizeTax(input) {
  if (!input || typeof input !== "object") return null;
  const annualDividend = num(input.annualDividend);
  if (annualDividend === null || annualDividend <= 0) return null;
  const taxRate = num(input.taxRate);
  if (taxRate === null || taxRate <= 0 || taxRate >= 1) return null;
  return {
    annualDividend: round(annualDividend),
    hasW8ben: input.hasW8ben !== false,
    taxRate: taxRate,
    taxWithheld: round(num(input.taxWithheld) || 0),
    netAmount: round(num(input.netAmount) || 0),
    annualSavings: round(num(input.annualSavings) || 0),
    savings10yr: round(num(input.savings10yr) || 0),
    savings20yr: round(num(input.savings20yr) || 0)
  };
}

export function buildReportModel(body, now) {
  return {
    version: 1,
    createdAt: (now || new Date()).toISOString(),
    calc: sanitizeCalc(body && body.calc),
    portfolio: sanitizePortfolio(body && body.portfolio),
    tax: sanitizeTax(body && body.tax)
  };
}

export function buildReportContent(model) {
  const sections = [];

  if (model.calc) {
    const calc = model.calc;
    sections.push({
      kind: "kv",
      id: "calc",
      title: "Kalkulačka poplatků",
      rows: [
        ["Jednorázový vklad", formatCzk(calc.initial)],
        ["Měsíční platba", formatCzk(calc.monthly)],
        ["Investiční horizont", calc.years + " let"],
        ["Typ fondu", calc.fund + " (TER " + formatTer(calc.ter) + ")"],
        ["Koncová hodnota portfolia", formatCzk(calc.finalValue)],
        ["Zaplacené poplatky celkem", formatCzk(calc.feesPaid)],
        ["Rozdíl proti nejlevnějšímu ETF (0,03 %)", (calc.gapVsCheapest > 0 ? "− " : "") + formatCzk(calc.gapVsCheapest)]
      ]
    });
  }

  if (model.portfolio) {
    const p = model.portfolio;
    const allocText = Object.entries(p.allocations)
      .sort(function (a, b) { return b[1] - a[1]; })
      .map(function (entry) { return entry[0] + " " + entry[1] + " %"; })
      .join(", ");
    sections.push({
      kind: "kv",
      id: "portfolio",
      title: "Skládání ETF portfolia",
      rows: [
        ["Rozdělení vah", allocText],
        ["Váhované TER", formatTer(p.weightedTer)],
        ["Modelový horizont", p.years + " let, " + formatCzk(p.initial) + " + " + formatCzk(p.monthly) + "/měs."],
        ["Koncová hodnota vašeho portfolia", formatCzk(p.yourFinalValue)],
        ["Koncová hodnota nejlevnějšího ETF (0,03 %)", formatCzk(p.cheapFinalValue)],
        ["Koncová hodnota průměrného fondu (0,41 %)", formatCzk(p.avgFinalValue)],
        ["Rozdíl proti nejlevnějšímu ETF (0,03 %)", p.gapVsCheapest > 0 ? "− " + formatCzk(p.gapVsCheapest) : "0 Kč"]
      ]
    });
  }

  if (model.tax) {
    const t = model.tax;
    sections.push({
      kind: "kv",
      id: "tax",
      title: "Daň z dividend (W-8BEN)",
      rows: [
        ["Roční dividendový příjem", formatCzk(t.annualDividend)],
        ["Srážková sazba", formatRate(t.taxRate)],
        ["Srážková daň ročně", formatCzk(t.taxWithheld)],
        ["Čistý příjem ročně", formatCzk(t.netAmount)],
        ["Úspora s W-8BEN ročně", formatCzk(t.annualSavings)],
        ["Úspora za 10 let", formatCzk(t.savings10yr)],
        ["Úspora za 20 let", formatCzk(t.savings20yr)]
      ]
    });
  }

  sections.push({
    kind: "table",
    id: "etf-comparison",
    title: "Porovnání šesti ETF",
    headers: ["ETF", "Sledovaný index", "TER %"],
    rows: ETF_ROWS.map(function (row) { return row.slice(); })
  });

  sections.push({
    kind: "list",
    id: "checklist",
    title: "Checklist prvních kroků",
    items: CHECKLIST_ITEMS.slice()
  });

  sections.push({
    kind: "note",
    id: "risk-warning",
    title: "",
    text: RISK_WARNING
  });

  return {
    title: REPORT_TITLE,
    subtitle: REPORT_SUBTITLE,
    createdAt: model.createdAt,
    sections: sections
  };
}

export const REPORT_STATIC_TEXT = {
  title: REPORT_TITLE,
  subtitle: REPORT_SUBTITLE,
  etfRows: ETF_ROWS,
  checklistItems: CHECKLIST_ITEMS,
  riskWarning: RISK_WARNING
};
