# Notion — Base "Leads Simulateur OPCO"

Schéma de la base Notion dédiée au lead capture du Simulateur OPCO (cf. PRD section 8). Cette base est **distincte** de la base "Leads Diagnostic" car la qualification est radicalement différente : budget chiffré, IDCC connu, secteur certain → priorisation commerciale automatisée.

## Action manuelle Franck — création de la base

1. Dans Notion, dupliquer le template existant "Leads Diagnostic" OU créer une nouvelle base.
2. Renommer en **Leads Simulateur OPCO**.
3. Configurer les **17 colonnes (+ 2 colonnes calculées Notion)** listées ci-dessous.
4. Inviter l'intégration Notion existante (ou nouvelle) en partage de la base.
5. Récupérer l'ID de la base (32 chars hex dans l'URL) → ajouter env var dans Vercel Dashboard :
   - **Nom** : `NOTION_DATABASE_SIMULATEUR_OPCO`
   - **Environments** : Production + Preview
6. Redéployer la branche `feat/simulateur-opco`.

## Colonnes (mapping exact API → Notion)

| # | Nom colonne Notion | Type | Source API | Notes |
|---|--------------------|------|------------|-------|
| 1 | **Nom complet** | Title | `body.nom_prospect` ou `"Lead anonyme"` | Tronqué 100 chars |
| 2 | **Email** | Email | `body.email` (lowercased) | Obligatoire |
| 3 | **Téléphone** | Phone | `body.telephone` | Null si absent |
| 4 | **Raison sociale** | Rich text | `entreprise.nom_complet` | Re-résolu DINUM côté serveur |
| 5 | **SIREN** | Number | `entreprise.siren` (9 chiffres → int) | |
| 6 | **Code NAF** | Select | `entreprise.naf` (ex `10.71C`) | Créer les options à la volée |
| 7 | **Tranche effectif** | Select | Label humain depuis `tefen_code` | Ex `"10 à 19 salariés"` |
| 8 | **IDCC** | Number | `simulation.inputs_snapshot.idcc` | Null si idcc_inconnu |
| 9 | **Niveau confiance IDCC** | Select | `entreprise.source_confiance` mapped | 4 options : `Auto-DINUM`, `Auto-Fallback`, `Heuristique-NAF`, `Manuel` |
| 10 | **OPCO** | Select | `simulation.opco_nom` | 11 options à pré-créer : Afdas, Akto, Atlas, Constructys, Mobilités, EP, Opco 2i, OCAPIAT, Santé, Uniformation, Cohésion sociale |
| 11 | **Budget min (€)** | Number | `simulation.budget_min_eur` | Null si non-chiffrable |
| 12 | **Budget max (€)** | Number | `simulation.budget_max_eur` | **Tri par valeur pour priorisation commerciale** |
| 13 | **Dispositifs activés** | Multi-select | `simulation.dispositifs_actives.map(libelle)` tronqué à 8 | Pré-créer : PDC, AFEST, Bonus IA, Bonus écolo, Parcours stratégique, FNE-Formation, VAE, Actions collectives |
| 14 | **Version règles** | Rich text | `simulation.version_regles` (ex `"2026.Q2.1"`) | Versioning audit |
| 15 | **Qualification (auto)** | Select | `classifyBudget(budget_max, cas_particulier)` | 4 options : `Hot`, `Warm`, `Cold`, `À qualifier` |
| 16 | **Cas particulier** | Select | `simulation.cas_particulier` | Optionnel — 5 options : `effectif_non_renseigne`, `dirigeant_tns_sans_salarie`, `idcc_inconnu`, `branche_a_confirmer`, `effectif_hors_tranches` |
| 17 | **Statut commercial** | Select | `"Nouveau"` par défaut | Manuel : Nouveau / Contacté / RDV / Converti / Perdu |
| 18 | **Source UTM** | Rich text | `${utm_source} / ${utm_campaign}` ou `"direct"` | |
| 19 | **Date soumission** | Date | `now` (ISO 8601) | |

## Snapshot JSON dans le body de la page

Le snapshot complet de la simulation (request + entreprise re-résolue + résultat moteur) est **stocké dans le body** de la page Notion sous forme de bloc `code` (langage `json`), pas dans une propriété rich_text limitée à 2000 chars. Permet d'archiver le payload complet (~4-6 KB) pour preuve d'audit immuable (PRD section 8 : "snapshot complet stocké en Notion → commercial voit exactement ce que le prospect a vu").

Le snapshot contient un **email hashé SHA-256 préfixe 12 chars**, pas l'email en clair, pour limiter la propagation PII même dans la page Notion (l'email en clair reste en propriété 2, comme attendu).

## Formule recommandée — Qualification calculée (optionnelle si "Qualification (auto)" suffit)

Si tu veux une formule Notion native en complément :

```
if(prop("Cas particulier") != "", "📋 À qualifier",
  if(prop("Budget max (€)") >= 5000, "🔥 Hot",
    if(prop("Budget max (€)") >= 2000, "🌤️ Warm", "❄️ Cold")))
```

Mais c'est redondant avec la colonne `Qualification (auto)` déjà remplie par l'API. À toi de voir si tu préfères la formule (auto-recalculée si tu modifies le budget manuellement) ou la valeur fixe (immuable).

## Risque : option Select non pré-créée

Notion **crée automatiquement** les options manquantes pour les colonnes Select / Multi-select au moment où l'API les utilise. Donc même sans pré-création, la première soumission avec un nouveau code NAF / OPCO / etc. créera l'option. Avantage : zéro maintenance. Inconvénient : un typo dans le code (ex `"Opco Atlas"` vs `"Opco ATLAS"`) crée 2 options distinctes. Mitigation : on utilise les valeurs canoniques du `simulator-ready.json` qui sont stables.

## Test post-création

Une fois la base créée et `NOTION_DATABASE_SIMULATEUR_OPCO` configurée dans Vercel :

```powershell
curl -X POST "https://lagencesauvage.com/api/simulate-opco-compute" `
  -H "Content-Type: application/json" `
  -d '{ "siret": "49982392000016", "email": "test@example.com", "rgpd_consent": true, "nom_prospect": "Test Franck" }'
```

Attendu : page créée dans Notion avec `OPCO=Opco EP`, `IDCC=843`, `Tranche=10 à 19 salariés`, snapshot JSON dans le body.
