# Changelog — Refonte lagencesauvage.com

## 2026-03-22 — Phase 3 : Focus Réalisations v2 (6 use cases)

- Exploration complète des 11 projets Claude Code pour identifier les cas d'usage au-delà de n8n
- 2 brainstorms Claude + Gemini : sélection use cases (consensus 9/10) + conception Chef de Cabinet IA (consensus 9/10)
- Focus Réalisations v2 — 6 use cases finaux (vs 5 en v1) :
  - UC1 Pôle Financier & Recouvrement : fusionné avec PennylaneAgent (V1 11 workflows → V2 20 workflows, bot WhatsApp conversationnel Claude Haiku + Pennylane Cabinet API v2)
  - UC2 GEO Citation Tracker (NOUVEAU) : app Python 3.13/FastAPI, monitoring visibilité marque sur 5 LLM, positionné futur SaaS pour agences
  - UC3 Usine à Contenu B2B : enrichi avec preuve de dogfooding (propre blog + refonte site)
  - UC4 Chef de Cabinet IA (NOUVEAU) : Jarvis repensé en agent proactif premium — 3 piliers (Gatekeeper, Executive Brief, Copilote Réunion), commande vocale WhatsApp, scénario journée type
  - UC5 Agent Téléphonique IA : inchangé
  - UC6 Cerveau d'Entreprise & Veille : inchangé
- Exclusions validées par Franck : Contrats eMessage (pas assez impressionnant), Batchcook (B2C), F4 Manager (gaming), SMTP (DevOps only)
- 11 règles d'implémentation (vs 8 en v1) : ajout tags tech visibles, organisation par département métier, tone premium
- Diversité de stack démontrée : n8n + Python/FastAPI + Voice AI + WhatsApp + RAG

## 2026-03-22 — Phase 3 : Page Diagnostic IA

- Page Diagnostic de Transformation IA `/diagnostic/` — landing page SEO dédiée
- Contenu fidèle à l'ancienne page `diagnostic-transformation-ia.html`, redesigné avec le design system Premium Tech
- 13 sections : hero + citation Amodei, constat (3 faits sourcés Challenger/Nadella/Bloomberg), 3 erreurs entreprises, approche 360° (technique/business/humain), 4 différenciateurs, méthode J1→J5 (timeline), 5 livrables détaillés (rapport 40-60p), profils TPE/PME/ETI, tableau comparatif vs cabinet/ESN/freelance, CTA intermédiaire indigo, formulaire 2 étapes, FAQ 6 questions, CTA final
- Tableau comparatif responsive : table desktop + cards mobile
- Formulaire "appel découverte" 2 étapes → POST `/api/submit-diagnostic` (serverless function existante)
- Niveaux recommandations : Autonome (vert), Accompagné (jaune), Expert (rouge)
- Schema Service (type audit, areaServed France) + FAQPage
- Lien "Diagnostic IA gratuit" ajouté au footer Ressources
- Redirections 301 déjà en place : `/diagnostic-transformation-ia.html` → `/diagnostic/`, `/audit-ia-gratuit.html` → `/diagnostic/`
- Commits 5f390fc + 13fc90d

## 2026-03-22 — Phase 3 : Case study Pôle Financier Augmenté

- Section `/realisations/` créée avec grille de case studies (list.html)
- Case study "Pôle Financier Augmenté" — page pilier SEO/GEO pour cabinets comptables
- 5 piliers narratifs : tri email IA, extraction factures OCR, relance WhatsApp×Pennylane, recouvrement API La Poste LReL, monitoring dirigeant
- Données issues de 13+ workflows n8n réels en production
- Layout single.html avec sommaire cliquable, accordion tech details par pilier, callout wow-factor
- Schema TechArticle + FAQPage + BreadcrumbList
- FAQ 7 questions ciblant requêtes experts-comptables (RGPD, mise en demeure, coût)
- 3 assets visuels Gemini : diagramme archi 5 blocs, diagramme WhatsApp×Pennylane, mockup conversation
- API La Poste (LReL via Okapi) au lieu de Merci Facteur
- Nouveau slug `/realisations/automatisation-pole-financier-pennylane-expert-comptable/`
- Redirection 301 depuis ancien slug WhatsApp
- 3 brainstorms Claude + Gemini (consensus 9/10 chacun)
- Commits 180e62c + 8f7c5f1

## 2026-03-22 — Phase 3 : Pages légales

- Pages légales complètes : mentions légales, confidentialité, CGV
- Mentions légales + confidentialité : contenu HTML existant migré en Markdown Hugo
- CGV : 12 articles, article 7 Propriété Intellectuelle en modèle Split IP
  - Brainstorm Claude + Gemini (consensus 9/10) : distinction propriété préexistante agence (licence) vs développements spécifiques client (cession droits patrimoniaux)
  - Licence liée à la durée d'abonnement pour prestations récurrentes
  - Formalisme CPI (art. L.131-3) respecté : étendue, destination, lieu, durée
  - Supports formation/audit : propriété agence, licence usage interne
  - Clause outils tiers (n8n, OpenAI, Anthropic)
- TVA corrigée : SASU avec TVA (pas article 293 B du CGI)
- Lien CGV ajouté au footer (à côté de Mentions légales et Confidentialité)
- Redirections 301 déjà en place dans vercel.json
- Commit 22d2f89

## 2026-03-22 — Phase 3 : Page Services

- Page Services complète `/services/` — 3 offres Good-Better-Best style Stripe/Linear
- Offre 1 "Assistant IA & Automatisation" : abo 500€/mois + setup 1000€ (collaborateur virtuel 24/7)
- Offre 2 "Formation IA" : ateliers sur site à partir de 1000€/jour (éligible OPCO)
- Offre 3 "Transformation IA" (recommandé) : accompagnement complet à partir de 3000€
- Naming challengé via brainstorm Claude + Gemini (3 rounds) : "n8n" sorti des titres, bénéfice > outil
- Effet leurre validé : offres 1+2 isolées rendent l'offre 3 évidente financièrement
- Section "Comment ça marche" en 3 étapes (audit → proposition → déploiement)
- FAQ 6 questions spécifiques services + schema FAQPage
- Schema.org Service (LocalBusiness > makesOffer > Service)
- Social proof réutilisée (Olivier + Myriam, en attente témoignages)
- CSS `.card-pricing` hover (border + glow indigo)
- Menus footer mis à jour : 3 offres avec ancres (#assistant-ia, #formation-ia, #transformation-ia)
- Stack technique alignée sur toutes les pages : Make retiré, Evolution API + Hugo+Vercel ajoutés (homepage + services + FAQ services)
- Commits 713bd8b, 83df936, 407a29c

## 2026-03-22 — Phase 3 : Page À propos

- Page À propos complète `/about/` — 4 sections (hero, bio+preuves, stack+formations, CTA)
- Bio narrative Franck en 3 actes : entrepreneur (2003), expert process Mixdata (2015), déclic IA (2025)
- 4 cards credentials vérifiables en sidebar sticky (XP, secteurs, grands comptes, NEOMA)
- Stack technique avec bénéfices métier (n8n, Claude, Supabase, Evolution API, Hugo+Vercel, Notion)
- Bloc formations + badge OPCO/Qualiopi ("via partenaire certifié")
- Schema.org AboutPage + Person + Organization
- Photo professionnelle Franck optimisée via Pillow (5436x3629 → 800x800, 7.4 Mo → 52 Ko)
- Layout `_default/single.html` générique pour futures pages secondaires
- Styles hover cards credentials + stack dans main.css
- CTA intermédiaire après bio + CTA final fond indigo
- Brief Claude Desktop validé/corrigé : palette et typo corrigées, structure réduite de 6 à 4 sections (consensus Claude + Gemini brainstorm)
- Preview Vercel validée par Franck
- Commit f438385

## 2026-03-22 — Phase 2 : Homepage

- Homepage complète : hero PAS, pain points (3 cols), livrables (4 cards), social proof, FAQ, formulaire 2 étapes, CTA final
- Formulaire lead capture 2 étapes progressives → /api/submit-lead (backend existant préservé)
- Social proof : Olivier Sarezinski (Eurodom) + Myriam Louergli (Optimrezo) — témoignages textuels en attente
- FAQ 6 questions avec schema FAQPage + schema LocalBusiness
- Positionnement élargi : "professionnels" au lieu de "TPE/PME" (cible jusqu'à 200 salariés)
- FAQ outils : n8n, Claude AI, Notion, Supabase + API métier clients (Make retiré)
- Animations premium (consensus Claude + Gemini) :
  - Hero fade-in-up staggeré au chargement (400ms, easing expo)
  - Scroll reveal IntersectionObserver pour pain points, livrables, social proof
  - Tech logos grayscale → couleur au hover
  - Cards : border indigo (pain) / border + image scale 1.03 (livrables) au hover
  - FAQ refactoré : details natif → button + CSS grid (0fr→1fr) animé
  - prefers-reduced-motion respecté (tout visible immédiatement)
- Commits : afabd4b → bc55a45 (3 commits)

## 2026-03-22 — Phase 1 : Design system

- Corrigé build Vercel : Hugo 0.58.2 → 0.158.0 via `build.env.HUGO_VERSION` dans vercel.json
- Ajouté `postcss-cli` (requis par Hugo Pipes pour exécuter PostCSS)
- Corrigé permalink deprecated `:filename` → `:contentbasename`
- Palette validée par Franck : abandon "Intelligence Organique" (forest/orange/cream), adoption "Premium Tech" (indigo #4F46E5 / slate #0F172A / blanc #FFFFFF) — consensus Claude + Gemini
- Typographie validée : DM Serif Display (titres) + DM Sans (corps)
- baseof.html : Hugo Pipes + PostCSS, Google Fonts, structure flex min-h-screen
- Header responsive : nav blanc, bordure subtile, CTA indigo, menu mobile hamburger
- Footer : 4 colonnes, fond slate clair #F8FAFC, menus dynamiques depuis menus.toml
- Homepage placeholder : hero + CTA + section preuve sociale technologies
- Ajustements mobile : CTA resserré, espacements proportionnés
- Commits : 7882ecc → e46f6ec (7 commits)

## 2026-03-22 — Corrections audit Gemini pré-Phase 1

- Appliqué les 9 corrections identifiées par l'audit croisé Claude + Gemini
- vercel.json : preset Hugo natif (`framework: "hugo"`), suppression du curl, ajout redirection `/audit-ia-gratuit.html`
- package.json : buildCommand simplifié (`hugo --gc --minify`)
- main.css : ajout `@source` pour que Tailwind v4 scanne `layouts/` et `content/`
- 3 articles blog : correction liens internes `.html` → pretty URLs (URLs techniques, pas contenu)
- CLAUDE.md : 2 nouvelles règles (redirections vercel.json only + pas de classes TW dynamiques)
- lessons.md : leçons Tailwind v4 + Hugo, Vercel, SEO/GEO migration blog
- playbook : pré-requis Phase 4 (mapping HTML blog), notes serverless functions
- status.md : mise à jour progression Phase 0
- HUGO_VERSION = 0.145.0 configuré dans Vercel Dashboard (action manuelle Franck)
- Commit `d624171` pushé sur `refonte-2026`

## 2026-03-22 — Setup initial

- Audit complet du repo existant (structure, config, dépendances, serverless functions)
- Brainstorm Claude + Gemini sur l'architecture du setup Claude Code
- Création du setup complet : CLAUDE.md, settings.local.json, 4 commands, 3 hooks, project-state/
- Installation des 5 skills Corey Haines (page-cro, copywriting, form-cro, pricing-strategy, schema-markup)
- Copie des docs de référence (audit-conversion.md, playbook-refonte.md)
- Décisions validées par Franck : préserver serverless functions, ajouter .mcp.json au .gitignore, supprimer Hugo_projet/, conserver config TOML
