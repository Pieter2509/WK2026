// ================================================================
// Live score sync: API-Football als primair, openfootball als fallback
// 
// API-Football (https://www.api-football.com)
// - Gratis tier: 100 calls per dag
// - Realtime scores (binnen 1 minuut)
// - Vereist API key in config.js (API_FOOTBALL_KEY)
//
// Openfootball (https://github.com/openfootball/worldcup.json)
// - Gratis, geen key
// - Vertraging 1-24 uur (handmatige updates)
// - Backup voor als API-Football faalt
// ================================================================

import { MATCHES, TEAMS } from "./data.js";
import { KO_MATCHES, resolveSlot } from "./knockout.js";
import { API_FOOTBALL_KEY } from "./config.js";

// API-Football endpoints
const API_FOOTBALL_URL = "https://v3.football.api-sports.io/fixtures";
const WORLD_CUP_LEAGUE_ID = 1;
const WORLD_CUP_SEASON = 2026;

// Openfootball backup
const OPENFOOTBALL_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

// Aliases: variaties die externe bronnen mogelijk gebruiken -> onze canonieke naam
const ALIASES = {
  // openfootball variaties
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
  // API-Football kan deze gebruiken
  "South Korea":                 "South Korea",
  "Czechia":                     "Czechia",
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

  // Haal alle fixtures van WK 2026 die FT (full time) zijn
  const url = `${API_FOOTBALL_URL}?league=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}&status=FT-AET-PEN`;
  
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
  
  // Check op rate limit issues of error messages
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(`API-Football errors: ${JSON.stringify(data.errors)}`);
  }
  
  return data.response || [];
}

// Match een API-Football fixture aan onze interne wedstrijd-ID
function matchApiFootballToInternal(fixture, allResults = {}) {
  const teams = fixture.teams || {};
  const goals = fixture.goals || {};
  
  if (goals.home == null || goals.away == null) return null;
  
  const home = normalizeTeam(teams.home?.name);
  const away = normalizeTeam(teams.away?.name);
  if (!home || !away) return null;

  // 1. Probeer groepsfase (match op exact home/away combinatie)
  const groupMatch = MATCHES.find((m) =>
    (m.home === home && m.away === away) ||
    (m.home === away && m.away === home)
  );

  if (groupMatch) {
    let hScore, aScore;
    if (groupMatch.home === home) {
      hScore = goals.home;
      aScore = goals.away;
    } else {
      hScore = goals.away;
      aScore = goals.home;
    }
    return { matchId: groupMatch.id, home: hScore, away: aScore };
  }

  // 2. Probeer knockout via bracket resolution
  for (const ko of KO_MATCHES) {
    const homeR = resolveSlot(ko.home, allResults);
    const awayR = resolveSlot(ko.away, allResults);
    if (!homeR.team || !awayR.team) continue;

    if ((homeR.team === home && awayR.team === away) ||
        (homeR.team === away && awayR.team === home)) {
      let hScore, aScore;
      if (homeR.team === home) {
        hScore = goals.home;
        aScore = goals.away;
      } else {
        hScore = goals.away;
        aScore = goals.home;
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
// HOOFDFUNCTIE: syncResults
// Probeert eerst API-Football, valt terug op openfootball als dat faalt
// Returns: { source, updates: [{matchId, home, away}], errors: [] }
// ================================================================

export async function syncResults(existingResults = {}) {
  const updates = [];
  const errors = [];
  let source = "none";

  // 1. PROBEER API-FOOTBALL EERST
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

  // 2. FALLBACK: OPENFOOTBALL
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
