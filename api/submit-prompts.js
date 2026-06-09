// =============================================================================
// VERCEL SERVERLESS FUNCTION - Lead magnet "50 Prompts IA pour PME"
// =============================================================================
// Capture prénom + email → Notion + email PDF prospect + notification Franck

import { Client } from '@notionhq/client';
import { Resend } from 'resend';
import { notifyFounder } from './_notify.js';
import { findExistingLead } from './_leads.js';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const resend = new Resend(process.env.RESEND_API_KEY);

const PDF_URL = 'https://www.lagencesauvage.com/assets/downloads/50-prompts-pme-agence-sauvage.pdf';
const LANDING_URL = 'https://www.lagencesauvage.com/blog/art-du-prompt/';
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
  let dejaConnu = false;

  // 1. Notion — bloquant (anti-doublon : pas de nouvelle page si le lead existe déjà)
  try {
    if (process.env.NOTION_API_KEY && DATABASE_ID) {
      const existing = await findExistingLead({ email: email.trim().toLowerCase(), source: 'Lead Magnet - 50 Prompts PME' });
      if (existing) {
        dejaConnu = true;
        notionUrl = existing.url;
        console.log('♻️ Lead existant réutilisé:', existing.id);
      }
      const page = dejaConnu ? null : await notion.pages.create({
        parent: { database_id: DATABASE_ID },
        properties: {
          'Name': { title: [{ text: { content: firstName.trim() } }] },
          'Email': { email: email.trim().toLowerCase() },
          'Entreprise': { rich_text: [{ text: { content: '(50 Prompts PME)' } }] },
          'Taille': { select: { name: '1-5' } },
          'Défi': { rich_text: [{ text: { content: 'Téléchargement 50 Prompts IA PME' } }] },
          'Statut': { select: { name: 'Nouveau' } },
          'Source': { select: { name: 'Lead Magnet - 50 Prompts PME' } },
          'Date Soumission': { date: { start: new Date().toISOString().split('T')[0] } },
          'Téléphone': { phone_number: phone.trim() || null },
        },
      });
      if (page) {
        notionUrl = page.url;
        console.log('✅ Notion créé:', page.id);
      }
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
      subject: 'Vos 50 prompts IA pour PME — à copier-coller dans Claude',
      text: `Bonjour ${firstName},\n\nVoici vos 50 prompts (téléchargement direct) :\n${PDF_URL}\n\nCe PDF de 20 pages regroupe 50 prompts construits sur le framework ROCF (Rôle, Objectif, Contexte, Format), répartis en 6 catégories métier : Finance, RH, Commercial, Communication, Direction & Opérations, et GEO/Référencement. Chaque prompt est prêt à copier-coller dans Claude.\n\nSi vous voulez aller plus loin — déployer l'IA dans votre équipe ou automatiser des process métier — je propose un diagnostic découverte de 30 minutes :\n${DIAGNOSTIC_URL}\n\nBonne utilisation,\n\nFranck Sauvage\nFondateur — L'Agence Sauvage\nhello@lagencesauvage.com`,
      html: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
<div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0">
  <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">50 Prompts IA Prêts à l'Emploi pour PME</h1>
  <p style="color:#C7D2FE;margin:6px 0 0;font-size:14px">Framework ROCF · 6 catégories métier · À copier-coller dans Claude</p>
</div>
<div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
  <p style="margin:0 0 16px">Bonjour <strong>${firstName}</strong>,</p>
  <p style="margin:0 0 20px;color:#374151">Voici vos 50 prompts. Ce PDF de 20 pages regroupe des prompts construits sur le framework ROCF, répartis en 6 catégories métier concrètes.</p>

  <a href="${PDF_URL}" style="display:inline-block;background:#4F46E5;color:#fff;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px">Télécharger mes 50 prompts (PDF) →</a>

  <div style="background:#F1F5F9;border-radius:8px;padding:20px;margin:28px 0">
    <p style="margin:0 0 10px;font-weight:700;color:#0F172A;font-size:14px">Ce que contient votre kit</p>
    <ul style="margin:0;padding-left:20px;color:#374151;font-size:14px;line-height:1.8">
      <li><strong>Finance & Comptabilité :</strong> Analyse de trésorerie, prévisions, alertes</li>
      <li><strong>RH & Management :</strong> Entretiens, onboarding, communication interne</li>
      <li><strong>Commercial & Vente :</strong> Emails de prospection, relances, propositions</li>
      <li><strong>Communication :</strong> Posts LinkedIn, articles, réponses clients</li>
      <li><strong>Direction & Opérations :</strong> Réunions, reportings, veille stratégique</li>
      <li><strong>GEO / Référencement IA :</strong> Visibilité dans les moteurs IA</li>
    </ul>
  </div>

  <div style="background:#EEF2FF;border-left:4px solid #4F46E5;padding:16px 20px;margin-bottom:28px;border-radius:0 6px 6px 0">
    <p style="margin:0;font-size:14px;color:#3730A3;font-weight:600">Le framework ROCF</p>
    <p style="margin:6px 0 0;font-size:14px;color:#374151">Chaque prompt est construit avec Rôle + Objectif + Contexte + Format. Copiez, adaptez vos données, obtenez un résultat exploitable en moins d'une minute.</p>
  </div>

  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0">
  <p style="margin:0 0 8px;color:#374151;font-size:14px">Vous souhaitez aller plus loin — déployer l'IA dans votre équipe ou automatiser des process métier ?</p>
  <a href="${DIAGNOSTIC_URL}" style="color:#4F46E5;font-size:14px;font-weight:600">Réservez un diagnostic découverte de 30 min →</a>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0">
  <p style="margin:0;font-size:12px;color:#94A3B8">L'Agence Sauvage · Paris · <a href="mailto:hello@lagencesauvage.com" style="color:#94A3B8">hello@lagencesauvage.com</a></p>
</div>
</div>`,
    });
    console.log('✅ Email 50 prompts envoyé au prospect');
  } catch (err) {
    console.error('⚠️ Email prospect échoué (non bloquant):', err.message);
  }

  // 3. Notification Franck
  try {
    await notifyFounder({
      firstName,
      email,
      source: '50 Prompts IA PME',
      notionUrl,
      extra: [
        phone.trim() ? `📞 Téléphone : ${phone.trim()}` : null,
        dejaConnu ? '♻️ Lead déjà connu (re-téléchargement, pas de doublon Notion)' : null,
      ].filter(Boolean).join('\n') || undefined,
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
        name: '50 Prompts Download',
        url: req.headers.referer || LANDING_URL,
        domain: 'lagencesauvage.com',
        props: { source: 'Lead Magnet 50 Prompts' },
      }),
    });
  } catch (_) { /* non bloquant */ }

  return res.status(200).json({ success: true });
}
