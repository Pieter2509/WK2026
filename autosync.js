// ================================================================
// Live score sync: football-data.org als primair, openfootball als fallback
//
// Football-Data.org (https://www.football-data.org)
// - Gratis tier: 10 calls per minuut, inclusief WK 2026 (competition WC)
// - Updates binnen enkele minuten na een wedstrijd
// - Vereist API token in config.js (FOOTBALL_DATA_TOKEN)
//
// Openfootball (https://github.com/openfootball/worldcup.json)
// - Gratis, geen key
// - Vertraging 1-24 uur (handmatige updates)
// - Backup voor als football-data.org faalt
// ================================================================

import { MATCHES, TEAMS } from "./data.js";
import { KO_MATCHES, resolveSlot } from "./knockout.js";
import { FOOTBALL_DATA_TOKEN } from "./config.js";

const FOOTBALL_DATA_URL = "https://api.football-data.org/v4/competitions/WC/matches";
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
// FOOTBALL-DATA.ORG fetcher (primair)
// ================================================================

async function fetchFootballDataResults() {
  if (!FOOTBALL_DATA_TOKEN || FOOTBALL_DATA_TOKEN === "VUL-HIER-IN") {
    throw new Error("Geen Football-Data.org token geconfigureerd");
  }

  const response = await fetch(FOOTBALL_DATA_URL, {
    headers: {
      "X-Auth-Token": FOOTBALL_DATA_TOKEN,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(`Rate limit bereikt (429). Probeer over een minuut opnieuw.`);
    }
    if (response.status === 403) {
      throw new Error(`Geen toegang (403). Check je API token.`);
    }
    throw new Error(`Football-Data.org error: HTTP ${response.status}`);
  }

  const data = await response.json();
  const matches = data.matches || [];
  
  if (typeof console !== "undefined") {
    const statusCounts = {};
    matches.forEach(m => {
      const s = m.status || "unknown";
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
    console.log("[Football-Data.org] Matches opgehaald:", matches.length, "Statussen:", statusCounts);
  }
  
  return matches;
}

function matchFootballDataToInternal(fdMatch, allResults = {}) {
  if (fdMatch.status !== "FINISHED") return null;
  
  const score = fdMatch.score?.fullTime;
  if (!score || score.home == null || score.away == null) return null;
  
  const home = normalizeTeam(fdMatch.homeTeam?.name);
  const away = normalizeTeam(fdMatch.awayTeam?.name);
  if (!home || !away) {
    if (typeof console !== "undefined") {
      console.warn("[Football-Data.org] Onbekende teams:", fdMatch.homeTeam?.name, "vs", fdMatch.awayTeam?.name);
    }
    return null;
  }

  const groupMatch = MATCHES.find((m) =>
    (m.home === home && m.away === away) ||
    (m.home === away && m.away === home)
  );

  if (groupMatch) {
    let hScore, aScore;
    if (groupMatch.home === home) {
      hScore = score.home; aScore = score.away;
    } else {
      hScore = score.away; aScore = score.home;
    }
    return { matchId: groupMatch.id, home: hScore, away: aScore };
  }

  for (const ko of KO_MATCHES) {
    const homeR = resolveSlot(ko.home, allResults);
    const awayR = resolveSlot(ko.away, allResults);
    if (!homeR.team || !awayR.team) continue;

    if ((homeR.team === home && awayR.team === away) ||
        (homeR.team === away && awayR.team === home)) {
      let hScore, aScore;
      if (homeR.team === home) {
        hScore = score.home; aScore = score.away;
      } else {
        hScore = score.away; aScore = score.home;
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
// ================================================================

export async function syncResults(existingResults = {}) {
  const updates = [];
  const errors = [];
  let source = "none";

  try {
    const matches = await fetchFootballDataResults();
    source = "football-data";
    
    for (const fdMatch of matches) {
      const mapped = matchFootballDataToInternal(fdMatch, existingResults);
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
    errors.push(`Football-Data.org faalde: ${err.message}`);
    console.warn("Football-Data.org faalde, probeer openfootball fallback:", err.message);
  }

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
