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
    INSTALL_DISMISSED: 'ms_codex_v1_install_dismissed',
    INSTALLED: 'ms_codex_v1_installed'
  };

  const CACHE_PREFIX = 'ms-codex-';
  const CURRENT_CACHE_NAME = 'ms-codex-v09941-v9';
  // Must match the APP_SHELL list length in sw.js (each combination adds 1 thumb + 1 card on top).
  const APP_SHELL_ASSET_COUNT = 12;

  // --- Build Planner Slot Rules ---
  const BASE_SLOT_LEVELS = [25, 50, 75];
  const GOC_ID = 'gate_of_creation'; // "Gain 2 more Magic Combination chance."
  const GOC_BONUS_SLOTS = 2;
  const OVERMIND_ID = 'overmind';
  const CATEGORY_LABELS = { aoe: 'AoE', nuke: 'Nuke', support: 'Support' };

  // --- Minimalist Chalk-Ink SVG Icons with Explicit Dimensions (ZERO Emojis) ---
  const ICONS = {
    heptagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10.5" stroke-width="1.2" opacity="0.6"/><path d="M 12 2.5 L 16.12 20.56 L 4.57 6.08 L 21.26 14.11 L 2.74 14.11 L 19.43 6.08 L 7.88 20.56 Z"/></svg>',
    all: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>',
    lightning: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    fire: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-1.5 3-4 5-4 9 0 3.3 2.7 6 6 6s6-2.7 6-6c0-2-1-4-2-5-.5 2-2 3-3 3-1 0-2-.5-2-1.5 0-1.5 1-3.5 2-4.5-1.5.5-2.5 1.5-3 3z"/></svg>',
    ice: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/></svg>',
    arcane: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z"/></svg>',
    storm: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>',
    cosmic: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M3.5 15.5C5 18 8 20 12 20s8.5-3 8.5-8c0-3.5-2-6.5-5.5-8"/></svg>',
    void: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 12l10 10 10-10L12 2z"/><circle cx="12" cy="12" r="3"/></svg>',
    pin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    copy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    share: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    chevronUp: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
    zoom: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
    warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    close: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    appBadge: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>'
  };

  // --- Strict HTML Escaping ---
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- High-Value In-Game Mechanic Highlighting ---
  function highlightMechanicText(rawText) {
    if (typeof rawText !== 'string' || !rawText) return '';
    // Matches multipliers/numbers (+50%, 12X, 0.15s, 24 times, 1-9X, 3~7 times, 7×)
    // and core game terms (Damage Multiplier, Cooldown, Duration, Size, Attack Count, etc.)
    const pattern = /(\b\d+(?:\.\d+)?(?:[-~]\d+(?:\.\d+)?)?(?:%|s|X|x|×)?(?:\s*times)?\b|\b[+-]?\d+(?:\.\d+)?%?\b|\b(?:Damage Multiplier|Attack Count|Rotation Speed|Critical Rate|Critical Strike|Knocked Back|Damage|Cooldown|Duration|Size|Freeze|Freezes|Stun|Stuns|Staggered|Revival|Pierce|Projectiles|Satellite|Spread)\b)/gi;

    let lastIndex = 0;
    let out = '';
    let match;

    while ((match = pattern.exec(rawText)) !== null) {
      const matchIndex = match.index;
      const matchText = match[0];

      if (matchIndex > lastIndex) {
        out += escapeHtml(rawText.slice(lastIndex, matchIndex));
      }

      // Don't wrap single isolated digits like "every 6th hit" or bare small numbers without context (< 10)
      if (/^\d+$/.test(matchText) && parseInt(matchText, 10) < 10) {
        out += escapeHtml(matchText);
      } else {
        out += `<span class="mech-hl">${escapeHtml(matchText)}</span>`;
      }

      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < rawText.length) {
      out += escapeHtml(rawText.slice(lastIndex));
    }

    return out;
  }

  // --- Standalone / PWA Mode Detection (Comprehensive) ---
  function isStandaloneApp() {
    return Boolean(
      (window.matchMedia && (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches
      )) ||
      window.navigator.standalone === true ||
      (document.referrer && document.referrer.startsWith('android-app://')) ||
      localStorage.getItem(STORAGE_KEYS.INSTALLED) === '1'
    );
  }

  function shouldShowInstallBanner() {
    if (isStandaloneApp()) return false;
    if (localStorage.getItem(STORAGE_KEYS.INSTALL_DISMISSED) === '1') return false;
    return true;
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
    filtersDrawerOpen: false,

    pinned: [], // combo IDs: up to 3, or 5 while Gate of Creation is pinned
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
    else if (type === 'warning' || type === 'error') iconSvg = ICONS.warning;

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

  // --- Slot, Category & Recipe Helpers ---
  function getMaxSlots(pinned = state.pinned) {
    return BASE_SLOT_LEVELS.length + (pinned.includes(GOC_ID) ? GOC_BONUS_SLOTS : 0);
  }

  function isBonusSlot(index) {
    return index >= BASE_SLOT_LEVELS.length;
  }

  function getSlotLabel(index) {
    return isBonusSlot(index) ? 'GoC Bonus' : `Lv.${BASE_SLOT_LEVELS[index]}`;
  }

  function getCategoryLabel(category) {
    return CATEGORY_LABELS[category] || category;
  }

  // Perpetual Engine keeps its second magic (Intelligence) as a passive instead of consuming it.
  function isMaterialKept(combo) {
    return combo.material_consumed === false;
  }

  function getExpectedAssetCount() {
    const comboCount = state.db ? state.db.combinations.length : 0;
    return APP_SHELL_ASSET_COUNT + comboCount * 2;
  }

  // Dedupe, drop unknown ids, keep Gate of Creation inside a base slot, and cap to the slots it allows.
  function normalizePinned(ids) {
    const unique = [...new Set(ids)].filter(id => state.comboMap.has(id));
    const gocIdx = unique.indexOf(GOC_ID);
    if (gocIdx >= BASE_SLOT_LEVELS.length) {
      unique.splice(gocIdx, 1);
      unique.splice(BASE_SLOT_LEVELS.length - 1, 0, GOC_ID);
    }
    return unique.slice(0, getMaxSlots(unique));
  }

  // --- Pinned State & Persistence ---
  function loadPersistedState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PINNED);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          state.pinned = normalizePinned(parsed);
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

    // URL Hash override: #build=id1,id2,id3[,id4,id5] takes precedence on load
    const hash = window.location.hash;
    if (hash && hash.startsWith('#build=')) {
      const ids = hash.replace('#build=', '').split(',').map(s => s.trim());
      const validIds = normalizePinned(ids);
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
      // Unpinning Gate of Creation closes the 2 bonus slots: trim back to the 3 base slots.
      const dropped = state.pinned.length > getMaxSlots() ? state.pinned.splice(getMaxSlots()) : [];
      if (dropped.length > 0) {
        const names = dropped.map(id => state.comboMap.get(id)?.name || id).join(', ');
        showToast(`GoC Bonus slots closed. Also removed: ${names}.`, 'warning');
      } else {
        showToast('Removed combination from build planner.', 'info');
      }
    } else {
      const maxSlots = getMaxSlots();
      if (state.pinned.length >= maxSlots) {
        const msg = maxSlots > BASE_SLOT_LEVELS.length
          ? `All ${maxSlots} combination slots are full (Lv.25, Lv.50, Lv.75 + 2 GoC Bonus). Remove one first.`
          : 'All 3 fusion slots are full (Lv.25, Lv.50, Lv.75). Remove one first.';
        showToast(msg, 'warning');
        return;
      }
      state.pinned.push(comboId);
      const combo = state.comboMap.get(comboId);
      if (comboId === GOC_ID) {
        showToast(`Pinned Gate of Creation to Slot ${state.pinned.length}. 2 GoC Bonus slots unlocked.`, 'success');
      } else {
        showToast(`Pinned ${combo ? combo.name : comboId} to Slot ${state.pinned.length}.`, 'success');
      }
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

    // Check if single focus (>=2 pinned fusions share same Main Magic, or 1 fusion pinned)
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

  // --- Rendering UI: Bottom Navigation Badge & Slim Floating Dock ---
  function updateDock() {
    const dockEl = document.getElementById('floating-dock');
    const slotsContainer = document.getElementById('dock-slots');
    const badge = document.getElementById('dock-count-badge');
    const navBadge = document.getElementById('nav-planner-badge');

    const pinnedCount = state.pinned.length;
    const maxSlots = getMaxSlots();

    // 1. Update Planner Nav Pill Badge (0/3 to 3/3, or x/5 with Gate of Creation)
    if (navBadge) {
      navBadge.textContent = `${pinnedCount}/${maxSlots}`;
      navBadge.classList.toggle('hidden', pinnedCount === 0);
    }

    // 2. Floating Dock: ONLY rendered when state.pinned.length > 0
    if (!dockEl || !slotsContainer) return;

    dockEl.classList.toggle('hidden', pinnedCount === 0);
    if (pinnedCount === 0) {
      slotsContainer.innerHTML = '';
      return;
    }
    if (badge) badge.textContent = `${pinnedCount}/${maxSlots}`;

    const conflicts = getConflictsInPinned();
    const hasConflict = conflicts.length > 0;

    // 5-slot mode is too narrow for names on 360px screens: show slot labels only (name stays in the title).
    const compact = maxSlots > BASE_SLOT_LEVELS.length;
    slotsContainer.innerHTML = Array.from({ length: maxSlots }, (_, i) => {
      const cid = state.pinned[i];
      const shortLabel = isBonusSlot(i) ? `GoC ${i - BASE_SLOT_LEVELS.length + 1}` : getSlotLabel(i);
      if (cid) {
        const c = state.comboMap.get(cid);
        const name = c ? c.name : cid;
        const text = compact ? shortLabel : `${shortLabel}: ${escapeHtml(name)}`;
        return `<div class="dock-slot filled ${hasConflict ? 'has-conflict' : ''}" data-slot="${i}" title="${escapeHtml(name)}">${text}</div>`;
      } else {
        return `<div class="dock-slot empty" data-slot="${i}">${compact ? shortLabel : `Slot ${i + 1}`}</div>`;
      }
    }).join('');

    // Clicking dock slot opens Build Planner tab
    slotsContainer.querySelectorAll('.dock-slot').forEach(el => {
      el.addEventListener('click', () => switchTab('planner'));
    });
  }

  // --- Tab Switching ---
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
      updateCodexInstallCard();
    }
  }

  // --- Combinator Controls & Attribute Chips ---
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

    container.classList.toggle('hidden', !m1 && !m2);
    if (!m1 && !m2) {
      container.innerHTML = '';
      return;
    }
    let html = '';

    if (m1) html += renderMagicAttrRows(m1, 1, state.filters.slot1Attr);
    if (m2) html += renderMagicAttrRows(m2, 2, state.filters.slot2Attr);

    container.innerHTML = html;

    container.querySelectorAll('.attr-chip').forEach(btn => {
      btn.addEventListener('click', () => {
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
      // Magic Bolt: ONE 'Any' chip at top, followed by Lv.4 and Lv.7 rows
      out += `<div class="attr-chips-list attr-chips-spaced">`;
      out += `<button type="button" class="attr-chip ${selectedAttr === '' ? 'active' : ''}" data-slot="${slotNum}" data-attr="">Any Trait</button>`;
      out += `</div>`;

      const lv4Tier = magic.attribute_tiers.find(t => t.level === 4);
      if (lv4Tier) {
        out += `<div class="attr-tier-label attr-tier-sublabel">Lv.4 Trait:</div>`;
        out += `<div class="attr-chips-list attr-chips-spaced">`;
        for (const attr of lv4Tier.attributes) {
          const isActive = selectedAttr === attr;
          out += `<button type="button" class="attr-chip ${isActive ? 'active' : ''}" data-slot="${slotNum}" data-attr="${escapeHtml(attr)}">${escapeHtml(attr)}</button>`;
        }
        out += `</div>`;
      }

      const lv7Tier = magic.attribute_tiers.find(t => t.level === 7);
      if (lv7Tier) {
        out += `<div class="attr-tier-label attr-tier-sublabel">Lv.7 Trait:</div>`;
        out += `<div class="attr-chips-list">`;
        for (const attr of lv7Tier.attributes) {
          const isActive = selectedAttr === attr;
          out += `<button type="button" class="attr-chip ${isActive ? 'active' : ''}" data-slot="${slotNum}" data-attr="${escapeHtml(attr)}">${escapeHtml(attr)}</button>`;
        }
        out += `</div>`;
      }
    } else if (magic.attribute_tiers && magic.attribute_tiers.length > 0) {
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
      out += `<div class="attr-passive-note">Passive Magic (Max Lv.${magic.max_level})</div>`;
    }

    out += `</div>`;
    return out;
  }

  // --- Collapsible 4-Section Filters Drawer ---
  function renderFiltersDrawer() {
    const elemGrid = document.getElementById('drawer-elements-grid');
    const rolesGrid = document.getElementById('drawer-roles-grid');
    const scalingGrid = document.getElementById('drawer-scaling-grid');
    const badgeEl = document.getElementById('filter-count-badge');
    const toggleBtn = document.getElementById('btn-filters-toggle');
    if (!elemGrid || !rolesGrid || !scalingGrid || !state.taxonomy) return;

    // 1. Elements
    const elements = state.taxonomy.elements || [];
    let elemHtml = `
      <button type="button" class="filter-chip ${state.filters.element === 'all' ? 'active' : ''}" data-drawer-element="all">
        ${ICONS.all}
        <span>All</span>
      </button>
    `;
    for (const el of elements) {
      const iconSvg = ICONS[el.id] || ICONS.all;
      const isActive = state.filters.element === el.id;
      elemHtml += `
        <button type="button" class="filter-chip ${isActive ? 'active' : ''}" data-drawer-element="${escapeHtml(el.id)}">
          ${iconSvg}
          <span>${escapeHtml(el.label.split('/')[0].trim())}</span>
        </button>
      `;
    }
    elemGrid.innerHTML = elemHtml;

    elemGrid.querySelectorAll('[data-drawer-element]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.filters.element = btn.dataset.drawerElement;
        renderFiltersDrawer();
        renderCombinations();
      });
    });

    // 2. Combat Roles & 3. Stat Scaling
    const allFuncs = state.taxonomy.functional_filters || [];
    const combatRoleIds = new Set(['crowd_clear', 'nuke_burst', 'cc_freeze_stun', 'orbital_aura', 'rapid_fire', 'explosion_aoe', 'beam_laser', 'pierce_slash', 'survival_utility']);
    const statScalingIds = new Set(['cdr_scaling', 'size_scaling', 'duration_scaling', 'count_scaling', 'crit_scaling']);

    let rolesHtml = '';
    let scalingHtml = '';

    for (const f of allFuncs) {
      const isActive = state.filters.functional.has(f.id);
      const chipHtml = `
        <button type="button" class="filter-chip ${isActive ? 'active' : ''}" data-drawer-func="${escapeHtml(f.id)}" title="${escapeHtml(f.description)}">
          <span>${escapeHtml(f.label)}</span>
        </button>
      `;
      if (combatRoleIds.has(f.id)) {
        rolesHtml += chipHtml;
      } else if (statScalingIds.has(f.id)) {
        scalingHtml += chipHtml;
      }
    }

    rolesGrid.innerHTML = rolesHtml;
    scalingGrid.innerHTML = scalingHtml;

    const handleFuncClick = (btn) => {
      const fid = btn.dataset.drawerFunc;
      if (state.filters.functional.has(fid)) {
        state.filters.functional.delete(fid);
      } else {
        state.filters.functional.add(fid);
      }
      renderFiltersDrawer();
      renderCombinations();
    };

    rolesGrid.querySelectorAll('[data-drawer-func]').forEach(btn => btn.addEventListener('click', () => handleFuncClick(btn)));
    scalingGrid.querySelectorAll('[data-drawer-func]').forEach(btn => btn.addEventListener('click', () => handleFuncClick(btn)));

    // Update active filters badge & styling on the toggle button
    let activeFilterCount = state.filters.functional.size;
    if (state.filters.element !== 'all') activeFilterCount += 1;
    if (state.filters.hideConflicts) activeFilterCount += 1;

    if (badgeEl) {
      badgeEl.textContent = activeFilterCount;
      badgeEl.classList.toggle('hidden', activeFilterCount === 0);
    }
    if (toggleBtn) {
      toggleBtn.classList.toggle('has-active', activeFilterCount > 0);
    }
  }

  // --- Combinations Filtering & Deep Search Engine ---
  function getFilteredCombinations() {
    if (!state.db) return [];
    const combos = state.db.combinations || [];
    const taxonomyTags = state.taxonomy ? state.taxonomy.combination_tags || {} : {};

    return combos.filter(combo => {
      // 1. Partner filter mode
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
      if (state.filters.hideConflicts && doesComboConflictWithPinned(combo)) {
        return false;
      }

      // 3. Category filter
      if (state.filters.category !== 'all' && combo.category !== state.filters.category) {
        return false;
      }

      // 4. Dual-Slot Magic matching
      const s1 = state.filters.slot1;
      const s2 = state.filters.slot2;

      if (s1 && s2) {
        const matchForward = (combo.main.magic_id === s1 && combo.material.magic_id === s2);
        const matchReverse = (combo.main.magic_id === s2 && combo.material.magic_id === s1);
        if (!matchForward && !matchReverse) return false;

        if (matchForward) {
          if (state.filters.slot1Attr && combo.main.attribute !== state.filters.slot1Attr) return false;
          if (state.filters.slot2Attr && combo.material.attribute !== state.filters.slot2Attr) return false;
        } else if (matchReverse) {
          if (state.filters.slot1Attr && combo.material.attribute !== state.filters.slot1Attr) return false;
          if (state.filters.slot2Attr && combo.main.attribute !== state.filters.slot2Attr) return false;
        }
      } else if (s1) {
        const isMain = combo.main.magic_id === s1;
        const isMat = combo.material.magic_id === s1;
        if (!isMain && !isMat) return false;

        if (state.filters.slot1Attr) {
          if (isMain && combo.main.attribute !== state.filters.slot1Attr) return false;
          if (isMat && combo.material.attribute !== state.filters.slot1Attr) return false;
        }
      } else if (s2) {
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

      // 7. Deep Search: matches combination name, base magics, attributes, mechanics, buffs, penalties
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase().trim();
        const mainName = state.magicMap.get(combo.main.magic_id)?.name || combo.main.magic_id;
        const matName = state.magicMap.get(combo.material.magic_id)?.name || combo.material.magic_id;

        const deepCorpus = [
          combo.name,
          combo.category,
          mainName,
          combo.main.attribute,
          matName,
          combo.material.attribute,
          ...(combo.mechanics || []),
          ...(combo.buffs || []),
          ...(combo.penalties || [])
        ].join(' ').toLowerCase();

        if (!deepCorpus.includes(q)) return false;
      }

      return true;
    });
  }

  // --- Rendering Combinations Cards ---
  function renderCombinations() {
    const listEl = document.getElementById('combos-list');
    const countEl = document.getElementById('filtered-count');
    const partnerBar = document.getElementById('partner-filter-bar');
    const clearBtn = document.getElementById('btn-clear-active-filters');
    if (!listEl) return;

    // Check if any filter is active to show quick "Clear Filters"
    const hasActiveFilters = Boolean(
      state.filters.slot1 || state.filters.slot2 ||
      state.filters.element !== 'all' || state.filters.functional.size > 0 ||
      state.filters.category !== 'all' || state.filters.search ||
      state.filters.hideConflicts || state.filters.partnerFor
    );

    if (clearBtn) {
      clearBtn.classList.toggle('hidden', !hasActiveFilters);
    }

    // Partner mode bar
    if (partnerBar) {
      partnerBar.classList.toggle('hidden', !state.filters.partnerFor);
      if (state.filters.partnerFor) {
        const partnerCombo = state.comboMap.get(state.filters.partnerFor);
        partnerBar.innerHTML = `
          <span>Showing compatible partners for <strong>${partnerCombo ? escapeHtml(partnerCombo.name) : ''}</strong> (0 shared magics)</span>
          <button type="button" class="btn-close-sm" id="btn-clear-partner" title="Clear partner filter">${ICONS.close}</button>
        `;
        document.getElementById('btn-clear-partner')?.addEventListener('click', () => {
          state.filters.partnerFor = '';
          renderCombinations();
        });
      }
    }

    const filtered = getFilteredCombinations();
    if (countEl) countEl.textContent = `${filtered.length} Combinations`;

    if (filtered.length === 0) {
      if (state.filters.slot1 && state.filters.slot2) {
        const m1 = state.magicMap.get(state.filters.slot1);
        const m2 = state.magicMap.get(state.filters.slot2);
        const name1 = m1 ? m1.name : state.filters.slot1;
        const name2 = m2 ? m2.name : state.filters.slot2;

        listEl.innerHTML = `
          <div class="empty-results">
            <div class="empty-state-icon">${ICONS.warning}</div>
            <div class="empty-state-title"><strong>${escapeHtml(name1)}</strong> and <strong>${escapeHtml(name2)}</strong> don't combine in v0.9941</div>
            <div class="empty-state-desc">Neither magic serves as the primary or secondary component for the other in this patch.</div>
            <div class="empty-fallback-actions">
              <button type="button" class="btn-action" id="btn-show-m1">Show ${escapeHtml(name1)} Fusions</button>
              <button type="button" class="btn-action" id="btn-show-m2">Show ${escapeHtml(name2)} Fusions</button>
              <button type="button" class="btn-action primary btn-centered" id="btn-empty-reset">Reset All Filters</button>
            </div>
          </div>
        `;
        document.getElementById('btn-show-m1')?.addEventListener('click', () => {
          state.filters.slot2 = '';
          state.filters.slot2Attr = '';
          const s2 = document.getElementById('select-magic-2');
          if (s2) s2.value = '';
          renderAttributeChips();
          renderCombinations();
        });
        document.getElementById('btn-show-m2')?.addEventListener('click', () => {
          state.filters.slot1 = state.filters.slot2;
          state.filters.slot1Attr = state.filters.slot2Attr;
          state.filters.slot2 = '';
          state.filters.slot2Attr = '';
          const s1 = document.getElementById('select-magic-1');
          const s2 = document.getElementById('select-magic-2');
          if (s1) s1.value = state.filters.slot1;
          if (s2) s2.value = '';
          renderAttributeChips();
          renderCombinations();
        });
        document.getElementById('btn-empty-reset')?.addEventListener('click', () => resetAllFilters());
        return;
      }

      listEl.innerHTML = `
        <div class="empty-results">
          <p>No combinations match the current filters.</p>
          <button type="button" class="btn-action primary btn-centered" id="btn-empty-reset">
            Reset All Filters
          </button>
        </div>
      `;
      document.getElementById('btn-empty-reset')?.addEventListener('click', () => resetAllFilters());
      return;
    }

    listEl.innerHTML = filtered.map(combo => {
      const isPinned = state.pinned.includes(combo.id);
      const isConflict = doesComboConflictWithPinned(combo);
      const mainMagic = state.magicMap.get(combo.main.magic_id);
      const matMagic = state.magicMap.get(combo.material.magic_id);

      const mainName = mainMagic ? mainMagic.name : combo.main.magic_id;
      const matName = matMagic ? matMagic.name : combo.material.magic_id;

      const catClass = combo.category.toLowerCase();
      const catLabel = getCategoryLabel(combo.category);
      const kept = isMaterialKept(combo);

      return `
        <div class="combo-card ${isPinned ? 'is-pinned' : ''} ${isConflict ? 'has-conflict' : ''}" data-id="${escapeHtml(combo.id)}">
          <div class="card-thumb-wrapper">
            <img class="card-thumb" src="./assets/thumbs/${escapeHtml(combo.id)}.webp" alt="${escapeHtml(combo.name)}" loading="lazy" />
          </div>
          <div class="card-content">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(combo.name)}</span>
              <div class="card-badges">
                <span class="cat-tag ${catClass}">${catLabel}</span>
              </div>
            </div>
            <div class="card-recipe">
              <div class="recipe-line main" title="Main Magic (Scales with artifacts)">
                <span class="recipe-dot">●</span>
                <span>${escapeHtml(mainName)} (${escapeHtml(combo.main.attribute)})</span>
              </div>
              <div class="recipe-line ${kept ? 'main kept' : 'material'}" title="${kept ? 'Passive Magic (Kept, not consumed)' : 'Material Magic (Consumed)'}">
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

    listEl.querySelectorAll('.combo-card').forEach(card => {
      card.addEventListener('click', (e) => {
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
  function resetAllFilters(silent = false) {
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

    renderFiltersDrawer();
    renderAttributeChips();
    renderCombinations();

    if (!silent) showToast('All filters reset.', 'info');
  }

  // --- Rendering UI: Build Planner Tab ---
  function renderPlanner() {
    const slotsGrid = document.getElementById('planner-slots-grid');
    const warningEl = document.getElementById('conflict-warning-container');
    const artPriorityList = document.getElementById('artifact-priority-list');
    const recContainer = document.getElementById('recommendation-container');
    const checklistContainer = document.getElementById('checklist-container');
    if (!slotsGrid) return;

    const maxSlots = getMaxSlots();

    // 0. Planner title reflects 3-slot or Gate of Creation 5-slot mode
    const titleEl = document.getElementById('planner-title-text');
    if (titleEl) titleEl.textContent = `${maxSlots}-Slot Build Planner`;

    // 1. Render Slots (3 base slots, +2 GoC Bonus slots while Gate of Creation is pinned)
    slotsGrid.innerHTML = Array.from({ length: maxSlots }, (_, i) => {
      const cid = state.pinned[i];
      const slotLabel = getSlotLabel(i);
      const badgeClass = isBonusSlot(i) ? 'slot-level-badge bonus' : 'slot-level-badge';
      if (cid) {
        const c = state.comboMap.get(cid);
        const mainM = state.magicMap.get(c.main.magic_id)?.name || c.main.magic_id;
        const matM = state.magicMap.get(c.material.magic_id)?.name || c.material.magic_id;
        const matClass = isMaterialKept(c) ? 'recipe-text-main' : 'recipe-text-mat';
        return `
          <div class="planner-slot-card" data-slot-index="${i}">
            <div class="${badgeClass}">${slotLabel}</div>
            <img class="planner-slot-thumb" src="./assets/thumbs/${escapeHtml(c.id)}.webp" alt="${escapeHtml(c.name)}" />
            <div class="planner-slot-info">
              <div class="planner-slot-name">${escapeHtml(c.name)}</div>
              <div class="planner-slot-sub">
                <span class="recipe-text-main">● ${escapeHtml(mainM)} (${escapeHtml(c.main.attribute)})</span> +
                <span class="${matClass}">${escapeHtml(matM)} (${escapeHtml(c.material.attribute)})</span>
              </div>
            </div>
            <button type="button" class="btn-remove-slot" data-unpin="${escapeHtml(c.id)}" title="Remove slot">${ICONS.close}</button>
          </div>
        `;
      } else {
        return `
          <div class="planner-slot-card empty" data-slot-index="${i}">
            <div class="${badgeClass}">${slotLabel}</div>
            <div class="planner-empty-text">
              <span class="planner-empty-plus">+</span>
              <span>Slot ${i + 1} (${slotLabel}) — Tap to pick a fusion</span>
            </div>
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

    slotsGrid.querySelectorAll('.planner-slot-card.empty').forEach(card => {
      card.addEventListener('click', () => {
        switchTab('combinator');
        showToast('Select a fusion to pin to your build.', 'info');
      });
    });

    // 2. Conflict Warning Banner
    const conflicts = getConflictsInPinned();
    if (warningEl) {
      warningEl.classList.toggle('hidden', conflicts.length === 0);
      if (conflicts.length > 0) {
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
        warningEl.innerHTML = '';
      }
    }

    // 2b. Overmind Note (compact, factual reminder of its restriction & scaling)
    const notesEl = document.getElementById('planner-notes-container');
    if (notesEl) {
      const overmindPinned = state.pinned.includes(OVERMIND_ID);
      notesEl.classList.toggle('hidden', !overmindPinned);
      notesEl.innerHTML = overmindPinned
        ? `<div class="planner-note">${ICONS.heptagram}<span><strong>Overmind active</strong> — only Combined Spells can be cast; extra Active Magic levels boost ATK, Size &amp; CDR.</span></div>`
        : '';
    }

    // 3. Deduplicated Artifact Priority List
    if (artPriorityList) {
      if (state.pinned.length === 0) {
        artPriorityList.innerHTML = '<span class="placeholder-dim-text">Pin fusions above to identify your Main Magic artifacts.</span>';
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
        recContainer.innerHTML = '<span class="placeholder-dim-text">Pin at least one fusion to see optimal Class & Subject synergies.</span>';
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
            <div class="rec-item rec-item-bordered">
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

    // 5. In-Run Leveling Checklist (Grouped by Base Magic with Conflict Indicators)
    if (checklistContainer) {
      if (state.pinned.length === 0) {
        checklistContainer.innerHTML = '<span class="placeholder-dim-text">No magics to track. Pin fusions above to generate your in-run checklist.</span>';
      } else {
        // Group requirements by magic_id
        const magicGroups = {};

        for (const cid of state.pinned) {
          const c = state.comboMap.get(cid);
          if (!c) continue;

          // Main magic
          const mId = c.main.magic_id;
          if (!magicGroups[mId]) magicGroups[mId] = [];
          magicGroups[mId].push({
            comboName: c.name,
            role: 'Main',
            attr: c.main.attribute,
            level: c.main.level,
            key: `${mId}:${c.main.attribute}:${c.main.level}`
          });

          // Material magic (or a kept passive, e.g. Perpetual Engine's Intelligence)
          const matId = c.material.magic_id;
          if (!magicGroups[matId]) magicGroups[matId] = [];
          magicGroups[matId].push({
            comboName: c.name,
            role: isMaterialKept(c) ? 'Kept' : 'Material',
            attr: c.material.attribute,
            level: c.material.level,
            key: `${matId}:${c.material.attribute}:${c.material.level}`
          });
        }

        let groupsHtml = '';
        for (const mId in magicGroups) {
          const reqs = magicGroups[mId];
          const magicObj = state.magicMap.get(mId);
          const magicName = magicObj ? magicObj.name : mId;
          const isConflict = reqs.length > 1;

          groupsHtml += `
            <div class="magic-checklist-group ${isConflict ? 'has-conflict' : ''}">
              <div class="magic-group-header">
                <span class="magic-group-name">${escapeHtml(magicName)}</span>
                ${isConflict ? '<span class="conflict-badge">Conflict</span>' : ''}
              </div>
              <div class="group-checklist-items">
                ${reqs.map(req => {
                  const isChecked = Boolean(state.checklist[req.key]);
                  const roleClass = req.role === 'Material' ? 'material' : 'main';
                  return `
                    <div class="checklist-item ${isChecked ? 'checked' : ''}" data-check-key="${escapeHtml(req.key)}">
                      <div class="check-box">${isChecked ? ICONS.check : ''}</div>
                      <div class="check-info">
                        <span class="check-attr-desc">${escapeHtml(req.attr)} (Lv.${req.level})</span>
                        <span class="check-role-pill ${roleClass}">${req.role} · ${escapeHtml(req.comboName)}</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }

        checklistContainer.innerHTML = groupsHtml;

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

    // 6. Disable Export/Share buttons when no pinned fusions
    const btnReddit = document.getElementById('btn-copy-reddit');
    const btnShare = document.getElementById('btn-share-url');
    const hasPinned = state.pinned.length > 0;
    if (btnReddit) {
      btnReddit.classList.toggle('disabled', !hasPinned);
      btnReddit.disabled = !hasPinned;
    }
    if (btnShare) {
      btnShare.classList.toggle('disabled', !hasPinned);
      btnShare.disabled = !hasPinned;
    }
  }

  // --- Rich Reddit Markdown Exporter ---
  function exportRedditMarkdown() {
    if (state.pinned.length === 0) {
      showToast('Please pin at least one combination before exporting.', 'warning');
      return;
    }

    const recs = getRecommendations();

    const uniqueMainMagics = new Set();
    for (const cid of state.pinned) {
      const c = state.comboMap.get(cid);
      if (c) uniqueMainMagics.add(state.magicMap.get(c.main.magic_id)?.name || c.main.magic_id);
    }
    const artifactList = Array.from(uniqueMainMagics).join(', ');

    const rows = state.pinned.map((id, i) => {
      const c = state.comboMap.get(id);
      const mainM = state.magicMap.get(c.main.magic_id)?.name || c.main.magic_id;
      const matM = state.magicMap.get(c.material.magic_id)?.name || c.material.magic_id;
      const keptNote = isMaterialKept(c) ? ' *(Passive · Kept)*' : '';
      return `| ${getSlotLabel(i)} | **${c.name}** | ${mainM} — ${c.main.attribute} (Lv.${c.main.level}) | ${matM} — ${c.material.attribute} (Lv.${c.material.level})${keptNote} |`;
    }).join('\n');

    let md = `### Magic Survival (v0.9941) Build\n\n`;
    if (recs) {
      if (recs.topClass) {
        md += `**Recommended Class:** ${recs.topClass.name} (${recs.topClass.archetype}) — ${recs.topClassReason}\n`;
      }
      if (recs.topSubject) {
        md += `**Recommended Subject:** ${recs.topSubject.name} — ${recs.topSubject.recommended_when}\n`;
      }
    }
    md += `**Artifact Priority (Main Magics):** ${artifactList} *(Only Main Magics scale with artifacts)*\n\n`;
    md += `| Slot | Combination | Main Magic (Artifact Scaled) | Material Magic (Consumed) |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    md += `${rows}\n\n`;
    md += `*Created with Magic Survival Fusion Codex — r/magic_survival*`;

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
    const kept = isMaterialKept(combo);

    const taxTags = (state.taxonomy && state.taxonomy.combination_tags) ? (state.taxonomy.combination_tags[combo.id] || {}) : {};
    const comboElements = (taxTags.elements || []).map(eid => {
      const el = state.elementMap.get(eid);
      return { id: eid, label: el ? el.label.split('/')[0].trim() : eid };
    });
    const comboScalings = (taxTags.functional || [])
      .filter(fid => fid.endsWith('_scaling'))
      .map(fid => {
        const fObj = (state.taxonomy.functional_filters || []).find(item => item.id === fid);
        return { id: fid, label: fObj ? fObj.label : fid };
      });

    const tagsPillsHtml = [
      ...comboElements.map(el => `<span class="modal-tag-pill element">${escapeHtml(el.label)}</span>`),
      ...comboScalings.map(sc => `<span class="modal-tag-pill scaling">${escapeHtml(sc.label)}</span>`)
    ].join('');

    content.innerHTML = `
      <div class="modal-header-card">
        <div class="modal-thumb-wrap">
          <img class="modal-thumb-img" src="./assets/thumbs/${escapeHtml(combo.id)}.webp" alt="${escapeHtml(combo.name)}" />
        </div>
        <div class="modal-header-info">
          <div class="modal-title-row">
            <div class="modal-title">${escapeHtml(combo.name)}</div>
          </div>
          <div class="modal-badges-row">
            <span class="cat-tag ${combo.category.toLowerCase()}">${escapeHtml(getCategoryLabel(combo.category))}</span>
          </div>
          ${tagsPillsHtml ? `<div class="modal-tags-row">${tagsPillsHtml}</div>` : ''}
        </div>
      </div>

      <button type="button" class="btn-view-card" id="btn-open-lightbox">
        ${ICONS.zoom} <span>View Original In-Game Card</span>
      </button>

      <div class="modal-recipe-box">
        <div class="modal-recipe-block main">
          <div class="modal-recipe-tag">MAIN · ARTIFACT SCALED</div>
          <div class="modal-recipe-val">${escapeHtml(mainName)} — ${escapeHtml(combo.main.attribute)} (Lv.${combo.main.level})</div>
        </div>
        <div class="modal-recipe-block ${kept ? 'main kept' : 'material'}">
          <div class="modal-recipe-tag">${kept ? 'SECOND MAGIC (PASSIVE · KEPT)' : 'MATERIAL · CONSUMED'}</div>
          <div class="modal-recipe-val">${escapeHtml(matName)} — ${escapeHtml(combo.material.attribute)} (Lv.${combo.material.level})</div>
        </div>
      </div>

      <div class="modal-mechanics-box">
        <div class="modal-mechanics-title">In-Game Mechanics</div>
        ${(combo.mechanics || []).map(m => `<div class="mechanics-text">• ${highlightMechanicText(m)}</div>`).join('')}
      </div>

      ${combo.buffs && combo.buffs.length > 0 ? `
        <div class="modal-buffs-box">
          <div class="modal-section-tag buff">BUFF STATS:</div>
          ${combo.buffs.map(b => `<div class="modal-buff-item">▲ ${escapeHtml(b)}</div>`).join('')}
        </div>
      ` : ''}

      ${combo.penalties && combo.penalties.length > 0 ? `
        <div class="modal-penalties-box">
          <div class="modal-section-tag penalty">PENALTY STATS:</div>
          ${combo.penalties.map(p => `<div class="modal-penalty-item">▼ ${escapeHtml(p)}</div>`).join('')}
        </div>
      ` : ''}

      <div class="modal-scaling-note">
        <strong>Artifacts:</strong> Only <em>${escapeHtml(mainName)}</em> artifacts boost this fusion — <em>${escapeHtml(matName)}</em> ${kept ? 'is kept as a passive (not consumed)' : 'is consumed'}.
      </div>

      <div class="modal-actions-grid">
        <button type="button" class="btn-action" id="btn-modal-partner">
          ${ICONS.heptagram} <span>Find Compatible</span>
        </button>
        <button type="button" class="btn-action ${isPinned ? 'primary' : ''}" id="btn-modal-pin">
          ${ICONS.pin} <span>${isPinned ? 'Unpin Fusion' : 'Pin Fusion'}</span>
        </button>
      </div>
    `;

    modal.classList.add('open');

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
      openInspectorModal(combo.id);
    });
  }

  function closeInspectorModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.remove('open');
    state.activeModalCombo = null;
  }

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

  // --- Codex Tab: Cache & Network Status ---
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
        if (cacheCountEl) cacheCountEl.textContent = `0 / ${getExpectedAssetCount()}`;
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

  function updateOnlineIndicator() {
    const dot = document.getElementById('online-dot');
    const text = document.getElementById('online-text');
    if (!dot || !text) return;

    if (navigator.onLine) {
      dot.classList.remove('offline');
      text.textContent = 'Online';
    } else {
      dot.classList.add('offline');
      text.textContent = 'Offline';
    }
  }

  function updateCodexInstallCard() {
    const panel = document.getElementById('install-guide-panel');
    if (!panel) return;

    if (isStandaloneApp()) {
      panel.innerHTML = `
        <div class="installed-badge-card">
          ${ICONS.appBadge}
          <span>Installed · Running in App Mode</span>
        </div>
      `;
    }
  }

  async function refreshOfflineCache() {
    if (!('caches' in window)) {
      showToast('Cache API not supported in this browser.', 'error');
      return;
    }

    showToast('Refreshing cache with latest assets...', 'info');

    try {
      const keys = await caches.keys();
      for (const k of keys) {
        if (k.startsWith(CACHE_PREFIX) || k.startsWith('fusion-codex-')) {
          await caches.delete(k);
        }
      }

      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) await reg.update();
      }

      showToast('Cache refreshed! Reloading...', 'success');
      setTimeout(() => window.location.reload(), 600);
    } catch (e) {
      showToast('Failed to refresh cache: ' + e.message, 'error');
    }
  }

  function downloadDatabaseJson() {
    if (!state.db) return;
    const blob = new Blob([JSON.stringify(state.db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'combinations_v09941.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('combinations_v09941.json downloaded.', 'success');
  }

  // --- Codex Tab: Classes Directory ---
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
      { id: 'storm', label: 'Storm' },
      { id: 'cosmic', label: 'Cosmic' },
      { id: 'void', label: 'Dark' }
    ];

    filterRow.innerHTML = elements.map(el => `
      <button type="button" class="filter-chip ${selectedClassElement === el.id ? 'active' : ''}" data-class-el="${el.id}">
        ${ICONS[el.id] || ICONS.all}
        <span>${el.label}</span>
      </button>
    `).join('');

    filterRow.querySelectorAll('.filter-chip').forEach(btn => {
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

    listGrid.innerHTML = filtered.map(c => `
      <div class="class-card">
        <div class="class-card-top">
          <span class="class-name">${escapeHtml(c.name)}</span>
          <div class="class-card-actions">
            <span class="rec-badge">${escapeHtml(c.archetype.toUpperCase())}</span>
            ${c.primary_magic_id ? `
              <button type="button" class="btn-view-fusions" data-magic="${escapeHtml(c.primary_magic_id)}">
                View Fusions
              </button>
            ` : ''}
          </div>
        </div>
        <div class="class-desc">${escapeHtml(c.recommended_when)}</div>
        <div class="class-bonuses">
          ${c.base_bonuses && c.base_bonuses.length > 0 ? `
            <div class="class-bonus-section">
              <span class="class-bonus-label">Base Bonuses</span>
              ${c.base_bonuses.map(b => `<div class="class-bonus-line">• ${escapeHtml(b)}</div>`).join('')}
            </div>
          ` : ''}
          ${c.mastery_bonuses && c.mastery_bonuses.length > 0 ? `
            <div class="class-bonus-section">
              <span class="class-bonus-label">Mastery Bonuses</span>
              ${c.mastery_bonuses.map(b => `<div class="class-bonus-line">• ${escapeHtml(b)}</div>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');

    listGrid.querySelectorAll('.btn-view-fusions').forEach(btn => {
      btn.addEventListener('click', () => {
        const mid = btn.dataset.magic;
        resetAllFilters(true);
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
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
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

    // Heptagram Swap Button
    document.getElementById('btn-swap-slots')?.addEventListener('click', () => {
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

    // Reset Buttons
    document.getElementById('btn-reset-combinator')?.addEventListener('click', resetAllFilters);
    document.getElementById('btn-clear-active-filters')?.addEventListener('click', resetAllFilters);

    // Filters Drawer Toggle
    const toggleBtn = document.getElementById('btn-filters-toggle');
    const drawer = document.getElementById('filters-drawer');
    const chevron = document.getElementById('filters-chevron');

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        state.filtersDrawerOpen = !state.filtersDrawerOpen;
        drawer.classList.toggle('hidden', !state.filtersDrawerOpen);
        toggleBtn.setAttribute('aria-expanded', String(state.filtersDrawerOpen));
        if (chevron) {
          chevron.classList.toggle('open', state.filtersDrawerOpen);
        }
      });
    }

    // Search Input (Deep Search)
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      renderCombinations();
    });

    // Category Segmented Control
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.filters.category = pill.dataset.cat;
        renderCombinations();
      });
    });

    // Conflict Toggle
    document.getElementById('toggle-conflicts')?.addEventListener('change', (e) => {
      state.filters.hideConflicts = e.target.checked;
      renderFiltersDrawer();
      renderCombinations();
    });

    // Build Planner Actions
    document.getElementById('btn-copy-reddit')?.addEventListener('click', exportRedditMarkdown);
    document.getElementById('btn-share-url')?.addEventListener('click', copyShareUrl);
    document.getElementById('btn-reset-checklist')?.addEventListener('click', resetChecklist);

    // Codex Tab Actions
    document.getElementById('btn-refresh-cache')?.addEventListener('click', refreshOfflineCache);
    document.getElementById('btn-download-json')?.addEventListener('click', downloadDatabaseJson);

    // Modals Close
    document.getElementById('modal-close-btn')?.addEventListener('click', closeInspectorModal);
    document.getElementById('detail-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'detail-modal') closeInspectorModal();
    });

    document.getElementById('lightbox-close-btn')?.addEventListener('click', closeLightbox);
    document.getElementById('lightbox-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'lightbox-modal') closeLightbox();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
        closeInspectorModal();
      }
    });

    // Online / Offline Listeners
    window.addEventListener('online', updateOnlineIndicator);
    window.addEventListener('offline', updateOnlineIndicator);

    // PWA Install Handling
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredInstallPrompt = e;
      const banner = document.getElementById('install-banner');
      if (banner && shouldShowInstallBanner()) {
        banner.classList.remove('hidden');
      }
    });

    window.addEventListener('appinstalled', () => {
      try {
        localStorage.setItem(STORAGE_KEYS.INSTALLED, '1');
      } catch (err) {}
      const banner = document.getElementById('install-banner');
      if (banner) banner.classList.add('hidden');
      updateCodexInstallCard();
      showToast('Fusion Codex successfully installed!', 'success');
    });

    document.getElementById('btn-install-banner')?.addEventListener('click', async () => {
      if (state.deferredInstallPrompt) {
        state.deferredInstallPrompt.prompt();
        const choice = await state.deferredInstallPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          try {
            localStorage.setItem(STORAGE_KEYS.INSTALLED, '1');
          } catch (err) {}
          showToast('Thank you for installing Fusion Codex!', 'success');
        }
        state.deferredInstallPrompt = null;
        const banner = document.getElementById('install-banner');
        if (banner) banner.classList.add('hidden');
        updateCodexInstallCard();
      } else {
        showToast('To install, open browser menu and select "Add to Home screen"', 'info');
      }
    });

    document.getElementById('btn-dismiss-install')?.addEventListener('click', () => {
      const banner = document.getElementById('install-banner');
      if (banner) banner.classList.add('hidden');
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

      // Fast Lookup Maps
      for (const c of state.db.combinations) {
        state.comboMap.set(c.id, c);
      }
      for (const m of state.db.base_magics) {
        state.magicMap.set(m.id, m);
      }
      for (const el of state.taxonomy.elements) {
        state.elementMap.set(el.id, el);
      }

      const aboutCountEl = document.getElementById('about-combo-count');
      if (aboutCountEl) aboutCountEl.textContent = String(state.db.combinations.length);

      loadPersistedState();
      setupEventListeners();

      // Populate UI
      populateMagicDropdowns();
      renderFiltersDrawer();
      renderCombinations();
      updateDock();
      renderPlanner();
      renderClassesDirectory();
      checkCacheStatus();
      updateOnlineIndicator();
      updateCodexInstallCard();

      console.log('Magic Survival Fusion Codex v0.9941 initialized.');
    } catch (err) {
      console.error('Initialization error:', err);
      showToast('Error loading database files. Please refresh.', 'error');
    }
  }

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(reg => {
          console.log('Service Worker registered with scope:', reg.scope);
          checkCacheStatus();
        })
        .catch(err => {
          console.warn('Service Worker registration skipped:', err);
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
