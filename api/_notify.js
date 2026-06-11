// =============================================================================
// Utilitaire partagé — Notification Franck (double canal)
// Importé par tous les endpoints api/submit-*.js
// =============================================================================
// Canaux : Resend (email) + Telegram (push mobile)
// Pattern Promise.allSettled : un canal KO n'annule pas l'autre

import { Resend } from 'resend';

// Init paresseuse : new Resend() jette si la clé est absente — instancier à
// l'import casserait tout endpoint qui importe ce module (et les tests unitaires)
// dès que RESEND_API_KEY manque, avant même la validation de la requête.
let _resend = null;
const getResend = () => (_resend ??= new Resend(process.env.RESEND_API_KEY));

/**
 * Notifie Franck via email (Resend) + Telegram en parallèle.
 * Ne bloque jamais la réponse HTTP — à appeler dans son propre try/catch.
 *
 * @param {Object} lead
 * @param {string} lead.firstName
 * @param {string} lead.email
 * @param {string} lead.source       - Label humain ex: "Kit Claude Cowork", "Formulaire homepage"
 * @param {string} [lead.notionUrl]
 * @param {string} [lead.extra]      - Infos supplémentaires (entreprise, défi, etc.)
 * @param {Array}  [lead.attachments] - Pièces jointes Resend [{filename, content, contentType}]
 */
export async function notifyFounder({ firstName, email, source, notionUrl, extra, attachments }) {
  const subject = `📥 Nouveau lead — ${firstName} (${source})`;
  const lines = [
    `👤 ${firstName}`,
    `📧 ${email}`,
    `📌 Source : ${source}`,
  ];
  if (extra) lines.push(extra);
  if (notionUrl) lines.push(`🔗 Notion : ${notionUrl}`);
  const text = lines.join('\n');

  const results = await Promise.allSettled([
    sendEmail(subject, text, attachments),
    sendTelegram(text),
  ]);

  results.forEach((r, i) => {
    const label = i === 0 ? 'Email' : 'Telegram';
    if (r.status === 'rejected') {
      console.error(`❌ Notification ${label} échouée :`, r.reason?.message || r.reason);
    } else {
      console.log(`✅ Notification ${label} envoyée`);
    }
  });

  if (results.every(r => r.status === 'rejected')) {
    console.error('🚨 CRITIQUE : aucune notification envoyée pour ce lead', { firstName, email, source });
  }
}

async function sendEmail(subject, text, attachments) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY manquante');
  }
  const to = process.env.NOTIFICATION_EMAIL || 'beforbiz@gmail.com';
  const payload = {
    from: "L'Agence Sauvage <hello@lagencesauvage.com>",
    to,
    subject,
    text,
  };
  if (attachments?.length) payload.attachments = attachments;
  const { error } = await getResend().emails.send(payload);
  if (error) throw new Error(`Resend error: ${error.message}`);
}

async function sendTelegram(text) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    throw new Error('Telegram non configuré (TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID manquant)');
  }
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'Markdown',
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram HTTP ${res.status}: ${body}`);
  }
}
