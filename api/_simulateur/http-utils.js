// =============================================================================
// Helpers HTTP communs aux endpoints simulateur OPCO
// =============================================================================

const ALLOWED_ORIGINS = [
  'https://www.lagencesauvage.com',
  'https://lagencesauvage.com',
  'http://localhost:1313',
  'http://localhost:3000',
];

export function applyCors(req, res) {
  const origin = req.headers.origin;
  if (typeof origin === 'string' && (ALLOWED_ORIGINS.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.lagencesauvage.com');
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '600');
}

export function sendError(res, status, code, message, extra = {}) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json({ ok: false, code, message, ...extra });
}

export function sendOk(res, payload, { cacheHit = false } = {}) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Cache', cacheHit ? 'HIT' : 'MISS');
  res.status(200).json({ ok: true, cache_hit: cacheHit, ...payload });
}

export function logJson(event, payload = {}) {
  console.log(JSON.stringify({ event, ts: new Date().toISOString(), ...payload }));
}
