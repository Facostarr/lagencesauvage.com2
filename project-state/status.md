# État du projet

Ce fichier décrit ce qui EST. Le déroulé des sessions va dans `changelog.md`, jamais ici.
Réécrit le 2026-09-12 (l'ancien fichier, 48 Ko de journal, est dans `archive/status-journal.md`).

## Phase 7, post-bascule

La refonte (phases 0 à 6) est terminée depuis mars 2026. Branche de travail : `main`.
Un push sur `main` déploie en production Vercel. `refonte-2026` est archivée.

## Chantier courant

Production de contenu et capture de leads, avec une inflexion prise le 2026-08-21 :
**la production d'articles neufs est suspendue** tant que la falaise du rang 5 n'est pas franchie
sur les pages qui ont déjà de la demande. Le travail porte sur le rang et les titres des pages
existantes, pas sur du volume neuf. Détail dans `lessons.md` et dans la section du haut de `next-tasks.md`.

**Premier coup porté le 2026-09-12** : les 34 titres du cluster simulateur sont réécrits et en production
(`78d9668`). Le mot « Simulateur » entre dans les fiches OPCO, l'OPCO entre dans les fiches branches.
Rien ne se juge avant le recrawl. Mesure programmée au 12 octobre par la tâche locale `gsc-simulateur-j30`.

- Blog SEO/GEO : `ls content/blog/*.md | wc -l` pour le compte réel.
- Simulateur OPCO : page `/simulateur-opco/`, ses pages OPCO et ses fiches branches.
- Lead magnets : un endpoint unique, `api/submit-lead-magnet.js`.

## Outillage de mesure

Trois sources, aucune ne couvre les autres.

| Outil | Où | Ce qu'il voit |
|---|---|---|
| Search Console | connectée nativement à OpenSEO + `gsc_pull.py` sur vps1-prod | Ce sur quoi le site est déjà classé. Aveugle sur le reste. Lisible par MCP depuis le 2026-09-12, sans crédit. |
| GEO Citation Tracker | `/opt/geo-citation-tracker`, vps1-prod | Citations du site dans les réponses des LLM. Cron en pause. |
| OpenSEO | `/opt/open-seo`, vps1-prod, depuis le 2026-09-12 | Backlinks, keyword gap concurrentiel, rank tracking, SERP. |

OpenSEO est self-hébergé et pilotable par MCP depuis Claude Code. Son installation, ses pièges
d'exploitation et son modèle de coût vivent dans `project-state/openseo.md`, pas ici.
**Ahrefs ne sort plus rien** (vérifié le 2026-09-12) : `public-domain-rating-free` comme
`site-explorer-domain-rating` renvoient `Insufficient plan`. La note antérieure, « seul le Domain Rating
en sort », est caduque. L'autorité se mesure désormais par `get_backlinks_overview` d'OpenSEO, à 0,10 $ l'appel.

**Googlebot visite le cluster simulateur tous les 13 à 71 jours** (mesuré le 2026-09-12 par `inspect_urls`) :
hub 13 j, métallurgie 27 j, AKTO 28 j, HCR 45 j, Syntec 66 j, Atlas 71 j. Toutes indexées, canonical conforme,
rich results PASS : il n'y a aucun défaut technique, seulement une fréquence de visite faible. Conséquence
opérationnelle : un titre réécrit met des semaines à exister en SERP, et aucune passe de balises ne l'accélère.
La fréquence de crawl suit l'autorité et le maillage, ce qui redit le diagnostic d'août par un autre chemin.

**Le domaine canonique est `www`.** Vérifié le 2026-09-12 par l'API d'inspection d'URL :
`https://www.lagencesauvage.com/` est indexée, l'apex renvoie « Page with redirect », et une URL apex
profonde comme `https://lagencesauvage.com/simulateur-opco/` est inconnue de Google. Toute inspection
d'URL et tout suivi de rang visent donc la forme `www`, quelle que soit celle qu'affiche l'outil.

## Ouvert

### Actions Franck, hors repo

- Search Console : soumettre `/blog/etude-citations-ia-agences-pme-2026/`, `/blog/ai-act-2-aout-2026-obligations-pme/`, et demander le recrawl de `hermes-agent-ia-autonome-dirigeant-tpme` (titre modifié le 2026-08-20), `ai-act-formation` et `agent-ia-definition` (corrigés le 2026-07-29).
- Search Console : demander l'indexation des six pages du cluster simulateur (`/simulateur-opco/`, `/akto/`, `/atlas/`, et les branches `akto-hcr-1979`, `opco2i-metallurgie-3127`, `syntec-1486`) pour forcer le recrawl et rendre la mesure du 12 octobre exploitable. L'API d'inspection est en lecture seule et l'Indexing API de Google ne couvre que les offres d'emploi et les événements : ça passe par l'interface, à la main.
- Notion : supprimer les entrées de test restantes (5 leads de debug sur la base simulateur, plus « Test / beforbiz@gmail.com »).
- Rotation de la clé n8n : voir la dette ci-dessous.
- **DataForSEO** : solde de 1 $, intact, rien n'a été consommé. Arbitrage rendu le 2026-09-12, **pas de recharge pour l'instant**. Search Console couvre gratuitement le chantier courant, et ce que les 50 $ achètent vraiment, backlinks et link prospecting, attend deux préalables : une liste de concurrents, et l'arbitrage sur le trafic Hermes. À recharger au lancement du link prospecting, pas avant.

### Dettes

- **Clé API n8n exposée.** `.mcp.json` n'est plus suivi par git (le `git rm --cached` du 2026-08-04 a bien été commité, vérifié le 2026-09-12), donc les prochains commits ne l'emporteront plus. Mais la clé reste dans l'historique déjà poussé du dépôt public `Facostarr/lagencesauvage.com2`. **Seule la rotation côté n8n ferme cette dette**, et elle n'est pas faite.
- **Deux pages sans Open Graph ni meta description** : `/ressources/kit-claude-cowork-pme/` et `/lp/collecte-whatsapp-pennylane/` n'appellent pas `meta-seo.html`, faute d'étendre `baseof.html`. Vérifié le 2026-09-12 en rebuildant l'état antérieur : la dette précède le chantier Open Graph, elle n'en vient pas. Réparable, mais ça touche à la structure de deux layouts autonomes.
- **`generate-opco-subpages.py` ne produit pas l'état final des fiches OPCO** : `migrate-opco-to-fiche-layout.py` doit tourner derrière lui pour poser `layout: opco-fiche` et `branches_idcc`. Régénérer seul défait la migration en silence. Un avertissement est dans le générateur et la leçon dans `lessons.md`, mais le générateur reste désynchronisé.
- Lead magnet C « Kit IA pour cabinet comptable » : concept validé, jamais démarré.
- Article « SaaS-replacement » (agents IA qui remplacent des SaaS) : validé en mars 2026, jamais écrit. Gelé de fait par la suspension des articles neufs.
- Commande `/new-article` : évoquée plusieurs fois, jamais créée.
- `docs/skills/` : 179 fichiers, 1,8 Mo, tous suivis par git et inertes (Claude Code ne charge que `.claude/skills/`). Cinq portent le même nom qu'une skill active : `ai-seo`, `copywriting`, `form-cro`, `page-cro`, `schema-markup`. Seul `docs/playbook-refonte.md` y renvoie encore, et c'est une archive. Arbitrage à rendre : documentation à conserver, ou 1,8 Mo à sortir du dépôt.
- `.claude/skills/README-arbitrage.md` : table de décision de 14 skills tierces, dressée le 2026-08-04, **jamais appliquée**. Sa ligne `keyword-research` est désormais caduque, son motif était l'absence d'outils de volume de recherche, ce qui n'est plus vrai depuis OpenSEO.

### À revérifier avant de s'y fier

- Un blocage « `RESEND_API_KEY` manquante ou expirée sur Vercel, formulaires diagnostic et formation en 500 » a été noté le 2026-05-06 et jamais reconfirmé depuis. Des envois Resend ont réussi après cette date (validation e2e du simulateur, 2026-05-23). Tester avant d'agir.
- **Bot Fight Mode est désactivé** sur la zone Cloudflare `lagencesauvage.com` depuis le 2026-09-12. L'arbitrage tenait à un état vérifié ce jour-là : le site vitrine est sur Vercel en DNS-only, et les seuls hostnames proxifiés, `seo.` et `crm.`, sont derrière Cloudflare Access. Ajouter un hostname proxifié sans Access invaliderait ce raisonnement.

## Décisions en attente

- **Trafic Hermes : la question du trafic est tranchée, celle de l'offre ne l'est pas.** Analyse du 2026-09-12,
  quatre modèles interrogés via orouter, verdict unanime. **Ce trafic n'est pas un marché exploitable** :
  intention incompatible (ces gens cherchent le logiciel gratuit de Nous Research), volume de ~185 clics
  par mois en extinction, et aucun prix viable pour une prestation d'installation. Le chantier « falaise du
  rang 5 » ne doit donc pas viser cette page. Le correctif de titre du 20 août a gagné 61 % de CTR en perdant
  37 % de clics : ne pas y revenir, le trafic restant est mieux qualifié.
  **Reste ouvert** : Franck envisage une offre d'entrée de mise en place d'agent autonome, moins lourde que le
  diagnostic de cinq jours. Les modèles ont jugé le trafic, pas l'offre, qu'ils ont d'ailleurs presque tous
  confondue avec l'installation du projet tiers. Cette offre peut tenir debout, mais alors construite sur de
  vrais prospects et sous un autre nom que Hermes. Et la page elle-même n'a toujours pas de porte de sortie.

- ~~Point d'entrée léger sur le site.~~ **Tranché le 2026-09-12 : Calendly assumé.** Le CTA des articles de
  blog pointe vers `https://calendly.com/franck-lagencesauvage/30min`, ce que faisaient déjà l'étude d'août
  et l'article Hermes. Pas de page de contact courte à créer. Ce qui reste ouvert et distinct : la
  redirection 301 de `/contact/` vers `/diagnostic/`, et les huit liens internes qui la traversent encore.
- Cron GEO : 0,63 € par requête après allègement contre 1,10 € avant, la cible n'est pas atteinte parce que Grok n'a pas de variante non-reasoning. À trancher : run mensuel restreint aux requêtes `discovery`, ou abandon.

## Où est le reste

| Fichier | Contenu |
|---|---|
| `changelog.md` | Le récit de chaque session, antéchronologique. |
| `next-tasks.md` | Le backlog, antéchronologique : lire la section du haut, pas le fichier. |
| `lessons.md` | Les pièges déjà payés (Hugo, JSON-LD, images, collisions d'angles entre articles). |
| `openseo.md` | L'instance OpenSEO : exposition, accès, coûts, pièges d'exploitation. |
| `archive/status-journal.md` | L'ancien `status.md` : journal de session et checklists des phases 0 à 7. |
