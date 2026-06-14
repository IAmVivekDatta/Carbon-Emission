const request = require('supertest');
const app = require('../src/index');

describe('Express API Endpoints & Security Integration Tests', () => {
  
  test('GET /health - should return 200 and health indicators', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('POST /api/calculate - should compute and return footprint', async () => {
    const payload = {
      commute: { distance: 100, type: 'petrol' },
      diet: { type: 'low-meat' },
      homeEnergy: { electricityBill: 'medium', heatingSource: 'electricity' },
      shopping: { frequency: 'moderate' },
      waste: { recycling: 'partial' }
    };

    const response = await request(app)
      .post('/api/calculate')
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('categories');
    expect(response.body.categories).toHaveProperty('commute', 73.6);
  });

  test('POST /api/calculate - should return 400 validation error on invalid commute type', async () => {
    const payload = {
      commute: { distance: 100, type: 'rocket-ship' } // Invalid
    };

    const response = await request(app)
      .post('/api/calculate')
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Invalid commute type');
  });

  test('POST /api/calculate - should return 400 validation error on negative distance', async () => {
    const payload = {
      commute: { distance: -50, type: 'petrol' } // Negative distance
    };

    const response = await request(app)
      .post('/api/calculate')
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Commute distance must be a non-negative number');
  });

  test('POST /api/recommendations - should fail if input parameters are missing', async () => {
    const response = await request(app)
      .post('/api/recommendations')
      .send({}); // Missing categories/inputs

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('Security headers should be present (Helmet)', async () => {
    const response = await request(app).get('/health');
    expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
    expect(response.headers).toHaveProperty('x-frame-options', 'SAMEORIGIN');
  });

  /* NEW EXTENDED API TESTS FOR COMPETITION SUBMISSION */

  test('GET /api/challenges - should return list of eco challenges', async () => {
    const response = await request(app).get('/api/challenges');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('challenges');
    expect(Array.isArray(response.body.challenges)).toBe(true);
    expect(response.body.challenges.length).toBeGreaterThan(0);
  });

  test('POST /api/impact - should translate carbon saved to equivalents', async () => {
    const response = await request(app)
      .post('/api/impact')
      .send({ kgSaved: 45 });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('equivalents');
    expect(response.body.equivalents).toHaveProperty('treeDays', 743); // 45 * 16.5 = 742.5 -> 743
  });

  test('POST /api/impact - should fail for negative kgSaved values', async () => {
    const response = await request(app)
      .post('/api/impact')
      .send({ kgSaved: -10 });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('non-negative number');
  });

  test('POST /api/chat - should process queries and respond via Coach', async () => {
    const payload = {
      userQuestion: 'How can I save CO2 in my diet?',
      profileData: {
        categories: { commute: 10, diet: 240, homeEnergy: 80, shopping: 40, waste: 10 },
        total: 380,
        benchmark: 650
      },
      recommendations: []
    };

    const response = await request(app)
      .post('/api/chat')
      .send(payload);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('reply');
    expect(response.body.reply.toLowerCase()).toContain('food');
  });

  test('POST /api/chat - should fail validation for queries exceeding size limit', async () => {
    const payload = {
      userQuestion: 'a'.repeat(600), // Exceeds 500 characters
      profileData: { categories: {}, total: 0 },
      recommendations: []
    };

    const response = await request(app)
      .post('/api/chat')
      .send(payload);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('prevent API abuse');
  });

  test('Malformed JSON parsing error should be caught by custom middleware', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .set('Content-Type', 'application/json')
      .send('{"invalid json: state}'); // Invalid JSON string
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Malformed JSON payload');
  });
});
