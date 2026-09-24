"""Remove backgrounds from portraits and flatten onto off-white.

Usage:
  python scripts/cutout-portraits.py teams
  python scripts/cutout-portraits.py associates
"""
import io
import sys
from pathlib import Path

from PIL import Image
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
OFF_WHITE = (244, 240, 232, 255)
SKIP = {"default.webp", "partner_logo.webp"}

group = (sys.argv[1] if len(sys.argv) > 1 else "teams").strip().lower()
if group not in {"teams", "associates"}:
    raise SystemExit("usage: python scripts/cutout-portraits.py [teams|associates]")

SRC = ROOT / "resource" / "img" / f"{group}-original"
OUT = ROOT / "resource" / "img" / group
if not SRC.is_dir():
    raise SystemExit(f"missing originals: {SRC}")

OUT.mkdir(parents=True, exist_ok=True)
files = sorted(
    p
    for p in SRC.iterdir()
    if p.suffix.lower() in {".webp", ".png", ".jpg", ".jpeg"} and p.name.lower() not in SKIP
)

for path in files:
    print(f"cutout {path.name} ...", flush=True)
    cut = remove(path.read_bytes())
    img = Image.open(io.BytesIO(cut)).convert("RGBA")
    bg = Image.new("RGBA", img.size, OFF_WHITE)
    composed = Image.alpha_composite(bg, img).convert("RGB")
    out_path = OUT / f"{path.stem}.webp"
    composed.save(out_path, "WEBP", quality=88, method=4)
    print(f"  -> {out_path.relative_to(ROOT)}  {composed.size[0]}x{composed.size[1]}", flush=True)

# Keep skipped assets as-is from originals
for name in SKIP:
    src = SRC / name
    if src.is_file() and name != "default.webp":
        dest = OUT / name
        dest.write_bytes(src.read_bytes())
        print(f"keep  {name}", flush=True)

print(f"done  {len(files)} portraits ({group})")
