// =============================================================================
// VERCEL SERVERLESS FUNCTION - Submit Lead to Notion + Email (v2 - Nodemailer)
// =============================================================================
// Fichier : /api/submit-lead.js
// 
// Cette fonction gère :
// 1. La validation des données du formulaire
// 2. L'envoi vers Notion (base de données Leads)
// 3. L'envoi du Guide PDF au prospect (nouveau)
// 4. L'envoi d'un email de notification à Franck
// 5. La gestion des erreurs
// =============================================================================

import { Client } from '@notionhq/client';
import nodemailer from 'nodemailer';

/**
 * Configuration Notion
 */
const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

/**
 * Configuration Nodemailer SMTP
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true pour 465, false pour autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Handler principal de la fonction Vercel
 */
export default async function handler(req, res) {
  // =============================================================================
  // 1. CORS Headers
  // =============================================================================
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // =============================================================================
  // 2. Vérifier la méthode HTTP
  // =============================================================================
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée. Utilisez POST.'
    });
  }
  
  // =============================================================================
  // 3. Valider les variables d'environnement
  // =============================================================================
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.error('❌ Variables Notion manquantes');
    return res.status(500).json({
      success: false,
      message: 'Configuration serveur incomplète. Contactez le support.'
    });
  }
  
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('⚠️ Variables SMTP manquantes - emails désactivés');
  }
  
  // =============================================================================
  // 4. Extraire et valider les données
  // =============================================================================
  const { name, email, phone, company, company_size, challenge, source } = req.body;
  
  // Validation des champs obligatoires
  if (!name || !email || !company || !company_size) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs obligatoires doivent être remplis.'
    });
  }
  
  // Validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Adresse email invalide.'
    });
  }
  
  // Validation taille entreprise
  const validSizes = ['1-5', '6-20', '21-50', '50+'];
  if (!validSizes.includes(company_size)) {
    return res.status(400).json({
      success: false,
      message: 'Taille d\'entreprise invalide.'
    });
  }
  
  // Source dynamique avec fallback
  const leadSource = source || 'Site Web - Homepage';
  
  try {
    // =============================================================================
    // 5. Créer l'entrée dans Notion
    // =============================================================================
    const notionPage = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID
      },
      properties: {
        'Name': {
          title: [{ text: { content: name.trim() } }]
        },
        'Email': {
          email: email.trim().toLowerCase()
        },
        'Téléphone': phone && phone.trim() !== '' 
          ? { phone_number: phone.trim() }
          : { phone_number: null },
        'Entreprise': {
          rich_text: [{ text: { content: company.trim() } }]
        },
        'Taille': {
          select: { name: company_size }
        },
        'Défi': {
          rich_text: [{
            text: {
              content: challenge && challenge.trim() !== '' 
                ? challenge.trim() 
                : 'Non renseigné'
            }
          }]
        },
        'Statut': {
          select: { name: 'Nouveau' }
        },
        'Source': {
          select: { name: leadSource }
        },
        'Date Soumission': {
          date: { start: new Date().toISOString().split('T')[0] }
        }
      }
    });
    
    console.log('✅ Lead créé dans Notion:', notionPage.id);
    
    // =============================================================================
    // 6. Envoyer le Guide PDF au prospect (si source landing page)
    // =============================================================================
    if (leadSource.includes('Landing Page') || leadSource.includes('Audit IA')) {
      try {
        await sendGuideToProspect(email, name);
        console.log('✅ Guide PDF envoyé au prospect');
      } catch (guideError) {
        console.error('⚠️ Erreur envoi guide (non bloquant):', guideError.message);
      }
    }
    
    // =============================================================================
    // 7. Envoyer email de notification à Franck
    // =============================================================================
    try {
      await sendEmailNotification({
        name,
        email,
        phone: phone || 'Non renseigné',
        company,
        company_size,
        challenge: challenge || 'Non renseigné',
        source: leadSource,
        notionUrl: notionPage.url
      });
      console.log('✅ Email de notification envoyé');
    } catch (emailError) {
      console.error('⚠️ Erreur envoi notification (non bloquant):', emailError.message);
    }
    
    // =============================================================================
    // 8. Tracking Plausible server-side (adblocker-proof)
    // =============================================================================
    try {
      await trackPlausibleEvent(req, 'Lead', { source: leadSource });
      console.log('✅ Event Plausible envoyé');
    } catch (plausibleError) {
      console.warn('⚠️ Erreur Plausible (non bloquant):', plausibleError.message);
    }

    // =============================================================================
    // 9. Réponse succès
    // =============================================================================
    return res.status(200).json({
      success: true,
      message: 'Lead enregistré avec succès',
      notionPageId: notionPage.id
    });
    
  } catch (error) {
    // =============================================================================
    // 9. Gestion des erreurs
    // =============================================================================
    console.error('❌ Erreur lors de la soumission:', error);
    
    if (error.code === 'validation_error') {
      return res.status(400).json({
        success: false,
        message: 'Format de données invalide pour Notion',
        details: error.message
      });
    }
    
    if (error.code === 'object_not_found') {
      return res.status(500).json({
        success: false,
        message: 'Base de données Notion introuvable. Contactez le support.'
      });
    }
    
    if (error.code === 'unauthorized') {
      return res.status(500).json({
        success: false,
        message: 'Problème d\'authentification Notion. Contactez le support.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.'
    });
  }
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

// =============================================================================
// FONCTION : Envoi du Guide PDF au prospect
// =============================================================================
async function sendGuideToProspect(email, name) {
  // Extraire le prénom
  const firstName = name.split(' ')[0];
  
  // URL correcte du PDF
  const pdfUrl = 'https://www.lagencesauvage.com/assets/documents/Livre_Blanc_IA_Cabinets_Comptables_2025.pdf';
  
  // Version texte simple (pour compatibilité Microsoft/Outlook)
  const textContent = `Bonjour ${firstName},

Merci pour votre confiance ! Voici votre guide exclusif pour préparer la période fiscale 2026 avec l'IA.

📥 TÉLÉCHARGER VOTRE GUIDE :
${pdfUrl}

Ce guide de 10 pages contient :
- Les cas concrets de cabinets français qui ont franchi le pas
- Les gains de temps documentés (40-60% sur certaines tâches)
- La méthode progressive pour démarrer sans bouleverser votre organisation

ET MAINTENANT ?
Nous vous recontactons sous 48h pour planifier votre audit IA gratuit de 30 minutes.
Vous repartirez avec un diagnostic personnalisé et 3 quick wins applicables immédiatement.

À très bientôt,

Franck Sauvage
L'Agence Sauvage — L'IA au coût d'un stagiaire

hello@lagencesauvage.com
01 85 09 75 92
www.lagencesauvage.com

---
Vous recevez cet email car vous avez demandé un audit IA gratuit sur notre site.
`;

  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre Guide IA pour Cabinets Comptables 2026</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2ede1;">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f2ede1;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(34, 79, 60, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #224f3c 0%, #1a3d2e 100%); padding: 30px 40px; text-align: center;">
              <h1 style="color: #f2ede1; margin: 0; font-size: 28px; font-weight: 700;">
                Votre Guide est prêt !
              </h1>
            </td>
          </tr>
          
          <!-- Corps -->
          <tr>
            <td style="padding: 40px;">
              
              <p style="font-size: 18px; color: #224f3c; margin: 0 0 20px 0;">
                Bonjour <strong>${firstName}</strong>,
              </p>
              
              <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 25px 0;">
                Merci pour votre confiance ! Comme promis, voici votre guide exclusif pour préparer la période fiscale 2026 avec l'IA.
              </p>
              
              <!-- Encart Guide -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f2ede1; border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="color: #224f3c; margin: 0 0 8px 0; font-size: 18px;">
                      L'IA pour les Cabinets Comptables 2026
                    </h2>
                    <p style="color: #666; margin: 0; font-size: 14px;">
                      30 pages de conseils pratiques - Cas concrets - ROI documenté
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${pdfUrl}" 
                       style="display: inline-block; background-color: #c96839; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Télécharger mon Guide PDF
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Lien texte de secours -->
              <p style="font-size: 12px; color: #888; text-align: center; margin-top: 15px;">
                Si le bouton ne fonctionne pas, copiez ce lien :<br>
                <a href="${pdfUrl}" style="color: #224f3c; word-break: break-all;">${pdfUrl}</a>
              </p>
              
              <!-- Prochaines étapes -->
              <div style="margin-top: 35px; padding-top: 25px; border-top: 2px solid #f2ede1;">
                <h3 style="color: #224f3c; margin: 0 0 15px 0; font-size: 16px;">
                  Et maintenant ?
                </h3>
                <p style="font-size: 15px; color: #333; line-height: 1.6; margin: 0;">
                  Nous vous recontactons <strong>sous 48h</strong> pour planifier votre audit IA gratuit de 30 minutes. 
                  Vous repartirez avec un diagnostic personnalisé et 3 quick wins applicables immédiatement.
                </p>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #224f3c; padding: 25px 40px; text-align: center;">
              <p style="color: #f2ede1; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
                L'Agence Sauvage — L'IA au coût d'un stagiaire
              </p>
              <p style="margin: 0;">
                <a href="mailto:hello@lagencesauvage.com" style="color: #c96839; text-decoration: none; font-size: 13px;">hello@lagencesauvage.com</a>
                <span style="color: #f2ede1; opacity: 0.5;"> - </span>
                <a href="tel:+33185097592" style="color: #c96839; text-decoration: none; font-size: 13px;">01 85 09 75 92</a>
              </p>
              <p style="color: #f2ede1; opacity: 0.6; margin: 15px 0 0 0; font-size: 12px;">
                <a href="https://www.lagencesauvage.com" style="color: #f2ede1; text-decoration: none;">www.lagencesauvage.com</a>
              </p>
            </td>
          </tr>
          
        </table>
        
        <!-- Mention légale -->
        <p style="color: #8c8982; font-size: 11px; margin-top: 20px; text-align: center;">
          Vous recevez cet email car vous avez demandé un audit IA gratuit sur notre site.<br>
          L'Agence Sauvage. Tous droits réservés.
        </p>
        
      </td>
    </tr>
  </table>
  
</body>
</html>`;

  await transporter.sendMail({
    from: '"L\'Agence Sauvage" <hello@monagencesauvage.com>',
    to: email,
    subject: 'Votre Guide IA pour Cabinets Comptables',
    text: textContent,
    html: htmlContent
  });
}

// =============================================================================
// FONCTION : Envoi d'email de notification à Franck
// =============================================================================
async function sendEmailNotification(leadData) {
  const {
    name,
    email,
    phone,
    company,
    company_size,
    challenge,
    source,
    notionUrl
  } = leadData;
  
  // Vérifier que SMTP est configuré
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('⚠️ SMTP non configuré - notification non envoyée');
    return;
  }
  
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'franck@lagencesauvage.com';
  
  const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #224f3c;">🎯 Nouveau lead reçu !</h2>
  
  <div style="background: #f2ede1; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>👤 Nom :</strong> ${name}</p>
    <p><strong>📧 Email :</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>📞 Téléphone :</strong> ${phone}</p>
    <p><strong>🏢 Entreprise :</strong> ${company}</p>
    <p><strong>👥 Taille :</strong> ${company_size} employés</p>
    <p><strong>💡 Défi principal :</strong> ${challenge}</p>
  </div>
  
  <a href="${notionUrl}" 
     style="display: inline-block; background: #224f3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
    🔗 Voir dans Notion
  </a>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
  
  <p style="color: #8c8982; font-size: 14px;">
    L'Agence Sauvage - Notifications automatiques<br>
    Lead capturé depuis : <strong>${source}</strong>
  </p>
</div>
  `;

  await transporter.sendMail({
    from: '"L\'Agence Sauvage - Notifications" <hello@monagencesauvage.com>',
    to: notificationEmail,
    subject: `🎯 Nouveau lead : ${name} (${company})`,
    text: `
Nouveau lead reçu depuis le site web !

👤 Nom : ${name}
📧 Email : ${email}
📞 Téléphone : ${phone}
🏢 Entreprise : ${company}
👥 Taille : ${company_size} employés
💡 Défi : ${challenge}

🔗 Voir dans Notion : ${notionUrl}

---
Source : ${source}
L'Agence Sauvage - Notifications automatiques
    `,
    html: htmlContent
  });
}
