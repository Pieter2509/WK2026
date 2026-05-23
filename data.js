// WK 2026 data: alle 12 groepen en 72 groepsfase wedstrijden
// Bron: officieel FIFA loting (5 dec 2025) + playoffs (31 maart 2026)
// Datums in lokale tijd VS/Canada/Mexico, je kunt ze aanpassen naar NL tijd indien gewenst

export const GROUPS = {
  A: { name: 'Groep A', teams: ['Mexico', 'Zuid-Afrika', 'Zuid-Korea', 'Tsjechië'] },
  B: { name: 'Groep B', teams: ['Canada', 'Zwitserland', 'Qatar', 'Bosnië en Herzegovina'] },
  C: { name: 'Groep C', teams: ['Brazilië', 'Marokko', 'Schotland', 'Haïti'] },
  D: { name: 'Groep D', teams: ['Verenigde Staten', 'Paraguay', 'Australië', 'Turkije'] },
  E: { name: 'Groep E', teams: ['Duitsland', 'Ecuador', 'Ivoorkust', 'Curaçao'] },
  F: { name: 'Groep F', teams: ['Nederland', 'Japan', 'Zweden', 'Tunesië'] },
  G: { name: 'Groep G', teams: ['België', 'Egypte', 'Iran', 'Nieuw-Zeeland'] },
  H: { name: 'Groep H', teams: ['Spanje', 'Uruguay', 'Saoedi-Arabië', 'Kaapverdië'] },
  I: { name: 'Groep I', teams: ['Frankrijk', 'Senegal', 'Noorwegen', 'Irak'] },
  J: { name: 'Groep J', teams: ['Argentinië', 'Oostenrijk', 'Algerije', 'Jordanië'] },
  K: { name: 'Groep K', teams: ['Portugal', 'Colombia', 'Oezbekistan', 'DR Congo'] },
  L: { name: 'Groep L', teams: ['Engeland', 'Kroatië', 'Panama', 'Ghana'] },
};

// Vlag emoji voor elk team
export const FLAGS = {
  'Mexico': '🇲🇽', 'Zuid-Afrika': '🇿🇦', 'Zuid-Korea': '🇰🇷', 'Tsjechië': '🇨🇿',
  'Canada': '🇨🇦', 'Zwitserland': '🇨🇭', 'Qatar': '🇶🇦', 'Bosnië en Herzegovina': '🇧🇦',
  'Brazilië': '🇧🇷', 'Marokko': '🇲🇦', 'Schotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Haïti': '🇭🇹',
  'Verenigde Staten': '🇺🇸', 'Paraguay': '🇵🇾', 'Australië': '🇦🇺', 'Turkije': '🇹🇷',
  'Duitsland': '🇩🇪', 'Ecuador': '🇪🇨', 'Ivoorkust': '🇨🇮', 'Curaçao': '🇨🇼',
  'Nederland': '🇳🇱', 'Japan': '🇯🇵', 'Zweden': '🇸🇪', 'Tunesië': '🇹🇳',
  'België': '🇧🇪', 'Egypte': '🇪🇬', 'Iran': '🇮🇷', 'Nieuw-Zeeland': '🇳🇿',
  'Spanje': '🇪🇸', 'Uruguay': '🇺🇾', 'Saoedi-Arabië': '🇸🇦', 'Kaapverdië': '🇨🇻',
  'Frankrijk': '🇫🇷', 'Senegal': '🇸🇳', 'Noorwegen': '🇳🇴', 'Irak': '🇮🇶',
  'Argentinië': '🇦🇷', 'Oostenrijk': '🇦🇹', 'Algerije': '🇩🇿', 'Jordanië': '🇯🇴',
  'Portugal': '🇵🇹', 'Colombia': '🇨🇴', 'Oezbekistan': '🇺🇿', 'DR Congo': '🇨🇩',
  'Engeland': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Kroatië': '🇭🇷', 'Panama': '🇵🇦', 'Ghana': '🇬🇭',
};

// Alle 72 groepsfase wedstrijden
// id format: groep + matchnummer (bv F3 = Groep F, 3e wedstrijd)
// date in ISO format met NL lokale tijd waar bekend
// Belangrijke wedstrijden (Nederland, openingsmatch) hebben exacte tijden,
// andere zijn schattingen op basis van de speeldag - admin kan deze aanpassen
export const MATCHES = [
  // ===== MATCHDAY 1 =====
  // 11 juni - opening
  { id: 'A1', group: 'A', home: 'Mexico', away: 'Zuid-Afrika', date: '2026-06-11T21:00', venue: 'Estadio Azteca, Mexico City' },
  
  // 12 juni
  { id: 'A2', group: 'A', home: 'Zuid-Korea', away: 'Tsjechië', date: '2026-06-12T04:00', venue: 'Guadalajara' },
  { id: 'B1', group: 'B', home: 'Canada', away: 'Bosnië en Herzegovina', date: '2026-06-12T21:00', venue: 'BMO Field, Toronto' },
  { id: 'D1', group: 'D', home: 'Verenigde Staten', away: 'Paraguay', date: '2026-06-13T03:00', venue: 'SoFi Stadium, Los Angeles' },
  
  // 13 juni
  { id: 'B2', group: 'B', home: 'Qatar', away: 'Zwitserland', date: '2026-06-13T21:00', venue: 'San Francisco Bay' },
  { id: 'C1', group: 'C', home: 'Brazilië', away: 'Marokko', date: '2026-06-14T00:00', venue: 'MetLife Stadium, New Jersey' },
  { id: 'C2', group: 'C', home: 'Haïti', away: 'Schotland', date: '2026-06-14T03:00', venue: 'Boston' },
  
  // 14 juni
  { id: 'D2', group: 'D', home: 'Australië', away: 'Turkije', date: '2026-06-14T06:00', venue: 'BC Place, Vancouver' },
  { id: 'E1', group: 'E', home: 'Duitsland', away: 'Curaçao', date: '2026-06-14T19:00', venue: 'Houston' },
  { id: 'F1', group: 'F', home: 'Nederland', away: 'Japan', date: '2026-06-14T22:00', venue: 'AT&T Stadium, Dallas' },
  { id: 'E2', group: 'E', home: 'Ivoorkust', away: 'Ecuador', date: '2026-06-15T01:00', venue: 'Philadelphia' },
  { id: 'F2', group: 'F', home: 'Zweden', away: 'Tunesië', date: '2026-06-15T04:00', venue: 'Estadio Monterrey' },
  
  // 15 juni
  { id: 'H1', group: 'H', home: 'Spanje', away: 'Kaapverdië', date: '2026-06-15T18:00', venue: 'Atlanta' },
  { id: 'G1', group: 'G', home: 'België', away: 'Egypte', date: '2026-06-15T21:00', venue: 'Lumen Field, Seattle' },
  { id: 'H2', group: 'H', home: 'Saoedi-Arabië', away: 'Uruguay', date: '2026-06-16T00:00', venue: 'Hard Rock Stadium, Miami' },
  { id: 'G2', group: 'G', home: 'Iran', away: 'Nieuw-Zeeland', date: '2026-06-16T03:00', venue: 'SoFi Stadium, Los Angeles' },
  
  // 16 juni
  { id: 'I1', group: 'I', home: 'Frankrijk', away: 'Senegal', date: '2026-06-16T21:00', venue: 'MetLife Stadium, New Jersey' },
  { id: 'I2', group: 'I', home: 'Noorwegen', away: 'Irak', date: '2026-06-17T00:00', venue: 'Philadelphia' },
  { id: 'J1', group: 'J', home: 'Argentinië', away: 'Oostenrijk', date: '2026-06-17T03:00', venue: 'AT&T Stadium, Dallas' },
  
  // 17 juni
  { id: 'J2', group: 'J', home: 'Algerije', away: 'Jordanië', date: '2026-06-17T19:00', venue: 'San Francisco Bay' },
  { id: 'K1', group: 'K', home: 'Portugal', away: 'Oezbekistan', date: '2026-06-17T21:00', venue: 'Houston' },
  { id: 'L1', group: 'L', home: 'Engeland', away: 'Ghana', date: '2026-06-18T00:00', venue: 'Boston' },
  { id: 'K2', group: 'K', home: 'Colombia', away: 'DR Congo', date: '2026-06-18T03:00', venue: 'Kansas City' },
  { id: 'L2', group: 'L', home: 'Kroatië', away: 'Panama', date: '2026-06-18T06:00', venue: 'Vancouver' },

  // ===== MATCHDAY 2 =====
  // 17-23 juni
  { id: 'A3', group: 'A', home: 'Mexico', away: 'Zuid-Korea', date: '2026-06-18T21:00', venue: 'Mexico City' },
  { id: 'A4', group: 'A', home: 'Tsjechië', away: 'Zuid-Afrika', date: '2026-06-19T00:00', venue: 'Monterrey' },
  
  { id: 'B3', group: 'B', home: 'Canada', away: 'Qatar', date: '2026-06-19T21:00', venue: 'Vancouver' },
  { id: 'B4', group: 'B', home: 'Bosnië en Herzegovina', away: 'Zwitserland', date: '2026-06-20T00:00', venue: 'Seattle' },
  
  { id: 'C3', group: 'C', home: 'Brazilië', away: 'Schotland', date: '2026-06-20T03:00', venue: 'Atlanta' },
  { id: 'C4', group: 'C', home: 'Marokko', away: 'Haïti', date: '2026-06-20T06:00', venue: 'Los Angeles' },
  
  { id: 'D3', group: 'D', home: 'Verenigde Staten', away: 'Australië', date: '2026-06-20T21:00', venue: 'Lumen Field, Seattle' },
  { id: 'D4', group: 'D', home: 'Paraguay', away: 'Turkije', date: '2026-06-21T00:00', venue: 'San Francisco' },
  
  { id: 'E3', group: 'E', home: 'Duitsland', away: 'Ivoorkust', date: '2026-06-20T22:00', venue: 'Toronto' },
  { id: 'E4', group: 'E', home: 'Ecuador', away: 'Curaçao', date: '2026-06-21T02:00', venue: 'Kansas City' },
  
  { id: 'F3', group: 'F', home: 'Nederland', away: 'Zweden', date: '2026-06-20T19:00', venue: 'NRG Stadium, Houston' },
  { id: 'F4', group: 'F', home: 'Tunesië', away: 'Japan', date: '2026-06-21T06:00', venue: 'Monterrey' },
  
  { id: 'G3', group: 'G', home: 'België', away: 'Iran', date: '2026-06-21T21:00', venue: 'SoFi Stadium, Los Angeles' },
  { id: 'G4', group: 'G', home: 'Nieuw-Zeeland', away: 'Egypte', date: '2026-06-22T03:00', venue: 'Vancouver' },
  
  { id: 'H3', group: 'H', home: 'Spanje', away: 'Saoedi-Arabië', date: '2026-06-21T18:00', venue: 'Atlanta' },
  { id: 'H4', group: 'H', home: 'Uruguay', away: 'Kaapverdië', date: '2026-06-22T00:00', venue: 'Miami' },
  
  { id: 'I3', group: 'I', home: 'Frankrijk', away: 'Irak', date: '2026-06-22T23:00', venue: 'Philadelphia' },
  { id: 'I4', group: 'I', home: 'Noorwegen', away: 'Senegal', date: '2026-06-23T02:00', venue: 'MetLife, New Jersey' },
  
  { id: 'J3', group: 'J', home: 'Argentinië', away: 'Algerije', date: '2026-06-23T19:00', venue: 'Dallas' },
  { id: 'J4', group: 'J', home: 'Oostenrijk', away: 'Jordanië', date: '2026-06-23T22:00', venue: 'San Francisco' },
  
  { id: 'K3', group: 'K', home: 'Portugal', away: 'Colombia', date: '2026-06-23T21:00', venue: 'Houston' },
  { id: 'K4', group: 'K', home: 'Oezbekistan', away: 'DR Congo', date: '2026-06-24T01:00', venue: 'Kansas City' },
  
  { id: 'L3', group: 'L', home: 'Engeland', away: 'Kroatië', date: '2026-06-24T21:00', venue: 'Boston' },
  { id: 'L4', group: 'L', home: 'Panama', away: 'Ghana', date: '2026-06-25T00:00', venue: 'Vancouver' },

  // ===== MATCHDAY 3 (simultane wedstrijden per groep) =====
  { id: 'A5', group: 'A', home: 'Zuid-Afrika', away: 'Zuid-Korea', date: '2026-06-24T21:00', venue: 'Guadalajara' },
  { id: 'A6', group: 'A', home: 'Tsjechië', away: 'Mexico', date: '2026-06-24T21:00', venue: 'Mexico City' },
  
  { id: 'B5', group: 'B', home: 'Zwitserland', away: 'Canada', date: '2026-06-25T21:00', venue: 'Vancouver' },
  { id: 'B6', group: 'B', home: 'Bosnië en Herzegovina', away: 'Qatar', date: '2026-06-25T21:00', venue: 'Toronto' },
  
  { id: 'C5', group: 'C', home: 'Schotland', away: 'Marokko', date: '2026-06-25T21:00', venue: 'Atlanta' },
  { id: 'C6', group: 'C', home: 'Haïti', away: 'Brazilië', date: '2026-06-25T21:00', venue: 'Miami' },
  
  { id: 'D5', group: 'D', home: 'Turkije', away: 'Verenigde Staten', date: '2026-06-25T21:00', venue: 'SoFi, Los Angeles' },
  { id: 'D6', group: 'D', home: 'Australië', away: 'Paraguay', date: '2026-06-25T21:00', venue: 'San Francisco' },
  
  { id: 'E5', group: 'E', home: 'Curaçao', away: 'Duitsland', date: '2026-06-26T21:00', venue: 'Toronto' },
  { id: 'E6', group: 'E', home: 'Ecuador', away: 'Ivoorkust', date: '2026-06-26T21:00', venue: 'Philadelphia' },
  
  { id: 'F5', group: 'F', home: 'Tunesië', away: 'Nederland', date: '2026-06-26T01:00', venue: 'Arrowhead Stadium, Kansas City' },
  { id: 'F6', group: 'F', home: 'Japan', away: 'Zweden', date: '2026-06-26T01:00', venue: 'AT&T Stadium, Dallas' },
  
  { id: 'G5', group: 'G', home: 'Egypte', away: 'Iran', date: '2026-06-26T21:00', venue: 'Seattle' },
  { id: 'G6', group: 'G', home: 'Nieuw-Zeeland', away: 'België', date: '2026-06-26T21:00', venue: 'Vancouver' },
  
  { id: 'H5', group: 'H', home: 'Kaapverdië', away: 'Spanje', date: '2026-06-27T21:00', venue: 'Atlanta' },
  { id: 'H6', group: 'H', home: 'Saoedi-Arabië', away: 'Uruguay', date: '2026-06-27T21:00', venue: 'Miami' },
  
  { id: 'I5', group: 'I', home: 'Irak', away: 'Senegal', date: '2026-06-27T21:00', venue: 'Philadelphia' },
  { id: 'I6', group: 'I', home: 'Noorwegen', away: 'Frankrijk', date: '2026-06-27T21:00', venue: 'MetLife, New Jersey' },
  
  { id: 'J5', group: 'J', home: 'Jordanië', away: 'Argentinië', date: '2026-06-28T01:00', venue: 'Dallas' },
  { id: 'J6', group: 'J', home: 'Algerije', away: 'Oostenrijk', date: '2026-06-28T01:00', venue: 'San Francisco' },
  
  { id: 'K5', group: 'K', home: 'DR Congo', away: 'Portugal', date: '2026-06-28T21:00', venue: 'Houston' },
  { id: 'K6', group: 'K', home: 'Oezbekistan', away: 'Colombia', date: '2026-06-28T21:00', venue: 'Kansas City' },
  
  { id: 'L5', group: 'L', home: 'Ghana', away: 'Kroatië', date: '2026-06-28T21:00', venue: 'Boston' },
  { id: 'L6', group: 'L', home: 'Panama', away: 'Engeland', date: '2026-06-28T21:00', venue: 'Vancouver' },
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
