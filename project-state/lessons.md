# Lessons Learned — Refonte lagencesauvage.com

## Architecture

- Le repo existant utilise `uglyURLs = true` (URLs .html). La refonte passe en pretty URLs — toutes les anciennes URLs doivent avoir des redirections 301 dans vercel.json.
- La config Hugo est en TOML (3 fichiers séparés dans config/_default/), pas YAML. On conserve TOML.
- Les serverless functions Vercel (api/submit-*.js) dépendent de Notion + nodemailer + pdfkit — les préserver intactes.
- Hugo_projet/ était un premier essai de Hugo pour le blog seul — 100% redondant avec la racine, à supprimer.

## Sécurité

- La clé API n8n était committée en clair dans .mcp.json. Ajouté au .gitignore. Penser à régénérer la clé.

## Tailwind v4 + Hugo

- Tailwind v4 ne scanne PAS automatiquement `layouts/` et `content/` depuis `assets/css/`. Il faut des directives `@source "../../layouts"` et `@source "../../content"` dans main.css.
- Ne jamais construire une classe Tailwind par concaténation dynamique dans les templates Go — le scanner ne résout pas les variables Go.

## Vercel

- Ne pas télécharger Hugo via curl dans le buildCommand. Utiliser `"framework": "hugo"` + variable d'environnement `HUGO_VERSION` dans Vercel Dashboard.
- Les serverless functions (api/) utilisent pdfkit + nodemailer = potentiellement lourd. Limite Vercel = 50MB zippé, timeout 10s (Hobby) / 15s (Pro). Surveiller au premier déploiement.
- Pour tester les serverless functions localement : `vercel dev` (pas `hugo server` qui ne les voit pas).

## SEO/GEO — Migration blog

- Les redirections 301 protègent le trafic entrant, mais les liens INTERNES dans le markdown des articles doivent aussi être mis à jour (sinon chaîne de redirection interne = mauvais pour le budget crawl).
- En Phase 4 (intégration blog), mapper la structure HTML actuelle des articles AVANT de coder le nouveau layout : balises sémantiques (article, header), IDs des titres, JSON-LD, dates. Un changement de DOM peut dégrader les citations LLM.
- Redirections = vercel.json UNIQUEMENT. Ne jamais utiliser les `aliases` Hugo (risque de conflit/boucle).

## Design

- L'audit converge (Claude + Gemini) sur 4 problèmes bloquants : témoignages fictifs, positionnement incohérent, zéro preuve visuelle, page About sous-exploitée.
- La skill frontend-design (Anthropic public) pousse vers le maximalisme — à NE PAS utiliser pour ce projet. La sobriété est l'objectif.
