# Magic Survival - Fusion Codex (v0.9941)

An offline-first Progressive Web App (PWA) and interactive reference tool for Magic Survival v0.9941, built for the community on r/magic_survival. Covers all 62 verified combinations, including the 3 Magic Circle support combinations.

Hosted on GitHub Pages with zero external runtime dependencies, self-contained assets, and installable on Android and iOS.

---

## Features

- Dual-Slot Smart Combinator: Instant lookup between base magics, Lv.4 / Lv.7 trait selectors, elemental filters, and 14 functional scaling categories.
- Build Planner: Dedicated slots for Lv.25, Lv.50, and Lv.75 combination magics (plus 2 GoC Bonus slots while Gate of Creation is pinned and 1 DoP Bonus slot with the Domain of Power artifact, max 6) with automatic conflict detection, real artifact names per Main Magic (Mastery synergy sets marked), Combination Magic boosters, the class and test subject tied to each Main Magic, and an in-run leveling checklist.
- Verified Game Data: 182 artifacts, 63 synergies, 24 classes and 25 test subjects transcribed from the v0.9941 in-game Encyclopedia, class-select and Test Subject screens, with a searchable Artifact & Synergy Index in the Codex tab.
- Share and Export: Share builds via URL hash (#build=...) and copy formatted Markdown tables ready for r/magic_survival.
- Offline PWA: Pre-cached app shell and assets via Service Worker with isolated storage scope. Code and data are network-first (always the latest version online, cached copy offline); images stay cache-first.
- In-Game Card Inspector: Mechanics, buff stats, penalty stats, artifact scaling guidance, and full-resolution screenshot viewer.

---

## Maintenance Scripts

```text
python scripts/prepare_assets.py --only <id>[,<id>]   # screenshots in ../Lvl -> assets/thumbs + assets/cards (.webp)
python scripts/build_sw.py --cache ms-codex-v09941-vN  # resync sw.js precache list + bump cache key in sw.js & app.js
python scripts/build_game_data.py                      # ../research/ingame_data_v09941.json -> data/artifacts + data/classes_subjects
python scripts/verify_app.py                           # data, asset, precache, cache-key and CSP integrity checks
```

---

## Directory Structure

```text
Code/
|-- index.html
|-- styles.css
|-- app.js
|-- manifest.json
|-- sw.js
|-- data/
|   |-- combinations_v09941.json
|   |-- filter_taxonomy_v09941.json
|   |-- classes_subjects_v09941.json
|   `-- artifacts_v09941.json
|-- assets/
|   |-- icon-192.png
|   |-- icon-512.png
|   |-- icon-maskable-512.png
|   |-- og-banner.png
|   |-- thumbs/
|   `-- cards/
`-- scripts/
    |-- prepare_assets.py
    |-- build_sw.py
    |-- build_game_data.py
    `-- verify_app.py
```

---

## Disclaimer

Unofficial fan-made tool. Magic Survival and all in-game assets belong to LEME.
