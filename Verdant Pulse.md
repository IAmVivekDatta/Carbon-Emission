Verdant Pulse

One-line pitch

A smart carbon awareness assistant that helps users understand their footprint, track daily habits, and reduce emissions through personalized nudges and simple action plans.

Product goal

Turn invisible carbon data into clear, motivating, and actionable guidance.

Core user problem

Most people do not know which daily choices create the biggest emissions, and raw numbers alone do not change behavior. The app must make carbon impact feel personal, understandable, and actionable.

Target user

Students, professionals, and everyday users who want a simple, visual, low-friction way to reduce their footprint.

Key experience pillars
Understand
Show where emissions come from in plain language.
Track
Let users log daily habits and see trends over time.
Reduce
Recommend realistic, personalized actions with estimated savings.
Main features
Carbon profile onboarding
Daily activity tracker
Emissions breakdown by category
Personalized insights engine
Action planner with simple tasks
Progress dashboard and streaks
Friendly nudges at decision points
Exportable summary for sharing or review
Core user flow
User opens the app.
User answers a short onboarding quiz about commute, diet, home energy, and shopping.
App creates a baseline carbon profile.
User sees a dashboard with top emission sources.
App suggests 3 to 5 simple actions with estimated savings.
User logs habits and tracks progress over time.
App updates insights and nudges based on behavior.
Smart logic rules
If commute emissions are high, prioritize travel alternatives.
If diet emissions are high, suggest lower-carbon meal swaps.
If home energy is high, suggest AC, lighting, and usage changes.
If shopping waste is high, suggest repair, reuse, and buy-less habits.
Always show the top 3 biggest opportunities first.
Data to collect
Commute type and frequency
Diet pattern
Home energy habits
Shopping frequency
Weekly activity log
Streaks and completed actions
Output of the app
Estimated monthly footprint
Category-wise breakdown
Personalized recommendations
Action savings estimates
Trend chart and progress summary
Design direction
Background: cream
Primary accent: gold
Secondary accent: deep green
Visual style: calm, premium, clean, nature-inspired
Use subtle green traces, leaf-like curves, and soft glass panels
Avoid loud neon “eco app” vibes
Accessibility requirements
Strong contrast ratios
Keyboard navigable interface
Semantic headings and landmarks
Clear focus states
ARIA labels for interactive controls
Mobile responsive layout
Security requirements
No secrets in frontend code
Environment variables for backend config
Input validation on every user input
Helmet, CORS, and basic rate limiting on the Express API
No unsafe eval or direct HTML injection
Sanitize all text inputs
Performance requirements
Fast initial load
Lazy-load noncritical views
Memoize emissions calculations
Keep bundle small
Use simple local state and lightweight libraries
Testing requirements
Unit tests for emission calculation logic
API tests for recommendation endpoints
Basic UI smoke tests
Accessibility checks on key screens
Edge cases for empty input, invalid values, and extreme values
Suggested architecture

Single deployable app

React frontend
Express backend
Express serves the React build
One Cloud Run service for the whole app

This is a strong choice because it keeps deployment simple, reduces moving parts, and gives you one stable URL for submission.

Suggested folder structure
verdant-pulse/
  client/
    src/
      components/
      pages/
      hooks/
      utils/
      styles/
  server/
    src/
      routes/
      controllers/
      services/
      middleware/
      data/
  tests/
  public/
  Dockerfile
  package.json
  README.md
2) Master prompt for Gemini in Antigravity

Copy this exactly and paste it into Gemini/Antigravity:

You are a senior product engineer, UI designer, and code reviewer.

Build a complete, production-ready full-stack web application named “Verdant Pulse” for a carbon footprint awareness challenge.

Goal:
Create a web app that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

Tech stack:
- Frontend: React
- Backend: Node.js + Express
- Styling: plain CSS or CSS modules preferred for light repo size
- Deployment target: Google Cloud Run
- Keep the repo lean, public-repo friendly, and under 10 MB excluding node_modules
- Use a single branch
- Do not include secrets in code
- Use environment variables for configuration

Important product requirements:
1. The app must feel premium and calming.
2. Use a cream, gold, and deep green color palette.
3. Add subtle green traces, leaf-inspired accents, and polished glass-like cards.
4. The app should not look like a generic dashboard.
5. It should feel like a smart assistant that helps users make better choices.
6. The product must focus on awareness, tracking, and simple action-based reduction.
7. The app should generate personalized insights based on the user’s inputs.
8. The app should feel useful for students, professionals, and everyday users.

Core features to implement:
- Landing page with clear value proposition
- Onboarding quiz to collect user profile data
- Carbon footprint dashboard
- Category breakdown for commute, diet, home energy, shopping, and waste
- Personalized insight engine
- Action plan with 3 to 5 recommended actions
- Progress tracking with streaks or completion status
- Trend visualization
- Accessible UI with keyboard support and proper semantic structure
- Mobile responsive layout

Logic requirements:
- If commute emissions are high, prioritize travel-related recommendations.
- If diet emissions are high, prioritize food-related recommendations.
- If home energy emissions are high, prioritize energy-saving recommendations.
- If shopping or waste emissions are high, prioritize repair, reuse, and mindful buying recommendations.
- Show the top 3 highest-impact suggestions first.
- Every recommendation should include a short reason and an estimated impact.
- Do not make the app guilt-heavy. Keep the tone encouraging and practical.

Backend requirements:
- Create an Express API
- Include validation and error handling
- Add Helmet, CORS, and rate limiting
- Add a health endpoint
- Add endpoints for profile input, footprint calculation, insights, and actions
- Keep the API stateless if possible
- If persistence is needed, use a lightweight safe approach
- Make the app work reliably on Cloud Run

Frontend requirements:
- Build a polished React UI
- Use reusable components
- Use clean state management
- Avoid unnecessary rerenders
- Keep the interface intuitive and fast
- Use accessible forms, labels, focus states, and buttons

Testing requirements:
- Add unit tests for footprint calculations and recommendation logic
- Add backend tests for API routes
- Add at least one smoke test or critical-path test
- Ensure edge cases are handled
- Include test instructions in the README

Documentation requirements:
- Write a clear README
- Include the problem statement
- Explain the solution approach
- Explain the logic and assumptions
- Explain the tech stack
- Explain how to run locally
- Explain how to deploy to Cloud Run
- Explain what each major folder does

Output requirements:
1. First, give me the architecture overview and file structure.
2. Then generate the code in complete files, not fragments.
3. If the full app is too large for one response, split it into logical phases:
   Phase 1: project scaffolding and backend
   Phase 2: frontend UI
   Phase 3: tests, polish, README, and deployment files
4. Make sure every file is complete and runnable.
5. Make sure the final solution is coherent, not a pile of disconnected snippets.

Design system:
- Background: cream
- Primary accent: gold
- Secondary accent: deep green
- Cards: soft shadows, rounded corners, clean spacing
- Typography: modern and readable
- Visual theme: premium eco, not cartoonish
- Add subtle leaf-like linework or traces as decorative elements

Acceptance criteria:
- The app works end to end
- The UI is attractive and accessible
- The recommendation engine is personalized
- The code is clean and modular
- The app can be deployed to Google Cloud Run
- The project is suitable for a challenge submission with strong code quality, security, efficiency, testing, accessibility, and problem statement alignment

Now generate the complete project.
3) High-ranking build strategy
What to optimize for each scoring area

Code Quality

Use feature-based folders, not giant files.
Put emissions math in utils or services, not inside components.
Keep one source of truth for constants like emission factors.
Use consistent naming and small reusable components.
Add a clean README and remove dead code before final submission.

Security

Validate all incoming payloads.
Keep API keys in .env.
Add Helmet, CORS allowlist, and rate limiting.
Never ship secrets to GitHub.
Add simple sanitization for text fields.
Do not use unsafe browser HTML injection.

Efficiency

Calculate footprint with a single pass over inputs.
Memoize expensive derived values in React.
Keep libraries minimal.
Avoid heavy charts if a lightweight one does the job.
Use a single deployable service to reduce runtime friction.

Testing

Test the calculator logic first.
Test recommendation ranking.
Test API success and failure cases.
Cover empty inputs, invalid inputs, and extreme values.
Add at least one smoke test for the main user flow.

Accessibility

Use semantic HTML.
Add labels to every input.
Ensure visible focus states.
Keep contrast strong on cream background.
Use ARIA only where needed.
Make sure the app works on keyboard alone.

Problem Statement Alignment

The app must do more than track numbers.
It must turn data into awareness and behavior change.
Every insight should lead to a simple action.
Make the recommendations feel personal and actionable.
4) Cloud Run deployment approach

Use one container for the whole app.

Recommended flow:

Build React frontend.
Express serves the React build.
Add a Dockerfile.
Deploy one service to Cloud Run.
Use one public URL in the submission.

This keeps the submission simple, stable, and evaluator-friendly.

5) Submission strategy for the 3 attempts

Because only the latest submission counts, do not treat attempt 1 like a disposable draft. Build each version like it might be judged.

Attempt 1

Full working app
Core tracking and insights
Basic styling
Clean deployment

Attempt 2

Improve recommendations
Add tests
Tighten accessibility
Fix bugs and rough edges

Attempt 3

Final polish only
Improve visual consistency
Verify deployed link
Recheck README and repo cleanliness
Make sure this is the strongest version, because this is the one that counts
6) Final checklist before submission
Public GitHub repo
Single branch only
No node_modules in repo
Repo under size limit
Deployed link works
README is complete
GitHub repo and deployment are linked in the submission
App opens cleanly on mobile and desktop
Key flows work without errors