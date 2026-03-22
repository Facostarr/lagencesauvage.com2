# Playbook Opérationnel — Refonte lagencesauvage.com

> Ce document est le guide de référence pour Claude Code. Il décrit **comment** exécuter la refonte complète du site www.lagencesauvage.com. Lis-le intégralement avant toute action.

---

## Contexte du projet

### Ce qu'on fait
Refonte complète de lagencesauvage.com : migration de l'architecture (HTML statique → 100% Hugo), nouveau design (Tailwind CSS v4), restructuration du contenu, nouveau copywriting orienté conversion. Le blog existant (déjà sous Hugo) est préservé et intégré.

### Pourquoi
Le site actuel ne génère aucun lead malgré un trafic correct (~450 visiteurs/trimestre). L'audit de conversion a identifié : témoignages fictifs, design surchargé, positionnement incohérent, zéro preuve visuelle. Voir `docs/audit-conversion.md` pour le diagnostic complet.

### Ce qu'on ne fait PAS
- On ne touche PAS au contenu des articles de blog existants (ils fonctionnent en SEO/GEO)
- On ne change PAS les URLs des articles de blog (protection des citations LLM)
- On ne crée PAS de faux témoignages, faux KPI, ou données non vérifiables
- On ne fait PAS de design "créatif" ou "bold" — l'objectif est sobre et professionnel

---

## Stack technique

| Composant | Technologie | Notes |
|-----------|-------------|-------|
| Générateur statique | Hugo Extended ≥0.145 | Obligatoire (support SCSS/Sass) |
| CSS | Tailwind CSS v4 | Config CSS-first via @theme, PAS tailwind.config.js |
| Config | TOML | 3 fichiers dans config/_default/ |
| Hébergement | Vercel | Déploiement automatique depuis GitHub |
| Repo | GitHub | Facostarr/lagencesauvage.com2 |
| CDN / Redirections | vercel.json | Redirections 301 au niveau CDN |
| Analytics | Plausible | Script existant — le conserver |
| Formulaire | Vercel Serverless | 4 fonctions existantes dans api/ — préservées |

---

## Bouclier SEO / GEO — Redirections 301

Le site actuel utilise `uglyURLs = true` (extensions .html). La refonte passe en pretty URLs. TOUTES les anciennes URLs doivent être redirigées en 301 dans vercel.json.

### Mapping complet des redirections

| Ancienne URL | Nouvelle URL |
|-------------|-------------|
| /services.html | /services/ |
| /realisations.html | /realisations/ |
| /about.html | /about/ |
| /blog.html | /blog/ |
| /ressources.html | /blog/ |
| /faq.html | /faq/ |
| /processus.html | /services/ |
| /diagnostic-transformation-ia.html | /diagnostic/ |
| /mentions-legales.html | /mentions-legales/ |
| /privacy.html | /privacy/ |
| /cgv.html | /cgv/ |
| /blog/art-du-prompt.html | /blog/art-du-prompt/ |
| /blog/saaspocalypse-tpe-pme.html | /blog/saaspocalypse-tpe-pme/ |
| /blog/ia-cabinet-comptable-donnees-2025-reussir-2026.html | /blog/ia-cabinet-comptable-donnees-2025-reussir-2026/ |
| /blog/roi-ia-pme-donnees-2025-reussir-2026.html | /blog/roi-ia-pme-donnees-2025-reussir-2026/ |
| /blog/crm-automatisation-woocommerce-2026.html | /blog/crm-automatisation-woocommerce-2026/ |
| /blog/l-ia-abordable-en-2025.html | /blog/l-ia-abordable-en-2025/ |
| /blog/automatiser-emails-gmail-ia.html | /blog/automatiser-emails-gmail-ia/ |
| /blog/impact-ia-pme-françaises-2025.html | /blog/impact-ia-pme-françaises-2025/ |

---

## Plan d'exécution par phases

### Phase 0 — Setup technique
- [ ] Créer branche `refonte-2026`
- [ ] Installer Tailwind CSS v4 (npm + PostCSS + Hugo Pipes)
- [ ] Migrer config Hugo : supprimer uglyURLs, mettre à jour menus, ajouter PostCSS aux security.exec
- [ ] Créer le vercel.json complet (redirections 301 + headers)
- [ ] Supprimer Hugo_projet/
- [ ] Ajouter .mcp.json au .gitignore
- [ ] Vérifier que `hugo server` tourne sans erreur
- [ ] Configurer HUGO_VERSION dans Vercel Environment Variables
- [ ] Vérifier taille des serverless functions au premier déploiement Vercel
- [ ] Push initial → vérifier Preview Vercel
- [ ] **STOP — Validation Franck**

### Phase 1 — Squelette et design system
- [ ] baseof.html (template maître)
- [ ] Partials : head, header, footer
- [ ] Palette de couleurs + typographie (skill brand-identity)
- [ ] Navigation responsive sobre
- [ ] Footer
- [ ] Page d'accueil vide avec layout de base
- [ ] Vérifier rendu mobile
- [ ] Push → **Validation Franck**

### Phase 2 — Homepage
- [ ] Hero : proposition de valeur + CTA audit gratuit
- [ ] Pain points (framework PAS)
- [ ] "Ce qu'on livre" avec preuves visuelles
- [ ] Social proof (UNIQUEMENT si vrais témoignages, sinon omettre)
- [ ] FAQ (avec schema markup FAQPage)
- [ ] CTA final
- [ ] Formulaire d'audit gratuit fonctionnel
- [ ] Meta tags + Open Graph + schema LocalBusiness
- [ ] Push → **Validation Franck**

### Phase 3 — Pages secondaires
- [ ] Services (offres séparées : abonnement vs diagnostic)
- [ ] À propos (photo, bio narrative, stack, LinkedIn, Qualiopi)
- [ ] Réalisations (case studies visuelles, titres bénéfice)
- [ ] Diagnostic IA (landing page dédiée)
- [ ] FAQ complète
- [ ] Pages légales (contenu existant, nouveau layout)
- [ ] Push → **Validation Franck**

### Phase 4 — Intégration blog

#### Pré-requis avant de coder le layout blog
1. Mapper la structure HTML actuelle des 8 articles (balises sémantiques, IDs titres, JSON-LD existant)
2. Le nouveau layout DOIT préserver : balise `<article>`, structure `<header>`, IDs auto-générés par Hugo pour les titres, dates exactes (date + lastmod)
3. Ajouter le schema markup BlogPosting/Article si absent

- [ ] Layout blog/single.html
- [ ] Layout blog/list.html
- [ ] Vérifier chaque article accessible à sa nouvelle URL
- [ ] Vérifier redirections anciennes URLs .html
- [ ] Conserver images blog existantes
- [ ] Push → **Validation Franck**

### Phase 5 — Quality gate pré-bascule
- [ ] Checklist conversion (skill conversion-audit-checklist)
- [ ] Checklist SEO (meta, schema, sitemap, OG)
- [ ] Checklist technique (responsive, a11y, perf, liens)
- [ ] Checklist redirections (tester chaque 301)
- [ ] Push final → **GO / NO-GO Franck**

### Phase 6 — Bascule
- [ ] PR de refonte-2026 vers main
- [ ] Franck merge
- [ ] Vérifier le site en live
- [ ] Tester les 301 en live
- [ ] Vérifier Plausible

### Phase 7 — Post-bascule (48h)
- [ ] Soumettre sitemap dans Google Search Console
- [ ] Forcer recrawl pages clés
- [ ] Monitorer 404 pendant 2 semaines
- [ ] Vérifier citations LLM (ChatGPT, Perplexity)

---

### Serverless Functions — Test local
`hugo server` ne fait PAS tourner les fonctions api/. Pour tester l'intégration formulaire + serverless : utiliser `vercel dev`. Non bloquant tant qu'on ne modifie pas les formulaires.

---

## Contraintes et garde-fous

1. Ne jamais inventer de témoignages, citations, ou avis clients
2. Ne jamais inventer de KPI ou statistiques
3. Ne jamais merger vers main sans GO explicite de Franck
4. Ne jamais modifier le contenu textuel des articles de blog
5. Max 2 emojis par page (idéalement 0)
6. Pas de gradients, couleurs saturées flashy, effets tape-à-l'œil
7. Pas de page /processus séparée

---

## Skills disponibles

| Skill | Quand la consulter |
|-------|--------------------|
| `agence-sauvage-brand-identity` | TOUJOURS en premier |
| `hugo-lagencesauvage` | Architecture Hugo, templates, config |
| `b2b-service-page-builder` | Avant chaque page (template persuasion) |
| `conversion-audit-checklist` | Avant chaque push (quality gate) |
| `docs/skills/page-cro` | Optimisation conversion par page |
| `docs/skills/copywriting` | Rédaction sections de copy |
| `docs/skills/form-cro` | Formulaire d'audit gratuit |
| `docs/skills/pricing-strategy` | Section tarifs/offres |
| `docs/skills/schema-markup` | Structured data SEO |

---

## Informations utiles

- **Repo GitHub :** github.com/Facostarr/lagencesauvage.com2
- **Plausible :** https://plausible.io/lagencesauvage.com
- **Site actuel :** https://www.lagencesauvage.com
- **Audit :** `docs/audit-conversion.md`
