# Next Tasks — Refonte lagencesauvage.com

## Simulateur OPCO — Fix moteur budget per-dossier (2026-05-28)

### À trancher (Franck)

- [ ] **Commit `compute_budget.js`** : décider si on commite le fix moteur seul maintenant (recommandé) ou si on attend de clarifier `simulator-ready.json`.
- [ ] **Effet de bord IDCC 897** : valider que « Entre 2 500 € et 3 500 € » (au lieu de « Jusqu'à 2 500 € ») te convient. Sinon : restreindre le fallback aux seules branches PDC-horaire-only (897 garde son ancien rendu, BTP inchangé).
- [ ] **`static/data/simulator-ready.json` modifié dans le working tree** : 45 IDCC + 20 NAF enrichis (`cible_taille_entreprise`, `formule_max_lisible`, `frais_annexes`). **Pas produit par cette session.** Décider : committer cet enrichissement, ou `git checkout` pour revenir à HEAD. Si revert, re-lancer `node scripts/qa-simulator-delivery.mjs` pour confirmer que le fix moteur reste vert sur la data committée.

### Nettoyage flaggé (tâche séparée)

- [ ] Réécrire l'en-tête trompeur de `lib/simulateur-opco/compute_budget.js` (prétend être un port de `compute_budget.py`/`cross_validate.py` qui n'existent pas) → pointer vers la vraie QA JS.

## Post-session 2026-06-02 — Article mode copilote

- [ ] **Vérifier le rendu sur Vercel** : TOC flottant, takeaways, FAQ schema, image hero cockpit, liens internes vers AI Act + agent-ia-definition
- [ ] **Soumettre dans Search Console** : `https://www.lagencesauvage.com/blog/ia-prepare-vous-decidez-mode-copilote-pme/`
- [ ] **Maillage entrant** : ajouter un lien vers cet article depuis `agent-ia-operationnel-pme-guide-deploiement` (paragraph "human-in-the-loop") et depuis `zero-human-company` (section garde-fous)
- [ ] **Suite articles blog** : article 3/4 "Agents IA pour cabinets comptables 2026 : 5 tâches répétitives à déléguer" (timing post-fiscal — priorité juin)

## Suite Sprint S10 — Refonte visuelle OPCO (2026-05-26)

### Points à surveiller post-merge prod

- [ ] **Vérifier en prod** sur lagencesauvage.com : 3 pages échantillon sur mobile (Atlas, Syntec, AKTO HCR) — confirmer que les sticky TOC/CTA disparaissent bien <1024px et que le contenu reste lisible
- [ ] **Détails KPI à corriger** (déjà identifiés, non bloquants) :
  - Afdas et OPCO Santé ont `opco_nb_idcc: —` → la card "X branches" affichera "—" (lecture acceptable mais améliorable : utiliser `len(branches_idcc)` à la place)
  - AKTO Travail Temporaire : le parser n'a retenu que le 1er IDCC (1413), la branche a 2 IDCC (1413+2378). Slug match quand même via fallback IDCC dans le nom du slug.
- [ ] **Demander recrawl GSC** pour les 31 pages refondues (rendu enfin propre = indexation utile cette fois)
- [ ] **Monitoring Plausible** sur le bounce rate /simulateur-opco/* avant/après merge (hypothèse : baisse de 5-10 pts vu l'amélioration UX)

### Améliorations possibles si retour positif

- [ ] Ajouter une **scrollspy JS** sur la sticky TOC : highlight l'item actif quand on scroll dans la page (actuellement classe `.is-active` définie dans CSS mais pas mise à jour dynamiquement)
- [ ] **Étendre le pattern** aux 39 fiches branches IDCC restantes (sur ~59 disponibles dans `data/opco-database.json`) — le layout `branche-fiche.html` est déjà prêt, juste basculer `layout:` au moment de leur création
- [ ] **Page `/simulateur-opco/actions-collectives/`** : utilise encore `layout: "single"` (page éditoriale sans `opco_slug`). Possible de la migrer aussi sur `opco-fiche` ou sur un layout `editorial-fiche` dédié si on veut l'aligner visuellement.

## Phase 7 — Post-bascule (en cours)

### Fait (2026-03-23)

- [x] Merge refonte-2026 → main (61 commits)
- [x] Push production → Vercel live
- [x] Fix témoignages page Services (placeholders → vrais témoignages)
- [x] Grille stack 12 technos sur homepage + services (partial réutilisable)
- [x] Stack technique déplacée en bas de page (réassurance post-formulaire)
- [x] Fix redirect 301 blog impact-ia-pme-françaises (encodage URL ç)
- [x] Test 301 live : 22/23 OK → fix poussé → 23/23
- [x] Vérification citations LLM (position 1 marque, absent générique — normal post-lancement)
- [x] Sitemap vérifié dans Google Search Console
- [x] Recrawl demandé : homepage, services, réalisations, about, blog, diagnostic, faq
- [x] Recrawl demandé : 8 articles de blog

### À faire demain (2026-03-24) — Recrawl Search Console

Quota dépassé aujourd'hui. Demander l'indexation pour les 6 case studies :

- [ ] `https://www.lagencesauvage.com/realisations/automatisation-pole-financier-pennylane-expert-comptable/`
- [ ] `https://www.lagencesauvage.com/realisations/geo-citation-tracker-visibilite-ia-marque/`
- [ ] `https://www.lagencesauvage.com/realisations/usine-contenu-b2b-seo-linkedin-automatisation/`
- [ ] `https://www.lagencesauvage.com/realisations/chef-de-cabinet-ia-assistant-dirigeant/`
- [ ] `https://www.lagencesauvage.com/realisations/agent-telephonique-ia-reservation-restaurant/`
- [ ] `https://www.lagencesauvage.com/realisations/cerveau-entreprise-veille-strategique-rag-ia/`

### Suivi continu (2 semaines)

- [ ] Monitoring 404 dans Search Console
- [ ] Vérifier indexation des nouvelles pages (7-14 jours)
- [x] Fix sitemap.xml : toutes les pages incluses (articles, case studies, etc.)
- [ ] Supprimer ancien sitemap-blog.xml dans Search Console + resoumettre sitemap.xml

### Simulateur OPCO — S6 + S7 (prochaine session)

**Branche** : `feat/simulateur-opco` (15 commits) — flow e2e validé en Preview Vercel le 2026-05-23.

**S6 — QA + polish (~2h)** :
- [ ] Tests Playwright cross-browser sur le flow 5 états (Chromium, Firefox, WebKit)
- [ ] Validation manuelle sur 20 SIREN réels de `tests/fixtures/test_sirens.json` (idéalement compléter les `_TO_FILL_BY_FRANCK`)
- [ ] Audit Lighthouse a11y + perf (cible : 95+ partout)
- [ ] Passage skill `agence-sauvage-tone` sur tous les copy (hero, gate, reveal, manual, error)
- [ ] Mise à jour `content/confidentialite.md` : mentionner explicitement le nouveau traitement Simulateur OPCO (raison sociale + SIREN + email pour générer simulation et recontacter)
- [ ] OG image dédiée via Gemini : mockup interface simulateur (palette indigo/slate, jauge budget, factuel)
- [ ] Nettoyage Notion : supprimer la page test MCP `[TEST MCP] Diagnostic - à supprimer` + 4 leads `debug*@claude.test` / `verif@claude.test`

**S7 — Merge + announce (~1h)** :
- [ ] Audit conversion-audit-checklist sur `/simulateur-opco/` avant merge
- [ ] Merge `feat/simulateur-opco` → `main` (squash ou rebase ?)
- [ ] Vérification que les 23 redirections 301 existantes ne sont pas cassées
- [ ] Soumission Search Console : `/simulateur-opco/` + sitemap.xml
- [ ] LinkedIn announce : Franck (post sur l'outil + capture d'écran)
- [ ] Vérifier que `NOTION_API_KEY` + `NOTION_DATABASE_SIMULATEUR_OPCO` + `RESEND_API_KEY` + Telegram* + Plausible sont cochés **Production + Preview** dans Vercel

### Production de contenu (en cours)

- [x] Article "Comment être cité par ChatGPT" — SEO/GEO optimisé, image Gemini, 6 sources liées, bibliographie
- [x] Règle sourcing dans CLAUDE.md : liens hypertextes obligatoires sur toute citation
- [x] Mémoire sauvegardée : feedback_sources_links.md
- [x] Section "De la théorie à la pratique" — case studies en fin d'article blog (partial + layout réorganisé + matching 9 articles)
- [x] Brainstorm Claude + Gemini : 4 idées d'articles SEO/GEO (consensus 8/10 + 9/10)
- [x] Article "Facturation électronique 2026 : ce que Pennylane ne fait pas" — 5 angles morts PDP, case study Pôle Financier, 8 sources fraîches, 5 FAQ schema, image Gemini

### Campagne cold email experts-comptables (fait 2026-03-24)

- [x] LP "Collecte WhatsApp × Pennylane" : `/lp/collecte-whatsapp-pennylane/`
- [x] HTML/CSS statique, responsive, light mode forcé, formulaire → /api/submit-lead (Notion + notif email)
- [x] 3 images Gemini dédiées : mockup collecte, mockup association, architecture W1-W9
- [x] UTM : utm_source=mailwizz&utm_medium=email&utm_campaign=collecte-whatsapp-pennylane
- [x] Source lead : "Campagne Email - Collecte WhatsApp Pennylane" (pas de guide PDF envoyé)

### Validation en attente

- [x] Relire article "LLM Knowledge Base" — validé (2026-04-17)
- [x] Relire article "Zero Human Company" — validé (2026-04-17)
- [x] Soumettre LP `/lp/collecte-whatsapp-pennylane/` dans Search Console — fait (2026-04-17)

### Search Console — indexations à demander

- [x] Article AI Act : soumis (2026-04-17)
- [x] Article Zero Human Company : soumis (2026-04-17)

### Articles à rédiger cette semaine (plan validé)

- [x] Article "Claude Cowork en mars 2026 : 3 cas d'usage concrets pour les PME" — brainstorm 9/10, 14 sources, pushé 2026-03-24
- [x] Article "Zero Human Company : le mythe américain face à la réalité des PME françaises" — recherche multi-sources, consensus Claude+Gemini 9/10, pushé 2026-04-16
- [x] Article "AI Act : former vos collaborateurs à l'IA est désormais une obligation légale" — deep research Gemini 8m15, consensus 8/10, partenaire GhG Formations Qualiopi, validé + pushé 2026-04-16
- [x] Article "Agent IA : définition, cas d'usage et ROI pour les PME" — pushé (commits 6879f7d + 7dcc363)
- [x] Article "Claude for Small Business : agents IA PME France" — 2300 mots, consensus Claude+Gemini 9/10, liens croisés Claude Cowork, pushé 2026-05-15
- [x] Article "Déployer un agent IA opérationnel dans votre PME : guide pratique et roadmap 6 semaines" — pushé 2026-05-15 (keyword: agent IA opérationnel PME)
- [x] Soumettre article claude-cowork dans Search Console (re-indexation après ajout tag "Checklist IA" — 2026-05-21)
- [ ] Ajouter `related_realisations: automatisation-pole-financier-pennylane-expert-comptable` au front matter du nouvel article
- [ ] Article 3/4 : "Agents IA autonomes en PME : 3 cas d'usage réels qui remplacent les SaaS" — Guides pratiques (attention : différencier de l'article déploiement déjà publié — angle "SaaS-replacement" vs "guide opérationnel")
- [ ] Article 4/4 : "IA et professions juridiques : gain de temps et secret professionnel en 2026" — Expertise terrain (reporté)

### Lead magnets (en cours)

- [x] Lead magnet 1 — Kit 10 prompts Claude PME : PDF gate — PDF Playwright A4, layout gated (teaser + form), bouton DL direct après soumission, email lien PDF (2026-05-06)
- [x] Lead magnet 2 — Formation Claude entreprise : landing `/formation/maitriser-claude-entreprise/`, formulaire multi-step, PDF programme, API step1+step2, shortcode, nav, CTA article AI Act (2026-05-06)
- [x] Lead magnet A — "50 Prompts IA Prêts à l'Emploi pour PME" : 50 prompts ROCF, 6 catégories, docx+PDF 20p, API /api/submit-prompts, partial intégré /blog/art-du-prompt/ (tag "Prompts IA"), Plausible "50 Prompts Download" (2026-05-21)
- [x] Lead magnet B — "Checklist 30 Jours pour déployer Claude dans votre PME" : docx+PDF 4 semaines (S1 fondations, S2 cas d'usage, S3 adoption, S4 ROI) + quick wins + erreurs fatales + bonus email template, API /api/submit-checklist, partial lead-magnet-checklist, intégré /blog/claude-cowork-pme-cas-usage-mars-2026/ (tag "Checklist IA"), Plausible "Checklist Download" (2026-05-21)

---

### Lead magnet B — À faire en prochaine session

**Article cible :** `/blog/claude-cowork-pme-cas-usage-mars-2026/` — 231 visites (top article du site)
**Sujet :** "Checklist 30 jours pour déployer Claude dans votre équipe"
**Angle :** Guide opérationnel semaine par semaine (S1 fondations, S2 cas d'usage, S3 adoption équipe, S4 mesure ROI)

**Workflow (identique lead magnet A) :**
1. WebSearch multi-sources (best practices IA onboarding PME)
2. Gemini Deep Research (`mcp__gemini__gemini-deep-research`) — attendre résultats avant d'écrire
3. Challenge Gemini Pro (`mcp__gemini__gemini-query`, pro, thinkingLevel: high) sur le contenu DR
4. Consensus ≥ 8/10 → plan définitif
5. Créer `docs/lead-magnets/create-checklist.cjs` (docx v9.6.1, branding indigo, logo SVG+PNG fallback)
6. Générer le docx + laisser Franck exporter en PDF → `docs/lead-magnets/checklist-30-jours-claude-pme.pdf`
7. Copier PDF → `static/assets/downloads/checklist-30-jours-claude-pme.pdf`
8. Créer `api/submit-checklist.js` (Notion source: "Lead Magnet - Checklist 30 Jours", Plausible event: "Checklist Download")
9. Créer `layouts/partials/lead-magnet-checklist.html` (tag déclencheur: "Checklist IA")
10. Ajouter tag "Checklist IA" dans front matter `content/blog/claude-cowork-pme-cas-usage-mars-2026.md`
11. Ajouter condition `else if "Checklist IA"` dans `layouts/blog/single.html` ($i==2)
12. Créer Goal Plausible "Checklist Download"

**PDF URL cible :** `https://www.lagencesauvage.com/assets/downloads/checklist-30-jours-claude-pme.pdf`

---

### Lead magnet C — Prévu après B

**Article cible :** `/blog/ia-cabinet-comptable-donnees-2025-reussir/` — 131 visites
**Sujet :** "Kit IA pour cabinet comptable — les 5 premiers pas"
**Tag déclencheur :** "Kit Comptable IA"
**API :** `/api/submit-kit-comptable`
**Plausible event :** "Kit Comptable Download"

### Pages créées cette session

- [x] `/formation/maitriser-claude-entreprise/` — landing page formation complète (2026-05-06)

### Infrastructure email — Résolu (2026-05-15)

- [x] **RESEND_API_KEY** configurée dans Vercel + utilisée en production (lead reçu par email confirmé, clé active depuis 9 jours — vérifié 2026-05-15)

### Infrastructure (fait 2026-05-06 — ne pas modifier)

- [x] api/_notify.js : utilitaire centralisé Resend + Telegram (Promise.allSettled)
- [x] 5 endpoints migrés : submit-kit, submit-lead, submit-formation, submit-formation-flexible, submit-diagnostic
- [x] nodemailer retiré de package.json
- [x] SPF lagencesauvage.com mis à jour avec spf.resend.com
- [x] RESEND_API_KEY configurée dans Vercel Dashboard
- [x] Vars SMTP_* et SENDGRID_* supprimées de Vercel Dashboard
- [ ] Action manuelle Franck : supprimer entrée test Notion "Test / beforbiz@gmail.com"

### Outillage blog

- [ ] Créer commande `/new-article` (workflow article orchestré) — reporté
- [ ] Créer archetype Hugo `archetypes/blog.md` (template front matter) — reporté
- [x] Hugo Extended v0.158.0 installé en local + subst S: fonctionnel

### Leviers GEO prioritaires (post-lancement)

- [ ] Se faire citer dans un classement tiers (codeur.com, koino.fr, jedha.co)
- [ ] Contenu ciblant requêtes génériques ("comment choisir agence IA TPE", etc.)
- [ ] Renforcer E-E-A-T (témoignages, case studies, apparitions presse)

---

## Sprint 3 — Simulateur OPCO : extensions (à creuser)

Suite des Sprints 1+2 SEO/GEO (cf. changelog 2026-05-23). 3 axes proposés en fin de session :

### Idée 1 — Pages programmatiques par IDCC (sous-pages branches)

**Hypothèse** : générer des sous-pages branche (`/simulateur-opco/branches/{slug}/`) depuis la BDD OPCO normalisée du projet voisin `OPCO/` qui contient **59 fiches branches** (~80-100 lignes de contenu sourcé par fiche, validé humainement). Notamment **22 branches AKTO** déjà documentées (HCR IDCC 1979, Propreté 3043, Prévention-Sécurité 1351, Restauration rapide 1501, Travail temporaire 1413+2378, etc.).

**Démarche à scoper** :
- Format URL : `/simulateur-opco/branches/{slug}/` (ex : `hcr-1979`, `proprete-3043`) ou autre pattern à valider
- Contenu : intro client + dispositifs spécifiques branche + plafonds chiffrés + sources officielles + simulateur pré-filtré
- Réutiliser le script `scripts/generate-opco-subpages.py` (adapter pour les fiches branches)
- Risque thin content : à mitiger via contenu unique par fiche (les notes_libres BDD ont 1-3k chars chacune, suffisant)
- Volume cible Sprint 3 : 15-20 fiches branches top trafic potentiel (Syntec 1486, HCR 1979, Banque 2120, BTP, Pharmacie, etc.)

**Bénéfice SEO/GEO attendu** :
- Longue traîne par IDCC (volume très faible mais conversion proche de 100%)
- Maillage interne dense entre OPCO ↔ branches ↔ simulateur
- Couverture entité sémantique massive (Google + LLMs comprennent que ASV couvre l'intégralité du sujet)

### Idée 2 — Article blog complémentaire "Choisir son organisme Qualiopi pour formation IA"

**Hypothèse** : un article pilier complémentaire à `/blog/dispositifs-opco-2026-financer-formation-ia-pme/`. L'AI Act + le PDC OPCO exigent Qualiopi mais peu d'articles francophones expliquent comment **choisir** un OF Qualiopi pour l'IA.

**Démarche à scoper** :
- Plan : critères Qualiopi RNQ V9, vérifier NDA + audit DREETS, signaux qualité spécifiques formations IA (programme pédagogique, modalités e-learning, tutorat, certifications visées), pièges à éviter, comment vérifier un OF (annuaire France Compétences, DataDock historique, etc.)
- Cible : ~2000 mots, 6-7 H2, FAQ 4-5 Q/R, takeaways 3
- Maillage : article OPCO 2026 + page actions collectives + formation Claude
- Sources : France Compétences, Ministère du Travail Qualiopi, annuaire Mon Compte Formation, Décret n° 2019-565

**Bénéfice SEO/GEO attendu** :
- Cluster "Qualiopi + IA" sous-exploité en SEO
- Différenciateur autorité ASV (formateur via partenaire certifié Qualiopi déjà mentionné dans l'article OPCO)

### Idée 3 — Lead magnet "Checklist montage dossier OPCO 2026" (PDF)

**Hypothèse** : 4e lead magnet ASV (après les 3 PDFs déjà déployés) — checklist opérationnelle qui matérialise la "Procédure 5 étapes" de l'article blog OPCO. Cible : dirigeants TPE/PME qui veulent **agir** sur leur budget OPCO 2026.

**Démarche à scoper** :
- Contenu : checklist 30-40 items pour monter un dossier OPCO (identification OPCO → vérification éligibilité → choix OF Qualiopi → constitution dossier → dépôt + subrogation), avec liens vers les ressources officielles
- Format : docx → PDF (workflow LM existant validé, cf. mémoire `project_lead_magnets.md`)
- Tag déclencheur blog : "Checklist OPCO" (à insérer dans l'article blog OPCO via front matter)
- API : `/api/submit-checklist-opco.js` (réutiliser pattern existant)
- Notion source : "Lead Magnet - Checklist OPCO"
- Plausible event : "Checklist OPCO Download"
- URL cible : `https://www.lagencesauvage.com/assets/downloads/checklist-montage-dossier-opco-2026.pdf`

**Bénéfice conversion** :
- Capture lead post-lecture article blog OPCO (2388 mots = audience qualifiée)
- Ressource opérationnelle = perception de valeur immédiate
- Nurturing : récap email automatique + propose diagnostic 30 min

### Dette technique Sprint 3 — Bug schema doubled quotes

**Symptôme** : valeurs string JSON-LD avec guillemets littéraux (`"\"value\""` au lieu de `"value"`). Affecte WebApplication, Service, FAQPage sur `/simulateur-opco/`, les 11 sous-pages OPCO et `/simulateur-opco/actions-collectives/`.

**Cause supposée** : bug Hugo 0.158 `jsonify` ou parser YAML Go-YAML. 5 approches testées sans succès (Trim, .Description, LF endings, YAML plain/single-quoted, jsonify-bypass).

**Impact** : cosmétique (JSON valide, Google parse). Pas bloquant production mais sub-optimal pour rich snippets.

**Fix à prévoir** : custom JSON template Hugo via `printf` + `replaceRE` manuel (bypass complet de `jsonify`) OU upgrade Hugo si bug fix amont. Estimer 1-2h.

---

## 🎯 INITIATIVE : GTM Simulateur Formation (Q2 2026)

**Objectif** : Transformer le trafic du simulateur en leads IA qualifiés, avec un effort de maintenance minimal.
**Cible couverture** : 80% du trafic réel (pas 100% des ~700 IDCCs FR — Pareto).

**Plan consensus Claude+Gemini Pro 8/10 → 9.5/10 ajusté (2026-05-24)** avec 3 inversions critiques vs ma proposition initiale :
1. Priorité **TNS/FAF avant volume salariés** (time-to-revenue ICP — SASU IT = cible chaude)
2. Sourcing **assisté par IA** (Claude/GPT extrait les PDFs OPCO) au lieu de manuel 3-4h
3. **Pas de scraper maison** pour la maintenance — veille no-code Visualping

### ~~Sprint 1 — "Fix the Leaky Bucket" (TNS/FAF) ~8h~~ ❌ ABANDONNÉ 2026-05-26

**Décision** : abandon total après re-challenge Claude+Gemini (consensus 9.5/10 → **3.5/10 ajusté**). Cf. mémoire `feedback_icp_finance_offre.md`.

**Raisons du retournement** (vérifiées via web search sources officielles 2026) :
1. **Abonnement IA 500€/mois NON éligible FAF** (service opérationnel, pas action de formation au sens art. L6313-1). Seule la formation 1j Qualiopi via partenaire GhG est finançable.
2. **Plafonds FAF dérisoires** : AGEFICE distanciel 500€/an, FIFPL 600-1500€/an → financent 1 jour de formation à 1000€ max. Pas un funnel d'abonnement.
3. **Marge ASV quasi-nulle** : facturation Qualiopi obligatoire par partenaire GhG → part commission. Pas d'upsell : un freelance solo n'a pas d'équipe à équiper.
4. **Pollution CRM** : leads "freelance solo cherchant financement" diluent le scoring vs ICP réel PME 5-200 sal.
5. **Risque réputationnel** : promettre "financer votre transformation IA" alors que seul 1 jour de formation par partenaire est éligible.

**Conséquence** : on ne crée NI page pilier, NI traffic management. Les freelances tombent sur le CTA générique. Les ~8h sont 100% réallouées au Sprint 2 Big 5.

---

### Sprint 2 v2 — "High-Value 5" (ICP-driven + sourcing IA-assisté) ~8h — 🎯 PRIORITÉ 1

**Pivot 2026-05-26** : la v1 ("Big 5" volume — Commerces alim, Transports, Chimie, Optique, Métallurgie doublon) a été révisée par consensus Claude+Gemini (3/10 ajusté) → biais "couverture salariés FR" au détriment de l'ICP fit ASV.

**Hypothèse révisée** : ajouter 5 conventions à fort ICP ASV (cabinets, pharma, hospi, BTP cadres) génère plus de leads convertissables que 5 conventions à fort volume mais ICP faible (chauffeurs, ouvriers commerce alim).

**High-Value 5** (consensus Claude+Gemini 9.5/10) :
| # | IDCC | Convention | OPCO | Volume | Use case IA pivot |
|---|------|-----------|------|--------|-------------------|
| 1 | 787 | Experts-Comptables | EP | 150k | Pôle Financier Augmenté (case study existant ASV) |
| 2 | 1000 | Cabinets d'Avocats | EP | 80k | Recherche jurisprudence, conclusions, Claude Enterprise |
| 3 | 1996 | Pharmacie d'officine | EP | 75k | Ordonnances, stocks, fidélisation, agent rdv |
| 4 | 2264 | Hospitalisation privée | Santé | 250k | Dictée médicale, RH/admin, agent rdv |
| 5 | 1597 | BTP Cadres & ETAM | Constructys | 200k | Devis, rapports chantier (ingés vs garagistes) |

**État réel de la BDD** (audit 2026-05-26) :
- IDCC 787, 2264, 1597 : ABSENTS → à AJOUTER
- IDCC 1000, 1996 : présents OPCO EP sans détails → à ENRICHIR
- Correction OPCO importante : 787 est sous **OPCO Atlas** (pas EP)

**Tâches** :
- [x] **Phase Data pilote** (2026-05-26) : IDCC 787 Experts-Comptables — JSON + notes_libres + sources officielles validés. Cf. `docs/sprint-2-bigfive-v2/idcc-787-experts-comptables.md`.
- [ ] **Phase Data industrialisation** (~3h, session suivante) : appliquer le template validé sur IDCC 1000 (Avocats), 1996 (Pharmacie officine), 2264 (Hospi privée), 1597 (BTP Cadres ETAM). Chaque draft : WebFetch site OPCO + JSON + notes_libres ~2000 chars + sources liées. Validation Franck par draft.
- [ ] **Intégration BDD** (~1h, après validation des 5 drafts) : insérer les 5 entrées dans `static/data/simulator-ready.json` + clarifier le workflow `data/opco-database.json` projet local vs voisin `Simulateur OPCO/`.
- [ ] **Dev NAF suggestions** (~1h) : étendre `api/_simulateur/naf-suggestions.js` :
  - 69.20Z Activités comptables → 787 (auto: true)
  - 69.10Z Activités juridiques → 1000 (auto: false, beaucoup de sous-conventions)
  - 47.73Z Pharmacie d'officine → 1996 (auto: true)
  - 86.10Z, 86.21Z, 86.22A/B/C → 2264 (auto: true pour hospi, false pour mixtes)
  - 71.12A/B Ingénierie BTP → 1597 (auto: false, peut aussi être Syntec)
- [ ] **SEO 5 fiches programmatiques** (~2h) : générer via `scripts/generate-opco-branches.py`.

**Dette technique parallèle (~15 min)** : fusion fiches métallurgie 3127 + 3248 (la CCN unifiée 2026 a un nouveau IDCC mais c'est la même convention) → redirection 301 + alias front matter.

**Dette technique parallèle (15 min)** : fusion fiche métallurgie 3127 + 3248 (la CCN unifiée 2026 a juste un nouveau IDCC, pas une nouvelle convention) → redirection 301 ou alias front matter.

**Critère de sortie** : les 5 IDCCs remontent dans le simulateur en prod ET les 5 nouvelles pages SEO sont indexables (sitemap + lastmod).

**Métriques de succès révisées** (ICP-driven, pas volume) :
- Taux conversion lead → diag IA depuis ces 5 fiches : viser ≥ 12% (vs ~5% sur les 20 fiches existantes mélangées)
- Nb leads "Profession compatible offre ASV récurrente" (>= 5 sal, secteur tech/services/santé/juridique) : viser ≥ 5/mois
- Couverture salariés FR : +12 pts (~755k salariés en plus dans des secteurs où ASV peut vendre)

---

### Sprint 3 — Capture d'intentions + Drip SEO (continu post-S1/S2)

**Hypothèse** : la data utilisateur doit guider les prochains ajouts BDD, et Google préfère une croissance organique des pages SEO.

**Tâches** :
- [ ] **Tracking (1h)** : configurer les events Plausible additionnels :
  - `simulator_idcc_not_in_list` (déjà en place — vérifier)
  - `simulator_naf_auto_corrected` (déjà en place)
  - `simulator_faf_triggered` (à ajouter quand Sprint 1 fait)
- [ ] **Qualification IA (1h)** : ajouter un champ optionnel dans le form de capture email après l'entreprise reconnue :
  - "Votre objectif principal : ☐ Gagner du temps avec l'IA ☐ Outils bureautiques ☐ Formation métier ☐ Autre"
  - Stocké dans Notion comme `objectif_form_principal`
  - Transforme les leads "froids" en filtrables (priorité IA pour ASV)
- [ ] **SEO Drip** : planifier la publication des 39 pages branches restantes au rythme de **4 pages/semaine maximum** (anti-Helpful Content). Choix data-driven : prendre en priorité les branches dont les NAFs ressortent dans Plausible `simulator_idcc_not_in_list`.

**Critère de sortie** : Plausible remonte les vrais trous de couverture (vs hypothèses) ET le CRM Notion reçoit la qualification IA pour chaque lead.

**Métriques de succès** :
- % de leads qualifiés "IA" vs "Autre" : viser ≥ 40% de "IA"
- Croissance impressions Search Console sur les requêtes "budget formation IDCC XXXX" : +50% en 6 semaines
- Lead-to-diag rate sur prospects qualifiés IA : viser ≥ 12% vs ≤ 5% sur "Autre"

---

### Sprint 4 — Lean Maintenance (Set & Forget) ~2h setup

**Hypothèse** : le re-scraping automatique coûte plus en dev qu'une veille manuelle intelligente. Pour un fondateur solo, on évite la dette technique.

**Tâches** :
- [ ] **Ops (1h)** : configurer Visualping (ou équivalent free tier) sur les 11 URLs "Critères de financement" des OPCO. Notification email si changement de texte sur la page.
- [ ] **UX (1h)** : ajouter un micro-lien discret sous le résultat reveal :
  - "Un barème vous semble inexact ? Signalez-le nous"
  - Lien mailto ou petit form vers `/api/submit-feedback-simulateur`
- [ ] (Optionnel) Abonnement newsletter Centre Inffo / France Compétences pour alertes officielles.

**Critère de sortie** : le fondateur reçoit ≤ 1 email/semaine d'alerte changement barème OPCO. Maintenance trimestrielle ≤ 2h.

**Métriques de succès** :
- Temps maintenance réel : < 2h/trimestre mesuré
- Nb signalements prospects "barème inexact" / trimestre : monitorer
- Délai entre publication officielle nouveau barème OPCO et mise à jour BDD ASV : viser ≤ 2 semaines

---

### Décision GTM consensus : ORDRE D'EXÉCUTION (révisé 2026-05-26)

1. ~~Sprint 1 TNS/FAF~~ ❌ ABANDONNÉ — ICP mismatch + abonnement non-finançable
2. **Sprint 2 PRIORITÉ 1** (Big 5) — crédibilité B2B + volume salariés FR (+15 pts couverture)
3. **Sprint 3 en continu** (capture intent + drip SEO)
4. **Sprint 4 quand bande passante** (maintenance lean)

Total ~18h (au lieu de ~20h) pour passer de 64% à ~80% couverture **trafic réel** avec funnel qualifié IA.

### Angles morts à surveiller (rappel Gemini)

- **Email nurturing si pas de budget** : prospect avec budget faible/0€ ne doit pas tomber dans le vide → fallback contenu gratuit
- **Volume vs ICP** : éviter le piège de sourcer des conventions à fort volume (transport routier, supermarchés) qui ne convertiront pas sur l'abonnement IA 500€/mois
- **Maintenance scraper fragile** : NE PAS coder de scraper maison custom — toujours Visualping ou veille manuelle
