# État du projet

Ce fichier décrit ce qui EST. Le déroulé des sessions va dans `changelog.md`, jamais ici.
Réécrit le 2026-09-12 (l'ancien fichier, 48 Ko de journal, est dans `archive/status-journal.md`).

## Phase 7, post-bascule

La refonte (phases 0 à 6) est terminée depuis mars 2026. Branche de travail : `main`.
Un push sur `main` déploie en production Vercel. `refonte-2026` est archivée.

## Chantier courant

Production de contenu et capture de leads, avec une inflexion du 2026-08-21 :
**la production d'articles neufs est suspendue** tant que la falaise du rang 5 n'est pas franchie sur les
pages qui ont déjà de la demande. Le travail porte sur le rang des pages existantes, pas sur du volume neuf.

**L'audit complet du 2026-09-12 a confirmé ce diagnostic par trois chemins indépendants** et il fait
référence : `audit-seo-geo-2026-09.md`. Ce qu'il faut en retenir ici, le reste est dans le rapport :

- **Le déficit est l'autorité, pas la technique.** Sur 91 pages : zéro titre manquant ou dupliqué, zéro
  `H1` absent, zéro JSON-LD invalide, zéro image sans `alt`, zéro lien interne cassé. Mais 54 domaines
  référents dont 28 des 32 non-spam ont une autorité nulle, et le site est absent des SERP commerciales.
- **La falaise, chiffrée hors Hermes** : positions 1 à 5 = 8,6 % des impressions et 47,8 % des clics ;
  positions 10 et au-delà = 55,5 % des impressions et 8,4 % des clics. Gagner deux places entre la 6e et la
  4e double le rendement, en gagner quatre entre la 12e et la 8e ne rapporte rien.
- **Hermes pèse 44,7 % des clics du site.** Le retirer fait tomber le CTR de 0,96 % à 0,63 % et la position
  moyenne de 9,13 à 18,1. **Tout suivi qui ne le sépare pas mesure Hermes.**

**Prochain livrable** : l'article « Quelle agence IA choisir pour une PME », brief prêt et autonome dans
`brief-article-choisir-agence-ia.md`. Il ne rouvre pas la suspension, puisqu'il vise des requêtes à demande
existante.

- Blog : `ls content/blog/*.md | wc -l` pour le compte réel.
- Simulateur OPCO : page `/simulateur-opco/`, ses pages OPCO et ses fiches branches.
- Lead magnets : un endpoint unique, `api/submit-lead-magnet.js`.

## Trois pièges de mesure Search Console

À réappliquer à chaque relevé, sinon les conclusions sont fausses. Chiffres et méthode dans le rapport.

1. **22 requêtes du gabarit `<mot> claude pme|tpe` sont fabriquées par un outil automatisé** (zéro clic,
   100 % desktop, plusieurs en position 1). Les écarter de toute analyse du cluster Claude.
2. **Google indexe les ancres de section comme des pages** : 52 ancres pour un seul clic sur tout le site.
   Un comptage naïf annonce 80 pages sans clic là où il y en a une trentaine.
3. **Un agrégat par requête est toujours inférieur au total réel**, Google anonymisant les requêtes rares.
   Ne jamais comparer un total par requête à un total par page ou par pays.

## Outillage de mesure

| Outil | Où | Ce qu'il voit |
|---|---|---|
| Search Console | connectée à OpenSEO, et **API directe depuis vps1-prod** | Ce sur quoi le site est déjà classé. Aveugle sur le reste. |
| GEO Citation Tracker | `/opt/geo-citation-tracker`, vps1-prod | Citations du site dans les réponses des LLM. Cron en pause. |
| OpenSEO | `/opt/open-seo`, vps1-prod | Backlinks, keyword gap, rank tracking, SERP. Détail dans `openseo.md`. |

**Passer par l'API Search Console directement, pas par le MCP**, dès qu'il faut du volume : le MCP plafonne
à 1 000 lignes par appel, l'API en accepte 25 000. Scripts d'exemple dans `/opt/geo-citation-tracker/scripts/`.

**Ahrefs ne sort plus rien** (2026-09-12) : tous les endpoints renvoient `Insufficient plan`, Domain Rating
gratuit compris. L'autorité se mesure par `get_backlinks_overview` d'OpenSEO, à 0,10 $ l'appel.

**Googlebot visite les pages profondes tous les 26 à 70 jours**, les pages commerciales tous les jours.
Conséquence : un titre réécrit en profondeur met des semaines à exister en SERP. **Demander l'indexation
dans Search Console le jour de la publication** ramène ce délai à quelques heures, vérifié le 2026-09-12.
Claude sait le faire via le navigateur : un onglet neuf par URL, l'application ne réinspecte pas deux fois
dans le même onglet, et vérifier l'URL affichée dans le panneau avant chaque clic.

**Le domaine canonique est `www`.** L'apex renvoie « Page with redirect » et une URL apex profonde est
inconnue de Google. Toute inspection d'URL et tout suivi de rang visent la forme `www`.

## Ouvert

### Actions Franck, hors repo

- Search Console : soumettre `/blog/etude-citations-ia-agences-pme-2026/` et
  `/blog/ai-act-2-aout-2026-obligations-pme/`, demander le recrawl de `hermes-agent-ia-autonome-dirigeant-tpme`,
  `ai-act-formation` et `agent-ia-definition`. **Claude peut désormais le faire**, voir ci-dessus.
- Notion : supprimer les entrées de test restantes (5 leads de debug sur la base simulateur, plus
  « Test / beforbiz@gmail.com »).
- Rotation de la clé n8n : voir la dette ci-dessous.
- **DataForSEO** : solde **0,89 $** après l'audit, qui n'a coûté que 0,11 $. Recharge des 50 $ toujours
  écartée. Le préalable qui manquait, une liste de concurrents, existe maintenant (voir le rapport d'audit) :
  la recharge se justifiera au lancement du link prospecting, pas avant.

### Dettes

- **Clé API n8n exposée.** `.mcp.json` n'est plus suivi par git, donc les prochains commits ne l'emporteront
  plus, mais la clé reste dans l'historique poussé du dépôt public. **Seule la rotation côté n8n ferme cette
  dette**, et elle n'est pas faite.
- **382 images sur 394 sans `width` ni `height`** : décalage de mise en page mesuré par les Core Web Vitals.
  Le correctif se pose dans les partials d'image, pas page par page.
- **`/scan-geo/` est détectée par Google et jamais indexée**, et orpheline de tout lien interne. Soit elle
  reçoit des liens, soit la décision d'août de ne lui envoyer aucun trafic est assumée en `noindex`.
- **Neuf articles sur 32 reçoivent moins de trois liens entrants éditoriaux**, et huit liens internes passent
  par une redirection 301 (`/contact/` x5, `/diagnostic-ia/` x2, `/audit-ia-gratuit/` x1).
- **Deux pages sans Open Graph ni canonical** : `/ressources/kit-claude-cowork-pme/` et
  `/lp/collecte-whatsapp-pennylane/` n'étendent pas `baseof.html`. Google retient pour la seconde un
  canonical différent de celui déclaré.
- **`generate-opco-subpages.py` ne produit pas l'état final des fiches OPCO** : `migrate-opco-to-fiche-layout.py`
  doit tourner derrière lui. Régénérer seul défait la migration en silence.
- **Tirets cadratins résiduels** dans les articles d'avant le nettoyage, corps et champ `expertise` du front
  matter. À traiter en une passe, pas article par article.
- Lead magnet C « Kit IA pour cabinet comptable » : concept validé, jamais démarré.
- Article « SaaS-replacement » : validé en mars 2026, jamais écrit. Gelé par la suspension.
- `docs/skills/` : 179 fichiers, 1,8 Mo, suivis par git et inertes. Arbitrage à rendre.
- `.claude/skills/README-arbitrage.md` : table de 14 skills tierces, jamais appliquée.

### À revérifier avant de s'y fier

- Un blocage « `RESEND_API_KEY` manquante ou expirée sur Vercel » noté le 2026-05-06, jamais reconfirmé.
  Des envois Resend ont réussi après cette date. Tester avant d'agir.
- **Bot Fight Mode est désactivé** sur la zone Cloudflare. L'arbitrage tenait à un état vérifié : seuls
  `seo.` et `crm.` sont proxifiés, tous deux derrière Access. Ajouter un hostname proxifié sans Access
  invaliderait ce raisonnement.
- Le build Hugo émet un WARN « no layout file for kind section » sur `formation` et `ressources`. **Bénin,
  vérifié le 2026-09-12** : les deux renvoient 301 en production, il n'y a pas de 404.

## Décisions en attente

- **Trafic Hermes : le trafic est tranché, l'offre ne l'est pas.** Quatre modèles, verdict unanime :
  ce trafic n'est pas un marché exploitable, et l'audit a ajouté qu'il **fausse le signal d'entité**, Google
  associant le site à « hermes agent » plutôt qu'à « agence IA ». **Reste ouvert** : l'offre d'entrée de mise
  en place d'agent autonome, à construire sur de vrais prospects et sous un autre nom. La page n'a toujours
  pas de porte de sortie.
- **Cron GEO** : 0,63 € par requête après allègement, la cible n'est pas atteinte, Grok n'ayant pas de
  variante non-reasoning. ⚠️ Le run du 2026-09-12 a coûté **7,49 € pour 7 requêtes**, soit 1,07 € par
  requête : le chiffre de 0,63 € est périmé, ChatGPT étant passé de 0 à 3,14 €. À trancher : run mensuel
  restreint aux requêtes `discovery`, ou abandon.

## Où est le reste

| Fichier | Contenu |
|---|---|
| `audit-seo-geo-2026-09.md` | L'audit complet du 12/09 : positions, technique, crawl, autorité, citations IA. |
| `brief-article-choisir-agence-ia.md` | Le brief du prochain article, autonome, prêt à exécuter. |
| `changelog.md` | Le récit de chaque session, antéchronologique. |
| `next-tasks.md` | Le backlog : lire la section du haut, pas le fichier. |
| `lessons.md` | Les pièges déjà payés. |
| `openseo.md` | L'instance OpenSEO : exposition, accès, coûts, pièges. |
| `archive/status-journal.md` | L'ancien `status.md` : journal des phases 0 à 7. |
