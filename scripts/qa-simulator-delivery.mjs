// QA differentielle livraison simulateur Sprint 2.
// 1. Regression MONTANTS : computeBudget identique (old prod vs nouveau) pour les
//    IDCC existants inchanges, sur une matrice de TEFEN. Les champs d'AFFICHAGE
//    enrichis depuis l'export source (formule_max_lisible, cible_taille_entreprise,
//    majoration_certifiant...) sont retires avant comparaison : on valide les
//    montants, pas la prose. 1000/1996 (enrichis) et 1850/3253 (avocats rattaches)
//    sont des changements attendus, verifies separement (1b/1c).
// 2. Progression : 7 nouveaux IDCC -> pas d'exception, report budget/cas.
// 3. NAF : suggestFromNaf des nouveaux mappings resout dans le bon index.
// Usage : node scripts/qa-simulator-delivery.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { computeBudget } from "../lib/simulateur-opco/compute_budget.js";
import { suggestFromNaf } from "../api/_simulateur/naf-suggestions.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const NEW = JSON.parse(readFileSync(path.join(ROOT, "static/data/simulator-ready.json"), "utf-8"));
const OLD = JSON.parse(readFileSync(path.join(ROOT, ".tmp/old-simulator-ready.json"), "utf-8"));

const TEFENS = ["NN", "00", "01", "03", "11", "12", "21", "32", "53"];
const ENRICHED = new Set(["1000", "1996"]);
const NEW_IDCC = ["787", "1596", "1597", "2104", "2264", "2420", "2609"];
// Progressions voulues hors liste NEW_IDCC : rattachement avocats (commit 5ee2677)
// branche_a_confirmer -> convention chiffrable. Skip en regression, verifie comme progression.
const PROGRESSED = new Set(["1850", "3253"]);
// Champs d'AFFICHAGE enrichis depuis l'export source (libelles, pas montants).
// La regression valide les MONTANTS, pas la prose : on les retire avant comparaison.
const DISPLAY_FIELDS = new Set([
  "formule_max_lisible", "cible_taille_entreprise", "majoration_certifiant",
  "notes_libres", "detail_lisible", "libelle", "explication",
]);
const scrub = (o) => JSON.parse(JSON.stringify(o, (k, v) => (DISPLAY_FIELDS.has(k) ? undefined : v)));

let pass = 0, fail = 0;
const fails = [];
function check(cond, msg) { if (cond) pass++; else { fail++; fails.push(msg); } }

// ---- 1. Regression MONTANTS sur les IDCC existants (champs d'affichage ignores) ----
const oldKeys = Object.keys(OLD.idcc_index);
let regrChecked = 0;
for (const idcc of oldKeys) {
  for (const tefen of TEFENS) {
    let rOld, rNew;
    try { rOld = computeBudget({ idcc: Number(idcc), tefen_code: tefen, simulator_data: OLD }); }
    catch (e) { check(false, `OLD throw idcc=${idcc} tefen=${tefen}: ${e.message}`); continue; }
    try { rNew = computeBudget({ idcc: Number(idcc), tefen_code: tefen, simulator_data: NEW }); }
    catch (e) { check(false, `NEW throw idcc=${idcc} tefen=${tefen}: ${e.message}`); continue; }
    if (ENRICHED.has(idcc) || PROGRESSED.has(idcc)) continue; // change attendu
    const a = JSON.stringify(scrub(rOld)), b = JSON.stringify(scrub(rNew));
    check(a === b, `REGRESSION MONTANT idcc=${idcc} tefen=${tefen}`);
    regrChecked++;
  }
}

// ---- 1b. Enrichis : pas d'exception + budget desormais chiffrable (TEFEN 12 = 20-49 sal) ----
for (const idcc of ENRICHED) {
  const r = computeBudget({ idcc: Number(idcc), tefen_code: "12", simulator_data: NEW });
  check(r && (r.budget_chiffrable || r.cas_particulier == null),
    `ENRICHI idcc=${idcc} : attendu chiffrable, got chiffrable=${r?.budget_chiffrable} cas=${r?.cas_particulier}`);
}

// ---- 1c. Progressions avocats : branche_a_confirmer -> chiffrable ----
for (const idcc of PROGRESSED) {
  const r = computeBudget({ idcc: Number(idcc), tefen_code: "12", simulator_data: NEW });
  check(r && r.budget_chiffrable && r.cas_particulier == null,
    `PROGRESSION idcc=${idcc} : attendu chiffrable sans cas, got chiffrable=${r?.budget_chiffrable} cas=${r?.cas_particulier}`);
}

// ---- 2. Nouveaux IDCC : pas d'exception ----
const newReport = [];
for (const idcc of NEW_IDCC) {
  check(NEW.idcc_index[idcc] != null, `NOUVEAU idcc=${idcc} absent de idcc_index`);
  for (const tefen of TEFENS) {
    try {
      const r = computeBudget({ idcc: Number(idcc), tefen_code: tefen, simulator_data: NEW });
      if (tefen === "12") newReport.push(`  ${idcc} (20-49 sal): chiffrable=${r.budget_chiffrable} max=${r.budget_max_eur} cas=${r.cas_particulier ?? "ok"} nom="${r.branche_nom}"`);
    } catch (e) {
      check(false, `NOUVEAU throw idcc=${idcc} tefen=${tefen}: ${e.message}`);
    }
  }
}

// ---- 3. suggestFromNaf des nouveaux mappings ----
const validIdccs = new Set(Object.keys(NEW.idcc_index).map((k) => Number(k)));
const validBranches = new Set(Object.keys(NEW.naf_fallback_index));
const NAF_CASES = [
  ["69.20Z", "idcc", 787, true],
  ["69.10Z", "idcc", 1000, false],
  ["86.10Z", "idcc", 2264, false],
  ["86.22C", "idcc", 2264, false],
  ["41.10A", "idcc", 1597, false],
  ["43.99C", "idcc", 1597, false],
];
for (const [naf, type, value, auto] of NAF_CASES) {
  const s = suggestFromNaf(naf, validIdccs, validBranches);
  check(s != null, `NAF ${naf} -> null (devrait resoudre)`);
  if (s) {
    check(s.type === type && s.value === value && s.auto === auto,
      `NAF ${naf} -> {type:${s.type},value:${s.value},auto:${s.auto}} attendu {${type},${value},${auto}}`);
    // la cible resout-elle dans une entry calculable ?
    const r = computeBudget({ idcc: type === "idcc" ? value : null, tefen_code: "12",
      naf_fallback_slug: type === "branche" ? value : null, simulator_data: NEW });
    check(r.cas_particulier !== "idcc_inconnu", `NAF ${naf} -> cible ${value} ne resout pas (idcc_inconnu)`);
  }
}
// constructys-tp doit rester un slug naf_fallback resolvable
const tp = suggestFromNaf("42.11Z", validIdccs, validBranches);
check(tp && tp.type === "branche" && tp.value === "constructys-tp", `NAF 42.11Z (TP) devrait rester slug constructys-tp, got ${JSON.stringify(tp)}`);

// ---- Rapport ----
console.log(`\nRegression : ${regrChecked} (idcc x tefen) compares sur l'existant.`);
console.log("Nouveaux IDCC (tranche 20-49 sal) :");
console.log(newReport.join("\n"));
console.log(`\n=== RESULTAT : ${pass} OK / ${fail} FAIL ===`);
if (fail) { console.log("ECHECS:"); fails.slice(0, 40).forEach((f) => console.log("  - " + f)); process.exit(1); }
