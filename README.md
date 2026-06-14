# Verdant Pulse 🌿 — Ecology Balance Platform

Verdant Pulse is a behavior-change platform that goes beyond carbon calculations to create deep emotional understanding, influence daily habits, and guide individuals toward ecological balance. 

Through an interactive visual nature ecosystem, an AI-powered conversational Carbon Coach, and focused weekly challenges, the platform transforms dry carbon metrics into an engaging, gamified environmental story.

---

## 📖 Table of Contents
1. [Core Pillars & Challenge Alignment](#-core-pillars--challenge-alignment)
2. [Innovative Features](#-innovative-features)
3. [Calculation Logic & Equivalents](#-calculation-logic--equivalents)
4. [Tech Stack](#-tech-stack)
5. [Folder Structure](#-folder-structure)
6. [Getting Started Locally](#-getting-started-locally)
7. [Running Tests](#-running-tests)
8. [Google Cloud Run Deployment](#-google-cloud-run-deployment)
9. [Accessibility & Security Standards](#-accessibility--security-standards)

---

## 🧩 Core Pillars & Challenge Alignment

The challenge judges emphasized: **"Awareness is not a dashboard; it is an experience."** Verdant Pulse solves this by aligning with these key parameters:

- **From Metrics to Emotion**: Users observe their "Carbon Twin"—a living nature scene that physically flourishes or decays based on their lifestyle decisions.
- **From Guilt to Encouragement**: Replaces scary climate numbers with practical, uplifting nudges and structured weekly goals.
- **Personalized Action**: Couples automated recommendation prioritization with a direct conversational AI Carbon Coach.

---

## ✨ Innovative Features

### 1. Carbon Twin Ecosystem
A reactive, responsive SVG canvas displaying a localized landscape. As the user's monthly emissions change:
- **Low Emissions (<= 350 kg/mo)**: Vibrant green pines, clear blue skies, flowing river ripples, and flying birds.
- **Medium Emissions (351 - 700 kg/mo)**: Muted trees showing dry limbs, soft warm sky haze, and fewer birds.
- **High Emissions (> 700 kg/mo)**: Bare, dry branches, grey stagnant rivers, dark overcast skies, and no birds.

### 2. AI Carbon Coach
Integrates the Google Gemini API (`gemini-1.5-flash`) directly at the server level via native REST requests.
- Accepts the user's questionnaire parameters, emissions breakdown, and customized recommendations as context.
- Answers user questions (e.g., *"How can I transition my food choices?"*) in a positive, actionable tone.
- **Offline Fallback**: Automatically activates a rule-based response engine if the API key is absent or unreachable.

### 3. Weekly Eco Challenges
A structured dashboard component encouraging gamified habit formation.
- Features dynamic tasks: *Meat-Free Friday*, *Zero Ride-Hailing*, *Phantom Power Purge*, and *Transit Champion*.
- Earned achievements are celebrated with visual trophy badges (e.g. `🥗 Green Gourmet`, `🔌 Power Purger`).
- Completions directly decrease the live emissions metrics and update the Carbon Twin in real-time.

### 4. Impact Stories
Translates raw numbers into understandable comparisons:
- **Vehicle Travel**: Matches saved kilograms to equivalent kilometers avoided in a standard gasoline car.
- **Forest Absorption**: Matches savings to equivalent days a mature tree has to absorb carbon.
- **Grid Utility**: Matches savings to standard smartphone charges avoided.

---

## 🧮 Calculation Logic & Equivalents

Calculations are computed dynamically in the stateless backend service layer:
- **Commute**: `Weekly Distance * 4.33 * Factor` (Petrol: `0.170`, Diesel: `0.171`, EV: `0.050`, Transit: `0.040`).
- **Diet**: Converts daily nutrition footprint to monthly (Meat-Heavy: `240 kg`, Flexitarian: `135 kg`, Vegetarian: `105 kg`, Vegan: `75 kg`).
- **Home Energy**: Low (`60 kg`), Medium (`140 kg`), High (`280 kg`) base bills. Heating modifiers: Gas (`+80 kg`), Electric (`+40 kg`), Solar/Geothermal (`+0 kg`).
- **Shopping**: Minimalist (`15 kg`), Moderate (`60 kg`), Frequent (`150 kg`).
- **Waste**: Composting & Full Recycle (`8 kg`), Partial Recycle (`25 kg`), No Sorting (`50 kg`).

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite, custom state, localized state syncing using `localStorage`).
- **Backend**: Node.js, Express, Helmet (Security headers), CORS, Express Rate Limit, express-validator.
- **Testing**: Jest, Supertest.
- **Styling**: Pure CSS (CSS custom variables, layout grids, keyframe animations).
- **Deployment**: Google Cloud Run (Docker multi-stage build).

---

## 📁 Folder Structure

```
verdant-pulse/
  ├── client/                  # React Frontend Application
  │   ├── index.html           # HTML wrapper containing Google Fonts
  │   ├── vite.config.js       # Vite proxy & build settings
  │   └── src/
  │       ├── main.jsx         # App mount entry point
  │       ├── App.jsx          # Hydration and state controller
  │       ├── index.css        # Responsive, premium vanilla design rules
  │       ├── components/      # GlassCard, Navbar, CarbonTwin, CarbonCoach, etc.
  │       └── pages/           # Landing page, Onboarding quiz, Dashboard hub
  ├── server/                  # Node/Express Backend
  │   ├── src/
  │   │   ├── index.js         # Security middleware configuration & SPA server
  │   │   ├── routes/          # API endpoint validators and route mappings
  │   │   └── services/        # Calculator, Recommender, Gemini, Impact, Challenges
  │   └── tests/               # Test suites (30+ automated tests)
  ├── Dockerfile               # Production image descriptor
  ├── package.json             # Root NPM scripts
  └── README.md                # Documentation
```

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
Run the root-level setup script to configure packages:
```bash
npm run setup
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory and at the root:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=8080
NODE_ENV=development
```

### 3. Run Development Servers
Launch React (port `5173`) and Express (port `5000`) concurrently:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 4. Build and Run Production
```bash
npm run build
npm start
```
Open [http://localhost:8080](http://localhost:8080).

---

## 🧪 Running Tests

Verdant Pulse has **30 passing unit and integration tests** verifying calculator operations, recommendation ordering, challenge structures, translation math, Gemini offline modes, and API security schemas.

To execute tests:
```bash
npm run test
```

---

## ☁️ Google Cloud Run Deployment

Deploy the container using these commands:
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/verdant-pulse
gcloud run deploy verdant-pulse \
  --image gcr.io/YOUR_PROJECT_ID/verdant-pulse \
  --platform managed \
  --allow-unauthenticated
```

---

## ♿ Accessibility & Security Standards

### Accessibility Upgrade (Lighthouse > 95 target):
- **Skip Navigation Link**: Supports keyboard screen reader skip-to-content.
- **Outline Highlights**: `:focus-visible` styling applies clear gold outlines.
- **Semantic landmarks**: Employs landmark landmarks (`main`, `header`, `footer`, `section`).
- **Aria attributes**: Proper labels and logs mapped for assistive tools.

### Security Upgrade:
- **Centralized Validator**: Employs `express-validator` to sanitise payloads and block malformed formats.
- **Centralized Error Handlers**: Traps exceptions and parser bugs safely.
- **XSS & CORS protection**: Escapes input strings and enforces Helmet headers.
