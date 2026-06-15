"""
Convertit le hero brut Gemini (V3 dithered Nous Research style) en WebP
optimise pour le blog. La V3 contient deja : logo l'agence sauvage,
Kanban 3 colonnes et zone de chat — pas besoin d'incrustation.

Usage : python scripts/incrust-logo-hermes-hero.py
"""

import os
from PIL import Image

SRC = r"C:\tmp\hermes-hero-v3-raw.jpeg"
DEST = r"C:\Claude\lagencesauvage.com2\static\assets\images\blog\hermes-agent-autonome-dirigeant.webp"

src = Image.open(SRC).convert("RGB")
print(f"Source: {src.size[0]}x{src.size[1]}")

os.makedirs(os.path.dirname(DEST), exist_ok=True)

# Sweep resolution + qualite pour rester sous ~110 KB
for w, h in [(1280, 720), (1100, 619), (960, 540)]:
    img = src.resize((w, h), Image.LANCZOS) if w != src.size[0] else src
    for q in [85, 80, 75, 70, 65, 60, 55]:
        img.save(DEST, "WEBP", quality=q, method=6)
        size_kb = os.path.getsize(DEST) / 1024
        if size_kb < 110:
            print(f"{w}x{h} Q={q}: {size_kb:.1f} KB  <-- OK")
            break
        print(f"{w}x{h} Q={q}: {size_kb:.1f} KB")
    if size_kb < 110:
        break

print(f"\nDONE -> {DEST}")
