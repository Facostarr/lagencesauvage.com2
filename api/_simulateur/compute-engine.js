// =============================================================================
// Wrapper du moteur de compute pour environnement Vercel serverless
// =============================================================================
// Importe le JSON via ESM natif (Node 18+ syntaxe `with { type: 'json' }`),
// ce qui :
//   - inclut le fichier dans le bundle Lambda automatiquement (pas besoin de
//     vercel.json includeFiles)
//   - pré-parse le JSON 1x au cold start, partagé entre invocations chaudes
//   - évite readFileSync (qui suppose un layout filesystem)

import simulatorData from '../../static/data/simulator-ready.json' with { type: 'json' };
import metadata from '../../static/data/metadata.json' with { type: 'json' };
import { computeBudget } from '../../lib/simulateur-opco/compute_budget.js';

const TEFEN_LABELS = {
  NN: 'Non renseigné',
  '00': '0 salarié',
  '01': '1 ou 2 salariés',
  '02': '3 à 5 salariés',
  '03': '6 à 9 salariés',
  '11': '10 à 19 salariés',
  '12': '20 à 49 salariés',
  '21': '50 à 99 salariés',
  '22': '100 à 199 salariés',
  '31': '200 à 249 salariés',
  '32': '250 à 499 salariés',
  '41': '500 à 999 salariés',
  '42': '1 000 à 1 999 salariés',
  '51': '2 000 à 4 999 salariés',
  '52': '5 000 à 9 999 salariés',
  '53': '10 000 salariés ou plus',
};

const CONFIANCE_TO_NOTION = {
  'auto-dinum': 'Auto-DINUM',
  'auto-fallback': 'Auto-Fallback',
  'heuristique-naf': 'Heuristique-NAF',
  manuel: 'Manuel',
};

export function tefenLabel(code) {
  return TEFEN_LABELS[code] ?? 'Non renseigné';
}

export function confianceNotionLabel(slug) {
  return CONFIANCE_TO_NOTION[slug] ?? 'Manuel';
}

export function classifyBudget(budgetMaxEur, casParticulier) {
  if (casParticulier) return 'manual';
  if (budgetMaxEur == null) return 'cold';
  if (budgetMaxEur >= 5000) return 'hot';
  if (budgetMaxEur >= 2000) return 'warm';
  return 'cold';
}

export function runCompute({ idcc, tefenCode, sourceIdcc, nafFallbackSlug }) {
  const idccNum = idcc == null ? null : Number.parseInt(String(idcc), 10);
  return computeBudget({
    idcc: Number.isFinite(idccNum) ? idccNum : null,
    tefen_code: tefenCode,
    source_idcc: sourceIdcc ?? 'manuel',
    naf_fallback_slug: nafFallbackSlug ?? null,
    simulator_data: simulatorData,
    metadata,
  });
}

export function getSchemaVersion() {
  return simulatorData?.schema_version ?? '?';
}

// Whitelist d'IDCCs valides pour la sélection humaine assistée (PRD étage 3
// de la cascade IDCC). On n'expose au prospect que les IDCCs ayant un libellé
// branche en clair — c'est la précision UX requise pour qu'un dirigeant
// reconnaisse sa convention sans connaître le code 4 chiffres.
let _validIdccOverrides = null;
export function getValidIdccOverrides() {
  if (_validIdccOverrides) return _validIdccOverrides;
  const set = new Set();
  const index = simulatorData?.idcc_index ?? {};
  for (const [idcc, entry] of Object.entries(index)) {
    if (entry?.branche_nom) {
      const n = Number.parseInt(idcc, 10);
      if (Number.isFinite(n)) set.add(n);
    }
  }
  _validIdccOverrides = set;
  return set;
}

// Whitelist des branches du naf_fallback_index (branches sans IDCC déclaré —
// principalement Afdas + 3 branches Constructys + 4 branches OPCO Mobilités…).
// 22 entrées qui complètent les 45 IDCCs avec branche_nom pour atteindre une
// couverture de 10 OPCO sur 11 dans le select de sélection humaine.
let _validBrancheOverrides = null;
export function getValidBrancheOverrides() {
  if (_validBrancheOverrides) return _validBrancheOverrides;
  const set = new Set();
  const index = simulatorData?.naf_fallback_index ?? {};
  for (const slug of Object.keys(index)) {
    if (typeof slug === 'string' && slug.length > 0) set.add(slug);
  }
  _validBrancheOverrides = set;
  return set;
}

// Renvoie l'effectif min estimé pour un code TEFEN INSEE, depuis la table
// tefen_to_tranche_opco de simulator-ready.json. Utilisé par l'auto-application
// NAF (S6.6.3) pour garantir que effectif > 0 avant d'auto-appliquer (un TNS
// sans salarié dépend du FIFPL/FAFIEC, pas d'un OPCO).
// Retourne null si TEFEN inconnu ou code NN (effectif non renseigné).
export function getEffectifMinFromTefen(tefenCode) {
  if (!tefenCode || tefenCode === 'NN') return null;
  const entry = simulatorData?.tefen_to_tranche_opco?.[tefenCode];
  if (!entry) return null;
  const min = entry.effectif_estime_min;
  return Number.isFinite(min) ? min : null;
}
