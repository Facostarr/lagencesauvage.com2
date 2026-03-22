---
weight: 6
title: "Cerveau d'Entreprise : accédez à 100 % de vos connaissances et surveillez vos marchés en 1 clic"
description: "Découvrez comment 4 workflows IA centralisent toute la mémoire documentaire de votre entreprise et surveillent marchés publics, procédures collectives et classement automatique de documents."
keywords:
  - RAG entreprise intelligence artificielle
  - base de connaissances IA entreprise
  - veille marchés publics automatique
  - veille procédures collectives IA
  - recherche documentaire IA
  - classement automatique documents
  - assistant IA RAG Supabase
  - n8n veille stratégique
  - cerveau entreprise IA
  - gestion documentaire intelligente

client_industry: "Cabinets d'avocats, BTP, bureaux d'études"
project_type: "Cerveau d'Entreprise & Veille Stratégique"
tech_stack:
  - name: "n8n"
    icon: "workflow"
    role: "Orchestration de 4 workflows (75 nodes)"
  - name: "Gemini (RAG)"
    icon: "brain"
    role: "Compréhension et génération de réponses contextuelles"
  - name: "Supabase (pgvector)"
    icon: "database"
    role: "Base vectorielle — mémoire documentaire interrogeable"
  - name: "Google Drive"
    icon: "folder"
    role: "Source documentaire principale — synchronisation continue"
  - name: "API Pappers"
    icon: "search"
    role: "Vérification et enrichissement données entreprises"
  - name: "Scraping qualifié"
    icon: "globe"
    role: "Collecte ciblée marchés publics et annonces légales"

card:
  summary: "4 workflows IA qui transforment vos documents éparpillés en une mémoire d'entreprise interrogeable en langage naturel, et qui surveillent marchés publics et procédures collectives pour vous alerter avant vos concurrents."
  industry_label: "Direction & Stratégie"

hero:
  title: "Accédez à 100 % de vos connaissances d'entreprise et surveillez vos marchés en 1 clic"
  subtitle: "4 workflows IA qui centralisent toute votre mémoire documentaire, surveillent les opportunités de marché, et classent automatiquement vos documents — pendant que vous vous concentrez sur vos dossiers."
  metrics:
    - label: "Workflows actifs"
      value: "4"
    - label: "Nodes total"
      value: "75"
    - label: "Sources surveillées"
      value: "Drive + Pappers + marchés publics"

sommaire:
  - label: "Le constat"
    anchor: "constat"
  - label: "Assistant RAG documentaire"
    anchor: "assistant-rag"
  - label: "Veille procédures collectives"
    anchor: "veille-procedures"
  - label: "Veille marchés publics"
    anchor: "veille-marches"
  - label: "Agent Zero Papier"
    anchor: "zero-papier"
  - label: "Architecture technique"
    anchor: "architecture"
  - label: "Questions fréquentes"
    anchor: "faq"

problem:
  title: "Le constat : votre savoir est dispersé, vos opportunités passent sous le radar"
  intro: "Votre entreprise accumule des années d'expertise dans des documents, des emails et des notes. Mais personne ne sait exactement où chercher — et pendant ce temps, vos concurrents captent les marchés en premier."
  points:
    - icon: "clock"
      title: "Des heures perdues à chercher un document"
      description: "Le contrat signé en 2023 ? Le compte-rendu de réunion avec ce sous-traitant ? La note technique du bureau d'études ? L'information existe quelque part — dans un Drive, un email, un dossier papier, ou dans la tête d'un collaborateur parti depuis six mois. Chaque recherche prend entre 15 et 45 minutes. Multipliez par cinq collaborateurs, cinq fois par jour."
    - icon: "alert-triangle"
      title: "Des opportunités de marché découvertes trop tard"
      description: "Un appel d'offres public dans votre secteur a été publié il y a trois jours. Un concurrent direct est en procédure de redressement judiciaire. Vous l'apprenez par hasard, au détour d'une conversation. Trop tard pour réagir. L'entreprise qui surveille ces signaux en temps réel décroche le marché — pas vous."
    - icon: "mail-x"
      title: "Des silos d'information entre services"
      description: "Le service juridique utilise un Drive. La direction technique stocke dans un NAS. La comptabilité travaille sur un autre outil. Personne n'a une vision consolidée. Les décisions stratégiques se prennent avec des informations partielles — et parfois obsolètes."
    - icon: "calendar-x"
      title: "Un classement documentaire qui repose sur la bonne volonté"
      description: "Les documents entrants — factures, contrats, courriers, PV de réception — s'empilent dans une boîte de réception commune. Le classement dépend de qui les traite, quand, et selon quelle logique. Résultat : des doublons, des fichiers mal nommés, et des pièces introuvables lors d'un contrôle ou d'un litige."

pillars:
  - id: "assistant-rag"
    number: "1"
    title: "L'assistant RAG documentaire"
    tagline: "Posez une question en français, obtenez la réponse depuis vos propres documents"
    description: "L'assistant indexe l'ensemble de vos documents professionnels — contrats, notes, rapports, emails archivés — dans une base vectorielle. Vous interrogez cette base en langage naturel, comme vous poseriez une question à un collaborateur expérimenté. La réponse cite ses sources avec les passages exacts."
    highlights:
      - "Indexation automatique de vos documents Google Drive (PDF, Word, tableurs, présentations)"
      - "Recherche sémantique : trouvez un document par son contenu, pas seulement par son titre"
      - "Réponses en langage naturel avec citation des sources et passages pertinents"
      - "Mémoire cumulative : plus vous alimentez le système, plus il devient précis"
      - "Accès instantané à des années d'expertise — même si le collaborateur qui détenait l'information est parti"
    tech_detail: "Trigger requête → query Supabase pgvector (recherche sémantique top-k) → injection contexte dans prompt Gemini → génération réponse sourcée avec citations → restitution formatée. 28 nodes."
    workflows_count: "1 workflow, 28 nodes"

  - id: "veille-procedures"
    number: "2"
    title: "La veille procédures collectives"
    tagline: "Sachez avant tout le monde quand un concurrent ou un client est en difficulté"
    description: "Le workflow surveille en continu les annonces de procédures collectives (redressement, liquidation judiciaire) dans votre secteur et votre zone géographique. Chaque alerte est vérifiée via l'API Pappers pour confirmer l'identité de l'entreprise et enrichir le contexte. Vous recevez une notification exploitable — pas du bruit."
    highlights:
      - "Surveillance quotidienne des annonces légales de procédures collectives"
      - "Filtrage par secteur d'activité, zone géographique et taille d'entreprise"
      - "Vérification croisée automatique via l'API Pappers (SIREN, statut, dirigeants)"
      - "Notification immédiate avec fiche synthétique : qui, quoi, depuis quand, quel impact potentiel"
      - "Détection précoce de risques fournisseurs et d'opportunités de reprise"
    tech_detail: "Schedule quotidien → scraping annonces légales (BODACC) → extraction entités → vérification API Pappers (SIREN, statut, activité) → scoring pertinence → notification email/Slack avec fiche synthétique. 27 nodes (21 + 6 vérification Pappers)."
    workflows_count: "2 workflows liés, 27 nodes"

  - id: "veille-marches"
    number: "3"
    title: "La veille marchés publics"
    tagline: "Les appels d'offres pertinents, filtrés et livrés chaque matin"
    description: "Le workflow scrute les plateformes de marchés publics, filtre les appels d'offres par secteur, montant et zone géographique, et vous livre chaque matin une sélection qualifiée. Plus besoin de passer une heure par jour sur BOAMP ou les plateformes régionales — le système fait le tri pour vous."
    highlights:
      - "Collecte automatique des marchés publics (BOAMP, plateformes régionales, JOUE)"
      - "Filtrage intelligent par code CPV, secteur d'activité, montant estimé et localisation"
      - "Analyse IA du cahier des charges pour évaluer la pertinence par rapport à vos compétences"
      - "Synthèse quotidienne avec les marchés les plus pertinents et leurs dates limites"
      - "Alerte prioritaire sur les marchés à forte adéquation avec votre profil"
    tech_detail: "Schedule quotidien → scraping plateformes marchés publics → extraction structurée (objet, CPV, montant, date limite, lieu) → filtrage multicritère → analyse pertinence LLM → classement par score → notification digest. 13 nodes."
    workflows_count: "1 workflow, 13 nodes"

  - id: "zero-papier"
    number: "4"
    title: "L'agent Zero Papier"
    tagline: "Chaque document entrant est classé, nommé et rangé automatiquement"
    description: "L'agent surveille un dossier d'entrée (Drive, email, ou scanner réseau). Chaque document entrant est analysé par IA : type identifié (facture, contrat, PV, courrier), contenu extrait, nom normalisé, et fichier déplacé dans le bon répertoire. Le classement devient systématique — sans intervention humaine."
    highlights:
      - "Détection automatique du type de document (facture, contrat, devis, PV, courrier)"
      - "Extraction des métadonnées clés (date, montant, parties, référence)"
      - "Renommage normalisé selon votre convention de nommage"
      - "Classement dans l'arborescence cible — chaque fichier au bon endroit"
      - "Indexation automatique dans la base RAG pour recherche ultérieure"
    tech_detail: "Trigger nouveau fichier (webhook Drive) → extraction texte (OCR si nécessaire) → classification LLM (type, catégorie) → extraction métadonnées → renommage normalisé → déplacement dossier cible → indexation Supabase pgvector. 7 nodes."
    workflows_count: "1 workflow, 7 nodes"

architecture:
  title: "Sous le capot : l'architecture technique"
  intro: "4 workflows interconnectés, 75 nodes au total, orchestrés par n8n. La base vectorielle Supabase sert de mémoire partagée entre l'assistant RAG et l'agent de classement. Les veilles fonctionnent en parallèle, de manière autonome."
  image:
    src: "/assets/images/architecture-cerveau-entreprise-veille.jpg"
    alt: "Diagramme d'architecture du Cerveau d'Entreprise : Assistant RAG, Veille Procédures Collectives, Veille Marchés Publics, Agent Zero Papier — orchestrés par n8n"
  flow:
    - name: "n8n (auto-hébergé)"
      role: "Orchestration — 4 workflows, schedules, gestion d'alertes"
      color: "slate"
    - name: "Supabase (pgvector)"
      role: "Base vectorielle RAG — mémoire documentaire et recherche sémantique"
      color: "green"
    - name: "Gemini"
      role: "Compréhension documentaire, classification, génération de réponses"
      color: "blue"
    - name: "Google Drive"
      role: "Source et destination documentaire — synchronisation bidirectionnelle"
      color: "yellow"
    - name: "API Pappers"
      role: "Vérification et enrichissement données entreprises françaises"
      color: "purple"
    - name: "Scraping qualifié"
      role: "Collecte ciblée BODACC, BOAMP, plateformes marchés publics"
      color: "orange"
  why_choices:
    - question: "Pourquoi du RAG plutôt qu'un chatbot classique ?"
      answer: "Un chatbot classique répond à partir de ses connaissances générales — il ne connaît pas vos dossiers. Le RAG (Retrieval-Augmented Generation) interroge d'abord votre base documentaire, récupère les passages pertinents, puis génère une réponse ancrée dans vos propres données. La différence : des réponses sourcées et vérifiables, pas des approximations."
    - question: "Pourquoi Gemini plutôt qu'OpenAI pour le RAG ?"
      answer: "Gemini offre une fenêtre de contexte étendue, particulièrement adaptée à l'analyse de documents longs (contrats, rapports techniques, cahiers des charges). Pour un cabinet d'avocats ou un bureau d'études qui manipule des documents de 50 à 200 pages, cette capacité fait la différence."
    - question: "Pourquoi Supabase plutôt qu'une autre base vectorielle ?"
      answer: "Supabase combine PostgreSQL (fiabilité éprouvée, requêtes SQL classiques) et pgvector (recherche sémantique). Vous bénéficiez d'une base de données complète, pas uniquement d'un index vectoriel. Les métadonnées, les droits d'accès et les filtres métier cohabitent avec les embeddings dans un seul système."
    - question: "Les documents sensibles sont-ils en sécurité ?"
      answer: "n8n est auto-hébergé — vos documents ne transitent pas par un service tiers non maîtrisé. Les embeddings stockés dans Supabase ne contiennent pas le texte brut, mais des représentations mathématiques. Les accès sont contrôlés par des rôles et des clés API. Pour les cabinets d'avocats soumis au secret professionnel, cette architecture respecte les exigences de confidentialité."

faq:
  - question: "Quels types de documents peuvent être indexés dans la base RAG ?"
    answer: "Tous les documents textuels : PDF, Word, Excel, PowerPoint, emails archivés, fichiers texte. Le système gère également les documents scannés grâce à l'OCR intégré. Les formats non textuels (plans AutoCAD, images techniques) peuvent être indexés via leurs métadonnées et descriptions associées."
  - question: "Combien de documents le système peut-il gérer ?"
    answer: "Il n'y a pas de limite pratique. La base vectorielle Supabase est conçue pour gérer des millions de vecteurs. Nos déploiements actuels traitent des bases documentaires de plusieurs milliers de fichiers sans dégradation de performance. Le temps de réponse reste sous les 3 secondes, quelle que soit la taille de la base."
  - question: "La veille marchés publics couvre-t-elle tous les secteurs ?"
    answer: "Le système est configurable par codes CPV (vocabulaire commun des marchés publics), secteur d'activité, zone géographique et tranche de montant. Il couvre les sources nationales (BOAMP, JOUE) et peut être étendu aux plateformes régionales. Le filtrage est affiné au fil du temps selon vos retours sur la pertinence des résultats."
  - question: "Faut-il former les équipes pour utiliser l'assistant RAG ?"
    answer: "L'interface est une simple zone de texte où vous posez votre question en français courant. Si vous savez utiliser un moteur de recherche, vous savez utiliser l'assistant. Une session de démonstration de 30 minutes suffit pour que toute l'équipe soit autonome."
  - question: "Combien de temps prend le déploiement initial ?"
    answer: "Comptez 2 à 3 semaines. La première semaine est consacrée à l'indexation de votre base documentaire existante et à la configuration des filtres de veille. La deuxième semaine sert au calibrage : affiner les réponses du RAG, ajuster les critères de veille, et valider la convention de nommage du classement automatique. La troisième semaine est une période de rodage accompagné."
  - question: "Quel est le coût de ce système ?"
    answer: "Le déploiement complet relève de notre offre Transformation IA (à partir de 3 000 euros). Ce tarif couvre la configuration des 4 workflows, l'indexation initiale de votre base documentaire, le paramétrage des veilles, et la formation de votre équipe. L'hébergement et la maintenance sont assurés via un abonnement mensuel défini lors de l'audit."
  - question: "Peut-on déployer uniquement la veille sans l'assistant RAG ?"
    answer: "Oui. Chaque workflow est indépendant. Vous pouvez commencer par la veille marchés publics ou la veille procédures collectives seules, puis ajouter l'assistant RAG et l'agent Zero Papier dans un second temps. L'audit gratuit permet de définir la combinaison la plus pertinente pour votre activité."

cta:
  title: "Vous voulez un cerveau d'entreprise qui travaille pour vous ?"
  description: "Réservez un audit gratuit de 30 minutes. On identifie ensemble vos sources documentaires, vos besoins de veille, et le potentiel d'un assistant RAG pour votre activité."
  button_text: "Réservez votre audit IA gratuit (30 min)"
  button_url: "/#audit-form"
---

Le Cerveau d'Entreprise est un système de mémoire augmentée qui rend l'intégralité de vos connaissances documentaires accessible en langage naturel, tout en surveillant votre environnement concurrentiel en temps réel. 4 workflows IA orchestrent la chaîne complète : indexation RAG de vos documents, veille procédures collectives avec vérification Pappers, veille marchés publics filtrée par secteur, et classement automatique des documents entrants — pour que vous soyez toujours le premier informé et le mieux préparé.
