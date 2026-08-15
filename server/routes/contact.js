const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');
const { notifyAdminNewContact, sendContactAutoReply } = require('../utils/mailer');

/* ── POST /api/contact  — save a new inquiry ── */
router.post('/', async (req, res) => {
  try {
    const { name, email, company, service, message } = req.body;

    // basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email and message are required.' });
    }

    const doc = await Contact.create({ name, email, company, service, message });

    // Send email notifications (non-blocking)
    notifyAdminNewContact({ name, email, company, service, message });
    sendContactAutoReply({ name, email });

    return res.status(201).json({ success: true, id: doc._id });
  } catch (err) {
    console.error('[POST /api/contact]', err.message);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

/* ── GET /api/contacts  — list all submissions (admin) ── */
router.get('/all', async (req, res) => {
  try {
    const docs = await Contact.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    console.error('[GET /api/contacts/all]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

module.exports = router;
