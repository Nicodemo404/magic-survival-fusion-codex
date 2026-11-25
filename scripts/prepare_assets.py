"""
Magic Survival v0.9941 — Real Asset Pipeline
Crops spell artwork thumbnails into assets/thumbs/<id>.webp and optimizes full cards into assets/cards/<id>.webp
directly from the real in-game screenshots in ../Lvl/ (one per combination, via each combo's `source_file`).
Optionally regenerates PWA icons and the 1200x630 social share banner (--icons).

Usage:
    python scripts/prepare_assets.py                       # process every combination
    python scripts/prepare_assets.py --only overmind,gate_of_creation
    python scripts/prepare_assets.py --icons               # also regenerate icons & OG banner
"""
import argparse
import json
import math
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

CODE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = CODE_DIR / "data" / "combinations_v09941.json"
LVL_DIR = CODE_DIR.parent / "Lvl"
ASSETS_DIR = CODE_DIR / "assets"
THUMBS_DIR = ASSETS_DIR / "thumbs"
CARDS_DIR = ASSETS_DIR / "cards"

THUMBS_DIR.mkdir(parents=True, exist_ok=True)
CARDS_DIR.mkdir(parents=True, exist_ok=True)


def get_font(size: int, bold: bool = False, mono: bool = False, serif: bool = False):
    font_names = []
    if serif:
        font_names = ["georgiab.ttf" if bold else "georgia.ttf", "timesbd.ttf" if bold else "times.ttf"]
    elif mono:
        font_names = ["consola.ttf", "cour.ttf", "arial.ttf"]
    elif bold:
        font_names = ["segoeuib.ttf", "arialbd.ttf", "segoeui.ttf", "arial.ttf"]
    else:
        font_names = ["segoeui.ttf", "arial.ttf"]

    for name in font_names:
        try:
            return ImageFont.truetype(name, size)
        except Exception:
            pass
        # Fallback to system fonts directory if available
        sys_fonts = os.path.join(os.environ.get("SystemRoot", os.environ.get("windir", "")), "Fonts")
        if sys_fonts and os.path.exists(sys_fonts):
            p = os.path.join(sys_fonts, name)
            if os.path.exists(p):
                try:
                    return ImageFont.truetype(p, size)
                except Exception:
                    continue
    return ImageFont.load_default()


def crop_spell_art(img: Image.Image) -> Image.Image:
    """
    Magic Survival combination detail cards place the glowing spell artwork
    in the upper-center square region (approx y: 15%..50%, centered horizontally).
    """
    w, h = img.size
    box_size = int(min(w * 0.66, h * 0.34))
    cx = w // 2
    cy = int(h * 0.325)
    left = max(0, cx - box_size // 2)
    top = max(0, cy - box_size // 2)
    right = min(w, left + box_size)
    bottom = min(h, top + box_size)
    cropped = img.crop((left, top, right, bottom))
    return cropped.resize((256, 256), Image.Resampling.LANCZOS)


# Encyclopedia detail screenshots (1220x2712): game chrome sits above y=13.3% (coin counter, two close
# buttons) and the favourite star starts at y=86%. Mechanics text never goes below y=80.5%.
CARD_TOP = 0.145
CARD_BOTTOM = 0.84
# Prev/next arrows beside the combination title (white triangles near the left/right edges).
ARROW_BAND = (0.54, 0.60)
ARROW_EDGE = 0.18


def remove_card_chrome(img: Image.Image) -> Image.Image:
    """Crop the in-game chrome (coins, close buttons, star) and paint out the prev/next arrows."""
    img = img.convert("RGB")
    w, h = img.size
    draw = ImageDraw.Draw(img)
    y0, y1 = int(h * ARROW_BAND[0]), int(h * ARROW_BAND[1])
    for x0, x1 in ((0, int(w * ARROW_EDGE)), (int(w * (1 - ARROW_EDGE)), w)):
        mask = img.crop((x0, y0, x1, y1)).convert("L").point(lambda v: 255 if v > 150 else 0)
        box = mask.getbbox()
        if box:
            pad = 8
            draw.rectangle(
                [x0 + box[0] - pad, y0 + box[1] - pad, x0 + box[2] + pad, y0 + box[3] + pad],
                fill=(0, 0, 0),
            )
    return img.crop((0, int(h * CARD_TOP), w, int(h * CARD_BOTTOM)))


def optimize_card(img: Image.Image) -> Image.Image:
    img = remove_card_chrome(img)
    w, h = img.size
    target_w = 540
    if w > target_w:
        ratio = target_w / w
        img = img.resize((target_w, int(h * ratio)), Image.Resampling.LANCZOS)
    return img


def draw_heptagram(draw: ImageDraw.ImageDraw, cx: float, cy: float, R: float, color=(34, 211, 238), alpha=255, stroke=2):
    """Draws a 7-pointed mystical star {7/3} with concentric arcane circles and glow."""
    verts = []
    for i in range(7):
        a = -math.pi / 2 + i * (2 * math.pi / 7)
        verts.append((cx + R * math.cos(a), cy + R * math.sin(a)))

    order = [0, 3, 6, 2, 5, 1, 4, 0]
    points = [verts[idx] for idx in order]

    # Outer circles
    draw.ellipse([cx - R - 8, cy - R - 8, cx + R + 8, cy + R + 8], outline=(*color, int(alpha * 0.45)), width=max(1, stroke))
    draw.ellipse([cx - R - 16, cy - R - 16, cx + R + 16, cy + R + 16], outline=(*color, int(alpha * 0.2)), width=1)

    # Inner circle
    r_in = R * 0.44
    draw.ellipse([cx - r_in, cy - r_in, cx + r_in, cy + r_in], outline=(*color, int(alpha * 0.5)), width=max(1, stroke - 1))

    # Star lines with subtle multi-pass glow
    for w_mul, a_mul in [(3.0, 0.3), (1.5, 0.6), (1.0, 1.0)]:
        sw = max(1, int(stroke * w_mul))
        cur_a = int(alpha * a_mul)
        for i in range(len(points) - 1):
            draw.line([points[i], points[i + 1]], fill=(*color, cur_a), width=sw)

    # Vertex gems
    dot_r = max(2, int(R * 0.035))
    for vx, vy in verts:
        draw.ellipse([vx - dot_r, vy - dot_r, vx + dot_r, vy + dot_r], fill=(230, 213, 152, alpha), outline=(*color, alpha), width=1)


def generate_pwa_icons():
    """Generates 192x192, 512x512, maskable icons and the 1200x630 social share banner."""
    print("Generating PWA icons and OG banner...")

    # 1. 512x512 standard icon (Pitch black #000000)
    im512 = Image.new("RGBA", (512, 512), (0, 0, 0, 255))
    draw512 = ImageDraw.Draw(im512)
    # Subtle inner border
    draw512.rectangle([8, 8, 504, 504], outline=(36, 39, 46, 180), width=1)
    draw_heptagram(draw512, 256, 256, 175, color=(34, 211, 238), alpha=255, stroke=3)
    im512.save(ASSETS_DIR / "icon-512.png", "PNG")

    # 2. 192x192 standard icon
    im192 = im512.resize((192, 192), Image.Resampling.LANCZOS)
    im192.save(ASSETS_DIR / "icon-192.png", "PNG")

    # 3. 512x512 maskable icon (safe zone is central 80%, radius <= 204px)
    im_mask = Image.new("RGBA", (512, 512), (0, 0, 0, 255))
    draw_mask = ImageDraw.Draw(im_mask)
    draw_heptagram(draw_mask, 256, 256, 140, color=(34, 211, 238), alpha=255, stroke=3)
    im_mask.save(ASSETS_DIR / "icon-maskable-512.png", "PNG")

    # 4. 1200x630 Social Share Banner (OpenGraph)
    # Authentic pitch-black grimoire aesthetic with dark silhouette spires & cyan mist
    og = Image.new("RGBA", (1200, 630), (0, 0, 0, 255))
    draw_og = ImageDraw.Draw(og)

    # Subtle cyan mist glow on the left / background
    for r, a in [(320, 10), (250, 18), (180, 28), (120, 40), (70, 60)]:
        draw_og.ellipse([260 - r, 315 - r, 260 + r, 315 + r], fill=(34, 211, 238, a))

    # Draw dark silhouette jagged spires at the bottom-left mimicking the title screen
    spire_points = [
        (0, 630), (0, 500), (30, 480), (60, 520), (90, 440), (120, 490),
        (150, 420), (180, 510), (210, 390), (230, 330), (240, 260), (245, 340),
        (260, 450), (290, 380), (320, 430), (350, 370), (370, 440), (410, 490),
        (450, 460), (490, 530), (530, 510), (580, 580), (640, 560), (720, 630)
    ]
    draw_og.polygon(spire_points, fill=(10, 14, 20, 230))

    # Arcane heptagram floating over the dark silhouette mist
    draw_heptagram(draw_og, 260, 315, 175, color=(34, 211, 238), alpha=255, stroke=3)

    # Frame border
    draw_og.rectangle([12, 12, 1188, 618], outline=(36, 39, 46, 255), width=2)
    draw_og.rectangle([18, 18, 1182, 612], outline=(16, 18, 22, 255), width=1)

    # Typography on right side
    f_og_title = get_font(50, bold=True, serif=True)
    f_og_sub = get_font(22, bold=True, mono=True)
    f_og_body = get_font(18, bold=False)
    f_og_tag = get_font(13, bold=True, mono=True)

    text_x = 510

    # Title in warm parchment bone-gold (#e6d598)
    draw_og.text((text_x, 145), "MAGIC SURVIVAL", fill=(230, 213, 152), font=f_og_title)
    draw_og.text((text_x, 218), "FUSION CODEX · v0.9941", fill=(34, 211, 238), font=f_og_sub)

    # Badges
    badges = ["59 COMBINATIONS", "ALL TIERS", "SMART COMBINATOR", "3-SLOT PLANNER", "OFFLINE PWA"]
    bx = text_x
    by = 280
    for b in badges:
        bw = len(b) * 9 + 18
        draw_og.rectangle([bx, by, bx + bw, by + 28], fill=(16, 18, 22, 255), outline=(36, 39, 46, 255), width=1)
        draw_og.text((bx + bw // 2, by + 14), b, fill=(228, 225, 216), font=f_og_tag, anchor="mm")
        bx += bw + 10
        if bx > 1100:
            bx = text_x
            by += 38

    # Feature details
    draw_og.text((text_x, 380), "Instant fusion lookup, Lv.4 / Lv.7 attribute filtering, conflict detection,", fill=(180, 184, 194), font=f_og_body)
    draw_og.text((text_x, 412), "in-game mechanics, buffs, penalties & Reddit export for r/magic_survival.", fill=(180, 184, 194), font=f_og_body)

    # Footer note
    f_foot = get_font(14, mono=True)
    draw_og.text((text_x, 480), "● Main (Artifact Scaled)   + Material (Consumed)   ▲ Buffs   ▼ Penalties", fill=(142, 196, 134), font=f_foot)

    # Save banner
    og.convert("RGB").save(ASSETS_DIR / "og-banner.png", "PNG")
    print("Icons & OG banner created successfully.")


def main():
    parser = argparse.ArgumentParser(description="Build thumbs/cards .webp assets from in-game screenshots.")
    parser.add_argument("--only", default="", help="Comma-separated combination ids to process (default: all).")
    parser.add_argument("--icons", action="store_true", help="Also regenerate PWA icons and the OG banner.")
    args = parser.parse_args()

    if not DB_PATH.exists():
        raise FileNotFoundError(f"Database file not found: {DB_PATH}")

    with open(DB_PATH, "r", encoding="utf-8") as f:
        db = json.load(f)

    all_combos = db.get("combinations", [])
    expected_total = db.get("meta", {}).get("total_combinations", len(all_combos))
    if len(all_combos) != expected_total:
        raise ValueError(f"meta.total_combinations is {expected_total} but found {len(all_combos)} combinations")

    combos = all_combos
    if args.only:
        wanted = {s.strip() for s in args.only.split(",") if s.strip()}
        unknown = wanted - {c["id"] for c in all_combos}
        if unknown:
            raise ValueError(f"Unknown combination ids: {sorted(unknown)}")
        combos = [c for c in all_combos if c["id"] in wanted]

    total = len(combos)
    print(f"Checking {total} combinations in {LVL_DIR}...")

    # Strictly verify every source screenshot exists before processing
    missing_files = []
    for combo in combos:
        cid = combo["id"]
        sf = combo.get("source_file")
        if not sf:
            missing_files.append((cid, "missing source_file in json"))
            continue
        src = LVL_DIR / sf
        if not src.exists():
            missing_files.append((cid, sf))

    if missing_files:
        raise FileNotFoundError(f"Fatal error: Missing {len(missing_files)}/{total} screenshots in {LVL_DIR}: {missing_files}")

    print(f"All {total} real in-game screenshots verified in Lvl directory! Processing...")

    processed = 0
    for combo in combos:
        cid = combo["id"]
        sf = combo["source_file"]
        src = LVL_DIR / sf

        with Image.open(src) as im:
            im = im.convert("RGB")
            thumb = crop_spell_art(im)
            thumb.save(THUMBS_DIR / f"{cid}.webp", "WEBP", quality=86, method=6)

            card = optimize_card(im)
            card.save(CARDS_DIR / f"{cid}.webp", "WEBP", quality=84, method=6)
        processed += 1

    print(f"Processed {processed}/{total} real in-game screenshots into thumbs & cards.")

    # Verification check: every combination in the database must have both assets
    missing_assets = [
        c["id"] for c in all_combos
        if not (THUMBS_DIR / f"{c['id']}.webp").exists() or not (CARDS_DIR / f"{c['id']}.webp").exists()
    ]
    if missing_assets:
        raise RuntimeError(f"Asset mismatch: missing thumbs/cards for {missing_assets}")

    print(f"Verification passed: thumbnails and cards present for all {len(all_combos)} combinations.")

    if args.icons:
        generate_pwa_icons()
    print("Done! All assets generated cleanly.")


if __name__ == "__main__":
    main()
