// ================================================================
// Auto-sync uitslagen van openfootball/worldcup.json
// Gratis, open data, geen API-key nodig, public domain (CC0)
// Bron: https://github.com/openfootball/worldcup.json
//
// Sinds we Engels intern gebruiken, is matching nu rechtstreeks.
// Alleen kleine aliases nodig voor variaties in spelling.
// ================================================================

import { MATCHES, TEAMS } from "./data.js";
import { KO_MATCHES, resolveSlot } from "./knockout.js";

const OPENFOOTBALL_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

// Aliases: variaties die openfootball mogelijk gebruikt -> onze canonieke naam
// Direct gematchte namen hoeven niet in deze map (bv "Netherlands" -> "Netherlands")
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
  "DR Congo":                    "DR Congo",
  "Democratic Republic of Congo":"DR Congo",
  "Bosnia-Herzegovina":          "Bosnia and Herzegovina",
  "Bosnia & Herzegovina":        "Bosnia and Herzegovina",
  "Curacao":                     "Curaçao",
};

// Normaliseer een naam naar onze canonieke vorm
function normalizeTeam(name) {
  if (!name) return null;
  const trimmed = name.trim();
  // Direct match in TEAMS? Klaar.
  if (TEAMS[trimmed]) return trimmed;
  // Alias? Vertaal door.
  if (ALIASES[trimmed]) return ALIASES[trimmed];
  // Onbekend
  return null;
}

// Haal de openfootball data op
export async function fetchOfficialResults() {
  const response = await fetch(OPENFOOTBALL_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Kon openfootball data niet ophalen: HTTP ${response.status}`);
  }
  return response.json();
}

// Match een openfootball wedstrijd aan onze interne wedstrijd-ID
// Probeert eerst groepsfase, dan knockout (waar teams via bracket resolven)
// Returns { matchId, home, away } of null als geen match
export function matchOpenfootballToInternal(ofMatch, allResults = {}) {
  if (!ofMatch.score || !ofMatch.score.ft) return null;

  const team1 = normalizeTeam(ofMatch.team1);
  const team2 = normalizeTeam(ofMatch.team2);
  if (!team1 || !team2) return null;

  const [ft1, ft2] = ofMatch.score.ft;
  if (ft1 == null || ft2 == null) return null;

  // 1. Probeer groepsfase
  const groupMatch = MATCHES.find((m) =>
    (m.home === team1 && m.away === team2) ||
    (m.home === team2 && m.away === team1)
  );

  if (groupMatch) {
    let home, away;
    if (groupMatch.home === team1) {
      home = ft1;
      away = ft2;
    } else {
      home = ft2;
      away = ft1;
    }
    return { matchId: groupMatch.id, home, away };
  }

  // 2. Probeer knockout: resolve placeholders en zoek match
  for (const ko of KO_MATCHES) {
    const homeR = resolveSlot(ko.home, allResults);
    const awayR = resolveSlot(ko.away, allResults);
    if (!homeR.team || !awayR.team) continue;

    if ((homeR.team === team1 && awayR.team === team2) ||
        (homeR.team === team2 && awayR.team === team1)) {
      let home, away;
      if (homeR.team === team1) {
        home = ft1;
        away = ft2;
      } else {
        home = ft2;
        away = ft1;
      }
      return { matchId: ko.id, home, away };
    }
  }

  return null;
}

// Hoofdfunctie: synchroniseer uitslagen
// existingResults: huidige results in Firestore { matchId: {home, away} }
// onUpdate: callback (matchId, home, away) voor elke nieuwe/gewijzigde uitslag
// Returns: { synced: N, skipped: N, unmatched: N, errors: [] }
export async function syncResults(existingResults, onUpdate) {
  const stats = { synced: 0, skipped: 0, unmatched: 0, errors: [], unmatchedMatches: [] };

  let data;
  try {
    data = await fetchOfficialResults();
  } catch (err) {
    stats.errors.push(err.message);
    return stats;
  }

  if (!data.matches || !Array.isArray(data.matches)) {
    stats.errors.push("Onverwacht data formaat van openfootball");
    return stats;
  }

  for (const ofMatch of data.matches) {
    if (!ofMatch.score || !ofMatch.score.ft) continue;

    const mapped = matchOpenfootballToInternal(ofMatch, existingResults);
    if (!mapped) {
      stats.unmatched++;
      stats.unmatchedMatches.push(`${ofMatch.team1} vs ${ofMatch.team2}`);
      continue;
    }

    const existing = existingResults[mapped.matchId];
    if (existing && existing.home === mapped.home && existing.away === mapped.away) {
      // Al up-to-date
      stats.skipped++;
      continue;
    }

    try {
      await onUpdate(mapped.matchId, mapped.home, mapped.away);
      stats.synced++;
    } catch (err) {
      stats.errors.push(`${mapped.matchId}: ${err.message}`);
    }
  }

  return stats;
}
