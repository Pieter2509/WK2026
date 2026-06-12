// Firebase configuratie
export const firebaseConfig = {
  apiKey: "AIzaSyCw6_GiP-2x_kqZ62MVfZ-EGdBvIRxqqr0",
  authDomain: "wk2026-56a7d.firebaseapp.com",
  projectId: "wk2026-56a7d",
  storageBucket: "wk2026-56a7d.firebasestorage.app",
  messagingSenderId: "269561128194",
  appId: "1:269561128194:web:5e5726fafbaad4fdd24e1b"
};

// Naam van de poul (verschijnt in de header)
export const POOL_NAME = "WK Poul 2026";

// Beheerderwachtwoord voor het invullen van officiele uitslagen
export const ADMIN_PASSWORD = "Pieter2509";

// Deadline: voorspellingen kunnen niet meer worden aangepast na deze datum
// null = geen deadline, alleen per-wedstrijd lock van 1 uur voor aftrap
export const PREDICTION_DEADLINE = null;

// Football-Data.org API token voor live uitslagen
// Gratis account: https://www.football-data.org/client/register
// Gratis tier: 10 calls per minuut, inclusief WK 2026 (competition WC)
// Updates binnen enkele minuten na een wedstrijd
export const FOOTBALL_DATA_TOKEN = "cd8021310aec4645ac9dcf58b6160662";
