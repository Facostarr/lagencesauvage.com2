// Test isolé pour les 2 cas masqués par le rate-limit dans le harness principal.
import resolveHandler from '../../api/simulate-opco-resolve.js';

function makeReq(query) {
  return { method: 'GET', query, headers: { 'user-agent': 'test' }, socket: { remoteAddress: '127.0.0.2' } };
}
function makeRes() {
  const state = { statusCode: null, headers: {}, body: null };
  return { state, setHeader(k, v) { state.headers[k.toLowerCase()] = v; }, status(c) { state.statusCode = c; return this; }, json(p) { state.body = p; return this; }, end() { return this; } };
}

async function run(label, query) {
  const res = makeRes();
  await resolveHandler(makeReq(query), res);
  console.log(`[${res.state.statusCode} ${res.state.headers['x-cache'] || '-'}] ${label} →`, JSON.stringify(res.state.body));
  await new Promise((r) => setTimeout(r, 200));
}

console.log('\n=== Tests isolés (IP différente, délai 200ms) ===\n');
await run('resolve SIRET introuvable (00000000000000)', { siret: '00000000000000' });
await run('resolve cache HIT (Aixoise 2e appel)', { siret: '49982392000016' });
console.log('');
