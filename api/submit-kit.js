// =============================================================================
// VERCEL SERVERLESS FUNCTION - Lead magnet "Kit Claude Cowork PME"
// =============================================================================
// Capture prénom + email → Notion + notification Franck + lien kit par email

import { Client } from '@notionhq/client';
import nodemailer from 'nodemailer';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ success: false, message: 'Prénom et email requis.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Email invalide.' });
  }

  try {
    // Créer entrée Notion
    if (process.env.NOTION_API_KEY && DATABASE_ID) {
      await notion.pages.create({
        parent: { database_id: DATABASE_ID },
        properties: {
          'Name': { title: [{ text: { content: firstName.trim() } }] },
          'Email': { email: email.trim().toLowerCase() },
          'Entreprise': { rich_text: [{ text: { content: '(Kit Claude Cowork)' } }] },
          'Taille': { select: { name: '1-5' } },
          'Défi': { rich_text: [{ text: { content: 'Téléchargement Kit Claude Cowork PME' } }] },
          'Statut': { select: { name: 'Nouveau' } },
          'Source': { select: { name: 'Lead Magnet - Kit Claude Cowork' } },
          'Date Soumission': { date: { start: new Date().toISOString().split('T')[0] } }
        }
      });
    }

    // Envoyer le kit au prospect
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const kitUrl = 'https://www.lagencesauvage.com/ressources/kit-claude-cowork-pme/';

      await transporter.sendMail({
        from: '"L\'Agence Sauvage" <hello@lagencesauvage.com>',
        to: email.trim().toLowerCase(),
        subject: 'Votre kit — 10 prompts Claude pour PME',
        text: `Bonjour ${firstName},\n\nVoici votre kit : ${kitUrl}\n\nVous pouvez l'imprimer ou le sauvegarder en PDF depuis votre navigateur (Ctrl+P → Enregistrer en PDF).\n\nSi vous avez des questions sur l'automatisation IA dans votre entreprise, je suis disponible pour un diagnostic découverte de 15 minutes : https://www.lagencesauvage.com/#audit-form\n\nBonne utilisation,\n\nFranck Sauvage\nL'Agence Sauvage\nhello@lagencesauvage.com`,
        html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
<div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0">
  <h1 style="color:#fff;margin:0;font-size:20px">10 prompts Claude pour PME</h1>
  <p style="color:#C7D2FE;margin:4px 0 0;font-size:14px">Copiez, collez, récupérez votre temps</p>
</div>
<div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
  <p style="margin:0 0 16px">Bonjour <strong>${firstName}</strong>,</p>
  <p style="margin:0 0 24px;color:#374151">Votre kit est prêt. Cliquez ci-dessous pour y accéder, puis utilisez Ctrl+P → "Enregistrer en PDF" pour le conserver.</p>
  <a href="${kitUrl}" style="display:inline-block;background:#4F46E5;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px">Accéder à mon kit →</a>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:32px 0">
  <p style="margin:0 0 8px;color:#374151;font-size:14px">Ce kit vous a donné des idées pour votre entreprise ?</p>
  <p style="margin:0;font-size:14px"><a href="https://www.lagencesauvage.com/#audit-form" style="color:#4F46E5">Réservez un diagnostic découverte de 15 min →</a></p>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:32px 0">
  <p style="margin:0;font-size:12px;color:#94A3B8">L'Agence Sauvage · Paris · <a href="mailto:hello@lagencesauvage.com" style="color:#94A3B8">hello@lagencesauvage.com</a></p>
</div>
</div>`
      });

      // Notification Franck
      const notifEmail = process.env.NOTIFICATION_EMAIL || 'beforbiz@gmail.com';
      await transporter.sendMail({
        from: '"L\'Agence Sauvage - Notifs" <hello@lagencesauvage.com>',
        to: notifEmail,
        subject: `📥 Nouveau téléchargement kit : ${firstName} (${email})`,
        text: `${firstName} vient de télécharger le Kit Claude Cowork PME.\n\nEmail : ${email}\nSource : Lead Magnet - Kit Claude Cowork`
      });
    }

    // Tracking Plausible
    try {
      await fetch('https://plausible.io/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
          'X-Forwarded-For': req.headers['x-forwarded-for']?.split(',')[0]?.trim() || '127.0.0.1'
        },
        body: JSON.stringify({
          name: 'Kit Download',
          url: req.headers.referer || 'https://www.lagencesauvage.com/ressources/kit-claude-cowork-pme/',
          domain: 'lagencesauvage.com',
          props: { source: 'Kit Claude Cowork' }
        })
      });
    } catch (_) { /* non bloquant */ }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('❌ submit-kit error:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur. Réessayez.' });
  }
}
