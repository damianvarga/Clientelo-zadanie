import { Redis } from "@upstash/redis";
import PDFDocument from "pdfkit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const hits = globalThis.__leadRateLimit || (globalThis.__leadRateLimit = new Map());

function rateLimited(key) {
  const now = Date.now();
  const win = 60 * 1000;
  const arr = (hits.get(key) || []).filter((t) => now - t < win);
  if (arr.length >= 5) {
    hits.set(key, arr);
    return true;
  }
  arr.push(now);
  hits.set(key, arr);
  return false;
}

function czk(v) {
  return Math.round(Number(v) || 0).toLocaleString("cs-CZ").replace(/\u00a0/g, " ") + " Kč";
}

function stripDiacritics(str) {
  return String(str || "")
    .replace(/á/g, "a").replace(/č/g, "c").replace(/ď/g, "d")
    .replace(/é/g, "e").replace(/ě/g, "e").replace(/í/g, "i")
    .replace(/ň/g, "n").replace(/ó/g, "o").replace(/ř/g, "r")
    .replace(/š/g, "s").replace(/ť/g, "t").replace(/ů/g, "u")
    .replace(/ú/g, "u").replace(/ý/g, "y").replace(/ž/g, "z")
    .replace(/Á/g, "A").replace(/Č/g, "C").replace(/Ď/g, "D")
    .replace(/É/g, "E").replace(/Ě/g, "E").replace(/Í/g, "I")
    .replace(/Ň/g, "N").replace(/Ó/g, "O").replace(/Ř/g, "R")
    .replace(/Š/g, "S").replace(/Ť/g, "T").replace(/Ů/g, "U")
    .replace(/Ú/g, "U").replace(/Ý/g, "Y").replace(/Ž/g, "Z");
}

function generateReportPdf(record) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: "A4", margin: 50, info: { Title: "Osobni report - ETF Poplatky.cz" } });

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const calc = record.calc || null;
    const portfolio = record.portfolio || null;
    const tax = record.tax || null;

    doc.fontSize(22).font("Helvetica-Bold").text(stripDiacritics("Osobní report: dopad poplatků ETF"), { align: "center" });
    doc.fontSize(11).font("Helvetica").text(stripDiacritics("ETF Poplatky.cz — vzdělávací výpočet, nikoli investiční poradenství"), { align: "center" });
    doc.moveDown();
    doc.fontSize(9).font("Helvetica").text("Vypracovano: " + new Date().toLocaleDateString("cs-CZ"), { align: "center" });
    doc.moveDown(1.5);

    if (calc) {
      doc.fontSize(15).font("Helvetica-Bold").text(stripDiacritics("Kalkulacka poplatku"));
      doc.moveDown(0.5);
      doc.fontSize(10.5).font("Helvetica");
      doc.text("Jednorazovy vklad: " + czk(calc.initial));
      doc.text("Měsíční platba: " + czk(calc.monthly));
      doc.text("Investicni horizont: " + calc.years + " let");
      doc.text("Typ fondu: " + calc.fund + " (TER " + String(calc.ter).replace(".", ",") + " %)");
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").text("Koncova hodnota portfolia: " + czk(calc.finalValue));
      doc.font("Helvetica").text("Zaplacene poplatky celkem: " + czk(calc.feesPaid));
      doc.text("Rozdil proti nejlevnejsimu ETF (0,03 %): " + (calc.gapVsCheapest > 0 ? "- " : "") + czk(calc.gapVsCheapest));
      doc.moveDown(1.2);
    }

    if (portfolio) {
      doc.fontSize(15).font("Helvetica-Bold").text(stripDiacritics("Vase portfolio"));
      doc.moveDown(0.5);
      doc.fontSize(10.5).font("Helvetica");
      doc.text("Vahovane TER: " + String(portfolio.weightedTer).replace(".", ",") + " %");
      Object.entries(portfolio.allocations || {}).forEach(function (entry) {
        var ticker = entry[0];
        var weight = entry[1];
        if (weight > 0) {
          doc.text(ticker + ": " + weight + "%");
        }
      });
      doc.moveDown(0.5);
      doc.text("Koncova hodnota vaseho portfolia: " + czk(portfolio.yourFinalValue));
      doc.text("Koncova hodnota nejlevnejsiho ETF: " + czk(portfolio.cheapFinalValue));
      doc.text("Koncova hodnota prumerneho fondu: " + czk(portfolio.avgFinalValue));
      doc.moveDown(1.2);
    }

    if (tax) {
      doc.fontSize(15).font("Helvetica-Bold").text(stripDiacritics("Dan z dividend (W-8BEN)"));
      doc.moveDown(0.5);
      doc.fontSize(10.5).font("Helvetica");
      doc.text("Rocni dividendovy prijme: " + czk(tax.annualDividend));
      doc.text("Srazkova sazba: " + String(tax.taxRate * 100).replace(".", ",") + " %");
      doc.text("Srazkova dan rocne: " + czk(tax.taxWithheld));
      doc.text("Cisty prijme rocne: " + czk(tax.netAmount));
      doc.text("Uspora s W-8BEN rocne: " + czk(tax.annualSavings));
      doc.text("Uspora za 10 let: " + czk(tax.savings10yr));
      doc.text("Uspora za 20 let: " + czk(tax.savings20yr));
      doc.moveDown(1.2);
    }

    doc.fontSize(15).font("Helvetica-Bold").text(stripDiacritics("Porovnani sest ETF"));
    doc.moveDown(0.5);
    doc.fontSize(10.5).font("Helvetica-Bold").text("ETF    Sledovany index    TER %", { continued: false });
    doc.moveDown(0.3);
    doc.font("Helvetica");
    var etfRows = [
      ["VOO", "S&P 500", "0,03 %"],
      ["IVV", "S&P 500", "0,03 %"],
      ["VTI", "Cely trh USA", "0,03 %"],
      ["SCHD", "Dow Jones US Dividend 100", "0,06 %"],
      ["SPY", "S&P 500", "0,0945 %"],
      ["QQQ", "Nasdaq-100", "0,18 %"]
    ];
    etfRows.forEach(function (row) {
      doc.text(row[0] + "    " + row[1] + "    " + row[2]);
    });
    doc.moveDown(1.2);

    doc.fontSize(15).font("Helvetica-Bold").text(stripDiacritics("Checklist prvnich kroku"));
    doc.moveDown(0.5);
    doc.fontSize(10.5).font("Helvetica");
    var checklist = [
      "Formular W-8BEN – vyplnte u brokere, snizí srazkovou dan z dividend z 30 % na 15 % (smlouva CR-USA c. 32/1994 Sb., clan. 10).",
      "Porovnavejte TER, ne znacku – VOO, IVV i VTI maji 0,03 %; SPY 0,0945 %; QQQ 0,18 %.",
      "Vyberte brokera – sledujte poplatky za obchod, menovy prevod, podporu W-8BEN a pojisteni vkladů.",
      "Prvni nákup – zacnete castkou, kterou nemusite brat 10+ let. Pravidelnost porazi nacasovani.",
      "Nastavte si mesicni platbu – to, co kalkulacka predpoklada, musite realne delat."
    ];
    checklist.forEach(function (item, i) {
      doc.text((i + 1) + ". " + item);
    });
    doc.moveDown(1.2);

    doc.fontSize(9).font("Helvetica-Oblique").text(stripDiacritics("Upozorneni na rizika: Vzdelavaci vypocet, nikoli investicni poradenstvi. Model pocita s hrubym vynosem 8 % p.a. a mesicnim slozenym urokem; minule vynosy nezarucuje vynosy budouci. Vsechna cisla maji zdroj uvedeny na hlavni strasnce."));

    doc.end();
  });
}

function reportText(calc) {
  if (!calc || !calc.years) {
    return "Report najdete na strance /thank-you.html – srovnani sesti ETF a checklist prvniho nakupu.";
  }
  return [
    "Vas vypocet z kalkulacky:",
    "- Vklad: " + czk(calc.initial) + ", mesicne " + czk(calc.monthly) + ", " + calc.years + " let",
    "- Model: hruby vynos 8 % p.a., poplatek TER " + String(calc.ter).replace(".", ",") + " % (" + calc.fund + ")",
    "- Konecna hodnota portfolia: " + czk(calc.finalValue),
    "- Zaplacene poplatky celkem: " + czk(calc.feesPaid),
    "- Rozdil proti nejlevnejsimu ETF (0,03 %): " + czk(calc.gapVsCheapest),
    "",
    "Celý report a checklist si otevrete na strance /thank-you.html (odkaz naleznete i v tomto e-mailu)."
  ].join("\n");
}

async function sendWithResend(key, payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error("Resend " + res.status + ": " + body);
  }
  return res.json();
}

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function saveLeadToDb(record) {
  const redis = getRedis();
  if (!redis) return { configured: false, stored: false };
  if (record.consent !== true) return { configured: true, stored: false };
  try {
    await redis
      .multi()
      .hset("newsletter:lead:" + record.email, {
        email: record.email,
        consent: "true",
        consentAt: record.consentAt || "",
        ip: record.ip || "",
        page: record.page || "",
        referrer: record.referrer || "",
        utm: JSON.stringify(record.utm || {}),
        ts: record.ts || ""
      })
      .sadd("newsletter:emails", record.email)
      .exec();
    return { configured: true, stored: true };
  } catch (err) {
    console.error("[lead] db_error", String((err && err.message) || err).slice(0, 300));
    return { configured: true, stored: false };
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "bad_json" });

  const { email, consent, utm, calc, company, page, referrer, ts } = body;

  if (company) return res.status(200).json({ ok: true, queued: false });

  const emailNorm = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!emailNorm || !EMAIL_RE.test(emailNorm)) {
    return res.status(422).json({ error: "invalid_email" });
  }
  if (consent !== true) {
    return res.status(422).json({ error: "consent_required" });
  }

  const ip = req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "unknown";
  if (rateLimited(String(ip).split(",")[0].trim())) {
    return res.status(422).json({ error: "rate_limited" });
  }

  const record = {
    email: emailNorm.slice(0, 254),
    consent: true,
    consentAt: new Date().toISOString(),
    utm: utm && typeof utm === "object" ? utm : {},
    calc: calc && typeof calc === "object" ? calc : null,
    page: typeof page === "string" ? page.slice(0, 200) : null,
    referrer: typeof referrer === "string" ? referrer.slice(0, 400) : null,
    ts: typeof ts === "string" ? ts : new Date().toISOString(),
    ip: String(ip).slice(0, 60)
  };

  console.log("[lead]", JSON.stringify(record));

  const db = await saveLeadToDb(record);
  if (!db.configured) {
    console.error("[lead] db_not_configured – nastav UPSTASH_REDIS_REST_URL a UPSTASH_REDIS_REST_TOKEN");
    return res.status(503).json({ error: "db_not_configured" });
  }
  if (!db.stored) {
    return res.status(503).json({ error: "db_unavailable" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ ok: true, stored: true, queued: false, mode: "log_only" });
  }

  const origin = "https://" + (req.headers.host || "etf-poplatky.vercel.app");
  const from = process.env.RESEND_FROM || "ETF Poplatky <onboarding@resend.dev>";
  const replyTo = process.env.REPLY_TO || undefined;

  try {
    const reportParams = new URLSearchParams();
    if (record.calc) {
      reportParams.set("fv", record.calc.finalValue);
      reportParams.set("fees", record.calc.feesPaid);
      reportParams.set("gap", record.calc.gapVsCheapest);
      reportParams.set("initial", record.calc.initial);
      reportParams.set("monthly", record.calc.monthly);
      reportParams.set("years", record.calc.years);
      reportParams.set("ter", record.calc.ter);
      reportParams.set("fund", record.calc.fund);
    }
    if (record.portfolio) {
      reportParams.set("p_alloc", encodeURIComponent(JSON.stringify(record.portfolio.allocations)));
      reportParams.set("p_wt", record.portfolio.weightedTer);
      reportParams.set("p_yfv", record.portfolio.yourFinalValue);
      reportParams.set("p_cfv", record.portfolio.cheapFinalValue);
      reportParams.set("p_afv", record.portfolio.avgFinalValue);
      reportParams.set("p_gvc", record.portfolio.gapVsCheapest);
      reportParams.set("p_gva", record.portfolio.gapVsAverage);
    }
    if (record.tax) {
      reportParams.set("t_ad", record.tax.annualDividend);
      reportParams.set("t_ar", record.tax.taxRate);
      reportParams.set("t_at", record.tax.taxWithheld);
      reportParams.set("t_an", record.tax.netAmount);
      reportParams.set("t_as", record.tax.annualSavings);
      reportParams.set("t_10", record.tax.savings10yr);
      reportParams.set("t_20", record.tax.savings20yr);
    }
    const reportUrl = origin + "/thank-you.html" + (reportParams.toString() ? "?" + reportParams.toString() : "");

    const pdfBuffer = await generateReportPdf(record);
    const pdfBase64 = pdfBuffer.toString("base64");

    await sendWithResend(apiKey, {
      from: from,
      to: [record.email],
      reply_to: replyTo,
      subject: "Váš osobní report: kolik vás stojí poplatky u ETF",
      html: [
        "<h2>Děkujeme za váš zájem.</h2>",
        "<p>V příloze tohoto e-mailu najdete Váš osobní report ve formátu PDF.</p>",
        reportText(record.calc).split("\n").map(function (line) { return "<p>" + line + "</p>"; }).join(""),
        "<p><a href=\"" + reportUrl + "\">Zobrazit report online</a></p>",
        "<p>--</p>",
        "<p style=\"font-size:12px; color:#666666;\">Pro odhlášení odpovězte na tento e-mail se slovem ODHLASIT.<br>Údaje slouží pouze ke zaslání reportu a souvisejících tipů (GDPR).</p>"
      ].join(""),
      text: [
        "Děkujeme za váš zájem.",
        "",
        reportText(record.calc),
        "",
        "Report: " + reportUrl,
        "",
        "--",
        "Pro odhlášení odpovězte na tento e-mail se slovem ODHLASIT.",
        "Údaje slouží pouze ke zaslání reportu a souvisejících tipů (GDPR)."
      ].join("\n"),
      attachments: [
        {
          filename: "ETF_osobni_report.pdf",
          content: pdfBase64
        }
      ]
    });

    return res.status(200).json({ ok: true, stored: true, queued: true });
  } catch (err) {
    console.error("[lead] resend_error", String((err && err.message) || err).slice(0, 300));
    return res.status(200).json({ ok: true, stored: true, queued: false, mode: "resend_failed" });
  }
}
