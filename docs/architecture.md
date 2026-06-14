# System Architecture

This document describes the structural layout and system layers of the Verdant Pulse application.

```mermaid
graph TD
  A[App.jsx Router] --> B(Landing Page)
  A --> C(Quiz Page)
  A --> D(Dashboard Page)
  
  C --> C1(QuizStep Subcomponents)
  D --> D1(TrendChart Component)
  D --> D2(CategoryBreakdown Component)
  D --> D3(WeeklyChallenges Component)
  D --> D4(ActionPlan Component)
  D --> D5(CarbonTwin Component)
  D --> D6(CarbonCoach Component)
  
  subgraph Custom React Hooks Layer
    H1(useCarbonProfile)
    H2(useChallenges)
    H3(useRecommendations)
    H4(useCoach)
    H5(useLocalStorage)
  end
  
  D --> H1
  D --> H2
  D --> H3
  D6 --> H4
  H1 --> H5
  H2 --> H5
  
  subgraph Network Services API Layer
    S1(carbonApi)
    S2(coachApi)
  end
  
  H1 --> S1
  H2 --> S1
  H3 --> S1
  H4 --> S2
  
  S1 --> Backend[Express Server]
  S2 --> Backend
```

## Frontend Design Layers

1. **Routing & Core Orchestration (`App.jsx`)**
   - Directs overall view state (`landing`, `quiz`, `dashboard`).
   - Hooks into the global state providers (`useCarbonProfile` and `useChallenges`).

2. **Presentation Components (`components/`)**
   - Clean rendering structures optimized with `React.memo` to eliminate redundant redraw operations.
   - Decoupled from service modules; consumes props directly.

3. **Custom Hooks (`hooks/`)**
   - Acts as the state machinery. Handles asynchronous data syncing, cache invalidation, and daily streaks counting.
   - Encapsulates side-effects securely.

4. **Service Adapters (`services/`)**
   - High-level abstractions wrapping fetch calls. No routing or component details are exposed here.

5. **Utilities & Constants (`utils/` / `constants/`)**
   - Pure math formulas (`calculations.js`), string helpers (`formatters.js`), and safe browser read/writes (`storage.js`).
   - Unified configurations (`ecoConstants.js`).
