// =============================================================================
// VERCEL SERVERLESS FUNCTION - Lead magnet "Grille de pilotage SEO + GEO 2026"
// =============================================================================
// Capture prénom + email → Notion + email PDF prospect + notification Franck

import { Client } from '@notionhq/client';
import { Resend } from 'resend';
import { notifyFounder } from './_notify.js';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const resend = new Resend(process.env.RESEND_API_KEY);

const PDF_URL = 'https://www.lagencesauvage.com/assets/downloads/grille-pilotage-seo-geo-2026.pdf';
const LANDING_URL = 'https://www.lagencesauvage.com/blog/seo-geo-2026-methode-visibilite-google-ia/';
const DIAGNOSTIC_URL = 'https://www.lagencesauvage.com/#audit-form';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const { firstName, email, phone = '' } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ success: false, message: 'Prénom et email requis.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Email invalide.' });
  }

  let notionUrl;

  // 1. Notion — bloquant
  try {
    if (process.env.NOTION_API_KEY && DATABASE_ID) {
      const page = await notion.pages.create({
        parent: { database_id: DATABASE_ID },
        properties: {
          'Name': { title: [{ text: { content: firstName.trim() } }] },
          'Email': { email: email.trim().toLowerCase() },
          'Entreprise': { rich_text: [{ text: { content: '(Grille SEO GEO)' } }] },
          'Taille': { select: { name: '1-5' } },
          'Défi': { rich_text: [{ text: { content: 'Téléchargement Grille de pilotage SEO + GEO 2026' } }] },
          'Statut': { select: { name: 'Nouveau' } },
          'Source': { select: { name: 'Lead Magnet - Grille SEO GEO' } },
          'Date Soumission': { date: { start: new Date().toISOString().split('T')[0] } },
          'Téléphone': { phone_number: phone.trim() || null },
        },
      });
      notionUrl = page.url;
      console.log('✅ Notion créé:', page.id);
    }
  } catch (err) {
    console.error('❌ Notion error:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur. Réessayez.' });
  }

  // 2. Email prospect avec lien PDF
  try {
    await resend.emails.send({
      from: "Franck Sauvage — L'Agence Sauvage <hello@lagencesauvage.com>",
      to: email.trim().toLowerCase(),
      subject: 'Votre grille de pilotage SEO + GEO 2026',
      text: `Bonjour ${firstName},\n\nVoici votre grille de pilotage (téléchargement direct) :\n${PDF_URL}\n\n10 indicateurs concrets pour vérifier, à votre prochain point mensuel, que votre prestataire — agence, freelance ou équipe interne — a pris le virage de l'IA. Notez chaque indicateur sur 2, faites le total sur 20, et vous saurez où vous en êtes.\n\nUn conseil : commencez par les 2 tests d'une minute (page 4). Ils vous diront tout de suite si les IA ont le droit de lire votre site.\n\nVous préférez un regard extérieur ? Je propose un audit IA gratuit de 30 minutes qui passe votre site au crible de ces 10 indicateurs :\n${DIAGNOSTIC_URL}\n\nBonne lecture,\n\nFranck Sauvage\nFondateur — L'Agence Sauvage\nhello@lagencesauvage.com`,
      html: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
<div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0">
  <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">Grille de pilotage SEO + GEO 2026</h1>
  <p style="color:#C7D2FE;margin:6px 0 0;font-size:14px">10 indicateurs de gouvernance · Grille de notation /20 · 2 tests à faire vous-même</p>
</div>
<div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
  <p style="margin:0 0 16px">Bonjour <strong>${firstName}</strong>,</p>
  <p style="margin:0 0 20px;color:#374151">Voici votre grille. Elle vous donne 10 indicateurs concrets pour vérifier, à votre prochain point mensuel, que votre prestataire a pris le virage de l'IA.</p>

  <a href="${PDF_URL}" style="display:inline-block;background:#4F46E5;color:#fff;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px">Télécharger ma grille (PDF) →</a>

  <div style="background:#F1F5F9;border-radius:8px;padding:20px;margin:28px 0">
    <p style="margin:0 0 10px;font-weight:700;color:#0F172A;font-size:14px">Ce que contient votre grille</p>
    <ul style="margin:0;padding-left:20px;color:#374151;font-size:14px;line-height:1.8">
      <li><strong>10 indicateurs</strong> à noter sur 2 (fondations, autorité, visibilité IA, pilotage)</li>
      <li><strong>La preuve à exiger</strong> pour chacun — pour détecter le flou</li>
      <li><strong>2 tests</strong> à faire vous-même en une minute (robots.txt, llms.txt)</li>
      <li><strong>Une grille de notation /20</strong> et 5 questions de pilotage à poser</li>
    </ul>
  </div>

  <div style="background:#EEF2FF;border-left:4px solid #4F46E5;padding:16px 20px;margin-bottom:28px;border-radius:0 6px 6px 0">
    <p style="margin:0;font-size:14px;color:#3730A3;font-weight:600">Commencez ici</p>
    <p style="margin:6px 0 0;font-size:14px;color:#374151">Page 4 : les 2 tests d'une minute. Ils vous diront tout de suite si les IA d'OpenAI et d'Anthropic ont le droit de lire votre site — ou si vous les bloquez sans le savoir.</p>
  </div>

  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0">
  <p style="margin:0 0 8px;color:#374151;font-size:14px">Vous préférez un regard extérieur sur ces 10 indicateurs ?</p>
  <a href="${DIAGNOSTIC_URL}" style="color:#4F46E5;font-size:14px;font-weight:600">Réservez votre audit IA gratuit de 30 min →</a>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0">
  <p style="margin:0;font-size:12px;color:#94A3B8">L'Agence Sauvage · Paris · <a href="mailto:hello@lagencesauvage.com" style="color:#94A3B8">hello@lagencesauvage.com</a></p>
</div>
</div>`,
    });
    console.log('✅ Email grille envoyé au prospect');
  } catch (err) {
    console.error('⚠️ Email prospect échoué (non bloquant):', err.message);
  }

  // 3. Notification Franck
  try {
    await notifyFounder({
      firstName,
      email,
      source: 'Grille de pilotage SEO + GEO 2026',
      notionUrl,
      extra: phone.trim() ? `📞 Téléphone : ${phone.trim()}` : undefined,
    });
  } catch (err) {
    console.error('⚠️ notifyFounder échoué (non bloquant):', err.message);
  }

  // 4. Tracking Plausible
  try {
    await fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'X-Forwarded-For': req.headers['x-forwarded-for']?.split(',')[0]?.trim() || '127.0.0.1',
      },
      body: JSON.stringify({
        name: 'Grille SEO GEO Download',
        url: req.headers.referer || LANDING_URL,
        domain: 'lagencesauvage.com',
        props: { source: 'Lead Magnet Grille SEO GEO' },
      }),
    });
  } catch (_) { /* non bloquant */ }

  return res.status(200).json({ success: true });
}
