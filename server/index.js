/* ─────────────────────────────────────────────────
   Server entry point — requires the app from app.js
   and starts listening after connecting to MongoDB
   ───────────────────────────────────────────────── */
require('dotenv').config({ path: __dirname + '/.env' });

// Force Google DNS — fixes ISP/system DNS that blocks MongoDB Atlas SRV lookups
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const mongoose = require('mongoose');
const app      = require('./app');
const { seedDefaultAdmin } = require('./controllers/authController');

const PORT = process.env.PORT || 5000;

/* ── MongoDB connection with retry ── */
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI && process.env.NODE_ENV !== 'test') {
  console.error('❌  MONGO_URI is not set in .env file!');
  console.error('    Create server/.env and add: MONGO_URI=mongodb+srv://...');
  process.exit(1);
}

const connectWithRetry = (attempt = 1) => {
  const MAX = 5;
  console.log(`🔄  MongoDB connecting... (attempt ${attempt}/${MAX})`);

  mongoose.connect(MONGO_URI, {
    family: 4, // Forces IPv4 (Solves Windows / Router connection drops)
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('✅  MongoDB connected successfully');
    console.log(`    DB: ${mongoose.connection.name}`);
    // Seed default admin user (bcrypt-hashed) for JWT login
    if (process.env.NODE_ENV !== 'test') {
      seedDefaultAdmin();
    }
    app.listen(PORT, () => {
      console.log(`🚀  Server running → http://localhost:${PORT}`);
      console.log(`    Health: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error(`❌  MongoDB connection failed (attempt ${attempt}): ${err.message}`);

    // Helpful error hints
    if (err.message.includes('ECONNREFUSED') || err.message.includes('querySrv')) {
      console.error('\n  ━━━ FIX: IP Whitelist on MongoDB Atlas ━━━');
      console.error('  1. Go to https://cloud.mongodb.com');
      console.error('  2. Select your project → Network Access');
      console.error('  3. Click "Add IP Address"');
      console.error('  4. Click "Allow Access from Anywhere" (0.0.0.0/0)');
      console.error('  5. Click Confirm and wait ~30 seconds\n');
    }

    if (err.message.includes('Authentication failed')) {
      console.error('\n  ━━━ FIX: Wrong username/password in MONGO_URI ━━━\n');
    }

    if (attempt < MAX) {
      const delay = attempt * 3000;
      console.log(`    Retrying in ${delay / 1000}s...`);
      setTimeout(() => connectWithRetry(attempt + 1), delay);
    } else {
      console.error('\n❌  Max retries reached. Server will start WITHOUT database.');
      console.error('    API routes that need DB will return 500 errors.');
      // Start server anyway so static routes still work
      app.listen(PORT, () => {
        console.log(`⚠️   Server running (no DB) → http://localhost:${PORT}`);
      });
    }
  });
};

// Only connect to MongoDB if not in test mode
if (process.env.NODE_ENV !== 'test') {
  connectWithRetry();
}

