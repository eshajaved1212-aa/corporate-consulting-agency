const express        = require('express');
const router         = express.Router();
const Service        = require('../models/Service');
const ServiceInquiry = require('../models/ServiceInquiry');
const { notifyAdminServiceInquiry } = require('../utils/mailer');

/* ── Seed default services into DB if empty ── */
const defaultServices = [
  {
    id: 'strategy-consulting',
    icon: 'trendingUp',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    title: 'Strategy Consulting',
    short: 'Data-driven strategies to accelerate business growth.',
    description:
      'We help you define a clear roadmap for growth by analyzing markets, competitors, and internal capabilities. Our strategy engagements turn ambiguity into an actionable, prioritized plan.',
    points: [
      'Market & competitor analysis',
      'Growth roadmap design',
      'KPI & performance frameworks',
      'Business model innovation',
    ],
  },
  {
    id: 'financial-advisory',
    icon: 'dollarSign',
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
    title: 'Financial Advisory',
    short: 'Optimize capital structure and improve profitability.',
    description:
      'Our financial advisory practice helps organizations strengthen their balance sheets, raise capital, and improve profitability through rigorous financial modeling and risk assessment.',
    points: [
      'Financial modeling & forecasting',
      'Capital raising support',
      'Risk & compliance assessment',
      'Cost optimization',
    ],
  },
  {
    id: 'digital-transformation',
    icon: 'monitor',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    title: 'Digital Transformation',
    short: 'Modernize operations with technology-first thinking.',
    description:
      'We guide organizations through digital transformation — from process automation to full technology stack modernization — ensuring adoption sticks and ROI is measurable.',
    points: [
      'Process automation',
      'Technology stack modernization',
      'Change management',
      'Digital maturity assessment',
    ],
  },
  {
    id: 'hr-consulting',
    icon: 'users',
    img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
    title: 'HR Consulting',
    short: 'Build high-performing teams and organizational structures.',
    description:
      'Our HR consulting services help you design organizational structures, improve talent acquisition, and build a culture that retains top performers.',
    points: [
      'Org design & restructuring',
      'Talent acquisition strategy',
      'Performance management systems',
      'Culture & engagement programs',
    ],
  },
  {
    id: 'marketing-strategy',
    icon: 'megaphone',
    img: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=80',
    title: 'Marketing Strategy',
    short: 'Position your brand and reach the right audience.',
    description:
      'We craft marketing strategies grounded in customer insight and data — helping you position your brand effectively and reach the audiences that matter most.',
    points: [
      'Brand positioning',
      'Customer segmentation',
      'Campaign strategy & analytics',
      'Go-to-market planning',
    ],
  },
  {
    id: 'risk-management',
    icon: 'shield',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
    title: 'Risk Management',
    short: 'Identify, assess, and mitigate business risks.',
    description:
      'We help organizations build robust risk management frameworks that identify vulnerabilities early and put mitigation strategies in place before they become costly problems.',
    points: [
      'Enterprise risk assessment',
      'Compliance frameworks',
      'Business continuity planning',
      'Crisis management support',
    ],
  },
];

// Auto-seed on first load (non-blocking)
Service.countDocuments().then((count) => {
  if (count === 0) {
    Service.insertMany(defaultServices)
      .then(() => console.log('✅  Seeded default services into database'))
      .catch((err) => console.error('❌  Failed to seed services:', err.message));
  }
}).catch(() => {});

// Ensure default services exist (await seed if empty) — used by GET handler
async function ensureSeed() {
  const count = await Service.countDocuments();
  if (count === 0) {
    await Service.insertMany(defaultServices);
    console.log('✅  Seeded default services into database');
  }
}

/* ── GET /api/services  — all services ── */
router.get('/', async (_req, res) => {
  try {
    await ensureSeed();   // deterministic: seed before returning list if empty
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    console.error('[GET /api/services]', err.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── GET /api/services/:id  — single service ── */
router.get('/:id', async (req, res) => {
  try {
    await ensureSeed();
    const service = await Service.findOne({ id: req.params.id });
    if (!service) return res.status(404).json({ success: false, error: 'Service not found.' });
    res.json({ success: true, data: service });
  } catch (err) {
    console.error('[GET /api/services/:id]', err.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── POST /api/services/:id/inquire  — submit inquiry for a service ── */
router.post('/:id/inquire', async (req, res) => {
  try {
    await ensureSeed();
    const service = await Service.findOne({ id: req.params.id });
    if (!service) return res.status(404).json({ success: false, error: 'Service not found.' });

    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email and message are required.' });
    }

    const doc = await ServiceInquiry.create({
      serviceId: service.id,
      serviceTitle: service.title,
      name,
      email,
      phone: phone || '',
      message,
    });

    // Send admin notification (non-blocking)
    notifyAdminServiceInquiry({
      serviceTitle: service.title,
      name,
      email,
      phone: phone || '',
      message,
    });

    return res.status(201).json({ success: true, id: doc._id });
  } catch (err) {
    console.error('[POST /api/services/:id/inquire]', err.message);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

module.exports = router;
