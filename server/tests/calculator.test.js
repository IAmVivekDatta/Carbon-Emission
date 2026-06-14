const { calculateFootprint } = require('../src/services/calculator');

describe('Carbon footprint Calculator Logic', () => {
  test('should compute emissions correctly for a standard average user', () => {
    const inputs = {
      commute: { distance: 100, type: 'petrol' },
      diet: { type: 'low-meat' },
      homeEnergy: { electricityBill: 'medium', heatingSource: 'electricity' },
      shopping: { frequency: 'moderate' },
      waste: { recycling: 'partial' }
    };

    const result = calculateFootprint(inputs);

    // Commute: 100 * 4.33 * 0.170 = 73.61 -> ~73.6
    // Diet: 4.5 * 30 = 135
    // Home Energy: medium bill (140) + electric heating (40) = 180
    // Shopping: moderate = 60
    // Waste: partial = 25
    // Total: 73.6 + 135 + 180 + 60 + 25 = 473.6
    expect(result.categories.commute).toBe(73.6);
    expect(result.categories.diet).toBe(135);
    expect(result.categories.homeEnergy).toBe(180);
    expect(result.categories.shopping).toBe(60);
    expect(result.categories.waste).toBe(25);
    expect(result.total).toBe(473.6);
  });

  test('should handle empty inputs gracefully with fallback defaults', () => {
    const result = calculateFootprint({});
    
    // Fallbacks:
    // Commute: distance 0 -> 0
    // Diet: low-meat -> 135
    // Home Energy: medium (140) + electric heating (40) = 180
    // Shopping: moderate -> 60
    // Waste: partial -> 25
    // Total: 0 + 135 + 180 + 60 + 25 = 400
    expect(result.total).toBe(400);
    expect(result.categories.commute).toBe(0);
  });

  test('should handle edge case: zero values and alternative modes', () => {
    const inputs = {
      commute: { distance: 0, type: 'active' },
      diet: { type: 'vegan' },
      homeEnergy: { electricityBill: 'low', heatingSource: 'solar' },
      shopping: { frequency: 'minimalist' },
      waste: { recycling: 'full' }
    };

    const result = calculateFootprint(inputs);

    // Commute: 0
    // Diet: vegan = 2.5 * 30 = 75
    // Home Energy: low (60) + solar (0) = 60
    // Shopping: minimalist = 15
    // Waste: full = 8
    // Total: 0 + 75 + 60 + 15 + 8 = 158
    expect(result.total).toBe(158);
    expect(result.categories.commute).toBe(0);
    expect(result.categories.diet).toBe(75);
    expect(result.categories.homeEnergy).toBe(60);
    expect(result.categories.shopping).toBe(15);
    expect(result.categories.waste).toBe(8);
  });

  test('should handle extreme values correctly', () => {
    const inputs = {
      commute: { distance: 1000, type: 'diesel' },
      diet: { type: 'heavy-meat' },
      homeEnergy: { electricityBill: 'high', heatingSource: 'gas' },
      shopping: { frequency: 'frequent' },
      waste: { recycling: 'none' }
    };

    const result = calculateFootprint(inputs);

    // Commute: 1000 * 4.33 * 0.171 = 740.43 -> ~740.4
    // Diet: heavy-meat = 8.0 * 30 = 240
    // Home Energy: high (280) + gas (80) = 360
    // Shopping: frequent = 150
    // Waste: none = 50
    // Total: 740.4 + 240 + 360 + 150 + 50 = 1540.4
    expect(result.total).toBe(1540.4);
  });
});
