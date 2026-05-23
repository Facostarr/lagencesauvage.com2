// =============================================================================
// Cache LRU + TTL pour endpoints simulateur OPCO
// =============================================================================
// Cache in-memory par instance Vercel. Les instances meurent au bout de
// quelques minutes d'inactivité — TTL 24h sert uniquement à maximiser
// les hits tant que l'instance reste chaude. La BDD SIRENE étant
// quasi-immuable à l'échelle de la journée, aucun risque de stale.

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;
const DEFAULT_MAX_ENTRIES = 200;

export function createCache({ ttlMs = DEFAULT_TTL_MS, maxEntries = DEFAULT_MAX_ENTRIES } = {}) {
  const store = new Map();

  function get(key) {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      store.delete(key);
      return null;
    }
    store.delete(key);
    store.set(key, entry);
    return entry.value;
  }

  function set(key, value) {
    if (store.has(key)) store.delete(key);
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
    if (store.size > maxEntries) {
      const oldestKey = store.keys().next().value;
      if (oldestKey !== undefined) store.delete(oldestKey);
    }
  }

  return { get, set, size: () => store.size };
}

const lookupCache = createCache();
const resolveCache = createCache();

export { lookupCache, resolveCache };
