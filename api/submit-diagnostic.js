/**
 * Vercel Serverless Function — Formulaire Diagnostic de Transformation IA
 * Route : POST /api/submit-diagnostic
 *
 * Pipeline :
 *   1. Valide les champs requis
 *   2. Crée une entrée dans la base Notion "Leads Diagnostic"
 *   3. Envoie un email de confirmation au prospect (Resend)
 *   4. Envoie une notification à Franck (email + Telegram via _notify.js)
 *   5. Event Plausible server-side
 *
 * Variables d'environnement requises (Vercel > Settings > Environment Variables) :
 *   NOTION_TOKEN          — clé secrète de l'integration Notion
 *   NOTION_DATABASE_ID    — ID de la base de données Notion "Leads Diagnostic"
 *   RESEND_API_KEY        — envoi des emails (confirmation prospect + notification)
 */

import { Resend } from 'resend';
import { notifyFounder } from './_notify.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_ORIGINS = [
  'https://www.lagencesauvage.com',
  'https://lagencesauvage.com'
];

export default async function handler(req, res) {
  // === CORS ===
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // === PARSE & VALIDATION ===
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { nom, entreprise, salaries, email, irritant, source, date, telephone } = body;

  if (!nom || !entreprise || !salaries || !email) {
    return res.status(400).json({ error: 'Champs requis manquants : nom, entreprise, salaries, email' });
  }

  // Validation email basique
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  // === ANTI-SPAM — Honeypot (optionnel, à ajouter dans le form HTML si besoin) ===
  if (body._hp && body._hp !== '') {
    // Honeypot rempli = bot — on simule un succès silencieux
    return res.status(200).json({ success: true });
  }

  // === NOTION — Créer la lead ===
  const notionToken = process.env.NOTION_TOKEN;
  const notionDbId = process.env.NOTION_DATABASE_ID;

  if (notionToken && notionDbId) {
    try {
      const notionPayload = {
        parent: { database_id: notionDbId },
        properties: {
          // Adapter les noms de propriétés à votre base Notion
          'Nom': {
            title: [{ text: { content: nom } }]
          },
          'Entreprise': {
            rich_text: [{ text: { content: entreprise } }]
          },
          'Email': {
            email: email
          },
          'Taille entreprise': {
            select: { name: salaries }
          },
          'Irritant principal': {
            rich_text: [{ text: { content: irritant || '' } }]
          },
          'Source': {
            select: { name: source || 'landing-diagnostic' }
          },
          'Date de soumission': {
            date: { start: date || new Date().toISOString() }
          },
          'Statut': {
            select: { name: 'Nouveau lead' }
          },
          'Téléphone': {
            phone_number: telephone || null
          }
        }
      };

      const notionResponse = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify(notionPayload)
      });

      if (!notionResponse.ok) {
        const errorData = await notionResponse.json();
        console.error('[Notion] Erreur lors de la création de la lead:', JSON.stringify(errorData));
        // On continue quand même — ne pas bloquer la soumission si Notion échoue
      } else {
        console.log('[Notion] Lead créée avec succès pour:', email);
      }
    } catch (notionError) {
      console.error('[Notion] Exception:', notionError.message);
    }
  } else {
    console.warn('[Notion] Variables NOTION_TOKEN / NOTION_DATABASE_ID non configurées. Lead non enregistrée.');
  }

  const firstName = nom.split(' ')[0];

  // === EMAIL DE CONFIRMATION au prospect (non bloquant) ===
  try {
    await resend.emails.send({
      from: "Franck Sauvage — L'Agence Sauvage <hello@lagencesauvage.com>",
      to: email.trim().toLowerCase(),
      subject: 'Votre demande de diagnostic IA est bien reçue',
      text: `Bonjour ${firstName},\n\nVotre demande est bien arrivée. Je vous recontacte sous 24h ouvrées pour convenir d'un créneau d'échange de 15 minutes.\n\nD'ici là, vous pouvez estimer le budget formation que votre OPCO peut financer avec notre simulateur :\nhttps://www.lagencesauvage.com/simulateur-opco/\n\nEt voir comment d'autres TPE et PME utilisent l'IA au quotidien :\nhttps://www.lagencesauvage.com/realisations/\n\nSi c'est urgent, répondez directement à cet email.\n\nBonne journée,\n\nFranck Sauvage\nFondateur, L'Agence Sauvage\nhello@lagencesauvage.com`,
      html: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
<div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0">
  <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">Demande bien reçue</h1>
  <p style="color:#C7D2FE;margin:6px 0 0;font-size:14px">Diagnostic de transformation IA</p>
</div>
<div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
  <p style="margin:0 0 16px">Bonjour <strong>${firstName}</strong>,</p>
  <p style="margin:0 0 20px;color:#374151">Votre demande est bien arrivée. Je vous recontacte sous 24h ouvrées pour convenir d'un créneau d'échange de 15 minutes.</p>
  <div style="background:#F1F5F9;border-radius:8px;padding:20px;margin:0 0 24px">
    <p style="margin:0 0 10px;font-weight:700;color:#0F172A;font-size:14px">D'ici là</p>
    <p style="margin:0 0 8px;font-size:14px;color:#374151">Estimez le budget formation que votre OPCO peut financer : <a href="https://www.lagencesauvage.com/simulateur-opco/" style="color:#4F46E5;font-weight:600">simulateur OPCO</a></p>
    <p style="margin:0;font-size:14px;color:#374151">Voyez comment d'autres TPE et PME utilisent l'IA au quotidien : <a href="https://www.lagencesauvage.com/realisations/" style="color:#4F46E5;font-weight:600">nos réalisations</a></p>
  </div>
  <p style="margin:0 0 8px;color:#374151;font-size:14px">Si c'est urgent, répondez directement à cet email.</p>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0">
  <p style="margin:0;font-size:12px;color:#94A3B8">L'Agence Sauvage · <a href="mailto:hello@lagencesauvage.com" style="color:#94A3B8">hello@lagencesauvage.com</a></p>
</div>
</div>`,
    });
    console.log('[Resend] Email de confirmation envoyé au prospect:', email);
  } catch (e) {
    console.warn('[Resend] Email confirmation prospect échoué (non bloquant):', e.message);
  }

  // === NOTIFICATION Franck via _notify.js ===
  try {
    await notifyFounder({
      firstName,
      email,
      source: source || 'Formulaire Diagnostic',
      extra: `🏢 ${entreprise} · 👥 ${salaries} · 💡 ${irritant || 'Non renseigné'}${telephone ? ` · 📞 ${telephone}` : ''}`,
    });
  } catch (e) {
    console.warn('[Notify] Erreur non bloquante:', e.message);
  }

  // === TRACKING PLAUSIBLE (server-side, adblocker-proof) ===
  try {
    await trackPlausibleEvent(req, 'Lead', { source: 'Diagnostic' });
  } catch (e) {
    console.warn('[Plausible] Erreur non bloquante:', e.message);
  }

  // === SUCCÈS ===
  return res.status(200).json({
    success: true,
    message: 'Lead enregistrée. Vous serez recontacté sous 24h.'
  });
}

// =============================================================================
// FONCTION : Tracking Plausible Events API (server-side, adblocker-proof)
// =============================================================================
async function trackPlausibleEvent(req, eventName, props = {}) {
  const domain = 'lagencesauvage.com';
  const pageUrl = req.headers.referer || `https://www.${domain}/`;
  const userAgent = req.headers['user-agent'] || 'Mozilla/5.0';
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || '127.0.0.1';

  await fetch('https://plausible.io/api/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': userAgent,
      'X-Forwarded-For': ip
    },
    body: JSON.stringify({
      name: eventName,
      url: pageUrl,
      domain: domain,
      props: props
    })
  });
}
