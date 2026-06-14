// Gemini AI Carbon Coach Service

const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Generate a conversational coaching response using Gemini API
 * Fallback to a rule-based encouraging response if API key is missing or calls fail.
 * 
 * @param {Object} profileData - Calculated carbon profile breakdown and inputs
 * @param {Array} recommendations - List of active recommendations
 * @param {string} userQuestion - Question asked by the user
 * @returns {Promise<string>} Response from the AI Carbon Coach
 */
async function generateCoachResponse(profileData = {}, recommendations = [], userQuestion = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  const categories = profileData.categories || {};
  const total = profileData.total || 0;
  const benchmark = profileData.benchmark || 650;

  // Format the context description for the AI Coach
  const profileContext = `
User Carbon Profile Breakdown (Monthly emissions):
- Commute & Travel: ${categories.commute || 0} kg CO2e
- Diet & Food: ${categories.diet || 0} kg CO2e
- Home Energy: ${categories.homeEnergy || 0} kg CO2e
- Shopping: ${categories.shopping || 0} kg CO2e
- Waste & Recycling: ${categories.waste || 0} kg CO2e
- Total Footprint: ${total} kg CO2e (Target Benchmark: ${benchmark} kg CO2e)

Active Action Plan Recommendations:
${recommendations.map((rec, i) => `${i + 1}. ${rec.title} (Savings: ${rec.estimatedSavings} kg/mo, Reason: ${rec.reason})`).join('\n')}
`;

  const systemInstructions = `
You are the "AI Carbon Coach" for Verdant Pulse, a calming, premium, encouraging behavior-change platform. 
Your goal is to help users understand their emissions, offer friendly practical advice, and answer questions.
Keep your tone positive, encouraging, and practical. NEVER use guilt-heavy or alarmist language.
Keep your response concise (under 200 words), well-structured, and directly address the user's query using their actual carbon profile.
Use bullet points for readability when listing actions.
`;

  // If the API Key is missing, trigger the fallback immediately
  if (!apiKey) {
    return generateFallbackResponse(categories, total, userQuestion);
  }

  try {
    const prompt = `
Context:
${profileContext}

Instructions:
${systemInstructions}

User Question: "${userQuestion}"

Coach Response:
`;

    // Perform native fetch request to Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Gemini API request failed:', response.status, errorData);
      return generateFallbackResponse(categories, total, userQuestion);
    }

    const resJson = await response.json();
    const reply = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!reply) {
      return generateFallbackResponse(categories, total, userQuestion);
    }

    return reply.trim();
  } catch (err) {
    console.error('Gemini Service Error, using fallback:', err);
    return generateFallbackResponse(categories, total, userQuestion);
  }
}

/**
 * Intelligent, rule-based fallback response engine
 */
function generateFallbackResponse(categories, total, question) {
  const qLower = question.toLowerCase();
  
  // Identify highest emission category
  const sorted = Object.entries(categories || {})
    .sort((a, b) => b[1] - a[1]);
  const highestCategory = sorted.length > 0 ? sorted[0][0] : 'energy';

  // Base welcoming lines
  let greeting = "Hello there! I'm your AI Carbon Coach. (Note: Running in offline mode). ";
  
  // Answer routing based on keywords
  if (qLower.includes('commute') || qLower.includes('travel') || qLower.includes('car') || qLower.includes('bus') || qLower.includes('transit')) {
    return greeting + `Based on your profile, travel represents a notable part of your emissions. I highly recommend shifting short trips (under 3km) to walking or biking. For longer trips, carpooling or taking public transit even twice a week makes an incredible impact! Let's take it one step at a time.`;
  }
  
  if (qLower.includes('diet') || qLower.includes('food') || qLower.includes('meat') || qLower.includes('vegan') || qLower.includes('vegetarian')) {
    return greeting + `For food emissions, the single most powerful action is introducing a 'Meatless Monday' or eating fully plant-based meals a couple of times a week. Beef and lamb have high production footprints, so swap them for poultry, fish, or high-protein legumes where possible!`;
  }

  if (qLower.includes('energy') || qLower.includes('electricity') || qLower.includes('light') || qLower.includes('heat') || qLower.includes('power')) {
    return greeting + `To trim your home energy footprint, try switching to LED light bulbs and shutting off idle devices at night. Setting your thermostat just 1-2°C lower in winter or higher in summer can save around 10% on your utility bills and significantly lower grid emissions!`;
  }

  if (qLower.includes('shop') || qLower.includes('waste') || qLower.includes('buy') || qLower.includes('recycle') || qLower.includes('compost')) {
    return greeting + `For shopping and waste, try shopping second-hand or repairing items instead of replacing them. Composting your organic kitchen scraps is also highly effective, as it prevents waste from creating harmful methane in landfills.`;
  }

  // General fallback answer based on highest category
  if (highestCategory === 'commute') {
    return greeting + `I notice travel is your largest emission source (${categories.commute} kg CO2e). Focus on choosing transit, active travel, or carpooling for your most frequent commutes. Every kilometer you swap saves a substantial amount of carbon!`;
  }
  if (highestCategory === 'diet') {
    return greeting + `Your food choices make up a significant portion of your footprint (${categories.diet} kg CO2e). Adding more grains, vegetables, and plant-based proteins to your routine is a healthy, calming, and high-impact way to lower your impact.`;
  }
  if (highestCategory === 'homeEnergy') {
    return greeting + `Your home energy use is your highest emission category (${categories.homeEnergy} kg CO2e). Simple changes like LED lights, draft seals, and smart power management will make a major difference over time.`;
  }
  
  return greeting + `Your current total footprint is ${total} kg CO2e per month. Let's focus on the customized action plan on your dashboard. Completing even one simple action this week will start your journey toward balance!`;
}

module.exports = {
  generateCoachResponse,
  generateFallbackResponse
};
