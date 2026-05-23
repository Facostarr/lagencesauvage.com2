// =============================================================================
// Service de résolution SIRET → fiche entreprise + IDCC (cascade)
// =============================================================================
// Factorisé pour être réutilisé par :
//   - api/simulate-opco-resolve.js (S3, exposition front)
//   - api/simulate-opco-compute.js (S4, re-vérification serveur anti-tampering)
//
// Cascade :
//   1. DINUM (source primaire — IDCC parfois absent)
//   2. siret2idcc (fallback fabrique sociale)
//   3. (S4+, reporté) heuristique NAF→IDCC

import { resolveCache } from './cache.js';
import { dinumGetBySiret, normalizeDinumResult, DinumError } from './dinum-client.js';
import { siret2idccLookup, Siret2IdccError } from './siret2idcc-client.js';

export class ResolveError extends Error {
  constructor(code, message, { status = 502, cause = null } = {}) {
    super(message);
    this.code = code;
    this.status = status;
    this.cause = cause;
  }
}

export async function resolveSiretWithCascade(siret, { logger = () => {} } = {}) {
  const cacheKey = `siret::${siret}`;
  const cached = resolveCache.get(cacheKey);
  if (cached) return { payload: cached, cacheHit: true };

  const t0 = Date.now();
  let dinumRaw;
  try {
    dinumRaw = await dinumGetBySiret(siret);
  } catch (err) {
    if (err instanceof DinumError) {
      logger('resolve.dinum_error', { code: err.code, status: err.status, siret });
      if (err.code === 'not_found') {
        throw new ResolveError('not_found', 'SIRET introuvable dans la base entreprises.', { status: 404, cause: err });
      }
      throw new ResolveError('upstream_down', 'API entreprises momentanément indisponible.', { status: 502, cause: err });
    }
    logger('resolve.internal_error', { message: err?.message, siret });
    throw new ResolveError('internal', 'Erreur interne lors de la résolution SIRET.', { status: 500, cause: err });
  }

  if (!dinumRaw) {
    throw new ResolveError('not_found', 'SIRET introuvable dans la base entreprises.', { status: 404 });
  }
  const normalized = normalizeDinumResult(dinumRaw);
  if (!normalized) {
    throw new ResolveError('upstream_down', 'Payload DINUM invalide.', { status: 502 });
  }

  let fallbackUsed = null;
  let sourceIdcc = 'dinum';
  let sourceConfiance = 'auto-dinum';
  let idcc = normalized.idcc;
  let listeIdccRaw = normalized.liste_idcc_raw;
  let multiIdcc = normalized.multi_idcc;

  if (!idcc) {
    try {
      const fb = await siret2idccLookup(siret);
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
        logger('resolve.siret2idcc_error', { code: err.code, status: err.status, siret });
      } else {
        logger('resolve.siret2idcc_internal', { message: err?.message, siret });
      }
      fallbackUsed = 'siret2idcc-error';
    }
  }

  if (!idcc) {
    sourceIdcc = null;
    sourceConfiance = 'manuel';
  }

  const upstreamMs = Date.now() - t0;
  const payload = {
    mode: 'resolve',
    entreprise: {
      siren: normalized.siren,
      siret,
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
  return { payload, cacheHit: false };
}
