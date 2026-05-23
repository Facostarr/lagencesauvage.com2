// =============================================================================
// VERCEL SERVERLESS FUNCTION — Simulateur OPCO — Compute budget + Lead capture
// =============================================================================
// POST /api/simulate-opco-compute
// Body : { siret, email, rgpd_consent, nom_prospect?, telephone?, utm_source?, utm_campaign? }
//
// Flow (Trust-but-verify validé par Gemini Pro 9.5/10) :
//   1. Validation body (siret, email, RGPD obligatoire)
//   2. Rate-limit IP — 5 req/min (POST plus sensible que GET)
//   3. RE-RÉSOLUTION SIRET côté serveur (anti-tampering — on ne fait pas
//      confiance au front pour l'IDCC/TEFEN/NAF). Hit cache resolveCache
//      normalement, le front vient d'appeler /simulate-opco-resolve.
//   4. Compute budget via lib/simulateur-opco/compute_budget.js
//      (simulator-ready.json importé en ESM, cold-start friendly)
//   5. Création lead Notion (bloquant) — base "Leads Simulateur OPCO"
//      avec snapshot JSON dans le body de la page (block code)
//   6. await Promise.allSettled : Resend récap prospect + notifyFounder
//      + Plausible event. Awaité avant la réponse pour ne pas geler la
//      lambda Vercel après res.json().
//   7. Réponse 200 : { ok, simulation, entreprise, notion_page_id }
// =============================================================================

import { createHash } from 'node:crypto';

import { validateComputeBody } from './_simulateur/validators.js';
import { checkPostRateLimit, extractClientIp } from './_simulateur/rate-limit.js';
import { resolveSiretWithCascade, ResolveError } from './_simulateur/resolve-service.js';
import { runCompute, classifyBudget, getSchemaVersion, confianceNotionLabel } from './_simulateur/compute-engine.js';
import { createSimulatorLead } from './_simulateur/notion-client.js';
import { sendRecapToProspect } from './_simulateur/recap-email.js';
import { trackPlausibleEvent } from './_simulateur/plausible.js';
import { notifyFounder } from './_notify.js';
import { applyCors, sendError, sendOk, logJson } from './_simulateur/http-utils.js';

const QUALIFICATION_LABELS = {
  hot: 'Hot',
  warm: 'Warm',
  cold: 'Cold',
  manual: 'À qualifier',
};

function hashEmail(email) {
  return createHash('sha256').update(email).digest('hex').slice(0, 12);
}

function buildExtra({ entreprise, result, qualification, niveauConfiance }) {
  const lines = [];
  const labelQuali = QUALIFICATION_LABELS[qualification] ?? qualification;
  const emoji = qualification === 'hot' ? '🔥' : qualification === 'warm' ? '🌤️' : qualification === 'cold' ? '❄️' : '📋';
  lines.push(`${emoji} ${labelQuali}`);
  if (entreprise?.nom_complet) lines.push(`🏢 ${entreprise.nom_complet}`);
  if (result?.opco_nom) lines.push(`💼 OPCO ${result.opco_nom} · IDCC ${result?.inputs_snapshot?.idcc ?? '—'} (${confianceNotionLabel(niveauConfiance)})`);
  if (result?.budget_chiffrable) {
    const min = result.budget_min_eur != null ? `${result.budget_min_eur}€` : '—';
    const max = result.budget_max_eur != null ? `${result.budget_max_eur}€` : '—';
    lines.push(`💰 Budget : ${min} → ${max}`);
  } else if (result?.cas_particulier) {
    lines.push(`⚠️ Cas particulier : ${result.cas_particulier}`);
  }
  return lines.join('\n');
}

export default async function handler(req, res) {
  applyCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return sendError(res, 405, 'method_not_allowed', 'Méthode non autorisée.');

  const ip = extractClientIp(req);
  const rl = checkPostRateLimit(ip);
  if (!rl.allowed) {
    res.setHeader('Retry-After', Math.ceil((rl.retryAfterMs ?? 60_000) / 1000));
    return sendError(res, 429, 'rate_limited', 'Trop de requêtes, réessayez dans une minute.');
  }

  // ---- 1. Parse + validate body
  let rawBody = req.body;
  if (typeof rawBody === 'string') {
    try { rawBody = JSON.parse(rawBody); } catch { return sendError(res, 400, 'invalid_body', 'JSON invalide.'); }
  }
  const v = validateComputeBody(rawBody);
  if (!v.ok) return sendError(res, 400, v.code, v.message);
  const body = v.value;

  const emailHash = hashEmail(body.email);

  // ---- 2. Re-résolution SIRET (anti-tampering, hit cache normalement)
  let resolved;
  try {
    const out = await resolveSiretWithCascade(body.siret, { logger: (event, props) => logJson(`simulator.${event}`, props) });
    resolved = out.payload;
  } catch (err) {
    if (err instanceof ResolveError) {
      logJson('simulator.compute.resolve_error', { code: err.code, siret: body.siret, email_hash: emailHash });
      return sendError(res, err.status, err.code, err.message);
    }
    logJson('simulator.compute.internal_error', { stage: 'resolve', message: err?.message, siret: body.siret });
    return sendError(res, 500, 'internal', 'Erreur interne.');
  }
  const entreprise = resolved.entreprise;
  const niveauConfiance = entreprise.source_confiance ?? 'manuel';

  // ---- 3. Compute budget
  let simulation;
  try {
    simulation = runCompute({
      idcc: entreprise.idcc,
      tefenCode: entreprise.tranche_effectif_tefen,
      sourceIdcc: entreprise.source_idcc ?? 'manuel',
    });
  } catch (err) {
    logJson('simulator.compute.engine_error', { message: err?.message, siret: body.siret, idcc: entreprise.idcc });
    return sendError(res, 500, 'internal', 'Erreur de calcul du budget.');
  }

  const qualification = classifyBudget(simulation.budget_max_eur, simulation.cas_particulier);

  // ---- 4. Snapshot immuable (preuve audit)
  const snapshot = {
    schema_version: getSchemaVersion(),
    submitted_at: new Date().toISOString(),
    request: {
      siret: body.siret,
      email_hash: emailHash,
      has_telephone: Boolean(body.telephone),
      nom_prospect: body.nom_prospect,
      utm_source: body.utm_source,
      utm_campaign: body.utm_campaign,
    },
    entreprise,
    simulation,
  };

  // ---- 5. Notion bloquant
  const databaseId = process.env.NOTION_DATABASE_SIMULATEUR_OPCO;
  if (!databaseId) {
    logJson('simulator.compute.config_error', { reason: 'NOTION_DATABASE_SIMULATEUR_OPCO manquante' });
    return sendError(res, 500, 'config_missing', 'Configuration serveur incomplète. Contactez le support.');
  }
  let notionPage;
  try {
    notionPage = await createSimulatorLead({
      databaseId,
      body,
      entreprise,
      result: simulation,
      snapshot,
      niveauConfiance,
      qualification: QUALIFICATION_LABELS[qualification],
    });
  } catch (err) {
    logJson('simulator.compute.notion_error', { message: err?.message, code: err?.code, email_hash: emailHash, siret: body.siret });
    return sendError(res, 500, 'notion_failed', 'Impossible d\'enregistrer la simulation. Réessayez ou contactez-nous.');
  }

  // ---- 6. Promise.allSettled — awaité avant res.json() pour ne pas geler la lambda
  const prenom = body.nom_prospect?.split(' ')?.[0] ?? null;
  const settled = await Promise.allSettled([
    sendRecapToProspect({ email: body.email, prenom, entreprise, result: simulation }),
    notifyFounder({
      firstName: prenom ?? 'Lead simulateur',
      email: body.email,
      source: 'Simulateur OPCO',
      notionUrl: notionPage?.url,
      extra: buildExtra({ entreprise, result: simulation, qualification, niveauConfiance }),
    }),
    trackPlausibleEvent(req, 'Lead Simulateur OPCO', {
      budget_bucket: qualification,
      opco_slug: simulation.opco_slug ?? 'unknown',
      source_confiance: niveauConfiance,
      cas_particulier: simulation.cas_particulier ?? 'ok',
    }),
  ]);
  settled.forEach((r, i) => {
    if (r.status === 'rejected') {
      const label = ['recap_email', 'notify_founder', 'plausible'][i];
      logJson('simulator.compute.side_effect_failed', { label, message: r.reason?.message ?? String(r.reason) });
    }
  });

  // ---- 7. Réponse
  logJson('simulator.compute.ok', {
    siret: body.siret,
    email_hash: emailHash,
    idcc: simulation.inputs_snapshot?.idcc ?? null,
    opco_slug: simulation.opco_slug,
    qualification,
    budget_min: simulation.budget_min_eur,
    budget_max: simulation.budget_max_eur,
    cas_particulier: simulation.cas_particulier,
    notion_page_id: notionPage?.id,
  });

  return sendOk(res, {
    simulation,
    entreprise,
    qualification,
    notion_page_id: notionPage?.id ?? null,
  });
}
