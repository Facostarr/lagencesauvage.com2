---
title: "GEO Citation Tracker : savez-vous ce que les IA disent de votre marque ?"
description: "Outil SaaS de monitoring de la visibilité IA sur 5 plateformes (ChatGPT, Claude, Perplexity, Gemini, Grok). Scoring pondéré, dashboard interactif, alertes automatiques. MVP validé par 301 tests et 3 audits réels."
keywords:
  - visibilité IA marque
  - geo monitoring
  - citation tracking LLM
  - chatgpt mention marque
  - perplexity visibilité entreprise
  - audit GEO marque
  - monitoring IA automatisé
  - score visibilité moteurs IA
  - outil GEO agence SEO
  - SaaS monitoring IA

client_industry: "Agences digitales, consultants SEO, PME e-commerce, SaaS B2B"
project_type: "GEO Citation Tracker"
tech_stack:
  - name: "Python 3.13"
    icon: "code"
    role: "Langage principal — stack 100% custom, pas de no-code"
  - name: "FastAPI"
    icon: "server"
    role: "API REST haute performance — endpoints audit, scoring, alertes"
  - name: "SQLite"
    icon: "database"
    role: "Stockage local des audits, scores et historiques"
  - name: "Chart.js + Alpine.js"
    icon: "bar-chart"
    role: "Dashboard interactif avec graphiques et tendances"
  - name: "5 APIs LLM"
    icon: "brain"
    role: "OpenAI, Anthropic, Google, Perplexity, xAI"

card:
  summary: "Outil SaaS qui audite automatiquement ce que ChatGPT, Claude, Perplexity, Gemini et Grok disent de votre marque — avec scoring pondéré, dashboard interactif et alertes en cas de changement."
  industry_label: "Marketing Digital & SEO"

hero:
  title: "Savez-vous ce que ChatGPT dit de votre marque ?"
  subtitle: "Les moteurs de réponse IA sont devenus des prescripteurs. Le GEO Citation Tracker surveille votre visibilité sur 5 plateformes et vous alerte quand votre positionnement change."
  metrics:
    - label: "Plateformes surveillées"
      value: "5"
    - label: "Tests validés"
      value: "301"
    - label: "Audits réels réalisés"
      value: "3"

sommaire:
  - label: "Le constat"
    anchor: "constat"
  - label: "Audit multi-LLM simultané"
    anchor: "audit-multi-llm"
  - label: "Scoring pondéré et confiance"
    anchor: "scoring"
  - label: "Dashboard décisionnel"
    anchor: "dashboard"
  - label: "Alertes et monitoring continu"
    anchor: "alertes"
  - label: "CLI et API REST"
    anchor: "cli-api"
  - label: "Architecture technique"
    anchor: "architecture"
  - label: "Questions fréquentes"
    anchor: "faq"

problem:
  title: "Le constat : votre marque existe peut-être... mais les IA l'ignorent"
  intro: "Vos clients potentiels posent des questions à ChatGPT, Perplexity ou Gemini avant de chercher sur Google. Si votre marque n'apparaît pas dans ces réponses, vous perdez des opportunités sans même le savoir."
  points:
    - icon: "alert-triangle"
      title: "Un angle mort total sur votre visibilité IA"
      description: "Vous suivez votre positionnement Google, vos mentions sur les réseaux sociaux, vos avis clients. Mais personne ne surveille ce que les moteurs de réponse IA disent de votre marque. Sont-ils en train de recommander vos concurrents à votre place ? Impossible de le savoir sans outil dédié."
    - icon: "clock"
      title: "Des vérifications manuelles impossibles à tenir"
      description: "Tester manuellement votre marque sur 5 plateformes IA, avec différentes requêtes, plusieurs fois par semaine ? Comptez 3 à 5 heures par vérification — et les résultats changent d'un jour à l'autre. Aucune agence ne peut maintenir ce rythme à la main."
    - icon: "calendar-x"
      title: "Aucun outil sur le marché"
      description: "Les outils SEO classiques (Semrush, Ahrefs, SE Ranking) ne couvrent pas la visibilité sur les moteurs de réponse IA. Ce canal de découverte est en pleine croissance, mais reste un angle mort pour toute la profession."
    - icon: "mail-x"
      title: "Des changements de positionnement passés sous silence"
      description: "Un concurrent publie un article bien structuré et prend votre place dans les réponses de ChatGPT. Un LLM met à jour son modèle et votre marque disparaît des recommandations. Sans monitoring, vous ne le saurez jamais."

pillars:
  - id: "audit-multi-llm"
    number: "1"
    title: "L'audit multi-LLM simultané"
    tagline: "5 plateformes interrogées en parallèle, en une seule commande"
    description: "Le GEO Citation Tracker interroge simultanément ChatGPT, Claude, Perplexity, Gemini et Grok avec les requêtes pertinentes pour votre secteur. Chaque réponse est analysée pour détecter les mentions de votre marque, le sentiment associé, et votre position par rapport aux concurrents cités."
    highlights:
      - "Interrogation simultanée de 5 LLM : OpenAI, Anthropic, Google, Perplexity, xAI"
      - "Requêtes personnalisées par secteur et par intention de recherche"
      - "Détection avancée de mentions directes et indirectes de votre marque"
      - "Analyse de sentiment : recommandation positive, neutre ou négative"
      - "Identification des concurrents cités dans les mêmes réponses"
    tech_detail: "Requêtes parallèles via asyncio → 5 APIs LLM (OpenAI, Anthropic, Google, Perplexity, xAI) → parsing réponses → détection mentions (NLP) → analyse sentiment → stockage SQLite."
    workflows_count: "5 APIs, 1 audit unifié"

  - id: "scoring"
    number: "2"
    title: "Le scoring pondéré avec intervalles de confiance"
    tagline: "Un score fiable, pas une impression subjective"
    description: "Chaque audit produit un score de visibilité pondéré par plateforme. Le système effectue plusieurs exécutions (multi-runs) pour lisser la variabilité naturelle des LLM et calcule un intervalle de confiance. Vous obtenez un indicateur stable et actionnable, pas un chiffre aléatoire."
    highlights:
      - "Score de visibilité global et par plateforme (0-100)"
      - "Multi-runs pour lisser la variabilité des réponses LLM"
      - "Pondération par confiance : plus de runs = score plus fiable"
      - "Comparaison historique : évolution du score semaine après semaine"
      - "Benchmark sectoriel : votre score vs la moyenne de votre marché"
    tech_detail: "Multi-runs configurable → agrégation statistique → pondération par confiance (écart-type) → score normalisé 0-100 → stockage historisé SQLite → API REST pour consultation."
    workflows_count: "Scoring multi-runs automatisé"

  - id: "dashboard"
    number: "3"
    title: "Le dashboard décisionnel interactif"
    tagline: "Visualisez votre visibilité IA en un coup d'oeil"
    description: "Un tableau de bord web affiche vos scores par plateforme, l'historique des audits, les tendances d'évolution et le détail des mentions détectées. Les graphiques Chart.js permettent d'identifier immédiatement les plateformes où vous êtes visible — et celles où vous êtes absent."
    highlights:
      - "Vue d'ensemble : score global + scores par plateforme sur un seul écran"
      - "Graphiques d'évolution temporelle (Chart.js) : tendances sur semaines et mois"
      - "Détail des mentions : contexte exact de chaque citation par chaque LLM"
      - "Filtres par plateforme, par période et par type de requête"
      - "Interface légère et rapide (Alpine.js) — pas de framework lourd"
    tech_detail: "FastAPI (backend) → endpoints JSON → Alpine.js (réactivité frontend) → Chart.js (graphiques) → rendu côté client, aucun build nécessaire."
    workflows_count: "Dashboard temps réel"

  - id: "alertes"
    number: "4"
    title: "Les alertes et le monitoring continu"
    tagline: "Soyez prévenu quand votre visibilité IA change"
    description: "Un cron automatisé lance un audit complet chaque lundi à 6h. Si votre score varie au-delà d'un seuil configurable — en hausse comme en baisse — vous recevez une alerte email avec le détail des changements. Vous gardez le contrôle sans y penser."
    highlights:
      - "Audit automatique hebdomadaire (cron lundi 6h)"
      - "Alertes email en cas de variation significative du score"
      - "Seuils d'alerte configurables par plateforme"
      - "Détection des apparitions et disparitions de mentions"
      - "Historique complet des alertes pour analyse rétrospective"
    tech_detail: "Cron système → déclenchement audit complet → comparaison scores N vs N-1 → calcul delta → si delta > seuil : envoi email SMTP avec rapport détaillé → log alerte SQLite."
    workflows_count: "Monitoring hebdomadaire automatisé"

  - id: "cli-api"
    number: "5"
    title: "CLI et API REST pour intégration"
    tagline: "Intégrez le monitoring GEO dans vos outils existants"
    description: "Le GEO Citation Tracker expose une API REST complète et un CLI pour lancer des audits, consulter les scores et configurer les alertes. Les agences peuvent l'intégrer dans leurs dashboards clients, leurs rapports automatisés ou leurs workflows n8n/Make existants."
    highlights:
      - "CLI complet pour lancer des audits en ligne de commande"
      - "API REST documentée (FastAPI + Swagger auto-généré)"
      - "Endpoints : audit, scores, historique, alertes, configuration"
      - "Intégration possible dans n8n, Make, Zapier ou tout outil HTTP"
      - "Authentification par clé API pour accès sécurisé"
      - "Format JSON standard pour interopérabilité maximale"
    tech_detail: "FastAPI → documentation OpenAPI auto-générée → endpoints RESTful → authentification API key → CLI Python (click/typer) → même logique métier, deux interfaces."
    workflows_count: "API REST + CLI"

architecture:
  title: "Sous le capot : l'architecture technique"
  intro: "Stack 100% custom Python/FastAPI — pas de no-code. Chaque composant a été choisi pour sa fiabilité, sa testabilité et sa capacité à évoluer vers un SaaS multi-tenant."
  image:
    src: "/assets/images/architecture-geo-citation-tracker.jpg"
    alt: "Diagramme d'architecture du GEO Citation Tracker : Audit Engine, 5 APIs LLM, Analysis pipeline, SQLite, Dashboard Chart.js"
  flow:
    - name: "Python 3.13"
      role: "Langage principal — typage strict, asyncio pour requêtes parallèles"
      color: "indigo"
    - name: "FastAPI"
      role: "API REST + documentation Swagger — endpoints audit, scores, alertes"
      color: "green"
    - name: "SQLite"
      role: "Stockage audits, scores, historiques, alertes — léger et portable"
      color: "blue"
    - name: "Chart.js"
      role: "Graphiques interactifs — évolution scores, comparaisons plateformes"
      color: "purple"
    - name: "Alpine.js"
      role: "Réactivité frontend — filtres, navigation, interactions dashboard"
      color: "slate"
    - name: "OpenAI API"
      role: "Interrogation ChatGPT — détection mentions et analyse réponses"
      color: "gray"
    - name: "Anthropic API"
      role: "Interrogation Claude — couverture multi-LLM"
      color: "orange"
    - name: "Google AI API"
      role: "Interrogation Gemini — troisième source de données"
      color: "red"
    - name: "Perplexity API"
      role: "Interrogation Perplexity — moteur de recherche IA conversationnel"
      color: "blue"
    - name: "xAI API"
      role: "Interrogation Grok — cinquième plateforme de monitoring"
      color: "slate"
  why_choices:
    - question: "Pourquoi du Python custom plutôt qu'un outil no-code comme n8n ?"
      answer: "Le scoring pondéré multi-runs, le calcul d'intervalles de confiance et l'analyse NLP des mentions nécessitent une logique métier que les outils no-code ne gèrent pas nativement. Python permet un contrôle total sur les algorithmes, une couverture de tests unitaires complète (301 tests passants), et une architecture prête pour le passage en SaaS multi-tenant."
    - question: "Pourquoi interroger 5 LLM et pas seulement ChatGPT ?"
      answer: "Chaque LLM a ses propres sources, son propre modèle et ses propres biais. Votre marque peut être recommandée par Perplexity mais ignorée par Gemini. Surveiller une seule plateforme donnerait une vision partielle et trompeuse de votre visibilité IA réelle."
    - question: "Pourquoi SQLite plutôt qu'une base cloud ?"
      answer: "Pour le MVP, SQLite offre la simplicité maximale : zéro configuration, fichier unique, portabilité totale. La migration vers PostgreSQL pour le SaaS multi-tenant est déjà prévue dans l'architecture — SQLAlchemy abstrait la couche base de données."
    - question: "Pourquoi des multi-runs pour le scoring ?"
      answer: "Les LLM sont non-déterministes : la même question posée deux fois peut donner deux réponses différentes. Un score basé sur une seule exécution serait peu fiable. Les multi-runs avec pondération par confiance produisent un indicateur stable et actionnable."

faq:
  - question: "Le GEO Citation Tracker est-il disponible en accès libre ?"
    answer: "Le produit est en phase MVP. Nous proposons un accès anticipé aux agences et consultants SEO intéressés via une liste d'attente. Inscrivez-vous lors de votre audit gratuit pour être parmi les premiers utilisateurs."
  - question: "Puis-je auditer la visibilité IA de mes clients avec cet outil ?"
    answer: "C'est exactement le cas d'usage principal pour les agences. Le GEO Citation Tracker permet de lancer un audit pour n'importe quelle marque et de présenter les résultats à vos clients dans un rapport structuré. En attendant le SaaS, nous réalisons des audits GEO sur-mesure dans le cadre de notre offre Transformation IA."
  - question: "À quelle fréquence les audits sont-ils réalisés ?"
    answer: "En configuration standard, un audit complet est lancé automatiquement chaque lundi à 6h. La fréquence est configurable : quotidienne, hebdomadaire ou à la demande via le CLI ou l'API REST."
  - question: "Les résultats sont-ils fiables vu que les LLM changent souvent de réponse ?"
    answer: "C'est précisément pour cela que le système utilise des multi-runs avec pondération par confiance. Chaque audit exécute plusieurs requêtes et agrège les résultats statistiquement. L'intervalle de confiance vous indique la fiabilité du score obtenu. Plus le nombre de runs est élevé, plus le score est stable."
  - question: "Combien coûte un audit GEO sur-mesure en attendant le SaaS ?"
    answer: "L'audit GEO sur-mesure est inclus dans notre offre Transformation IA (à partir de 3 000 euros). Il comprend l'audit complet de votre visibilité sur les 5 plateformes, un rapport détaillé avec recommandations, et un plan d'action pour améliorer votre positionnement dans les réponses des IA."
  - question: "En quoi le GEO Citation Tracker est-il différent des outils SEO classiques ?"
    answer: "Les outils SEO (Semrush, Ahrefs, SE Ranking) surveillent votre positionnement sur Google. Le GEO Citation Tracker surveille votre visibilité sur les moteurs de réponse IA : ChatGPT, Claude, Perplexity, Gemini et Grok. Ce sont deux canaux de découverte distincts. L'un ne remplace pas l'autre — ils sont complémentaires."
  - question: "Peut-on intégrer les résultats dans un dashboard client existant ?"
    answer: "Oui. L'API REST expose tous les résultats en JSON standard. Vous pouvez intégrer les scores et les tendances dans n'importe quel outil qui accepte des requêtes HTTP : Looker Studio, dashboards agence, rapports automatisés via n8n ou Make."

cta:
  title: "Vous voulez savoir ce que les IA disent de votre marque ?"
  description: "Réservez un audit gratuit de 30 minutes. On lance un premier diagnostic de votre visibilité sur ChatGPT, Claude, Perplexity, Gemini et Grok — et on identifie les actions prioritaires pour apparaître dans les réponses IA de votre secteur."
  button_text: "Réservez votre audit IA gratuit (30 min)"
  button_url: "/#audit-form"
---

Le GEO Citation Tracker est un outil SaaS qui surveille automatiquement ce que les moteurs de réponse IA disent de votre marque. Il interroge simultanément ChatGPT, Claude, Perplexity, Gemini et Grok, analyse les mentions détectées, et produit un score de visibilité pondéré par plateforme. Un dashboard interactif affiche l'évolution de votre positionnement dans le temps, et des alertes email vous préviennent dès qu'un changement significatif est détecté. Stack 100% custom Python/FastAPI, validé par 301 tests et 3 audits réels.
