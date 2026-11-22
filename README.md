# Magic Survival — Fusion Codex (v0.9941)

[![PWA Ready](https://img.shields.io/badge/PWA-100%25%20Offline%20Ready-22d3ee?style=flat-square)](https://github.com)
[![Game Version](https://img.shields.io/badge/Game%20Version-v0.9941-4ade80?style=flat-square)](https://reddit.com/r/magic_survival)
[![Reddit Community](https://img.shields.io/badge/Reddit-r%2Fmagic__survival-f87171?style=flat-square)](https://reddit.com/r/magic_survival)

An **Offline-First Progressive Web App (PWA)** and Interactive Grimoire for **Magic Survival v0.9941**, built for the global player community on [r/magic_survival](https://reddit.com/r/magic_survival).

Designed to be hosted directly on **GitHub Pages** with zero build dependencies, 100% self-contained assets, and instant installability on Android (WebAPK) and iOS.

---

## ✦ Key Features

- **Dual-Slot Smart Combinator:**
  - Fast, order-independent recipe lookup between **Slot 1 (Magic 1)** and **Slot 2 (Magic 2)**.
  - Interactive **7-Pointed Heptagram Star** swap & combine button matching in-game DNA.
  - Dynamic **Attribute (Trait) Chips**:
    - Offensive Spells: `Lv.7 Attribute`
    - Utility Spells (`Shield`, `Cloaking`, `Armageddon`): `Lv.5 Attribute`
    - Passives (`Arcane Effuse`, `Concentration`): `Max Level (Lv.3)`
    - **Magic Bolt Special Rule**: Distinct chips for both `Lv.4 Attribute` (`Magic Arrow`, `Split`, `Fireworks`) and `Lv.7 Attribute` (`Doppelganger`, `Fire at Will`, `Continuous Cast`).
  - Progressive fallback: if no direct fusion exists, one-tap buttons let you inspect combinations for either slot alone.

- **3-Slot Build Planner (Lv.25 / Lv.50 / Lv.75):**
  - Persistent floating mini-dock tracking your current run's 3 combination slots.
  - **Automatic Conflict Detection:** Alerts players if a combination shares a magic with an already-pinned spell to prevent burning resources mid-run.
  - **Artifact Priority Summary:** Highlights the 3 **Main Magics** that actually scale with in-game artifacts (reminding players that consumed material magics do not scale).
  - **In-Run 6-Magic Leveling Checklist:** Interactive checkboxes persisted in `localStorage` to check off base magics and exact attributes as you level them during a run, with a `Reset Run` button.
  - **Reddit Markdown Exporter:** Copies clean formatted tables ready to paste directly into `r/magic_survival`.
  - **Shareable URL Hash:** Share your build with friends via URL hash (`#build=telekinetic_sword,current_overload,gate`).

- **In-Game Inspector Modal:**
  - Structured stats view: exact mechanics, blue buffs, red penalties, and artifact scaling callout.
  - High-res card screenshot view with tap-to-zoom full-screen lightbox.
  - **"Find Compatible Partners"**: 1-tap filter to show combinations that share zero base magics with the selected combination.

- **100% Offline PWA:**
  - Pre-caches the app shell and all **118 WebP images** (59 cropped thumbnails + 59 full cards) via `sw.js`.
  - Smart Native Install UX on Android (WebAPK — zero Play Protect warnings) and iOS Add-to-Home-Screen hint.
  - Real-time cache monitor and manual cache refresh control.

---

## 📁 Repository Structure

```text
Code/
├── index.html                    # Single-page application (PWA shell)
├── manifest.json                 # Web App Manifest (PWA metadata & icons)
├── sw.js                         # Service Worker (100% offline caching)
├── .nojekyll                     # GitHub Pages Jekyll bypass
├── .gitignore                    # Standard git exclusions
├── data/
│   └── combinations_v09941.json  # 100% verified Single Source of Truth
├── assets/
│   ├── icon-192.png              # PWA App Icon (192x192)
│   ├── icon-512.png              # PWA App Icon (512x512)
│   ├── icon-maskable-512.png     # PWA Maskable Icon (512x512)
│   ├── og-banner.png             # Social Share Banner (1200x630)
│   ├── thumbs/                   # 59 square WebP spell artwork thumbnails
│   └── cards/                    # 59 optimized WebP full grimoire cards
└── scripts/
    ├── prepare_assets.py         # Pillow asset crop & optimization pipeline
    ├── build_sw.py               # Generates sw.js pre-cache manifest
    └── build_index.py            # Compiles index.html from source of truth
```

---

## 🚀 GitHub Pages Deployment

1. Commit and push the contents of `Code/` to your public GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial release: Magic Survival Fusion Codex v0.9941"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```
2. In your repository on GitHub:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select **Branch**: `main`, folder: `/ (root)`.
   - Click **Save**.
3. Your PWA will be live at `https://<username>.github.io/<repo-name>/`!

---

## 🔮 Upcoming in v2.0 Architecture

- Artifact Tier List & Synergy Matrix.
- Special Magic Integration: Magic Circle, DEM, PE, GOC.
- Subject & Class Mastery Synergy recommendations.

---

## ⚖️ Disclaimer

*Magic Survival — Fusion Codex* is an unofficial, open-source fan project created for the Magic Survival community. Magic Survival and all associated artwork, names, and mechanics are trademarks and copyright of **LEME** (vkslrzm).
