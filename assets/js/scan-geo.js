/* =============================================================================
   Scan GEO public — UI controller
   =============================================================================
   Vanilla JS, pattern simulateur-opco. Parcours (plan GEO scan public §0) :
   hook (autocomplete DINUM) → confirm (site web manuel obligatoire)
   → queries (3 requêtes générées, éditables) → email (capture AU lancement,
   double consentement) → progress (SSE + fallback polling 5s) → result
   (teaser anonymisé, compte concurrents dynamique).
   ============================================================================= */
(function () {
  'use strict';

  // Autocomplete : fonction Vercel existante du simulateur OPCO (proxy DINUM)
  var API_LOOKUP = '/api/simulate-opco-lookup';

  var card = document.getElementById('geo-card');
  if (!card) return; // page sans scan, exit silencieux

  var GEO_API = (card.getAttribute('data-api-base') || '').replace(/\/$/, '');
  var TURNSTILE_SITEKEY = card.getAttribute('data-turnstile-sitekey') || '';

  var ENGINE_LABELS = {
    perplexity: 'Interrogation de Perplexity…',
    gemini: 'Interrogation de Gemini…',
    chatgpt: 'Interrogation de ChatGPT…',
  };
  var ENGINE_NAMES = { perplexity: 'Perplexity', gemini: 'Gemini', chatgpt: 'ChatGPT' };

  // Departements en toutes lettres — les LLM resolvent mieux le nom que le
  // numero (lessons GEO Monitoring). Cle = 2 premiers chiffres du CP (3 en DOM).
  var DEPTS = {
    '01': 'Ain', '02': 'Aisne', '03': 'Allier', '04': 'Alpes-de-Haute-Provence',
    '05': 'Hautes-Alpes', '06': 'Alpes-Maritimes', '07': 'Ardèche', '08': 'Ardennes',
    '09': 'Ariège', '10': 'Aube', '11': 'Aude', '12': 'Aveyron',
    '13': 'Bouches-du-Rhône', '14': 'Calvados', '15': 'Cantal', '16': 'Charente',
    '17': 'Charente-Maritime', '18': 'Cher', '19': 'Corrèze', '20': 'Corse',
    '21': "Côte-d'Or", '22': "Côtes-d'Armor", '23': 'Creuse', '24': 'Dordogne',
    '25': 'Doubs', '26': 'Drôme', '27': 'Eure', '28': 'Eure-et-Loir',
    '29': 'Finistère', '30': 'Gard', '31': 'Haute-Garonne', '32': 'Gers',
    '33': 'Gironde', '34': 'Hérault', '35': 'Ille-et-Vilaine', '36': 'Indre',
    '37': 'Indre-et-Loire', '38': 'Isère', '39': 'Jura', '40': 'Landes',
    '41': 'Loir-et-Cher', '42': 'Loire', '43': 'Haute-Loire', '44': 'Loire-Atlantique',
    '45': 'Loiret', '46': 'Lot', '47': 'Lot-et-Garonne', '48': 'Lozère',
    '49': 'Maine-et-Loire', '50': 'Manche', '51': 'Marne', '52': 'Haute-Marne',
    '53': 'Mayenne', '54': 'Meurthe-et-Moselle', '55': 'Meuse', '56': 'Morbihan',
    '57': 'Moselle', '58': 'Nièvre', '59': 'Nord', '60': 'Oise',
    '61': 'Orne', '62': 'Pas-de-Calais', '63': 'Puy-de-Dôme', '64': 'Pyrénées-Atlantiques',
    '65': 'Hautes-Pyrénées', '66': 'Pyrénées-Orientales', '67': 'Bas-Rhin', '68': 'Haut-Rhin',
    '69': 'Rhône', '70': 'Haute-Saône', '71': 'Saône-et-Loire', '72': 'Sarthe',
    '73': 'Savoie', '74': 'Haute-Savoie', '75': 'Paris', '76': 'Seine-Maritime',
    '77': 'Seine-et-Marne', '78': 'Yvelines', '79': 'Deux-Sèvres', '80': 'Somme',
    '81': 'Tarn', '82': 'Tarn-et-Garonne', '83': 'Var', '84': 'Vaucluse',
    '85': 'Vendée', '86': 'Vienne', '87': 'Haute-Vienne', '88': 'Vosges',
    '89': 'Yonne', '90': 'Territoire de Belfort', '91': 'Essonne', '92': 'Hauts-de-Seine',
    '93': 'Seine-Saint-Denis', '94': 'Val-de-Marne', '95': "Val-d'Oise",
    '971': 'Guadeloupe', '972': 'Martinique', '973': 'Guyane', '974': 'La Réunion',
    '976': 'Mayotte',
  };

  function departmentFromCp(cp) {
    if (!cp) return null;
    var s = String(cp);
    if (s.indexOf('97') === 0 || s.indexOf('98') === 0) return DEPTS[s.slice(0, 3)] || null;
    return DEPTS[s.slice(0, 2)] || null;
  }

  // ============================================================================
  // State
  // ============================================================================
  var state = {
    entreprise: null,     // résultat DINUM normalisé
    website: null,        // domaine normalisé
    activity: null,       // BusinessContext renvoyé par generate-queries
    scanId: null,
    email: null,
    activeIndex: -1,
    results: [],
    eventSource: null,
    pollTimer: null,
    sseErrors: 0,
    widgets: { confirm: null, launch: null }, // ids widgets Turnstile
  };

  // ============================================================================
  // DOM
  // ============================================================================
  function $(id) { return document.getElementById(id); }
  var el = {
    states: {
      hook: $('geo-state-hook'),
      confirm: $('geo-state-confirm'),
      queries: $('geo-state-queries'),
      email: $('geo-state-email'),
      progress: $('geo-state-progress'),
      result: $('geo-state-result'),
      error: $('geo-state-error'),
    },
    search: $('geo-search'),
    searchSpinner: $('geo-search-spinner'),
    searchError: $('geo-search-error'),
    dropdown: $('geo-dropdown'),
    pickedName: $('geo-picked-name'),
    pickedSiren: $('geo-picked-siren'),
    pickedNaf: $('geo-picked-naf'),
    pickedVille: $('geo-picked-ville'),
    changeCompany: $('geo-change-company'),
    confirmForm: $('geo-confirm-form'),
    website: $('geo-website'),
    confirmError: $('geo-confirm-error'),
    confirmBtn: $('geo-confirm-btn'),
    confirmLabel: $('geo-confirm-label'),
    confirmSpinner: $('geo-confirm-spinner'),
    activity: $('geo-activity'),
    queryInputs: [$('geo-query-1'), $('geo-query-2'), $('geo-query-3')],
    queriesError: $('geo-queries-error'),
    queriesBtn: $('geo-queries-btn'),
    queriesBack: $('geo-queries-back'),
    launchForm: $('geo-launch-form'),
    email: $('geo-email'),
    consentReport: $('geo-consent-report'),
    consentMarketing: $('geo-consent-marketing'),
    launchError: $('geo-launch-error'),
    launchBtn: $('geo-launch-btn'),
    launchLabel: $('geo-launch-label'),
    launchSpinner: $('geo-launch-spinner'),
    progressBar: $('geo-progressbar'),
    progressBarWrap: $('geo-progressbar-wrap'),
    progressEngine: $('geo-progress-engine'),
    progressNote: $('geo-progress-note'),
    resultScore: $('geo-result-score'),
    resultBenchmark: $('geo-result-benchmark'),
    resultQueries: $('geo-result-queries'),
    resultCompetitors: $('geo-result-competitors'),
    resultEmailNote: $('geo-result-email-note'),
    errorMessage: $('geo-error-message'),
    errorRetry: $('geo-error-retry'),
    srAnnounce: $('geo-sr-announce'),
  };

  // ============================================================================
  // Helpers
  // ============================================================================
  function track(event, props) {
    try { if (typeof window.plausible === 'function') window.plausible(event, { props: props || {} }); } catch (_) {}
  }

  var SR_LABELS = {
    hook: 'Saisissez votre raison sociale ou votre SIREN.',
    confirm: 'Entreprise reconnue. Indiquez le site web de votre entreprise.',
    queries: 'Trois questions test générées. Vous pouvez les modifier avant de continuer.',
    email: 'Indiquez votre email professionnel pour lancer le scan.',
    progress: 'Scan en cours. La progression est affichée ci-dessous.',
    result: 'Scan terminé. Votre score de visibilité est affiché, le rapport arrive par email.',
    error: 'Une erreur est survenue. Vous pouvez réessayer.',
  };

  function announceSr(msg) {
    if (!el.srAnnounce || !msg) return;
    el.srAnnounce.textContent = '';
    setTimeout(function () { el.srAnnounce.textContent = msg; }, 30);
  }

  function showState(name) {
    Object.keys(el.states).forEach(function (k) {
      if (el.states[k]) el.states[k].classList.toggle('hidden', k !== name);
    });
    announceSr(SR_LABELS[name]);
    setTimeout(function () {
      if (name === 'hook') el.search && el.search.focus();
      else if (name === 'confirm') el.website && el.website.focus();
      else if (name === 'email') el.email && el.email.focus();
      else card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  function setError(target, message) {
    if (!target) return;
    if (!message) { target.classList.add('hidden'); target.textContent = ''; return; }
    target.textContent = message;
    target.classList.remove('hidden');
  }

  function setBusy(btn, label, spinner, busy, busyText, idleText) {
    if (btn) btn.disabled = busy;
    if (spinner) spinner.classList.toggle('hidden', !busy);
    if (label) label.textContent = busy ? busyText : idleText;
  }

  function normalizeDomain(value) {
    var d = String(value || '').trim().toLowerCase();
    d = d.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
    return d;
  }

  function isValidDomain(d) {
    return /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63})*\.[a-z]{2,24}$/.test(d)
      && !/\.(local|internal|lan|home|corp|localhost)$/.test(d);
  }

  // ============================================================================
  // Turnstile — deux widgets (un token par appel API, tokens à usage unique)
  // ============================================================================
  function renderTurnstile(containerId, key) {
    if (!TURNSTILE_SITEKEY || !window.turnstile) return;
    if (state.widgets[key] !== null) return; // déjà rendu
    try {
      state.widgets[key] = window.turnstile.render('#' + containerId, {
        sitekey: TURNSTILE_SITEKEY,
        language: 'fr',
        appearance: 'interaction-only',
      });
    } catch (_) { /* le serveur refusera proprement sans token */ }
  }

  function turnstileToken(key) {
    if (!TURNSTILE_SITEKEY || !window.turnstile || state.widgets[key] === null) return '';
    try { return window.turnstile.getResponse(state.widgets[key]) || ''; } catch (_) { return ''; }
  }

  function turnstileReset(key) {
    if (!window.turnstile || state.widgets[key] === null) return;
    try { window.turnstile.reset(state.widgets[key]); } catch (_) {}
  }

  // ============================================================================
  // Autocomplete entreprise (DINUM via fonction Vercel OPCO)
  // ============================================================================
  var lookupTimer = null;
  var lookupAbort = null;

  function renderDropdown(results) {
    state.results = results;
    state.activeIndex = -1;
    el.dropdown.innerHTML = '';
    if (!results.length) {
      el.dropdown.classList.add('hidden');
      el.search.setAttribute('aria-expanded', 'false');
      return;
    }
    results.forEach(function (r, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.id = 'geo-option-' + i;
      li.className = 'px-4 py-3 cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50';
      var loc = [r.ville, r.code_postal].filter(Boolean).join(' — ');
      li.innerHTML = '<p class="text-sm font-semibold text-slate-900"></p><p class="text-xs text-slate-500"></p>';
      li.children[0].textContent = r.nom_complet || r.siren;
      li.children[1].textContent = 'SIREN ' + (r.siren || '?') + (loc ? ' · ' + loc : '');
      li.addEventListener('click', function () { pickCompany(r); });
      el.dropdown.appendChild(li);
    });
    el.dropdown.classList.remove('hidden');
    el.search.setAttribute('aria-expanded', 'true');
  }

  function doLookup(q) {
    if (lookupAbort) lookupAbort.abort();
    lookupAbort = new AbortController();
    el.searchSpinner.classList.remove('hidden');
    fetch(API_LOOKUP + '?q=' + encodeURIComponent(q) + '&limit=6', { signal: lookupAbort.signal })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        setError(el.searchError, null);
        renderDropdown((data && data.results) || []);
      })
      .catch(function (err) {
        if (err.name === 'AbortError') return;
        setError(el.searchError, 'Recherche momentanément indisponible. Réessayez dans quelques instants.');
      })
      .finally(function () { el.searchSpinner.classList.add('hidden'); });
  }

  el.search.addEventListener('input', function () {
    var q = el.search.value.trim();
    clearTimeout(lookupTimer);
    if (q.length < 3) { renderDropdown([]); return; }
    lookupTimer = setTimeout(function () { doLookup(q); }, 250);
  });

  el.search.addEventListener('keydown', function (e) {
    if (el.dropdown.classList.contains('hidden')) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var delta = e.key === 'ArrowDown' ? 1 : -1;
      var n = state.results.length;
      state.activeIndex = (state.activeIndex + delta + n) % n;
      Array.prototype.forEach.call(el.dropdown.children, function (li, i) {
        li.classList.toggle('bg-indigo-50', i === state.activeIndex);
      });
    } else if (e.key === 'Enter' && state.activeIndex >= 0) {
      e.preventDefault();
      pickCompany(state.results[state.activeIndex]);
    } else if (e.key === 'Escape') {
      renderDropdown([]);
    }
  });

  function pickCompany(r) {
    state.entreprise = r;
    renderDropdown([]);
    el.pickedName.textContent = r.nom_complet || r.siren;
    el.pickedSiren.textContent = r.siren || '—';
    el.pickedNaf.textContent = r.naf || '—';
    var dept = departmentFromCp(r.code_postal);
    el.pickedVille.textContent = [r.ville, dept ? '(' + dept + ')' : null].filter(Boolean).join(' ');
    showState('confirm');
    renderTurnstile('geo-turnstile-confirm', 'confirm');
    track('GEO Scan: entreprise choisie');
  }

  el.changeCompany.addEventListener('click', function () { showState('hook'); });

  // ============================================================================
  // Étape confirm → génération des 3 requêtes
  // ============================================================================
  el.confirmForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var domain = normalizeDomain(el.website.value);
    if (!isValidDomain(domain)) {
      setError(el.confirmError, 'Indiquez un site web valide (ex : votre-entreprise.fr) — il est indispensable au scan.');
      return;
    }
    state.website = domain;
    setError(el.confirmError, null);
    setBusy(el.confirmBtn, el.confirmLabel, el.confirmSpinner, true, 'Analyse de votre site…', 'Générer mes 3 questions test');

    var r = state.entreprise;
    var payload = {
      brand_name: (r.nom_complet || '').slice(0, 80),
      domain: domain,
      siren: r.siren || null,
      naf_code: r.naf || '',
      naf_label: null,
      city: r.ville || '',
      department: departmentFromCp(r.code_postal),
      turnstile_token: turnstileToken('confirm'),
    };

    fetch(GEO_API + '/api/public/generate-queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (resp) { return resp.json().then(function (d) { return { status: resp.status, data: d }; }); })
      .then(function (res) {
        turnstileReset('confirm');
        if (res.status === 200 && res.data.queries) {
          var ctx = res.data.context || {};
          var zone = ctx.zone || payload.department || payload.city;
          el.activity.textContent = 'Nous avons compris : ' + (ctx.activity || 'votre activité') +
            (zone ? ', zone ' + zone : '') + ' — vérifiez et ajustez si besoin.';
          el.queryInputs.forEach(function (input, i) { input.value = res.data.queries[i] || ''; });
          showState('queries');
          track('GEO Scan: requetes generees', { source: res.data.source });
        } else if (res.status === 403) {
          setError(el.confirmError, 'Vérification anti-bot échouée. Complétez le défi ci-dessus puis réessayez.');
        } else if (res.status === 503) {
          showErrorState((res.data && res.data.detail) || 'Le scan est momentanément indisponible.');
        } else {
          // génération KO : on laisse l'utilisateur écrire ses questions
          el.activity.textContent = 'Nous n\'avons pas pu analyser votre site automatiquement. Écrivez les questions que vos clients poseraient à une IA :';
          el.queryInputs.forEach(function (input, i) {
            input.value = '';
            input.placeholder = ['Quels ' + '[votre métier] pouvez-vous me citer dans le [département] ?',
              'Quel [votre métier] recommandez-vous à [ville] ?',
              'Qui contacter pour [votre spécialité] à [ville] ?'][i];
          });
          showState('queries');
        }
      })
      .catch(function () {
        setError(el.confirmError, 'Connexion au service de scan impossible. Réessayez dans quelques instants.');
      })
      .finally(function () {
        setBusy(el.confirmBtn, el.confirmLabel, el.confirmSpinner, false, '', 'Générer mes 3 questions test');
      });
  });

  // ============================================================================
  // Étape queries → email
  // ============================================================================
  el.queriesBtn.addEventListener('click', function () {
    var queries = el.queryInputs.map(function (i) { return i.value.trim(); }).filter(Boolean);
    if (!queries.length) {
      setError(el.queriesError, 'Renseignez au moins une question (15 à 200 caractères).');
      return;
    }
    var tooShort = queries.some(function (q) { return q.length < 15 || q.length > 200; });
    if (tooShort) {
      setError(el.queriesError, 'Chaque question doit faire entre 15 et 200 caractères.');
      return;
    }
    setError(el.queriesError, null);
    showState('email');
    renderTurnstile('geo-turnstile', 'launch');
    track('GEO Scan: requetes validees');
  });

  el.queriesBack.addEventListener('click', function () { showState('confirm'); });

  // ============================================================================
  // Étape email → lancement du scan
  // ============================================================================
  el.launchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = el.email.value.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) {
      setError(el.launchError, 'Indiquez un email valide pour recevoir votre rapport.');
      return;
    }
    if (!el.consentReport.checked) {
      setError(el.launchError, 'Le consentement à la réception du rapport est requis pour lancer le scan.');
      return;
    }
    setError(el.launchError, null);
    state.email = email;
    setBusy(el.launchBtn, el.launchLabel, el.launchSpinner, true, 'Lancement…', 'Lancer le scan');

    var r = state.entreprise;
    var payload = {
      brand_name: (r.nom_complet || '').slice(0, 80),
      domain: state.website,
      siren: r.siren || null,
      naf_code: r.naf || '',
      city: r.ville || '',
      department: departmentFromCp(r.code_postal),
      queries: el.queryInputs.map(function (i) { return i.value.trim(); }).filter(Boolean),
      email: email,
      consent_report: true,
      consent_marketing: !!el.consentMarketing.checked,
      turnstile_token: turnstileToken('launch'),
    };

    fetch(GEO_API + '/api/public/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (resp) { return resp.json().then(function (d) { return { status: resp.status, data: d }; }); })
      .then(function (res) {
        if (res.status === 202) {
          state.scanId = res.data.scan_id;
          track('GEO Scan: lance', { cached: String(!!res.data.cached) });
          if (res.data.cached) { pollStatusOnce(); return; }
          showState('progress');
          if (res.data.queued_for_budget) {
            el.progressNote.textContent = 'Forte affluence aujourd\'hui : votre scan est en file d\'attente. Votre rapport vous parviendra par email — au plus tard demain matin.';
          }
          listenSse();
        } else if (res.status === 429) {
          setError(el.launchError, 'Limite de scans atteinte pour aujourd\'hui depuis votre connexion. Réessayez demain — ou contactez-nous directement.');
        } else if (res.status === 403) {
          setError(el.launchError, 'Vérification anti-bot échouée. Complétez le défi ci-dessus puis réessayez.');
          turnstileReset('launch');
        } else if (res.status === 422) {
          setError(el.launchError, 'Vérifiez vos informations : ' + extractDetail(res.data));
        } else {
          showErrorState((res.data && res.data.detail) || null);
        }
      })
      .catch(function () { showErrorState('Connexion au service de scan impossible.'); })
      .finally(function () {
        setBusy(el.launchBtn, el.launchLabel, el.launchSpinner, false, '', 'Lancer le scan');
      });
  });

  function extractDetail(data) {
    try {
      if (typeof data.detail === 'string') return data.detail;
      if (Array.isArray(data.detail)) return data.detail.map(function (d) { return d.msg; }).join(' · ');
      return JSON.stringify(data.detail);
    } catch (_) { return 'données invalides'; }
  }

  // ============================================================================
  // Progression : SSE + fallback polling
  // ============================================================================
  function listenSse() {
    if (!window.EventSource) { startPolling(); return; }
    var es = new EventSource(GEO_API + '/api/public/scan/' + state.scanId + '/events');
    state.eventSource = es;
    state.sseErrors = 0;

    es.addEventListener('queued', function () {
      el.progressEngine.textContent = 'En file d\'attente…';
    });
    es.addEventListener('engine_started', function (ev) {
      var d = JSON.parse(ev.data);
      el.progressEngine.textContent = ENGINE_LABELS[d.engine] || 'Interrogation en cours…';
      updateProgress(d.progress);
    });
    es.addEventListener('engine_done', function (ev) {
      updateProgress(JSON.parse(ev.data).progress);
    });
    es.addEventListener('scan_done', function (ev) {
      var d = JSON.parse(ev.data);
      es.close();
      renderResult(d.teaser || {});
    });
    es.addEventListener('error', function (ev) {
      // event "error" applicatif (data présent) vs erreur transport (pas de data)
      if (ev.data) {
        var d = JSON.parse(ev.data);
        es.close();
        if (d.requeued) {
          el.progressEngine.textContent = 'Petit contretemps technique — nouvelle tentative automatique…';
          startPolling();
        } else {
          showErrorState('Le scan a échoué. Nos équipes sont prévenues — réessayez dans quelques minutes.');
        }
        return;
      }
      state.sseErrors += 1;
      if (state.sseErrors >= 2) { es.close(); startPolling(); }
    });
  }

  function updateProgress(progress) {
    if (!progress || !progress.total) return;
    var pct = Math.max(4, Math.round((progress.done / progress.total) * 100));
    el.progressBar.style.width = pct + '%';
    el.progressBarWrap.setAttribute('aria-valuenow', String(pct));
  }

  function startPolling() {
    if (state.pollTimer) return;
    state.pollTimer = setInterval(pollStatusOnce, 5000);
    pollStatusOnce();
  }

  function stopPolling() {
    if (state.pollTimer) { clearInterval(state.pollTimer); state.pollTimer = null; }
  }

  function pollStatusOnce() {
    fetch(GEO_API + '/api/public/scan/' + state.scanId + '/status')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.status === 'done') {
          stopPolling();
          renderResult(d.teaser || {});
        } else if (d.status === 'failed') {
          stopPolling();
          showErrorState('Le scan a échoué. Réessayez dans quelques minutes.');
        } else {
          showState('progress');
          if (d.progress) updateProgress(d.progress);
        }
      })
      .catch(function () { /* on retentera au prochain tick */ });
  }

  // ============================================================================
  // Résultat (teaser anonymisé — zéro nom de tiers, §C.5)
  // ============================================================================
  function renderResult(teaser) {
    var score = typeof teaser.score === 'number' ? teaser.score : 0;
    el.resultScore.textContent = score.toFixed(1).replace('.', ',') + '%';
    el.resultScore.className = 'text-5xl font-bold ' +
      (score >= 30 ? 'text-emerald-600' : (score > 0 ? 'text-amber-600' : 'text-red-600'));
    el.resultBenchmark.textContent = score === 0
      ? '90% des TPE/PME sont invisibles dans les assistants IA — la place est à prendre.'
      : 'Votre entreprise apparaît déjà dans certaines réponses : un socle à consolider.';

    el.resultQueries.innerHTML = '';
    (teaser.queries || []).forEach(function (q) {
      var div = document.createElement('div');
      div.className = 'rounded-lg border p-3.5 ' + (q.visible ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white');
      var engines = Object.keys(q.engines || {}).map(function (name) {
        var f = q.engines[name];
        var ok = f.mentioned || f.cited;
        return (ENGINE_NAMES[name] || name) + ' ' + (ok ? '✓' : '✗');
      }).join(' · ');
      div.innerHTML = '<p class="text-sm text-slate-900 mb-1"></p><p class="text-xs"></p>';
      div.children[0].textContent = '« ' + q.query + ' »';
      div.children[1].innerHTML = (q.visible
        ? '<span class="font-semibold text-emerald-700">✅ Visible</span>'
        : '<span class="font-semibold text-red-600">❌ Invisible</span>')
        + ' <span class="text-slate-500">· ' + engines + '</span>';
      el.resultQueries.appendChild(div);
    });

    if (teaser.competitors_message) {
      el.resultCompetitors.textContent = teaser.competitors_message;
      el.resultCompetitors.classList.remove('hidden');
      el.resultCompetitors.className = (teaser.competitors_count > 0)
        ? 'rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 mb-5'
        : 'rounded-lg bg-indigo-50 border border-indigo-200 p-4 text-sm text-indigo-900 mb-5';
    }

    el.resultEmailNote.textContent = state.email
      ? 'Le rapport détaillé a été envoyé à ' + state.email + '.'
      : '';

    showState('result');
    track('GEO Scan: resultat affiche', { score: String(Math.round(score)), competitors: String(teaser.competitors_count || 0) });
  }

  // ============================================================================
  // Erreurs
  // ============================================================================
  function showErrorState(message) {
    if (state.eventSource) { state.eventSource.close(); state.eventSource = null; }
    stopPolling();
    if (message) el.errorMessage.textContent = message;
    showState('error');
    track('GEO Scan: erreur');
  }

  el.errorRetry.addEventListener('click', function () {
    showState(state.entreprise ? 'confirm' : 'hook');
  });

  // ============================================================================
  // Init
  // ============================================================================
  showState('hook');
})();
