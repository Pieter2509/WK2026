// WK 2026 data: alle 12 groepen en 72 groepsfase wedstrijden
// Bron: officieel FIFA loting (5 dec 2025) + playoffs (31 maart 2026)
//
// Interne namen: Engels (canoniek, zoals openfootball ze gebruikt)
// Weergave: Nederlands (via TEAMS map)
//
// Datums in lokale tijd VS/Canada/Mexico, je kunt ze aanpassen naar NL tijd indien gewenst

// Alle 48 teams: Engelse canonieke naam -> Nederlandse weergave + vlag
export const TEAMS = {
  'Mexico':                 { nl: 'Mexico',                 flag: '🇲🇽' },
  'South Africa':           { nl: 'Zuid-Afrika',            flag: '🇿🇦' },
  'South Korea':            { nl: 'Zuid-Korea',             flag: '🇰🇷' },
  'Czechia':                { nl: 'Tsjechië',               flag: '🇨🇿' },
  'Canada':                 { nl: 'Canada',                 flag: '🇨🇦' },
  'Switzerland':            { nl: 'Zwitserland',            flag: '🇨🇭' },
  'Qatar':                  { nl: 'Qatar',                  flag: '🇶🇦' },
  'Bosnia and Herzegovina': { nl: 'Bosnië en Herzegovina',  flag: '🇧🇦' },
  'Brazil':                 { nl: 'Brazilië',               flag: '🇧🇷' },
  'Morocco':                { nl: 'Marokko',                flag: '🇲🇦' },
  'Scotland':               { nl: 'Schotland',              flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  'Haiti':                  { nl: 'Haïti',                  flag: '🇭🇹' },
  'United States':          { nl: 'Verenigde Staten',       flag: '🇺🇸' },
  'Paraguay':               { nl: 'Paraguay',               flag: '🇵🇾' },
  'Australia':              { nl: 'Australië',              flag: '🇦🇺' },
  'Türkiye':                { nl: 'Turkije',                flag: '🇹🇷' },
  'Germany':                { nl: 'Duitsland',              flag: '🇩🇪' },
  'Ecuador':                { nl: 'Ecuador',                flag: '🇪🇨' },
  'Ivory Coast':            { nl: 'Ivoorkust',              flag: '🇨🇮' },
  'Curaçao':                { nl: 'Curaçao',                flag: '🇨🇼' },
  'Netherlands':            { nl: 'Nederland',              flag: '🇳🇱' },
  'Japan':                  { nl: 'Japan',                  flag: '🇯🇵' },
  'Sweden':                 { nl: 'Zweden',                 flag: '🇸🇪' },
  'Tunisia':                { nl: 'Tunesië',                flag: '🇹🇳' },
  'Belgium':                { nl: 'België',                 flag: '🇧🇪' },
  'Egypt':                  { nl: 'Egypte',                 flag: '🇪🇬' },
  'Iran':                   { nl: 'Iran',                   flag: '🇮🇷' },
  'New Zealand':            { nl: 'Nieuw-Zeeland',          flag: '🇳🇿' },
  'Spain':                  { nl: 'Spanje',                 flag: '🇪🇸' },
  'Uruguay':                { nl: 'Uruguay',                flag: '🇺🇾' },
  'Saudi Arabia':           { nl: 'Saoedi-Arabië',          flag: '🇸🇦' },
  'Cape Verde':             { nl: 'Kaapverdië',             flag: '🇨🇻' },
  'France':                 { nl: 'Frankrijk',              flag: '🇫🇷' },
  'Senegal':                { nl: 'Senegal',                flag: '🇸🇳' },
  'Norway':                 { nl: 'Noorwegen',              flag: '🇳🇴' },
  'Iraq':                   { nl: 'Irak',                   flag: '🇮🇶' },
  'Argentina':              { nl: 'Argentinië',             flag: '🇦🇷' },
  'Austria':                { nl: 'Oostenrijk',             flag: '🇦🇹' },
  'Algeria':                { nl: 'Algerije',               flag: '🇩🇿' },
  'Jordan':                 { nl: 'Jordanië',               flag: '🇯🇴' },
  'Portugal':               { nl: 'Portugal',               flag: '🇵🇹' },
  'Colombia':               { nl: 'Colombia',               flag: '🇨🇴' },
  'Uzbekistan':             { nl: 'Oezbekistan',            flag: '🇺🇿' },
  'DR Congo':               { nl: 'DR Congo',               flag: '🇨🇩' },
  'England':                { nl: 'Engeland',               flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'Croatia':                { nl: 'Kroatië',                flag: '🇭🇷' },
  'Panama':                 { nl: 'Panama',                 flag: '🇵🇦' },
  'Ghana':                  { nl: 'Ghana',                  flag: '🇬🇭' },
};

// Helper: krijg Nederlandse weergavenaam voor een team
export function teamName(key) {
  return TEAMS[key]?.nl || key;
}

// Helper: krijg vlag voor een team
export function teamFlag(key) {
  return TEAMS[key]?.flag || '🏳';
}

// Groepen (interne namen in Engels, weergave wordt automatisch Nederlands)
export const GROUPS = {
  A: { name: 'Groep A', teams: ['Mexico', 'South Africa', 'South Korea', 'Czechia'] },
  B: { name: 'Groep B', teams: ['Canada', 'Switzerland', 'Qatar', 'Bosnia and Herzegovina'] },
  C: { name: 'Groep C', teams: ['Brazil', 'Morocco', 'Scotland', 'Haiti'] },
  D: { name: 'Groep D', teams: ['United States', 'Paraguay', 'Australia', 'Türkiye'] },
  E: { name: 'Groep E', teams: ['Germany', 'Ecuador', 'Ivory Coast', 'Curaçao'] },
  F: { name: 'Groep F', teams: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'] },
  G: { name: 'Groep G', teams: ['Belgium', 'Egypt', 'Iran', 'New Zealand'] },
  H: { name: 'Groep H', teams: ['Spain', 'Uruguay', 'Saudi Arabia', 'Cape Verde'] },
  I: { name: 'Groep I', teams: ['France', 'Senegal', 'Norway', 'Iraq'] },
  J: { name: 'Groep J', teams: ['Argentina', 'Austria', 'Algeria', 'Jordan'] },
  K: { name: 'Groep K', teams: ['Portugal', 'Colombia', 'Uzbekistan', 'DR Congo'] },
  L: { name: 'Groep L', teams: ['England', 'Croatia', 'Panama', 'Ghana'] },
};

// Backward compatibility: FLAGS map (Engelse keys nu)
export const FLAGS = Object.fromEntries(
  Object.entries(TEAMS).map(([k, v]) => [k, v.flag])
);

// Alle 72 groepsfase wedstrijden (Engelse teamnamen)
export const MATCHES = [
  // ===== MATCHDAY 1 =====
  // 11 juni - opening
  { id: 'A1', group: 'A', home: 'Mexico', away: 'South Africa', date: '2026-06-11T21:00', venue: 'Estadio Azteca, Mexico City' },

  // 12 juni
  { id: 'A2', group: 'A', home: 'South Korea', away: 'Czechia', date: '2026-06-12T04:00', venue: 'Guadalajara' },
  { id: 'B1', group: 'B', home: 'Canada', away: 'Bosnia and Herzegovina', date: '2026-06-12T21:00', venue: 'BMO Field, Toronto' },
  { id: 'D1', group: 'D', home: 'United States', away: 'Paraguay', date: '2026-06-13T03:00', venue: 'SoFi Stadium, Los Angeles' },

  // 13 juni
  { id: 'B2', group: 'B', home: 'Qatar', away: 'Switzerland', date: '2026-06-13T21:00', venue: 'San Francisco Bay' },
  { id: 'C1', group: 'C', home: 'Brazil', away: 'Morocco', date: '2026-06-14T00:00', venue: 'MetLife Stadium, New Jersey' },
  { id: 'C2', group: 'C', home: 'Haiti', away: 'Scotland', date: '2026-06-14T03:00', venue: 'Boston' },

  // 14 juni
  { id: 'D2', group: 'D', home: 'Australia', away: 'Türkiye', date: '2026-06-14T06:00', venue: 'BC Place, Vancouver' },
  { id: 'E1', group: 'E', home: 'Germany', away: 'Curaçao', date: '2026-06-14T19:00', venue: 'Houston' },
  { id: 'F1', group: 'F', home: 'Netherlands', away: 'Japan', date: '2026-06-14T22:00', venue: 'AT&T Stadium, Dallas' },
  { id: 'E2', group: 'E', home: 'Ivory Coast', away: 'Ecuador', date: '2026-06-15T01:00', venue: 'Philadelphia' },
  { id: 'F2', group: 'F', home: 'Sweden', away: 'Tunisia', date: '2026-06-15T04:00', venue: 'Estadio Monterrey' },

  // 15 juni
  { id: 'H1', group: 'H', home: 'Spain', away: 'Cape Verde', date: '2026-06-15T18:00', venue: 'Atlanta' },
  { id: 'G1', group: 'G', home: 'Belgium', away: 'Egypt', date: '2026-06-15T21:00', venue: 'Lumen Field, Seattle' },
  { id: 'H2', group: 'H', home: 'Saudi Arabia', away: 'Uruguay', date: '2026-06-16T00:00', venue: 'Hard Rock Stadium, Miami' },
  { id: 'G2', group: 'G', home: 'Iran', away: 'New Zealand', date: '2026-06-16T03:00', venue: 'SoFi Stadium, Los Angeles' },

  // 16 juni
  { id: 'I1', group: 'I', home: 'France', away: 'Senegal', date: '2026-06-16T21:00', venue: 'MetLife Stadium, New Jersey' },
  { id: 'I2', group: 'I', home: 'Norway', away: 'Iraq', date: '2026-06-17T00:00', venue: 'Philadelphia' },
  { id: 'J1', group: 'J', home: 'Argentina', away: 'Austria', date: '2026-06-17T03:00', venue: 'AT&T Stadium, Dallas' },

  // 17 juni
  { id: 'J2', group: 'J', home: 'Algeria', away: 'Jordan', date: '2026-06-17T19:00', venue: 'San Francisco Bay' },
  { id: 'K1', group: 'K', home: 'Portugal', away: 'Uzbekistan', date: '2026-06-17T21:00', venue: 'Houston' },
  { id: 'L1', group: 'L', home: 'England', away: 'Ghana', date: '2026-06-18T00:00', venue: 'Boston' },
  { id: 'K2', group: 'K', home: 'Colombia', away: 'DR Congo', date: '2026-06-18T03:00', venue: 'Kansas City' },
  { id: 'L2', group: 'L', home: 'Croatia', away: 'Panama', date: '2026-06-18T06:00', venue: 'Vancouver' },

  // ===== MATCHDAY 2 =====
  // 17-23 juni
  { id: 'A3', group: 'A', home: 'Mexico', away: 'South Korea', date: '2026-06-18T21:00', venue: 'Mexico City' },
  { id: 'A4', group: 'A', home: 'Czechia', away: 'South Africa', date: '2026-06-19T00:00', venue: 'Monterrey' },

  { id: 'B3', group: 'B', home: 'Canada', away: 'Qatar', date: '2026-06-19T21:00', venue: 'Vancouver' },
  { id: 'B4', group: 'B', home: 'Bosnia and Herzegovina', away: 'Switzerland', date: '2026-06-20T00:00', venue: 'Seattle' },

  { id: 'C3', group: 'C', home: 'Brazil', away: 'Scotland', date: '2026-06-20T03:00', venue: 'Atlanta' },
  { id: 'C4', group: 'C', home: 'Morocco', away: 'Haiti', date: '2026-06-20T06:00', venue: 'Los Angeles' },

  { id: 'D3', group: 'D', home: 'United States', away: 'Australia', date: '2026-06-20T21:00', venue: 'Lumen Field, Seattle' },
  { id: 'D4', group: 'D', home: 'Paraguay', away: 'Türkiye', date: '2026-06-21T00:00', venue: 'San Francisco' },

  { id: 'E3', group: 'E', home: 'Germany', away: 'Ivory Coast', date: '2026-06-20T22:00', venue: 'Toronto' },
  { id: 'E4', group: 'E', home: 'Ecuador', away: 'Curaçao', date: '2026-06-21T02:00', venue: 'Kansas City' },

  { id: 'F3', group: 'F', home: 'Netherlands', away: 'Sweden', date: '2026-06-20T19:00', venue: 'NRG Stadium, Houston' },
  { id: 'F4', group: 'F', home: 'Tunisia', away: 'Japan', date: '2026-06-21T06:00', venue: 'Monterrey' },

  { id: 'G3', group: 'G', home: 'Belgium', away: 'Iran', date: '2026-06-21T21:00', venue: 'SoFi Stadium, Los Angeles' },
  { id: 'G4', group: 'G', home: 'New Zealand', away: 'Egypt', date: '2026-06-22T03:00', venue: 'Vancouver' },

  { id: 'H3', group: 'H', home: 'Spain', away: 'Saudi Arabia', date: '2026-06-21T18:00', venue: 'Atlanta' },
  { id: 'H4', group: 'H', home: 'Uruguay', away: 'Cape Verde', date: '2026-06-22T00:00', venue: 'Miami' },

  { id: 'I3', group: 'I', home: 'France', away: 'Iraq', date: '2026-06-22T23:00', venue: 'Philadelphia' },
  { id: 'I4', group: 'I', home: 'Norway', away: 'Senegal', date: '2026-06-23T02:00', venue: 'MetLife, New Jersey' },

  { id: 'J3', group: 'J', home: 'Argentina', away: 'Algeria', date: '2026-06-23T19:00', venue: 'Dallas' },
  { id: 'J4', group: 'J', home: 'Austria', away: 'Jordan', date: '2026-06-23T22:00', venue: 'San Francisco' },

  { id: 'K3', group: 'K', home: 'Portugal', away: 'Colombia', date: '2026-06-23T21:00', venue: 'Houston' },
  { id: 'K4', group: 'K', home: 'Uzbekistan', away: 'DR Congo', date: '2026-06-24T01:00', venue: 'Kansas City' },

  { id: 'L3', group: 'L', home: 'England', away: 'Croatia', date: '2026-06-24T21:00', venue: 'Boston' },
  { id: 'L4', group: 'L', home: 'Panama', away: 'Ghana', date: '2026-06-25T00:00', venue: 'Vancouver' },

  // ===== MATCHDAY 3 (simultane wedstrijden per groep) =====
  { id: 'A5', group: 'A', home: 'South Africa', away: 'South Korea', date: '2026-06-24T21:00', venue: 'Guadalajara' },
  { id: 'A6', group: 'A', home: 'Czechia', away: 'Mexico', date: '2026-06-24T21:00', venue: 'Mexico City' },

  { id: 'B5', group: 'B', home: 'Switzerland', away: 'Canada', date: '2026-06-25T21:00', venue: 'Vancouver' },
  { id: 'B6', group: 'B', home: 'Bosnia and Herzegovina', away: 'Qatar', date: '2026-06-25T21:00', venue: 'Toronto' },

  { id: 'C5', group: 'C', home: 'Scotland', away: 'Morocco', date: '2026-06-25T21:00', venue: 'Atlanta' },
  { id: 'C6', group: 'C', home: 'Haiti', away: 'Brazil', date: '2026-06-25T21:00', venue: 'Miami' },

  { id: 'D5', group: 'D', home: 'Türkiye', away: 'United States', date: '2026-06-25T21:00', venue: 'SoFi, Los Angeles' },
  { id: 'D6', group: 'D', home: 'Australia', away: 'Paraguay', date: '2026-06-25T21:00', venue: 'San Francisco' },

  { id: 'E5', group: 'E', home: 'Curaçao', away: 'Germany', date: '2026-06-26T21:00', venue: 'Toronto' },
  { id: 'E6', group: 'E', home: 'Ecuador', away: 'Ivory Coast', date: '2026-06-26T21:00', venue: 'Philadelphia' },

  { id: 'F5', group: 'F', home: 'Tunisia', away: 'Netherlands', date: '2026-06-26T01:00', venue: 'Arrowhead Stadium, Kansas City' },
  { id: 'F6', group: 'F', home: 'Japan', away: 'Sweden', date: '2026-06-26T01:00', venue: 'AT&T Stadium, Dallas' },

  { id: 'G5', group: 'G', home: 'Egypt', away: 'Iran', date: '2026-06-26T21:00', venue: 'Seattle' },
  { id: 'G6', group: 'G', home: 'New Zealand', away: 'Belgium', date: '2026-06-26T21:00', venue: 'Vancouver' },

  { id: 'H5', group: 'H', home: 'Cape Verde', away: 'Spain', date: '2026-06-27T21:00', venue: 'Atlanta' },
  { id: 'H6', group: 'H', home: 'Saudi Arabia', away: 'Uruguay', date: '2026-06-27T21:00', venue: 'Miami' },

  { id: 'I5', group: 'I', home: 'Iraq', away: 'Senegal', date: '2026-06-27T21:00', venue: 'Philadelphia' },
  { id: 'I6', group: 'I', home: 'Norway', away: 'France', date: '2026-06-27T21:00', venue: 'MetLife, New Jersey' },

  { id: 'J5', group: 'J', home: 'Jordan', away: 'Argentina', date: '2026-06-28T01:00', venue: 'Dallas' },
  { id: 'J6', group: 'J', home: 'Algeria', away: 'Austria', date: '2026-06-28T01:00', venue: 'San Francisco' },

  { id: 'K5', group: 'K', home: 'DR Congo', away: 'Portugal', date: '2026-06-28T21:00', venue: 'Houston' },
  { id: 'K6', group: 'K', home: 'Uzbekistan', away: 'Colombia', date: '2026-06-28T21:00', venue: 'Kansas City' },

  { id: 'L5', group: 'L', home: 'Ghana', away: 'Croatia', date: '2026-06-28T21:00', venue: 'Boston' },
  { id: 'L6', group: 'L', home: 'Panama', away: 'England', date: '2026-06-28T21:00', venue: 'Vancouver' },
];

// Puntensysteem voor de poul
export const SCORING = {
  EXACT_SCORE: 5,      // Exacte uitslag goed
  GOAL_DIFFERENCE: 3,  // Goed verschil + juiste winnaar (bv 2-1 voorspeld, 3-2 geworden)
  CORRECT_WINNER: 1,   // Alleen winnaar goed (of gelijkspel)
  WRONG: 0,
};

// Bereken punten voor een voorspelling
export function calculatePoints(predicted, actual) {
  if (!predicted || !actual) return 0;
  if (predicted.home == null || predicted.away == null) return 0;
  if (actual.home == null || actual.away == null) return 0;

  const pH = Number(predicted.home);
  const pA = Number(predicted.away);
  const aH = Number(actual.home);
  const aA = Number(actual.away);

  // Exacte uitslag
  if (pH === aH && pA === aA) return SCORING.EXACT_SCORE;

  const predDiff = pH - pA;
  const actDiff = aH - aA;

  // Zelfde doelsaldo + zelfde winnaar (of beiden gelijk)
  if (predDiff === actDiff) return SCORING.GOAL_DIFFERENCE;

  // Alleen juiste winnaar
  const predResult = predDiff > 0 ? 'H' : (predDiff < 0 ? 'A' : 'D');
  const actResult = actDiff > 0 ? 'H' : (actDiff < 0 ? 'A' : 'D');
  if (predResult === actResult) return SCORING.CORRECT_WINNER;

  return SCORING.WRONG;
}
