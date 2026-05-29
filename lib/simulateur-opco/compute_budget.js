// @ts-check
/**
 * compute_budget.js — Moteur de calcul du budget du simulateur OPCO.
 *
 * Source de vérité unique : calcule le budget formation pour tout
 * (idcc, tefen_code, naf_fallback_slug). QA de référence :
 * scripts/qa-simulator-delivery.mjs et tests/simulateur-opco/test-compute-units.mjs.
 *
 * Conformité : consensus dual-LLM S2 (2026-05-23). Idiomes JS-safe (?. et ??),
 * null explicite jamais undefined, tri des dispositifs avant retour.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

const DEFAULT_SIMULATOR_PATH = path.join(PROJECT_ROOT, "data", "generated", "simulator-ready.json");
const DEFAULT_METADATA_PATH = path.join(PROJECT_ROOT, "data", "generated", "metadata.json");

// ========== TYPES (JSDoc) ==========

/**
 * @typedef {Object} Tranche
 * @property {number|null} effectif_min
 * @property {number|null} effectif_max
 * @property {number|null} plancher_garanti_eur
 * @property {number|null} plafond_horaire_eur
 * @property {number|null} plafond_par_dossier_eur
 * @property {string|null} formule_max_lisible
 */

/**
 * @typedef {Object} DispositifActive
 * @property {string} cle
 * @property {string} libelle
 * @property {string|null} type_fonds
 * @property {number|null} plancher_garanti_eur
 * @property {number|null} plafond_par_dossier_eur
 * @property {string|null} formule_max_lisible
 * @property {boolean} inclus_dans_budget_chiffre
 * @property {boolean|null} acces_of_tiers
 */

/**
 * @typedef {Object} BudgetResult
 * @property {number|null} budget_min_eur
 * @property {number|null} budget_max_eur
 * @property {boolean} budget_chiffrable
 * @property {boolean} budget_partiel
 * @property {number|null} taux_horaire_max_eur
 * @property {string|null} opco_slug
 * @property {string|null} opco_nom
 * @property {string|null} branche_slug
 * @property {string|null} branche_nom
 * @property {boolean} branche_idcc_a_confirmer
 * @property {string|null} provenance_budget
 * @property {Tranche|null} tranche_appliquee
 * @property {boolean} effectif_incertain
 * @property {DispositifActive[]} dispositifs_actives
 * @property {string[]} warnings
 * @property {string|null} cas_particulier
 * @property {string|null} message_cas_particulier
 * @property {string} version_regles
 * @property {string} source_idcc
 * @property {Object<string, *>} inputs_snapshot
 * @property {string|null} content_hash_sha256
 */

// ========== CONSTANTES ==========

const FORMULA_INDICATORS = [
  "200%", "100%", "150%", "300%",
  "% de la contribution", "% de la masse salariale",
  "fonction de", "selon les fonds", "dans la limite des fonds",
  "contribution conventionnelle nette",
];

const CAS_PARTICULIER_MESSAGES = {
  effectif_non_renseigne:
    "L'effectif de votre entreprise n'a pas pu être récupéré automatiquement. " +
    "Indiquez votre tranche de salariés manuellement pour obtenir une estimation.",
  dirigeant_tns_sans_salarie:
    "Vous semblez être travailleur non-salarié ou dirigeant sans salarié. " +
    "Votre financement formation passe en général par un FAF (FIFPL, AGEFICE, FAFCEA…) " +
    "plutôt que par votre OPCO. Contactez-nous pour une orientation personnalisée.",
  idcc_inconnu:
    "Votre convention collective n'a pas été identifiée automatiquement. " +
    "Sélectionnez-la manuellement ou contactez-nous pour une simulation sur mesure.",
  branche_a_confirmer:
    "Nous avons identifié votre OPCO de rattachement mais les détails de plafond " +
    "pour votre convention spécifique ne sont pas encore dans notre base. " +
    "Contactez-nous pour une simulation précise.",
  effectif_hors_tranches:
    "La taille de votre entreprise dépasse les tranches standard couvertes par notre " +
    "simulateur. Pour les grandes entreprises, un audit dédié est nécessaire.",
};

// ========== LOADERS ==========

/** @returns {Object<string, *>} */
export function loadSimulatorData(filePath = DEFAULT_SIMULATOR_PATH) {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

/** @returns {Object<string, *>} */
export function loadMetadata(filePath = DEFAULT_METADATA_PATH) {
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return {};
  }
}

// ========== HELPERS PRIVÉS (exportés pour parité tests) ==========

/**
 * Détecte si une note contient une formule conditionnelle, sinon null.
 * @param {string|null|undefined} note
 * @returns {string|null}
 */
export function _detectFormule(note) {
  if (note === null || note === undefined || note === "") return null;
  const lower = note.toLowerCase();
  const found = FORMULA_INDICATORS.some((ind) => lower.includes(ind.toLowerCase()));
  return found ? note.trim() : null;
}

/**
 * Extrait un plancher numérique d'une formule lisible.
 * @param {string} note
 * @returns {number|null}
 */
export function _extractPlancherFromNote(note) {
  // Pattern "plancher X €" (priorité)
  const m1 = note.match(/plancher\s+(?:de\s+)?(\d{1,2})[\s ]?(\d{3})/i);
  if (m1) return parseInt(m1[1] + m1[2], 10);
  // Pattern "X € HT" fallback
  const m2 = note.match(/(\d{1,2})[\s ]?(\d{3})\s*€\s*HT/i);
  if (m2) return parseInt(m2[1] + m2[2], 10);
  return null;
}

/**
 * Calcule le chevauchement (nb d'entiers) entre une tranche OPCO et le range TEFEN.
 * @param {{effectif_min: number, effectif_max: number|null}} tranche
 * @param {number} tefenMin
 * @param {number|null} tefenMax
 * @returns {number}
 */
export function _trancheOverlap(tranche, tefenMin, tefenMax) {
  const tMin = tranche.effectif_min;
  let tMax = tranche.effectif_max;
  if (tMax === null && tefenMax === null) return 1;
  if (tMax === null) tMax = tefenMax;
  if (tefenMax === null) tefenMax = tMax;
  const lo = Math.max(tMin, tefenMin);
  const hi = Math.min(/** @type {number} */ (tMax), /** @type {number} */ (tefenMax));
  return Math.max(0, hi - lo + 1);
}

/**
 * Sélectionne la tranche OPCO avec le plus grand chevauchement du range TEFEN.
 * @param {Array<*>} tranches
 * @param {{effectif_estime_min: number|null, effectif_estime_max: number|null}} tefenInfo
 * @returns {{tranche: Object|null, effectifIncertain: boolean}}
 */
export function _selectTranche(tranches, tefenInfo) {
  const tefenMin = tefenInfo?.effectif_estime_min ?? null;
  const tefenMax = tefenInfo?.effectif_estime_max ?? null;
  if (tefenMin === null) return { tranche: null, effectifIncertain: false };
  if (!Array.isArray(tranches) || tranches.length === 0) return { tranche: null, effectifIncertain: false };

  const sorted = [...tranches].sort((a, b) => a.effectif_min - b.effectif_min);
  const scored = sorted
    .map((t) => ({ t, s: _trancheOverlap(t, tefenMin, tefenMax) }))
    .filter((x) => x.s > 0);
  if (scored.length === 0) return { tranche: null, effectifIncertain: false };

  scored.sort((a, b) => b.s - a.s);
  const best = scored[0];
  const overlapAtMin = _trancheOverlap(best.t, tefenMin, tefenMin);
  const effectifIncertain = scored.length > 1 && best.s !== overlapAtMin;
  return { tranche: best.t, effectifIncertain };
}

/**
 * Convertit une tranche source en tranche simulator-ready (consommée telle quelle ici,
 * car simulator-ready.json est déjà au bon format). Retourne en fait la tranche enrichie
 * d'un plancher extrait depuis la formule si non chiffré.
 * Note: dans simulator-ready.json le compactage est déjà fait par build_simulator_data.py.
 * Cette fonction sert juste de helper si on devait reparser.
 * @param {Object} t
 * @returns {Tranche}
 */
export function _compactTranche(t) {
  let plafond = t?.plancher_garanti_eur ?? null;
  const note = t?.formule_max_lisible ?? null;
  if (plafond === null && note !== null) {
    plafond = _extractPlancherFromNote(note);
  }
  return {
    effectif_min: t?.effectif_min ?? null,
    effectif_max: t?.effectif_max ?? null,
    plancher_garanti_eur: plafond !== null ? Math.trunc(plafond) : null,
    plafond_horaire_eur: t?.plafond_horaire_eur ?? null,
    plafond_par_dossier_eur: t?.plafond_par_dossier_eur ?? null,
    formule_max_lisible: note,
  };
}

/**
 * Pour un dispositif (AFEST, parcours, etc.), retourne (DispositifActive, tranche matchée).
 * @param {string} cle
 * @param {string} libelle
 * @param {Object|null|undefined} disp
 * @param {Object} tefenInfo
 * @param {boolean} inclusDansBudget
 * @returns {{active: DispositifActive|null, tranche: Object|null}}
 */
export function _extractDispositifSimple(cle, libelle, disp, tefenInfo, inclusDansBudget) {
  if (!disp || !disp.eligible) return { active: null, tranche: null };
  const tranches = disp.tranches ?? [];
  const { tranche } = _selectTranche(tranches, tefenInfo);
  if (tranche === null && tranches.length > 0) return { active: null, tranche: null };
  const plancher = tranche?.plancher_garanti_eur ?? null;
  const formule = tranche?.formule_max_lisible ?? null;
  /** @type {DispositifActive} */
  const active = {
    cle,
    libelle,
    type_fonds: disp?.type_fonds ?? null,
    plancher_garanti_eur: plancher,
    plafond_par_dossier_eur: tranche?.plafond_par_dossier_eur ?? null,
    formule_max_lisible: formule,
    inclus_dans_budget_chiffre: inclusDansBudget,
    acces_of_tiers: disp?.acces_of_tiers ?? null,
  };
  return { active, tranche };
}

/**
 * Extrait les bonus thématiques cumulables avec PDC, matching la tranche.
 * @param {Array<*>} bonusList
 * @param {Object} tefenInfo
 * @returns {DispositifActive[]}
 */
export function _extractBonus(bonusList, tefenInfo) {
  /** @type {DispositifActive[]} */
  const actifs = [];
  const list = bonusList ?? [];
  for (let i = 0; i < list.length; i++) {
    const b = list[i];
    if (!b?.cumulable_avec_pdc) continue;
    const tranches = b?.tranches ?? [];
    const { tranche } = _selectTranche(tranches, tefenInfo);
    if (tranche === null) continue;
    actifs.push({
      cle: `bonus_thematiques[${i}]`,
      libelle: b?.libelle ?? b?.thematique ?? "Bonus thématique",
      type_fonds: b?.type_fonds ?? null,
      plancher_garanti_eur: tranche?.plancher_garanti_eur ?? null,
      plafond_par_dossier_eur: tranche?.plafond_par_dossier_eur ?? null,
      formule_max_lisible: tranche?.formule_max_lisible ?? null,
      inclus_dans_budget_chiffre: true,
      acces_of_tiers: b?.acces_of_tiers ?? null,
    });
  }
  return actifs;
}

/**
 * Montant chiffré d'un dispositif pour le budget MAX. On retient le plancher
 * garanti s'il existe, sinon le plafond par dossier (plafond réel du barème,
 * ex. AFEST/bonus BTP encodés en €/dossier sans plancher annuel). Ce dernier
 * est un PLAFOND, jamais un plancher : il n'alimente donc que le max, pas le min.
 * @param {DispositifActive} d
 * @returns {number|null}
 */
export function _montantMaxDispositif(d) {
  if (d.plancher_garanti_eur !== null) return d.plancher_garanti_eur;
  return d.plafond_par_dossier_eur ?? null;
}

/**
 * Somme des montants chiffrables. Par défaut ne somme que les planchers garantis
 * (pour le budget min, montant plancher). Avec `useDossierFallback`, retombe sur
 * le plafond par dossier quand le plancher est absent (pour le budget max).
 * Retourne null si aucun montant chiffrable.
 * @param {DispositifActive[]} items
 * @param {boolean} inclusOnly
 * @param {boolean} useDossierFallback
 * @returns {number|null}
 */
export function _sumPlanchers(items, inclusOnly = true, useDossierFallback = false) {
  const filtered = items
    .filter((d) => !inclusOnly || d.inclus_dans_budget_chiffre)
    .map((d) => (useDossierFallback ? _montantMaxDispositif(d) : d.plancher_garanti_eur))
    .filter((v) => v !== null)
    .map((v) => /** @type {number} */ (v));
  if (filtered.length === 0) return null;
  return filtered.reduce((a, b) => a + b, 0);
}

/**
 * Construit la liste des dispositifs actifs + tranche PDC appliquée + taux horaire.
 * @param {Object} entry
 * @param {Object} tefenInfo
 * @returns {{dispositifs: DispositifActive[], pdcTranche: Object|null, tauxHoraire: number|null}}
 */
export function _buildDispositifsForEntry(entry, tefenInfo) {
  const regles = entry?.regles ?? {};
  /** @type {DispositifActive[]} */
  const dispositifs = [];

  // PDC
  const pdc = regles?.pdc;
  /** @type {Object|null} */
  let pdcTranche = null;
  /** @type {number|null} */
  let tauxHoraire = null;
  if (pdc?.eligible && Array.isArray(pdc?.tranches) && pdc.tranches.length > 0) {
    const { tranche } = _selectTranche(pdc.tranches, tefenInfo);
    if (tranche !== null) {
      pdcTranche = tranche;
      tauxHoraire = tranche?.plafond_horaire_eur ?? null;
      dispositifs.push({
        cle: "pdc",
        libelle: "Plan de développement des compétences",
        type_fonds: pdc?.type_fonds ?? null,
        plancher_garanti_eur: tranche?.plancher_garanti_eur ?? null,
        plafond_par_dossier_eur: tranche?.plafond_par_dossier_eur ?? null,
        formule_max_lisible: tranche?.formule_max_lisible ?? null,
        inclus_dans_budget_chiffre: true,
        acces_of_tiers: pdc?.acces_of_tiers ?? null,
      });
    }
  }

  // AFEST
  const afestRes = _extractDispositifSimple(
    "afest",
    "AFEST — Action de formation en situation de travail",
    regles?.afest,
    tefenInfo,
    true,
  );
  if (afestRes.active) dispositifs.push(afestRes.active);

  // Bonus thématiques
  dispositifs.push(..._extractBonus(regles?.bonus_thematiques, tefenInfo));

  // Parcours stratégique
  const parcoursRes = _extractDispositifSimple(
    "parcours_strategique",
    "Parcours stratégique TPE/PME",
    regles?.parcours_strategique,
    tefenInfo,
    true,
  );
  if (parcoursRes.active) dispositifs.push(parcoursRes.active);

  // VAE (upsell, hors chiffre)
  const vaeRes = _extractDispositifSimple(
    "vae",
    "VAE — Validation des acquis de l'expérience",
    regles?.vae,
    tefenInfo,
    false,
  );
  if (vaeRes.active) dispositifs.push(vaeRes.active);

  // FNE-Formation (upsell binaire)
  const fne = regles?.fne_formation ?? {};
  if (fne?.instruit_par_opco) {
    dispositifs.push({
      cle: "fne_formation",
      libelle: "FNE-Formation (instruit par votre OPCO)",
      type_fonds: null,
      plancher_garanti_eur: null,
      plafond_par_dossier_eur: null,
      formule_max_lisible:
        "Dispositif sur axes prioritaires État, montant non plafonné mais soumis à accord. Hors du calcul de budget chiffré.",
      inclus_dans_budget_chiffre: false,
      acces_of_tiers: null,
    });
  }

  return { dispositifs, pdcTranche, tauxHoraire };
}

/**
 * Construit un BudgetResult vide pour un cas particulier.
 * @param {string} cas
 * @param {Object} inputs
 * @param {string} version
 * @param {{opco_slug?: string|null, opco_nom?: string|null, branche_slug?: string|null, branche_nom?: string|null, branche_idcc_a_confirmer?: boolean, contentHash?: string|null}} [extras]
 * @returns {BudgetResult}
 */
function _makeEmptyResult(cas, inputs, version, extras = {}) {
  return {
    budget_min_eur: null,
    budget_max_eur: null,
    budget_chiffrable: false,
    budget_partiel: false,
    taux_horaire_max_eur: null,
    opco_slug: extras.opco_slug ?? null,
    opco_nom: extras.opco_nom ?? null,
    branche_slug: extras.branche_slug ?? null,
    branche_nom: extras.branche_nom ?? null,
    branche_idcc_a_confirmer: extras.branche_idcc_a_confirmer ?? false,
    provenance_budget: null,
    tranche_appliquee: null,
    effectif_incertain: false,
    dispositifs_actives: [],
    warnings: [],
    cas_particulier: cas,
    message_cas_particulier: CAS_PARTICULIER_MESSAGES[/** @type {keyof typeof CAS_PARTICULIER_MESSAGES} */ (cas)] ?? null,
    version_regles: version,
    source_idcc: inputs?.source_idcc ?? "test",
    inputs_snapshot: inputs,
    content_hash_sha256: extras.contentHash ?? null,
  };
}

// ========== POINT D'ENTRÉE PRINCIPAL ==========

/**
 * Calcule le budget formation OPCO.
 *
 * @param {Object} args
 * @param {number|null} args.idcc
 * @param {string} args.tefen_code
 * @param {string} [args.source_idcc]
 * @param {string|null} [args.naf_fallback_slug]
 * @param {Object|null} [args.simulator_data]
 * @param {Object|null} [args.metadata]
 * @returns {BudgetResult}
 */
export function computeBudget({
  idcc,
  tefen_code,
  source_idcc = "dinum",
  naf_fallback_slug = null,
  simulator_data = null,
  metadata = null,
}) {
  const simData = simulator_data ?? loadSimulatorData();
  const meta = metadata ?? loadMetadata();

  const version = simData?.schema_version ?? "?";
  const contentHash = meta?.content_hash_sha256 ?? null;
  const inputsSnapshot = {
    idcc,
    tefen_code,
    source_idcc,
    naf_fallback_slug,
  };

  // --- Cas particuliers TEFEN ---
  if (tefen_code === "NN") {
    return _makeEmptyResult("effectif_non_renseigne", inputsSnapshot, version, { contentHash });
  }
  if (tefen_code === "00") {
    return _makeEmptyResult("dirigeant_tns_sans_salarie", inputsSnapshot, version, { contentHash });
  }

  const tefenTable = simData?.tefen_to_tranche_opco ?? {};
  const tefenInfo = tefenTable[tefen_code];
  if (!tefenInfo || tefenInfo?.effectif_estime_min === null || tefenInfo?.effectif_estime_min === undefined) {
    return _makeEmptyResult("effectif_non_renseigne", inputsSnapshot, version, { contentHash });
  }

  // --- Résolution entry (idcc_index ou naf_fallback_index) ---
  /** @type {Object|null} */
  let entry = null;
  if (idcc !== null && idcc !== undefined) {
    entry = simData?.idcc_index?.[String(idcc)] ?? null;
  }
  if (entry === null && naf_fallback_slug) {
    entry = simData?.naf_fallback_index?.[naf_fallback_slug] ?? null;
  }
  if (entry === null) {
    return _makeEmptyResult("idcc_inconnu", inputsSnapshot, version, { contentHash });
  }

  // --- Branche sans détail chiffré ---
  if (entry?.provenance_budget === "OPCO_TRANSVERSAL_SANS_DETAIL_BRANCHE") {
    return _makeEmptyResult("branche_a_confirmer", inputsSnapshot, version, {
      opco_slug: entry?.opco_slug ?? null,
      opco_nom: entry?.opco_nom ?? null,
      branche_slug: entry?.branche_slug ?? null,
      branche_nom: entry?.branche_nom ?? null,
      branche_idcc_a_confirmer: entry?.branche_idcc_a_confirmer ?? false,
      contentHash,
    });
  }

  // --- Extraction dispositifs ---
  const { dispositifs, pdcTranche, tauxHoraire } = _buildDispositifsForEntry(entry, tefenInfo);

  if (pdcTranche === null) {
    return _makeEmptyResult("effectif_hors_tranches", inputsSnapshot, version, {
      opco_slug: entry?.opco_slug ?? null,
      opco_nom: entry?.opco_nom ?? null,
      branche_slug: entry?.branche_slug ?? null,
      branche_nom: entry?.branche_nom ?? null,
      contentHash,
    });
  }

  // --- effectif_incertain (overlap multi-tranches sur PDC) ---
  const pdcTranches = entry?.regles?.pdc?.tranches ?? [];
  const { effectifIncertain } = _selectTranche(pdcTranches, tefenInfo);

  // --- Calcul min/max ---
  const itemsMin = dispositifs.filter(
    (d) => (d.cle === "pdc" || d.cle === "afest") && d.inclus_dans_budget_chiffre,
  );
  const budgetMin = _sumPlanchers(itemsMin, true);
  const itemsMax = dispositifs.filter((d) => d.inclus_dans_budget_chiffre);
  const budgetMax = _sumPlanchers(itemsMax, true, true);

  // Le budget chiffré provient (en partie) de plafonds par dossier alors que le
  // PDC de la branche est plafonné à l'heure (aucun plancher ni plafond annuel
  // exploitable) : l'enveloppe PDC n'est donc pas quantifiée dans le chiffre.
  const pdcHoraireSeul =
    pdcTranche !== null &&
    (pdcTranche?.plancher_garanti_eur ?? null) === null &&
    (pdcTranche?.plafond_par_dossier_eur ?? null) === null &&
    tauxHoraire !== null;
  const maxIssuDeDossier = itemsMax.some(
    (d) => d.plancher_garanti_eur === null && (d.plafond_par_dossier_eur ?? null) !== null,
  );

  const budgetChiffrable = budgetMin !== null || budgetMax !== null;
  const provenance = entry?.provenance_budget ?? null;
  const budgetPartiel = provenance === "CUMUL_OPCO_BRANCHE";

  // --- Warnings ---
  /** @type {string[]} */
  const warnings = [];
  if (effectifIncertain) {
    warnings.push(
      `Votre tranche d'effectif (code INSEE ${tefen_code}) chevauche plusieurs ranges OPCO. ` +
        "L'estimation retient la tranche qui couvre statistiquement la majorité du range. " +
        "Précisez votre effectif exact pour un calcul ajusté.",
    );
  }
  if (budgetPartiel) {
    warnings.push(
      "Ce montant correspond au fonds conventionnel de votre branche. " +
        `Il s'ajoute au PDC standard ${entry?.opco_nom} (non inclus dans ce calcul faute de ` +
        "données structurées exploitables). Pour le budget total, contactez-nous.",
    );
  }
  if (pdcHoraireSeul && maxIssuDeDossier && budgetChiffrable) {
    warnings.push(
      "Ce montant cumule les plafonds par dossier (AFEST, bonus thématiques) auxquels " +
        "votre entreprise peut prétendre. Le plan de développement des compétences de votre " +
        `branche est financé à l'heure (${tauxHoraire} € HT/h) selon le volume de formation : ` +
        "il n'est pas chiffré ici. Contactez-nous pour estimer le budget total.",
    );
  }
  if (entry?.branche_idcc_a_confirmer) {
    warnings.push(
      "Votre rattachement OPCO est confirmé, mais la convention collective exacte reste à valider. " +
        "Le calcul utilise les règles de la branche la plus probable selon votre activité.",
    );
  }

  // Tri déterministe pour parité cross-langage avec Python (qui conserve l'ordre d'insertion).
  // En Python l'ordre dépend de la séquence d'insertion ci-dessus ; on conserve donc le même
  // ordre côté JS (insertion order préservé). Aucun tri lexicographique appliqué : si on
  // triait, on divergerait du Python. Le tri éventuel se fait côté UI.
  // (Garde-fou : assertion d'ordre déterministe assurée par les helpers ci-dessus qui
  // poussent toujours dans le même ordre PDC → AFEST → bonus → parcours → VAE → FNE.)

  /** @type {BudgetResult} */
  const result = {
    budget_min_eur: budgetMin,
    budget_max_eur: budgetMax,
    budget_chiffrable: budgetChiffrable,
    budget_partiel: budgetPartiel,
    taux_horaire_max_eur: tauxHoraire,
    opco_slug: entry?.opco_slug ?? null,
    opco_nom: entry?.opco_nom ?? null,
    branche_slug: entry?.branche_slug ?? null,
    branche_nom: entry?.branche_nom ?? null,
    branche_idcc_a_confirmer: entry?.branche_idcc_a_confirmer ?? false,
    provenance_budget: provenance,
    tranche_appliquee: /** @type {Tranche} */ (pdcTranche),
    effectif_incertain: effectifIncertain,
    dispositifs_actives: dispositifs,
    warnings,
    cas_particulier: null,
    message_cas_particulier: null,
    version_regles: version,
    source_idcc,
    inputs_snapshot: inputsSnapshot,
    content_hash_sha256: contentHash,
  };

  return result;
}

/**
 * Sérialisation JSON stable pour stockage Notion + email récap.
 * @param {BudgetResult} result
 * @returns {string}
 */
export function toSnapshotJson(result) {
  return JSON.stringify(result, Object.keys(result).sort(), undefined);
}
