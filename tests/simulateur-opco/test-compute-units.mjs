// =============================================================================
// Test harness S4 — unités du compute pipeline (sans Notion/Resend)
// =============================================================================
// Valide chaque pièce composable sans toucher aux side effects (Notion, Resend,
// Plausible). L'intégration handler complète sera validée en Preview Vercel
// (Franck configure NOTION_DATABASE_SIMULATEUR_OPCO + RESEND_API_KEY).
// =============================================================================

import { runCompute, classifyBudget, tefenLabel, confianceNotionLabel, getSchemaVersion } from '../../api/_simulateur/compute-engine.js';
import { validateComputeBody } from '../../api/_simulateur/validators.js';
import { buildLeadPayload } from '../../api/_simulateur/notion-client.js';

let passed = 0;
let failed = 0;

function assert(label, cond, detail = '') {
  const ok = Boolean(cond);
  console.log(`${ok ? '✅' : '❌'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (ok) passed += 1; else failed += 1;
}

function dump(label, obj) {
  console.log(`   ↳ ${label}: ${JSON.stringify(obj)}`);
}

console.log('\n=== S4 unit tests ===\n');

// -------- 1. Schema version
console.log('[1] Schema version chargé ESM');
const version = getSchemaVersion();
assert('schema_version non vide', version && version !== '?', `version=${version}`);

// -------- 2. classifyBudget
console.log('\n[2] classifyBudget — buckets Hot/Warm/Cold/Manual');
assert('budget 5000+ → hot', classifyBudget(5000, null) === 'hot');
assert('budget 4999 → warm', classifyBudget(4999, null) === 'warm');
assert('budget 2000 → warm', classifyBudget(2000, null) === 'warm');
assert('budget 1999 → cold', classifyBudget(1999, null) === 'cold');
assert('budget null → cold', classifyBudget(null, null) === 'cold');
assert('cas particulier → manual', classifyBudget(7000, 'idcc_inconnu') === 'manual');

// -------- 3. tefenLabel + confianceNotionLabel
console.log('\n[3] Mappings labels');
assert('tefen 11 → 10 à 19 salariés', tefenLabel('11') === '10 à 19 salariés');
assert('tefen NN → Non renseigné', tefenLabel('NN') === 'Non renseigné');
assert('tefen invalide → Non renseigné', tefenLabel('99') === 'Non renseigné');
assert('auto-dinum → Auto-DINUM', confianceNotionLabel('auto-dinum') === 'Auto-DINUM');
assert('manuel → Manuel', confianceNotionLabel('manuel') === 'Manuel');

// -------- 4. runCompute — cas réels
console.log('\n[4] runCompute — 4 scénarios');

// 4a. Aixoise — IDCC 843 (boulangerie), TEFEN 11. OPCO EP identifié mais détails
// de branche boulangerie absents de la BDD → cas légitime branche_a_confirmer.
const r1 = runCompute({ idcc: 843, tefenCode: '11', sourceIdcc: 'dinum' });
dump('Aixoise (843/11)', { opco: r1.opco_nom, branche: r1.branche_slug, min: r1.budget_min_eur, max: r1.budget_max_eur, cas: r1.cas_particulier, dispos: r1.dispositifs_actives?.length });
assert('Aixoise opco_slug = ep', r1.opco_slug === 'ep');
assert('Aixoise cas_particulier=branche_a_confirmer', r1.cas_particulier === 'branche_a_confirmer');
assert('Aixoise message cas particulier renseigné', typeof r1.message_cas_particulier === 'string' && r1.message_cas_particulier.length > 0);
assert('Aixoise pas de budget chiffré (cas particulier)', r1.budget_chiffrable === false);

// 4b. Syntec — IDCC 1486, TEFEN 12 (20-49 sal)
const r2 = runCompute({ idcc: 1486, tefenCode: '12', sourceIdcc: 'dinum' });
dump('Syntec (1486/12)', { opco: r2.opco_nom, min: r2.budget_min_eur, max: r2.budget_max_eur, dispos: r2.dispositifs_actives?.length });
assert('Syntec opco = atlas', r2.opco_slug === 'atlas');
assert('Syntec budget chiffrable', r2.budget_chiffrable === true);

// 4c. IDCC inconnu — null + tefen 11
const r3 = runCompute({ idcc: null, tefenCode: '11', sourceIdcc: 'manuel' });
dump('IDCC inconnu', { cas: r3.cas_particulier, opco: r3.opco_nom });
assert('IDCC null → cas_particulier=idcc_inconnu', r3.cas_particulier === 'idcc_inconnu');
assert('IDCC null → pas de budget', r3.budget_chiffrable === false);

// 4d. Dirigeant TNS — IDCC quelconque + tefen 00
const r4 = runCompute({ idcc: 843, tefenCode: '00', sourceIdcc: 'dinum' });
dump('Dirigeant TNS (843/00)', { cas: r4.cas_particulier });
assert('TEFEN 00 → cas_particulier=dirigeant_tns_sans_salarie', r4.cas_particulier === 'dirigeant_tns_sans_salarie');

// 4e. TEFEN NN
const r5 = runCompute({ idcc: 843, tefenCode: 'NN', sourceIdcc: 'dinum' });
assert('TEFEN NN → cas_particulier=effectif_non_renseigne', r5.cas_particulier === 'effectif_non_renseigne');

// -------- 5. validateComputeBody
console.log('\n[5] validateComputeBody — 8 cas');
assert('body valide complet',
  validateComputeBody({ siret: '49982392000016', email: 'a@b.fr', rgpd_consent: true, nom_prospect: 'Jean Dupont', telephone: '+33 6 12 34 56 78' }).ok === true);
assert('body valide minimal',
  validateComputeBody({ siret: '49982392000016', email: 'a@b.fr', rgpd_consent: true }).ok === true);
assert('body null → invalid_body',
  validateComputeBody(null).ok === false);
assert('email invalide',
  validateComputeBody({ siret: '49982392000016', email: 'pas-un-email', rgpd_consent: true }).ok === false);
assert('rgpd false → rgpd_missing',
  validateComputeBody({ siret: '49982392000016', email: 'a@b.fr', rgpd_consent: false }).code === 'rgpd_missing');
assert('rgpd absent → rgpd_missing',
  validateComputeBody({ siret: '49982392000016', email: 'a@b.fr' }).code === 'rgpd_missing');
assert('siret invalide',
  validateComputeBody({ siret: '123', email: 'a@b.fr', rgpd_consent: true }).ok === false);
assert('telephone invalide',
  validateComputeBody({ siret: '49982392000016', email: 'a@b.fr', rgpd_consent: true, telephone: 'no-digits!@#$' }).ok === false);
assert('siret avec espaces accepté',
  validateComputeBody({ siret: '499 823 920 00016', email: 'a@b.fr', rgpd_consent: true }).ok === true);

// -------- 6. buildLeadPayload — shape Notion
console.log('\n[6] buildLeadPayload — structure Notion conforme');
const entreprise = {
  siren: '499823920', siret: '49982392000016', nom_complet: 'BOULANGERIE AIXOISE',
  naf: '10.71C', code_postal: '13001', ville: 'MARSEILLE',
  tranche_effectif_tefen: '11', categorie_entreprise: 'PME',
  idcc: '0843', source_idcc: 'dinum', source_confiance: 'auto-dinum',
  multi_idcc: false, liste_idcc_raw: ['0843'],
};
const snapshot = { schema_version: '2026.Q2.1', request: { siret: '49982392000016' }, entreprise, simulation: r1 };
const payload = buildLeadPayload({
  body: { email: 'test@example.com', rgpd_consent: true, siret: '49982392000016', nom_prospect: 'Test Franck', telephone: '+33612345678', utm_source: 'google', utm_campaign: 'opco_2026' },
  entreprise,
  result: r1,
  snapshot,
  niveauConfiance: 'auto-dinum',
  qualification: 'À qualifier',
});
assert('properties.Email présent', payload.properties?.Email?.email === 'test@example.com');
assert('properties.SIREN number', payload.properties?.SIREN?.number === 499823920);
assert('properties["Nom complet"] title', payload.properties?.['Nom complet']?.title?.[0]?.text?.content === 'Test Franck');
assert('properties["Tranche effectif"] select label humain', payload.properties?.['Tranche effectif']?.select?.name === '10 à 19 salariés');
assert('properties["Niveau confiance IDCC"] = Auto-DINUM', payload.properties?.['Niveau confiance IDCC']?.select?.name === 'Auto-DINUM');
assert('properties["Qualification (auto)"] présent', typeof payload.properties?.['Qualification (auto)']?.select?.name === 'string');
assert('properties["Cas particulier"] présent quand cas levé', payload.properties?.['Cas particulier']?.select?.name === 'branche_a_confirmer');
assert('properties["Source UTM"] contient utm', /google.*opco_2026/.test(payload.properties?.['Source UTM']?.rich_text?.[0]?.text?.content ?? ''));
assert('children[0] = heading_3', payload.children?.[0]?.type === 'heading_3');
assert('children[1] = code block', payload.children?.[1]?.type === 'code');
assert('children[1] code language = json', payload.children?.[1]?.code?.language === 'json');
assert('snapshot JSON parsable depuis le block', (() => {
  try {
    JSON.parse(payload.children?.[1]?.code?.rich_text?.[0]?.text?.content);
    return true;
  } catch { return false; }
})());

// -------- 7. Cas particulier → payload Notion garde le lead
console.log('\n[7] buildLeadPayload — cas idcc_inconnu sauvegardé');
const payloadManual = buildLeadPayload({
  body: { email: 'manual@example.com', rgpd_consent: true, siret: '49982392000016' },
  entreprise: { ...entreprise, idcc: null, source_idcc: null, source_confiance: 'manuel' },
  result: r3,
  snapshot: { ...snapshot, simulation: r3 },
  niveauConfiance: 'manuel',
  qualification: 'À qualifier',
});
assert('cas particulier idcc_inconnu présent', payloadManual.properties?.['Cas particulier']?.select?.name === 'idcc_inconnu');
assert('Niveau confiance = Manuel', payloadManual.properties?.['Niveau confiance IDCC']?.select?.name === 'Manuel');
assert('IDCC null toléré', payloadManual.properties?.IDCC?.number === null);
assert('Qualification = À qualifier', payloadManual.properties?.['Qualification (auto)']?.select?.name === 'À qualifier');

// -------- Résumé
console.log(`\n=== Résultat : ${passed} passed, ${failed} failed ===\n`);
process.exit(failed === 0 ? 0 : 1);
