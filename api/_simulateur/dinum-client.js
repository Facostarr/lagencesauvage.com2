// =============================================================================
// Client HTTP API DINUM — recherche-entreprises.api.gouv.fr
// =============================================================================
// Doc : https://recherche-entreprises.api.gouv.fr/docs/
// Rate-limit upstream : 7 req/s/IP, 30 req/s/ASN
// Notre defense interne (rate-limit.js + cache.js) doit maintenir ce budget.

const DINUM_BASE = 'https://recherche-entreprises.api.gouv.fr';
const USER_AGENT = 'lagencesauvage.com-simulateur-opco/1.0 (contact@lagencesauvage.com)';
const RETRY_DELAYS_MS = [100, 300, 900];
const DEFAULT_TIMEOUT_MS = 4000;

class DinumError extends Error {
  constructor(code, message, { status = null, cause = null } = {}) {
    super(message);
    this.code = code;
    this.status = status;
    this.cause = cause;
  }
}

async function fetchWithTimeout(url, opts, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function dinumFetch(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const opts = { method: 'GET', headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } };
  let lastError = null;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const res = await fetchWithTimeout(url, opts, timeoutMs);
      if (res.ok) {
        return await res.json();
      }
      if (res.status === 404) throw new DinumError('not_found', 'Aucun résultat DINUM.', { status: 404 });
      if (res.status === 400) throw new DinumError('invalid_query', 'Requête DINUM invalide.', { status: 400 });
      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt === RETRY_DELAYS_MS.length) {
        throw new DinumError('upstream_down', `DINUM HTTP ${res.status}.`, { status: res.status });
      }
      lastError = new DinumError('upstream_down', `DINUM HTTP ${res.status}.`, { status: res.status });
    } catch (err) {
      if (err instanceof DinumError && err.code !== 'upstream_down') throw err;
      const retryableNetwork = err.name === 'AbortError'
        || err.code === 'ETIMEDOUT'
        || err.code === 'ECONNRESET'
        || err.code === 'ENOTFOUND'
        || err.code === 'UND_ERR_SOCKET';
      if (!retryableNetwork && !(err instanceof DinumError)) {
        throw new DinumError('upstream_down', `DINUM erreur réseau : ${err.message}.`, { cause: err });
      }
      if (attempt === RETRY_DELAYS_MS.length) {
        throw err instanceof DinumError ? err : new DinumError('upstream_down', err.message, { cause: err });
      }
      lastError = err;
    }
    await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
  }
  throw lastError ?? new DinumError('upstream_down', 'DINUM injoignable.');
}

export async function dinumSearch({ q, codePostal = null, limit = 5 }) {
  const params = new URLSearchParams();
  params.set('q', q);
  if (codePostal) params.set('code_postal', codePostal);
  params.set('per_page', String(limit));
  params.set('page', '1');
  const url = `${DINUM_BASE}/search?${params.toString()}`;
  const json = await dinumFetch(url);
  return Array.isArray(json?.results) ? json.results : [];
}

export async function dinumGetBySiret(siret) {
  const params = new URLSearchParams({ q: siret, per_page: '1', page: '1' });
  const url = `${DINUM_BASE}/search?${params.toString()}`;
  const json = await dinumFetch(url);
  const results = Array.isArray(json?.results) ? json.results : [];
  return results[0] ?? null;
}

export function normalizeDinumResult(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const siege = raw.siege ?? {};
  const complements = raw.complements ?? {};
  const idccFromSiege = Array.isArray(siege.liste_idcc) ? siege.liste_idcc : [];
  const idccFromComplements = Array.isArray(complements.liste_idcc) ? complements.liste_idcc : [];
  const listeIdccRaw = idccFromSiege.length ? idccFromSiege : idccFromComplements;
  const idcc = listeIdccRaw[0] ?? null;
  const tefen = siege.tranche_effectif_salarie
    ?? raw.tranche_effectif_salarie
    ?? 'NN';
  return {
    siren: raw.siren ?? null,
    siret_siege: siege.siret ?? null,
    nom_complet: raw.nom_complet ?? raw.nom_raison_sociale ?? null,
    naf: raw.activite_principale ?? siege.activite_principale ?? null,
    code_postal: siege.code_postal ?? null,
    ville: siege.libelle_commune ?? siege.commune ?? null,
    tranche_effectif_tefen: tefen,
    categorie_entreprise: raw.categorie_entreprise ?? null,
    idcc,
    liste_idcc_raw: listeIdccRaw,
    multi_idcc: listeIdccRaw.length > 1,
  };
}

export { DinumError };
