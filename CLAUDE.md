# lagencesauvage.com

Site vitrine, blog et outils de capture de leads de L'Agence Sauvage.
Hugo Extended, Tailwind CSS v4 (config CSS-first), fonctions serverless Vercel. **Un push sur `main` déploie en production.**
La refonte de mars 2026 est terminée. Le travail courant : contenu (blog SEO/GEO, réalisations) et capture (simulateur OPCO, lead magnets).
Phase et chantier en cours : `project-state/status.md`.

## Ce que la lecture du repo ne dit pas

**Simulateur OPCO.** Le sous-système le plus actif, en quatre morceaux qui doivent rester cohérents :
`data/opco-database.json` (données) → `lib/simulateur-opco/compute_budget.js` (moteur, source unique de vérité, il n'existe aucun port Python)
→ `api/simulate-opco-{lookup,resolve,compute}.js` (endpoints) → `content/simulateur-opco/` (pages générées par `scripts/generate-opco-*.py`, jamais éditées à la main).
Toute modification du moteur se vérifie par `npm test` : deux des trois suites sont celles du simulateur.

**Lead magnets.** Un seul endpoint, `api/submit-lead-magnet.js`, avec une config `MAGNETS` interne.
Ajouter un magnet = ajouter une entrée dans cette config, jamais un nouveau fichier dans `api/`.
Le plan Vercel Hobby plafonne à 12 fonctions et le dépassement fait échouer le deploy **en silence** (incident réel, voir `lessons.md`).
Compter avec `ls api/*.js` avant d'en créer une ; les fichiers préfixés `_` n'en sont pas.

**Redirections.** `vercel.json` est la source unique. Ne jamais utiliser les `aliases` Hugo : la convention est tenue à zéro occurrence dans `content/`, ne pas l'ouvrir.

**Build.** La version Hugo qui fait foi est celle épinglée dans `vercel.json` (`HUGO_VERSION`), pas celle du PATH.
Au 2026-08-04 elles divergent (0.158.0 épinglée, 0.163.0 en local) : un build local qui passe ne prouve pas que Vercel passera.
Pas de `tailwind.config.js` : palette et typo vivent dans le bloc `@theme` de `assets/css/main.css`.

**Classes Tailwind.** Dans les templates Go, jamais de classe construite par concaténation (`bg-{{ .Params.color }}-500`) : elle n'existe pas au build. Classes complètes ou mapping explicite.

**Non versionné.** `.claude/` est dans `.gitignore` : les skills et les commandes de ce projet n'existent que sur cette machine.
Ne pas les confondre avec `docs/skills/`, qui est versionné mais inerte (Claude Code ne le charge pas).

## Contenu

1. **Zéro invention.** Aucun témoignage, citation, avis, KPI ou chiffre qui ne vienne pas de Franck ou d'une source citée en lien.
2. **Validation avant publication.** Tout article ou page de contenu est présenté à Franck dans la conversation et attend un GO explicite avant `git push`, puisque le push déploie en prod. Vaut en priorité pour les tarifs, les chiffres, les promesses commerciales et le positionnement des offres.
3. **Sources.** Jamais une agence IA ou digitale concurrente, jamais un lien vers une page d'accueil. Chaque chiffre porte un lien vers sa source, avec une ancre descriptive, plus une section « Sources et références » en fin d'article.
4. **Le texte ne doit pas se lire comme du texte généré.** Le tiret cadratin en est le marqueur le plus visible : le blog a été nettoyé rétroactivement (47 occurrences sur un seul article), donc par défaut on n'en met pas, on écrit avec une virgule, un point, un deux-points ou des parenthèses. Un tiret isolé dans un long texte ne condamne rien, une prose qui en est constellée si. `grep -n '[—–]' <fichier>` sert à voir l'ampleur, pas à valider un compteur à zéro.
5. **Corps des articles déjà publiés** : ne pas le modifier sans demande de Franck (acquis SEO/GEO). Front matter et layouts, oui. Écrire de nouveaux articles est en revanche le travail courant.
6. Vouvoiement sur le site, tutoiement avec Franck. Un seul CTA principal par page. Sobriété : zéro à deux emojis, pas de gradient, pas de photo stock.

## Où chercher le reste

- `project-state/lessons.md` : les pièges déjà payés (Hugo, JSON-LD, images, limites Vercel, collisions d'angles entre articles). À lire avant de rouvrir un sujet qui a déjà cassé.
- `project-state/next-tasks.md` : backlog antéchronologique, lire la section du haut et pas le fichier entier.
- `docs/playbook-refonte.md` et `docs/audit-conversion.md` : archives de la refonte de mars 2026. Contexte historique, plus une consigne d'exécution.
- Charte, ton, lexique et positionnement ASV : skills `agence-sauvage-brand-identity` et `agence-sauvage-tone`. Ne pas les recopier ici.
- `.claude/skills/README-arbitrage.md` : pourquoi les skills importées de packs tiers se marchent dessus, et lesquelles gardent la main.

## Communication

Français, tutoiement, direct et concis. Trois questions maximum par message.
Si une information manque : le dire, proposer deux ou trois options avec leurs arbitrages, ne jamais inventer.
