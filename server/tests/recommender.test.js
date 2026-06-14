const { getRecommendations } = require('../src/services/recommender');

describe('Recommendation Engine Logic', () => {
  test('should prioritize travel actions when commute emissions are highest', () => {
    const categories = {
      commute: 500, // Highest
      diet: 100,
      homeEnergy: 150,
      shopping: 50,
      waste: 20
    };

    const inputs = {
      commute: { distance: 120, type: 'petrol' },
      diet: { type: 'vegetarian' },
      homeEnergy: { electricityBill: 'medium', heatingSource: 'electricity' },
      shopping: { frequency: 'moderate' },
      waste: { recycling: 'partial' }
    };

    const recommendations = getRecommendations(categories, inputs);

    // Verify recommendations exists and is within standard boundaries
    expect(recommendations.length).toBeGreaterThanOrEqual(3);
    expect(recommendations.length).toBeLessThanOrEqual(5);

    // Travel action (EV upgrade or carpool) should be included and ranked by high impact
    const travelRecs = recommendations.filter(r => r.category === 'commute');
    expect(travelRecs.length).toBeGreaterThanOrEqual(1);
    
    // The top recommendation should be the one with the highest estimatedSavings (which will be EV upgrade or carpooling)
    expect(recommendations[0].estimatedSavings).toBeGreaterThanOrEqual(recommendations[1].estimatedSavings);
  });

  test('should prioritize food actions when diet emissions are highest', () => {
    const categories = {
      commute: 10,
      diet: 240, // Highest
      homeEnergy: 80,
      shopping: 40,
      waste: 10
    };

    const inputs = {
      commute: { distance: 5, type: 'active' },
      diet: { type: 'heavy-meat' },
      homeEnergy: { electricityBill: 'low', heatingSource: 'solar' },
      shopping: { frequency: 'moderate' },
      waste: { recycling: 'partial' }
    };

    const recommendations = getRecommendations(categories, inputs);

    // Verify that food/diet actions are prioritized
    const dietRecs = recommendations.filter(r => r.category === 'diet');
    expect(dietRecs.length).toBeGreaterThanOrEqual(1);

    // Check that top-saving recommendations are ordered first
    expect(recommendations[0].estimatedSavings).toBeGreaterThanOrEqual(recommendations[recommendations.length - 1].estimatedSavings);
  });
});
