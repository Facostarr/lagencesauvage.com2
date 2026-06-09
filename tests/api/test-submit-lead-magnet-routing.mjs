// Test unitaire du routage de api/submit-lead-magnet.js (sans appels externes)
// Exécution : node tests/api/test-submit-lead-magnet-routing.mjs
// Les cas testés s'arrêtent tous AVANT les appels Notion/Resend/Plausible :
// validation magnet + validation champs = la partie routage pure.

import handler from '../../api/submit-lead-magnet.js';

function mockRes() {
  const res = {
    headers: {},
    statusCode: null,
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; },
    end() { return this; },
  };
  return res;
}

async function run(name, req, expectStatus, expectMessageIncludes) {
  const res = mockRes();
  await handler(req, res);
  const ok = res.statusCode === expectStatus
    && (!expectMessageIncludes || (res.body?.message || '').includes(expectMessageIncludes));
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name} → ${res.statusCode} ${JSON.stringify(res.body)}`);
  if (!ok) process.exitCode = 1;
}

// 1. Magnet inconnu → 400
await run('magnet inconnu', {
  method: 'POST', url: '/api/submit-lead-magnet', headers: {}, query: {},
  body: { magnet: 'nimporte-quoi', firstName: 'Test', email: 'a@b.fr' },
}, 400, 'inconnu');

// 2. Pas de magnet, pas d'URL legacy → 400
await run('aucun magnet résolu', {
  method: 'POST', url: '/api/submit-lead-magnet', headers: {}, query: {},
  body: { firstName: 'Test', email: 'a@b.fr' },
}, 400, 'inconnu');

// 3. Magnet valide mais champs manquants → 400 "Prénom et email requis"
//    (prouve que la résolution du magnet a réussi)
for (const magnet of ['checklist', 'prompts', 'kit', 'grille-seo-geo', 'programme']) {
  await run(`magnet '${magnet}' résolu via body`, {
    method: 'POST', url: '/api/submit-lead-magnet', headers: {}, query: {},
    body: { magnet },
  }, 400, 'Prénom et email requis');
}

// 4. Résolution via query param (rewrite vercel.json) — pas de body.magnet
await run("legacy rewrite ?magnet=checklist", {
  method: 'POST', url: '/api/submit-lead-magnet?magnet=checklist', headers: {}, query: { magnet: 'checklist' },
  body: {},
}, 400, 'Prénom et email requis');

// 5. Résolution via chemin legacy (si req.url préservé)
await run('legacy path /api/submit-prompts', {
  method: 'POST', url: '/api/submit-prompts', headers: {}, query: {},
  body: {},
}, 400, 'Prénom et email requis');

// 6. Email invalide → 400
await run('email invalide', {
  method: 'POST', url: '/api/submit-lead-magnet', headers: {}, query: {},
  body: { magnet: 'kit', firstName: 'Test', email: 'pas-un-email' },
}, 400, 'Email invalide');

// 7. OPTIONS → 200
await run('preflight OPTIONS', {
  method: 'OPTIONS', url: '/api/submit-lead-magnet', headers: {}, query: {}, body: {},
}, 200, null);

console.log('\nTests routage terminés.');
