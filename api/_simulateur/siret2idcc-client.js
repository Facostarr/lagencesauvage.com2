// =============================================================================
// Client fallback siret2idcc — fabrique.social.gouv.fr
// =============================================================================
// Doc : https://github.com/SocialGouv/siret2idcc
// Utilisé uniquement quand DINUM ne retourne pas d'IDCC sur un SIRET donné.
// Source : DSN (même que DINUM) mais index différent, parfois plus exhaustif
// pour les entreprises récentes ou multi-établissements.

const SIRET2IDCC_BASE = 'https://siret2idcc.fabrique.social.gouv.fr/api/v2';
const USER_AGENT = 'lagencesauvage.com-simulateur-opco/1.0 (contact@lagencesauvage.com)';
const TIMEOUT_MS = 3000;

class Siret2IdccError extends Error {
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

export async function siret2idccLookup(siret) {
  const url = `${SIRET2IDCC_BASE}/${encodeURIComponent(siret)}`;
  const opts = { method: 'GET', headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } };
  let res;
  try {
    res = await fetchWithTimeout(url, opts, TIMEOUT_MS);
  } catch (err) {
    throw new Siret2IdccError('upstream_down', `siret2idcc réseau : ${err.message}.`, { cause: err });
  }
  if (res.status === 404) return { idcc: null, listeIdcc: [], multi_idcc: false };
  if (!res.ok) {
    throw new Siret2IdccError('upstream_down', `siret2idcc HTTP ${res.status}.`, { status: res.status });
  }
  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new Siret2IdccError('upstream_down', 'siret2idcc payload invalide.', { cause: err });
  }
  const payload = Array.isArray(json) ? json[0] : json;
  if (!payload) return { idcc: null, listeIdcc: [], multi_idcc: false };
  const conventions = Array.isArray(payload.conventions) ? payload.conventions : [];
  const liste = conventions
    .map((c) => (typeof c?.idcc === 'string' ? c.idcc : c?.idcc ? String(c.idcc) : null))
    .filter(Boolean);
  return {
    idcc: liste[0] ?? null,
    listeIdcc: liste,
    multi_idcc: liste.length > 1,
  };
}

export { Siret2IdccError };
