# Sprint 2 v2 — "High-Value 5" — Phase Data

**Décision** : 2026-05-26 (consensus Claude+Gemini 9.5/10 après pivot ICP-driven).

## État de la phase Data

| IDCC | Convention | OPCO | État BDD actuel | Action | Draft |
|------|-----------|------|-----------------|--------|-------|
| **787** | Cabinets d'experts-comptables | Atlas | ABSENT | À AJOUTER | ✅ `idcc-787-experts-comptables.md` |
| **1000** | Cabinets d'avocats | EP | présent sans détails | À ENRICHIR | ⏳ session suivante |
| **1996** | Pharmacie d'officine | EP | présent sans détails | À ENRICHIR | ⏳ session suivante |
| **2264** | Hospitalisation privée | Santé | ABSENT | À AJOUTER | ⏳ session suivante |
| **1597** | BTP Cadres & ETAM | Constructys | ABSENT | À AJOUTER | ⏳ session suivante |

## Template validé (2026-05-26)

Le draft 787 fixe le template à réutiliser :
- **Sources officielles** : page OPCO + page CCN (dicotravail ou équivalent)
- **JSON** aligné sur `static/data/simulator-ready.json` schema (cf. 1486 Syntec pour OPCO_CLASSIQUE complet, 1266 Restauration collective pour PDC + AFEST simple)
- **Notes libres** ~2000-2500 chars structurés :
  1. Intro convention + volume salariés
  2. Plafonds PDC par tranche d'effectif
  3. AFEST (si dispo)
  4. Période de reconversion + VAE
  5. Cas particulier IA / automatisation (pitch implicite ASV)
  6. Limite >50 sal (si dispositif réservé <50 sal)

## Workflow par IDCC

1. **WebSearch** : "OPCO [X] IDCC [Y] [nom convention] 2026 plafond PDC plan développement compétences"
2. **WebFetch** sur la page officielle OPCO (site .fr) pour barèmes 2026 exacts
3. **Drafter** `idcc-XXX-[slug].md` avec format JSON + notes_libres + sources
4. **Submit à Franck** pour validation (avant intégration BDD)

## Intégration BDD (post-validation)

À clarifier avec Franck :
- BDD source : `data/opco-database.json` (projet web actuel) OU projet voisin `Simulateur OPCO/data/opco-database.json` ?
- Script de build : `scripts/generate-opco-branches.py` régénère les fiches branches MD depuis la BDD
- Régénération `static/data/simulator-ready.json` : via quel script ?

## NAF suggestions à étendre

À ajouter dans `api/_simulateur/naf-suggestions.js` une fois la BDD enrichie :
- `69.20Z` Expert-comptable → IDCC 787
- `69.10Z` Activités juridiques → IDCC 1000
- `47.73Z` Pharmacie d'officine → IDCC 1996
- `86.10Z`, `86.21Z`, `86.22A/B/C` Hospitalisation privée → IDCC 2264
- `71.12A/B` Ingénierie BTP → IDCC 1597

## Dette technique parallèle

Fusion fiche métallurgie 3127 et 3248 : la nouvelle CCN unifiée 2026 a un nouveau IDCC mais c'est la même convention. Action séparée (~15 min) :
- Renommer fiche `opco2i-metallurgie-3127.md` → `opco2i-metallurgie-3248.md` OU créer alias
- Mettre à jour les deux IDCCs dans simulator-ready.json
- Redirection 301 dans vercel.json
