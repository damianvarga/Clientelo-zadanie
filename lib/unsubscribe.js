import crypto from "node:crypto";

function getSecret() {
  return process.env.UNSUBSCRIBE_SECRET || process.env.RESEND_API_KEY || null;
}

function b64url(buf) {
  return Buffer.from(buf, "utf8").toString("base64url");
}

function hmac(data, secret) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

export function signToken(email) {
  const secret = getSecret();
  if (!secret) return null;
  const payload = b64url(String(email).trim().toLowerCase());
  return payload + "." + hmac(payload, secret);
}

export function verifyToken(token) {
  const secret = getSecret();
  if (!secret || typeof token !== "string" || token.length > 512) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = hmac(payload, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const email = Buffer.from(payload, "base64url").toString("utf8");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null;
    return email;
  } catch (e) {
    return null;
  }
}

export async function unsubscribeLead(redis, email) {
  if (!redis || !email) return false;
  const key = "newsletter:lead:" + email;
  try {
    const existed = await redis.exists(key);
    await redis.del(key);
    await redis.srem("newsletter:emails", email);
    return !!existed;
  } catch (err) {
    console.error("[unsubscribe] db_error", String((err && err.message) || err).slice(0, 300));
    throw err;
  }
}
