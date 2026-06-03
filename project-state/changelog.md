# Changelog — Refonte lagencesauvage.com

## 2026-06-03 — Article blog "Hermes Agent : agent IA autonome pour dirigeant TPME"

### Contexte

Demande Franck : article sur Hermes Agent profitant des nombreuses nouveautés récentes (v0.13 "Tenacity" 7 mai, v0.14 "Foundation" 16 mai, v0.15 "Velocity" 28 mai, Desktop v0.15.2) et du quasi-vide éditorial FR sur le sujet. Recherche multi-sources : vault Obsidian projet Hermes Agent (cas-usage-ecosysteme-200, project-state, lessons), projet Claude Code Hermes Agent (CLAUDE.md, SETUP, lessons techniques), WebSearch (NVIDIA blog, releases GitHub, blog Nous Research). Brainstorm 3 angles (A=dirigeant, B=tech harness, C=narratif journal de bord) → angle A enrichi de l'intro pédagogique "harness" + section v0.15.

### Livrable

**Article** : `content/blog/hermes-agent-ia-autonome-dirigeant-tpme.md`
- ~2 300 mots, 6 H2, 4 FAQ GEO, 3 takeaways
- Intro pédagogique sur le concept de harness agent IA (Claude Code, Codex CLI, OpenClaw, Aider, Hermes)
- 3 piliers Hermes : mémoire FTS5+Honcho, skills auto-créées, gateways multi-canal (Telegram, Discord, Slack, WhatsApp, Signal, ntfy, 23 plateformes)
- 5 cas d'usage dirigeant after 6 semaines de prod : veille IA matin, briefing Telegram, enrichissement base prospection (ASV2 — pas mentionné scrape-avocats), pilotage mobile via TMA Kanban, délégation Claude Code via skill officielle
- Section nouveautés mai 2026 mise en avant : Hermes Desktop (vraie bascule pour non-dev), Kanban multi-agent + swarm topology, worktree-per-task, Promptware defense, Skill Bundles + MCP Catalog
- Verdict chiffré : 1h30-2h/jour ouvré gagnées (veille -45 min, briefings -20 min, surveillance prospection -1 h, délégation nuit)
- CTA double piste : "explorer" (Desktop self-serve) OU "réservez votre audit IA gratuit" (`/diagnostic/`) → conversion prestation clé en main L'Agence Sauvage
- Sources : 8 liens vers Nous Research officiel, GitHub releases, NVIDIA Blog. Zéro source concurrente, zéro page d'accueil utilisée comme source d'argument.

**Image hero** : `static/assets/images/blog/hermes-agent-autonome-dirigeant.webp`
- Style dithering halftone bleu cobalt + crème inspiré directement de la page `hermes-agent.nousresearch.com/desktop` (que Franck aime)
- Femme casque trois-quarts arrière devant laptop. Écran montre : "l'agence sauvage" en haut à gauche, Kanban 3 colonnes (2 cartes chacune, lignes simulant le texte), zone chat en bas avec curseur clignotant ("typing a messa|")
- Génération Gemini Imagen 2K → conversion Pillow 960×540 q55 → 127 KB WebP
- 2 itérations précédentes refusées avant validation : V1 (gravure line art + logo SVG Pillow incrusté → "horrible"), V2 (overlay Kanban PIL fait main → décevant), V3 validée car Gemini gère mieux le rendu complet avec contenu d'écran en un seul prompt

**Commit** : `6bfa812` sur `main` — push direct (GO explicite Franck après validation visuelle V3)

### Process push (workflow stash branches non-liées)

Session démarrée sur branche `data/afdas-planchers-conventionnels` avec modif locale non-commitée sur `tests/simulateur-opco/test-compute-units.mjs` (sprint OPCO précédent). Pour pousser sur `main` (règle 3 CLAUDE.md) sans embarquer la modif OPCO ni l'écraser :
1. `git stash push -m "wip-simulateur-opco-test" -- tests/simulateur-opco/test-compute-units.mjs`
2. `git checkout main && git pull origin main`
3. `git add` 3 fichiers Hermes (article + script + image) + `git commit` + `git push origin main`
4. `git checkout data/afdas-planchers-conventionnels && git stash pop`
État final post-session = état initial restauré au bit près sur la branche OPCO.

### Différenciation vs articles existants

- Quasi-vide éditorial FR sur Hermes Agent (peu d'articles en français mentionnés dans la SERP) → angle d'autorité disponible
- Approche dirigeant non-dev × concept de harness × retex 6 semaines en prod = combinaison inédite
- Mise en avant explicite de Hermes Desktop comme barrière à l'entrée tombée pour les non-tech

## 2026-06-02 — Article blog "L'IA prépare, vous décidez : le mode copilote pour les dirigeants non-tech"

### Contexte

Session d'analyse stratégique du contenu existant (18 articles blog × vault Obsidian projet Hermes) → identification de 7 lacunes structurelles → priorisation article "mode copilote" comme contenu manquant le plus différenciant.

### Livrable

**Article** : `content/blog/ia-prepare-vous-decidez-mode-copilote-pme.md`
- ~2 200 mots, 6 H2, 5 FAQ GEO, 3 takeaways
- Framework A/B/C opérationnel (ce que l'agent fait seul / soumet / ne fait jamais)
- Exemples tirés du setup Hermes live en production (v0.14.0, Kanban 47 tâches)
- Liens internes : AI Act + agent-ia-definition
- Sources : AI Act art. 14, CNIL, Gartner, Bpifrance, McKinsey

**Image hero** : `static/assets/images/blog/ia-prepare-vous-decidez-mode-copilote-pme.webp`
- Cockpit digital illustration — rupture de style vs série abstraite habituelle du blog
- Générée via Gemini (2 752×1 536 px source), convertie Python Pillow q62, 90 KB WebP

**Commit** : `daed912` sur `main` — push direct (go explicite Franck)

### Différenciation vs articles existants

- `agent-ia-operationnel` : "comment brancher les câbles" → ce nouvel article : "comment définir les règles avant de brancher"
- Cible différente : dirigeant réticent (frein "perte de contrôle") vs dirigeant convaincu cherchant le comment
- Framework A/B/C absent de tout autre article du blog

## 2026-05-28 — Simulateur OPCO : fix moteur budget "non chiffrable" pour barèmes horaire/par-dossier

### Problème

Les branches Bâtiment (IDCC 1596/1597/2609/2420, slug `constructys-bat`) ressortaient toujours « À calculer en entretien » alors que les barèmes existent. Cause racine : `_sumPlanchers` dans `lib/simulateur-opco/compute_budget.js` ne sommait que les `plancher_garanti_eur`. Or les barèmes BTP sont encodés en `plafond_horaire_eur` (PDC 24 €/h) et `plafond_par_dossier_eur` (AFEST 3 600, bonus Diag Perf 8 000), avec `plancher_garanti_eur: null` → somme null → `budget_chiffrable: false`.

### Décision (validée Franck)

**Fallback per-dossier, SANS estimation horaire.** N'utilise que des plafonds réels du barème (zéro chiffre inventé, conforme règle #1). L'option "estimer un volume d'heures × taux horaire" a été écartée car le volume d'heures serait une hypothèse fabriquée.

### Implémentation (seul fichier moteur touché : `lib/simulateur-opco/compute_budget.js`)

- Nouveau champ `plafond_par_dossier_eur` porté sur chaque `DispositifActive` (PDC, AFEST, bonus, parcours, VAE, FNE).
- Helper `_montantMaxDispositif` : plancher garanti, sinon plafond par dossier.
- `_sumPlanchers(items, inclusOnly, useDossierFallback)` : le **budget min** reste les planchers réels (un plafond par dossier est un plafond, jamais un plancher → exclu du min) ; le **budget max** retombe sur le plafond par dossier quand le plancher est absent.
- Warning de transparence quand le PDC de la branche est en horaire-only : prévient que l'enveloppe PDC (financée à l'heure) n'est pas chiffrée dans le « jusqu'à X € ».

### Résultat

- 4 branches BTP ≤49 sal : `chiffrable=true`, **« Jusqu'à 11 600 € »** (AFEST 3 600 + bonus 8 000) + warning. ≥50 sal : hors tranches (inchangé).
- Effet de bord : IDCC 897 (Santé au travail) passe de « Jusqu'à 2 500 € » → « Entre 2 500 € et 3 500 € » (son bonus 1 000 €/dossier réel rejoint le max). Seule branche déjà chiffrable impactée. **À valider par Franck.**
- QA `scripts/qa-simulator-delivery.mjs` : 883 OK / 0 FAIL (855 régressions comparées). `tests/simulateur-opco/test-compute-units.mjs` : 46/1 — l'unique échec (« IDCC null toléré ») est **pré-existant** (confirmé stash avant/après), sans lien.

### Découverte importante

**Aucun port Python du moteur n'existe** : `scripts/compute_budget.py` et `scripts/cross_validate.py` sont absents de l'arbre ET de tout l'historique git. L'en-tête de `compute_budget.js` qui prétend être « un port validé par cross_validate.py » est trompeur. Source de vérité unique = le fichier JS ; QA 100% JS. (Tâche de nettoyage du commentaire d'en-tête flaggée.)

### Hors scope / en attente

- `static/data/simulator-ready.json` apparaît modifié dans le working tree (45 IDCC + 20 NAF enrichis : ajout `cible_taille_entreprise`, `formule_max_lisible`, `frais_annexes` sur de nombreuses entrées). **Ce n'est pas le fruit de cette session** (le moteur ne réécrit jamais la data). Probable reliquat d'enrichissement Sprint 2. NON commité — décision Franck.

## 2026-05-26 — Sprint S10 Refonte visuelle 31 pages OPCO + branches (pattern Doc-Landing)

### Diagnostic — bug racine `@tailwindcss/typography` (commit 72d40f0)

Franck remonte un screenshot prod `/simulateur-opco/atlas/` montrant un mur de texte non stylé (H2/H3 sans hiérarchie, tables sans bordures, prose plate). Diagnostic : Tailwind CSS v4 sans plugin `@tailwindcss/typography` → toutes les classes `prose prose-h2:* prose-th:*` du layout sont **silencieusement ignorées** (pas d'erreur build). Rendu = browser defaults bruts.

**Co-diagnostic Claude + Gemini Pro** sur la solution : Gemini me corrige 3 décisions clés.
1. ❌ Recréer `.opco-prose` CSS pur → ✅ installer le plugin officiel (1 ligne `@plugin "@tailwindcss/typography";` dans main.css)
2. ❌ Accordéons sur "Analyse détaillée" → ✅ contenu **linéaire déplié** (Ctrl+F user-friendly + crawlers LLM Perplexity/ChatGPT ingèrent le DOM tel quel, accordéons ignorés)
3. ❌ Card-grid pour table dispositifs → ✅ **table stylée** (meilleur scanning comparatif + `<table>` adoré par LLMs pour réponses factuelles)

### Pilote Atlas (commit 72d40f0)

- Plugin `@tailwindcss/typography` installé (`npm i -D` + `@plugin` dans main.css)
- Nouveau layout `layouts/simulateur-opco/opco-fiche.html` : pattern Doc-Landing 3 colonnes desktop ≥1024px (TOC sticky gauche `.opco-toc` | article central prose | CTA sticky droite avec 2 cards : simulateur + diagnostic)
- 3 shortcodes Hugo dans `layouts/shortcodes/` :
  - `opco-kpi.html` : 4 cards carte d'identité (nb branches, audience, MAJ, site officiel) — lit le front matter sans args
  - `opco-dispositifs.html` : table stylée avec badges colorés (`eligible` vert, `a-verifier` orange, `non-eligible` slate) — lit `dispositifs_2026`
  - `opco-branches.html` : chips IDCC cliquables vers fiches branches (auto-détection via `site.GetPage`) — lit `branches_idcc`
- CSS `.opco-toc` dans main.css pour table des matières (border-left indicator + état actif)
- `content/simulateur-opco/atlas.md` migré sur `layout: opco-fiche` avec nouveaux params `dispositifs_2026` + `branches_idcc`
- Typographie FR resserrée (espaces insécables, italiques, suppression phrase technique "snapshot raw")

### Propagation 10 OPCO restantes (commit 13df5ac)

- `scripts/migrate-opco-to-fiche-layout.py` : script Python idempotent (`skip si layout == opco-fiche`) qui :
  1. Parse YAML front matter + body markdown
  2. Extrait dispositifs depuis table `## Dispositifs ... activables` (couvre "Dispositifs OPCO X" et "Dispositifs L'Opcommerce" via regex assouplie)
  3. Extrait branches depuis liste `## Branches principales` + IDCC depuis `(IDCC NNNN)` + slug via mapping nom/IDCC vers fiches branches existantes
  4. Strip les 3 sections markdown remplacées + CTAs inline répétés
  5. Réécrit le `.md` avec shortcodes
- 10 OPCO migrés : afdas (6/13), akto (6/21 + 7 slugs liés), constructys (6/4), ep (6/5), mobilites (6/14), ocapiat (6/5), opco-sante (6/4 + 2 slugs), opco2i (6/30 + 2 slugs), opcommerce (6/20 + 2 slugs), uniformation (6/13 + 1 slug)
- Bug fix : note "Période de reconversion" perdait son tiret cadratin (`—`) à cause d'un `.replace("—", "")` trop agressif. Corrigé pour ne supprimer que les notes placeholder.

### Refonte 20 fiches branches IDCC (commit b6734cc)

- Nouveau layout `layouts/simulateur-opco/branches/branche-fiche.html` jumeau d'`opco-fiche` mais adapté contexte branche :
  - CTA sticky droite = 3 cards (simulateur + **OPCO parent** via `branche_opco_slug` + diagnostic)
  - Variante blockquote indigo pour callouts `> ℹ️ ...`
- Migration batch PowerShell : `layout: "single"` → `layout: "branche-fiche"` sur les 20 fichiers. Aucune modif éditoriale (le contenu HTML inline carte d'identité `<dl>` + tableau plafonds HTML était déjà bien structuré, il s'intègre nativement dans la colonne `prose` via `not-prose`)
- 20 branches concernées : syntec-1486, banque-2120, assurances-1672, 7 akto, constructys-bat, ep-immobilier-1527, mobilites-services-auto-1090, 2 opco-sante, 2 opco2i, 2 opcommerce, uniformation-saad

### Merge prod (commit ebacc4c)

- Validation visuelle Franck sur Preview Vercel (pilote atlas + 10 OPCO + 20 branches en 2 itérations)
- Merge `feat/refonte-pages-opco` → `main` avec `--no-ff` (historique du pilote préservé)
- Deploy production Vercel READY — 31 pages refondues live sur lagencesauvage.com

## 2026-05-24 — Sprint 3 Simulateur OPCO (3.1 + 3.2 + UX bonus + roadmap GTM Q2)

### Sprint 3.1 — Pages programmatiques par IDCC (commit 6bfda20)

- **20 fiches branches publiées** sous `/simulateur-opco/branches/{slug}/` à partir des 59 fiches disponibles dans la BDD `data/opco-database.json`. Whitelist priorisée : Syntec, HCR, CDNA, Métallurgie, Médico-social privé, Propreté, Services auto, Aide à domicile, Prévention-sécurité, Banque, Hospitalisation privée, Assurances, Immobilier, Restauration rapide, Industrie pharmaceutique, Commerces de gros, Travail temporaire, Bâtiment, E-commerce, Portage salarial.
- **Consensus Claude+Gemini Pro 8.5 → 9.5/10 ajusté** avec 3 ajustements stricts : hub `/simulateur-opco/branches/` obligatoire (anti-orphan), H1 transactionnel "Simulateur Budget Formation X (IDCC n) — 2026", pivot 50 salariés explicite (TPE/PME/ETI) dans tableau HTML.
- **Script `scripts/generate-opco-branches.py`** : whitelist de 20 slugs + mapping `BRANCHE_SHORT_NAMES` SEO-friendly (nom_branche complet jusqu'à 80+ chars). Sections conditionnelles selon données disponibles (AFEST, bonus, parcours stratégique).
- **Layouts** : `layouts/simulateur-opco/branches/single.html` (H1 + tableau Tailwind plafonds par tranche + FAQ + branches voisines) + `branches/list.html` (hub groupé par OPCO).
- **Schema** : `layouts/partials/schema/branche.html` @graph BreadcrumbList 4 niveaux + WebPage (mainEntity Légifrance KALICONT) + FAQPage. Pas de Service ni Dataset (recommandation Gemini).
- **Bonus maillage** : section "Conventions collectives couvertes" ajoutée aux 11 pages OPCO existantes, affichée uniquement si au moins une branche publiée.
- **Risque thin content écarté** : notes_libres BDD (1000-3700 chars rédigés sourcés) + tableau HTML unique + sections conditionnelles.

### Sprint 3.2 — NAFs commerce détail (commit 48709f5)

- **17 NAFs commerce détail non alimentaire** ajoutés à `api/_simulateur/naf-suggestions.js` mappés sur IDCC 1517 CDNA (L'Opcommerce) en `auto: false`.
- Comble le trou identifié via tableau ADIFLOformation (libraires, boutiques sport/vêtements/chaussures qui tombaient en idcc_inconnu sans suggestion utile).
- Codes ajoutés : 47.61Z (livres), 47.62Z (journaux), 47.51Z (textiles), 47.53Z (tapis), 47.54Z (électroménager), 47.59A/B (meubles/équipements foyer), 47.63Z (multimédia), 47.64Z (sport), 47.65Z (jeux-jouets), 47.71Z (habillement), 47.72A/B (chaussures/maroquinerie), 47.75Z (parfumerie), 47.77Z (bijouterie-horlogerie), 47.78C (autres détail), 47.79Z (occasion).
- `auto: false` systématique : secteur fragmenté entre L'Opcommerce, OPCO EP, conventions sectorielles (1431 optique, 1487 horlogerie absents BDD).

### UX bonus — Cards OPCO cliquables (commit 84bc4d9)

- Les 11 cards "OPCO français couverts" sur `/simulateur-opco/` deviennent des `<a>` vers `/simulateur-opco/{slug}/` (mapping explicite anti-collision : Afdas→afdas, OPCO Mobilités→mobilites, OPCO 2i→opco2i, L'Opcommerce→opcommerce, etc.). Hover indigo, focus accessible.
- **Maillage interne gratuit** depuis la page la plus visible du simulateur vers les 11 sous-pages OPCO. Boost SEO direct.

### Roadmap GTM Q2 2026 — Plan consolidé dans next-tasks.md (commit 84bc4d9)

- **Consensus Claude+Gemini Pro 8/10 → 9.5/10 ajusté** avec 3 inversions GTM critiques :
  1. **Priorité TNS/FAF avant volume salariés** (time-to-revenue ICP — SASU IT/freelances = cible la plus chaude pour abonnement IA 500€/mois ASV)
  2. **Sourcing assisté par IA** (Claude/GPT extrait PDFs OPCO en 45min/convention au lieu de 3-4h manuel — on est une agence IA)
  3. **Veille no-code Visualping** au lieu de scraper maison (fragile, dette technique solo founder)
- **4 Sprints d'exécution** (~20h total) :
  - Sprint 1 "Fix the Leaky Bucket" TNS/FAF (~8h) — page dirigeants-non-salariés + routing flow effectif=0 + email nurturing FAF
  - Sprint 2 "The Big 5" sourcing IA-assisté (~8h) — IDCC 2216, 16, 3017, 1431, vérif 3127/3248 → +15% couverture salariés (64% → 79%)
  - Sprint 3 Capture intent + Drip SEO (continu) — champ qualification IA dans form + 39 branches restantes à 4/semaine
  - Sprint 4 Lean Maintenance (~2h setup) — Visualping no-code sur 11 URLs critères OPCO + lien feedback prospect
- **Cible** : 80% du trafic réel (Pareto), pas 100% des ~700 IDCCs FR
- **Métriques de succès** chiffrées par sprint : drop-off TNS<10%, taux conv non couverte<15%, qualif "IA"≥40%, maintenance <2h/trimestre

---

## 2026-05-23 (soirée) — Sprint SEO/GEO Simulateur OPCO (S1 + S2 complets)

Suite du Sprint 7 simulateur OPCO mergé en prod le matin (cf. plus bas). Session après-midi/soirée dédiée à l'optimisation SEO/GEO complète du cluster simulateur OPCO. Consensus Claude + Gemini Deep Research + 4 PRs livrées sur main.

### Sprint 1 — Schema @graph + FAQ + méthodologie + glossaire (PR #2 mergée)

- **Gemini Deep Research** consulté pour challenger plan SEO/GEO 2026 → rapport complet exploitable (score 9/10 sur consensus final)
- **Bug factuel M11 corrigé** : liste 11 OPCO erronée (retrait "Cohésion sociale" qui n'est pas un OPCO, ajout "L'Opcommerce" manquant — vérifié contre `paysage-formation-pro-fr.md` du projet voisin OPCO/)
- **Schema.org @graph enrichi** : WebApplication + BreadcrumbList + HowTo (3 steps) + FAQPage (8 Q/R) + Dataset + SpeakableSpecification — référencent l'Organization sitewide via `@id`
- **FAQ 8 Q/R rendue serveur** (`<details>/<summary>` natifs, DOM initial, zéro JS, alimente FAQPage schema depuis `.Params.faq`)
- **Section méthodologie de calcul** ~300 mots avec 5+ liens sortants `.gouv.fr` (API DINUM, siret2idcc, Article R6332-9 Légifrance, France Compétences, Qualiopi)
- **Glossaire compact `<dl>`** : OPCO, IDCC, NAF/APE, CFP, PDC, AFEST, Période de reconversion, Subrogation, Qualiopi (9 termes)
- **Breadcrumb visible** Accueil > Simulateur OPCO 2026
- **Section "Chiffres officiels 2026"** : 521 M€ (Jaune budgétaire Assemblée Nationale), 0,55%/1% (Service Public F22570), 11 OPCO (France Compétences)
- **Section "Réforme 1er janvier 2026"** : Pro-A → Période de reconversion (loi 24 octobre 2025), CPF plafond RS 1500€
- **Title optimisé** : "Simulateur OPCO 2026 — Budget formation TPE/PME en 30 secondes" (62 char, consensus Claude+Gemini+Franck)
- **robots.txt créé** avec allow explicite pour 18 bots IA (GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended, MistralAI-User, anthropic-ai, cohere-ai, etc.)
- **llms.txt enrichi** avec section "Outils gratuits" décrivant le simulateur (11 OPCO + dispositifs + réforme 2026)
- **BDD OPCO consolidée copiée** dans `data/opco-database.json` (570 KB JSON depuis le projet voisin OPCO/) — source de vérité pour les sous-pages OPCO

### Sprint 2 — 11 sous-pages OPCO + actions collectives + article blog pilier (PR #3 mergée)

**P1+P2 — 11 sous-pages OPCO auto-générées** depuis `data/opco-database.json` :
- Script `scripts/generate-opco-subpages.py` génère 1 fichier .md par OPCO (Afdas, AKTO, Atlas, Constructys, OPCO EP, OPCO Mobilités, OCAPIAT, OPCO Santé, OPCO 2i, L'Opcommerce, Uniformation)
- Approche hybride : intro client vouvoiement + tableau dispositifs + branches couvertes + analyse détaillée (`notes_libres` brutes BDD validées humainement, 1-8k chars) + sources officielles + 3 FAQ spécifiques + CTAs
- Helper `compute_opco_label()` anti-doublon "OPCO OPCO EP" / "OPCO L'Opcommerce"
- Layout `layouts/simulateur-opco/single.html` avec breadcrumb visible + hero slate-deep + grid cross-link vers les 10 autres OPCO
- Schema partial `layouts/partials/schema/opco-subpage.html` : BreadcrumbList + Service + FAQPage

**P3 — Page actions collectives 100% financées** (`/simulateur-opco/actions-collectives/`, ~1120 mots) :
- 7 H2 + 4 FAQ + 11 sources officielles
- Couvre : Atlas Parcours stratégique TPE/PME (80% × 15 000€ HT), Atlas catalogues captifs (campusAtlas, microlearningAtlas, Savoirs d'Avenirs, PIX I Atlas, expertAtlas), Opcommerce IA Box NextGenerationEU
- Différenciateur SEO/GEO majeur (concurrents ne couvrent pas)
- Layout refactor : `single.html` conditionne sections OPCO-specific via `{{ if .Params.opco_slug }}`
- Nouveau schema partial `simulateur-opco-editorial.html` : BreadcrumbList + Article + FAQPage

**P4 — Article blog pilier cluster IA + OPCO** (`/blog/dispositifs-opco-2026-financer-formation-ia-pme/`, ~2388 mots) :
- Consensus Claude + Gemini Pro **10/10** (8.5/10 plan initial + 3 améliorations Gemini intégrées : FNE-Formation avec caveat statut 2026, élargissement OPCO au-delà d'Atlas/Opcommerce, GEO definition blocks 40-50 mots sous chaque H2)
- 7 H2 + 5 FAQ + 3 takeaways + 22 liens externes dont 6 `.gouv.fr` + 11 sources officielles
- Couvre les 6 dispositifs 2026 : PDC, actions collectives, Parcours stratégique Atlas, FNE-Formation, Période de reconversion (loi 24 oct 2025), abondement CPF
- Maillage interne : 5× simulateur, 1× actions collectives, 1× article AI Act, 1× formation Claude
- **Image hero Gemini-generated** : 6 cubes indigo interconnectés sur fond slate-deep, style éditorial tech B2B (Stripe/Linear), WebP 20.1 KB (1600×900, quality 85)

### 3 bugs débuggés en cascade (cf. lessons.md)

1. **Bug factuel liste 11 OPCO** : "Cohésion sociale" qui n'est pas un OPCO. Vérifié contre BDD OPCO normalisée (`OPCO/docs/references/paysage-formation-pro-fr.md`).
2. **Bug front matter YAML** : indentation cassée par `dedent` + injection multi-lignes FAQ → réécriture en liste de strings explicite. Puis CRLF vs LF (Python Path.write_text sur Windows = CRLF par défaut) → write_bytes avec replace().
3. **Bug schema doubled quotes** : `jsonify` produit `"\"value\""` au lieu de `"value"`. 5 approches testées sans succès (TrimPrefix/TrimSuffix, .Description vs .Params, force LF, YAML plain/single-quoted, refactor partial). Cause Hugo 0.158 confirmée mais root cause exacte non identifiée. **Reporté dette technique Sprint 3** (fix dédié via custom JSON template à prévoir, 1-2h).

### Métriques Sprint complet (S1+S2)

- **6 PRs/branches** : feat/simulateur-opco-seo-geo (S1) + feat/simulateur-opco-subpages (S2)
- **2 merges sur main** : PR #2 + PR #3
- **14 nouveaux fichiers content** : 11 sous-pages OPCO + 1 page actions collectives + 1 article blog + 1 image hero
- **4 nouveaux layouts/partials** : single.html refactor + opco-subpage schema + simulateur-opco-editorial schema + faq enrichie
- **2 nouveaux fichiers data/infra** : opco-database.json (570 KB) + robots.txt
- **1 nouveau script Python** : generate-opco-subpages.py (533 lignes, helpers compute_opco_label + label_with_article + yaml_escape avec fallback plain/single-quoted)

### Impact SEO/GEO attendu (à mesurer dans 3-6 semaines)

- **11 nouvelles URLs** indexables sur cluster OPCO (longue traîne par OPCO)
- **1 page différenciatrice** "actions collectives 100% financées" (opportunité SERP unique en 2026)
- **1 article pilier 2388 mots** avec 22 sources officielles → autorité topique
- **Maillage interne dense** : article → simulateur (5×), actions collectives, 2 sous-pages OPCO ciblées, article AI Act, formation Claude
- **11 sources `.gouv.fr` exposées** sur le cluster simulateur → boost E-E-A-T
- **Bots IA explicitement autorisés** (18 user-agents dans robots.txt)

## 2026-05-23 — Simulateur OPCO S3 + S4 + S5 + debug end-to-end

- **Sprint massif sur le Simulateur OPCO** (PRD 2026-05-22 validé consensus dual-LLM Claude+Gemini DR). Branche `feat/simulateur-opco`, 15 commits, flow complet validé en Preview Vercel.
- **S3 — Endpoints lookup + resolve** (consensus Gemini Pro 8.5/10, 4 corrections intégrées : split 2 endpoints, anti-SSRF strict, rate-limit 10 req/s IP, TTL cache 24h)
  - `api/simulate-opco-lookup.js` : autocomplete DINUM, debounce 300ms, retry exponentiel, cache LRU
  - `api/simulate-opco-resolve.js` : cascade IDCC DINUM → siret2idcc → manuel
  - 6 modules partagés `api/_simulateur/` (validators, cache, rate-limit, dinum-client, siret2idcc-client, http-utils, resolve-service)
  - Artefacts R&D importés : `static/data/simulator-ready.json` (199 KB) + `lib/simulateur-opco/compute_budget.js` (port JS S2) + `tests/fixtures/test_sirens.json`
  - Harness de tests : 14/14 OK (Boulangerie Aixoise IDCC 0843, PAUL multi-IDCC, anti-SSRF, cache HIT, rate-limit 429, OPTIONS 204, POST 405)
- **S4 — Compute + Notion + Resend + Plausible** (consensus Gemini Pro 9.5/10, 4 corrections : ESM JSON import natif, snapshot dans body Notion, await Promise.allSettled, logs SHA-256 sans PII)
  - `api/simulate-opco-compute.js` : flow trust-but-verify (re-résolution serveur anti-tampering)
  - 4 modules `api/_simulateur/` (compute-engine, notion-client, recap-email, plausible)
  - Base Notion "Leads Simulateur OPCO" créée via MCP (17 propriétés + snapshot JSON dans body de page)
  - Tests unitaires : 47/47 OK (Syntec IDCC 1486 → Hot lead 11k-13k Atlas confirmé)
- **S5 — Page Hugo + UI vanilla JS** (consensus Gemini Pro 9/10, 5 corrections : hash routing back button, granularité teaser max, cas de bord, accessibilité clavier, JS bundled via Hugo Pipes)
  - `content/simulateur-opco/_index.md` + `layouts/simulateur-opco/list.html` (5 états : hook, picked, reveal, manual, error)
  - `assets/js/simulateur-opco.js` (~10 KB vanilla — pas d'Alpine.js malgré PRD, cohérence repo)
  - `layouts/partials/schema/simulateur-opco.html` (WebApplication, BusinessApplication, FinanceApplication)
  - Menu nav + footer mis à jour (`menus.toml`)
- **3 bugs en cascade débuggés** :
  1. Notion refuse `{ field: null }` à `pages.create` (corrigé : omission propriétés vides au lieu de null)
  2. Notion Select n'accepte pas les options dynamiques (Code NAF 700+ valeurs + OPCO variantes de casse passés en RICH_TEXT, schema patché via MCP `notion-update-data-source`)
  3. Env vars Vercel build-time + intégration Notion "Formulaire Site Web" pas connectée à la nouvelle base (Franck a ajouté la connexion manuellement)
- **Validation finale** : POST direct via curl bypass token `mcp__get_access_to_vercel_url` → `{ok:true, notion_page_id: 369223ca-b565-...}`, lead Notion vérifié avec 17 propriétés correctes + snapshot JSON dans body, email Resend récap reçu (notification Outlook confirmée)
- **Reste à faire** : S6 (QA Playwright + 20 SIREN + Lighthouse + tone of voice + confidentialité + OG image), S7 (merge main + Search Console)

## 2026-05-21 — Lead magnet B — Checklist 30 jours Claude PME

- **Lead magnet B** déployé sur `/blog/claude-cowork-pme-cas-usage-mars-2026/` (231 visites — top article)
  - `docs/lead-magnets/create-checklist.cjs` : script docx (4 semaines d'actions, quick wins compta/marketing/SAV, 3 erreurs fatales, bonus email template, branding Claude cream + indigo ASV)
  - `checklist-30-jours-claude-pme.pdf` → `static/assets/downloads/` (link live en production)
  - `api/submit-checklist.js` : Notion (source "Lead Magnet - Checklist 30 Jours") + Resend email + Plausible "Checklist Download"
  - `layouts/partials/lead-magnet-checklist.html` : partial formulaire inline (tag déclencheur "Checklist IA")
  - `layouts/blog/single.html` : condition `else if "Checklist IA"` ajoutée au bloc $i==2
  - `content/blog/claude-cowork-pme-cas-usage-mars-2026.md` : tag "Checklist IA" ajouté au front matter
  - Couverture : image Gemini (Option B — Claude cream + Desktop wireframe + bannière indigo ASV), fix dimensions coverImg(780, 1100) pour A4 complet sans troncature
  - Goal Plausible "Checklist Download" créé par Franck
  - Commits : `87ff4ed` (code + docx) + `c762ecf` (PDF + fix cover) — pushés sur main → live

## 2026-05-15 — Article "Agent IA opérationnel PME" — guide déploiement + roadmap 6 semaines

- **Nouvel article** : `agent-ia-operationnel-pme-guide-deploiement.md` — 2200 mots, 6 H2, 5 FAQ GEO, maillage interne 6 liens
  - Angle : guide opérationnel d'exécution (distinct de l'article définition existant) — stack française (Pennylane, Pipedrive, Sage, n8n), AI Act + OPCO, checklist maturité 5 critères, roadmap 6 semaines
  - Sources : Bpifrance (1.8€/€), Gartner (40% enterprise apps agents fin 2026), McKinsey (5.8x ROI 14 mois), Millorem/AI Act, Francenum.gouv.fr
  - Cas d'usage : relance impayés, **reporting automatisé** (Pennylane+Sellsy+Pipedrive), triage leads
  - Image hero : figure éthérée indigo/slate style Hermes NousResearch — WebP 81 Ko, 1280×720
  - Workflow : vault Hermes (308 cas d'usage) → keyword research 8 phases → web searches → challenge Gemini Pro (plan 6.5/10 → restructuré 9/10) → rédaction → audit anti-cannibalisation → swap traitement factures→reporting → image → push
- **Audit anti-cannibalisation** : comparaison avec `/blog/agent-ia-definition-cas-usage-roi-pme/` — swap "traitement de factures" (couvert dans l'article définition) → "reporting automatisé" (non couvert nulle part)
- Commits : `1f2d9db` (article + image), `7bcbc81` (swap anti-cannibalisation) — pushés sur main → live

## 2026-05-15 — Article "Claude for Small Business" + liens croisés blog

- **Nouvel article** : `claude-for-small-business-agents-ia-pme-france.md` — 2300 mots, 5 H2, FAQ schema JSON-LD, image hero WebP 49 Ko (Gemini)
  - Angle : validation de tendance "agents métier vs chatbots" + pivot France (stack US vs Pennylane/Pipedrive via n8n)
  - Sources : Anthropic (annonce 13/05), Bpifrance Le Lab ia2025 (55% adoption, 72% bloqués texte), TechCrunch, SiliconAngle
  - CTA : formation sur mesure finançable OPCO + audit gratuit 30 min
  - Workflow : veille Obsidian → recherche multi-sources → brainstorm Gemini (consensus 9/10) → keyword research 8 phases → rédaction → image → push
- **Liens croisés bidirectionnels** : nouveau article ↔ `claude-cowork-pme-cas-usage-mars-2026`
  - Nouveau → Cowork : fin H2.1 "Des chatbots aux agents métier" (résultats chiffrés Cowork)
  - Cowork → nouveau : fin section "Comment intégrer", avant CTA (mise à jour mai 2026)
- Commits : `a5372ba` (article + image), `719d3d3` (liens croisés) — pushés sur main → live

## 2026-05-06 — Lead magnet kit prompts : refonte en PDF gate + fix email programme formation

- **Lead magnet "10 prompts Claude pour PME"** : refactoré de "contenu visible + opt-in" → Option C PDF gate
  - PDF généré depuis la page live via Playwright (A4, backgrounds, marges 15mm) → `static/assets/downloads/kit-10-prompts-claude-pme.pdf`
  - Layout `layouts/ressources/single.html` entièrement réécrit : teaser statique (10 prompts listés) + formulaire central (prénom + email) — contenu du kit supprimé de la page
  - Après soumission : bouton "Télécharger mon kit (PDF) →" affiché directement sur la page
  - `api/submit-kit.js` mis à jour : `kitUrl` → `kitPdfUrl` pointant vers le PDF statique, bouton email "Télécharger mon kit (PDF) →"
  - Commits `067b0ed` (hook auto) — pushé sur main → live
- **Email `submit-programme.js`** : alignement sur le PDF réel (7 pages "Proposition de formation")
  - "17 pages / 17 modules" → "7 pages, proposition complète sur 3 jours espacés"
  - Sous-titre header : "Certifié Qualiopi" → "Dispensateur Qualiopi" (plus exact — GHG Formations est le certifié)
  - CTA bas de mail : "diagnostic découverte 15 min" → "premier échange 30 min" (cohérent avec le PDF)
  - Commit `1a255ee` — pushé sur main → live

## 2026-05-06 — Lead magnet formation Claude entreprise + CTA swap article AI Act

- **Landing page `/formation/maitriser-claude-entreprise/`** : layout dédié `layouts/formation/single.html`, formulaire multi-step (step 1 capture immédiate prénom+nom+email+entreprise, step 2 qualification taille+secteur+OPCO+poste), JS vanilla, texte copywriting OPCO-first
- **API step 1 `api/submit-programme.js`** : Notion (Source = "Lead Magnet - Programme Formation") + Resend email avec lien PDF + notifyFounder (Resend+Telegram)
- **API step 2 `api/submit-programme-step2.js`** : notifyFounder uniquement, toujours 200, non-bloquant
- **Partial `layouts/partials/lead-magnet-formation.html`** + shortcode `{{< lead-magnet-formation >}}` (2 champs, contexte blog)
- **PDF programme** : `static/assets/downloads/programme-formation-claude-entreprise.pdf` ajouté au repo par Franck
- **Menu header** : "Formation" ajouté weight 3 → `/formation/maitriser-claude-entreprise/`
- **CTA article AI Act** : remplacement du kit prompts par le lead magnet formation via `layouts/blog/single.html` conditionnel `{{ if in .Params.tags "Formation IA" }}` à la position $i==2 (inline, après le 2e H2). Autres articles conservent le kit. Doublon fin d'article supprimé.
- **Erreur 500 diagnostiquée** : `RESEND_API_KEY` manquante ou expirée dans Vercel Dashboard → les deux formulaires (diagnostic homepage + formation) retournent 500. Action Franck requise.
- Commits `2ecc5a7` + `14d9c52` — pushés sur main → live

## 2026-05-06 — Système de notification leads durable : Resend + _notify.js centralisé

- **Diagnostic cause racine** : lead du 26 avril non notifié car `submit-kit.js` envoyait depuis `hello@lagencesauvage.com` alors que VPS2 KumoMTA n'autorise le relay que pour `hello@monagencesauvage.com` → rejet SMTP silencieux. Doublé par le bloc conditionnel `if (SMTP_HOST && SMTP_USER)` qui masquait l'erreur.
- **Créé `api/_notify.js`** : utilitaire centralisé `notifyFounder()` — double canal `Promise.allSettled` (Resend email + Telegram), support pièces jointes PDF, log explicite si les deux canaux échouent
- **Migration nodemailer → Resend** sur les 5 endpoints : `submit-kit`, `submit-lead`, `submit-formation`, `submit-formation-flexible`, `submit-diagnostic`
- **`submit-diagnostic.js`** : bloc email commenté depuis l'origine → remplacé par `notifyFounder()` actif
- **`from:` unifié** sur tous les endpoints : `hello@lagencesauvage.com` (plus de `monagencesauvage.com`)
- **DNS `lagencesauvage.com`** : SPF mis à jour → `include:spf.resend.com include:_spf.google.com ~all`
- **Vercel env vars** : `RESEND_API_KEY` ajouté, `SMTP_*` + `SENDGRID_*` supprimés
- **Test end-to-end validé** : `{"success":true}` + email reçu sur beforbiz@gmail.com
- Commits `c3b608e` + `746df3b` — pushés sur main → live

## 2026-04-17 — Bandeau métriques homepage : refonte chiffres de preuve sociale

- Remplacement des 3 métriques figées et peu convaincantes ("6 projets déployés", "30+ workflows en production", "5 secteurs d'activité")
- Nouvelle base : données réelles n8n (2 587 exécutions cette semaine, 0% failure rate, 0.53s runtime)
- Brainstorm Claude + Gemini (consensus 9/10) — 3 combinaisons proposées, mix final validé par Franck
- Métriques retenues : `10 000+ actions déléguées par mois` / `< 1 sec. d'exécution par tâche` / `0 intervention humaine requise`
- Principe : données evergreen (mise à jour trimestrielle max), centrées bénéfice client pas technique
- Commit efea20b — pushé sur main → live sur lagencesauvage.com

## 2026-04-17 — Validations articles + Search Console

- Article "LLM Knowledge Base" — validé par Franck (2026-04-17)
- Article "Zero Human Company" — validé par Franck (2026-04-17)
- Search Console : article AI Act + LP Pennylane soumis à l'indexation

## 2026-04-16 — Article AI Act : obligation formation IA + financement OPCO/Qualiopi/GhG Formations

- Recherche multi-sources : 4 WebSearch (AI Act art. 4, sanctions, financement OPCO, Qualiopi) + Gemini Deep Research (8m15, rapport complet 35 sources)
- Brainstorm Claude + Gemini : plan article en 6 H2 (consensus 8/10) — angle "conformité + opportunité financement"
- Nuances clés de la deep research intégrées : art. 4 = circonstance aggravante (pas sanction directe), Digital Omnibus en discussion, FNE-Formation terminé → FSE+ via OPCO
- Article ~2 200 mots, 5 FAQ schema, 3 takeaways, tableau calendrier AI Act, 10 sources liées
- Partenaire Qualiopi identifié : GhG Formations (ghgformations.com, Paris 75017, Zineb El Mejjad)
- Image hero Gemini WebP 38.5 Ko (symbolique EU étoiles + personne en formation IA)
- Validé par Franck avant push — commit b981557 pushé sur main

## 2026-04-16 — LP WhatsApp Pennylane : indexation Google + tracking Plausible Lead

- `noindex, nofollow` retiré → `index, follow` (page désormais crawlable par Google)
- Événement Plausible `Lead` ajouté sur soumission formulaire avec props : `source='LP-WhatsApp-Pennylane'`, `medium=utm_medium` (email vs direct)
- Différenciation trafic campagne email vs organique visible dans dashboard Plausible → Events → Lead → Props
- Action suivante : soumettre l'URL dans Search Console pour indexation rapide
- Commit cd5eb5b — pushé sur main

## 2026-04-16 — Article LLM Knowledge Base (méthode Karpathy) + wiki interne + règle éditoriale

- Recherche multi-sources : tweet Karpathy (~20M vues, avril 2026), WebSearch + Gemini Search + Gemini Deep Research (6m49, 7 sections, 21 sources)
- Brainstorm Claude + Gemini : plan article (consensus 9/10) — angle "mémoire d'entreprise" B2B
- Article "Base de connaissances IA : méthode Karpathy" — 2 200 mots, 5 FAQ schema, 3 takeaways, tableau RAG vs LLM Wiki, 3 cas d'usage PME (commits 7b94b96 + afb918b)
- Fix post-push : grille tarifaire 10-50€/mois supprimée → remplacée par CTA audit gratuit (non validé avant push)
- Image hero Gemini WebP 81Ko (cerveau géométrique indigo)
- Wiki interne `docs/wiki/llm-knowledge-base-karpathy.md` — référence technique complète
- CLAUDE.md Règle 11 + workflow article step 7 : validation Franck obligatoire avant push (commit 93d7cbb)
- Mémoire persistante : `feedback_validation_avant_push.md`

## 2026-04-16 — Nouvel article "Zero Human Company" + image dashboard Paperclip

- Article ~2 300 mots : "Zero Human Company : le mythe américain face à la réalité des PME françaises"
- Recherche multi-sources (Paperclip AI 42K stars, Gartner +1445%, Dario Amodei 70-80%, Medvi $401M, FelixCraft $78K)
- Angle validé Claude+Gemini consensus 9/10 : accroche ZHC → pivot "entreprise agentique" adapté FR
- Section interne "Dans notre propre laboratoire" : org chart 6 agents agence-sauvage-ventes (Prospecteur, Contact, Qualificateur, Conformité, Coordinateur, Directeur), objectif 40 RDV/mois, zéro budget exposé
- 3 CTAs audit gratuit naturellement positionnés (post-cas-d'usage, pilote, conclusion)
- FAQ 5 questions dont CSE (art. L.2312-8) + AI Act européen + responsabilité légale
- Zéro anglicisme : leads→prospects, onboarding→intégration, ERP/CRM explicités, Planning Agent→agent de planification
- Image hero : dashboard Paperclip stylisé (style Linear/Notion dark mode) avec agents en FR, 55,9 Ko WebP 1280×720
- Image générée en 3 itérations (org chart hexagonal → org chart dashboard → vrai style Paperclip UI)
- Commit 0bbe788 — pushé sur main → Vercel production

## 2026-03-27 — Fix Search Console : FAQ duplicate, 404s, RSS canonical

- Fix "Duplicate field FAQPage" (8 articles blog) : suppression microdata HTML, JSON-LD seul conservé (commit 5624650)
- Fix 9 URLs 404 : wildcard `/blog/tags/*` → `/blog/`, `/blog/categories/*` → `/blog/`, + 3 redirections spécifiques (variante "-n8n", double .html, typo /log.html) (commit d73cc37)
- Fix "Duplicate without user-selected canonical" (`/blog/index.xml`) : header `X-Robots-Tag: noindex` sur flux RSS (commit 428682b)
- "Page with redirect" (3 pages http/non-www) : normal, géré par Vercel
- "Crawled - currently not indexed" (8 pages) : normal post-refonte, pas de fix technique

## 2026-03-25 — Fix tracker Plausible LP + mémoire feedback

- Ajout script Plausible Analytics sur la LP `/lp/collecte-whatsapp-pennylane/` (oublié à la création)
- Mémoire feedback sauvegardée : toujours inclure Plausible sur chaque nouvelle page (LP statique, layouts Hugo)
- Commit 76fddde — pushé sur main

## 2026-03-24 — Landing page campagne cold email "Collecte WhatsApp × Pennylane"

- LP statique HTML/CSS pour campagne cold email ciblant experts-comptables
- URL : `/lp/collecte-whatsapp-pennylane/` (noindex, nofollow)
- V1 : structure basique hero centré + 3 pain points + flow visuel + formulaire
- Dark mode supprimé (consensus Claude+Gemini 9/10) : indigo sur slate dark = ratio 2.6:1, illisible WCAG. Meta `color-scheme: light` + suppression 46 lignes CSS dark
- V2 refonte complète (consensus Claude+Gemini 8/10, structure "Narrative Case Study") :
  - Hero split : headline à gauche + mockup WhatsApp above the fold
  - Bandeau métriques slate dark : ~98% ouverture WA, ÷3 temps, 0 relance
  - 4 pain points issus de la case study (15-20h/sem, emails ignorés, clôtures, outils passifs)
  - 4 étapes "Comment ça marche" + escalade progressive J+3/J+4/J+7
  - Section "Sous le capot" : stats techniques (9 workflows, 86 nodes, sync 6h) + architecture
  - FAQ 4 questions ciblées (sécurité, adoption WA, RGPD, délai)
  - Header sticky avec CTA bouton, formulaire avec état loading
- 3 images Gemini dédiées :
  - `mockup-whatsapp-collecte.webp` (254 Ko) — conversation facture Orange
  - `mockup-whatsapp-association.webp` — client répond "1" pour associer facture
  - `architecture-whatsapp-pennylane.webp` (160 Ko) — schéma 9 workflows W1-W9
- Formulaire → `/api/submit-lead` (Notion + email notification Franck)
- Source : "Campagne Email - Collecte WhatsApp Pennylane" (évite envoi guide PDF)
- UTM : mailwizz / email / collecte-whatsapp-pennylane
- Commits d119a64 → a3d29b9 (6 commits) — pushés sur main

## 2026-03-24 — Article Claude Cowork + fix sitemap

- Nouvel article blog : "Claude Cowork en mars 2026 : 3 cas d'usage concrets pour les PME (et gains de temps chiffrés)"
- ~2 300 mots, 6 H2, 5 FAQ schema, 3 takeaways, 14 sources liées avec bibliographie
- 3 cas d'usage détaillés : comptabilité (2h→20min), marketing (40-60% plus rapide), SAV (Slack+Salesforce)
- Intégration naturelle offres Formation IA + Transformation IA (sans prix, RDV uniquement)
- Recherche multi-sources : WebSearch (8 requêtes) + Gemini Deep Research (13 min)
- Brainstorm Claude + Gemini : consensus 9/10
- Image hero mockup interface Claude Cowork (Gemini, 47 Ko WebP)
- Fix sitemap.xml : suppression bloc [outputs] restrictif + renommage sitemap-blog.xml → sitemap.xml standard
- Le sitemap inclut désormais toutes les pages (articles, case studies, pages légales)
- Commits 2af5bc2 + 5f9fd4d — pushés sur main

## 2026-03-23 — Section "De la théorie à la pratique" — case studies en fin d'article blog

- Brainstorm Claude + Gemini (consensus 8/10) : pertinence, positionnement, format
- Nouveau partial `related-realisations.html` : bandeau compact, badge "Étude de cas", bordure indigo, hover subtil
- Layout blog/single.html réorganisé : Author Box → Case Studies → CTA Final → Articles connexes (filet de sécurité)
- Matching intelligent via front matter `related_realisations` sur 9 articles :
  - Visibilité IA/ChatGPT → GEO Citation Tracker + Usine à Contenu
  - Impact IA PME / ROI / IA Abordable → Pôle Financier + Cerveau d'Entreprise
  - SaaSpocalypse → Cerveau d'Entreprise + Chef de Cabinet
  - Automatisation emails → Pôle Financier + Chef de Cabinet
  - Cabinet comptable → Pôle Financier
  - Art du prompt → Chef de Cabinet + Usine à Contenu
  - CRM WooCommerce → Usine à Contenu + Pôle Financier
- Commit 91a2a12

## 2026-03-23 — Article blog "Comment être cité par ChatGPT" + règle sourcing

- Nouvel article SEO/GEO : "Comment être cité par ChatGPT en 2026 : le guide complet de la visibilité IA"
- ~2 300 mots, 6 sections H2, 5 FAQ schema, 3 takeaways, structure optimisée GEO
- Sources : Occurrence/Ifop (Les Echos), SparkToro/Rand Fishkin, Forrester, Gartner, iAdvize x Ifop, The Digital Bloom
- Mise en avant : GEO Citation Tracker, Usine à Contenu B2B, Formation IA
- Image hero générée par Gemini (abstrait géométrique indigo/slate, 94 Ko WebP)
- Brainstorm Claude + Gemini (consensus 9/10) pour le plan d'article
- Toutes les citations sourcées avec liens hypertextes (ancres descriptives)
- Section "Sources et références" ajoutée en bibliographie structurée
- CLAUDE.md enrichi : section "Production d'articles de blog" avec workflow + règle sourcing obligatoire
- Mémoire feedback sauvegardée : feedback_sources_links.md
- Commits 5aeee13 + c203cf2

## 2026-03-23 — Logo final intégré + favicon

- Logo final Logo-Agence-Sauvage.svg intégré (wordmark SVG vectorisé, couleur #403eba)
- Mis à jour : header.html, footer.html, params.toml (logo + schema.org organization)
- Favicon SVG recréé : monogramme S blanc sur carré arrondi #403eba (path vectorisé, pas de dépendance font)
- Ancien logo-lagencesauvage.svg supprimé
- Push refonte-2026 → preview Vercel
- Commit 9e8e096

## 2026-03-22 — Phase 5 : Témoignages clients homepage

- Témoignages Olivier Sarezinski (Eurodom) + Myriam Louergli (Optimrezo) intégrés sur la homepage
- Analyse des sites eurodom.fr et optimrezo.fr via Gemini (contexte métier, pain points, vocabulaire)
- Brainstorm Claude + Gemini (consensus 9/10) : stratégie "Business Value Over Tech"
- Olivier : gestion courrier domiciliés + réservations → 2h/jour récupérées → recentrage accueil Paris
- Myriam : 20 événements/mois sur Excel → 15h/semaine gagnées → conversion invités en membres
- Pas de phrase d'appel à l'action (choix Franck) : fin sur le résultat métier, plus naturel
- Item "en attente Franck" résolu, Phase 2 passe à 1 seul item restant (Calendly)
- Commit 693c49e

## 2026-03-22 — Phase 5 : Installation Hugo local + nettoyage git

- Hugo Extended v0.158.0 installé localement via `winget install Hugo.Hugo.Extended`
- Problème PostCSS + Windows + espaces dans chemin résolu via `subst S:` (lecteur virtuel, suggestion Gemini)
- Build local validé : 35 pages, 826ms, zéro erreur
- `public/` retiré du tracking git (`git rm -r --cached public/`) — était encore tracké malgré le .gitignore
- postcss-cli installé globalement en complément (`npm install -g postcss-cli`)
- Hugo local opérationnel pour la quality gate Phase 5

## 2026-03-22 — Validation Franck : Phases 2, 3 et 4

- Franck valide les previews Vercel des 3 phases en un bloc
- Phase 2 (Homepage) : validée, 2 items restent en attente (témoignages textuels + lien Calendly)
- Phase 3 (Pages secondaires) : validée (about, services, FAQ, diagnostic, 6 case studies, pages légales)
- Phase 4 (Intégration blog) : validée (layouts premium, 8 hero images Gemini, front matter enrichi)
- Passage en Phase 5 — Quality gate

## 2026-03-22 — Homepage : section réalisations allégée (consensus Claude + Gemini)

- 2 brainstorms Claude + Gemini successifs :
  - V1 (consensus 9/10) : sélection des 2 meilleurs case studies (Pôle Financier + Chef de Cabinet)
  - V2 (consensus 9/10) : Franck juge les 4 cartes détaillées "trop" → approche minimaliste validée
- Section "Ce qu'on livre" → "Des résultats concrets, pas des promesses"
- Bandeau chiffres express : 6 projets déployés | 30+ workflows | 5 secteurs d'activité
- 3 mini-cartes épurées (chiffre héroïque + titre + 1 phrase + lien) :
  - Chef de Cabinet IA (-15h/sem)
  - Pôle Financier Augmenté (13 workflows)
  - Usine à Contenu B2B (3 mois en 2h)
- CTA secondaire "Voir toutes nos réalisations" → /realisations/
- Tags stack technique supprimés (le dirigeant achète du résultat, pas du n8n)
- Cartes entières cliquables, hover style Linear
- Commits 2c0d19f + aa73995

## 2026-03-22 — Fix navigation blog preview Vercel

- Les liens de navigation blog utilisaient `.Permalink` (URL absolue vers www.lagencesauvage.com), cassant la navigation sur la preview Vercel
- Corrigé avec `.RelPermalink` dans list.html (article vedette + grille) et single.html (articles connexes)
- Les `.Permalink` dans canonical, schema.org et RSS restent inchangés (doivent être absolus pour le SEO)
- Image SaaSpocalypse : diagnostic validé (fichier WebP 35Ko valide, problème = cache navigateur)
- Commit ef797cb

## 2026-03-22 — Branding : nouveau logo C2 + favicon

- Brainstorm logo Claude + Gemini (consensus 8/10) : direction "Premium Tech" Stripe/Linear
- 5 planches de concepts générées via Gemini MCP (séries C, D, E, F, G — 30+ variations)
- Directions explorées : S seul (C1-C4), chevrons/ribbon/slashes (D1-D4), S solides (E1-E6), 1+S (F1-F6), A+S monogramme (G1-G6)
- Logo provisoire retenu : C2 — carré arrondi indigo #4F46E5 + S en espace négatif blanc
- Texte : "L'Agence" (DM Sans 400) + "Sauvage" (DM Serif Display italic)
- Favicon SVG : monogramme S seul (carré indigo + S négatif)
- Taille logo augmentée : header h-12/h-14 (48-56px), footer h-12 (48px)
- Fichiers : logo-lagencesauvage.svg + favicon.svg dans static/assets/images/
- Mis à jour : header.html, footer.html, baseof.html (favicon SVG prioritaire), params.toml
- Franck fait valider par contacts extérieurs + explore piste monogramme A+S
- Commit acb7116

## 2026-03-22 — Phase 3 : Stack technique enrichie + blog list Tailwind

- Stack technique mise à jour sur 4 pages (About, Services, Homepage, FAQ) : passage de 6 à 12 technologies
- Ajouts issus des 6 case studies : OpenAI/GPT, Google Gemini, Python/FastAPI, Supabase/PostgreSQL (fusionné), Google Workspace, Whisper, APIs métier (Pennylane, LinkedIn, Pappers, La Poste)
- Page About : grille stack passée à lg:grid-cols-4 pour 12 items
- FAQ /faq/ : réponse "Quels logiciels" réécrite avec écosystème complet
- Layout blog list.html migré vers design system Tailwind v4 (filtres, grille, pagination, CTA)

## 2026-03-22 — Phase 3 : 4 case studies finales + diagrammes Gemini

- 4 case studies créées en parallèle (4 agents), même structure YAML que UC1 et UC3 :
  - **GEO Citation Tracker** `/realisations/geo-citation-tracker-visibilite-ia-marque/` — SaaS Python 3.13/FastAPI, 5 APIs LLM, scoring pondéré multi-runs, dashboard Chart.js + Alpine.js, CLI + API REST, angle waitlist agences, CTA → Transformation IA 3000€
  - **Chef de Cabinet IA** `/realisations/chef-de-cabinet-ia-assistant-dirigeant/` — 4 piliers (Gatekeeper tri email, Executive Brief matinal WhatsApp, Copilote Réunion contexte+suivi, Commande Vocale Whisper), scénario journée type en callout, CTA → Transformation 3000€ + Assistant 500€/mois
  - **Agent Téléphonique IA** `/realisations/agent-telephonique-ia-reservation-restaurant/` — 4 piliers (réception vocale, gestion réservations, escalade intelligente, 2 options déploiement 9/25 nodes), cible restauration/hôtellerie/cliniques, CTA → Assistant IA 500€/mois
  - **Cerveau d'Entreprise & Veille** `/realisations/cerveau-entreprise-veille-strategique-rag-ia/` — 4 piliers (assistant RAG 28 nodes, veille procédures collectives 27 nodes, veille marchés publics 13 nodes, agent zero papier 7 nodes), 75 nodes total, CTA → Transformation 3000€
- 4 diagrammes d'architecture générés via Gemini MCP (gemini-generate-image, 16:9, 2K, flat design)
- Images copiées dans static/assets/images/ + champ `architecture.image` dans chaque front matter
- Ordering par weight (1→6) : Pôle Financier, GEO Tracker, Usine à Contenu, Chef de Cabinet, Agent Téléphonique, Cerveau d'Entreprise
- Correction icône non supportée UC5 (phone-missed → alert-triangle)
- Page `/realisations/` désormais complète avec 6 case studies
- Commits 4c5562a + c5e0c9c

## 2026-03-22 — Phase 3 : Case study Usine à Contenu B2B

- Case study "Usine à Contenu B2B" `/realisations/usine-contenu-b2b-seo-linkedin-automatisation/`
- 5 piliers narratifs : Topic Discovery (33 nodes), Veille RAG Supabase (24 nodes), Rédaction SEO/GEO (14 nodes), Publication LinkedIn (21 nodes), Publication Hugo Blog (13 nodes)
- Pain points PAS : zéro temps, régularité impossible, SEO stagnant, community manager trop cher
- Callout différenciant : RAG vs ChatGPT copié-collé — contenu enrichi par veille sectorielle
- FAQ 7 questions (relecture, cadence, différenciation, niche, délai SEO, coût, CMS alternatifs)
- CTA → offre Assistant IA (à partir de 500€/mois + à partir de 1000€ setup)
- Diagramme architecture généré via Gemini (5 blocs, style technique clean)
- Template single.html rendu dynamique : image architecture pilotée par front matter `architecture.image` (plus de chemin hardcodé)
- Commits f31b53d + 7564a38

## 2026-03-22 — Phase 3 : Focus Réalisations v2 (6 use cases)

- Exploration complète des 11 projets Claude Code pour identifier les cas d'usage au-delà de n8n
- 2 brainstorms Claude + Gemini : sélection use cases (consensus 9/10) + conception Chef de Cabinet IA (consensus 9/10)
- Focus Réalisations v2 — 6 use cases finaux (vs 5 en v1) :
  - UC1 Pôle Financier & Recouvrement : fusionné avec PennylaneAgent (V1 11 workflows → V2 20 workflows, bot WhatsApp conversationnel Claude Haiku + Pennylane Cabinet API v2)
  - UC2 GEO Citation Tracker (NOUVEAU) : app Python 3.13/FastAPI, monitoring visibilité marque sur 5 LLM, positionné futur SaaS pour agences
  - UC3 Usine à Contenu B2B : enrichi avec preuve de dogfooding (propre blog + refonte site)
  - UC4 Chef de Cabinet IA (NOUVEAU) : Jarvis repensé en agent proactif premium — 3 piliers (Gatekeeper, Executive Brief, Copilote Réunion), commande vocale WhatsApp, scénario journée type
  - UC5 Agent Téléphonique IA : inchangé
  - UC6 Cerveau d'Entreprise & Veille : inchangé
- Exclusions validées par Franck : Contrats eMessage (pas assez impressionnant), Batchcook (B2C), F4 Manager (gaming), SMTP (DevOps only)
- 11 règles d'implémentation (vs 8 en v1) : ajout tags tech visibles, organisation par département métier, tone premium
- Diversité de stack démontrée : n8n + Python/FastAPI + Voice AI + WhatsApp + RAG

## 2026-03-22 — Phase 3 : Page Diagnostic IA

- Page Diagnostic de Transformation IA `/diagnostic/` — landing page SEO dédiée
- Contenu fidèle à l'ancienne page `diagnostic-transformation-ia.html`, redesigné avec le design system Premium Tech
- 13 sections : hero + citation Amodei, constat (3 faits sourcés Challenger/Nadella/Bloomberg), 3 erreurs entreprises, approche 360° (technique/business/humain), 4 différenciateurs, méthode J1→J5 (timeline), 5 livrables détaillés (rapport 40-60p), profils TPE/PME/ETI, tableau comparatif vs cabinet/ESN/freelance, CTA intermédiaire indigo, formulaire 2 étapes, FAQ 6 questions, CTA final
- Tableau comparatif responsive : table desktop + cards mobile
- Formulaire "appel découverte" 2 étapes → POST `/api/submit-diagnostic` (serverless function existante)
- Niveaux recommandations : Autonome (vert), Accompagné (jaune), Expert (rouge)
- Schema Service (type audit, areaServed France) + FAQPage
- Lien "Diagnostic IA gratuit" ajouté au footer Ressources
- Redirections 301 déjà en place : `/diagnostic-transformation-ia.html` → `/diagnostic/`, `/audit-ia-gratuit.html` → `/diagnostic/`
- Commits 5f390fc + 13fc90d

## 2026-03-22 — Phase 3 : Case study Pôle Financier Augmenté

- Section `/realisations/` créée avec grille de case studies (list.html)
- Case study "Pôle Financier Augmenté" — page pilier SEO/GEO pour cabinets comptables
- 5 piliers narratifs : tri email IA, extraction factures OCR, relance WhatsApp×Pennylane, recouvrement API La Poste LReL, monitoring dirigeant
- Données issues de 13+ workflows n8n réels en production
- Layout single.html avec sommaire cliquable, accordion tech details par pilier, callout wow-factor
- Schema TechArticle + FAQPage + BreadcrumbList
- FAQ 7 questions ciblant requêtes experts-comptables (RGPD, mise en demeure, coût)
- 3 assets visuels Gemini : diagramme archi 5 blocs, diagramme WhatsApp×Pennylane, mockup conversation
- API La Poste (LReL via Okapi) au lieu de Merci Facteur
- Nouveau slug `/realisations/automatisation-pole-financier-pennylane-expert-comptable/`
- Redirection 301 depuis ancien slug WhatsApp
- 3 brainstorms Claude + Gemini (consensus 9/10 chacun)
- Commits 180e62c + 8f7c5f1

## 2026-03-22 — Phase 3 : Pages légales

- Pages légales complètes : mentions légales, confidentialité, CGV
- Mentions légales + confidentialité : contenu HTML existant migré en Markdown Hugo
- CGV : 12 articles, article 7 Propriété Intellectuelle en modèle Split IP
  - Brainstorm Claude + Gemini (consensus 9/10) : distinction propriété préexistante agence (licence) vs développements spécifiques client (cession droits patrimoniaux)
  - Licence liée à la durée d'abonnement pour prestations récurrentes
  - Formalisme CPI (art. L.131-3) respecté : étendue, destination, lieu, durée
  - Supports formation/audit : propriété agence, licence usage interne
  - Clause outils tiers (n8n, OpenAI, Anthropic)
- TVA corrigée : SASU avec TVA (pas article 293 B du CGI)
- Lien CGV ajouté au footer (à côté de Mentions légales et Confidentialité)
- Redirections 301 déjà en place dans vercel.json
- Commit 22d2f89

## 2026-03-22 — Phase 3 : Page Services

- Page Services complète `/services/` — 3 offres Good-Better-Best style Stripe/Linear
- Offre 1 "Assistant IA & Automatisation" : abo 500€/mois + setup 1000€ (collaborateur virtuel 24/7)
- Offre 2 "Formation IA" : ateliers sur site à partir de 1000€/jour (éligible OPCO)
- Offre 3 "Transformation IA" (recommandé) : accompagnement complet à partir de 3000€
- Naming challengé via brainstorm Claude + Gemini (3 rounds) : "n8n" sorti des titres, bénéfice > outil
- Effet leurre validé : offres 1+2 isolées rendent l'offre 3 évidente financièrement
- Section "Comment ça marche" en 3 étapes (audit → proposition → déploiement)
- FAQ 6 questions spécifiques services + schema FAQPage
- Schema.org Service (LocalBusiness > makesOffer > Service)
- Social proof réutilisée (Olivier + Myriam, en attente témoignages)
- CSS `.card-pricing` hover (border + glow indigo)
- Menus footer mis à jour : 3 offres avec ancres (#assistant-ia, #formation-ia, #transformation-ia)
- Stack technique alignée sur toutes les pages : Make retiré, Evolution API + Hugo+Vercel ajoutés (homepage + services + FAQ services)
- Commits 713bd8b, 83df936, 407a29c

## 2026-03-22 — Phase 3 : Page À propos

- Page À propos complète `/about/` — 4 sections (hero, bio+preuves, stack+formations, CTA)
- Bio narrative Franck en 3 actes : entrepreneur (2003), expert process Mixdata (2015), déclic IA (2025)
- 4 cards credentials vérifiables en sidebar sticky (XP, secteurs, grands comptes, NEOMA)
- Stack technique avec bénéfices métier (n8n, Claude, Supabase, Evolution API, Hugo+Vercel, Notion)
- Bloc formations + badge OPCO/Qualiopi ("via partenaire certifié")
- Schema.org AboutPage + Person + Organization
- Photo professionnelle Franck optimisée via Pillow (5436x3629 → 800x800, 7.4 Mo → 52 Ko)
- Layout `_default/single.html` générique pour futures pages secondaires
- Styles hover cards credentials + stack dans main.css
- CTA intermédiaire après bio + CTA final fond indigo
- Brief Claude Desktop validé/corrigé : palette et typo corrigées, structure réduite de 6 à 4 sections (consensus Claude + Gemini brainstorm)
- Preview Vercel validée par Franck
- Commit f438385

## 2026-03-22 — Phase 2 : Homepage

- Homepage complète : hero PAS, pain points (3 cols), livrables (4 cards), social proof, FAQ, formulaire 2 étapes, CTA final
- Formulaire lead capture 2 étapes progressives → /api/submit-lead (backend existant préservé)
- Social proof : Olivier Sarezinski (Eurodom) + Myriam Louergli (Optimrezo) — témoignages textuels en attente
- FAQ 6 questions avec schema FAQPage + schema LocalBusiness
- Positionnement élargi : "professionnels" au lieu de "TPE/PME" (cible jusqu'à 200 salariés)
- FAQ outils : n8n, Claude AI, Notion, Supabase + API métier clients (Make retiré)
- Animations premium (consensus Claude + Gemini) :
  - Hero fade-in-up staggeré au chargement (400ms, easing expo)
  - Scroll reveal IntersectionObserver pour pain points, livrables, social proof
  - Tech logos grayscale → couleur au hover
  - Cards : border indigo (pain) / border + image scale 1.03 (livrables) au hover
  - FAQ refactoré : details natif → button + CSS grid (0fr→1fr) animé
  - prefers-reduced-motion respecté (tout visible immédiatement)
- Commits : afabd4b → bc55a45 (3 commits)

## 2026-03-22 — Phase 1 : Design system

- Corrigé build Vercel : Hugo 0.58.2 → 0.158.0 via `build.env.HUGO_VERSION` dans vercel.json
- Ajouté `postcss-cli` (requis par Hugo Pipes pour exécuter PostCSS)
- Corrigé permalink deprecated `:filename` → `:contentbasename`
- Palette validée par Franck : abandon "Intelligence Organique" (forest/orange/cream), adoption "Premium Tech" (indigo #4F46E5 / slate #0F172A / blanc #FFFFFF) — consensus Claude + Gemini
- Typographie validée : DM Serif Display (titres) + DM Sans (corps)
- baseof.html : Hugo Pipes + PostCSS, Google Fonts, structure flex min-h-screen
- Header responsive : nav blanc, bordure subtile, CTA indigo, menu mobile hamburger
- Footer : 4 colonnes, fond slate clair #F8FAFC, menus dynamiques depuis menus.toml
- Homepage placeholder : hero + CTA + section preuve sociale technologies
- Ajustements mobile : CTA resserré, espacements proportionnés
- Commits : 7882ecc → e46f6ec (7 commits)

## 2026-03-22 — Corrections audit Gemini pré-Phase 1

- Appliqué les 9 corrections identifiées par l'audit croisé Claude + Gemini
- vercel.json : preset Hugo natif (`framework: "hugo"`), suppression du curl, ajout redirection `/audit-ia-gratuit.html`
- package.json : buildCommand simplifié (`hugo --gc --minify`)
- main.css : ajout `@source` pour que Tailwind v4 scanne `layouts/` et `content/`
- 3 articles blog : correction liens internes `.html` → pretty URLs (URLs techniques, pas contenu)
- CLAUDE.md : 2 nouvelles règles (redirections vercel.json only + pas de classes TW dynamiques)
- lessons.md : leçons Tailwind v4 + Hugo, Vercel, SEO/GEO migration blog
- playbook : pré-requis Phase 4 (mapping HTML blog), notes serverless functions
- status.md : mise à jour progression Phase 0
- HUGO_VERSION = 0.145.0 configuré dans Vercel Dashboard (action manuelle Franck)
- Commit `d624171` pushé sur `refonte-2026`

## 2026-03-22 — Setup initial

- Audit complet du repo existant (structure, config, dépendances, serverless functions)
- Brainstorm Claude + Gemini sur l'architecture du setup Claude Code
- Création du setup complet : CLAUDE.md, settings.local.json, 4 commands, 3 hooks, project-state/
- Installation des 5 skills Corey Haines (page-cro, copywriting, form-cro, pricing-strategy, schema-markup)
- Copie des docs de référence (audit-conversion.md, playbook-refonte.md)
- Décisions validées par Franck : préserver serverless functions, ajouter .mcp.json au .gitignore, supprimer Hugo_projet/, conserver config TOML
