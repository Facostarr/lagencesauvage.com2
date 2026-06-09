// =============================================================================
// Helper partagé — recherche d'un lead existant dans la base Notion "Leads"
// =============================================================================
// Anti-doublon : un même email qui re-télécharge un lead magnet ne doit pas
// créer une nouvelle page Notion. L'endpoint réutilise la page existante
// (même Email + même Source).
// Fail-open : toute erreur renvoie null → l'endpoint crée la page normalement.

import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

/**
 * @param {Object} params
 * @param {string} params.email  - email normalisé (trim + lowercase)
 * @param {string} params.source - valeur exacte du select Notion "Source"
 * @returns {Promise<Object|null>} la page Notion la plus récente, ou null
 */
export async function findExistingLead({ email, source }) {
  if (!process.env.NOTION_API_KEY || !DATABASE_ID) return null;
  try {
    const { results } = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          { property: 'Email', email: { equals: email } },
          { property: 'Source', select: { equals: source } },
        ],
      },
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: 1,
    });
    return results[0] || null;
  } catch (err) {
    console.warn('⚠️ findExistingLead échoué (fail-open):', err.message);
    return null;
  }
}
