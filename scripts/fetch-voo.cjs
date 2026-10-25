// Fetch VOO 5y daily history from Yahoo Finance chart API and write a compact JSON snapshot.
// Run: node scripts/fetch-voo.js
// Source: Yahoo Finance chart endpoint (query2.finance.yahoo.com) – public, no auth required.
// Data: adjusted daily close prices for VOO (Vanguard S&P 500 ETF).
// License/usage note: Yahoo Finance data is provided for informational purposes.
// Update cadence: re-run weekly before a live campaign to refresh assets/data/voo-history.json.

const https = require("https");
const fs = require("fs");
const path = require("path");

const url = "https://query2.finance.yahoo.com/v8/finance/chart/VOO?range=5y&interval=1d";

function toISODate(unixSeconds) {
  const d = new Date(unixSeconds * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

https.get(url, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
  }
}, (res) => {
  let body = "";
  res.on("data", (chunk) => { body += chunk; });
  res.on("end", () => {
    try {
      const parsed = JSON.parse(body);
      const result = parsed?.chart?.result?.[0];
      if (!result) throw new Error("no chart result");
      const timestamps = result.timestamp || [];
      const adj = result.indicators?.adjclose?.[0]?.adjclose || [];
      const rows = [];
      for (let i = 0; i < timestamps.length; i++) {
        if (adj[i] == null) continue;
        rows.push({ date: toISODate(timestamps[i]), close: Math.round(adj[i] * 100) / 100 });
      }
      if (rows.length < 100) throw new Error("too few rows: " + rows.length);

      const dir = path.join(__dirname, "..", "assets", "data");
      fs.mkdirSync(dir, { recursive: true });
      const out = {
        ticker: "VOO",
        name: "Vanguard S&P 500 ETF",
        currency: "USD",
        source: "Yahoo Finance chart API (query2.finance.yahoo.com)",
        fetchedAt: new Date().toISOString().slice(0, 10),
        rows: rows
      };
      const file = path.join(dir, "voo-history.json");
      fs.writeFileSync(file, JSON.stringify(out), "utf8");
      console.log(`Wrote ${rows.length} rows to ${file}`);
      console.log(`First: ${rows[0].date} = ${rows[0].close} | Last: ${rows[rows.length - 1].date} = ${rows[rows.length - 1].close}`);
    } catch (e) {
      console.error("Failed:", e.message);
      process.exit(1);
    }
  });
}).on("error", (e) => { console.error("Request error:", e.message); process.exit(1); });