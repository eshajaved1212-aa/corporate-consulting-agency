const request = require('supertest');
const app = require('../app');

describe('GET /api/team', () => {
  it('should return all team members', async () => {
    const res = await request(app).get('/api/team');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('GET /api/team/:id', () => {
  it('should return a specific team member', async () => {
    const res = await request(app).get('/api/team/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('name', 'Sarah Johnson');
  });

  it('should return 404 for unknown member', async () => {
    const res = await request(app).get('/api/team/999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

