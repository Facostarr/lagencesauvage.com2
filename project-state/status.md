# Status — Refonte lagencesauvage.com

## Phase en cours : 4 — Intégration blog

## Progression

| Phase | Statut | Date début | Date fin |
|-------|--------|-----------|---------|
| Phase 0 — Setup technique | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 1 — Design system | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 2 — Homepage | 🟡 En cours (3 items en attente Franck) | 2026-03-22 | — |
| Phase 3 — Pages secondaires | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 4 — Intégration blog | 🟡 En cours | 2026-03-22 | — |
| Phase 5 — Quality gate | ⬜ À faire | — | — |
| Phase 6 — Bascule | ⬜ À faire | — | — |
| Phase 7 — Post-bascule | ⬜ À faire | — | — |

## Phase 0 — Tâches détaillées

- [x] Préparation docs (audit, playbook, stratégie skills)
- [x] Création skills custom (brand-identity, hugo-lagencesauvage, b2b-service-page-builder, conversion-audit-checklist)
- [x] Setup Claude Code (CLAUDE.md, settings, commands, hooks)
- [x] Cloner le repo et créer la branche `refonte-2026`
- [x] Installer Tailwind CSS v4 (npm + PostCSS + Hugo Pipes)
- [x] Migrer config Hugo : supprimer uglyURLs, mettre à jour menus, ajouter PostCSS aux security.exec
- [x] Créer le vercel.json complet (redirections 301 + headers)
- [x] Supprimer Hugo_projet/
- [x] Ajouter .mcp.json au .gitignore
- [x] Corriger vercel.json buildCommand (preset Hugo natif)
- [x] Ajouter @source dans main.css
- [x] Corriger 3 liens .html dans articles blog
- [x] Ajouter règles CLAUDE.md (redirections vercel.json only + classes TW dynamiques)
- [x] Configurer HUGO_VERSION dans Vercel Dashboard
- [x] Corriger build Vercel (Hugo 0.58→0.158.0 via build.env)
- [x] Vérifier build Vercel Preview — READY
- [x] **Validation Franck — GO Phase 1**

## Phase 1 — Tâches détaillées

- [x] Palette de couleurs : Premium Tech — indigo #4F46E5 / slate #0F172A / blanc #FFFFFF
- [x] Typographie : DM Serif Display (titres) + DM Sans (corps)
- [x] baseof.html : Hugo Pipes PostCSS, Google Fonts, structure flex
- [x] Header responsive : nav blanc, bordure subtile, CTA indigo
- [x] Footer : 4 colonnes, fond slate clair, menus dynamiques
- [x] Homepage placeholder : hero + CTA + section preuve sociale
- [x] Build Vercel Preview validé par Franck
- [x] Ajustements mobile (CTA resserré, espacements réduits)
- [x] Vérification rendu mobile — validé par Franck
- [x] **Validation Franck — Phase 1 terminée, GO Phase 2**

## Phase 2 — Tâches détaillées

- [x] Hero : proposition de valeur PAS + CTA audit gratuit
- [x] Section Pain points : framework PAS (3 colonnes)
- [x] Section "Ce qu'on livre" : refonte → bandeau chiffres + 3 mini-cartes cas clients + CTA /realisations/
- [x] Section Social proof : Olivier Sarezinski (Eurodom) + Myriam Louergli (Optimrezo)
- [x] Section FAQ : 6 questions avec schema FAQPage
- [x] Formulaire audit gratuit : 2 étapes progressives → /api/submit-lead
- [x] CTA final : fond slate dark
- [x] Schema LocalBusiness + meta tags enrichis
- [x] Positionnement élargi : "professionnels" (pas TPE/PME uniquement)
- [x] Animations premium : hero fade-in, scroll reveal, hover cards, FAQ grid animé
- [ ] Témoignages textuels Olivier + Myriam (en attente de Franck)
- [x] ~~Screenshots réels pour les 4 cartes livrables~~ (remplacé par mini-cartes cas clients)
- [ ] Lien Calendly pour confirmation formulaire (en attente de Franck)
- [ ] **Validation Franck — Preview Vercel Phase 2**

## Phase 3 — Tâches détaillées

- [x] Page À propos : bio narrative 3 actes, credentials, stack, photo Franck, schema AboutPage
- [x] Layout single.html générique pour pages secondaires
- [x] Photo Franck optimisée (5436x3629 → 800x800, 7.4 Mo → 52 Ko)
- [x] Page Services : 3 offres Good-Better-Best (Assistant IA, Formation, Transformation)
- [x] Prix validés : Assistant 500€/mois + setup 1000€, Formation 1000€/jour, Transformation 3000€
- [x] Stack technique alignée sur toutes les pages (Make retiré, Evolution API + Hugo+Vercel ajoutés)
- [x] Stack technique enrichie sur 4 pages (About, Services, Homepage, FAQ) — 12 technos issues des 6 case studies
- [x] Page Réalisations : section listing + case study "Pôle Financier Augmenté" (5 piliers, 13+ workflows, sommaire cliquable, API La Poste LReL, schema TechArticle+FAQPage, assets Gemini)
- [x] Case study "Usine à Contenu B2B" : 5 piliers (Topic Discovery, Veille RAG, Rédaction SEO/GEO, LinkedIn, Hugo Blog), 105 nodes, diagramme architecture Gemini
- [x] Template single.html dynamique : image architecture pilotée par front matter (architecture.image)
- [x] Page Diagnostic IA : landing page SEO fidèle à l'ancienne page (13 sections, méthode J1→J5, tableau comparatif, formulaire appel découverte)
- [x] Page FAQ complète : 18 questions GEO-optimisées, 5 catégories, schema FAQPage, accordion par catégorie
- [x] Pages légales : mentions légales, confidentialité, CGV — contenu migré + layout single.html + lien CGV ajouté au footer
- [x] Case study "GEO Citation Tracker" : SaaS Python/FastAPI, 5 APIs LLM, scoring pondéré, dashboard Chart.js, diagramme architecture Gemini
- [x] Case study "Chef de Cabinet IA" : 4 piliers (Gatekeeper, Executive Brief, Copilote Réunion, Commande Vocale), scénario journée type, diagramme architecture Gemini
- [x] Case study "Agent Téléphonique IA" : 4 piliers (réception, réservation, escalade, 2 options déploiement), diagramme architecture Gemini
- [x] Case study "Cerveau d'Entreprise & Veille" : 4 piliers (RAG documentaire, veille procédures collectives, veille marchés publics, agent zero papier), diagramme architecture Gemini
- [x] Ordre des case studies par weight (1→6, meilleurs en premier)
- [ ] **Validation Franck — Preview Vercel Phase 3**

## Phase 4 — Tâches détaillées

- [x] Brainstorm Claude + Gemini : blog "Édition Premium IA 2026" (consensus 8/10)
- [x] Layout blog/list.html : article vedette + grille + carte CTA intégrée + filtres catégories
- [x] Layout blog/single.html : lecture plein écran, 4 CTAs subtils, key takeaways, TOC flottant
- [x] Styles blog dans main.css : progress bar, prose typography, TOC panel, CTA sticky
- [x] assets/js/blog.js : progress bar, TOC highlight, copy anchor, scroll reveal, CTA sticky
- [x] blog.js chargé conditionnellement dans baseof.html (section blog uniquement)
- [x] 8 hero images générées par Gemini (abstraites, géométriques, palette indigo/slate, <40Ko chacune)
- [x] Front matter enrichi : takeaways + image + imageAlt sur les 8 articles (contenu texte inchangé)
- [x] Corrections techniques : /blog.html→/blog/, /about.html→/about/ dans schema + params
- [x] Fix liens blog : .Permalink → .RelPermalink (navigation cassée sur preview Vercel)
- [ ] **Validation Franck — Preview Vercel Phase 4**

## Logo & Branding

- [x] Brainstorm Claude + Gemini : direction logo (consensus 8/10)
- [x] 4 planches de concepts générées via Gemini (séries C, D, E, F, G)
- [x] Logo provisoire C2 intégré (carré arrondi indigo + S espace négatif + texte DM Serif/Sans)
- [x] Favicon SVG (monogramme S seul)
- [x] Taille logo augmentée header h-12/h-14, footer h-12
- [ ] Validation logo final par Franck + contacts extérieurs (monogramme A+S en exploration)
- [ ] Conversion texte SVG en paths vectorisés (après validation finale)

## Blockers

Aucun pour le moment.

## Décisions prises

- ✅ Typographie : DM Serif Display + DM Sans (2026-03-22)
- ✅ Palette : abandon "Intelligence Organique", adoption "Premium Tech" indigo/slate/blanc (2026-03-22)
- ✅ Formulaire : 2 étapes progressives (coordonnées → entreprise) (2026-03-22)
- ✅ Social proof : Olivier Sarezinski (Eurodom) + Myriam Louergli (Optimrezo) validés (2026-03-22)
- ✅ Positionnement : "professionnels" au lieu de "TPE/PME" — cible élargie jusqu'à 200 salariés (2026-03-22)
- ✅ Animations : consensus Claude + Gemini — style Stripe/Linear, easing expo, prefers-reduced-motion (2026-03-22)
- ✅ Page About : structure 4 sections (consensus Claude + Gemini), bio 3 actes, pas de faux KPIs (2026-03-22)
- ✅ Page Services : 3 offres Good-Better-Best — consensus Claude + Gemini (2026-03-22)
- ✅ Naming offres : "Assistant IA & Automatisation" / "Formation IA" / "Transformation IA" (2026-03-22)
- ✅ Prix validés : Assistant 500€/mois + setup 1000€, Formation 1000€/jour, Transformation 3000€ (2026-03-22)
- ✅ Stack technique : Make retiré, Evolution API + Hugo+Vercel ajoutés partout (2026-03-22)
- ✅ Stack technique v2 : enrichie à 12 technos (OpenAI, Gemini, Python/FastAPI, PostgreSQL, Whisper, Google Workspace, APIs métier) alignée sur les 6 case studies (2026-03-22)
- ✅ Page FAQ : 18 questions GEO-optimisées (consensus Claude + Gemini), 5 catégories client-centric (2026-03-22)
- ✅ Page Réalisations : 5 use cases sélectionnés (consensus Claude + Gemini), focus file créé (2026-03-22)
- ✅ Case study "Pôle Financier Augmenté" : page pilier 5 piliers narratifs, données réelles 13+ workflows n8n, API La Poste LReL, consensus Claude + Gemini score 9/10 (2026-03-22)
- ✅ Page Diagnostic IA : contenu fidèle à l'ancienne page, nouveau design system, 13 sections complètes (2026-03-22)
- ✅ Focus Réalisations v2 : 6 use cases (consensus Claude + Gemini v2, score 9/10) — fusion UC1+PennylaneAgent, ajout GEO Tracker SaaS, Jarvis repensé en Chef de Cabinet IA (2026-03-22)
- ✅ Case study "Usine à Contenu B2B" : 5 piliers, RAG Supabase, double optim SEO/GEO, diagramme architecture Gemini, prix "à partir de" (2026-03-22)
- ✅ 4 case studies finales : GEO Tracker (SaaS Python), Chef de Cabinet IA (4 piliers), Agent Téléphonique (2 options), Cerveau d'Entreprise (RAG + veille) — 4 diagrammes Gemini (2026-03-22)
- ✅ Blog "Édition Premium 2026" : brainstorm Claude + Gemini (consensus 8/10), layouts Tailwind v4, 8 images abstraites Gemini, lecture plein écran, 4 CTAs subtils, key takeaways GEO, TOC flottant, progress bar (2026-03-22)
- ✅ Ordre case studies par weight : Pôle Financier → GEO Tracker → Usine à Contenu → Chef de Cabinet → Agent Téléphonique → Cerveau d'Entreprise (2026-03-22)
- ✅ Homepage section réalisations : approche minimaliste bandeau chiffres + 3 mini-cartes (consensus Claude + Gemini 9/10) — pas de tags stack technique, chiffre héroïque en gros, cartes cliquables (2026-03-22)

- ✅ Logo provisoire C2 : monogramme S (carré arrondi indigo #4F46E5 + S espace négatif blanc) + texte "L'Agence" DM Sans / "Sauvage" DM Serif Display italic. Brainstorm Claude + Gemini (consensus 8/10). Franck consulte des avis extérieurs + explore piste monogramme A+S (2026-03-22)

## Décisions en attente

- Lien Calendly pour page de confirmation formulaire
- Logo final : C2 provisoire en place, Franck fait valider par contacts extérieurs. Piste monogramme A+S (séries G) à affiner
