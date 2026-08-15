const express = require('express');
const router = express.Router();
const { login, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/* ── POST /api/auth/login — username/password → JWT ── */
router.post('/login', login);

/* ── GET /api/auth/me — current user (requires JWT) ── */
router.get('/me', protect, me);

module.exports = router;
