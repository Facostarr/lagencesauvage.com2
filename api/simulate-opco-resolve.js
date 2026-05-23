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
import { resolveCache } from './_simulateur/cache.js';
import { checkRateLimit, extractClientIp } from './_simulateur/rate-limit.js';
import { dinumGetBySiret, normalizeDinumResult, DinumError } from './_simulateur/dinum-client.js';
import { siret2idccLookup, Siret2IdccError } from './_simulateur/siret2idcc-client.js';
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

  const cacheKey = `siret::${siret.value}`;
  const cached = resolveCache.get(cacheKey);
  if (cached) {
    return sendOk(res, cached, { cacheHit: true });
  }

  // ÉTAPE 1 — DINUM
  const t0 = Date.now();
  let dinumRaw;
  try {
    dinumRaw = await dinumGetBySiret(siret.value);
  } catch (err) {
    if (err instanceof DinumError) {
      logJson('simulator.resolve.dinum_error', { code: err.code, status: err.status, siret: siret.value });
      if (err.code === 'not_found') return sendError(res, 404, 'not_found', 'SIRET introuvable dans la base entreprises.');
      return sendError(res, 502, 'upstream_down', 'API entreprises momentanément indisponible.');
    }
    logJson('simulator.resolve.internal_error', { message: err?.message, siret: siret.value });
    return sendError(res, 500, 'internal', 'Erreur interne.');
  }

  if (!dinumRaw) {
    return sendError(res, 404, 'not_found', 'SIRET introuvable dans la base entreprises.');
  }
  const normalized = normalizeDinumResult(dinumRaw);
  if (!normalized) {
    return sendError(res, 502, 'upstream_down', 'Payload DINUM invalide.');
  }

  let fallbackUsed = null;
  let sourceIdcc = 'dinum';
  let sourceConfiance = 'auto-dinum';
  let idcc = normalized.idcc;
  let listeIdccRaw = normalized.liste_idcc_raw;
  let multiIdcc = normalized.multi_idcc;

  // ÉTAPE 2 — fallback siret2idcc si DINUM n'a pas retourné d'IDCC
  if (!idcc) {
    try {
      const fb = await siret2idccLookup(siret.value);
      if (fb.idcc) {
        idcc = fb.idcc;
        listeIdccRaw = fb.listeIdcc;
        multiIdcc = fb.multi_idcc;
        sourceIdcc = 'siret2idcc';
        sourceConfiance = 'auto-fallback';
        fallbackUsed = 'siret2idcc';
      } else {
        fallbackUsed = 'siret2idcc-empty';
      }
    } catch (err) {
      if (err instanceof Siret2IdccError) {
        logJson('simulator.resolve.siret2idcc_error', { code: err.code, status: err.status, siret: siret.value });
        fallbackUsed = 'siret2idcc-error';
      } else {
        logJson('simulator.resolve.siret2idcc_internal', { message: err?.message, siret: siret.value });
        fallbackUsed = 'siret2idcc-error';
      }
    }
  }

  // ÉTAPE 3 — heuristique NAF reportée à S4 (compute_budget.js l'utilisera via naf_fallback_index)
  if (!idcc) {
    sourceIdcc = null;
    sourceConfiance = 'manuel';
  }

  const upstreamMs = Date.now() - t0;

  const payload = {
    mode: 'resolve',
    entreprise: {
      siren: normalized.siren,
      siret: siret.value,
      nom_complet: normalized.nom_complet,
      naf: normalized.naf,
      code_postal: normalized.code_postal,
      ville: normalized.ville,
      tranche_effectif_tefen: normalized.tranche_effectif_tefen,
      categorie_entreprise: normalized.categorie_entreprise,
      idcc,
      source_idcc: sourceIdcc,
      source_confiance: sourceConfiance,
      multi_idcc: multiIdcc,
      liste_idcc_raw: listeIdccRaw,
    },
    fallback_used: fallbackUsed,
    upstream_ms: upstreamMs,
  };

  resolveCache.set(cacheKey, payload);

  logJson('simulator.resolve.ok', {
    siret: siret.value,
    has_idcc: Boolean(idcc),
    source_idcc: sourceIdcc,
    source_confiance: sourceConfiance,
    multi_idcc: multiIdcc,
    upstream_ms: upstreamMs,
  });

  return sendOk(res, payload);
}
