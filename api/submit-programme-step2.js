// =============================================================================
// VERCEL SERVERLESS FUNCTION - Lead magnet "Programme Formation" — Étape 2
// =============================================================================
// Reçoit les données de qualification (taille, secteur, opco, poste)
// → Notification Franck uniquement (pas de Notion update, pas d'email prospect)

import { notifyFounder } from './_notify.js';

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

  try {
    const extra = [
      size ? `📊 Taille : ${size}` : null,
      sector ? `🏭 Secteur : ${sector}` : null,
      opco_contact ? `🏛 OPCO déjà contacté : ${opco_contact}` : null,
      position ? `💼 Poste : ${position}` : null,
    ].filter(Boolean).join('\n');

    await notifyFounder({
      firstName: '(qualification)',
      email: email.trim().toLowerCase(),
      source: 'Programme Formation — Étape 2 qualification',
      extra,
    });
    console.log('✅ Qualification step 2 envoyée à Franck');
  } catch (err) {
    console.error('⚠️ Step 2 notification échouée:', err.message);
  }

  return res.status(200).json({ success: true });
}
