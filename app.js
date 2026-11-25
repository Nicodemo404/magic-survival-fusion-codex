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
    INSTALLED: 'ms_codex_v1_installed',
    DOMAIN_OF_POWER: 'ms_codex_v1_domain_of_power'
  };

  const CACHE_PREFIX = 'ms-codex-';
  const CURRENT_CACHE_NAME = 'ms-codex-v09941-v12';
  // Must match the APP_SHELL list length in sw.js (each combination adds 1 thumb + 1 card on top).
  const APP_SHELL_ASSET_COUNT = 13;

  // --- Build Planner Slot Rules ---
  const BASE_SLOT_LEVELS = [25, 50, 75];
  const GOC_ID = 'gate_of_creation'; // "Gain 2 more Magic Combination chance."
  const GOC_BONUS_SLOTS = 2;
  const DOP_ARTIFACT_ID = 'domain_of_power'; // Special artifact: "Gain 1 more Magic Combination chance."
  const DOP_BONUS_SLOTS = 1;
  const OVERMIND_ID = 'overmind';
  const SHIELD_ID = 'shield';
  const CATEGORY_LABELS = { aoe: 'AoE', nuke: 'Nuke', support: 'Support' };
  const RARITY_ORDER = ['Normal', 'Rare', 'Epic', 'Special', 'Legendary'];

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
    // Matches multipliers/numbers (+50%, 1%, 12X, 0.15s, 24 times, 1-9X, 3~7 times, 7×)
    // and core game terms (Damage Multiplier, Cooldown, Duration, Size, Attack Count, etc.)
    // '%' and '×' are non-word chars, so they must not be followed by \b (that dropped the sign, e.g. "1%" -> "1").
    const pattern = /(\b\d+(?:\.\d+)?(?:[-~]\d+(?:\.\d+)?)?(?:[%×]|(?:s|X|x)?(?:\s*times)?\b)|\b[+-]?\d+(?:\.\d+)?%?\b|\b(?:Damage Multiplier|Attack Count|Rotation Speed|Critical Rate|Critical Strike|Knocked Back|Damage|Cooldown|Duration|Size|Freeze|Freezes|Stun|Stuns|Staggered|Revival|Pierce|Projectiles|Satellite|Spread)\b)/gi;

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
    artifactsData: null,
    comboMap: new Map(),
    magicMap: new Map(),
    elementMap: new Map(),
    artifactMap: new Map(),
    synergyMap: new Map(),
    classMap: new Map(),
    subjectMap: new Map(),

    activeTab: 'combinator',
    filtersDrawerOpen: false,

    pinned: [], // combo IDs: 3 base slots, +2 with Gate of Creation, +1 with Domain of Power (max 6)
    domainOfPower: false, // Domain of Power artifact owned in the planned run
    pinnedStripInView: true, // the Combinator's "Your Build" strip is on screen (dock stays hidden)
    checklist: {}, // { "magicId:attribute": true }
    artifactIndex: { query: '', rarity: 'all' },

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
  // Bonus slots after Lv.25/50/75, in order: 2 from Gate of Creation, then 1 from Domain of Power.
  function getBonusSlotKinds(pinned = state.pinned, dop = state.domainOfPower) {
    const kinds = [];
    if (pinned.includes(GOC_ID)) {
      for (let i = 0; i < GOC_BONUS_SLOTS; i++) kinds.push('goc');
    }
    if (dop) {
      for (let i = 0; i < DOP_BONUS_SLOTS; i++) kinds.push('dop');
    }
    return kinds;
  }

  function getMaxSlots(pinned = state.pinned, dop = state.domainOfPower) {
    return BASE_SLOT_LEVELS.length + getBonusSlotKinds(pinned, dop).length;
  }

  function isBonusSlot(index) {
    return index >= BASE_SLOT_LEVELS.length;
  }

  function getSlotLabel(index) {
    if (!isBonusSlot(index)) return `Lv.${BASE_SLOT_LEVELS[index]}`;
    return getBonusSlotKinds()[index - BASE_SLOT_LEVELS.length] === 'dop' ? 'DoP Bonus' : 'GoC Bonus';
  }

  // Short labels for the narrow dock: GoC 1, GoC 2, DoP.
  function getShortSlotLabel(index) {
    if (!isBonusSlot(index)) return getSlotLabel(index);
    const kinds = getBonusSlotKinds();
    const pos = index - BASE_SLOT_LEVELS.length;
    if (kinds[pos] === 'dop') return 'DoP';
    return `GoC ${kinds.slice(0, pos + 1).filter(k => k === 'goc').length}`;
  }

  function getArtifactName(id) {
    return state.artifactMap.get(id)?.name || id;
  }

  // Artifacts whose in-game text names this magic (its Mastery synergy set first).
  function getMagicArtifacts(magicId) {
    const ids = state.artifactsData?.magic_artifacts?.[magicId] || [];
    return ids.map(id => state.artifactMap.get(id)).filter(Boolean);
  }

  function getMasterySynergy(magicId) {
    if (!state.artifactsData) return null;
    return state.artifactsData.synergies.find(s => s.mastery_magic_id === magicId) || null;
  }

  function getRarityClass(rarity) {
    return `rarity-${String(rarity || '').toLowerCase()}`;
  }

  function getMagicName(magicId) {
    return state.magicMap.get(magicId)?.name || magicId;
  }

  function getCategoryLabel(category) {
    return CATEGORY_LABELS[category] || category;
  }

  // Perpetual Engine keeps its second magic (Intelligence) as a passive instead of consuming it.
  function isMaterialKept(combo) {
    return combo.material_consumed === false;
  }

  // Passive Main Magics (e.g. Intelligence) have no spell-specific artifacts: these fusions buff the whole build.
  function isPassiveMain(combo) {
    return state.magicMap.get(combo.main.magic_id)?.type === 'passive';
  }

  function getExpectedAssetCount() {
    const comboCount = state.db ? state.db.combinations.length : 0;
    return APP_SHELL_ASSET_COUNT + comboCount * 2;
  }

  // Dedupe, drop unknown ids, keep Gate of Creation inside a base slot, and cap to the slots it allows.
  function normalizePinned(ids, dop = state.domainOfPower) {
    const unique = [...new Set(ids)].filter(id => state.comboMap.has(id));
    const gocIdx = unique.indexOf(GOC_ID);
    if (gocIdx >= BASE_SLOT_LEVELS.length) {
      unique.splice(gocIdx, 1);
      unique.splice(BASE_SLOT_LEVELS.length - 1, 0, GOC_ID);
    }
    return unique.slice(0, getMaxSlots(unique, dop));
  }

  // --- Pinned State & Persistence ---
  function loadPersistedState() {
    try {
      state.domainOfPower = localStorage.getItem(STORAGE_KEYS.DOMAIN_OF_POWER) === '1';
    } catch (e) {
      state.domainOfPower = false;
    }

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

    // URL Hash override: #build=id1,id2,id3[,...][&dop=1] takes precedence on load
    const hash = window.location.hash;
    if (hash && hash.startsWith('#build=')) {
      const [idsPart, ...params] = hash.replace('#build=', '').split('&');
      const dop = params.includes('dop=1');
      const ids = idsPart.split(',').map(s => s.trim());
      const validIds = normalizePinned(ids, dop);
      if (validIds.length > 0) {
        state.domainOfPower = dop;
        state.pinned = validIds;
        savePinnedState();
      }
    }
  }

  function savePinnedState() {
    try {
      localStorage.setItem(STORAGE_KEYS.PINNED, JSON.stringify(state.pinned));
      localStorage.setItem(STORAGE_KEYS.DOMAIN_OF_POWER, state.domainOfPower ? '1' : '0');
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
    syncHash();
    updateDock();
  }

  // Domain of Power (Special artifact) opens 1 extra combination slot for the run.
  function setDomainOfPower(enabled) {
    state.domainOfPower = Boolean(enabled);
    const maxSlots = getMaxSlots();
    const dropped = state.pinned.length > maxSlots ? state.pinned.splice(maxSlots) : [];
    if (dropped.length > 0) {
      const names = dropped.map(id => state.comboMap.get(id)?.name || id).join(', ');
      showToast(`Domain of Power slot closed. Also removed: ${names}.`, 'warning');
    } else {
      showToast(state.domainOfPower
        ? 'Domain of Power: 1 extra combination slot unlocked.'
        : 'Domain of Power slot removed.', 'info');
    }
    savePinnedState();
    renderCombinations();
    renderPlanner();
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
      const hashVal = '#build=' + state.pinned.join(',') + (state.domainOfPower ? '&dop=1' : '');
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
      // Unpinning Gate of Creation closes its 2 bonus slots: trim back to the remaining slot count.
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
        const extras = [];
        if (state.pinned.includes(GOC_ID)) extras.push(`${GOC_BONUS_SLOTS} GoC Bonus`);
        if (state.domainOfPower) extras.push(`${DOP_BONUS_SLOTS} DoP Bonus`);
        const msg = extras.length > 0
          ? `All ${maxSlots} combination slots are full (Lv.25, Lv.50, Lv.75 + ${extras.join(' + ')}). Remove one first.`
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

  // --- Class & Test Subject Matching (verified v0.9941 data, no subjective ranking) ---
  // For each pinned Main Magic: its specialist class (+3% damage every 5 levels) or, failing that,
  // a class that levels that magic up (Bishop: Shield, Arcanist: Intelligence, Archmage: Magic Circle).
  function getClassSubjectMatches() {
    if (!state.classesData || state.pinned.length === 0) return null;
    const classes = state.classesData.classes || [];

    const mainIds = [];
    for (const cid of state.pinned) {
      const c = state.comboMap.get(cid);
      if (c && !mainIds.includes(c.main.magic_id)) mainIds.push(c.main.magic_id);
    }

    const byMagic = mainIds.map(mid => {
      const specialist = classes.find(cl => cl.magic_id === mid) || null;
      const related = specialist ? null : (classes.find(cl => (cl.related_magic_ids || []).includes(mid)) || null);
      const cls = specialist || related;
      const subject = cls && cls.subject_id ? state.subjectMap.get(cls.subject_id) || null : null;
      return { magicId: mid, magicName: getMagicName(mid), cls, isSpecialist: Boolean(specialist), subject };
    });

    return { byMagic, archmage: state.classMap.get('archmage') || null };
  }

  function getSubjectSummary(subject) {
    if (!subject) return '';
    const start = subject.starting_artifact_id ? `Starts with ${getArtifactName(subject.starting_artifact_id)}` : 'Default subject (no starting artifact)';
    return `${start} · ${subject.bonus}`;
  }

  // Factual notes shown on a combination: unlock map (community FAQ) and Bishop's Shield rule (in-game class text).
  function getComboNotes(combo) {
    const notes = [];
    if (combo.unlock && combo.unlock.map) {
      notes.push(`<strong>Unlock:</strong> clear the ${escapeHtml(combo.unlock.map)} map <span class="note-source">(${escapeHtml(combo.unlock.source || 'community')})</span>.`);
    }
    if (combo.main.magic_id === SHIELD_ID || combo.material.magic_id === SHIELD_ID) {
      notes.push('<strong>Bishop class:</strong> Shield remains active even when used in Combination Magic.');
    }
    return notes;
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

    // 2. Floating Dock: a compact reminder of the build while browsing the Combinator list,
    //    shown only once the "Your Build" strip has scrolled out of view.
    if (!dockEl || !slotsContainer) return;

    const showDock = pinnedCount > 0 && state.activeTab === 'combinator' && !state.pinnedStripInView;
    dockEl.classList.toggle('hidden', !showDock);
    if (pinnedCount === 0) {
      slotsContainer.innerHTML = '';
      return;
    }
    if (badge) badge.textContent = `${pinnedCount}/${maxSlots}`;

    const conflicts = getConflictsInPinned();
    const hasConflict = conflicts.length > 0;

    // 4+ slots are too narrow for names on 360px screens: show slot labels only (name stays in the title).
    const compact = maxSlots > BASE_SLOT_LEVELS.length;
    slotsContainer.innerHTML = Array.from({ length: maxSlots }, (_, i) => {
      const cid = state.pinned[i];
      const shortLabel = getShortSlotLabel(i);
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
    updateDock();

    if (tabId === 'planner') {
      renderPlanner();
    } else if (tabId === 'codex') {
      checkCacheStatus();
      updateCodexInstallCard();
    }
  }

  // Shows the dock only after the "Your Build" strip scrolls away (no duplicate build display on screen).
  function observePinnedStrip() {
    const strip = document.getElementById('pinned-strip');
    if (!strip || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      const inView = entry.isIntersecting;
      if (inView !== state.pinnedStripInView) {
        state.pinnedStripInView = inView;
        updateDock();
      }
    });
    observer.observe(strip);
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

    renderPinnedStrip();

    // Pinned fusions live in the "Your Build" strip above the list, so the list shows the rest.
    const filtered = getFilteredCombinations().filter(c => !state.pinned.includes(c.id));
    if (countEl) {
      countEl.textContent = `${filtered.length} Combinations${state.pinned.length > 0 ? ` · ${state.pinned.length} pinned above` : ''}`;
    }

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
      const mainName = getMagicName(combo.main.magic_id);
      const matName = getMagicName(combo.material.magic_id);

      const catClass = combo.category.toLowerCase();
      const catLabel = getCategoryLabel(combo.category);
      const kept = isMaterialKept(combo);

      return `
        <div class="combo-card cat-${escapeHtml(catClass)} ${isPinned ? 'is-pinned' : ''} ${isConflict ? 'has-conflict' : ''}" data-id="${escapeHtml(combo.id)}">
          <div class="card-thumb-wrapper">
            <img class="card-thumb" src="./assets/thumbs/${escapeHtml(combo.id)}.webp" alt="" loading="lazy" draggable="false" />
          </div>
          <div class="card-content">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(combo.name)}</span>
              <button type="button" class="btn-pin ${isPinned ? 'pinned' : ''}" data-pin-id="${escapeHtml(combo.id)}" aria-label="${isPinned ? 'Unpin' : 'Pin'} ${escapeHtml(combo.name)}" title="${isPinned ? 'Unpin from build' : 'Pin to build'}">
                ${ICONS.pin}
              </button>
            </div>
            <div class="card-meta">
              <span class="cat-tag ${catClass}">${catLabel}</span>
              ${isConflict ? '<span class="conflict-tag">Shares a magic with your build</span>' : ''}
            </div>
            <div class="card-recipe">
              <div class="recipe-line main" title="${isPassiveMain(combo) ? 'Main Magic (Passive · build-wide, no spell-specific artifacts)' : 'Main Magic (Scales with artifacts)'}">
                <span class="recipe-dot">●</span>
                <span class="recipe-magic">${escapeHtml(mainName)}</span>
                <span class="recipe-attr">${escapeHtml(combo.main.attribute)}</span>
              </div>
              <div class="recipe-line ${kept ? 'main kept' : 'material'}" title="${kept ? 'Passive Magic (Kept, not consumed)' : 'Material Magic (Consumed)'}">
                <span class="recipe-plus">+</span>
                <span class="recipe-magic">${escapeHtml(matName)}</span>
                <span class="recipe-attr">${escapeHtml(combo.material.attribute)}</span>
              </div>
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

  // --- "Your Build" strip: pinned fusions stay on top of the Combinator so they are easy to remove ---
  function renderPinnedStrip() {
    const strip = document.getElementById('pinned-strip');
    if (!strip) return;
    const pinned = state.pinned.map(id => state.comboMap.get(id)).filter(Boolean);
    strip.classList.toggle('hidden', pinned.length === 0);
    if (pinned.length === 0) {
      strip.innerHTML = '';
      return;
    }
    const conflictMagics = new Set(getConflictsInPinned().map(c => c.magicId));

    strip.innerHTML = `
      <div class="pinned-strip-head">
        <span class="pinned-strip-title">${ICONS.pin}<span>Your Build</span></span>
        <span class="pinned-strip-count">${pinned.length}/${getMaxSlots()}</span>
        <button type="button" class="pinned-open-planner" id="btn-open-planner">Planner</button>
      </div>
      <div class="pinned-list">
        ${pinned.map((c, i) => {
          const conflict = conflictMagics.has(c.main.magic_id) || conflictMagics.has(c.material.magic_id);
          return `
            <div class="pinned-row ${conflict ? 'has-conflict' : ''}" data-id="${escapeHtml(c.id)}">
              <span class="pinned-slot ${isBonusSlot(i) ? 'bonus' : ''}">${escapeHtml(getShortSlotLabel(i))}</span>
              <img class="pinned-thumb" src="./assets/thumbs/${escapeHtml(c.id)}.webp" alt="" draggable="false" />
              <div class="pinned-info">
                <span class="pinned-name">${escapeHtml(c.name)}</span>
                <span class="pinned-recipe"><span class="recipe-text-main">${escapeHtml(getMagicName(c.main.magic_id))}</span> + <span class="${isMaterialKept(c) ? 'recipe-text-main' : 'recipe-text-mat'}">${escapeHtml(getMagicName(c.material.magic_id))}</span></span>
              </div>
              <button type="button" class="btn-unpin" data-unpin-id="${escapeHtml(c.id)}" aria-label="Remove ${escapeHtml(c.name)}" title="Remove from build">${ICONS.close}</button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    strip.querySelectorAll('.pinned-row').forEach(row => {
      row.addEventListener('click', (e) => {
        const unpin = e.target.closest('.btn-unpin');
        if (unpin) {
          e.stopPropagation();
          togglePin(unpin.dataset.unpinId);
          return;
        }
        openInspectorModal(row.dataset.id);
      });
    });
    document.getElementById('btn-open-planner')?.addEventListener('click', () => switchTab('planner'));
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

  // --- Artifact Rendering Helpers (verified Encyclopedia text) ---
  function renderArtifactEffectsList(artifacts) {
    return `<ul class="artifact-effect-list">${artifacts.map(a => `
      <li class="artifact-effect-item">
        <div class="artifact-effect-head">
          <span class="artifact-effect-name ${getRarityClass(a.rarity)}">${escapeHtml(a.name)}</span>
          <span class="artifact-effect-rarity">${escapeHtml(a.rarity)}</span>
        </div>
        ${(a.effects || []).map(e => `<div class="artifact-effect-text">${escapeHtml(e)}</div>`).join('')}
        ${(a.penalties || []).map(p => `<div class="artifact-effect-text penalty">${escapeHtml(p)}</div>`).join('')}
      </li>`).join('')}</ul>`;
  }

  function renderArtifactGroupHtml(magicId) {
    const name = getMagicName(magicId);
    const arts = getMagicArtifacts(magicId);
    if (arts.length === 0) {
      return `<div class="artifact-magic-group"><div class="artifact-magic-head">${ICONS.heptagram}<span>${escapeHtml(name)}</span></div><div class="artifact-empty-note">No artifact text mentions ${escapeHtml(name)}.</div></div>`;
    }
    const mastery = getMasterySynergy(magicId);
    const masterySet = new Set(mastery ? mastery.requires : []);
    const masteryHtml = mastery
      ? `<div class="artifact-mastery-line"><strong>${escapeHtml(mastery.name)}</strong> synergy (${mastery.requires.map(id => escapeHtml(getArtifactName(id))).join(' + ')}): ${mastery.effects.map(escapeHtml).join('; ')}</div>`
      : '';
    const chips = arts.map(a => `<span class="artifact-chip ${getRarityClass(a.rarity)}${masterySet.has(a.id) ? ' mastery' : ''}">${escapeHtml(a.name)}</span>`).join('');
    return `
      <div class="artifact-magic-group">
        <div class="artifact-magic-head">${ICONS.heptagram}<span>${escapeHtml(name)}</span><span class="artifact-count">${arts.length} artifacts</span></div>
        <div class="artifact-chip-row">${chips}</div>
        ${masteryHtml}
        <details class="artifact-effects"><summary>Show effects</summary>${renderArtifactEffectsList(arts)}</details>
      </div>
    `;
  }

  // Artifacts & synergies whose text boosts every Combination Magic (Domain of Power, Dragontongue, Dominus).
  function renderComboBoostersHtml() {
    const boosters = state.artifactsData?.combination_boosters;
    if (!boosters) return '';
    const arts = boosters.artifacts.map(id => state.artifactMap.get(id)).filter(Boolean);
    const syns = boosters.synergies.map(id => state.synergyMap.get(id)).filter(Boolean);
    if (arts.length === 0 && syns.length === 0) return '';
    const synHtml = syns.map(s => `<div class="artifact-mastery-line"><strong>${escapeHtml(s.name)}</strong> synergy (${s.requires.map(id => escapeHtml(getArtifactName(id))).join(' + ')}): ${s.effects.map(escapeHtml).join('; ')}</div>`).join('');
    return `
      <div class="artifact-magic-group boosters">
        <div class="artifact-magic-head">${ICONS.heptagram}<span>Every Combination</span></div>
        <div class="artifact-chip-row">${arts.map(a => `<span class="artifact-chip ${getRarityClass(a.rarity)}">${escapeHtml(a.name)}</span>`).join('')}</div>
        ${synHtml}
        <details class="artifact-effects"><summary>Show effects</summary>${renderArtifactEffectsList(arts)}</details>
      </div>
    `;
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

    // 0. Planner title reflects the slot count (3 base, +2 Gate of Creation, +1 Domain of Power)
    const titleEl = document.getElementById('planner-title-text');
    if (titleEl) titleEl.textContent = `${maxSlots}-Slot Build Planner`;
    const dopToggle = document.getElementById('toggle-domain-of-power');
    if (dopToggle) dopToggle.checked = state.domainOfPower;

    // 1. Render Slots (3 base slots, +2 GoC Bonus while Gate of Creation is pinned, +1 DoP Bonus)
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
            <img class="planner-slot-thumb" src="./assets/thumbs/${escapeHtml(c.id)}.webp" alt="" draggable="false" />
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

    // 2b. Factual combo notes (Overmind restriction, Bishop keeps Shield)
    const notesEl = document.getElementById('planner-notes-container');
    if (notesEl) {
      const notes = [];
      if (state.pinned.includes(OVERMIND_ID)) {
        notes.push('<strong>Overmind active</strong> — only Combined Spells can be cast; extra Active Magic levels boost ATK, Size &amp; CDR.');
      }
      const shieldCombos = state.pinned
        .map(id => state.comboMap.get(id))
        .filter(c => c && (c.main.magic_id === SHIELD_ID || c.material.magic_id === SHIELD_ID));
      if (shieldCombos.length > 0) {
        notes.push(`<strong>Bishop class</strong> — Shield remains active even when used in Combination Magic (${shieldCombos.map(c => escapeHtml(c.name)).join(', ')}).`);
      }
      notesEl.classList.toggle('hidden', notes.length === 0);
      notesEl.innerHTML = notes.map(n => `<div class="planner-note">${ICONS.heptagram}<span>${n}</span></div>`).join('');
    }

    // 3. Artifact Priority: real artifact names per Main Magic + boosters for every combination
    if (artPriorityList) {
      if (state.pinned.length === 0) {
        artPriorityList.innerHTML = '<span class="placeholder-dim-text">Pin fusions above to identify your Main Magic artifacts.</span>';
      } else {
        const uniqueMainMagics = new Set();
        const buildWideCombos = [];
        for (const cid of state.pinned) {
          const c = state.comboMap.get(cid);
          if (!c) continue;
          if (isPassiveMain(c)) buildWideCombos.push(c.name);
          else uniqueMainMagics.add(c.main.magic_id);
        }

        const groupsHtml = Array.from(uniqueMainMagics).map(renderArtifactGroupHtml).join('');
        const buildWideHtml = buildWideCombos.length > 0
          ? `<div class="artifact-buildwide-note"><strong>${buildWideCombos.map(escapeHtml).join(' &amp; ')}:</strong> build-wide support with a passive Main Magic — no spell-specific artifacts to scale with.</div>`
          : '';
        artPriorityList.innerHTML = groupsHtml + buildWideHtml + renderComboBoostersHtml();
      }
    }

    // 4. Class & Test Subject tied to each pinned Main Magic (verified in-game bonuses)
    if (recContainer) {
      const matches = getClassSubjectMatches();
      if (!matches) {
        recContainer.innerHTML = '<span class="placeholder-dim-text">Pin at least one fusion to see the class and test subject tied to each Main Magic.</span>';
      } else {
        const magicHtml = matches.byMagic.map((m, i) => {
          const head = `<div class="rec-magic-line">Main Magic: <strong>${escapeHtml(m.magicName)}</strong></div>`;
          if (!m.cls) {
            return `<div class="rec-item ${i > 0 ? 'rec-item-bordered' : ''}">${head}<div class="rec-hint">No class or test subject is tied to ${escapeHtml(m.magicName)}.</div></div>`;
          }
          const clsBonuses = m.isSpecialist ? m.cls.base_bonuses : (m.cls.base_bonuses || []).concat(m.cls.mastery_bonuses || []).filter(b => b.includes(m.magicName));
          return `
            <div class="rec-item ${i > 0 ? 'rec-item-bordered' : ''}">
              ${head}
              <div class="rec-title-line">
                <span class="rec-name">${escapeHtml(m.cls.name)}</span>
                <span class="rec-badge">${m.isSpecialist ? 'CLASS' : 'RELATED CLASS'}</span>
              </div>
              <div class="rec-reason">${clsBonuses.map(escapeHtml).join(' · ')}</div>
              ${m.subject ? `
                <div class="rec-title-line rec-subject-line">
                  <span class="rec-name">${escapeHtml(m.subject.name)}</span>
                  <span class="rec-badge">TEST SUBJECT</span>
                </div>
                <div class="rec-reason">${escapeHtml(getSubjectSummary(m.subject))}</div>
              ` : ''}
            </div>
          `;
        }).join('');

        const archmageHtml = matches.archmage ? `
          <div class="rec-item rec-item-bordered">
            <div class="rec-title-line">
              <span class="rec-name">${escapeHtml(matches.archmage.name)}</span>
              <span class="rec-badge">COMBINATION CLASS</span>
            </div>
            <div class="rec-reason">${matches.archmage.base_bonuses.concat(matches.archmage.mastery_bonuses).filter(b => b.includes('Combination')).map(escapeHtml).join(' · ')}</div>
          </div>
        ` : '';

        const ultimateNote = state.classesData.meta?.ultimate_requirement
          ? `<div class="rec-hint rec-footnote">${escapeHtml(state.classesData.meta.ultimate_requirement)}</div>`
          : '';

        recContainer.innerHTML = `<div class="recommendation-box">${magicHtml}${archmageHtml}${ultimateNote}</div>`;
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

    const matches = getClassSubjectMatches();

    const uniqueMainMagics = new Set();
    for (const cid of state.pinned) {
      const c = state.comboMap.get(cid);
      if (c && !isPassiveMain(c)) uniqueMainMagics.add(c.main.magic_id);
    }
    const artifactLines = Array.from(uniqueMainMagics).map(mid => {
      const names = getMagicArtifacts(mid).map(a => a.name);
      return `- **${getMagicName(mid)}:** ${names.length > 0 ? names.join(', ') : 'no magic-specific artifacts'}`;
    });

    const rows = state.pinned.map((id, i) => {
      const c = state.comboMap.get(id);
      const mainM = state.magicMap.get(c.main.magic_id)?.name || c.main.magic_id;
      const matM = state.magicMap.get(c.material.magic_id)?.name || c.material.magic_id;
      const mainNote = isPassiveMain(c) ? ' *(Passive · Build-wide, no spell artifacts)*' : '';
      const keptNote = isMaterialKept(c) ? ' *(Passive · Kept)*' : '';
      return `| ${getSlotLabel(i)} | **${c.name}** | ${mainM} — ${c.main.attribute} (Lv.${c.main.level})${mainNote} | ${matM} — ${c.material.attribute} (Lv.${c.material.level})${keptNote} |`;
    }).join('\n');

    let md = `### Magic Survival (v0.9941) Build\n\n`;
    if (state.domainOfPower) {
      md += `**Domain of Power:** owned (+1 combination slot)\n`;
    }
    if (matches) {
      const classLines = matches.byMagic
        .filter(m => m.cls)
        .map(m => `${m.magicName} → ${m.cls.name}${m.subject ? ` (Test Subject: ${m.subject.name})` : ''}`);
      if (classLines.length > 0) {
        md += `**Class / Test Subject per Main Magic:** ${classLines.join('; ')}\n`;
      }
    }
    md += `**Artifacts (Main Magics only scale combinations):**\n${artifactLines.length > 0 ? artifactLines.join('\n') : '- None'}\n\n`;
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
    const passiveMain = isPassiveMain(combo);
    const matFate = kept ? 'is kept as a passive (not consumed)' : 'is consumed';
    const mainArtifacts = passiveMain ? [] : getMagicArtifacts(combo.main.magic_id);
    const mainArtifactsText = mainArtifacts.length > 0
      ? `: ${mainArtifacts.map(a => escapeHtml(a.name)).join(', ')}`
      : '';
    const artifactNoteHtml = passiveMain
      ? `<strong>Artifacts:</strong> Build-wide support fusion — <em>${escapeHtml(mainName)}</em> is a passive with no spell-specific artifacts, so this fusion doesn't scale with single-magic artifacts. <em>${escapeHtml(matName)}</em> ${matFate}.`
      : `<strong>Artifacts:</strong> Only <em>${escapeHtml(mainName)}</em> artifacts boost this fusion${mainArtifactsText}. <em>${escapeHtml(matName)}</em> ${matFate}.`;
    const comboNotes = getComboNotes(combo);
    const comboNotesHtml = comboNotes.length > 0
      ? `<div class="modal-notes-box">${comboNotes.map(n => `<div class="modal-note-item">${n}</div>`).join('')}</div>`
      : '';

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
      <div class="modal-hero cat-${escapeHtml(combo.category.toLowerCase())}">
        <img class="modal-hero-img" src="./assets/thumbs/${escapeHtml(combo.id)}.webp" alt="" draggable="false" />
        <div class="modal-hero-info">
          <div class="modal-badges-row">
            <span class="cat-tag ${combo.category.toLowerCase()}">${escapeHtml(getCategoryLabel(combo.category))}</span>
            ${isPinned ? `<span class="modal-pinned-tag">${ICONS.pin}<span>${escapeHtml(getSlotLabel(state.pinned.indexOf(combo.id)))}</span></span>` : ''}
          </div>
          <div class="modal-title">${escapeHtml(combo.name)}</div>
          ${tagsPillsHtml ? `<div class="modal-tags-row">${tagsPillsHtml}</div>` : ''}
        </div>
      </div>

      <button type="button" class="btn-view-card" id="btn-open-lightbox">
        ${ICONS.zoom} <span>View In-Game Card</span>
      </button>

      <div class="modal-recipe-box">
        <div class="modal-recipe-block main">
          <div class="modal-recipe-tag">${passiveMain ? 'MAIN · PASSIVE (BUILD-WIDE)' : 'MAIN · ARTIFACT SCALED'}</div>
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
        ${artifactNoteHtml}
      </div>

      ${comboNotesHtml}

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
      const expected = getExpectedAssetCount();

      // On first visit the cache exists but stays empty until the Service Worker finishes precaching.
      if (items.length < expected) {
        cacheStatusEl.textContent = 'Caching for Offline...';
        if (cacheCountEl) cacheCountEl.textContent = `${items.length} / ${expected}`;
        return;
      }

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

  // --- Codex Tab: Classes & Test Subjects Directory (verified v0.9941) ---
  let selectedClassFilter = 'all';

  function renderSubjectLine(subject) {
    if (!subject) return '';
    return `
      <div class="class-bonus-section">
        <span class="class-bonus-label">Test Subject</span>
        <div class="class-bonus-line">• ${escapeHtml(getSubjectSummary(subject))}</div>
      </div>
    `;
  }

  function renderClassesDirectory() {
    const filterRow = document.getElementById('classes-element-filters');
    const listGrid = document.getElementById('classes-list-grid');
    if (!filterRow || !listGrid || !state.classesData) return;

    const classes = state.classesData.classes || [];
    const usedElements = new Set(classes.flatMap(c => c.elements || []));
    const filters = [
      { id: 'all', label: 'All', icon: ICONS.all },
      { id: 'specialist', label: 'Specialist', icon: ICONS.all },
      { id: 'universal', label: 'Universal', icon: ICONS.all },
      ...((state.taxonomy && state.taxonomy.elements) || [])
        .filter(el => usedElements.has(el.id))
        .map(el => ({ id: el.id, label: el.label.split('/')[0].trim(), icon: ICONS[el.icon] || ICONS[el.id] || ICONS.all }))
    ];

    filterRow.innerHTML = filters.map(f => `
      <button type="button" class="filter-chip ${selectedClassFilter === f.id ? 'active' : ''}" data-class-el="${escapeHtml(f.id)}">
        ${f.icon}
        <span>${escapeHtml(f.label)}</span>
      </button>
    `).join('');

    filterRow.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedClassFilter = btn.dataset.classEl;
        renderClassesDirectory();
      });
    });

    const filtered = classes.filter(c => {
      if (selectedClassFilter === 'all') return true;
      if (selectedClassFilter === 'specialist' || selectedClassFilter === 'universal') return c.archetype === selectedClassFilter;
      return (c.elements || []).includes(selectedClassFilter);
    });

    const classCards = filtered.map(c => `
      <div class="class-card">
        <div class="class-card-top">
          <span class="class-name">${escapeHtml(c.name)}</span>
          <div class="class-card-actions">
            <span class="rec-badge">${c.magic_id ? escapeHtml(getMagicName(c.magic_id).toUpperCase()) : 'UNIVERSAL'}</span>
            ${c.magic_id ? `
              <button type="button" class="btn-view-fusions" data-magic="${escapeHtml(c.magic_id)}">
                View Fusions
              </button>
            ` : ''}
          </div>
        </div>
        <div class="class-bonuses">
          <div class="class-bonus-section">
            <span class="class-bonus-label">Base Bonuses</span>
            ${(c.base_bonuses || []).map(b => `<div class="class-bonus-line">• ${escapeHtml(b)}</div>`).join('')}
            ${(c.penalties || []).map(p => `<div class="class-bonus-line penalty">▼ ${escapeHtml(p)}</div>`).join('')}
          </div>
          <div class="class-bonus-section">
            <span class="class-bonus-label">Mastery Bonuses</span>
            ${(c.mastery_bonuses || []).map(b => `<div class="class-bonus-line">• ${escapeHtml(b)}</div>`).join('')}
          </div>
          ${renderSubjectLine(c.subject_id ? state.subjectMap.get(c.subject_id) : null)}
        </div>
      </div>
    `).join('');

    // Test subjects without a class of the same name (Jack o' Lantern)
    const showStandalone = selectedClassFilter === 'all' || selectedClassFilter === 'universal';
    const standaloneCards = showStandalone ? (state.classesData.subjects || []).filter(s => !s.class_id).map(s => `
      <div class="class-card">
        <div class="class-card-top">
          <span class="class-name">${escapeHtml(s.name)}</span>
          <div class="class-card-actions"><span class="rec-badge">TEST SUBJECT ONLY</span></div>
        </div>
        <div class="class-bonuses">${renderSubjectLine(s)}</div>
      </div>
    `).join('') : '';

    listGrid.innerHTML = classCards + standaloneCards;

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

  // --- Codex Tab: Artifact & Synergy Index (verified Encyclopedia text) ---
  function renderArtifactIndex() {
    const filterRow = document.getElementById('artifact-rarity-filters');
    const list = document.getElementById('artifact-index-list');
    const countEl = document.getElementById('artifact-index-count');
    if (!filterRow || !list || !state.artifactsData) return;

    const { rarity } = state.artifactIndex;
    const options = [{ id: 'all', label: 'All' }, ...RARITY_ORDER.map(r => ({ id: r, label: r })), { id: 'synergy', label: 'Synergies' }];
    filterRow.innerHTML = options.map(o => `
      <button type="button" class="filter-chip ${rarity === o.id ? 'active' : ''}" data-rarity="${escapeHtml(o.id)}">
        <span>${escapeHtml(o.label)}</span>
      </button>
    `).join('');
    filterRow.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.artifactIndex.rarity = btn.dataset.rarity;
        renderArtifactIndex();
      });
    });

    const q = state.artifactIndex.query.trim().toLowerCase();
    const matches = parts => !q || parts.join(' ').toLowerCase().includes(q);
    let html = '';
    let count = 0;

    if (rarity !== 'synergy') {
      const arts = state.artifactsData.artifacts.filter(a =>
        (rarity === 'all' || a.rarity === rarity) &&
        matches([a.name, a.rarity, ...(a.effects || []), ...(a.penalties || [])])
      );
      count += arts.length;
      if (arts.length > 0) html += renderArtifactEffectsList(arts);
    }

    if (rarity === 'all' || rarity === 'synergy') {
      const syns = state.artifactsData.synergies.filter(s =>
        matches([s.name, ...(s.effects || []), ...s.requires.map(getArtifactName)])
      );
      count += syns.length;
      if (syns.length > 0) {
        html += `
          <div class="artifact-index-subhead">Synergies</div>
          <ul class="artifact-effect-list">${syns.map(s => `
            <li class="artifact-effect-item">
              <div class="artifact-effect-head">
                <span class="artifact-effect-name synergy">${escapeHtml(s.name)}</span>
                <span class="artifact-effect-rarity">Synergy</span>
              </div>
              ${(s.effects || []).map(e => `<div class="artifact-effect-text">${escapeHtml(e)}</div>`).join('')}
              <div class="artifact-effect-req">Requires: ${s.requires.map(id => escapeHtml(getArtifactName(id))).join(', ')}</div>
            </li>`).join('')}
          </ul>
        `;
      }
    }

    list.innerHTML = html || '<span class="placeholder-dim-text">No matching artifacts or synergies.</span>';
    if (countEl) countEl.textContent = `${count} result${count === 1 ? '' : 's'}`;
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

    // Domain of Power toggle (+1 combination slot)
    document.getElementById('toggle-domain-of-power')?.addEventListener('change', (e) => {
      setDomainOfPower(e.target.checked);
    });

    // Artifact & Synergy Index search
    document.getElementById('artifact-search-input')?.addEventListener('input', (e) => {
      state.artifactIndex.query = e.target.value;
      renderArtifactIndex();
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

    // App-like feel: no long-press copy / save-image menu outside form fields.
    document.addEventListener('contextmenu', (e) => {
      if (!e.target.closest('input, textarea')) e.preventDefault();
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
      const [dbRes, taxRes, classesRes, artifactsRes] = await Promise.all([
        fetch('./data/combinations_v09941.json'),
        fetch('./data/filter_taxonomy_v09941.json'),
        fetch('./data/classes_subjects_v09941.json'),
        fetch('./data/artifacts_v09941.json')
      ]);

      state.db = await dbRes.json();
      state.taxonomy = await taxRes.json();
      state.classesData = await classesRes.json();
      state.artifactsData = await artifactsRes.json();

      for (const a of state.artifactsData.artifacts) state.artifactMap.set(a.id, a);
      for (const s of state.artifactsData.synergies) state.synergyMap.set(s.id, s);
      for (const c of state.classesData.classes) state.classMap.set(c.id, c);
      for (const s of state.classesData.subjects) state.subjectMap.set(s.id, s);

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
      renderArtifactIndex();
      observePinnedStrip();
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
    // Fires when a newly installed worker (first visit, or a new cache version) takes control
    // after precaching, so the Codex counter updates without a manual refresh.
    navigator.serviceWorker.addEventListener('controllerchange', () => checkCacheStatus());

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(reg => {
          console.log('Service Worker registered with scope:', reg.scope);
          checkCacheStatus();
          // `ready` resolves once a Service Worker is active, i.e. after its install step finished precaching.
          navigator.serviceWorker.ready.then(() => checkCacheStatus());
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
