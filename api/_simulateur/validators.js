// =============================================================================
// Validateurs d'inputs pour simulateur OPCO
// =============================================================================
// Premier rempart anti-SSRF : tout input arrivant dans les endpoints
// /api/simulate-opco-* DOIT passer ici avant d'être injecté dans une URL DINUM
// ou siret2idcc.

const Q_ALLOWED = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 .,'&()\-]+$/;

export function sanitizeSirenSiret(raw) {
  if (typeof raw !== 'string') return null;
  return raw.replace(/\s+/g, '').replace(/[^0-9]/g, '');
}

export function validateSiret(raw) {
  const cleaned = sanitizeSirenSiret(raw);
  if (!cleaned || !/^\d{14}$/.test(cleaned)) {
    return { ok: false, code: 'invalid_query', message: 'SIRET invalide (14 chiffres attendus).' };
  }
  return { ok: true, value: cleaned };
}

export function validateSiren(raw) {
  const cleaned = sanitizeSirenSiret(raw);
  if (!cleaned || !/^\d{9}$/.test(cleaned)) {
    return { ok: false, code: 'invalid_query', message: 'SIREN invalide (9 chiffres attendus).' };
  }
  return { ok: true, value: cleaned };
}

export function validateAutocompleteQuery(raw) {
  if (typeof raw !== 'string') {
    return { ok: false, code: 'invalid_query', message: 'Paramètre q manquant.' };
  }
  const trimmed = raw.trim();
  if (trimmed.length < 2) {
    return { ok: false, code: 'invalid_query', message: 'Saisissez au moins 2 caractères.' };
  }
  if (trimmed.length > 100) {
    return { ok: false, code: 'invalid_query', message: 'Requête trop longue (100 caractères max).' };
  }
  if (!Q_ALLOWED.test(trimmed)) {
    return { ok: false, code: 'invalid_query', message: 'Caractères non autorisés dans la requête.' };
  }
  return { ok: true, value: trimmed };
}

export function validateCodePostal(raw) {
  if (raw === undefined || raw === null || raw === '') return { ok: true, value: null };
  if (typeof raw !== 'string') return { ok: false, code: 'invalid_query', message: 'code_postal invalide.' };
  const trimmed = raw.trim();
  if (!/^\d{5}$/.test(trimmed)) {
    return { ok: false, code: 'invalid_query', message: 'code_postal invalide (5 chiffres).' };
  }
  return { ok: true, value: trimmed };
}

export function validateLimit(raw, fallback = 5, max = 10) {
  if (raw === undefined || raw === null || raw === '') return { ok: true, value: fallback };
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1 || n > max) {
    return { ok: false, code: 'invalid_query', message: `limit doit être entre 1 et ${max}.` };
  }
  return { ok: true, value: n };
}
