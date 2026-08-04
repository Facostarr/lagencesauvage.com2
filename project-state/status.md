# État du projet

Ce fichier décrit ce qui EST. Le déroulé des sessions va dans `changelog.md`, jamais ici.
Réécrit le 2026-08-04 (l'ancien fichier, 48 Ko de journal, est dans `archive/status-journal.md`).

## Phase 7, post-bascule

La refonte (phases 0 à 6) est terminée depuis mars 2026. Branche de travail : `main`.
Un push sur `main` déploie en production Vercel. `refonte-2026` est archivée.

## Chantier courant

Production de contenu et capture de leads.

- Blog SEO/GEO : 31 fichiers dans `content/blog/` au 2026-08-04.
- Simulateur OPCO : page `/simulateur-opco/`, ses pages OPCO et ses fiches branches.
- Lead magnets : un endpoint unique, `api/submit-lead-magnet.js`.

## Ouvert

### Actions Franck, hors repo

- Search Console : soumettre `/blog/ai-act-2-aout-2026-obligations-pme/`, demander le recrawl de `ai-act-formation` et `agent-ia-definition` (corrigés le 2026-07-29).
- Notion : supprimer les entrées de test restantes (5 leads de debug sur la base simulateur, plus « Test / beforbiz@gmail.com »).
- Rotation de la clé n8n : voir la dette ci-dessous.

### Dettes

- **Clé API n8n exposée.** `.mcp.json` contient un `N8N_API_KEY` réel et le fichier est présent dans l'historique du dépôt GitHub public `Facostarr/lagencesauvage.com2`. Le fichier a été désindexé le 2026-08-04 (`git rm --cached .mcp.json`, en attente de commit), ce qui empêche les prochains commits de l'emporter mais ne retire rien de l'historique déjà poussé. La rotation de la clé côté n8n reste à faire par Franck.
- Lead magnet C « Kit IA pour cabinet comptable » : concept validé, jamais démarré.
- Article « SaaS-replacement » (agents IA qui remplacent des SaaS) : validé en mars 2026, jamais écrit.
- Commande `/new-article` : évoquée plusieurs fois, jamais créée.
- `docs/skills/` : 49 dossiers de skills plus un fichier `.skill`, soit 179 fichiers et 1,33 Mo, tous suivis par git et inertes (Claude Code ne charge que `.claude/skills/`). Cinq portent le même nom qu'une skill active : `ai-seo`, `copywriting`, `form-cro`, `page-cro`, `schema-markup`. Seul `docs/playbook-refonte.md` y renvoie encore, et c'est une archive. Arbitrage à rendre : documentation à conserver, ou 1,33 Mo à sortir du dépôt.

### À revérifier avant de s'y fier

- Un blocage « `RESEND_API_KEY` manquante ou expirée sur Vercel, formulaires diagnostic et formation en 500 » a été noté le 2026-05-06 et jamais reconfirmé depuis. Des envois Resend ont réussi après cette date (validation e2e du simulateur, 2026-05-23). Tester avant d'agir.

## Décisions en attente

Aucune. Logo et Calendly ont été tranchés en mars 2026.

## Où est le reste

| Fichier | Contenu |
|---|---|
| `changelog.md` | Le récit de chaque session, antéchronologique. |
| `next-tasks.md` | Le backlog, antéchronologique : lire la section du haut, pas le fichier. |
| `lessons.md` | Les pièges déjà payés (Hugo, JSON-LD, images, collisions d'angles entre articles). |
| `archive/status-journal.md` | L'ancien `status.md` : journal de session et checklists des phases 0 à 7. |
