# Changelog — Refonte lagencesauvage.com

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
