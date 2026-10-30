import test from "node:test";
import assert from "node:assert/strict";
import { signToken, verifyToken, unsubscribeLead } from "../lib/unsubscribe.js";
import unsubHandler from "../api/unsubscribe.js";
import { _setRedisForTests } from "../lib/store.js";

function makeFakeRedis() {
  const store = new Map();
  const sets = new Map();
  return {
    store,
    sets,
    async set(key, value) { store.set(key, value); return "OK"; },
    async get(key) { return store.has(key) ? store.get(key) : null; },
    async exists(key) { return store.has(key) ? 1 : 0; },
    async del(key) { return store.delete(key) ? 1 : 0; },
    async sadd(key, member) {
      if (!sets.has(key)) sets.set(key, new Set());
      sets.get(key).add(member);
      return 1;
    },
    async srem(key, member) {
      if (!sets.has(key)) return 0;
      return sets.get(key).delete(member) ? 1 : 0;
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

async function call(method, { token, body } = {}) {
  const req = {
    method: method,
    query: token ? { token: token } : {},
    body: body,
    headers: {}
  };
  const res = mockRes();
  await unsubHandler(req, res);
  return res;
}

test.beforeEach(() => {
  process.env.UNSUBSCRIBE_SECRET = "test-secret";
});

test.afterEach(() => {
  delete process.env.UNSUBSCRIBE_SECRET;
  delete process.env.RESEND_API_KEY;
});

test("signToken/verifyToken: roundtrip vráti normalizovaný e-mail", () => {
  const token = signToken("Test@Example.COM");
  assert.ok(token && token.includes("."));
  assert.equal(verifyToken(token), "test@example.com");
});

test("verifyToken: zlý podpis alebo formát → null", () => {
  assert.equal(verifyToken(""), null);
  assert.equal(verifyToken("abc"), null);
  assert.equal(verifyToken(".."), null);
  const token = signToken("a@b.cz");
  assert.equal(verifyToken(token + "x"), null);
  assert.equal(verifyToken("bm90LWEtZW1haWw.@sig"), null);
});

test("signToken: bez žiadneho secretu → null", () => {
  delete process.env.UNSUBSCRIBE_SECRET;
  delete process.env.RESEND_API_KEY;
  assert.equal(signToken("a@b.cz"), null);
});

test("unsubscribe endpoint: GET s platným tokenom → 200 HTML a lead zmazaný", async () => {
  const redis = makeFakeRedis();
  redis.store.set("newsletter:lead:user@example.com", { email: "user@example.com" });
  redis.sets.set("newsletter:emails", new Set(["user@example.com", "other@example.com"]));
  _setRedisForTests(redis);

  const res = await call("GET", { token: signToken("user@example.com") });
  assert.equal(res.statusCode, 200);
  assert.match(String(res.headers["Content-Type"]), /text\/html/);
  assert.match(String(res.body), /Byli jste odhlášeni/);
  assert.equal(redis.store.has("newsletter:lead:user@example.com"), false);
  assert.equal(redis.sets.get("newsletter:emails").has("user@example.com"), false);
  assert.equal(redis.sets.get("newsletter:emails").has("other@example.com"), true);
  _setRedisForTests(undefined);
});

test("unsubscribe endpoint: POST one-click → 200 JSON a lead zmazaný", async () => {
  const redis = makeFakeRedis();
  redis.store.set("newsletter:lead:a@b.cz", { email: "a@b.cz" });
  redis.sets.set("newsletter:emails", new Set(["a@b.cz"]));
  _setRedisForTests(redis);

  const res = await call("POST", {
    token: signToken("a@b.cz"),
    body: { token: signToken("a@b.cz") }
  });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true, removed: true });
  assert.equal(redis.store.has("newsletter:lead:a@b.cz"), false);
  _setRedisForTests(undefined);
});

test("unsubscribe endpoint: idempotent – neexistujúci lead → 200 removed:false", async () => {
  const redis = makeFakeRedis();
  _setRedisForTests(redis);
  const res = await call("GET", { token: signToken("ghost@example.com") });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, undefined); // GET vracia HTML
  _setRedisForTests(undefined);
});

test("unsubscribe endpoint: chýbajúci token → 400, neplatný → 401", async () => {
  const redis = makeFakeRedis();
  _setRedisForTests(redis);
  assert.equal((await call("GET")).statusCode, 400);
  assert.equal((await call("GET", { token: "bad.token" })).statusCode, 401);
  _setRedisForTests(undefined);
});

test("unsubscribe endpoint: bez Redis → 503", async () => {
  _setRedisForTests(undefined);
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  const res = await call("GET", { token: signToken("a@b.cz") });
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.error, "db_not_configured");
});

test("unsubscribe endpoint: nepovolená metóda → 405", async () => {
  const res = await call("DELETE", { token: signToken("a@b.cz") });
  assert.equal(res.statusCode, 405);
});

test("unsubscribeLead: bez redis → false", async () => {
  assert.equal(await unsubscribeLead(null, "a@b.cz"), false);
});
