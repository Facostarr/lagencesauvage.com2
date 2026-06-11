// =============================================================================
// Test harness — cascade de résolution SIRET (resolve-service.js)
// =============================================================================
// Couvre la logique de cascade DINUM → siret2idcc → manuel SANS appel réseau :
// clients et cache injectés via l'option `deps` de resolveSiretWithCascade.
// Complète test-endpoints-live.mjs (qui, lui, exige les APIs upstream réelles).
// =============================================================================

import { resolveSiretWithCascade, ResolveError } from '../../api/_simulateur/resolve-service.js';
import { normalizeDinumResult, DinumError } from '../../api/_simulateur/dinum-client.js';
import { Siret2IdccError } from '../../api/_simulateur/siret2idcc-client.js';
import { createCache } from '../../api/_simulateur/cache.js';

let passed = 0;
let failed = 0;

function assert(label, cond, detail = '') {
  const ok = Boolean(cond);
  console.log(`${ok ? '✅' : '❌'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (ok) passed += 1; else failed += 1;
}

const SIRET = '49982392000016';

// Payload DINUM brut minimal, façonné comme la réponse recherche-entreprises
function dinumRaw({ idccList = ['1486'], tefen = '12' } = {}) {
  return {
    siren: '499823920',
    nom_complet: 'TEST SARL',
    activite_principale: '62.01Z',
    categorie_entreprise: 'PME',
    siege: {
      siret: SIRET,
      code_postal: '13001',
      libelle_commune: 'MARSEILLE',
      liste_idcc: idccList,
      tranche_effectif_salarie: tefen,
    },
  };
}

// deps de base : DINUM répond, fallback jamais appelé, cache frais par test
function makeDeps({ dinumGet, s2iLookup } = {}) {
  return {
    dinumGet: dinumGet ?? (async () => dinumRaw()),
    s2iLookup: s2iLookup ?? (async () => { throw new Error('s2iLookup ne devait pas être appelé'); }),
    cache: createCache(),
  };
}

async function expectResolveError(label, fn, { code, status }) {
  try {
    await fn();
    assert(label, false, 'aucune erreur levée');
  } catch (err) {
    assert(label, err instanceof ResolveError && err.code === code && err.status === status,
      `code=${err.code} status=${err.status}`);
  }
}

console.log('\n=== Tests cascade resolve SIRET ===\n');

// -------- 1. Chemin nominal : DINUM fournit l'IDCC
console.log('[1] DINUM avec IDCC → auto-dinum');
{
  const deps = makeDeps();
  const { payload, cacheHit } = await resolveSiretWithCascade(SIRET, { deps });
  assert('cacheHit=false au premier appel', cacheHit === false);
  assert('idcc = 1486', payload.entreprise.idcc === '1486');
  assert('source_idcc = dinum', payload.entreprise.source_idcc === 'dinum');
  assert('source_confiance = auto-dinum', payload.entreprise.source_confiance === 'auto-dinum');
  assert('fallback_used = null', payload.fallback_used === null);
  assert('tefen propagé', payload.entreprise.tranche_effectif_tefen === '12');
}

// -------- 2. Cache : deuxième appel servi sans toucher l'upstream
console.log('\n[2] Cache hit au second appel');
{
  let calls = 0;
  const deps = makeDeps({ dinumGet: async () => { calls += 1; return dinumRaw(); } });
  await resolveSiretWithCascade(SIRET, { deps });
  const { cacheHit } = await resolveSiretWithCascade(SIRET, { deps });
  assert('cacheHit=true', cacheHit === true);
  assert('DINUM appelé une seule fois', calls === 1, `calls=${calls}`);
}

// -------- 3. Fallback siret2idcc qui trouve un IDCC
console.log('\n[3] DINUM sans IDCC → fallback siret2idcc OK');
{
  const deps = makeDeps({
    dinumGet: async () => dinumRaw({ idccList: [] }),
    s2iLookup: async () => ({ idcc: '0843', listeIdcc: ['0843', '1486'], multi_idcc: true }),
  });
  const { payload } = await resolveSiretWithCascade(SIRET, { deps });
  assert('idcc = 0843 (du fallback)', payload.entreprise.idcc === '0843');
  assert('source_idcc = siret2idcc', payload.entreprise.source_idcc === 'siret2idcc');
  assert('source_confiance = auto-fallback', payload.entreprise.source_confiance === 'auto-fallback');
  assert('fallback_used = siret2idcc', payload.fallback_used === 'siret2idcc');
  assert('multi_idcc = true', payload.entreprise.multi_idcc === true);
  assert('liste_idcc_raw reprise du fallback', payload.entreprise.liste_idcc_raw?.length === 2);
}

// -------- 4. Fallback vide → bascule en saisie manuelle
console.log('\n[4] Fallback vide → manuel');
{
  const deps = makeDeps({
    dinumGet: async () => dinumRaw({ idccList: [] }),
    s2iLookup: async () => ({ idcc: null, listeIdcc: [], multi_idcc: false }),
  });
  const { payload } = await resolveSiretWithCascade(SIRET, { deps });
  assert('idcc = null', payload.entreprise.idcc === null);
  assert('source_idcc = null', payload.entreprise.source_idcc === null);
  assert('source_confiance = manuel', payload.entreprise.source_confiance === 'manuel');
  assert('fallback_used = siret2idcc-empty', payload.fallback_used === 'siret2idcc-empty');
}

// -------- 5. Fallback en erreur → manuel, sans casser la résolution
console.log('\n[5] Fallback en erreur → manuel + log');
{
  const events = [];
  const deps = makeDeps({
    dinumGet: async () => dinumRaw({ idccList: [] }),
    s2iLookup: async () => { throw new Siret2IdccError('upstream_down', 'HTTP 503', { status: 503 }); },
  });
  const { payload } = await resolveSiretWithCascade(SIRET, { logger: (e) => events.push(e), deps });
  assert('résolution réussit malgré le fallback KO', payload.entreprise.nom_complet === 'TEST SARL');
  assert('source_confiance = manuel', payload.entreprise.source_confiance === 'manuel');
  assert('fallback_used = siret2idcc-error', payload.fallback_used === 'siret2idcc-error');
  assert('événement resolve.siret2idcc_error loggé', events.includes('resolve.siret2idcc_error'));
}

// -------- 6. Erreur fallback non typée → loggée comme interne, même bascule
console.log('\n[6] Erreur fallback générique');
{
  const events = [];
  const deps = makeDeps({
    dinumGet: async () => dinumRaw({ idccList: [] }),
    s2iLookup: async () => { throw new TypeError('boom'); },
  });
  const { payload } = await resolveSiretWithCascade(SIRET, { logger: (e) => events.push(e), deps });
  assert('fallback_used = siret2idcc-error', payload.fallback_used === 'siret2idcc-error');
  assert('événement resolve.siret2idcc_internal loggé', events.includes('resolve.siret2idcc_internal'));
}

// -------- 7. Erreurs DINUM → mapping ResolveError (code + status HTTP)
console.log('\n[7] Erreurs DINUM → ResolveError');
await expectResolveError('DinumError not_found → 404',
  () => resolveSiretWithCascade(SIRET, { deps: makeDeps({ dinumGet: async () => { throw new DinumError('not_found', 'rien', { status: 404 }); } }) }),
  { code: 'not_found', status: 404 });
await expectResolveError('DinumError upstream_down → 502',
  () => resolveSiretWithCascade(SIRET, { deps: makeDeps({ dinumGet: async () => { throw new DinumError('upstream_down', 'HTTP 503', { status: 503 }); } }) }),
  { code: 'upstream_down', status: 502 });
await expectResolveError('erreur générique → internal 500',
  () => resolveSiretWithCascade(SIRET, { deps: makeDeps({ dinumGet: async () => { throw new RangeError('oops'); } }) }),
  { code: 'internal', status: 500 });
await expectResolveError('DINUM null → not_found 404',
  () => resolveSiretWithCascade(SIRET, { deps: makeDeps({ dinumGet: async () => null }) }),
  { code: 'not_found', status: 404 });
await expectResolveError('payload DINUM non-objet → upstream_down 502',
  () => resolveSiretWithCascade(SIRET, { deps: makeDeps({ dinumGet: async () => 'garbage' }) }),
  { code: 'upstream_down', status: 502 });

// -------- 8. normalizeDinumResult — fonction pure
console.log('\n[8] normalizeDinumResult');
{
  const n1 = normalizeDinumResult(dinumRaw());
  assert('idcc pris dans siege.liste_idcc', n1.idcc === '1486');
  assert('multi_idcc=false pour liste de 1', n1.multi_idcc === false);

  const n2 = normalizeDinumResult({
    siren: '1', complements: { liste_idcc: ['0843', '1486'] }, siege: {},
  });
  assert('fallback sur complements.liste_idcc', n2.idcc === '0843');
  assert('multi_idcc=true pour liste de 2', n2.multi_idcc === true);
  assert('tefen absent → NN', n2.tranche_effectif_tefen === 'NN');

  assert('raw null → null', normalizeDinumResult(null) === null);
  assert('raw non-objet → null', normalizeDinumResult('x') === null);
}

// -------- Résumé
console.log(`\n=== Résultat : ${passed} passed, ${failed} failed ===\n`);
process.exit(failed === 0 ? 0 : 1);
