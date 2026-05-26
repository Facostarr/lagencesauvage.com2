# Brief scraping pour le projet "Simulateur OPCO"

**À coller dans une session Claude Code du projet voisin `Simulateur OPCO/`** où se trouve toute l'infrastructure de scraping/parsing OPCO déjà éprouvée.

---

## Contexte (Sprint 2 v2 — projet web `lagencesauvage.com2`)

Le simulateur OPCO en prod sur lagencesauvage.com a été pivoté **ICP-driven** le 2026-05-26 (consensus Claude+Gemini 9.5/10) après abandon du Sprint 1 TNS/FAF (mauvais fit ICP + abonnement non finançable).

**Objectif** : enrichir la BDD OPCO normalisée pour 5 conventions à fort ICP fit ASV (PME 5-200 sal, secteurs tech/services/santé/juridique), afin de :
- Faire reconnaître ces IDCCs au simulateur web (avec barèmes détaillés)
- Générer 5 nouvelles fiches branches programmatiques `/simulateur-opco/branches/{slug}/`
- Étendre `api/_simulateur/naf-suggestions.js` avec ~10 NAFs ciblés

## Les 5 conventions cibles

| IDCC | Convention | OPCO | État BDD actuelle (web) | Action attendue |
|------|-----------|------|-------------------------|-----------------|
| **787** | Cabinets d'experts-comptables et CAC | **Opco Atlas** | ABSENT | Ajouter (✅ pilote déjà drafté, voir plus bas) |
| **1000** | Cabinets d'avocats | OPCO EP | présent en mode `OPCO_TRANSVERSAL_SANS_DETAIL_BRANCHE` | Enrichir avec détails barèmes |
| **1996** | Pharmacie d'officine | OPCO EP | présent en mode `OPCO_TRANSVERSAL_SANS_DETAIL_BRANCHE` | Enrichir avec détails barèmes |
| **2264** | Hospitalisation privée à but lucratif (FHP) | OPCO Santé | ABSENT | Ajouter |
| **1597** | Bâtiment ETAM (cadres aussi : 2420) | Constructys | ABSENT | Ajouter (combiner 1597 ETAM + 2420 Cadres si possible) |

⚠️ **Correction OPCO importante** : IDCC 787 est sous **Opco Atlas**, pas OPCO EP (confirmé sur [opco-atlas.fr](https://www.opco-atlas.fr/criteres-financement/experts-comptables-et-commissaires-aux-comptes)). Si ta BDD avait 787 → EP, à corriger.

## Sources officielles pré-identifiées

### IDCC 787 — Opco Atlas
- **Page publique avec barèmes 2026** : <https://www.opco-atlas.fr/criteres-financement/experts-comptables-et-commissaires-aux-comptes>
- **Convention** : <https://www.dicotravail.com/convention-collective/experts-comptables-jo-3020-idcc-787/>
- **Statut** : ✅ déjà scrappé manuellement, structure JSON validée (cf. pilote plus bas)

### IDCC 1000 — OPCO EP (Cabinets d'avocats)
- **Page sélection branche OPCO EP** : <https://www.opcoep.fr/criteres-de-financement> (dropdown branche, génère un PDF/page détail)
- **Branche listée** : "Personnel salarié des cabinets d'avocats" et "Avocats salariés"
- **Liste branches OPCO EP officielle** : <https://www.opcoep.fr/ressources/centre-ressources/juridique/Branches-opcoep.pdf>
- **Agrégateur** : <https://mon-budget-opco.fr/opco/opcoep> + <https://www.opco.fr/info/opco-ep/>

### IDCC 1996 — OPCO EP (Pharmacie d'officine)
- **Page sélection branche OPCO EP** : <https://www.opcoep.fr/criteres-de-financement> (sélectionner Pharmacie d'officine)
- **Agrégateur** : <https://mon-budget-opco.fr/opco/opcoep>
- **NAF principal** : 47.73Z

### IDCC 2264 — OPCO Santé (Hospitalisation privée)
- **Page outils OPCO Santé** : <https://www.opco-sante.fr/nos-outils/synthese-des-prises-en-charge-secteur-de-l-hospitalisation-privee-et-du-thermalisme-hp/>
- **PDF synthèse HP** : URL pattern `https://www.opco-sante.fr/app/uploads/{year}/{month}/opco{n}_synthese-des-prise-en-charge-hp_pdf.pdf` (j'avais testé `/2026/05/opco0275_...pdf` mais 404 — chercher la version 2026 active sur la page parent)
- **Codes NAF principaux** : 86.10Z (Hôpitaux), 86.21Z (Médecine générale), 86.22A/B/C (Médecine spécialisée), 86.90A-F (autres activités santé)

### IDCC 1597 + 2420 — Constructys (BTP ETAM + Cadres)
- **Page Constructys 2026** : <https://www.constructys.fr/decouvrez-les-modalites-de-participation-financiere-2026/>
- **PDF CAPEB Modalités Bâtiment PDC 2026** : <https://www.capeb.fr/www/capeb/media//pays-de-la-loire/document/CONSTRUCTYS-Modalites_Batiment_PDC_2026.pdf> (PDF avec graphiques — possiblement nécessite OCR ou parsing image)
- **Conditions prise en charge** : <https://www.constructys.fr/financer-vos-projets-de-formation/modalites-demandes-de-prise-charge/conditions-de-prise-en-charge-2/>
- **Article récap** : <https://www.editions-tissot.fr/actualite/droit-du-travail/formations-professionnelles-les-prises-en-charge-par-constructys>
- **NAF principaux** : 41.10A-D, 42.X, 43.X (BTP), mais ETAM/Cadres se distinguent par catégorie de personnel pas par NAF

## Format de sortie attendu

Schéma cible : `static/data/simulator-ready.json` du projet web — clé `idcc_index.{idcc_str}`. Réutilise ton pattern de build BDD habituel puis exporte vers ce schéma.

### Pilote 787 déjà drafté (référence)

```json
"787": {
  "branche_details_disponibles": true,
  "branche_idcc_a_confirmer": false,
  "branche_nom": "Cabinets d'experts-comptables et de commissaires aux comptes",
  "branche_slug": "atlas-experts-comptables-787",
  "contribution_conventionnelle_requise": false,
  "opco_nom": "Opco Atlas",
  "opco_slug": "atlas",
  "provenance_budget": "OPCO_CLASSIQUE",
  "regles": {
    "afest": {
      "acces_of_tiers": true,
      "eligible": true,
      "forfait_horaire_eur": 20.0,
      "tranches": [
        {
          "effectif_max": 49,
          "effectif_min": 1,
          "formule_max_lisible": "20€ HT/h, 150h max par formation, dans plafond annuel entreprise",
          "plafond_horaire_eur": 20.0,
          "plafond_par_dossier_eur": null,
          "plancher_garanti_eur": null
        }
      ],
      "type_fonds": "OPCO_CLASSIQUE"
    },
    "bonus_thematiques": [],
    "fne_formation": {"instruit_par_opco": true},
    "parcours_strategique": null,
    "pdc": {
      "acces_of_tiers": true,
      "eligible": true,
      "frais_annexes": {"deplacement": false, "hebergement_eur": null, "repas_eur": null},
      "tranches": [
        {
          "effectif_max": 10,
          "effectif_min": 1,
          "formule_max_lisible": "2 800€ HT/an/entreprise + 1 000€ HT/an/salarié pour formations DEC/CAC",
          "plafond_horaire_eur": null,
          "plafond_par_dossier_eur": null,
          "plancher_garanti_eur": 2800
        },
        {
          "effectif_max": 49,
          "effectif_min": 11,
          "formule_max_lisible": "9 000€ HT/an/entreprise + 1 000€ HT/an/salarié pour formations DEC/CAC",
          "plafond_horaire_eur": null,
          "plafond_par_dossier_eur": null,
          "plancher_garanti_eur": 9000
        }
      ],
      "type_fonds": "OPCO_CLASSIQUE"
    },
    "vae": {
      "eligible": true,
      "plafond_par_dossier_eur": 3000,
      "type_fonds": "OPCO_CLASSIQUE"
    }
  }
}
```

### Données à extraire pour les 4 autres IDCCs (1000, 1996, 2264, 1597)

Pour chacun, scraper et structurer :

1. **Identité de la convention**
   - `branche_nom` : nom officiel complet
   - `branche_slug` : kebab-case (ex: `ep-cabinets-avocats-1000`, `ep-pharmacie-officine-1996`, `sante-hospitalisation-privee-2264`, `constructys-batiment-etam-1597`)
   - `opco_nom` / `opco_slug`
   - `contribution_conventionnelle_requise` : true si la convention prélève une contribution conventionnelle au-dessus de la légale (ex: Syntec)
   - `provenance_budget` : `OPCO_CLASSIQUE` si détails dispo, sinon `OPCO_TRANSVERSAL_SANS_DETAIL_BRANCHE`

2. **Règles de financement** (`regles`)
   - **PDC** : tranches par effectif (1-10, 11-49, 50-299, 300+) avec `plafond_horaire_eur`, `plafond_par_dossier_eur`, `plancher_garanti_eur`, `formule_max_lisible`. Mentionner si dispositif réservé `<50 sal` ou ouvert à toutes tailles.
   - **AFEST** : `forfait_horaire_eur` (uniforme ou par tranche), max heures/formation, accès OF tiers
   - **Bonus thématiques** : si des dispositifs spéciaux existent (transition écologique, numérique/IA, handicap, plan stratégique), les lister dans `bonus_thematiques[]` avec libellé + plafonds
   - **Période de reconversion** (ex-Pro-A) : plafond €/h, durée min/max
   - **VAE** : `plafond_par_dossier_eur` si dispo
   - **FNE-Formation** : `instruit_par_opco: true` (par défaut pour OPCO classiques)
   - **Parcours stratégique** : si OPCO offre un dispositif catalogue spécifique (ex: ProPulsion Atlas, IA Box Opcommerce)

3. **Notes libres pour fiche programmatique SEO** (~2000-2500 chars markdown)
   - Intro convention + volume salariés + secteurs concernés
   - Plafonds PDC par tranche
   - AFEST (si dispo)
   - Période de reconversion + VAE
   - Cas particulier IA / automatisation (use case pertinent pour la branche : ex pour avocats = recherche juris, ex pour pharmacie = ordonnances/stocks, ex pour hospi = dictée médicale/RH, ex pour BTP = devis/rapports chantier)
   - Limite >50 sal si dispositif réservé <50

4. **NAFs principaux** (pour `api/_simulateur/naf-suggestions.js`)
   - 1000 → 69.10Z Activités juridiques (auto: false, beaucoup d'autres conventions juridiques voisines)
   - 1996 → 47.73Z Pharmacie d'officine (auto: true, NAF dédié)
   - 2264 → 86.10Z, 86.21Z, 86.22A/B/C (auto: true pour les NAFs hospi pures, auto: false pour mixtes)
   - 1597 → 71.12A/B Ingénierie BTP (auto: false, peut être Syntec 1486 selon activité), 41.X 42.X 43.X BTP construction (mais ETAM/Cadres → 1597/2420 vs Ouvriers → 1596)
   - 787 → 69.20Z Activités comptables (auto: true)

## Livrable attendu (côté projet OPCO)

1. **Patch sur `data/opco-database.json`** (BDD normalisée source de vérité) : 5 nouvelles entrées (787, 2264, 1597) + enrichissement de 1000 et 1996 si elles existent déjà en mode partiel
2. **Re-build de `simulator-ready.json`** via le script de build BDD existant
3. **Copie du `simulator-ready.json` mis à jour** vers le projet web : `static/data/simulator-ready.json`
4. **Notes libres** sous forme de 5 fichiers `.md` dans une dossier à transférer (ex: `notes-libres/idcc-{XXX}-{slug}.md`) — pour alimenter le générateur de fiches programmatiques côté projet web
5. **NAFs à ajouter** documentés dans un patch pour `api/_simulateur/naf-suggestions.js` côté projet web

## Contraintes

- **OPCO Atlas (787)** déjà drafté, validé par Franck — juste à intégrer dans la BDD pour cohérence build (pas re-scraper)
- **Pas de barèmes inventés** : si une donnée n'est pas trouvable même avec le pipeline scraping complet, marquer `branche_idcc_a_confirmer: true` et documenter la source manquante dans les notes_libres
- **Politique sourcing ASV** : sources autorisées = sites .fr officiels OPCO + service-public.fr + dicotravail + LégiSocial + presse spécialisée reconnue. PAS de sites concurrents (agences IA, agences digitales).

## Pour valider côté projet OPCO avant de me renvoyer le patch

Tu peux vérifier :
- Schéma JSON aligné sur le sample 787 ci-dessus (pas de champ manquant, pas de typing flou)
- Slugs uniques cohérents avec les slugs déjà existants côté web (ex: `syntec-1486`, `assurances-1672`)
- Notes libres fact-checked vs sources officielles (citations + URLs)

Merci 🙏

---

**Doc maître côté projet web** : [`docs/sprint-2-bigfive-v2/README.md`](README.md)
**Pilote 787 détaillé** : [`docs/sprint-2-bigfive-v2/idcc-787-experts-comptables.md`](idcc-787-experts-comptables.md)
