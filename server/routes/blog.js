const express = require('express');
const router  = express.Router();
const Blog    = require('../models/Blog');
const { protect } = require('../middleware/auth');

/* ── Helper: generate slug from title ── */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ── GET /api/blog — list published posts ── */
router.get('/', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const skip  = (page - 1) * limit;
    const category = req.query.category || null;

    const filter = { status: 'published' };
    if (category) filter.category = category;

    const [data, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(filter),
    ]);

    return res.json({ success: true, total, page, limit, count: data.length, data });
  } catch (err) {
    console.error('[GET /api/blog]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── GET /api/blog/:slug — single post ── */
router.get('/:slug', async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });
    return res.json({ success: true, data: post });
  } catch (err) {
    console.error('[GET /api/blog/:slug]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── POST /api/blog — create post (admin) ── */
router.post('/', protect, async (req, res) => {
  try {
    const { title, excerpt, content, author, authorAvatar, coverImage, category, tags, status, readTime } = req.body;

    if (!title || !excerpt || !content || !author) {
      return res.status(400).json({ success: false, error: 'Title, excerpt, content and author are required.' });
    }

    let slug = slugify(title);
    // ensure unique slug
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const doc = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      author,
      authorAvatar: authorAvatar || '',
      coverImage: coverImage || '',
      category: category || 'General',
      tags: tags || [],
      status: status || 'published',
      readTime: readTime || 5,
    });

    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error('[POST /api/blog]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── PATCH /api/blog/:id — update post (admin) ── */
router.patch('/:id', protect, async (req, res) => {
  try {
    const updates = {};
    const fields = ['title', 'excerpt', 'content', 'author', 'authorAvatar', 'coverImage', 'category', 'tags', 'status', 'readTime'];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    if (updates.title) {
      updates.slug = slugify(updates.title);
    }

    const doc = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ success: false, error: 'Post not found.' });

    return res.json({ success: true, data: doc });
  } catch (err) {
    console.error('[PATCH /api/blog/:id]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── DELETE /api/blog/:id — delete post (admin) ── */
router.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Blog.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Post not found.' });
    return res.json({ success: true, message: 'Post deleted.' });
  } catch (err) {
    console.error('[DELETE /api/blog/:id]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

module.exports = router;

