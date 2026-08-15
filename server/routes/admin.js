const express        = require('express');
const router         = express.Router();
const Contact        = require('../models/Contact');
const Newsletter     = require('../models/Newsletter');
const Service        = require('../models/Service');
const ServiceInquiry = require('../models/ServiceInquiry');
const Portfolio      = require('../models/Portfolio');
const { protect, authorize } = require('../middleware/auth');
const { sendInquiryReply, sendContactReply } = require('../utils/mailer');

/*
  Auth: JWT-based protection (with legacy ADMIN_TOKEN fallback).
  Pass token as: Authorization: Bearer <jwt-or-admin-token>
*/

/* ── GET /api/admin/summary  — counts overview ── */
router.get('/summary', protect, async (_req, res) => {
  try {
    const [contacts, subscribers, inquiries] = await Promise.all([
      Contact.countDocuments(),
      Newsletter.countDocuments({ isActive: true }),
      ServiceInquiry.countDocuments(),
    ]);

    return res.json({
      success: true,
      data: { contacts, activeSubscribers: subscribers, serviceInquiries: inquiries },
    });
  } catch (err) {
    console.error('[GET /api/admin/summary]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── GET /api/admin/contacts  — all contact form submissions ── */
router.get('/contacts', protect, async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(),
    ]);

    return res.json({ success: true, total, page, limit, data });
  } catch (err) {
    console.error('[GET /api/admin/contacts]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── GET /api/admin/newsletter  — all subscribers ── */
router.get('/newsletter', protect, async (req, res) => {
  try {
    const active = req.query.active; // optional filter: 'true' | 'false'
    const filter = active !== undefined ? { isActive: active === 'true' } : {};

    const data = await Newsletter.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('[GET /api/admin/newsletter]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── GET /api/admin/inquiries  — all service inquiries ── */
router.get('/inquiries', protect, async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const data   = await ServiceInquiry.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('[GET /api/admin/inquiries]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── PATCH /api/admin/inquiries/:id  — update inquiry status ── */
router.patch('/inquiries/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'in-review', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status.' });
    }

    const doc = await ServiceInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!doc) return res.status(404).json({ success: false, error: 'Inquiry not found.' });

    return res.json({ success: true, data: doc });
  } catch (err) {
    console.error('[PATCH /api/admin/inquiries/:id]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── POST /api/admin/inquiries/:id/reply  — send an email reply, set status to in-review ── */
router.post('/inquiries/:id/reply', protect, async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ success: false, error: 'Reply message is required.' });
    }

    const inquiry = await ServiceInquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, error: 'Inquiry not found.' });

    // Send the reply email (non-blocking) and update status to in-review
    await sendInquiryReply({
      to: inquiry.email,
      name: inquiry.name,
      serviceTitle: inquiry.serviceTitle,
      replyMessage: replyMessage.trim(),
    });

    const doc = await ServiceInquiry.findByIdAndUpdate(
      req.params.id,
      { status: 'in-review' },
      { new: true }
    );

    return res.json({ success: true, message: 'Reply sent.', data: doc });
  } catch (err) {
    console.error('[POST /api/admin/inquiries/:id/reply]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── DELETE /api/admin/contacts/:id  — remove a contact entry ── */
router.delete('/contacts/:id', protect, async (req, res) => {
  try {
    const doc = await Contact.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Contact not found.' });
    return res.json({ success: true, message: 'Deleted.' });
  } catch (err) {
    console.error('[DELETE /api/admin/contacts/:id]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── POST /api/admin/contacts/:id/reply  — send an email reply to a contact submission ── */
router.post('/contacts/:id/reply', protect, async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ success: false, error: 'Reply message is required.' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, error: 'Contact not found.' });

    // Send the reply email (non-blocking)
    await sendContactReply({
      to: contact.email,
      name: contact.name,
      replyMessage: replyMessage.trim(),
    });

    return res.json({ success: true, message: 'Reply sent.' });
  } catch (err) {
    console.error('[POST /api/admin/contacts/:id/reply]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ──────────────────────────────────────────────
   Services CRUD (admin protected)
   ────────────────────────────────────────────── */

/* ── GET /api/admin/services  — list all services ── */
router.get('/services', protect, async (_req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    console.error('[GET /api/admin/services]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── POST /api/admin/services  — create a new service ── */
router.post('/services', protect, async (req, res) => {
  try {
    const { id, icon, img, title, short, description, points } = req.body;
    if (!id || !title || !short || !description) {
      return res.status(400).json({ success: false, error: 'id, title, short and description are required.' });
    }

    // Check if service ID already exists
    const existing = await Service.findOne({ id });
    if (existing) {
      return res.status(409).json({ success: false, error: `Service with id "${id}" already exists.` });
    }

    const service = await Service.create({
      id,
      icon: icon || 'fileText',
      img: img || '',
      title,
      short,
      description,
      points: points || [],
    });

    return res.status(201).json({ success: true, data: service });
  } catch (err) {
    console.error('[POST /api/admin/services]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── PATCH /api/admin/services/:id  — update a service ── */
router.patch('/services/:id', protect, async (req, res) => {
  try {
    const { icon, img, title, short, description, points } = req.body;
    const update = {};
    if (icon !== undefined) update.icon = icon;
    if (img !== undefined) update.img = img;
    if (title !== undefined) update.title = title;
    if (short !== undefined) update.short = short;
    if (description !== undefined) update.description = description;
    if (points !== undefined) update.points = points;

    const service = await Service.findOneAndUpdate(
      { id: req.params.id },
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ success: false, error: 'Service not found.' });

    return res.json({ success: true, data: service });
  } catch (err) {
    console.error('[PATCH /api/admin/services/:id]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── DELETE /api/admin/services/:id  — delete a service ── */
router.delete('/services/:id', protect, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ id: req.params.id });
    if (!service) return res.status(404).json({ success: false, error: 'Service not found.' });
    return res.json({ success: true, message: 'Service deleted.' });
  } catch (err) {
    console.error('[DELETE /api/admin/services/:id]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ──────────────────────────────────────────────
   Portfolio CRUD (admin protected)
   ────────────────────────────────────────────── */

/* ── GET /api/admin/portfolio  — list all portfolio entries ── */
router.get('/portfolio', protect, async (_req, res) => {
  try {
    const entries = await Portfolio.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: entries.length, data: entries });
  } catch (err) {
    console.error('[GET /api/admin/portfolio]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── POST /api/admin/portfolio  — create a new portfolio entry ── */
router.post('/portfolio', protect, async (req, res) => {
  try {
    const { id, title, client, category, image, thumbnail, description, results, challenge, solution, timeline, testimonial, testimonialAuthor, results_img } = req.body;
    if (!id || !title || !client || !category || !description) {
      return res.status(400).json({ success: false, error: 'id, title, client, category and description are required.' });
    }

    const existing = await Portfolio.findOne({ id });
    if (existing) {
      return res.status(409).json({ success: false, error: `Portfolio entry with id "${id}" already exists.` });
    }

    const entry = await Portfolio.create({
      id, title, client, category,
      image: image || '',
      thumbnail: thumbnail || '',
      description,
      results: results || [],
      challenge: challenge || '',
      solution: solution || '',
      timeline: timeline || '',
      testimonial: testimonial || '',
      testimonialAuthor: testimonialAuthor || '',
      results_img: results_img || '',
    });

    return res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error('[POST /api/admin/portfolio]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── PATCH /api/admin/portfolio/:id  — update a portfolio entry ── */
router.patch('/portfolio/:id', protect, async (req, res) => {
  try {
    const { title, client, category, image, thumbnail, description, results, challenge, solution, timeline, testimonial, testimonialAuthor, results_img } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (client !== undefined) update.client = client;
    if (category !== undefined) update.category = category;
    if (image !== undefined) update.image = image;
    if (thumbnail !== undefined) update.thumbnail = thumbnail;
    if (description !== undefined) update.description = description;
    if (results !== undefined) update.results = results;
    if (challenge !== undefined) update.challenge = challenge;
    if (solution !== undefined) update.solution = solution;
    if (timeline !== undefined) update.timeline = timeline;
    if (testimonial !== undefined) update.testimonial = testimonial;
    if (testimonialAuthor !== undefined) update.testimonialAuthor = testimonialAuthor;
    if (results_img !== undefined) update.results_img = results_img;

    const entry = await Portfolio.findOneAndUpdate(
      { id: req.params.id },
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ success: false, error: 'Portfolio entry not found.' });

    return res.json({ success: true, data: entry });
  } catch (err) {
    console.error('[PATCH /api/admin/portfolio/:id]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── DELETE /api/admin/portfolio/:id  — delete a portfolio entry ── */
router.delete('/portfolio/:id', protect, async (req, res) => {
  try {
    const entry = await Portfolio.findOneAndDelete({ id: req.params.id });
    if (!entry) return res.status(404).json({ success: false, error: 'Portfolio entry not found.' });
    return res.json({ success: true, message: 'Portfolio entry deleted.' });
  } catch (err) {
    console.error('[DELETE /api/admin/portfolio/:id]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

module.exports = router;
