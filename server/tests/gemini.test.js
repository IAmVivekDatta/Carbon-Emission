const { generateCoachResponse, generateFallbackResponse } = require('../src/services/gemini');

describe('AI Carbon Coach Gemini Service & Fallbacks', () => {
  const mockCategories = {
    commute: 200,
    diet: 100,
    homeEnergy: 150,
    shopping: 50,
    waste: 20
  };
  const mockTotal = 520;
  
  test('should generate travel-specific fallback response on travel queries', () => {
    const response = generateFallbackResponse(mockCategories, mockTotal, 'How can I reduce my commute footprint?');
    expect(response).toContain('AI Carbon Coach');
    expect(response).toContain('travel represents a notable part');
    expect(response).toContain('public transit');
  });

  test('should generate food-specific fallback response on diet queries', () => {
    const response = generateFallbackResponse(mockCategories, mockTotal, 'What changes can I make to my food choices?');
    expect(response).toContain('AI Carbon Coach');
    expect(response).toContain('food emissions');
    expect(response).toContain('Meatless Monday');
  });

  test('should generate energy-specific fallback response on electricity queries', () => {
    const response = generateFallbackResponse(mockCategories, mockTotal, 'Tips to save on home heating and electricity?');
    expect(response).toContain('AI Carbon Coach');
    expect(response).toContain('home energy footprint');
    expect(response).toContain('thermostat');
  });

  test('should fallback to general response if no keywords match and no dominant categories exist', () => {
    const response = generateFallbackResponse({}, mockTotal, 'Hello, can you help me?');
    expect(response).toContain('AI Carbon Coach');
    expect(response).toContain('current total footprint is 520 kg CO2e');
  });

  test('should call native generateCoachResponse and trigger fallback when key is missing', async () => {
    // Temporarily clear API Key if present
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const profileData = { categories: mockCategories, total: mockTotal };
    const recommendations = [{ id: '1', title: 'Action 1', estimatedSavings: 10, reason: 'Reason 1' }];

    const reply = await generateCoachResponse(profileData, recommendations, 'Explain my energy footprint');
    expect(reply).toContain('offline mode');
    expect(reply).toContain('energy footprint');

    // Restore key
    if (originalKey) {
      process.env.GEMINI_API_KEY = originalKey;
    }
  });
});
