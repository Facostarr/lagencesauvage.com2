# Changelog — Refonte lagencesauvage.com

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
