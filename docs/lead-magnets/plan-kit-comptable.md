# Plan — Lead magnet C « Kit IA Cabinet Comptable »

Statut : plan validé Gemini (7,5/10 brut → corrections intégrées). En attente GO Franck pour production.
Article cible : `/blog/ia-cabinet-comptable-donnees-2025-reussir-2026/` (131 visites/trimestre, top 3 du blog, FAQ schema en place depuis le 2026-06-10).

---

## 1. Concept et angle

**L'angle : la restitution client, pas la production comptable.**

La production (saisie, collecte, rapprochement) est déjà couverte par Dext, Cegid Loop et consorts — et c'est la zone à risque (secret professionnel, hallucinations sur les chiffres). Là où Claude crée de la valeur immédiate et sans risque, c'est tout ce qui entoure le dossier : expliquer, restituer, communiquer, préparer. C'est aussi ce qui justifie les honoraires de conseil au moment où l'automatisation banalise la production.

Le kit s'appuie sur deux cas RÉELS déjà testés :
- **Le bilan expliqué** : un bilan PDF chargé dans Claude + un prompt → un document client en 6 sections (En une minute / compte de résultat / bilan / évolutions / indicateurs de santé / les 3 décisions à prendre) avec indicateurs visuels et encadrés pédagogiques. Testé sur un vrai dossier (avril 2026).
- **Le compte rendu de mission (CRM)** : projet Claude créé en formation avec des collaborateurs de cabinet — l'exercice qui a le plus plu.

**Règle d'écriture (retour Gemini)** : ne jamais montrer de code ni parler de HTML. Montrer le résultat (avant/après), donner le prompt prêt à coller dans Claude standard (web/desktop). Claude Code reste pour les démos en formation.

## 2. Titre — 3 options (choix Franck)

| # | Titre | Angle |
|---|-------|-------|
| A | **Kit IA Cabinet Comptable : 5 usages immédiats sans toucher à votre production** | Rassure d'emblée sur le risque (recommandé) |
| B | **Du bilan brut au document client : le kit IA du cabinet comptable** | Bénéfice valeur-conseil |
| C | **Kit IA Cabinet Comptable — restitution, comptes rendus, rendez-vous bilan** | Descriptif sobre |

Pas de promesse chiffrée dans le titre (zéro invention). Le sous-titre porte la réassurance : « 5 prompts prêts à coller · Aucune donnée client exposée · Par un organisme partenaire Qualiopi ».

## 3. Sommaire du PDF (10 pages max — retour Gemini : 1 page par cas)

| Page | Contenu |
|------|---------|
| 1 | Couverture |
| 2 | **Secret professionnel d'abord** : les 3 règles avant tout usage (anonymisation, paramétrage no-training, charte CNOEC). Tue l'objection n°1 immédiatement. |
| 3 | Pourquoi commencer par la restitution, pas la production (l'angle du kit en 1 page) |
| 4 | **Cas 1 — Le bilan expliqué au client.** Problème / le prompt complet / le résultat (capture anonymisée du vrai livrable, structure 6 sections) |
| 5 | **Cas 2 — Le compte rendu de mission.** Problème / les instructions du projet Claude réutilisable / la trame |
| 6 | **Cas 3 — La détection d'opportunités de missions.** Problème / prompt « analyse ce dossier et identifie 3 missions complémentaires à proposer » / résultat type. C'est du CA direct pour le cabinet (remplacement Gemini). |
| 7 | **Cas 4 — La réponse pédagogique au mail client complexe.** Le client qui envoie un roman sur un sujet TVA : synthèse + réponse claire en 2 minutes (remplacement Gemini). |
| 8 | **Cas 5 — La préparation du rendez-vous bilan.** Synthèse du dossier, questions à poser, points d'attention — la posture conseil. |
| 9 | Annexe — Pour les cabinets outillés : le pack open source Paperasse (PCG 800 comptes, liasses 2033/2065, facturation électronique 2026 ; MIT, référencé data.gouv.fr). Présenté comme preuve d'écosystème, pas comme tutoriel d'installation. |
| 10 | Aller plus loin : formation « Maîtriser Claude en entreprise » finançable OPCO Atlas (IDCC 787) + lien simulateur OPCO + audit gratuit 30 min |

Chaque cas d'usage = même gabarit : **le problème (2 lignes) → le prompt à coller (encadré) → ce que vous obtenez (visuel ou exemple) → le piège à éviter**.

## 4. Synergie OPCO Atlas (l'avantage compétitif)

Cabinet comptable = IDCC 787 = OPCO Atlas. Le site a déjà : le simulateur OPCO, la fiche branche `/simulateur-opco/branches/atlas-experts-comptables-787/`, la formation Qualiopi. Le kit est le cheval de Troie de la formation financée — l'expert-comptable adore ce qui est payé par ses cotisations. À marteler en page 10 et dans le nurturing.

## 5. Wiring technique (≈ 1 h grâce à la consolidation du 2026-06-09)

1. Entrée `kit-comptable` dans `MAGNETS` (`api/submit-lead-magnet.js`) : source Notion `Lead Magnet - Kit Comptable`, event `Kit Comptable Download`, email transactionnel avec lien PDF — **zéro nouvelle fonction Vercel** (7/12 utilisées)
2. Partial `layouts/partials/lead-magnet-kit-comptable.html` (gabarit identique aux 4 existants, mention RGPD incluse)
3. Tag `"Kit Comptable IA"` dans le front matter de l'article + condition dans `layouts/blog/single.html` ($i==2)
4. PDF → `static/assets/downloads/kit-ia-cabinet-comptable.pdf`
5. Goal Plausible `Kit Comptable Download` (action manuelle Franck)

## 6. Nurturing (3 emails MailWizz, pattern grille)

- **J+2 — micro-engagement** : « Testez le bilan expliqué sur UN dossier (anonymisé) » — le magic moment en 10 minutes
- **J+5 — l'objection** : secret professionnel, ce que vous pouvez et ne pouvez pas faire (anonymisation, no-training, charte CNOEC) — l'email de confiance
- **J+9 — l'offre** : « Votre OPCO (Atlas) peut financer la formation de vos collaborateurs » → lien simulateur pré-contextualisé + audit 30 min Calendly

## 7. Production — étapes et GO points

| # | Étape | Qui | Durée |
|---|-------|-----|-------|
| 1 | Validation de ce plan + choix du titre | Franck | — |
| 2 | Rédaction du contenu complet du kit (10 pages) | Claude | 1 session |
| 3 | Red team DeepSeek sur le contenu (comme la grille : critères fragiles, sur-promesses) | Claude | inclus |
| 4 | **Relecture Franck — GO obligatoire** (contenu métier comptable : vérifier chaque affirmation) | Franck | — |
| 5 | `create-kit-comptable.cjs` (docx v9.6.1, branding indigo, gabarit checklist) | Claude | inclus |
| 6 | Export PDF + dépôt `static/assets/downloads/` | Franck | 5 min |
| 7 | Wiring (MAGNETS + partial + tag + nurturing) + Preview Vercel | Claude | 1 h |
| 8 | Goal Plausible + emails MailWizz | Franck | 15 min |

## 8. Matériel demandé à Franck

1. **Capture anonymisée du bilan expliqué** (le livrable d'avril : `C:\Users\franc\Downloads\06_Bilan_2025\TEST BILAN\bilan-explique.html`) — anonymiser le nom client/chiffres ou me donner le feu vert pour générer une version fictive du même gabarit
2. **La trame du projet « compte rendu de mission »** créée en formation (instructions du projet Claude), si elle existe encore — sinon je la reconstruis et tu valides
3. Choix du titre (A/B/C)

## 9. Mesure du succès

- Référence : la checklist (article à 231 visites) et la grille — comparer le taux de conversion visiteur → download sur 30 jours
- Events : `Kit Comptable Download` (download), qualification dans Notion via source dédiée
- Le vrai KPI : leads cabinet → échanges Calendly → dossiers formation Atlas
