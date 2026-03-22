# Status — Refonte lagencesauvage.com

## Phase en cours : 3 — Pages secondaires

## Progression

| Phase | Statut | Date début | Date fin |
|-------|--------|-----------|---------|
| Phase 0 — Setup technique | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 1 — Design system | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 2 — Homepage | 🟡 En cours (3 items en attente Franck) | 2026-03-22 | — |
| Phase 3 — Pages secondaires | 🟡 En cours | 2026-03-22 | — |
| Phase 4 — Intégration blog | ⬜ À faire | — | — |
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
- [x] Section "Ce qu'on livre" : 4 cartes avec placeholders visuels
- [x] Section Social proof : Olivier Sarezinski (Eurodom) + Myriam Louergli (Optimrezo)
- [x] Section FAQ : 6 questions avec schema FAQPage
- [x] Formulaire audit gratuit : 2 étapes progressives → /api/submit-lead
- [x] CTA final : fond slate dark
- [x] Schema LocalBusiness + meta tags enrichis
- [x] Positionnement élargi : "professionnels" (pas TPE/PME uniquement)
- [x] Animations premium : hero fade-in, scroll reveal, hover cards, FAQ grid animé
- [ ] Témoignages textuels Olivier + Myriam (en attente de Franck)
- [ ] Screenshots réels pour les 4 cartes livrables (en attente de Franck)
- [ ] Lien Calendly pour confirmation formulaire (en attente de Franck)
- [ ] **Validation Franck — Preview Vercel Phase 2**

## Phase 3 — Tâches détaillées

- [x] Page À propos : bio narrative 3 actes, credentials, stack, photo Franck, schema AboutPage
- [x] Layout single.html générique pour pages secondaires
- [x] Photo Franck optimisée (5436x3629 → 800x800, 7.4 Mo → 52 Ko)
- [x] Page Services : 3 offres Good-Better-Best (Assistant IA, Formation, Transformation)
- [x] Prix validés : Assistant 500€/mois + setup 1000€, Formation 1000€/jour, Transformation 3000€
- [x] Stack technique alignée sur toutes les pages (Make retiré, Evolution API + Hugo+Vercel ajoutés)
- [x] Page Réalisations : section listing + case study "Pôle Financier Augmenté" (5 piliers, 13+ workflows, sommaire cliquable, API La Poste LReL, schema TechArticle+FAQPage, assets Gemini)
- [ ] Page Diagnostic IA (landing page SEO dédiée)
- [x] Page FAQ complète : 18 questions GEO-optimisées, 5 catégories, schema FAQPage, accordion par catégorie
- [x] Pages légales : mentions légales, confidentialité, CGV — contenu migré + layout single.html + lien CGV ajouté au footer
- [ ] **Validation Franck — Preview Vercel Phase 3**

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
- ✅ Page FAQ : 18 questions GEO-optimisées (consensus Claude + Gemini), 5 catégories client-centric (2026-03-22)
- ✅ Page Réalisations : 5 use cases sélectionnés (consensus Claude + Gemini), focus file créé (2026-03-22)
- ✅ Case study "Pôle Financier Augmenté" : page pilier 5 piliers narratifs, données réelles 13+ workflows n8n, API La Poste LReL, consensus Claude + Gemini score 9/10 (2026-03-22)

## Décisions en attente

- Lien Calendly pour page de confirmation formulaire
