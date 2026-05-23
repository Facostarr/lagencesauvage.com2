// =============================================================================
// Notion client — Base "Leads Simulateur OPCO"
// =============================================================================
// Schéma de la base : voir docs/simulateur-opco/notion-schema.md (19 colonnes
// selon PRD section 8). La base est créée manuellement par Franck, son ID
// est passé en env NOTION_DATABASE_SIMULATEUR_OPCO.
//
// Pattern recommandé Gemini : le snapshot JSON complet va dans le BODY de la
// page (block "code"), pas dans une propriété rich_text limitée à 2000 chars.

import { Client } from '@notionhq/client';
import { tefenLabel, confianceNotionLabel } from './compute-engine.js';

const TITLE_LIMIT = 100;
const RICH_TEXT_LIMIT = 1900;
const DISPOSITIFS_MAX = 8;
const CODE_BLOCK_MAX = 1900;

function truncate(text, max) {
  if (typeof text !== 'string') return '';
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

function chunkString(str, size) {
  const out = [];
  for (let i = 0; i < str.length; i += size) out.push(str.slice(i, i + size));
  return out;
}

export function buildLeadPayload({ body, entreprise, result, snapshot, niveauConfiance, qualification }) {
  const nomComplet = body.nom_prospect?.trim() || 'Lead anonyme';
  const sourceUtm = [body.utm_source, body.utm_campaign].filter(Boolean).join(' / ') || 'direct';
  const dispositifsLabels = (result.dispositifs_actives ?? [])
    .map((d) => d?.libelle)
    .filter(Boolean)
    .slice(0, DISPOSITIFS_MAX)
    .map((libelle) => ({ name: truncate(libelle, 100) }));

  const sirenNumber = entreprise?.siren ? Number.parseInt(entreprise.siren, 10) : null;
  const idccNumber = result?.inputs_snapshot?.idcc ?? null;

  const properties = {
    'Nom complet': { title: [{ text: { content: truncate(nomComplet, TITLE_LIMIT) } }] },
    Email: { email: body.email.trim().toLowerCase() },
    Téléphone: body.telephone?.trim() ? { phone_number: body.telephone.trim() } : { phone_number: null },
    'Raison sociale': { rich_text: [{ text: { content: truncate(entreprise?.nom_complet || '', RICH_TEXT_LIMIT) } }] },
    SIREN: { number: Number.isFinite(sirenNumber) ? sirenNumber : null },
    'Code NAF': entreprise?.naf ? { select: { name: truncate(entreprise.naf, 100) } } : { select: null },
    'Tranche effectif': { select: { name: tefenLabel(entreprise?.tranche_effectif_tefen) } },
    IDCC: { number: Number.isFinite(idccNumber) ? idccNumber : null },
    'Niveau confiance IDCC': { select: { name: confianceNotionLabel(niveauConfiance) } },
    OPCO: result?.opco_nom ? { select: { name: truncate(result.opco_nom, 100) } } : { select: null },
    'Budget min (€)': { number: result?.budget_min_eur ?? null },
    'Budget max (€)': { number: result?.budget_max_eur ?? null },
    'Dispositifs activés': { multi_select: dispositifsLabels },
    'Version règles': { rich_text: [{ text: { content: truncate(result?.version_regles || '', RICH_TEXT_LIMIT) } }] },
    'Statut commercial': { select: { name: 'Nouveau' } },
    'Source UTM': { rich_text: [{ text: { content: truncate(sourceUtm, RICH_TEXT_LIMIT) } }] },
    'Date soumission': { date: { start: new Date().toISOString() } },
  };

  if (qualification) {
    properties['Qualification (auto)'] = { select: { name: qualification } };
  }
  if (result?.cas_particulier) {
    properties['Cas particulier'] = { select: { name: truncate(result.cas_particulier, 100) } };
  }

  const snapshotJson = JSON.stringify(snapshot, null, 2);
  const chunks = chunkString(snapshotJson, CODE_BLOCK_MAX);
  const children = [
    {
      object: 'block',
      type: 'heading_3',
      heading_3: { rich_text: [{ type: 'text', text: { content: 'Snapshot JSON de la simulation' } }] },
    },
    ...chunks.map((c) => ({
      object: 'block',
      type: 'code',
      code: {
        language: 'json',
        rich_text: [{ type: 'text', text: { content: c } }],
      },
    })),
  ];

  return { properties, children };
}

export async function createSimulatorLead({ databaseId, body, entreprise, result, snapshot, niveauConfiance, qualification }) {
  if (!process.env.NOTION_API_KEY) throw new Error('NOTION_API_KEY manquante.');
  if (!databaseId) throw new Error('NOTION_DATABASE_SIMULATEUR_OPCO manquante.');
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const { properties, children } = buildLeadPayload({ body, entreprise, result, snapshot, niveauConfiance, qualification });
  return notion.pages.create({ parent: { database_id: databaseId }, properties, children });
}
