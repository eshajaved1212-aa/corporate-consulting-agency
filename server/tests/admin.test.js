const request = require('supertest');
const app = require('../app');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const ServiceInquiry = require('../models/ServiceInquiry');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('./helpers/mongoHelper');

beforeAll(connectTestDB, 30000);
afterAll(disconnectTestDB, 10000);

const authHeader = { Authorization: 'Bearer test-admin-token-123' };

describe('Admin Routes (authenticated)', () => {
  beforeEach(async () => {
    await Contact.create({ name: 'Test', email: 't@t.com', message: 'Msg' });
    await Newsletter.create({ email: 'sub@test.com', isActive: true });
    await ServiceInquiry.create({
      serviceId: 's1',
      serviceTitle: 'Strategy',
      name: 'John',
      email: 'j@j.com',
      message: 'Inquiry',
    });
  });

  afterEach(clearTestDB);

  describe('GET /api/admin/summary', () => {
    it('should return summary counts', async () => {
      const res = await request(app)
        .get('/api/admin/summary')
        .set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('contacts', 1);
      expect(res.body.data).toHaveProperty('activeSubscribers', 1);
      expect(res.body.data).toHaveProperty('serviceInquiries', 1);
    });
  });

  describe('GET /api/admin/contacts', () => {
    it('should return contacts with pagination', async () => {
      const res = await request(app)
        .get('/api/admin/contacts')
        .set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body).toHaveProperty('total', 1);
    });
  });

  describe('GET /api/admin/newsletter', () => {
    it('should return subscribers', async () => {
      const res = await request(app)
        .get('/api/admin/newsletter')
        .set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/admin/inquiries', () => {
    it('should return service inquiries', async () => {
      const res = await request(app)
        .get('/api/admin/inquiries')
        .set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('PATCH /api/admin/inquiries/:id', () => {
    it('should update inquiry status', async () => {
      const inquiry = await ServiceInquiry.findOne();
      const res = await request(app)
        .patch(`/api/admin/inquiries/${inquiry._id}`)
        .set(authHeader)
        .send({ status: 'in-review' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('in-review');
    });
  });

  describe('DELETE /api/admin/contacts/:id', () => {
    it('should delete a contact', async () => {
      const contact = await Contact.findOne();
      const res = await request(app)
        .delete(`/api/admin/contacts/${contact._id}`)
        .set(authHeader);
      expect(res.status).toBe(200);
      const count = await Contact.countDocuments();
      expect(count).toBe(0);
    });
  });
});

describe('Admin Routes (unauthenticated)', () => {
  afterEach(clearTestDB);

  it('should return 401 for summary without token', async () => {
    const res = await request(app).get('/api/admin/summary');
    expect(res.status).toBe(401);
  });

  it('should return 401 for contacts without token', async () => {
    const res = await request(app).get('/api/admin/contacts');
    expect(res.status).toBe(401);
  });

  it('should return 401 with wrong token', async () => {
    const res = await request(app)
      .get('/api/admin/summary')
      .set({ Authorization: 'Bearer wrong-token' });
    expect(res.status).toBe(401);
  });
});

