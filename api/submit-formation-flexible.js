// =============================================================================
// VERCEL SERVERLESS FUNCTION - Submit Formation Questionnaire (FLEXIBLE)
// =============================================================================
// Fichier : /api/submit-formation-flexible.js
// 
// Cette version FLEXIBLE gère :
// 1. ✅ Génération PDF DYNAMIQUE (s'adapte aux champs reçus)
// 2. ✅ Rétrocompatible avec smartcompta.html
// 3. ✅ Compatible avec GalaxyConseil.html (34 questions)
// 4. ✅ Futurs formulaires = aucune modification API nécessaire
// 5. ✅ Sauvegarde Notion avec données JSON complètes
// 6. ✅ Emails avec PDF personnalisé
// =============================================================================

import { Client } from '@notionhq/client';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

/**
 * Configuration Notion
 */
const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

// Database ID pour les réponses formations
const FORMATION_DATABASE_ID = '821a8750ebfa40d4b1f0b7db3990f82c';

/**
 * Configuration Nodemailer SMTP
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Détecte la structure du formulaire et organise les champs par sections
 */
function organizeDataBySections(data) {
  const sections = [];
  
  // Champs système (à exclure du PDF)
  const systemFields = ['societe', 'formation', 'source'];
  
  // Champs identité (toujours en premier)
  const identityFields = ['nom', 'prenom', 'fonction', 'email'];
  const identityData = {};
  identityFields.forEach(field => {
    if (data[field]) identityData[field] = data[field];
  });
  if (Object.keys(identityData).length > 0) {
    sections.push({
      title: 'Informations personnelles',
      items: formatSectionItems(identityData)
    });
  }
  
  // Détection automatique des autres sections selon les préfixes
  const remainingData = {};
  Object.keys(data).forEach(key => {
    if (!systemFields.includes(key) && !identityFields.includes(key)) {
      remainingData[key] = data[key];
    }
  });
  
  // Grouper par préfixe (q1_, q2_, etc.)
  const grouped = {};
  Object.keys(remainingData).forEach(key => {
    const match = key.match(/^q(\d+)_/);
    if (match) {
      const groupNum = parseInt(match[1]);
      if (!grouped[groupNum]) grouped[groupNum] = {};
      grouped[groupNum][key] = remainingData[key];
    } else {
      // Champs sans préfixe → section générique
      if (!grouped['other']) grouped['other'] = {};
      grouped['other'][key] = remainingData[key];
    }
  });
  
  // Convertir les groupes en sections
  Object.keys(grouped).sort((a, b) => {
    if (a === 'other') return 1;
    if (b === 'other') return -1;
    return parseInt(a) - parseInt(b);
  }).forEach(groupKey => {
    const groupData = grouped[groupKey];
    const sectionTitle = groupKey === 'other' 
      ? 'Informations complémentaires'
      : `Section ${groupKey}`;
    
    sections.push({
      title: sectionTitle,
      items: formatSectionItems(groupData)
    });
  });
  
  return sections;
}

/**
 * Formate les items d'une section pour affichage PDF
 */
function formatSectionItems(data) {
  return Object.entries(data).map(([key, value]) => {
    // Génération du label lisible depuis le nom du champ
    let label = key
      .replace(/^q\d+_/, '') // Retirer préfixe q1_, q2_, etc.
      .replace(/_/g, ' ')     // Remplacer _ par espaces
      .replace(/\b\w/g, c => c.toUpperCase()); // Première lettre en majuscule
    
    // Formatage de la valeur
    let displayValue = 'Non renseigné';
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        displayValue = value.length > 0 ? value.join(', ') : 'Aucun';
      } else {
        displayValue = String(value);
      }
    }
    
    return { label, value: displayValue };
  });
}

/**
 * Génère un PDF récapitulatif FLEXIBLE des réponses
 */
async function generateFlexiblePDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `Questionnaire Formation - ${data.prenom} ${data.nom}`,
          Author: "L'Agence Sauvage"
        }
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Couleurs L'Agence Sauvage
      const forestGreen = '#224f3c';
      const burntOrange = '#c96839';
      
      // Header
      doc.rect(0, 0, doc.page.width, 120).fill(forestGreen);
      doc.fontSize(28).fillColor('#ffffff').text("L'Agence Sauvage", 50, 40);
      doc.fontSize(14).fillColor(burntOrange).text('Questionnaire de positionnement - Formation IA', 50, 75);
      doc.fontSize(10).fillColor('#ffffff').text(
        `${data.societe || 'Formation'} - ${data.formation || 'Formation professionnelle'}`, 
        50, 95
      );
      
      let y = 140;
      
      // Fonction helper pour ajouter une section
      const addSection = (title, items) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
        
        doc.fontSize(14).fillColor(forestGreen).text(title, 50, y);
        doc.moveTo(50, y + 18).lineTo(250, y + 18).strokeColor(burntOrange).lineWidth(2).stroke();
        y += 30;
        
        items.forEach(item => {
          if (y > 750) {
            doc.addPage();
            y = 50;
          }
          
          doc.fontSize(10).fillColor('#666666').text(item.label + ' :', 50, y);
          
          // Gestion des textes longs (wrap)
          const valueWidth = 350;
          const valueHeight = doc.heightOfString(item.value || 'Non renseigné', { width: valueWidth });
          
          doc.fontSize(10).fillColor('#333333').text(
            item.value || 'Non renseigné', 
            200, 
            y, 
            { width: valueWidth }
          );
          
          y += Math.max(20, valueHeight + 5);
        });
        y += 15;
      };
      
      // Organiser les données par sections
      const sections = organizeDataBySections(data);
      
      // Ajouter toutes les sections au PDF
      sections.forEach(section => {
        addSection(section.title, section.items);
      });
      
      // Footer
      doc.fontSize(8).fillColor('#999999')
        .text(
          "L'Agence Sauvage | hello@lagencesauvage.com | www.lagencesauvage.com",
          50, doc.page.height - 30,
          { align: 'center', width: doc.page.width - 100 }
        );
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Envoie le PDF au répondant
 */
async function sendPDFToRespondent(email, prenom, pdfBuffer, societe) {
  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Votre questionnaire de positionnement</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2ede1;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f2ede1;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(34, 79, 60, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #224f3c 0%, #1a3d2e 100%); padding: 30px 40px; text-align: center;">
              <h1 style="color: #f2ede1; margin: 0; font-size: 24px;">Merci ${prenom} !</h1>
              <p style="color: #c96839; margin: 10px 0 0 0; font-size: 16px;">Questionnaire reçu avec succès</p>
            </td>
          </tr>
          
          <!-- Corps -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 20px 0;">
                Nous avons bien reçu vos réponses au questionnaire de positionnement${societe ? ` pour <strong>${societe}</strong>` : ''}.
              </p>
              
              <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 20px 0;">
                Vous trouverez en pièce jointe un <strong>récapitulatif PDF</strong> de vos réponses.
              </p>
              
              <div style="background-color: #f2ede1; padding: 20px; border-radius: 12px; margin: 25px 0;">
                <p style="margin: 0; color: #224f3c; font-size: 15px;">
                  <strong>Prochaine étape :</strong> Notre formateur analysera vos réponses pour personnaliser le contenu de la formation selon votre profil et vos objectifs.
                </p>
              </div>
              
              <p style="font-size: 15px; color: #666; margin: 0;">
                À très bientôt pour la formation !
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #224f3c; padding: 25px 40px; text-align: center;">
              <p style="color: #f2ede1; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
                L'Agence Sauvage - L'IA au coût d'un stagiaire
              </p>
              <p style="margin: 0;">
                <a href="mailto:hello@lagencesauvage.com" style="color: #c96839; text-decoration: none; font-size: 13px;">hello@lagencesauvage.com</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: '"L\'Agence Sauvage" <hello@monagencesauvage.com>',
    to: email,
    subject: `Questionnaire formation reçu - ${societe || 'L\'Agence Sauvage'}`,
    html: htmlContent,
    attachments: [{
      filename: `Questionnaire_Formation_${prenom}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }]
  });
}

/**
 * Envoie une notification à Franck (avec PDF en pièce jointe)
 */
async function sendNotificationToFranck(data, notionUrl, pdfBuffer) {
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'franck@lagencesauvage.com';
  
  // Extraction des infos clés pour la notification
  const keyInfo = [];
  
  // Chercher les infos principales (niveau, fréquence, etc.)
  Object.keys(data).forEach(key => {
    if (key.includes('niveau') || key.includes('frequence')) {
      keyInfo.push(`<p><strong>${key}:</strong> ${data[key]}</p>`);
    }
  });
  
  const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #224f3c;">Nouveau questionnaire formation reçu !</h2>
  
  <div style="background: #f2ede1; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Participant :</strong> ${data.prenom} ${data.nom}</p>
    <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
    <p><strong>Fonction :</strong> ${data.fonction || 'Non renseigné'}</p>
    <p><strong>Société :</strong> ${data.societe || 'Non renseigné'}</p>
    <p><strong>Formation :</strong> ${data.formation || 'Non renseigné'}</p>
    ${keyInfo.join('\n')}
  </div>
  
  <a href="${notionUrl}" 
     style="display: inline-block; background: #c96839; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
    Voir dans Notion
  </a>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
  
  <p style="color: #8c8982; font-size: 14px;">
    L'Agence Sauvage - Notifications automatiques<br>
    Questionnaire reçu depuis : <strong>${data.source || 'Formulaire Formation'}</strong>
  </p>
</div>`;

  await transporter.sendMail({
    from: '"L\'Agence Sauvage - Formations" <hello@monagencesauvage.com>',
    to: notificationEmail,
    subject: `Questionnaire formation : ${data.prenom} ${data.nom} (${data.societe || 'N/A'})`,
    html: htmlContent,
    attachments: [{
      filename: `Questionnaire_Formation_${data.prenom}_${data.nom}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }]
  });
}

/**
 * Sauvegarde FLEXIBLE dans Notion
 */
async function saveToNotion(data) {
  // Valeurs valides pour les selects Notion
  const validSocietes = ['Smartcompta', 'Galaxy Conseil', 'Autre'];
  const validFormations = ['IA pour experts-comptables', 'Maîtriser n8n & Claude : De l\'idée au workflow en production', 'Claude + N8N', 'Autre'];
  
  // Helper pour valider une valeur select
  const getValidSelect = (value, validOptions) => {
    if (!value) return null;
    return validOptions.includes(value) ? { name: value } : { name: 'Autre' };
  };

  // Construction des propriétés Notion
  const properties = {
    'Participant': {
      title: [{ text: { content: `${data.prenom} ${data.nom}`.trim() } }]
    },
    'Prénom': {
      rich_text: [{ text: { content: data.prenom || '' } }]
    },
    'Email': {
      email: data.email
    },
    'Société': {
      select: getValidSelect(data.societe, validSocietes)
    },
    'Formation': {
      select: getValidSelect(data.formation, validFormations)
    },
    'Date soumission': {
      date: { start: new Date().toISOString().split('T')[0] }
    },
    'Réponses JSON': {
      rich_text: [{ text: { content: JSON.stringify(data, null, 2).substring(0, 2000) } }]
    }
  };
  
  // Ajout de la fonction si présente
  if (data.fonction) {
    properties['Fonction'] = {
      rich_text: [{ text: { content: data.fonction } }]
    };
  }
  
  const page = await notion.pages.create({
    parent: { database_id: FORMATION_DATABASE_ID },
    properties
  });
  
  return page;
}

/**
 * Handler principal FLEXIBLE
 */
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }
  
  // Validation variables d'environnement
  if (!process.env.NOTION_API_KEY) {
    console.error('NOTION_API_KEY manquante');
    return res.status(500).json({ 
      success: false, 
      message: 'Configuration serveur incomplète',
      error: 'ENV_MISSING_NOTION_API_KEY'
    });
  }
  
  const data = req.body;
  
  // Validation email obligatoire
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email valide requis',
      error: 'VALIDATION_EMAIL_INVALID'
    });
  }
  
  // Validation champs obligatoires
  if (!data.nom || !data.prenom) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nom et prénom requis',
      error: 'VALIDATION_NAME_MISSING'
    });
  }
  
  // Variables pour tracking des étapes
  let notionPage = null;
  let pdfBuffer = null;
  
  // ETAPE 1: Sauvegarde Notion
  try {
    console.log('[FLEXIBLE STEP 1/4] Sauvegarde dans Notion...');
    notionPage = await saveToNotion(data);
    console.log('[FLEXIBLE STEP 1/4] OK - Notion page ID:', notionPage.id);
  } catch (error) {
    console.error('[FLEXIBLE STEP 1/4] ERREUR Notion:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la sauvegarde dans Notion',
      error: 'NOTION_SAVE_FAILED',
      details: error.message
    });
  }
  
  // ETAPE 2: Génération PDF FLEXIBLE
  try {
    console.log('[FLEXIBLE STEP 2/4] Génération PDF flexible...');
    pdfBuffer = await generateFlexiblePDF(data);
    console.log('[FLEXIBLE STEP 2/4] OK - PDF généré:', pdfBuffer.length, 'bytes');
  } catch (error) {
    console.error('[FLEXIBLE STEP 2/4] ERREUR PDF:', error.message);
    console.error('[FLEXIBLE STEP 2/4] Stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du PDF',
      error: 'PDF_GENERATION_FAILED',
      details: error.message,
      notionPageId: notionPage?.id
    });
  }
  
  // ETAPE 3: Envoi email au répondant
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      console.log('[FLEXIBLE STEP 3/4] Envoi email répondant vers:', data.email);
      await sendPDFToRespondent(data.email, data.prenom, pdfBuffer, data.societe);
      console.log('[FLEXIBLE STEP 3/4] OK - Email répondant envoyé');
    } catch (error) {
      console.error('[FLEXIBLE STEP 3/4] ERREUR Email répondant:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de confirmation',
        error: 'EMAIL_RESPONDENT_FAILED',
        details: error.message,
        notionPageId: notionPage?.id
      });
    }
    
    // ETAPE 4: Notification Franck (avec PDF)
    try {
      console.log('[FLEXIBLE STEP 4/4] Envoi notification Franck...');
      await sendNotificationToFranck(data, notionPage.url, pdfBuffer);
      console.log('[FLEXIBLE STEP 4/4] OK - Notification envoyée');
    } catch (error) {
      console.error('[FLEXIBLE STEP 4/4] ERREUR Notification:', error.message);
      // Non bloquant - on considère le process comme réussi
    }
  } else {
    console.warn('[FLEXIBLE STEP 3-4/4] SMTP non configuré - emails non envoyés');
  }
  
  // Succès complet
  return res.status(200).json({
    success: true,
    message: 'Questionnaire enregistré avec succès',
    notionPageId: notionPage.id,
    api: 'flexible'
  });
}
