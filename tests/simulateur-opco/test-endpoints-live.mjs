// =============================================================================
// Test harness live pour endpoints simulateur OPCO
// =============================================================================
// Lance les handlers Vercel avec des mocks req/res et frappe les vraies
// APIs DINUM + siret2idcc. À exécuter en local avant push :
//   node tests/simulateur-opco/test-endpoints-live.mjs
// =============================================================================

import lookupHandler from '../../api/simulate-opco-lookup.js';
import resolveHandler from '../../api/simulate-opco-resolve.js';

function makeReq({ method = 'GET', query = {}, headers = {} } = {}) {
  return {
    method,
    query,
    headers: { 'user-agent': 'test-harness', ...headers },
    socket: { remoteAddress: '127.0.0.1' },
  };
}

function makeRes() {
  const state = { statusCode: null, headers: {}, body: null };
  return {
    state,
    setHeader(k, v) { state.headers[k.toLowerCase()] = v; },
    status(code) { state.statusCode = code; return this; },
    json(payload) { state.body = payload; return this; },
    end() { return this; },
  };
}

async function run(label, handler, req) {
  const res = makeRes();
  await handler(req, res);
  const status = res.state.statusCode;
  const cache = res.state.headers['x-cache'] || '-';
  const body = res.state.body;
  const summary = summarize(body);
  console.log(`[${status} ${cache}] ${label} → ${summary}`);
  return { status, body, headers: res.state.headers };
}

function summarize(body) {
  if (!body) return '(no body)';
  if (body.ok === false) return `ERR ${body.code} — ${body.message}`;
  if (body.mode === 'autocomplete') {
    const n = body.results?.length ?? 0;
    const first = body.results?.[0];
    return `autocomplete results=${n}${first ? ` first="${first.nom_complet}" siret=${first.siret_siege} idcc=${first.idcc} tefen=${first.tranche_effectif_tefen}` : ''} upstream=${body.upstream_ms}ms`;
  }
  if (body.mode === 'resolve') {
    const e = body.entreprise;
    return `resolve "${e?.nom_complet}" siret=${e?.siret} idcc=${e?.idcc} source=${e?.source_idcc} confiance=${e?.source_confiance} multi=${e?.multi_idcc} fallback=${body.fallback_used} upstream=${body.upstream_ms}ms`;
  }
  return JSON.stringify(body).slice(0, 200);
}

const TESTS = [
  // === LOOKUP ===
  { label: 'lookup happy path (Boulangerie Aixoise)', handler: lookupHandler, req: makeReq({ query: { q: 'Boulangerie Aixoise', code_postal: '13001' } }) },
  { label: 'lookup PAUL (multi-IDCC connu)', handler: lookupHandler, req: makeReq({ query: { q: 'PAUL', code_postal: '59700', limit: '3' } }) },
  { label: 'lookup query trop courte (1 char)', handler: lookupHandler, req: makeReq({ query: { q: 'a' } }) },
  { label: 'lookup SSRF tentative (caractères interdits)', handler: lookupHandler, req: makeReq({ query: { q: 'foo&q=evil' } }) },
  { label: 'lookup code_postal invalide', handler: lookupHandler, req: makeReq({ query: { q: 'test', code_postal: '999' } }) },
  { label: 'lookup limit hors range', handler: lookupHandler, req: makeReq({ query: { q: 'test', limit: '99' } }) },
  { label: 'lookup cache HIT (re-run)', handler: lookupHandler, req: makeReq({ query: { q: 'Boulangerie Aixoise', code_postal: '13001' } }) },

  // === RESOLVE ===
  { label: 'resolve Boulangerie Aixoise (IDCC 0843 attendu)', handler: resolveHandler, req: makeReq({ query: { siret: '49982392000016' } }) },
  { label: 'resolve SIRET invalide (12 chiffres)', handler: resolveHandler, req: makeReq({ query: { siret: '123456789012' } }) },
  { label: 'resolve SIRET avec espaces (doit nettoyer)', handler: resolveHandler, req: makeReq({ query: { siret: '499 823 920 00016' } }) },
  { label: 'resolve SIRET introuvable', handler: resolveHandler, req: makeReq({ query: { siret: '00000000000000' } }) },
  { label: 'resolve cache HIT (re-run Aixoise)', handler: resolveHandler, req: makeReq({ query: { siret: '49982392000016' } }) },

  // === SÉCU ===
  { label: 'lookup OPTIONS preflight', handler: lookupHandler, req: makeReq({ method: 'OPTIONS' }) },
  { label: 'lookup POST refusé', handler: lookupHandler, req: makeReq({ method: 'POST' }) },
];

console.log('\n=== Test harness simulateur OPCO — endpoints S3 ===\n');
let passed = 0;
let failed = 0;
for (const t of TESTS) {
  try {
    await run(t.label, t.handler, t.req);
    passed += 1;
  } catch (err) {
    console.error(`[CRASH] ${t.label} → ${err.stack || err}`);
    failed += 1;
  }
}
console.log(`\n=== Résultat : ${passed}/${TESTS.length} runs OK, ${failed} crashs ===\n`);
