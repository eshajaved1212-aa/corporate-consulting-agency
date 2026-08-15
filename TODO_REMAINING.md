# Remaining Tasks — Implementation Checklist

## Week 6 — RESTful API & JWT Auth Engine
- [x] Secure middleware: helmet, compression, express-rate-limit in `server/app.js`
- [x] Create `server/models/User.js` (username, passwordHash with bcrypt, role)
- [x] Create `server/middleware/auth.js` (JWT sign/verify + RBAC authorize)
- [x] Create `server/controllers/authController.js` (login with bcrypt compare → JWT)
- [x] Create `server/routes/auth.js` (POST /api/auth/login) + register in app.js
- [x] Create `/controllers` layer and extract logic from route files
- [x] Upgrade `requireAdmin` to JWT-based `protect` middleware (keep token backward compat)

## Week 7 — Full-Stack API Integration
- [x] Install axios
- [x] Replace `src/api.js` fetch with Axios instance + request/response interceptors
- [x] Update `AdminLogin.jsx` to use username/password login
- [x] Update `AdminDashboard.jsx` to use JWT from localStorage

## Week 8 — Testing & Deployment
- [x] Add auth tests (login, RBAC) — `server/tests/auth.test.js` (7 tests)
- [x] Update Postman collection for new auth flow (env example + docs updated)
- [x] Run full test suite to confirm all green

## Verification (complete)
- [x] Backend tests: **51/51 passed** across 8 suites (incl. new auth suite)
- [x] Frontend build: **vite build passes** (540 modules)
- [x] Frontend tests: **12/12 passed** across 4 files
- [x] `.env.example` updated with `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRES_IN`

