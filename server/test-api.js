/**
 * ConsultPro API — Node.js test runner (no extra dependencies)
 *
 * Usage:
 *   node test-api.js                        # expects server on localhost:5000
 *   BASE_URL=https://your-api.com node test-api.js
 *
 * The server must be running before you execute this script.
 */

const http  = require('http');
const https = require('https');

const BASE    = (process.env.BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const TOKEN   = process.env.ADMIN_TOKEN || 'consultpro-admin-secret-2024';

let passed = 0;
let failed = 0;
let savedInquiryId = null;
let savedContactId = null;

/* ─────────────────── helpers ─────────────────── */

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url      = new URL(BASE + path);
    const lib      = url.protocol === 'https:' ? https : http;
    const payload  = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      port:     url.port || (url.protocol === 'https:' ? 443 : 80),
      path:     url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...headers,
      },
    };

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅  ${label}`);
    passed++;
  } else {
    console.error(`  ❌  ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

function group(name) {
  console.log(`\n📦  ${name}`);
}

/* ─────────────────── tests ─────────────────── */

async function testHealth() {
  group('Health');
  const r = await request('GET', '/health');
  assert('GET /health → 200',          r.status === 200);
  assert('status is ok',               r.body?.status === 'ok');
  assert('db field present',           'db' in (r.body || {}));
}

async function testContact() {
  group('Contact');

  // valid submission
  const r1 = await request('POST', '/contact', {
    name: 'Test User', email: 'test@example.com',
    company: 'TestCo', service: 'Strategy Consulting',
    message: 'Automated test message',
  });
  assert('POST /contact → 201',        r1.status === 201);
  assert('success: true',              r1.body?.success === true);
  assert('returns id',                 typeof r1.body?.id === 'string');
  if (r1.body?.id) savedContactId = r1.body.id;

  // missing fields
  const r2 = await request('POST', '/contact', { name: 'No Email' });
  assert('POST /contact missing → 400', r2.status === 400);
  assert('success: false on 400',      r2.body?.success === false);
}

async function testNewsletter() {
  group('Newsletter');

  const email = `test_${Date.now()}@example.com`;

  // subscribe
  const r1 = await request('POST', '/newsletter', { email });
  assert('POST /newsletter → 201',     r1.status === 201);
  assert('subscribe success',          r1.body?.success === true);

  // duplicate subscribe
  const r2 = await request('POST', '/newsletter', { email });
  assert('Duplicate → 200',            r2.status === 200);
  assert('Already subscribed msg',     r2.body?.message?.toLowerCase().includes('subscribed'));

  // invalid email
  const r3 = await request('POST', '/newsletter', { email: 'notanemail' });
  assert('Invalid email → 400',        r3.status === 400);

  // unsubscribe
  const r4 = await request('DELETE', '/newsletter/unsubscribe', { email });
  assert('DELETE /newsletter/unsubscribe → 200', r4.status === 200);
  assert('Unsubscribe success',        r4.body?.success === true);

  // unsubscribe unknown
  const r5 = await request('DELETE', '/newsletter/unsubscribe', { email: 'ghost@example.com' });
  assert('Unknown email unsub → 404',  r5.status === 404);
}

async function testServices() {
  group('Services');

  const r1 = await request('GET', '/services');
  assert('GET /services → 200',        r1.status === 200);
  assert('Returns array of 6',         Array.isArray(r1.body?.data) && r1.body.data.length === 6);

  const r2 = await request('GET', '/services/strategy-consulting');
  assert('GET /services/:id → 200',    r2.status === 200);
  assert('Correct id returned',        r2.body?.data?.id === 'strategy-consulting');

  const r3 = await request('GET', '/services/does-not-exist');
  assert('GET /services/bad-id → 404', r3.status === 404);

  const r4 = await request('POST', '/services/financial-advisory/inquire', {
    name: 'Inquiry Tester', email: 'inquiry@example.com',
    phone: '+1 555 000 0000', message: 'I need financial advisory services.',
  });
  assert('POST /services/:id/inquire → 201', r4.status === 201);
  assert('Inquiry id returned',        typeof r4.body?.id === 'string');
  if (r4.body?.id) savedInquiryId = r4.body.id;

  // missing fields in inquire
  const r5 = await request('POST', '/services/strategy-consulting/inquire', { name: 'No email' });
  assert('Inquire missing fields → 400', r5.status === 400);

  // inquire on bad service
  const r6 = await request('POST', '/services/ghost-service/inquire', {
    name: 'X', email: 'x@x.com', message: 'test',
  });
  assert('Inquire bad service → 404', r6.status === 404);
}

async function testTeam() {
  group('Team');

  const r1 = await request('GET', '/team');
  assert('GET /team → 200',           r1.status === 200);
  assert('Returns team array',        Array.isArray(r1.body?.data));

  const r2 = await request('GET', '/team/1');
  assert('GET /team/1 → 200',         r2.status === 200);
  assert('Has name field',            typeof r2.body?.data?.name === 'string');

  const r3 = await request('GET', '/team/9999');
  assert('GET /team/bad-id → 404',    r3.status === 404);
}

async function testAdmin() {
  group('Admin');
  const auth = { Authorization: `Bearer ${TOKEN}` };

  // summary
  const r1 = await request('GET', '/admin/summary', null, auth);
  assert('GET /admin/summary → 200',   r1.status === 200);
  assert('Has contacts count',         typeof r1.body?.data?.contacts === 'number');

  // unauthorized
  const r2 = await request('GET', '/admin/summary', null, { Authorization: 'Bearer wrong' });
  assert('Bad token → 401',            r2.status === 401);

  // contacts list
  const r3 = await request('GET', '/admin/contacts', null, auth);
  assert('GET /admin/contacts → 200',  r3.status === 200);
  assert('Paginated structure',        'total' in (r3.body || {}) && 'page' in (r3.body || {}));

  // newsletter list
  const r4 = await request('GET', '/admin/newsletter', null, auth);
  assert('GET /admin/newsletter → 200', r4.status === 200);

  // inquiries list
  const r5 = await request('GET', '/admin/inquiries', null, auth);
  assert('GET /admin/inquiries → 200', r5.status === 200);

  // patch inquiry status
  if (savedInquiryId) {
    const r6 = await request('PATCH', `/admin/inquiries/${savedInquiryId}`, { status: 'in-review' }, auth);
    assert('PATCH inquiry status → 200', r6.status === 200);
    assert('Status updated',            r6.body?.data?.status === 'in-review');

    const r7 = await request('PATCH', `/admin/inquiries/${savedInquiryId}`, { status: 'bad-status' }, auth);
    assert('Invalid status → 400',      r7.status === 400);
  } else {
    console.log('  ⚠️   Skipping PATCH test — no inquiryId saved (inquire test may have failed)');
  }

  // delete contact
  if (savedContactId) {
    const r8 = await request('DELETE', `/admin/contacts/${savedContactId}`, null, auth);
    assert('DELETE /admin/contacts/:id → 200', r8.status === 200);
  }
}

async function test404() {
  group('404 Handler');
  const r = await request('GET', '/this-route-does-not-exist');
  assert('Unknown route → 404', r.status === 404);
}

/* ─────────────────── runner ─────────────────── */

(async () => {
  console.log(`\n🚀  ConsultPro API Tests  →  ${BASE}\n${'─'.repeat(50)}`);

  try {
    await testHealth();
    await testContact();
    await testNewsletter();
    await testServices();
    await testTeam();
    await testAdmin();
    await test404();
  } catch (err) {
    console.error('\n💥  Unexpected error during tests:', err.message);
    console.error('   Is the server running at', BASE, '?');
    process.exit(1);
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅  Passed: ${passed}   ❌  Failed: ${failed}`);
  console.log('─'.repeat(50));

  if (failed > 0) process.exit(1);
})();
