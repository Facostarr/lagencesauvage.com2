// =============================================================================
// OPCO Radar — Capture des sociétés résolues SANS email (abandons)
// =============================================================================
// Appelé en fire-and-forget fail-open depuis simulate-opco-resolve.js, APRÈS
// que la société a été résolue (SIREN + NAF + effectif + IDCC connus) mais
// AVANT le gate email. But : constituer la liste réelle des sociétés simulées
// non converties, pour juger la qualité du gisement (projet OPCO Radar) puis,
// si validé, alimenter une séquence cold-email.
//
// Écrit dans la base Notion "OPCO Radar — Sociétés simulées" (env
// NOTION_DATABASE_OPCO_RADAR), DISTINCTE de "Leads Simulateur OPCO" (qui ne
// contient que les vrais leads email-gated — ne JAMAIS la polluer ici).
//
// Le budget/OPCO est recalculé via runCompute (même moteur que le compute,
// module pur sans I/O), en best-effort : une simulation qui échoue n'empêche
// pas la capture de l'identité.
// =============================================================================

import { Client } from '@notionhq/client';
import { runCompute, classifyBudget, tefenLabel } from './compute-engine.js';

const TITLE_LIMIT = 100;
const RICH_TEXT_LIMIT = 1900;

function truncate(text, max) {
  if (typeof text !== 'string') return '';
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

// Recalcule OPCO + budget à partir des seuls inputs disponibles au resolve.
// Best-effort : null si le moteur lève (IDCC inconnu, etc.).
function safeCompute(entreprise) {
  try {
    return runCompute({
      idcc: entreprise?.idcc,
      tefenCode: entreprise?.tranche_effectif_tefen,
      sourceIdcc: entreprise?.source_idcc,
    });
  } catch (_) {
    return null;
  }
}

// Construit les propriétés Notion. IMPORTANT (même contrainte que notion-client) :
// à la CRÉATION, on omet les propriétés vides (number/select/date ne tolèrent
// pas { field: null }). On n'ajoute que ce qui est renseigné.
export function buildAbandonProperties({ entreprise, suggestion, simulation, qualification }) {
  const sirenNum = entreprise?.siren ? Number.parseInt(entreprise.siren, 10) : null;
  const idccNum = entreprise?.idcc != null ? Number.parseInt(String(entreprise.idcc), 10) : null;
  const villeStr = [entreprise?.code_postal, entreprise?.ville].filter(Boolean).join(' ').trim();

  const properties = {
    'Raison sociale': { title: [{ text: { content: truncate(entreprise?.nom_complet || '—', TITLE_LIMIT) } }] },
    'Date capture': { date: { start: new Date().toISOString() } },
    'Tranche effectif': { rich_text: [{ text: { content: truncate(tefenLabel(entreprise?.tranche_effectif_tefen), RICH_TEXT_LIMIT) } }] },
  };

  if (Number.isFinite(sirenNum)) properties.SIREN = { number: sirenNum };
  if (entreprise?.naf) properties['Code NAF'] = { rich_text: [{ text: { content: truncate(entreprise.naf, RICH_TEXT_LIMIT) } }] };
  if (villeStr) properties.Ville = { rich_text: [{ text: { content: truncate(villeStr, RICH_TEXT_LIMIT) } }] };
  if (entreprise?.categorie_entreprise) properties['Catégorie'] = { rich_text: [{ text: { content: truncate(entreprise.categorie_entreprise, RICH_TEXT_LIMIT) } }] };
  if (Number.isFinite(idccNum)) properties.IDCC = { number: idccNum };
  else if (suggestion?.value != null) properties['IDCC suggéré'] = { rich_text: [{ text: { content: truncate(String(suggestion.value), RICH_TEXT_LIMIT) } }] };
  if (simulation?.opco_nom) properties.OPCO = { rich_text: [{ text: { content: truncate(simulation.opco_nom, RICH_TEXT_LIMIT) } }] };
  if (Number.isFinite(simulation?.budget_min_eur)) properties['Budget min (€)'] = { number: simulation.budget_min_eur };
  if (Number.isFinite(simulation?.budget_max_eur)) properties['Budget max (€)'] = { number: simulation.budget_max_eur };
  if (qualification) properties.Qualification = { select: { name: qualification } };
  if (entreprise?.source_confiance) properties['Source confiance'] = { rich_text: [{ text: { content: truncate(entreprise.source_confiance, RICH_TEXT_LIMIT) } }] };

  return properties;
}

// No-op silencieux si non configuré (avant que l'env var soit posée → déploiement
// sans risque). Throw possible sur erreur Notion : l'appelant (resolve) l'attrape
// et logue, sans jamais casser la réponse.
export async function emitResolvedNoEmail({ entreprise, suggestion }) {
  const databaseId = process.env.NOTION_DATABASE_OPCO_RADAR;
  if (!process.env.NOTION_API_KEY || !databaseId || !entreprise?.siren) return;

  const simulation = safeCompute(entreprise);
  const qualification = simulation ? classifyBudget(simulation.budget_max_eur, simulation.cas_particulier) : null;

  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: buildAbandonProperties({ entreprise, suggestion, simulation, qualification }),
  });
}
