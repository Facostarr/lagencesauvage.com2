# Brief : « Quelle agence IA choisir pour une PME »

**Version 2, consolidée après challenge.** Thème tranché par GLM 5.3, DeepSeek v4.1 et Qwen 3.8 Max
(verdict unanime). Brief lui-même attaqué par GLM 5.3 et Grok 4.6, qui ont trouvé quatre défauts réels.
Coût total des cinq consultations : 0,12 $.
**Statut : brief prêt à exécuter, texte non écrit, non publié.**

## Pourquoi ce thème

Les trois premiers modèles ont rejeté les deux objectifs initiaux. Reproduire la visibilité d'Hermes est un
piège : le trafic ne convertit pas et il fausse le signal d'entité, Google associant le site à « hermes
agent » plutôt qu'à « agence IA ». Gagner « agence ia » en tête de SERP est hors d'atteinte : rang de
domaine 18, 28 des 32 domaines référents à autorité nulle, SERP tenue par des annuaires.

Reste ce que les trois ont désigné indépendamment : les requêtes commerciales où le site est déjà présent
sans article dédié. **Ce thème ne rouvre pas la production d'articles neufs suspendue le 21 août**, puisqu'il
vise des requêtes à demande existante.

**Collisions vérifiées sur les 32 articles : aucune** sur « choisir une agence ». Le thème financement OPCO,
proposé en second par les trois modèles, a été écarté pour collision frontale avec
`dispositifs-opco-2026-financer-formation-ia-pme`, `financer-ia-pme-aides-subventions-2026` et
`choisir-organisme-formation-ia-qualiopi`, plus le simulateur.

## ⚠️ Ce que le challenge a corrigé, à lire avant d'écrire

**1. La requête que je visais est déjà tenue par un autre article du site.**
« Quelle agence choisir pour déployer un agent ia dans une PME », position 4,7, est captée par
`/blog/agent-ia-operationnel-pme-guide-deploiement/`. Viser cette requête, ou mettre « déployer un agent IA »
dans le titre, créerait une cannibalisation avec un article qui est déjà bien placé. **Le nouvel article ne
vise donc pas cette requête.** Il vise le volume, là où personne n'est bien placé.

**2. Le KPI initial était statistiquement invalide.** 35 impressions sur 90 jours, soit 0,4 par jour : à ce
volume une position moyenne Search Console est du bruit, et un passage de 4,7 à 2,9 serait indiscernable
d'une fluctuation. Le vrai volume est ailleurs.

**3. Le compte des liens sortants était faux** (« sept appuis » pour six réels, la section 3 n'en ayant aucun).

**4. L'angle et le plan se contredisaient** : le corps interdit de se mettre en avant, mais les sections 1 et
6 reposent sur des faits propres à l'agence. Sans règle explicite, l'auteur improvise. La règle est posée
plus bas, c'est le point sur lequel GLM et Grok ont le plus insisté.

## Titre

> **Quelle agence IA choisir pour une PME : les 7 questions à poser avant de signer**

Il porte « agence IA » et « PME », les termes des requêtes à volume. Il ne porte **pas** « déployer un
agent », volontairement, pour ne pas concurrencer l'article de déploiement. Les sept questions doivent être
sept vraies questions : si l'écriture n'en produit que six qui tiennent, le titre dit six.

## Requêtes visées et KPI

**Cible principale, celle qui porte le volume :**

| Requête | Position | Impressions (6 mois) |
|---|---|---|
| agence ia pme | 11,8 | 401 |
| agence ia pour pme | 14,5 | 367 |
| agence intelligence artificielle pme | 15,4 | 41 |
| meilleure agence agents ia en france pour une pme | 13,6 | 25 |

**Hors cible, à ne pas viser** : « quelle agence choisir pour déployer un agent ia dans une PME » (tenue par
l'article de déploiement) et tout ce qui contient « déployer », « copilote » ou « cabinet ».

Distribution du CTR mesurée sur le site : positions 1-3 = 6,22 %, 3-5 = 1,84 %, 5-10 = 0,77 %,
10-20 = **0,17 %**. Les requêtes cibles sont toutes dans la bande à 0,17 %, donc tout gain de rang compte.

## Règle de personne, à appliquer sans exception

C'est le point qui a le plus inquiété les deux modèles. Sans lui, l'article devient un publireportage ou une
coquille vide.

- **Corps à la troisième personne.** Interdits : « nous », « notre agence », « notre offre », tout
  comparatif implicite, toute promesse commerciale.
- **L'étude d'août se cite comme n'importe quelle source** : par son titre, sa date et un chiffre publié,
  avec un lien. Pas comme un exploit maison.
- **Exception unique, une seule phrase, en section 6** : « L'Agence Sauvage n'est pas certifiée Qualiopi ;
  les formations passent par des organismes partenaires. » Rien d'autre sur l'agence avant le CTA final.

## Plan, une question par section

| # | Question | Appui interne | Longueur |
|---|---|---|---|
| 1 | L'agence publie-t-elle ses propres résultats, y compris mauvais ? | `etude-citations-ia-agences-pme-2026` | normale |
| 2 | Qui fait le travail, et avec quel outil ? | `outils-agents-ia-pme-2026` | normale |
| 3 | Que se passe-t-il le jour où vous arrêtez ? | **aucun, assumé** | normale |
| 4 | Qui valide ce que l'agent fait ? | `gouvernance-agents-ia-pme-2026` | normale |
| 5 | Comment le résultat se mesure-t-il, et à partir de quand ? | `pourquoi-projet-ia-cale-avant-la-production` | normale |
| 6 | La prestation est-elle finançable, et par quel dispositif ? | `dispositifs-opco-2026-financer-formation-ia-pme` | **80 à 120 mots**, pas plus |
| 7 | Combien de temps avant le premier résultat utilisable ? | `agent-ia-operationnel-pme-guide-deploiement` | normale |

**Section 3** : pas de lien interne, sources externes seulement. Ne pas en forcer un.
**Section 6** : volontairement courte, avec un lien. Un développement y recréerait le thème OPCO écarté et
diluerait les trois articles existants.
**Six liens sortants internes, pas sept.**

## Pack auteur

- **Longueur cible : 2 400 à 2 800 mots.** Médiane du blog : 2 557 mots sur 32 articles.
- Sections 2, 3, 4 et 7 relèvent du raisonnement opérationnel : elles n'ont pas besoin de chiffre. **Si un
  chiffre apparaît, il porte une source publique en lien.**
- Sources autorisées : Bpifrance Le Lab, France Num, INSEE, entreprises.gouv.fr, travail-emploi.gouv.fr,
  McKinsey, Gartner, plus les données déjà publiées par l'agence. **Interdit** : toute agence concurrente,
  toute page d'accueil, tout chiffre non sourcé. Section « Sources et références » obligatoire.
- **CTA** : un seul, en fin d'article. ⚠️ **À trancher avec Franck avant écriture** : `/diagnostic/` vend
  cinq jours d'immersion, ce qui est lourd pour un lecteur en phase de comparaison. C'est la décision
  « point d'entrée léger » restée ouverte dans `status.md`.

## Maillage

**Sortant** : les six appuis du tableau.
**Entrant, posé par celui qui publie, pas par l'auteur** : depuis `etude-citations-ia-agences-pme-2026`,
depuis `agent-ia-operationnel-pme-guide-deploiement` et depuis la page d'accueil. L'audit du 12/09 a montré
qu'un article non maillé est crawlé lentement, et neuf articles sur 32 reçoivent moins de trois liens.
**Demander l'indexation dans Search Console le jour de la publication** : l'article du 11/09 a été crawlé
le jour même, contre 26 à 70 jours pour une page profonde laissée seule.

## Mesure

Deux relevés, pas un. Les deux modèles ont divergé sur le calendrier, l'un voulant J+84 pour couvrir le pire
cas de crawl, l'autre gardant J+56. Les deux sont conservés.

- **J+56** : relevé indicatif. Aucune conclusion d'échec à ce stade.
- **J+84** : relevé qui tranche.

**Indicateur 1** : position moyenne sur le panier des quatre requêtes cibles, pondérée par impressions.
Départ : entre 11,8 et 15,4. Franchir la barre des 10 fait passer le CTR de 0,17 % à 0,77 %, le franchir
jusqu'à 5 le fait passer à 1,84 %.
**Indicateur 2** : citations LLM, en rejouant les sept requêtes de découverte du GEO Citation Tracker sur
quatre moteurs (~7,50 €, compter 11 minutes). Départ : 3 citations sur 489, score 2,9/100. Viser 5 à 7.

Les sept requêtes du protocole, à rejouer à l'identique :
1. Quelle est la meilleure agence IA pour PME en France en 2026 ?
2. Quelle agence IA choisir pour automatiser une petite entreprise sans equipe technique ?
3. Quelle agence IA recommander a Paris pour une PME ?
4. Quelle agence IA pragmatique pour une PME qui veut des resultats concrets, pas de la hype ?
5. Quelles sont les meilleures agences d'automatisation IA en France ?
6. A qui confier la transformation IA d'une TPE ou PME en France ?
7. Quelle agence IA pour automatiser une PME avec un petit budget ?

**Signal d'échec, à J+84 seulement** : si le panier n'a pas progressé et que les citations stagnent à 3, le
blocage est l'autorité et non le contenu. Aucun article supplémentaire n'y changera rien, et il faudra
passer aux liens entrants réels. Ne pas réécrire l'article dans ce cas.
