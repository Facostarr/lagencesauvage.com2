// =============================================================================
// Templates Resend pour récap simulation OPCO au prospect
// =============================================================================
// Deux variantes :
//   - sendBudgetRecap : cas nominal (budget chiffrable)
//   - sendManualRecap : cas particulier (pas de budget — analyse manuelle)
//
// Disclaimer légal obligatoire dans les deux variantes (PRD section 7).

import { Resend } from 'resend';

const FROM = "L'Agence Sauvage <hello@lagencesauvage.com>";
const CTA_URL = 'https://www.lagencesauvage.com/diagnostic/';
const DISCLAIMER =
  "Les montants indiqués sont fournis à titre indicatif (source : DGEFP, règles 2026) et sont sans valeur contractuelle. Seul votre OPCO détient le pouvoir d'engagement financier après étude de votre dossier complet.";

function formatEur(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' €';
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function dispositifsListHtml(dispositifs) {
  if (!Array.isArray(dispositifs) || dispositifs.length === 0) return '';
  const items = dispositifs
    .filter((d) => d?.inclus_dans_budget_chiffre || d?.cle === 'fne_formation')
    .map((d) => {
      const libelle = escapeHtml(d?.libelle ?? '—');
      const plafond = d?.plancher_garanti_eur != null ? formatEur(d.plancher_garanti_eur) : 'sur projet';
      return `<li style="margin-bottom:6px"><strong>${libelle}</strong> · plafond ${plafond}</li>`;
    })
    .join('');
  if (!items) return '';
  return `<ul style="margin:16px 0 0;padding:0 0 0 20px;color:#1f2937">${items}</ul>`;
}

function warningsHtml(warnings) {
  if (!Array.isArray(warnings) || warnings.length === 0) return '';
  const items = warnings.map((w) => `<li style="margin-bottom:6px">${escapeHtml(w)}</li>`).join('');
  return `<div style="margin-top:20px;padding:16px;background:#fef3c7;border-radius:8px"><p style="margin:0 0 8px;font-weight:600;color:#92400e">À noter :</p><ul style="margin:0;padding-left:20px;color:#78350f">${items}</ul></div>`;
}

function shell({ prenom, bodyHtml }) {
  const safe = escapeHtml(prenom || '');
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06)">
        <tr><td style="background:#0f172a;padding:32px 40px">
          <p style="margin:0;color:#a5b4fc;font-size:13px;letter-spacing:0.08em;text-transform:uppercase">Simulateur OPCO 2026</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:700">Votre simulation est prête${safe ? ', ' + safe : ''}</h1>
        </td></tr>
        <tr><td style="padding:32px 40px">
          ${bodyHtml}
          <div style="margin-top:32px;text-align:center">
            <a href="${CTA_URL}" style="display:inline-block;background:#4F46E5;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600">Échangez 30 minutes avec un expert</a>
          </div>
          <p style="margin:32px 0 0;font-size:13px;color:#64748b;line-height:1.5">${DISCLAIMER}</p>
        </td></tr>
        <tr><td style="background:#f1f5f9;padding:20px 40px;text-align:center">
          <p style="margin:0;font-size:13px;color:#64748b">L'Agence Sauvage · <a href="mailto:hello@lagencesauvage.com" style="color:#4F46E5;text-decoration:none">hello@lagencesauvage.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildBudgetBody({ entreprise, result }) {
  const min = result?.budget_min_eur;
  const max = result?.budget_max_eur;
  const fourchette = min != null && max != null && min !== max
    ? `Entre ${formatEur(min)} et ${formatEur(max)}`
    : max != null
    ? `Jusqu'à ${formatEur(max)}`
    : 'À calculer en entretien';

  return `
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#334155">
      Votre entreprise <strong>${escapeHtml(entreprise?.nom_complet || '')}</strong> est rattachée à l'OPCO <strong>${escapeHtml(result?.opco_nom || '—')}</strong>${result?.branche_nom ? ` (convention « ${escapeHtml(result.branche_nom)} »)` : ''}.
    </p>
    <div style="margin:24px 0;padding:24px;background:#eef2ff;border-radius:12px;text-align:center">
      <p style="margin:0;font-size:13px;color:#4338ca;letter-spacing:0.05em;text-transform:uppercase;font-weight:600">Budget formation 2026</p>
      <p style="margin:8px 0 0;font-size:28px;color:#1e1b4b;font-weight:700">${fourchette}</p>
    </div>
    <h3 style="margin:24px 0 0;color:#0f172a;font-size:16px">Dispositifs activables</h3>
    ${dispositifsListHtml(result?.dispositifs_actives)}
    ${warningsHtml(result?.warnings)}`;
}

function buildManualBody({ entreprise, result }) {
  const message = result?.message_cas_particulier
    ?? "Votre situation requiert une analyse manuelle. Notre équipe vous orientera vers le bon dispositif de financement.";
  return `
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#334155">
      Votre entreprise <strong>${escapeHtml(entreprise?.nom_complet || '')}</strong>${result?.opco_nom ? ` est rattachée à l'OPCO <strong>${escapeHtml(result.opco_nom)}</strong>` : ''}.
    </p>
    <div style="margin:24px 0;padding:24px;background:#fef3c7;border-radius:12px">
      <p style="margin:0 0 12px;font-size:14px;color:#92400e;letter-spacing:0.05em;text-transform:uppercase;font-weight:600">Analyse manuelle requise</p>
      <p style="margin:0;font-size:16px;color:#78350f;line-height:1.6">${escapeHtml(message)}</p>
    </div>
    <p style="margin:24px 0 0;font-size:15px;color:#334155;line-height:1.6">
      Échangez 30 minutes avec un expert. Nous identifions ensemble votre dispositif de financement et votre cas d'usage prioritaire.
    </p>`;
}

export async function sendRecapToProspect({ email, prenom, entreprise, result }) {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY manquante.');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const isManual = Boolean(result?.cas_particulier) || !result?.budget_chiffrable;
  const bodyHtml = isManual ? buildManualBody({ entreprise, result }) : buildBudgetBody({ entreprise, result });
  const html = shell({ prenom, bodyHtml });
  const subject = isManual
    ? 'Votre simulation OPCO — analyse manuelle requise'
    : `Votre budget OPCO 2026 : ${entreprise?.nom_complet ?? 'votre entreprise'}`;
  const { error } = await resend.emails.send({ from: FROM, to: email, subject, html });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
