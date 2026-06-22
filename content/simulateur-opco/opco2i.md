---
title: OPCO 2i 2026 — Budget formation, dispositifs et conventions
seo_title: "OPCO 2i 2026 : budget & dispositifs formation"
description: OPCO 2i finance la formation des salariés des secteurs industrie (interindustriel). Dispositifs activables 2026 (PDC, Période de reconversion, AFEST, abondement CPF), branches couvertes, sources officielles. Calcul autom
date: 2026-05-23
lastmod: '2026-05-26'
layout: opco-fiche
robots: index, follow
canonical: /simulateur-opco/opco2i/
ogImage: /assets/images/logo-agence-sauvage.svg
opco_slug: opco2i
opco_nom_court: OPCO 2i
opco_label: OPCO 2i
opco_nom_officiel: OPCO 2i — Opérateur de Compétences des Industries
opco_url_racine: https://www.opco2i.fr/
opco_url_criteres: https://www.opco2i.fr/formation-et-financement/les-regles-de-prise-en-charge/
opco_nb_idcc: 30
opco_audience: industrie (interindustriel)
opco_annee: 2026
opco_date_maj: 2026-05-18
keywords:
- OPCO 2i 2026
- budget formation OPCO 2i
- simulateur OPCO 2i
- convention collective OPCO 2i
- financement formation industrie (interindustriel)
faq:
- question: Quelles entreprises sont rattachées à OPCO 2i ?
  answer: L'OPCO 2i couvre les entreprises dont la convention collective figure parmi les 30 branches couvertes (industrie (interindustriel)). Le rattachement est automatique selon l'IDCC de votre convention. Si vous ne le connaissez pas, notre <a href="/simulateur-opco/">simulateur identifie automatiquement votre OPCO</a> depuis votre raison sociale ou votre SIREN.
- question: Quels prérequis pour financer une formation via OPCO 2i ?
  answer: 'Trois prérequis : (1) votre entreprise doit être à jour de sa contribution formation professionnelle (CFP) versée à l''URSSAF, (2) l''organisme de formation doit être <a href="https://travail-emploi.gouv.fr/qualiopi-marque-de-certification-qualite-des-prestataires-de-formation" rel="noopener" target="_blank">certifié Qualiopi</a> (obligatoire depuis le 1er janvier 2022), et (3) la demande de financement doit être déposée <strong>avant le démarrage de la formation</strong> (pas de prise en charge rétroactive).'
- question: Le dispositif Pro-A est-il encore disponible chez OPCO 2i ?
  answer: 'Non. La loi du 24 octobre 2025 a remplacé Pro-A par la <strong>Période de reconversion</strong> depuis le 1er janvier 2026. OPCO 2i a basculé ses critères vers ce nouveau dispositif. Les exigences restent comparables : alternance, certification RNCP ou CQP obligatoire, tuteur identifié dans l''entreprise.'
dispositifs_2026:
- nom: Plan de Développement des Compétences (PDC)
  statut: eligible
  note: 'Cibles : moins-11, 11-49'
- nom: Contrat de professionnalisation
  statut: eligible
  note: —
- nom: Période de reconversion
  statut: eligible
  note: Remplace Pro-A depuis le 1er janvier 2026 — certification RNCP requise
- nom: FNE-Formation
  statut: a-verifier
  note: Instruit par l'OPCO
- nom: POEC (Préparation Opérationnelle à l'Emploi Collective)
  statut: eligible
  note: —
- nom: Abondement CPF par l'OPCO
  statut: a-verifier
  note: —
branches_idcc:
- nom: Métallurgie
  slug: opco2i-metallurgie-3127
- nom: Industrie pharmaceutique
  slug: opco2i-industrie-pharmaceutique-176
- nom: Chimie
- nom: Plasturgie et composites
- nom: Textile
- nom: Habillement
- nom: Industries électriques et gazières
- nom: Carrières et matériaux + Chaux
- nom: Fabrication de l'ameublement
- nom: Caoutchouc
- nom: Industries des panneaux à base de bois
- nom: Menuiseries, charpentes et constructions industrialisées
- nom: Bijouterie, joaillerie, orfèvrerie, horlogerie
- nom: Industrie papier carton
- nom: Distribution Papier Carton
- nom: Pétrole
- nom: Recyclage et Réemploi
- nom: Services d'efficacité énergétique
- nom: Fabrication produits pharma/parapharma/vétérinaire
- nom: Industrie et services nautiques
- nom: Ciments
- nom: Couture parisienne
- nom: Cristal, verre et vitrail
- nom: Maroquinerie
- nom: Chaussure et articles chaussants
- nom: Industries céramiques
- nom: Tuiles et briques
- nom: Fabrication mécanique du verre
- nom: Jeux, jouets et puériculture
- nom: Entreprise sans convention collective nationale
---

L'OPCO 2i (Interindustriel) finance la formation professionnelle des salariés des **entreprises industrielles** : métallurgie, plasturgie, chimie, pétrole, pharmacie, papier-carton, textile, ameublement, recyclage. Si votre entreprise relève de l'une des 30 conventions industrielles couvertes, votre budget formation 2026 est mobilisable via les dispositifs ci-dessous.

{{< opco-kpi >}}

{{< opco-dispositifs >}}

{{< opco-branches >}}

## Analyse détaillée — OPCO 2i en 2026

Cette section restitue notre analyse complète des critères de financement publiés officiellement par OPCO 2i. Données factuelles, sourcées et mises à jour régulièrement.

## Présentation d'OPCO 2i

OPCO 2i est l'opérateur de compétences des **industries** en France. Il couvre **30 branches professionnelles** du secteur industriel : métallurgie, chimie, pharmaceutique, plasturgie, textile, papier-carton, industries électriques, carrières, ameublement, bijouterie, etc.

**Architecture technique** : les règles de prise en charge sont présentées via un composant Vue 3 (sélecteur branche + taille entreprise). Les critères s'affichent dans des modales chargées en iframe depuis `/dispositif/{slug}/?iframe=1&brancheVal={id}&paramVal={paramVal}`. Les IDs de branches (`brancheVal`) proviennent de la taxonomie WordPress (`/wp-json/wp/v2/branche`).

## PDC — Plan de Développement des Compétences

### TPE (<50 salariés)

Critères transversaux validés par le **Conseil d'administration du 18 décembre 2025**, applicables au **1er janvier 2026**. Ces critères sont **identiques pour toutes les branches** OPCO 2i.

| Paramètre | Valeur |
|-----------|--------|
| Plafond annuel | **4 800€/an/entreprise** |
| Plafond horaire — formations métiers | **30€/h** |
| Plafond horaire — formations réglementaires (dont CSE) | **20€/h** |
| Plafond horaire — langues | **15€/h** |
| Bonus versement volontaire | **+3%** si volume ≥ 300 000€ / **+4%** si volume < 300 000€ |
| Demande préalable | Via Mon Compte 2i, avant le démarrage |
| Fonds | Mutualisés (dans la limite des disponibilités) |

### PME, ETI, Grands comptes (≥50 salariés)

Uniquement sur **versements volontaires**. Pas de fonds mutualisés.

## Mapping branche → brancheVal (WordPress REST API)

Les IDs de branches sont nécessaires pour accéder aux règles de prise en charge par branche/dispositif. Source : `https://www.opco2i.fr/wp-json/wp/v2/branche?per_page=50&_fields=id,name,slug`

| Branche | brancheVal |
|---------|-----------|
| Bijouterie, joaillerie, orfèvrerie, horlogerie | 136 |
| Caoutchouc | 141 |
| Carrières et matériaux + Chaux | 153 |
| Chaussure et articles chaussants | 145 |
| Chimie | 142 |
| Ciments | 155 |
| Couture parisienne | 147 |
| Cristal, verre et vitrail | 158 |
| Distribution Papier Carton | 303 |
| Entreprise sans CCN | 174 |
| Fabrication de l'ameublement | 137 |
| Fabrication produits pharma/parapharma/vétérinaire | 164 |
| Fabrication mécanique du verre | 157 |
| Habillement | 149 |
| Industrie et services nautiques | 166 |
| Industrie papier carton | 162 |
| Industrie pharmaceutique | 165 |
| Industries céramiques | 156 |
| Industries des panneaux à base de bois | 140 |
| Industries électriques et gazières | 144 |
| Jeux, jouets et puériculture | 138 |
| Maroquinerie | 151 |
| Menuiseries, charpentes, constructions industrialisées | 139 |
| Métallurgie | 160 |
| Pétrole | 163 |
| Plasturgie et composites | 167 |
| Recyclage et Réemploi | 161 |
| Services d'efficacité énergétique | 143 |
| Textile | 152 |
| Tuiles et briques | 159 |

**paramVal** : 289 = TPE (<50 sal)

**URL pattern iframe** : `https://www.opco2i.fr/dispositif/{slug-dispositif}/?iframe=1&brancheVal={id}&paramVal=289&index={n}`

## Autres dispositifs identifiés

| Dispositif | Nature |
|-----------|--------|
| Contrat de professionnalisation | Grille NPEC par branche (Métallurgie : grille complexe avec majorations) |
| Apprentissage | Grille NPEC OPCO 2i |
| Période de reconversion | Remplace Pro-A, RNCP requis |
| Actions Clés en Main | Catalogue de formations collectives pré-négociées par branche |
| Déployer le digital | Autodiagnostic + accompagnement transformation numérique |

## Signaux commerciaux pour OF tiers

1. **Plafond horaire métiers à 30€/h** — bien au-dessus de certains OPCO, permet des formations qualitatives
2. **4 800€/an TPE** — limite modeste mais 30 branches = marché large
3. **Bonus versement volontaire** — incite les entreprises à dépasser la contribution légale
4. **Actions collectives** ("Actions Clés en Main") — opportunité de conventionnement branche
5. **Numérique/digital** — "Déployer le digital" = point d'entrée possible pour les OF numériques

## Particularités à signaler

- Critères PDC **transversaux** à toutes les branches pour les TPE — pas de différenciation par branche sur le PDC
- La **Métallurgie** (brancheVal=160) est la plus grande branche OPCO 2i (CCN unifiée 2022, IDCC 3127) — contrat pro avec grille NPEC complexe et majorations spécifiques
- Critères par branche accessibles uniquement via les iframes (pas en HTML statique) — nécessite de connaître le `brancheVal`
- **≥50 sal** : aucun fonds mutualisé PDC — financement uniquement sur contributions volontaires

## Sources officielles

Toutes les données de cette page proviennent des publications officielles de OPCO 2i, vérifiées à la date indiquée.

- [https://www.opco2i.fr/formation-et-financement/les-regles-de-prise-en-charge/](https://www.opco2i.fr/formation-et-financement/les-regles-de-prise-en-charge/) (consulté le 2026-05-18)
- [https://www.opco2i.fr/wp-json/wp/v2/branche?per_page=50&_fields=id,name,slug](https://www.opco2i.fr/wp-json/wp/v2/branche?per_page=50&_fields=id,name,slug) (consulté le 2026-05-18)
- [https://www.opco2i.fr/dispositif/plan-de-developpement-des-competences-des-entreprises/?iframe=1&brancheVal=160&paramVal=289&index=5](https://www.opco2i.fr/dispositif/plan-de-developpement-des-competences-des-entreprises/?iframe=1&brancheVal=160&paramVal=289&index=5) (consulté le 2026-05-18)

Notre simulateur identifie automatiquement votre rattachement à OPCO 2i depuis votre raison sociale ou votre numéro SIREN. Aucune connaissance préalable de votre IDCC n'est requise. Le calcul prend 30 secondes et reste sans engagement.

[**Lancer le simulateur OPCO 2026 →**](/simulateur-opco/)
