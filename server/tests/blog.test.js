const request = require('supertest');
const app = require('../app');
const Blog = require('../models/Blog');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('./helpers/mongoHelper');

beforeAll(connectTestDB, 30000);
afterAll(disconnectTestDB, 10000);

describe('Blog Public Routes', () => {
  beforeEach(async () => {
    await Blog.create([
      {
        title: 'Test Post 1',
        slug: 'test-post-1',
        excerpt: 'Excerpt 1',
        content: 'Content 1',
        author: 'Author 1',
        status: 'published',
      },
      {
        title: 'Test Draft',
        slug: 'test-draft',
        excerpt: 'Draft excerpt',
        content: 'Draft content',
        author: 'Author 2',
        status: 'draft',
      },
    ]);
  });

  afterEach(clearTestDB);

  describe('GET /api/blog', () => {
    it('should return only published posts', async () => {
      const res = await request(app).get('/api/blog');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Test Post 1');
    });

    it('should support pagination', async () => {
      const res = await request(app).get('/api/blog?page=1&limit=10');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('limit', 10);
      expect(res.body).toHaveProperty('total', 1);
    });
  });

  describe('GET /api/blog/:slug', () => {
    it('should return a published post by slug', async () => {
      const res = await request(app).get('/api/blog/test-post-1');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('title', 'Test Post 1');
    });

    it('should return 404 for draft post', async () => {
      const res = await request(app).get('/api/blog/test-draft');
      expect(res.status).toBe(404);
    });

    it('should return 404 for non-existent slug', async () => {
      const res = await request(app).get('/api/blog/nonexistent');
      expect(res.status).toBe(404);
    });
  });
});

describe('Blog Admin Routes', () => {
  const authHeader = { Authorization: 'Bearer test-admin-token-123' };

  afterEach(clearTestDB);

  describe('POST /api/blog', () => {
    it('should create a new blog post (admin)', async () => {
      const res = await request(app)
        .post('/api/blog')
        .set(authHeader)
        .send({
          title: 'New Post',
          excerpt: 'New excerpt',
          content: 'New content',
          author: 'Admin',
        });
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('title', 'New Post');
      expect(res.body.data).toHaveProperty('slug', 'new-post');
    });

    it('should return 400 if required fields missing', async () => {
      const res = await request(app)
        .post('/api/blog')
        .set(authHeader)
        .send({ title: 'Only Title' });
      expect(res.status).toBe(400);
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/blog')
        .send({ title: 'Test', excerpt: 'E', content: 'C', author: 'A' });
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/blog/:id', () => {
    it('should update a blog post (admin)', async () => {
      const post = await Blog.create({
        title: 'Update Me',
        slug: 'update-me',
        excerpt: 'Old excerpt',
        content: 'Old content',
        author: 'Author',
      });
      const res = await request(app)
        .patch(`/api/blog/${post._id}`)
        .set(authHeader)
        .send({ title: 'Updated Title', content: 'Updated content' });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.content).toBe('Updated content');
    });

    it('should return 404 for non-existent id', async () => {
      const res = await request(app)
        .patch('/api/blog/000000000000000000000000')
        .set(authHeader)
        .send({ title: 'Test' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/blog/:id', () => {
    it('should delete a blog post (admin)', async () => {
      const post = await Blog.create({
        title: 'Delete Me',
        slug: 'delete-me',
        excerpt: 'Excerpt',
        content: 'Content',
        author: 'Author',
      });
      const res = await request(app)
        .delete(`/api/blog/${post._id}`)
        .set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Post deleted.');
      const exists = await Blog.findById(post._id);
      expect(exists).toBeNull();
    });
  });
});

