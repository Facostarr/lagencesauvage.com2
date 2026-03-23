# Focus — Page Réalisations (Use Cases)

## Objectif
Créer la page `/realisations/` avec 6 case studies issues des projets réels de L'Agence Sauvage.
Diversité de stack démontrée : n8n, Python/FastAPI, Voice AI, WhatsApp, RAG — pas juste "une agence n8n".
Chaque case study suit le framework PAS (Pain-Agitate-Solve) et pointe vers l'offre associée.

## Consensus Claude + Gemini v2 (2026-03-22)
Sélection validée par Franck. Score de consensus : 9/10.
Évolutions vs v1 : fusion UC1+PennylaneAgent, ajout GEO Tracker (SaaS), Jarvis repensé en Chef de Cabinet IA.

---

## Use Case 1 — Le Pôle Financier & Recouvrement Augmenté (10/10)

- **Titre** : "Zéro retard de paiement et comptabilité en pilote automatique"
- **Secteur** : Cabinets comptables, agences, services B2B
- **Problème** : Tri email manuel, saisie de factures chronophage, relances impayés oubliées, chasse aux documents manquants par téléphone
- **Bénéfices** : 15-20h/semaine récupérées, baisse drastique des créances, zéro erreur de saisie, relances clients automatisées et conversationnelles
- **Tech** : n8n (20 workflows interconnectés), WhatsApp API (Evolution API), Pennylane Cabinet API v2, Claude Haiku 4.5 (IA conversationnelle), PostgreSQL, MinIO (S3), OCR
- **Offre associée** : Transformation IA (3000€) puis Assistant (500€/mois)
- **Évolution V1 → V2** : Le système a évolué d'un simple triage email (V1) vers un écosystème complet avec bot WhatsApp conversationnel intelligent (V2). Preuve que L'Agence Sauvage construit des solutions scalables, pas des one-shots.
- **Détails workflows** :
  - **Système Emessage (V1 — 11 workflows)** :
    - W1 Trieur Email Franck (22 nodes) — Triage automatique des emails par IA
    - W2 Trieur Email Natacha (22 nodes) — Idem pour 2e utilisateur
    - W3 Envoi Relance WhatsApp (7 nodes) — Relances automatiques via WhatsApp
    - W4 Webhook Reception WhatsApp (15 nodes) — Réception et traitement messages WhatsApp
    - W5 Traitement Fichier (12 nodes) — Traitement automatique de fichiers/factures
    - W6 Conversation IA (8 nodes) — Interface conversationnelle IA
    - W7 Upload Pennylane (8 nodes) — Envoi automatique vers logiciel comptable
    - W8 Alertes Admin (9 nodes) — Notifications et monitoring
    - Sync Pennylane (9 nodes) — Synchronisation données comptables
    - Orchestrateur Relances (12 nodes) — Orchestration relances impayés
    - Monitoring Global (9 nodes) — Rapport quotidien
  - **PennylaneAgent (V2 — 9 workflows)** :
    - W1 Sync Clients Pennylane — Import automatique clients depuis Pennylane Cabinet API v2
    - W2 Sync Documents — Détection documents manquants par client
    - W3 Planificateur Relances — Ordonnancement intelligent des relances
    - W4 Envoi WhatsApp Conversationnel — Messages personnalisés via Evolution API + Claude Haiku
    - W5 Réception WhatsApp — Webhook traitement réponses clients
    - W6 Analyse Documents Reçus — OCR + validation automatique
    - W7 Upload Pennylane — Envoi documents validés vers le cabinet
    - W8 Suivi & Reporting — Dashboard statut par client
    - W9 Alertes Comptable — Notifications au cabinet en temps réel

---

## Use Case 2 — GEO Citation Tracker (9.5/10) — NOUVEAU

- **Titre** : "Savez-vous ce que ChatGPT dit de votre marque ?"
- **Positionnement** : Produit SaaS en développement pour agences marketing/SEO
- **Secteur** : Agences digitales, consultants SEO, PME e-commerce, SaaS B2B
- **Problème** : Les LLM (ChatGPT, Perplexity, Gemini) deviennent des moteurs de recherche. Votre marque y est-elle visible ? Recommandée ? Ou totalement ignorée ? Aucun outil ne permet de le savoir aujourd'hui.
- **Bénéfices** : Monitoring automatisé de la visibilité IA sur 5 plateformes, scoring multi-runs avec pondération par confiance, alertes en cas de changement de positionnement, dashboard décisionnel interactif
- **Tech** : Python 3.13, FastAPI, SQLite, Chart.js + Alpine.js, 5 APIs LLM (OpenAI, Anthropic, Google, Perplexity, xAI)
- **Preuves** : MVP fonctionnel, 301 tests passants, 3 audits réels validés, cron automatisé (lundi 6h)
- **Angle SaaS** : Accès anticipé / waitlist pour agences intéressées par le monitoring GEO
- **Offre associée** : Transformation IA (3000€) pour audit GEO sur-mesure en attendant le SaaS
- **Différenciation** : Stack 100% custom Python/FastAPI (pas de no-code) — prouve la capacité à développer des produits SaaS sur-mesure
- **Fonctionnalités clés** :
  - Audit multi-LLM : interroge ChatGPT, Claude, Perplexity, Gemini et Grok simultanément
  - Détection avancée de mentions et analyse de sentiment
  - Scoring pondéré avec intervalles de confiance
  - Dashboard web interactif (Chart.js) avec historique et tendances
  - Système d'alertes email automatisé
  - CLI + API REST pour intégration dans des workflows existants

---

## Use Case 3 — L'Usine à Contenu B2B (9/10)

- **Titre** : "3 mois de visibilité SEO et LinkedIn générés en 2 heures"
- **Secteur** : Agences, consultants, e-commerce B2B, startups
- **Problème** : Manque de temps/régularité pour le contenu, SEO négligé
- **Bénéfices** : Présence digitale quotidienne, économie d'un community manager (~1500€/mois), hausse trafic organique
- **Tech** : n8n (5 workflows, ~105 nodes total), RAG Supabase, LLM (OpenAI/Anthropic), LinkedIn API, Hugo CMS
- **Workflows source** : Machine à Contenu (W0 à W4)
- **Offre associée** : Assistant IA (500€/mois + 1000€ setup)
- **Preuve de dogfooding** : Ce système alimente le propre blog de L'Agence Sauvage (8 articles performants en SEO/GEO) et le site en cours de refonte (Hugo + Tailwind v4 + Vercel, optimisé CRO B2B)
- **Détails workflows** :
  - W0 Topic Discovery v2 (33 nodes, actif) — Découverte sujets tendance IA
  - W1 Daily Research & RAG Supabase (24 nodes, actif) — Veille quotidienne + base vectorielle
  - W2 Content Machine SEO GEO (14 nodes, actif) — Génération articles SEO/GEO optimisés
  - W3 LinkedIn Machine (21 nodes, actif) — Publication automatique LinkedIn
  - W4 Publication Hugo Blog (13 nodes) — Publication directe sur le blog Hugo

---

## Use Case 4 — Le Chef de Cabinet IA (9/10) — NOUVEAU (consensus Claude+Gemini 9/10)

- **Titre** : "Le Chef de Cabinet IA : Libérez 10 à 15 heures par semaine en déléguant votre charge mentale"
- **Secteur** : Dirigeants TPE/PME, solopreneurs, consultants seniors
- **Problème** : Surcharge cognitive, boîte mail inondée, dispersion entre 5+ outils, opportunités noyées dans le bruit, préparation de rendez-vous à la dernière minute, sensation de "subir" sa journée
- **Bénéfices** :
  - 10 à 15h/semaine de temps administratif récupéré
  - Temps de traitement emails divisé par 4
  - 100% des suivis clients post-réunion effectués sous 2h
- **Tech** : n8n (8+ sub-workflows), Claude API (cerveau/routage sémantique), Gmail/Calendar (Google Workspace), Notion (CRM/second cerveau), WhatsApp (Evolution API), Whisper API (transcription vocale)
- **Offre associée** : Transformation IA (3000€) + Assistant IA (500€/mois maintenance)
- **Note** : Cas d'usage vitrine — inspiré du prototype "Jarvis V2" existant, repensé en agent proactif premium
- **3 piliers fonctionnels** :
  1. **Le Gatekeeper (Tri intelligent)** — Catégorisation emails/messages selon règles VIP. Brouillons de réponses pré-rédigés pour validation. Routing vers les bonnes personnes.
  2. **L'Executive Brief (Proactivité)** — Synthèse matinale WhatsApp : urgences de la nuit, agenda du jour, KPIs clés. Le dirigeant sait en 30 secondes ce qui l'attend.
  3. **Le Copilote de Réunion (Contexte)** — Avant un rdv : brief contextuel (historique emails, notes Notion, dernier échange). Après : compte-rendu auto, tâches assignées à l'équipe, mail de suivi en brouillon.
- **Feature premium : Commande vocale** — Le dirigeant laisse un vocal WhatsApp de 30 secondes ("Je sors de réu avec Martin, il est chaud pour le devis, rappelle-moi de l'envoyer vendredi et mets à jour le CRM"). L'IA transcrit (Whisper), extrait les tâches, met à jour Notion, génère le brouillon email.
- **Scénario "Journée type"** :
  - 07h30 : Daily Brief WhatsApp — "3 urgences, 2 opportunités, votre agenda du jour"
  - 10h00 : Brief client automatique avant le rdv de 10h30 — résumé des 3 derniers échanges
  - 14h00 : Vocal 30s post-réunion → CRM Notion mis à jour + mail de suivi en brouillon Gmail
  - 18h00 : Résumé "Inbox Zero" — newsletters archivées, réponses simples faites, 4 mails en attente de validation finale
- **Différenciation vs assistant humain** :
  - Disponible 24/7 (urgences internationales traitées la nuit)
  - Mémoire parfaite — jamais d'engagement oublié
  - Confidentialité absolue des données stratégiques
  - Synthèse de 50 pages d'historique client en 3 secondes
  - Ne remplace pas l'humain : libère l'assistant(e) de la data-entry pour le relationnel
- **Workflows hérités de Jarvis V2** :
  - Main V2 (28 nodes, actif) — Orchestrateur principal multi-outils
  - Read Emails (3 nodes) — Lecture emails
  - Send Email (3 nodes) — Envoi emails
  - Get Calendar (3 nodes) — Consultation agenda
  - Create Event (4 nodes) — Création événements
  - Create Notion Task (3 nodes) — Création tâches Notion
  - Create Notion Note (3 nodes) — Création notes Notion
  - Query Notion Tasks (3 nodes) — Consultation tâches
- **Workflows à développer** :
  - Executive Brief Generator — Synthèse matinale automatique
  - Meeting Prep Agent — Brief contextuel avant réunions
  - Voice Command Processor — Whisper + extraction de tâches
  - Follow-up Tracker — Détection et suivi des engagements

---

## Use Case 5 — L'Agent Téléphonique IA 24/7 (8.5/10)

- **Titre** : "Ne perdez plus aucune réservation : un standardiste IA qui ne dort jamais"
- **Secteur** : Restauration, hôtellerie, cliniques, salons
- **Problème** : Appels manqués, réservations perdues, personnel interrompu
- **Bénéfices** : 100% des appels traités, +15-30% de réservations récupérées
- **Tech** : n8n, Voice AI, LLM
- **Workflows source** : Restaurant Agent (Options A et B)
- **Offre associée** : Assistant IA (500€/mois + 1000€ setup)
- **Détails workflows** :
  - Option A Simplifié (9 nodes) — Prise de réservation automatique
  - Option B Contrôle Total (25 nodes) — Gestion complète restaurant

---

## Use Case 6 — Le Cerveau d'Entreprise & Veille Stratégique (8/10)

- **Titre** : "Accédez à 100% de vos connaissances d'entreprise et surveillez vos marchés en 1 clic"
- **Secteur** : Cabinets d'avocats, BTP, bureaux d'études, directions générales
- **Problème** : Documents introuvables, opportunités ratées (marchés publics, faillites concurrents)
- **Bénéfices** : Avantage concurrentiel (premier alerté), réponse instantanée aux requêtes documentaires, zéro papier égaré
- **Tech** : n8n, RAG (Gemini + Supabase), Google Drive, API Pappers, scraping qualifié
- **Workflows source** : Assistant RAG + Veille Procédures Collectives + Veille Marchés Publics + Agent Zero Papier
- **Offre associée** : Transformation IA (3000€)
- **Détails workflows** :
  - Assistant IA avec RAG — Gemini + Drive + Supabase (28 nodes, actif)
  - Veille Procédures Collectives (21 nodes) + Vérification Pappers (6 nodes)
  - Veille Marchés Publics IA (13 nodes)
  - Agent Zero Papier — Classement automatique (7 nodes)

---

## Projets exclus

| Projet | Raison |
|--------|--------|
| Contrats eMessage | Pas assez impressionnant (décision Franck) |
| Batchcook | B2C/personnel |
| F4 Manager | Jeu vidéo Godot, hors scope |
| Email Assistant MCP | Overlap avec Chef de Cabinet IA |
| Serveur VPS4 SMTP | Trop DevOps pour vitrine — argument closing uniquement |
| Refonte Site Web | Infusé dans Usine à Contenu (dogfooding CRO) |
| Stade de France Alerts | Trop B2C/personnel |
| Video Generation WaveSpeed | Gadget, pas de ROI business clair |
| Social Media Story Scraper | Borderline éthique, dilue le positionnement premium |
| Campagne Email Bulk Zimbra | Trop basique pour justifier l'expertise |
| Templates non personnalisés | Pas de valeur case study |

---

## Règles d'implémentation

1. **Copywriting PAS** (Pain-Agitate-Solve) pour chaque case study
2. **Pas de screenshots n8n** — schémas simplifiés "Avant (Manuel) vs Après (IA)"
3. **Anonymiser** les données clients (RGPD) — pas de noms de clients finaux
4. **CTA différenciés** : cas opérationnels → "Réservez votre audit IA gratuit (30 min)", cas stratégiques → pointer vers Transformation IA
5. **Pas de KPI inventés** — utiliser des fourchettes estimées (ex: "10-15h/semaine") ou demander validation Franck
6. **Badges visuels** par case study : "Setup rapide", "ROI immédiat", "Pour Dirigeants", "SaaS en dev"
7. **Vouvoiement** sur toute la page
8. **Max 0-2 emojis** sur la page entière
9. **Tags tech visibles** par use case (ex: `Python`, `n8n`, `Claude API`, `FastAPI`) — prouver la diversité de stack
10. **Organisation par département métier** : Finance, Marketing, Direction, Service Client, Management — facilite l'identification par le prospect
11. **Tone premium** : orienté ROI et bénéfices business avant la technique. Le prospect veut savoir combien il gagne, pas comment ça marche techniquement.
