---
title: "Base de connaissances IA : comment donner une mémoire infaillible à votre PME (méthode Karpathy)"
date: 2026-04-16
lastmod: 2026-04-16
description: "Découvrez comment la méthode LLM Knowledge Base d'Andrej Karpathy permet à une PME de créer une mémoire d'entreprise persistante avec Obsidian, Claude et n8n — sans équipe technique dédiée."
summary: "En avril 2026, le tweet d'Andrej Karpathy sur les LLM Knowledge Bases a atteint 20 millions de vues. Il décrit une architecture simple qui donne aux IA une mémoire persistante. Voici comment une PME française peut l'orchestrer avec Obsidian, Claude et n8n pour transformer ses connaissances métier en actif durable."
keywords: ["base de connaissances IA", "LLM Knowledge Base", "mémoire IA PME", "Obsidian IA entreprise", "Karpathy wiki", "alternative RAG", "automatisation PME", "Claude n8n", "souveraineté données IA", "agence IA France"]
categories: ["Guides pratiques"]
tags: ["IA", "Obsidian", "n8n", "Claude", "Knowledge Management", "RAG", "Automatisation"]
author: "Franck Sauvage"
expertise: "Architectures IA et automatisation pour PME"
image: "/assets/images/blog/llm-knowledge-base-memoire-ia-pme-obsidian-claude.webp"
imageAlt: "Réseau de documents bruts entrant dans un cerveau IA géométrique indigo, qui génère des pages wiki structurées"
toc: true
readingTime: "9 min"
takeaways:
  - "La méthode Karpathy transforme vos documents internes en une wiki vivante maintenue par l'IA — une connaissance qui se bonifie, pas qui se ré-invente à chaque requête."
  - "L'architecture tient en 3 dossiers Markdown (raw / wiki / schéma) et peut être orchestrée avec n8n + Claude API sans équipe tech dédiée."
  - "Pour une PME française, l'enjeu clé est la souveraineté : Obsidian stocke tout localement, vos données ne quittent pas votre infrastructure."
faq:
  - question: "Qu'est-ce qu'une LLM Knowledge Base selon Karpathy ?"
    answer: "C'est un système dans lequel un agent IA compile progressivement des sources brutes (articles, PDF, comptes rendus) en une wiki Markdown persistante et interconnectée, stockée localement. À la différence du RAG classique qui re-dérive une réponse à chaque requête, la wiki se bonifie à chaque nouvelle source ingérée."
  - question: "En quoi ce système est-il différent du RAG traditionnel ?"
    answer: "Le RAG récupère des extraits de documents bruts à chaque question et génère une réponse éphémère. La LLM Knowledge Base compile d'abord les sources en pages structurées qui persistent, s'interconnectent et s'enrichissent mutuellement. C'est la différence entre un stagiaire qui recherche dans les archives à chaque fois et un expert qui a intégré toute l'histoire de l'entreprise."
  - question: "Faut-il des compétences techniques pour mettre en place ce système ?"
    answer: "Non. L'architecture de base (Obsidian + Claude API + n8n) peut être déployée en quelques heures par un non-développeur. Obsidian est une application desktop gratuite, n8n propose une interface visuelle low-code, et Claude opère via des prompts en langage naturel. L'Agence Sauvage peut prendre en charge l'intégration complète."
  - question: "Quels types de documents peut-on intégrer dans la wiki IA ?"
    answer: "Tout document textuel : comptes rendus de réunion, emails, contrats, fiches produit, procédures internes, articles sectoriels, transcriptions d'appels, tickets support, présentations. Le principe est que si votre équipe le produit ou le lit, l'IA peut l'ingérer et le capitaliser."
  - question: "Le stockage local dans Obsidian est-il conforme au RGPD ?"
    answer: "Oui. Obsidian stocke tout en fichiers Markdown locaux sur votre machine ou serveur. Aucune donnée ne transite via les serveurs Obsidian. Seul l'appel API à Claude (Anthropic) implique un traitement externe — ce qui est couvert par la politique de confidentialité d'Anthropic et peut être limité aux données non sensibles."
---

Vous avez probablement vécu cette scène : vous ouvrez une nouvelle conversation avec votre IA, vous tapez "bonjour", et vous commencez à ré-expliquer votre entreprise depuis le début. Vos clients types. Votre positionnement. Vos process. Votre jargon interne. Encore.

C'est le syndrome du "Jour de la Marmotte" appliqué à l'IA : chaque session repart de zéro. Et pendant ce temps, des années de connaissances métier dorment dans des dossiers partagés que personne ne consulte, des emails que personne ne retrouve, des comptes rendus que personne ne relit.

En avril 2026, Andrej Karpathy — co-fondateur d'OpenAI et ex-directeur de l'IA chez Tesla — a [publié un thread](https://x.com/karpathy/status/2039805659525644595) qui a atteint 20 millions de vues en quelques jours. Sa proposition est radicale dans sa simplicité : arrêtez d'utiliser les LLM pour générer du code ou des réponses éphémères. Utilisez-les pour compiler une mémoire persistante.

Voici comment une PME française peut orchestrer ce système — sans équipe tech dédiée.

---

## Ce qu'Andrej Karpathy a découvert (et pourquoi 20 millions de personnes ont réagi)

Karpathy a formulé le problème avec une clarté désarmante : il passait un temps croissant à "manipuler du code" avec ses LLM, alors qu'il aurait dû "manipuler de la connaissance". La distinction est fondamentale.

La plupart des gens utilisent ChatGPT, Claude ou Gemini comme des moteurs de génération ponctuelle. Vous posez une question, vous obtenez une réponse, la conversation se ferme, tout disparaît. Même les fonctionnalités "mémoire" intégrées dans ces outils ne font que stocker des préférences superficielles — pas la compréhension profonde de votre secteur, de vos clients, de vos procédures.

L'idée de Karpathy : utiliser l'IA pour maintenir une **wiki Markdown vivante** sur n'importe quel sujet de recherche. L'IA y dépose ses synthèses, ses analyses, ses connexions entre concepts. À chaque nouvelle source ingérée, elle enrichit ce qui existe déjà plutôt que de tout re-dériver.

Le résultat : Karpathy dispose aujourd'hui d'une wiki personnelle de plus de 100 articles et 400 000 mots, maintenue exclusivement par ses agents IA. Il ne l'a quasiment jamais écrite lui-même.

Le 3 avril 2026, sous la pression de la communauté, il a publié son [Idea File](https://github.com/ScrapingArt/Karpathy-LLM-Wiki-Stack) — non pas un logiciel, mais un fichier texte décrivant l'architecture. Sa logique : dans l'ère des agents IA, partager l'"idée" suffit. L'agent se charge de la construction.

---

## RAG vs LLM Wiki : la différence qui compte pour votre PME

Avant d'entrer dans l'architecture, il faut comprendre pourquoi cette approche diffère fondamentalement du RAG (*Retrieval-Augmented Generation*), qui est la technologie derrière la plupart des "chatbots sur vos documents" actuels.

**Le RAG classique fonctionne ainsi** : quand vous posez une question, le système parcourt vos documents bruts, extrait quelques passages pertinents, et génère une réponse à partir de ces extraits. À la prochaine question, il repart de zéro depuis les documents bruts. La connaissance ne s'accumule pas — elle est re-dérivée en permanence.

**La LLM Knowledge Base fonctionne différemment** : l'IA compile d'abord vos sources en pages de wiki structurées et interconnectées. Quand vous posez une question, elle consulte ces pages synthétisées — pas les documents bruts. Et chaque nouvelle question, chaque nouvelle source, enrichit la wiki plutôt que de la recréer.

| Dimension | RAG classique | LLM Knowledge Base |
|-----------|:---:|:---:|
| Persistance | Réponses éphémères | Connaissance compilée permanente |
| Amélioration | Statique | Se bonifie à chaque source ajoutée |
| Raisonnement complexe | Limité aux extraits | Multi-hop entre pages interconnectées |
| Auditabilité | Embeddings opaques | Markdown lisible, backlinks vérifiables |
| Coût long terme | Fixe (re-traite toujours) | Amorti (capitalise) |

Pour une PME, la conséquence est concrète : votre base de connaissances IA est un **actif qui prend de la valeur** avec le temps, pas un outil qui repart de zéro à chaque utilisation.

---

## L'architecture concrète : 3 dossiers, 1 agent, 0 code

L'architecture de Karpathy tient dans une structure de fichiers. Aucune base de données. Aucun serveur d'embeddings. Aucune configuration complexe.

```
vault-entreprise/
├── raw/          ← Sources immuables — l'IA ne touche JAMAIS à ce dossier
│   ├── comptes-rendus/
│   ├── fiches-clients/
│   └── procedures/
├── wiki/         ← Domaine de l'IA — créé et maintenu par l'agent
│   ├── index.md        (catalogue de toutes les pages)
│   ├── log.md          (journal chronologique de toutes les opérations)
│   ├── concepts/
│   └── entities/
└── CLAUDE.md     ← Schéma : conventions et instructions pour l'agent
```

**`raw/` — le coffre-fort de vos sources**

C'est ici que vous (ou vos automatisations) déposez les matières premières : comptes rendus de réunion, emails exportés, articles sectoriels, fiches techniques, transcriptions d'appels. L'IA n'y touche jamais — elle y lit uniquement.

**`wiki/` — la mémoire vivante**

C'est le territoire de l'IA. Elle y crée des pages pour chaque concept important, chaque entité (client, fournisseur, produit), chaque procédure. Chaque page contient un frontmatter YAML avec ses sources, ses pages liées, sa date de mise à jour et un niveau de confiance. Un `index.md` tient à jour le catalogue complet — ce qui permet à l'IA de naviguer sans base vectorielle.

**`CLAUDE.md` — le schéma de comportement**

Ce fichier d'instructions définit les conventions que l'agent doit respecter : format des pages, règles de nommage, protocole d'ingestion, gestion des contradictions. C'est lui qui transforme un LLM générique en mainteneur discipliné de votre base de connaissances.

**Obsidian** sert de frontend visuel : graphe des connexions entre pages, recherche rapide, navigation. Tout reste en fichiers locaux — aucune donnée ne quitte votre infrastructure.

---

## 3 cas d'usage concrets pour une PME française

### 1. Capitaliser le savoir avant qu'il parte avec un collaborateur

Chaque PME perd des années de connaissance quand un collaborateur clé démissionne ou part à la retraite. Ses méthodes de travail, ses relations client, ses astuces techniques — tout s'évapore.

Avec une LLM Knowledge Base : chaque email important, chaque compte rendu de réunion, chaque procédure documentée est ingéré par l'agent. En 6 mois, la wiki contient la substance du travail d'un collaborateur — accessible et interrogeable par son successeur dès le premier jour.

### 2. Générer des propositions commerciales sur-mesure en 10 minutes

Un commercial qui répond à un appel d'offres passe en moyenne 4 à 8 heures à compiler des éléments éparpillés : cas clients similaires, argumentaires par secteur, réponses aux objections habituelles, conditions tarifaires.

Si ces éléments sont compilés dans une wiki IA (alimentée par les propositions passées, les retours clients, les CR de négociation), l'agent peut générer un premier draft de proposition en quelques minutes — ancré dans l'historique réel de l'entreprise, pas dans un template générique.

### 3. Résoudre les tickets support sans escalade systématique

Un centre de support qui traite les mêmes questions en boucle perd un temps considérable à chaque rotation de personnel. Les nouvelles recrues passent des semaines à découvrir les cas particuliers, les exceptions, les workarounds non documentés.

Une wiki IA alimentée par l'historique des tickets résolus, les notes des techniciens, les documentations produit, permet à un agent de proposer instantanément des solutions fondées sur les vraies résolutions passées — avec citation de la source exacte.

---

## Comment orchestrer sans équipe technique : la stack n8n + Claude

La bonne nouvelle : vous n'avez pas besoin d'un développeur pour déployer ce système. L'orchestration low-code est aujourd'hui suffisamment mature.

**La stack recommandée pour une PME française** :

```
Sources → n8n → Claude API → Obsidian vault (local)
```

**n8n** (orchestrateur) : déclenche le flux quand une nouvelle source arrive. Par exemple : un email marqué d'un label "wiki" dans Gmail, un fichier déposé dans un dossier Google Drive, un formulaire rempli dans Notion. n8n peut être auto-hébergé pour un contrôle total des données.

**Claude API** : reçoit la source et les instructions du fichier schéma, génère les pages wiki en Markdown structuré selon les conventions définies.

**Obsidian** : reçoit les fichiers générés par Claude via n8n, les stocke localement dans la vault, permet la navigation et la visualisation du graphe.

Le workflow d'ingestion complet ressemble à ceci :

1. Un collaborateur dépose un CR de réunion dans un dossier partagé
2. n8n détecte le nouveau fichier (trigger)
3. n8n appelle Claude API avec le contenu + le prompt d'ingestion défini dans `CLAUDE.md`
4. Claude génère ou met à jour les pages wiki pertinentes
5. n8n écrit les fichiers Markdown dans le vault Obsidian
6. n8n met à jour `index.md` et `log.md`

**Coût mensuel estimé** :
- Obsidian : gratuit (usage personnel) ou 50 €/an pour usage commercial
- Claude API : entre 10 et 50 €/mois selon le volume d'ingestion
- n8n : gratuit en self-hosted, ~20 €/mois en cloud

Un coût total inférieur à celui d'une heure de prestation externe, pour un système qui tourne en continu.

**Un point sur le RGPD** : la wiki étant stockée en local dans Obsidian, vos données restent sur votre infrastructure. Seul l'appel API à Claude implique un transit vers les serveurs d'Anthropic — ce que vous pouvez limiter aux contenus non confidentiels, ou traiter avec un modèle déployé en local (Ollama + LLaMA 3) pour les données sensibles.

---

## Ce que L'Agence Sauvage peut construire pour vous

Décrire l'architecture est une chose. La déployer proprement — avec un schéma de wiki adapté à votre secteur, des flux n8n robustes, un protocole de gouvernance des sources et une formation de vos équipes — en est une autre.

Les PME qui se lancent seules dans ce type de projet buttent généralement sur trois points : la qualité du schéma initial (des conventions mal définies dès le départ contaminent toute la wiki), la fiabilité des flux d'ingestion (un trigger n8n qui échoue silencieusement sur certains types de fichiers), et la maintenance du `CLAUDE.md` quand la wiki évolue.

L'Agence Sauvage conçoit et déploie des architectures LLM Knowledge Base adaptées à votre métier : définition du schéma de wiki, mise en place des flux n8n, configuration des prompts d'ingestion, intégration avec vos outils existants (Gmail, Notion, Google Drive, HubSpot), et formation de l'équipe aux opérations courantes.

Le résultat : une mémoire d'entreprise opérationnelle en moins d'un mois, qui se bonifie automatiquement au rythme de votre activité.

**Réservez votre audit IA gratuit (30 min)** pour évaluer si cette architecture correspond à vos enjeux de capitalisation de connaissance.

---

## Sources et références

- Andrej Karpathy — [Tweet original sur les LLM Knowledge Bases](https://x.com/karpathy/status/2039805659525644595) (avril 2026)
- VentureBeat — [Karpathy shares LLM Knowledge Base architecture that bypasses RAG](https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an) (avril 2026)
- Medium / Neural Notions — [Andrej Karpathy Stopped Using AI to Write Code. He's Using It to Build a Second Brain Instead](https://medium.com/neuralnotions/andrej-karpathy-stopped-using-ai-to-write-code-hes-using-it-to-build-a-second-brain-instead-cddceadc5df5) (avril 2026)
- Medium / Data Science in Your Pocket — [Andrej Karpathy's LLM Knowledge Bases explained](https://medium.com/data-science-in-your-pocket/andrej-karpathys-llm-knowledge-bases-explained-2d9fd3435707) (avril 2026)
- Antigravity Codes — [Karpathy's LLM Wiki: The Complete Guide to His Idea File](https://antigravity.codes/blog/karpathy-llm-wiki-idea-file) (avril 2026)
- Jose Luis Chavez Calva — [Karpathy's LLM Knowledge Bases](https://joseluischavezcalva.substack.com/p/karpathys-llm-knowledge-bases) (Substack, avril 2026)
- GitHub / ScrapingArt — [Karpathy LLM Wiki Stack](https://github.com/ScrapingArt/Karpathy-LLM-Wiki-Stack)
- Anthem Creation — [LLM wiki Karpathy: knowledge base with Claude and Obsidian](https://anthemcreation.com/en/artificial-intelligence/karpathy-llm-wiki-claude-obsidian/) (avril 2026)
