# Status — Refonte lagencesauvage.com

## Phase en cours : 7 — Post-bascule 🔄

## Progression

| Phase | Statut | Date début | Date fin |
|-------|--------|-----------|---------|
| Phase 0 — Setup technique | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 1 — Design system | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 2 — Homepage | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 3 — Pages secondaires | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 4 — Intégration blog | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 5 — Quality gate | ✅ Terminée | 2026-03-22 | 2026-03-22 |
| Phase 6 — Bascule | ✅ Logo validé, merge main | 2026-03-23 | 2026-03-23 |
| Phase 7 — Post-bascule | 🔄 En cours | 2026-03-23 | — |

## Session 2026-06-09 (soir) — Audit complet + optimisation funnel (S14) — EN PROD

| # | Sprint | Statut | Commits |
|---|--------|--------|---------|
| S14.1 | Audit 4 axes (CRO, funnel lead gen, SEO/GEO technique, état projet) — 4 agents parallèles + vérification manuelle des constats critiques | ✅ | — |
| S14.2 | Quick wins funnel : step2 formation rattachée au lead Notion + event Plausible, email confirmation diagnostic, dédup Notion (`api/_leads.js`), fin du double comptage Plausible (6 formulaires trackaient client+serveur → server-side only), event `Lead Step 1` homepage | ✅ | `4daa534`→`be1c20d` |
| S14.3 | Consolidation API : 5 endpoints lead magnets → `api/submit-lead-magnet.js` (config MAGNETS). **11→7 fonctions Vercel, 5 slots libres** — lead magnet C débloqué. Rewrites legacy `?magnet=`, 11 tests routage (`tests/api/`) | ✅ | `a3e3ced` |
| S14.4 | SEO : suppression `static/sitemap.xml` (figé fév., écrasait le sitemap Hugo auto = 77 URLs dont 30+ pages OPCO/formation), lastmod git sur 9 articles modifiés, keywords sur 5 articles | ✅ | `3ea1156` |
| S14.5 | RGPD : mention consentement email + lien /privacy/ sur les 6 formulaires magnets | ✅ | `5fe72df` |
| S14.6 | Nurturing : 3 séquences rédigées (50 prompts, checklist 30j, kit) sur le pattern grille — `docs/lead-magnets/nurturing-*.md` | ✅ | `f59f7a3` |
| S14.7 | Calendly post-submit : bouton "Réserver mon créneau" sur les 3 confirmations (homepage, diagnostic, formation) + email diagnostic + CTA nurturing. Signature Franck. Merge ff → main | ✅ | `03fa932` |

**Actions Franck en attente** :
- [ ] Créer 2 Goals Plausible : `Lead Step 1` et `Programme Formation Qualification`
- [ ] Relire + programmer les 3 séquences nurturing dans MailWizz (listes par source Notion)
- [ ] ⚠️ Les **totaux** des Goals Plausible vont baisser (fin du double comptage) — les visiteurs uniques ne changent pas

**Backlog ouvert** : FAQ front matter sur 6 anciens articles (éditorial à rédiger + valider), lead magnet C kit comptable (= 1 entrée config MAGNETS, zéro fonction), incohérence durée 15 min (copy) vs Calendly 30 min à trancher.

**Setup local** : build Hugo local rétabli — `subst S:` + binaire 0.158.0 dans `C:/tmp/hugo158` (espaces du chemin OneDrive cassent postcss ; Hugo 0.163 winget incompatible). Cf. mémoire `build-hugo-local`.

## Session 2026-05-26 — Refonte visuelle pages OPCO + branches (Sprint S10)

| # | Sprint | Statut | Commits |
|---|--------|--------|---------|
| S10.1 | Diagnostic + plugin @tailwindcss/typography v4 | ✅ Prod | 72d40f0 |
| S10.2 | Layout pilote `opco-fiche` + 3 shortcodes + Atlas pilote | ✅ Prod | 72d40f0 |
| S10.3 | Script migration + 10 OPCO restantes | ✅ Prod | 13df5ac |
| S10.4 | Layout `branche-fiche` + 20 fiches branches IDCC | ✅ Prod | b6734cc |
| S10.5 | Merge `feat/refonte-pages-opco` → `main` | ✅ Prod | ebacc4c |

**31 pages refondues en prod** (11 OPCO + 20 branches) — pattern Doc-Landing (Stripe/Vercel) :
- Plugin `@tailwindcss/typography` activé (était silencieusement absent → bug racine du mur de texte)
- 3 colonnes desktop ≥1024px : TOC sticky | article prose | CTA sticky (simulateur + OPCO parent + diagnostic)
- KPI cards / table dispositifs badges colorés / chips IDCC cliquables (shortcodes Hugo)
- Contenu narratif et sources intégralement préservés (validation Franck sur Preview avant merge)

## Phase 0 — Tâches détaillées

- [x] Préparation docs (audit, playbook, stratégie skills)
- [x] Création skills custom (brand-identity, hugo-lagencesauvage, b2b-service-page-builder, conversion-audit-checklist)
- [x] Setup Claude Code (CLAUDE.md, settings, commands, hooks)
- [x] Cloner le repo et créer la branche `refonte-2026`
- [x] Installer Tailwind CSS v4 (npm + PostCSS + Hugo Pipes)
- [x] Migrer config Hugo : supprimer uglyURLs, mettre à jour menus, ajouter PostCSS aux security.exec
- [x] Créer le vercel.json complet (redirections 301 + headers)
- [x] Supprimer Hugo_projet/
- [x] Ajouter .mcp.json au .gitignore
- [x] Corriger vercel.json buildCommand (preset Hugo natif)
- [x] Ajouter @source dans main.css
- [x] Corriger 3 liens .html dans articles blog
- [x] Ajouter règles CLAUDE.md (redirections vercel.json only + classes TW dynamiques)
- [x] Configurer HUGO_VERSION dans Vercel Dashboard
- [x] Corriger build Vercel (Hugo 0.58→0.158.0 via build.env)
- [x] Vérifier build Vercel Preview — READY
- [x] **Validation Franck — GO Phase 1**

## Phase 1 — Tâches détaillées

- [x] Palette de couleurs : Premium Tech — indigo #4F46E5 / slate #0F172A / blanc #FFFFFF
- [x] Typographie : DM Serif Display (titres) + DM Sans (corps)
- [x] baseof.html : Hugo Pipes PostCSS, Google Fonts, structure flex
- [x] Header responsive : nav blanc, bordure subtile, CTA indigo
- [x] Footer : 4 colonnes, fond slate clair, menus dynamiques
- [x] Homepage placeholder : hero + CTA + section preuve sociale
- [x] Build Vercel Preview validé par Franck
- [x] Ajustements mobile (CTA resserré, espacements réduits)
- [x] Vérification rendu mobile — validé par Franck
- [x] **Validation Franck — Phase 1 terminée, GO Phase 2**

## Phase 2 — Tâches détaillées

- [x] Hero : proposition de valeur PAS + CTA audit gratuit
- [x] Section Pain points : framework PAS (3 colonnes)
- [x] Section "Ce qu'on livre" : refonte → bandeau chiffres + 3 mini-cartes cas clients + CTA /realisations/
- [x] Section Social proof : Olivier Sarezinski (Eurodom) + Myriam Louergli (Optimrezo)
- [x] Section FAQ : 6 questions avec schema FAQPage
- [x] Formulaire audit gratuit : 2 étapes progressives → /api/submit-lead
- [x] CTA final : fond slate dark
- [x] Schema LocalBusiness + meta tags enrichis
- [x] Positionnement élargi : "professionnels" (pas TPE/PME uniquement)
- [x] Animations premium : hero fade-in, scroll reveal, hover cards, FAQ grid animé
- [x] Témoignages textuels Olivier + Myriam (validés par Franck — consensus Claude+Gemini 9/10)
- [x] ~~Screenshots réels pour les 4 cartes livrables~~ (remplacé par mini-cartes cas clients)
- [x] ~~Lien Calendly pour confirmation formulaire~~ (reporté post-lancement)
- [x] **Validation Franck — Preview Vercel Phase 2** (2026-03-22)

## Phase 3 — Tâches détaillées

- [x] Page À propos : bio narrative 3 actes, credentials, stack, photo Franck, schema AboutPage
- [x] Layout single.html générique pour pages secondaires
- [x] Photo Franck optimisée (5436x3629 → 800x800, 7.4 Mo → 52 Ko)
- [x] Page Services : 3 offres Good-Better-Best (Assistant IA, Formation, Transformation)
- [x] Prix validés : Assistant 500€/mois + setup 1000€, Formation 1000€/jour, Transformation 3000€
- [x] Stack technique alignée sur toutes les pages (Make retiré, Evolution API + Hugo+Vercel ajoutés)
- [x] Stack technique enrichie sur 4 pages (About, Services, Homepage, FAQ) — 12 technos issues des 6 case studies
- [x] Page Réalisations : section listing + case study "Pôle Financier Augmenté" (5 piliers, 13+ workflows, sommaire cliquable, API La Poste LReL, schema TechArticle+FAQPage, assets Gemini)
- [x] Case study "Usine à Contenu B2B" : 5 piliers (Topic Discovery, Veille RAG, Rédaction SEO/GEO, LinkedIn, Hugo Blog), 105 nodes, diagramme architecture Gemini
- [x] Template single.html dynamique : image architecture pilotée par front matter (architecture.image)
- [x] Page Diagnostic IA : landing page SEO fidèle à l'ancienne page (13 sections, méthode J1→J5, tableau comparatif, formulaire appel découverte)
- [x] Page FAQ complète : 18 questions GEO-optimisées, 5 catégories, schema FAQPage, accordion par catégorie
- [x] Pages légales : mentions légales, confidentialité, CGV — contenu migré + layout single.html + lien CGV ajouté au footer
- [x] Case study "GEO Citation Tracker" : SaaS Python/FastAPI, 5 APIs LLM, scoring pondéré, dashboard Chart.js, diagramme architecture Gemini
- [x] Case study "Chef de Cabinet IA" : 4 piliers (Gatekeeper, Executive Brief, Copilote Réunion, Commande Vocale), scénario journée type, diagramme architecture Gemini
- [x] Case study "Agent Téléphonique IA" : 4 piliers (réception, réservation, escalade, 2 options déploiement), diagramme architecture Gemini
- [x] Case study "Cerveau d'Entreprise & Veille" : 4 piliers (RAG documentaire, veille procédures collectives, veille marchés publics, agent zero papier), diagramme architecture Gemini
- [x] Ordre des case studies par weight (1→6, meilleurs en premier)
- [x] **Validation Franck — Preview Vercel Phase 3** (2026-03-22)

## Phase 4 — Tâches détaillées

- [x] Brainstorm Claude + Gemini : blog "Édition Premium IA 2026" (consensus 8/10)
- [x] Layout blog/list.html : article vedette + grille + carte CTA intégrée + filtres catégories
- [x] Layout blog/single.html : lecture plein écran, 4 CTAs subtils, key takeaways, TOC flottant
- [x] Styles blog dans main.css : progress bar, prose typography, TOC panel, CTA sticky
- [x] assets/js/blog.js : progress bar, TOC highlight, copy anchor, scroll reveal, CTA sticky
- [x] blog.js chargé conditionnellement dans baseof.html (section blog uniquement)
- [x] 8 hero images générées par Gemini (abstraites, géométriques, palette indigo/slate, <40Ko chacune)
- [x] Front matter enrichi : takeaways + image + imageAlt sur les 8 articles (contenu texte inchangé)
- [x] Corrections techniques : /blog.html→/blog/, /about.html→/about/ dans schema + params
- [x] Fix liens blog : .Permalink → .RelPermalink (navigation cassée sur preview Vercel)
- [x] **Validation Franck — Preview Vercel Phase 4** (2026-03-22)

## Phase 5 — Tâches détaillées

- [x] Audit SEO : meta tags, OG, JSON-LD, canonical, hreflang, sitemap, robots.txt — complet
- [x] Audit redirections 301 : 23/23 conformes au playbook + 2 extras légitimes
- [x] Audit conversion CRO : CTAs, formulaires, social proof, trust signals
- [x] Brainstorm Claude + Gemini quality gate (consensus 8/10)
- [x] Fix SEO : og:locale dédupliqué, og:image:width/height ajoutés, dates TechArticle ISO 8601
- [x] Fix CRO : header sticky (top-0 z-50), CTA ajouté au footer
- [x] Fix CRO : 7 liens ancre cassés blog (#audit-gratuit → #audit-form)
- [x] Schema WebSite ajouté sur homepage (sans SearchAction)
- [x] Perf : 8 images JPG → WebP (-92%, 18 Mo → 1.2 Mo)
- [x] Nettoyage : static/diagnostic-transformation-ia.html supprimé, blog/test1.png supprimé
- [x] Build Hugo local validé (35 pages, 0 erreur)
- [x] Push refonte-2026 → Vercel Preview
- [x] **Validation Franck — Phase 5 terminée** (2026-03-22)

## Logo & Branding

- [x] Brainstorm Claude + Gemini : direction logo (consensus 8/10)
- [x] 4 planches de concepts générées via Gemini (séries C, D, E, F, G)
- [x] Logo provisoire C2 intégré (carré arrondi indigo + S espace négatif + texte DM Serif/Sans)
- [x] Favicon SVG (monogramme S seul)
- [x] Taille logo augmentée header h-12/h-14, footer h-12
- [x] Logo final Logo-Agence-Sauvage.svg intégré (wordmark #403eba, header+footer+params+schema.org)
- [x] Favicon SVG mis à jour (monogramme S blanc sur carré arrondi #403eba)
- [x] Ancien logo-lagencesauvage.svg supprimé
- [ ] Validation Franck sur preview Vercel avec logo final

## Blockers

Aucun pour le moment.

## Décisions prises

- ✅ Typographie : DM Serif Display + DM Sans (2026-03-22)
- ✅ Palette : abandon "Intelligence Organique", adoption "Premium Tech" indigo/slate/blanc (2026-03-22)
- ✅ Formulaire : 2 étapes progressives (coordonnées → entreprise) (2026-03-22)
- ✅ Social proof : Olivier Sarezinski (Eurodom) + Myriam Louergli (Optimrezo) validés (2026-03-22)
- ✅ Positionnement : "professionnels" au lieu de "TPE/PME" — cible élargie jusqu'à 200 salariés (2026-03-22)
- ✅ Animations : consensus Claude + Gemini — style Stripe/Linear, easing expo, prefers-reduced-motion (2026-03-22)
- ✅ Page About : structure 4 sections (consensus Claude + Gemini), bio 3 actes, pas de faux KPIs (2026-03-22)
- ✅ Page Services : 3 offres Good-Better-Best — consensus Claude + Gemini (2026-03-22)
- ✅ Naming offres : "Assistant IA & Automatisation" / "Formation IA" / "Transformation IA" (2026-03-22)
- ✅ Prix validés : Assistant 500€/mois + setup 1000€, Formation 1000€/jour, Transformation 3000€ (2026-03-22)
- ✅ Stack technique : Make retiré, Evolution API + Hugo+Vercel ajoutés partout (2026-03-22)
- ✅ Stack technique v2 : enrichie à 12 technos (OpenAI, Gemini, Python/FastAPI, PostgreSQL, Whisper, Google Workspace, APIs métier) alignée sur les 6 case studies (2026-03-22)
- ✅ Page FAQ : 18 questions GEO-optimisées (consensus Claude + Gemini), 5 catégories client-centric (2026-03-22)
- ✅ Page Réalisations : 5 use cases sélectionnés (consensus Claude + Gemini), focus file créé (2026-03-22)
- ✅ Case study "Pôle Financier Augmenté" : page pilier 5 piliers narratifs, données réelles 13+ workflows n8n, API La Poste LReL, consensus Claude + Gemini score 9/10 (2026-03-22)
- ✅ Page Diagnostic IA : contenu fidèle à l'ancienne page, nouveau design system, 13 sections complètes (2026-03-22)
- ✅ Focus Réalisations v2 : 6 use cases (consensus Claude + Gemini v2, score 9/10) — fusion UC1+PennylaneAgent, ajout GEO Tracker SaaS, Jarvis repensé en Chef de Cabinet IA (2026-03-22)
- ✅ Case study "Usine à Contenu B2B" : 5 piliers, RAG Supabase, double optim SEO/GEO, diagramme architecture Gemini, prix "à partir de" (2026-03-22)
- ✅ 4 case studies finales : GEO Tracker (SaaS Python), Chef de Cabinet IA (4 piliers), Agent Téléphonique (2 options), Cerveau d'Entreprise (RAG + veille) — 4 diagrammes Gemini (2026-03-22)
- ✅ Blog "Édition Premium 2026" : brainstorm Claude + Gemini (consensus 8/10), layouts Tailwind v4, 8 images abstraites Gemini, lecture plein écran, 4 CTAs subtils, key takeaways GEO, TOC flottant, progress bar (2026-03-22)
- ✅ Ordre case studies par weight : Pôle Financier → GEO Tracker → Usine à Contenu → Chef de Cabinet → Agent Téléphonique → Cerveau d'Entreprise (2026-03-22)
- ✅ Homepage section réalisations : approche minimaliste bandeau chiffres + 3 mini-cartes (consensus Claude + Gemini 9/10) — pas de tags stack technique, chiffre héroïque en gros, cartes cliquables (2026-03-22)

- ✅ Logo provisoire C2 : monogramme S (carré arrondi indigo #4F46E5 + S espace négatif blanc) + texte "L'Agence" DM Sans / "Sauvage" DM Serif Display italic. Brainstorm Claude + Gemini (consensus 8/10). Franck consulte des avis extérieurs + explore piste monogramme A+S (2026-03-22)
- ✅ Logo final : Logo-Agence-Sauvage.svg (wordmark SVG #403eba) intégré sur header, footer, params, schema.org. Favicon monogramme S blanc sur carré arrondi #403eba (2026-03-23)
- ✅ Section "De la théorie à la pratique" : case studies pertinentes en fin d'article blog, entre author box et CTA final. Articles connexes déplacés après le CTA (filet de sécurité). Brainstorm Claude + Gemini consensus 8/10 (2026-03-23)

## Phase 7 — Post-bascule — Tâches détaillées

- [x] Merge refonte-2026 → main + push production
- [x] Fix témoignages page Services + grille stack + redirections 301
- [x] Recrawl Search Console (homepage, services, réalisations, about, blog, diagnostic, faq, 8 articles)
- [x] Nouvel article blog "Comment être cité par ChatGPT" — SEO/GEO optimisé, image Gemini, sources liées
- [x] Règle sourcing ajoutée à CLAUDE.md (liens hypertextes obligatoires sur toute citation)
- [x] Section "De la théorie à la pratique" : case studies en fin d'article blog (partial + matching 9 articles, consensus Claude+Gemini 8/10)
- [x] Brainstorm Claude + Gemini : 4 idées d'articles blog SEO/GEO (consensus 8/10 + 9/10)
- [x] Article "Facturation électronique 2026 : ce que Pennylane ne fait pas" — SEO/GEO, 8 sources fraîches, 5 FAQ, image Gemini
- [x] Recrawl Search Console : article AI Act + LP Pennylane soumis à l'indexation (2026-04-17)
- [ ] Monitoring 404 + vérification indexation nouvelles pages (7-14 jours)
- [ ] Créer commande `/new-article` pour workflow article répétable
- [x] Installer Hugo en local (retrouver le setup winget + subst S:)
- [x] Landing page campagne cold email "Collecte WhatsApp × Pennylane" experts-comptables (HTML/CSS statique, formulaire lead capture, 3 images Gemini)
- [x] Article "LLM Knowledge Base (méthode Karpathy)" — recherche multi-sources, brainstorm Gemini 9/10, 2200 mots, image hero, wiki interne — PUSHÉ
- [x] Validation Franck article LLM Knowledge Base — validé (2026-04-17)
- [x] Article "Zero Human Company : le mythe américain face à la réalité des PME françaises" — 2300 mots, consensus Claude+Gemini 9/10, section interne agence-sauvage-ventes, image dashboard Paperclip, pushé 2026-04-16 — validé (2026-04-17)
- [x] Article "AI Act : former vos collaborateurs à l'IA est désormais une obligation légale" — 2200 mots, consensus Claude+Gemini 8/10, deep research Gemini 8m15, partenaire GhG Formations Qualiopi, image hero EU+formation, validé et pushé 2026-04-16
- [x] Bandeau métriques homepage : 10 000+ actions/mois + <1 sec./tâche + 0 intervention humaine (consensus Claude+Gemini 9/10, validé 2026-04-17)
- [x] Lead magnet "Kit démarrage Claude Cowork pour PME" : capture email, PDF attaché via Resend, CTA blog, endpoint /api/submit-kit (2026-04-26)
- [x] Lead magnet "Formation Claude entreprise" : landing page `/formation/maitriser-claude-entreprise/`, formulaire multi-step (step1 capture immédiate + step2 qualification), PDF programme, API submit-programme step1+step2, shortcode Hugo, nav header "Formation", CTA article AI Act (2026-05-06)
- [x] CTA article AI Act : swap kit prompts → formulaire formation (conditionnel tag "Formation IA" dans layout blog, inline $i==2 — autres articles gardent le kit) (2026-05-06)
- [x] Système notification leads double-canal : api/_notify.js (Resend + Telegram), migration complète des 5 endpoints api/submit-*.js, nodemailer supprimé (2026-05-06)
- [x] SPF lagencesauvage.com mis à jour : spf.resend.com + _spf.google.com + ~all (2026-05-06)
- [x] Test e2e validé : email reçu sur beforbiz@gmail.com depuis endpoint submit-kit en production (2026-05-06)
- [ ] **BLOQUANT** : RESEND_API_KEY manquante/expirée Vercel → formulaires diagnostic + formation retournent 500. Action Franck : Vercel Dashboard → lagencesauvageavecnotion → Settings → Env Vars → vérifier RESEND_API_KEY
- [ ] Supprimer entrée test Notion "Test / beforbiz@gmail.com" (action manuelle Franck)
- [ ] Rédiger article 3/4 : "Agents IA autonomes en PME : 3 cas d'usage réels"
- [ ] Rédiger article 4/4 : "IA et professions juridiques : gain de temps et secret professionnel"
- [ ] Second lead magnet "Checklist IA PME 2026" (concept validé, pas démarré)
- [x] Page formation "Maîtriser Claude en entreprise" — créée (2026-05-06)
- [x] Article "Agent IA : définition, cas d'usage et ROI PME" — pushé (commits 6879f7d + 7dcc363, sources corrigées)
- [x] Lead magnet kit prompts : refonte PDF gate — PDF généré (Playwright A4), layout gated, email lien PDF direct (2026-05-06)
- [x] Email submit-programme.js : aligné sur PDF réel (7 pages, "Proposition de formation", CTA 30 min) (2026-05-06)
- [x] Article "Claude for Small Business : agents IA pour les PME françaises" — veille Obsidian, recherche multi-sources, consensus Claude+Gemini 9/10, 2300 mots, 5 H2, FAQ schema, image hero Gemini 49 Ko, liens croisés bidirectionnels avec Claude Cowork, CTA formation OPCO, pushé 2026-05-15
- [x] Article "Déployer un agent IA opérationnel dans votre PME : guide pratique et roadmap 6 semaines" — vault Hermes (308 cas d'usage), keyword research 8 phases, challenge Gemini Pro (6.5→9/10), 2200 mots, 6 H2, 5 FAQ GEO, maillage interne 6 liens, image hero Gemini 81 Ko (style Hermes), audit anti-cannibalisation (swap factures→reporting), pushé 2026-05-15
- [x] Analyse Plausible (91j/28j/7j) + stratégie 3 lead magnets ciblés articles top trafic (2026-05-21)
- [x] Lead magnet A — "50 Prompts IA Prêts à l'Emploi pour PME" : PDF 20p docx (framework ROCF, 6 catégories, 50 prompts), API /api/submit-prompts (Notion+Resend+Plausible), partial lead-magnet-prompts, intégré /blog/art-du-prompt/ (tag "Prompts IA"), Goal Plausible "50 Prompts Download" créé (2026-05-21)
- [x] Lead magnet B — "Checklist 30 Jours pour déployer Claude dans votre PME" : PDF docx (4 semaines, quick wins, erreurs fatales, bonus email template), API /api/submit-checklist (Notion+Resend+Plausible "Checklist Download"), partial lead-magnet-checklist, intégré /blog/claude-cowork-pme-cas-usage-mars-2026/ (tag "Checklist IA"), Goal Plausible "Checklist Download" créé (2026-05-21)
- [x] **Simulateur OPCO S3 → S7** — mergé sur `main` et déployé en production (2026-05-23). Voir section dédiée ci-dessous.
- [ ] Lead magnet C — "Kit IA pour cabinet comptable" : article cible /blog/ia-cabinet-comptable-donnees-2025-reussir/ (131 visites), tag "Kit Comptable IA", API /api/submit-kit-comptable, Plausible "Kit Comptable Download"
- [ ] Rédiger article 3/4 : "Agents IA autonomes en PME : 3 cas d'usage réels qui remplacent les SaaS" (angle SaaS-replacement — différencier de l'article déploiement)
- [ ] Rédiger article 4/4 : "IA et professions juridiques : gain de temps et secret professionnel en 2026" (reporté)

## Simulateur OPCO — Sprint S3-S5 (2026-05-23) ✅

Branche : `feat/simulateur-opco` (15 commits) | PRD : `Claude Code/Simulateur OPCO/docs/architecture/PRD_simulateur_opco.md`

| Session | Livrable | État |
|---------|----------|------|
| S0-S2 (R&D) | Pré-aplatissement BDD OPCO + moteur Python + port JS validé cross-langage | ✅ (autre projet) |
| **S3** | `api/simulate-opco-lookup.js` (autocomplete DINUM) + `api/simulate-opco-resolve.js` (cascade IDCC DINUM → siret2idcc) + 6 modules partagés `api/_simulateur/` | ✅ consensus Gemini 8.5/10 |
| **S4** | `api/simulate-opco-compute.js` (POST trust-but-verify + Notion + Resend + Plausible) + base Notion "Leads Simulateur OPCO" créée via MCP | ✅ consensus Gemini 9.5/10 |
| **S5** | Page Hugo `/simulateur-opco/` + UI vanilla JS 5 états + schema WebApplication + menu nav | ✅ consensus Gemini 9/10 |
| **S6** | Polish a11y + tone of voice + CORS POST + OG image Gemini + politique confidentialité RGPD réécrite | ✅ consensus Claude+Gemini 8.5/10 |
| **S6.5** | Saisie manuelle effectif (4 paliers OPCO légaux) + recompute idempotent Notion (PATCH anti-doublon) | ✅ consensus Claude+Gemini 9/10 |
| **S6.6** | Sélection humaine assistée IDCC (PRD étage 3) — 45 conventions groupées par OPCO | ✅ consensus Claude+Gemini 9/10 |
| **S6.6.1** | Inclusion des 22 branches naf_fallback (Constructys, Afdas télécoms/audio/sport, etc.) — couverture 9→10 OPCO sur 11 | ✅ |
| **S6.6.2** | Pré-suggestion NAF→convention validée par l'utilisateur (75 mappings) — résout 95% des cas evidents | ✅ consensus Claude+Gemini 9.5/10 |
| **S7** | Merge fast-forward feat/simulateur-opco → main (22 commits, 34 fichiers, 9867 insertions) + push production | ✅ 2026-05-23 |
| **S8 (SEO/GEO)** | Sprint 1 : schema @graph + FAQ 8 Q/R + méthodologie + glossaire + breadcrumb + chiffres officiels + réforme 2026 + robots.txt 18 bots IA + llms.txt + fix bug factuel 11 OPCO. PR #2 mergée main. Consensus Gemini Deep Research. | ✅ 2026-05-23 |
| **S9 (SEO/GEO)** | Sprint 2 : 11 sous-pages OPCO auto-générées + page actions collectives 100% financées + article blog pilier cluster IA+OPCO 2388 mots + image hero Gemini WebP 20 KB. PR #3 mergée main. Consensus Gemini Pro 10/10 sur l'article blog. | ✅ 2026-05-23 |
| **S6.6.3** | Auto-application NAF ≥95% confiance + option "0 salarié" au select effectif. BTP exclu (fragmentation IDCC). | ✅ 2026-05-23 consensus Gemini 7.5/10 ajusté |
| **S3.1 (pages programmatiques)** | 20 fiches branches IDCC publiées sous `/simulateur-opco/branches/{slug}/` + hub + maillage retour depuis les 11 pages OPCO. Pivot 50 salariés explicite (TPE/PME/ETI). Schema @graph 4 niveaux. | ✅ 2026-05-24 consensus Gemini 8.5/10 ajusté |
| **S3.2 (NAFs commerce)** | 17 NAFs commerce détail ajoutés à naf-suggestions (livres, presse, sport, vêtements, parfumerie, bijouterie, électroménager, etc.) → IDCC 1517 CDNA `auto: false`. | ✅ 2026-05-24 |
| **UX bonus** | Cards "11 OPCO français couverts" sur `/simulateur-opco/` transformées en liens vers `/simulateur-opco/{slug}/`. Maillage interne gratuit. | ✅ 2026-05-24 |
| **Roadmap GTM Q2** | Plan 4 Sprints (~20h) consolidé consensus Claude+Gemini 8/10 → 9.5/10 ajusté. Inversions critiques : TNS/FAF avant volume, sourcing IA-assisté, veille no-code. Détail dans next-tasks.md. | ✅ scopé 2026-05-24 |
| **Fix moteur budget (per-dossier)** | Branches BTP (+897) désormais chiffrables : fallback `plafond_par_dossier_eur` sur le budget max quand `plancher_garanti_eur` absent. Zéro chiffre inventé. QA 883 OK / 0 FAIL. compute_budget.js seul modifié. | 🔄 2026-05-28 commit en attente |

**Validation e2e Preview** : POST `/api/simulate-opco-compute` retourne `ok:true`, lead Notion créé (369223ca...), email Resend récap reçu, snapshot JSON archivé dans le body de la page Notion.

**3 bugs en cascade débuggés** (cf. lessons.md) : (1) propriétés `null` rejetées par Notion à `pages.create`, (2) options Select non-créables à la volée par Notion API (Code NAF + OPCO passés en RICH_TEXT), (3) env vars Vercel build-time + intégration Notion "Formulaire Site Web" sans accès à la nouvelle base.

**Action en attente** : nettoyage manuel des 5 leads test dans Notion (`debug@claude.test`, `debug2`, `debug3`, `verif@claude.test`, page MCP `[TEST MCP] Diagnostic`).

## Décisions prises (post-bascule)

- ✅ Infrastructure email transactionnelle : Resend (HTTPS API) pour tous les endpoints api/submit-*.js — VPS2/KumoMTA réservé aux campagnes Mailwizz bulk. Cause : KumoMTA n'autorisait le relay que pour monagencesauvage.com, pas lagencesauvage.com (silencieux). Décision 2026-05-06.
- ✅ nodemailer supprimé du projet — aucun endpoint n'utilise SMTP direct
- ✅ Toute citation/étude dans un article doit avoir un lien hypertexte vérifiable vers la source (consensus Claude + Gemini 8/10, 2026-03-23)
- ✅ Section "Sources et références" obligatoire en bas de chaque article (2026-03-23)
- ✅ CLAUDE.md enrichi avec section "Production d'articles de blog" (2026-03-23)
- ✅ Stratégie blog semaine 2026-03-23 : 4 articles SEO/GEO validés (brainstorm Claude + Gemini, consensus 8/10 + 9/10) — facturation électronique, Claude Cowork, agents IA autonomes, professions juridiques (2026-03-23)
- ✅ LP campagne cold email : dark mode supprimé (consensus Claude+Gemini 9/10), light mode forcé — audience B2B conservatrice, indigo sur slate dark = ratio 2.6:1 illisible (2026-03-24)
- ✅ LP campagne : structure "Narrative Case Study" (consensus Claude+Gemini 8/10) — hero split + mockup WhatsApp above the fold + bandeau métriques + 4 pain points + escalade J+3/J+4/J+7 + architecture dédiée + FAQ 4 questions (2026-03-24)
- ✅ Bandeau métriques homepage : remplacement des 3 chiffres figés par 10 000+ actions/mois + <1 sec./tâche + 0 intervention humaine — données issues de n8n réel (consensus Claude+Gemini 9/10, validé 2026-04-17)

## Décisions en attente

- ~~Logo final~~ : intégré et validé (2026-03-23)
- ~~Calendly~~ : reporté post-lancement, Franck intégrera si besoin
