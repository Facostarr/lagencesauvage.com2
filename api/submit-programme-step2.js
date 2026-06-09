// =============================================================================
// VERCEL SERVERLESS FUNCTION - Lead magnet "Programme Formation" — Étape 2
// =============================================================================
// Reçoit les données de qualification (taille, secteur, opco, poste)
// → met à jour le lead Notion créé à l'étape 1 (champ Défi)
// → notification Franck + event Plausible server-side
//
// Note : le select Notion 'Taille' n'est pas modifié. Les paliers du step 2
// (1-9 / 10-49 / 50-299 / 300+) ne correspondent pas aux options existantes
// du select, et l'API Notion ne crée pas d'options select à la volée.
// La qualification complète part dans 'Défi' (rich_text, sans contrainte).

import { Client } from '@notionhq/client';
import { notifyFounder } from './_notify.js';
import { findExistingLead } from './_leads.js';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const SOURCE_STEP1 = 'Lead Magnet - Programme Formation';
const LANDING_URL = 'https://www.lagencesauvage.com/formation/maitriser-claude-entreprise/';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const {
    email = '',
    size = '',
    sector = '',
    opco_contact = '',
    position = '',
  } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email requis.' });
  }

  const emailNorm = email.trim().toLowerCase();
  const qualifParts = [
    size ? `taille ${size}` : null,
    sector ? `secteur ${sector}` : null,
    opco_contact ? `OPCO contacté : ${opco_contact}` : null,
    position ? `poste : ${position}` : null,
  ].filter(Boolean);

  // 1. Mise à jour du lead Notion créé à l'étape 1 — non bloquant
  let notionUrl;
  try {
    if (process.env.NOTION_API_KEY && qualifParts.length) {
      const lead = await findExistingLead({ email: emailNorm, source: SOURCE_STEP1 });
      if (lead) {
        await notion.pages.update({
          page_id: lead.id,
          properties: {
            'Défi': { rich_text: [{ text: { content: `Téléchargement Programme Formation Claude · Qualification : ${qualifParts.join(' · ')}` } }] },
          },
        });
        notionUrl = lead.url;
        console.log('✅ Lead Notion qualifié:', lead.id);
      } else {
        console.warn('⚠️ Step 2 : aucun lead étape 1 trouvé pour', emailNorm);
      }
    }
  } catch (err) {
    console.error('⚠️ Step 2 Notion update échoué (non bloquant):', err.message);
  }

  // 2. Notification Franck
  try {
    const extra = [
      size ? `📊 Taille : ${size}` : null,
      sector ? `🏭 Secteur : ${sector}` : null,
      opco_contact ? `🏛 OPCO déjà contacté : ${opco_contact}` : null,
      position ? `💼 Poste : ${position}` : null,
      notionUrl ? null : '⚠️ Lead étape 1 introuvable dans Notion — qualification non rattachée',
    ].filter(Boolean).join('\n');

    await notifyFounder({
      firstName: '(qualification)',
      email: emailNorm,
      source: 'Programme Formation — Étape 2 qualification',
      notionUrl,
      extra,
    });
    console.log('✅ Qualification step 2 envoyée à Franck');
  } catch (err) {
    console.error('⚠️ Step 2 notification échouée:', err.message);
  }

  // 3. Tracking Plausible (server-side)
  try {
    await fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'X-Forwarded-For': req.headers['x-forwarded-for']?.split(',')[0]?.trim() || '127.0.0.1',
      },
      body: JSON.stringify({
        name: 'Programme Formation Qualification',
        url: req.headers.referer || LANDING_URL,
        domain: 'lagencesauvage.com',
        props: { source: 'Lead Magnet Formation' },
      }),
    });
  } catch (_) { /* non bloquant */ }

  return res.status(200).json({ success: true });
}
