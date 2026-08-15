const request = require('supertest');
const app = require('../app');
const ServiceInquiry = require('../models/ServiceInquiry');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('./helpers/mongoHelper');

beforeAll(connectTestDB, 30000);
afterAll(disconnectTestDB, 10000);

describe('GET /api/services', () => {
  it('should return all services', async () => {
    const res = await request(app).get('/api/services');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('GET /api/services/:id', () => {
  it('should return a specific service', async () => {
    const res = await request(app).get('/api/services/strategy-consulting');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('title', 'Strategy Consulting');
    expect(res.body.data).toHaveProperty('id', 'strategy-consulting');
  });

  it('should return 404 for unknown service', async () => {
    const res = await request(app).get('/api/services/invalid-service');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/services/:id/inquire', () => {
  afterEach(clearTestDB);

  it('should create a service inquiry', async () => {
    const res = await request(app)
      .post('/api/services/strategy-consulting/inquire')
      .send({ name: 'John', email: 'john@test.com', message: 'I need help' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
  });

  it('should return 400 with missing fields', async () => {
    const res = await request(app)
      .post('/api/services/strategy-consulting/inquire')
      .send({ name: 'John' });
    expect(res.status).toBe(400);
  });

  it('should return 404 for invalid service', async () => {
    const res = await request(app)
      .post('/api/services/nonexistent/inquire')
      .send({ name: 'John', email: 'j@t.com', message: 'Test' });
    expect(res.status).toBe(404);
  });

  it('should save inquiry to database', async () => {
    await request(app)
      .post('/api/services/strategy-consulting/inquire')
      .send({ name: 'Test', email: 'test@test.com', message: 'Hello' });
    const count = await ServiceInquiry.countDocuments();
    expect(count).toBe(1);
  });
});

