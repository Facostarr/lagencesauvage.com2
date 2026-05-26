# IDCC 787 — Cabinets d'experts-comptables et de commissaires aux comptes

**Statut** : ✅ Template validé par Franck (2026-05-26). Pilote de la phase Data Sprint 2 v2.
**OPCO** : Opco Atlas (services financiers, conseil, ingénierie)
**Volume FR** : ~150 000 salariés
**Use case ASV pivot** : case study existant Pôle Financier Augmenté — collecte WhatsApp + Pennylane + automatisation

## Sources officielles

- [Critères de financement Atlas — Experts-comptables 2026](https://www.opco-atlas.fr/criteres-financement/experts-comptables-et-commissaires-aux-comptes)
- [Convention collective IDCC 787 — JO 3020](https://www.dicotravail.com/convention-collective/experts-comptables-jo-3020-idcc-787/)

## Limites de couverture

⚠️ Atlas ne couvre le PDC mutualisé que pour les cabinets **<50 sal**. Les cabinets ≥50 sal financent via fonds propres (contribution légale 1% MS) ou dispositifs interprofessionnels (Pro-A, COatlas grands comptes).

## JSON à insérer dans `static/data/simulator-ready.json` (ordre alphanumérique : entre `"576"` et `"800"`)

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

## Notes libres pour fiche programmatique (~2300 chars)

```markdown
## Convention collective des cabinets d'experts-comptables (IDCC 787)

La CCN 787 régit les cabinets d'expertise comptable et de commissariat aux comptes en France. Avec environ 150 000 salariés, c'est le 2e employeur du conseil aux entreprises après le Syntec (IDCC 1486).

Les cabinets sont rattachés à **Opco Atlas** (services financiers, conseil, ingénierie), qui propose des dispositifs spécifiques au secteur via le Plan de développement des compétences (PDC).

### Plafonds 2026 Opco Atlas pour le PDC

Pour les cabinets de **moins de 50 salariés**, Atlas finance les actions de formation selon ces plafonds :

- **1 à 10 salariés** : 2 800 € HT/an/entreprise + 1 000 € HT/an/salarié spécifique formations DEC/CAC
- **11 à 49 salariés** : 9 000 € HT/an/entreprise + 1 000 € HT/an/salarié spécifique formations DEC/CAC

### AFEST (formation en situation de travail)

Atlas finance l'AFEST à **20 € HT/h**, dans la limite de 150 h par formation et dans le plafond annuel entreprise. Particulièrement adapté à la formation IA appliquée aux outils du cabinet (Pennylane, Cegid, automatisation factures).

### Période de reconversion et VAE

- **Période de reconversion** : 150 à 450 h, jusqu'à 12 mois, 15 € HT/h (18 € HT/h pour les BOETH, 50+ ans ou certifications de branche). Éligibles : certifications RNCP, blocs RNCP, CQP.
- **VAE** : jusqu'à 3 000 € HT/parcours pour cabinets <50 sal.

### Le cas IA et automatisation

Les cabinets d'expertise comptable font face à une double pression : pénurie de profils qualifiés et explosion des volumes (facturation électronique 2026, automatisation Pennylane, agents IA pour la collecte WhatsApp). Les formations IA (Claude, ChatGPT, agents conversationnels) sont **finançables** par Atlas via le PDC ou la période de reconversion, à condition que l'organisme soit certifié Qualiopi. Pour un cabinet de 5-10 salariés, le plafond annuel de 2 800 € HT couvre 2 à 3 jours de formation collective IA par an (à raison de 1 000 € HT/jour-formateur).

### Cabinets ≥50 salariés

Le cabinet finance par fonds propres (contribution légale 1% MS) ou par dispositifs interprofessionnels (Pro-A, COatlas grands comptes). La part Atlas mutualisée n'intervient plus en pré-financement automatique.
```

## NAF à mapper dans `api/_simulateur/naf-suggestions.js`

- `69.20Z` Activités comptables → IDCC 787, OPCO Atlas, `auto: true` (NAF dédié sans ambiguïté)
