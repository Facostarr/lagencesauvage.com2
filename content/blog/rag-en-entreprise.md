---
title: "RAG en entreprise : faire répondre une IA sur vos documents sans qu'elle invente"
seo_title: "RAG en entreprise : une IA fiable sur vos documents"
date: 2026-07-27
lastmod: 2026-07-27
description: "Votre IA invente des réponses pourtant présentes dans vos documents ? Ce qui sépare un RAG qui hallucine d'un RAG de confiance : recherche, sourcing, RGPD."
summary: "Une IA branchée sur vos documents qui invente n'a presque jamais un problème de modèle : elle ne retrouve pas la bonne information. Voici, sans jargon, ce qui sépare un RAG qui hallucine d'un RAG de confiance, et quand un tel projet en vaut vraiment la peine pour une PME."

# SEO
keywords: ["RAG en entreprise", "RAG IA", "qu'est-ce que le RAG", "IA sur mes documents", "RAG sans hallucination", "RAG RGPD", "RAG souverain", "RAG vs fine-tuning", "recherche hybride", "agence IA PME"]
canonical: ""

# Catégories & Tags
categories: ["Intelligence Artificielle", "Guides pratiques"]
tags: ["IA", "RAG", "PME", "Base de connaissances", "Hallucination", "RGPD", "Souveraineté"]

# Auteur & Crédibilité (E-E-A-T)
author: "Franck Sauvage"
expertise: "Fondateur L'Agence Sauvage, praticien du RAG en production pour PME françaises"

# Image & Affichage
image: "/assets/images/blog/rag-en-entreprise.webp"
imageAlt: "Un flux de documents d'entreprise traversant un moteur de recherche géométrique qui renvoie une réponse sourcée, palette indigo et slate sur fond sombre"
emoji: ""
<!-- [ASSET: image hero, documents entrant dans un moteur de recherche qui renvoie une réponse avec sa source mise en évidence, style abstrait géométrique indigo/slate, 16:9, WebP <100 Ko] -->

# Options
draft: false
toc: true
readingTime: 12
related_realisations:
  - "chef-de-cabinet-ia-assistant-dirigeant"
  - "automatisation-pole-financier-pennylane-expert-comptable"

takeaways:
  - "Une IA qui invente sur vos documents n'a presque jamais un problème de modèle : elle ne retrouve pas la bonne information. La fiabilité se joue sur la recherche, pas sur le choix du LLM."
  - "Un RAG de confiance repose sur trois garde-fous : un sourcing vérifiable, la capacité de dire « je ne sais pas », et un contrôle d'accès. Sans eux, une réponse fausse passe pour vraie."
  - "En 2026, la vraie question n'est plus « RAG ou pas » mais « outil packagé ou sur-mesure » : le sur-mesure se justifie sur les données sensibles, les droits d'accès fins et la traçabilité."

faq:
  - question: "Qu'est-ce que le RAG, pour une entreprise ?"
    answer: "Le RAG (retrieval-augmented generation, ou génération augmentée par récupération) est une méthode qui fait répondre une IA à partir de vos propres documents, en citant la source de chaque réponse, plutôt que sur sa seule mémoire d'entraînement. Concrètement, l'IA va d'abord chercher les passages pertinents dans votre base documentaire, puis rédige sa réponse à partir de ces passages."
  - question: "Pourquoi mon chatbot documentaire invente-t-il des réponses ?"
    answer: "Le plus souvent, il ne « ment » pas : il ne retrouve pas le bon passage et comble le vide avec une réponse plausible. La panne est presque toujours en amont, au stade de la récupération de l'information, pas dans le modèle lui-même. Un RAG bien construit cite ses sources et sait dire « je ne sais pas d'après vos documents » au lieu d'inventer."
  - question: "RAG ou ChatGPT Entreprise, Copilot : que choisir pour une PME ?"
    answer: "Un outil packagé comme ChatGPT Entreprise ou Microsoft Copilot suffit pour un besoin standard, sur des documents peu sensibles. Le RAG sur-mesure se justifie quand vous avez des données confidentielles, des droits d'accès fins à respecter, un métier très spécifique ou un besoin de traçabilité pour un audit."
  - question: "Un RAG est-il conforme au RGPD et à l'AI Act ?"
    answer: "Oui, avec une architecture européenne et les bonnes précautions. Attention : dès que votre base contient des données personnelles, la CNIL considère que vous êtes responsable du traitement. Et depuis le 2 août 2026, l'AI Act impose d'informer l'utilisateur qu'il échange avec une IA."
  - question: "Combien coûte un projet RAG pour une PME ?"
    answer: "Cela dépend du volume documentaire, du niveau de précision attendu et des contraintes de souveraineté. Le vrai coût n'est pas la technologie mais la qualification des données, la mise en place de l'évaluation et la maintenance dans le temps. Un abonnement d'accompagnement démarre à partir de 500 euros par mois."
---

*Juillet 2026 | Par **Franck Sauvage**, fondateur de [L'Agence Sauvage](https://www.lagencesauvage.com), praticien du RAG en production pour PME françaises*

Vous demandez à votre IA une information qui se trouve pourtant, noir sur blanc, dans vos documents. Elle vous répond avec aplomb. Et sa réponse est fausse.

Ce scénario est le quotidien des projets qui branchent une IA sur une base documentaire. La bonne nouvelle : ce n'est presque jamais la faute du modèle. La mauvaise : la plupart des « chatbots sur vos PDF » vendus aujourd'hui reproduisent exactement les erreurs qui produisent ces réponses fausses.

Le RAG, pour retrieval-augmented generation (génération augmentée par récupération), est la technologie qui fait répondre une IA à partir de vos propres documents plutôt que sur sa seule mémoire d'entraînement. C'est ce qui alimente la quasi-totalité des assistants « qui connaissent votre entreprise ». Et l'écart entre une démonstration bluffante et un outil sur lequel vos équipes peuvent s'appuyer se joue entièrement sur la façon dont il est construit.

Le contexte rend le sujet brûlant. En France, 55 % des TPE et PME déclarent utiliser l'IA générative fin 2025, contre 31 % un an plus tôt ([Bpifrance Le Lab, 82e baromètre semestriel, janvier 2026](https://presse.bpifrance.fr/bpifrance-le-lab-presente-le-82eme-barometre-semestriel-de-conjoncture-aupres-des-tpe-pme-les-dirigeants-font-part-dun-leger-regain-de-confiance-pour-2026)). Mais la valeur, elle, reste rare : 88 % des organisations utilisent l'IA dans au moins une fonction, et seules 6 % environ en tirent un impact supérieur à 5 % de leur résultat d'exploitation ([McKinsey, The State of AI in 2025, novembre 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)).

Cet écart ne se joue pas sur le modèle. Il se joue sur l'exécution. Cet article vous explique, sans jargon, ce qui sépare un RAG qui invente d'un RAG de confiance, et comment savoir si un tel projet en vaut la peine pour votre entreprise. Un projet RAG peut aussi caler pour des raisons purement humaines : ce volet est traité à part dans notre article sur les [raisons pour lesquelles un projet IA cale avant la production](/blog/pourquoi-projet-ia-cale-avant-la-production/).

## C'est quoi un RAG, et pourquoi le vôtre invente encore ?

Un RAG fait répondre une IA à partir de vos documents, en deux temps : il récupère d'abord les passages pertinents dans votre base, puis il rédige une réponse à partir de ces passages. Il ne devine pas la réponse de mémoire, il la reconstruit à partir de sources. En théorie. En pratique, tout se joue sur la qualité de la première étape.

Quand une IA documentaire « invente », elle ne ment pas au sens strict. Le plus souvent, elle n'a tout simplement pas reçu le bon passage. Le système de récupération lui a remis des extraits hors sujet, ou aucun, et le modèle, sommé de répondre, comble le vide avec une phrase plausible. Le problème est donc en amont, dans la recherche, pas dans le générateur.

C'est le piège central du RAG naïf. Il suppose implicitement que l'ingestion des documents est fiable, que le découpage préserve le sens, que les tableaux et les PDF scannés sont correctement lus, et que personne ne pose de question à laquelle la base ne répond pas. Ces hypothèses cassent dès qu'on branche l'outil sur la vraie vie. Et le plus dangereux, c'est que ces échecs de récupération sont silencieux : rien ne signale à l'utilisateur que la réponse repose sur du vide.

Ce n'est pas une faiblesse des amateurs. Une étude de Stanford a mesuré, dès 2024, le taux d'hallucination d'outils juridiques professionnels pourtant présentés comme « sans hallucination » : ils produisaient une réponse incorrecte ou mal fondée dans 17 à 33 % des cas selon l'outil ([Stanford RegLab et HAI, Journal of Empirical Legal Studies, 2024](https://reglab.stanford.edu/publications/hallucination-free-assessing-the-reliability-of-leading-ai-legal-research-tools/)). Retenez le principe : le RAG réduit fortement les hallucinations, il ne les élimine pas. Toute promesse de « zéro hallucination » est un signal d'alarme.

Un travail de Google Research explique une part du problème : face à un contexte insuffisant, les grands modèles ont tendance à répondre faux plutôt qu'à s'abstenir ([Google Research, Sufficient Context, 2025](https://research.google/blog/deeper-insights-into-retrieval-augmented-generation-the-role-of-sufficient-context/)). Autrement dit, un bon RAG ne doit pas seulement bien chercher : il doit aussi savoir reconnaître qu'il n'a pas de quoi répondre. Nous y revenons plus bas.

Si vous avez une démonstration qui rend bien et vous hésitez à la généraliser, [réservez votre audit IA gratuit (30 min)](/diagnostic/) : nous passons votre projet au crible et repartons avec un verdict clair.

## RAG naïf ou RAG fiable : qu'est-ce qui change vraiment ?

La moitié de la fiabilité d'un RAG se joue sur une seule chose : sa capacité à retrouver la bonne information avant de rédiger. C'est la plomberie du système. Un RAG sérieux en 2026 repose sur quatre briques, que voici traduites en bénéfices concrets.

**La recherche hybride.** La recherche purement « sémantique » (par proximité de sens) a un angle mort : elle rate les termes exacts, comme une référence produit, un numéro de contrat ou un code article. On lui ajoute donc une recherche par mots-clés exacts (la logique d'un moteur classique), et on fusionne les deux classements. Bénéfice : vous ne perdez plus une réponse parce que le client a tapé « L.113-12 » au lieu de « résiliation ».

**Le reranking.** Après la première recherche, un second modèle réordonne les résultats pour placer les plus pertinents en tête, avant de les remettre à l'IA. C'est le geste qui améliore le plus la précision pour le moindre effort. Anthropic rapporte, sur son propre banc d'essai, qu'en combinant contexte, recherche hybride et reranking, on réduit le taux d'échec de récupération jusqu'à 67 % ([Anthropic, Contextual Retrieval, 2024](https://www.anthropic.com/news/contextual-retrieval)).

**Le découpage respectueux de la structure.** Un RAG naïf coupe les documents en tranches de taille fixe, au milieu d'une phrase, d'un tableau ou d'une clause. Un RAG fiable respecte la structure : un article reste un article, un tableau reste entier. Bénéfice : la réponse ne perd plus une condition ou une exception restée dans la tranche d'à côté.

**L'évaluation continue.** « Ça marchait très bien en démonstration » n'est pas un test. Un RAG fiable est mesuré sur une série de cas types, avec des indicateurs suivis dans le temps. Bénéfice : quand vous changez quelque chose, vous savez si la qualité monte ou descend, au lieu de l'espérer.

Une dernière difficulté mérite d'être citée, car elle piège beaucoup de projets : les documents visuellement riches. Une facture, un contrat scanné, un schéma. Les approches récentes traitent alors la page comme une image plutôt que comme du texte, pour ne pas perdre la moitié du signal ([ColPali, ICLR 2025](https://arxiv.org/abs/2407.01449)).

> **Le RAG naïf face au RAG fiable (la plomberie)**
>
> | Critère | RAG naïf | RAG fiable |
> |---|---|---|
> | Recherche | Sémantique seule | Hybride : sens et mots-clés exacts |
> | Tri des résultats | Aucun | Reranking |
> | Découpage | Coupe tableaux et sections | Respecte la structure |
> | Qualité | Aucune mesure | Évaluation continue |
> | PDF scannés, tableaux | Perd la moitié du signal | Traite la page comme une image |
> | En production | Impressionne, puis déraille | Tient, et s'améliore |

## Les 3 garde-fous d'un RAG de confiance

Retrouver la bonne information ne suffit pas. Pour qu'une PME puisse s'appuyer sur les réponses, il faut trois garde-fous. Ce sont eux qui font la différence entre un outil qu'on recontrôle sans arrêt et un outil auquel on fait confiance.

**Garde-fou 1 : le sourcing vérifiable.** Chaque réponse cite la source précise sur laquelle elle s'appuie, et cette source est cliquable et vérifiable. Pas une bibliographie recollée en fin de réponse, mais un lien entre chaque affirmation et le passage exact qui la soutient. Point technique important : la référence doit être résolue depuis votre index, jamais fabriquée par le modèle, car un modèle laissé libre invente des liens plausibles mais faux. Les fournisseurs sérieux exposent d'ailleurs cette fonction nativement ([Anthropic, Citations, 2025](https://www.anthropic.com/news/introducing-citations-api)).

**Garde-fou 2 : l'abstention.** Un RAG de confiance sait dire « je ne sais pas d'après vos documents » au lieu d'inventer. Et surtout, ce refus ne repose pas sur la bonne volonté du modèle, qui, on l'a vu, préfère souvent répondre faux. Il repose sur une règle : en dessous d'un certain niveau de certitude, le système s'arrête et renvoie vers un humain. C'est la défense la moins chère contre l'erreur la plus grave.

**Garde-fou 3 : le contrôle d'accès.** Chacun ne doit voir que ce à quoi il a droit. Un RAG mal conçu ingère tout dans un même sac et se met à répondre les salaires ou les dossiers RH à n'importe qui. Un RAG de confiance filtre les documents selon les droits de la personne qui pose la question, avant même de chercher. Ce point rejoint les [garde-fous de gouvernance d'un agent IA](/blog/gouvernance-agents-ia-pme-2026/).

Ces trois garde-fous sont aussi votre grille de lecture face à un prestataire. S'il vous vend « une IA qui répond sur vos documents » sans savoir vous expliquer comment il assure le sourcing, l'abstention et le contrôle d'accès, il vous vend une démonstration, pas un système. Vous pouvez lui poser directement les questions : comment mesurez-vous la qualité ? Comment le système cite-t-il ses sources ? Que répond-il quand il ne sait pas ? Qui peut voir quoi ?

## À quoi sert un RAG dans une PME ?

Le RAG est utile partout où une équipe passe du temps à chercher une information dans une masse de documents. Voici trois cas robustes, où le bénéfice est concret et mesurable.

**Le support client sourcé.** Un assistant qui répond aux questions de vos clients à partir de vos conditions générales, de votre documentation produit et de votre foire aux questions. Avant : un conseiller fouille dans plusieurs documents et répond de mémoire, parfois à côté. Après : la réponse arrive en quelques secondes, avec le lien vers le passage exact, et le conseiller valide au lieu de chercher. Le sourcing protège autant le client que l'entreprise.

**L'assistant interne sur vos procédures.** Vos équipes posent des questions à votre base RH, à vos procédures internes, à vos comptes rendus. Avant : la même question revient dix fois par mois vers la personne qui « sait ». Après : chacun interroge l'assistant, qui répond en citant la procédure à jour. C'est proche de l'idée d'une [mémoire d'entreprise](/blog/llm-knowledge-base-memoire-ia-pme-obsidian-claude/), mais orientée récupération plutôt que compilation.

**Le juridique et la conformité.** C'est le cas où les trois garde-fous prennent tout leur sens. Un assistant qui répond sur un corpus réglementaire ou contractuel doit citer l'article exact, savoir s'abstenir plutôt que d'inventer une règle, et tenir compte de la version en vigueur à la bonne date. Un texte abrogé cité fidèlement reste une erreur. C'est particulièrement sensible pour les [professions soumises au secret professionnel](/blog/secret-professionnel-ia-avocats-2026/), où une réponse mal fondée devient un risque de responsabilité.

Dans les trois cas, le vrai gain n'est pas « l'IA fait le travail », mais « la bonne information arrive plus vite, avec sa source, et l'humain garde la main ». C'est aussi ainsi que se calcule un [retour sur investissement crédible](/blog/roi-ia-pme-donnees-2025-reussir-2026/) : sur le temps gagné et les erreurs évitées, pas sur une promesse.

## RAG et données personnelles : de quoi êtes-vous responsable ?

Dès que votre base documentaire contient des données personnelles, y brancher un RAG fait de vous le responsable de ce traitement. Ce n'est pas une nuance de juriste, c'est la position explicite de la CNIL : « le déployeur qui choisit de connecter le système à sa propre base de connaissance (RAG) sera lui aussi responsable de son traitement lorsqu'elle contient des données personnelles » ([CNIL, questions-réponses sur l'utilisation d'un système d'IA générative](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative)).

Concrètement, cela impose les réflexes habituels du RGPD, appliqués à votre base : ne pas ingérer plus de données que nécessaire, sécuriser l'accès, définir une durée de conservation, et pouvoir tracer d'où vient chaque réponse. Le contrôle d'accès vu plus haut n'est donc pas un confort, c'est une obligation.

À cela s'ajoute une échéance récente. Depuis le 2 août 2026, le règlement européen sur l'intelligence artificielle impose d'informer une personne qu'elle échange avec une IA, sauf si c'est évident ([règlement (UE) 2024/1689, article 50](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R1689)). Pour un assistant interne de connaissance, l'enjeu reste modéré, mais la règle mérite d'être formalisée, surtout si l'outil parle un jour à vos clients.

Bonne nouvelle : ces contraintes se traitent par l'architecture. Une base vectorielle hébergée en France ou dans l'Union européenne, des modèles d'embeddings européens ou hébergés chez vous, un traitement qui ne sort pas de l'espace européen. Vos documents ne quittent alors jamais l'Europe. C'est un argument que les guides publics encouragent, à l'image du [guide RAG de la Direction générale des entreprises](https://www.entreprises.gouv.fr/files/files/Publications/2024/Guides/20241127-bro-guide-ragv4-interactif.pdf) publié fin 2024. Pour une PME qui manipule des données sensibles, la souveraineté n'est pas une option marketing, c'est une réponse à une responsabilité.

## Faut-il construire un RAG ou acheter un outil packagé ?

C'est la vraie question de 2026, et elle a changé. Le RAG n'est plus forcément un projet : c'est devenu une fonction de nombreux outils du marché. Microsoft Copilot, ChatGPT Entreprise et divers connecteurs savent déjà répondre sur vos documents. La bonne question n'est donc plus « RAG ou pas », mais « l'outil packagé suffit-il, ou faut-il du sur-mesure ? ».

**L'outil packagé suffit** quand votre besoin est standard, votre volume documentaire modeste, et vos données peu sensibles. Inutile de construire ce que vous pouvez activer par abonnement. Pour une base de connaissance petite et stable, une simple [mémoire d'entreprise compilée](/blog/llm-knowledge-base-memoire-ia-pme-obsidian-claude/) ou un outil du marché feront souvent l'affaire.

**Le sur-mesure se justifie** quand vous cumulez plusieurs de ces contraintes : des données confidentielles, des droits d'accès fins à respecter entre services, un métier très spécifique que les outils génériques comprennent mal, un besoin de traçabilité pour un audit, ou une exigence de souveraineté. C'est exactement le terrain des trois garde-fous, et c'est là qu'une agence apporte de la valeur au-delà d'un abonnement.

Un mot sur une idée reçue tenace : les fenêtres de contexte géantes, capables d'avaler un million de mots d'un coup, n'ont pas rendu le RAG inutile. Un travail de la société Chroma montre que la précision des grands modèles chute de façon marquée quand l'information utile est noyée dans un très long contexte ([Chroma, Context Rot, 2025](https://www.trychroma.com/research/context-rot)). Charger tout votre corpus à chaque question coûte plus cher et répond souvent moins bien. L'approche qui gagne combine les deux : le RAG récupère le pertinent, le modèle le synthétise.

Même prudence sur les architectures « agentiques », où l'IA enchaîne plusieurs recherches en autonomie. C'est puissant sur les questions complexes, mais plus lent et plus coûteux. Plus autonome ne veut pas dire meilleur. Le bon réflexe est de réserver la complexité aux cas qui la méritent, comme nous le détaillons sur le [déploiement d'un agent IA opérationnel](/blog/agent-ia-operationnel-pme-guide-deploiement/).

Enfin, rappelez-vous que la technique ne fait pas tout. Un RAG parfaitement construit échoue quand même s'il n'a pas de responsable, si personne ne l'utilise, ou si l'équipe ne lui fait pas confiance. Ce volet humain, décisif, est traité dans notre [test des 7 signaux d'un projet IA qui tient en production](/blog/pourquoi-projet-ia-cale-avant-la-production/).

## Ce qu'il faut retenir

Un RAG n'est ni magique ni dangereux : c'est un moteur de recherche sourcé branché sur une IA, dont la fiabilité se construit. Si vous ne deviez retenir qu'une chose, ce serait celle-ci : quand une IA documentaire se trompe, ne cherchez pas un meilleur modèle, regardez comment elle retrouve l'information, et vérifiez qu'elle sait citer ses sources, s'abstenir et respecter les droits d'accès.

C'est aussi la technologie qui alimente les réponses de ChatGPT, Perplexity ou des aperçus IA de Google. Bien la comprendre, c'est aussi comprendre comment [être cité par ces moteurs](/blog/visibilite-ia-entreprise-cite-par-chatgpt/).

Vous avez un projet d'assistant sur vos documents, ou une démonstration qui rend bien mais que vous hésitez à généraliser ? [Réservez votre audit IA gratuit (30 min)](/diagnostic/) : nous regardons ensemble votre corpus, vos contraintes de confidentialité et le bon niveau de solution, packagé ou sur-mesure, avant d'engager le moindre budget.

## Sources et références

- Stanford RegLab et Institute for Human-Centered AI, sur le taux d'hallucination de 17 à 33 % des outils juridiques IA « grounded » (étude 2024) : [Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools](https://reglab.stanford.edu/publications/hallucination-free-assessing-the-reliability-of-leading-ai-legal-research-tools/)
- Bpifrance Le Lab, sur les 55 % de TPE et PME utilisant l'IA générative fin 2025 (contre 31 % un an plus tôt), 82e baromètre semestriel, janvier 2026 : [Bpifrance Le Lab présente son 82e baromètre](https://presse.bpifrance.fr/bpifrance-le-lab-presente-le-82eme-barometre-semestriel-de-conjoncture-aupres-des-tpe-pme-les-dirigeants-font-part-dun-leger-regain-de-confiance-pour-2026)
- McKinsey, sur les 88 % d'organisations utilisant l'IA et les 6 % en tirant un impact supérieur à 5 % de leur résultat d'exploitation, novembre 2025 : [The State of AI in 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)
- Google Research, sur la tendance des modèles à répondre faux plutôt qu'à s'abstenir face à un contexte insuffisant, 2025 : [Deeper insights into retrieval-augmented generation: the role of sufficient context](https://research.google/blog/deeper-insights-into-retrieval-augmented-generation-the-role-of-sufficient-context/)
- Anthropic, sur la réduction du taux d'échec de récupération jusqu'à 67 % via contexte, recherche hybride et reranking, 2024 : [Introducing Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
- Anthropic, sur la citation native des sources par le modèle, 2025 : [Introducing Citations on the Anthropic API](https://www.anthropic.com/news/introducing-citations-api)
- Chroma, sur la dégradation de précision des grands modèles en très long contexte, 2025 : [Context Rot](https://www.trychroma.com/research/context-rot)
- Faysse et al., sur le traitement des documents visuellement riches comme des images (ColPali, ICLR 2025) : [ColPali: Efficient Document Retrieval with Vision Language Models](https://arxiv.org/abs/2407.01449)
- CNIL, sur la responsabilité du déployeur d'un RAG traitant des données personnelles : [Les questions-réponses de la CNIL sur l'utilisation d'un système d'IA générative](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative)
- Règlement (UE) 2024/1689 (règlement sur l'intelligence artificielle), article 50 sur les obligations de transparence, applicable au 2 août 2026 : [EUR-Lex, règlement (UE) 2024/1689](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R1689)
- Direction générale des entreprises, guide de la génération augmentée par récupération, novembre 2024 : [Guide RAG (PDF)](https://www.entreprises.gouv.fr/files/files/Publications/2024/Guides/20241127-bro-guide-ragv4-interactif.pdf)
