const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../app');
const User = require('../models/User');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('./helpers/mongoHelper');

beforeAll(connectTestDB, 30000);
afterAll(disconnectTestDB, 10000);

describe('Auth Routes (JWT + bcrypt)', () => {
  beforeEach(async () => {
    // Create a test admin user with a known password
    const hash = await bcrypt.hash('secret123', 10);
    await User.create({ username: 'admin', passwordHash: hash, name: 'Admin', role: 'admin' });
  });

  afterEach(clearTestDB);

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials and return a JWT', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'secret123' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toHaveProperty('username', 'admin');
      expect(res.body.user).toHaveProperty('role', 'admin');
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrongpass' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject unknown username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nobody', password: 'secret123' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid JWT', async () => {
      // Obtain a valid token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'secret123' });
      const token = loginRes.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set({ Authorization: `Bearer ${token}` });
      expect(res.status).toBe(200);
      expect(res.body.user.username).toBe('admin');
      expect(res.body.user.role).toBe('admin');
    });

    it('should reject missing token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set({ Authorization: 'Bearer not-a-real-token' });
      expect(res.status).toBe(401);
    });
  });
});

