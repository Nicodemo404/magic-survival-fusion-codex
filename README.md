# Magic Survival - Fusion Codex (v0.9941)

An offline-first Progressive Web App (PWA) and interactive reference tool for Magic Survival v0.9941, built for the community on r/magic_survival.

Hosted on GitHub Pages with zero external runtime dependencies, self-contained assets, and installable on Android and iOS.

---

## Features

- Dual-Slot Smart Combinator: Instant lookup between base magics, Lv.4 / Lv.7 trait selectors, elemental filters, and 14 functional scaling categories.
- 3-Slot Build Planner: Dedicated slots for Lv.25, Lv.50, and Lv.75 combination magics with automatic conflict detection, deduplicated Main Magic artifact priority, recommended Class and Subject synergies, and in-run leveling checklist.
- Share and Export: Share builds via URL hash (#build=...) and copy formatted Markdown tables ready for r/magic_survival.
- Offline PWA: Pre-cached app shell and assets via Service Worker with isolated storage scope.
- In-Game Card Inspector: Mechanics, buff stats, penalty stats, artifact scaling guidance, and full-resolution screenshot viewer.

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
|   `-- classes_subjects_v09941.json
|-- assets/
|   |-- icon-192.png
|   |-- icon-512.png
|   |-- icon-maskable-512.png
|   |-- og-banner.png
|   |-- thumbs/
|   `-- cards/
`-- scripts/
    |-- prepare_assets.py
    `-- build_sw.py
```

---

## Disclaimer

Unofficial fan-made tool. Magic Survival and all in-game assets belong to LEME.
