// =============================================================================
// Validateurs d'inputs pour simulateur OPCO
// =============================================================================
// Premier rempart anti-SSRF : tout input arrivant dans les endpoints
// /api/simulate-opco-* DOIT passer ici avant d'être injecté dans une URL DINUM
// ou siret2idcc.

import { getValidIdccOverrides } from './compute-engine.js';

const Q_ALLOWED = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 .,'&()\-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_ALLOWED = /^[+\d\s().\-]{6,30}$/;
const NAME_ALLOWED = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 .,'’\-]+$/;
const UTM_ALLOWED = /^[A-Za-z0-9_.\-]+$/;
// 4 paliers OPCO légaux exposés au prospect : 1-10 / 11-49 / 50-249 / 250+
// Mappés sur le code TEFEN le plus bas de la tranche correspondante.
export const TEFEN_OVERRIDE_WHITELIST = new Set(['01', '11', '21', '32']);
// Notion renvoie des IDs UUID v4 (32 hex chars avec ou sans dashes)
const NOTION_PAGE_ID_REGEX = /^[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}$/i;

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

export function validateComputeBody(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, code: 'invalid_body', message: 'Corps JSON requis.' };
  }
  const siret = validateSiret(body.siret);
  if (!siret.ok) return siret;

  if (typeof body.email !== 'string' || !EMAIL_REGEX.test(body.email.trim())) {
    return { ok: false, code: 'invalid_body', message: 'Email professionnel valide requis.' };
  }
  if (body.rgpd_consent !== true) {
    return { ok: false, code: 'rgpd_missing', message: 'Consentement RGPD obligatoire.' };
  }

  const out = {
    siret: siret.value,
    email: body.email.trim().toLowerCase(),
    rgpd_consent: true,
    nom_prospect: null,
    telephone: null,
    utm_source: null,
    utm_campaign: null,
    tefen_override: null,
    idcc_override: null,
    notion_lead_id: null,
  };

  if (body.tefen_override !== undefined && body.tefen_override !== null && body.tefen_override !== '') {
    if (typeof body.tefen_override !== 'string' || !TEFEN_OVERRIDE_WHITELIST.has(body.tefen_override)) {
      return { ok: false, code: 'invalid_body', message: 'Tranche d\'effectif invalide.' };
    }
    out.tefen_override = body.tefen_override;
  }

  if (body.idcc_override !== undefined && body.idcc_override !== null && body.idcc_override !== '') {
    const idccNum = Number.parseInt(String(body.idcc_override), 10);
    if (!Number.isFinite(idccNum) || !getValidIdccOverrides().has(idccNum)) {
      return { ok: false, code: 'invalid_body', message: 'Convention collective invalide ou non couverte.' };
    }
    out.idcc_override = idccNum;
  }

  if (body.notion_lead_id !== undefined && body.notion_lead_id !== null && body.notion_lead_id !== '') {
    if (typeof body.notion_lead_id !== 'string' || !NOTION_PAGE_ID_REGEX.test(body.notion_lead_id)) {
      return { ok: false, code: 'invalid_body', message: 'Identifiant de lead invalide.' };
    }
    out.notion_lead_id = body.notion_lead_id;
  }

  if (body.nom_prospect !== undefined && body.nom_prospect !== null && body.nom_prospect !== '') {
    if (typeof body.nom_prospect !== 'string' || body.nom_prospect.length > 100 || !NAME_ALLOWED.test(body.nom_prospect.trim())) {
      return { ok: false, code: 'invalid_body', message: 'Nom du prospect invalide.' };
    }
    out.nom_prospect = body.nom_prospect.trim();
  }

  if (body.telephone !== undefined && body.telephone !== null && body.telephone !== '') {
    if (typeof body.telephone !== 'string' || !PHONE_ALLOWED.test(body.telephone.trim())) {
      return { ok: false, code: 'invalid_body', message: 'Téléphone invalide.' };
    }
    out.telephone = body.telephone.trim();
  }

  for (const key of ['utm_source', 'utm_campaign']) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== '') {
      if (typeof body[key] !== 'string' || body[key].length > 100 || !UTM_ALLOWED.test(body[key])) {
        return { ok: false, code: 'invalid_body', message: `${key} invalide.` };
      }
      out[key] = body[key].trim();
    }
  }

  return { ok: true, value: out };
}
