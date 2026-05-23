# WK Poul 2026

Een gratis, zelf gehoste voorspellingspoul voor het FIFA Wereldkampioenschap 2026 (VS, Canada, Mexico, 11 juni tot 19 juli 2026). Werkt op GitHub Pages, gebruikt Firebase voor cloud sync zodat jij en je vrienden samen kunnen spelen.

## Wat krijg je

- Voorspel uitslagen van alle 72 groepswedstrijden
- Live ranglijst op basis van een puntensysteem (5 punten exacte uitslag, 3 voor juist doelsaldo, 1 voor juiste winnaar)
- Live groepsstanden zodra officiële uitslagen worden ingevoerd
- **Automatische sync van officiële uitslagen** via openfootball/worldcup.json (gratis, geen API-key)
- Beheerpaneel om officiële uitslagen handmatig in te voeren (met wachtwoord)
- Werkt op alle apparaten (mobiel, tablet, desktop)
- Inloggen met alleen je naam, geen e-mail of registratie nodig

## Setup in 6 stappen (ongeveer 15 minuten)

### Stap 1: Firebase project aanmaken

1. Ga naar https://console.firebase.google.com
2. Log in met je Google account
3. Klik op "Project toevoegen" (Add project)
4. Geef het een naam zoals `wk-poul-2026`
5. Google Analytics is niet nodig, je mag het uitschakelen
6. Klik op "Project maken"

### Stap 2: Firestore database activeren

1. In je Firebase project, ga naar "Build" > "Firestore Database" in het menu links
2. Klik op "Database maken"
3. Kies "Start in productiemodus" (we passen de regels zo aan)
4. Kies een locatie dichtbij: `europe-west` of `eur3 (europe-west)` voor Nederland
5. Klik op "Inschakelen"

### Stap 3: Firestore regels instellen

In de Firestore database, ga naar het tabblad "Regels" en plak dit:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Iedereen mag lezen en schrijven (vriendenpoul, geen gevoelige data)
    // Voor strengere beveiliging zie de uitleg onderaan dit bestand
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Klik op "Publiceren".

### Stap 4: Web app toevoegen

1. Klik op het tandwiel-icoon (Settings) naast "Project Overview"
2. Klik op "Projectinstellingen"
3. Scrol naar beneden naar "Uw apps"
4. Klik op het web-icoon `</>`
5. Geef de app een naam zoals `wk-poul-web`
6. Vink Firebase Hosting NIET aan (we gebruiken GitHub Pages)
7. Klik op "App registreren"
8. Je ziet nu een blok code met `firebaseConfig`. Kopieer de waardes!

### Stap 5: config.js invullen

Open `config.js` in deze repository en vul de gegevens van Firebase in:

```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyC...",                    // van Firebase
  authDomain: "wk-poul-2026.firebaseapp.com",
  projectId: "wk-poul-2026",
  storageBucket: "wk-poul-2026.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

export const POOL_NAME = "Onze WK Poul";   // verzin een leuke naam
export const ADMIN_PASSWORD = "verander-mij";  // jouw geheime wachtwoord
export const PREDICTION_DEADLINE = "2026-06-11T20:00:00";  // of null
```

**Verander zeker het ADMIN_PASSWORD!** Alleen jij (en wie je het wachtwoord geeft) kunnen officiële uitslagen invoeren.

### Stap 6: Deployen op GitHub Pages

1. Maak een nieuwe GitHub repository (bijvoorbeeld `wk-poul-2026`)
2. Push alle bestanden van deze map naar de repository
3. Ga in de repository naar "Settings" > "Pages"
4. Bij "Source" kies je "Deploy from a branch"
5. Kies branch `main` en folder `/ (root)`
6. Klik op "Save"
7. Na ongeveer 1 minuut is je site live op `https://JOUW-USERNAME.github.io/wk-poul-2026/`

Stuur de link naar je vrienden, klaar!

## Voor de beheerder

- Tijdens het WK ga je naar het tabblad **Beheer**, voer je het wachtwoord in en kun je officiële uitslagen invoeren
- Zodra je een uitslag invult worden bij iedereen automatisch de punten berekend
- De groepsstanden updaten ook automatisch
- Tip: hou bijvoorbeeld nu.nl of FIFA.com open tijdens wedstrijden en vul de uitslag in zodra een wedstrijd afgelopen is

### Automatische uitslagen (aanbevolen)

In het beheerpaneel vind je twee knoppen voor automatische sync:

- **Nu synchroniseren**: haalt direct alle officiële uitslagen op uit openfootball/worldcup.json
- **Auto-sync aanzetten**: synchroniseert automatisch elke 5 minuten zolang je tab open is

De bron (openfootball/worldcup.json) is gratis open data, geen API-key nodig, en wordt door vrijwilligers bijgewerkt na elke wedstrijd. Houd er rekening mee dat updates soms een paar uur kunnen duren. Je kunt altijd handmatig uitslagen invoeren of corrigeren als de automatische update er nog niet is.

**Tip**: laat tijdens het WK gewoon een tab openstaan op de site terwijl je gewone dingen doet. Met auto-sync aan worden alle uitslagen automatisch verwerkt en hoef je niks meer te doen.

## Voor de spelers

- Iedereen logt in met zijn voornaam (bijvoorbeeld "Joep")
- Vul voor elke wedstrijd je voorspelling in (bijvoorbeeld Nederland 2 - 1 Japan)
- Voorspellingen worden automatisch opgeslagen
- Voorspellingen sluiten 1 uur voor de wedstrijd
- Globale deadline: standaard 1 uur voor de openingswedstrijd (zet op `null` in config.js om dat uit te schakelen)

## Veelgestelde vragen

**Kan ik dit gratis hosten?**
Ja, GitHub Pages en het Firebase Spark-plan (gratis) zijn ruim voldoende voor een vriendenpoul. Firestore heeft een gratis quotum van 50.000 leesacties en 20.000 schrijfacties per dag, wat ver boven wat een vriendenpoul gebruikt ligt.

**Hoe pas ik de wedstrijdtijden aan?**
Open `data.js`, daar vind je alle 72 wedstrijden met datum en tijd. Pas aan en push opnieuw naar GitHub. Tijden staan nu in NL-tijd zo goed mogelijk.

**Hoe pas ik het puntensysteem aan?**
Bovenaan `data.js` vind je het `SCORING` object. Verander de cijfers en push opnieuw.

**Wat als iemand vals speelt en het admin-wachtwoord kraakt?**
Het ADMIN_PASSWORD staat in de client-side code en is dus niet super veilig. Voor een vriendenpoul is dit prima. Voor strengere beveiliging zou je Firebase Authentication moeten gebruiken (zie hieronder).

**Hoe maak ik Firestore strenger?**

Vervang de Firestore regels door dit:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Iedereen mag lezen
    match /{document=**} {
      allow read: if true;
    }
    
    // Voorspellingen: alleen schrijven met geldige structuur
    match /predictions/{predId} {
      allow write: if request.resource.data.keys().hasAll(['userKey', 'userName', 'matchId', 'home', 'away'])
                   && request.resource.data.home is int
                   && request.resource.data.away is int
                   && request.resource.data.home >= 0
                   && request.resource.data.away >= 0
                   && request.resource.data.home <= 20
                   && request.resource.data.away <= 20;
    }
    
    // Users: alleen schrijven met geldige structuur
    match /users/{userKey} {
      allow write: if request.resource.data.keys().hasAny(['displayName']);
    }
    
    // Resultaten: open schrijven (admin wachtwoord regelt dit client-side)
    // Voor echte beveiliging: gebruik Firebase Authentication en custom claims
    match /results/{matchId} {
      allow write: if true;
    }
  }
}
```

## Bestanden

- `index.html`: hoofdpagina structuur
- `styles.css`: alle styling
- `app.js`: applicatie logica met Firebase
- `autosync.js`: automatische sync met openfootball/worldcup.json
- `data.js`: groepen, wedstrijden, puntensysteem
- `config.js`: jouw Firebase configuratie (zelf invullen!)
- `README.md`: dit bestand
- `.nojekyll`: zodat GitHub Pages geen Jekyll gebruikt

## Veel plezier met het WK!

Bij vragen of bugs: open een issue op GitHub of vraag het aan de persoon die de poul heeft opgezet.
