"""
Magic Survival — Fusion Codex: integrity checker

Verifies data, assets, Service Worker precache list, cache keys and CSP hygiene.
Paths are resolved relative to this script, so it runs from any working directory.

Usage:
    python scripts/verify_app.py
Exit code 0 = all checks passed (warnings allowed), 1 = at least one error.
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

CODE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = CODE_DIR / "data"

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def load_json(name):
    path = DATA_DIR / name
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        err(f"{name}: cannot parse JSON ({e})")
        return None


def check_data():
    db = load_json("combinations_v09941.json")
    tax = load_json("filter_taxonomy_v09941.json")
    classes = load_json("classes_subjects_v09941.json")
    if db is None or tax is None:
        return None

    combos = db.get("combinations", [])
    magics = {m["id"]: m for m in db.get("base_magics", [])}
    categories = db.get("meta", {}).get("categories", {})

    if db.get("meta", {}).get("total_combinations") != len(combos):
        err(f"meta.total_combinations={db.get('meta', {}).get('total_combinations')} but {len(combos)} combinations")

    ids = [c.get("id") for c in combos]
    dupes = {i for i in ids if ids.count(i) > 1}
    if dupes:
        err(f"duplicate combination ids: {sorted(dupes)}")

    # Objective-data policy (Discord moderator feedback): no subjective tier/rank ratings anywhere.
    tiered = [c["id"] for c in combos if "tier" in c or "rank" in c]
    if tiered:
        err(f"{len(tiered)} combinations carry subjective 'tier'/'rank' keys: {tiered[:5]}")

    for c in combos:
        cid = c.get("id")
        if c.get("category") not in categories:
            err(f"{cid}: category '{c.get('category')}' not in meta.categories")
        if "material_consumed" in c and not isinstance(c["material_consumed"], bool):
            err(f"{cid}: material_consumed must be a boolean")
        for role in ("main", "material"):
            part = c.get(role) or {}
            magic = magics.get(part.get("magic_id"))
            if not magic:
                err(f"{cid}: {role}.magic_id '{part.get('magic_id')}' is not a base magic")
                continue
            if part.get("level", 0) > magic.get("max_level", 0):
                err(f"{cid}: {role} level {part.get('level')} exceeds {magic['id']} max_level {magic.get('max_level')}")
            attrs = {a for t in magic.get("attribute_tiers", []) for a in t.get("attributes", [])}
            if attrs and part.get("attribute") not in attrs:
                warn(f"{cid}: {role} attribute '{part.get('attribute')}' not listed in {magic['id']} attribute_tiers")
        for key in ("mechanics", "buffs", "penalties"):
            if not isinstance(c.get(key), list):
                err(f"{cid}: '{key}' must be a list")
        for key in ("thumb_path", "card_path"):
            rel = c.get(key, "")
            if not rel or not (CODE_DIR / rel).is_file():
                err(f"{cid}: {key} '{rel}' missing on disk")

    # Taxonomy
    element_ids = {e["id"] for e in tax.get("elements", [])}
    func_ids = {f["id"] for f in tax.get("functional_filters", [])}
    tags = tax.get("combination_tags", {})
    for cid in ids:
        t = tags.get(cid)
        if not t:
            err(f"{cid}: missing taxonomy combination_tags entry")
            continue
        bad_el = set(t.get("elements", [])) - element_ids
        bad_fn = set(t.get("functional", [])) - func_ids
        if bad_el:
            err(f"{cid}: unknown element tags {sorted(bad_el)}")
        if bad_fn:
            err(f"{cid}: unknown functional tags {sorted(bad_fn)}")
    orphan_tags = set(tags) - set(ids)
    if orphan_tags:
        err(f"taxonomy tags for unknown combinations: {sorted(orphan_tags)}")
    bme = tax.get("base_magic_elements", {})
    missing_bme = set(magics) - set(bme)
    if missing_bme:
        err(f"base_magic_elements missing: {sorted(missing_bme)}")
    for mid, els in bme.items():
        bad = set(els) - element_ids
        if bad:
            err(f"base_magic_elements.{mid}: unknown elements {sorted(bad)}")

    # Classes & Test Subjects (verified v0.9941 data, see scripts/build_game_data.py)
    artifacts_doc = load_json("artifacts_v09941.json")
    art_ids = {a["id"] for a in (artifacts_doc or {}).get("artifacts", [])}
    if classes:
        cls_list = classes.get("classes", [])
        subj_list = classes.get("subjects", [])
        meta = classes.get("meta", {})
        if meta.get("total_classes") != len(cls_list):
            err(f"classes meta.total_classes={meta.get('total_classes')} but {len(cls_list)} classes")
        if meta.get("total_subjects") != len(subj_list):
            err(f"classes meta.total_subjects={meta.get('total_subjects')} but {len(subj_list)} subjects")
        cls_ids = {c.get("id") for c in cls_list}
        subj_ids = {s.get("id") for s in subj_list}
        for cl in cls_list:
            if not cl.get("verified"):
                err(f"class {cl.get('id')}: not marked verified")
            for m in [cl.get("magic_id")] + list(cl.get("related_magic_ids", [])):
                if m and m not in magics:
                    err(f"class {cl.get('id')}: magic '{m}' is not a base magic")
            if cl.get("subject_id") and cl["subject_id"] not in subj_ids:
                err(f"class {cl.get('id')}: subject_id '{cl['subject_id']}' not found")
            if "recommended_when" in cl:
                err(f"class {cl.get('id')}: subjective 'recommended_when' text is not allowed")
        for sb in subj_list:
            if sb.get("class_id") and sb["class_id"] not in cls_ids:
                err(f"subject {sb.get('id')}: class_id '{sb['class_id']}' not found")
            if sb.get("magic_id") and sb["magic_id"] not in magics:
                err(f"subject {sb.get('id')}: magic '{sb['magic_id']}' is not a base magic")
            if sb.get("starting_artifact_id") and art_ids and sb["starting_artifact_id"] not in art_ids:
                err(f"subject {sb.get('id')}: starting artifact '{sb['starting_artifact_id']}' not in artifacts")

    # Artifacts & Synergies (in-game Encyclopedia capture)
    if artifacts_doc:
        a_meta = artifacts_doc.get("meta", {})
        arts = artifacts_doc.get("artifacts", [])
        syns = artifacts_doc.get("synergies", [])
        if a_meta.get("total_artifacts") != len(arts):
            err(f"artifacts meta.total_artifacts={a_meta.get('total_artifacts')} but {len(arts)} artifacts")
        if a_meta.get("total_synergies") != len(syns):
            err(f"artifacts meta.total_synergies={a_meta.get('total_synergies')} but {len(syns)} synergies")
        if len(art_ids) != len(arts):
            err("artifacts: duplicate artifact ids")
        rarities = set(a_meta.get("rarity_order", []))
        for a in arts:
            if a.get("rarity") not in rarities:
                err(f"artifact {a.get('id')}: rarity '{a.get('rarity')}' not in rarity_order")
            if not a.get("effects"):
                err(f"artifact {a.get('id')}: no effects")
        for s in syns:
            missing = [r for r in s.get("requires", []) if r not in art_ids]
            if missing:
                err(f"synergy {s.get('id')}: unknown required artifacts {missing}")
            if s.get("mastery_magic_id") and s["mastery_magic_id"] not in magics:
                err(f"synergy {s.get('id')}: mastery magic '{s['mastery_magic_id']}' is not a base magic")
        for mid, ids_ in artifacts_doc.get("magic_artifacts", {}).items():
            if mid not in magics:
                err(f"magic_artifacts: '{mid}' is not a base magic")
            bad = [i for i in ids_ if i not in art_ids]
            if bad:
                err(f"magic_artifacts.{mid}: unknown artifacts {bad}")
        boosters = artifacts_doc.get("combination_boosters", {})
        for i in boosters.get("artifacts", []):
            if i not in art_ids:
                err(f"combination_boosters: unknown artifact '{i}'")
        if "domain_of_power" not in art_ids:
            err("artifacts: 'domain_of_power' missing (planner DoP slot relies on it)")

    # Asset files on disk vs database
    for folder in ("thumbs", "cards"):
        on_disk = {p.stem for p in (CODE_DIR / "assets" / folder).glob("*.webp")}
        extra = on_disk - set(ids)
        if extra:
            warn(f"assets/{folder}: unreferenced files {sorted(extra)}")

    try:
        from PIL import Image
        for c in combos:
            with Image.open(CODE_DIR / c["thumb_path"]) as im:
                if im.size != (256, 256):
                    err(f"{c['id']}: thumb is {im.size}, expected (256, 256)")
            with Image.open(CODE_DIR / c["card_path"]) as im:
                if im.size[0] != 540:
                    err(f"{c['id']}: card width is {im.size[0]}, expected 540")
    except ImportError:
        warn("Pillow not installed: skipped image dimension checks")
    except FileNotFoundError:
        pass  # already reported above

    return ids


def check_service_worker(ids):
    sw = (CODE_DIR / "sw.js").read_text(encoding="utf-8")
    app = (CODE_DIR / "app.js").read_text(encoding="utf-8")

    shell_m = re.search(r"const APP_SHELL = \[(.*?)\];", sw, re.S)
    combo_m = re.search(r"const COMBO_ASSETS = \[(.*?)\];", sw, re.S)
    if not shell_m or not combo_m:
        err("sw.js: APP_SHELL or COMBO_ASSETS block not found")
        return
    shell = re.findall(r"'([^']+)'", shell_m.group(1))
    combo_assets = re.findall(r"'([^']+)'", combo_m.group(1))

    for p in shell:
        target = CODE_DIR / ("index.html" if p == "./" else p[2:])
        if not target.is_file():
            err(f"sw.js APP_SHELL: '{p}' missing on disk")

    expected = []
    for cid in ids or []:
        expected += [f"./assets/thumbs/{cid}.webp", f"./assets/cards/{cid}.webp"]
    if combo_assets != expected:
        missing = sorted(set(expected) - set(combo_assets))
        extra = sorted(set(combo_assets) - set(expected))
        err(f"sw.js COMBO_ASSETS out of sync (missing={missing}, extra={extra}); run scripts/build_sw.py")
    for p in combo_assets:
        if not (CODE_DIR / p[2:]).is_file():
            err(f"sw.js COMBO_ASSETS: '{p}' missing on disk")
    all_urls = shell + combo_assets
    if len(all_urls) != len(set(all_urls)):
        err("sw.js: duplicate precache URLs")

    sw_key = re.search(r"const CACHE_NAME = '([^']+)';", sw)
    app_key = re.search(r"const CURRENT_CACHE_NAME = '([^']+)';", app)
    if not sw_key or not app_key or sw_key.group(1) != app_key.group(1):
        err(f"cache key mismatch: sw.js={sw_key and sw_key.group(1)} app.js={app_key and app_key.group(1)}")

    shell_const = re.search(r"const APP_SHELL_ASSET_COUNT = (\d+);", app)
    if not shell_const or int(shell_const.group(1)) != len(shell):
        err(f"app.js APP_SHELL_ASSET_COUNT={shell_const and shell_const.group(1)} but sw.js APP_SHELL has {len(shell)}")

    print(f"  precache: {len(shell)} app shell + {len(combo_assets)} combo assets = {len(all_urls)} ({sw_key and sw_key.group(1)})")


def check_csp_and_copy():
    html = (CODE_DIR / "index.html").read_text(encoding="utf-8")
    app = (CODE_DIR / "app.js").read_text(encoding="utf-8")

    if 'http-equiv="Content-Security-Policy"' not in html:
        err("index.html: CSP meta tag missing")
    for name, text in (("index.html", html), ("app.js", app)):
        handlers = re.findall(r"\son[a-z]+\s*=\s*[\"']", text)
        if handlers:
            err(f"{name}: inline event handlers found {handlers[:5]}")
        if re.search(r"\sstyle\s*=\s*[\"']", text):
            err(f"{name}: inline style attribute found (blocked by CSP style-src)")
    if re.search(r"<script(?![^>]*\bsrc=)[^>]*>", html):
        err("index.html: inline <script> block found (blocked by CSP script-src)")

    for name in ("index.html", "app.js", "README.md"):
        text = (CODE_DIR / name).read_text(encoding="utf-8")
        if re.search(r"\b59 (?:verified )?[Cc]ombinations?\b|All 59\b", text):
            err(f"{name}: hardcoded '59' combination count left over")


def check_js_syntax():
    node = shutil.which("node")
    if not node:
        warn("node not found: skipped JS syntax check")
        return
    for name in ("app.js", "sw.js"):
        r = subprocess.run([node, "--check", str(CODE_DIR / name)], capture_output=True, text=True)
        if r.returncode != 0:
            err(f"{name}: syntax error\n{r.stderr.strip()}")


def main():
    print("Fusion Codex integrity check")
    ids = check_data()
    if ids is not None:
        print(f"  data: {len(ids)} combinations")
    check_service_worker(ids)
    check_csp_and_copy()
    check_js_syntax()

    for w in warnings:
        print(f"  WARN  {w}")
    for e in errors:
        print(f"  ERROR {e}")
    if errors:
        print(f"FAILED: {len(errors)} error(s), {len(warnings)} warning(s)")
        sys.exit(1)
    print(f"PASSED with {len(warnings)} warning(s)")


if __name__ == "__main__":
    main()
