/* =============================================================================
   Simulateur Budget OPCO 2026 — UI controller
   =============================================================================
   Vanilla JS (cohérence repo, pas d'Alpine.js). 5 états DOM + hash routing
   minimal pour back button, autocomplete clavier-friendly, cache local,
   gestion erreurs explicite.
   Consensus Claude+Gemini Pro 9/10 — 2026-05-23.
   ============================================================================= */
(function () {
  'use strict';

  const API_LOOKUP = '/api/simulate-opco-lookup';
  const API_RESOLVE = '/api/simulate-opco-resolve';
  const API_COMPUTE = '/api/simulate-opco-compute';

  const TEFEN_LABELS = {
    NN: 'Effectif non renseigné', '00': '0 salarié', '01': '1-2 salariés',
    '02': '3-5 salariés', '03': '6-9 salariés', '11': '10-19 salariés',
    '12': '20-49 salariés', '21': '50-99 salariés', '22': '100-199 salariés',
    '31': '200-249 salariés', '32': '250-499 salariés', '41': '500-999 salariés',
    '42': '1 000-1 999 salariés', '51': '2 000-4 999 salariés',
    '52': '5 000-9 999 salariés', '53': '10 000+ salariés',
  };
  const CONFIANCE_LABELS = {
    'auto-dinum': 'Auto-DINUM', 'auto-fallback': 'Auto-DSN',
    'heuristique-naf': 'Heuristique NAF', manuel: 'À confirmer',
  };

  const state = {
    entreprise: null,
    simulation: null,
    activeIndex: -1,
    results: [],
    currentStep: 'hook',
  };
  const lookupCache = new Map();
  let lookupTimer = null;
  let lookupAbort = null;

  // ============================================================================
  // DOM bindings
  // ============================================================================
  function $(id) { return document.getElementById(id); }
  const el = {
    hero: $('sim-hero'),
    card: $('sim-card'),
    states: {
      hook: $('sim-state-hook'),
      picked: $('sim-state-picked'),
      reveal: $('sim-state-reveal'),
      manual: $('sim-state-manual'),
      error: $('sim-state-error'),
    },
    search: $('sim-search'),
    searchSpinner: $('sim-search-spinner'),
    searchError: $('sim-search-error'),
    dropdown: $('sim-dropdown'),
    picked: {
      name: $('sim-picked-name'),
      siren: $('sim-picked-siren'),
      tefen: $('sim-picked-tefen'),
      naf: $('sim-picked-naf'),
      opco: $('sim-picked-opco'),
      branche: $('sim-picked-branche'),
    },
    changeCompany: $('sim-change-company'),
    form: $('sim-compute-form'),
    formError: $('sim-form-error'),
    submitBtn: $('sim-submit-btn'),
    submitLabel: $('sim-submit-label'),
    submitSpinner: $('sim-submit-spinner'),
    reveal: {
      budget: $('sim-reveal-budget'),
      opco: $('sim-reveal-opco'),
      dispositifsWrap: $('sim-reveal-dispositifs-wrap'),
      dispositifs: $('sim-reveal-dispositifs'),
      warnings: $('sim-reveal-warnings'),
      warningsList: $('sim-reveal-warnings-list'),
    },
    manual: {
      title: $('sim-manual-title'),
      message: $('sim-manual-message'),
    },
    errorMessage: $('sim-error-message'),
    errorRetry: $('sim-error-retry'),
  };

  if (!el.search || !el.card) return; // page sans simulateur, exit silencieux

  // ============================================================================
  // Helpers UI
  // ============================================================================
  function track(event, props) {
    try { if (typeof window.plausible === 'function') window.plausible(event, { props: props || {} }); } catch (_) {}
  }

  function showState(name) {
    Object.keys(el.states).forEach((k) => {
      if (el.states[k]) el.states[k].classList.toggle('hidden', k !== name);
    });
    state.currentStep = name;
    if (window.location.hash !== `#${name}`) {
      try { history.pushState({ step: name }, '', `#${name}`); } catch (_) {}
    }
    // Focus management
    setTimeout(() => {
      if (name === 'hook') el.search?.focus();
      else if (name === 'picked') $('sim-email')?.focus();
      else if (name === 'reveal' || name === 'manual') el.card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  function setError(target, message) {
    if (!target) return;
    if (!message) { target.classList.add('hidden'); target.textContent = ''; return; }
    target.textContent = message;
    target.classList.remove('hidden');
  }

  function formatEur(n) {
    if (n == null || !Number.isFinite(n)) return null;
    return new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' €';
  }

  function tefenLabel(code) { return TEFEN_LABELS[code] || 'Effectif non renseigné'; }
  function confianceLabel(c) { return CONFIANCE_LABELS[c] || 'À confirmer'; }

  // ============================================================================
  // Autocomplete
  // ============================================================================
  function showDropdown(items) {
    state.results = items || [];
    state.activeIndex = -1;
    el.dropdown.innerHTML = '';
    if (!items || items.length === 0) {
      el.dropdown.classList.add('hidden');
      el.search.setAttribute('aria-expanded', 'false');
      return;
    }
    items.forEach((r, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('id', `sim-opt-${i}`);
      li.setAttribute('data-siret', r.siret_siege || '');
      li.className = 'px-4 py-2.5 cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 text-sm transition-colors';
      const ville = r.ville ? r.ville.replace(/\s+/g, ' ').trim() : '';
      const cp = r.code_postal ? `${r.code_postal} ` : '';
      const tef = r.tranche_effectif_tefen ? ` · ${tefenLabel(r.tranche_effectif_tefen)}` : '';
      li.innerHTML = `<div class="font-semibold text-slate-900">${escapeHtml(r.nom_complet || '')}</div>
        <div class="text-xs text-slate-500 mt-0.5">${escapeHtml(cp + ville)}${escapeHtml(tef)}</div>`;
      li.addEventListener('click', () => pickEntreprise(r.siret_siege));
      el.dropdown.appendChild(li);
    });
    el.dropdown.classList.remove('hidden');
    el.search.setAttribute('aria-expanded', 'true');
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function moveActive(delta) {
    if (state.results.length === 0) return;
    state.activeIndex = (state.activeIndex + delta + state.results.length) % state.results.length;
    const lis = el.dropdown.querySelectorAll('li');
    lis.forEach((li, i) => {
      li.classList.toggle('bg-indigo-50', i === state.activeIndex);
      if (i === state.activeIndex) {
        li.scrollIntoView({ block: 'nearest' });
        el.search.setAttribute('aria-activedescendant', li.id);
      }
    });
  }

  async function runLookup(q) {
    const trimmed = q.trim();
    if (trimmed.length < 2) { showDropdown([]); return; }
    const cacheKey = trimmed.toLowerCase();
    if (lookupCache.has(cacheKey)) { showDropdown(lookupCache.get(cacheKey)); return; }

    if (lookupAbort) lookupAbort.abort();
    lookupAbort = new AbortController();
    el.searchSpinner.classList.remove('hidden');
    setError(el.searchError, null);

    try {
      const res = await fetch(`${API_LOOKUP}?q=${encodeURIComponent(trimmed)}&limit=6`, { signal: lookupAbort.signal });
      const data = await res.json().catch(() => ({ ok: false, code: 'parse_error' }));
      if (!res.ok || !data?.ok) {
        if (data?.code === 'rate_limited') setError(el.searchError, 'Trop de requêtes, patientez quelques secondes.');
        showDropdown([]);
        return;
      }
      const results = Array.isArray(data.results) ? data.results : [];
      lookupCache.set(cacheKey, results);
      showDropdown(results);
      track('simulator_lookup_used', { len: trimmed.length });
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(el.searchError, 'Connexion lente. Tapez votre SIREN à 9 chiffres pour aller plus vite.');
      }
    } finally {
      el.searchSpinner.classList.add('hidden');
    }
  }

  el.search.addEventListener('input', (e) => {
    const v = e.target.value;
    clearTimeout(lookupTimer);
    lookupTimer = setTimeout(() => runLookup(v), 300);
  });

  el.search.addEventListener('keydown', (e) => {
    if (el.dropdown.classList.contains('hidden')) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const idx = state.activeIndex >= 0 ? state.activeIndex : 0;
      if (state.results[idx]?.siret_siege) pickEntreprise(state.results[idx].siret_siege);
    } else if (e.key === 'Escape') {
      el.dropdown.classList.add('hidden');
      el.search.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (e) => {
    if (!el.dropdown.contains(e.target) && e.target !== el.search) {
      el.dropdown.classList.add('hidden');
      el.search.setAttribute('aria-expanded', 'false');
    }
  });

  // ============================================================================
  // Resolve SIRET → entreprise card
  // ============================================================================
  async function pickEntreprise(siret) {
    if (!siret) return;
    el.dropdown.classList.add('hidden');
    el.search.setAttribute('aria-expanded', 'false');
    el.searchSpinner.classList.remove('hidden');
    setError(el.searchError, null);

    try {
      const res = await fetch(`${API_RESOLVE}?siret=${encodeURIComponent(siret)}`);
      const data = await res.json().catch(() => ({ ok: false, code: 'parse_error' }));
      if (!res.ok || !data?.ok) {
        const code = data?.code;
        if (code === 'not_found') setError(el.searchError, 'SIRET introuvable. Vérifiez la saisie ou contactez-nous.');
        else if (code === 'rate_limited') setError(el.searchError, 'Trop de requêtes, patientez quelques secondes.');
        else setError(el.searchError, 'Connexion à l\'API entreprises ralentie. Réessayez dans un instant.');
        return;
      }
      state.entreprise = data.entreprise;
      renderPicked(data.entreprise);
      track('simulator_company_picked', {
        opco_slug: data.entreprise.source_idcc ? (data.entreprise.idcc || 'unknown') : 'unknown',
        source_confiance: data.entreprise.source_confiance,
        tefen: data.entreprise.tranche_effectif_tefen,
      });
      showState('picked');
    } catch (err) {
      setError(el.searchError, 'Connexion interrompue. Réessayez.');
    } finally {
      el.searchSpinner.classList.add('hidden');
    }
  }

  function renderPicked(ent) {
    el.picked.name.textContent = ent.nom_complet || '—';
    el.picked.siren.textContent = ent.siren || '—';
    el.picked.tefen.textContent = tefenLabel(ent.tranche_effectif_tefen);
    el.picked.naf.textContent = ent.naf || '—';
    if (ent.source_confiance === 'manuel' || !ent.idcc) {
      el.picked.opco.textContent = 'À déterminer manuellement';
      el.picked.branche.textContent = `Convention non identifiée automatiquement (${confianceLabel(ent.source_confiance)})`;
    } else {
      el.picked.opco.textContent = '—'; // sera complété au compute
      el.picked.branche.textContent = `IDCC ${ent.idcc} (${confianceLabel(ent.source_confiance)})`;
    }
  }

  el.changeCompany?.addEventListener('click', () => {
    state.entreprise = null;
    el.search.value = '';
    setError(el.formError, null);
    showState('hook');
  });

  // ============================================================================
  // Compute submit
  // ============================================================================
  el.form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.entreprise?.siret) return;
    setError(el.formError, null);

    const email = $('sim-email')?.value.trim();
    const rgpd = $('sim-rgpd')?.checked;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(el.formError, 'Email professionnel valide requis.');
      return;
    }
    if (!rgpd) {
      setError(el.formError, 'Le consentement RGPD est obligatoire.');
      return;
    }

    el.submitBtn.disabled = true;
    el.submitLabel.textContent = 'Calcul en cours…';
    el.submitSpinner.classList.remove('hidden');

    const payload = {
      siret: state.entreprise.siret,
      email,
      rgpd_consent: true,
      nom_prospect: $('sim-name')?.value.trim() || undefined,
      telephone: $('sim-phone')?.value.trim() || undefined,
      utm_source: getUtm('utm_source'),
      utm_campaign: getUtm('utm_campaign'),
    };
    track('simulator_submit_attempt', { opco: state.entreprise.idcc || 'unknown' });

    try {
      const res = await fetch(API_COMPUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({ ok: false, code: 'parse_error' }));
      if (!res.ok || !data?.ok) {
        if (data?.code === 'rgpd_missing') setError(el.formError, 'Veuillez cocher le consentement RGPD.');
        else if (data?.code === 'rate_limited') setError(el.formError, 'Trop de tentatives. Réessayez dans une minute.');
        else if (data?.code === 'not_found') setError(el.formError, 'SIRET introuvable côté base entreprises. Recommencez avec un autre identifiant.');
        else setError(el.formError, 'Une erreur est survenue. Réessayez ou contactez-nous.');
        return;
      }
      state.simulation = data.simulation;
      renderReveal(data);
    } catch (err) {
      showState('error');
      el.errorMessage.textContent = 'Le service de simulation est momentanément indisponible. Réessayez dans quelques instants.';
    } finally {
      el.submitBtn.disabled = false;
      el.submitLabel.textContent = 'Voir mon budget';
      el.submitSpinner.classList.add('hidden');
    }
  });

  function getUtm(key) {
    try {
      const params = new URLSearchParams(window.location.search);
      const val = params.get(key);
      return val && /^[A-Za-z0-9_.\-]{1,100}$/.test(val) ? val : undefined;
    } catch (_) { return undefined; }
  }

  // ============================================================================
  // Reveal
  // ============================================================================
  function renderReveal({ simulation, entreprise }) {
    if (simulation.cas_particulier) {
      el.manual.title.textContent = labelCasParticulier(simulation.cas_particulier);
      el.manual.message.textContent = simulation.message_cas_particulier || 'Votre situation nécessite une analyse manuelle. Notre équipe vous recontacte rapidement.';
      showState('manual');
      return;
    }

    // Budget chiffrable
    const min = simulation.budget_min_eur;
    const max = simulation.budget_max_eur;
    let label;
    if (min != null && max != null && min !== max) label = `Entre ${formatEur(min)} et ${formatEur(max)}`;
    else if (max != null) label = `Jusqu'à ${formatEur(max)}`;
    else label = 'À calculer en entretien';
    el.reveal.budget.textContent = label;

    const opcoLine = [simulation.opco_nom, simulation.branche_nom ? `Convention « ${simulation.branche_nom} »` : null]
      .filter(Boolean).join(' · ');
    el.reveal.opco.textContent = opcoLine || '—';

    // Dispositifs
    const dispositifs = (simulation.dispositifs_actives || []).filter((d) => d.inclus_dans_budget_chiffre || d.cle === 'fne_formation');
    if (dispositifs.length > 0) {
      el.reveal.dispositifs.innerHTML = '';
      dispositifs.forEach((d) => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5';
        const plancher = d.plancher_garanti_eur != null ? formatEur(d.plancher_garanti_eur) : 'sur projet';
        li.innerHTML = `<div class="flex-shrink-0 mt-0.5 h-2 w-2 rounded-full bg-indigo-500"></div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-900">${escapeHtml(d.libelle || '—')}</p>
            <p class="text-xs text-slate-500 mt-0.5">Plafond : ${escapeHtml(plancher)}</p>
          </div>`;
        el.reveal.dispositifs.appendChild(li);
      });
      el.reveal.dispositifsWrap.classList.remove('hidden');
    } else {
      el.reveal.dispositifsWrap.classList.add('hidden');
    }

    // Warnings
    const warnings = simulation.warnings || [];
    if (warnings.length > 0) {
      el.reveal.warningsList.innerHTML = warnings.map((w) => `<li>${escapeHtml(w)}</li>`).join('');
      el.reveal.warnings.classList.remove('hidden');
    } else {
      el.reveal.warnings.classList.add('hidden');
    }

    showState('reveal');
  }

  function labelCasParticulier(cas) {
    return ({
      effectif_non_renseigne: 'Effectif non disponible automatiquement',
      dirigeant_tns_sans_salarie: 'Vous êtes travailleur non-salarié',
      idcc_inconnu: 'Convention collective non identifiée',
      branche_a_confirmer: 'Détails de branche à confirmer',
      effectif_hors_tranches: 'Taille d\'entreprise hors tranches standard',
    })[cas] || 'Analyse manuelle requise';
  }

  // ============================================================================
  // Error retry
  // ============================================================================
  el.errorRetry?.addEventListener('click', () => {
    if (state.entreprise) showState('picked'); else showState('hook');
  });

  // ============================================================================
  // Hash routing (back button minimal)
  // ============================================================================
  window.addEventListener('popstate', (e) => {
    const step = (e.state && e.state.step) || (window.location.hash.replace('#', '') || 'hook');
    if (['hook', 'picked', 'reveal', 'manual', 'error'].includes(step)) {
      Object.keys(el.states).forEach((k) => el.states[k]?.classList.toggle('hidden', k !== step));
      state.currentStep = step;
    }
  });

  // ============================================================================
  // Bootstrap
  // ============================================================================
  track('simulator_view', { landed_on: 'hook' });
  // Honor initial hash if present
  const initialHash = window.location.hash.replace('#', '');
  if (['hook'].includes(initialHash) || !initialHash) {
    showState('hook');
  } else {
    // Don't allow deep-link to picked/reveal — they require state
    showState('hook');
    try { history.replaceState({ step: 'hook' }, '', window.location.pathname); } catch (_) {}
  }
})();
