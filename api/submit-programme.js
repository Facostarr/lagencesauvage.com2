// =============================================================================
// VERCEL SERVERLESS FUNCTION - Lead magnet "Programme Formation Claude"
// =============================================================================
// Étape 1 — Capture prénom + nom + email + entreprise
// → Notion (database existante, Source distincte) + email prospect + notifyFounder

import { Client } from '@notionhq/client';
import { Resend } from 'resend';
import { notifyFounder } from './_notify.js';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const resend = new Resend(process.env.RESEND_API_KEY);

const PDF_URL = 'https://www.lagencesauvage.com/assets/downloads/programme-formation-claude-entreprise.pdf';
const LANDING_URL = 'https://www.lagencesauvage.com/formation/maitriser-claude-entreprise/';
const DIAGNOSTIC_URL = 'https://www.lagencesauvage.com/#audit-form';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const { firstName, lastName = '', email, company = '' } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ success: false, message: 'Prénom et email requis.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Email invalide.' });
  }

  const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
  const emailNorm = email.trim().toLowerCase();
  const companyNorm = company.trim();

  let notionUrl;

  // 1. Notion — bloquant
  try {
    if (process.env.NOTION_API_KEY && DATABASE_ID) {
      const page = await notion.pages.create({
        parent: { database_id: DATABASE_ID },
        properties: {
          'Name': { title: [{ text: { content: fullName } }] },
          'Email': { email: emailNorm },
          'Entreprise': { rich_text: [{ text: { content: companyNorm || '(non renseigné)' } }] },
          'Taille': { select: { name: '1-5' } },
          'Défi': { rich_text: [{ text: { content: 'Téléchargement Programme Formation Claude' } }] },
          'Statut': { select: { name: 'Nouveau' } },
          'Source': { select: { name: 'Lead Magnet - Programme Formation' } },
          'Date Soumission': { date: { start: new Date().toISOString().split('T')[0] } },
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
      to: emailNorm,
      subject: 'Votre programme de formation Claude — finançable jusqu\'à 100% OPCO',
      text: `Bonjour ${firstName},\n\nVoici le programme de formation "Maîtriser Claude en entreprise" :\n${PDF_URL}\n\nCe document de 17 pages détaille le programme complet (3 jours, 21 heures, certifié Qualiopi), les objectifs pédagogiques et les modalités de financement OPCO. Vous pouvez le partager directement avec votre OPCO ou votre service RH pour déposer un dossier de prise en charge.\n\nPour calculer votre reste à charge ou planifier une session intra-entreprise, je suis disponible pour un diagnostic découverte de 15 minutes :\n${DIAGNOSTIC_URL}\n\nCordialement,\n\nFranck Sauvage\nFondateur — L'Agence Sauvage\nhello@lagencesauvage.com`,
      html: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
<div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0">
  <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">Maîtriser Claude en entreprise</h1>
  <p style="color:#C7D2FE;margin:6px 0 0;font-size:14px">Programme de formation — Certifié Qualiopi · Finançable OPCO</p>
</div>
<div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
  <p style="margin:0 0 16px">Bonjour <strong>${firstName}</strong>,</p>
  <p style="margin:0 0 20px;color:#374151">Voici le programme complet de la formation. Ce document de 17 pages détaille les objectifs pédagogiques, les 17 modules répartis sur 3 jours, et les modalités de financement via votre OPCO.</p>

  <a href="${PDF_URL}" style="display:inline-block;background:#4F46E5;color:#fff;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px">Télécharger le programme PDF →</a>

  <div style="background:#F1F5F9;border-radius:8px;padding:20px;margin:28px 0">
    <p style="margin:0 0 10px;font-weight:700;color:#0F172A;font-size:14px">Ce que couvre la formation</p>
    <ul style="margin:0;padding-left:20px;color:#374151;font-size:14px;line-height:1.8">
      <li><strong>Jour 1 — Fondations :</strong> Écosystème Claude, prompting RCFC, Projects, Skills, RGPD</li>
      <li><strong>Jour 2 — Production :</strong> Connecteurs MCP (M365 / Google), Office add-ins, anti-hallucinations</li>
      <li><strong>Jour 3 — Autonomie :</strong> Cowork, Claude in Chrome, chef-d'œuvre sur cas réel</li>
    </ul>
  </div>

  <div style="background:#EEF2FF;border-left:4px solid #4F46E5;padding:16px 20px;margin-bottom:28px;border-radius:0 6px 6px 0">
    <p style="margin:0;font-size:14px;color:#3730A3;font-weight:600">Financement OPCO</p>
    <p style="margin:6px 0 0;font-size:14px;color:#374151">Pour une TPE (moins de 10 salariés), la prise en charge peut atteindre 100%. Pour une PME de 10 à 49 salariés, entre 50 et 80% selon l'OPCO. Le reste à charge peut descendre à zéro.</p>
  </div>

  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0">
  <p style="margin:0 0 8px;color:#374151;font-size:14px">Vous souhaitez calculer votre reste à charge ou planifier une session ?</p>
  <a href="${DIAGNOSTIC_URL}" style="color:#4F46E5;font-size:14px;font-weight:600">Réservez un diagnostic découverte de 15 min →</a>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0">
  <p style="margin:0;font-size:12px;color:#94A3B8">L'Agence Sauvage · Paris · <a href="mailto:hello@lagencesauvage.com" style="color:#94A3B8">hello@lagencesauvage.com</a> · Dispensateur : GHG Formations (certifié Qualiopi)</p>
</div>
</div>`,
    });
    console.log('✅ Email programme envoyé au prospect');
  } catch (err) {
    console.error('⚠️ Email prospect échoué (non bloquant):', err.message);
  }

  // 3. Notification Franck
  try {
    const extra = [
      companyNorm ? `🏢 Entreprise : ${companyNorm}` : null,
      lastName.trim() ? `👤 Nom complet : ${fullName}` : null,
    ].filter(Boolean).join('\n');

    await notifyFounder({
      firstName,
      email: emailNorm,
      source: 'Programme Formation Claude',
      notionUrl,
      extra: extra || undefined,
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
        name: 'Programme Formation Download',
        url: req.headers.referer || LANDING_URL,
        domain: 'lagencesauvage.com',
        props: { source: 'Lead Magnet Formation' },
      }),
    });
  } catch (_) { /* non bloquant */ }

  return res.status(200).json({ success: true });
}
