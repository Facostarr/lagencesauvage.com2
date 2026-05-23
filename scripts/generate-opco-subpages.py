#!/usr/bin/env python3
"""Génère les 11 sous-pages OPCO depuis data/opco-database.json.

Une sous-page Hugo par OPCO sous content/simulateur-opco/{slug}.md.
Approche hybride : intro client réécrite + sections factuelles brutes du
notes_libres + tableau dispositifs auto-généré + sources officielles + CTAs.

Utilisation :
    python scripts/generate-opco-subpages.py [--only atlas,akto]

L'option --only limite la génération à une liste d'OPCOs (utile pour piloter).
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "opco-database.json"
OUT_DIR = ROOT / "content" / "simulateur-opco"

# -----------------------------------------------------------------------------
# Métadonnées par OPCO — positionnement client, ciblage, intro orientée TPE/PME
# Les intros sont rédigées à la main pour le ton vouvoiement + bénéfice client.
# -----------------------------------------------------------------------------
OPCO_META: dict[str, dict] = {
    "afdas": {
        "nom_court": "Afdas",
        "audience": "culture, médias, communication, sport et loisirs",
        "intro_client": (
            "L'Afdas finance la formation professionnelle des salariés des entreprises "
            "des secteurs **culture, médias, communication, sport et loisirs**. Si votre "
            "convention collective figure parmi les 13 branches couvertes (audiovisuel, "
            "presse, télécommunications, sport, spectacle, publicité, tourisme, etc.), "
            "votre budget formation 2026 est mobilisable via les dispositifs ci-dessous."
        ),
    },
    "akto": {
        "nom_court": "AKTO",
        "audience": "services à forte intensité de main-d'œuvre",
        "intro_client": (
            "AKTO finance la formation professionnelle des salariés des **services à forte "
            "intensité de main-d'œuvre** : hôtellerie-restauration, propreté, prévention-sécurité, "
            "restauration rapide, travail temporaire, etc. Si votre entreprise dépend de l'une "
            "des 22 conventions couvertes, votre budget formation 2026 est mobilisable via les "
            "dispositifs ci-dessous."
        ),
    },
    "atlas": {
        "nom_court": "Atlas",
        "audience": "services financiers, conseil et numérique",
        "intro_client": (
            "L'Opco Atlas finance la formation professionnelle des salariés des entreprises "
            "des **services financiers, du conseil et du numérique**. Si votre convention "
            "collective figure parmi les 14 branches couvertes — notamment **Syntec (IDCC 1486)**, "
            "**Banque (IDCC 2120)** ou **Sociétés d'assurances (IDCC 1672)** — votre budget "
            "formation 2026 est mobilisable via les dispositifs ci-dessous."
        ),
    },
    "constructys": {
        "nom_court": "Constructys",
        "audience": "construction et bâtiment",
        "intro_client": (
            "Constructys est l'OPCO de la **construction et du bâtiment**. Il finance la "
            "formation professionnelle des salariés des entreprises du gros œuvre, du second "
            "œuvre, des travaux publics et du négoce des matériaux. Si votre entreprise relève "
            "de l'une des conventions BTP, votre budget formation 2026 est mobilisable via les "
            "dispositifs ci-dessous."
        ),
    },
    "ep": {
        "nom_court": "OPCO EP",
        "audience": "entreprises de proximité — artisanat, professions libérales, services",
        "intro_client": (
            "L'OPCO EP (Entreprises de Proximité) finance la formation professionnelle des "
            "salariés de **l'artisanat, des professions libérales et des services de proximité**. "
            "Il couvre 54 branches — pharmacie, coiffure, boulangerie, automobile, fleuristerie, "
            "professions juridiques, professions de santé libérales, etc. Si votre entreprise "
            "relève de l'une de ces conventions, votre budget formation 2026 est mobilisable "
            "via les dispositifs ci-dessous."
        ),
    },
    "mobilites": {
        "nom_court": "OPCO Mobilités",
        "audience": "transports, automobile et logistique",
        "intro_client": (
            "L'OPCO Mobilités finance la formation professionnelle des salariés des secteurs "
            "**transports, services de l'automobile et logistique** : transport routier de "
            "marchandises et de voyageurs, services de l'automobile, taxis, transport sanitaire, "
            "transport urbain, etc. Si votre entreprise relève de l'une des conventions Mobilités, "
            "votre budget formation 2026 est mobilisable via les dispositifs ci-dessous."
        ),
    },
    "ocapiat": {
        "nom_court": "OCAPIAT",
        "audience": "coopération agricole, agriculture, pêche et agroalimentaire",
        "intro_client": (
            "OCAPIAT finance la formation professionnelle des salariés des secteurs "
            "**coopération agricole, agriculture, pêche et agroalimentaire**. Si votre "
            "entreprise relève de l'une des conventions couvertes — production agricole, "
            "industries alimentaires, viticulture, élevage, pêche, coopératives — votre budget "
            "formation 2026 est mobilisable via les dispositifs ci-dessous."
        ),
    },
    "opco-sante": {
        "nom_court": "OPCO Santé",
        "audience": "santé privée et médico-social privé",
        "intro_client": (
            "L'OPCO Santé finance la formation professionnelle des salariés des **établissements "
            "de santé privés et du médico-social privé** : cliniques, EHPAD privés, hospitalisation "
            "privée à but non lucratif, services à la personne, aide à domicile. Si votre "
            "entreprise relève de l'une des conventions de la santé privée, votre budget "
            "formation 2026 est mobilisable via les dispositifs ci-dessous."
        ),
    },
    "opco2i": {
        "nom_court": "OPCO 2i",
        "audience": "industrie (interindustriel)",
        "intro_client": (
            "L'OPCO 2i (Interindustriel) finance la formation professionnelle des salariés des "
            "**entreprises industrielles** : métallurgie, plasturgie, chimie, pétrole, "
            "pharmacie, papier-carton, textile, ameublement, recyclage. Si votre entreprise "
            "relève de l'une des 30 conventions industrielles couvertes, votre budget formation "
            "2026 est mobilisable via les dispositifs ci-dessous."
        ),
    },
    "opcommerce": {
        "nom_court": "L'Opcommerce",
        "audience": "commerce et distribution",
        "intro_client": (
            "L'Opcommerce finance la formation professionnelle des salariés des entreprises du "
            "**commerce et de la distribution** : grande distribution, commerce de gros, "
            "commerce de détail non alimentaire, négoce, commerces alimentaires spécialisés, "
            "vente à distance. Si votre entreprise relève de l'une des conventions du commerce, "
            "votre budget formation 2026 est mobilisable via les dispositifs ci-dessous."
        ),
    },
    "uniformation": {
        "nom_court": "Uniformation",
        "audience": "cohésion sociale — associatif et économie sociale",
        "intro_client": (
            "Uniformation est l'OPCO de la **cohésion sociale**. Il finance la formation "
            "professionnelle des salariés des associations, mutuelles, économie sociale et "
            "solidaire, sport associatif, animation, services à domicile (SAAD), aide à "
            "domicile (BAD), centres sociaux, etc. Si votre structure relève de l'une de ces "
            "conventions, votre budget formation 2026 est mobilisable via les dispositifs "
            "ci-dessous."
        ),
    },
}


def yaml_escape(value) -> str:
    """Sérialise une valeur en YAML scalaire.

    Hugo 0.158 a un bug avec les YAML quoted scalars contenant des
    caractères spéciaux (em-dash, accents) : les guillemets de fermeture
    sont gardés dans la valeur, ce qui pollue jsonify.

    Solution : utiliser des plain scalars (sans guillemets) chaque fois
    que possible, et fallback sur single-quoted scalars sinon.
    """
    if value is None:
        return '""'
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    s = str(value)
    # Si la valeur contient des caractères réservés YAML, on single-quote.
    # Sinon on laisse en plain scalar (le plus sûr face au bug Hugo).
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
    # Single-quoted scalar : seuls les single-quotes doivent être doublés
    return "'" + s.replace("'", "''") + "'"


def render_dispositifs_table(opco: dict) -> str:
    """Génère un tableau Markdown des dispositifs activables 2026."""
    rows = []

    def add_row(label: str, dispositif: dict | None, note: str = ""):
        if not dispositif:
            rows.append(f"| {label} | À vérifier auprès de l'OPCO | — |")
            return
        eligible = dispositif.get("eligible")
        if eligible is True:
            status = "✅ Éligible"
        elif eligible is False:
            status = "❌ Non éligible"
        else:
            status = "À vérifier"
        rows.append(f"| {label} | {status} | {note} |")

    pdc = opco.get("plan_developpement_competences") or {}
    pdc_taille = ", ".join(t.replace("_", "-") for t in pdc.get("cible_taille_entreprise") or [])
    add_row("Plan de Développement des Compétences (PDC)", pdc, f"Cibles : {pdc_taille}" if pdc_taille else "")

    cp = opco.get("contrat_professionnalisation") or {}
    cp_note = ""
    if cp.get("forfait_horaire_eur"):
        cp_note = f"Forfait horaire : {cp['forfait_horaire_eur']}€/h"
    add_row("Contrat de professionnalisation", cp, cp_note)

    pr = opco.get("periode_reconversion") or {}
    pr_note = "Remplace Pro-A depuis le 1er janvier 2026"
    if pr.get("prerequis_certification"):
        pr_note += f" — certification {', '.join(pr['prerequis_certification'])} requise"
    add_row("Période de reconversion", pr, pr_note)

    fne = opco.get("fne_formation") or {}
    fne_note = "Instruit par l'OPCO" if fne.get("instruit_par_opco") else "Non instruit"
    add_row("FNE-Formation", fne if fne.get("instruit_par_opco") is not None else None, fne_note)

    poec = opco.get("poec_eligible")
    poec_row_label = "POEC (Préparation Opérationnelle à l'Emploi Collective)"
    if poec is True:
        rows.append(f"| {poec_row_label} | ✅ Éligible | — |")
    elif poec is False:
        rows.append(f"| {poec_row_label} | ❌ Non éligible | — |")
    else:
        rows.append(f"| {poec_row_label} | À vérifier auprès de l'OPCO | — |")

    abondement = opco.get("abondement_cpf") or {}
    ab_note = abondement.get("conditions", "") or ""
    if ab_note and len(ab_note) > 120:
        ab_note = ab_note[:117] + "…"
    add_row("Abondement CPF par l'OPCO", abondement if abondement.get("possible") is not None else None,
            ab_note if abondement.get("possible") else "")

    header = "| Dispositif | Éligibilité 2026 | Note |\n|---|---|---|"
    return header + "\n" + "\n".join(rows)


def render_sources(opco: dict) -> str:
    """Génère la liste des sources officielles avec dates."""
    sources = opco.get("sources") or []
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


def render_branches_principales(opco: dict) -> str:
    branches = opco.get("branches_principales") or []
    if not branches:
        return ""
    return "\n".join(f"- {b}" for b in branches)


def faq_entries(opco: dict) -> list[dict]:
    """Génère 3 questions FAQ spécifiques à l'OPCO depuis les données."""
    slug = opco["slug"]
    meta = OPCO_META[slug]
    nom_court = meta["nom_court"]
    nb_idcc = opco.get("nb_idcc_couverts") or "plusieurs"

    faq: list[dict] = []

    faq.append({
        "question": f"Quelles entreprises sont rattachées à {nom_court} ?",
        "answer": (
            f"L'OPCO {nom_court} couvre les entreprises dont la convention collective figure parmi "
            f"les {nb_idcc} branches couvertes ({meta['audience']}). Le rattachement est automatique "
            f"selon l'IDCC de votre convention. Si vous ne le connaissez pas, notre "
            f"<a href=\"/simulateur-opco/\">simulateur identifie automatiquement votre OPCO</a> "
            f"depuis votre raison sociale ou votre SIREN."
        ),
    })

    qualiopi_required = opco.get("prerequis_qualiopi", True)
    if qualiopi_required:
        faq.append({
            "question": f"Quels prérequis pour financer une formation via {nom_court} ?",
            "answer": (
                f"Trois prérequis : (1) votre entreprise doit être à jour de sa contribution formation "
                f"professionnelle (CFP) versée à l'URSSAF, (2) l'organisme de formation doit être "
                f"<a href=\"https://travail-emploi.gouv.fr/qualiopi-marque-de-certification-qualite-des-prestataires-de-formation\" rel=\"noopener\" target=\"_blank\">certifié Qualiopi</a> "
                f"(obligatoire depuis le 1er janvier 2022), et (3) la demande de financement doit être déposée "
                f"<strong>avant le démarrage de la formation</strong> (pas de prise en charge rétroactive)."
            ),
        })

    pr = opco.get("periode_reconversion") or {}
    proa_obsolete = not pr.get("proa_encore_affiche", True)
    if proa_obsolete:
        faq.append({
            "question": f"Le dispositif Pro-A est-il encore disponible chez {nom_court} ?",
            "answer": (
                f"Non. La loi du 24 octobre 2025 a remplacé Pro-A par la <strong>Période de reconversion</strong> "
                f"depuis le 1er janvier 2026. {nom_court} a basculé ses critères vers ce nouveau dispositif. "
                f"Les exigences restent comparables : alternance, certification RNCP ou CQP obligatoire, "
                f"tuteur identifié dans l'entreprise."
            ),
        })
    else:
        faq.append({
            "question": f"Comment est calculé le budget OPCO de mon entreprise chez {nom_court} ?",
            "answer": (
                f"Le budget est calculé à partir de votre Contribution Formation Professionnelle (CFP) "
                f"versée à l'URSSAF (0,55% de la masse salariale brute sous 11 salariés, 1% au-delà) "
                f"et des barèmes 2026 publiés par {nom_court} pour votre convention collective. "
                f"Notre <a href=\"/simulateur-opco/\">simulateur calcule ce montant en 30 secondes</a> "
                f"depuis votre SIREN."
            ),
        })

    return faq


def render_faq_yaml(faq: list[dict]) -> str:
    """Sérialise une FAQ en YAML pour front matter Hugo."""
    if not faq:
        return ""
    lines = ["faq:"]
    for entry in faq:
        q = entry["question"].replace('"', '\\"')
        a = entry["answer"].replace('"', '\\"')
        lines.append(f'  - question: "{q}"')
        lines.append(f'    answer: "{a}"')
    return "\n".join(lines)


def build_page(opco: dict) -> str:
    """Construit le contenu Markdown complet d'une sous-page OPCO."""
    slug = opco["slug"]
    if slug not in OPCO_META:
        raise SystemExit(f"OPCO meta manquant pour slug={slug}")

    meta = OPCO_META[slug]
    nom_officiel = opco.get("nom_officiel", "")
    nom_court = meta["nom_court"]
    audience = meta["audience"]
    nb_idcc = opco.get("nb_idcc_couverts") or "—"
    url_racine = opco.get("url_racine", "")
    url_criteres = opco.get("url_criteres", "")
    annee = opco.get("annee_application", 2026)
    date_maj = opco.get("date_derniere_maj_humaine", opco.get("date_scraping", "2026-05-12"))
    notes = (opco.get("notes_libres") or "").strip()

    # Front matter
    title = f"OPCO {nom_court} 2026 — Budget formation, dispositifs et conventions"
    description = (
        f"{nom_court} finance la formation des salariés des secteurs {audience}. "
        f"Dispositifs activables 2026 (PDC, Période de reconversion, AFEST, abondement CPF), "
        f"branches couvertes, sources officielles. Calcul automatique en 30 secondes."
    )[:220]

    faq = faq_entries(opco)
    faq_yaml = render_faq_yaml(faq)

    fm_lines = [
        "---",
        f"title: {yaml_escape(title)}",
        f"description: {yaml_escape(description)}",
        "date: 2026-05-23",
        "lastmod: 2026-05-23",
        'layout: "single"',
        'robots: "index, follow"',
        f'canonical: "/simulateur-opco/{slug}/"',
        'ogImage: "/assets/images/logo-agence-sauvage.svg"',
        f"opco_slug: {yaml_escape(slug)}",
        f"opco_nom_court: {yaml_escape(nom_court)}",
        f"opco_nom_officiel: {yaml_escape(nom_officiel)}",
        f"opco_url_racine: {yaml_escape(url_racine)}",
        f"opco_url_criteres: {yaml_escape(url_criteres)}",
        f"opco_nb_idcc: {nb_idcc if isinstance(nb_idcc, int) else yaml_escape(nb_idcc)}",
        f"opco_audience: {yaml_escape(audience)}",
        f"opco_annee: {annee}",
        f"opco_date_maj: {yaml_escape(date_maj)}",
        "keywords:",
        f'  - "OPCO {nom_court} 2026"',
        f'  - "budget formation {nom_court}"',
        f'  - "simulateur OPCO {nom_court}"',
        f'  - "convention collective {nom_court}"',
        f'  - "financement formation {audience.split(",")[0].strip()}"',
    ]
    if faq_yaml:
        fm_lines.append(faq_yaml)
    fm_lines.append("---")
    front_matter = "\n".join(fm_lines) + "\n"

    # Body
    body = []

    # Intro client
    body.append(meta["intro_client"])
    body.append("")
    body.append(
        f"[**Calculez votre budget formation OPCO 2026 en 30 secondes →**](/simulateur-opco/)"
    )
    body.append("")

    # Carte d'identité
    body.append("## Carte d'identité de l'OPCO " + nom_court)
    body.append("")
    body.append("| Information | Détail |")
    body.append("|---|---|")
    body.append(f"| Nom officiel | {nom_officiel} |")
    body.append(f"| Périmètre | {audience.capitalize()} |")
    body.append(f"| Nombre de conventions couvertes | {nb_idcc} |")
    if url_racine:
        body.append(f"| Site officiel | [{url_racine}]({url_racine}) |")
    if url_criteres:
        body.append(f"| Critères de financement | [Voir la page officielle]({url_criteres}) |")
    body.append(f"| Année d'application des critères | {annee} |")
    body.append(f"| Dernière mise à jour humaine | {date_maj} |")
    body.append("")

    # Tableau dispositifs
    body.append(f"## Dispositifs OPCO {nom_court} activables en 2026")
    body.append("")
    body.append(
        f"Voici un récapitulatif des dispositifs de financement formation pris en charge par "
        f"{nom_court} en 2026. Les conditions précises varient selon votre convention collective "
        f"(IDCC) et la taille de votre entreprise."
    )
    body.append("")
    body.append(render_dispositifs_table(opco))
    body.append("")

    # Branches principales
    branches_md = render_branches_principales(opco)
    if branches_md:
        body.append(f"## Branches principales couvertes par {nom_court}")
        body.append("")
        body.append(
            f"Les {nb_idcc} conventions collectives suivantes sont rattachées à {nom_court}. Si "
            f"vous n'êtes pas certain de la vôtre, notre simulateur la détecte automatiquement "
            f"depuis votre SIREN."
        )
        body.append("")
        body.append(branches_md)
        body.append("")
        body.append(
            f"[Calculez votre budget {nom_court} 2026 →](/simulateur-opco/)"
        )
        body.append("")

    # Notes éditoriales (brut)
    if notes:
        body.append(f"## Analyse détaillée — {nom_court} en 2026")
        body.append("")
        body.append(
            "Cette section restitue notre analyse complète des critères de financement publiés "
            f"officiellement par {nom_court}. Données factuelles, sourcées et mises à jour "
            f"régulièrement."
        )
        body.append("")
        body.append(notes)
        body.append("")

    # Sources officielles
    sources_md = render_sources(opco)
    if sources_md:
        body.append("## Sources officielles")
        body.append("")
        body.append(
            "Toutes les données de cette page proviennent des publications officielles de "
            f"{nom_court}, vérifiées à la date indiquée."
        )
        body.append("")
        body.append(sources_md)
        body.append("")

    # CTA final
    body.append(f"## Calculez votre budget OPCO {nom_court} 2026")
    body.append("")
    body.append(
        f"Notre simulateur identifie automatiquement votre rattachement à {nom_court} depuis "
        f"votre raison sociale ou votre numéro SIREN. Aucune connaissance préalable de votre "
        f"IDCC n'est requise. Le calcul prend 30 secondes et reste sans engagement."
    )
    body.append("")
    body.append(f"[**Lancer le simulateur OPCO 2026 →**](/simulateur-opco/)")
    body.append("")

    return front_matter + "\n" + "\n".join(body)


def main():
    parser = argparse.ArgumentParser(description="Génère les sous-pages OPCO depuis la BDD JSON.")
    parser.add_argument(
        "--only",
        default="",
        help="Liste de slugs OPCO séparés par virgule. Vide = tous.",
    )
    args = parser.parse_args()

    if not DB_PATH.exists():
        print(f"FATAL : {DB_PATH} introuvable.", file=sys.stderr)
        sys.exit(1)

    db = json.loads(DB_PATH.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    only = {s.strip() for s in args.only.split(",") if s.strip()}
    written = 0
    skipped = 0

    for opco in db["opcos"]:
        slug = opco["slug"]
        if only and slug not in only:
            skipped += 1
            continue

        content = build_page(opco)
        out_path = OUT_DIR / f"{slug}.md"
        # Force LF line endings (Hugo YAML parser mishandles CRLF in quoted scalars on Windows)
        out_path.write_bytes(content.encode("utf-8").replace(b"\r\n", b"\n"))
        written += 1
        print(f"  [OK] {out_path.relative_to(ROOT)}  ({len(content)} chars)")

    print()
    print(f"OK - {written} sous-page(s) ecrite(s), {skipped} ignoree(s).")


if __name__ == "__main__":
    main()
