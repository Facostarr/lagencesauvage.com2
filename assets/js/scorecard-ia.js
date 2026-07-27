/* =============================================================================
   Scorecard IA — Le test des 7 signaux
   Outil interactif auto-scoré : intro -> 7 questions -> resultat + capture email.
   100% cote client (le scoring ne depend d'aucune API). La capture email POST
   vers /api/submit-lead-magnet (magnet 'scorecard-ia'), meme pipeline que les
   autres lead magnets. Evenements Plausible pour le suivi.
   Sortie silencieuse si le card #scorecard-card est absent de la page.
   ============================================================================= */
(function () {
  'use strict';

  var root = document.getElementById('scorecard-card');
  if (!root) return;

  // ---------------------------------------------------------------------------
  // Source unique : les 7 signaux (question + 3 reponses indexees 0/1/2 + reco)
  // ---------------------------------------------------------------------------
  var DIMENSIONS = [
    {
      titre: 'Un responsable, un vrai problème',
      question: 'Qui porte le projet, et sur quel chiffre s’engage-t-il ?',
      hint: '',
      options: [
        'Un dirigeant soutient l’idée, mais personne ne la pilote, et l’objectif se résume à « faire de l’IA ».',
        'Un responsable est identifié, mais l’objectif chiffré reste flou, ou personne ne le suit vraiment au quotidien.',
        'Une personne nommée pilote le projet au quotidien et répond d’un chiffre précis qui fait mal : temps perdu, erreurs, retards, coûts.'
      ],
      reco: 'Nommez un responsable unique et fixez le chiffre qu’il doit faire bouger.'
    },
    {
      titre: 'L’adoption au quotidien',
      question: 'L’outil vit-il là où vos équipes travaillent déjà ?',
      hint: '',
      options: [
        'Il oblige à changer de réflexe ou à ouvrir une application de plus, que personne n’a envie de lancer.',
        'Il demande quelques nouveaux réflexes, mais reste proche des outils que les équipes utilisent déjà.',
        'Il vit dans leurs outils actuels (boîte mail, logiciel métier, messagerie), sans rien changer à leurs habitudes.'
      ],
      reco: 'Faites vivre l’outil dans les logiciels déjà utilisés, sans nouvelle application à ouvrir.'
    },
    {
      titre: 'Confiance et garde-fous',
      question: 'Que se passe-t-il quand l’IA se trompe ?',
      hint: 'Un garde-fou : une règle qui bloque le pire scénario avant qu’il n’arrive.',
      options: [
        'L’outil tourne seul dès le départ, répond sans jamais montrer d’où vient l’info, et rien n’arrête une réponse fausse avant qu’elle ne parte.',
        'Il y a une validation humaine ou des sources citées, mais pas les deux, et le garde-fou reste partiel.',
        'Un humain valide là où l’enjeu est fort, les réponses citent leurs sources, et un garde-fou bloque le pire scénario (le mauvais envoi, la donnée fausse).'
      ],
      reco: 'Ajoutez une validation humaine sur les cas sensibles et un garde-fou sur l’envoi.'
    },
    {
      titre: 'Branché à vos données et vos outils',
      question: 'L’outil est-il relié à vos vraies données, ou à une démo ?',
      hint: 'Un bac à sable : un environnement de test, coupé de vos vraies données.',
      options: [
        'C’est une démo dans un bac à sable, sur des données d’exemple, sans chemin réaliste vers la production.',
        'Une partie est déjà connectée, mais le passage vers vos vrais outils demande encore du travail.',
        'Il est relié à vos vraies données et vos vrais logiciels, en toute sécurité, et chaque action reste réversible.'
      ],
      reco: 'Branchez l’outil sur vos vraies données et vos vrais logiciels, avec des actions réversibles.'
    },
    {
      titre: 'La qualité, mesurée',
      question: 'Comment mesurez-vous que l’outil répond juste ?',
      hint: 'Une série de cas de test : un jeu d’exemples avec la bonne réponse attendue, rejoué à chaque évolution.',
      options: [
        '« Ça marchait très bien en démo » est le seul test qui ait jamais été fait.',
        'Vous faites des vérifications ponctuelles, mais sans série de cas de test formalisée.',
        'Vous avez une série de cas de test et des indicateurs : la qualité est mesurée noir sur blanc et s’améliore avec le temps.'
      ],
      reco: 'Constituez une série de cas de test pour mesurer la qualité autrement qu’en démo.'
    },
    {
      titre: 'Valeur et coût réel',
      question: 'Le gain et le coût sont-ils chiffrés ?',
      hint: 'Le coût par utilisation : ce que vous coûte chaque appel à l’outil, à multiplier par le volume réel.',
      options: [
        'La valeur reste une impression, et le vrai coût se découvre le jour où la facture arrive.',
        'Le gain est estimé, mais le coût réel quand le volume monte reste incertain.',
        'Le gain est chiffré (heures gagnées, erreurs évitées, chiffre d’affaires) et le coût par utilisation reste tenable quand le volume augmente.'
      ],
      reco: 'Chiffrez le gain attendu et vérifiez que le coût par utilisation tient quand le volume monte.'
    },
    {
      titre: 'Les équipes embarquées',
      question: 'Les équipes dont le métier change ont-elles été associées ?',
      hint: '',
      options: [
        'Le projet est imposé aux équipes au lieu d’être construit avec elles, et personne ne porte le changement.',
        'Les équipes ont été informées, mais associées tard, sans vrai relais interne.',
        'Les personnes concernées sont associées dès le début et montées en compétence, avec un ambassadeur visible en interne.'
      ],
      reco: 'Associez dès maintenant les personnes dont le métier change et désignez un ambassadeur interne.'
    }
  ];

  var FONDAMENTALES = [0, 1, 2]; // responsable, adoption, confiance

  var BANDS = {
    vert:   { label: 'Solide',        cls: 'sc-band-vert',   verdict: 'Votre projet a toutes les chances de passer en production. Les fondations sont là : vous pouvez engager le budget de généralisation.' },
    orange: { label: 'À consolider',  cls: 'sc-band-orange', verdict: 'Du réel, mais avec des trous à combler. Ramenez chaque point rouge à au moins 1 avant de généraliser : c’est là que se joue la suite.' },
    rouge:  { label: 'Au stade démo', cls: 'sc-band-rouge',  verdict: 'Le potentiel existe, mais l’essentiel reste à poser : un responsable clair, une vraie adoption, ou la confiance. Reprenez ces fondations avant d’investir davantage.' }
  };

  var CTA_MESSAGE = {
    vert:   'Vos fondations sont solides. Cadrons ensemble le passage en production.',
    orange: 'Vous avez des points à consolider. En 30 minutes, on identifie lesquels traiter en premier.',
    rouge:  'Avant d’investir davantage, reprenons les fondations ensemble.'
  };

  // ---------------------------------------------------------------------------
  // Etat
  // ---------------------------------------------------------------------------
  var answers = new Array(DIMENSIONS.length).fill(null);
  var current = 0;

  // Raccourcis DOM
  function $(id) { return document.getElementById(id); }
  function show(el) { if (el) el.classList.remove('hidden'); }
  function hide(el) { if (el) el.classList.add('hidden'); }
  function announce(msg) { var live = $('sc-live'); if (live) live.textContent = msg; }
  function track(name, props) {
    try { if (window.plausible) window.plausible(name, props ? { props: props } : undefined); } catch (e) {}
  }

  var elIntro   = $('sc-intro');
  var elQuiz    = $('sc-quiz');
  var elResult  = $('sc-result');

  // ---------------------------------------------------------------------------
  // Scoring (fonction pure)
  // ---------------------------------------------------------------------------
  function computeScore(a) {
    var total = a.reduce(function (s, v) { return s + (v || 0); }, 0);
    var band = total >= 11 ? 'vert' : (total >= 7 ? 'orange' : 'rouge');
    var alerteDims = FONDAMENTALES
      .filter(function (i) { return a[i] === 0; })
      .map(function (i) { return DIMENSIONS[i].titre; });
    var rouges = a
      .map(function (v, i) { return v === 0 ? DIMENSIONS[i].titre : null; })
      .filter(Boolean);
    var recos = a
      .map(function (v, i) { return (v !== null && v <= 1) ? { titre: DIMENSIONS[i].titre, reco: DIMENSIONS[i].reco } : null; })
      .filter(Boolean);
    return {
      total: total,
      band: band,
      alerteFondamentale: alerteDims.length > 0,
      alerteDims: alerteDims,
      rouges: rouges,
      recos: recos
    };
  }

  // ---------------------------------------------------------------------------
  // Rendu d'une question
  // ---------------------------------------------------------------------------
  function renderQuestion() {
    var dim = DIMENSIONS[current];
    var total = DIMENSIONS.length;

    $('sc-progress-text').textContent = 'Question ' + (current + 1) + ' sur ' + total;
    $('sc-progress-bar').style.width = Math.round(((current + 1) / total) * 100) + '%';
    $('sc-legend').textContent = (current + 1) + '. ' + dim.titre;

    var hintEl = $('sc-hint');
    if (dim.hint) { hintEl.textContent = dim.hint; show(hintEl); }
    else { hintEl.textContent = ''; hide(hintEl); }

    $('sc-question-text').textContent = dim.question;

    var opts = $('sc-options');
    opts.innerHTML = '';
    // Ordre d'affichage : de "ça tient" (2) vers "ça cale" (0) pour ne pas induire
    var order = [2, 1, 0];
    order.forEach(function (val) {
      var id = 'sc-q' + current + '-' + val;
      var label = document.createElement('label');
      label.className = 'sc-option';
      label.setAttribute('for', id);

      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'sc-q' + current;
      input.id = id;
      input.value = String(val);
      input.className = 'sc-radio';
      if (answers[current] === val) { input.checked = true; label.classList.add('sc-option-selected'); }
      input.addEventListener('change', function () {
        answers[current] = val;
        var all = opts.querySelectorAll('.sc-option');
        for (var i = 0; i < all.length; i++) { all[i].classList.remove('sc-option-selected'); }
        label.classList.add('sc-option-selected');
        $('sc-next').disabled = false;
      });

      var span = document.createElement('span');
      span.className = 'sc-option-text';
      span.textContent = dim.options[val];

      label.appendChild(input);
      label.appendChild(span);
      opts.appendChild(label);
    });

    $('sc-prev').disabled = (current === 0);
    $('sc-next').disabled = (answers[current] === null);
    $('sc-next').textContent = (current === total - 1) ? 'Voir mon résultat' : 'Suivant';

    // Focus sur la question pour les lecteurs d'écran
    var fs = $('sc-fieldset');
    if (fs) { fs.setAttribute('tabindex', '-1'); fs.focus(); }
    announce('Question ' + (current + 1) + ' sur ' + total + ' : ' + dim.titre);
  }

  function goNext() {
    if (answers[current] === null) return;
    if (current < DIMENSIONS.length - 1) {
      current++;
      renderQuestion();
    } else {
      renderResult();
    }
  }

  function goPrev() {
    if (current > 0) { current--; renderQuestion(); }
  }

  // ---------------------------------------------------------------------------
  // Rendu du resultat
  // ---------------------------------------------------------------------------
  function renderResult() {
    var r = computeScore(answers);
    var band = BANDS[r.band];

    hide(elQuiz);
    show(elResult);

    $('sc-score-value').textContent = r.total + ' / 14';
    var badge = $('sc-band-badge');
    badge.textContent = band.label;
    badge.className = 'sc-band-badge ' + band.cls;
    $('sc-verdict').textContent = band.verdict;

    // Alerte fondamentale
    var alert = $('sc-alert');
    if (r.alerteFondamentale) {
      $('sc-alert-dims').textContent = r.alerteDims.join(', ');
      show(alert);
    } else {
      hide(alert);
    }

    // Detail par dimension
    var bd = $('sc-breakdown');
    bd.innerHTML = '';
    answers.forEach(function (v, i) {
      var row = document.createElement('div');
      row.className = 'sc-bd-row';
      var dot = document.createElement('span');
      var lvl = v === 2 ? 'vert' : (v === 1 ? 'orange' : 'rouge');
      dot.className = 'sc-dot sc-dot-' + lvl;
      dot.setAttribute('aria-hidden', 'true');
      var name = document.createElement('span');
      name.className = 'sc-bd-name';
      name.textContent = DIMENSIONS[i].titre;
      var pts = document.createElement('span');
      pts.className = 'sc-bd-pts';
      pts.textContent = v + '/2';
      row.appendChild(dot);
      row.appendChild(name);
      row.appendChild(pts);
      bd.appendChild(row);
    });

    // Recommandations
    var recoWrap = $('sc-recos');
    var recoList = $('sc-recos-list');
    recoList.innerHTML = '';
    if (r.recos.length) {
      r.recos.forEach(function (item) {
        var li = document.createElement('li');
        li.className = 'sc-reco-item';
        var strong = document.createElement('strong');
        strong.textContent = item.titre + ' : ';
        li.appendChild(strong);
        li.appendChild(document.createTextNode(item.reco));
        recoList.appendChild(li);
      });
      show(recoWrap);
    } else {
      hide(recoWrap);
    }

    // CTA contextualise
    $('sc-cta-message').textContent = CTA_MESSAGE[r.band];

    // Prepare la note de qualification (envoyee avec l'email)
    var note = 'Score ' + r.total + '/14 (' + band.label + ').';
    if (r.alerteDims.length) { note += ' Voyant rouge fondamental : ' + r.alerteDims.join(', ') + '.'; }
    else if (r.rouges.length) { note += ' Points à 0 : ' + r.rouges.join(', ') + '.'; }
    root.setAttribute('data-note', note);

    track('Scorecard Completed', { band: r.band, score: r.total });
    announce('Votre score : ' + r.total + " sur 14, niveau " + band.label + '.');

    // Recentre la vue sur le resultat
    var hero = document.getElementById('sc-hero');
    if (hero && hero.scrollIntoView) { hero.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

  // ---------------------------------------------------------------------------
  // Capture email
  // ---------------------------------------------------------------------------
  function bindEmailForm() {
    var form = $('sc-email-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = $('sc-email-btn');
      var success = $('sc-email-success');
      var error = $('sc-email-error');
      var firstName = $('sc-firstname').value.trim();
      var email = $('sc-email').value.trim();
      var phone = $('sc-phone') ? $('sc-phone').value.trim() : '';
      hide(error);

      if (!firstName || !email) {
        error.textContent = 'Prénom et email requis.';
        show(error);
        return;
      }

      btn.disabled = true;
      var originalLabel = btn.textContent;
      btn.textContent = 'Envoi…';

      fetch('/api/submit-lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          magnet: 'scorecard-ia',
          firstName: firstName,
          email: email,
          phone: phone,
          note: root.getAttribute('data-note') || ''
        })
      })
        .then(function (res) { return res.json(); })
        .then(function (d) {
          if (d && d.success) {
            form.style.display = 'none';
            success.textContent = '✓ Votre rapport est en route. Vérifiez votre boîte mail (pensez aux spams).';
            show(success);
          } else {
            error.textContent = (d && d.message) || 'Une erreur est survenue. Réessayez.';
            show(error);
            btn.disabled = false;
            btn.textContent = originalLabel;
          }
        })
        .catch(function () {
          error.textContent = 'Erreur réseau. Réessayez dans quelques instants.';
          show(error);
          btn.disabled = false;
          btn.textContent = originalLabel;
        });
    });
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  function startQuiz() {
    hide(elIntro);
    show(elQuiz);
    current = 0;
    renderQuestion();
    track('Scorecard Start');
  }

  var startBtn = $('sc-start');
  if (startBtn) { startBtn.addEventListener('click', startQuiz); }
  var nextBtn = $('sc-next');
  if (nextBtn) { nextBtn.addEventListener('click', goNext); }
  var prevBtn = $('sc-prev');
  if (prevBtn) { prevBtn.addEventListener('click', goPrev); }

  var ctaBtn = $('sc-cta');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function () {
      var r = computeScore(answers);
      track('Scorecard CTA Audit Click', { band: r.band });
    });
  }

  bindEmailForm();
})();
