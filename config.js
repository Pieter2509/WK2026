// Firebase configuratie
// VUL HIER JE EIGEN FIREBASE GEGEVENS IN
// Zie README.md voor instructies hoe je deze gegevens krijgt

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
// VERANDER DIT! Iedereen die dit wachtwoord kent kan uitslagen invoeren
// Tip: gebruik iets simpels dat alleen jij en je vrienden weten
export const ADMIN_PASSWORD = "Pieter2509";

// Deadline: voorspellingen kunnen niet meer worden aangepast na deze datum
// Standaard: vlak voor de openingsmatch (11 juni 2026, 21:00 NL tijd)
// Zet op null om geen deadline te hebben
export const PREDICTION_DEADLINE = null;

// API-Football key voor live uitslagen (gratis tier, 100 calls/dag)
// Krijg een gratis key op: https://www.api-football.com
// Deze key wordt gedeeld tussen wksimps en weekendje weg poul
// Sync interval staat op 30 min om binnen 100 calls/dag te blijven
export const API_FOOTBALL_KEY = "b8f6b9f8d54d5184e3ddf38e24c02622";
