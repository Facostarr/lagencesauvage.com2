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
- [ ] Supprimer ancien sitemap-blog.xml dans Search Console

### Production de contenu (en cours)

- [x] Article "Comment être cité par ChatGPT" — SEO/GEO optimisé, image Gemini, 6 sources liées, bibliographie
- [x] Règle sourcing dans CLAUDE.md : liens hypertextes obligatoires sur toute citation
- [x] Mémoire sauvegardée : feedback_sources_links.md
- [ ] Créer commande `/new-article` (workflow article orchestré)
- [ ] Créer archetype Hugo `archetypes/blog.md` (template front matter)
- [ ] Retrouver/réinstaller Hugo local (winget + subst S:)

### Leviers GEO prioritaires (post-lancement)

- [ ] Se faire citer dans un classement tiers (codeur.com, koino.fr, jedha.co)
- [ ] Contenu ciblant requêtes génériques ("comment choisir agence IA TPE", etc.)
- [ ] Renforcer E-E-A-T (témoignages, case studies, apparitions presse)
