---
title: OPCO EP 2026 — Budget formation, dispositifs et conventions
description: OPCO EP finance la formation des salariés des secteurs entreprises de proximité — artisanat, professions libérales, services. Dispositifs activables 2026 (PDC, Période de reconversion, AFEST, abondement CPF), branches co
date: 2026-05-23
lastmod: '2026-05-26'
layout: opco-fiche
robots: index, follow
canonical: /simulateur-opco/ep/
ogImage: /assets/images/logo-agence-sauvage.svg
opco_slug: ep
opco_nom_court: OPCO EP
opco_label: OPCO EP
opco_nom_officiel: OPCO EP — Opco des Entreprises de Proximité
opco_url_racine: https://www.opcoep.fr/
opco_url_criteres: https://www.opcoep.fr/criteres-de-financement
opco_nb_idcc: 54
opco_audience: entreprises de proximité — artisanat, professions libérales, services
opco_annee: 2026
opco_date_maj: 2026-05-18
keywords:
- OPCO EP 2026
- budget formation OPCO EP
- simulateur OPCO EP
- convention collective OPCO EP
- financement formation entreprises de proximité — artisanat
faq:
- question: Quelles entreprises sont rattachées à OPCO EP ?
  answer: L'OPCO EP couvre les entreprises dont la convention collective figure parmi les 54 branches couvertes (entreprises de proximité — artisanat, professions libérales, services). Le rattachement est automatique selon l'IDCC de votre convention. Si vous ne le connaissez pas, notre <a href="/simulateur-opco/">simulateur identifie automatiquement votre OPCO</a> depuis votre raison sociale ou votre SIREN.
- question: Quels prérequis pour financer une formation via OPCO EP ?
  answer: 'Trois prérequis : (1) votre entreprise doit être à jour de sa contribution formation professionnelle (CFP) versée à l''URSSAF, (2) l''organisme de formation doit être <a href="https://travail-emploi.gouv.fr/qualiopi-marque-de-certification-qualite-des-prestataires-de-formation" rel="noopener" target="_blank">certifié Qualiopi</a> (obligatoire depuis le 1er janvier 2022), et (3) la demande de financement doit être déposée <strong>avant le démarrage de la formation</strong> (pas de prise en charge rétroactive).'
- question: Le dispositif Pro-A est-il encore disponible chez OPCO EP ?
  answer: 'Non. La loi du 24 octobre 2025 a remplacé Pro-A par la <strong>Période de reconversion</strong> depuis le 1er janvier 2026. OPCO EP a basculé ses critères vers ce nouveau dispositif. Les exigences restent comparables : alternance, certification RNCP ou CQP obligatoire, tuteur identifié dans l''entreprise.'
dispositifs_2026:
- nom: Plan de Développement des Compétences (PDC)
  statut: eligible
  note: 'Cibles : moins-11, 11-49, 50-299'
- nom: Contrat de professionnalisation
  statut: eligible
  note: 'Forfait horaire : 9.15€/h'
- nom: Période de reconversion
  statut: eligible
  note: Remplace Pro-A depuis le 1er janvier 2026 — certification RNCP, CQP requise
- nom: FNE-Formation
  statut: a-verifier
  note: Instruit par l'OPCO
- nom: POEC (Préparation Opérationnelle à l'Emploi Collective)
  statut: a-verifier
  note: —
- nom: Abondement CPF par l'OPCO
  statut: a-verifier
  note: —
branches_idcc:
- nom: Immobilier
  idcc: 1527
  slug: ep-immobilier-1527
- nom: Professions libérales
- nom: Artisanat alimentaire
  idcc: 843
- nom: Services aux particuliers
- nom: 30+ autres branches de proximité
---

L'OPCO EP (Entreprises de Proximité) finance la formation professionnelle des salariés de **l'artisanat, des professions libérales et des services de proximité**. Il couvre 54 branches — pharmacie, coiffure, boulangerie, automobile, fleuristerie, professions juridiques, professions de santé libérales, etc. Si votre entreprise relève de l'une de ces conventions, votre budget formation 2026 est mobilisable via les dispositifs ci-dessous.

{{< opco-kpi >}}

{{< opco-dispositifs >}}

{{< opco-branches >}}

## Analyse détaillée — OPCO EP en 2026

Cette section restitue notre analyse complète des critères de financement publiés officiellement par OPCO EP. Données factuelles, sourcées et mises à jour régulièrement.

## Identité et positionnement

**OPCO EP** (Entreprises de Proximité) est l'OPCO des services aux particuliers et des professions libérales. Il couvre **54 branches** très hétérogènes — des plus petites TPE (coiffeur solo, boulanger artisan) aux cabinets libéraux et agences immobilières.

Le périmètre EP est **le plus large en nombre de branches** de tous les 11 OPCO. Ses adhérents sont quasi-exclusivement des TPME — c'est structurellement la cible idéale pour le PDC OPCO.

## Architecture technique des critères

EP utilise une architecture **?branche=NNN** sur `/criteres-de-financement` — chaque branche a un numéro interne qui n'est pas l'IDCC. Le mapping NNN → IDCC doit être construit branche par branche (l'IDCC apparaît dans le contenu de chaque page branche).

- 53+ branches identifiées
- Exemple : Immobilier = `?branche=187` → IDCC 1527
- Mise à jour des critères par branche (ex : Immobilier MAJ 08/04/2026)

## Dispositifs transversaux

### Plan de développement des compétences

EP se distingue par une **grille multi-niveaux** de barèmes horaires selon le type de formation — contrairement aux autres OPCO qui ont un taux unique :

| Type d'action | Barème horaire (ex. Immobilier) |
|---|---|
| Formations obligatoires/réglementaires | 40 € HT/h |
| Formations cœur de métier | 30 € HT/h |
| Formations transverses/socles | 25 € HT/h |
| Développement hors plafond (VAE, bilan…) | 9,15 € HT/h |

**Important** : EP ne prend en charge **ni les frais de salaires ni les frais annexes** dans le PDC — uniquement les coûts pédagogiques.

### Catalogue Sélexion (catalogue captif)

**Sélexion** est le catalogue de formations sélectionnées par EP — modèle similaire à campusAtlas.
- **<50 sal** : prise en charge à **100%** des coûts pédagogiques
- **50 sal et +** : prise en charge à **50%**
- Accessible uniquement aux formations du catalogue Sélexion (`acces_of_tiers: false` sur ce dispositif)

Opportunité commerciale : les OF **non référencés dans Sélexion** passent par le PDC standard (plafonds annuels) — Sélexion n'est pas un obstacle si le produit n'est pas dans le catalogue.

### FSE+ (Fonds Social Européen)

EP est l'un des rares OPCO à proposer un **co-financement FSE+** significatif :
- **<50 sal** : jusqu'à **100% des coûts pédagogiques** (50% FSE + 50% fonds propres EP). Plafond : 350€/j/stagiaire, 2 500€/groupe/jour. Forfait rémunération : **12€/h/stagiaire**.
- **50 sal et +** : 50% coûts péda (175€/stag/j, 1 250€/groupe/j, 150 000€/entreprise)

Le FSE+ peut **doubler le financement** d'une action de formation éligible pour les petites structures. À cibler sur les formations numériques/IA si elles entrent dans les axes FSE+ prioritaires.

### AFEST

EP prend en charge l'AFEST avec un forfait spécifique (hors plafond conventionnel) :
- **Sans prestataire externe** : 420 € HT / stagiaire
- **Avec prestataire externe** : 2 400 € HT (fixe) + 420 € HT / salarié formé

Ce mécanisme est hors plafond annuel PDC — identique sur toutes les branches EP (à confirmer branche par branche).

### Tutorat

EP a une durée de formation tuteur plus longue que les autres OPCO :
- Formation tuteur/maître d'apprentissage : **40h max** à 15€/h (vs 21h Atlas/TP, 14h Négoce)
- Aide tutorale ContratPro : 230€/mois × 6 mois (345€ si tuteur ≥45 ans ou public prioritaire)
- Aide maître d'apprentissage : mêmes montants

## Signaux commerciaux pour OF tiers

1. **FSE+ <50 sal** : financement jusqu'à 100% — argument commercial puissant pour les TPE EP (boulangerie, coiffure, immobilier)
2. **PDC formations réglementaires/métier** : 40€/h (le taux le plus élevé du projet) — favorable pour les formations certifiantes obligatoires
3. **Catalogue Sélexion non concurrent** si la formation n'y est pas inscrite — passer par PDC standard
4. **FSE+ forfait rémunération 12€/h** : compense l'absence de prise en charge salaires PDC

## Particularités à signaler

EP met à jour ses critères **branche par branche** (ex: Immobilier MAJ 08/04/2026). Les barèmes peuvent varier entre branches — ne jamais inférer d'une branche à l'autre sans vérifier la source de chaque branche.

## Sources officielles

Toutes les données de cette page proviennent des publications officielles de OPCO EP, vérifiées à la date indiquée.

- [https://www.opcoep.fr/criteres-de-financement?branche=187](https://www.opcoep.fr/criteres-de-financement?branche=187) (consulté le 2026-05-18)

Notre simulateur identifie automatiquement votre rattachement à OPCO EP depuis votre raison sociale ou votre numéro SIREN. Aucune connaissance préalable de votre IDCC n'est requise. Le calcul prend 30 secondes et reste sans engagement.

[**Lancer le simulateur OPCO 2026 →**](/simulateur-opco/)
