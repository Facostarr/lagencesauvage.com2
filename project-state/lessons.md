# Lessons Learned — Refonte lagencesauvage.com

## Architecture

- Le repo existant utilise `uglyURLs = true` (URLs .html). La refonte passe en pretty URLs — toutes les anciennes URLs doivent avoir des redirections 301 dans vercel.json.
- La config Hugo est en TOML (3 fichiers séparés dans config/_default/), pas YAML. On conserve TOML.
- Les serverless functions Vercel (api/submit-*.js) dépendent de Notion + nodemailer + pdfkit — les préserver intactes.
- Hugo_projet/ était un premier essai de Hugo pour le blog seul — 100% redondant avec la racine, à supprimer.

## Sécurité

- La clé API n8n était committée en clair dans .mcp.json. Ajouté au .gitignore. Penser à régénérer la clé.

## Case Studies / Réalisations

- Pour une page pilier (pillar page), l'approche "absorber" une case study dans un scope plus large est toujours préférable à créer des pages séparées : meilleur SEO, meilleur GEO, meilleur conversion. Consensus Claude + Gemini 9/10.
- Les données réelles de workflows n8n (nombre de nodes, flux technique) sont un différenciateur massif — montrer la vraie architecture plutôt que des descriptions vagues.
- L'angle narratif "cycle de vie d'un document" (vs catalogue de workflows) est plus convaincant pour les décideurs non-techniques.
- Pour le wow-factor, chercher le pont entre digital et physique (ex: API La Poste pour courrier recommandé automatique) — ça prouve qu'on va au bout du process.
- Utiliser l'API officielle La Poste (LReL via Okapi) plutôt que des prestataires tiers comme Merci Facteur — plus de légitimité auprès des cabinets comptables.
- Les accordion "détail technique" par pilier permettent de servir les deux audiences (décideur + technique) sans surcharger la page.

## Templates Hugo — pièges

- Ne jamais hardcoder un chemin d'asset (image, script) dans un layout partagé entre plusieurs pages. Toujours piloter par le front matter. Exemple : `architecture.image.src` dans le front matter, `{{ with .image }}` dans le template.
- Pour les liens de navigation internes (cliquables par l'utilisateur), toujours utiliser `.RelPermalink` (URL relative `/blog/slug/`) au lieu de `.Permalink` (URL absolue `https://domain.com/blog/slug/`). `.Permalink` utilise le `baseURL` de la config Hugo, ce qui casse la navigation sur les previews Vercel (domaine différent de la prod). Réserver `.Permalink` aux usages SEO : canonical, schema.org, RSS, meta OG.

## Tailwind v4 + Hugo

- Tailwind v4 ne scanne PAS automatiquement `layouts/` et `content/` depuis `assets/css/`. Il faut des directives `@source "../../layouts"` et `@source "../../content"` dans main.css.
- Ne jamais construire une classe Tailwind par concaténation dynamique dans les templates Go — le scanner ne résout pas les variables Go.
- `postcss-cli` est requis en devDependency pour que Hugo Pipes puisse exécuter PostCSS (erreur "binary postcss not found" sinon).
- Hugo 0.144+ : `:filename` deprecated dans les permalinks, utiliser `:contentbasename` à la place.
- **Hugo + PostCSS + Windows + espaces dans le chemin** : Hugo passe le chemin de `node_modules/.bin/postcss` sans quotes à l'interpréteur Windows → casse si le chemin contient des espaces. Solution : `subst S: "chemin complet"` crée un lecteur virtuel sans espaces. Builder depuis `S:\`. Le subst disparaît au redémarrage.

## Vercel

- La variable `HUGO_VERSION` dans le Dashboard Vercel ne fonctionne pas toujours. Solution fiable : `build.env.HUGO_VERSION` dans vercel.json directement.
- Ne pas télécharger Hugo via curl dans le buildCommand. Utiliser `"framework": "hugo"` + `build.env.HUGO_VERSION` dans vercel.json.
- Les serverless functions (api/) utilisent pdfkit + nodemailer = potentiellement lourd. Limite Vercel = 50MB zippé, timeout 10s (Hobby) / 15s (Pro). Surveiller au premier déploiement.
- Pour tester les serverless functions localement : `vercel dev` (pas `hugo server` qui ne les voit pas).

## SEO/GEO — Production de contenu

- **Toute citation doit avoir un lien hypertexte vérifiable** : les systèmes RAG (Perplexity, Google AI Overview) suivent activement les liens sortants pour vérifier les faits. Un article avec des sources liées = noeud d'information fiable = plus de chances d'être cité par les LLM. Consensus Claude + Gemini 8/10.
- Source primaire en priorité (étude originale, communiqué de presse). Si paywall : lier l'article paywall + une source secondaire accessible.
- Ancre descriptive obligatoire (ex: "[les prévisions de Gartner](url)"). Jamais "cette étude" ou "cliquez ici".
- Les liens sortants vers des sources autoritaires sont un signal E-E-A-T positif (pas de perte de "link juice" — mythe SEO dépassé). Utiliser des liens `dofollow` standard.
- Section "Sources et références" en bas de chaque article : les LLM valorisent les bibliographies structurées.

## SEO/GEO — Migration blog

- Les redirections 301 protègent le trafic entrant, mais les liens INTERNES dans le markdown des articles doivent aussi être mis à jour (sinon chaîne de redirection interne = mauvais pour le budget crawl).
- En Phase 4 (intégration blog), mapper la structure HTML actuelle des articles AVANT de coder le nouveau layout : balises sémantiques (article, header), IDs des titres, JSON-LD, dates. Un changement de DOM peut dégrader les citations LLM.
- Redirections = vercel.json UNIQUEMENT. Ne jamais utiliser les `aliases` Hugo (risque de conflit/boucle).

## Animations

- Pour un site B2B sobre, le consensus Claude + Gemini converge sur : micro-interactions > macro-animations. Easing expo `cubic-bezier(0.16, 1, 0.3, 1)`, translations max 12px, durées 200-600ms.
- Toujours wrapper les animations dans `@media (prefers-reduced-motion: no-preference)`.
- FAQ : le trick CSS grid `grid-template-rows: 0fr → 1fr` remplace avantageusement les `<details>` natifs pour les animations fluides d'ouverture/fermeture.
- IntersectionObserver : unobserver après trigger pour éviter les re-animations au scroll up/down.

## Stratégie offres / Pricing

- Le brainstorm Claude + Gemini est très efficace pour les décisions stratégiques (naming, architecture offres, pricing psychology). Consensus rapide en 1-2 rounds.
- En B2B avec faible trafic (~450/trimestre), centraliser les offres sur 1 page comparative plutôt que disperser sur des pages dédiées. Exception : landing pages SEO pour des requêtes long-tail spécifiques.
- Ne pas mettre le nom d'un outil technique (n8n, Make...) dans le titre d'une offre B2B. Le client achète un bénéfice, pas un outil. La technique va dans les bullet points.
- L'effet leurre Good-Better-Best fonctionne quand l'offre "Best" englobe les deux autres à un prix qui semble avantageux comparé à la somme des offres isolées.

## Logo / Branding

- Pour un logo web, les SVG avec balises `<text>` dépendent des fonts installées/chargées. En production, convertir en `<path>` (text-to-path dans Inkscape) pour un rendu garanti partout.
- Gemini generate-image est efficace pour explorer des directions de logo (5 planches = 30+ concepts en ~20 min) mais les résultats sont des rasters, pas des SVG vectoriels exploitables directement. Le SVG final doit être codé à la main ou retracé.
- Le brainstorm Claude + Gemini sur le branding converge vite (1 round, consensus 8/10) quand les contraintes sont précises (palette, typo, style référence).

## Homepage / Conversion

- Sur une homepage B2B à faible trafic, la section "réalisations" doit CRÉDIBILISER, pas INFORMER en détail. Un chiffre héroïque en gros + 1 phrase vaut mieux que 4 cartes détaillées avec tags stack. Les case studies complètes ont leur propre page.
- Ne pas afficher de tags stack technique (n8n, Supabase...) sur la homepage : un dirigeant TPE achète du résultat ("15h gagnées"), pas un outil. La stack a sa place sur les pages case studies et la page About.
- Itérer vite avec le fondateur : mieux vaut proposer, se faire corriger ("c'est trop"), et brainstormer une v2 que de chercher la perfection du premier coup.

## Landing pages campagne

- Pour une LP cold email B2B ciblant une audience conservatrice (experts-comptables, avocats), **ne pas implémenter de dark mode**. Le `prefers-color-scheme: dark` automatique crée des problèmes de contraste non testés. Forcer le light mode avec `<meta name="color-scheme" content="light">`.
- Les fichiers HTML statiques dans `static/lp/` de Hugo sont servis directement par Vercel sans passer par le pipeline Hugo — parfait pour des LP campagne standalone.
- L'API `/api/submit-lead` exige `company_size` (champ obligatoire). Pour une LP sans ce champ visible, ajouter un `<input type="hidden" name="company_size" value="6-20">`.
- La source du lead contrôle l'envoi du guide PDF : si `source.includes('Landing Page')`, le guide est envoyé. Nommer la source "Campagne Email - ..." pour éviter cet envoi si non souhaité.
- Un mockup réel (conversation WhatsApp avec facture) above the fold est infiniment plus convaincant qu'un schéma abstrait — l'expert-comptable comprend le produit en 2 secondes.

## Design

- L'audit converge (Claude + Gemini) sur 4 problèmes bloquants : témoignages fictifs, positionnement incohérent, zéro preuve visuelle, page About sous-exploitée.
- La skill frontend-design (Anthropic public) pousse vers le maximalisme — à NE PAS utiliser pour ce projet. La sobriété est l'objectif.
- Ne JAMAIS reprendre la palette existante d'un site en refonte quand l'audit identifie le design comme problème. Repartir de zéro avec une direction validée.
- Le brainstorm Claude + Gemini est efficace pour les décisions de direction visuelle — consensus rapide et argumenté.
