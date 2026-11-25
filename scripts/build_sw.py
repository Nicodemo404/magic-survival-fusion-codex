"""
Magic Survival — Fusion Codex: Service Worker precache sync

Rewrites only the COMBO_ASSETS block in sw.js from data/combinations_v09941.json
(one thumb + one card per combination) and, with --cache, bumps the cache key in
BOTH sw.js (CACHE_NAME) and app.js (CURRENT_CACHE_NAME) so they never drift apart.
Everything else in sw.js is left untouched.

Usage:
    python scripts/build_sw.py                              # resync COMBO_ASSETS only
    python scripts/build_sw.py --cache ms-codex-v09941-v9   # resync + bump cache key
"""
import argparse
import json
import re
from pathlib import Path

CODE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = CODE_DIR / "data" / "combinations_v09941.json"
SW_PATH = CODE_DIR / "sw.js"
APP_PATH = CODE_DIR / "app.js"

COMBO_BLOCK_RE = re.compile(r"(const COMBO_ASSETS = \[)(.*?)(\];)", re.S)
SW_CACHE_RE = re.compile(r"(const CACHE_NAME = ')([^']+)(';)")
APP_CACHE_RE = re.compile(r"(const CURRENT_CACHE_NAME = ')([^']+)(';)")


def read_text(path: Path):
    raw = path.read_bytes().decode("utf-8")
    newline = "\r\n" if "\r\n" in raw else "\n"
    return raw, newline


def write_text(path: Path, text: str):
    path.write_bytes(text.encode("utf-8"))


def sub_once(pattern: re.Pattern, repl, text: str, label: str) -> str:
    new_text, n = pattern.subn(repl, text, count=1)
    if n != 1:
        raise RuntimeError(f"Could not find {label}")
    return new_text


def main():
    parser = argparse.ArgumentParser(description="Sync sw.js precache list and cache key.")
    parser.add_argument("--cache", help="New cache key, e.g. ms-codex-v09941-v9 (updates sw.js and app.js).")
    args = parser.parse_args()

    db = json.loads(DB_PATH.read_text(encoding="utf-8"))
    ids = [c["id"] for c in db["combinations"]]

    sw, nl = read_text(SW_PATH)
    lines = []
    for cid in ids:
        lines.append(f"  './assets/thumbs/{cid}.webp',")
        lines.append(f"  './assets/cards/{cid}.webp',")
    block = nl + nl.join(lines) + nl
    sw = sub_once(COMBO_BLOCK_RE, lambda m: m.group(1) + block + m.group(3), sw, "COMBO_ASSETS block in sw.js")

    if args.cache:
        if not re.fullmatch(r"ms-codex-[A-Za-z0-9.-]+", args.cache):
            raise ValueError("Cache key must look like ms-codex-v09941-vN")
        sw = sub_once(SW_CACHE_RE, lambda m: m.group(1) + args.cache + m.group(3), sw, "CACHE_NAME in sw.js")
        app, _ = read_text(APP_PATH)
        app = sub_once(APP_CACHE_RE, lambda m: m.group(1) + args.cache + m.group(3), app, "CURRENT_CACHE_NAME in app.js")
        write_text(APP_PATH, app)

    write_text(SW_PATH, sw)

    shell = re.search(r"const APP_SHELL = \[(.*?)\];", sw, re.S)
    shell_count = len(re.findall(r"'([^']+)'", shell.group(1))) if shell else 0
    cache_key = SW_CACHE_RE.search(sw).group(2)
    print(f"sw.js synced: {shell_count} app shell + {len(ids) * 2} combo assets = {shell_count + len(ids) * 2} precached ({cache_key})")


if __name__ == "__main__":
    main()
