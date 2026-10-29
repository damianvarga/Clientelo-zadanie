import { Redis } from "@upstash/redis";

const REPORT_TTL_SECONDS = 60 * 60 * 24 * 30;
const REPORT_ID_RE = /^[a-f0-9]{32}$/;

let redisOverride;

export function _setRedisForTests(client) {
  redisOverride = client || undefined;
}

export function getRedis() {
  if (redisOverride) return redisOverride;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function isValidReportId(id) {
  return typeof id === "string" && REPORT_ID_RE.test(id);
}

export function reportKey(id) {
  return "report:" + id;
}

export async function saveReport(redis, id, entry) {
  await redis.set(reportKey(id), JSON.stringify(entry), { ex: REPORT_TTL_SECONDS });
}

export async function loadReport(redis, id) {
  const raw = await redis.get(reportKey(id));
  if (!raw) return null;
  let entry = raw;
  if (typeof raw === "string") {
    try {
      entry = JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }
  if (!entry || typeof entry !== "object") return null;
  return entry;
}
