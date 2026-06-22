#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Insère un seo_title court (<=60 car) dans le front matter des pages au titre trop long.
- Niveau 2 : simulateur (branches + OPCO) → calculé depuis le front matter.
- Niveau 3 : blog / réalisations / pages uniques → mapping explicite.
N'écrase JAMAIS un seo_title existant. Idempotent.
"""
import re, glob, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- Niveau 3 : titres rédigés à la main (SERP-facing) ---
EXPLICIT = {
    # BLOG
    "content/blog/L-IA-Abordable-en-2025.md": "IA abordable : les modèles légers au service des PME (2025)",
    "content/blog/agent-ia-definition-cas-usage-roi-pme.md": "Agent IA : définition, cas d'usage et ROI pour les PME",
    "content/blog/agent-ia-operationnel-pme-guide-deploiement.md": "Déployer un agent IA en PME : guide en 6 semaines",
    "content/blog/ai-act-formation-ia-obligatoire-opco-qualiopi-2026.md": "AI Act 2026 : la formation IA devient obligatoire",
    "content/blog/claude-cowork-pme-cas-usage-mars-2026.md": "Claude Cowork : 3 cas d'usage concrets pour PME (2026)",
    "content/blog/claude-for-small-business-agents-ia-pme-france.md": "Claude for Small Business : les agents IA pour PME",
    "content/blog/crm-automatisation-woocommerce-2026.md": "CRM & automatisation WooCommerce : le guide 2026",
    "content/blog/hermes-agent-ia-autonome-dirigeant-tpme.md": "Hermes : l'agent IA autonome pour dirigeants de PME",
    "content/blog/llm-knowledge-base-memoire-ia-pme-obsidian-claude.md": "Base de connaissances IA pour PME (méthode Karpathy)",
    "content/blog/saaspocalypse-tpe-pme.md": "SaaSpocalypse : l'IA, menace ou atout pour les TPE/PME ?",
    "content/blog/seo-geo-2026-methode-visibilite-google-ia.md": "SEO & GEO 2026 : être trouvé sur Google et cité par l'IA",
    "content/blog/zero-human-company-agents-ia-pme-france-2026.md": "Zero Human Company : le mythe face aux PME françaises",
    "content/blog/ia-prepare-vous-decidez-mode-copilote-pme.md": "Mode copilote IA : l'IA prépare, le dirigeant décide",
    # REALISATIONS
    "content/realisations/agent-telephonique-ia-reservation-restaurant.md": "Agent téléphonique IA : ne perdez plus une réservation",
    "content/realisations/automatisation-pole-financier-pennylane-expert-comptable.md": "Pôle Financier Augmenté : l'IA pour cabinets comptables",
    "content/realisations/cerveau-entreprise-veille-strategique-rag-ia.md": "Cerveau d'Entreprise : tout votre savoir interne (RAG)",
    "content/realisations/chef-de-cabinet-ia-assistant-dirigeant.md": "Chef de Cabinet IA : 10 à 15 h gagnées par semaine",
    "content/realisations/geo-citation-tracker-visibilite-ia-marque.md": "GEO Citation Tracker : ce que les IA disent de vous",
    "content/realisations/usine-contenu-b2b-seo-linkedin-automatisation.md": "Usine à Contenu B2B : SEO et LinkedIn automatisés",
    # PAGES UNIQUES
    "content/formation/maitriser-claude-entreprise.md": "Formation Maîtriser Claude en entreprise (finançable OPCO)",
    "content/scan-geo/_index.md": "Scan GEO gratuit : êtes-vous visible dans ChatGPT ?",
    "content/simulateur-opco/_index.md": "Simulateur OPCO 2026 : budget formation TPE/PME",
    "content/simulateur-opco/actions-collectives.md": "Actions collectives OPCO 2026 : formations financées",
    "content/simulateur-opco/branches/_index.md": "Budget formation OPCO 2026 par convention collective",
}

def get_fm_block(text):
    m = re.search(r"^---\n(.*?)\n---", text, re.S)
    return m.group(1) if m else ""

def fm_get(block, key):
    m = re.search(r"^%s:\s*(.*)$" % re.escape(key), block, re.M)
    if not m:
        return None
    raw = m.group(1).strip()
    was_single = len(raw) >= 2 and raw[0] == "'" and raw[-1] == "'"
    val = raw.strip("'\"")
    if was_single:
        val = val.replace("''", "'")  # un-escape YAML single-quote
    return val

def strip_opco_prefix(s):
    return re.sub(r"^(OPCO|Opco)\s+", "", s).strip()

def compute_branch(block):
    nc = fm_get(block, "branche_nom_court") or ""
    opco = strip_opco_prefix(fm_get(block, "branche_opco_label") or "")
    full = f"Budget formation {nc} 2026 — {opco}"
    if len(full) <= 60:
        return full
    short = f"Budget formation {nc} 2026"
    return short

def compute_opco(block):
    nc = fm_get(block, "opco_nom_court") or strip_opco_prefix(fm_get(block, "opco_label") or "")
    if not nc:
        return None
    nc = strip_opco_prefix(nc)
    full = f"OPCO {nc} 2026 : budget & dispositifs formation"
    if len(full) <= 60:
        return full
    return f"OPCO {nc} 2026 : budget formation"

def insert_seo_title(path, value):
    text = open(path, encoding="utf-8").read()
    block = get_fm_block(text)
    if block is None or block == "":
        return ("NO_FM", 0)
    if re.search(r"^seo_title:", block, re.M):
        return ("SKIP_EXISTS", 0)
    # insère après la 1re ligne title:
    lines = text.split("\n")
    out, done = [], False
    val = value.replace('\\', '\\\\').replace('"', '\\"')
    for ln in lines:
        out.append(ln)
        if not done and re.match(r"^title:\s", ln):
            out.append('seo_title: "%s"' % val)
            done = True
    if not done:
        return ("NO_TITLE", 0)
    open(path, "w", encoding="utf-8", newline="\n").write("\n".join(out))
    return ("OK", len(value))

def main():
    targets = []
    # Niveau 2 — branches
    for p in glob.glob(os.path.join(ROOT, "content/simulateur-opco/branches/*.md")):
        if p.endswith("_index.md"): continue
        targets.append((p, "branch"))
    # Niveau 2 — OPCO (top-level, avec opco_nom_court)
    for p in glob.glob(os.path.join(ROOT, "content/simulateur-opco/*.md")):
        if os.path.basename(p) == "_index.md": continue
        targets.append((p, "opco"))
    # Niveau 3 — explicit
    for rel in EXPLICIT:
        targets.append((os.path.join(ROOT, rel), "explicit"))

    over = []
    report = []
    for path, kind in targets:
        if not os.path.exists(path):
            report.append(("MISSING", path, "", 0)); continue
        text = open(path, encoding="utf-8").read()
        block = get_fm_block(text)
        rel = os.path.relpath(path, ROOT).replace("\\", "/")
        if kind == "explicit":
            val = EXPLICIT[rel]
        elif kind == "branch":
            val = compute_branch(block)
        elif kind == "opco":
            val = compute_opco(block)
            if not val:  # pas une vraie page OPCO (ex: actions-collectives traité en explicit)
                continue
        status, L = insert_seo_title(path, val)
        report.append((status, rel, val, len(val)))
        if status == "OK" and len(val) > 60:
            over.append((rel, val, len(val)))

    ok = [r for r in report if r[0] == "OK"]
    skip = [r for r in report if r[0] == "SKIP_EXISTS"]
    print(f"Inserés: {len(ok)} | déjà présents (ignorés): {len(skip)} | autres: {len(report)-len(ok)-len(skip)}")
    print()
    for status, rel, val, L in sorted(report):
        if status == "OK":
            flag = "  <<<OVER60" if L > 60 else ""
            print(f"[OK {L:2d}] {rel}\n         {val}{flag}")
        elif status not in ("SKIP_EXISTS",):
            print(f"[{status}] {rel}")
    if over:
        print("\n!!! ATTENTION titres >60 :", over)
        sys.exit(1)
    print("\nTous les seo_title insérés sont <=60. OK.")

if __name__ == "__main__":
    main()
