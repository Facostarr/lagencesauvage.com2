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

export function runCompute({ idcc, tefenCode, sourceIdcc }) {
  const idccNum = idcc == null ? null : Number.parseInt(String(idcc), 10);
  return computeBudget({
    idcc: Number.isFinite(idccNum) ? idccNum : null,
    tefen_code: tefenCode,
    source_idcc: sourceIdcc ?? 'manuel',
    naf_fallback_slug: null,
    simulator_data: simulatorData,
    metadata,
  });
}

export function getSchemaVersion() {
  return simulatorData?.schema_version ?? '?';
}
