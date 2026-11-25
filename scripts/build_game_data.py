"""
Magic Survival — Fusion Codex: build verified game data files

Reads the in-game capture (../research/ingame_data_v09941.json, taken from the v0.9941
Encyclopedia, class-select and Test Subject screens) and writes:

    data/classes_subjects_v09941.json   24 classes + 25 test subjects
    data/artifacts_v09941.json          182 artifacts, 63 synergies, magic -> artifact map

Usage:
    python scripts/build_game_data.py [path/to/ingame_data_v09941.json]
"""
import json
import re
import sys
from pathlib import Path

CODE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = CODE_DIR / "data"
DEFAULT_SRC = CODE_DIR.parent / "research" / "ingame_data_v09941.json"

RARITY_ORDER = ["Normal", "Rare", "Epic", "Special", "Legendary"]

# Annotations added while transcribing (not in-game text) -> (clean text, note)
TRANSCRIPTION_NOTES = {
    "  (digit 7 read from small font)": "7% values read from a small in-game font",
    " (digit 13 vs 15 uncertain)": "13% read from a small in-game font (could be 15%)",
    " (as rendered)": "In-game text reads 'per current level 2' (likely a formatting glyph)",
    '  (name rendered "ASI"; community calls an artifact "AI Magic")': None,
}
PENALTY_MARKERS = (" (penalty, red)", " (penalty)")

# Artifacts that mention a magic without scaling it (Pandora's Box casts magics on its own).
NON_SCALING_MENTIONS = {"Pandora's Box"}

# Classes with a broader identity: magics they level up (from "X Lv +1" lines).
LEVEL_UP_RE = re.compile(r"^(.+?) Lv \+1$")


def slug(name):
    s = name.lower().replace("'", "").replace("&", "and")
    return re.sub(r"[^a-z0-9]+", "_", s).strip("_")


def clean_effects(raw_effects):
    effects, penalties, notes = [], [], []
    for e in raw_effects:
        text = e
        for marker, note in TRANSCRIPTION_NOTES.items():
            if marker in text:
                text = text.replace(marker, "")
                if note:
                    notes.append(note)
        is_penalty = False
        for marker in PENALTY_MARKERS:
            if text.endswith(marker):
                text = text[: -len(marker)]
                is_penalty = True
        (penalties if is_penalty else effects).append(text.strip())
    return effects, penalties, notes


def magic_mention_re(name):
    # "Fireball" also matches "Fireballs"; case-insensitive for "satellite damage".
    return re.compile(r"\b" + re.escape(name) + r"s?\b", re.I)


def write_json(path, obj):
    text = json.dumps(obj, indent=2, ensure_ascii=False).replace("\n", "\r\n") + "\r\n"
    path.write_bytes(text.encode("utf-8"))


def main():
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    raw = json.loads(src.read_text(encoding="utf-8"))
    db = json.loads((DATA_DIR / "combinations_v09941.json").read_text(encoding="utf-8"))
    tax = json.loads((DATA_DIR / "filter_taxonomy_v09941.json").read_text(encoding="utf-8"))

    magic_by_name = {m["name"]: m["id"] for m in db["base_magics"]}
    bme = tax.get("base_magic_elements", {})

    # ---------------- Artifacts ----------------
    artifacts = []
    for a in raw["artifacts"]:
        effects, penalties, notes = clean_effects(a["effects"])
        item = {"id": slug(a["name"]), "name": a["name"], "rarity": a["rarity"], "effects": effects}
        if penalties:
            item["penalties"] = penalties
        if notes:
            item["transcription_note"] = "; ".join(notes)
        artifacts.append(item)
    art_by_name = {a["name"]: a for a in artifacts}
    assert len(art_by_name) == len(artifacts), "duplicate artifact names"

    synergies = []
    for s in raw["synergies"]:
        effects, penalties, _ = clean_effects(s["effects"])
        mastery = re.match(r"^Mastery : (.+)$", s["name"])
        item = {
            "id": slug(s["name"]),
            "name": s["name"],
            "effects": effects,
            "requires": [art_by_name[r]["id"] for r in s["requires"]],
        }
        if mastery:
            item["mastery_magic_id"] = magic_by_name[mastery.group(1)]
        synergies.append(item)

    # Magic -> artifacts whose in-game text names that magic (Mastery set first).
    magic_artifacts = {}
    for mname, mid in magic_by_name.items():
        rx = magic_mention_re(mname)
        hits = [a["id"] for a in artifacts
                if a["name"] not in NON_SCALING_MENTIONS and any(rx.search(e) for e in a["effects"])]
        if not hits:
            continue
        mastery = next((s for s in synergies if s.get("mastery_magic_id") == mid), None)
        first = mastery["requires"] if mastery else []
        magic_artifacts[mid] = first + [h for h in hits if h not in first]

    combo_rx = re.compile(r"Combination Magic|Magic Combination", re.I)
    boosters = {
        "artifacts": [a["id"] for a in artifacts if any(combo_rx.search(e) for e in a["effects"])],
        "synergies": [s["id"] for s in synergies if any(combo_rx.search(e) for e in s["effects"])],
    }

    rarity_counts = {r: sum(1 for a in artifacts if a["rarity"] == r) for r in RARITY_ORDER}
    artifacts_doc = {
        "meta": {
            "game": "Magic Survival",
            "version": "v0.9941",
            "source": "In-game Encyclopedia (Artifact & Synergy tabs), captured 2026-11-25",
            "total_artifacts": len(artifacts),
            "total_synergies": len(synergies),
            "rarity_order": RARITY_ORDER,
            "rarity_counts": rarity_counts,
            "magic_artifacts_rule": "Artifacts whose in-game text names the magic; the magic's Mastery synergy set is listed first.",
        },
        "artifacts": artifacts,
        "synergies": synergies,
        "magic_artifacts": magic_artifacts,
        "combination_boosters": boosters,
    }

    # ---------------- Classes & Subjects ----------------
    subj_by_name = {s["name"]: s for s in raw["subjects"]}
    classes = []
    for c in raw["classes"]:
        base = c["base_bonuses"]
        cid = slug(c["name"])
        magic_id = None
        for line in base:
            m = re.match(r"^Every 5 levels, (.+) Damage 3% is added$", line) or \
                re.match(r"^Every time the character gains 5 levels, (.+) Damage 3% is added$", line)
            if m:
                magic_id = magic_by_name[m.group(1)]
        related = []
        for line in base + c["mastery_bonuses"]:
            lm = LEVEL_UP_RE.match(line)
            if lm:
                for part in lm.group(1).split(" & "):
                    mid = magic_by_name.get(part.strip())
                    if mid and mid not in related:
                        related.append(mid)
        # Normalise the shortened transcription back to the in-game wording.
        base_text = [
            re.sub(r"^Every 5 levels, ", "Every time the character gains 5 levels, ", b) for b in base
        ]
        subj = subj_by_name.get(c["name"])
        classes.append({
            "id": cid,
            "name": c["name"],
            "archetype": "specialist" if magic_id else "universal",
            "magic_id": magic_id,
            "related_magic_ids": related,
            "elements": bme.get(magic_id, []) if magic_id else [],
            "base_bonuses": [b.replace(" (penalty)", "") for b in base_text],
            "penalties": [b.replace(" (penalty)", "") for b in base_text if b.endswith("(penalty)")],
            "mastery_bonuses": c["mastery_bonuses"],
            "subject_id": "subject_" + cid if subj else None,
            "verified": True,
        })
    for cl in classes:
        cl["base_bonuses"] = [b for b in cl["base_bonuses"] if b not in cl["penalties"]]
        if not cl["penalties"]:
            del cl["penalties"]

    subjects = []
    for s in raw["subjects"]:
        bm = re.match(r"^Increase (.+) Damage by 5% \(All Classes\)$", s["bonus"])
        art = s["starting_artifact"]
        art_name = None if art.startswith("(none") else art.replace(" +1", "")
        cls = next((c for c in classes if c["name"] == s["name"]), None)
        subjects.append({
            "id": "subject_" + slug(s["name"]),
            "name": s["name"],
            "class_id": cls["id"] if cls else None,
            "magic_id": magic_by_name.get(bm.group(1)) if bm else None,
            "starting_artifact_id": art_by_name[art_name]["id"] if art_name else None,
            "bonus": s["bonus"],
            "verified": True,
        })

    classes_doc = {
        "meta": {
            "game": "Magic Survival",
            "version": "v0.9941",
            "status": "verified",
            "source": "In-game class-select and Test Subject screens, captured 2026-11-25",
            "total_classes": len(classes),
            "total_subjects": len(subjects),
            "note": "Specialist classes give +3% damage to their magic every 5 character levels. "
                    "Unowned test subjects cost 800 gems; Wizard is the default subject.",
            "ultimate_requirement": "Ultimates (unlocked after clearing City) need the combination active, "
                                    "the class and test subject tied to its primary magic, and character Lv.100 "
                                    "(community FAQ, Magic Survival Discord).",
        },
        "classes": classes,
        "subjects": subjects,
    }

    write_json(DATA_DIR / "artifacts_v09941.json", artifacts_doc)
    write_json(DATA_DIR / "classes_subjects_v09941.json", classes_doc)
    print(f"artifacts: {len(artifacts)} ({rarity_counts}), synergies: {len(synergies)}")
    print(f"magic_artifacts: {len(magic_artifacts)} magics; boosters: {boosters}")
    print(f"classes: {len(classes)} ({sum(1 for c in classes if c['magic_id'])} specialists), subjects: {len(subjects)}")


if __name__ == "__main__":
    main()
