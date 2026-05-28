#!/usr/bin/env python3
"""Livraison data simulateur OPCO Sprint 2.

1. Charge l'export source + le simulator-ready.json de prod.
2. Produit un diff semantique (valeur par valeur) sur idcc_index / naf_fallback_index.
3. Si --write : ecrit le nouveau fichier au format canonique de la prod
   (sort_keys=True, indent=2, ensure_ascii=False) pour un git diff propre.

Usage :
  python scripts/deliver-simulator-data.py          # diff seulement
  python scripts/deliver-simulator-data.py --write   # ecrit le fichier
"""
import json
import sys
from pathlib import Path

SRC = Path(r"C:\Users\franc\OneDrive\Documents\Agence SAUVAGE\Claude Code\OPCO\data\exports\simulator-ready.json")
PROD = Path(r"C:\Users\franc\OneDrive\Documents\Agence SAUVAGE\Claude Code\lagencesauvage.com2\static\data\simulator-ready.json")


def load(p):
    return json.loads(p.read_text(encoding="utf-8"))


def diff_index(name, old, new):
    old_keys = set(old)
    new_keys = set(new)
    added = sorted(new_keys - old_keys, key=lambda k: (len(k), k))
    removed = sorted(old_keys - new_keys, key=lambda k: (len(k), k))
    modified = []
    for k in sorted(old_keys & new_keys, key=lambda k: (len(k), k)):
        if json.dumps(old[k], sort_keys=True, ensure_ascii=False) != json.dumps(new[k], sort_keys=True, ensure_ascii=False):
            modified.append(k)
    print(f"\n=== {name} ===")
    print(f"  ajoutes ({len(added)}) : {', '.join(added) or '-'}")
    print(f"  supprimes ({len(removed)}) : {', '.join(removed) or '-'}")
    print(f"  modifies ({len(modified)}) : {', '.join(modified) or '-'}")
    for k in modified:
        o = old[k]
        n = new[k]
        print(f"    [{k}] nom: {o.get('branche_nom')!r} -> {n.get('branche_nom')!r}")
        print(f"         details_dispo: {o.get('branche_details_disponibles')} -> {n.get('branche_details_disponibles')}"
              f" | provenance: {o.get('provenance_budget')} -> {n.get('provenance_budget')}")
    return added, removed, modified


def main():
    src = load(SRC)
    prod = load(PROD)

    print("TOP-LEVEL SOURCE :", ", ".join(sorted(src)))
    print("TOP-LEVEL PROD   :", ", ".join(sorted(prod)))
    print("schema_version   : prod", prod.get("schema_version"), "-> source", src.get("schema_version"))

    diff_index("idcc_index", prod.get("idcc_index", {}), src.get("idcc_index", {}))
    diff_index("naf_fallback_index", prod.get("naf_fallback_index", {}), src.get("naf_fallback_index", {}))

    # tefen_to_tranche_opco : verif egalite
    eq_tefen = json.dumps(prod.get("tefen_to_tranche_opco"), sort_keys=True) == json.dumps(src.get("tefen_to_tranche_opco"), sort_keys=True)
    print(f"\ntefen_to_tranche_opco identique : {eq_tefen}")

    if "--write" in sys.argv:
        out = json.dumps(src, sort_keys=True, indent=2, ensure_ascii=False) + "\n"
        PROD.write_text(out, encoding="utf-8")
        print(f"\n[ECRIT] {PROD} ({len(out):,} octets, format canonique sort_keys/indent=2)")
    else:
        print("\n(diff seulement — relancer avec --write pour ecrire)")


if __name__ == "__main__":
    main()
