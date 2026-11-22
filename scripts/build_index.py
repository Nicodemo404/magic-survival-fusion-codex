import json
from pathlib import Path

CODE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = CODE_DIR / "data" / "combinations_v09941.json"
INDEX_PATH = CODE_DIR / "index.html"

with open(DB_PATH, "r", encoding="utf-8") as f:
    db_json_str = f.read()

index_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="theme-color" content="#07090d" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Fusion Codex" />
  <meta name="description" content="Offline-First Fusion Codex & 3-Slot Build Planner for Magic Survival v0.9941." />

  <!-- OpenGraph & Twitter Social Cards -->
  <meta property="og:title" content="Magic Survival — Fusion Codex (v0.9941)" />
  <meta property="og:description" content="Offline-First Fusion Codex & 3-Slot Build Planner for Magic Survival v0.9941. Instant combination lookup, Lv.4/Lv.7 attribute filter, conflict detection, and Reddit export." />
  <meta property="og:image" content="./assets/og-banner.png" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Magic Survival — Fusion Codex (v0.9941)" />
  <meta name="twitter:description" content="Offline-First Fusion Codex & 3-Slot Build Planner for Magic Survival v0.9941." />
  <meta name="twitter:image" content="./assets/og-banner.png" />

  <title>Magic Survival — Fusion Codex (v0.9941)</title>

  <!-- PWA Manifest & Favicon -->
  <link rel="manifest" href="./manifest.json" />
  <link rel="icon" type="image/png" href="./assets/icon-192.png" />
  <link rel="apple-touch-icon" href="./assets/icon-192.png" />

  <!-- Google Fonts with local fallback -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />

  <style>
    :root {{
      --bg: #07090d;
      --surface: #0e131b;
      --surface-2: #141c27;
      --surface-3: #1a2433;
      --border: rgba(148, 163, 184, 0.14);
      --border-glow: rgba(34, 211, 238, 0.45);
      --text: #f1f5f9;
      --muted: #94a3b8;
      --cyan: #22d3ee;
      --cyan-soft: rgba(34, 211, 238, 0.14);
      --green: #4ade80;
      --green-soft: rgba(74, 222, 128, 0.12);
      --red: #f87171;
      --red-soft: rgba(248, 113, 113, 0.12);
      --amber: #f59e0b;
      --amber-soft: rgba(245, 158, 11, 0.14);
      --blue: #38bdf8;
      --crimson: #fb7185;
    }}
    * {{ box-sizing: border-box; -webkit-tap-highlight-color: transparent; }}
    html, body {{
      margin: 0; padding: 0;
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
    }}
    .app {{
      max-width: 520px;
      margin: 0 auto;
      padding-bottom: 142px;
      min-height: 100vh;
      position: relative;
    }}
    header {{
      position: relative;
      padding: 18px 16px 12px;
      text-align: center;
      background: radial-gradient(ellipse at top, rgba(34, 211, 238, 0.22), rgba(7, 9, 13, 0.98) 74%);
      border-bottom: 1px solid var(--border);
    }}
    header h1 {{
      margin: 0;
      font-family: 'Cinzel', serif;
      font-size: 1.45rem;
      letter-spacing: 0.14em;
      color: #fff;
      text-shadow: 0 0 18px rgba(34, 211, 238, 0.45);
    }}
    .subtitle {{
      margin-top: 3px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      letter-spacing: 0.2em;
      color: var(--cyan);
      text-transform: uppercase;
    }}

    /* Smart Install Banner */
    .install-banner {{
      background: linear-gradient(90deg, rgba(34, 211, 238, 0.15), rgba(14, 19, 27, 0.95));
      border: 1px solid var(--cyan);
      border-radius: 10px;
      padding: 8px 12px;
      margin: 10px 12px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.78rem;
    }}
    .install-banner-text {{
      display: flex;
      align-items: center;
      gap: 6px;
      color: #fff;
      font-weight: 500;
    }}
    .install-btn {{
      background: var(--cyan);
      color: #041016;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }}
    .banner-close {{
      background: transparent;
      border: none;
      color: var(--muted);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 4px;
    }}

    main {{ padding: 12px; }}

    .panel {{
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 12px;
      margin-bottom: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }}

    /* Dual Slot Grid */
    .slot-grid {{
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 8px;
      align-items: center;
    }}
    .slot-label {{
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
      margin-bottom: 4px;
      display: block;
      font-weight: 600;
    }}
    select, input[type="text"] {{
      width: 100%;
      background: var(--surface-2);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 10px 10px;
      font-size: 0.85rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }}
    select:focus, input[type="text"]:focus {{
      border-color: var(--cyan);
      box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.2);
    }}

    /* 7-Pointed Heptagram Swap Button */
    .star-btn {{
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 50%;
      width: 44px; height: 44px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      color: var(--cyan);
      margin-top: 14px;
      transition: transform 0.25s, border-color 0.2s, box-shadow 0.2s;
      padding: 0;
    }}
    .star-btn:hover {{
      border-color: var(--cyan);
      box-shadow: 0 0 14px rgba(34, 211, 238, 0.35);
    }}
    .star-btn:active {{
      transform: rotate(180deg) scale(0.9);
    }}

    /* Attribute Filter Chips */
    .attr-section {{
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--border);
    }}
    .attr-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }}
    .attr-tier-label {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.68rem;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}
    .chips {{
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 6px;
    }}
    .chip {{
      background: var(--surface-2);
      border: 1px solid var(--border);
      color: var(--muted);
      border-radius: 999px;
      padding: 6px 11px;
      font-size: 0.76rem;
      cursor: pointer;
      transition: all 0.15s;
      user-select: none;
    }}
    .chip:hover {{
      border-color: rgba(34, 211, 238, 0.4);
      color: var(--text);
    }}
    .chip.active {{
      background: var(--cyan-soft);
      border-color: var(--cyan);
      color: #fff;
      font-weight: 600;
      box-shadow: 0 0 12px rgba(34, 211, 238, 0.25);
    }}

    /* Controls & Search */
    .controls-row {{
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
      align-items: center;
    }}
    .seg-tabs {{
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 3px;
      margin-bottom: 10px;
      gap: 3px;
    }}
    .seg-btn {{
      background: transparent;
      border: none;
      color: var(--muted);
      padding: 9px 6px;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }}
    .seg-btn.active.all {{ background: var(--surface-2); color: #fff; }}
    .seg-btn.active.aoe {{ background: var(--cyan-soft); color: var(--cyan); }}
    .seg-btn.active.nuke {{ background: var(--amber-soft); color: var(--amber); }}

    .meta-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: var(--muted);
      margin-bottom: 10px;
      padding: 0 4px;
    }}
    .toggle-pill {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 5px 10px;
      border-radius: 999px;
      font-size: 0.73rem;
      user-select: none;
    }}
    .toggle-pill input {{ margin: 0; cursor: pointer; }}

    /* Combination Card List */
    .card-list {{ display: flex; flex-direction: column; gap: 9px; }}
    .combo-card {{
      display: grid;
      grid-template-columns: 56px 1fr auto;
      gap: 12px;
      align-items: center;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px;
      cursor: pointer;
      transition: border-color 0.15s, transform 0.1s, box-shadow 0.15s;
      position: relative;
    }}
    .combo-card:hover {{
      border-color: var(--border-glow);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
    }}
    .combo-card:active {{ transform: scale(0.99); }}
    .combo-card.conflict {{
      border-style: dashed;
      border-color: rgba(248, 113, 113, 0.4);
      background: linear-gradient(135deg, rgba(248, 113, 113, 0.05), var(--surface));
    }}
    .combo-card.pinned {{
      border-color: var(--cyan);
      background: linear-gradient(135deg, rgba(34, 211, 238, 0.09), var(--surface));
    }}
    .thumb {{
      width: 56px; height: 56px;
      border-radius: 10px;
      object-fit: cover;
      background: #000;
      border: 1px solid var(--border);
      flex-shrink: 0;
    }}
    .card-title-row {{
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }}
    .card-title {{
      font-weight: 700;
      font-size: 0.94rem;
      color: #fff;
    }}
    .badge {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }}
    .badge.aoe {{ background: var(--cyan-soft); color: var(--cyan); }}
    .badge.nuke {{ background: var(--amber-soft); color: var(--amber); }}
    .badge.conflict {{
      background: var(--red-soft);
      color: var(--red);
      border: 1px solid rgba(248, 113, 113, 0.3);
    }}

    .recipe {{
      margin-top: 5px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 0.76rem;
    }}
    .main-line {{ color: var(--green); }}
    .mat-line {{ color: var(--red); }}

    .pin-btn {{
      background: var(--surface-2);
      border: 1px solid var(--border);
      color: var(--muted);
      border-radius: 9px;
      padding: 8px 11px;
      font-size: 0.72rem;
      font-weight: 700;
      cursor: pointer;
      min-width: 62px;
      text-align: center;
      transition: all 0.15s;
    }}
    .pin-btn:hover {{ border-color: var(--cyan); color: #fff; }}
    .pin-btn.active {{
      background: var(--cyan);
      color: #041016;
      border-color: var(--cyan);
    }}

    /* Empty / No Fusion State */
    .empty-state {{
      text-align: center;
      padding: 32px 16px;
      background: var(--surface);
      border: 1px dashed var(--border);
      border-radius: 14px;
      color: var(--muted);
    }}
    .empty-state h3 {{
      margin: 0 0 6px;
      color: #fff;
      font-family: 'Cinzel', serif;
      font-size: 1.1rem;
    }}
    .empty-state p {{
      margin: 0 0 16px;
      font-size: 0.82rem;
      line-height: 1.5;
    }}
    .empty-actions {{
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 280px;
      margin: 0 auto;
    }}

    /* Floating 3-Slot Mini-Dock */
    .dock {{
      position: fixed;
      bottom: 58px;
      left: 50%;
      transform: translateX(-50%);
      width: min(520px, 100%);
      padding: 8px 12px;
      background: rgba(7, 9, 13, 0.94);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-top: 1px solid var(--border);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      z-index: 40;
    }}
    .dock-slot {{
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 9px;
      padding: 6px 8px;
      font-size: 0.7rem;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      transition: border-color 0.15s;
    }}
    .dock-slot.filled {{
      border-color: var(--cyan);
      color: #fff;
    }}
    .dock-slot.has-conflict {{
      border-color: var(--red);
      border-style: dashed;
    }}
    .dock-slot span {{
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.62rem;
      color: var(--cyan);
      font-weight: 700;
    }}

    /* Bottom Navigation */
    nav.bottom-nav {{
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: min(520px, 100%);
      height: 58px;
      background: #05070a;
      border-top: 1px solid var(--border);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      z-index: 50;
    }}
    .nav-btn {{
      background: transparent;
      border: none;
      color: var(--muted);
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 4px;
      transition: color 0.15s;
    }}
    .nav-btn.active {{ color: var(--cyan); }}
    .nav-icon {{ font-size: 1.1rem; line-height: 1; }}

    /* Modal Backdrop & Inspector Modal */
    .modal-backdrop {{
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 14px;
      z-index: 60;
    }}
    .modal-backdrop.open {{ display: flex; }}
    .modal {{
      width: min(480px, 100%);
      max-height: 90vh;
      overflow-y: auto;
      background: var(--surface);
      border: 1px solid var(--border-glow);
      border-radius: 16px;
      padding: 18px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
    }}
    .modal-head {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
    }}
    .close-btn {{
      background: var(--surface-2);
      border: 1px solid var(--border);
      color: #fff;
      border-radius: 8px;
      width: 34px; height: 34px;
      cursor: pointer;
      font-size: 1rem;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }}
    .stat-list {{
      margin: 12px 0;
      padding-left: 18px;
      font-size: 0.82rem;
      line-height: 1.55;
    }}
    .stat-buff {{ color: var(--blue); font-weight: 600; }}
    .stat-pen {{ color: var(--crimson); font-weight: 600; }}
    .artifact-scaling-box {{
      background: rgba(74, 222, 128, 0.08);
      border: 1px solid rgba(74, 222, 128, 0.25);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 0.78rem;
      color: var(--green);
      margin: 10px 0;
      line-height: 1.45;
    }}

    .card-img-full {{
      width: 100%;
      border-radius: 12px;
      border: 1px solid var(--border);
      margin-top: 10px;
      display: block;
      cursor: zoom-in;
    }}

    /* Lightbox Full Zoom */
    .lightbox {{
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 70;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 10px;
      cursor: zoom-out;
    }}
    .lightbox.open {{ display: flex; }}
    .lightbox img {{
      max-width: 100%;
      max-height: 98vh;
      object-fit: contain;
      border-radius: 8px;
    }}

    /* Buttons */
    .action-btn {{
      width: 100%;
      padding: 11px;
      border-radius: 10px;
      border: 1px solid var(--cyan);
      background: var(--cyan-soft);
      color: #fff;
      font-weight: 700;
      cursor: pointer;
      margin-top: 8px;
      font-size: 0.82rem;
      transition: all 0.15s;
    }}
    .action-btn:hover {{ background: var(--cyan); color: #041016; }}
    .action-btn.secondary {{
      border-color: var(--border);
      background: var(--surface-2);
      color: var(--text);
    }}
    .action-btn.secondary:hover {{
      border-color: var(--cyan);
    }}

    /* Planner Checklist */
    .checklist-row {{
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 4px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.08);
      font-size: 0.82rem;
      cursor: pointer;
      user-select: none;
    }}
    .checklist-row:last-child {{ border-bottom: none; }}
    .checklist-row input[type="checkbox"] {{
      width: 18px; height: 18px;
      accent-color: var(--cyan);
      cursor: pointer;
    }}
    .checklist-row.checked span {{
      text-decoration: line-through;
      color: var(--muted);
    }}

    .hidden {{ display: none !important; }}
  </style>
</head>
<body>
  <div class="app">
    <header>
      <h1>MAGIC SURVIVAL</h1>
      <div class="subtitle">Fusion Codex · v0.9941</div>
    </header>

    <!-- Smart Install Banner (Android / Chrome) -->
    <div id="install-banner" class="install-banner hidden">
      <div class="install-banner-text">
        <span>⚡</span>
        <span>Install App for 100% Offline Play</span>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <button id="install-btn" class="install-btn">Install</button>
        <button id="install-banner-close" class="banner-close" title="Dismiss">✕</button>
      </div>
    </div>

    <!-- iOS Install Hint -->
    <div id="ios-hint" class="install-banner hidden" style="border-color:rgba(148,163,184,0.3);">
      <div class="install-banner-text">
        <span>📲</span>
        <span>Install on iPhone: Tap <strong>Share ⎋</strong> → <strong>Add to Home Screen [+]</strong></span>
      </div>
      <button id="ios-hint-close" class="banner-close" title="Dismiss">✕</button>
    </div>

    <!-- TAB 1: COMBINATOR -->
    <main id="view-combinator">
      <!-- Dual Slot Combinator Panel -->
      <div class="panel">
        <div class="slot-grid">
          <div>
            <span class="slot-label">Slot 1 · Magic</span>
            <select id="slot1-select"></select>
          </div>

          <!-- Sketchy Glowing 7-Pointed Heptagram Star Swap Button -->
          <button class="star-btn" id="swap-btn" title="Swap & Combine Slots">
            <svg width="26" height="26" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="#22d3ee" stroke-opacity="0.35" stroke-width="2"/>
              <circle cx="50" cy="50" r="21" stroke="#22d3ee" stroke-opacity="0.5" stroke-width="1.5"/>
              <polygon points="50.0,10.0 67.4,86.0 18.7,25.1 89.0,58.9 11.0,58.9 81.3,25.1 32.6,86.0" stroke="#22d3ee" stroke-width="2.6" stroke-linejoin="round" fill="none"/>
              <circle cx="50.0" cy="10.0" r="2.5" fill="#fff"/>
              <circle cx="81.3" cy="25.1" r="2.5" fill="#fff"/>
              <circle cx="89.0" cy="58.9" r="2.5" fill="#fff"/>
              <circle cx="67.4" cy="86.0" r="2.5" fill="#fff"/>
              <circle cx="32.6" cy="86.0" r="2.5" fill="#fff"/>
              <circle cx="11.0" cy="58.9" r="2.5" fill="#fff"/>
              <circle cx="18.7" cy="25.1" r="2.5" fill="#fff"/>
            </svg>
          </button>

          <div>
            <span class="slot-label">Slot 2 · Optional</span>
            <select id="slot2-select"></select>
          </div>
        </div>

        <!-- Dynamic Attribute Filter Chips -->
        <div id="slot1-attrs" class="attr-section hidden"></div>
        <div id="slot2-attrs" class="attr-section hidden"></div>
      </div>

      <!-- Search & Category Controls -->
      <div class="controls-row">
        <input id="search-input" type="text" placeholder="Search combo, magic, or attribute..." autocomplete="off" />
        <button class="pin-btn" id="reset-btn">Reset</button>
      </div>

      <div class="seg-tabs">
        <button class="seg-btn active all" data-cat="all">All (59)</button>
        <button class="seg-btn aoe" data-cat="aoe">AoE (35)</button>
        <button class="seg-btn nuke" data-cat="nuke">Nuke (24)</button>
      </div>

      <!-- Partner active filter notification banner -->
      <div id="partner-filter-banner" class="install-banner hidden" style="margin:0 0 10px;background:var(--surface-2);border-color:var(--cyan);">
        <span id="partner-banner-text" style="font-size:0.75rem;">Showing compatible partners</span>
        <button id="clear-partner-filter" class="banner-close" style="font-size:0.75rem;color:var(--cyan);font-weight:700;">Clear</button>
      </div>

      <div class="meta-bar">
        <span id="result-count">59 combinations</span>
        <label class="toggle-pill">
          <input type="checkbox" id="hide-conflicts" /> Hide build conflicts
        </label>
      </div>

      <!-- Results List -->
      <div id="card-list" class="card-list"></div>
    </main>

    <!-- TAB 2: BUILD PLANNER -->
    <main id="view-planner" class="hidden">
      <div class="panel">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h3 style="margin:0;font-family:Cinzel,serif;font-size:1.15rem;">3-Slot Build Planner</h3>
          <span style="font-size:0.72rem;color:var(--cyan);font-family:'JetBrains Mono',monospace;">Lv.25 / 50 / 75</span>
        </div>
        <div id="planner-slots"></div>
        <button class="action-btn" id="copy-reddit-btn">📋 Copy Reddit Markdown Table</button>
        <button class="action-btn secondary" id="share-url-btn">🔗 Copy Shareable Build Link</button>
      </div>

      <!-- Artifact Priority Summary -->
      <div class="panel">
        <h4 style="margin:0 0 6px;color:var(--cyan);font-size:0.88rem;">Artifact Priority (Main Magics)</h4>
        <p style="margin:0 0 8px;font-size:0.78rem;color:var(--muted);line-height:1.45;">
          Only artifacts that scale your <strong>Main Magic</strong> boost your fusions. Material magics are consumed and do not scale with artifacts.
        </p>
        <div id="artifact-priority-list"></div>
      </div>

      <!-- In-Run 6-Magic Leveling Checklist -->
      <div class="panel">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h4 style="margin:0;color:var(--green);font-size:0.88rem;">In-Run Magic Leveling Checklist</h4>
          <button id="reset-checklist-btn" class="banner-close" style="font-size:0.72rem;color:var(--muted);">Reset Run</button>
        </div>
        <div id="planner-checklist"></div>
      </div>
    </main>

    <!-- TAB 3: CODEX & OFFLINE STATUS -->
    <main id="view-codex" class="hidden">
      <div class="panel">
        <h3 style="margin:0 0 6px;font-family:Cinzel,serif;font-size:1.15rem;">Offline PWA Status</h3>
        <p id="cache-status-text" style="font-size:0.8rem;color:var(--muted);line-height:1.5;margin:0 0 10px;">
          Checking offline cache...
        </p>
        <button class="action-btn secondary" id="refresh-cache-btn">🔄 Refresh Offline Cache</button>
      </div>

      <div class="panel">
        <h3 style="margin:0 0 6px;font-family:Cinzel,serif;font-size:1.15rem;">Database Export</h3>
        <p style="font-size:0.8rem;color:var(--muted);line-height:1.5;margin:0 0 10px;">
          Single Source of Truth: <strong>59 combinations</strong> (35 AoE, 24 Nuke) and 22 base magics verified against Magic Survival <strong>v0.9941</strong>.
        </p>
        <button class="action-btn" id="download-json-btn">💾 Download combinations_v09941.json</button>
      </div>

      <div class="panel">
        <h4 style="margin:0 0 6px;color:#fff;font-size:0.88rem;">About &amp; Roadmap</h4>
        <p style="font-size:0.78rem;color:var(--muted);line-height:1.5;margin:0 0 8px;">
          <strong>Magic Survival — Fusion Codex</strong> is an unofficial, open-source fan tool built for the global player community on <a href="https://reddit.com/r/magic_survival" target="_blank" rel="noopener" style="color:var(--cyan);">r/magic_survival</a>.
        </p>
        <div style="background:var(--surface-2);border-radius:8px;padding:10px;font-size:0.76rem;color:var(--muted);line-height:1.5;">
          <strong style="color:var(--cyan);display:block;margin-bottom:4px;">Upcoming in v2.0 Architecture:</strong>
          • Artifact Tier List &amp; Synergies<br />
          • Special Magics: Magic Circle / DEM / PE / GOC<br />
          • Subject &amp; Class Mastery Synergies
        </div>
      </div>
    </main>

    <!-- Persistent Floating 3-Slot Mini-Dock -->
    <div class="dock" id="build-dock"></div>

    <!-- Bottom Navigation Bar -->
    <nav class="bottom-nav">
      <button class="nav-btn active" data-tab="combinator">
        <span class="nav-icon">✦</span>
        <span>Combinator</span>
      </button>
      <button class="nav-btn" data-tab="planner">
        <span class="nav-icon">◈</span>
        <span>Planner</span>
      </button>
      <button class="nav-btn" data-tab="codex">
        <span class="nav-icon">☰</span>
        <span>Codex</span>
      </button>
    </nav>
  </div>

  <!-- In-Game Inspector Modal -->
  <div class="modal-backdrop" id="modal-backdrop">
    <div class="modal" id="modal-content"></div>
  </div>

  <!-- Tap-to-Zoom Fullscreen Lightbox -->
  <div class="lightbox" id="lightbox">
    <img id="lightbox-img" src="" alt="Full view" />
  </div>

  <script>
    // Embedded Single Source of Truth database for guaranteed instant offline availability
    const EMBEDDED_DB = {db_json_str};

    const state = {{
      db: EMBEDDED_DB,
      slot1: '',
      slot1Attr: '',
      slot2: '',
      slot2Attr: '',
      search: '',
      category: 'all',
      hideConflicts: false,
      partnerFilterCombo: null,
      pinned: [], // max 3 combo IDs: [slotLv25, slotLv50, slotLv75]
      checked: {{}}
    }};

    // Load persisted checklist
    try {{
      const savedChecks = localStorage.getItem('ms_run_checklist');
      if (savedChecks) state.checked = JSON.parse(savedChecks);
    }} catch (e) {{}}

    function saveChecklist() {{
      try {{
        localStorage.setItem('ms_run_checklist', JSON.stringify(state.checked));
      }} catch (e) {{}}
    }}

    function comboById(id) {{
      return state.db.combinations.find(c => c.id === id);
    }}

    function magicById(id) {{
      return state.db.base_magics.find(m => m.id === id) || {{ id, name: id }};
    }}

    function getPinnedMagics() {{
      const magics = new Set();
      state.pinned.forEach(id => {{
        const c = comboById(id);
        if (c) {{
          magics.add(c.main.magic_id);
          magics.add(c.material.magic_id);
        }}
      }});
      return magics;
    }}

    function getConflictMagic(combo) {{
      if (state.pinned.includes(combo.id)) return null;
      const pinnedMagics = getPinnedMagics();
      if (pinnedMagics.has(combo.main.magic_id)) return magicById(combo.main.magic_id).name;
      if (pinnedMagics.has(combo.material.magic_id)) return magicById(combo.material.magic_id).name;
      return null;
    }}

    function populateSelects() {{
      const s1 = document.getElementById('slot1-select');
      const s2 = document.getElementById('slot2-select');
      const options = ['<option value="">-- Select Magic --</option>'];
      state.db.base_magics.forEach(m => {{
        options.push(`<option value="${{m.id}}">${{m.name}}</option>`);
      }});
      s1.innerHTML = options.join('');
      s2.innerHTML = options.join('');
    }}

    function renderAttrChips(slotNum) {{
      const mId = slotNum === 1 ? state.slot1 : state.slot2;
      const container = document.getElementById(`slot${{slotNum}}-attrs`);
      if (!mId) {{
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
      }}
      const m = magicById(mId);
      if (!m || !m.attribute_tiers) {{
        container.classList.add('hidden');
        return;
      }}

      let html = '';
      m.attribute_tiers.forEach(tier => {{
        const tierName = tier.level === 3 ? 'Max Level (Lv.3)' : `Lv.${{tier.level}} Attribute (Trait)`;
        html += `
          <div class="attr-header">
            <span class="attr-tier-label">${{m.name}} · ${{tierName}}</span>
          </div>
          <div class="chips">
            <div class="chip ${{(slotNum === 1 ? state.slot1Attr : state.slot2Attr) === '' ? 'active' : ''}}" data-slot="${{slotNum}}" data-attr="">Any</div>
            ${{tier.attributes.map(attr => `
              <div class="chip ${{(slotNum === 1 ? state.slot1Attr : state.slot2Attr) === attr ? 'active' : ''}}" data-slot="${{slotNum}}" data-attr="${{attr}}">${{attr}}</div>
            `).join('')}}
          </div>
        `;
      }});

      container.innerHTML = html;
      container.classList.remove('hidden');

      container.querySelectorAll('.chip').forEach(chip => {{
        chip.onclick = () => {{
          const slot = parseInt(chip.dataset.slot, 10);
          const val = chip.dataset.attr;
          if (slot === 1) state.slot1Attr = val;
          else state.slot2Attr = val;
          renderAttrChips(slot);
          renderList();
        }};
      }});
    }}

    function getFilteredCombinations() {{
      let list = state.db.combinations;

      // Category filter
      if (state.category !== 'all') {{
        list = list.filter(c => c.category === state.category);
      }}

      // Search filter
      if (state.search.trim()) {{
        const q = state.search.toLowerCase().trim();
        list = list.filter(c => {{
          const mainM = magicById(c.main.magic_id).name.toLowerCase();
          const matM = magicById(c.material.magic_id).name.toLowerCase();
          return c.name.toLowerCase().includes(q) ||
                 c.main.attribute.toLowerCase().includes(q) ||
                 c.material.attribute.toLowerCase().includes(q) ||
                 mainM.includes(q) ||
                 matM.includes(q);
        }});
      }}

      // "Find Compatible Partners" filter
      if (state.partnerFilterCombo) {{
        const ref = state.partnerFilterCombo;
        list = list.filter(c => {{
          return c.id !== ref.id &&
                 c.main.magic_id !== ref.main.magic_id &&
                 c.main.magic_id !== ref.material.magic_id &&
                 c.material.magic_id !== ref.main.magic_id &&
                 c.material.magic_id !== ref.material.magic_id;
        }});
      }}

      // Dual Slot Filtering
      const s1 = state.slot1;
      const s2 = state.slot2;

      if (s1 && s2) {{
        // Direct fusion between Slot 1 and Slot 2 (order-independent)
        list = list.filter(c => {{
          const match1 = (c.main.magic_id === s1 && c.material.magic_id === s2);
          const match2 = (c.main.magic_id === s2 && c.material.magic_id === s1);
          if (!match1 && !match2) return false;

          // Attribute checks if specified
          if (state.slot1Attr) {{
            const expectedAttr = state.slot1Attr;
            const matchesSlot1Attr = (c.main.magic_id === s1 && c.main.attribute === expectedAttr) ||
                                     (c.material.magic_id === s1 && c.material.attribute === expectedAttr);
            if (!matchesSlot1Attr) return false;
          }}
          if (state.slot2Attr) {{
            const expectedAttr = state.slot2Attr;
            const matchesSlot2Attr = (c.main.magic_id === s2 && c.main.attribute === expectedAttr) ||
                                     (c.material.magic_id === s2 && c.material.attribute === expectedAttr);
            if (!matchesSlot2Attr) return false;
          }}
          return true;
        }});
      }} else if (s1) {{
        // Slot 1 only
        list = list.filter(c => {{
          const uses = (c.main.magic_id === s1 || c.material.magic_id === s1);
          if (!uses) return false;
          if (state.slot1Attr) {{
            return (c.main.magic_id === s1 && c.main.attribute === state.slot1Attr) ||
                   (c.material.magic_id === s1 && c.material.attribute === state.slot1Attr);
          }}
          return true;
        }});
      }} else if (s2) {{
        // Slot 2 only
        list = list.filter(c => {{
          const uses = (c.main.magic_id === s2 || c.material.magic_id === s2);
          if (!uses) return false;
          if (state.slot2Attr) {{
            return (c.main.magic_id === s2 && c.main.attribute === state.slot2Attr) ||
                   (c.material.magic_id === s2 && c.material.attribute === state.slot2Attr);
          }}
          return true;
        }});
      }}

      // Hide build conflicts toggle
      if (state.hideConflicts) {{
        list = list.filter(c => !getConflictMagic(c));
      }}

      // Sort by Tier (S -> A -> B -> C) then rank
      const tierScore = {{ 'S': 4, 'A': 3, 'B': 2, 'C': 1 }};
      return [...list].sort((a, b) => {{
        const scoreDiff = (tierScore[b.tier] || 0) - (tierScore[a.tier] || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return a.rank - b.rank;
      }});
    }}

    function renderList() {{
      const listEl = document.getElementById('card-list');
      const countEl = document.getElementById('result-count');
      const partnerBanner = document.getElementById('partner-filter-banner');

      if (state.partnerFilterCombo) {{
        partnerBanner.classList.remove('hidden');
        document.getElementById('partner-banner-text').textContent =
          `Showing fusions compatible with ${{state.partnerFilterCombo.name}} (0 shared magics)`;
      }} else {{
        partnerBanner.classList.add('hidden');
      }}

      const results = getFilteredCombinations();
      countEl.textContent = `${{results.length}} ${{results.length === 1 ? 'combination' : 'combinations'}}`;

      // Check if both slots are selected but have 0 direct combinations
      if (state.slot1 && state.slot2 && results.length === 0) {{
        const m1 = magicById(state.slot1).name;
        const m2 = magicById(state.slot2).name;
        listEl.innerHTML = `
          <div class="empty-state">
            <h3>No Direct Fusion</h3>
            <p><strong>${{m1}}</strong> and <strong>${{m2}}</strong> do not combine into a fusion in v0.9941.</p>
            <div class="empty-actions">
              <button class="action-btn" id="inspect-slot1-btn">View fusions for ${{m1}}</button>
              <button class="action-btn secondary" id="inspect-slot2-btn">View fusions for ${{m2}}</button>
            </div>
          </div>
        `;
        document.getElementById('inspect-slot1-btn').onclick = () => {{
          state.slot2 = '';
          state.slot2Attr = '';
          document.getElementById('slot2-select').value = '';
          renderAttrChips(2);
          renderList();
        }};
        document.getElementById('inspect-slot2-btn').onclick = () => {{
          state.slot1 = '';
          state.slot1Attr = '';
          document.getElementById('slot1-select').value = '';
          renderAttrChips(1);
          renderList();
        }};
        return;
      }}

      if (results.length === 0) {{
        listEl.innerHTML = `
          <div class="empty-state">
            <h3>No Combinations Found</h3>
            <p>Try adjusting your search query, attribute selection, or category filters.</p>
          </div>
        `;
        return;
      }}

      listEl.innerHTML = results.map(c => {{
        const pinned = state.pinned.includes(c.id);
        const conflictMagic = getConflictMagic(c);
        const isConflict = Boolean(conflictMagic);
        const mainM = magicById(c.main.magic_id).name;
        const matM = magicById(c.material.magic_id).name;

        return `
          <div class="combo-card ${{pinned ? 'pinned' : ''}} ${{isConflict ? 'conflict' : ''}}" data-id="${{c.id}}">
            <img class="thumb" src="./assets/thumbs/${{c.id}}.webp" loading="lazy" alt="${{c.name}}" onerror="this.src='./assets/icon-192.png'" />
            <div style="min-width:0;">
              <div class="card-title-row">
                <span class="card-title">${{c.name}}</span>
                <span class="badge ${{c.category}}">${{c.category.toUpperCase()}} #${{c.rank}} · ${{c.tier}}</span>
                ${{isConflict ? `<span class="badge conflict">CONFLICT: ${{conflictMagic}} IN USE</span>` : ''}}
              </div>
              <div class="recipe">
                <div class="main-line">MAIN: ${{mainM}} — <strong>${{c.main.attribute}}</strong> (Lv.${{c.main.level}})</div>
                <div class="mat-line">MATERIAL: ${{matM}} — <strong>${{c.material.attribute}}</strong> (Lv.${{c.material.level}})</div>
              </div>
            </div>
            <button class="pin-btn ${{pinned ? 'active' : ''}}" data-pin="${{c.id}}">${{pinned ? 'Pinned' : '+ Pin'}}</button>
          </div>
        `;
      }}).join('');

      listEl.querySelectorAll('.combo-card').forEach(el => {{
        el.onclick = (e) => {{
          if (e.target.closest('[data-pin]')) return;
          openModal(el.dataset.id);
        }};
      }});

      listEl.querySelectorAll('[data-pin]').forEach(btn => {{
        btn.onclick = (e) => {{
          e.stopPropagation();
          togglePin(btn.dataset.pin);
        }};
      }});
    }}

    function togglePin(id) {{
      const idx = state.pinned.indexOf(id);
      if (idx >= 0) {{
        state.pinned.splice(idx, 1);
      }} else {{
        if (state.pinned.length >= 3) {{
          alert('Build Planner allows a maximum of 3 combinations (Lv.25, Lv.50, Lv.75). Remove one before pinning another.');
          return;
        }}
        state.pinned.push(id);
      }}
      syncHash();
      renderList();
      renderDock();
      renderPlanner();
    }}

    function openModal(id) {{
      const c = comboById(id);
      if (!c) return;
      const mainM = magicById(c.main.magic_id).name;
      const matM = magicById(c.material.magic_id).name;
      const modal = document.getElementById('modal-content');

      modal.innerHTML = `
        <div class="modal-head">
          <div>
            <div class="card-title-row">
              <h2 style="margin:0;font-family:Cinzel,serif;font-size:1.25rem;color:#fff;">${{c.name}}</h2>
              <span class="badge ${{c.category}}">${{c.category.toUpperCase()}} #${{c.rank}} · TIER ${{c.tier}}</span>
            </div>
            <div class="recipe" style="margin-top:8px;">
              <div class="main-line">MAIN (Artifact Scaled): ${{mainM}} — <strong>${{c.main.attribute}}</strong> (Lv.${{c.main.level}})</div>
              <div class="mat-line">MATERIAL (Consumed): ${{matM}} — <strong>${{c.material.attribute}}</strong> (Lv.${{c.material.level}})</div>
            </div>
          </div>
          <button class="close-btn" id="modal-close" title="Close">✕</button>
        </div>

        <div class="artifact-scaling-box">
          ✨ <strong>Artifact Scaling Rule:</strong> Scales with <strong>${{mainM}}</strong> artifacts only. Artifacts for ${{matM}} do not benefit this fusion.
        </div>

        <ul class="stat-list">
          ${{c.mechanics.map(t => `<li>${{t}}</li>`).join('')}}
          ${{c.buffs.map(t => `<li class="stat-buff">▲ ${{t}}</li>`).join('')}}
          ${{c.penalties.map(t => `<li class="stat-pen">▼ ${{t}}</li>`).join('')}}
        </ul>

        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="action-btn" id="modal-pin-btn">${{state.pinned.includes(c.id) ? 'Remove from Planner' : '+ Pin to Planner'}}</button>
          <button class="action-btn secondary" id="find-partners-btn">Find Compatible Partners</button>
        </div>

        <button class="action-btn secondary" id="toggle-ss-btn" style="margin-top:10px;">Toggle Original Screenshot View</button>
        <img id="modal-ss" class="card-img-full hidden" src="./assets/cards/${{c.id}}.webp" alt="${{c.name}} full card" title="Tap to zoom full-screen" />
      `;

      document.getElementById('modal-backdrop').classList.add('open');

      document.getElementById('modal-close').onclick = () => {{
        document.getElementById('modal-backdrop').classList.remove('open');
      }};

      document.getElementById('toggle-ss-btn').onclick = () => {{
        document.getElementById('modal-ss').classList.toggle('hidden');
      }};

      document.getElementById('modal-ss').onclick = () => {{
        const lb = document.getElementById('lightbox');
        document.getElementById('lightbox-img').src = `./assets/cards/${{c.id}}.webp`;
        lb.classList.add('open');
      }};

      document.getElementById('modal-pin-btn').onclick = () => {{
        togglePin(c.id);
        openModal(c.id);
      }};

      document.getElementById('find-partners-btn').onclick = () => {{
        document.getElementById('modal-backdrop').classList.remove('open');
        state.partnerFilterCombo = c;
        switchTab('combinator');
        renderList();
      }};
    }}

    function renderDock() {{
      const levels = [25, 50, 75];
      const dockEl = document.getElementById('build-dock');
      const pinnedMagics = [];

      dockEl.innerHTML = levels.map((lv, i) => {{
        const id = state.pinned[i];
        const c = id ? comboById(id) : null;
        let conflictClass = '';
        if (c) {{
          if (pinnedMagics.includes(c.main.magic_id) || pinnedMagics.includes(c.material.magic_id)) {{
            conflictClass = 'has-conflict';
          }}
          pinnedMagics.push(c.main.magic_id, c.material.magic_id);
        }}
        return `
          <div class="dock-slot ${{c ? 'filled' : ''}} ${{conflictClass}}" data-idx="${{i}}" title="${{c ? c.name : 'Empty Slot'}}">
            <span>Lv.${{lv}}</span>
            ${{c ? c.name : 'Empty'}}
          </div>
        `;
      }}).join('');

      dockEl.querySelectorAll('.dock-slot').forEach(el => {{
        el.onclick = () => switchTab('planner');
      }});
    }}

    function renderPlanner() {{
      const levels = [25, 50, 75];
      const plannerSlotsEl = document.getElementById('planner-slots');
      const priorityEl = document.getElementById('artifact-priority-list');
      const checklistEl = document.getElementById('planner-checklist');

      // 1. Render 3 Slots
      plannerSlotsEl.innerHTML = levels.map((lv, i) => {{
        const id = state.pinned[i];
        const c = id ? comboById(id) : null;
        if (!c) {{
          return `
            <div style="padding:12px;border:1px dashed var(--border);border-radius:10px;margin-bottom:8px;font-size:0.8rem;color:var(--muted);text-align:center;">
              <span style="color:var(--cyan);font-family:'JetBrains Mono',monospace;">Lv.${{lv}} Slot</span> — Tap "+ Pin" on any combination in Combinator
            </div>
          `;
        }}
        const mainM = magicById(c.main.magic_id).name;
        const matM = magicById(c.material.magic_id).name;

        return `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;margin-bottom:8px;">
            <div style="min-width:0;">
              <div style="display:flex;align-items:center;gap:6px;">
                <span class="badge" style="background:var(--cyan-soft);color:var(--cyan);">LV.${{lv}}</span>
                <strong style="color:#fff;font-size:0.92rem;">${{c.name}}</strong>
                <span class="badge ${{c.category}}">${{c.tier}}</span>
              </div>
              <div style="font-size:0.75rem;color:var(--green);margin-top:4px;">Main: ${{mainM}} — ${{c.main.attribute}} (Lv.${{c.main.level}})</div>
              <div style="font-size:0.75rem;color:var(--red);">Material: ${{matM}} — ${{c.material.attribute}} (Lv.${{c.material.level}})</div>
            </div>
            <button class="pin-btn" onclick="togglePin('${{c.id}}')">Remove</button>
          </div>
        `;
      }}).join('');

      // 2. Render Artifact Priority
      if (!state.pinned.length) {{
        priorityEl.innerHTML = '<div style="font-size:0.8rem;color:var(--muted);">Pin combinations to calculate your build\\'s artifact priorities.</div>';
      }} else {{
        const mainMagics = state.pinned.map(id => {{
          const c = comboById(id);
          return c ? magicById(c.main.magic_id).name : null;
        }}).filter(Boolean);

        priorityEl.innerHTML = `
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px;">
            ${{mainMagics.map(m => `<span class="badge" style="background:var(--green-soft);color:var(--green);font-size:0.75rem;padding:4px 8px;">★ ${{m}} Artifacts</span>`).join('')}}
          </div>
          <div style="font-size:0.75rem;color:var(--muted);">
            Pick chests and items that amplify ${{mainMagics.join(', ')}}. Consumed material spells receive no benefit from artifacts!
          </div>
        `;
      }}

      // 3. Render In-Run 6-Magic Checklist
      const reqs = [];
      state.pinned.forEach(id => {{
        const c = comboById(id);
        if (!c) return;
        const mainM = magicById(c.main.magic_id).name;
        const matM = magicById(c.material.magic_id).name;
        reqs.push({{
          key: `${{c.id}}_main`,
          magic: mainM,
          attr: c.main.attribute,
          level: c.main.level,
          role: 'Main (Green)'
        }});
        reqs.push({{
          key: `${{c.id}}_mat`,
          magic: matM,
          attr: c.material.attribute,
          level: c.material.level,
          role: 'Material (Red)'
        }});
      }});

      if (!reqs.length) {{
        checklistEl.innerHTML = '<div style="font-size:0.8rem;color:var(--muted);">Pin combinations to generate your 6-magic leveling checklist.</div>';
      }} else {{
        checklistEl.innerHTML = reqs.map(r => {{
          const isChecked = Boolean(state.checked[r.key]);
          return `
            <div class="checklist-row ${{isChecked ? 'checked' : ''}}" data-key="${{r.key}}">
              <input type="checkbox" ${{isChecked ? 'checked' : ''}} />
              <span><strong>${{r.magic}}</strong> → ${{r.attr}} (Lv.${{r.level}}) <em style="font-size:0.72rem;color:var(--muted);">[${{r.role}}]</em></span>
            </div>
          `;
        }}).join('');

        checklistEl.querySelectorAll('.checklist-row').forEach(row => {{
          row.onclick = (e) => {{
            const key = row.dataset.key;
            const cb = row.querySelector('input');
            if (e.target !== cb) cb.checked = !cb.checked;
            state.checked[key] = cb.checked;
            row.classList.toggle('checked', cb.checked);
            saveChecklist();
          }};
        }});
      }}
    }}

    function switchTab(tab) {{
      ['combinator', 'planner', 'codex'].forEach(t => {{
        document.getElementById(`view-${{t}}`).classList.toggle('hidden', t !== tab);
      }});
      document.querySelectorAll('.nav-btn').forEach(b => {{
        b.classList.toggle('active', b.dataset.tab === tab);
      }});
      window.scrollTo({{ top: 0, behavior: 'smooth' }});
    }}

    function syncHash() {{
      if (state.pinned.length) {{
        location.hash = 'build=' + state.pinned.join(',');
      }} else {{
        history.replaceState(null, '', location.pathname + location.search);
      }}
    }}

    function loadHash() {{
      const m = location.hash.match(/build=([a-z0-9_,]+)/i);
      if (m) {{
        const ids = m[1].split(',').filter(id => comboById(id)).slice(0, 3);
        if (ids.length) state.pinned = ids;
      }}
    }}

    // Check Service Worker and Cache Storage Status
    function checkCacheStatus() {{
      const statusEl = document.getElementById('cache-status-text');
      if (!('caches' in window)) {{
        statusEl.innerHTML = '● Cache API not supported on this browser.';
        return;
      }}
      caches.open('fusion-codex-v09941-1').then(cache => {{
        cache.keys().then(keys => {{
          if (keys.length > 0) {{
            statusEl.innerHTML = `● <strong style="color:var(--green);">Offline Ready</strong> — ${{keys.length}} assets cached in local storage.`;
          }} else {{
            statusEl.innerHTML = '● Caching assets for offline gameplay...';
          }}
        }}).catch(() => {{
          statusEl.innerHTML = '● Caching assets in background...';
        }});
      }}).catch(() => {{
        statusEl.innerHTML = '● Caching offline assets...';
      }});
    }}

    // Setup Smart Install Prompts (Android WebAPK + iOS Safari)
    let deferredPrompt = null;
    function setupInstallPrompts() {{
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      if (isStandalone) return;

      // Android / Chromium
      window.addEventListener('beforeinstallprompt', (e) => {{
        e.preventDefault();
        deferredPrompt = e;
        const banner = document.getElementById('install-banner');
        if (banner) banner.classList.remove('hidden');
      }});

      const installBtn = document.getElementById('install-btn');
      if (installBtn) {{
        installBtn.onclick = () => {{
          if (deferredPrompt) {{
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {{
              deferredPrompt = null;
              document.getElementById('install-banner').classList.add('hidden');
            }});
          }}
        }};
      }}

      document.getElementById('install-banner-close').onclick = () => {{
        document.getElementById('install-banner').classList.add('hidden');
      }};

      window.addEventListener('appinstalled', () => {{
        deferredPrompt = null;
        document.getElementById('install-banner').classList.add('hidden');
      }});

      // iOS Safari detection
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
      const iosDismissed = localStorage.getItem('ms_ios_hint_dismissed');
      if (isIOS && !isStandalone && !iosDismissed) {{
        const iosBanner = document.getElementById('ios-hint');
        if (iosBanner) iosBanner.classList.remove('hidden');
      }}
      document.getElementById('ios-hint-close').onclick = () => {{
        document.getElementById('ios-hint').classList.add('hidden');
        localStorage.setItem('ms_ios_hint_dismissed', 'true');
      }};
    }}

    // Initialize Event Listeners
    populateSelects();
    loadHash();
    setupInstallPrompts();
    checkCacheStatus();

    document.getElementById('slot1-select').onchange = (e) => {{
      state.slot1 = e.target.value;
      state.slot1Attr = '';
      renderAttrChips(1);
      renderList();
    }};

    document.getElementById('slot2-select').onchange = (e) => {{
      state.slot2 = e.target.value;
      state.slot2Attr = '';
      renderAttrChips(2);
      renderList();
    }};

    document.getElementById('swap-btn').onclick = () => {{
      const tempSlot = state.slot1;
      const tempAttr = state.slot1Attr;
      state.slot1 = state.slot2;
      state.slot1Attr = state.slot2Attr;
      state.slot2 = tempSlot;
      state.slot2Attr = tempAttr;

      document.getElementById('slot1-select').value = state.slot1;
      document.getElementById('slot2-select').value = state.slot2;
      renderAttrChips(1);
      renderAttrChips(2);
      renderList();
    }};

    document.getElementById('reset-btn').onclick = () => {{
      state.slot1 = '';
      state.slot1Attr = '';
      state.slot2 = '';
      state.slot2Attr = '';
      state.search = '';
      state.partnerFilterCombo = null;
      document.getElementById('slot1-select').value = '';
      document.getElementById('slot2-select').value = '';
      document.getElementById('search-input').value = '';
      renderAttrChips(1);
      renderAttrChips(2);
      renderList();
    }};

    document.getElementById('clear-partner-filter').onclick = () => {{
      state.partnerFilterCombo = null;
      renderList();
    }};

    document.getElementById('search-input').oninput = (e) => {{
      state.search = e.target.value;
      renderList();
    }};

    document.getElementById('hide-conflicts').onchange = (e) => {{
      state.hideConflicts = e.target.checked;
      renderList();
    }};

    document.querySelectorAll('.seg-btn').forEach(btn => {{
      btn.onclick = () => {{
        state.category = btn.dataset.cat;
        document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderList();
      }};
    }});

    document.querySelectorAll('.nav-btn').forEach(btn => {{
      btn.onclick = () => switchTab(btn.dataset.tab);
    }});

    document.getElementById('modal-backdrop').onclick = (e) => {{
      if (e.target.id === 'modal-backdrop') {{
        document.getElementById('modal-backdrop').classList.remove('open');
      }}
    }};

    document.getElementById('lightbox').onclick = () => {{
      document.getElementById('lightbox').classList.remove('open');
    }};

    document.getElementById('reset-checklist-btn').onclick = () => {{
      state.checked = {{}};
      saveChecklist();
      renderPlanner();
    }};

    document.getElementById('copy-reddit-btn').onclick = () => {{
      if (!state.pinned.length) {{
        alert('Please pin at least one combination before exporting.');
        return;
      }}
      const levels = [25, 50, 75];
      const rows = state.pinned.map((id, i) => {{
        const c = comboById(id);
        const mainM = magicById(c.main.magic_id).name;
        const matM = magicById(c.material.magic_id).name;
        return `| Lv.${{levels[i]}} | **${{c.name}}** | ${{c.tier}} | ${{mainM}} — ${{c.main.attribute}} (Lv.${{c.main.level}}) | ${{matM}} — ${{c.material.attribute}} (Lv.${{c.material.level}}) |`;
      }}).join('\\n');

      const md = `### Magic Survival v0.9941 Build\\n\\n| Slot | Combination | Tier | Main Magic (Artifact Scaled) | Material Magic (Consumed) |\\n| :--- | :--- | :--- | :--- | :--- |\\n${{rows}}\\n\\n*Shared via Magic Survival — Fusion Codex (v0.9941)*`;

      navigator.clipboard.writeText(md).then(() => {{
        alert('Copied Reddit Markdown Table to clipboard!');
      }}).catch(() => {{
        prompt('Copy Markdown below:', md);
      }});
    }};

    document.getElementById('share-url-btn').onclick = () => {{
      syncHash();
      navigator.clipboard.writeText(location.href).then(() => {{
        alert('Copied shareable build URL to clipboard!');
      }}).catch(() => {{
        prompt('Copy URL below:', location.href);
      }});
    }};

    document.getElementById('download-json-btn').onclick = () => {{
      const blob = new Blob([JSON.stringify(state.db, null, 2)], {{ type: 'application/json' }});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'combinations_v09941.json';
      a.click();
    }};

    document.getElementById('refresh-cache-btn').onclick = () => {{
      if (!('serviceWorker' in navigator)) return alert('Service Workers not supported.');
      caches.delete('fusion-codex-v09941-1').then(() => {{
        navigator.serviceWorker.getRegistration().then(reg => {{
          if (reg) reg.update();
          location.reload();
        }});
      }});
    }};

    // Register Service Worker with relative path
    if ('serviceWorker' in navigator) {{
      window.addEventListener('load', () => {{
        navigator.serviceWorker.register('./sw.js', {{ scope: './' }})
          .then((reg) => {{
            console.log('Fusion Codex Service Worker registered with scope:', reg.scope);
            checkCacheStatus();
          }})
          .catch((err) => {{
            console.warn('Service Worker registration skipped:', err);
          }});
      }});
    }}

    // Initial renders
    renderList();
    renderDock();
    renderPlanner();
  </script>
</body>
</html>
'''

with open(INDEX_PATH, "w", encoding="utf-8") as f:
    f.write(index_html)

print("index.html generated successfully!")
