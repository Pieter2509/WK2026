// ================================================================
// Live score sync: API-Football als primair, openfootball als fallback
//
// API-Football (https://www.api-football.com)
// - Pro plan: 7500 calls/dag, real-time updates elke 15 seconden
// - Vereist API key in config.js (API_FOOTBALL_KEY)
//
// Openfootball (https://github.com/openfootball/worldcup.json)
// - Gratis backup voor als API-Football faalt
// ================================================================

import { MATCHES, TEAMS } from "./data.js";
import { KO_MATCHES, resolveSlot } from "./knockout.js";
import { API_FOOTBALL_KEY } from "./config.js";

const API_FOOTBALL_URL = "https://v3.football.api-sports.io/fixtures";
const WORLD_CUP_LEAGUE_ID = 1;
const WORLD_CUP_SEASON = 2026;

const OPENFOOTBALL_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

const ALIASES = {
  "Korea Republic":              "South Korea",
  "Korea, South":                "South Korea",
  "Czech Republic":              "Czechia",
  "Turkey":                      "Türkiye",
  "Turkiye":                     "Türkiye",
  "USA":                         "United States",
  "United States of America":    "United States",
  "Côte d'Ivoire":               "Ivory Coast",
  "Cote d'Ivoire":               "Ivory Coast",
  "Cabo Verde":                  "Cape Verde",
  "Congo DR":                    "DR Congo",
  "Democratic Republic of Congo":"DR Congo",
  "Bosnia-Herzegovina":          "Bosnia and Herzegovina",
  "Bosnia & Herzegovina":        "Bosnia and Herzegovina",
  "Curacao":                     "Curaçao",
};

function normalizeTeam(name) {
  if (!name) return null;
  const trimmed = name.trim();
  if (TEAMS[trimmed]) return trimmed;
  if (ALIASES[trimmed]) return ALIASES[trimmed];
  return null;
}

// ================================================================
// API-FOOTBALL fetcher (primair)
// ================================================================

async function fetchApiFootballResults() {
  if (!API_FOOTBALL_KEY || API_FOOTBALL_KEY === "VUL-HIER-IN") {
    throw new Error("Geen API-Football key geconfigureerd");
  }

  const url = `${API_FOOTBALL_URL}?league=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}`;
  
  const response = await fetch(url, {
    headers: {
      "x-apisports-key": API_FOOTBALL_KEY,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API-Football error: HTTP ${response.status}`);
  }

  const data = await response.json();
  
  // Check op errors van API-Football
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(`API-Football errors: ${JSON.stringify(data.errors)}`);
  }
  
  const fixtures = data.response || [];
  
  if (typeof console !== "undefined") {
    const statusCounts = {};
    fixtures.forEach(fx => {
      const s = fx.fixture?.status?.short || "unknown";
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
    console.log("[API-Football] Fixtures opgehaald:", fixtures.length, "Statussen:", statusCounts);
  }
  
  return fixtures;
}

function matchApiFootballToInternal(fixture, allResults = {}) {
  const teams = fixture.teams || {};
  const goals = fixture.goals || {};
  const status = fixture.fixture?.status?.short;
  
  // Alleen wedstrijden die zijn afgelopen (FT = Full Time, AET = After Extra Time, PEN = Penalties)
  const FINISHED_STATUSES = ["FT", "AET", "PEN"];
  if (!FINISHED_STATUSES.includes(status)) return null;
  
  if (goals.home == null || goals.away == null) return null;
  
  const home = normalizeTeam(teams.home?.name);
  const away = normalizeTeam(teams.away?.name);
  if (!home || !away) {
    if (typeof console !== "undefined") {
      console.warn("[API-Football] Onbekende teams:", teams.home?.name, "vs", teams.away?.name);
    }
    return null;
  }

  // 1. Groepsfase
  const groupMatch = MATCHES.find((m) =>
    (m.home === home && m.away === away) ||
    (m.home === away && m.away === home)
  );

  if (groupMatch) {
    let hScore, aScore;
    if (groupMatch.home === home) {
      hScore = goals.home; aScore = goals.away;
    } else {
      hScore = goals.away; aScore = goals.home;
    }
    return { matchId: groupMatch.id, home: hScore, away: aScore };
  }

  // 2. Knockout via bracket resolution
  for (const ko of KO_MATCHES) {
    const homeR = resolveSlot(ko.home, allResults);
    const awayR = resolveSlot(ko.away, allResults);
    if (!homeR.team || !awayR.team) continue;

    if ((homeR.team === home && awayR.team === away) ||
        (homeR.team === away && awayR.team === home)) {
      let hScore, aScore;
      if (homeR.team === home) {
        hScore = goals.home; aScore = goals.away;
      } else {
        hScore = goals.away; aScore = goals.home;
      }
      return { matchId: ko.id, home: hScore, away: aScore };
    }
  }

  return null;
}

// ================================================================
// OPENFOOTBALL fetcher (fallback)
// ================================================================

async function fetchOpenfootballResults() {
  const response = await fetch(OPENFOOTBALL_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Openfootball error: HTTP ${response.status}`);
  }
  return response.json();
}

function matchOpenfootballToInternal(ofMatch, allResults = {}) {
  if (!ofMatch.score || !ofMatch.score.ft) return null;

  const team1 = normalizeTeam(ofMatch.team1);
  const team2 = normalizeTeam(ofMatch.team2);
  if (!team1 || !team2) return null;

  const [ft1, ft2] = ofMatch.score.ft;
  if (ft1 == null || ft2 == null) return null;

  const groupMatch = MATCHES.find((m) =>
    (m.home === team1 && m.away === team2) ||
    (m.home === team2 && m.away === team1)
  );

  if (groupMatch) {
    let home, away;
    if (groupMatch.home === team1) {
      home = ft1; away = ft2;
    } else {
      home = ft2; away = ft1;
    }
    return { matchId: groupMatch.id, home, away };
  }

  for (const ko of KO_MATCHES) {
    const homeR = resolveSlot(ko.home, allResults);
    const awayR = resolveSlot(ko.away, allResults);
    if (!homeR.team || !awayR.team) continue;

    if ((homeR.team === team1 && awayR.team === team2) ||
        (homeR.team === team2 && awayR.team === team1)) {
      let home, away;
      if (homeR.team === team1) {
        home = ft1; away = ft2;
      } else {
        home = ft2; away = ft1;
      }
      return { matchId: ko.id, home, away };
    }
  }

  return null;
}

// ================================================================
// HOOFDFUNCTIE
// ================================================================

export async function syncResults(existingResults = {}) {
  const updates = [];
  const errors = [];
  let source = "none";

  // 1. API-Football
  try {
    const fixtures = await fetchApiFootballResults();
    source = "api-football";
    
    for (const fx of fixtures) {
      const mapped = matchApiFootballToInternal(fx, existingResults);
      if (mapped) {
        const existing = existingResults[mapped.matchId];
        const hasChanged = !existing || 
          existing.home !== mapped.home || 
          existing.away !== mapped.away;
        if (hasChanged) {
          updates.push(mapped);
        }
      }
    }
    
    return { source, updates, errors };
  } catch (err) {
    errors.push(`API-Football faalde: ${err.message}`);
    console.warn("API-Football faalde, probeer openfootball fallback:", err.message);
  }

  // 2. Openfootball fallback
  try {
    const data = await fetchOpenfootballResults();
    source = "openfootball";
    
    if (data && data.matches) {
      for (const ofMatch of data.matches) {
        const mapped = matchOpenfootballToInternal(ofMatch, existingResults);
        if (mapped) {
          const existing = existingResults[mapped.matchId];
          const hasChanged = !existing || 
            existing.home !== mapped.home || 
            existing.away !== mapped.away;
          if (hasChanged) {
            updates.push(mapped);
          }
        }
      }
    }
    
    return { source, updates, errors };
  } catch (err) {
    errors.push(`Openfootball faalde: ${err.message}`);
    return { source: "none", updates, errors };
  }
}
