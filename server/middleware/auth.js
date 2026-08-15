const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT signing helper.
 * Creates a signed token containing the user id + role.
 */
function signToken(user) {
  const payload = {
    sub: user._id.toString(),
    username: user.username,
    role: user.role,
  };
  const secret = process.env.JWT_SECRET || process.env.ADMIN_TOKEN || 'consultpro-dev-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Authenticate a request via `Authorization: Bearer <jwt>`.
 * Also keeps backward compatibility: if the provided token exactly
 * matches ADMIN_TOKEN (legacy static-token auth), it is accepted with
 * an implicit 'admin' role so existing tests/Postman keep working.
 *
 * On success, sets req.user = { id, username, role }.
 */
function protect(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized. No token provided.' });
  }

  // 1) Legacy static ADMIN_TOKEN fallback (backward compatible)
  if (process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) {
    req.user = { id: null, username: 'admin', role: 'admin' };
    return next();
  }

  // 2) JWT verification
  const secret = process.env.JWT_SECRET || process.env.ADMIN_TOKEN || 'consultpro-dev-secret';
  try {
    const decoded = jwt.verify(token, secret);
    req.user = {
      id: decoded.sub,
      username: decoded.username,
      role: decoded.role || 'admin',
    };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
}

/**
 * RBAC middleware — restrict a route to specific roles.
 * Usage: router.get('/', protect, authorize('admin', 'editor'), handler)
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden. You do not have permission.' });
    }
    next();
  };
}

module.exports = { protect, authorize, signToken };
