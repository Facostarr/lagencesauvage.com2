# Status — Refonte lagencesauvage.com

## Phase en cours : 2 — Homepage

## Progression

| Phase | Statut | Date début | Date fin |
|-------|--------|-----------|---------|
| Phase 0 — Setup technique | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 1 — Design system | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 2 — Homepage | 🟡 En cours | 2026-03-22 | — |
| Phase 3 — Pages secondaires | ⬜ À faire | — | — |
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

## Blockers

Aucun pour le moment.

## Décisions prises

- ✅ Typographie : DM Serif Display + DM Sans (2026-03-22)
- ✅ Palette : abandon "Intelligence Organique", adoption "Premium Tech" indigo/slate/blanc (2026-03-22)

## Décisions en attente

- Solution formulaire lead capture (Vercel Serverless existant vs autre)
- Liste des vrais clients autorisés pour la preuve sociale
