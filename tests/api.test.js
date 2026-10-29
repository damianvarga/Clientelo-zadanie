import test from "node:test";
import assert from "node:assert/strict";
import leadHandler from "../api/lead.js";
import reportHandler from "../api/report.js";
import { _setRedisForTests, loadReport } from "../lib/store.js";
import { buildReportContent } from "../lib/report.js";

function makeFakeRedis() {
  const store = new Map();
  return {
    store,
    async set(key, value) { store.set(key, value); return "OK"; },
    async get(key) { return store.has(key) ? store.get(key) : null; },
    multi() {
      const ops = [];
      const api = {
        hset(key, value) { ops.push(["hset", key, value]); return api; },
        sadd(key, value) { ops.push(["sadd", key, value]); return api; },
        async exec() { return ops.map(() => "OK"); }
      };
      return api;
    }
  };
}

function mockRes() {
  return {
    statusCode: 0,
    headers: {},
    body: undefined,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    send(payload) { this.body = payload; return this; },
    end() { return this; }
  };
}

let ipCounter = 0;
function postLead(body) {
  ipCounter += 1;
  const req = {
    method: "POST",
    body: body,
    headers: { "x-forwarded-for": "10.0." + Math.floor(ipCounter / 250) + "." + (ipCounter % 250) },
    connection: {}
  };
  const res = mockRes();
  return leadHandler(req, res).then(() => res);
}

function getReport(id) {
  const req = { method: "GET", query: { id: id }, headers: {} };
  const res = mockRes();
  return reportHandler(req, res).then(() => res);
}

test("lead endpoint: prijme calc+portfolio+tax, uloží 1 PDF a vráti reportId", async () => {
  delete process.env.RESEND_API_KEY;
  const redis = makeFakeRedis();
  _setRedisForTests(redis);

  const res = await postLead({
    email: "Test@Example.COM",
    consent: true,
    calc: {
      initial: 100000, monthly: 3000, years: 25, ter: 0.0945, fund: "SPY",
      finalValue: 5541000, feesPaid: 420000, gapVsCheapest: 234728
    },
    portfolio: {
      allocations: { VOO: 60, IVV: 40 },
      weightedTer: 0.03,
      yourFinalValue: 5775728,
      cheapFinalValue: 5775728,
      avgFinalValue: 5000000,
      gapVsCheapest: 0,
      gapVsAverage: 775728,
      years: 25, initial: 100000, monthly: 3000
    },
    tax: {
      annualDividend: 24000, hasW8ben: true, taxRate: 0.15,
      taxWithheld: 3600, netAmount: 20400,
      annualSavings: 3600, savings10yr: 36000, savings20yr: 72000
    }
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.match(res.body.reportId, /^[a-f0-9]{32}$/);

  const entry = await loadReport(redis, res.body.reportId);
  assert.ok(entry, "report musí byť uložený v Redis");
  assert.ok(entry.pdfBase64 && entry.pdfBase64.length > 5000, "uložený PDF musí byť ne prázdny");
  assert.equal(entry.model.calc.finalValue, 5541000);
  assert.equal(entry.model.portfolio.weightedTer, 0.03);
  assert.equal(entry.model.tax.annualDividend, 24000);

  const ids = buildReportContent(entry.model).sections.map((s) => s.id);
  assert.deepEqual(ids, ["calc", "portfolio", "tax", "etf-comparison", "checklist", "risk-warning"]);
});

test("lead endpoint: prázdne kalkulačky → PDF bez personalizovaných sekcií, s povinnými sekciami", async () => {
  delete process.env.RESEND_API_KEY;
  const redis = makeFakeRedis();
  _setRedisForTests(redis);

  const res = await postLead({ email: "empty@example.com", consent: true });
  assert.equal(res.statusCode, 200);
  assert.match(res.body.reportId, /^[a-f0-9]{32}$/);

  const entry = await loadReport(redis, res.body.reportId);
  const ids = buildReportContent(entry.model).sections.map((s) => s.id);
  assert.deepEqual(ids, ["etf-comparison", "checklist", "risk-warning"]);
  assert.equal(entry.model.calc, null);
  assert.equal(entry.model.portfolio, null);
  assert.equal(entry.model.tax, null);
});

test("report endpoint: web aj e-mail používajú identický uložený PDF súbor", async () => {
  delete process.env.RESEND_API_KEY;
  const redis = makeFakeRedis();
  _setRedisForTests(redis);

  const leadRes = await postLead({
    email: "identical@example.com",
    consent: true,
    calc: {
      initial: 50000, monthly: 1000, years: 15, ter: 0.18, fund: "QQQ",
      finalValue: 1234567, feesPaid: 89000, gapVsCheapest: 45000
    }
  });
  assert.equal(leadRes.statusCode, 200);

  const entry = await loadReport(redis, leadRes.body.reportId);
  const emailAttachment = Buffer.from(entry.pdfBase64, "base64");

  const res = await getReport(leadRes.body.reportId);
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers["Content-Type"], "application/pdf");
  assert.ok(Buffer.isBuffer(res.body), "endpoint musí servírovať binárny PDF buffer");
  assert.ok(Buffer.compare(res.body, emailAttachment) === 0, "PDF z /api/report musí byť identické s e-mailovou prílohou");
  assert.equal(res.headers["Cache-Control"], "private, no-store");
});

test("report endpoint: fallback regenerácia z uloženého modelu dáva ten istý obsah", async () => {
  delete process.env.RESEND_API_KEY;
  const redis = makeFakeRedis();
  _setRedisForTests(redis);

  const leadRes = await postLead({
    email: "fallback@example.com",
    consent: true,
    calc: {
      initial: 100000, monthly: 3000, years: 25, ter: 0.0945, fund: "SPY",
      finalValue: 5541000, feesPaid: 420000, gapVsCheapest: 234728
    }
  });

  const key = "report:" + leadRes.body.reportId;
  const entry = JSON.parse(redis.store.get(key));
  delete entry.pdfBase64;
  redis.store.set(key, JSON.stringify(entry));

  const res = await getReport(leadRes.body.reportId);
  assert.equal(res.statusCode, 200);
  assert.ok(res.body.subarray(0, 5).toString() === "%PDF-");
  assert.ok(res.body.length > 5000);

  const withPdf = await getReport(leadRes.body.reportId);
  assert.ok(Buffer.compare(res.body, withPdf.body) === 0, "regenerácia z modelu musí dať bitovo identický PDF");
});

test("report endpoint: neplatné ID → 400, neznáme ID → 404", async () => {
  const redis = makeFakeRedis();
  _setRedisForTests(redis);

  const bad = await getReport("../../etc/passwd");
  assert.equal(bad.statusCode, 400);

  const missing = await getReport("a".repeat(32));
  assert.equal(missing.statusCode, 404);
});

test("lead endpoint: odmietne nevalidný e-mail a chýbajúci súhlas", async () => {
  const redis = makeFakeRedis();
  _setRedisForTests(redis);

  const noEmail = await postLead({ consent: true });
  assert.equal(noEmail.statusCode, 422);
  assert.equal(noEmail.body.error, "invalid_email");

  const noConsent = await postLead({ email: "a@b.cz", consent: false });
  assert.equal(noConsent.statusCode, 422);
  assert.equal(noConsent.body.error, "consent_required");
});
