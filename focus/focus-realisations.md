# Focus — Page Réalisations (Use Cases)

## Objectif
Créer la page `/realisations/` avec 5 case studies issues des workflows n8n réels de L'Agence Sauvage.
Chaque case study suit le framework PAS (Pain-Agitate-Solve) et pointe vers l'offre associée.

## Consensus Claude + Gemini (2026-03-22)
Sélection validée par Franck. Score de consensus : 8/10.

---

## Use Case 1 — Le Pôle Financier Augmenté (10/10)

- **Titre** : "Zéro retard de paiement et comptabilité en pilote automatique"
- **Secteur** : Cabinets comptables, agences, services B2B
- **Problème** : Tri email manuel, saisie de factures chronophage, relances impayés oubliées
- **Bénéfices** : 15-20h/semaine récupérées, baisse drastique des créances, zéro erreur de saisie
- **Tech** : n8n (11 workflows actifs), WhatsApp API (Evolution API), Pennylane, OCR, IA catégorisation
- **Workflows source** : Système Emessage (W1-W8) + Gestion Impayés + Triage Email + Renommage Factures
- **Offre associée** : Transformation IA (3000€) puis Assistant (500€/mois)
- **Détails workflows** :
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

---

## Use Case 2 — L'Usine à Contenu B2B (9/10)

- **Titre** : "3 mois de visibilité SEO et LinkedIn générés en 2 heures"
- **Secteur** : Agences, consultants, e-commerce B2B, startups
- **Problème** : Manque de temps/régularité pour le contenu, SEO négligé
- **Bénéfices** : Présence digitale quotidienne, économie d'un community manager (~1500€/mois), hausse trafic organique
- **Tech** : n8n (5 workflows, ~105 nodes total), RAG Supabase, LLM (OpenAI/Anthropic), LinkedIn API, Hugo CMS
- **Workflows source** : Machine à Contenu (W0 à W4)
- **Offre associée** : Assistant IA (500€/mois + 1000€ setup)
- **Détails workflows** :
  - W0 Topic Discovery v2 (33 nodes, actif) — Découverte sujets tendance IA
  - W1 Daily Research & RAG Supabase (24 nodes, actif) — Veille quotidienne + base vectorielle
  - W2 Content Machine SEO GEO (14 nodes, actif) — Génération articles SEO/GEO optimisés
  - W3 LinkedIn Machine (21 nodes, actif) — Publication automatique LinkedIn
  - W4 Publication Hugo Blog (13 nodes) — Publication directe sur le blog Hugo

---

## Use Case 3 — L'Agent Téléphonique IA 24/7 (8.5/10)

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

## Use Case 4 — Le Cerveau d'Entreprise & Veille Stratégique (8/10)

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

## Use Case 5 — L'Assistant de Direction "Jarvis" (7.5/10)

- **Titre** : "Le bras droit du dirigeant : emails, réunions et tâches orchestrés par l'IA"
- **Secteur** : Dirigeants TPE/PME, solopreneurs, consultants freelances
- **Problème** : Surcharge mentale, désorganisation, suivi client défaillant
- **Bénéfices** : ~2h/jour libérées (40h/mois), alignement pensée-exécution
- **Tech** : n8n (8 sub-workflows), Notion API, Gmail, Calendar API, LLM
- **Workflows source** : Jarvis V2
- **Offre associée** : Assistant IA (500€/mois + 1000€ setup)
- **Détails workflows** :
  - Main V2 (28 nodes, actif) — Orchestrateur principal multi-outils
  - Read Emails (3 nodes) — Lecture emails
  - Send Email (3 nodes) — Envoi emails
  - Get Calendar (3 nodes) — Consultation agenda
  - Create Event (4 nodes) — Création événements
  - Create Notion Task (3 nodes) — Création tâches Notion
  - Create Notion Note (3 nodes) — Création notes Notion
  - Query Notion Tasks (3 nodes) — Consultation tâches

---

## Projets exclus

| Projet | Raison |
|--------|--------|
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
5. **Pas de KPI inventés** — utiliser des fourchettes estimées (ex: "15-20h/semaine") ou demander validation Franck
6. **Badges visuels** par case study : "Setup rapide", "ROI immédiat", "Pour Dirigeants"
7. **Vouvoiement** sur toute la page
8. **Max 0-2 emojis** sur la page entière
