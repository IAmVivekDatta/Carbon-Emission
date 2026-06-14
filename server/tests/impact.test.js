const { translateImpact } = require('../src/services/impact');

describe('Impact Translation Engine', () => {
  test('should return correct equivalents for zero savings', () => {
    const result = translateImpact(0);
    expect(result.rawKg).toBe(0);
    expect(result.equivalents.carKms).toBe(0);
    expect(result.equivalents.treeDays).toBe(0);
    expect(result.equivalents.phoneCharges).toBe(0);
  });

  test('should calculate valid equivalents for a standard saving', () => {
    const result = translateImpact(10); // 10 kg CO2 saved
    expect(result.rawKg).toBe(10);
    
    // Car mileage: 10 * 5.88 = 58.8 km
    expect(result.equivalents.carKms).toBe(58.8);
    // Tree days: 10 * 16.5 = 165 days
    expect(result.equivalents.treeDays).toBe(165);
    // Phone charges: 10 * 120.5 = 1205
    expect(result.equivalents.phoneCharges).toBe(1205);
  });

  test('should formulate illustrative story descriptions', () => {
    const result = translateImpact(50);
    expect(result.stories.car).toContain('Avoiding a 294 km drive');
    expect(result.stories.tree).toContain('825 days');
    expect(result.stories.phone).toContain('6,025 times');
  });

  test('should fallback gracefully on empty/undefined savings', () => {
    const result = translateImpact(undefined);
    expect(result.rawKg).toBe(0);
  });
});
