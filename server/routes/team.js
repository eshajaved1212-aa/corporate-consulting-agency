const express = require('express');
const router  = express.Router();

/* ── Static team data (mirrors src/data.js) ── */
const team = [
  {
    id: 1,
    name: 'Esha Javed',
    role: 'Founder & CEO',
    img: '/my-photo.jpg',
    bio: 'Esha brings 20+ years of strategic consulting experience across Fortune 500 companies. She founded ConsultPro with a mission to make world-class consulting accessible to growing businesses.',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: 2,
    name: 'Waseem Manzoor',
    role: 'Head of Strategy',
    img: '/waseem .jpg',
    bio: 'Waseem is a former McKinsey consultant with deep expertise in market entry strategy and business model innovation. He has led engagements across 30+ industries.',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: 3,
    name: 'Abdul Haseeb',
    role: 'Financial Advisor',
    img: '/haseeb.jpg',
    bio: 'Abdul Haseeb specializes in financial restructuring, capital strategy, and M&A advisory. He previously worked at Goldman Sachs and helped raise over $2B in capital for clients.',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: 4,
    name: 'Abdul Sami',
    role: 'Head of Technology',
    img: '/sami.jpg',
    bio: 'Abdul Sami leads digital transformation engagements, helping clients modernize tech stacks and automate operations. He is a former CTO with 15 years in enterprise software.',
    linkedin: '#',
    twitter: '#',
  },
];

/* ── GET /api/team  — all team members ── */
router.get('/', (_req, res) => {
  res.json({ success: true, count: team.length, data: team });
});

/* ── GET /api/team/:id  — single member ── */
router.get('/:id', (req, res) => {
  const member = team.find((m) => m.id === parseInt(req.params.id));
  if (!member) return res.status(404).json({ success: false, error: 'Team member not found.' });
  res.json({ success: true, data: member });
});

module.exports = router;
