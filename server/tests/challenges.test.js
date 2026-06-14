const { getWeeklyChallenges, WEEKLY_CHALLENGES } = require('../src/services/challenges');

describe('Weekly Challenges Service', () => {
  test('should return a list of challenges containing all elements', () => {
    const list = getWeeklyChallenges();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(5);
  });

  test('should verify each challenge has the required properties', () => {
    const list = getWeeklyChallenges();
    list.forEach(challenge => {
      expect(challenge).toHaveProperty('id');
      expect(challenge).toHaveProperty('title');
      expect(challenge).toHaveProperty('description');
      expect(challenge).toHaveProperty('co2Savings');
      expect(challenge).toHaveProperty('difficulty');
      expect(challenge).toHaveProperty('badge');
      
      expect(typeof challenge.id).toBe('string');
      expect(typeof challenge.title).toBe('string');
      expect(typeof challenge.co2Savings).toBe('number');
      expect(challenge.co2Savings).toBeGreaterThan(0);
    });
  });

  test('should contain specific predefined challenge ids', () => {
    const ids = WEEKLY_CHALLENGES.map(c => c.id);
    expect(ids).toContain('challenge_meat_free_friday');
    expect(ids).toContain('challenge_no_cab_week');
    expect(ids).toContain('challenge_idle_devices');
  });
});
