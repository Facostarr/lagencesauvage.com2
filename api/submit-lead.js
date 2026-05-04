// =============================================================================
// VERCEL SERVERLESS FUNCTION - Submit Lead
// =============================================================================
// Formulaire homepage → Notion + email guide prospect + notification Franck

import { Client } from '@notionhq/client';
import { Resend } from 'resend';
import { notifyFounder } from './_notify.js';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée. Utilisez POST.' });
  }

  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.error('❌ Variables Notion manquantes');
    return res.status(500).json({ success: false, message: 'Configuration serveur incomplète. Contactez le support.' });
  }

  const { name, email, phone, company, company_size, challenge, source } = req.body;

  if (!name || !email || !company || !company_size) {
    return res.status(400).json({ success: false, message: 'Tous les champs obligatoires doivent être remplis.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Adresse email invalide.' });
  }

  const validSizes = ['1-5', '6-20', '21-50', '50+'];
  if (!validSizes.includes(company_size)) {
    return res.status(400).json({ success: false, message: "Taille d'entreprise invalide." });
  }

  const leadSource = source || 'Site Web - Homepage';
  let notionPage;

  // 1. Notion — bloquant
  try {
    notionPage = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        'Name': { title: [{ text: { content: name.trim() } }] },
        'Email': { email: email.trim().toLowerCase() },
        'Téléphone': phone?.trim() ? { phone_number: phone.trim() } : { phone_number: null },
        'Entreprise': { rich_text: [{ text: { content: company.trim() } }] },
        'Taille': { select: { name: company_size } },
        'Défi': { rich_text: [{ text: { content: challenge?.trim() || 'Non renseigné' } }] },
        'Statut': { select: { name: 'Nouveau' } },
        'Source': { select: { name: leadSource } },
        'Date Soumission': { date: { start: new Date().toISOString().split('T')[0] } },
      },
    });
    console.log('✅ Lead créé dans Notion:', notionPage.id);
  } catch (error) {
    console.error('❌ Erreur Notion:', error);
    if (error.code === 'object_not_found') {
      return res.status(500).json({ success: false, message: 'Base de données Notion introuvable.' });
    }
    if (error.code === 'unauthorized') {
      return res.status(500).json({ success: false, message: "Problème d'authentification Notion." });
    }
    return res.status(500).json({ success: false, message: 'Une erreur est survenue. Veuillez réessayer.' });
  }

  // 2. Email guide PDF au prospect — indépendant
  if (leadSource.includes('Landing Page') || leadSource.includes('Audit IA')) {
    try {
      await sendGuideToProspect(email, name);
      console.log('✅ Guide PDF envoyé au prospect');
    } catch (err) {
      console.error('⚠️ Envoi guide échoué (non bloquant):', err.message);
    }
  }

  // 3. Notification Franck — indépendante
  try {
    const firstName = name.split(' ')[0];
    await notifyFounder({
      firstName,
      email,
      source: leadSource,
      notionUrl: notionPage.url,
      extra: `🏢 ${company} (${company_size}) · 💡 ${challenge || 'Non renseigné'}`,
    });
  } catch (err) {
    console.error('⚠️ notifyFounder échoué (non bloquant):', err.message);
  }

  // 4. Plausible — non bloquant
  try {
    await trackPlausibleEvent(req, 'Lead', { source: leadSource });
    console.log('✅ Event Plausible envoyé');
  } catch (err) {
    console.warn('⚠️ Plausible échoué (non bloquant):', err.message);
  }

  return res.status(200).json({ success: true, message: 'Lead enregistré avec succès', notionPageId: notionPage.id });
}

async function sendGuideToProspect(email, name) {
  const firstName = name.split(' ')[0];
  const pdfUrl = 'https://www.lagencesauvage.com/assets/documents/Livre_Blanc_IA_Cabinets_Comptables_2025.pdf';

  await resend.emails.send({
    from: "L'Agence Sauvage <hello@lagencesauvage.com>",
    to: email,
    subject: 'Votre Guide IA pour Cabinets Comptables',
    text: `Bonjour ${firstName},\n\nMerci pour votre confiance ! Voici votre guide exclusif :\n${pdfUrl}\n\nNous vous recontactons sous 48h pour planifier votre audit IA gratuit de 30 minutes.\n\nFranck Sauvage\nL'Agence Sauvage\nhello@lagencesauvage.com`,
    html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f2ede1">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f2ede1">
    <tr><td align="center" style="padding:40px 20px">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(34,79,60,0.1)">
        <tr><td style="background:linear-gradient(135deg,#224f3c 0%,#1a3d2e 100%);padding:30px 40px;text-align:center">
          <h1 style="color:#f2ede1;margin:0;font-size:28px;font-weight:700">Votre Guide est prêt !</h1>
        </td></tr>
        <tr><td style="padding:40px">
          <p style="font-size:18px;color:#224f3c;margin:0 0 20px">Bonjour <strong>${firstName}</strong>,</p>
          <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 25px">Merci pour votre confiance ! Comme promis, voici votre guide exclusif pour préparer la période fiscale 2026 avec l'IA.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr><td align="center">
              <a href="${pdfUrl}" style="display:inline-block;background-color:#c96839;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:8px;font-size:16px;font-weight:600">Télécharger mon Guide PDF</a>
            </td></tr>
          </table>
          <p style="font-size:12px;color:#888;text-align:center;margin-top:15px">Si le bouton ne fonctionne pas : <a href="${pdfUrl}" style="color:#224f3c;word-break:break-all">${pdfUrl}</a></p>
          <div style="margin-top:35px;padding-top:25px;border-top:2px solid #f2ede1">
            <h3 style="color:#224f3c;margin:0 0 15px;font-size:16px">Et maintenant ?</h3>
            <p style="font-size:15px;color:#333;line-height:1.6;margin:0">Nous vous recontactons <strong>sous 48h</strong> pour planifier votre audit IA gratuit de 30 minutes.</p>
          </div>
        </td></tr>
        <tr><td style="background-color:#224f3c;padding:25px 40px;text-align:center">
          <p style="color:#f2ede1;margin:0 0 10px;font-size:14px;font-weight:600">L'Agence Sauvage</p>
          <p style="margin:0"><a href="mailto:hello@lagencesauvage.com" style="color:#c96839;text-decoration:none;font-size:13px">hello@lagencesauvage.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

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
    headers: { 'Content-Type': 'application/json', 'User-Agent': userAgent, 'X-Forwarded-For': ip },
    body: JSON.stringify({ name: eventName, url: pageUrl, domain, props }),
  });
}
