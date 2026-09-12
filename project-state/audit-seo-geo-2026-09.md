# Audit SEO et GEO, 12 septembre 2026

Photo complète du site : positions réelles, technique, crawl, autorité, citations par les modèles.
Rapport lisible : https://claude.ai/code/artifact/26738818-bdb3-4714-b657-0451de0df0bd

**Sources** : Search Console (propriété `sc-domain`, API directe depuis vps1-prod, pas le MCP qui plafonne
à 1 000 lignes), balayage du build local (91 pages), DataForSEO via OpenSEO, GEO Citation Tracker.
**Coût** : 0,11 $ de DataForSEO et 7,49 € pour le run GEO. Solde DataForSEO restant : 0,89 $.

⚠️ **Limite de périmètre.** Les fenêtres Search Console s'arrêtent au 9 septembre, pour laisser passer le
délai de consolidation. L'article `claude-code-sans-coder-quatre-gestes`, publié le 11 septembre, est donc
**présent dans le balayage technique des 91 pages mais absent de toutes les données de performance**.
Aucune conclusion de ce rapport ne porte sur lui. Son état a été vérifié à part : indexé, crawlé le jour
même de sa publication, résultats enrichis en PASS. En revanche il ne reçoit qu'un seul lien entrant,
celui de la page liste `/blog/`, et aucun lien éditorial depuis un autre article : Google confirme
« aucune URL référente ». C'est le cas type des neuf articles sous-maillés décrits plus bas, et le
handicap est réel puisque la fréquence de crawl suit le maillage.

## Le résultat en une phrase

La visibilité croît vite, la fréquentation ne suit plus, et la cause n'est pas technique.
Sur un trimestre les impressions font +152 % quand les clics font +69 % : le CTR tombe de 1,44 % à 0,96 %
et la position moyenne recule de 7,35 à 9,13. Le site est affiché de plus en plus souvent, de plus en plus bas.
Le diagnostic d'août (le déficit est l'autorité) se trouve confirmé par trois chemins indépendants :
le profil de liens, l'absence des SERP commerciales, et la fréquence de crawl.

## Chiffres de référence

| Fenêtre | Clics | Impressions | CTR | Position |
|---|---|---|---|---|
| 12 mois (10/09/2025 au 09/09/2026) | 2 516 | 230 289 | 1,09 % | 8,47 |
| 90 jours (12/06 au 09/09) | 1 474 | 152 902 | 0,96 % | 9,13 |
| 90 jours précédents (14/03 au 11/06) | 871 | 60 599 | 1,44 % | 7,35 |

Totaux **non dimensionnés**. Attention, un agrégat par requête est toujours inférieur (Google anonymise
les requêtes rares) : sur 90 jours, la somme par requête ne fait que 77 254 impressions contre 152 902 en réel.
Ne jamais comparer un total par requête à un total par page ou par pays.

## La falaise, mesurée hors Hermes

Sur 90 jours, périmètre des requêtes nommées hors page Hermes (155 clics, 24 628 impressions, position moyenne 18,1).

| Position | Requêtes | Part des impressions | Part des clics | CTR |
|---|---|---|---|---|
| 1 à 3 | 131 | 3,3 % | 32,3 % | 6,22 % |
| 3 à 5 | 142 | 5,3 % | 15,5 % | 1,84 % |
| 5 à 10 | 550 | 36,0 % | 43,9 % | 0,77 % |
| 10 à 20 | 332 | 24,3 % | 6,5 % | 0,17 % |
| 20 et plus | 408 | 31,2 % | 1,9 % | 0,04 % |

8,6 % des impressions (positions 1 à 5) produisent 47,8 % des clics.
55,5 % des impressions (au-delà de la position 10) en produisent 8,4 %.
Gagner deux places entre la sixième et la quatrième multiplie le rendement par 2,5.
En gagner quatre entre la douzième et la huitième ne rapporte rien.

## Deux pièges de mesure à retenir

**1. Vingt-deux requêtes fabriquées gonflent le cluster Claude.**
Onze préfixes (charte, diagnostic, dangers, sensibilisation, test, bonnes pratiques, apprendre, cours,
risques, guide, formation) croisés avec deux suffixes (pme, tpe) : combinatoire complète, volumes homogènes
entre 59 et 90 impressions, **100 % France, 100 % desktop, 1 578 impressions et zéro clic sur 64 jours**,
en montée régulière depuis le 8 juillet. Plusieurs sont en position 1 à 1,5 avec zéro clic, ce qui n'arrive
pas avec une audience humaine. C'est un outil automatisé qui interroge Google, vraisemblablement un suivi
de positions tiers. Effet sur le CTR global : négligeable (0,96 % contre 0,97 % sans elles).
Effet sur l'analyse du cluster « Claude pour PME » : il la rend fausse. Les écarter systématiquement.

**2. Google indexe les ancres de section comme des pages.**
52 ancres (`.../page/#section`) totalisent 8 614 impressions et **un seul clic**, dont 5 362 impressions
pour les quatre ancres de la page Hermes. Elles apparaissent comme des pages distinctes dans Search Console.
Un comptage naïf annonce 130 pages affichées dont 80 sans clic ; en réalité le site a 78 pages réellement
affichées sur 90 jours, dont une trentaine jamais cliquées.

## Hermes pèse la moitié du site

Sur 90 jours : 660 clics et 77 677 impressions, soit **44,7 % des clics et 47,0 % des impressions**,
à la position 7,92. Tout le reste du site fait 816 clics et 87 502 impressions à la position 10,80.

Retirer Hermes fait tomber le CTR du site de 0,96 % à 0,63 % et la position moyenne de 9,13 à 18,1.
**Tout suivi de performance qui ne sépare pas Hermes du reste mesure Hermes.**
Le trafic lui-même reste tranché (ce n'est pas un marché), l'audit n'y revient pas.

## Gisements, hors Hermes et hors gabarit automatisé

| Cluster | Requêtes | Impressions | Clics | CTR | Blocage |
|---|---|---|---|---|---|
| Simulateur OPCO | 210 | 4 127 | 13 | 0,31 % | titres corrigés le 12/09, recrawl en attente |
| Formation et financement | 130 | 2 109 | 5 | 0,24 % | rang : 802 impressions pour 1 clic sur `/formation/` |
| Citation par les IA | 118 | 1 541 | 0 | 0,00 % | rang : positions 15 à 44 |
| Agence IA pour PME | 57 | 1 028 | 2 | 0,19 % | cannibalisation |

**Cannibalisation à trancher.** Sur « agence ia pme », l'article `/blog/agent-ia-operationnel-pme-guide-deploiement/`
capte 170 impressions en position 18,9 pendant que la page d'accueil, en position 4,6, n'en capte que 95.
Même schéma sur « agence ia pour pme » : 201 impressions pour l'article en position 15, 14 pour l'accueil
en position 9,7. Google hésite et retient la moins bonne page. Correction éditoriale, pas technique.
C'est le seul gisement à portée immédiate, parce que la page d'accueil est déjà juste au-dessus de la marche.

**Intention locale toujours pas servie** (déjà notée en août) : « formation claude paris » 186 impressions
en position 21,2, « formation claude nantes » 100 impressions en position 34,5.

**Étranger stérile** : 24 000 impressions (usa, nld, gbr, deu) pour 13 clics au total, rayonnement Hermes.

## Technique : rien à réparer, et c'est le résultat

Balayage des 91 pages du build. **Le HTML servi est minifié et Hugo retire les guillemets des attributs**
(`name=description`, `href=/services/`, `ld+json>`) : une regex qui exige des guillemets rend un audit
entièrement faux. Passer par un parseur HTML, pas par du grep. Script rejouable dans le scratchpad de session.

Conforme : zéro titre absent, trop long ou dupliqué ; zéro description dupliquée ; zéro `H1` manquant ou
multiple ; 89 pages avec JSON-LD, zéro bloc invalide (Organization et Person sur 89, FAQPage 81,
BreadcrumbList 79, Article 33) ; zéro balise `og:` en double, le correctif du 12/09 tient ; 394 images
toutes pourvues d'un `alt` ; zéro lien interne cassé ; résultats enrichis en PASS partout.

À traiter :
- **382 images sur 394 sans `width`/`height`**, donc décalage de mise en page (CLS). Constat neuf.
  Le correctif se pose dans les partials d'image, pas page par page.
- **Trois pages orphelines** : `/scan-geo/`, `/lp/collecte-whatsapp-pennylane/`,
  `/blog/impact-ia-pme-françaises-2025/` (cette dernière a en plus un accent dans son URL).
  Neuf articles sur 32 reçoivent moins de trois liens entrants éditoriaux.
- **Huit liens internes passent par une redirection 301** (`/contact/` x5, `/diagnostic-ia/` x2,
  `/audit-ia-gratuit/` x1). Rien n'est cassé, `vercel.json` les couvre, mais c'est un aller-retour inutile.
- Les deux pages hors gabarit (`/lp/collecte-whatsapp-pennylane/`, `/ressources/kit-claude-cowork-pme/`)
  restent sans canonical ni JSON-LD. Dette déjà connue. L'inspection confirme que Google retient pour la
  première un canonical différent de celui déclaré.

## Crawl : le vrai plafond technique

Vingt URL inspectées en forme `www`. Toutes indexées sauf `/scan-geo/`, **détectée et jamais indexée**,
qui est aussi orpheline de tout lien interne (cause très probable).

Fraîcheur du dernier passage de Googlebot : accueil le jour même, `/services/` et `/diagnostic/` 1 jour,
`/faq/` 5 jours, `/simulateur-opco/` 13 jours, `/formation/` 14 jours, fiche AKTO 28 jours,
`/blog/rag-en-entreprise/` 45 jours, les deux réalisations 57 jours, fiche Syntec 65 jours, fiche Atlas 70 jours.

Conséquence opérationnelle : **un titre réécrit sur une page profonde met jusqu'à dix semaines à exister
en SERP**, et aucune passe de balises n'accélère ça. La fréquence de crawl suit l'autorité et le maillage.

## Autorité : le vrai déficit

86 backlinks, 67 pages référentes, **54 domaines référents**, rang de domaine 18, score de spam du site nul.
La croissance est réelle : 4 domaines fin décembre 2025, 54 aujourd'hui, dont **18 acquis sur le seul mois d'août**.

Mais sur les 32 domaines référents non signalés comme spam, **28 ont une autorité mesurée à zéro**.
Les quatre autres plafonnent à 4, 1, 1 et 1. Principaux référents : acseo.fr (8 liens), zevra.tech (6,
apparu le 9 septembre), stenoop.com, letzagents.lu et mankova-consulting.com (4 chacun).

SERP, sur les deux requêtes où DataForSEO avait des données :
- **« simulateur opco »** : les neuf premières places sont tenues par les OPCO et les sites publics
  (Atlas, OPCO 2i, OPCO EP, OPCO Santé, l'Opcommerce, travail-emploi.gouv.fr, Ocapiat). ASV absent.
- **« agence ia paris »** : annuaires et agences installées (ia.agency, Sortlist, agence-ia-paris.fr,
  Poller, Juwa, Stema Partners, Koïno, La Fabrique du Net). ASV absent.

⚠️ Huit des dix mots-clés soumis n'ont renvoyé aucune donnée SERP, faute de volume ou de couverture.
Le tableau concurrentiel ne repose donc que sur deux requêtes.

## GEO : 3 citations sur 489

Run du 12 septembre, 7 requêtes de découverte, 4 moteurs, 2 passages, 56 réponses.
**Score de découverte 2,9**, contre 1,2 le 21 août. Grok 6,0 (2 mentions), Claude 3,1 (1 mention),
Perplexity 3,0 (aucune), ChatGPT 0,0 (aucune).

Les modèles ont émis **489 citations sur 129 domaines distincts** pendant ce run. Le site en capte trois.
Domaines qui occupent la place : impli.fr (24), stemapartners.com (17), lafabriquedunet.fr, isiia.com et
blog-ia.com (16 chacun), plus deux sources publiques, francenum.gouv.fr (16) et entreprises.gouv.fr (12).

**Le recoupement est le résultat le plus utile** : Stema Partners, Koïno, Juwa et La Fabrique du Net
apparaissent à la fois dans les réponses des modèles et dans le SERP Google sur « agence ia paris ».
Ce sont les mêmes acteurs des deux côtés. C'est la liste de concurrents qui manquait au contexte OpenSEO,
fondée sur des mesures et non sur une intuition.

## Ce qui en découle, par ordre de rendement

1. **Forcer le recrawl des six pages du simulateur** depuis l'interface Search Console. Sans ça, les fiches
   Atlas et Syntec (70 et 65 jours sans visite) n'auront pas leur nouveau titre en ligne le 12 octobre,
   et la mesure programmée portera sur un tiers du cluster. Action manuelle, dix minutes.
2. **Trancher la cannibalisation sur « agence ia pme »** : décider quelle page porte la requête, aligner
   maillage et intitulés. Seul gisement à portée immédiate. Une édition.
3. **Remplir la section concurrents du contexte OpenSEO** avec la liste recoupée ci-dessus. Gratuit,
   et c'est elle qui conditionne le link prospecting.
4. **Décider pour `/scan-geo/`** : soit des liens internes et l'indexation, soit `noindex` assumé.
   L'état actuel (détectée, jamais indexée, orpheline) ne sert à rien.
5. **Déclarer les dimensions des images** dans les partials.
6. **Ne pas recharger DataForSEO maintenant.** L'audit complet a coûté 0,11 $ et il reste 0,89 $.
   Ce que la recharge achète (profil de liens détaillé, keyword gap) ne sert qu'une fois le link
   prospecting lancé, donc une fois la liste de concurrents en place. L'arbitrage du matin tient.

## Correction à porter ailleurs

`status.md` indique « Le plan Ahrefs connecté reste limité : seul le Domain Rating en sort ».
**C'est périmé** : `public-domain-rating-free` et `site-explorer-domain-rating` renvoient tous deux
`Insufficient plan`. Ahrefs ne sort plus rien du tout.
