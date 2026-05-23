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

  // IMPORTANT (consensus Gemini H6, 85% confiance) : à la CRÉATION d'une page
  // Notion (vs l'UPDATE), il faut OMETTRE les propriétés vides — surtout pour
  // les types phone_number, select, number qui ne tolèrent pas { field: null }
  // à la création (validation_error 400). On construit donc le payload en
  // n'ajoutant que les propriétés effectivement renseignées.
  const properties = {
    'Nom complet': { title: [{ text: { content: truncate(nomComplet, TITLE_LIMIT) } }] },
    Email: { email: body.email.trim().toLowerCase() },
    'Raison sociale': { rich_text: [{ text: { content: truncate(entreprise?.nom_complet || '', RICH_TEXT_LIMIT) } }] },
    'Tranche effectif': { select: { name: tefenLabel(entreprise?.tranche_effectif_tefen) } },
    'Niveau confiance IDCC': { select: { name: confianceNotionLabel(niveauConfiance) } },
    'Dispositifs activés': { multi_select: dispositifsLabels },
    'Version règles': { rich_text: [{ text: { content: truncate(result?.version_regles || '', RICH_TEXT_LIMIT) } }] },
    'Statut commercial': { select: { name: 'Nouveau' } },
    'Source UTM': { rich_text: [{ text: { content: truncate(sourceUtm, RICH_TEXT_LIMIT) } }] },
    'Date soumission': { date: { start: new Date().toISOString() } },
  };

  if (body.telephone?.trim()) properties.Téléphone = { phone_number: body.telephone.trim() };
  if (Number.isFinite(sirenNumber)) properties.SIREN = { number: sirenNumber };
  // Code NAF et OPCO en rich_text (et non select) : Notion refuse de créer
  // des options Select à la volée — 700+ codes NAF impossibles à pré-créer,
  // et le moteur compute renvoie des variantes de casse OPCO ("OPCO EP" vs
  // "Opco EP", "Opco Atlas" vs "Atlas") qui produisent un validation_error.
  if (entreprise?.naf) properties['Code NAF'] = { rich_text: [{ text: { content: truncate(entreprise.naf, RICH_TEXT_LIMIT) } }] };
  if (Number.isFinite(idccNumber)) properties.IDCC = { number: idccNumber };
  if (result?.opco_nom) properties.OPCO = { rich_text: [{ text: { content: truncate(result.opco_nom, RICH_TEXT_LIMIT) } }] };
  if (Number.isFinite(result?.budget_min_eur)) properties['Budget min (€)'] = { number: result.budget_min_eur };
  if (Number.isFinite(result?.budget_max_eur)) properties['Budget max (€)'] = { number: result.budget_max_eur };
  if (qualification) properties['Qualification (auto)'] = { select: { name: qualification } };
  if (result?.cas_particulier) properties['Cas particulier'] = { select: { name: truncate(result.cas_particulier, 100) } };

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
