#!/usr/bin/env python3
"""Regenere static/data/metadata.json a partir du simulator-ready.json deploye.

content_hash_sha256 = sha256 des bytes du fichier reellement servi (tracabilite).
version = schema_version (schema inchange) ; fraicheur tracee par source_bdd_version.

Usage : python scripts/regen-metadata.py [--write]
"""
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(r"C:\Claude\lagencesauvage.com2")
SIM = ROOT / "static" / "data" / "simulator-ready.json"
META = ROOT / "static" / "data" / "metadata.json"

SOURCE_BDD_VERSION = "2026-05-28"  # export OPCO Sprint 2 (opco-database-2026-05-28)


def main():
    raw = SIM.read_bytes()
    data = json.loads(raw.decode("utf-8"))
    idcc = data.get("idcc_index", {})
    naf = data.get("naf_fallback_index", {})

    # nb_branches et nb_opcos suivent une definition propre au build OPCO
    # (nb_opcos = nombre total d'OPCOs du paysage = 11, pas le nb couvert = 10 ;
    # cf. compute-engine.js "couverture de 10 OPCO sur 11"). On les PRESERVE
    # depuis le metadata existant plutot que de les recalculer avec une methode
    # divergente. Seuls les champs fonctionnels/non ambigus sont rafraichis.
    prev = json.loads(META.read_text(encoding="utf-8")) if META.exists() else {}

    meta = {
        "content_hash_sha256": hashlib.sha256(raw).hexdigest(),
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "nb_branches": prev.get("nb_branches", 59),
        "nb_idcc_couverts": len(idcc),
        "nb_naf_fallback": len(naf),
        "nb_opcos": prev.get("nb_opcos", 11),
        "source_bdd_version": SOURCE_BDD_VERSION,
        "version": data.get("schema_version", "?"),
    }

    print(json.dumps(meta, indent=2, ensure_ascii=False))

    if "--write" in sys.argv:
        META.write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"\n[ECRIT] {META}")
    else:
        print("\n(apercu — relancer avec --write pour ecrire)")


if __name__ == "__main__":
    main()
