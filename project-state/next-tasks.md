# Next Tasks — Refonte lagencesauvage.com

## Priorité immédiate

1. **Validation Franck — Preview Vercel Phase 3** — toutes les pages secondaires et 6 case studies livrées
2. **Phase 4 — Intégration blog** (après GO Franck)

## En attente de Franck

- Témoignages textuels d'Olivier Sarezinski (Eurodom) et Myriam Louergli (Optimrezo)
- Screenshots réels anonymisés : flux n8n, chatbot, dashboard, campagne marketing
- Lien Calendly éventuel pour la page de confirmation formulaire

## Pages Phase 3 livrées

- [x] Page À propos `/about/`
- [x] Page Services `/services/`
- [x] Page Réalisations `/realisations/` — 6 case studies complètes :
  - [x] Pôle Financier Augmenté (weight 1)
  - [x] GEO Citation Tracker (weight 2)
  - [x] Usine à Contenu B2B (weight 3)
  - [x] Chef de Cabinet IA (weight 4)
  - [x] Agent Téléphonique IA (weight 5)
  - [x] Cerveau d'Entreprise & Veille (weight 6)
- [x] Page FAQ `/faq/`
- [x] Page Diagnostic IA `/diagnostic/`
- [x] Pages légales : mentions légales, confidentialité, CGV

## Fait cette session

- [x] 4 case studies créées en parallèle (agents) :
  - UC2 GEO Citation Tracker — SaaS Python/FastAPI, 5 APIs LLM, scoring pondéré, dashboard Chart.js
  - UC4 Chef de Cabinet IA — 4 piliers (Gatekeeper, Executive Brief, Copilote Réunion, Commande Vocale), scénario journée type en callout
  - UC5 Agent Téléphonique IA — 4 piliers (réception, réservation, escalade, 2 options déploiement)
  - UC6 Cerveau d'Entreprise & Veille — 4 piliers (RAG documentaire, veille procédures collectives, veille marchés publics, agent zero papier)
- [x] 4 diagrammes d'architecture générés via Gemini MCP (16:9, 2K, style flat design)
- [x] Images copiées dans static/assets/images/ + champ architecture.image ajouté dans chaque YAML
- [x] Correction icône non supportée dans UC5 (phone-missed → alert-triangle)
- [x] Ordering par weight (1→6) pour affichage meilleurs en premier sur /realisations/
- [x] Commits 4c5562a + c5e0c9c — poussés sur refonte-2026
