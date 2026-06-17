// ================================================================
// WK 2026 Data - Officieel BetCity speelschema
// ================================================================
// Datums in Nederlandse tijd (CEST/CET), JavaScript interpreteert deze
// als lokale browser-tijd zodat Nederlandse gebruikers de juiste uren zien

export const SCORING = {
  EXACT_SCORE: 5,
  GOAL_DIFF: 4,
  WINNER: 3,
};

// Alle 48 teams: Engelse canonieke naam -> Nederlandse weergave + vlag + FIFA afkorting (3 letters)
export const TEAMS = {
  'Mexico':                 { nl: 'Mexico',                 flag: '🇲🇽', abbr: 'MEX' },
  'South Africa':           { nl: 'Zuid-Afrika',            flag: '🇿🇦', abbr: 'RSA' },
  'South Korea':            { nl: 'Zuid-Korea',             flag: '🇰🇷', abbr: 'KOR' },
  'Czechia':                { nl: 'Tsjechië',               flag: '🇨🇿', abbr: 'CZE' },
  'Canada':                 { nl: 'Canada',                 flag: '🇨🇦', abbr: 'CAN' },
  'Switzerland':            { nl: 'Zwitserland',            flag: '🇨🇭', abbr: 'SUI' },
  'Qatar':                  { nl: 'Qatar',                  flag: '🇶🇦', abbr: 'QAT' },
  'Bosnia and Herzegovina': { nl: 'Bosnië en Herzegovina',  flag: '🇧🇦', abbr: 'BIH' },
  'Brazil':                 { nl: 'Brazilië',               flag: '🇧🇷', abbr: 'BRA' },
  'Morocco':                { nl: 'Marokko',                flag: '🇲🇦', abbr: 'MAR' },
  'Scotland':               { nl: 'Schotland',              flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', abbr: 'SCO' },
  'Haiti':                  { nl: 'Haïti',                  flag: '🇭🇹', abbr: 'HAI' },
  'United States':          { nl: 'Verenigde Staten',       flag: '🇺🇸', abbr: 'USA' },
  'Paraguay':               { nl: 'Paraguay',               flag: '🇵🇾', abbr: 'PAR' },
  'Australia':              { nl: 'Australië',              flag: '🇦🇺', abbr: 'AUS' },
  'Türkiye':                { nl: 'Turkije',                flag: '🇹🇷', abbr: 'TUR' },
  'Germany':                { nl: 'Duitsland',              flag: '🇩🇪', abbr: 'GER' },
  'Ecuador':                { nl: 'Ecuador',                flag: '🇪🇨', abbr: 'ECU' },
  'Ivory Coast':            { nl: 'Ivoorkust',              flag: '🇨🇮', abbr: 'CIV' },
  'Curaçao':                { nl: 'Curaçao',                flag: '🇨🇼', abbr: 'CUW' },
  'Netherlands':            { nl: 'Nederland',              flag: '🇳🇱', abbr: 'NED' },
  'Japan':                  { nl: 'Japan',                  flag: '🇯🇵', abbr: 'JPN' },
  'Sweden':                 { nl: 'Zweden',                 flag: '🇸🇪', abbr: 'SWE' },
  'Tunisia':                { nl: 'Tunesië',                flag: '🇹🇳', abbr: 'TUN' },
  'Belgium':                { nl: 'België',                 flag: '🇧🇪', abbr: 'BEL' },
  'Egypt':                  { nl: 'Egypte',                 flag: '🇪🇬', abbr: 'EGY' },
  'Iran':                   { nl: 'Iran',                   flag: '🇮🇷', abbr: 'IRN' },
  'New Zealand':            { nl: 'Nieuw-Zeeland',          flag: '🇳🇿', abbr: 'NZL' },
  'Spain':                  { nl: 'Spanje',                 flag: '🇪🇸', abbr: 'ESP' },
  'Uruguay':                { nl: 'Uruguay',                flag: '🇺🇾', abbr: 'URU' },
  'Saudi Arabia':           { nl: 'Saoedi-Arabië',          flag: '🇸🇦', abbr: 'KSA' },
  'Cape Verde':             { nl: 'Kaapverdië',             flag: '🇨🇻', abbr: 'CPV' },
  'France':                 { nl: 'Frankrijk',              flag: '🇫🇷', abbr: 'FRA' },
  'Senegal':                { nl: 'Senegal',                flag: '🇸🇳', abbr: 'SEN' },
  'Norway':                 { nl: 'Noorwegen',              flag: '🇳🇴', abbr: 'NOR' },
  'Iraq':                   { nl: 'Irak',                   flag: '🇮🇶', abbr: 'IRQ' },
  'Argentina':              { nl: 'Argentinië',             flag: '🇦🇷', abbr: 'ARG' },
  'Austria':                { nl: 'Oostenrijk',             flag: '🇦🇹', abbr: 'AUT' },
  'Algeria':                { nl: 'Algerije',               flag: '🇩🇿', abbr: 'ALG' },
  'Jordan':                 { nl: 'Jordanië',               flag: '🇯🇴', abbr: 'JOR' },
  'Portugal':               { nl: 'Portugal',               flag: '🇵🇹', abbr: 'POR' },
  'Colombia':               { nl: 'Colombia',               flag: '🇨🇴', abbr: 'COL' },
  'Uzbekistan':             { nl: 'Oezbekistan',            flag: '🇺🇿', abbr: 'UZB' },
  'DR Congo':               { nl: 'DR Congo',               flag: '🇨🇩', abbr: 'COD' },
  'England':                { nl: 'Engeland',               flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG' },
  'Croatia':                { nl: 'Kroatië',                flag: '🇭🇷', abbr: 'CRO' },
  'Panama':                 { nl: 'Panama',                 flag: '🇵🇦', abbr: 'PAN' },
  'Ghana':                  { nl: 'Ghana',                  flag: '🇬🇭', abbr: 'GHA' },
};

// Helper: krijg Nederlandse weergavenaam voor een team
export function teamName(key) {
  return TEAMS[key]?.nl || key;
}

// Helper: krijg vlag voor een team
export function teamFlag(key) {
  return TEAMS[key]?.flag || '🏳';
}

// Helper: krijg FIFA 3-letter afkorting voor een team
export function teamAbbr(key) {
  return TEAMS[key]?.abbr || key.substring(0, 3).toUpperCase();
}

// Backwards compat
export const FLAGS = Object.fromEntries(
  Object.entries(TEAMS).map(([k, v]) => [k, v.flag])
);

// ================================================================
// GROEPEN
// ================================================================
export const GROUPS = {
  A: { name: 'Groep A', teams: ['Mexico', 'South Africa', 'South Korea', 'Czechia'] },
  B: { name: 'Groep B', teams: ['Canada', 'Bosnia and Herzegovina', 'Qatar', 'Switzerland'] },
  C: { name: 'Groep C', teams: ['Brazil', 'Morocco', 'Haiti', 'Scotland'] },
  D: { name: 'Groep D', teams: ['United States', 'Paraguay', 'Australia', 'Türkiye'] },
  E: { name: 'Groep E', teams: ['Germany', 'Curaçao', 'Ivory Coast', 'Ecuador'] },
  F: { name: 'Groep F (Nederland)', teams: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'] },
  G: { name: 'Groep G', teams: ['Belgium', 'Egypt', 'Iran', 'New Zealand'] },
  H: { name: 'Groep H', teams: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'] },
  I: { name: 'Groep I', teams: ['France', 'Senegal', 'Norway', 'Iraq'] },
  J: { name: 'Groep J', teams: ['Argentina', 'Austria', 'Algeria', 'Jordan'] },
  K: { name: 'Groep K', teams: ['Portugal', 'Uzbekistan', 'Colombia', 'DR Congo'] },
  L: { name: 'Groep L', teams: ['England', 'Ghana', 'Croatia', 'Panama'] },
};

// ================================================================
// ALLE 72 GROEPSFASE WEDSTRIJDEN
// Bron: BetCity speelschema WK 2026 (officieel)
// Tijden in Nederlandse tijd (CEST)
// ================================================================
export const MATCHES = [
  // ===== ALLE 72 WEDSTRIJDEN (Officieel speelschema intikkertje.nl) =====
  { id: 'A1', group: 'A', home: 'Mexico',                  away: 'South Africa',          date: '2026-06-11T21:00', venue: 'Estadio Azteca, Mexico City' },
  { id: 'A2', group: 'A', home: 'South Korea',             away: 'Czechia',                date: '2026-06-12T04:00', venue: 'Guadalajara' },
  { id: 'A3', group: 'A', home: 'Czechia',                 away: 'South Africa',           date: '2026-06-18T18:00', venue: 'Mexico City' },
  { id: 'A4', group: 'A', home: 'Mexico',                  away: 'South Korea',            date: '2026-06-19T03:00', venue: 'Monterrey' },
  { id: 'A5', group: 'A', home: 'Czechia',                 away: 'Mexico',                 date: '2026-06-25T03:00', venue: 'Mexico City' },
  { id: 'A6', group: 'A', home: 'South Africa',            away: 'South Korea',            date: '2026-06-25T03:00', venue: 'Guadalajara' },
  { id: 'B1', group: 'B', home: 'Canada',                  away: 'Bosnia and Herzegovina', date: '2026-06-12T21:00', venue: 'BMO Field, Toronto' },
  { id: 'B2', group: 'B', home: 'Qatar',                   away: 'Switzerland',            date: '2026-06-13T21:00', venue: 'Vancouver' },
  { id: 'B3', group: 'B', home: 'Switzerland',             away: 'Bosnia and Herzegovina', date: '2026-06-18T21:00', venue: 'Toronto' },
  { id: 'B4', group: 'B', home: 'Canada',                  away: 'Qatar',                  date: '2026-06-19T00:00', venue: 'Vancouver' },
  { id: 'B5', group: 'B', home: 'Switzerland',             away: 'Canada',                 date: '2026-06-24T21:00', venue: 'Toronto' },
  { id: 'B6', group: 'B', home: 'Bosnia and Herzegovina',  away: 'Qatar',                  date: '2026-06-24T21:00', venue: 'Vancouver' },
  { id: 'C1', group: 'C', home: 'Brazil',                  away: 'Morocco',                date: '2026-06-14T00:00', venue: 'Los Angeles' },
  { id: 'C2', group: 'C', home: 'Haiti',                   away: 'Scotland',               date: '2026-06-14T03:00', venue: 'Seattle' },
  { id: 'C3', group: 'C', home: 'Scotland',                away: 'Morocco',                date: '2026-06-20T00:00', venue: 'Los Angeles' },
  { id: 'C4', group: 'C', home: 'Brazil',                  away: 'Haiti',                  date: '2026-06-20T02:30', venue: 'Seattle' },
  { id: 'C5', group: 'C', home: 'Scotland',                away: 'Brazil',                 date: '2026-06-25T00:00', venue: 'Los Angeles' },
  { id: 'C6', group: 'C', home: 'Morocco',                 away: 'Haiti',                  date: '2026-06-25T00:00', venue: 'Seattle' },
  { id: 'D1', group: 'D', home: 'United States',           away: 'Paraguay',               date: '2026-06-13T03:00', venue: 'Los Angeles' },
  { id: 'D2', group: 'D', home: 'Australia',               away: 'Türkiye',                date: '2026-06-14T06:00', venue: 'Seattle' },
  { id: 'D3', group: 'D', home: 'United States',           away: 'Australia',              date: '2026-06-19T21:00', venue: 'Seattle' },
  { id: 'D4', group: 'D', home: 'Türkiye',                 away: 'Paraguay',               date: '2026-06-20T05:00', venue: 'Los Angeles' },
  { id: 'D5', group: 'D', home: 'Türkiye',                 away: 'United States',          date: '2026-06-26T04:00', venue: 'Los Angeles' },
  { id: 'D6', group: 'D', home: 'Paraguay',                away: 'Australia',              date: '2026-06-26T04:00', venue: 'Seattle' },
  { id: 'E1', group: 'E', home: 'Germany',                 away: 'Curaçao',                date: '2026-06-14T19:00', venue: 'Houston' },
  { id: 'E2', group: 'E', home: 'Ivory Coast',             away: 'Ecuador',                date: '2026-06-15T01:00', venue: 'Philadelphia' },
  { id: 'E3', group: 'E', home: 'Germany',                 away: 'Ivory Coast',            date: '2026-06-20T22:00', venue: 'Toronto' },
  { id: 'E4', group: 'E', home: 'Ecuador',                 away: 'Curaçao',                date: '2026-06-21T02:00', venue: 'Kansas City' },
  { id: 'E5', group: 'E', home: 'Curaçao',                 away: 'Ivory Coast',            date: '2026-06-25T22:00', venue: 'Boston' },
  { id: 'E6', group: 'E', home: 'Ecuador',                 away: 'Germany',                date: '2026-06-25T22:00', venue: 'Atlanta' },
  { id: 'F1', group: 'F', home: 'Netherlands',             away: 'Japan',                  date: '2026-06-14T22:00', venue: 'Dallas' },
  { id: 'F2', group: 'F', home: 'Sweden',                  away: 'Tunisia',                date: '2026-06-15T04:00', venue: 'Atlanta' },
  { id: 'F3', group: 'F', home: 'Netherlands',             away: 'Sweden',                 date: '2026-06-20T19:00', venue: 'Houston' },
  { id: 'F4', group: 'F', home: 'Tunisia',                 away: 'Japan',                  date: '2026-06-21T06:00', venue: 'Dallas' },
  { id: 'F5', group: 'F', home: 'Japan',                   away: 'Sweden',                 date: '2026-06-26T01:00', venue: 'Atlanta' },
  { id: 'F6', group: 'F', home: 'Tunisia',                 away: 'Netherlands',            date: '2026-06-26T01:00', venue: 'Boston' },
  { id: 'G1', group: 'G', home: 'Belgium',                 away: 'Egypt',                  date: '2026-06-15T21:00', venue: 'Atlanta' },
  { id: 'G2', group: 'G', home: 'Iran',                    away: 'New Zealand',            date: '2026-06-16T03:00', venue: 'Houston' },
  { id: 'G3', group: 'G', home: 'Belgium',                 away: 'Iran',                   date: '2026-06-21T21:00', venue: 'Atlanta' },
  { id: 'G4', group: 'G', home: 'New Zealand',             away: 'Egypt',                  date: '2026-06-22T03:00', venue: 'Boston' },
  { id: 'G5', group: 'G', home: 'Egypt',                   away: 'Iran',                   date: '2026-06-27T05:00', venue: 'Atlanta' },
  { id: 'G6', group: 'G', home: 'New Zealand',             away: 'Belgium',                date: '2026-06-27T05:00', venue: 'Houston' },
  { id: 'H1', group: 'H', home: 'Spain',                   away: 'Cape Verde',             date: '2026-06-15T18:00', venue: 'Atlanta' },
  { id: 'H2', group: 'H', home: 'Saudi Arabia',            away: 'Uruguay',                date: '2026-06-16T00:00', venue: 'Miami' },
  { id: 'H3', group: 'H', home: 'Spain',                   away: 'Saudi Arabia',           date: '2026-06-21T18:00', venue: 'Atlanta' },
  { id: 'H4', group: 'H', home: 'Uruguay',                 away: 'Cape Verde',             date: '2026-06-22T00:00', venue: 'Miami' },
  { id: 'H5', group: 'H', home: 'Cape Verde',              away: 'Saudi Arabia',           date: '2026-06-27T02:00', venue: 'Atlanta' },
  { id: 'H6', group: 'H', home: 'Uruguay',                 away: 'Spain',                  date: '2026-06-27T02:00', venue: 'Miami' },
  { id: 'I1', group: 'I', home: 'France',                  away: 'Senegal',                date: '2026-06-16T21:00', venue: 'New York' },
  { id: 'I2', group: 'I', home: 'Iraq',                    away: 'Norway',                 date: '2026-06-17T00:00', venue: 'Boston' },
  { id: 'I3', group: 'I', home: 'France',                  away: 'Iraq',                   date: '2026-06-22T23:00', venue: 'New York' },
  { id: 'I4', group: 'I', home: 'Norway',                  away: 'Senegal',                date: '2026-06-23T02:00', venue: 'Boston' },
  { id: 'I5', group: 'I', home: 'Norway',                  away: 'France',                 date: '2026-06-26T21:00', venue: 'New York' },
  { id: 'I6', group: 'I', home: 'Senegal',                 away: 'Iraq',                   date: '2026-06-26T21:00', venue: 'Boston' },
  { id: 'J1', group: 'J', home: 'Argentina',               away: 'Algeria',                date: '2026-06-17T03:00', venue: 'Mexico City' },
  { id: 'J2', group: 'J', home: 'Austria',                 away: 'Jordan',                 date: '2026-06-17T06:00', venue: 'Guadalajara' },
  { id: 'J3', group: 'J', home: 'Argentina',               away: 'Austria',                date: '2026-06-22T19:00', venue: 'Mexico City' },
  { id: 'J4', group: 'J', home: 'Jordan',                  away: 'Algeria',                date: '2026-06-23T05:00', venue: 'Guadalajara' },
  { id: 'J5', group: 'J', home: 'Algeria',                 away: 'Austria',                date: '2026-06-28T04:00', venue: 'Monterrey' },
  { id: 'J6', group: 'J', home: 'Jordan',                  away: 'Argentina',              date: '2026-06-28T04:00', venue: 'Mexico City' },
  { id: 'K1', group: 'K', home: 'Portugal',                away: 'DR Congo',               date: '2026-06-17T19:00', venue: 'Atlanta' },
  { id: 'K2', group: 'K', home: 'Uzbekistan',              away: 'Colombia',               date: '2026-06-18T04:00', venue: 'Boston' },
  { id: 'K3', group: 'K', home: 'Portugal',                away: 'Uzbekistan',             date: '2026-06-23T19:00', venue: 'Atlanta' },
  { id: 'K4', group: 'K', home: 'Colombia',                away: 'DR Congo',               date: '2026-06-24T04:00', venue: 'Boston' },
  { id: 'K5', group: 'K', home: 'Colombia',                away: 'Portugal',               date: '2026-06-28T01:30', venue: 'Atlanta' },
  { id: 'K6', group: 'K', home: 'DR Congo',                away: 'Uzbekistan',             date: '2026-06-28T01:30', venue: 'Boston' },
  { id: 'L1', group: 'L', home: 'England',                 away: 'Croatia',                date: '2026-06-17T22:00', venue: 'Boston' },
  { id: 'L2', group: 'L', home: 'Ghana',                   away: 'Panama',                 date: '2026-06-18T01:00', venue: 'New York' },
  { id: 'L3', group: 'L', home: 'England',                 away: 'Ghana',                  date: '2026-06-23T22:00', venue: 'Boston' },
  { id: 'L4', group: 'L', home: 'Panama',                  away: 'Croatia',                date: '2026-06-24T01:00', venue: 'New York' },
  { id: 'L5', group: 'L', home: 'Panama',                  away: 'England',                date: '2026-06-27T23:00', venue: 'Boston' },
  { id: 'L6', group: 'L', home: 'Croatia',                 away: 'Ghana',                  date: '2026-06-27T23:00', venue: 'New York' },

];

// ================================================================
// PUNTENBEREKENING
// ================================================================
// Een voorspelling levert punten op:
// - 5 punten voor exact dezelfde uitslag
// - 3 punten voor juiste doelsaldo (1-2 en 2-3 hebben beide doelsaldo -1)
// - 1 punt voor alleen de juiste winnaar/gelijkspel
export function calculatePoints(prediction, result) {
  if (!prediction || prediction.home == null || prediction.away == null) return 0;
  if (!result || result.home == null || result.away == null) return 0;

  const pH = parseInt(prediction.home, 10);
  const pA = parseInt(prediction.away, 10);
  const rH = parseInt(result.home, 10);
  const rA = parseInt(result.away, 10);

  // Exacte uitslag
  if (pH === rH && pA === rA) return SCORING.EXACT_SCORE;

  const pDiff = pH - pA;
  const rDiff = rH - rA;

  // Juist doelsaldo (alleen geldig bij niet-gelijkspel)
  if (pDiff !== 0 && rDiff !== 0 && pDiff === rDiff) {
    return SCORING.GOAL_DIFF;
  }

  // Juiste winnaar (of beide gelijkspel)
  const pWinner = pDiff > 0 ? 'home' : pDiff < 0 ? 'away' : 'draw';
  const rWinner = rDiff > 0 ? 'home' : rDiff < 0 ? 'away' : 'draw';
  if (pWinner === rWinner) return SCORING.WINNER;

  return 0;
}
