const request = require('supertest');
const app = require('../app');
const Newsletter = require('../models/Newsletter');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('./helpers/mongoHelper');

beforeAll(connectTestDB, 30000);
afterAll(disconnectTestDB, 10000);

describe('POST /api/newsletter', () => {
  afterEach(clearTestDB);

  it('should subscribe a new email', async () => {
    const res = await request(app)
      .post('/api/newsletter')
      .send({ email: 'test@example.com' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Successfully subscribed!');
  });

  it('should return 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/newsletter')
      .send({ email: 'invalid' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should re-activate existing unsubscribed email', async () => {
    await Newsletter.create({ email: 'existing@example.com', isActive: false });
    const res = await request(app)
      .post('/api/newsletter')
      .send({ email: 'existing@example.com' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Welcome back! You are re-subscribed.');
  });

  it('should return already subscribed message', async () => {
    await Newsletter.create({ email: 'active@example.com', isActive: true });
    const res = await request(app)
      .post('/api/newsletter')
      .send({ email: 'active@example.com' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'You are already subscribed!');
  });
});

describe('DELETE /api/newsletter/unsubscribe', () => {
  afterEach(clearTestDB);

  it('should unsubscribe an active email', async () => {
    await Newsletter.create({ email: 'sub@example.com', isActive: true });
    const res = await request(app)
      .delete('/api/newsletter/unsubscribe')
      .send({ email: 'sub@example.com' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    const doc = await Newsletter.findOne({ email: 'sub@example.com' });
    expect(doc.isActive).toBe(false);
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .delete('/api/newsletter/unsubscribe')
      .send({});
    expect(res.status).toBe(400);
  });

  it('should return 404 if email not found', async () => {
    const res = await request(app)
      .delete('/api/newsletter/unsubscribe')
      .send({ email: 'nonexistent@example.com' });
    expect(res.status).toBe(404);
  });
});

