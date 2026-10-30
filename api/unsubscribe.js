import { getRedis } from "../lib/store.js";
import { verifyToken, unsubscribeLead } from "../lib/unsubscribe.js";

const PAGE =
  '<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
  '<meta name="robots" content="noindex">' +
  "<title>Odhlášení – ETF Clientelo.cz</title>" +
  '<link rel="stylesheet" href="/assets/css/style.css"></head>' +
  '<body><main><section class="section"><div class="wrap narrow center">' +
  '<h1 class="section__title">Byli jste odhlášeni.</h1>' +
  '<p class="section__lead">Na tento e-mail už nebudou chodit žádné další tipy. ' +
  "Pokud jste se odhlásili omylem, můžete se znovu přihlásit přes formulář na stránce.</p>" +
  '<a href="/" class="btn btn--accent btn--lg">Zpět na kalkulačku</a>' +
  "</div></section></main></body></html>";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  let token = req.query?.token;
  if (!token && req.method === "POST") {
    const body = typeof req.body === "string" ? safeParse(req.body) : req.body;
    token = body && body.token;
  }
  if (typeof token !== "string" || !token) {
    return res.status(400).json({ error: "missing_token" });
  }

  const email = verifyToken(token);
  if (!email) {
    return res.status(401).json({ error: "invalid_token" });
  }

  const redis = getRedis();
  if (!redis) {
    return res.status(503).json({ error: "db_not_configured" });
  }

  try {
    const removed = await unsubscribeLead(redis, email);
    console.log("[unsubscribe]", JSON.stringify({ email: email, removed: removed, ts: new Date().toISOString() }));
    if (req.method === "POST") {
      return res.status(200).json({ ok: true, removed: removed });
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(PAGE);
  } catch (err) {
    console.error("[unsubscribe] error", String((err && err.message) || err).slice(0, 300));
    return res.status(503).json({ error: "db_unavailable" });
  }
}

function safeParse(s) {
  try { return JSON.parse(s); } catch (e) { return null; }
}
