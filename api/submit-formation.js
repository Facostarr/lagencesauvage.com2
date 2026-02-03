// =============================================================================
// VERCEL SERVERLESS FUNCTION - Submit Formation Questionnaire
// =============================================================================
// Fichier : /api/submit-formation.js
// 
// Cette fonction gère :
// 1. La validation des données du formulaire
// 2. La génération d'un PDF récapitulatif brandé
// 3. L'envoi du PDF au répondant par email
// 4. L'envoi d'une notification à Franck
// 5. La sauvegarde dans Notion
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
 * Génère un PDF récapitulatif des réponses
 */
async function generatePDF(data) {
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
      const cream = '#f2ede1';
      
      // Header
      doc.rect(0, 0, doc.page.width, 120).fill(forestGreen);
      doc.fontSize(28).fillColor('#ffffff').text("L'Agence Sauvage", 50, 40);
      doc.fontSize(14).fillColor(burntOrange).text('Questionnaire de positionnement - Formation IA', 50, 75);
      doc.fontSize(10).fillColor('#ffffff').text(`${data.societe || 'Smartcompta'} - ${data.formation || 'IA pour experts-comptables'}`, 50, 95);
      
      doc.moveDown(4);
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
          doc.fontSize(10).fillColor('#333333').text(item.value || 'Non renseigné', 200, y, { width: 350 });
          y += Math.max(20, doc.heightOfString(item.value || 'Non renseigné', { width: 350 }) + 5);
        });
        y += 15;
      };
      
      // Section 1 : Informations personnelles
      addSection('👤 Informations personnelles', [
        { label: 'Nom', value: data.nom },
        { label: 'Prénom', value: data.prenom },
        { label: 'Fonction', value: data.fonction },
        { label: 'Email', value: data.email }
      ]);
      
      // Section 2 : Usage actuel de l'IA
      addSection('🤖 Usage actuel de l\'IA', [
        { label: 'Fréquence', value: data.frequence_ia },
        { label: 'Outils utilisés', value: Array.isArray(data.outils_ia) ? data.outils_ia.join(', ') : data.outils_ia },
        { label: 'Abonnement payant', value: data.abonnement_payant },
        { label: 'Contexte utilisation', value: data.contexte_utilisation }
      ]);
      
      // Section 3 : Auto-évaluation
      addSection('📊 Auto-évaluation', [
        { label: 'Niveau estimé', value: data.niveau_auto },
        { label: 'Prompting scenario', value: data.prompting_scenario },
        { label: 'Notions techniques', value: Array.isArray(data.notions_techniques) ? data.notions_techniques.join(', ') : data.notions_techniques },
        { label: 'Difficultés', value: data.difficultes }
      ]);
      
      // Section 4 : Besoins professionnels
      addSection('💼 Besoins professionnels', [
        { label: 'Tâches chronophages', value: data.taches_chronophages },
        { label: 'Tâches répétitives', value: data.taches_repetitives },
        { label: 'Outils métier', value: data.outils_metier }
      ]);
      
      // Section 5 : Attentes de la formation
      addSection('🎯 Attentes de la formation', [
        { label: 'Objectifs', value: Array.isArray(data.objectifs_formation) ? data.objectifs_formation.join(', ') : data.objectifs_formation },
        { label: 'Cas d\'usage prioritaire', value: data.cas_usage_prioritaire },
        { label: 'Critère de réussite', value: data.critere_reussite }
      ]);
      
      // Section 6 : Logistique
      addSection('⚙️ Logistique', [
        { label: 'Droits admin PC', value: data.droits_admin },
        { label: 'Contraintes horaires', value: data.contraintes_horaires },
        { label: 'Besoins accessibilité', value: data.besoins_accessibilite }
      ]);
      
      // Footer
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).fillColor('#999999')
          .text(
            `L'Agence Sauvage | hello@lagencesauvage.com | www.lagencesauvage.com | Page ${i + 1}/${totalPages}`,
            50, doc.page.height - 30,
            { align: 'center', width: doc.page.width - 100 }
          );
      }
      
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
                Nous avons bien reçu vos réponses au questionnaire de positionnement pour la formation IA ${societe ? `chez <strong>${societe}</strong>` : ''}.
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
                L'Agence Sauvage — L'IA au coût d'un stagiaire
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
    subject: `✅ Questionnaire formation reçu - ${societe || 'L\'Agence Sauvage'}`,
    html: htmlContent,
    attachments: [{
      filename: `Questionnaire_Formation_${prenom}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }]
  });
}

/**
 * Envoie une notification à Franck
 */
async function sendNotificationToFranck(data, notionUrl) {
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'franck@lagencesauvage.com';
  
  const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #224f3c;">📝 Nouveau questionnaire formation reçu !</h2>
  
  <div style="background: #f2ede1; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>👤 Participant :</strong> ${data.prenom} ${data.nom}</p>
    <p><strong>📧 Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
    <p><strong>💼 Fonction :</strong> ${data.fonction || 'Non renseigné'}</p>
    <p><strong>🏢 Société :</strong> ${data.societe || 'Non renseigné'}</p>
    <p><strong>📚 Formation :</strong> ${data.formation || 'Non renseigné'}</p>
    <p><strong>📊 Niveau auto-évalué :</strong> ${data.niveau_auto || 'Non renseigné'}</p>
    <p><strong>🤖 Fréquence IA :</strong> ${data.frequence_ia || 'Non renseigné'}</p>
  </div>
  
  <div style="background: #224f3c; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0;"><strong>🎯 Objectif principal :</strong></p>
    <p style="margin: 5px 0 0 0;">${data.cas_usage_prioritaire || 'Non renseigné'}</p>
  </div>
  
  <a href="${notionUrl}" 
     style="display: inline-block; background: #c96839; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
    🔗 Voir dans Notion
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
    subject: `📝 Questionnaire formation : ${data.prenom} ${data.nom} (${data.societe || 'N/A'})`,
    html: htmlContent
  });
}

/**
 * Sauvegarde dans Notion
 */
async function saveToNotion(data) {
  // Liste des valeurs valides pour chaque select
  const validNiveaux = ['Débutant', 'Intermédiaire', 'Confirmé', 'Expert'];
  const validFrequences = ['Jamais', 'Essayé 1-2 fois', 'Occasionnellement', 'Régulièrement', 'Quotidiennement'];
  const validAbonnements = ['Non (gratuit)', 'ChatGPT Plus', 'Claude Pro', 'Autre', 'Ne sait pas'];
  const validDroits = ['Oui', 'À vérifier', 'Non (poste verrouillé)'];
  const validSocietes = ['Smartcompta', 'Galaxy Conseil', 'Autre'];
  const validFormations = ['IA pour experts-comptables', 'Claude + N8N', 'Autre'];
  
  // Helper pour valider une valeur select
  const getValidSelect = (value, validOptions) => {
    if (!value) return null;
    return validOptions.includes(value) ? { name: value } : null;
  };

  const page = await notion.pages.create({
    parent: { database_id: FORMATION_DATABASE_ID },
    properties: {
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
        select: getValidSelect(data.societe, validSocietes) || { name: 'Autre' }
      },
      'Fonction': {
        rich_text: [{ text: { content: data.fonction || '' } }]
      },
      'Formation': {
        select: getValidSelect(data.formation, validFormations) || { name: 'Autre' }
      },
      'Niveau auto-évalué': {
        select: getValidSelect(data.niveau_auto, validNiveaux)
      },
      'Fréquence usage IA': {
        select: getValidSelect(data.frequence_ia, validFrequences)
      },
      'Outils utilisés': {
        multi_select: (Array.isArray(data.outils_ia) ? data.outils_ia : [])
          .filter(o => ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Aucun'].includes(o))
          .map(o => ({ name: o }))
      },
      'Abonnement payant': {
        select: getValidSelect(data.abonnement_payant, validAbonnements)
      },
      'Attentes formation': {
        multi_select: (Array.isArray(data.objectifs_formation) ? data.objectifs_formation : [])
          .filter(o => ['Découvrir l\'IA', 'Améliorer prompting', 'Gagner du temps', 'Structurer usage', 'Comprendre limites', 'Former collaborateurs'].includes(o))
          .map(o => ({ name: o }))
      },
      'Cas d\'usage prioritaire': {
        rich_text: [{ text: { content: (data.cas_usage_prioritaire || '').substring(0, 2000) } }]
      },
      'Critère de réussite': {
        rich_text: [{ text: { content: (data.critere_reussite || '').substring(0, 2000) } }]
      },
      'Droits admin PC': {
        select: getValidSelect(data.droits_admin, validDroits)
      },
      'Contraintes horaires': {
        rich_text: [{ text: { content: (data.contraintes_horaires || '').substring(0, 2000) } }]
      },
      'Besoins accessibilité': {
        rich_text: [{ text: { content: (data.besoins_accessibilite || '').substring(0, 2000) } }]
      },
      'Date soumission': {
        date: { start: new Date().toISOString().split('T')[0] }
      },
      'Réponses JSON': {
        rich_text: [{ text: { content: JSON.stringify(data).substring(0, 2000) } }]
      }
    }
  });
  
  return page;
}

/**
 * Handler principal
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
    console.error('❌ NOTION_API_KEY manquante');
    return res.status(500).json({ success: false, message: 'Configuration serveur incomplète' });
  }
  
  const data = req.body;
  
  // Validation email obligatoire
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    return res.status(400).json({ success: false, message: 'Email valide requis' });
  }
  
  // Validation champs obligatoires
  if (!data.nom || !data.prenom) {
    return res.status(400).json({ success: false, message: 'Nom et prénom requis' });
  }
  
  try {
    // 1. Sauvegarder dans Notion
    console.log('📝 Sauvegarde dans Notion...');
    const notionPage = await saveToNotion(data);
    console.log('✅ Notion OK:', notionPage.id);
    
    // 2. Générer le PDF
    console.log('📄 Génération PDF...');
    const pdfBuffer = await generatePDF(data);
    console.log('✅ PDF généré:', pdfBuffer.length, 'bytes');
    
    // 3. Envoyer au répondant
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      console.log('📧 Envoi email répondant...');
      await sendPDFToRespondent(data.email, data.prenom, pdfBuffer, data.societe);
      console.log('✅ Email répondant envoyé');
      
      // 4. Notifier Franck
      console.log('📧 Envoi notification Franck...');
      await sendNotificationToFranck(data, notionPage.url);
      console.log('✅ Notification envoyée');
    } else {
      console.warn('⚠️ SMTP non configuré - emails non envoyés');
    }
    
    return res.status(200).json({
      success: true,
      message: 'Questionnaire enregistré avec succès',
      notionPageId: notionPage.id
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue. Veuillez réessayer.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
