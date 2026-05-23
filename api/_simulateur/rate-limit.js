// =============================================================================
// Rate-limit in-memory IP-based
// =============================================================================
// Protection facture Vercel : un bot ne doit pas pouvoir exploser le quota
// de fonctions serverless. Per-instance, donc imparfait en cas de scale
// horizontal, mais suffisant pour MVP (450 visiteurs/trimestre cible).

const WINDOW_MS = 1000;
const MAX_REQ_PER_WINDOW = 10;
const MAX_TRACKED_IPS = 5000;

const POST_WINDOW_MS = 60_000;
const POST_MAX_REQ_PER_WINDOW = 5;

const buckets = new Map();
const postBuckets = new Map();

export function extractClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    const first = fwd.split(',')[0]?.trim();
    if (first) return first;
  }
  if (typeof req.headers['x-real-ip'] === 'string') return req.headers['x-real-ip'];
  return req.socket?.remoteAddress || '0.0.0.0';
}

export function checkPostRateLimit(ip) {
  const now = Date.now();
  const bucket = postBuckets.get(ip);
  if (!bucket) {
    if (postBuckets.size >= MAX_TRACKED_IPS) {
      const firstKey = postBuckets.keys().next().value;
      if (firstKey !== undefined) postBuckets.delete(firstKey);
    }
    postBuckets.set(ip, [now]);
    return { allowed: true, remaining: POST_MAX_REQ_PER_WINDOW - 1 };
  }
  const filtered = bucket.filter((t) => now - t < POST_WINDOW_MS);
  if (filtered.length >= POST_MAX_REQ_PER_WINDOW) {
    postBuckets.set(ip, filtered);
    return { allowed: false, remaining: 0, retryAfterMs: POST_WINDOW_MS - (now - filtered[0]) };
  }
  filtered.push(now);
  postBuckets.set(ip, filtered);
  return { allowed: true, remaining: POST_MAX_REQ_PER_WINDOW - filtered.length };
}

export function checkRateLimit(ip) {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket) {
    if (buckets.size >= MAX_TRACKED_IPS) {
      const firstKey = buckets.keys().next().value;
      if (firstKey !== undefined) buckets.delete(firstKey);
    }
    buckets.set(ip, [now]);
    return { allowed: true, remaining: MAX_REQ_PER_WINDOW - 1 };
  }
  const filtered = bucket.filter((t) => now - t < WINDOW_MS);
  if (filtered.length >= MAX_REQ_PER_WINDOW) {
    buckets.set(ip, filtered);
    return { allowed: false, remaining: 0, retryAfterMs: WINDOW_MS - (now - filtered[0]) };
  }
  filtered.push(now);
  buckets.set(ip, filtered);
  return { allowed: true, remaining: MAX_REQ_PER_WINDOW - filtered.length };
}
