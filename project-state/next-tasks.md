# Next Tasks — Refonte lagencesauvage.com

## Priorité immédiate — Phase 5 Quality gate

Hugo local opérationnel (v0.158.0 via `subst S:`). Attaquer les audits :

1. **Audit SEO/Schema** : inspecter le HTML généré (`hugo --gc --minify` depuis S:\), vérifier JSON-LD, meta tags, OG tags, sitemap.xml sur toutes les pages
2. **Audit accessibilité** : contraste, alt text, aria, navigation clavier, sémantique HTML
3. **Audit technique** : liens cassés, responsive, performance (Lighthouse sur preview Vercel)
4. **Audit redirections 301** : tester chaque redirection du vercel.json
5. **Audit conversion** : checklist CRO page par page (skill conversion-audit-checklist)
6. **Test formulaires** : submit-lead, submit-diagnostic (via `vercel dev` ou preview Vercel)

## En attente de Franck

- Lien Calendly éventuel pour la page de confirmation formulaire
- Logo final : validation par contacts extérieurs

## Pages Phase 3 livrées

- [x] Page À propos `/about/`
- [x] Page Services `/services/`
- [x] Page Réalisations `/realisations/` — 6 case studies complètes :
  - [x] Pôle Financier Augmenté (weight 1)
  - [x] GEO Citation Tracker (weight 2)
  - [x] Usine à Contenu B2B (weight 3)
  - [x] Chef de Cabinet IA (weight 4)
  - [x] Agent Téléphonique IA (weight 5)
  - [x] Cerveau d'Entreprise & Veille (weight 6)
- [x] Page FAQ `/faq/`
- [x] Page Diagnostic IA `/diagnostic/`
- [x] Pages légales : mentions légales, confidentialité, CGV

## Logo (en cours de validation)

- Logo provisoire C2 intégré (carré indigo + S négatif + texte)
- Favicon SVG du monogramme S en place
- Franck consulte des avis extérieurs sur les concepts générés
- Piste monogramme A+S (série G) à affiner si retours positifs
- Une fois le logo final validé : convertir les `<text>` SVG en paths vectorisés (Inkscape/Illustrator)

## Fait cette session

- [x] Témoignages Olivier (Eurodom) + Myriam (Optimrezo) — consensus Claude+Gemini 9/10, validés par Franck
