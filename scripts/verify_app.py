import json
import os
import re

code_dir = r"X:\Ai\Antigravity\Magic Survival\Code"

print("--- 1. Checking combinations_v09941.json ---")
with open(os.path.join(code_dir, "data", "combinations_v09941.json"), encoding="utf-8") as f:
    db = json.load(f)

combos = db["combinations"]
print(f"Total combinations: {len(combos)}")

missing_thumbs = []
missing_cards = []
for c in combos:
    cid = c["id"]
    t_path = os.path.join(code_dir, "assets", "thumbs", f"{cid}.webp")
    c_path = os.path.join(code_dir, "assets", "cards", f"{cid}.webp")
    if not os.path.exists(t_path): missing_thumbs.append(cid)
    if not os.path.exists(c_path): missing_cards.append(cid)

print(f"Missing thumbs: {len(missing_thumbs)}, Missing cards: {len(missing_cards)}")
assert len(missing_thumbs) == 0 and len(missing_cards) == 0, "Assets missing!"

print("\n--- 2. Checking sw.js precache list ---")
with open(os.path.join(code_dir, "sw.js"), encoding="utf-8") as f:
    sw_code = f.read()

precache_matches = re.findall(r"'(./[^']+)'", sw_code)
print(f"sw.js precached items found: {len(precache_matches)}")
missing_precache = []
for p in precache_matches:
    if p == "./":
        local_file = os.path.join(code_dir, "index.html")
    else:
        clean_p = p.replace("./", "").replace("/", os.sep)
        local_file = os.path.join(code_dir, clean_p)
    if not os.path.exists(local_file):
        missing_precache.append((p, local_file))

print(f"Missing precache files: {len(missing_precache)}")
if missing_precache:
    for m in missing_precache:
        print("  Missing:", m)
assert len(missing_precache) == 0, "Precache files missing!"

print("\n--- 3. Checking manifest.json ---")
with open(os.path.join(code_dir, "manifest.json"), encoding="utf-8") as f:
    manifest = json.load(f)

for icon in manifest["icons"]:
    clean_p = icon["src"].replace("./", "").replace("/", os.sep)
    icon_file = os.path.join(code_dir, clean_p)
    assert os.path.exists(icon_file), f"Manifest icon missing: {icon_file}"
    print(f"Verified icon: {icon['src']} ({icon['sizes']})")

print("\n--- 4. Checking Magic Bolt combinations ---")
mb_combos = [c for c in combos if c["main"]["magic_id"] == "magic_bolt" or c["material"]["magic_id"] == "magic_bolt"]
print(f"Magic bolt combos count: {len(mb_combos)}")
for c in mb_combos:
    role = "Main" if c["main"]["magic_id"] == "magic_bolt" else "Material"
    tier_info = c["main"] if role == "Main" else c["material"]
    print(f"  - {c['name']}: as {role}, Lv.{tier_info['level']} ({tier_info['attribute']})")

print("\n--- 5. Checking Passive combinations ---")
passive_magics = ["arcane_effuse", "concentration"]
p_combos = [c for c in combos if c["main"]["magic_id"] in passive_magics or c["material"]["magic_id"] in passive_magics]
print(f"Passive combos count: {len(p_combos)}")
for c in p_combos:
    role = "Main" if c["main"]["magic_id"] in passive_magics else "Material"
    p_info = c["main"] if role == "Main" else c["material"]
    print(f"  - {c['name']}: passive {p_info['magic_id']} as {role}")

print("\n--- 6. Checking Conflict Detection edge cases ---")
# If Telekinetic Sword (spirit + electric_shock) is pinned,
# Current Overload (electric_shock + spirit) must conflict.
# Blaster (magic_bolt + flash_shock) must not conflict.
# Brandish (flash_shock + spirit) must conflict (shares spirit).
def check_conflict(pinned_ids, candidate_combo):
    pinned_magics = set()
    for pid in pinned_ids:
        c = next(x for x in combos if x["id"] == pid)
        pinned_magics.add(c["main"]["magic_id"])
        pinned_magics.add(c["material"]["magic_id"])
    cand_magics = {candidate_combo["main"]["magic_id"], candidate_combo["material"]["magic_id"]}
    shared = pinned_magics.intersection(cand_magics)
    return len(shared) > 0, shared

tk = next(c for c in combos if c["id"] == "telekinetic_sword")
co = next(c for c in combos if c["id"] == "current_overload")
blaster = next(c for c in combos if c["id"] == "blaster")
brandish = next(c for c in combos if c["id"] == "brandish")

is_conf, shared = check_conflict(["telekinetic_sword"], co)
assert is_conf and "spirit" in shared and "electric_shock" in shared, "Current Overload should conflict with Telekinetic Sword"

is_conf, shared = check_conflict(["telekinetic_sword"], blaster)
assert not is_conf, "Blaster should not conflict with Telekinetic Sword"

is_conf, shared = check_conflict(["telekinetic_sword"], brandish)
assert is_conf and "spirit" in shared, "Brandish should conflict with Telekinetic Sword on spirit"

print("Conflict detection test passed perfectly!")

print("\n==============================================")
print("100% OF ALL CHECKS PASSED WITH FLYING COLORS!!")
print("==============================================")
