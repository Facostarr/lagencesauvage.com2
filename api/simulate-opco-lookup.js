// =============================================================================
// VERCEL SERVERLESS FUNCTION — Simulateur OPCO — Autocomplete
// =============================================================================
// GET /api/simulate-opco-lookup?q=Boulangerie&code_postal=13001&limit=5
//
// Rôle : proxy ultra-rapide vers DINUM pour suggérer des entreprises à
// l'utilisateur quand il tape son nom/SIREN. AUCUN fallback IDCC ici —
// l'objectif est < 200ms. La cascade fallback se déclenche en S3 dans
// /api/simulate-opco-resolve quand l'utilisateur sélectionne une ligne.
// =============================================================================

import { validateAutocompleteQuery, validateCodePostal, validateLimit } from './_simulateur/validators.js';
import { lookupCache } from './_simulateur/cache.js';
import { checkRateLimit, extractClientIp } from './_simulateur/rate-limit.js';
import { dinumSearch, normalizeDinumResult, DinumError } from './_simulateur/dinum-client.js';
import { applyCors, sendError, sendOk, logJson } from './_simulateur/http-utils.js';

export default async function handler(req, res) {
  applyCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return sendError(res, 405, 'method_not_allowed', 'Méthode non autorisée.');

  const ip = extractClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    res.setHeader('Retry-After', Math.ceil((rl.retryAfterMs ?? 1000) / 1000));
    return sendError(res, 429, 'rate_limited', 'Trop de requêtes, réessayez dans quelques instants.');
  }

  const q = validateAutocompleteQuery(req.query?.q);
  if (!q.ok) return sendError(res, 400, q.code, q.message);

  const cp = validateCodePostal(req.query?.code_postal);
  if (!cp.ok) return sendError(res, 400, cp.code, cp.message);

  const limit = validateLimit(req.query?.limit, 5, 10);
  if (!limit.ok) return sendError(res, 400, limit.code, limit.message);

  const cacheKey = `auto::${q.value.toLowerCase()}::${cp.value ?? ''}::${limit.value}`;
  const cached = lookupCache.get(cacheKey);
  if (cached) {
    return sendOk(res, { mode: 'autocomplete', results: cached.results, upstream_ms: cached.upstream_ms }, { cacheHit: true });
  }

  const t0 = Date.now();
  let raw;
  try {
    raw = await dinumSearch({ q: q.value, codePostal: cp.value, limit: limit.value });
  } catch (err) {
    if (err instanceof DinumError) {
      logJson('simulator.lookup.upstream_error', { code: err.code, status: err.status, ip_hash: hashIp(ip) });
      if (err.code === 'not_found') return sendOk(res, { mode: 'autocomplete', results: [], upstream_ms: Date.now() - t0 });
      if (err.code === 'invalid_query') return sendError(res, 400, 'invalid_query', 'Requête DINUM invalide.');
      return sendError(res, 502, 'upstream_down', 'API entreprises momentanément indisponible.');
    }
    logJson('simulator.lookup.internal_error', { message: err?.message, ip_hash: hashIp(ip) });
    return sendError(res, 500, 'internal', 'Erreur interne.');
  }
  const upstreamMs = Date.now() - t0;

  const results = raw.map(normalizeDinumResult).filter(Boolean);
  lookupCache.set(cacheKey, { results, upstream_ms: upstreamMs });

  logJson('simulator.lookup.ok', {
    q_len: q.value.length,
    cp: cp.value,
    results_count: results.length,
    upstream_ms: upstreamMs,
    ip_hash: hashIp(ip),
  });

  return sendOk(res, { mode: 'autocomplete', results, upstream_ms: upstreamMs });
}

function hashIp(ip) {
  let h = 0;
  for (let i = 0; i < ip.length; i += 1) h = (h * 31 + ip.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16);
}
