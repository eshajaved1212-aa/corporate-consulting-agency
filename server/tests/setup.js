/* ─────────────────────────────────────────────────
   Test setup — runs before each test file
   (Jest setupFiles — synchronous only, runs
   before test framework is installed)
   ───────────────────────────────────────────────── */

// Set test environment BEFORE dotenv could load
process.env.NODE_ENV = 'test';
process.env.ADMIN_TOKEN = 'test-admin-token-123';
process.env.MONGO_URI = '';
process.env.SMTP_HOST = '';
process.env.SMTP_USER = '';
process.env.SMTP_PASS = '';

