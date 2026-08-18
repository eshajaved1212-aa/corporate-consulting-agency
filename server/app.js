/* ─────────────────────────────────────────────────
   Express app setup (separated from server startup
   so it can be required by tests)
   dotenv is loaded in index.js, not here, so tests
   can set up environment before requiring app.
   ───────────────────────────────────────────────── */
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const contactRoute    = require('./routes/contact');
const newsletterRoute = require('./routes/newsletter');
const servicesRoute   = require('./routes/services');
const teamRoute       = require('./routes/team');
const adminRoute      = require('./routes/admin');
const blogRoute       = require('./routes/blog');
const portfolioRoute  = require('./routes/portfolio');
const authRoute       = require('./routes/auth');

const app  = express();

/* ── Security & performance middleware ── */
app.set('trust proxy', 1);               // required for express-rate-limit behind proxies
app.use(helmet());                       // security headers
app.use(compression());                  // gzip response compression

// Global rate limit (per IP) — protects against brute-force / abuse
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,              // 15 minutes
  max: 300,                              // 300 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
}));

// Stricter rate limit on auth (login brute-force protection)
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts, please try again later.' },
}));

/* ── Middleware ── */
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:4173',  // preview
      'http://localhost:3000',
      'http://localhost:5174',
      // allow requests with no origin (mobile apps, Postman, curl)
      undefined,
    ];
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

/* ── Routes ── */
app.use('/api/contact',    contactRoute);
app.use('/api/contacts',   contactRoute);   // legacy alias
app.use('/api/newsletter', newsletterRoute);
app.use('/api/services',   servicesRoute);
app.use('/api/team',       teamRoute);
app.use('/api/admin',      adminRoute);
app.use('/api/blog',       blogRoute);
app.use('/api/portfolio',  portfolioRoute);
app.use('/api/auth',       authRoute);

/* ── Health check ── */
const mongoose = require('mongoose');
app.get('/api/health', (_req, res) =>
  res.json({
    success: true,
    status : 'ok',
    db     : mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime : process.uptime().toFixed(1) + 's',
    env    : process.env.NODE_ENV || 'development',
  })
);

/* ── 404 ── */
app.use((_req, res) =>
  res.status(404).json({ success: false, error: 'Route not found.' })
);

/* ── Global error handler ── */
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err.message);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

module.exports = app;

