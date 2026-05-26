# Lessons Learned — Refonte lagencesauvage.com

## Tailwind v4 — plugins doivent être déclarés explicitement (lesson 2026-05-26)

**Symptôme** : pendant des semaines, les pages `/simulateur-opco/{opco}/` et `/simulateur-opco/branches/{idcc}/` rendaient un mur de texte plat (H2/H3 sans hiérarchie, tables sans bordures, prose linéaire serrée), alors que le layout Hugo contenait des classes `prose prose-slate prose-h2:text-2xl prose-h2:sm:text-3xl prose-th:bg-slate-50 ...`. Aucune erreur de build.

**Diagnostic** : Tailwind CSS v4 (config CSS-first via `@theme`) **n'inclut PAS** automatiquement les plugins de l'écosystème v3 comme `@tailwindcss/typography`. Sans `@plugin "@tailwindcss/typography";` dans `main.css`, toutes les classes `prose-*` sont des classes inexistantes silencieusement ignorées — le markdown s'affiche en HTML browser-default.

**Règle dev** : pour Tailwind v4, **vérifier explicitement** que chaque plugin attendu est déclaré dans le CSS via `@plugin "..."`. Si une classe utilitaire qui devrait marcher n'a aucun effet visible et n'apparaît pas dans le CSS généré, soupçonner un plugin manquant **avant** de recoder en CSS pur.

**Bonus Gemini** : ne JAMAIS recréer en CSS pur ce qu'un plugin officiel maintenu fait gratuitement (j'avais initialement proposé une classe `.opco-prose` custom). Gemini m'a corrigé direct : "Tu réinventes la roue, install le plugin." 1 ligne d'import vs 200 lignes de CSS custom à maintenir.

## Pattern Doc-Landing > accordéons pour pages B2B fact-heavy (lesson 2026-05-26)

**Symptôme** : tentation initiale de cacher les sections "Analyse détaillée" (200+ lignes par page OPCO) dans des accordéons ou tabs pour aérer visuellement.

**Diagnostic Gemini** :
1. **UX cible RH/Dirigeants** : ce public fait du `Ctrl+F`. Si "FNE", "Plafond" ou "Alternance" est dans un accordéon fermé, le browser ne trouve pas. Frustration immédiate.
2. **SEO** : Google déprécie le contenu caché dans accordéons depuis Page Experience.
3. **GEO (Generative Engine Optimization)** : les crawlers LLM (Perplexity, ChatGPT, Claude) scrapent le DOM via parsers basiques. Contenu dans `<details closed>` ou `display:none` souvent ignoré ou dévalué.

**Règle UX/SEO/GEO** : pour les pages fact-heavy B2B (Wikipedia + landing), pattern **"Linear + Sticky TOC"** = standard 2024-2026. Contenu intégralement déplié + sticky TOC desktop pour donner l'illusion de navigation rapide. Références : Stripe Docs, Vercel Docs, gov.uk, service-public.fr.

**Anti-pattern à éviter** : remplacer une table de données factuelles par une card-grid "pour faire moderne". Les tables sont meilleures pour le scanning comparatif horizontal + les LLMs adorent `<table>` pour générer des réponses factuelles ("Quels dispositifs OPCO Atlas finance ?" → réponse directe depuis la `<table>`). Card-grid casse cette propriété.

## Script Python idempotent pour migrations en masse (lesson 2026-05-26)

**Symptôme** : 11 pages OPCO à migrer vers un nouveau layout (changement front matter + remplacement de 3 sections markdown par des shortcodes). Faire 10 Edits manuels = risque d'erreur + lent.

**Pattern** : un script Python qui (1) parse YAML+body, (2) extrait les données structurées des sections markdown via regex robustes, (3) réécrit le fichier avec le nouveau format, (4) **skip les fichiers déjà migrés** via une garde idempotente (`if fm.get("layout") == "new-layout": return False`).

**Bénéfice idempotence** : permet de relancer le script après bug fix (ex: ma regex initiale ne matchait pas "Dispositifs L'Opcommerce" car cherchait "Dispositifs OPCO"). Je `git checkout` les fichiers cassés et relance — le script saute les 9 déjà OK et ne refait que celui qui était cassé.

**Règle** : pour toute migration touchant >3 fichiers similaires, écrire un script idempotent **avant** d'éditer à la main. Le temps d'écrire le script (~30 min) est amorti dès la 2e itération de fix.

**Bonus YAML** : `yaml.dump(..., allow_unicode=True, default_flow_style=False, sort_keys=False, width=1000)` produit du YAML stable et lisible. Toujours `write_bytes(text.replace("\r\n", "\n").encode())` sur Windows (cf. ancienne leçon CRLF Hugo YAML parser bug).

## GTM / Product — biais "complétude BDD" vs "qualification ICP" (lesson 2026-05-24)

**Symptôme** : en construisant un simulateur lead magnet, j'ai voulu prioriser la complétude (couvrir le maximum de conventions collectives FR pour atteindre 100%). Gemini Pro a remonté que c'était un biais classique de product : optimiser pour le volume de données plutôt que pour la qualification du ICP.

**Diagnostic** : pour un lead magnet B2B avec offre abonnement IA 500€/mois, une PME de transport routier (700k salariés couverts) est un enfer à convertir. À l'inverse, une SASU IT/freelance sans salarié (hors OPCO classique, dépend d'Agéfice/FIFPL) est la cible la plus chaude — ce sont les early adopters évidents de l'IA.

**Règle product** : prioriser les sprints par **time-to-revenue ICP** plutôt que par volume de population couverte. Pour ASV : SASU IT/freelances > PME transport ou supermarchés. Mesurer en `taux_conversion_diag_par_segment`, pas en `nb_salaries_couverts`.

**Cible réaliste** : 80% du trafic réel (Pareto + data Plausible des trous récurrents) plutôt que 100% des IDCCs FR. Une fois les "Big 5" comblés, le sourcing devient à la demande, pas en masse.

## Sourcing manuel vs IA-assisté (lesson 2026-05-24)

**Symptôme** : j'ai estimé 3-4h de sourcing manuel pour extraire les barèmes 2026 d'une convention collective (lecture PDF OPCO + Légifrance + Service-Public + structuration JSON).

**Diagnostic Gemini** : "Tu es une agence IA, utilise tes outils." Pour une convention complète (PDC + AFEST + bonus + parcours stratégique + sources), un Claude Sonnet ou GPT-4o avec prompt structuré sort le JSON et les `notes_libres` rédigés en **45 min/convention** au lieu de 3-4h.

**Règle dev** : ne JAMAIS faire en manuel ce qu'un LLM peut faire en structurant correctement le prompt. Le coût marginal de l'IA est négligeable vs le temps fondateur. Surtout pour les agences IA — c'est notre dogfooding.

**Prompt type** :
```
Voici le PDF des critères de financement [OPCO] pour [IDCC X].
Extrais en JSON conforme à ce schéma : {plan_developpement_competences: {tranches_effectifs: [...]}, afest, bonus_thematiques, parcours_strategique, sources}.
Pour les `notes_libres`, rédige 1500-3000 chars de synthèse éditoriale orientée TPE/PME en français vouvoiement.
```

## Maintenance automatisée — scraper maison ≠ valeur pour solo founder (lesson 2026-05-24)

**Symptôme** : tentation de coder un scraper Python qui re-télécharge trimestriellement les sites OPCO pour détecter les changements de barèmes (Phase D de la roadmap initiale).

**Diagnostic Gemini** : les sites OPCO sont des "usines à gaz gouvernementales qui cassent le DOM tous les 4 matins". Automatiser le re-scraping = dette technique permanente + temps de maintenance > économie de veille.

**Règle ops solo founder** : préférer l'outil no-code + veille manuelle intelligente :
- **Visualping (free tier)** sur les URLs "Critères de financement" des OPCO → notification email si changement de texte
- **Abonnement newsletter Centre Inffo / France Compétences** pour alertes officielles
- 1h/trimestre de vérification manuelle > 3 jours de dev d'un scraper fragile

**Méta-règle** : pour un fondateur solo, le temps est la ressource la plus rare. Tout dev custom doit avoir un ROI > 10× son coût de maintenance. Sinon → no-code.

## Pages programmatiques SEO — drip vs publication massive (lesson 2026-05-24)

**Symptôme** : j'avais 59 fiches branches en BDD, tentation de publier les 39 restantes en une seule fois.

**Diagnostic Gemini** : Google Helpful Content Update pénalise les patterns programmatiques massifs même avec contenu unique (1000-3700 chars `notes_libres` par fiche). Le signal "publication explosive" est plus fort que le signal "contenu unique par page".

**Règle SEO** : publier en **drip** 3-5 pages/semaine maximum. Maîtriser le maillage interne progressivement (lien depuis la page mère vers les pages branches petit à petit). Choix data-driven via Plausible : prioriser les branches dont les NAFs ressortent en `simulator_idcc_not_in_list`.

## Hugo `where` pour filtrer pages avec param défini (lesson 2026-05-24)

**Pattern utilisé** dans les layouts `simulateur-opco/single.html` (section "Conventions associées") et `branches/single.html` (section "Branches voisines") :

```go
{{ $branches := where site.RegularPages "Params.branche_slug" "!=" nil }}
{{ $opcoBranches := where $branches "Params.branche_opco_slug" $opcoSlug }}
```

Astuce : `"Params.X" "!=" nil` filtre toutes les pages qui ont défini le param `X`, quelle que soit sa valeur. Permet de constituer une collection dynamique de pages programmatiques sans hardcoder une liste de slugs.

## Vercel env vars — bakées au build time pour Node.js serverless

- **Toute modification d'env var (ajout, valeur, scope Production/Preview) nécessite un nouveau build**. Vercel n'expose pas dynamiquement les nouvelles valeurs aux lambdas existantes. Symptôme typique : tu cliques "Save" dans Settings → Environment Variables, mais `process.env.MA_VAR` retourne toujours `undefined` côté lambda → c'est normal, fais un commit (vide si besoin : `git commit --allow-empty -m "force redeploy"`) et push.
- **Toujours vérifier le scope** d'une env var : "Production only" est le défaut Vercel UI quand tu en crées une. Pour qu'une branche feature accessible en Preview voit la même variable, il faut explicitement cocher **Preview** aussi. Sinon `NOTION_API_KEY undefined` côté Preview avec autres endpoints fonctionnels en Production.
- **Hobby tier = 12 serverless functions max**. Au-delà, le deploy passe en state ERROR sans message explicite après "Deploying outputs...". J'ai ajouté `api/simulate-opco-debug.js` qui a fait passer le compte à 13 → silent fail. Solution : supprimer le fichier excédentaire, ou upgrade Pro.

## Notion API — pièges fréquents (debug 2026-05-23)

- **Les Select n'acceptent JAMAIS d'options à la volée via l'API**. Si la propriété a été créée avec options=[], envoyer `{ select: { name: "valeur_pas_dans_la_liste" } }` retourne `validation_error: "Value must be one of the following: ... If a new select option is needed, the data source must be updated to add it."`. Pour valeurs non énumérables (codes NAF avec 700+ valeurs possibles, noms variables avec casses différentes) : **utiliser RICH_TEXT au lieu de SELECT**. Les filtres/regroupements Notion fonctionnent aussi sur rich_text.
- **À la création (`pages.create`), il faut OMETTRE les propriétés vides plutôt que d'envoyer `{ field: null }`**. Notion refuse `{ phone_number: null }`, `{ number: null }`, `{ select: null }` au create (valide uniquement à `pages.update` pour clear). Solution : construire le payload conditionnellement, n'ajouter une propriété que si la valeur est non-null.
- **Les intégrations Notion ne s'héritent JAMAIS automatiquement**, même si la nouvelle base est créée sous une page parent où l'intégration est déjà partagée. Toujours vérifier dans `···` → **Connections** sur la base elle-même. Ajouter manuellement l'intégration nommée (attention au nom exact — `"L'Agence Sauvage - Formulaire Site Web"` ≠ `"L'Agence Sauvage - Formulaire de Contact"`, plusieurs intégrations peuvent coexister).
- **Snapshot JSON volumineux** : la limite Notion sur rich_text est 2000 chars/segment. Pour archiver un payload JSON 4-6 KB en preuve d'audit, utiliser le BODY de la page (children, block `code` language json) plutôt qu'une propriété rich_text. Chunker le JSON en blocs de 1900 chars max.

## Debugging Vercel quand les logs sont tronqués

- Le viewer `mcp__vercel__get_runtime_logs` rend les messages dans une table Markdown qui tronque à ~30 chars. Grep ciblé fonctionne (`query="object_not_found"`) mais ne montre pas le contenu réel.
- **Solution pour MVP/preview** : exposer temporairement les détails de l'erreur dans la réponse HTTP via un champ `_debug_*`. Permet de copier-coller depuis le Network tab du navigateur ou via `curl` direct. À retirer dès que le bug est diagnostiqué.
- **Bypass deployment protection** : `mcp__vercel__get_access_to_vercel_url` génère un token de 23h. Cookie `_vercel_jwt` à sauver dans un fichier (`curl -c /tmp/cookies.txt -L "URL?_vercel_share=TOKEN"`) puis réutiliser pour les POST/GET suivants (`curl -b /tmp/cookies.txt -X POST ...`). Permet de tester un endpoint en POST sans repasser par le SSO browser.

## Hugo + Vercel — limites et conventions repo

- **Le repo n'utilise PAS Alpine.js** malgré ce que le PRD du Simulateur OPCO suggérait. Tous les formulaires multi-step existants (formation, lead magnets, diagnostic) sont en vanilla JS pur (querySelector + addEventListener + fetch + classList.toggle). Cohérence repo > suggestion PRD. Pour S5 : vanilla JS retenu (10 KB minified, zero dep).
- **Pattern de chargement JS par section** : conditionnel dans `baseof.html` (cf. blog.js ligne 81-87) OU bloc `scripts` défini dans le layout enfant (pattern utilisé pour `assets/js/simulateur-opco.js` via `resources.Get | minify | fingerprint`).
- **`{{ block "head" . }}{{ end }}`** dans `baseof.html` ligne 63 : permet d'injecter du schema markup par layout enfant via `{{ define "head" }}` (pattern utilisé pour `simulateur-opco/list.html` — JSON-LD WebApplication).

## Production d'articles

- **Audit anti-cannibalisation obligatoire** : avant de pusher tout nouvel article sur un sujet déjà couvert (agents IA, ROI, déploiement...), fetcher l'article existant le plus proche et comparer H2 par H2. Identifier les cas d'usage ou sections qui se chevauchent et les remplacer avant push. Coût : 5 min. Bénéfice : cluster SEO cohérent, pas de dilution de signal.
- **Gemini query pour challenger un plan** : utiliser `mcp__gemini__gemini-query` (model: pro, thinkingLevel: high) avec le contexte complet (articles existants + données disponibles + plan proposé). Gemini score 6.5/10 sur un plan "correct mais académique" → a identifié la cannibalisation, l'absence de levier légal (AI Act) et de levier financier (OPCO), et a proposé d'inverser la pyramide. Résultat : plan à 9/10.
- **Vault Hermes comme source de recherche** : le vault Obsidian (`C:\Users\franc\Obsidian\agence-sauvage`) contient les synthèses de recherche de l'agent Hermes (308 cas d'usage, insights NousResearch, contexte PME France). À lire en priorité pour tout article sur les agents IA avant de lancer des web searches — évite de redécouvrir ce qui est déjà catalogué.
- **Roadmap "6 semaines" > "6 mois"** pour un guide opérationnel PME : plus actionnable, plus vendeur, plus crédible (un premier agent en prod en 6 semaines est réaliste). "6 mois" suggère un projet lourd. Toujours préférer le délai le plus court qui reste honnête.

- **Liens croisés bidirectionnels** : quand deux articles couvrent des sujets complémentaires (ex: Claude Cowork + Claude for Small Business), ajouter un lien dans chaque sens avec une ancre descriptive et une raison de cliquer (résultat chiffré ou évolution temporelle). Une phrase suffit — éviter les blocs "À lire aussi" génériques.
- **Pivot "Stack US vs Stack FR"** : pour tout lancement Anthropic/OpenAI ciblant l'écosystème américain (QuickBooks, PayPal), l'angle différenciant systématique pour L'Agence Sauvage est "les équivalents français (Pennylane, Pipedrive, Sellsy) ont des API — voici comment on les connecte". Toujours vérifier avec Franck que les outils cités ont bien des API avant publication.
- **CTA formation OPCO** : pour les articles agents IA / automatisation, le CTA prioritaire est la formation sur mesure finançable OPCO, pas uniquement l'audit. Mentionner l'éligibilité OPCO dans le corps du texte (section conclusion) ET dans la FAQ (Q5).

## Architecture

- Le repo existant utilise `uglyURLs = true` (URLs .html). La refonte passe en pretty URLs — toutes les anciennes URLs doivent avoir des redirections 301 dans vercel.json.
- La config Hugo est en TOML (3 fichiers séparés dans config/_default/), pas YAML. On conserve TOML.
- Les serverless functions Vercel (api/submit-*.js) dépendent de Notion + nodemailer + pdfkit — les préserver intactes.
- Hugo_projet/ était un premier essai de Hugo pour le blog seul — 100% redondant avec la racine, à supprimer.

## Métriques de preuve sociale

- Les chiffres figés et liés au volume de clients ("6 projets") vieillissent mal et nécessitent une maintenance constante. Préférer des métriques système (executions n8n, fiabilité) evergreen.
- Les données n8n (executions, failure rate, runtime) sont une source de preuve sociale crédible et vérifiable — à mobiliser pour les pages de conversion.
- Traduire le jargon technique en bénéfice client : "2 587 executions, 0% failure" → "0 intervention humaine requise". Le dirigeant non-technique comprend le bénéfice, pas la métrique.
- Pour les chiffres à l'échelle mensuelle (10 000+/mois = 2 500/semaine × 4) : les volumes mensuels lissent les variations hebdomadaires et semblent plus institutionnels.

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

## Workflow éditorial — Règles de validation

- **Ne jamais pusher un article sans validation explicite de Franck.** Présenter le contenu complet dans la conversation et attendre un GO avant tout `git push`. Règle critique surtout pour les contenus mentionnant des tarifs, des chiffres ou des promesses commerciales — ce type de contenu peut dévaluer l'offre de l'agence aux yeux des prospects.
- **Jamais de grille de prix dans un article de blog.** Un article qui affiche "10-50€/mois" contre-dit directement une prestation vendue plusieurs centaines ou milliers d'euros. À la place : CTA vers l'audit gratuit pour qualifier le prospect et révéler le coût en contexte.
- **Workflow Deep Research Gemini** : lancer en parallèle de la rédaction (pas en attente bloquante). Le deep research prend 5-20 min — utiliser ce temps pour rédiger, puis enrichir avec les insights de Gemini sur les points critiques (limites, pièges, alternatives).

## Design

- L'audit converge (Claude + Gemini) sur 4 problèmes bloquants : témoignages fictifs, positionnement incohérent, zéro preuve visuelle, page About sous-exploitée.
- La skill frontend-design (Anthropic public) pousse vers le maximalisme — à NE PAS utiliser pour ce projet. La sobriété est l'objectif.
- Ne JAMAIS reprendre la palette existante d'un site en refonte quand l'audit identifie le design comme problème. Repartir de zéro avec une direction validée.
- Le brainstorm Claude + Gemini est efficace pour les décisions de direction visuelle — consensus rapide et argumenté.
