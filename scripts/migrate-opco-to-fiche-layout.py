"""
Migration des pages /simulateur-opco/{slug}/ vers le layout opco-fiche.

Pour chaque fichier sauf atlas (déjà migré manuellement) :
1. Parse le YAML front matter + body markdown.
2. Extrait les 3 sections markdown générées par script :
   - ## Carte d'identité — OPCO X        → supprimée (remplacée par {{< opco-kpi >}})
   - ## Dispositifs OPCO X activables    → params dispositifs_2026 + {{< opco-dispositifs >}}
   - ## Branches principales couvertes   → params branches_idcc + {{< opco-branches >}}
   - "## Calculez votre budget OPCO X" final → supprimée (CTA déjà géré par le layout)
3. Réécrit le fichier avec :
   - layout: opco-fiche
   - Front matter enrichi
   - Body : intro 1er paragraphe + 3 shortcodes + reste du contenu narratif

Le script préserve absolument tout le contenu d'analyse (sections "## Analyse détaillée",
"## Identité et positionnement", "## Conformité réforme 2026", "## Sources officielles", etc.)
"""

from pathlib import Path
import re
import yaml

CONTENT_DIR = Path(__file__).resolve().parent.parent / "content" / "simulateur-opco"
BRANCHES_DIR = CONTENT_DIR / "branches"

# Mapping nom de branche → slug fiche branche existante (si applicable)
# Détection auto : on liste les fiches branches existantes, et on match par IDCC ou par mot-clé
EXISTING_BRANCHE_SLUGS = set()
for f in BRANCHES_DIR.glob("*.md"):
    if f.stem != "_index":
        EXISTING_BRANCHE_SLUGS.add(f.stem)

# Mapping nom court → slug (pour matching plus précis)
SLUG_HINTS = {
    "syntec": "syntec-1486",
    "banque": "banque-2120",
    "assurances": "assurances-1672",
    "hcr": "akto-hcr-1979",
    "hôtels, cafés, restaurants": "akto-hcr-1979",
    "propreté": "akto-proprete-services-3043",
    "prévention, sécurité": "akto-prevention-securite-1351",
    "prévention-sécurité": "akto-prevention-securite-1351",
    "restauration rapide": "akto-restauration-rapide-1501",
    "travail temporaire": "akto-travail-temporaire-1413-2378",
    "portage salarial": "akto-portage-salarial-3219",
    "commerces de gros": "akto-commerces-gros-573",
    "industrie pharmaceutique": "opco2i-industrie-pharmaceutique-176",
    "métallurgie": "opco2i-metallurgie-3127",
    "cdna": "opcommerce-cdna-1517",
    "cad": "opcommerce-cad-2198",
    "immobilier": "ep-immobilier-1527",
    "services auto": "mobilites-services-auto-1090",
    "hospitalisation privée": "opco-sante-hp",
    "sssms": "opco-sante-sssms",
    "saad": "uniformation-saad",
    "aide à domicile": "uniformation-saad",
}


def parse_front_matter(text: str):
    """Split YAML front matter et body."""
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.DOTALL)
    if not m:
        return None, text
    return yaml.safe_load(m.group(1)), m.group(2).lstrip()


def extract_dispositifs(body: str):
    """Extrait la table markdown des dispositifs en liste de dicts.

    Format markdown attendu :
      | Dispositif | Éligibilité 2026 | Note |
      |---|---|---|
      | Plan de Développement des Compétences (PDC) | ✅ Éligible | Cibles : moins-11... |
      | ...
    """
    # On cherche la section "## Dispositifs ... activables en YYYY" (couvre "Dispositifs OPCO X", "Dispositifs L'Opcommerce", etc.)
    pattern = re.compile(
        r"^## Dispositifs[^\n]*activables[^\n]*\n+(?:[^\n]+\n)?\n*"  # titre + ligne d'intro optionnelle
        r"\| Dispositif \| Éligibilité.*?\n"                          # header
        r"\|[-:|\s]+\|\n"                                              # séparateur
        r"((?:\|[^\n]*\|\n)+)",                                        # corps
        re.MULTILINE,
    )
    m = pattern.search(body)
    if not m:
        return []
    rows_raw = m.group(1).strip().split("\n")
    out = []
    for row in rows_raw:
        cells = [c.strip() for c in row.strip("|").split("|")]
        if len(cells) < 3:
            continue
        nom, eligibilite, note = cells[0], cells[1], cells[2]
        # Détermine statut
        if "✅" in eligibilite or "Éligible" in eligibilite and "À vérifier" not in eligibilite and "Non" not in eligibilite:
            statut = "eligible"
        elif "À vérifier" in eligibilite or "à vérifier" in eligibilite:
            statut = "a-verifier"
        elif "Non éligible" in eligibilite or "non éligible" in eligibilite:
            statut = "non-eligible"
        else:
            statut = "a-verifier"
        # Clean note : si la note vaut "—" (placeholder vide), garder tel quel
        # mais NE PAS supprimer les "—" embedded dans le contenu.
        note = note.strip() or "—"
        out.append({"nom": nom, "statut": statut, "note": note})
    return out


def extract_branches(body: str):
    """Extrait la liste des branches depuis '## Branches principales couvertes par OPCO X'.

    Format markdown attendu :
      - Bureaux d'études techniques... (Syntec — IDCC 1486)
      - Banque (IDCC 2120)
      - Crédit mutuel
    """
    pattern = re.compile(
        r"^## Branches principales[^\n]*\n+(?:[^\n]+\n)?\n*"
        r"((?:- [^\n]+\n)+)",
        re.MULTILINE,
    )
    m = pattern.search(body)
    if not m:
        return []
    lines = [l.strip("- ").strip() for l in m.group(1).strip().split("\n") if l.strip().startswith("-")]
    out = []
    for line in lines:
        # Extraire IDCC s'il existe : "(IDCC 1486)", "(IDCC 1413 et 2378)", "— IDCC 1486)"
        idcc_match = re.search(r"IDCC\s+(\d{2,4})", line)
        idcc = int(idcc_match.group(1)) if idcc_match else None

        # Le nom : tout avant la première parenthèse (si présente)
        nom = re.split(r"\s*[—(]", line)[0].strip()

        # Slug
        slug = None
        low = line.lower()
        for hint_key, hint_slug in SLUG_HINTS.items():
            if hint_key in low:
                if hint_slug in EXISTING_BRANCHE_SLUGS:
                    slug = hint_slug
                    break
        # Fallback IDCC
        if not slug and idcc:
            for candidate in EXISTING_BRANCHE_SLUGS:
                if str(idcc) in candidate:
                    slug = candidate
                    break

        entry = {"nom": nom}
        if idcc:
            entry["idcc"] = idcc
        if slug:
            entry["slug"] = slug
        out.append(entry)
    return out


def strip_replaced_sections(body: str) -> str:
    """Supprime les sections du body qui sont remplacées par les shortcodes.

    Sections supprimées :
      - ## Carte d'identité — OPCO X
      - ## Dispositifs OPCO X activables en 2026
      - ## Branches principales couvertes par OPCO X
      - Le CTA inline "[**Calculez votre budget...**]" sous l'intro
      - Le "[Calculez votre budget X 2026 →]" qui suit la liste branches
      - La section finale "## Calculez votre budget OPCO X 2026" (CTA déjà géré par layout)
    """
    # Supprime les 3 sections (jusqu'au prochain H2)
    patterns = [
        r"\n## Carte d'identité[^\n]*\n.*?(?=\n## )",
        r"\n## Dispositifs OPCO[^\n]*\n.*?(?=\n## )",
        r"\n## Branches principales[^\n]*\n.*?(?=\n## )",
        # CTA inline répété
        r"\n\[\*\*Calculez votre budget formation OPCO[^\n]+\n",
        r"\n\[Calculez votre budget[^\n]+\n",
        # Section CTA finale (toute la fin)
        r"\n## Calculez votre budget OPCO[^\n]*\n.*?$",
    ]
    for p in patterns:
        body = re.sub(p, "\n", body, flags=re.DOTALL | re.MULTILINE)
    # Nettoie les sauts de ligne multiples
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body.strip() + "\n"


def yaml_dump_block(data: dict) -> str:
    """Dump YAML en respectant le style des fichiers existants (plain scalars, pas de flow)."""
    return yaml.dump(
        data,
        allow_unicode=True,
        default_flow_style=False,
        sort_keys=False,
        width=1000,
    )


def migrate_file(path: Path) -> bool:
    raw = path.read_text(encoding="utf-8")
    fm, body = parse_front_matter(raw)
    if fm is None:
        print(f"[SKIP] {path.name} : pas de front matter YAML détecté")
        return False
    if fm.get("opco_slug") == "atlas":
        print(f"[SKIP] {path.name} : atlas déjà migré manuellement")
        return False
    if fm.get("layout") == "opco-fiche":
        print(f"[SKIP] {path.name} : layout déjà opco-fiche, re-run ignoré")
        return False
    if not fm.get("opco_slug"):
        print(f"[SKIP] {path.name} : pas d'opco_slug → page éditoriale (actions-collectives, etc.)")
        return False

    dispositifs = extract_dispositifs(body)
    branches = extract_branches(body)

    if not dispositifs:
        print(f"[WARN] {path.name} : aucun dispositif extrait")
    if not branches:
        print(f"[WARN] {path.name} : aucune branche extraite")

    # Mise à jour du front matter
    fm["layout"] = "opco-fiche"
    fm["lastmod"] = "2026-05-26"  # date du jour de la refonte
    if dispositifs:
        fm["dispositifs_2026"] = dispositifs
    if branches:
        fm["branches_idcc"] = branches

    # Strip sections remplacées
    new_body = strip_replaced_sections(body)

    # Compose le nouveau fichier : intro (1er paragraphe du body) + shortcodes + reste
    # On split sur le premier H2 trouvé après l'intro
    parts = re.split(r"\n(## )", new_body, maxsplit=1)
    if len(parts) == 3:
        intro = parts[0].strip()
        rest = parts[1] + parts[2]
    else:
        intro = new_body.strip()
        rest = ""

    shortcodes_block = "\n\n{{< opco-kpi >}}\n\n{{< opco-dispositifs >}}\n\n{{< opco-branches >}}\n\n"
    final_body = intro + shortcodes_block + rest

    # Reconstitution complète
    new_text = "---\n" + yaml_dump_block(fm) + "---\n\n" + final_body.strip() + "\n"
    # Force LF (Hugo YAML parser sensible au CRLF sur Windows — cf. fix-CRLF commit antérieur)
    path.write_bytes(new_text.replace("\r\n", "\n").encode("utf-8"))
    print(f"[OK]   {path.name} : {len(dispositifs)} dispositifs, {len(branches)} branches")
    return True


def main():
    targets = [
        p for p in CONTENT_DIR.glob("*.md")
        if p.stem not in {"_index", "actions-collectives"}
    ]
    print(f"Trouvé {len(targets)} fichiers cibles\n")
    for path in sorted(targets):
        migrate_file(path)


if __name__ == "__main__":
    main()
