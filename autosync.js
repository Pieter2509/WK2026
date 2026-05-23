// ================================================================
// Auto-sync uitslagen van openfootball/worldcup.json
// Gratis, open data, geen API-key nodig, public domain (CC0)
// Bron: https://github.com/openfootball/worldcup.json
// ================================================================

import { MATCHES } from "./data.js";

const OPENFOOTBALL_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

// Mapping van openfootball team namen (Engels) naar onze Nederlandse namen
// Sommige teams hebben meerdere mogelijke namen in de bron
const TEAM_MAP = {
  "Mexico": "Mexico",
  "South Africa": "Zuid-Afrika",
  "South Korea": "Zuid-Korea",
  "Korea Republic": "Zuid-Korea",
  "Czech Republic": "Tsjechië",
  "Czechia": "Tsjechië",
  "Canada": "Canada",
  "Switzerland": "Zwitserland",
  "Qatar": "Qatar",
  "Bosnia and Herzegovina": "Bosnië en Herzegovina",
  "Bosnia-Herzegovina": "Bosnië en Herzegovina",
  "Brazil": "Brazilië",
  "Morocco": "Marokko",
  "Scotland": "Schotland",
  "Haiti": "Haïti",
  "United States": "Verenigde Staten",
  "USA": "Verenigde Staten",
  "Paraguay": "Paraguay",
  "Australia": "Australië",
  "Türkiye": "Turkije",
  "Turkey": "Turkije",
  "Turkiye": "Turkije",
  "Germany": "Duitsland",
  "Ecuador": "Ecuador",
  "Ivory Coast": "Ivoorkust",
  "Côte d'Ivoire": "Ivoorkust",
  "Cote d'Ivoire": "Ivoorkust",
  "Curaçao": "Curaçao",
  "Curacao": "Curaçao",
  "Netherlands": "Nederland",
  "Japan": "Japan",
  "Sweden": "Zweden",
  "Tunisia": "Tunesië",
  "Belgium": "België",
  "Egypt": "Egypte",
  "Iran": "Iran",
  "New Zealand": "Nieuw-Zeeland",
  "Spain": "Spanje",
  "Uruguay": "Uruguay",
  "Saudi Arabia": "Saoedi-Arabië",
  "Cape Verde": "Kaapverdië",
  "Cabo Verde": "Kaapverdië",
  "France": "Frankrijk",
  "Senegal": "Senegal",
  "Norway": "Noorwegen",
  "Iraq": "Irak",
  "Argentina": "Argentinië",
  "Austria": "Oostenrijk",
  "Algeria": "Algerije",
  "Jordan": "Jordanië",
  "Portugal": "Portugal",
  "Colombia": "Colombia",
  "Uzbekistan": "Oezbekistan",
  "DR Congo": "DR Congo",
  "Congo DR": "DR Congo",
  "Democratic Republic of Congo": "DR Congo",
  "England": "Engeland",
  "Croatia": "Kroatië",
  "Panama": "Panama",
  "Ghana": "Ghana",
};

function mapTeam(name) {
  if (!name) return null;
  return TEAM_MAP[name] || TEAM_MAP[name.trim()] || null;
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
// Returns { matchId, home, away } of null als geen match
export function matchOpenfootballToInternal(ofMatch) {
  if (!ofMatch.score || !ofMatch.score.ft) return null;

  const ofTeam1 = mapTeam(ofMatch.team1);
  const ofTeam2 = mapTeam(ofMatch.team2);
  if (!ofTeam1 || !ofTeam2) return null;

  const [ft1, ft2] = ofMatch.score.ft;
  if (ft1 == null || ft2 == null) return null;

  // Zoek onze wedstrijd waar deze twee teams tegen elkaar spelen
  // (volgorde maakt niet uit, we leiden zelf de home/away af)
  const internalMatch = MATCHES.find((m) =>
    (m.home === ofTeam1 && m.away === ofTeam2) ||
    (m.home === ofTeam2 && m.away === ofTeam1)
  );

  if (!internalMatch) return null;

  // Bepaal welk team home/away is in onze data
  let home, away;
  if (internalMatch.home === ofTeam1) {
    home = ft1;
    away = ft2;
  } else {
    home = ft2;
    away = ft1;
  }

  return { matchId: internalMatch.id, home, away };
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

    const mapped = matchOpenfootballToInternal(ofMatch);
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
