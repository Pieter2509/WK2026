// ================================================================
// WK Poul 2026, hoofd-applicatie
// Firebase voor cloud sync, vanilla JS voor de rest
// ================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  collection,
  query,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

import { firebaseConfig, POOL_NAME, ADMIN_PASSWORD, PREDICTION_DEADLINE, COUNTDOWN_DATE, COUNTDOWN_LABEL } from "./config.js";
import { GROUPS, TEAMS, FLAGS, MATCHES, calculatePoints, SCORING, teamName, teamFlag } from "./data.js";
import { KO_MATCHES, KO_ROUND_NAMES, resolveSlot, isRoundOpen } from "./knockout.js";
import { syncResults } from "./autosync.js";

// ================================================================
// FIREBASE SETUP
// ================================================================

let db = null;
let firebaseReady = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    firebaseReady = true;
  }
} catch (err) {
  console.error("Firebase initialisatie mislukt:", err);
}

// ================================================================
// STATE
// ================================================================

const state = {
  currentUser: null,        // { key: "john", name: "John" }
  predictions: {},          // { matchId: { home, away } } voor huidige user
  allPredictions: {},       // { userKey: { name, predictions: { matchId: {home, away} } } }
  results: {},              // { matchId: { home, away } }
  isAdmin: false,
  saveTimeout: null,
  // Auto-sync state
  autoSyncEnabled: false,
  autoSyncInterval: null,
  lastSyncTime: null,
  lastSyncStats: null,
  isSyncing: false,
};

// ================================================================
// HELPERS
// ================================================================

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(isoString) {
  const d = new Date(isoString);
  const dagen = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const maanden = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  return `${dagen[d.getDay()]} ${d.getDate()} ${maanden[d.getMonth()]}`;
}

function formatTime(isoString) {
  const d = new Date(isoString);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function isDeadlinePassed() {
  if (!PREDICTION_DEADLINE) return false;
  return new Date() > new Date(PREDICTION_DEADLINE);
}

function isMatchLocked(match) {
  // Per-wedstrijd lock: 1 uur voor de wedstrijd kan niet meer voorspeld worden
  // Of als de globale deadline is verstreken
  if (isDeadlinePassed()) return true;
  const matchDate = new Date(match.date);
  const lockTime = new Date(matchDate.getTime() - 60 * 60 * 1000);
  return new Date() > lockTime;
}

function showBanner(message, type = "success", duration = 3000) {
  const banner = document.getElementById("status-banner");
  banner.textContent = message;
  banner.className = `status-banner show ${type}`;
  if (duration > 0) {
    setTimeout(() => {
      banner.className = "status-banner";
    }, duration);
  }
}

function setConnectionStatus(connected) {
  const dot = document.getElementById("connection-status");
  if (dot) {
    dot.className = "status-dot " + (connected ? "online" : "offline");
    dot.title = connected ? "Verbonden met cloud" : "Geen verbinding";
  }
}

// ================================================================
// AUTH (naam + wachtwoord login)
// ================================================================

// Hash een wachtwoord met salt
// Probeert eerst Web Crypto API (SHA-256), valt terug op simpele hash voor http contexts
async function hashPassword(password, salt) {
  const input = password + salt;
  
  // Probeer Web Crypto API (werkt alleen op https of localhost)
  if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      return "sha256:" + Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch (err) {
      console.warn("Web Crypto niet beschikbaar, val terug op simpele hash:", err);
    }
  }
  
  // Fallback: simpele hash (niet ideaal, maar werkt voor vriendenpoul)
  // Gebaseerd op djb2 algoritme + extra mixing
  let h1 = 5381, h2 = 52711;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = ((h1 << 5) + h1 + c) >>> 0;
    h2 = ((h2 << 5) + h2 - c) >>> 0;
  }
  return "fb:" + h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0");
}

// Genereer random salt
function generateSalt() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback: Math.random
  let salt = "";
  for (let i = 0; i < 32; i++) {
    salt += Math.floor(Math.random() * 16).toString(16);
  }
  return salt;
}

// Zoek alle users met deze displayName (case insensitive)
async function findUsersByName(name) {
  const nameLower = name.toLowerCase().trim();
  const q = query(collection(db, "users"), where("displayNameLower", "==", nameLower));
  const snap = await getDocs(q);
  const users = [];
  snap.forEach((d) => users.push({ id: d.id, ...d.data() }));
  return users;
}

// Genereer een unieke userId op basis van slugified naam
// Als "joep" al bestaat: "joep-2", "joep-3", etc.
async function generateUniqueUserId(name) {
  const base = slugify(name);
  if (!base) throw new Error("Naam bevat geen geldige tekens");

  // Probeer base, dan base-2, base-3, etc.
  for (let i = 1; i < 100; i++) {
    const candidate = i === 1 ? base : `${base}-${i}`;
    const existing = await getDoc(doc(db, "users", candidate));
    if (!existing.exists()) return candidate;
  }
  throw new Error("Te veel gebruikers met deze naam");
}

// Login: bestaande gebruiker
async function loginUser(name, password) {
  if (!firebaseReady) {
    showBanner("Firebase is nog niet geconfigureerd", "error", 0);
    return false;
  }
  if (name.trim().length < 2) {
    showBanner("Naam moet minstens 2 tekens hebben", "error");
    return false;
  }
  if (!password) {
    showBanner("Vul je wachtwoord in", "error");
    return false;
  }

  try {
    const users = await findUsersByName(name);
    if (users.length === 0) {
      showBanner("Geen account met deze naam. Klik op 'Nieuw account' om je te registreren.", "error", 5000);
      return false;
    }

    // Probeer elk account met deze naam
    for (const user of users) {
      if (!user.passwordHash || !user.salt) continue;
      const hash = await hashPassword(password, user.salt);
      if (hash === user.passwordHash) {
        // Match!
        state.currentUser = { key: user.id, name: user.displayName };
        localStorage.setItem("wk2026-user", JSON.stringify(state.currentUser));
        return true;
      }
    }

    showBanner("Wachtwoord onjuist", "error");
    return false;
  } catch (err) {
    console.error("Login mislukt:", err);
    showBanner("Inloggen mislukt: " + err.message, "error", 0);
    return false;
  }
}

// Registreer: nieuwe gebruiker
async function registerUser(name, password) {
  if (!firebaseReady) {
    showBanner("Firebase is nog niet geconfigureerd", "error", 0);
    return false;
  }

  const cleanName = name.trim();
  if (cleanName.length < 2) {
    showBanner("Naam moet minstens 2 tekens hebben", "error");
    return false;
  }
  if (!password || password.length < 4) {
    showBanner("Wachtwoord moet minstens 4 tekens hebben", "error");
    return false;
  }

  try {
    const userId = await generateUniqueUserId(cleanName);
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    await setDoc(doc(db, "users", userId), {
      displayName: cleanName,
      displayNameLower: cleanName.toLowerCase(),
      passwordHash,
      salt,
      joinedAt: serverTimestamp(),
    });

    state.currentUser = { key: userId, name: cleanName };
    localStorage.setItem("wk2026-user", JSON.stringify(state.currentUser));

    // Laat zien als het een dubbele naam was
    if (userId !== slugify(cleanName)) {
      showBanner(`Account aangemaakt! Er was al een "${cleanName}", jij bent uniek via je wachtwoord.`, "success", 5000);
    }

    return true;
  } catch (err) {
    console.error("Registratie mislukt:", err);
    showBanner("Registratie mislukt: " + err.message, "error", 0);
    return false;
  }
}

function logout() {
  // Stop auto-sync interval als die loopt
  if (state.autoSyncInterval) {
    clearInterval(state.autoSyncInterval);
    state.autoSyncInterval = null;
    state.autoSyncEnabled = false;
  }
  localStorage.removeItem("wk2026-user");
  state.currentUser = null;
  state.predictions = {};
  state.isAdmin = false;
  showScreen("login-screen");
}

function tryAutoLogin() {
  const saved = localStorage.getItem("wk2026-user");
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

// Bij auto-login checken we of de gebruiker nog bestaat (geen wachtwoord nodig)
async function resumeSession(savedUser) {
  if (!savedUser || !savedUser.key) return false;
  try {
    const userDoc = await getDoc(doc(db, "users", savedUser.key));
    if (!userDoc.exists()) {
      // Account is verwijderd of bestaat niet meer
      localStorage.removeItem("wk2026-user");
      return false;
    }
    const data = userDoc.data();
    state.currentUser = { key: savedUser.key, name: data.displayName };
    return true;
  } catch (err) {
    console.error("Sessie herstellen mislukt:", err);
    return false;
  }
}

// ================================================================
// DATA SYNC (Firestore listeners)
// ================================================================

let unsubResults = null;
let unsubAllPredictions = null;

function subscribeToResults() {
  if (unsubResults) unsubResults();
  unsubResults = onSnapshot(
    collection(db, "results"),
    (snap) => {
      state.results = {};
      snap.forEach((d) => {
        state.results[d.id] = d.data();
      });
      setConnectionStatus(true);
      renderCurrentView();
    },
    (err) => {
      console.error("Results sync error:", err);
      setConnectionStatus(false);
    }
  );
}

function subscribeToAllPredictions() {
  // Subscribe op alle voorspellingen voor leaderboard
  if (unsubAllPredictions) unsubAllPredictions();
  unsubAllPredictions = onSnapshot(
    collection(db, "predictions"),
    (snap) => {
      state.allPredictions = {};
      snap.forEach((d) => {
        const data = d.data();
        if (!state.allPredictions[data.userKey]) {
          state.allPredictions[data.userKey] = {
            name: data.userName,
            predictions: {},
          };
        }
        state.allPredictions[data.userKey].predictions[data.matchId] = {
          home: data.home,
          away: data.away,
        };
      });

      // Update eigen predictions cache vanuit allPredictions
      if (state.currentUser && state.allPredictions[state.currentUser.key]) {
        state.predictions = state.allPredictions[state.currentUser.key].predictions || {};
      }

      renderCurrentView();
    },
    (err) => {
      console.error("Predictions sync error:", err);
      setConnectionStatus(false);
    }
  );
}

async function savePrediction(matchId, home, away) {
  if (!state.currentUser) return;

  const docId = `${state.currentUser.key}_${matchId}`;
  try {
    await setDoc(doc(db, "predictions", docId), {
      userKey: state.currentUser.key,
      userName: state.currentUser.name,
      matchId,
      home: Number(home),
      away: Number(away),
      updatedAt: serverTimestamp(),
    });
    state.predictions[matchId] = { home: Number(home), away: Number(away) };
    return true;
  } catch (err) {
    console.error("Voorspelling opslaan mislukt:", err);
    showBanner("Opslaan mislukt: " + err.message, "error");
    return false;
  }
}

async function saveResult(matchId, home, away) {
  if (!state.isAdmin) return false;

  try {
    if (home === "" || away === "" || home == null || away == null) {
      // Verwijder resultaat (set lege waardes)
      await setDoc(doc(db, "results", matchId), {
        home: null,
        away: null,
        updatedAt: serverTimestamp(),
      });
      delete state.results[matchId];
    } else {
      await setDoc(doc(db, "results", matchId), {
        home: Number(home),
        away: Number(away),
        updatedAt: serverTimestamp(),
      });
      state.results[matchId] = { home: Number(home), away: Number(away) };
    }
    return true;
  } catch (err) {
    console.error("Resultaat opslaan mislukt:", err);
    showBanner("Opslaan mislukt: " + err.message, "error");
    return false;
  }
}

// ================================================================
// AUTO-SYNC: haal uitslagen van openfootball/worldcup.json
// ================================================================

async function runAutoSync(silent = false) {
  if (!state.isAdmin) return;
  if (state.isSyncing) return;

  state.isSyncing = true;
  updateSyncStatus("Bezig met synchroniseren...");

  try {
    const stats = await syncResults(state.results, async (matchId, home, away) => {
      await setDoc(doc(db, "results", matchId), {
        home: Number(home),
        away: Number(away),
        updatedAt: serverTimestamp(),
        source: "openfootball",
      });
      state.results[matchId] = { home: Number(home), away: Number(away) };
    });

    state.lastSyncTime = new Date();
    state.lastSyncStats = stats;

    if (!silent) {
      if (stats.synced > 0) {
        showBanner(`${stats.synced} nieuwe uitslag${stats.synced > 1 ? 'en' : ''} gesynchroniseerd`, "success");
      } else if (stats.errors.length > 0) {
        showBanner(`Sync klaar met ${stats.errors.length} fout(en). Check console.`, "warning");
        console.warn("Sync errors:", stats.errors);
      } else {
        showBanner("Alles is up-to-date", "success", 2000);
      }
    }

    updateSyncStatus(null);
  } catch (err) {
    console.error("Auto-sync mislukt:", err);
    if (!silent) {
      showBanner("Sync mislukt: " + err.message, "error");
    }
    updateSyncStatus(null);
  } finally {
    state.isSyncing = false;
  }
}

function toggleAutoSync() {
  if (state.autoSyncInterval) {
    clearInterval(state.autoSyncInterval);
    state.autoSyncInterval = null;
    state.autoSyncEnabled = false;
    localStorage.setItem("wk2026-autosync", "false");
    showBanner("Auto-sync uitgezet", "success", 2000);
  } else {
    // Sync direct, dan elke 5 minuten
    runAutoSync(true);
    state.autoSyncInterval = setInterval(() => runAutoSync(true), 5 * 60 * 1000);
    state.autoSyncEnabled = true;
    localStorage.setItem("wk2026-autosync", "true");
    showBanner("Auto-sync aan: elke 5 minuten", "success");
  }
  updateSyncStatus(null);
}

function updateSyncStatus(message) {
  const statusEl = document.getElementById("sync-status");
  const toggleBtn = document.getElementById("autosync-toggle");
  if (!statusEl) return;

  if (message) {
    statusEl.textContent = message;
    statusEl.className = "sync-status syncing";
  } else if (state.lastSyncTime) {
    const time = state.lastSyncTime;
    const timeStr = `${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}`;
    const s = state.lastSyncStats;
    if (s) {
      statusEl.textContent = `Laatst gesynchroniseerd om ${timeStr}: ${s.synced} nieuw, ${s.skipped} bestaand, ${s.unmatched} niet gekoppeld`;
    } else {
      statusEl.textContent = `Laatst gesynchroniseerd om ${timeStr}`;
    }
    statusEl.className = "sync-status";
  } else {
    statusEl.textContent = "Nog niet gesynchroniseerd";
    statusEl.className = "sync-status";
  }

  if (toggleBtn) {
    toggleBtn.textContent = state.autoSyncEnabled ? "Auto-sync uitzetten" : "Auto-sync aanzetten";
    toggleBtn.className = state.autoSyncEnabled ? "btn-primary btn-active" : "btn-primary";
  }
}

// ================================================================
// SCORING
// ================================================================

function calculateUserPoints(userKey) {
  const userPreds = state.allPredictions[userKey]?.predictions || {};
  let total = 0;
  let exactCount = 0;
  let correctCount = 0;
  let finishedCount = 0;

  // Combineer groepsfase + knockout wedstrijden
  const allMatches = [...MATCHES, ...KO_MATCHES];

  for (const match of allMatches) {
    const result = state.results[match.id];
    if (!result || result.home == null || result.away == null) continue;
    finishedCount++;

    const pred = userPreds[match.id];
    if (!pred) continue;

    const pts = calculatePoints(pred, result);
    total += pts;
    if (pts === SCORING.EXACT_SCORE) exactCount++;
    if (pts > 0) correctCount++;
  }

  return { total, exactCount, correctCount, finishedCount };
}

// ================================================================
// RENDER: MATCHES
// ================================================================

function renderMatchesView() {
  const container = document.getElementById("matches-container");
  const filter = document.getElementById("group-filter").value;
  const sortMode = document.getElementById("sort-mode")?.value || "group";

  // Aantal voorspellingen tellen
  const totalMatches = MATCHES.length;
  const myPredCount = Object.keys(state.predictions).filter(id =>
    MATCHES.some(m => m.id === id)
  ).length;
  document.getElementById("predictions-summary").textContent =
    `Je hebt ${myPredCount} van de ${totalMatches} groepswedstrijden voorspeld`;

  // Filter eerst
  let matches = filter === "all"
    ? [...MATCHES]
    : MATCHES.filter(m => m.group === filter);

  let html = "";

  if (sortMode === "group") {
    // Per groep gegroepeerd (originele weergave)
    for (const [groupId, groupData] of Object.entries(GROUPS)) {
      if (filter !== "all" && filter !== groupId) continue;

      const groupMatches = MATCHES.filter((m) => m.group === groupId)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      html += `
        <div class="group-section">
          <div class="group-header">
            <h3>${groupData.name}</h3>
            <span class="group-teams">${groupData.teams.map(t => teamFlag(t)).join(' ')}</span>
          </div>
          <div class="match-list">
            ${groupMatches.map(m => renderMatchCard(m)).join("")}
          </div>
        </div>
      `;
    }
  } else if (sortMode === "date") {
    // Chronologisch, gegroepeerd per dag
    const sorted = matches.sort((a, b) => new Date(a.date) - new Date(b.date));
    const byDay = {};
    for (const m of sorted) {
      const dayKey = m.date.substring(0, 10); // YYYY-MM-DD
      if (!byDay[dayKey]) byDay[dayKey] = [];
      byDay[dayKey].push(m);
    }

    for (const [dayKey, dayMatches] of Object.entries(byDay)) {
      const firstMatch = dayMatches[0];
      const dayLabel = formatDateLong(firstMatch.date);
      html += `
        <div class="group-section">
          <div class="group-header">
            <h3>${dayLabel}</h3>
            <span class="group-teams">${dayMatches.length} ${dayMatches.length === 1 ? 'wedstrijd' : 'wedstrijden'}</span>
          </div>
          <div class="match-list">
            ${dayMatches.map(m => renderMatchCard(m)).join("")}
          </div>
        </div>
      `;
    }
  } else if (sortMode === "todo") {
    // Eerst nog te voorspellen (op datum), dan rest
    const sorted = matches.sort((a, b) => new Date(a.date) - new Date(b.date));
    const todo = [];
    const done = [];
    const finished = [];

    for (const m of sorted) {
      const result = state.results[m.id];
      const hasResult = result && result.home != null && result.away != null;
      const pred = state.predictions[m.id];
      const hasPred = pred && pred.home != null;
      const locked = isMatchLocked(m);

      if (hasResult) {
        finished.push(m);
      } else if (hasPred || locked) {
        done.push(m);
      } else {
        todo.push(m);
      }
    }

    if (todo.length > 0) {
      html += `
        <div class="group-section">
          <div class="group-header">
            <h3>Nog te voorspellen</h3>
            <span class="group-teams">${todo.length} ${todo.length === 1 ? 'wedstrijd' : 'wedstrijden'}</span>
          </div>
          <div class="match-list">
            ${todo.map(m => renderMatchCard(m)).join("")}
          </div>
        </div>
      `;
    }
    if (done.length > 0) {
      html += `
        <div class="group-section">
          <div class="group-header">
            <h3>Voorspeld of gesloten</h3>
            <span class="group-teams">${done.length} ${done.length === 1 ? 'wedstrijd' : 'wedstrijden'}</span>
          </div>
          <div class="match-list">
            ${done.map(m => renderMatchCard(m)).join("")}
          </div>
        </div>
      `;
    }
    if (finished.length > 0) {
      html += `
        <div class="group-section">
          <div class="group-header">
            <h3>Afgelopen</h3>
            <span class="group-teams">${finished.length} ${finished.length === 1 ? 'wedstrijd' : 'wedstrijden'}</span>
          </div>
          <div class="match-list">
            ${finished.map(m => renderMatchCard(m)).join("")}
          </div>
        </div>
      `;
    }
    if (todo.length === 0 && done.length === 0 && finished.length === 0) {
      html = `<div class="leaderboard-empty">Geen wedstrijden om weer te geven.</div>`;
    }
  }

  container.innerHTML = html;

  // Event listeners voor score inputs
  container.querySelectorAll(".score-input").forEach((input) => {
    input.addEventListener("input", handleScoreInput);
    input.addEventListener("blur", handleScoreBlur);
  });
}

// Lange datumweergave voor dag-headers
function formatDateLong(isoString) {
  const d = new Date(isoString);
  const dagen = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
  const maanden = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  return `${dagen[d.getDay()]} ${d.getDate()} ${maanden[d.getMonth()]}`;
}

function renderMatchCard(match) {
  const pred = state.predictions[match.id] || {};
  const result = state.results[match.id];
  const hasResult = result && result.home != null && result.away != null;
  const locked = isMatchLocked(match);
  const homeFlag = FLAGS[match.home] || "🏳";
  const awayFlag = FLAGS[match.away] || "🏳";

  let statusHtml = "";
  if (hasResult) {
    const points = calculatePoints(pred, result);
    statusHtml = `
      <div class="match-status">
        <span class="status-tag finished">Officieel</span>
        <span class="actual-result">${result.home} - ${result.away}</span>
        ${pred.home != null ? `<span class="points-earned ${points === 0 ? 'zero' : ''}">${points} ptn</span>` : ''}
      </div>
    `;
  } else if (locked) {
    statusHtml = `<div class="match-status"><span class="status-tag locked">Gesloten</span></div>`;
  } else if (pred.home != null) {
    statusHtml = `<div class="match-status"><span class="status-tag saved">Opgeslagen</span></div>`;
  } else {
    statusHtml = `<div class="match-status"><span class="status-tag unsaved">Nog te voorspellen</span></div>`;
  }

  const disabled = locked || hasResult ? "disabled" : "";
  const cardClass = hasResult ? "finished" : (locked ? "locked" : "");

  return `
    <div class="match-card ${cardClass}" data-match-id="${match.id}">
      <div class="match-meta">
        <span class="match-date">${formatDate(match.date)}</span>
        <span class="match-time">${formatTime(match.date)}</span>
        <span class="match-venue">${match.venue}</span>
      </div>
      <div class="match-teams">
        <div class="team team-home">
          <span>${teamName(match.home)}</span>
          <span class="team-flag">${homeFlag}</span>
        </div>
        <div class="score-input-group">
          <input type="number" min="0" max="20" class="score-input" data-side="home" data-match-id="${match.id}" 
                 value="${pred.home != null ? pred.home : ''}" ${disabled}>
          <span class="score-separator">:</span>
          <input type="number" min="0" max="20" class="score-input" data-side="away" data-match-id="${match.id}"
                 value="${pred.away != null ? pred.away : ''}" ${disabled}>
        </div>
        <div class="team team-away">
          <span class="team-flag">${awayFlag}</span>
          <span>${teamName(match.away)}</span>
        </div>
      </div>
      ${statusHtml}
    </div>
  `;
}

function handleScoreInput(e) {
  // Debounce-save: na 800ms van geen input wordt het opgeslagen
  const matchId = e.target.dataset.matchId;
  const card = e.target.closest(".match-card");
  const homeInput = card.querySelector('.score-input[data-side="home"]');
  const awayInput = card.querySelector('.score-input[data-side="away"]');

  const home = homeInput.value;
  const away = awayInput.value;

  if (home === "" || away === "") return;

  clearTimeout(state.saveTimeout);
  state.saveTimeout = setTimeout(async () => {
    const ok = await savePrediction(matchId, home, away);
    if (ok) {
      // Update status tag
      const statusContainer = card.querySelector(".match-status");
      if (statusContainer && !statusContainer.querySelector(".actual-result")) {
        statusContainer.innerHTML = '<span class="status-tag saved">Opgeslagen</span>';
      }
    }
  }, 800);
}

function handleScoreBlur(e) {
  // Direct opslaan bij blur als beide velden gevuld zijn
  const card = e.target.closest(".match-card");
  const homeInput = card.querySelector('.score-input[data-side="home"]');
  const awayInput = card.querySelector('.score-input[data-side="away"]');

  if (homeInput.value !== "" && awayInput.value !== "") {
    clearTimeout(state.saveTimeout);
    savePrediction(e.target.dataset.matchId, homeInput.value, awayInput.value).then((ok) => {
      if (ok) {
        const statusContainer = card.querySelector(".match-status");
        if (statusContainer && !statusContainer.querySelector(".actual-result")) {
          statusContainer.innerHTML = '<span class="status-tag saved">Opgeslagen</span>';
        }
      }
    });
  }
}

// ================================================================
// RENDER: LEADERBOARD
// ================================================================

function renderLeaderboard() {
  const container = document.getElementById("leaderboard-container");

  const players = Object.entries(state.allPredictions).map(([key, data]) => {
    const stats = calculateUserPoints(key);
    return { key, name: data.name, ...stats };
  });

  // Sorteer op totaal, dan exact, dan correct
  players.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.exactCount !== a.exactCount) return b.exactCount - a.exactCount;
    if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
    return a.name.localeCompare(b.name);
  });

  if (players.length === 0) {
    container.innerHTML = `<div class="leaderboard-empty">Nog geen spelers in de poul. Vraag je vrienden om mee te doen!</div>`;
    return;
  }

  // Check of er al uitslagen zijn
  const resultsCount = Object.values(state.results).filter(r => r && r.home != null).length;
  const hasAnyResults = resultsCount > 0;

  let html = "";
  if (!hasAnyResults) {
    html = `<div class="leaderboard-empty" style="padding: 24px;">
      <p style="margin-bottom: 12px;"><strong>${players.length} ${players.length === 1 ? 'speler' : 'spelers'} in de poul</strong></p>
      <p style="font-size: 13px;">De ranglijst start zodra de eerste uitslag is ingevoerd.</p>
      <div style="margin-top: 20px; font-size: 13px; color: var(--ink-light);">
        ${players.map(p => `<div style="padding: 4px 0;">${p.name === state.currentUser?.name ? '<strong>' + p.name + ' (jij)</strong>' : p.name}, ${Object.keys(state.allPredictions[p.key]?.predictions || {}).length} voorspellingen</div>`).join('')}
      </div>
    </div>`;
  } else {
    players.forEach((p, i) => {
      const isYou = p.key === state.currentUser?.key;
      html += `
        <div class="leaderboard-row ${isYou ? 'you' : ''}">
          <div class="rank">${i + 1}</div>
          <div class="player-name">
            ${p.name}
            ${isYou ? '<span class="you-tag">Jij</span>' : ''}
          </div>
          <div class="player-stats">
            ${p.exactCount} exact, ${p.correctCount} goed<br>
            uit ${p.finishedCount} wedstrijden
          </div>
          <div class="player-points">${p.total}</div>
        </div>
      `;
    });
  }

  container.innerHTML = html;
}

// ================================================================
// RENDER: STANDINGS
// ================================================================

function calculateGroupStandings(groupId) {
  const teams = GROUPS[groupId].teams;
  const stats = {};
  teams.forEach((t) => {
    stats[t] = { team: t, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
  });

  const groupMatches = MATCHES.filter((m) => m.group === groupId);
  for (const match of groupMatches) {
    const result = state.results[match.id];
    if (!result || result.home == null || result.away == null) continue;

    const h = result.home;
    const a = result.away;

    stats[match.home].P++;
    stats[match.away].P++;
    stats[match.home].GF += h;
    stats[match.home].GA += a;
    stats[match.away].GF += a;
    stats[match.away].GA += h;

    if (h > a) {
      stats[match.home].W++;
      stats[match.home].Pts += 3;
      stats[match.away].L++;
    } else if (a > h) {
      stats[match.away].W++;
      stats[match.away].Pts += 3;
      stats[match.home].L++;
    } else {
      stats[match.home].D++;
      stats[match.away].D++;
      stats[match.home].Pts += 1;
      stats[match.away].Pts += 1;
    }
  }

  // Bereken doelsaldo
  Object.values(stats).forEach((s) => {
    s.GD = s.GF - s.GA;
  });

  // Sorteer: punten, doelsaldo, doelpunten voor
  return Object.values(stats).sort((a, b) => {
    if (b.Pts !== a.Pts) return b.Pts - a.Pts;
    if (b.GD !== a.GD) return b.GD - a.GD;
    if (b.GF !== a.GF) return b.GF - a.GF;
    return a.team.localeCompare(b.team);
  });
}

function renderStandings() {
  const container = document.getElementById("standings-container");
  let html = "";

  for (const [groupId, groupData] of Object.entries(GROUPS)) {
    const standings = calculateGroupStandings(groupId);
    html += `
      <div class="standing-group">
        <div class="standing-group-header">${groupData.name}</div>
        <table class="standing-table">
          <thead>
            <tr>
              <th style="text-align:left">Team</th>
              <th>P</th><th>W</th><th>G</th><th>V</th>
              <th>+/-</th><th>Ptn</th>
            </tr>
          </thead>
          <tbody>
            ${standings.map((s, i) => `
              <tr class="${i < 2 ? 'qualified' : ''}">
                <td class="team-cell">${teamFlag(s.team)} ${teamName(s.team)}</td>
                <td>${s.P}</td>
                <td>${s.W}</td>
                <td>${s.D}</td>
                <td>${s.L}</td>
                <td>${s.GD > 0 ? '+' : ''}${s.GD}</td>
                <td class="points-cell">${s.Pts}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  container.innerHTML = html;
}

// ================================================================
// RENDER: ADMIN
// ================================================================

// ================================================================
// RENDER: KNOCKOUT
// ================================================================

function renderKnockoutView() {
  const container = document.getElementById("knockout-container");
  const summaryEl = document.getElementById("knockout-summary");

  // Tel hoeveel knockout wedstrijden je hebt voorspeld
  const koMatchIds = KO_MATCHES.map(m => m.id);
  const koPredCount = koMatchIds.filter(id => state.predictions[id] != null).length;
  summaryEl.textContent = `Je hebt ${koPredCount} van de ${KO_MATCHES.length} knockout wedstrijden voorspeld`;

  // Render per ronde
  const rounds = ['R32', 'R16', 'QF', 'SF', 'TF', 'F'];
  let html = "";

  for (const round of rounds) {
    const open = isRoundOpen(round, state.results);
    const roundMatches = KO_MATCHES.filter(m => m.round === round);
    const roundName = KO_ROUND_NAMES[round];

    html += `
      <div class="ko-section ${open ? '' : 'ko-locked'}">
        <div class="ko-section-header">
          <h3>${roundName}</h3>
          ${open ? '<span class="ko-status open">Open</span>' : '<span class="ko-status closed">Nog niet beschikbaar</span>'}
        </div>
    `;

    if (!open) {
      html += `<p class="ko-locked-msg">Deze ronde komt beschikbaar zodra de voorgaande ronde compleet is.</p>`;
    } else {
      html += `<div class="match-list">`;
      for (const koMatch of roundMatches) {
        html += renderKoMatchCard(koMatch);
      }
      html += `</div>`;
    }

    html += `</div>`;
  }

  container.innerHTML = html;

  // Wire up score inputs
  container.querySelectorAll(".score-input").forEach((input) => {
    input.addEventListener("input", handleScoreInput);
    input.addEventListener("blur", handleScoreBlur);
  });
}

function renderKoMatchCard(koMatch) {
  const pred = state.predictions[koMatch.id] || {};
  const result = state.results[koMatch.id];
  const hasResult = result && result.home != null && result.away != null;
  const locked = isMatchLocked(koMatch);

  const homeResolved = resolveSlot(koMatch.home, state.results);
  const awayResolved = resolveSlot(koMatch.away, state.results);

  const homeDisplay = homeResolved.team
    ? `<span class="team-flag">${teamFlag(homeResolved.team)}</span> <span>${teamName(homeResolved.team)}</span>`
    : `<span class="team-placeholder">${formatPlaceholder(koMatch.home)}</span>`;

  const awayDisplay = awayResolved.team
    ? `<span>${teamName(awayResolved.team)}</span> <span class="team-flag">${teamFlag(awayResolved.team)}</span>`
    : `<span class="team-placeholder">${formatPlaceholder(koMatch.away)}</span>`;

  // Je kunt alleen voorspellen als beide teams bekend zijn
  const canPredict = homeResolved.team && awayResolved.team && !hasResult && !locked;
  const disabled = !canPredict ? "disabled" : "";

  let statusHtml = "";
  if (hasResult) {
    const points = calculatePoints(pred, result);
    statusHtml = `
      <div class="match-status">
        <span class="status-tag finished">Officieel</span>
        <span class="actual-result">${result.home} - ${result.away}</span>
        ${pred.home != null ? `<span class="points-earned ${points === 0 ? 'zero' : ''}">${points} ptn</span>` : ''}
      </div>
    `;
  } else if (!homeResolved.team || !awayResolved.team) {
    statusHtml = `<div class="match-status"><span class="status-tag locked">Teams nog onbekend</span></div>`;
  } else if (locked) {
    statusHtml = `<div class="match-status"><span class="status-tag locked">Gesloten</span></div>`;
  } else if (pred.home != null) {
    statusHtml = `<div class="match-status"><span class="status-tag saved">Opgeslagen</span></div>`;
  } else {
    statusHtml = `<div class="match-status"><span class="status-tag unsaved">Te voorspellen</span></div>`;
  }

  const cardClass = hasResult ? "finished" : (locked || !canPredict ? "locked" : "");

  return `
    <div class="match-card ${cardClass}" data-match-id="${koMatch.id}">
      <div class="match-meta">
        <span class="match-date">${formatDate(koMatch.date)}</span>
        <span class="match-time">${formatTime(koMatch.date)}</span>
        <span class="match-venue">${koMatch.venue}</span>
      </div>
      <div class="match-teams">
        <div class="team team-home">${homeDisplay}</div>
        <div class="score-input-group">
          <input type="number" min="0" max="20" class="score-input" data-side="home" data-match-id="${koMatch.id}"
                 value="${pred.home != null ? pred.home : ''}" ${disabled}>
          <span class="score-separator">:</span>
          <input type="number" min="0" max="20" class="score-input" data-side="away" data-match-id="${koMatch.id}"
                 value="${pred.away != null ? pred.away : ''}" ${disabled}>
        </div>
        <div class="team team-away">${awayDisplay}</div>
      </div>
      ${statusHtml}
    </div>
  `;
}

// Format placeholder voor weergave: "1A" -> "Winnaar A", "3ABCDF" -> "3e uit A/B/C/D/F", "W:R32-1" -> "Winnaar R32-1"
function formatPlaceholder(placeholder) {
  if (!placeholder) return '';
  if (placeholder.startsWith('W:')) return `Winnaar ${placeholder.substring(2)}`;
  if (placeholder.startsWith('L:')) return `Verliezer ${placeholder.substring(2)}`;
  if (/^1[A-L]$/.test(placeholder)) return `Winnaar ${placeholder[1]}`;
  if (/^2[A-L]$/.test(placeholder)) return `Nr 2 ${placeholder[1]}`;
  if (placeholder.startsWith('3')) {
    const groups = placeholder.substring(1).split('').join('/');
    return `3e uit ${groups}`;
  }
  return placeholder;
}


function renderAdmin() {
  const adminUnlock = document.getElementById("admin-unlock");
  const adminPanel = document.getElementById("admin-panel");

  if (!state.isAdmin) {
    adminUnlock.style.display = "block";
    adminPanel.style.display = "none";
    return;
  }

  adminUnlock.style.display = "none";
  adminPanel.style.display = "block";

  const container = document.getElementById("admin-matches-container");
  
  // Sync controls bovenaan
  let syncControls = `
    <div class="sync-panel">
      <div class="sync-header">
        <div>
          <h3>Automatische uitslagen</h3>
          <p class="sync-desc">Haal uitslagen direct op uit openfootball/worldcup.json (gratis open data, geen API-key nodig).</p>
        </div>
      </div>
      <div class="sync-actions">
        <button id="sync-now-btn" class="btn-primary">Nu synchroniseren</button>
        <button id="autosync-toggle" class="btn-primary">${state.autoSyncEnabled ? 'Auto-sync uitzetten' : 'Auto-sync aanzetten'}</button>
      </div>
      <div id="sync-status" class="sync-status">Nog niet gesynchroniseerd</div>
    </div>
  `;
  
  let html = syncControls;

  for (const [groupId, groupData] of Object.entries(GROUPS)) {
    const groupMatches = MATCHES.filter((m) => m.group === groupId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    html += `
      <div class="group-section" style="margin-bottom: 24px;">
        <div class="group-header">
          <h3>${groupData.name}</h3>
        </div>
        <div class="match-list">
          ${groupMatches.map((m) => {
            const result = state.results[m.id] || {};
            const h = result.home != null ? result.home : "";
            const a = result.away != null ? result.away : "";
            return `
              <div class="match-card" data-match-id="${m.id}">
                <div class="match-meta">
                  <span class="match-date">${formatDate(m.date)}</span>
                </div>
                <div class="match-teams">
                  <div class="team team-home">
                    <span>${teamName(m.home)}</span>
                    <span class="team-flag">${teamFlag(m.home)}</span>
                  </div>
                  <div class="score-input-group">
                    <input type="number" min="0" max="20" class="score-input admin-result-input" 
                           data-side="home" data-match-id="${m.id}" value="${h}">
                    <span class="score-separator">:</span>
                    <input type="number" min="0" max="20" class="score-input admin-result-input"
                           data-side="away" data-match-id="${m.id}" value="${a}">
                  </div>
                  <div class="team team-away">
                    <span class="team-flag">${teamFlag(m.away)}</span>
                    <span>${teamName(m.away)}</span>
                  </div>
                </div>
                <div class="match-status">
                  <span class="status-tag ${result.home != null ? 'saved' : 'unsaved'}">
                    ${result.home != null ? 'Vastgelegd' : 'Geen uitslag'}
                  </span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  // Knockout sectie in admin
  const koRounds = ['R32', 'R16', 'QF', 'SF', 'TF', 'F'];
  for (const round of koRounds) {
    const roundMatches = KO_MATCHES.filter(m => m.round === round)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    html += `
      <div class="group-section" style="margin-bottom: 24px;">
        <div class="group-header">
          <h3>${KO_ROUND_NAMES[round]}</h3>
        </div>
        <div class="match-list">
          ${roundMatches.map((m) => {
            const result = state.results[m.id] || {};
            const h = result.home != null ? result.home : "";
            const a = result.away != null ? result.away : "";
            const homeResolved = resolveSlot(m.home, state.results);
            const awayResolved = resolveSlot(m.away, state.results);
            const homeText = homeResolved.team ? teamName(homeResolved.team) : formatPlaceholder(m.home);
            const awayText = awayResolved.team ? teamName(awayResolved.team) : formatPlaceholder(m.away);
            return `
              <div class="match-card" data-match-id="${m.id}">
                <div class="match-meta">
                  <span class="match-date">${formatDate(m.date)}</span>
                </div>
                <div class="match-teams">
                  <div class="team team-home">
                    <span>${homeText}</span>
                    ${homeResolved.team ? `<span class="team-flag">${teamFlag(homeResolved.team)}</span>` : ''}
                  </div>
                  <div class="score-input-group">
                    <input type="number" min="0" max="20" class="score-input admin-result-input"
                           data-side="home" data-match-id="${m.id}" value="${h}">
                    <span class="score-separator">:</span>
                    <input type="number" min="0" max="20" class="score-input admin-result-input"
                           data-side="away" data-match-id="${m.id}" value="${a}">
                  </div>
                  <div class="team team-away">
                    ${awayResolved.team ? `<span class="team-flag">${teamFlag(awayResolved.team)}</span>` : ''}
                    <span>${awayText}</span>
                  </div>
                </div>
                <div class="match-status">
                  <span class="status-tag ${result.home != null ? 'saved' : 'unsaved'}">
                    ${result.home != null ? 'Vastgelegd' : 'Geen uitslag'}
                  </span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;

  // Event listeners voor uitslag invoer
  container.querySelectorAll(".admin-result-input").forEach((input) => {
    input.addEventListener("blur", handleAdminResultBlur);
  });

  // Wire up sync buttons
  const syncBtn = document.getElementById("sync-now-btn");
  if (syncBtn) syncBtn.addEventListener("click", () => runAutoSync(false));
  
  const toggleBtn = document.getElementById("autosync-toggle");
  if (toggleBtn) toggleBtn.addEventListener("click", toggleAutoSync);

  updateSyncStatus(null);
}

function handleAdminResultBlur(e) {
  const card = e.target.closest(".match-card");
  const homeInput = card.querySelector('.admin-result-input[data-side="home"]');
  const awayInput = card.querySelector('.admin-result-input[data-side="away"]');
  const matchId = e.target.dataset.matchId;

  const home = homeInput.value;
  const away = awayInput.value;

  // Allebei leeg: verwijder uitslag
  if (home === "" && away === "") {
    saveResult(matchId, "", "").then((ok) => {
      if (ok) {
        const statusTag = card.querySelector(".status-tag");
        if (statusTag) {
          statusTag.textContent = "Geen uitslag";
          statusTag.className = "status-tag unsaved";
        }
      }
    });
    return;
  }

  // Beide moeten gevuld zijn
  if (home === "" || away === "") return;

  saveResult(matchId, home, away).then((ok) => {
    if (ok) {
      const statusTag = card.querySelector(".status-tag");
      if (statusTag) {
        statusTag.textContent = "Vastgelegd";
        statusTag.className = "status-tag saved";
      }
      showBanner(`Uitslag opgeslagen: ${home}-${away}`, "success", 1500);
    }
  });
}

// ================================================================
// VIEW SWITCHING
// ================================================================

let currentView = "matches";

function switchView(view) {
  currentView = view;
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((v) => {
    v.classList.toggle("active", v.id === `view-${view}`);
  });
  renderCurrentView();
}

function renderCurrentView() {
  if (!state.currentUser) return;
  if (currentView === "matches") renderMatchesView();
  else if (currentView === "knockout") renderKnockoutView();
  else if (currentView === "leaderboard") renderLeaderboard();
  else if (currentView === "standings") renderStandings();
  else if (currentView === "admin") renderAdmin();
}

// ================================================================
// INIT
// ================================================================

function showScreen(screenId) {
  ["login-screen", "loading-screen", "main-app"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("active", id === screenId);
  });
}

function showMainApp() {
  showScreen("main-app");
  document.getElementById("current-user-name").textContent = state.currentUser.name;
  document.getElementById("pool-name-header").textContent = POOL_NAME;

  // Start countdown als die geconfigureerd is
  initCountdown();

  subscribeToResults();
  subscribeToAllPredictions();

  renderCurrentView();
}

// ================================================================
// COUNTDOWN naar weekendje weg
// ================================================================
let countdownInterval = null;

function initCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;

  // Geen datum of label ingesteld? Verberg de countdown
  if (!COUNTDOWN_DATE) {
    el.style.display = "none";
    return;
  }

  // Label updaten
  const labelEl = el.querySelector(".countdown-label");
  if (labelEl && COUNTDOWN_LABEL) labelEl.textContent = COUNTDOWN_LABEL;

  // Update direct + elke minuut
  updateCountdown();
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(updateCountdown, 60 * 1000);
}

function updateCountdown() {
  const el = document.getElementById("countdown");
  if (!el || !COUNTDOWN_DATE) return;

  const target = new Date(COUNTDOWN_DATE).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    // Datum is al verstreken
    el.innerHTML = `<div class="countdown-label">Het weekendje is begonnen!</div>`;
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    return;
  }

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const mins = totalMinutes % 60;

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");

  if (daysEl) daysEl.textContent = days;
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minsEl) minsEl.textContent = String(mins).padStart(2, "0");
}

function init() {
  // Pool naam in login scherm
  document.getElementById("pool-name-display").textContent = POOL_NAME;

  // Check Firebase config
  if (!firebaseReady) {
    document.querySelector(".login-card").innerHTML = `
      <h2 style="color: var(--accent);">Firebase nog niet ingesteld</h2>
      <p style="margin-top: 12px; color: var(--ink-soft); line-height: 1.6;">
        Voordat de poul werkt moet je Firebase configureren in <code>config.js</code>. 
        Lees de instructies in <code>README.md</code>.
      </p>
    `;
    return;
  }

  // Login/registratie form
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name-input").value;
    const password = document.getElementById("password-input").value;
    const mode = document.querySelector(".auth-tab.active").dataset.mode;
    const btn = e.target.querySelector("button[type='submit']");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Bezig...";

    const ok = mode === "register"
      ? await registerUser(name, password)
      : await loginUser(name, password);

    btn.disabled = false;
    btn.textContent = originalText;
    if (ok) showMainApp();
  });

  // Tab toggle tussen Inloggen en Nieuw account
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const mode = tab.dataset.mode;
      const submitBtn = document.querySelector("#login-form button[type='submit']");
      const hint = document.getElementById("password-hint");
      if (mode === "register") {
        submitBtn.textContent = "Account aanmaken";
        hint.textContent = "Kies een wachtwoord (minstens 4 tekens). Onthoud het goed!";
      } else {
        submitBtn.textContent = "Inloggen";
        hint.textContent = "Vul je wachtwoord in om in te loggen.";
      }
    });
  });

  // Logout
  document.getElementById("logout-btn").addEventListener("click", logout);

  // Tab switching
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });

  // Group filter
  document.getElementById("group-filter").addEventListener("change", () => {
    if (currentView === "matches") renderMatchesView();
  });

  // Sort mode
  const sortModeEl = document.getElementById("sort-mode");
  if (sortModeEl) {
    sortModeEl.addEventListener("change", () => {
      if (currentView === "matches") renderMatchesView();
    });
  }

  // Admin login
  document.getElementById("admin-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const pw = document.getElementById("admin-password").value;
    if (pw === ADMIN_PASSWORD) {
      state.isAdmin = true;
      // Herstel auto-sync als die eerder aanstond
      const wasEnabled = localStorage.getItem("wk2026-autosync") === "true";
      if (wasEnabled && !state.autoSyncInterval) {
        runAutoSync(true);
        state.autoSyncInterval = setInterval(() => runAutoSync(true), 5 * 60 * 1000);
        state.autoSyncEnabled = true;
      }
      renderAdmin();
      showBanner("Beheer geopend" + (wasEnabled ? ", auto-sync hervat" : ""), "success");
    } else {
      showBanner("Onjuist wachtwoord", "error");
    }
  });

  // Auto login als opgeslagen sessie geldig is
  const saved = tryAutoLogin();
  if (saved) {
    // Loading-screen is al actief via inline script in HTML
    resumeSession(saved).then((ok) => {
      if (ok) {
        showMainApp();
      } else {
        // Sessie niet geldig, val terug op loginscherm
        showScreen("login-screen");
      }
    });
  }
}

init();
