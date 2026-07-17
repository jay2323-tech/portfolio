type Bucket = { tokens: number; updatedAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_TOKENS = 10;

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "local";
}

/** Returns remaining tokens after consuming one, or null if rate limited. */
export function takeRateLimitToken(ip: string): { ok: true; remaining: number } | { ok: false; remaining: 0 } {
  const now = Date.now();
  let bucket = buckets.get(ip);

  if (!bucket || now - bucket.updatedAt > WINDOW_MS) {
    bucket = { tokens: MAX_TOKENS, updatedAt: now };
  }

  // Refill proportionally
  const elapsed = now - bucket.updatedAt;
  if (elapsed > 0 && bucket.tokens < MAX_TOKENS) {
    const refill = (elapsed / WINDOW_MS) * MAX_TOKENS;
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + refill);
  }
  bucket.updatedAt = now;

  if (bucket.tokens < 1) {
    buckets.set(ip, bucket);
    return { ok: false, remaining: 0 };
  }

  bucket.tokens -= 1;
  buckets.set(ip, bucket);
  return { ok: true, remaining: Math.floor(bucket.tokens) };
}

export const RATE_LIMIT_MAX = MAX_TOKENS;
