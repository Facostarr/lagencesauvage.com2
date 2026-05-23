// =============================================================================
// VERCEL SERVERLESS FUNCTION — Diagnostic Notion pour Simulateur OPCO
// =============================================================================
// GET /api/simulate-opco-debug
//
// Endpoint de debug temporaire (à supprimer après résolution du bug).
// Renvoie le détail complet des erreurs Notion sans troncature pour
// identifier la cause racine du 500 sur /api/simulate-opco-compute.
// =============================================================================

import { Client } from '@notionhq/client';
import { applyCors } from './_simulateur/http-utils.js';

export default async function handler(req, res) {
  applyCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const result = {
    env: {
      has_notion_api_key: Boolean(process.env.NOTION_API_KEY),
      has_notion_database_simulateur_opco: Boolean(process.env.NOTION_DATABASE_SIMULATEUR_OPCO),
      database_id_value: process.env.NOTION_DATABASE_SIMULATEUR_OPCO ?? null,
      node_version: process.versions?.node,
    },
    tests: {},
  };

  if (!process.env.NOTION_API_KEY) {
    result.tests.notion_api_key = { ok: false, error: 'NOTION_API_KEY manquante' };
    return res.status(200).json(result);
  }
  if (!process.env.NOTION_DATABASE_SIMULATEUR_OPCO) {
    result.tests.database_id = { ok: false, error: 'NOTION_DATABASE_SIMULATEUR_OPCO manquante' };
    return res.status(200).json(result);
  }

  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  // TEST 1 — Récupérer la base (vérifie permissions intégration)
  try {
    const db = await notion.databases.retrieve({ database_id: process.env.NOTION_DATABASE_SIMULATEUR_OPCO });
    result.tests.database_retrieve = {
      ok: true,
      title: db?.title?.[0]?.plain_text ?? '?',
      property_names: Object.keys(db?.properties ?? {}),
    };
  } catch (err) {
    result.tests.database_retrieve = {
      ok: false,
      message: err?.message,
      code: err?.code,
      status: err?.status,
      name: err?.name,
      body_raw: typeof err?.body === 'string' ? err.body : JSON.stringify(err?.body ?? {}),
    };
    return res.status(200).json(result);
  }

  // TEST 2 — Création d'une page minimale (Title + Email)
  try {
    const minimalPage = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_SIMULATEUR_OPCO },
      properties: {
        'Nom complet': { title: [{ text: { content: '[DEBUG] Test minimal — à supprimer' } }] },
        Email: { email: 'debug@example.com' },
        'Tranche effectif': { select: { name: 'Effectif non renseigné' } },
        'Niveau confiance IDCC': { select: { name: 'Manuel' } },
        'Dispositifs activés': { multi_select: [] },
        'Version règles': { rich_text: [{ text: { content: 'debug' } }] },
        'Statut commercial': { select: { name: 'Nouveau' } },
        'Source UTM': { rich_text: [{ text: { content: 'debug' } }] },
        'Date soumission': { date: { start: new Date().toISOString() } },
      },
    });
    result.tests.minimal_create = {
      ok: true,
      page_id: minimalPage?.id,
      page_url: minimalPage?.url,
      note: 'Page test créée — pensez à la supprimer dans Notion',
    };
  } catch (err) {
    result.tests.minimal_create = {
      ok: false,
      message: err?.message,
      code: err?.code,
      status: err?.status,
      name: err?.name,
      body_raw: typeof err?.body === 'string' ? err.body : JSON.stringify(err?.body ?? {}),
    };
  }

  return res.status(200).json(result);
}
