// =============================================================================
// Table NAF → IDCC / branche NAF fallback (pré-suggestion validée par l'utilisateur)
// =============================================================================
// Quand DINUM + siret2idcc ne retournent pas d'IDCC, on consulte cette table à
// partir du code NAF (toujours fourni par DINUM). Si match, on PRÉ-SUGGÈRE
// dans le select côté front avec un libellé "supposé d'après votre NAF".
//
// Différence avec une heuristique auto rejetée par le PRD (lesson 2026-05-23-07) :
// ici on ne CALCULE PAS automatiquement le budget. On suggère seulement, le
// prospect valide explicitement → zéro faux positif silencieux.
//
// Seuil de confiance minimal : 80% (consensus Claude + Gemini Pro 9.5/10).
// Cas ambigus (split 50/50 ou 60/40) → pas de mapping dans la table.
//
// Sources : DARES répartition OPCO par NAF, INSEE NAF rev2 2026, mappings
// déclarés par les OPCO sur leurs sites officiels.

// Mapping cle = code NAF (notation INSEE "XX.XXX" ou "XX.XX[A-Z]")
// Valeur = soit string IDCC ("1486") soit slug naf_fallback ("afdas-publicite")
export const NAF_TO_IDCC_SUGGESTION = {
  // SYNTEC — Conseil, IT, ingénierie (~95%)
  '62.01Z': '1486', '62.02A': '1486', '62.02B': '1486', '62.03Z': '1486',
  '62.09Z': '1486', '63.11Z': '1486', '63.12Z': '1486', '70.21Z': '1486',
  '70.22Z': '1486', '71.12B': '1486',

  // AFDAS — Audiovisuel / Cinéma (~98%)
  '60.10Z': 'afdas-audiovisuel', '60.20Z': 'afdas-audiovisuel',
  '59.11A': 'afdas-audiovisuel', '59.11B': 'afdas-audiovisuel',
  '59.11C': 'afdas-audiovisuel', '59.12Z': 'afdas-audiovisuel',
  '59.13A': 'afdas-audiovisuel', '59.13B': 'afdas-audiovisuel',
  '59.14Z': 'afdas-audiovisuel',

  // AFDAS — Télécommunications (~98%)
  '61.10Z': 'afdas-telecommunications', '61.20Z': 'afdas-telecommunications',
  '61.30Z': 'afdas-telecommunications', '61.90Z': 'afdas-telecommunications',

  // AFDAS — Publicité (~95%)
  '73.11Z': 'afdas-publicite', '73.12Z': 'afdas-publicite',

  // CONSTRUCTYS — Bâtiment (~95%)
  '41.10A': 'constructys-bat', '41.10B': 'constructys-bat',
  '41.20A': 'constructys-bat', '41.20B': 'constructys-bat',
  '43.11Z': 'constructys-bat', '43.12A': 'constructys-bat',
  '43.12B': 'constructys-bat', '43.13Z': 'constructys-bat',
  '43.21A': 'constructys-bat', '43.22A': 'constructys-bat',
  '43.22B': 'constructys-bat', '43.29A': 'constructys-bat',
  '43.29B': 'constructys-bat', '43.31Z': 'constructys-bat',
  '43.32A': 'constructys-bat', '43.32B': 'constructys-bat',
  '43.32C': 'constructys-bat', '43.33Z': 'constructys-bat',
  '43.34Z': 'constructys-bat', '43.39Z': 'constructys-bat',
  '43.91A': 'constructys-bat', '43.91B': 'constructys-bat',
  '43.99A': 'constructys-bat', '43.99C': 'constructys-bat',

  // CONSTRUCTYS — Travaux Publics (~95%)
  '42.11Z': 'constructys-tp', '42.12Z': 'constructys-tp',
  '42.13A': 'constructys-tp', '42.13B': 'constructys-tp',
  '42.21Z': 'constructys-tp', '42.22Z': 'constructys-tp',
  '42.91Z': 'constructys-tp', '42.99Z': 'constructys-tp',

  // CONSTRUCTYS — Négoce matériaux (~85%)
  '46.73A': 'constructys-negoce', '46.73B': 'constructys-negoce',
  '47.52A': 'constructys-negoce', '47.52B': 'constructys-negoce',

  // AFDAS — Sport / Loisirs (~90%)
  '93.11Z': 'afdas-sport', '93.12Z': 'afdas-sport',
  '93.13Z': 'afdas-sport', '93.19Z': 'afdas-sport',
  '93.29Z': 'afdas-sport',

  // AFDAS — Spectacle vivant (~95%)
  '90.01Z': 'afdas-spectacle-vivant', '90.02Z': 'afdas-spectacle-vivant',
  '90.03A': 'afdas-spectacle-vivant', '90.03B': 'afdas-spectacle-vivant',
  '90.04Z': 'afdas-spectacle-vivant',

  // AFDAS — Tourisme et Hôtellerie de Plein Air (~85-90%)
  '79.11A': 'afdas-tourisme', '79.11B': 'afdas-tourisme',
  '79.12Z': 'afdas-tourisme', '79.90Z': 'afdas-tourisme',
  '55.30Z': 'afdas-hpa',

  // IDCC directs (sectoriels à confiance élevée)
  // Boulangerie-pâtisserie artisanale (~95%)
  '10.71B': '843', '10.71C': '843', '10.71D': '843',

  // HCR — Hôtellerie, cafés, restaurants (~90%)
  '55.10Z': '1979', '56.10A': '1979', '56.10B': '1979', '56.30Z': '1979',

  // Pharmacie d'officine (~98%)
  '47.73Z': '1996',

  // Coiffure et soins de beauté (~95%)
  '96.02A': '2596', '96.02B': '2596',

  // Services automobile (~90%)
  '45.11Z': '1090', '45.20A': '1090', '45.20B': '1090',
  '45.31Z': '1090', '45.32Z': '1090', '45.40Z': '1090',
};

// Retourne soit { type: 'idcc', value: number } soit { type: 'branche', value: string } soit null
// Le caller (compute-engine) doit valider que la suggestion existe bien dans
// idcc_index ou naf_fallback_index avant de la retourner au front (défense en
// profondeur — on évite de suggérer une convention disparue de la BDD).
export function suggestFromNaf(naf, validIdccs, validBranches) {
  if (typeof naf !== 'string') return null;
  const code = naf.trim().toUpperCase();
  const raw = NAF_TO_IDCC_SUGGESTION[code];
  if (!raw) return null;
  // Convention numérique → IDCC
  if (/^\d+$/.test(raw)) {
    const idcc = Number.parseInt(raw, 10);
    if (validIdccs && !validIdccs.has(idcc)) return null;
    return { type: 'idcc', value: idcc, naf: code };
  }
  // Sinon → slug naf_fallback
  if (validBranches && !validBranches.has(raw)) return null;
  return { type: 'branche', value: raw, naf: code };
}
