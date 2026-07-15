---
weight: 7
title: "Hermes Agent : votre agent IA souverain, disponible 24/7"
seo_title: "Hermes Agent : agent IA souverain pour dirigeants"
description: "Un agent IA autonome qui tourne sur votre propre infrastructure, avec ou sans cloud. Mémoire persistante, présence multi-canal, zéro dépendance à un fournisseur unique."
keywords:
  - agent IA souverain
  - Hermes Agent entreprise
  - IA locale dirigeant
  - agent IA open source PME
  - souveraineté données IA
  - agent IA multi-canal
  - IA sans dépendance cloud

client_industry: "Dirigeants TPE/PME soucieux de souveraineté des données"
project_type: "Hermes Agent, IA souveraine"
tech_stack:
  - name: "Hermes Agent"
    icon: "cpu"
    role: "Harness open-source (Nous Research), orchestration, mémoire, skills"
  - name: "Modèle local (Qwen)"
    icon: "hard-drive"
    role: "Inférence locale via LM Studio ou Ollama, souveraineté totale"
  - name: "OpenRouter"
    icon: "cloud"
    role: "Fallback cloud à la demande, si le modèle local est indisponible"
  - name: "Vault Obsidian"
    icon: "book-open"
    role: "Mémoire structurée lisible humain et agent (méthode PARA)"
  - name: "Telegram et multi-canal"
    icon: "message-circle"
    role: "Passerelle unique vers 15+ plateformes de messagerie"
  - name: "n8n"
    icon: "workflow"
    role: "Orchestration des boucles et batchs déterministes"
  - name: "Claude Code CLI"
    icon: "terminal"
    role: "Délégation du raisonnement lourd (refactoring, audit, doc longue)"

card:
  summary: "Un agent IA autonome qui tourne sur votre propre infrastructure, avec ou sans cloud. Mémoire persistante, présence multi-canal, zéro dépendance à un fournisseur unique."
  industry_label: "IA Souveraine & Autonomie"

hero:
  title: "Un agent IA qui vous appartient, pas qu'on vous loue"
  subtitle: "Hermes Agent tourne sur votre propre infrastructure, avec ou sans cloud. Mémoire persistante, présence multi-canal, et zéro dépendance à un fournisseur unique. C'est l'agent qu'on utilise nous-mêmes, chaque jour."
  metrics:
    - label: "Temps récupéré / jour"
      value: "1h30-2h"
    - label: "Canaux unifiés"
      value: "15+"
    - label: "Coût API (config locale)"
      value: "~5 ct/j"

sommaire:
  - label: "Le constat"
    anchor: "constat"
  - label: "La mémoire à deux étages"
    anchor: "memoire"
  - label: "Les skills auto-générées"
    anchor: "skills"
  - label: "La présence multi-canal"
    anchor: "multicanal"
  - label: "L'architecture qui sait s'arrêter"
    anchor: "architecture-dag"
  - label: "Deux configurations réelles"
    anchor: "configurations"
  - label: "Architecture technique"
    anchor: "architecture"
  - label: "Questions fréquentes"
    anchor: "faq"

problem:
  title: "Le constat : votre IA vous appartient-elle ?"
  intro: "Vous avez adopté ChatGPT ou un assistant cloud. Il vous aide, mais il ne vous appartient pas : vos données transitent chez un tiers, votre historique s'efface à chaque session, et le jour où le fournisseur change ses conditions, vous n'avez pas voix au chapitre."
  points:
    - icon: "alert-triangle"
      title: "Dépendant d'un seul fournisseur IA"
      description: "Un changement de tarif, de conditions d'utilisation ou de disponibilité, et toute votre organisation autour de l'IA est remise en cause du jour au lendemain."
    - icon: "mail-x"
      title: "Vos données sensibles transitent par des tiers non maîtrisés"
      description: "Comptes clients, dossiers RH, stratégie commerciale : les outils IA grand public n'offrent aucune garantie claire sur où vont vos données."
    - icon: "calendar-x"
      title: "Un assistant qui oublie tout entre deux sessions"
      description: "Chaque conversation ChatGPT redémarre à zéro, sauf à payer une option qui ne retient que quelques faits choisis. Vous réexpliquez le même contexte, encore et encore."
    - icon: "clock"
      title: "Dispersé entre plusieurs messageries selon le contexte"
      description: "Telegram en déplacement, Slack au bureau, email le soir : vos outils IA ne se parlent pas entre eux, et vous perdez le fil."

pillars:
  - id: "memoire"
    number: "1"
    title: "Une mémoire à deux étages qui ne vous oublie jamais"
    tagline: "Plus vous l'utilisez, plus il vous connaît"
    description: "Hermes combine un index full-text SQLite (FTS5) qui rend chaque échange passé retrouvable en quelques millisecondes, et un moteur de modélisation dialectique (Honcho) qui construit une représentation évolutive de qui vous êtes et de ce sur quoi vous travaillez. Cette mémoire double survit aux redémarrages et aux mises à jour."
    highlights:
      - "Recherche instantanée dans tout l'historique de conversation (FTS5)"
      - "Modélisation évolutive du contexte utilisateur (Honcho)"
      - "Mémoire persistante entre les sessions et les canaux de communication"
      - "Aucune donnée n'a besoin de transiter par un service tiers pour être mémorisée"
    tech_detail: "Index SQLite FTS5 pour la recherche full-text sur l'historique complet des échanges. Moteur Honcho pour la modélisation dialectique de l'utilisateur (préférences, projets en cours, contraintes). Les deux systèmes tournent nativement sur l'infrastructure de l'agent, pas dans un cloud propriétaire."
    workflows_count: "Mémoire FTS5 + Honcho"

  - id: "skills"
    number: "2"
    title: "Des compétences qui s'écrivent toutes seules"
    tagline: "La première fois, il tâtonne. La dixième, il a une routine dédiée."
    description: "Une skill, dans le vocabulaire Hermes, est un fichier qui décrit comment résoudre une tâche récurrente. Hermes écrit lui-même ses skills quand il identifie un motif répété. La première fois qu'on lui demande de générer un rapport à partir d'une base de notes, il tâtonne. La dixième fois, il a une skill dédiée qui exécute la tâche en quelques secondes."
    highlights:
      - "Détection automatique des tâches répétitives"
      - "Génération de skills réutilisables sans intervention développeur"
      - "Bibliothèque de skills qui grandit avec l'usage réel de l'agent"
      - "Compatible avec le standard ouvert agentskills.io"
    tech_detail: "Chaque skill est un fichier texte structuré, versionnable, lisible et modifiable. Hermes propose la création d'une skill après avoir résolu une tâche complexe en plusieurs appels d'outils, mais la validation finale reste humaine avant qu'elle n'entre dans la bibliothèque permanente."
    workflows_count: "Skills auto-générées"

  - id: "multicanal"
    number: "3"
    title: "Une présence unifiée sur tous vos canaux"
    tagline: "Le même agent, la même mémoire, partout où vous êtes"
    description: "Hermes se connecte à Telegram, Discord, Slack, WhatsApp, Signal, Google Chat et une quinzaine d'autres plateformes à travers une seule passerelle. Vous lui parlez depuis Telegram en déplacement, depuis Slack au bureau : c'est le même agent, avec la même mémoire, qui suit la conversation."
    highlights:
      - "Une seule configuration pour 15+ plateformes de messagerie"
      - "Continuité de contexte quel que soit le canal utilisé"
      - "Notifications proactives (briefings, alertes) sur le canal de votre choix"
      - "Pas d'application supplémentaire à faire adopter à vos équipes"
    tech_detail: "Passerelle unique gérant l'authentification et le routage vers chaque plateforme. Un canal peut être défini comme canal principal pour les notifications proactives (crons, alertes), les autres restant disponibles pour l'interaction à la demande."
    workflows_count: "15+ plateformes, 1 passerelle"

  - id: "architecture-dag"
    number: "4"
    title: "Une architecture qui sait où s'arrêter"
    tagline: "Chaque outil reste dans son rôle, rien ne boucle sur lui-même"
    description: "Hermes n'essaie pas de tout faire. Il s'insère dans une architecture à trois niveaux, avec des règles strictes qui évitent le gaspillage et les boucles infinies : n8n orchestre les tâches répétitives et les gros volumes, Hermes traite l'analyse et la décision au cas par cas, Claude Code prend le relais sur le raisonnement le plus lourd."
    highlights:
      - "n8n gère les webhooks externes et les traitements en boucle sur de gros volumes"
      - "Hermes traite l'unité : une analyse, une décision, jamais une boucle de plus de 50 éléments"
      - "Claude Code est délégué uniquement pour le raisonnement complexe (refactoring, audit, documentation longue)"
      - "Sens unique strict : n8n peut appeler Hermes, jamais l'inverse, ce qui élimine les boucles de rétroaction"
    callout: "Un cron de veille quotidienne à 7h ? Hermes s'en charge nativement. Une réconciliation de plusieurs centaines de dossiers ? n8n boucle et appelle Hermes une seule fois par dossier. Un refactoring de code complexe ? Hermes délègue à Claude Code, qui a le temps et les outils pour le faire correctement."
    tech_detail: "DAG strict à 3 couches. L0 (n8n) : webhooks, batchs, ETL déterministe. L1 (Hermes) : raisonnement unitaire, crons d'hygiène propre, mémoire persistante. L2 (Claude Code CLI) : reasoning lourd sur délégation explicite via une skill dédiée, avec timeout et format de sortie strict. Aucun appel direct L0 vers L2."
    workflows_count: "3 couches, 0 boucle croisée"

  - id: "configurations"
    number: "5"
    title: "Deux configurations réelles, du 100% souverain au tout-cloud"
    tagline: "Vous choisissez votre curseur entre souveraineté et simplicité"
    description: "Il n'y a pas une seule bonne façon de déployer Hermes. Nous faisons tourner deux configurations bien distinctes en interne : une entièrement locale, sans aucun appel cloud pour l'inférence, et une entièrement cloud, sans investissement matériel. Les deux sont viables selon votre priorité : souveraineté maximale, ou simplicité de mise en route."
    highlights:
      - "Configuration locale : poste de travail avec 128 Go de mémoire unifiée, modèle Qwen chargé en local, zéro appel cloud pour l'inférence par défaut"
      - "Un Mac Studio avec 64 Go de mémoire unifiée est une alternative crédible pour la même approche locale (Apple Silicon dispose d'ailleurs de son propre fil de discussion actif sur la communauté Hermes)"
      - "Configuration cloud légère : VPS sans GPU, inférence via API, coût mensuel maîtrisé, aucun matériel à acheter"
      - "Fallback cloud automatique et plafonné en cas de panne du modèle local, pour ne jamais rester bloqué"
    tech_detail: "Config locale : modèle par défaut chargé en permanence pour les tâches courantes, second modèle plus lourd chargé à la demande pour le raisonnement approfondi (bascule manuelle, 30 à 60 secondes). Config cloud : conteneurs Docker, inférence via API tierce avec plafond de dépense strict."
    workflows_count: "2 architectures validées"

architecture:
  title: "Sous le capot : comment tout s'articule"
  intro: "Un harness d'agent, une mémoire structurée, une passerelle multi-canal, et une frontière stricte avec les autres outils d'automatisation. Voici comment les pièces s'assemblent."
  image:
    src: "/assets/images/architecture-hermes-agent.webp"
    alt: "Diagramme d'architecture Hermes Agent : n8n orchestre, Hermes raisonne avec mémoire/skills/passerelle multi-canal, délégation vers Claude Code pour le raisonnement lourd"
  flow:
    - name: "Hermes Agent"
      role: "Harness open-source, orchestration, mémoire, skills"
      color: "purple"
    - name: "Modèle local"
      role: "Inférence souveraine via LM Studio ou Ollama"
      color: "indigo"
    - name: "OpenRouter"
      role: "Fallback cloud plafonné, à la demande"
      color: "blue"
    - name: "Vault Obsidian"
      role: "Mémoire structurée, lisible humain et agent"
      color: "slate"
    - name: "n8n"
      role: "Orchestration des boucles et gros volumes"
      color: "green"
  why_choices:
    - question: "Pourquoi un harness open-source plutôt qu'un outil propriétaire ?"
      answer: "Un outil propriétaire vous engage sur sa feuille de route, ses tarifs, et sa politique de confidentialité. Un harness open-source sous licence MIT reste sous votre contrôle : vous choisissez le modèle qui fait l'inférence, vous hébergez où vous voulez, vous n'êtes jamais bloqué par la décision commerciale d'un tiers."
    - question: "Pourquoi une mémoire à deux étages plutôt qu'un simple historique ?"
      answer: "Un historique brut devient illisible au bout de quelques centaines de messages. L'index full-text permet de retrouver une information précise instantanément. Le second étage construit une compréhension structurée de vos priorités et de vos projets, pas juste un journal de conversation."
    - question: "Pourquoi séparer aussi strictement Hermes, n8n et Claude Code ?"
      answer: "Sans règle claire, un agent autonome peut boucler indéfiniment sur des tâches qui ne le justifient pas, ou solliciter un raisonnement lourd pour une question triviale. La séparation stricte évite le gaspillage de temps de calcul et garde chaque outil sur ce qu'il fait le mieux."
    - question: "Faut-il choisir entre configuration locale et configuration cloud ?"
      answer: "Non. Le choix dépend de votre priorité. La configuration locale offre une souveraineté maximale mais demande un investissement matériel initial. La configuration cloud légère se met en route en quelques heures, sans matériel à acheter, avec un budget mensuel prévisible. Les deux utilisent le même harness et les mêmes principes de mémoire."

faq:
  - question: "Qu'est-ce qu'un harness IA, et pourquoi Hermes en particulier ?"
    answer: "Un harness est la couche logicielle qui entoure un modèle de langage pour le transformer en agent capable d'agir : appeler des outils, conserver une mémoire entre les sessions, recevoir des messages depuis vos messageries, exécuter une tâche planifiée sans intervention humaine. Hermes Agent, publié par Nous Research sous licence MIT, est conçu spécifiquement pour l'autonomie always-on plutôt que pour la seule interaction à la demande."
  - question: "Faut-il être développeur pour faire tourner Hermes ?"
    answer: "Non, mais une configuration initiale reste nécessaire. C'est exactement ce que nous prenons en charge : nous installons, configurons et sécurisons votre Hermes personnalisé, quelle que soit la configuration choisie (locale ou cloud), et nous formons votre équipe à le piloter."
  - question: "Quelle différence avec le Chef de Cabinet IA ?"
    answer: "Le Chef de Cabinet IA est notre build propriétaire sur n8n et Claude API, pensé pour un déploiement rapide sans investissement matériel. Hermes est l'option souveraineté : un harness open-source, un modèle qui peut tourner intégralement sur votre infrastructure, et une présence native sur 15+ messageries au lieu d'un seul canal. Le choix dépend de votre priorité entre rapidité de mise en route et contrôle total de l'infrastructure."
  - question: "Mes données sont-elles plus protégées qu'avec un outil cloud classique ?"
    answer: "En configuration locale, oui de façon structurelle : l'inférence se fait sur votre propre machine, aucune donnée ne transite par un tiers par défaut. En configuration cloud légère, les données transitent par une API tierce comme avec n'importe quel outil cloud, mais vous gardez la propriété de votre vault de mémoire et de vos skills, hébergés et sauvegardés sous votre contrôle."
  - question: "Combien coûte l'utilisation de Hermes ?"
    answer: "Le harness est gratuit et open-source. En configuration locale avec un modèle déjà téléchargé, le coût d'inférence est quasi nul (quelques centimes par jour pour le fallback cloud de secours). En configuration cloud légère, comptez un budget mensuel maîtrisé pour le VPS et l'API, sans investissement matériel initial."
  - question: "Combien de temps prend le déploiement ?"
    answer: "Pour une configuration cloud légère, quelques jours suffisent. Pour une configuration locale complète avec modèle propre, comptez une à deux semaines incluant le choix et le calibrage du modèle, la configuration de la mémoire, et la connexion à vos outils existants."

cta:
  title: "Vous voulez votre propre agent IA souverain ?"
  description: "Réservez un audit gratuit de 30 minutes. On regarde ensemble si un Hermes personnalisé répond à votre contexte, et quelle configuration correspond le mieux à vos priorités."
  button_text: "Réservez votre audit IA gratuit (30 min)"
  button_url: "/diagnostic/"
---

Hermes Agent est un agent IA autonome open-source que nous faisons tourner nous-mêmes, chaque jour, sur notre propre infrastructure. Mémoire persistante à deux étages, skills auto-générées, présence unifiée sur 15 canaux de messagerie et architecture stricte avec nos autres outils d'automatisation : c'est notre réponse à la dépendance à un fournisseur IA unique. Deux configurations réelles et validées, de l'entièrement local à l'entièrement cloud, pour que la souveraineté reste un choix, pas une contrainte technique.
