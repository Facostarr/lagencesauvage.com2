// =============================================================================
// VERCEL SERVERLESS FUNCTION — Simulateur OPCO — Resolve SIRET + cascade IDCC
// =============================================================================
// GET /api/simulate-opco-resolve?siret=49982392000016
//
// Rôle : résoudre un SIRET sélectionné par l'utilisateur en une fiche
// d'entreprise enrichie d'un IDCC fiable. Cascade :
//   1. DINUM (source primaire, déjà retournée à l'autocomplete)
//   2. siret2idcc (fabrique sociale, fallback DSN différent)
//   3. (en S4) heuristique NAF→IDCC
// Si après les 2 sources le SIRET n'a toujours pas d'IDCC, la réponse
// reste 200 OK avec source_confiance="manuel" — l'UX S5 gérera le
// message "convention non identifiable, contactez-nous".
// =============================================================================

import { validateSiret } from './_simulateur/validators.js';
import { checkRateLimit, extractClientIp } from './_simulateur/rate-limit.js';
import { resolveSiretWithCascade, ResolveError } from './_simulateur/resolve-service.js';
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

  const siret = validateSiret(req.query?.siret);
  if (!siret.ok) return sendError(res, 400, siret.code, siret.message);

  let cacheHit = false;
  let payload;
  try {
    const out = await resolveSiretWithCascade(siret.value, { logger: (event, props) => logJson(`simulator.${event}`, props) });
    payload = out.payload;
    cacheHit = out.cacheHit;
  } catch (err) {
    if (err instanceof ResolveError) {
      return sendError(res, err.status, err.code, err.message);
    }
    logJson('simulator.resolve.internal_error', { message: err?.message, siret: siret.value });
    return sendError(res, 500, 'internal', 'Erreur interne.');
  }

  logJson('simulator.resolve.ok', {
    siret: siret.value,
    cache_hit: cacheHit,
    has_idcc: Boolean(payload.entreprise?.idcc),
    source_idcc: payload.entreprise?.source_idcc,
    source_confiance: payload.entreprise?.source_confiance,
    multi_idcc: payload.entreprise?.multi_idcc,
    upstream_ms: payload.upstream_ms,
  });

  return sendOk(res, payload, { cacheHit });
}
