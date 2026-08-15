const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

/* ── Seed default portfolio entries into DB if empty ── */
const defaultPortfolio = [
  {
    id: 'corporate-brand-strategy',
    title: 'Corporate Brand Strategy Overhaul',
    client: 'TechNova Solutions',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80',
    description: 'A complete brand repositioning for a B2B SaaS company, resulting in 210% increase in qualified leads and a unified brand presence across 12 markets.',
    results: [
      '210% increase in qualified leads',
      '3x social media engagement rate',
      'Unified brand presence across 12 markets',
      '35% reduction in customer acquisition cost',
    ],
    challenge: 'TechNova Solutions had outgrown their original brand identity. With a fragmented visual presence across different product lines and markets, they needed a cohesive brand strategy that could scale globally while maintaining local relevance.',
    solution: 'We developed a comprehensive brand architecture, visual identity system, messaging framework, and rollout strategy. This included market research, stakeholder workshops, competitor analysis, and a phased implementation plan.',
    timeline: '6 months',
    testimonial: 'The team transformed our brand from a collection of disjointed logos into a powerful, unified identity that resonates across every touchpoint.',
    testimonialAuthor: 'Maria Chen, CMO',
    results_img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  },
  {
    id: 'digital-transformation-finance',
    title: 'Digital Transformation for Financial Services',
    client: 'Apex Financial Group',
    category: 'Digital Transformation',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    description: 'End-to-end digital transformation modernizing legacy systems, automating workflows, and launching a customer-facing digital platform.',
    results: [
      '60% reduction in processing time',
      '92% customer satisfaction score',
      '$4.2M annual operational savings',
      'Zero security incidents post-migration',
    ],
    challenge: 'Apex Financial Group was operating on legacy infrastructure that limited scalability, created security vulnerabilities, and delivered a poor customer experience compared to modern fintech competitors.',
    solution: 'We designed a cloud-native architecture, implemented automated workflows, deployed AI-powered fraud detection, and built an omnichannel customer platform with seamless integration to core banking systems.',
    timeline: '14 months',
    testimonial: 'This transformation didn\'t just modernize our technology — it redefined how we serve our customers and compete in the digital age.',
    testimonialAuthor: 'James Wright, CIO',
    results_img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    id: 'supply-chain-optimization',
    title: 'Global Supply Chain Optimization',
    client: 'OmniLogistix Inc.',
    category: 'Operations',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80',
    description: 'Comprehensive supply chain redesign reducing costs by 28% while improving delivery times across 40+ countries.',
    results: [
      '28% reduction in logistics costs',
      '99.3% on-time delivery rate',
      '40% inventory turnover improvement',
      'Carbon footprint reduced by 22%',
    ],
    challenge: 'OmniLogistix faced rising logistics costs, inventory inefficiencies, and increasing customer demands for faster, more sustainable delivery options across their global operations.',
    solution: 'We redesigned the supply chain network, implemented AI-driven demand forecasting, optimized warehouse locations, and introduced sustainable packaging and routing solutions.',
    timeline: '10 months',
    testimonial: 'Our supply chain went from a cost center to a competitive advantage. The ROI exceeded our projections by 40%.',
    testimonialAuthor: 'Robert Kim, COO',
    results_img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
  },
  {
    id: 'market-expansion-strategy',
    title: 'Market Expansion into APAC',
    client: 'GreenLeaf Energy',
    category: 'Strategy',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
    description: 'Strategic market entry and expansion plan for a renewable energy company entering 5 Asian markets simultaneously.',
    results: [
      '$180M revenue in first 2 years',
      '5 markets successfully entered',
      '45 strategic partnerships formed',
      '#1 market position in 2 countries',
    ],
    challenge: 'GreenLeaf Energy needed to rapidly expand into Asian markets but faced regulatory complexity, cultural barriers, and a fragmented competitive landscape across multiple countries.',
    solution: 'We developed a phased market entry strategy, conducted in-depth local market research, established partnership frameworks, and built a localization roadmap for products and messaging.',
    timeline: '18 months',
    testimonial: 'Their deep understanding of local markets and regulatory landscapes was instrumental to our successful expansion.',
    testimonialAuthor: 'Dr. Sarah Park, CEO',
    results_img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
  },
  {
    id: 'hr-transformation-tech',
    title: 'HR Transformation for Tech Scale-up',
    client: 'CodeBridge Systems',
    category: 'HR Consulting',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80',
    description: 'Scaled the HR organization from 200 to 2,000 employees with modern people operations, culture frameworks, and talent systems.',
    results: [
      '400% workforce growth supported',
      'Employee NPS improved from 32 to 78',
      '82% reduction in time-to-hire',
      'Top 5 employer brand in sector',
    ],
    challenge: 'CodeBridge Systems was growing at 200% year-over-year but their HR infrastructure couldn\'t keep up — leading to culture dilution, hiring bottlenecks, and rising attrition.',
    solution: 'We built scalable HR processes, implemented an integrated HRIS, designed a career progression framework, and created a data-driven talent acquisition engine.',
    timeline: '8 months',
    testimonial: 'They didn\'t just fix our HR problems — they built the foundation for our culture to scale without breaking.',
    testimonialAuthor: 'Alex Rivera, VP People',
    results_img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
  },
  {
    id: 'financial-restructuring',
    title: 'Financial Restructuring & Turnaround',
    client: 'Heritage Manufacturing Co.',
    category: 'Financial Advisory',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
    description: 'Complete financial restructuring that saved 1,200 jobs and returned the company to profitability within 12 months.',
    results: [
      'Company returned to profitability in 12 months',
      '1,200 jobs preserved',
      'Debt reduced by 65%',
      'EBITDA margin improved from -8% to +14%',
    ],
    challenge: 'Heritage Manufacturing was on the brink of bankruptcy with declining revenues, unsustainable debt levels, and operational inefficiencies across their production facilities.',
    solution: 'We led a comprehensive restructuring including debt negotiation, operational cost optimization, product portfolio rationalization, and a new financial governance framework.',
    timeline: '12 months',
    testimonial: 'They gave us a second chance. The restructuring saved our company and our people\'s livelihoods.',
    testimonialAuthor: 'Thomas Baker, Chairman',
    results_img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
  },
];

// Auto-seed on first load (non-blocking)
Portfolio.countDocuments().then((count) => {
  if (count === 0) {
    Portfolio.insertMany(defaultPortfolio)
      .then(() => console.log('✅  Seeded default portfolio entries into database'))
      .catch((err) => console.error('❌  Failed to seed portfolio:', err.message));
  }
}).catch(() => {});

/* ── GET /api/portfolio  — all portfolio entries ── */
router.get('/', async (_req, res) => {
  try {
    const entries = await Portfolio.find().sort({ createdAt: -1 });
    res.json({ success: true, count: entries.length, data: entries });
  } catch (err) {
    console.error('[GET /api/portfolio]', err.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ── GET /api/portfolio/:id  — single portfolio entry ── */
router.get('/:id', async (req, res) => {
  try {
    const entry = await Portfolio.findOne({ id: req.params.id });
    if (!entry) return res.status(404).json({ success: false, error: 'Portfolio entry not found.' });
    res.json({ success: true, data: entry });
  } catch (err) {
    console.error('[GET /api/portfolio/:id]', err.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

module.exports = router;
