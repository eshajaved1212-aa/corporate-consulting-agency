const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../middleware/auth');

/**
 * Seed a default admin user on first run (non-blocking).
 * Credentials come from env: ADMIN_USERNAME / ADMIN_PASSWORD
 * (fallbacks: admin / admin123 for local dev convenience).
 */
function seedDefaultAdmin() {
  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  User.countDocuments({ role: 'admin' })
    .then((count) => {
      if (count > 0) return;
      userExistsCheck(username).then((exists) => {
        if (exists) return;
        const passwordHash = bcrypt.hashSync(password, 10);
        User.create({ username, passwordHash, name: 'Administrator', role: 'admin' })
          .then(() => console.log(`✅  Seeded default admin user "${username}"`))
          .catch((err) => console.error('❌  Failed to seed admin user:', err.message));
      });
    })
    .catch(() => {});
}

async function userExistsCheck(username) {
  const u = await User.findOne({ username });
  return !!u;
}

/* ── POST /api/auth/login ── */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required.' });
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, error: 'This account has been disabled.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }

    // Update last login timestamp (non-blocking)
    user.lastLoginAt = new Date();
    user.save().catch(() => {});

    const token = signToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[POST /api/auth/login]', err.message);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
}

/* ── GET /api/auth/me — return current user (requires JWT) ── */
async function me(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User no longer exists.' });
    }
    return res.json({
      success: true,
      user: { id: user._id, username: user.username, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error('[GET /api/auth/me]', err.message);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
}

module.exports = { login, me, seedDefaultAdmin };
