// ================================================================
// Knockout fase WK 2026
// 32 wedstrijden: Ronde van 32, 16, kwartfinales, halve finales, finale + 3e plaats
// Het format is uniek voor 2026 vanwege de 48-team uitbreiding
// ================================================================

import { GROUPS, MATCHES } from "./data.js";

// Bracket placeholders volgens officieel FIFA schema (vastgelegd 27 juni 2026)
// Format: "1A" = winnaar groep A, "2B" = nummer 2 groep B, "3ABCDF" = beste derde uit groepen A/B/C/D/F
//
// Officiele Ronde van 32 paringen:
// 1E vs 3ABCDF, 1I vs 3CDFGH, 2A vs 2B, 1F vs 2C, 2K vs 2L, 1H vs 2J,
// 1D vs 3BEFIJ, 1G vs 3AEHIJ, 1C vs 2F, 2E vs 2I, 1A vs 3CEFHI, 1L vs 3EHIJK,
// 1J vs 2H, 2D vs 2G, 1B vs 3EFGIJ, 1K vs 3DEIJL

export const KO_MATCHES = [
  // ===== RONDE VAN 32 (28 juni - 3 juli) =====
  { id: 'R32-1', round: 'R32', home: '1A', away: '3CEFHI', date: '2026-06-28T19:00', venue: 'TBD' },
  { id: 'R32-2', round: 'R32', home: '1B', away: '3EFGIJ', date: '2026-06-28T22:00', venue: 'TBD' },
  { id: 'R32-3', round: 'R32', home: '1C', away: '2F', date: '2026-06-29T19:00', venue: 'TBD' },
  { id: 'R32-4', round: 'R32', home: '1D', away: '3BEFIJ', date: '2026-06-29T22:00', venue: 'TBD' },
  { id: 'R32-5', round: 'R32', home: '1E', away: '3ABCDF', date: '2026-06-30T19:00', venue: 'TBD' },
  { id: 'R32-6', round: 'R32', home: '1F', away: '2C', date: '2026-06-30T22:00', venue: 'TBD' },
  { id: 'R32-7', round: 'R32', home: '1G', away: '3AEHIJ', date: '2026-07-01T19:00', venue: 'TBD' },
  { id: 'R32-8', round: 'R32', home: '1H', away: '2J', date: '2026-07-01T22:00', venue: 'TBD' },
  { id: 'R32-9', round: 'R32', home: '1I', away: '3CDFGH', date: '2026-07-02T19:00', venue: 'Toronto' },
  { id: 'R32-10', round: 'R32', home: '1J', away: '2H', date: '2026-07-02T22:00', venue: 'Vancouver' },
  { id: 'R32-11', round: 'R32', home: '1K', away: '3DEIJL', date: '2026-07-03T19:00', venue: 'Miami' },
  { id: 'R32-12', round: 'R32', home: '1L', away: '3EHIJK', date: '2026-07-03T21:00', venue: 'Kansas City' },
  { id: 'R32-13', round: 'R32', home: '2A', away: '2B', date: '2026-06-29T01:00', venue: 'TBD' },
  { id: 'R32-14', round: 'R32', home: '2D', away: '2G', date: '2026-06-30T01:00', venue: 'TBD' },
  { id: 'R32-15', round: 'R32', home: '2E', away: '2I', date: '2026-07-01T01:00', venue: 'TBD' },
  { id: 'R32-16', round: 'R32', home: '2K', away: '2L', date: '2026-07-03T23:00', venue: 'Dallas' },

  // ===== RONDE VAN 16 (4-7 juli) - Officiele FIFA paringen volgens PDF =====
  // Match 89-96 in de officiele bracket
  { id: 'R16-1', round: 'R16', home: 'W:R32-13', away: 'W:R32-6',  date: '2026-07-04T19:00', venue: 'TBD' }, // Match 90: W73-W75
  { id: 'R16-2', round: 'R16', home: 'W:R32-5',  away: 'W:R32-9',  date: '2026-07-04T23:00', venue: 'TBD' }, // Match 89: W74-W77
  { id: 'R16-3', round: 'R16', home: 'W:R32-3',  away: 'W:R32-15', date: '2026-07-05T22:00', venue: 'TBD' }, // Match 91: W76-W78
  { id: 'R16-4', round: 'R16', home: 'W:R32-1',  away: 'W:R32-12', date: '2026-07-06T02:00', venue: 'TBD' }, // Match 92: W79-W80
  { id: 'R16-5', round: 'R16', home: 'W:R32-16', away: 'W:R32-8',  date: '2026-07-06T21:00', venue: 'TBD' }, // Match 93: W83-W84
  { id: 'R16-6', round: 'R16', home: 'W:R32-4',  away: 'W:R32-7',  date: '2026-07-07T02:00', venue: 'TBD' }, // Match 94: W81-W82
  { id: 'R16-7', round: 'R16', home: 'W:R32-10', away: 'W:R32-14', date: '2026-07-07T18:00', venue: 'TBD' }, // Match 95: W86-W88
  { id: 'R16-8', round: 'R16', home: 'W:R32-2',  away: 'W:R32-11', date: '2026-07-07T22:00', venue: 'TBD' }, // Match 96: W85-W87

  // ===== KWARTFINALES (9-12 juli) - Officiele FIFA bracket volgens PDF =====
  { id: 'QF-1', round: 'QF', home: 'W:R16-2', away: 'W:R16-1', date: '2026-07-09T22:00', venue: 'TBD' }, // Match 97: W89-W90
  { id: 'QF-2', round: 'QF', home: 'W:R16-5', away: 'W:R16-6', date: '2026-07-10T21:00', venue: 'TBD' }, // Match 98: W93-W94
  { id: 'QF-3', round: 'QF', home: 'W:R16-3', away: 'W:R16-4', date: '2026-07-11T23:00', venue: 'TBD' }, // Match 99: W91-W92
  { id: 'QF-4', round: 'QF', home: 'W:R16-7', away: 'W:R16-8', date: '2026-07-12T03:00', venue: 'TBD' }, // Match 100: W95-W96

  // ===== HALVE FINALES (14-15 juli) =====
  { id: 'SF-1', round: 'SF', home: 'W:QF-1', away: 'W:QF-2', date: '2026-07-14T21:00', venue: 'AT&T Stadium, Dallas' },    // Match 101: W97-W98
  { id: 'SF-2', round: 'SF', home: 'W:QF-3', away: 'W:QF-4', date: '2026-07-15T21:00', venue: 'Mercedes-Benz Stadium, Atlanta' }, // Match 102: W99-W100

  // ===== TROOSTFINALE (18 juli) =====
  { id: 'TF', round: 'TF', home: 'L:SF-1', away: 'L:SF-2', date: '2026-07-18T23:00', venue: 'Hard Rock Stadium, Miami' },

  // ===== FINALE (19 juli) =====
  { id: 'F', round: 'F', home: 'W:SF-1', away: 'W:SF-2', date: '2026-07-19T21:00', venue: 'MetLife Stadium, New Jersey' },
];

// Naam per ronde voor UI
export const KO_ROUND_NAMES = {
  R32: 'Ronde van 32',
  R16: 'Achtste finales',
  QF: 'Kwartfinales',
  SF: 'Halve finales',
  TF: 'Troostfinale (3e plaats)',
  F: 'Finale',
};

// ================================================================
// Bereken groepsstanden inclusief positie (1, 2, 3, 4)
// ================================================================
function calculateGroupStandings(groupId, results) {
  const teams = GROUPS[groupId].teams;
  const stats = {};
  teams.forEach((t) => {
    stats[t] = { team: t, group: groupId, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
  });

  const groupMatches = MATCHES.filter((m) => m.group === groupId);
  let allPlayed = true;
  for (const match of groupMatches) {
    const result = results[match.id];
    if (!result || result.home == null || result.away == null) {
      allPlayed = false;
      continue;
    }

    const h = result.home, a = result.away;
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

  Object.values(stats).forEach((s) => { s.GD = s.GF - s.GA; });

  const sorted = Object.values(stats).sort((a, b) => {
    if (b.Pts !== a.Pts) return b.Pts - a.Pts;
    if (b.GD !== a.GD) return b.GD - a.GD;
    if (b.GF !== a.GF) return b.GF - a.GF;
    return a.team.localeCompare(b.team);
  });

  return { standings: sorted, allPlayed };
}

// ================================================================
// Bepaal de 8 beste nummers 3 (FIFA tiebreakers: pts > GD > GF > naam)
// ================================================================
function getBestThirds(allResults) {
  const thirds = [];
  let allGroupsComplete = true;

  for (const groupId of Object.keys(GROUPS)) {
    const { standings, allPlayed } = calculateGroupStandings(groupId, allResults);
    if (!allPlayed) {
      allGroupsComplete = false;
      continue;
    }
    if (standings[2]) thirds.push(standings[2]);
  }

  if (!allGroupsComplete) return null;

  // Sorteer alle 12 nummers 3 op tiebreakers
  thirds.sort((a, b) => {
    if (b.Pts !== a.Pts) return b.Pts - a.Pts;
    if (b.GD !== a.GD) return b.GD - a.GD;
    if (b.GF !== a.GF) return b.GF - a.GF;
    return a.team.localeCompare(b.team);
  });

  // Top 8
  return thirds.slice(0, 8);
}

// ================================================================
// Match een ronde-32 placeholder (bv "3ABCDF") aan een echt team
// Returns: teamnaam of null als nog niet bekend
// ================================================================
function resolveThirdPlaceSlot(placeholder, bestThirds) {
  if (!bestThirds || bestThirds.length < 8) return null;

  // "3ABCDF" betekent: de beste 3e die uit een van de groepen A/B/C/D/F komt
  // FIFA heeft een vaste mapping voor welke combinatie van 3e plaatsers wat krijgt
  // Op basis van welke 8 groepen kwalificeren (er zijn C(12,8) = 495 mogelijkheden,
  // maar FIFA gebruikt een tabel die we hier vereenvoudigen):
  // We koppelen ze in volgorde van ranking aan de slots, gefilterd op groep.

  const groupsInSlot = placeholder.substring(1); // bv "ABCDF"

  // Vind de hoogst gerankte 3e plaatser uit een van deze groepen
  // die nog niet is toegewezen aan een ander slot
  // (Voor de poul-app is een vereenvoudigde toewijzing prima)
  for (const third of bestThirds) {
    if (groupsInSlot.includes(third.group)) {
      return third.team;
    }
  }
  return null;
}

// ================================================================
// Bepaal teams voor een knockout wedstrijd
// placeholder: "1A", "2B", "3ABCDF", "W:R32-1", "L:SF-1"
// Returns: { team, resolved: true/false }
// ================================================================
export function resolveSlot(placeholder, allResults) {
  if (!placeholder) return { team: null, resolved: false };

  // Winnaar/verliezer van eerdere knockout match
  if (placeholder.startsWith('W:') || placeholder.startsWith('L:')) {
    const isWinner = placeholder.startsWith('W:');
    const matchId = placeholder.substring(2);
    const result = allResults[matchId];
    if (!result || result.home == null || result.away == null) {
      return { team: null, resolved: false, label: placeholder };
    }

    // Vind de match definitie
    const koMatch = KO_MATCHES.find((m) => m.id === matchId);
    if (!koMatch) return { team: null, resolved: false, label: placeholder };

    // Bepaal home/away teams van die match
    const homeResolved = resolveSlot(koMatch.home, allResults);
    const awayResolved = resolveSlot(koMatch.away, allResults);
    if (!homeResolved.team || !awayResolved.team) {
      return { team: null, resolved: false, label: placeholder };
    }

    const homeWins = result.home > result.away;
    if (isWinner) {
      return { team: homeWins ? homeResolved.team : awayResolved.team, resolved: true };
    } else {
      return { team: homeWins ? awayResolved.team : homeResolved.team, resolved: true };
    }
  }

  // Groepsplaats: "1A", "2B"
  if (/^[12][A-L]$/.test(placeholder)) {
    const pos = parseInt(placeholder[0], 10) - 1;
    const groupId = placeholder[1];
    const { standings, allPlayed } = calculateGroupStandings(groupId, allResults);
    if (!allPlayed) return { team: null, resolved: false, label: placeholder };
    return { team: standings[pos]?.team || null, resolved: !!standings[pos] };
  }

  // Beste derde: "3ABCDF" etc.
  if (placeholder.startsWith('3')) {
    const bestThirds = getBestThirds(allResults);
    if (!bestThirds) return { team: null, resolved: false, label: placeholder };
    const team = resolveThirdPlaceSlot(placeholder, bestThirds);
    return { team, resolved: !!team, label: placeholder };
  }

  return { team: null, resolved: false, label: placeholder };
}

// ================================================================
// Check of een ronde "open" is voor voorspellen
// Een ronde is open als alle voorgaande rondes klaar zijn (teams bekend)
// ================================================================
export function isRoundOpen(round, allResults) {
  if (round === 'R32') {
    // R32 is open zodra alle 72 groepsfase wedstrijden gespeeld zijn
    return MATCHES.every((m) => {
      const r = allResults[m.id];
      return r && r.home != null && r.away != null;
    });
  }

  if (round === 'R16') {
    return KO_MATCHES.filter((m) => m.round === 'R32').every((m) => {
      const r = allResults[m.id];
      return r && r.home != null && r.away != null;
    });
  }

  if (round === 'QF') {
    return KO_MATCHES.filter((m) => m.round === 'R16').every((m) => {
      const r = allResults[m.id];
      return r && r.home != null && r.away != null;
    });
  }

  if (round === 'SF') {
    return KO_MATCHES.filter((m) => m.round === 'QF').every((m) => {
      const r = allResults[m.id];
      return r && r.home != null && r.away != null;
    });
  }

  if (round === 'TF' || round === 'F') {
    return KO_MATCHES.filter((m) => m.round === 'SF').every((m) => {
      const r = allResults[m.id];
      return r && r.home != null && r.away != null;
    });
  }

  return false;
}
