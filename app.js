const STORAGE_KEY = "ramtah_completed_v1";

// Custom confirm modal — replaces native confirm(), which some browsers silently
// block after repeated calls on the same page (no visible dialog, click has no effect).
function showConfirm(message) {
  return new Promise(resolve => {
    const overlay = document.getElementById("modal-overlay");
    const msgEl = document.getElementById("modal-message");
    const okBtn = document.getElementById("modal-confirm-btn");
    const cancelBtn = document.getElementById("modal-cancel-btn");

    msgEl.textContent = message;
    overlay.style.display = "flex";

    function cleanup(result) {
      overlay.style.display = "none";
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
      overlay.removeEventListener("click", onOverlay);
      document.removeEventListener("keydown", onKey);
      resolve(result);
    }
    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }
    function onOverlay(ev) { if (ev.target === overlay) cleanup(false); }
    function onKey(ev) { if (ev.key === "Escape") cleanup(false); }

    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
    overlay.addEventListener("click", onOverlay);
    document.addEventListener("keydown", onKey);
  });
}
const HISTORY_KEY = "ramtah_history_v1";
const MANUAL_LOG_KEY = "ramtah_manual_log_v1";
const LIVE_CACHE_KEY = "ramtah_live_cache_v1";
const LIVE_CACHE_TTL = 12 * 60 * 60 * 1000; // 12h
const CANONN_SITE_URL = (id) => `https://ruins.canonn.tech/data/siteids/${id}.json`;
const CATEGORY_ORDER = ["History", "Language", "Biology", "Culture", "Technology"];

const CAT_LETTER = { History: "H", Language: "L", Biology: "B", Culture: "C", Technology: "T" };
const LETTER_CAT = { H: "History", L: "Language", B: "Biology", C: "Culture", T: "Technology" };

let SITES = [];          // raw sites from data.json (already filtered to verified/working entries)
let GROUPS = {};         // key "system||body" -> { system, body, sites: [site,...] }
let UNIVERSE = new Set();// all "Category|codex" strings that exist
let CAT_MAX = {};        // category -> max codex number found (count of items in that category)
let completed = new Set(); // "Category|codex" strings the user has checked off
let history = [];        // ordered list of "Category|codex" keys, in the order they were checked (for undo)
let manualLog = [];      // manually-added entries: {system, body, category, codex, obelisk, items, ts}
let liveCache = {};      // siteID -> { entries, latitude, longitude, verifiedSite, ts, live: true }
let liveSyncStatus = {}; // siteID -> 'pending' | 'ok' | 'failed' (transient, not persisted)
let selectedGroupKey = null;

function entryKey(e) { return e.category + "|" + e.codex; }

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) completed = new Set(JSON.parse(raw));
  } catch (e) { completed = new Set(); }
  try {
    const rawH = localStorage.getItem(HISTORY_KEY);
    if (rawH) history = JSON.parse(rawH);
  } catch (e) { history = []; }
  try {
    const rawM = localStorage.getItem(MANUAL_LOG_KEY);
    if (rawM) manualLog = JSON.parse(rawM);
  } catch (e) { manualLog = []; }
  try {
    const rawL = localStorage.getItem(LIVE_CACHE_KEY);
    if (rawL) liveCache = JSON.parse(rawL);
  } catch (e) { liveCache = {}; }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  localStorage.setItem(MANUAL_LOG_KEY, JSON.stringify(manualLog));
}

function saveLiveCache() {
  try {
    localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify(liveCache));
  } catch (e) {
    // storage full or unavailable — non-fatal, live data just won't persist between sessions
  }
}

function undoLast() {
  if (history.length === 0) return;
  const lastKey = history.pop();
  completed.delete(lastKey);
  saveState();
  renderAll();
  renderUndoButton();
  if (selectedGroupKey) renderDetail();
}

function renderUndoButton() {
  const btn = document.getElementById("undo-btn");
  btn.textContent = t("undoBtnText", { n: history.length });
  btn.disabled = history.length === 0;
}

function buildGroups() {
  GROUPS = {};
  for (const s of SITES) {
    const key = s.system + "||" + s.body;
    if (!GROUPS[key]) GROUPS[key] = { system: s.system, body: s.body, sites: [] };
    GROUPS[key].sites.push(s);
  }
}

function buildUniverse() {
  UNIVERSE = new Set();
  CAT_MAX = {};
  for (const s of SITES) {
    for (const e of s.entries) {
      UNIVERSE.add(entryKey(e));
      CAT_MAX[e.category] = Math.max(CAT_MAX[e.category] || 0, e.codex);
    }
  }
}

// Remaining (not yet completed) unique entries at a single sub-site
function remainingEntriesForSite(site) {
  const seen = new Set();
  const out = [];
  for (const e of site.entries) {
    const k = entryKey(e);
    if (completed.has(k)) continue;
    if (seen.has(k)) continue; // avoid duplicate obelisks giving the same combo at the same site
    seen.add(k);
    out.push(e);
  }
  return out;
}

// Unique remaining codex value across an entire group (system+body, all sub-sites combined)
function remainingValueForGroup(group) {
  const seen = new Set();
  for (const site of group.sites) {
    for (const e of site.entries) {
      const k = entryKey(e);
      if (!completed.has(k)) seen.add(k);
    }
  }
  return seen.size;
}

function totalDone() {
  let n = 0;
  for (const k of UNIVERSE) if (completed.has(k)) n++;
  return n;
}

function doneInCategory(cat) {
  let n = 0;
  for (const k of UNIVERSE) {
    if (k.startsWith(cat + "|") && completed.has(k)) n++;
  }
  return n;
}

// ================= RENDERING =================

function renderProgress() {
  const total = UNIVERSE.size;
  const done = totalDone();
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById("progress-pct").textContent = pct + "%";
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-count").textContent = t("dataCount", { n: done, total });
}

function renderCategories() {
  const container = document.getElementById("category-list");
  container.innerHTML = "";
  for (const cat of CATEGORY_ORDER) {
    const max = CAT_MAX[cat] || 0;
    const done = doneInCategory(cat);
    const row = document.createElement("div");
    row.className = "category-row";
    row.innerHTML = `
      <span class="cat-name"><span class="dot cat-${cat}" style="background:var(--${cat.toLowerCase()})"></span>${catLabel(cat)}</span>
      <span class="count ${done === max ? 'done' : ''}">${done} / ${max}</span>
    `;
    container.appendChild(row);
  }
}

function categoryColorVars() {
  document.documentElement.style.setProperty("--history", "#d98a3d");
  document.documentElement.style.setProperty("--language", "#4fa3d1");
  document.documentElement.style.setProperty("--biology", "#6ec26e");
  document.documentElement.style.setProperty("--culture", "#b07dcf");
  document.documentElement.style.setProperty("--technology", "#d15b5b");
}

let currentFrameSiteID = null;

function canonnUrl(siteID) {
  return `https://ruins.canonn.tech/#GR${siteID}`;
}

function loadCanonnFrame(siteID) {
  currentFrameSiteID = String(siteID);
  try { localStorage.setItem("ramtah_last_site", currentFrameSiteID); } catch (e) { /* ignore */ }
  document.getElementById("canonn-frame").src = canonnUrl(siteID);
}

let BUNDLED_SITES_BY_ID = {}; // siteID -> original bundled site object (never mutated, source of truth for merging)

function syncGroupLive(key) {
  const group = GROUPS[key];
  if (!group) return;
  for (let i = 0; i < group.sites.length; i++) {
    const siteID = group.sites[i].siteID;
    getLiveSiteData(siteID).then(live => {
      const bundled = BUNDLED_SITES_BY_ID[siteID];
      const idx = group.sites.findIndex(s => s.siteID === siteID);
      if (idx === -1) return;
      group.sites[idx] = applyLiveData(bundled, live);
      if (selectedGroupKey === key) renderDetail();
    });
  }
}

function selectGroup(key) {
  const isNewGroup = key !== selectedGroupKey;
  selectedGroupKey = key;
  try { localStorage.setItem("ramtah_last_group", key); } catch (e) { /* ignore */ }

  const welcomeScreen = document.getElementById("welcome-screen");
  if (welcomeScreen.style.display !== "none") {
    welcomeScreen.style.display = "none";
    document.getElementById("iframe-wrap").style.display = "flex";
  }

  // only auto-load the first sub-site when actually switching to a different system,
  // not when merely refreshing the panel after a checkbox change
  if (isNewGroup) {
    const group = GROUPS[key];
    if (group && group.sites.length) {
      let target = null;
      try {
        const lastSite = localStorage.getItem("ramtah_last_site");
        if (lastSite) target = group.sites.find(s => String(s.siteID) === lastSite) || null;
      } catch (e) { /* ignore */ }
      if (!target) {
        const sorted = [...group.sites].sort((a, b) => a.type.localeCompare(b.type));
        target = sorted[0];
      }
      loadCanonnFrame(target.siteID);
    }
    syncGroupLive(key);
  }
  renderDetail();
}

function renderDetail() {
  const empty = document.getElementById("detail-empty");
  const content = document.getElementById("detail-content");
  const manualAdd = document.getElementById("manual-add");

  if (!selectedGroupKey || !GROUPS[selectedGroupKey]) {
    empty.style.display = "block";
    content.style.display = "none";
    manualAdd.style.display = "none";
    return;
  }
  empty.style.display = "none";
  content.style.display = "block";
  manualAdd.style.display = "block";

  const group = GROUPS[selectedGroupKey];
  document.getElementById("detail-title").textContent = group.system;
  document.getElementById("detail-body").textContent = t("planetLabel", { body: group.body });
  renderManualLog(group);

  // Gather every (category|codex) key obtainable anywhere on this planet (across all its sub-sites)
  const groupKeys = new Set();
  for (const site of group.sites) {
    for (const e of site.entries) groupKeys.add(entryKey(e));
  }
  const completedHere = [...groupKeys].filter(k => completed.has(k));

  const resetBox = document.getElementById("detail-system-reset");
  if (completedHere.length > 0) {
    resetBox.innerHTML = `
      <button id="reset-system-btn">${tn("resetSystemBtn", completedHere.length)}</button>
    `;
    document.getElementById("reset-system-btn").addEventListener("click", async () => {
      const ok = await showConfirm(t("resetSystemConfirm", { n: completedHere.length, system: group.system }));
      if (ok) {
        for (const k of completedHere) {
          completed.delete(k);
          const idx = history.lastIndexOf(k);
          if (idx !== -1) history.splice(idx, 1);
        }
        manualLog = manualLog.filter(m => !(m.system === group.system && m.body === group.body));
        saveState();
        renderAll();
        renderUndoButton();
        renderDetail();
      }
    });
  } else {
    resetBox.innerHTML = "";
  }

  const container = document.getElementById("detail-sites");
  container.innerHTML = "";

  // Currently active sub-site (map loaded in the frame) goes first, others follow by type
  const sorted = [...group.sites].sort((a, b) => {
    const aActive = String(a.siteID) === String(currentFrameSiteID);
    const bActive = String(b.siteID) === String(currentFrameSiteID);
    if (aActive !== bActive) return aActive ? -1 : 1;
    return a.type.localeCompare(b.type);
  });

  for (const site of sorted) {
    const isActive = String(site.siteID) === String(currentFrameSiteID);
    const remaining = remainingEntriesForSite(site);
    const box = document.createElement("div");
    box.className = "sub-site" + (isActive ? " sub-site-active" : "");

    let rowsHtml = "";
    if (remaining.length === 0) {
      rowsHtml = `<div class="no-obelisks">${t("noObelisksLeft")}</div>`;
    } else {
      const sortedEntries = [...remaining].sort((a, b) => a.group.localeCompare(b.group) || a.obelisk - b.obelisk);
      rowsHtml = sortedEntries.map(e => {
        const sec = e.secondary ? itemLabel(e.secondary) : "—";
        const k = entryKey(e);
        return `
          <label class="obelisk-row${isActive ? "" : " obelisk-row-disabled"}" data-key="${k}" data-site="${site.siteID}">
            <input type="checkbox" class="obelisk-check" data-key="${k}" ${isActive ? "" : "disabled"}>
            <span class="obelisk-code">${e.group}${e.obelisk}</span>
            <span class="obelisk-items">${itemLabel(e.primary)} + ${sec}</span>
            <span class="cat-tag cat-${e.category}">${catLabel(e.category)}</span>
            <span class="obelisk-codex">#${e.codex}</span>
          </label>
        `;
      }).join("");
    }

    let coordNote;
    if (site._liveStatus === "live") {
      coordNote = `<span class="coord-badge coord-ok" title="${t("coordLiveTitle")}">${t("coordLive")}</span>`;
    } else if (site._liveStatus === "offline") {
      coordNote = `<span class="coord-badge coord-warn" title="${t("coordOfflineTitle")}">${t("coordOffline")}</span>`;
    } else {
      coordNote = `<span class="coord-badge coord-sync" title="${t("coordSyncingTitle")}">${t("coordSyncing")}</span>`;
    }

    box.innerHTML = `
      <div class="sub-site-header">
        <span>${site.type} (GR${site.siteID}) — ${coordNote}</span>
        <span class="header-right">
          ${isActive ? `<span class="active-badge">${t("activeBadge")}</span>` : ""}
          <span class="type-badge">${tn("utileCount", remaining.length)}</span>
        </span>
      </div>
      <button class="open-canonn-btn" data-siteid="${site.siteID}">${t("openCanonnBtn", { id: site.siteID })}</button>
      ${rowsHtml}
    `;
    container.appendChild(box);
  }

  container.querySelectorAll(".open-canonn-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      loadCanonnFrame(btn.dataset.siteid);
      renderDetail();
    });
  });

  // wire checkboxes
  container.querySelectorAll(".obelisk-check").forEach(cb => {
    cb.addEventListener("change", (ev) => {
      const k = ev.target.dataset.key;
      if (ev.target.checked) {
        completed.add(k);
        history.push(k);
      } else {
        completed.delete(k);
        const idx = history.lastIndexOf(k);
        if (idx !== -1) history.splice(idx, 1);
      }
      saveState();
      renderAll();
      renderUndoButton();
      // keep the same group selected & panel open after re-render
      selectGroup(selectedGroupKey);
    });
  });
}

let lastRouteResult = null;
let lastJumpRange = 65;
let doneHistoryKeys = new Set(); // group keys fully completed and dropped from the last recompute, kept visible until an explicit "Calculer la route"

function renderAll() {
  renderProgress();
  renderCategories();
  if (lastRouteResult) renderRouteResults(lastRouteResult, lastJumpRange);
  checkCompletionCelebration();
}

// ================= ROUTE OPTIMIZER =================

async function lookupSystemCoords(name) {
  const url = `https://www.edsm.net/api-v1/system?systemName=${encodeURIComponent(name)}&showCoordinates=1`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error("Erreur réseau EDSM");
    const json = await res.json();
    if (!json || !json.coords) return null;
    return json.coords; // {x,y,z}
  } finally {
    clearTimeout(timeout);
  }
}

function dist3(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

// Unique remaining codex value for a group, given a "still needed" set (Set of "Cat|codex")
function remainingValueForGroupGiven(group, neededSet) {
  const seen = new Set();
  for (const site of group.sites) {
    for (const e of site.entries) {
      const k = entryKey(e);
      if (neededSet.has(k)) seen.add(k);
    }
  }
  return seen;
}

// Greedy weighted set-cover with geographic cost: at each step pick the group maximizing
// (newly covered items) / distance from current position.
function groupCoords(group) {
  const s = group.sites[0];
  return { x: s.coords.x, y: s.coords.y, z: s.coords.z };
}

// Step 1: greedy construction — same heuristic as before (best codex-covered/distance ratio at
// each step), just to get A valid covering set of groups quickly.
function greedyCoverGroups(startCoords) {
  const needed = new Set();
  for (const k of UNIVERSE) if (!completed.has(k)) needed.add(k);

  const remainingGroups = new Map(Object.entries(GROUPS));
  const chosen = [];
  let current = startCoords;

  while (needed.size > 0 && remainingGroups.size > 0) {
    let bestKey = null, bestScore = -1, bestCovered = null;
    for (const [key, group] of remainingGroups) {
      const covered = remainingValueForGroupGiven(group, needed);
      if (covered.size === 0) continue;
      const d = current ? dist3(current, groupCoords(group)) : 0;
      const score = covered.size / Math.max(d, 1);
      if (score > bestScore) {
        bestScore = score;
        bestKey = key;
        bestCovered = covered;
      }
    }
    if (!bestKey) break;
    chosen.push(bestKey);
    for (const k of bestCovered) needed.delete(k);
    current = groupCoords(remainingGroups.get(bestKey));
    remainingGroups.delete(bestKey);
  }
  return { chosen, uncovered: needed.size };
}

// Step 2: remove any group from the chosen set whose data is entirely redundant with the
// others (i.e. every codex it offers is already covered by the rest) — repeated until no
// more can be dropped. This is what pulls the greedy result down towards the true minimum
// number of sites, the same effect an exact set-cover solver gives, without needing one.
function pruneRedundantGroups(chosenKeys) {
  const fullNeeded = new Set();
  for (const k of UNIVERSE) if (!completed.has(k)) fullNeeded.add(k);

  let keys = chosenKeys.slice();
  let changed = true;
  while (changed) {
    changed = false;
    const contributions = keys.map(key => {
      const group = GROUPS[key];
      const coveredByOthers = new Set();
      for (const k2 of keys) {
        if (k2 === key) continue;
        for (const site of GROUPS[k2].sites) {
          for (const e of site.entries) {
            const ek = entryKey(e);
            if (fullNeeded.has(ek)) coveredByOthers.add(ek);
          }
        }
      }
      let unique = 0;
      for (const site of group.sites) {
        for (const e of site.entries) {
          const ek = entryKey(e);
          if (fullNeeded.has(ek) && !coveredByOthers.has(ek)) unique++;
        }
      }
      return { key, unique };
    });
    contributions.sort((a, b) => a.unique - b.unique);
    if (contributions.length && contributions[0].unique === 0) {
      keys = keys.filter(k => k !== contributions[0].key);
      changed = true;
    }
  }
  return keys;
}

// Step 3a: exact optimal visiting order (Held-Karp) — only tractable for a modest number of
// stops, which is exactly what we have left after pruning (typically ~10-15).
function exactOrder(startCoords, chosenKeys) {
  const groups = chosenKeys.map(k => GROUPS[k]);
  const nodeCoords = [startCoords || { x: 0, y: 0, z: 0 }, ...groups.map(groupCoords)];
  const n = nodeCoords.length;
  const m = n - 1;
  if (m === 0) return [];

  const dist = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => dist3(nodeCoords[i], nodeCoords[j])));

  const INF = Infinity;
  const dp = Array.from({ length: 1 << m }, () => new Array(m).fill(INF));
  const parent = Array.from({ length: 1 << m }, () => new Array(m).fill(-1));
  for (let j = 0; j < m; j++) dp[1 << j][j] = dist[0][j + 1];
  for (let mask = 0; mask < (1 << m); mask++) {
    for (let j = 0; j < m; j++) {
      if (dp[mask][j] === INF || !(mask & (1 << j))) continue;
      for (let k = 0; k < m; k++) {
        if (mask & (1 << k)) continue;
        const nmask = mask | (1 << k);
        const nd = dp[mask][j] + dist[j + 1][k + 1];
        if (nd < dp[nmask][k]) { dp[nmask][k] = nd; parent[nmask][k] = j; }
      }
    }
  }
  const full = (1 << m) - 1;
  let bestJ = -1, bestVal = INF;
  for (let j = 0; j < m; j++) if (dp[full][j] < bestVal) { bestVal = dp[full][j]; bestJ = j; }

  const path = [];
  let mask = full, j = bestJ;
  while (j !== -1) {
    path.push(j);
    const pj = parent[mask][j];
    mask ^= (1 << j);
    j = pj;
  }
  path.reverse();
  return path.map(idx => chosenKeys[idx]);
}

// Step 3b: fallback ordering (nearest-neighbour) for the rare case pruning leaves too many
// stops for Held-Karp to handle instantly — keeps the app responsive no matter what.
function nearestNeighborOrder(startCoords, chosenKeys) {
  let current = startCoords;
  let remaining = chosenKeys.slice();
  const ordered = [];
  while (remaining.length) {
    let bestIdx = 0, bestD = Infinity;
    remaining.forEach((key, idx) => {
      const d = current ? dist3(current, groupCoords(GROUPS[key])) : 0;
      if (d < bestD) { bestD = d; bestIdx = idx; }
    });
    const key = remaining[bestIdx];
    ordered.push(key);
    current = groupCoords(GROUPS[key]);
    remaining.splice(bestIdx, 1);
  }
  return ordered;
}

function computeOptimalRoute(startCoords) {
  const { chosen, uncovered } = greedyCoverGroups(startCoords);
  const pruned = pruneRedundantGroups(chosen);
  const orderedKeys = pruned.length <= 16
    ? exactOrder(startCoords, pruned)
    : nearestNeighborOrder(startCoords, pruned);

  const route = [];
  let current = startCoords;
  let totalDist = 0;
  const runningNeeded = new Set();
  for (const k of UNIVERSE) if (!completed.has(k)) runningNeeded.add(k);

  for (const key of orderedKeys) {
    const group = GROUPS[key];
    const d = current ? dist3(current, groupCoords(group)) : 0;
    const covered = remainingValueForGroupGiven(group, runningNeeded);
    for (const k2 of covered) runningNeeded.delete(k2);
    route.push({ key, group, distance: d, covered: covered.size });
    current = groupCoords(group);
    totalDist += d;
  }

  return { route, totalDist, uncovered };
}

function renderRouteResults(result, jumpRange) {
  const container = document.getElementById("route-results");
  container.innerHTML = "";

  const itemsList = document.createElement("div");
  itemsList.className = "route-items-scroll";
  container.appendChild(itemsList);

  // Visually sink fully-completed systems (0 useful codex left there right now) to the
  // bottom so the next actionable one is always first — but keep the "unfinished before"
  // warning based on the real underlying travel order, not this display order.
  const withStatus = result.route.map((step, originalIndex) => ({
    step, originalIndex, remaining: remainingValueForGroup(step.group),
  }));
  const displayOrder = [
    ...withStatus.filter(s => s.remaining > 0),
    ...withStatus.filter(s => s.remaining === 0),
  ];

  let cumDist = 0, cumJumps = 0;
  displayOrder.forEach(({ step, originalIndex, remaining }, displayIndex) => {
    const isDone = remaining === 0;
    cumDist += step.distance;
    const jumps = Math.max(1, Math.ceil(step.distance / jumpRange));
    cumJumps += jumps;
    const item = document.createElement("div");
    item.className = "route-item" + (isDone ? " route-item-done" : "");
    const metaText = `${t("routeCodexCovered", { n: step.covered })} · ` +
      t("routeDistJumps", { dist: step.distance.toFixed(1), jumps, s: jumps > 1 ? "s" : "", cum: cumDist.toFixed(0) });
    item.innerHTML = `
      <span class="route-step">${isDone ? "✓" : displayIndex + 1}</span>
      <div class="route-info">
        <div class="route-system">${step.group.system}</div>
        <div class="route-meta">${metaText}</div>
      </div>
      <button class="route-retarget-btn" title="${t("retargetBtnTitle")}">▶</button>
    `;
    item.querySelector(".route-info").addEventListener("click", () => selectGroup(step.key));
    item.querySelector(".route-retarget-btn").addEventListener("click", async (ev) => {
      ev.stopPropagation();

      const unfinishedBefore = result.route
        .slice(0, originalIndex)
        .filter(s => remainingValueForGroup(s.group) > 0)
        .map(s => s.group.system);

      if (unfinishedBefore.length > 0) {
        const list = unfinishedBefore.slice(0, 5).join(", ") + (unfinishedBefore.length > 5 ? "..." : "");
        const ok = await showConfirm(
          t("routeConfirmUnfinished", { n: unfinishedBefore.length, list, system: step.group.system })
        );
        if (!ok) return;
      }

      const site0 = step.group.sites[0];
      if (discoveryPromise) {
        try {
          await Promise.race([discoveryPromise, new Promise(resolve => setTimeout(resolve, MAX_SYNC_WAIT_MS))]);
        } catch (e) { /* ignore */ }
      }
      await retargetRouteFrom(step.group.system, { x: site0.coords.x, y: site0.coords.y, z: site0.coords.z });
      selectGroup(step.key);
    });
    itemsList.appendChild(item);
  });

  // Systems that were fully done and dropped from this fresh computation entirely —
  // still shown at the very bottom (grey, no distance info since they're not part of
  // the current path) until an explicit "Calculer la route" click clears the history.
  const shownKeys = new Set(result.route.map(s => s.key));
  for (const key of doneHistoryKeys) {
    if (shownKeys.has(key)) continue;
    const group = GROUPS[key];
    if (!group) continue;
    const item = document.createElement("div");
    item.className = "route-item route-item-done";
    item.innerHTML = `
      <span class="route-step">✓</span>
      <div class="route-info">
        <div class="route-system">${group.system}</div>
      </div>
      <button class="route-retarget-btn" title="${t("retargetBtnTitle")}">▶</button>
    `;
    item.querySelector(".route-info").addEventListener("click", () => selectGroup(key));
    item.querySelector(".route-retarget-btn").addEventListener("click", async (ev) => {
      ev.stopPropagation();
      const site0 = group.sites[0];
      if (discoveryPromise) {
        try {
          await Promise.race([discoveryPromise, new Promise(resolve => setTimeout(resolve, MAX_SYNC_WAIT_MS))]);
        } catch (e) { /* ignore */ }
      }
      await retargetRouteFrom(group.system, { x: site0.coords.x, y: site0.coords.y, z: site0.coords.z });
      selectGroup(key);
    });
    itemsList.appendChild(item);
  }

  const totalSubSites = result.route.reduce((sum, s) => sum + s.group.sites.length, 0);

  const summary = document.createElement("div");
  summary.className = "route-summary";
  summary.textContent = t("routeSummary", {
    n: result.route.length,
    system: tn("routeSystemWord", result.route.length),
    subSites: totalSubSites,
    dist: cumDist.toFixed(0),
    jumps: cumJumps,
  });
  container.appendChild(summary);

  if (result.uncovered > 0) {
    const warn = document.createElement("div");
    warn.className = "route-status error";
    warn.textContent = t("routeUncovered", { n: result.uncovered });
    container.prepend(warn);
  }
}

function runRouteCalculation(startCoords, jumpRange, { resetHistory = false } = {}) {
  document.getElementById("route-results").innerHTML = "";

  if (resetHistory) {
    doneHistoryKeys = new Set();
  } else if (lastRouteResult) {
    // Retargeting: before recomputing, remember any system that was already fully done
    // in the previous list so it doesn't just vanish once the algorithm drops it.
    for (const step of lastRouteResult.route) {
      if (remainingValueForGroup(step.group) === 0) doneHistoryKeys.add(step.key);
    }
  }

  const result = computeOptimalRoute(startCoords);
  lastRouteResult = result;
  lastJumpRange = jumpRange;
  renderRouteResults(result, jumpRange);

  // Bring the freshly computed route into view — on smaller screens the sidebar content
  // (progress, route form, etc.) can push the results well below the fold otherwise.
  const resultsEl = document.getElementById("route-results");
  if (resultsEl.firstChild) {
    resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function initRouteOptimizer() {
  const startInput = document.getElementById("start-system");
  const jumpInput = document.getElementById("jump-range");
  const statusEl = document.getElementById("route-status");
  const btn = document.getElementById("optimize-btn");

  startInput.value = localStorage.getItem("ramtah_start_system") || DEFAULT_START_SYSTEM;
  jumpInput.value = localStorage.getItem("ramtah_jump_range") || "65";

  // Gentle pulsing hint on first visit only (never used the route calculator before) —
  // removed permanently the first time the user actually clicks "Calculer la route".
  if (!localStorage.getItem("ramtah_used_route_once")) {
    startInput.classList.add("field-hint-pulse");
    jumpInput.classList.add("field-hint-pulse");
  }
  function clearHintPulse() {
    startInput.classList.remove("field-hint-pulse");
    jumpInput.classList.remove("field-hint-pulse");
    try { localStorage.setItem("ramtah_used_route_once", "1"); } catch (e) { /* ignore */ }
  }
  startInput.addEventListener("input", clearHintPulse, { once: true });
  jumpInput.addEventListener("input", clearHintPulse, { once: true });

  async function computeAndDisplayRoute() {
    const name = startInput.value.trim();
    const jumpRange = parseFloat(jumpInput.value) || 65;
    localStorage.setItem("ramtah_jump_range", jumpRange);
    document.getElementById("route-results").innerHTML = "";
    statusEl.className = "route-status";

    let startCoords = null;
    if (name) {
      localStorage.setItem("ramtah_start_system", name);
      statusEl.textContent = t("routeSearchingEdsm");
      try {
        startCoords = await lookupSystemCoords(name);
        if (!startCoords) {
          statusEl.className = "route-status error";
          statusEl.textContent = t("routeSystemNotFound", { name });
        } else {
          statusEl.textContent = "";
        }
      } catch (e) {
        statusEl.className = "route-status error";
        statusEl.textContent = t("routeEdsmError");
      }
    } else {
      statusEl.textContent = t("routeNoStartSystem");
    }

    runRouteCalculation(startCoords, jumpRange, { resetHistory: true });
  }

  // Normal click: the button is only visible/clickable once the background sync has
  // finished (or never needed to run), so no extra waiting logic is needed here.
  btn.addEventListener("click", () => { clearHintPulse(); computeAndDisplayRoute(); });

  // "Calculer sur données partielles": lets the user skip the sync wait entirely and
  // compute right away with whatever is currently known.
  document.getElementById("skip-sync-btn").addEventListener("click", () => {
    document.getElementById("sync-row").style.display = "none";
    btn.style.display = "block";
    computeAndDisplayRoute();
  });

  // Exposed so init() can silently recompute the route and restore the last-viewed
  // system after a reload — picking up exactly where the user left off.
  window.__computeAndDisplayRoute = computeAndDisplayRoute;
}

// Re-target the route instantly from a system we already have galactic coordinates for
// (any site in our own directory) — no EDSM lookup needed, so it's immediate.
function retargetRouteFrom(systemName, coords) {
  const startInput = document.getElementById("start-system");
  const jumpInput = document.getElementById("jump-range");
  const statusEl = document.getElementById("route-status");
  const jumpRange = parseFloat(jumpInput.value) || 65;

  startInput.value = systemName;
  localStorage.setItem("ramtah_start_system", systemName);
  statusEl.className = "route-status";
  statusEl.textContent = "";

  runRouteCalculation(coords, jumpRange);
}

// ================= NEW SITE DISCOVERY (getRuinList.json) =================

const RUIN_LIST_URL = "https://ruins.canonn.tech/data/getRuinList.json";
let discoveryPromise = null; // the currently running (or last completed) discoverNewSites() call
const MAX_SYNC_WAIT_MS = 6000; // never make the user wait longer than this for the button
const DEFAULT_START_SYSTEM = "Synuefe XR-H D11-102"; // Inki's starting point — lets anyone try the tool instantly, no Elite Dangerous needed
const KNOWN_NEW_SITES_KEY = "ramtah_new_sites_v1";       // cache of previously-discovered new sites (fully resolved)
const SYSTEM_COORDS_CACHE_KEY = "ramtah_system_coords_cache_v1"; // generic per-system-name galactic coords cache

async function lookupSystemCoordsCached(name) {
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(SYSTEM_COORDS_CACHE_KEY) || "{}"); } catch (e) { /* ignore */ }
  if (cache[name]) return cache[name];
  const coords = await lookupSystemCoords(name);
  if (coords) {
    cache[name] = coords;
    try { localStorage.setItem(SYSTEM_COORDS_CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* ignore */ }
  }
  return coords;
}

// Adds already-resolved site objects into SITES/BUNDLED_SITES_BY_ID and rebuilds GROUPS.
function mergeNewSitesIntoState(newSites) {
  let added = 0;
  for (const site of newSites) {
    if (BUNDLED_SITES_BY_ID[site.siteID]) continue; // already known
    SITES.push(site);
    BUNDLED_SITES_BY_ID[site.siteID] = site;
    added++;
  }
  if (added > 0) buildGroups();
  return added;
}

// Fetches Canonn's full ruin site directory, finds any siteID we don't already know about,
// resolves galactic coordinates via EDSM (one lookup per new system, cached forever), fetches
// their obelisk data, and merges them in. Runs silently in the background — never blocks the
// app, and fails gracefully offline (falls back to whatever was already discovered previously).
// Runs async fn(item) over items with at most `limit` running concurrently — much faster
// than a sequential loop on slow connections, without opening dozens of requests at once.
async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      results[i] = await fn(items[i], i);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

async function discoverNewSites() {
  const btn = document.getElementById("optimize-btn");
  const syncRow = document.getElementById("sync-row");
  let shown = false;
  let restored = false;
  const showTimer = setTimeout(() => {
    shown = true;
    btn.style.display = "none";
    syncRow.style.display = "flex";
  }, 400); // only show if this genuinely takes a moment — no flash for near-instant runs

  const restore = () => {
    if (restored) return;
    restored = true;
    syncRow.style.display = "none";
    btn.style.display = "block";
  };
  // Safety net: never make the user wait past this, even without clicking "skip" —
  // the sync keeps running in the background regardless and will apply next time.
  const capTimer = setTimeout(restore, MAX_SYNC_WAIT_MS);

  let totalAdded = 0;
  try {
    let cachedNewSites = [];
    try { cachedNewSites = JSON.parse(localStorage.getItem(KNOWN_NEW_SITES_KEY) || "[]"); } catch (e) { /* ignore */ }
    const addedFromCache = mergeNewSitesIntoState(cachedNewSites);
    totalAdded += addedFromCache;
    if (addedFromCache > 0) {
      buildUniverse();
      renderAll();
      if (selectedGroupKey) renderDetail();
    }

    const res = await fetch(RUIN_LIST_URL);
    if (!res.ok) return;
    const json = await res.json();
    const grsites = (json && json.data && json.data.grsites) || [];

    const knownIds = new Set(SITES.map(s => s.siteID));
    const candidates = grsites.filter(g => !knownIds.has(g.siteID));
    if (candidates.length === 0) return;

    // Group by system name to minimize EDSM lookups (many sub-sites often share a system)
    const bySystem = {};
    for (const g of candidates) {
      const sysName = g.system.systemName;
      (bySystem[sysName] = bySystem[sysName] || []).push(g);
    }

    const resolved = [];
    const systemEntries = Object.entries(bySystem);
    const coordsResults = await mapWithConcurrency(systemEntries, 8, async ([sysName]) => {
      return await lookupSystemCoordsCached(sysName);
    });
    systemEntries.forEach(([sysName, group], idx) => {
      const coords = coordsResults[idx];
      if (!coords) return; // can't compute routes to it without galactic coords — skip for now
      for (const g of group) {
        resolved.push({
          siteID: g.siteID,
          system: sysName,
          body: g.body.bodyName,
          type: g.type.type,
          latitude: g.latitude,
          longitude: g.longitude,
          coords,
          entries: [],
        });
      }
    });
    if (resolved.length === 0) return;

    // Fetch obelisk data for each new site right away so it's immediately usable
    await mapWithConcurrency(resolved, 8, async (site) => {
      const live = await getLiveSiteData(site.siteID);
      if (live) {
        site.entries = live.entries.filter(e => e.verified);
        site.latitude = live.latitude;
        site.longitude = live.longitude;
        site._liveStatus = "live";
      }
    });

    const merged = [...cachedNewSites, ...resolved];
    try { localStorage.setItem(KNOWN_NEW_SITES_KEY, JSON.stringify(merged)); } catch (e) { /* ignore */ }

    const added = mergeNewSitesIntoState(resolved);
    totalAdded += added;
    if (added > 0) {
      buildUniverse();
      renderAll();
      if (selectedGroupKey) renderDetail();
      console.log(`Obelisk Compass: ${added} nouveau(x) site(s) découvert(s) et ajouté(s) depuis Canonn.`);
    }
  } catch (e) {
    // offline / CORS-blocked / Canonn unreachable — silently keep working with what's already known
  } finally {
    clearTimeout(showTimer);
    clearTimeout(capTimer);
    if (shown) restore();
  }
}

// ================= LIVE SYNC WITH CANONN =================

function transformCanonnSite(json) {
  const g = json && json.data && json.data.grsite;
  if (!g) return null;
  const entries = [];
  for (const ao of (g.activeObelisks || [])) {
    const o = ao.activeObelisk;
    if (!o || o.broken) continue;
    const cd = o.grCodexData;
    if (!cd) continue; // inactive/unmapped obelisk, nothing to scan
    entries.push({
      group: o.grObeliskGroup.groupName,
      obelisk: o.obeliskNumber,
      category: cd.grCodexCategory.categoryName,
      codex: cd.codexNumber,
      primary: cd.grPrimaryArtifact ? cd.grPrimaryArtifact.artifactName : null,
      secondary: cd.grSecondaryArtifact ? cd.grSecondaryArtifact.artifactName : null,
      verified: !!o.verified,
    });
  }
  return {
    entries,
    latitude: g.latitude,
    longitude: g.longitude,
    verifiedSite: !!g.verified,
  };
}

// Returns live data for a site from cache/network, or null if unavailable (caller should fall back to bundled data.json)
async function getLiveSiteData(siteID) {
  const cached = liveCache[siteID];
  if (cached && (Date.now() - cached.ts) < LIVE_CACHE_TTL) {
    return cached;
  }
  try {
    const res = await fetch(CANONN_SITE_URL(siteID));
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = await res.json();
    const transformed = transformCanonnSite(json);
    if (!transformed) throw new Error("format inattendu");
    const entry = { ...transformed, ts: Date.now() };
    liveCache[siteID] = entry;
    saveLiveCache();
    return entry;
  } catch (e) {
    return cached || null; // stale cache is still better than nothing; else null triggers fallback
  }
}

// Applies live data (if available) onto a bundled site object, returning a new site with entries/coords overridden.
// Only entries that are verified & not broken are kept, matching our original data.json filtering rule.
function applyLiveData(bundledSite, live) {
  if (!live) return { ...bundledSite, _liveStatus: "offline" };
  const entries = live.entries.filter(e => e.verified);
  return {
    ...bundledSite,
    entries: entries.length ? entries : bundledSite.entries, // don't wipe out data if live had nothing verified yet
    latitude: live.latitude,
    longitude: live.longitude,
    coordsVerified: true, // live data's coordinates are by definition current
    _liveStatus: "live",
  };
}


function renderManualLog(group) {
  const logEl = document.getElementById("manual-add-log");
  const entries = manualLog.filter(m => m.system === group.system && m.body === group.body);
  if (entries.length === 0) {
    logEl.innerHTML = "";
    return;
  }
  logEl.innerHTML = entries.map(m => {
    const extra = [m.obelisk, m.items].filter(Boolean).join(" · ");
    return `<div class="manual-add-log-entry"><span>${catLabel(m.category)} #${m.codex}${extra ? " (" + extra + ")" : ""}</span></div>`;
  }).join("");
}

function initManualAdd() {
  document.getElementById("manual-add-btn").addEventListener("click", () => {
    const statusEl = document.getElementById("manual-add-status");
    const category = document.getElementById("manual-category").value;
    const codexRaw = document.getElementById("manual-codex").value;
    const obelisk = document.getElementById("manual-obelisk").value.trim();
    const items = document.getElementById("manual-items").value.trim();

    const codex = parseInt(codexRaw, 10);
    if (!codex || codex < 1) {
      statusEl.className = "manual-add-status error";
      statusEl.textContent = t("manualInvalidCodex");
      return;
    }
    const max = CAT_MAX[category] || 0;
    if (codex > max) {
      statusEl.className = "manual-add-status error";
      statusEl.textContent = t("manualCodexTooHigh", { cat: catLabel(category), max });
      return;
    }
    if (!selectedGroupKey || !GROUPS[selectedGroupKey]) return;
    const group = GROUPS[selectedGroupKey];
    const k = category + "|" + codex;

    const alreadyDone = completed.has(k);
    completed.add(k);
    if (!alreadyDone) history.push(k);
    manualLog.push({
      system: group.system, body: group.body,
      category, codex, obelisk, items,
      ts: Date.now(),
    });
    saveState();
    renderAll();
    renderUndoButton();
    renderDetail();

    document.getElementById("manual-codex").value = "";
    document.getElementById("manual-obelisk").value = "";
    document.getElementById("manual-items").value = "";
    const s2 = document.getElementById("manual-add-status");
    s2.className = "manual-add-status ok";
    s2.textContent = alreadyDone ? t("manualAlreadyDone") : t("manualAdded");
  });
}

// ================= EXPORT / IMPORT =================

function exportCurrentProgress() {
  const items = [...completed].map(k => {
    const [cat, codex] = k.split("|");
    const letter = CAT_LETTER[cat] || cat[0];
    return { letter, codex: parseInt(codex, 10) };
  });
  items.sort((a, b) => a.letter.localeCompare(b.letter) || a.codex - b.codex);
  return items.map(i => i.letter + String(i.codex).padStart(2, "0")).join(" ");
}

// Parses free-form text like "H01 l12, T9\nB05" into a list of {category, codex}
function parseCodeList(text) {
  const tokens = text.match(/[A-Za-z]\s*0*\d{1,3}/g) || [];
  const parsed = [];
  const invalid = [];
  for (const tok of tokens) {
    const m = tok.match(/^([A-Za-z])\s*0*(\d{1,3})$/);
    if (!m) { invalid.push(tok); continue; }
    const letter = m[1].toUpperCase();
    const codex = parseInt(m[2], 10);
    const category = LETTER_CAT[letter];
    if (!category) { invalid.push(tok); continue; }
    const max = CAT_MAX[category] || 0;
    if (codex < 1 || codex > max) { invalid.push(tok); continue; }
    parsed.push(category + "|" + codex);
  }
  return { keys: [...new Set(parsed)], invalid };
}

function initExportImport() {
  const exportBtn = document.getElementById("export-toggle-btn");
  const importBtn = document.getElementById("import-toggle-btn");
  const exportPanel = document.getElementById("export-panel");
  const importPanel = document.getElementById("import-panel");

  exportBtn.addEventListener("click", () => {
    importPanel.style.display = "none";
    const isOpen = exportPanel.style.display !== "none";
    exportPanel.style.display = isOpen ? "none" : "block";
    if (!isOpen) {
      const list = exportCurrentProgress();
      document.getElementById("export-hint").textContent = t("exportHint", { n: completed.size });
      document.getElementById("export-textarea").value = list;
    }
  });

  document.getElementById("copy-export-btn").addEventListener("click", async () => {
    const ta = document.getElementById("export-textarea");
    const statusEl = document.getElementById("export-status");
    try {
      await navigator.clipboard.writeText(ta.value);
      statusEl.className = "io-status ok";
      statusEl.textContent = t("copiedOk");
    } catch (e) {
      ta.select();
      statusEl.className = "io-status error";
      statusEl.textContent = t("copyFailed");
    }
  });

  importBtn.addEventListener("click", () => {
    exportPanel.style.display = "none";
    const isOpen = importPanel.style.display !== "none";
    importPanel.style.display = isOpen ? "none" : "block";
  });

  document.getElementById("import-apply-btn").addEventListener("click", async () => {
    const statusEl = document.getElementById("import-status");
    const text = document.getElementById("import-textarea").value.trim();
    if (!text) {
      statusEl.className = "io-status error";
      statusEl.textContent = t("importNoList");
      return;
    }
    const { keys, invalid } = parseCodeList(text);
    if (keys.length === 0) {
      statusEl.className = "io-status error";
      statusEl.textContent = t("importNoValidEntries");
      return;
    }
    const extra = invalid.length
      ? t("importConfirmExtra", { n: invalid.length, list: invalid.slice(0, 10).join(", ") + (invalid.length > 10 ? "..." : "") })
      : "";
    const msg = t("importConfirm", { n: completed.size, m: keys.length, extra });
    const ok = await showConfirm(msg);
    if (!ok) return;

    completed = new Set(keys);
    history = [...keys];
    manualLog = [];
    saveState();
    renderAll();
    renderUndoButton();
    renderDetail();

    statusEl.className = "io-status ok";
    const resultExtra = invalid.length ? t("importResultExtra", { n: invalid.length }) : "";
    statusEl.textContent = t("importResult", { n: keys.length, extra: resultExtra });
  });
}

function initCopySystemButton() {
  const btn = document.getElementById("copy-system-btn");
  btn.addEventListener("click", async () => {
    if (!selectedGroupKey || !GROUPS[selectedGroupKey]) return;
    const name = GROUPS[selectedGroupKey].system;
    try {
      await navigator.clipboard.writeText(name);
      btn.classList.add("copied");
      btn.textContent = t("copiedBtnLabel");
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = t("copySystemBtn");
      }, 1500);
    } catch (e) {
      // clipboard API unavailable — fall back to a prompt so the user can copy manually
      window.prompt(t("promptCopySystem"), name);
    }
  });
}

// ================= CELEBRATION (101/101, replays each time you re-reach it) =================

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");

  const colors = ["#e0913a", "#f5a623", "#7fc97f", "#4fa3d1", "#b07dcf", "#d15b5b"];
  const pieces = [];
  const count = 160;
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: 2 + Math.random() * 3,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * 360,
      vrot: -8 + Math.random() * 16,
    });
  }

  const duration = 3800;
  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (elapsed < duration) {
      requestAnimationFrame(frame);
    } else {
      canvas.style.display = "none";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  requestAnimationFrame(frame);
}

let wasComplete = null; // null = not yet initialized from loaded data

function checkCompletionCelebration() {
  if (UNIVERSE.size === 0) return; // data not loaded yet
  const isComplete = totalDone() >= UNIVERSE.size;

  if (wasComplete === null) {
    // First check after data loads: just record the current state, never fire on page load/reload.
    wasComplete = isComplete;
    return;
  }

  if (isComplete && !wasComplete) {
    launchConfetti();
    document.getElementById("celebrate-overlay").style.display = "flex";
  }
  wasComplete = isComplete;
}

function initCelebration() {
  document.getElementById("celebrate-close-btn").addEventListener("click", () => {
    document.getElementById("celebrate-overlay").style.display = "none";
  });
  document.getElementById("celebrate-copy-meene-btn").addEventListener("click", async (ev) => {
    const btn = ev.currentTarget;
    try {
      await navigator.clipboard.writeText("Meene");
      btn.classList.add("copied");
      btn.textContent = t("copiedBtnLabel");
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = t("celebrateCopyMeeneBtn");
      }, 1500);
    } catch (e) {
      window.prompt(t("promptCopySystem"), "Meene");
    }
  });
  window.addEventListener("resize", () => {
    const canvas = document.getElementById("confetti-canvas");
    if (canvas.style.display !== "none") {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });
}

function initTutorial() {
  const overlay = document.getElementById("tutorial-overlay");
  const open = () => { overlay.style.display = "flex"; };
  const close = () => { overlay.style.display = "none"; };
  document.getElementById("tutorial-btn").addEventListener("click", open);
  document.getElementById("tutorial-close-btn").addEventListener("click", close);
  document.getElementById("tutorial-close-bottom-btn").addEventListener("click", close);
  overlay.addEventListener("click", (ev) => { if (ev.target === overlay) close(); });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && overlay.style.display !== "none") close();
  });
}

function initCategoryToggle() {
  const btn = document.getElementById("category-toggle-btn");
  const panel = document.getElementById("progress-detail-panel");
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", expanded ? "false" : "true");
    panel.classList.toggle("collapsed", expanded);
  });
}

function initLangSelector() {
  const sel = document.getElementById("lang-select");
  sel.innerHTML = SUPPORTED_LANGS.map(l => `<option value="${l}">${LANG_NAMES[l]}</option>`).join("");
  sel.value = currentLang;
  sel.addEventListener("change", () => {
    setLang(sel.value);
    applyStaticTranslations();
    renderAll();
    renderUndoButton();
    if (selectedGroupKey) renderDetail();
    // re-render any currently-shown route results in the new language (safe, cheap to just recompute)
    const resultsEl = document.getElementById("route-results");
    if (resultsEl && resultsEl.children.length) {
      document.getElementById("optimize-btn").click();
    }
  });
}

function init() {
  applyStaticTranslations();
  categoryColorVars();
  loadState();
  fetch("data.json")
    .then(r => {
      if (!r.ok) throw new Error(`data.json: HTTP ${r.status}`);
      return r.json();
    })
    .then(json => {
      SITES = json;
      BUNDLED_SITES_BY_ID = {};
      for (const s of SITES) BUNDLED_SITES_BY_ID[s.siteID] = s;
      buildGroups();
      buildUniverse();
      renderAll();
      renderDetail();

      // Restore exactly where the user left off last time (system viewed + computed route)
      try {
        const lastGroup = localStorage.getItem("ramtah_last_group");
        if (lastGroup && GROUPS[lastGroup]) selectGroup(lastGroup);
      } catch (e) { /* ignore */ }
      if (localStorage.getItem("ramtah_start_system") && window.__computeAndDisplayRoute) {
        window.__computeAndDisplayRoute();
      }

      discoveryPromise = discoverNewSites(); // kept so "Calculer la route" can wait on this same run
    })
    .catch(err => {
      const el = document.getElementById("route-status");
      el.className = "route-status error";
      el.textContent = t("dataLoadError", { msg: err.message });
      console.error(err);
    });

  initLangSelector();
  initCategoryToggle();
  initTutorial();
  initRouteOptimizer();
  initManualAdd();
  initExportImport();
  initCopySystemButton();
  initCelebration();
  renderUndoButton();

  document.getElementById("undo-btn").addEventListener("click", undoLast);

  document.getElementById("reset-btn").addEventListener("click", async () => {
    const ok = await showConfirm(t("resetConfirm"));
    if (!ok) return;

    // Progress data
    completed = new Set();
    history = [];
    manualLog = [];
    saveState();

    // Navigation state — wipe it so the app looks exactly like a brand new first launch
    selectedGroupKey = null;
    try {
      localStorage.removeItem("ramtah_last_group");
      localStorage.removeItem("ramtah_last_site");
      localStorage.removeItem("ramtah_start_system");
      localStorage.removeItem("ramtah_jump_range");
      localStorage.removeItem("ramtah_used_route_once");
    } catch (e) { /* ignore */ }

    const startInput = document.getElementById("start-system");
    const jumpInput = document.getElementById("jump-range");
    startInput.value = DEFAULT_START_SYSTEM;
    jumpInput.value = "65";
    startInput.classList.add("field-hint-pulse");
    jumpInput.classList.add("field-hint-pulse");

    document.getElementById("route-results").innerHTML = "";
    const routeStatusEl = document.getElementById("route-status");
    routeStatusEl.className = "route-status";
    routeStatusEl.textContent = "";
    lastRouteResult = null;
    doneHistoryKeys = new Set();

    document.getElementById("welcome-screen").style.display = "flex";
    document.getElementById("iframe-wrap").style.display = "none";

    renderAll();
    renderUndoButton();
    renderDetail();
  });
}

document.addEventListener("DOMContentLoaded", init);
