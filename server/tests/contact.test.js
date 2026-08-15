const request = require('supertest');
const app = require('../app');
const Contact = require('../models/Contact');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('./helpers/mongoHelper');

beforeAll(connectTestDB, 30000);
afterAll(disconnectTestDB, 10000);

describe('POST /api/contact', () => {
  afterEach(clearTestDB);

  it('should create a contact submission', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'John Doe', email: 'john@example.com', message: 'Hello' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('id');
  });

  it('should return 400 if name is missing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ email: 'john@example.com', message: 'Hello' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'John', message: 'Hello' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if message is missing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'John', email: 'john@example.com' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should persist contact in database', async () => {
    await request(app)
      .post('/api/contact')
      .send({ name: 'Jane', email: 'jane@example.com', company: 'Acme', service: 'Consulting', message: 'Hi' });
    const count = await Contact.countDocuments();
    expect(count).toBe(1);
  });
});

describe('GET /api/contacts/all', () => {
  afterEach(clearTestDB);

  it('should return all contacts', async () => {
    await Contact.create({ name: 'A', email: 'a@a.com', message: 'M1' });
    await Contact.create({ name: 'B', email: 'b@b.com', message: 'M2' });
    const res = await request(app).get('/api/contacts/all');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveLength(2);
  });
});

