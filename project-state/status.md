# Status — Refonte lagencesauvage.com

## Phase en cours : 0 — Setup technique

## Progression

| Phase | Statut | Date début | Date fin |
|-------|--------|-----------|---------|
| Phase 0 — Setup technique | 🟡 En cours | 2026-03-22 | — |
| Phase 1 — Design system | ⬜ À faire | — | — |
| Phase 2 — Homepage | ⬜ À faire | — | — |
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
- [ ] Corriger vercel.json buildCommand (preset Hugo natif)
- [ ] Ajouter @source dans main.css
- [ ] Corriger 3 liens .html dans articles blog
- [ ] Ajouter règles CLAUDE.md (redirections vercel.json only + classes TW dynamiques)
- [ ] Configurer HUGO_VERSION dans Vercel Dashboard
- [ ] Vérifier que `hugo server` tourne sans erreur
- [ ] Push initial sur `refonte-2026` → vérifier Preview Vercel
- [ ] **STOP — Validation Franck**

## Blockers

Aucun pour le moment.

## Décisions en attente

- Choix typographie définitif (voir skill brand-identity pour les options)
- Solution formulaire lead capture (Vercel Serverless existant vs autre)
- Liste des vrais clients autorisés pour la preuve sociale
