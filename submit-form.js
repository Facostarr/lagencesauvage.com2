// api/submit-form.js
// Vercel Serverless Function pour L'Agence Sauvage
// Intégration Notion + Email + SMS + Anti-spam

const { Client } = require('@notionhq/client');

// Rate limiting simple (en mémoire)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 heure
const MAX_REQUESTS_PER_IP = 3;

// Fonction de rate limiting
function checkRateLimit(ip) {
  const now = Date.now();
  const requestData = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  // Reset si la fenêtre est passée
  if (now > requestData.resetTime) {
    requestData.count = 0;
    requestData.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  // Vérifier la limite
  if (requestData.count >= MAX_REQUESTS_PER_IP) {
    return {
      allowed: false,
      resetTime: requestData.resetTime
    };
  }
  
  // Incrémenter le compteur
  requestData.count++;
  rateLimitMap.set(ip, requestData);
  
  return { allowed: true };
}

// Validation d'email améliorée
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const disposableProviders = ['tempmail', 'throwaway', '10minutemail', 'guerrillamail'];
  
  if (!emailRegex.test(email)) return false;
  
  const domain = email.split('@')[1].toLowerCase();
  return !disposableProviders.some(provider => domain.includes(provider));
}

// Validation de téléphone français
function isValidPhoneNumber(phone) {
  // Format: 06/07 suivi de 8 chiffres, ou +33 6/7 suivi de 8 chiffres
  const phoneRegex = /^(?:(?:\+|00)33|0)[67]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Détection de spam basique
function isSpamContent(text) {
  const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'click here', 'buy now'];
  const lowerText = text.toLowerCase();
  return spamKeywords.some(keyword => lowerText.includes(keyword));
}

// Envoi d'email (via SendGrid, Mailgun, ou SMTP)
async function sendEmailNotification(leadData) {
  // TODO: Implémenter avec votre service d'email préféré
  // Pour l'instant, on log juste
  console.log('📧 Email à envoyer:', {
    to: process.env.NOTIFICATION_EMAIL,
    subject: `🚀 Nouveau lead: ${leadData.name}`,
    body: `
      Nouveau lead reçu !
      
      Nom: ${leadData.name}
      Email: ${leadData.email}
      Téléphone: ${leadData.phone}
      Entreprise: ${leadData.company}
      Taille: ${leadData.company_size}
      Défi: ${leadData.challenge}
      
      Source: ${leadData.source}
      Date: ${new Date().toLocaleString('fr-FR')}
    `
  });
  
  return { success: true };
}

// Envoi de SMS (via Twilio)
async function sendSMSNotification(leadData) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_FROM;
    const toPhone = process.env.NOTIFICATION_PHONE;
    
    if (!accountSid || !authToken || !fromPhone) {
      console.log('⚠️ Configuration Twilio manquante, SMS non envoyé');
      return { success: false, reason: 'config_missing' };
    }
    
    const message = `🚀 Nouveau lead: ${leadData.name} (${leadData.company}) - ${leadData.email}`;
    
    // Appel API Twilio
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        To: toPhone,
        From: fromPhone,
        Body: message
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur Twilio: ${response.status}`);
    }
    
    console.log('📱 SMS envoyé avec succès');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Erreur envoi SMS:', error);
    return { success: false, error: error.message };
  }
}

// Handler principal
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }
  
  try {
    // Rate limiting
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const rateLimitCheck = checkRateLimit(ip);
    
    if (!rateLimitCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Trop de tentatives. Veuillez réessayer dans 1 heure.',
        resetTime: rateLimitCheck.resetTime
      });
    }
    
    // Extraction des données
    const { 
      name, 
      email, 
      phone, 
      company, 
      company_size, 
      challenge,
      honeypot // Champ anti-bot invisible
    } = req.body;
    
    // Protection honeypot
    if (honeypot) {
      console.log('🤖 Bot détecté via honeypot');
      return res.status(200).json({ 
        success: true, 
        message: 'Merci ! Nous vous recontactons bientôt.' 
      });
    }
    
    // Validation des champs requis
    if (!name || !email || !phone || !company || !company_size || !challenge) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs sont obligatoires.'
      });
    }
    
    // Validation email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email invalide ou temporaire non accepté.'
      });
    }
    
    // Validation téléphone
    if (!isValidPhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Numéro de téléphone invalide. Format attendu: 06XXXXXXXX ou +336XXXXXXXX'
      });
    }
    
    // Détection de spam
    if (isSpamContent(challenge) || isSpamContent(company)) {
      console.log('⚠️ Contenu spam détecté');
      return res.status(400).json({
        success: false,
        error: 'Contenu non autorisé détecté.'
      });
    }
    
    // Initialiser Notion
    const notion = new Client({
      auth: process.env.NOTION_API_KEY
    });
    
    // Déterminer la source
    const source = req.headers.referer?.includes('/services') 
      ? 'Site Web - Services' 
      : 'Site Web - Homepage';
    
    // Créer l'entrée dans Notion
    const notionResponse = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID
      },
      properties: {
        'Name': {
          title: [
            {
              text: {
                content: name
              }
            }
          ]
        },
        'Email': {
          email: email
        },
        'Téléphone': {
          phone_number: phone
        },
        'Entreprise': {
          rich_text: [
            {
              text: {
                content: company
              }
            }
          ]
        },
        'Taille': {
          select: {
            name: company_size
          }
        },
        'Défi': {
          rich_text: [
            {
              text: {
                content: challenge
              }
            }
          ]
        },
        'Statut': {
          select: {
            name: 'Nouveau'
          }
        },
        'Source': {
          select: {
            name: source
          }
        },
        'Date Soumission': {
          date: {
            start: new Date().toISOString()
          }
        }
      }
    });
    
    console.log('✅ Lead créé dans Notion:', notionResponse.id);
    
    // Préparer les données pour les notifications
    const leadData = {
      name,
      email,
      phone,
      company,
      company_size,
      challenge,
      source,
      notionUrl: notionResponse.url
    };
    
    // Envoi des notifications (parallèle, non bloquant)
    Promise.all([
      sendEmailNotification(leadData),
      sendSMSNotification(leadData)
    ]).catch(error => {
      console.error('⚠️ Erreur notifications:', error);
      // On ne bloque pas la réponse si les notifications échouent
    });
    
    // Réponse succès
    return res.status(200).json({
      success: true,
      message: 'Merci ! Votre demande a bien été envoyée. Nous vous recontactons sous 24h.',
      leadId: notionResponse.id
    });
    
  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    
    // Erreur Notion spécifique
    if (error.code === 'unauthorized') {
      return res.status(500).json({
        success: false,
        error: 'Configuration Notion incorrecte.'
      });
    }
    
    if (error.code === 'object_not_found') {
      return res.status(500).json({
        success: false,
        error: 'Database Notion introuvable.'
      });
    }
    
    // Erreur générique
    return res.status(500).json({
      success: false,
      error: 'Une erreur est survenue. Veuillez réessayer.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
