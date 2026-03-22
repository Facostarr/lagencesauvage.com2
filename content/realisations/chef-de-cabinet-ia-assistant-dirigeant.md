---
title: "Le Chef de Cabinet IA : Libérez 10 à 15 heures par semaine en déléguant votre charge mentale"
description: "Découvrez comment un assistant IA proactif trie vos emails, prépare vos rendez-vous et assure le suivi client — pour que vous dirigiez au lieu de subir votre journée."
keywords:
  - assistant IA dirigeant
  - chef de cabinet virtuel
  - automatisation email dirigeant
  - assistant personnel IA TPE PME
  - gestion agenda IA
  - suivi client automatique
  - réduction charge mentale dirigeant
  - commande vocale WhatsApp IA
  - n8n assistant direction
  - productivité dirigeant TPE

client_industry: "Dirigeants TPE/PME, solopreneurs"
project_type: "Chef de Cabinet IA"
tech_stack:
  - name: "n8n"
    icon: "workflow"
    role: "Orchestration de 8+ sub-workflows (cerveau central)"
  - name: "Claude API"
    icon: "brain"
    role: "Routage sémantique, analyse et rédaction contextuelle"
  - name: "Gmail / Google Calendar"
    icon: "mail"
    role: "Tri emails, brouillons, gestion agenda"
  - name: "Notion"
    icon: "database"
    role: "CRM, second cerveau, gestion de tâches"
  - name: "WhatsApp (Evolution API)"
    icon: "message-circle"
    role: "Daily brief, commandes vocales, notifications"
  - name: "Whisper API"
    icon: "mic"
    role: "Transcription vocale et extraction de tâches"

card:
  summary: "Un assistant IA proactif qui trie vos emails, prépare vos rendez-vous et assure le suivi client — 10 à 15 heures de charge administrative récupérées chaque semaine."
  industry_label: "Direction & Management"

hero:
  title: "Libérez 10 à 15 heures par semaine en déléguant votre charge mentale"
  subtitle: "Un chef de cabinet IA qui trie vos emails, prépare vos rendez-vous et assure chaque suivi client — pour que vous dirigiez votre activité au lieu de la subir."
  metrics:
    - label: "Temps administratif récupéré"
      value: "10-15h/sem."
    - label: "Traitement emails"
      value: "÷ 4"
    - label: "Suivis post-réunion"
      value: "< 2h"

sommaire:
  - label: "Le constat"
    anchor: "constat"
  - label: "Le Gatekeeper"
    anchor: "gatekeeper"
  - label: "L'Executive Brief"
    anchor: "executive-brief"
  - label: "Le Copilote de Réunion"
    anchor: "copilote-reunion"
  - label: "La Commande Vocale"
    anchor: "commande-vocale"
  - label: "Architecture technique"
    anchor: "architecture"
  - label: "Questions fréquentes"
    anchor: "faq"

problem:
  title: "Le constat : vous dirigez votre entreprise — mais c'est elle qui mène votre journée"
  intro: "Vous avez créé votre entreprise pour décider. Aujourd'hui, vous passez vos journées à traiter des emails, chercher des informations et courir après des suivis. La valeur que vous apportez est noyée dans le bruit administratif."
  points:
    - icon: "mail-x"
      title: "Une boîte mail qui dicte votre agenda"
      description: "80 à 150 emails par jour. La moitié sont des newsletters ou des notifications sans importance. Mais au milieu, un email client urgent que vous repérez à 17h — trop tard pour réagir correctement."
    - icon: "clock"
      title: "Des heures perdues à préparer des rendez-vous"
      description: "Avant chaque réunion client, vous fouilllez dans vos emails, vos notes Notion, vos messages WhatsApp pour reconstituer le contexte. 15 à 20 minutes à chaque fois — multipliées par 4 à 6 rendez-vous par jour."
    - icon: "alert-triangle"
      title: "Des suivis qui tombent dans l'oubli"
      description: "Vous sortez d'une réunion productive. Trois appels plus tard, vous avez oublié d'envoyer le récapitulatif et de créer les tâches promises. Le client relance. Votre crédibilité en prend un coup."
    - icon: "calendar-x"
      title: "Une dispersion entre 5 outils ou plus"
      description: "Gmail, Notion, WhatsApp, Google Calendar, CRM — vos informations sont éparpillées. Aucune vue d'ensemble. Vous passez votre temps à chercher au lieu de décider."

pillars:
  - id: "gatekeeper"
    number: "1"
    title: "Le Gatekeeper — Tri intelligent de vos communications"
    tagline: "Seul l'essentiel arrive jusqu'à vous"
    description: "Le Gatekeeper analyse chaque email et message entrant en temps réel. Il catégorise, priorise selon vos règles VIP, et pré-rédige des brouillons de réponse. Les demandes simples sont traitées. Les urgences remontent immédiatement. Le reste attend son tour — classé, pas perdu."
    highlights:
      - "Catégorisation automatique des emails selon vos règles : clients VIP, prospects, fournisseurs, newsletters"
      - "Brouillons de réponse pré-rédigés dans Gmail, prêts à valider en un clic"
      - "Routing intelligent : les demandes opérationnelles sont dirigées vers les bonnes personnes de votre équipe"
      - "Archivage automatique des newsletters et notifications — consultables, mais hors de votre vue"
      - "Alertes instantanées WhatsApp pour les emails critiques (clients stratégiques, urgences)"
    tech_detail: "Trigger Gmail (webhook) → extraction contenu + métadonnées → classification sémantique (Claude API) → matching règles VIP → génération brouillon réponse → routing conditionnel (réponse directe / escalade / archive). Sub-workflows : Read Emails (3 nodes), Send Email (3 nodes)."
    workflows_count: "3 sub-workflows intégrés"

  - id: "executive-brief"
    number: "2"
    title: "L'Executive Brief — Votre synthèse matinale proactive"
    tagline: "En 30 secondes, vous savez ce qui vous attend"
    description: "Chaque matin, un message WhatsApp vous résume la nuit : emails urgents, opportunités détectées, agenda du jour, tâches en retard. Vous prenez vos premières décisions avant même d'ouvrir votre ordinateur. Vous ne subissez plus votre journée — vous la pilotez."
    highlights:
      - "Synthèse matinale WhatsApp à 7h30 : urgences, opportunités, agenda structuré"
      - "Détection proactive des opportunités noyées dans le flux d'emails"
      - "Rappel des tâches en retard et des engagements pris la veille"
      - "Résumé de fin de journée à 18h : état de la boîte mail, actions en attente de validation"
      - "Format scannable en 30 secondes — pas de pavé de texte"
    tech_detail: "Schedule 7h30 → agrégation emails non traités + événements Calendar + tâches Notion en retard → synthèse priorisée (Claude API) → formatage WhatsApp (Evolution API) → envoi. Schedule 18h → bilan journée."
    workflows_count: "1 workflow (Executive Brief Generator)"
    callout: "Journée type d'un dirigeant équipé : 07h30 — Daily Brief WhatsApp avec les 3 urgences, 2 opportunités et l'agenda du jour. 10h00 — Brief client automatique reçu avant le rendez-vous de 10h30. 14h00 — Vocal WhatsApp de 30 secondes post-réunion, le CRM Notion est mis à jour et le mail de suivi est en brouillon Gmail. 18h00 — Résumé Inbox Zero : newsletters archivées, réponses simples envoyées, 4 emails en attente de votre validation."

  - id: "copilote-reunion"
    number: "3"
    title: "Le Copilote de Réunion — Contexte avant, suivi après"
    tagline: "Arrivez préparé, repartez les mains libres"
    description: "Avant chaque rendez-vous, le Copilote compile un brief contextuel : historique des échanges emails, notes Notion, dernier compte-rendu, points en suspens. Après la réunion, il génère le compte-rendu, assigne les tâches dans Notion et prépare le mail de suivi en brouillon Gmail. 100 % des suivis post-réunion sont effectués sous 2 heures."
    highlights:
      - "Brief pré-réunion automatique : historique client, derniers échanges, points en suspens"
      - "Synthèse de 50 pages d'historique client en quelques secondes"
      - "Compte-rendu post-réunion généré automatiquement"
      - "Tâches extraites et assignées dans Notion à chaque membre de l'équipe"
      - "Mail de suivi client en brouillon Gmail — prêt à envoyer"
      - "Aucun engagement oublié, aucune action perdue entre deux réunions"
    tech_detail: "Trigger Calendar (30 min avant rdv) → query Notion (fiche client + historique) → query Gmail (derniers échanges) → synthèse contextuelle (Claude API) → envoi brief WhatsApp. Post-réunion : input vocal/texte → compte-rendu structuré → Create Notion Task (3 nodes) + Create Notion Note (3 nodes) + brouillon Gmail."
    workflows_count: "2 workflows (Meeting Prep Agent + Follow-up Tracker)"

  - id: "commande-vocale"
    number: "4"
    title: "La Commande Vocale — Pilotez d'un message WhatsApp"
    tagline: "30 secondes de vocal, 15 minutes d'administratif en moins"
    description: "Vous sortez de réunion. Vous envoyez un vocal WhatsApp de 30 secondes : 'Rappeler à Marc le devis avant vendredi, créer une tâche pour la proposition Durand, et envoyer le CR à l'équipe.' L'IA transcrit, extrait les tâches, met à jour Notion, et prépare les brouillons email. Le tout avant que vous n'arriviez à votre prochain rendez-vous."
    highlights:
      - "Transcription vocale en temps réel via Whisper API"
      - "Extraction automatique des tâches, rappels et instructions depuis le vocal"
      - "Mise à jour du CRM Notion sans ouvrir l'application"
      - "Génération de brouillons email à partir de vos instructions vocales"
      - "Fonctionne en déplacement — aucune application supplémentaire à installer"
    tech_detail: "Réception vocal WhatsApp (Evolution API webhook) → téléchargement audio → transcription (Whisper API) → extraction entités et intentions (Claude API) → routing : création tâches Notion / brouillons Gmail / mise à jour CRM → confirmation WhatsApp."
    workflows_count: "1 workflow (Voice Command Processor)"

architecture:
  title: "Sous le capot : l'architecture technique"
  intro: "8 sub-workflows interconnectés, orchestrés par n8n. Un agent IA central (Claude API) assure le routage sémantique — chaque message, email ou vocal est compris en contexte et dirigé vers le bon traitement."
  image:
    src: "/assets/images/architecture-chef-cabinet-ia.jpg"
    alt: "Diagramme d'architecture du Chef de Cabinet IA : Gatekeeper, Executive Brief, Copilote Réunion, Commande Vocale — orchestrés par n8n"
  flow:
    - name: "n8n (auto-hébergé)"
      role: "Orchestration — 8+ sub-workflows, routage, gestion d'état"
      color: "slate"
    - name: "Claude API"
      role: "Cerveau IA — classification, synthèse, rédaction contextuelle"
      color: "purple"
    - name: "Gmail / Google Calendar"
      role: "Emails, brouillons, agenda — via Google Workspace API"
      color: "blue"
    - name: "Notion"
      role: "CRM, second cerveau, tâches — base de données relationnelle"
      color: "indigo"
    - name: "WhatsApp (Evolution API)"
      role: "Canal de communication principal — briefs, commandes vocales, alertes"
      color: "green"
    - name: "Whisper API"
      role: "Transcription vocale — conversion audio en texte structuré"
      color: "orange"
  why_choices:
    - question: "Pourquoi WhatsApp plutôt qu'une application dédiée ?"
      answer: "WhatsApp est déjà sur votre téléphone. Pas d'application supplémentaire à installer, pas de nouveau mot de passe. Le dirigeant reçoit ses briefs et envoie ses commandes vocales depuis l'outil qu'il utilise déjà 50 fois par jour. L'adoption est immédiate."
    - question: "Pourquoi Claude API plutôt que ChatGPT pour le routage ?"
      answer: "Claude excelle dans la compréhension fine du contexte et le suivi d'instructions complexes. Pour un assistant de direction qui doit comprendre des nuances ('urgent mais pas pour aujourd'hui', 'répondre poliment mais fermement'), la qualité du raisonnement fait la différence entre un outil utile et un outil pénible."
    - question: "Pourquoi n8n plutôt qu'une solution SaaS clé en main ?"
      answer: "Les assistants IA grand public (ChatGPT, Copilot) ne se connectent pas à vos vrais outils. n8n auto-hébergé accède à Gmail, Notion, WhatsApp et votre CRM — vos données restent sous votre contrôle. Aucune information stratégique ne transite par un tiers non maîtrisé."
    - question: "En quoi est-ce différent d'un assistant humain ?"
      answer: "Le Chef de Cabinet IA ne remplace pas votre assistant(e). Il le libère de la saisie de données, du tri d'emails et de la prise de notes pour qu'il se concentre sur le relationnel et les tâches à forte valeur. L'IA est disponible 24h/24 avec une mémoire parfaite — aucun engagement oublié, aucun suivi perdu."

faq:
  - question: "Mes données emails et clients sont-elles en sécurité ?"
    answer: "n8n est auto-hébergé sur votre propre infrastructure. Vos emails et données CRM ne transitent par aucune plateforme tierce. Les appels à Claude API et Whisper sont chiffrés et ne sont pas utilisés pour l'entraînement des modèles. Vous gardez le contrôle total sur vos données stratégiques."
  - question: "Combien de temps prend le déploiement ?"
    answer: "Le déploiement initial prend 2 à 3 semaines. La première semaine est consacrée à l'intégration de vos outils (Gmail, Notion, WhatsApp) et à la configuration de vos règles VIP. Les deux semaines suivantes servent à calibrer le ton des réponses et à affiner le routage selon vos habitudes."
  - question: "Faut-il changer mes outils actuels ?"
    answer: "Non. Le système s'adapte à votre stack existante. Gmail, Outlook, Notion, Airtable, Google Calendar — les connecteurs sont modulaires. Si vous utilisez déjà ces outils, le Chef de Cabinet IA se branche dessus sans migration."
  - question: "Et si l'IA se trompe dans une réponse email ?"
    answer: "L'IA ne répond jamais à votre place sans validation. Elle prépare des brouillons dans Gmail que vous relisez et envoyez en un clic. Pour les emails courants (accusé de réception, confirmation de rendez-vous), vous pouvez activer l'envoi automatique après la phase de calibrage."
  - question: "Quel est le coût de ce système ?"
    answer: "Le déploiement relève de notre offre Transformation IA (à partir de 3 000 euros). La maintenance, l'optimisation et l'ajout de nouveaux workflows sont assurés via l'abonnement Assistant IA (500 euros par mois). L'audit gratuit de 30 minutes permet de chiffrer précisément votre projet."
  - question: "Puis-je ajouter des fonctionnalités après le déploiement ?"
    answer: "Oui. L'architecture est modulaire. Vous pouvez ajouter progressivement de nouveaux workflows : suivi de trésorerie, veille concurrentielle, gestion de projet. Chaque module se branche sur le cerveau central sans remettre en cause l'existant."
  - question: "Mon assistant(e) actuel(le) va-t-il perdre son poste ?"
    answer: "Non. Le Chef de Cabinet IA prend en charge les tâches répétitives et à faible valeur : tri d'emails, saisie CRM, prise de notes. Votre assistant(e) se concentre sur ce que l'IA ne sait pas faire : le relationnel client, la coordination d'équipe, les décisions qui demandent du jugement humain."

cta:
  title: "Vous voulez récupérer 10 à 15 heures par semaine ?"
  description: "Réservez un audit gratuit de 30 minutes. On analyse ensemble votre flux quotidien — emails, réunions, outils — et on identifie les tâches que votre Chef de Cabinet IA peut prendre en charge dès le premier mois."
  button_text: "Réservez votre audit IA gratuit (30 min)"
  button_url: "/#audit-form"
---

Le Chef de Cabinet IA est un assistant proactif qui prend en charge la charge administrative quotidienne des dirigeants de TPE/PME. Quatre modules complémentaires — tri intelligent des emails, synthèse matinale, copilote de réunion et commande vocale — s'intègrent à vos outils existants (Gmail, Notion, WhatsApp) pour que vous consacriez votre temps aux décisions qui comptent, pas à la gestion du bruit.
