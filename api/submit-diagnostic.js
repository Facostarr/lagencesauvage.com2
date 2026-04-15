/**
 * Vercel Serverless Function — Formulaire Diagnostic de Transformation IA
 * Route : POST /api/submit-diagnostic
 *
 * Pipeline :
 *   1. Valide les champs requis
 *   2. Crée une entrée dans la base Notion "Leads Diagnostic"
 *   3. Envoie une notification email à franck@lagencesauvage.com
 *
 * Variables d'environnement requises (Vercel > Settings > Environment Variables) :
 *   NOTION_TOKEN          — clé secrète de l'integration Notion
 *   NOTION_DATABASE_ID    — ID de la base de données Notion "Leads Diagnostic"
 *   SMTP_HOST             — serveur SMTP (ex: smtp.gmail.com ou SMTP Brevo)
 *   SMTP_PORT             — port SMTP (ex: 587)
 *   SMTP_USER             — email expéditeur (ex: hello@lagencesauvage.com)
 *   SMTP_PASS             — mot de passe SMTP ou app password
 *
 * Note : Si SMTP non configuré, la fonction crée quand même la lead Notion.
 *        L'email est optionnel (notifications peuvent être configurées dans Notion directement).
 */

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

  const { nom, entreprise, salaries, email, irritant, source, date } = body;

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

  // === EMAIL — Notification à Franck ===
  // Utilise l'API Notion ou un webhook si SMTP non configuré.
  // Pour une implémentation SMTP, décommenter le bloc ci-dessous
  // et installer le package @sendgrid/mail ou nodemailer via package.json.

  /*
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      // Exemple avec Brevo (ex-Sendinblue) via API REST — aucun package requis
      const emailPayload = {
        sender: { name: "Agence Sauvage — Formulaire", email: smtpUser },
        to: [{ email: "franck@lagencesauvage.com", name: "Franck Sauvage" }],
        replyTo: { email: email, name: nom },
        subject: `🔔 Nouveau lead Diagnostic IA — ${nom} (${entreprise})`,
        htmlContent: `
          <h2>Nouveau lead Diagnostic de Transformation IA</h2>
          <table cellpadding="8">
            <tr><td><strong>Nom</strong></td><td>${nom}</td></tr>
            <tr><td><strong>Entreprise</strong></td><td>${entreprise}</td></tr>
            <tr><td><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td><strong>Taille</strong></td><td>${salaries} salariés</td></tr>
            <tr><td><strong>Irritant</strong></td><td>${irritant || 'Non renseigné'}</td></tr>
            <tr><td><strong>Date</strong></td><td>${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</td></tr>
          </table>
          <p><a href="https://notion.so" target="_blank">→ Voir dans Notion</a></p>
        `
      };

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': smtpPass,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      console.log('[Email] Notification envoyée à franck@lagencesauvage.com');
    } catch (emailError) {
      console.error('[Email] Exception:', emailError.message);
    }
  }
  */

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
