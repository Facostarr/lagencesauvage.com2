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

- Blog SEO/GEO : `ls content/blog/*.md | wc -l` pour le compte réel.
- Simulateur OPCO : page `/simulateur-opco/`, ses pages OPCO et ses fiches branches.
- Lead magnets : un endpoint unique, `api/submit-lead-magnet.js`.

## Outillage de mesure

Trois sources, aucune ne couvre les autres.

| Outil | Où | Ce qu'il voit |
|---|---|---|
| Search Console | via `gsc_pull.py` sur vps1-prod | Ce sur quoi le site est déjà classé. Aveugle sur le reste. |
| GEO Citation Tracker | `/opt/geo-citation-tracker`, vps1-prod | Citations du site dans les réponses des LLM. Cron en pause. |
| OpenSEO | `/opt/open-seo`, vps1-prod, depuis le 2026-09-12 | Backlinks, keyword gap concurrentiel, rank tracking, SERP. |

OpenSEO est self-hébergé et pilotable par MCP depuis Claude Code. Son installation, ses pièges
d'exploitation et son modèle de coût vivent dans `project-state/openseo.md`, pas ici.
Le plan Ahrefs connecté reste limité : seul le Domain Rating en sort.

## Ouvert

### Actions Franck, hors repo

- Search Console : soumettre `/blog/etude-citations-ia-agences-pme-2026/`, `/blog/ai-act-2-aout-2026-obligations-pme/`, et demander le recrawl de `hermes-agent-ia-autonome-dirigeant-tpme` (titre modifié le 2026-08-20), `ai-act-formation` et `agent-ia-definition` (corrigés le 2026-07-29).
- Notion : supprimer les entrées de test restantes (5 leads de debug sur la base simulateur, plus « Test / beforbiz@gmail.com »).
- Rotation de la clé n8n : voir la dette ci-dessous.
- **DataForSEO** : le compte tourne sur le crédit de bienvenue de 1 $. De quoi valider la chaîne, pas de quoi mener un audit ni monter un rank tracker. La recharge minimum est de 50 $, en pay-as-you-go sans abonnement. Décision à prendre après les premiers appels réels.

### Dettes

- **Clé API n8n exposée.** `.mcp.json` n'est plus suivi par git (le `git rm --cached` du 2026-08-04 a bien été commité, vérifié le 2026-09-12), donc les prochains commits ne l'emporteront plus. Mais la clé reste dans l'historique déjà poussé du dépôt public `Facostarr/lagencesauvage.com2`. **Seule la rotation côté n8n ferme cette dette**, et elle n'est pas faite.
- Lead magnet C « Kit IA pour cabinet comptable » : concept validé, jamais démarré.
- Article « SaaS-replacement » (agents IA qui remplacent des SaaS) : validé en mars 2026, jamais écrit. Gelé de fait par la suspension des articles neufs.
- Commande `/new-article` : évoquée plusieurs fois, jamais créée.
- `docs/skills/` : 179 fichiers, 1,8 Mo, tous suivis par git et inertes (Claude Code ne charge que `.claude/skills/`). Cinq portent le même nom qu'une skill active : `ai-seo`, `copywriting`, `form-cro`, `page-cro`, `schema-markup`. Seul `docs/playbook-refonte.md` y renvoie encore, et c'est une archive. Arbitrage à rendre : documentation à conserver, ou 1,8 Mo à sortir du dépôt.
- `.claude/skills/README-arbitrage.md` : table de décision de 14 skills tierces, dressée le 2026-08-04, **jamais appliquée**. Sa ligne `keyword-research` est désormais caduque, son motif était l'absence d'outils de volume de recherche, ce qui n'est plus vrai depuis OpenSEO.

### À revérifier avant de s'y fier

- Un blocage « `RESEND_API_KEY` manquante ou expirée sur Vercel, formulaires diagnostic et formation en 500 » a été noté le 2026-05-06 et jamais reconfirmé depuis. Des envois Resend ont réussi après cette date (validation e2e du simulateur, 2026-05-23). Tester avant d'agir.
- **Bot Fight Mode est désactivé** sur la zone Cloudflare `lagencesauvage.com` depuis le 2026-09-12. L'arbitrage tenait à un état vérifié ce jour-là : le site vitrine est sur Vercel en DNS-only, et les seuls hostnames proxifiés, `seo.` et `crm.`, sont derrière Cloudflare Access. Ajouter un hostname proxifié sans Access invaliderait ce raisonnement.

## Décisions en attente

- Point d'entrée léger sur le site : `/contact/` redirige en 301 vers `/diagnostic/`, qui vend cinq jours d'immersion. Un lecteur d'article qui veut juste échanger n'a rien à cliquer, et deux articles contournent déjà par Calendly. À trancher : page de contact courte, ou Calendly assumé.
- Cron GEO : 0,63 € par requête après allègement contre 1,10 € avant, la cible n'est pas atteinte parce que Grok n'a pas de variante non-reasoning. À trancher : run mensuel restreint aux requêtes `discovery`, ou abandon.

## Où est le reste

| Fichier | Contenu |
|---|---|
| `changelog.md` | Le récit de chaque session, antéchronologique. |
| `next-tasks.md` | Le backlog, antéchronologique : lire la section du haut, pas le fichier. |
| `lessons.md` | Les pièges déjà payés (Hugo, JSON-LD, images, collisions d'angles entre articles). |
| `openseo.md` | L'instance OpenSEO : exposition, accès, coûts, pièges d'exploitation. |
| `archive/status-journal.md` | L'ancien `status.md` : journal de session et checklists des phases 0 à 7. |
