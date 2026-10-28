import { Redis } from "@upstash/redis";

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

    await sendWithResend(apiKey, {
      from: from,
      to: [record.email],
      reply_to: replyTo,
      subject: "Váš osobní report: kolik vás stojí poplatky u ETF",
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
      ].join("\n")
    });

    return res.status(200).json({ ok: true, stored: true, queued: true });
  } catch (err) {
    console.error("[lead] resend_error", String((err && err.message) || err).slice(0, 300));
    return res.status(200).json({ ok: true, stored: true, queued: false, mode: "resend_failed" });
  }
}
