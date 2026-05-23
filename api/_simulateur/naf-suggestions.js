// =============================================================================
// Table NAF → IDCC / branche NAF fallback (suggestion validée OU auto-appliquée)
// =============================================================================
// Quand DINUM + siret2idcc ne retournent pas d'IDCC, on consulte cette table à
// partir du code NAF (toujours fourni par DINUM). Deux régimes selon le flag
// `auto` (S6.6.3, consensus Claude+Gemini Pro avec ajustements stricts) :
//
//   auto: true  (≥95% confiance + métier homogène — Syntec, Afdas, pharmacie,
//                boulangerie, coiffure) → CALCUL AUTOMATIQUE côté serveur si
//                effectif > 0, avec disclaimer fort UI+email. Le prospect peut
//                modifier sa convention via un bouton "Changer ma convention".
//
//   auto: false (80-94% confiance OU métier fragmenté comme le BTP) →
//                pré-suggestion dans le select au form manual, validation
//                explicite par clic.
//
// Décision Gemini Pro 7.5/10 (challenge 2026-05-23) :
//   - BTP TOTALEMENT RETIRÉ de l'auto (fragmentation IDCC artisanat / PME / ETAM
//     / taille / statut — risque massif faux positifs malgré 95% NAF→Constructys)
//   - Auto-apply uniquement si effectif > 0 (TNS sans salarié = pas d'OPCO)
//   - Disclaimer email visuellement disruptif (bandeau coloré, pas ligne grise)
//
// Sources : DARES répartition OPCO par NAF, INSEE NAF rev2 2026, mappings
// déclarés par les OPCO sur leurs sites officiels.

// Mapping cle = code NAF (notation INSEE "XX.XXX" ou "XX.XX[A-Z]")
// Valeur = { value: string, auto: boolean }
//   value = IDCC numérique en string ("1486") ou slug naf_fallback ("afdas-publicite")
//   auto  = true → application automatique au calcul (skip manual state)
//           false → suggestion à valider via select manual
export const NAF_TO_IDCC_SUGGESTION = {
  // ===== AUTO-APPLICATION (≥95% confiance, métiers homogènes) =====

  // SYNTEC — Conseil, IT, ingénierie (~95%)
  '62.01Z': { value: '1486', auto: true },
  '62.02A': { value: '1486', auto: true },
  '62.02B': { value: '1486', auto: true },
  '62.03Z': { value: '1486', auto: true },
  '62.09Z': { value: '1486', auto: true },
  '63.11Z': { value: '1486', auto: true },
  '63.12Z': { value: '1486', auto: true },
  '70.21Z': { value: '1486', auto: true },
  '70.22Z': { value: '1486', auto: true },
  '71.12B': { value: '1486', auto: true },

  // AFDAS — Audiovisuel / Cinéma (~98%)
  '60.10Z': { value: 'afdas-audiovisuel', auto: true },
  '60.20Z': { value: 'afdas-audiovisuel', auto: true },
  '59.11A': { value: 'afdas-audiovisuel', auto: true },
  '59.11B': { value: 'afdas-audiovisuel', auto: true },
  '59.11C': { value: 'afdas-audiovisuel', auto: true },
  '59.12Z': { value: 'afdas-audiovisuel', auto: true },
  '59.13A': { value: 'afdas-audiovisuel', auto: true },
  '59.13B': { value: 'afdas-audiovisuel', auto: true },
  '59.14Z': { value: 'afdas-audiovisuel', auto: true },

  // AFDAS — Télécommunications (~98%)
  '61.10Z': { value: 'afdas-telecommunications', auto: true },
  '61.20Z': { value: 'afdas-telecommunications', auto: true },
  '61.30Z': { value: 'afdas-telecommunications', auto: true },
  '61.90Z': { value: 'afdas-telecommunications', auto: true },

  // AFDAS — Publicité (~95%)
  '73.11Z': { value: 'afdas-publicite', auto: true },
  '73.12Z': { value: 'afdas-publicite', auto: true },

  // AFDAS — Spectacle vivant (~95%)
  '90.01Z': { value: 'afdas-spectacle-vivant', auto: true },
  '90.02Z': { value: 'afdas-spectacle-vivant', auto: true },
  '90.03A': { value: 'afdas-spectacle-vivant', auto: true },
  '90.03B': { value: 'afdas-spectacle-vivant', auto: true },
  '90.04Z': { value: 'afdas-spectacle-vivant', auto: true },

  // Pharmacie d'officine (~98%)
  '47.73Z': { value: '1996', auto: true },

  // Boulangerie-pâtisserie artisanale (~95%)
  '10.71B': { value: '843', auto: true },
  '10.71C': { value: '843', auto: true },
  '10.71D': { value: '843', auto: true },

  // Coiffure et soins de beauté (~95%)
  '96.02A': { value: '2596', auto: true },
  '96.02B': { value: '2596', auto: true },

  // ===== SUGGESTION-ONLY (80-94% confiance OU métier fragmenté) =====

  // CONSTRUCTYS — Bâtiment (~95% mais BTP fragmenté : artisanat / PME / ETAM / Cadres)
  '41.10A': { value: 'constructys-bat', auto: false },
  '41.10B': { value: 'constructys-bat', auto: false },
  '41.20A': { value: 'constructys-bat', auto: false },
  '41.20B': { value: 'constructys-bat', auto: false },
  '43.11Z': { value: 'constructys-bat', auto: false },
  '43.12A': { value: 'constructys-bat', auto: false },
  '43.12B': { value: 'constructys-bat', auto: false },
  '43.13Z': { value: 'constructys-bat', auto: false },
  '43.21A': { value: 'constructys-bat', auto: false },
  '43.22A': { value: 'constructys-bat', auto: false },
  '43.22B': { value: 'constructys-bat', auto: false },
  '43.29A': { value: 'constructys-bat', auto: false },
  '43.29B': { value: 'constructys-bat', auto: false },
  '43.31Z': { value: 'constructys-bat', auto: false },
  '43.32A': { value: 'constructys-bat', auto: false },
  '43.32B': { value: 'constructys-bat', auto: false },
  '43.32C': { value: 'constructys-bat', auto: false },
  '43.33Z': { value: 'constructys-bat', auto: false },
  '43.34Z': { value: 'constructys-bat', auto: false },
  '43.39Z': { value: 'constructys-bat', auto: false },
  '43.91A': { value: 'constructys-bat', auto: false },
  '43.91B': { value: 'constructys-bat', auto: false },
  '43.99A': { value: 'constructys-bat', auto: false },
  '43.99C': { value: 'constructys-bat', auto: false },

  // CONSTRUCTYS — Travaux Publics (~95% mais même fragmentation)
  '42.11Z': { value: 'constructys-tp', auto: false },
  '42.12Z': { value: 'constructys-tp', auto: false },
  '42.13A': { value: 'constructys-tp', auto: false },
  '42.13B': { value: 'constructys-tp', auto: false },
  '42.21Z': { value: 'constructys-tp', auto: false },
  '42.22Z': { value: 'constructys-tp', auto: false },
  '42.91Z': { value: 'constructys-tp', auto: false },
  '42.99Z': { value: 'constructys-tp', auto: false },

  // CONSTRUCTYS — Négoce matériaux (~85%)
  '46.73A': { value: 'constructys-negoce', auto: false },
  '46.73B': { value: 'constructys-negoce', auto: false },
  '47.52A': { value: 'constructys-negoce', auto: false },
  '47.52B': { value: 'constructys-negoce', auto: false },

  // AFDAS — Sport / Loisirs (~90%)
  '93.11Z': { value: 'afdas-sport', auto: false },
  '93.12Z': { value: 'afdas-sport', auto: false },
  '93.13Z': { value: 'afdas-sport', auto: false },
  '93.19Z': { value: 'afdas-sport', auto: false },
  '93.29Z': { value: 'afdas-sport', auto: false },

  // AFDAS — Tourisme (~85%)
  '79.11A': { value: 'afdas-tourisme', auto: false },
  '79.11B': { value: 'afdas-tourisme', auto: false },
  '79.12Z': { value: 'afdas-tourisme', auto: false },
  '79.90Z': { value: 'afdas-tourisme', auto: false },

  // AFDAS — Hôtellerie de Plein Air (~90%)
  '55.30Z': { value: 'afdas-hpa', auto: false },

  // HCR — Hôtellerie, cafés, restaurants (~90%)
  '55.10Z': { value: '1979', auto: false },
  '56.10A': { value: '1979', auto: false },
  '56.10B': { value: '1979', auto: false },
  '56.30Z': { value: '1979', auto: false },

  // Services automobile (~90%)
  '45.11Z': { value: '1090', auto: false },
  '45.20A': { value: '1090', auto: false },
  '45.20B': { value: '1090', auto: false },
  '45.31Z': { value: '1090', auto: false },
  '45.32Z': { value: '1090', auto: false },
  '45.40Z': { value: '1090', auto: false },
};

// Retourne soit { type, value, naf, auto } soit null.
// Le caller doit valider que la suggestion existe bien dans idcc_index ou
// naf_fallback_index avant de l'appliquer (défense en profondeur — on évite
// de pointer vers une convention disparue de la BDD).
export function suggestFromNaf(naf, validIdccs, validBranches) {
  if (typeof naf !== 'string') return null;
  const code = naf.trim().toUpperCase();
  const entry = NAF_TO_IDCC_SUGGESTION[code];
  if (!entry) return null;
  const raw = entry.value;
  const auto = Boolean(entry.auto);
  // Convention numérique → IDCC
  if (/^\d+$/.test(raw)) {
    const idcc = Number.parseInt(raw, 10);
    if (validIdccs && !validIdccs.has(idcc)) return null;
    return { type: 'idcc', value: idcc, naf: code, auto };
  }
  // Sinon → slug naf_fallback
  if (validBranches && !validBranches.has(raw)) return null;
  return { type: 'branche', value: raw, naf: code, auto };
}
