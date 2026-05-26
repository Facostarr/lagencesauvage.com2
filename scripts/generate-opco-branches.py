#!/usr/bin/env python3
"""Génère 20 sous-pages branches IDCC depuis data/opco-database.json.

Une page Hugo par convention collective sous content/simulateur-opco/branches/{slug}.md.

Décisions architecturales (consensus Claude+Gemini Pro 8.5→9.5/10) :
- URL /simulateur-opco/branches/{slug}/ (silo propre, anti-collision OPCOs)
- H1 transactionnel "Simulateur Budget Formation X (IDCC n) — 2026"
- Pivot 50 salariés explicite (TPE <11 / PME 11-49 / ETI 50+)
- Tableaux HTML Tailwind stricts pour plafonds (boost GEO LLMs)
- notes_libres remonté en haut (anti-thin content)
- Maillage : OPCO parent + 3 branches voisines + article pilier + actions collectives
- Schema WebPage + FAQPage + BreadcrumbList (4 niveaux)
- <time datetime="2026"> visible pour signal fraîcheur

Utilisation :
    python scripts/generate-opco-branches.py [--only syntec-1486,akto-hcr-1979]
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "opco-database.json"
OUT_DIR = ROOT / "content" / "simulateur-opco" / "branches"

# -----------------------------------------------------------------------------
# Whitelist 20 branches priorisées (volume salariés + fit B2B IA + données BDD)
# Ordonnée par priorité décroissante. Consensus Gemini Pro 2026-05-23.
# -----------------------------------------------------------------------------
WHITELIST: list[str] = [
    "syntec-1486",                              # 900k sal, cœur cible ASV
    "akto-hcr-1979",                            # 900k sal, notes 3779 chars
    "opcommerce-cdna-1517",                     # 800k sal, commerce détail
    "opco2i-metallurgie-3127",                  # 1500k sal, trou comblé
    "opco-sante-sssms",                         # 700k sal, médico-social
    "akto-proprete-services-3043",              # 600k sal, propreté
    "mobilites-services-auto-1090",             # 400k sal, services auto
    "uniformation-saad",                        # 250k sal, aide à domicile
    "akto-prevention-securite-1351",            # 200k sal, sécurité privée
    "banque-2120",                              # 200k sal, banque
    "opco-sante-hp",                            # 200k sal, hospitalisation privée
    "assurances-1672",                          # 150k sal, assurances
    "ep-immobilier-1527",                       # 100k sal, immobilier
    "akto-restauration-rapide-1501",            # restauration rapide
    "opco2i-industrie-pharmaceutique-176",      # pharma industrie
    "akto-commerces-gros-573",                  # 500k sal, commerces de gros
    "akto-travail-temporaire-1413-2378",        # travail temporaire
    "constructys-bat",                          # 1100k sal, BTP bâtiment
    "opcommerce-cad-2198",                      # e-commerce
    "akto-portage-salarial-3219",               # portage, niche B2B fit
]

# Mapping slug branche → nom court SEO-friendly (titre H1, breadcrumb, FAQ).
# Le nom_branche complet peut faire 80+ chars (cas Syntec, médico-social), trop
# long pour des H1 transactionnels et meta descriptions optimisées.
BRANCHE_SHORT_NAMES: dict[str, str] = {
    "syntec-1486": "Syntec",
    "akto-hcr-1979": "HCR (Hôtellerie-Restauration)",
    "opcommerce-cdna-1517": "Commerces détail non alimentaires",
    "opco2i-metallurgie-3127": "Métallurgie",
    "opco-sante-sssms": "Médico-social privé",
    "akto-proprete-services-3043": "Propreté et services associés",
    "mobilites-services-auto-1090": "Services de l'automobile",
    "uniformation-saad": "Aide à domicile (SAAD)",
    "akto-prevention-securite-1351": "Prévention et sécurité",
    "banque-2120": "Banque",
    "opco-sante-hp": "Hospitalisation privée",
    "assurances-1672": "Sociétés d'assurances",
    "ep-immobilier-1527": "Immobilier",
    "akto-restauration-rapide-1501": "Restauration rapide",
    "opco2i-industrie-pharmaceutique-176": "Industrie pharmaceutique",
    "akto-commerces-gros-573": "Commerces de gros",
    "akto-travail-temporaire-1413-2378": "Travail temporaire",
    "constructys-bat": "Bâtiment",
    "opcommerce-cad-2198": "E-commerce et VAD",
    "akto-portage-salarial-3219": "Portage salarial",
}

# Mapping OPCO slug → label canonique (anti-doublon, cf. compute_opco_label)
OPCO_LABELS: dict[str, str] = {
    "afdas": "Afdas",
    "akto": "AKTO",
    "atlas": "Opco Atlas",
    "constructys": "Constructys",
    "ep": "OPCO EP",
    "mobilites": "OPCO Mobilités",
    "ocapiat": "OCAPIAT",
    "opco-sante": "OPCO Santé",
    "opco2i": "OPCO 2i",
    "opcommerce": "L'Opcommerce",
    "uniformation": "Uniformation",
}


# -----------------------------------------------------------------------------
# Helpers YAML (cf. lesson 2026-05-23 : Hugo 0.158 quote bug)
# -----------------------------------------------------------------------------
def yaml_escape(value) -> str:
    if value is None:
        return '""'
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    s = str(value)
    reserved_chars = set(":#&*!|>'\"%@`")
    needs_quote = (
        not s
        or s[0] in "-?[{,]} " + "".join(reserved_chars)
        or s[-1] == " "
        or any(c in reserved_chars for c in s)
        or s.strip().lower() in {"true", "false", "yes", "no", "null", "~"}
        or ": " in s
        or "  " in s
        or "\n" in s
    )
    if not needs_quote:
        return s
    return "'" + s.replace("'", "''") + "'"


def label_with_article(label: str) -> str:
    if label.startswith("L'"):
        return label
    return f"L'{label}"


# -----------------------------------------------------------------------------
# Rendu HTML Tailwind — tableau tranches PDC (anti-thin content, boost GEO)
# -----------------------------------------------------------------------------
def render_tranches_table_html(tranches: list[dict], opco_label: str) -> str:
    """Tableau HTML strict avec pivot 50 salariés visible (TPE/PME/ETI)."""
    if not tranches:
        return ""

    def fmt_eur(v) -> str:
        if v is None:
            return "sur projet"
        if isinstance(v, (int, float)):
            return f"{int(v):,} €".replace(",", " ")
        return str(v)

    def fmt_range(t: dict) -> str:
        mn = t.get("effectif_min")
        mx = t.get("effectif_max")
        if mn is None and mx is None:
            return "Toutes tailles"
        if mn is not None and mx is not None:
            return f"{mn} à {mx} salariés"
        if mx is None:
            return f"{mn}+ salariés"
        return f"≤ {mx} salariés"

    def categorize(t: dict) -> str:
        """Catégorie selon pivot 50 salariés (clé B2B + RAG LLMs)."""
        mx = t.get("effectif_max")
        mn = t.get("effectif_min") or 0
        if mn >= 50:
            return "ETI / +50"
        if mx is not None and mx <= 10:
            return "TPE / <11"
        if mn <= 10 and (mx is None or mx >= 11):
            return "TPE-PME"
        return "PME / 11-49"

    rows_html = []
    for t in tranches:
        cat = categorize(t)
        rng = fmt_range(t)
        plafond_annuel = fmt_eur(t.get("plafond_annuel_eur"))
        plafond_horaire = fmt_eur(t.get("plafond_horaire_eur"))
        plafond_dossier = fmt_eur(t.get("plafond_par_dossier_eur"))
        taux = t.get("taux_prise_en_charge")
        taux_str = f"{int(taux*100)}%" if taux else "—"
        note = (t.get("note") or "").strip()
        rows_html.append(
            f'    <tr class="border-t border-slate-200">\n'
            f'      <td class="px-4 py-3 text-sm font-semibold text-indigo-700 whitespace-nowrap">{cat}</td>\n'
            f'      <td class="px-4 py-3 text-sm text-slate-700">{rng}</td>\n'
            f'      <td class="px-4 py-3 text-sm text-slate-900 font-semibold whitespace-nowrap">{plafond_annuel}</td>\n'
            f'      <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">{plafond_horaire}</td>\n'
            f'      <td class="px-4 py-3 text-sm text-slate-700">{taux_str}</td>\n'
            f'    </tr>'
        )
        if note:
            rows_html.append(
                f'    <tr class="bg-slate-50/50 border-t border-slate-100">\n'
                f'      <td colspan="5" class="px-4 py-2 text-xs text-slate-600 italic">{note}</td>\n'
                f'    </tr>'
            )

    return (
        '<div class="not-prose my-8 overflow-x-auto rounded-xl border border-slate-200">\n'
        '  <table class="w-full text-left">\n'
        '    <caption class="sr-only">Plafonds PDC ' + opco_label + ' 2026 par tranche d\'effectif</caption>\n'
        '    <thead class="bg-slate-100">\n'
        '      <tr>\n'
        '        <th class="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">Catégorie</th>\n'
        '        <th class="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">Effectif</th>\n'
        '        <th class="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">Plafond annuel</th>\n'
        '        <th class="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">Plafond horaire</th>\n'
        '        <th class="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">Taux PEC</th>\n'
        '      </tr>\n'
        '    </thead>\n'
        '    <tbody>\n'
        + "\n".join(rows_html) +
        '\n    </tbody>\n'
        '  </table>\n'
        '</div>'
    )


def render_carte_identite_html(b: dict, opco_label: str, opco_slug: str) -> str:
    """Carte d'identité branche en HTML Tailwind (anti-thin)."""
    idccs = b.get("idcc_couverts") or []
    idccs_str = ", ".join(str(x) for x in idccs) if idccs else "À confirmer"
    contribution = "Oui (cotisation conventionnelle obligatoire)" if b.get("contribution_conventionnelle_requise") else "Non (contribution légale uniquement)"
    subrogation = b.get("subrogation_possible")
    if subrogation is True:
        subrogation_str = "Oui (OPCO paie directement l'organisme de formation)"
    elif subrogation is False:
        subrogation_str = "Non (avance puis remboursement)"
    else:
        subrogation_str = "À confirmer auprès de l'OPCO"
    date_maj = b.get("date_derniere_maj_humaine", b.get("date_scraping", "2026-05-12"))
    return (
        '<div class="not-prose my-8 rounded-2xl border-2 border-indigo-100 bg-indigo-50/30 p-5 sm:p-6">\n'
        '  <h2 class="text-sm font-bold uppercase tracking-wide text-indigo-700 mb-4">Carte d\'identité de la branche</h2>\n'
        '  <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">\n'
        '    <div>\n'
        '      <dt class="text-slate-500 mb-1">OPCO de rattachement</dt>\n'
        f'      <dd class="text-slate-900 font-semibold"><a href="/simulateur-opco/{opco_slug}/" class="text-indigo-700 hover:text-indigo-900 underline">{opco_label}</a></dd>\n'
        '    </div>\n'
        '    <div>\n'
        '      <dt class="text-slate-500 mb-1">IDCC(s) couvert(s)</dt>\n'
        f'      <dd class="text-slate-900 font-semibold">{idccs_str}</dd>\n'
        '    </div>\n'
        '    <div>\n'
        '      <dt class="text-slate-500 mb-1">Contribution conventionnelle</dt>\n'
        f'      <dd class="text-slate-900">{contribution}</dd>\n'
        '    </div>\n'
        '    <div>\n'
        '      <dt class="text-slate-500 mb-1">Subrogation OPCO</dt>\n'
        f'      <dd class="text-slate-900">{subrogation_str}</dd>\n'
        '    </div>\n'
        '    <div class="sm:col-span-2">\n'
        '      <dt class="text-slate-500 mb-1">Année d\'application des barèmes</dt>\n'
        f'      <dd class="text-slate-900"><time datetime="2026">2026</time> · Données vérifiées le {date_maj}</dd>\n'
        '    </div>\n'
        '  </dl>\n'
        '</div>'
    )


def render_sources(b: dict) -> str:
    sources = b.get("sources") or []
    if not sources:
        return ""
    lines = []
    for s in sources:
        url = s.get("url")
        date = s.get("date_consulte", "")
        if not url:
            continue
        lines.append(f"- [{url}]({url}) (consulté le {date})")
    return "\n".join(lines)


def render_dispositifs_supplementaires(b: dict, opco_label: str) -> list[str]:
    """Sections H3 conditionnelles selon les champs disponibles."""
    sections = []

    afest = b.get("afest") or {}
    if afest and afest.get("eligible") is not False:
        forfait = afest.get("forfait_horaire_eur")
        tranches = afest.get("tranches_effectifs") or []
        sections.append("### AFEST — Action de Formation En Situation de Travail")
        sections.append("")
        sections.append(
            "L'AFEST est un dispositif de formation **en situation de travail** : votre salarié "
            "est formé sur son poste, par un tuteur identifié dans l'entreprise. Particulièrement "
            "adapté aux compétences métier difficiles à externaliser (gestes techniques, processus internes)."
        )
        sections.append("")
        if forfait:
            sections.append(f"**Forfait horaire {opco_label} 2026** : {forfait} €/heure.")
            sections.append("")
        if tranches:
            for t in tranches:
                plancher = t.get("plancher_garanti_eur") or t.get("plafond_annuel_eur")
                mn = t.get("effectif_min")
                mx = t.get("effectif_max")
                if plancher:
                    label_t = f"{mn}–{mx}" if mx else f"{mn}+"
                    sections.append(f"- Tranche {label_t} salariés : plancher garanti **{int(plancher)} €/dossier**")
            sections.append("")

    parcours = b.get("parcours_strategique") or {}
    if parcours and parcours.get("eligible") is not False:
        sections.append("### Parcours stratégique TPE/PME")
        sections.append("")
        note = parcours.get("note") or ""
        if note:
            sections.append(note)
        else:
            sections.append(
                f"Dispositif {opco_label} dédié aux entreprises de moins de 50 salariés "
                "pour financer des parcours de formation stratégiques (transformation digitale, IA, "
                "RSE, transition écologique). Prise en charge possible jusqu'à 80% du coût pédagogique."
            )
        sections.append("")

    bonus = b.get("bonus_thematiques") or []
    if bonus:
        sections.append("### Bonus thématiques 2026")
        sections.append("")
        sections.append(
            f"En plus du PDC standard, {opco_label} peut majorer le financement sur certaines "
            "thématiques prioritaires :"
        )
        sections.append("")
        for bt in bonus[:6]:
            libelle = bt.get("libelle") or bt.get("thematique") or ""
            if libelle:
                sections.append(f"- **{libelle}**")
        sections.append("")

    return sections


# -----------------------------------------------------------------------------
# FAQ par branche (3-4 Q/R spécifiques)
# -----------------------------------------------------------------------------
def faq_entries(b: dict, opco_label: str) -> list[dict]:
    nom_branche = b.get("nom_branche") or ""
    idccs = b.get("idcc_couverts") or []
    idccs_str = ", ".join(str(x) for x in idccs) if idccs else "non rattachée"
    opco_label_art = label_with_article(opco_label)

    faq: list[dict] = []

    faq.append({
        "question": f"Comment savoir si mon entreprise relève de la convention {nom_branche} ?",
        "answer": (
            f"Votre IDCC (Identifiant De Convention Collective) est indiqué sur vos bulletins de paie "
            f"et sur votre Déclaration Sociale Nominative (DSN). Si vous ne le connaissez pas, "
            f"notre <a href=\"/simulateur-opco/\">simulateur identifie automatiquement votre convention</a> "
            f"depuis votre raison sociale ou votre SIREN, en interrogeant les bases publiques DINUM "
            f"et siret2idcc. Pour la branche {nom_branche}, l'IDCC est {idccs_str}."
        ),
    })

    if b.get("contribution_conventionnelle_requise"):
        faq.append({
            "question": f"La contribution conventionnelle est-elle obligatoire pour bénéficier du financement {opco_label} ?",
            "answer": (
                f"Oui. La branche {nom_branche} prévoit une <strong>contribution conventionnelle</strong> "
                f"versée à {opco_label} en plus de la contribution légale (0,55% sous 11 salariés, 1% au-delà). "
                f"Cette cotisation finance les dispositifs branche (AFEST, bonus thématiques, parcours stratégique). "
                f"Vérifiez votre situation auprès de votre expert-comptable ou directement auprès de "
                f"{opco_label_art}. Notre simulateur le précise dans le récapitulatif de votre simulation."
            ),
        })

    faq.append({
        "question": f"Quel budget formation 2026 puis-je espérer pour la branche {nom_branche} ?",
        "answer": (
            f"Le budget dépend de votre <strong>tranche d'effectif</strong> (TPE moins de 11 salariés, "
            f"PME de 11 à 49, ETI au-delà de 50) et des dispositifs activés. La fourchette typique va de "
            f"<strong>2 000 € à 15 000 € par an</strong> pour le seul Plan de Développement des Compétences, "
            f"hors bonus thématiques et parcours stratégique. "
            f"Pour un calcul précis basé sur les barèmes officiels {opco_label} 2026, "
            f"<a href=\"/simulateur-opco/\">lancez le simulateur en 30 secondes</a>."
        ),
    })

    return faq


def render_faq_yaml(faq: list[dict]) -> str:
    if not faq:
        return ""
    lines = ["faq:"]
    for entry in faq:
        q = entry["question"].replace('"', '\\"')
        a = entry["answer"].replace('"', '\\"')
        lines.append(f'  - question: "{q}"')
        lines.append(f'    answer: "{a}"')
    return "\n".join(lines)


# -----------------------------------------------------------------------------
# Page builder
# -----------------------------------------------------------------------------
def build_page(b: dict) -> str:
    slug = b["slug"]
    nom_branche = (b.get("nom_branche") or "").strip()
    nom_court = BRANCHE_SHORT_NAMES.get(slug, nom_branche)
    opco_slug = b["opco_slug"]
    opco_label = OPCO_LABELS.get(opco_slug, opco_slug.capitalize())
    idccs = b.get("idcc_couverts") or []
    idccs_str = ", ".join(str(x) for x in idccs) if idccs else "à confirmer"
    primary_idcc = idccs[0] if idccs else None

    # H1 transactionnel court (Gemini) — utilise nom_court SEO-friendly
    if primary_idcc:
        title = f"Simulateur Budget Formation {nom_court} (IDCC {primary_idcc}) — 2026"
    else:
        title = f"Simulateur Budget Formation {nom_court} — 2026"

    description = (
        f"Calculez votre budget formation 2026 pour la convention {nom_court} ({opco_label}, "
        f"IDCC {idccs_str}). Plafonds PDC par tranche d'effectif, dispositifs activables, "
        f"sources officielles. Simulation en 30 secondes."
    )[:220]

    faq = faq_entries(b, opco_label)
    faq_yaml = render_faq_yaml(faq)

    # Front matter
    fm_lines = [
        "---",
        f"title: {yaml_escape(title)}",
        f"description: {yaml_escape(description)}",
        "date: 2026-05-23",
        "lastmod: 2026-05-23",
        'layout: "single"',
        'robots: "index, follow"',
        f'canonical: "/simulateur-opco/branches/{slug}/"',
        'ogImage: "/assets/images/logo-agence-sauvage.svg"',
        f"branche_slug: {yaml_escape(slug)}",
        f"branche_nom: {yaml_escape(nom_branche)}",
        f"branche_nom_court: {yaml_escape(nom_court)}",
        f"branche_opco_slug: {yaml_escape(opco_slug)}",
        f"branche_opco_label: {yaml_escape(opco_label)}",
        f"branche_idcc_primary: {primary_idcc if primary_idcc else 'null'}",
        f"branche_idccs: {yaml_escape(idccs_str)}",
        "keywords:",
        f'  - "budget formation {nom_court}"',
        f'  - "OPCO {nom_court}"',
    ]
    if primary_idcc:
        fm_lines.append(f'  - "IDCC {primary_idcc}"')
        fm_lines.append(f'  - "simulateur IDCC {primary_idcc}"')
    fm_lines.append(f'  - "{opco_label} {nom_court}"')
    fm_lines.append(f'  - "financement formation 2026"')
    if faq_yaml:
        fm_lines.append(faq_yaml)
    fm_lines.append("---")
    front_matter = "\n".join(fm_lines) + "\n"

    # Body
    body: list[str] = []

    # Intro courte (~120 mots) — utilise nom_court pour fluidité de lecture
    intro_lead = (
        f"Vous dirigez une entreprise relevant de la convention **{nom_court}** "
        f"(IDCC {idccs_str}) ? Votre budget formation 2026 est financé par {opco_label}, "
        f"avec des barèmes spécifiques à votre branche. Cette page récapitule les plafonds "
        f"officiels, les dispositifs activables (PDC, AFEST, bonus thématiques) et les "
        f"démarches pour mobiliser ces fonds."
    )
    body.append(intro_lead)
    body.append("")
    body.append(f"[**Calculez votre budget {opco_label} 2026 en 30 secondes →**](/simulateur-opco/)")
    body.append("")

    # Carte d'identité (HTML Tailwind, pas markdown)
    body.append(render_carte_identite_html(b, opco_label, opco_slug))
    body.append("")

    # Tableau tranches PDC (HTML Tailwind, boost GEO)
    pdc = b.get("plan_developpement_competences") or {}
    tranches = pdc.get("tranches_effectifs") or []
    if tranches and pdc.get("eligible") is not False:
        body.append(f"## Plafonds PDC {opco_label} 2026 par tranche d'effectif")
        body.append("")
        body.append(
            f"Voici les plafonds officiels du Plan de Développement des Compétences pour la "
            f"convention {nom_branche} en 2026, ventilés selon votre tranche d'effectif. "
            f"Le pivot **50 salariés** marque la bascule réglementaire entre PME et ETI."
        )
        body.append("")
        body.append(render_tranches_table_html(tranches, opco_label))
        body.append("")
        cout_seul = pdc.get("cout_pedagogique_seul")
        if cout_seul is True:
            body.append("> ℹ️ **Prise en charge** : coût pédagogique uniquement (frais annexes hors-budget).")
            body.append("")
        elif cout_seul is False:
            body.append("> ℹ️ **Prise en charge** : coût pédagogique + frais annexes (repas, hébergement, déplacement).")
            body.append("")

    # Dispositifs supplémentaires (AFEST, bonus, parcours)
    extras = render_dispositifs_supplementaires(b, opco_label)
    if extras:
        body.append(f"## Autres dispositifs {opco_label} activables")
        body.append("")
        body.extend(extras)

    # Analyse détaillée (notes_libres — déjà markdown structuré)
    notes = (b.get("notes_libres") or "").strip()
    if notes:
        body.append(f"## Analyse détaillée — {nom_branche}")
        body.append("")
        body.append(
            f"Cette section restitue notre analyse complète des critères de financement publiés "
            f"officiellement par {opco_label} pour la branche {nom_branche}. Données sourcées, "
            f"vérifiées et mises à jour régulièrement."
        )
        body.append("")
        body.append(notes)
        body.append("")

    # Sources officielles
    sources_md = render_sources(b)
    if sources_md:
        body.append("## Sources officielles")
        body.append("")
        body.append(
            f"Toutes les données chiffrées de cette page proviennent des publications officielles "
            f"de {opco_label} et des sources gouvernementales, vérifiées à la date indiquée."
        )
        body.append("")
        body.append(sources_md)
        body.append("")

    # Maillage : article pilier + actions collectives + OPCO parent
    body.append("## Pour aller plus loin")
    body.append("")
    body.append(
        f"- 🎯 **OPCO parent** : [Tous les dispositifs {opco_label} 2026](/simulateur-opco/{opco_slug}/)"
    )
    body.append(
        "- 📊 **Actions collectives** : [Formations 100% financées par votre OPCO]"
        "(/simulateur-opco/actions-collectives/)"
    )
    body.append(
        "- 📖 **Guide complet** : [Financer la formation IA via OPCO 2026]"
        "(/blog/dispositifs-opco-2026-financer-formation-ia-pme/)"
    )
    body.append("")

    # CTA final
    body.append(f"## Calculez votre budget {nom_branche} 2026")
    body.append("")
    body.append(
        f"Notre simulateur identifie automatiquement votre rattachement à la branche {nom_branche} "
        f"depuis votre raison sociale ou votre numéro SIREN. Aucune connaissance de votre IDCC "
        f"n'est requise. Le calcul prend 30 secondes et reste sans engagement."
    )
    body.append("")
    body.append(f"[**Lancer le simulateur OPCO 2026 →**](/simulateur-opco/)")
    body.append("")

    return front_matter + "\n" + "\n".join(body)


# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Génère les sous-pages branches IDCC.")
    parser.add_argument("--only", default="", help="Slugs séparés par virgule. Vide = whitelist 20.")
    parser.add_argument("--all-whitelist", action="store_true", help="Force régénération de la whitelist complète.")
    args = parser.parse_args()

    if not DB_PATH.exists():
        print(f"FATAL : {DB_PATH} introuvable.", file=sys.stderr)
        sys.exit(1)

    db = json.loads(DB_PATH.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    only = {s.strip() for s in args.only.split(",") if s.strip()}
    target_slugs = only if only else set(WHITELIST)

    branches_by_slug = {b["slug"]: b for b in db.get("branches", [])}
    written = 0
    missing = []

    for slug in (WHITELIST if not only else list(only)):
        if slug not in target_slugs:
            continue
        b = branches_by_slug.get(slug)
        if not b:
            missing.append(slug)
            continue

        content = build_page(b)
        out_path = OUT_DIR / f"{slug}.md"
        out_path.write_bytes(content.encode("utf-8").replace(b"\r\n", b"\n"))
        written += 1
        print(f"  [OK] {out_path.relative_to(ROOT)}  ({len(content)} chars)")

    print()
    print(f"OK - {written} fiche(s) branche(s) ecrite(s).")
    if missing:
        print(f"WARN - slugs introuvables dans la BDD : {missing}", file=sys.stderr)


if __name__ == "__main__":
    main()
