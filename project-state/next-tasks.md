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
- [ ] Article 3/4 : "Agents IA autonomes en PME : 3 cas d'usage réels qui remplacent les SaaS" — Guides pratiques (reporté)
- [ ] Article 4/4 : "IA et professions juridiques : gain de temps et secret professionnel en 2026" — Expertise terrain (reporté)

### Outillage blog

- [ ] Créer commande `/new-article` (workflow article orchestré) — reporté
- [ ] Créer archetype Hugo `archetypes/blog.md` (template front matter) — reporté
- [x] Hugo Extended v0.158.0 installé en local + subst S: fonctionnel

### Leviers GEO prioritaires (post-lancement)

- [ ] Se faire citer dans un classement tiers (codeur.com, koino.fr, jedha.co)
- [ ] Contenu ciblant requêtes génériques ("comment choisir agence IA TPE", etc.)
- [ ] Renforcer E-E-A-T (témoignages, case studies, apparitions presse)
