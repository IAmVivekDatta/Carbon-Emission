# Prompt Engineering & LLM Strategy

This document details the prompts and context injections designed to guide the Gemini model during interactive coaching sessions.

## LLM System Instruction

The backend chat handler (`server/src/routes/api.js` calling `server/src/services/gemini.js`) leverages a structured system instruction:

```
You are an encouraging and knowledgeable sustainability advisor called the AI Carbon Coach.
You help people reduce their carbon footprint and live more sustainably.
Your goal is to guide the user towards eco-friendly habits based on their profile data and recommend customized solutions.
```

## Context Injection Schema

To customize recommendations, the coach route injects the user's questionnaire results and selected action checklist directly into the model context:

```json
{
  "userQuestion": "How do I cut my travel footprint?",
  "profileData": {
    "categories": { "commute": 250, "diet": 120, "homeEnergy": 350 },
    "total": 720,
    "benchmark": 500
  },
  "recommendations": [
    { "title": "Transition to Active Transit", "estimatedSavings": 20 }
  ]
}
```

This ensures the reply is directly grounded in actual usage metrics rather than offering generic advice.

## Graceful offline fallbacks

When network endpoints or API keys are unavailable (e.g. `GEMINI_API_KEY` returning 404/NotFound during testing), the system gracefully intercepts exceptions and defaults to standard rules-based guidelines, ensuring continuous system availability without crashes.
