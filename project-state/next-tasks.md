# Next Tasks — Refonte lagencesauvage.com

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
- [ ] Soumettre nouvel article dans Search Console pour indexation
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
