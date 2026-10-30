import { randomUUID } from "node:crypto";
import { buildReportModel, formatCzk, formatTer, formatRate } from "../lib/report.js";
import { generateReportPdf } from "../lib/report-pdf.js";
import { getRedis, saveReport, isValidReportId } from "../lib/store.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const hits = globalThis.__leadRateLimit || (globalThis.__leadRateLimit = new Map());

function rateLimited(key) {
  const now = Date.now();
  const win = 60 * 1000;
  const arr = (hits.get(key) || []).filter(function (t) { return now - t < win; });
  if (arr.length >= 5) {
    hits.set(key, arr);
    return true;
  }
  arr.push(now);
  hits.set(key, arr);
  return false;
}

function reportText(model) {
  const lines = [];
  if (model.calc) {
    const calc = model.calc;
    lines.push(
      "Váš výpočet z kalkulačky poplatků:",
      "- Vklad: " + formatCzk(calc.initial) + ", měsíčně " + formatCzk(calc.monthly) + ", " + calc.years + " let",
      "- Model: hrubý výnos 8 % p.a., poplatek TER " + formatTer(calc.ter) + " (" + calc.fund + ")",
      "- Koncová hodnota portfolia: " + formatCzk(calc.finalValue),
      "- Zaplacené poplatky celkem: " + formatCzk(calc.feesPaid),
      ""
    );
  }
  if (model.portfolio) {
    lines.push(
      "Vaše skladání portfolia:",
      "- Váhované TER: " + formatTer(model.portfolio.weightedTer),
      "- Koncová hodnota vašeho portfolia: " + formatCzk(model.portfolio.yourFinalValue),
      ""
    );
  }
  if (model.tax) {
    lines.push(
      "Výpočet daně z dividend (W-8BEN):",
      "- Roční dividendový příjem: " + formatCzk(model.tax.annualDividend),
      "- Srážková sazba: " + formatRate(model.tax.taxRate),
      "- Úspora s W-8BEN ročně: " + formatCzk(model.tax.annualSavings),
      ""
    );
  }
  if (!lines.length) {
    lines.push("V příloze najdete srovnání šesti ETF, checklist prvních kroků a upozornění na rizika.", "");
  }
  return lines.join("\n");
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

  const { email, consent, utm, calc, portfolio, tax, company, page, referrer, ts } = body;

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

  const model = buildReportModel({ calc: calc, portfolio: portfolio, tax: tax });

  const record = {
    email: emailNorm.slice(0, 254),
    consent: true,
    consentAt: new Date().toISOString(),
    utm: utm && typeof utm === "object" ? utm : {},
    page: typeof page === "string" ? page.slice(0, 200) : null,
    referrer: typeof referrer === "string" ? referrer.slice(0, 400) : null,
    ts: typeof ts === "string" ? ts : new Date().toISOString(),
    ip: String(ip).slice(0, 60)
  };

  console.log("[lead]", JSON.stringify({
    email: record.email,
    utm: record.utm,
    sections: {
      calc: !!model.calc,
      portfolio: !!model.portfolio,
      tax: !!model.tax
    },
    ts: record.ts
  }));

  const db = await saveLeadToDb(record);
  if (!db.configured) {
    console.error("[lead] db_not_configured – nastav UPSTASH_REDIS_REST_URL a UPSTASH_REDIS_REST_TOKEN");
    return res.status(503).json({ error: "db_not_configured" });
  }
  if (!db.stored) {
    return res.status(503).json({ error: "db_unavailable" });
  }

  const redis = getRedis();

  const reportId = randomUUID().replace(/-/g, "");
  if (!isValidReportId(reportId)) {
    return res.status(200).json({ ok: true, stored: true, queued: false, mode: "report_failed" });
  }

  try {
    const pdfBuffer = await generateReportPdf(model);
    const pdfBase64 = pdfBuffer.toString("base64");
    await saveReport(redis, reportId, {
      version: 1,
      createdAt: model.createdAt,
      model: model
    });
  } catch (err) {
    console.error("[lead] store_error", String((err && err.message) || err).slice(0, 300));
    return res.status(200).json({ ok: true, stored: true, queued: false, mode: "report_failed" });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("[lead] log_only – report ulozen, reportId=" + reportId);
      return res.status(200).json({ ok: true, stored: true, queued: false, mode: "log_only", reportId: reportId });
    }

    const origin = "https://" + (req.headers.host || "etf-poplatky.vercel.app");
    const from = process.env.RESEND_FROM || "ETF Clientelo <onboarding@resend.dev>";
    const replyTo = process.env.REPLY_TO || undefined;
    const reportUrl = origin + "/thank-you.html?id=" + reportId;

    await sendWithResend(apiKey, {
      from: from,
      to: [record.email],
      reply_to: replyTo,
      subject: "Váš osobní report: kolik vás stojí poplatky u ETF",
      text: [
        "Děkujeme za váš zájem.",
        "",
        reportText(model),
        "V příloze tohoto e-mailu najdete Váš osobní report ve formátu PDF.",
        "V PDF jsou zahrnuty pouze sekce, které jste vyplnil(a) (kalkulačka, portfólio, daň z dividend).",
        "Jde o tentýž soubor, který se zobrazí po kliknutí na odkaz níže.",
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

    return res.status(200).json({ ok: true, stored: true, queued: true, reportId: reportId });
  } catch (err) {
    console.error("[lead] resend_error", String((err && err.message) || err).slice(0, 300));
    return res.status(200).json({ ok: true, stored: true, queued: false, mode: "resend_failed", reportId: reportId });
  }
}
