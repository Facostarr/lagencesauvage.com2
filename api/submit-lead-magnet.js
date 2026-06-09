// =============================================================================
// VERCEL SERVERLESS FUNCTION - Endpoint unique pour tous les lead magnets
// =============================================================================
// Remplace les 5 endpoints submit-{checklist,prompts,kit,grille-seo-geo,programme}
// (limite 12 fonctions Vercel Hobby : 5 fonctions → 1).
//
// Routage : body.magnet ('checklist' | 'prompts' | 'kit' | 'grille-seo-geo' |
// 'programme'), avec fallback sur l'URL legacy (rewrites vercel.json) pour
// les pages encore en cache qui POSTent sur les anciens chemins.
//
// Pipeline identique aux endpoints d'origine :
//   1. Notion (bloquant, anti-doublon via _leads.js)
//   2. Email prospect avec lien PDF (Resend, non bloquant)
//   3. Notification Franck (email + Telegram, non bloquant)
//   4. Event Plausible server-side (non bloquant)
//
// Ajouter un lead magnet = une entrée dans MAGNETS, zéro nouvelle fonction.

import { Client } from '@notionhq/client';
import { Resend } from 'resend';
import { notifyFounder } from './_notify.js';
import { findExistingLead } from './_leads.js';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const resend = new Resend(process.env.RESEND_API_KEY);

const DIAGNOSTIC_URL = 'https://www.lagencesauvage.com/#audit-form';
const FROM_FRANCK = "Franck Sauvage — L'Agence Sauvage <hello@lagencesauvage.com>";

// -----------------------------------------------------------------------------
// Configuration par magnet — contenus portés à l'identique depuis les anciens
// endpoints (submit-checklist.js, submit-prompts.js, submit-kit.js,
// submit-grille-seo-geo.js, submit-programme.js).
// -----------------------------------------------------------------------------
const MAGNETS = {

  'checklist': {
    legacyPath: '/api/submit-checklist',
    pdfUrl: 'https://www.lagencesauvage.com/assets/downloads/checklist-30-jours-claude-pme.pdf',
    landingUrl: 'https://www.lagencesauvage.com/blog/claude-cowork-pme-cas-usage-mars-2026/',
    notionSource: 'Lead Magnet - Checklist 30 Jours',
    notionEntreprise: '(Checklist 30 Jours Claude)',
    notionDefi: 'Téléchargement Checklist 30 Jours Claude PME',
    notifySource: 'Checklist 30 Jours Claude PME',
    eventName: 'Checklist Download',
    eventSource: 'Lead Magnet Checklist 30 Jours',
    emailFrom: FROM_FRANCK,
    email: ({ firstName, pdfUrl }) => ({
      subject: 'Votre checklist 30 jours pour déployer Claude dans votre équipe',
      text: `Bonjour ${firstName},\n\nVoici votre checklist (téléchargement direct) :\n${pdfUrl}\n\nCe guide semaine par semaine vous accompagne du premier prompt jusqu'à un déploiement complet de Claude dans votre équipe. Semaine 1 fondations, semaine 2 cas d'usage métier, semaine 3 adoption équipe, semaine 4 mesure du ROI.\n\nSi vous voulez aller plus loin — un accompagnement personnalisé pour votre déploiement IA — je propose un diagnostic découverte de 30 minutes :\n${DIAGNOSTIC_URL}\n\nBonne utilisation,\n\nFranck Sauvage\nFondateur — L'Agence Sauvage\nhello@lagencesauvage.com`,
      html: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
<div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0">
  <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">Checklist 30 jours — Déployer Claude dans votre PME</h1>
  <p style="color:#C7D2FE;margin:6px 0 0;font-size:14px">Guide opérationnel semaine par semaine · Actions concrètes · ROI mesurable</p>
</div>
<div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
  <p style="margin:0 0 16px">Bonjour <strong>${firstName}</strong>,</p>
  <p style="margin:0 0 20px;color:#374151">Voici votre checklist. Ce guide semaine par semaine vous accompagne du premier prompt jusqu'à un déploiement complet de Claude dans votre équipe.</p>

  <a href="${pdfUrl}" style="display:inline-block;background:#4F46E5;color:#fff;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px">Télécharger ma checklist (PDF) →</a>

  <div style="background:#F1F5F9;border-radius:8px;padding:20px;margin:28px 0">
    <p style="margin:0 0 10px;font-weight:700;color:#0F172A;font-size:14px">Ce que contient votre checklist</p>
    <ul style="margin:0;padding-left:20px;color:#374151;font-size:14px;line-height:1.8">
      <li><strong>Semaine 1 — Lancer le Commando :</strong> Compte, projets, premiers prompts</li>
      <li><strong>Semaine 2 — Cerveaux d'équipe :</strong> Projets partagés, instructions, artefacts</li>
      <li><strong>Semaine 3 — Passer à l'échelle :</strong> Automatisations, formation équipe</li>
      <li><strong>Semaine 4 — Standardiser &amp; Mesurer :</strong> KPIs, ROI, gouvernance légère</li>
      <li><strong>Bonus :</strong> 3 quick wins métier + modèle email d'annonce équipe</li>
    </ul>
  </div>

  <div style="background:#EEF2FF;border-left:4px solid #4F46E5;padding:16px 20px;margin-bottom:28px;border-radius:0 6px 6px 0">
    <p style="margin:0;font-size:14px;color:#3730A3;font-weight:600">Ce que vous obtenez en 30 jours</p>
    <p style="margin:6px 0 0;font-size:14px;color:#374151">Une équipe qui utilise Claude au quotidien, des process documentés, et un retour sur investissement mesurable — sans formation coûteuse ni prestataire.</p>
  </div>

  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0">
  <p style="margin:0 0 8px;color:#374151;font-size:14px">Vous préférez un accompagnement personnalisé pour votre déploiement IA ?</p>
  <a href="${DIAGNOSTIC_URL}" style="color:#4F46E5;font-size:14px;font-weight:600">Réservez un diagnostic découverte de 30 min →</a>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0">
  <p style="margin:0;font-size:12px;color:#94A3B8">L'Agence Sauvage · Paris · <a href="mailto:hello@lagencesauvage.com" style="color:#94A3B8">hello@lagencesauvage.com</a></p>
</div>
</div>`,
    }),
  },

  'prompts': {
    legacyPath: '/api/submit-prompts',
    pdfUrl: 'https://www.lagencesauvage.com/assets/downloads/50-prompts-pme-agence-sauvage.pdf',
    landingUrl: 'https://www.lagencesauvage.com/blog/art-du-prompt/',
    notionSource: 'Lead Magnet - 50 Prompts PME',
    notionEntreprise: '(50 Prompts PME)',
    notionDefi: 'Téléchargement 50 Prompts IA PME',
    notifySource: '50 Prompts IA PME',
    eventName: '50 Prompts Download',
    eventSource: 'Lead Magnet 50 Prompts',
    emailFrom: FROM_FRANCK,
    email: ({ firstName, pdfUrl }) => ({
      subject: 'Vos 50 prompts IA pour PME — à copier-coller dans Claude',
      text: `Bonjour ${firstName},\n\nVoici vos 50 prompts (téléchargement direct) :\n${pdfUrl}\n\nCe PDF de 20 pages regroupe 50 prompts construits sur le framework ROCF (Rôle, Objectif, Contexte, Format), répartis en 6 catégories métier : Finance, RH, Commercial, Communication, Direction & Opérations, et GEO/Référencement. Chaque prompt est prêt à copier-coller dans Claude.\n\nSi vous voulez aller plus loin — déployer l'IA dans votre équipe ou automatiser des process métier — je propose un diagnostic découverte de 30 minutes :\n${DIAGNOSTIC_URL}\n\nBonne utilisation,\n\nFranck Sauvage\nFondateur — L'Agence Sauvage\nhello@lagencesauvage.com`,
      html: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
<div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0">
  <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">50 Prompts IA Prêts à l'Emploi pour PME</h1>
  <p style="color:#C7D2FE;margin:6px 0 0;font-size:14px">Framework ROCF · 6 catégories métier · À copier-coller dans Claude</p>
</div>
<div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
  <p style="margin:0 0 16px">Bonjour <strong>${firstName}</strong>,</p>
  <p style="margin:0 0 20px;color:#374151">Voici vos 50 prompts. Ce PDF de 20 pages regroupe des prompts construits sur le framework ROCF, répartis en 6 catégories métier concrètes.</p>

  <a href="${pdfUrl}" style="display:inline-block;background:#4F46E5;color:#fff;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px">Télécharger mes 50 prompts (PDF) →</a>

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
    }),
  },

  'kit': {
    legacyPath: '/api/submit-kit',
    pdfUrl: 'https://www.lagencesauvage.com/assets/downloads/kit-10-prompts-claude-pme.pdf',
    landingUrl: 'https://www.lagencesauvage.com/ressources/kit-claude-cowork-pme/',
    notionSource: 'Lead Magnet - Kit Claude Cowork',
    notionEntreprise: '(Kit Claude Cowork)',
    notionDefi: 'Téléchargement Kit Claude Cowork PME',
    notifySource: 'Kit Claude Cowork PME',
    eventName: 'Kit Download',
    eventSource: 'Kit Claude Cowork',
    skipPhoneProperty: true, // l'endpoint d'origine ne posait pas 'Téléphone'
    emailFrom: "L'Agence Sauvage <hello@lagencesauvage.com>",
    email: ({ firstName, pdfUrl }) => ({
      subject: 'Votre kit PDF — 10 prompts Claude pour PME',
      text: `Bonjour ${firstName},\n\nVoici votre kit en PDF (téléchargement direct) :\n${pdfUrl}\n\nSi vous avez des questions sur l'automatisation IA dans votre entreprise, je suis disponible pour un diagnostic découverte de 15 minutes : https://www.lagencesauvage.com/#audit-form\n\nBonne utilisation,\n\nFranck Sauvage\nL'Agence Sauvage\nhello@lagencesauvage.com`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
<div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0">
  <h1 style="color:#fff;margin:0;font-size:20px">10 prompts Claude pour PME</h1>
  <p style="color:#C7D2FE;margin:4px 0 0;font-size:14px">Copiez, collez, récupérez votre temps</p>
</div>
<div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
  <p style="margin:0 0 16px">Bonjour <strong>${firstName}</strong>,</p>
  <p style="margin:0 0 24px;color:#374151">Votre kit est prêt. Cliquez ci-dessous pour télécharger le PDF.</p>
  <a href="${pdfUrl}" style="display:inline-block;background:#4F46E5;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px">Télécharger mon kit (PDF) →</a>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:32px 0">
  <p style="margin:0 0 8px;color:#374151;font-size:14px">Ce kit vous a donné des idées pour votre entreprise ?</p>
  <p style="margin:0;font-size:14px"><a href="https://www.lagencesauvage.com/#audit-form" style="color:#4F46E5">Réservez un diagnostic découverte de 15 min →</a></p>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:32px 0">
  <p style="margin:0;font-size:12px;color:#94A3B8">L'Agence Sauvage · Paris · <a href="mailto:hello@lagencesauvage.com" style="color:#94A3B8">hello@lagencesauvage.com</a></p>
</div>
</div>`,
    }),
  },

  'grille-seo-geo': {
    legacyPath: '/api/submit-grille-seo-geo',
    pdfUrl: 'https://www.lagencesauvage.com/assets/downloads/grille-pilotage-seo-geo-2026.pdf',
    landingUrl: 'https://www.lagencesauvage.com/blog/seo-geo-2026-methode-visibilite-google-ia/',
    notionSource: 'Lead Magnet - Grille SEO GEO',
    notionEntreprise: '(Grille SEO GEO)',
    notionDefi: 'Téléchargement Grille de pilotage SEO + GEO 2026',
    notifySource: 'Grille de pilotage SEO + GEO 2026',
    eventName: 'Grille SEO GEO Download',
    eventSource: 'Lead Magnet Grille SEO GEO',
    emailFrom: FROM_FRANCK,
    email: ({ firstName, pdfUrl }) => ({
      subject: 'Votre grille de pilotage SEO + GEO 2026',
      text: `Bonjour ${firstName},\n\nVoici votre grille de pilotage (téléchargement direct) :\n${pdfUrl}\n\n10 indicateurs concrets pour vérifier, à votre prochain point mensuel, que votre prestataire — agence, freelance ou équipe interne — a pris le virage de l'IA. Notez chaque indicateur sur 2, faites le total sur 20, et vous saurez où vous en êtes.\n\nUn conseil : commencez par les 2 tests d'une minute (page 4). Ils vous diront tout de suite si les IA ont le droit de lire votre site.\n\nVous préférez un regard extérieur ? Je propose un audit IA gratuit de 30 minutes qui passe votre site au crible de ces 10 indicateurs :\n${DIAGNOSTIC_URL}\n\nBonne lecture,\n\nFranck Sauvage\nFondateur — L'Agence Sauvage\nhello@lagencesauvage.com`,
      html: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
<div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0">
  <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">Grille de pilotage SEO + GEO 2026</h1>
  <p style="color:#C7D2FE;margin:6px 0 0;font-size:14px">10 indicateurs de gouvernance · Grille de notation /20 · 2 tests à faire vous-même</p>
</div>
<div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
  <p style="margin:0 0 16px">Bonjour <strong>${firstName}</strong>,</p>
  <p style="margin:0 0 20px;color:#374151">Voici votre grille. Elle vous donne 10 indicateurs concrets pour vérifier, à votre prochain point mensuel, que votre prestataire a pris le virage de l'IA.</p>

  <a href="${pdfUrl}" style="display:inline-block;background:#4F46E5;color:#fff;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px">Télécharger ma grille (PDF) →</a>

  <div style="background:#F1F5F9;border-radius:8px;padding:20px;margin:28px 0">
    <p style="margin:0 0 10px;font-weight:700;color:#0F172A;font-size:14px">Ce que contient votre grille</p>
    <ul style="margin:0;padding-left:20px;color:#374151;font-size:14px;line-height:1.8">
      <li><strong>10 indicateurs</strong> à noter sur 2 (fondations, autorité, visibilité IA, pilotage)</li>
      <li><strong>La preuve à exiger</strong> pour chacun — pour détecter le flou</li>
      <li><strong>2 tests</strong> à faire vous-même en une minute (robots.txt, llms.txt)</li>
      <li><strong>Une grille de notation /20</strong> et 5 questions de pilotage à poser</li>
    </ul>
  </div>

  <div style="background:#EEF2FF;border-left:4px solid #4F46E5;padding:16px 20px;margin-bottom:28px;border-radius:0 6px 6px 0">
    <p style="margin:0;font-size:14px;color:#3730A3;font-weight:600">Commencez ici</p>
    <p style="margin:6px 0 0;font-size:14px;color:#374151">Page 4 : les 2 tests d'une minute. Ils vous diront tout de suite si les IA d'OpenAI et d'Anthropic ont le droit de lire votre site — ou si vous les bloquez sans le savoir.</p>
  </div>

  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0">
  <p style="margin:0 0 8px;color:#374151;font-size:14px">Vous préférez un regard extérieur sur ces 10 indicateurs ?</p>
  <a href="${DIAGNOSTIC_URL}" style="color:#4F46E5;font-size:14px;font-weight:600">Réservez votre audit IA gratuit de 30 min →</a>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0">
  <p style="margin:0;font-size:12px;color:#94A3B8">L'Agence Sauvage · Paris · <a href="mailto:hello@lagencesauvage.com" style="color:#94A3B8">hello@lagencesauvage.com</a></p>
</div>
</div>`,
    }),
  },

  'programme': {
    legacyPath: '/api/submit-programme',
    pdfUrl: 'https://www.lagencesauvage.com/assets/downloads/programme-formation-claude-entreprise.pdf',
    landingUrl: 'https://www.lagencesauvage.com/formation/maitriser-claude-entreprise/',
    notionSource: 'Lead Magnet - Programme Formation',
    notionDefi: 'Téléchargement Programme Formation Claude',
    notifySource: 'Programme Formation Claude',
    eventName: 'Programme Formation Download',
    eventSource: 'Lead Magnet Formation',
    usesCompanyAndLastName: true, // Name = prénom + nom, Entreprise = champ libre
    emailFrom: FROM_FRANCK,
    email: ({ firstName, pdfUrl }) => ({
      subject: 'Votre programme de formation Claude — finançable jusqu\'à 100% OPCO',
      text: `Bonjour ${firstName},\n\nVoici la proposition de formation "Maîtriser Claude en entreprise" :\n${pdfUrl}\n\nCe document de 7 pages présente la promesse de la formation, le programme sur 3 jours espacés (21 heures), 3 cas d'usage métier concrets, les modalités pratiques et les conditions de financement via votre OPCO. Vous pouvez le partager directement avec votre OPCO ou votre service RH pour déposer un dossier de prise en charge.\n\nPour cadrer cette formation pour vos équipes ou calculer votre reste à charge, je suis disponible pour un échange de 30 minutes :\n${DIAGNOSTIC_URL}\n\nCordialement,\n\nFranck Sauvage\nFondateur — L'Agence Sauvage\nhello@lagencesauvage.com`,
      html: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
<div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0">
  <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">Maîtriser Claude en entreprise</h1>
  <p style="color:#C7D2FE;margin:6px 0 0;font-size:14px">Proposition de formation — Finançable OPCO · Dispensateur Qualiopi</p>
</div>
<div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
  <p style="margin:0 0 16px">Bonjour <strong>${firstName}</strong>,</p>
  <p style="margin:0 0 20px;color:#374151">Voici la proposition complète. Ce document de 7 pages présente la promesse de formation, le programme sur 3 jours espacés, 3 cas d'usage métier concrets, et les conditions de financement via votre OPCO.</p>

  <a href="${pdfUrl}" style="display:inline-block;background:#4F46E5;color:#fff;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px">Télécharger le programme PDF →</a>

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
  <p style="margin:0 0 8px;color:#374151;font-size:14px">Pour cadrer cette formation pour vos équipes ou calculer votre reste à charge OPCO :</p>
  <a href="${DIAGNOSTIC_URL}" style="color:#4F46E5;font-size:14px;font-weight:600">Réservez un premier échange de 30 min →</a>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0">
  <p style="margin:0;font-size:12px;color:#94A3B8">L'Agence Sauvage · Paris · <a href="mailto:hello@lagencesauvage.com" style="color:#94A3B8">hello@lagencesauvage.com</a> · Dispensateur : GHG Formations (certifié Qualiopi)</p>
</div>
</div>`,
    }),
  },
};

// Fallback URL legacy → clé magnet (pages en cache qui POSTent sur les anciens
// chemins, routées ici par les rewrites vercel.json avec ?magnet=...)
function magnetFromLegacyUrl(url = '', query = {}) {
  if (query.magnet && MAGNETS[query.magnet]) return query.magnet;
  const path = url.split('?')[0].replace(/\/$/, '');
  for (const [key, cfg] of Object.entries(MAGNETS)) {
    if (path.endsWith(cfg.legacyPath)) return key;
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const {
    magnet: magnetKey,
    firstName,
    lastName = '',
    email,
    company = '',
    phone = '',
  } = req.body;

  const resolvedKey = (magnetKey && MAGNETS[magnetKey] ? magnetKey : null) || magnetFromLegacyUrl(req.url, req.query || {});
  const magnet = MAGNETS[resolvedKey];

  if (!magnet) {
    return res.status(400).json({ success: false, message: 'Lead magnet inconnu.' });
  }

  if (!firstName || !email) {
    return res.status(400).json({ success: false, message: 'Prénom et email requis.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Email invalide.' });
  }

  const emailNorm = email.trim().toLowerCase();
  const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
  const companyNorm = company.trim();

  let notionUrl;
  let dejaConnu = false;

  // 1. Notion — bloquant (anti-doublon : pas de nouvelle page si le lead existe déjà)
  try {
    if (process.env.NOTION_API_KEY && DATABASE_ID) {
      const existing = await findExistingLead({ email: emailNorm, source: magnet.notionSource });
      if (existing) {
        dejaConnu = true;
        notionUrl = existing.url;
        console.log('♻️ Lead existant réutilisé:', existing.id);
      } else {
        const properties = {
          'Name': { title: [{ text: { content: magnet.usesCompanyAndLastName ? fullName : firstName.trim() } }] },
          'Email': { email: emailNorm },
          'Entreprise': { rich_text: [{ text: { content: magnet.usesCompanyAndLastName ? (companyNorm || '(non renseigné)') : magnet.notionEntreprise } }] },
          'Taille': { select: { name: '1-5' } },
          'Défi': { rich_text: [{ text: { content: magnet.notionDefi } }] },
          'Statut': { select: { name: 'Nouveau' } },
          'Source': { select: { name: magnet.notionSource } },
          'Date Soumission': { date: { start: new Date().toISOString().split('T')[0] } },
        };
        if (!magnet.skipPhoneProperty) {
          properties['Téléphone'] = { phone_number: phone.trim() || null };
        }
        const page = await notion.pages.create({
          parent: { database_id: DATABASE_ID },
          properties,
        });
        notionUrl = page.url;
        console.log('✅ Notion créé:', page.id);
      }
    }
  } catch (err) {
    console.error('❌ Notion error:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur. Réessayez.' });
  }

  // 2. Email prospect avec lien PDF — non bloquant
  try {
    const { subject, text, html } = magnet.email({ firstName: firstName.trim(), pdfUrl: magnet.pdfUrl });
    await resend.emails.send({
      from: magnet.emailFrom,
      to: emailNorm,
      subject,
      text,
      html,
    });
    console.log(`✅ Email ${resolvedKey} envoyé au prospect`);
  } catch (err) {
    console.error('⚠️ Email prospect échoué (non bloquant):', err.message);
  }

  // 3. Notification Franck — non bloquant
  try {
    const extra = [
      companyNorm && magnet.usesCompanyAndLastName ? `🏢 Entreprise : ${companyNorm}` : null,
      lastName.trim() && magnet.usesCompanyAndLastName ? `👤 Nom complet : ${fullName}` : null,
      phone.trim() ? `📞 Téléphone : ${phone.trim()}` : null,
      dejaConnu ? '♻️ Lead déjà connu (re-téléchargement, pas de doublon Notion)' : null,
    ].filter(Boolean).join('\n');

    await notifyFounder({
      firstName: firstName.trim(),
      email: emailNorm,
      source: magnet.notifySource,
      notionUrl,
      extra: extra || undefined,
    });
  } catch (err) {
    console.error('⚠️ notifyFounder échoué (non bloquant):', err.message);
  }

  // 4. Tracking Plausible server-side — non bloquant
  try {
    await fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'X-Forwarded-For': req.headers['x-forwarded-for']?.split(',')[0]?.trim() || '127.0.0.1',
      },
      body: JSON.stringify({
        name: magnet.eventName,
        url: req.headers.referer || magnet.landingUrl,
        domain: 'lagencesauvage.com',
        props: { source: magnet.eventSource },
      }),
    });
  } catch (_) { /* non bloquant */ }

  return res.status(200).json({ success: true });
}
