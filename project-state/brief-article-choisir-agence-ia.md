# Brief — « Quelle agence IA choisir pour une PME »

Issu de l'audit du 12/09 (`audit-seo-geo-2026-09.md`) et du challenge à trois modèles
(GLM 5.3, DeepSeek v4.1, Qwen 3.8 Max, verdict unanime, coût 0,056 $).
**Statut : brief validé sur le thème, texte non écrit, non publié.**

## Pourquoi cet article et pas un autre

Les trois modèles ont rejeté les deux objectifs initiaux. Reproduire la visibilité d'Hermes est un piège :
le trafic ne convertit pas, et il **fausse le signal d'entité**, Google associant désormais le site à
« hermes agent » plutôt qu'à « agence IA ». Gagner les requêtes « agence ia » en tête de SERP est hors
d'atteinte : rang de domaine 18, 28 des 32 domaines référents à autorité nulle, SERP tenue par des annuaires.

Ce qui reste, et que les trois ont désigné indépendamment : **les requêtes conversationnelles commerciales
où le site est déjà classé sans article dédié.**

| Requête | Position actuelle | Impressions (90 j) |
|---|---|---|
| quelle agence choisir pour déployer un agent ia dans une PME | **4,7** | 35 |
| cherche cabinet pour déployer copilotes ia opérationnels | **7,4** | 25 |
| meilleure agence agents ia en france pour une pme | 13,6 | 25 |
| agence ia pme | 11,8 | 401 (6 mois) |
| agence ia pour pme | 14,5 | 367 (6 mois) |

Le calcul qui justifie l'effort : passer de la position 4,7 à 3 fait passer le CTR de 0,77 % à 6,22 %,
d'après la distribution mesurée sur le site lui-même.

**Ce thème ne viole pas la suspension des articles neufs** décidée le 21 août : il vise des requêtes où le
site a déjà de la demande et un rang, ce qui est exactement le périmètre autorisé. Les trois modèles y ont
convergé sans connaître cette règle.

**Collisions vérifiées sur les 32 articles : aucune.** Le thème financement OPCO, proposé en second par les
trois, a lui été écarté pour cette raison précise : il entre en collision frontale avec
`dispositifs-opco-2026-financer-formation-ia-pme`, `financer-ia-pme-aides-subventions-2026` et
`choisir-organisme-formation-ia-qualiopi`, plus le simulateur lui-même.

## Titre

> **Quelle agence IA choisir pour une PME : les 7 questions à poser avant de signer**

Contient l'expression cible et reprend la formulation réelle des requêtes. Les sept questions doivent être
sept vraies questions, pas un compte décoratif : si l'écriture n'en produit que six qui tiennent, le titre
dit six.

## L'actif différenciant, à ne pas rater

C'est le point que les trois modèles n'ont pas vu, faute de connaître le site.

L'agence a publié en août **« Personne n'est leader : ce que les IA citent vraiment quand on cherche une
agence »**, première étude data-first du blog, où les agences sont comptées mais jamais nommées et où l'ASV
publie ses propres chiffres, y compris mauvais. Et l'audit du 12/09 vient de mesurer que sur 489 citations
émises par quatre modèles sur des requêtes de type « quelle agence IA pour PME », le site en capte trois.

**Aucune agence française ne publie ses propres chiffres de visibilité quand ils sont mauvais.** C'est la
seule chose que ce guide peut dire et que ses concurrents ne peuvent pas copier. Elle règle en prime la
contrainte « zéro invention » : les chiffres viennent d'une étude déjà publiée et sourcée.

## Angle

Un guide de décision pour un dirigeant qui cherche un prestataire, écrit par un prestataire qui assume de
l'être et qui ne se met pas en avant dans le corps. La contrainte qui interdit de citer un concurrent
devient un atout : elle force le format « critères », celui que les modèles recopient.

Ton : vouvoiement, sobre, aucune promesse commerciale dans le corps. Un seul CTA, en fin d'article.

## Plan proposé, une question par section

Chaque question doit être posable telle quelle à un prestataire, et la réponse attendue doit être vérifiable
par le lecteur. Les articles existants servent d'appui, ce qui construit le maillage sortant.

1. **L'agence publie-t-elle ses propres résultats, y compris mauvais ?** Appui : l'étude d'août.
2. **Qui fait le travail, et avec quel outil ?** Les trois familles d'outils, leur coût de mise en œuvre.
   Appui : `outils-agents-ia-pme-2026`.
3. **Que se passe-t-il le jour où vous arrêtez ?** Réversibilité, propriété des données, dépendance.
4. **Qui valide ce que l'agent fait ?** La validation humaine sur les actions à conséquence.
   Appui : `gouvernance-agents-ia-pme-2026`.
5. **Comment le résultat se mesure-t-il, et à partir de quand ?** Appui : `pourquoi-projet-ia-cale-avant-la-production`.
6. **La prestation est-elle finançable, et par quel dispositif ?** Dire clairement que l'agence n'est pas
   certifiée Qualiopi et forme via des organismes partenaires. Appui : `dispositifs-opco-2026-...` et le simulateur.
7. **Combien de temps avant le premier résultat utilisable ?** Appui : `agent-ia-operationnel-pme-guide-deploiement`.

## Sources autorisées

Études et institutions publiques : Bpifrance Le Lab, France Num, INSEE, entreprises.gouv.fr, travail-emploi.gouv.fr,
McKinsey, Gartner. Plus les données propres déjà publiées par l'agence.
**Interdit** : toute agence concurrente comme source, toute page d'accueil, tout chiffre non sourcé.
Section « Sources et références » obligatoire en fin d'article.

## Maillage

**Entrant, à poser à la publication** (l'audit a montré que neuf articles sur 32 reçoivent moins de trois
liens, et qu'un article non maillé est crawlé lentement) : depuis `etude-citations-ia-agences-pme-2026`,
`agent-ia-operationnel-pme-guide-deploiement` et la page d'accueil.
**Sortant** : les sept appuis ci-dessus.

## Ce qu'on mesure, et ce qu'on ne mesure pas

Ni les impressions, ni les clics. Les trois modèles insistent : cet article ne réparera pas le rang de
domaine 18.

Deux indicateurs seulement, à **J+56** parce que le crawl des pages profondes prend 26 à 70 jours :

1. **Position sur « quelle agence choisir pour déployer un agent ia dans une PME »**. Elle est à 4,7.
   Passer sous 3 est le seul gain qui change le rendement.
2. **Citations LLM**, en rejouant le protocole des 7 requêtes de découverte sur 4 moteurs (~7,50 €).
   Point de départ : 3 citations sur 489, score 2,9/100. Une progression vers 5 à 7 vaut succès.

**Signal d'échec commun aux trois modèles** : si à J+56 la position n'a pas bougé de 4,7, le blocage est
l'autorité et non le contenu. Aucun article supplémentaire n'y changera rien, et il faudra passer aux liens
entrants réels. Ne rien conclure avant J+56.
