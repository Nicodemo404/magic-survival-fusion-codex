/**
 * Magic Survival — Fusion Codex (v0.9941)
 * Production Application Logic
 * Zero-AI / Authentic Grimoire Engine
 */

(() => {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEYS = {
    PINNED: 'ms_codex_v1_pinned',
    CHECKLIST: 'ms_codex_v1_checklist',
    IOS_DISMISSED: 'ms_codex_v1_ios_dismissed',
    INSTALL_DISMISSED: 'ms_codex_v1_install_dismissed'
  };

  const CACHE_PREFIX = 'ms-codex-';
  const CURRENT_CACHE_NAME = 'ms-codex-v09941-v4';

  // --- Minimalist White Chalk-Ink SVG Icons (ZERO Emojis) ---
  const ICONS = {
    heptagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    all: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>',
    lightning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    fire: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-1.5 3-4 5-4 9 0 3.3 2.7 6 6 6s6-2.7 6-6c0-2-1-4-2-5-.5 2-2 3-3 3-1 0-2-.5-2-1.5 0-1.5 1-3.5 2-4.5-1.5.5-2.5 1.5-3 3z"/></svg>',
    ice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/></svg>',
    arcane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z"/></svg>',
    storm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>',
    cosmic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M3.5 15.5C5 18 8 20 12 20s8.5-3 8.5-8c0-3.5-2-6.5-5.5-8"/></svg>',
    void: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 12l10 10 10-10L12 2z"/><circle cx="12" cy="12" r="3"/></svg>',
    combinator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="12" r="5"/><circle cx="17" cy="12" r="5"/></svg>',
    planner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    codex: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 2v6h6M21.5 22v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L2.5 8m18.99 8a9 9 0 0 1-14.85 3.36L21.5 16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    chevronUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    device: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>'
  };

  // --- Strict HTML Escaping ---
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Global Application State ---
  const state = {
    db: null,
    taxonomy: null,
    classesData: null,
    comboMap: new Map(),
    magicMap: new Map(),
    elementMap: new Map(),

    activeTab: 'combinator',

    pinned: [], // array of up to 3 combo IDs
    checklist: {}, // { "magicId:attribute": true }

    filters: {
      slot1: '',
      slot1Attr: '',
      slot2: '',
      slot2Attr: '',
      element: 'all',
      functional: new Set(),
      category: 'all',
      search: '',
      hideConflicts: false,
      partnerFor: ''
    },

    activeModalCombo: null,
    deferredInstallPrompt: null
  };

  // --- Toast Notification System ---
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = ICONS.heptagram;
    if (type === 'success') iconSvg = ICONS.check;
    else if (type === 'warning') iconSvg = ICONS.warning;
    else if (type === 'error') iconSvg = ICONS.warning;

    toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }, 2800);
  }

  // --- Pinned Builds & Persistence ---
  function loadPersistedState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PINNED);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          state.pinned = parsed.filter(id => state.comboMap.has(id)).slice(0, 3);
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored pinned builds', e);
    }

    try {
      const storedCheck = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      if (storedCheck) {
        state.checklist = JSON.parse(storedCheck) || {};
      }
    } catch (e) {
      console.warn('Failed to parse checklist', e);
    }

    // URL Hash override: #build=id1,id2,id3 takes precedence on page load
    const hash = window.location.hash;
    if (hash && hash.startsWith('#build=')) {
      const ids = hash.replace('#build=', '').split(',').map(s => s.trim());
      const validIds = ids.filter(id => state.comboMap.has(id)).slice(0, 3);
      if (validIds.length > 0) {
        state.pinned = validIds;
        savePinnedState();
      }
    }
  }

  function savePinnedState() {
    try {
      localStorage.setItem(STORAGE_KEYS.PINNED, JSON.stringify(state.pinned));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
    syncHash();
    updateDock();
  }

  function saveChecklistState() {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(state.checklist));
    } catch (e) {
      console.warn('LocalStorage checklist save failed', e);
    }
  }

  function syncHash() {
    if (state.pinned.length > 0) {
      const hashVal = '#build=' + state.pinned.join(',');
      if (window.location.hash !== hashVal) {
        history.replaceState(null, '', hashVal);
      }
    } else {
      if (window.location.hash && window.location.hash.startsWith('#build=')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }

  function togglePin(comboId) {
    const idx = state.pinned.indexOf(comboId);
    if (idx !== -1) {
      state.pinned.splice(idx, 1);
      showToast('Removed combination from build planner.', 'info');
    } else {
      if (state.pinned.length >= 3) {
        showToast('All 3 fusion slots are full (Lv.25, Lv.50, Lv.75). Remove one first.', 'warning');
        return;
      }
      state.pinned.push(comboId);
      const combo = state.comboMap.get(comboId);
      showToast(`Pinned ${combo ? combo.name : comboId} to Slot ${state.pinned.length}.`, 'success');
    }
    savePinnedState();
    renderCombinations();
    renderPlanner();
  }

  // --- Conflict Detection Engine ---
  function getPinnedBaseMagics() {
    const set = new Set();
    for (const cid of state.pinned) {
      const c = state.comboMap.get(cid);
      if (c) {
        set.add(c.main.magic_id);
        set.add(c.material.magic_id);
      }
    }
    return set;
  }

  function getConflictsInPinned() {
    const magicCounts = {};
    const conflicts = [];
    for (const cid of state.pinned) {
      const c = state.comboMap.get(cid);
      if (!c) continue;
      const magics = [c.main.magic_id, c.material.magic_id];
      for (const m of magics) {
        if (!magicCounts[m]) magicCounts[m] = [];
        magicCounts[m].push(c.name);
      }
    }
    for (const m in magicCounts) {
      if (magicCounts[m].length > 1) {
        const magicName = state.magicMap.get(m) ? state.magicMap.get(m).name : m;
        conflicts.push({
          magicId: m,
          magicName: magicName,
          combos: magicCounts[m]
        });
      }
    }
    return conflicts;
  }

  function doesComboConflictWithPinned(combo) {
    if (state.pinned.includes(combo.id)) return false;
    const pinnedMagics = getPinnedBaseMagics();
    return pinnedMagics.has(combo.main.magic_id) || pinnedMagics.has(combo.material.magic_id);
  }

  // --- Recommended Class & Subject Algorithm ---
  function getRecommendations() {
    if (!state.classesData || state.pinned.length === 0) {
      return null;
    }

    const pinnedCombos = state.pinned.map(id => state.comboMap.get(id)).filter(Boolean);
    const mainMagicCounts = {};
    for (const c of pinnedCombos) {
      const mid = c.main.magic_id;
      mainMagicCounts[mid] = (mainMagicCounts[mid] || 0) + 1;
    }

    const classes = state.classesData.classes || [];
    const subjects = state.classesData.subjects || [];

    let topClass = null;
    let topClassReason = '';

    // Check if single focus (e.g. 1 fusion pinned OR >=2 pinned fusions share the same Main Magic)
    let focusedMainMagic = null;
    for (const mid in mainMagicCounts) {
      if (mainMagicCounts[mid] >= 2) {
        focusedMainMagic = mid;
        break;
      }
    }
    if (!focusedMainMagic && pinnedCombos.length === 1) {
      focusedMainMagic = pinnedCombos[0].main.magic_id;
    }

    if (focusedMainMagic) {
      // Find specialist class
      const spec = classes.find(c => c.primary_magic_id === focusedMainMagic);
      if (spec) {
        topClass = spec;
        const magicName = state.magicMap.get(focusedMainMagic)?.name || focusedMainMagic;
        topClassReason = `Specialist pick: Directly amplifies ${magicName}, the core Main Magic of your build.`;
      }
    }

    if (!topClass) {
      // Multi-Main build: Recommend Archmage as top universal pick
      const archmage = classes.find(c => c.id === 'archmage');
      if (archmage) {
        topClass = archmage;
        topClassReason = 'Universal pick: Combination Magic Damage +50% and starts with +3 levels, accelerating multi-Main fusion spikes.';
      } else {
        topClass = classes[0];
        topClassReason = topClass.recommended_when;
      }
    }

    // Recommend Subject: Find matching subject or default to Archmage subject
    let topSubject = null;
    if (focusedMainMagic) {
      topSubject = subjects.find(s => s.synergy_magics && s.synergy_magics.includes(focusedMainMagic));
    }
    if (!topSubject) {
      topSubject = subjects.find(s => s.id === 'subject_archmage') || subjects[0];
    }

    return {
      topClass,
      topClassReason,
      topSubject
    };
  }

  // --- Rendering UI: Header Dock ---
  function updateDock() {
    const slotsContainer = document.getElementById('dock-slots');
    const badge = document.getElementById('dock-count-badge');
    const navBadge = document.getElementById('nav-planner-badge');
    if (!slotsContainer) return;

    if (badge) badge.textContent = `${state.pinned.length}/3`;
    if (navBadge) {
      navBadge.textContent = state.pinned.length;
      navBadge.style.display = state.pinned.length > 0 ? 'inline-block' : 'none';
    }

    const levels = [25, 50, 75];
    const conflicts = getConflictsInPinned();
    const hasConflict = conflicts.length > 0;

    slotsContainer.innerHTML = [0, 1, 2].map(i => {
      const cid = state.pinned[i];
      if (cid) {
        const c = state.comboMap.get(cid);
        const name = c ? c.name : cid;
        return `<div class="dock-slot filled ${hasConflict ? 'has-conflict' : ''}" data-slot="${i}" title="${escapeHtml(name)}">Lv.${levels[i]}: ${escapeHtml(name)}</div>`;
      } else {
        return `<div class="dock-slot empty" data-slot="${i}">Slot ${i + 1} (Lv.${levels[i]})</div>`;
      }
    }).join('');

    // Clicking a dock slot switches to the Build Planner tab
    slotsContainer.querySelectorAll('.dock-slot').forEach(el => {
      el.addEventListener('click', () => switchTab('planner'));
    });
  }

  // --- Rendering UI: Tab Switching ---
  function switchTab(tabId) {
    state.activeTab = tabId;
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

    const targetPane = document.getElementById(`tab-${tabId}`);
    const targetNav = document.getElementById(`nav-${tabId}`);
    if (targetPane) targetPane.classList.add('active');
    if (targetNav) targetNav.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabId === 'planner') {
      renderPlanner();
    } else if (tabId === 'codex') {
      checkCacheStatus();
    }
  }

  // --- Rendering UI: Combinator Controls & Attribute Chips ---
  function populateMagicDropdowns() {
    const sel1 = document.getElementById('select-magic-1');
    const sel2 = document.getElementById('select-magic-2');
    if (!sel1 || !sel2 || !state.db) return;

    const baseMagics = [...state.db.base_magics].sort((a, b) => a.name.localeCompare(b.name));

    const options = [
      '<option value="">Any Magic</option>',
      ...baseMagics.map(m => `<option value="${escapeHtml(m.id)}">${escapeHtml(m.name)}</option>`)
    ].join('');

    sel1.innerHTML = options;
    sel2.innerHTML = options;

    sel1.value = state.filters.slot1;
    sel2.value = state.filters.slot2;

    renderAttributeChips();
  }

  function renderAttributeChips() {
    const container = document.getElementById('attributes-container');
    if (!container) return;

    const m1 = state.magicMap.get(state.filters.slot1);
    const m2 = state.magicMap.get(state.filters.slot2);

    if (!m1 && !m2) {
      container.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    container.style.display = 'block';
    let html = '';

    if (m1) {
      html += renderMagicAttrRows(m1, 1, state.filters.slot1Attr);
    }
    if (m2) {
      html += renderMagicAttrRows(m2, 2, state.filters.slot2Attr);
    }

    container.innerHTML = html;

    // Attach click listeners to chips
    container.querySelectorAll('.attr-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slot = parseInt(btn.dataset.slot, 10);
        const attrVal = btn.dataset.attr;
        if (slot === 1) {
          state.filters.slot1Attr = (state.filters.slot1Attr === attrVal) ? '' : attrVal;
        } else if (slot === 2) {
          state.filters.slot2Attr = (state.filters.slot2Attr === attrVal) ? '' : attrVal;
        }
        renderAttributeChips();
        renderCombinations();
      });
    });
  }

  function renderMagicAttrRows(magic, slotNum, selectedAttr) {
    let out = `<div class="attr-tier-row">`;
    out += `<div class="attr-tier-label">${escapeHtml(magic.name)} (Slot ${slotNum}):</div>`;

    if (magic.id === 'magic_bolt') {
      // Specialized Magic Bolt UI: ONE 'Any' chip at top, followed by Lv.4 and Lv.7 rows
      out += `<div class="attr-chips-list" style="margin-bottom:6px;">`;
      out += `<button type="button" class="attr-chip ${selectedAttr === '' ? 'active' : ''}" data-slot="${slotNum}" data-attr="">Any Trait</button>`;
      out += `</div>`;

      // Lv.4 row
      const lv4Tier = magic.attribute_tiers.find(t => t.level === 4);
      if (lv4Tier) {
        out += `<div class="attr-tier-label" style="font-size:0.65rem;color:var(--cyan);">Lv.4 Trait:</div>`;
        out += `<div class="attr-chips-list" style="margin-bottom:6px;">`;
        for (const attr of lv4Tier.attributes) {
          const isActive = selectedAttr === attr;
          out += `<button type="button" class="attr-chip ${isActive ? 'active' : ''}" data-slot="${slotNum}" data-attr="${escapeHtml(attr)}">${escapeHtml(attr)}</button>`;
        }
        out += `</div>`;
      }

      // Lv.7 row
      const lv7Tier = magic.attribute_tiers.find(t => t.level === 7);
      if (lv7Tier) {
        out += `<div class="attr-tier-label" style="font-size:0.65rem;color:var(--cyan);">Lv.7 Trait:</div>`;
        out += `<div class="attr-chips-list">`;
        for (const attr of lv7Tier.attributes) {
          const isActive = selectedAttr === attr;
          out += `<button type="button" class="attr-chip ${isActive ? 'active' : ''}" data-slot="${slotNum}" data-attr="${escapeHtml(attr)}">${escapeHtml(attr)}</button>`;
        }
        out += `</div>`;
      }
    } else if (magic.attribute_tiers && magic.attribute_tiers.length > 0) {
      // Standard magic attributes
      out += `<div class="attr-chips-list">`;
      out += `<button type="button" class="attr-chip ${selectedAttr === '' ? 'active' : ''}" data-slot="${slotNum}" data-attr="">Any Trait</button>`;
      for (const tier of magic.attribute_tiers) {
        for (const attr of tier.attributes) {
          const isActive = selectedAttr === attr;
          out += `<button type="button" class="attr-chip ${isActive ? 'active' : ''}" data-slot="${slotNum}" data-attr="${escapeHtml(attr)}">${escapeHtml(attr)}</button>`;
        }
      }
      out += `</div>`;
    } else {
      out += `<div style="font-size:0.72rem;color:var(--muted);">Passive Magic (Max Lv.${magic.max_level})</div>`;
    }

    out += `</div>`;
    return out;
  }

  // --- Rendering UI: Elemental Filter Row ---
  function renderElementalFilterRow() {
    const row = document.getElementById('element-filter-row');
    if (!row || !state.taxonomy) return;

    const elements = state.taxonomy.elements || [];
    let html = `
      <button type="button" class="element-chip ${state.filters.element === 'all' ? 'active' : ''}" data-element="all">
        ${ICONS.all}
        <span>All</span>
      </button>
    `;

    for (const el of elements) {
      const iconSvg = ICONS[el.id] || ICONS.heptagram;
      const isActive = state.filters.element === el.id;
      html += `
        <button type="button" class="element-chip ${isActive ? 'active' : ''}" data-element="${escapeHtml(el.id)}">
          ${iconSvg}
          <span>${escapeHtml(el.label.split('/')[0].trim())}</span>
        </button>
      `;
    }

    row.innerHTML = html;

    row.querySelectorAll('.element-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.filters.element = btn.dataset.element;
        renderElementalFilterRow();
        renderCombinations();
      });
    });
  }

  // --- Rendering UI: Functional Filters Drawer ---
  function renderFunctionalFilterDrawer() {
    const grid = document.getElementById('functional-tags-grid');
    const drawerBtn = document.getElementById('filter-drawer-btn');
    const drawerBtnCount = document.getElementById('active-filters-count');
    if (!grid || !state.taxonomy) return;

    const funcs = state.taxonomy.functional_filters || [];
    let html = '';

    for (const f of funcs) {
      const isActive = state.filters.functional.has(f.id);
      html += `
        <button type="button" class="func-chip ${isActive ? 'active' : ''}" data-func="${escapeHtml(f.id)}" title="${escapeHtml(f.description)}">
          ${escapeHtml(f.label)}
        </button>
      `;
    }
    grid.innerHTML = html;

    const count = state.filters.functional.size;
    if (drawerBtnCount) {
      drawerBtnCount.textContent = count > 0 ? ` (${count})` : '';
    }
    if (drawerBtn) {
      drawerBtn.classList.toggle('has-active', count > 0);
    }

    grid.querySelectorAll('.func-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const fid = btn.dataset.func;
        if (state.filters.functional.has(fid)) {
          state.filters.functional.delete(fid);
        } else {
          state.filters.functional.add(fid);
        }
        renderFunctionalFilterDrawer();
        renderCombinations();
      });
    });
  }

  // --- Combinations Filtering Logic ---
  function getFilteredCombinations() {
    if (!state.db) return [];
    const combos = state.db.combinations || [];
    const taxonomyTags = state.taxonomy ? state.taxonomy.combination_tags || {} : {};

    return combos.filter(combo => {
      // 1. Partner filter mode (from detail inspector "Find Compatible Partners")
      if (state.filters.partnerFor) {
        const target = state.comboMap.get(state.filters.partnerFor);
        if (target) {
          const targetMagics = new Set([target.main.magic_id, target.material.magic_id]);
          if (targetMagics.has(combo.main.magic_id) || targetMagics.has(combo.material.magic_id)) {
            return false;
          }
        }
      }

      // 2. Hide build conflicts toggle
      if (state.filters.hideConflicts) {
        if (doesComboConflictWithPinned(combo)) {
          return false;
        }
      }

      // 3. Category filter
      if (state.filters.category !== 'all' && combo.category !== state.filters.category) {
        return false;
      }

      // 4. Dual-Slot Magic matching
      const s1 = state.filters.slot1;
      const s2 = state.filters.slot2;

      if (s1 && s2) {
        // Must contain both magics (order independent)
        const matchForward = (combo.main.magic_id === s1 && combo.material.magic_id === s2);
        const matchReverse = (combo.main.magic_id === s2 && combo.material.magic_id === s1);
        if (!matchForward && !matchReverse) return false;

        // Attribute matching
        if (matchForward) {
          if (state.filters.slot1Attr && combo.main.attribute !== state.filters.slot1Attr) return false;
          if (state.filters.slot2Attr && combo.material.attribute !== state.filters.slot2Attr) return false;
        } else if (matchReverse) {
          if (state.filters.slot1Attr && combo.material.attribute !== state.filters.slot1Attr) return false;
          if (state.filters.slot2Attr && combo.main.attribute !== state.filters.slot2Attr) return false;
        }
      } else if (s1) {
        // Slot 1 alone
        const isMain = combo.main.magic_id === s1;
        const isMat = combo.material.magic_id === s1;
        if (!isMain && !isMat) return false;

        if (state.filters.slot1Attr) {
          if (isMain && combo.main.attribute !== state.filters.slot1Attr) return false;
          if (isMat && combo.material.attribute !== state.filters.slot1Attr) return false;
        }
      } else if (s2) {
        // Slot 2 alone
        const isMain = combo.main.magic_id === s2;
        const isMat = combo.material.magic_id === s2;
        if (!isMain && !isMat) return false;

        if (state.filters.slot2Attr) {
          if (isMain && combo.main.attribute !== state.filters.slot2Attr) return false;
          if (isMat && combo.material.attribute !== state.filters.slot2Attr) return false;
        }
      }

      // 5. Elemental filter
      if (state.filters.element !== 'all') {
        const tags = taxonomyTags[combo.id];
        if (!tags || !tags.elements || !tags.elements.includes(state.filters.element)) {
          return false;
        }
      }

      // 6. Functional & Scaling filters
      if (state.filters.functional.size > 0) {
        const tags = taxonomyTags[combo.id];
        if (!tags || !tags.functional) return false;
        for (const reqFunc of state.filters.functional) {
          if (!tags.functional.includes(reqFunc)) return false;
        }
      }

      // 7. Search query filter
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase().trim();
        const mainName = state.magicMap.get(combo.main.magic_id)?.name || combo.main.magic_id;
        const matName = state.magicMap.get(combo.material.magic_id)?.name || combo.material.magic_id;
        const searchCorpus = [
          combo.name,
          combo.category,
          combo.tier,
          mainName,
          combo.main.attribute,
          matName,
          combo.material.attribute,
          ...(combo.mechanics || [])
        ].join(' ').toLowerCase();

        if (!searchCorpus.includes(q)) return false;
      }

      return true;
    });
  }

  // --- Rendering UI: Combinations Cards List ---
  function renderCombinations() {
    const listEl = document.getElementById('combos-list');
    const countEl = document.getElementById('filtered-count');
    const partnerBar = document.getElementById('partner-filter-bar');
    if (!listEl) return;

    // Partner mode bar
    if (partnerBar) {
      if (state.filters.partnerFor) {
        const partnerCombo = state.comboMap.get(state.filters.partnerFor);
        partnerBar.style.display = 'flex';
        partnerBar.innerHTML = `
          <span>Showing compatible partners for <strong>${partnerCombo ? escapeHtml(partnerCombo.name) : ''}</strong> (0 shared magics)</span>
          <button type="button" class="btn-close-sm" id="btn-clear-partner" title="Clear partner filter">${ICONS.close}</button>
        `;
        const clearBtn = document.getElementById('btn-clear-partner');
        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            state.filters.partnerFor = '';
            renderCombinations();
          });
        }
      } else {
        partnerBar.style.display = 'none';
      }
    }

    const filtered = getFilteredCombinations();
    if (countEl) countEl.textContent = `${filtered.length}/59 Combinations`;

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="empty-results">
          <p>No combinations match the current filters.</p>
          <button type="button" class="btn-action primary" id="btn-empty-reset" style="margin:0 auto;display:inline-flex;">
            ${ICONS.reset} Reset All Filters
          </button>
        </div>
      `;
      const btn = document.getElementById('btn-empty-reset');
      if (btn) btn.addEventListener('click', resetAllFilters);
      return;
    }

    listEl.innerHTML = filtered.map(combo => {
      const isPinned = state.pinned.includes(combo.id);
      const isConflict = doesComboConflictWithPinned(combo);
      const mainMagic = state.magicMap.get(combo.main.magic_id);
      const matMagic = state.magicMap.get(combo.material.magic_id);

      const mainName = mainMagic ? mainMagic.name : combo.main.magic_id;
      const matName = matMagic ? matMagic.name : combo.material.magic_id;

      const tierClass = `tier-${combo.tier.toLowerCase()}`;
      const catClass = combo.category.toLowerCase();
      const catLabel = combo.category === 'aoe' ? 'AoE' : 'Nuke';

      return `
        <div class="combo-card ${isPinned ? 'is-pinned' : ''} ${isConflict ? 'has-conflict' : ''}" data-id="${escapeHtml(combo.id)}">
          <div class="card-thumb-wrapper">
            <img class="card-thumb" src="./assets/thumbs/${escapeHtml(combo.id)}.webp" alt="${escapeHtml(combo.name)}" loading="lazy" />
          </div>
          <div class="card-content">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(combo.name)}</span>
              <div class="card-badges">
                <span class="tier-badge ${tierClass}">T${escapeHtml(combo.tier)}</span>
                <span class="cat-tag ${catClass}">${catLabel}</span>
              </div>
            </div>
            <div class="card-recipe">
              <div class="recipe-line main" title="Main Magic (Scales with artifacts)">
                <span class="recipe-dot">●</span>
                <span>${escapeHtml(mainName)} (${escapeHtml(combo.main.attribute)})</span>
              </div>
              <div class="recipe-line material" title="Material Magic (Consumed)">
                <span class="recipe-plus">+</span>
                <span>${escapeHtml(matName)} (${escapeHtml(combo.material.attribute)})</span>
              </div>
            </div>
            <div class="card-actions">
              <button type="button" class="btn-pin ${isPinned ? 'pinned' : ''}" data-pin-id="${escapeHtml(combo.id)}">
                ${ICONS.pin}
                <span>${isPinned ? 'Pinned' : 'Pin'}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach card click handlers (inspect) and pin click handlers
    listEl.querySelectorAll('.combo-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking pin button, don't open modal
        const pinBtn = e.target.closest('.btn-pin');
        if (pinBtn) {
          e.stopPropagation();
          togglePin(pinBtn.dataset.pinId);
          return;
        }
        openInspectorModal(card.dataset.id);
      });
    });
  }

  // --- Reset All Filters ---
  function resetAllFilters() {
    state.filters.slot1 = '';
    state.filters.slot1Attr = '';
    state.filters.slot2 = '';
    state.filters.slot2Attr = '';
    state.filters.element = 'all';
    state.filters.functional.clear();
    state.filters.category = 'all';
    state.filters.search = '';
    state.filters.partnerFor = '';
    state.filters.hideConflicts = false;

    // Reset UI elements
    const s1 = document.getElementById('select-magic-1');
    const s2 = document.getElementById('select-magic-2');
    const searchInput = document.getElementById('search-input');
    const conflictToggle = document.getElementById('toggle-conflicts');

    if (s1) s1.value = '';
    if (s2) s2.value = '';
    if (searchInput) searchInput.value = '';
    if (conflictToggle) conflictToggle.checked = false;

    document.querySelectorAll('.cat-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.cat === 'all');
    });

    renderElementalFilterRow();
    renderFunctionalFilterDrawer();
    renderAttributeChips();
    renderCombinations();

    showToast('All filters reset.', 'info');
  }

  // --- Rendering UI: Build Planner Tab ---
  function renderPlanner() {
    const slotsGrid = document.getElementById('planner-slots-grid');
    const warningEl = document.getElementById('conflict-warning-container');
    const artPriorityList = document.getElementById('artifact-priority-list');
    const recContainer = document.getElementById('recommendation-container');
    const checklistContainer = document.getElementById('checklist-container');
    if (!slotsGrid) return;

    const levels = [25, 50, 75];

    // 1. Render 3 Slots
    slotsGrid.innerHTML = [0, 1, 2].map(i => {
      const cid = state.pinned[i];
      if (cid) {
        const c = state.comboMap.get(cid);
        const mainM = state.magicMap.get(c.main.magic_id)?.name || c.main.magic_id;
        const matM = state.magicMap.get(c.material.magic_id)?.name || c.material.magic_id;
        return `
          <div class="planner-slot-card" data-slot-index="${i}">
            <div class="slot-level-badge">Lv.${levels[i]}</div>
            <img class="planner-slot-thumb" src="./assets/thumbs/${escapeHtml(c.id)}.webp" alt="${escapeHtml(c.name)}" />
            <div class="planner-slot-info">
              <div class="planner-slot-name">${escapeHtml(c.name)}</div>
              <div class="planner-slot-sub">
                <span style="color:var(--main-green)">● ${escapeHtml(mainM)} (${escapeHtml(c.main.attribute)})</span> +
                <span style="color:var(--mat-crimson)">${escapeHtml(matM)} (${escapeHtml(c.material.attribute)})</span>
              </div>
            </div>
            <button type="button" class="btn-remove-slot" data-unpin="${escapeHtml(c.id)}" title="Remove slot">${ICONS.close}</button>
          </div>
        `;
      } else {
        return `
          <div class="planner-slot-card empty" data-slot-index="${i}">
            <span>+ Slot ${i + 1} (Unlocks at Lv.${levels[i]}) — Pin a fusion from Combinator</span>
          </div>
        `;
      }
    }).join('');

    slotsGrid.querySelectorAll('.btn-remove-slot').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePin(btn.dataset.unpin);
      });
    });

    // 2. Conflict Warning Banner
    const conflicts = getConflictsInPinned();
    if (warningEl) {
      if (conflicts.length > 0) {
        warningEl.style.display = 'block';
        warningEl.innerHTML = `
          <div class="conflict-warning-banner">
            ${ICONS.warning}
            <div>
              <strong>Build Conflict Detected:</strong>
              ${conflicts.map(c => `<div>${escapeHtml(c.magicName)} is required by both <em>${c.combos.map(escapeHtml).join('</em> and <em>')}</em>. In game, a magic cannot be consumed twice.</div>`).join('')}
            </div>
          </div>
        `;
      } else {
        warningEl.style.display = 'none';
        warningEl.innerHTML = '';
      }
    }

    // 3. Deduplicated Artifact Priority List
    if (artPriorityList) {
      if (state.pinned.length === 0) {
        artPriorityList.innerHTML = '<span style="font-size:0.75rem;color:var(--dim)">Pin fusions above to identify your Main Magic artifacts.</span>';
      } else {
        const uniqueMainMagics = new Set();
        for (const cid of state.pinned) {
          const c = state.comboMap.get(cid);
          if (c) uniqueMainMagics.add(c.main.magic_id);
        }

        artPriorityList.innerHTML = Array.from(uniqueMainMagics).map(mid => {
          const m = state.magicMap.get(mid);
          const name = m ? m.name : mid;
          return `<div class="artifact-badge">${ICONS.heptagram}<span>${escapeHtml(name)} Artifacts</span></div>`;
        }).join('');
      }
    }

    // 4. Recommended Class & Subject
    if (recContainer) {
      const recs = getRecommendations();
      if (!recs || state.pinned.length === 0) {
        recContainer.innerHTML = '<span style="font-size:0.75rem;color:var(--dim)">Pin at least one fusion to see optimal Class & Subject synergies.</span>';
      } else {
        recContainer.innerHTML = `
          <div class="recommendation-box">
            <div class="rec-item">
              <div class="rec-title-line">
                <span class="rec-name">${escapeHtml(recs.topClass.name)}</span>
                <span class="rec-badge">${escapeHtml(recs.topClass.archetype.toUpperCase())} CLASS</span>
              </div>
              <div class="rec-reason">${escapeHtml(recs.topClassReason)}</div>
            </div>
            <div class="rec-item" style="border-top:1px solid var(--border);padding-top:8px;">
              <div class="rec-title-line">
                <span class="rec-name">${escapeHtml(recs.topSubject.name)}</span>
                <span class="rec-badge">SUBJECT</span>
              </div>
              <div class="rec-reason">${escapeHtml(recs.topSubject.recommended_when)}</div>
              ${recs.topSubject.starting_artifact_hint ? `<div class="rec-hint">Hint: ${escapeHtml(recs.topSubject.starting_artifact_hint)}</div>` : ''}
            </div>
          </div>
        `;
      }
    }

    // 5. In-Run 6-Magic Leveling Checklist
    if (checklistContainer) {
      if (state.pinned.length === 0) {
        checklistContainer.innerHTML = '<span style="font-size:0.75rem;color:var(--dim)">No magics to track. Pin fusions above to generate your in-run checklist.</span>';
      } else {
        const checkItems = [];
        const seenKeys = new Set();

        for (const cid of state.pinned) {
          const c = state.comboMap.get(cid);
          if (!c) continue;

          // Main magic requirement
          const mainKey = `${c.main.magic_id}:${c.main.attribute}:${c.main.level}`;
          if (!seenKeys.has(mainKey)) {
            seenKeys.add(mainKey);
            const m = state.magicMap.get(c.main.magic_id);
            checkItems.push({
              key: mainKey,
              role: 'Main',
              magicName: m ? m.name : c.main.magic_id,
              attr: c.main.attribute,
              level: c.main.level
            });
          }

          // Material magic requirement
          const matKey = `${c.material.magic_id}:${c.material.attribute}:${c.material.level}`;
          if (!seenKeys.has(matKey)) {
            seenKeys.add(matKey);
            const m = state.magicMap.get(c.material.magic_id);
            checkItems.push({
              key: matKey,
              role: 'Material',
              magicName: m ? m.name : c.material.magic_id,
              attr: c.material.attribute,
              level: c.material.level
            });
          }
        }

        checklistContainer.innerHTML = checkItems.map(item => {
          const isChecked = !!state.checklist[item.key];
          const roleColor = item.role === 'Main' ? 'var(--main-green)' : 'var(--mat-crimson)';
          return `
            <div class="checklist-item ${isChecked ? 'checked' : ''}" data-check-key="${escapeHtml(item.key)}">
              <div class="check-box">${isChecked ? ICONS.check : ''}</div>
              <div class="check-info">
                <span class="check-magic-name">${escapeHtml(item.magicName)}</span>
                <span class="check-attr-desc" style="color:${roleColor}">
                  ${item.role}: ${escapeHtml(item.attr)} (Lv.${item.level})
                </span>
              </div>
            </div>
          `;
        }).join('');

        checklistContainer.querySelectorAll('.checklist-item').forEach(el => {
          el.addEventListener('click', () => {
            const k = el.dataset.checkKey;
            state.checklist[k] = !state.checklist[k];
            saveChecklistState();
            renderPlanner();
          });
        });
      }
    }
  }

  // --- Reddit Markdown Exporter ---
  function exportRedditMarkdown() {
    if (state.pinned.length === 0) {
      showToast('Please pin at least one combination before exporting.', 'warning');
      return;
    }

    const levels = [25, 50, 75];
    const recs = getRecommendations();
    const classCallout = recs && recs.topClass ? `**Recommended Class:** ${recs.topClass.name} (${recs.topClass.archetype})\n` : '';

    const rows = state.pinned.map((id, i) => {
      const c = state.comboMap.get(id);
      const mainM = state.magicMap.get(c.main.magic_id)?.name || c.main.magic_id;
      const matM = state.magicMap.get(c.material.magic_id)?.name || c.material.magic_id;
      return `| Lv.${levels[i]} | **${c.name}** | Tier ${c.tier} | ${mainM} — ${c.main.attribute} (Lv.${c.main.level}) | ${matM} — ${c.material.attribute} (Lv.${c.material.level}) |`;
    }).join('\n');

    const md = `### Magic Survival (v0.9941) Build\n\n${classCallout}\n| Slot | Combination | Tier | Main Magic (Artifact Scaled) | Material Magic (Consumed) |\n| :--- | :--- | :---: | :--- | :--- |\n${rows}\n\n*Created with Magic Survival Fusion Codex — r/magic_survival*`;

    navigator.clipboard.writeText(md)
      .then(() => showToast('Copied Reddit Markdown Table to clipboard!', 'success'))
      .catch(() => showToast('Clipboard write failed. Please check permissions.', 'error'));
  }

  // --- Share URL Link ---
  function copyShareUrl() {
    syncHash();
    navigator.clipboard.writeText(window.location.href)
      .then(() => showToast('Copied shareable build URL to clipboard!', 'success'))
      .catch(() => showToast('Clipboard write failed. Please check permissions.', 'error'));
  }

  // --- Reset Checklist ---
  function resetChecklist() {
    state.checklist = {};
    saveChecklistState();
    renderPlanner();
    showToast('In-run leveling checklist reset.', 'info');
  }

  // --- Detail Inspector Modal ---
  function openInspectorModal(comboId) {
    const combo = state.comboMap.get(comboId);
    if (!combo) return;

    state.activeModalCombo = combo;
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    const mainMagic = state.magicMap.get(combo.main.magic_id);
    const matMagic = state.magicMap.get(combo.material.magic_id);
    const mainName = mainMagic ? mainMagic.name : combo.main.magic_id;
    const matName = matMagic ? matMagic.name : combo.material.magic_id;

    const isPinned = state.pinned.includes(combo.id);

    content.innerHTML = `
      <div class="modal-image-preview">
        <img src="./assets/cards/${escapeHtml(combo.id)}.webp" alt="${escapeHtml(combo.name)}" />
        <button type="button" class="btn-lightbox-trigger" id="btn-open-lightbox">
          ${ICONS.zoom} <span>Fullscreen Card</span>
        </button>
      </div>

      <div class="modal-title-row">
        <div class="modal-title">${escapeHtml(combo.name)}</div>
        <div class="card-badges">
          <span class="tier-badge tier-${combo.tier.toLowerCase()}">TIER ${escapeHtml(combo.tier)}</span>
          <span class="cat-tag ${combo.category.toLowerCase()}">${combo.category === 'aoe' ? 'AoE' : 'Nuke'}</span>
        </div>
      </div>

      <div class="modal-recipe-box">
        <div class="recipe-line main" style="margin-bottom:4px;">
          <span class="recipe-dot">●</span>
          <span><strong>Main (Artifact Scaled):</strong> ${escapeHtml(mainName)} — ${escapeHtml(combo.main.attribute)} (Lv.${combo.main.level})</span>
        </div>
        <div class="recipe-line material">
          <span class="recipe-plus">+</span>
          <span><strong>Material (Consumed):</strong> ${escapeHtml(matName)} — ${escapeHtml(combo.material.attribute)} (Lv.${combo.material.level})</span>
        </div>
      </div>

      <div class="modal-mechanics-box">
        <div class="modal-mechanics-title">In-Game Mechanics</div>
        ${(combo.mechanics || []).map(m => `<div class="mechanics-text">• ${escapeHtml(m)}</div>`).join('')}
      </div>

      ${combo.buffs && combo.buffs.length > 0 ? `
        <div class="modal-buffs-box">
          <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--buff-blue);margin-bottom:4px;">BUFF STATS:</div>
          ${combo.buffs.map(b => `<div class="modal-buff-item">▲ ${escapeHtml(b)}</div>`).join('')}
        </div>
      ` : ''}

      ${combo.penalties && combo.penalties.length > 0 ? `
        <div class="modal-penalties-box">
          <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--penalty-red);margin-bottom:4px;">PENALTY STATS:</div>
          ${combo.penalties.map(p => `<div class="modal-penalty-item">▼ ${escapeHtml(p)}</div>`).join('')}
        </div>
      ` : ''}

      <div class="modal-scaling-note">
        <strong>Artifact Scaling Note:</strong> Only artifacts that scale <em>${escapeHtml(mainName)}</em> will boost this fusion. <em>${escapeHtml(matName)}</em> is consumed and its artifacts will not apply.
      </div>

      <div class="modal-actions-grid">
        <button type="button" class="btn-action" id="btn-modal-partner">
          ${ICONS.search} <span>Find Compatible</span>
        </button>
        <button type="button" class="btn-action ${isPinned ? 'primary' : ''}" id="btn-modal-pin">
          ${ICONS.pin} <span>${isPinned ? 'Unpin Fusion' : 'Pin Fusion'}</span>
        </button>
      </div>
    `;

    modal.classList.add('open');

    // Attach modal buttons
    document.getElementById('btn-open-lightbox')?.addEventListener('click', () => {
      openLightbox(`./assets/cards/${combo.id}.webp`);
    });

    document.getElementById('btn-modal-partner')?.addEventListener('click', () => {
      state.filters.partnerFor = combo.id;
      closeInspectorModal();
      switchTab('combinator');
      renderCombinations();
      showToast(`Showing partners with zero shared magics for ${combo.name}.`, 'info');
    });

    document.getElementById('btn-modal-pin')?.addEventListener('click', () => {
      togglePin(combo.id);
      openInspectorModal(combo.id); // Re-render modal button state
    });
  }

  function closeInspectorModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.remove('open');
    state.activeModalCombo = null;
  }

  // --- Lightbox Modal ---
  function openLightbox(imgSrc) {
    const lb = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-image');
    if (lb && img) {
      img.src = imgSrc;
      lb.classList.add('open');
    }
  }

  function closeLightbox() {
    const lb = document.getElementById('lightbox-modal');
    if (lb) lb.classList.remove('open');
  }

  // --- Codex Tab: Dynamic Cache Management ---
  async function checkCacheStatus() {
    const cacheStatusEl = document.getElementById('offline-cache-status');
    const cacheCountEl = document.getElementById('cached-count-val');
    if (!cacheStatusEl) return;

    if (!('caches' in window)) {
      cacheStatusEl.textContent = 'Not Supported';
      if (cacheCountEl) cacheCountEl.textContent = 'N/A';
      return;
    }

    try {
      const keys = await caches.keys();
      const codexKeys = keys.filter(k => k.startsWith(CACHE_PREFIX) || k.startsWith('fusion-codex-'));

      if (codexKeys.length === 0) {
        cacheStatusEl.textContent = 'Not Cached';
        if (cacheCountEl) cacheCountEl.textContent = '0 / 130';
        return;
      }

      const activeKey = codexKeys.includes(CURRENT_CACHE_NAME) ? CURRENT_CACHE_NAME : codexKeys[0];
      const cache = await caches.open(activeKey);
      const items = await cache.keys();

      cacheStatusEl.textContent = '100% Offline Ready';
      if (cacheCountEl) cacheCountEl.textContent = `${items.length} Assets Cached`;
    } catch (e) {
      console.warn('Cache check failed', e);
      cacheStatusEl.textContent = 'Error checking';
    }
  }

  async function refreshOfflineCache() {
    if (!('caches' in window)) {
      showToast('Cache API not supported in this browser.', 'error');
      return;
    }

    showToast('Clearing stale cache and fetching latest assets...', 'info');

    try {
      const keys = await caches.keys();
      for (const k of keys) {
        if (k.startsWith(CACHE_PREFIX) || k.startsWith('fusion-codex-')) {
          await caches.delete(k);
        }
      }

      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update();
        }
      }

      showToast('Cache refreshed! Reloading...', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (e) {
      showToast('Failed to refresh cache: ' + e.message, 'error');
    }
  }

  function downloadDatabaseJson() {
    if (!state.db) return;
    const blob = new Blob([JSON.stringify(state.db, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'combinations_v09941.json';
    a.click();
    showToast('combinations_v09941.json downloaded.', 'success');
  }

  // --- Codex Tab: Classes & Subjects Directory ---
  let selectedClassElement = 'all';

  function renderClassesDirectory() {
    const filterRow = document.getElementById('classes-element-filters');
    const listGrid = document.getElementById('classes-list-grid');
    if (!filterRow || !listGrid || !state.classesData) return;

    const elements = [
      { id: 'all', label: 'All' },
      { id: 'arcane', label: 'Arcane' },
      { id: 'lightning', label: 'Lightning' },
      { id: 'fire', label: 'Fire' },
      { id: 'ice', label: 'Ice' },
      { id: 'storm', label: 'Storm' }
    ];

    filterRow.innerHTML = elements.map(el => `
      <button type="button" class="element-chip ${selectedClassElement === el.id ? 'active' : ''}" data-class-el="${el.id}">
        ${ICONS[el.id] || ICONS.all}
        <span>${el.label}</span>
      </button>
    `).join('');

    filterRow.querySelectorAll('.element-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedClassElement = btn.dataset.classEl;
        renderClassesDirectory();
      });
    });

    const classes = state.classesData.classes || [];
    const filtered = classes.filter(c => {
      if (selectedClassElement === 'all') return true;
      return c.elements && c.elements.includes(selectedClassElement);
    });

    listGrid.innerHTML = filtered.map(c => {
      const primaryMagic = c.primary_magic_id ? state.magicMap.get(c.primary_magic_id) : null;
      return `
        <div class="class-card">
          <div class="class-card-top">
            <span class="class-name">${escapeHtml(c.name)}</span>
            <div style="display:flex;align-items:center;gap:6px;">
              <span class="rec-badge">${escapeHtml(c.archetype.toUpperCase())}</span>
              ${c.primary_magic_id ? `
                <button type="button" class="btn-view-fusions" data-magic="${escapeHtml(c.primary_magic_id)}">
                  View Fusions
                </button>
              ` : ''}
            </div>
          </div>
          <div class="class-desc">${escapeHtml(c.recommended_when)}</div>
          <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--muted);">
            Mastery: ${(c.mastery_bonuses || []).map(escapeHtml).join(' · ')}
          </div>
        </div>
      `;
    }).join('');

    listGrid.querySelectorAll('.btn-view-fusions').forEach(btn => {
      btn.addEventListener('click', () => {
        const mid = btn.dataset.magic;
        resetAllFilters();
        state.filters.slot1 = mid;
        const s1 = document.getElementById('select-magic-1');
        if (s1) s1.value = mid;
        switchTab('combinator');
        renderAttributeChips();
        renderCombinations();
      });
    });
  }

  // --- Setup Event Listeners ---
  function setupEventListeners() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
      });
    });

    // Dual-Slot Selects
    const s1 = document.getElementById('select-magic-1');
    const s2 = document.getElementById('select-magic-2');

    if (s1) {
      s1.addEventListener('change', () => {
        state.filters.slot1 = s1.value;
        state.filters.slot1Attr = '';
        renderAttributeChips();
        renderCombinations();
      });
    }

    if (s2) {
      s2.addEventListener('change', () => {
        state.filters.slot2 = s2.value;
        state.filters.slot2Attr = '';
        renderAttributeChips();
        renderCombinations();
      });
    }

    // Swap Button
    const swapBtn = document.getElementById('btn-swap-slots');
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const tempMagic = state.filters.slot1;
        const tempAttr = state.filters.slot1Attr;

        state.filters.slot1 = state.filters.slot2;
        state.filters.slot1Attr = state.filters.slot2Attr;

        state.filters.slot2 = tempMagic;
        state.filters.slot2Attr = tempAttr;

        if (s1) s1.value = state.filters.slot1;
        if (s2) s2.value = state.filters.slot2;

        renderAttributeChips();
        renderCombinations();
      });
    }

    // Reset Filters Button
    const resetBtn = document.getElementById('btn-reset-combinator');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetAllFilters);
    }

    // Functional Filter Drawer Toggle
    const drawerBtn = document.getElementById('filter-drawer-btn');
    const drawerContent = document.getElementById('filter-drawer-content');
    if (drawerBtn && drawerContent) {
      drawerBtn.addEventListener('click', () => {
        drawerContent.classList.toggle('open');
        const isNowOpen = drawerContent.classList.contains('open');
        const iconSpan = drawerBtn.querySelector('.drawer-chevron');
        if (iconSpan) {
          iconSpan.innerHTML = isNowOpen ? ICONS.chevronUp : ICONS.chevronDown;
        }
      });
    }

    // Search Input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.filters.search = searchInput.value;
        renderCombinations();
      });
    }

    // Category Pills
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.filters.category = pill.dataset.cat;
        renderCombinations();
      });
    });

    // Dark Custom Toggle: Hide Build Conflicts
    const conflictToggle = document.getElementById('toggle-conflicts');
    if (conflictToggle) {
      conflictToggle.addEventListener('change', () => {
        state.filters.hideConflicts = conflictToggle.checked;
        renderCombinations();
      });
    }

    // Build Planner Actions
    document.getElementById('btn-copy-reddit')?.addEventListener('click', exportRedditMarkdown);
    document.getElementById('btn-share-url')?.addEventListener('click', copyShareUrl);
    document.getElementById('btn-reset-checklist')?.addEventListener('click', resetChecklist);

    // Codex Tab Actions
    document.getElementById('btn-refresh-cache')?.addEventListener('click', refreshOfflineCache);
    document.getElementById('btn-download-json')?.addEventListener('click', downloadDatabaseJson);

    // Modal Close
    document.getElementById('modal-close-btn')?.addEventListener('click', closeInspectorModal);
    document.getElementById('detail-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'detail-modal') closeInspectorModal();
    });

    // Lightbox Close
    document.getElementById('lightbox-close-btn')?.addEventListener('click', closeLightbox);
    document.getElementById('lightbox-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'lightbox-modal') closeLightbox();
    });

    // Keyboard ESC to close modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
        closeInspectorModal();
      }
    });

    // Handle Native PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredInstallPrompt = e;
      const banner = document.getElementById('install-banner');
      if (banner && !localStorage.getItem(STORAGE_KEYS.INSTALL_DISMISSED)) {
        banner.style.display = 'flex';
      }
    });

    document.getElementById('btn-install-banner')?.addEventListener('click', async () => {
      if (state.deferredInstallPrompt) {
        state.deferredInstallPrompt.prompt();
        const choice = await state.deferredInstallPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          showToast('Thank you for installing Fusion Codex!', 'success');
        }
        state.deferredInstallPrompt = null;
        document.getElementById('install-banner').style.display = 'none';
      } else {
        showToast('To install, open your browser menu and tap "Add to Home screen"', 'info');
      }
    });

    document.getElementById('btn-dismiss-install')?.addEventListener('click', () => {
      const banner = document.getElementById('install-banner');
      if (banner) banner.style.display = 'none';
      try {
        localStorage.setItem(STORAGE_KEYS.INSTALL_DISMISSED, '1');
      } catch (err) {}
    });
  }

  // --- Initial Data Loader & App Bootstrap ---
  async function init() {
    try {
      const [dbRes, taxRes, classesRes] = await Promise.all([
        fetch('./data/combinations_v09941.json'),
        fetch('./data/filter_taxonomy_v09941.json'),
        fetch('./data/classes_subjects_v09941.json')
      ]);

      state.db = await dbRes.json();
      state.taxonomy = await taxRes.json();
      state.classesData = await classesRes.json();

      // Build Fast Lookup Maps
      for (const c of state.db.combinations) {
        state.comboMap.set(c.id, c);
      }
      for (const m of state.db.base_magics) {
        state.magicMap.set(m.id, m);
      }
      for (const el of state.taxonomy.elements) {
        state.elementMap.set(el.id, el);
      }

      loadPersistedState();
      setupEventListeners();

      // Populate UI
      populateMagicDropdowns();
      renderElementalFilterRow();
      renderFunctionalFilterDrawer();
      renderCombinations();
      updateDock();
      renderPlanner();
      renderClassesDirectory();
      checkCacheStatus();

      console.log('Magic Survival Fusion Codex initialized successfully with 59 verified combinations.');
    } catch (err) {
      console.error('Initialization error:', err);
      showToast('Error loading database files. Please refresh.', 'error');
    }
  }

  // Register Service Worker with strict isolation
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(reg => {
          console.log('Fusion Codex Service Worker registered with scope:', reg.scope);
          checkCacheStatus();
        })
        .catch(err => {
          console.warn('Service Worker registration skipped:', err);
        });
    });
  }

  // Start application on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
