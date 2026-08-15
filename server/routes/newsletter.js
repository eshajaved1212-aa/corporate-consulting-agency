const express    = require('express');
const router     = express.Router();
const Newsletter = require('../models/Newsletter');

/* ── POST /api/newsletter  — subscribe ── */
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email is required.' });
    }

    // if already subscribed, just reactivate
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return res.json({ success: true, message: 'Welcome back! You are re-subscribed.' });
      }
      return res.json({ success: true, message: 'You are already subscribed!' });
    }

    await Newsletter.create({ email });
    return res.status(201).json({ success: true, message: 'Successfully subscribed!' });
  } catch (err) {
    console.error('[POST /api/newsletter]', err.message);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

/* ── DELETE /api/newsletter/unsubscribe  — unsubscribe ── */
router.delete('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required.' });

    const doc = await Newsletter.findOne({ email });
    if (!doc) return res.status(404).json({ success: false, error: 'Email not found.' });

    doc.isActive = false;
    await doc.save();
    return res.json({ success: true, message: 'You have been unsubscribed.' });
  } catch (err) {
    console.error('[DELETE /api/newsletter/unsubscribe]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

module.exports = router;
