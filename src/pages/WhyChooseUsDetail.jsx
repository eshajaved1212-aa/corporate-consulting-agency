import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Icon from '../components/Icons';
import './WhyChooseUsDetail.css';

const pillars = [
  {
    icon: 'target',
    color: '#2563EB',
    light: 'rgba(37,99,235,0.12)',
    title: 'Proven Results',
    desc: 'Every engagement we take on is measured against hard numbers. We define KPIs at the start, track them weekly, and deliver transparent reports so you always know where things stand. Our average client sees a 3× ROI within the first 12 months.',
    bullets: [
      '3× average ROI in year one',
      'Weekly performance dashboards',
      'Post-engagement audit included',
    ],
  },
  {
    icon: 'handshake',
    color: '#1D4ED8',
    light: 'rgba(29,78,216,0.12)',
    title: 'Dedicated Partnership',
    desc: 'We don\'t parachute in with a report and disappear. A named senior consultant is assigned to your account from day one and stays with you through implementation — available on Slack, email, or phone.',
    bullets: [
      'Named senior consultant per account',
      'Direct communication — no middlemen',
      'Available across all time zones',
    ],
  },
  {
    icon: 'zap',
    color: '#0284C7',
    light: 'rgba(2,132,199,0.12)',
    title: 'Fast Execution',
    desc: 'We work in two-week sprints. Insights turn into action fast, not after a six-month review cycle. Our agile consulting model means your team feels momentum early and stakeholder buy-in happens naturally.',
    bullets: [
      '2-week sprint methodology',
      'First deliverable within 10 business days',
      'Real-time collaboration tools',
    ],
  },
  {
    icon: 'globe',
    color: '#0369A1',
    light: 'rgba(3,105,161,0.12)',
    title: 'Global Expertise',
    desc: 'Our team has worked across 40+ industries and 6 continents. Whether you\'re entering a new market or optimising an existing one, we bring on-the-ground knowledge that generic consultancies can\'t match.',
    bullets: [
      '40+ industries covered',
      'Offices in New York, London & Singapore',
      'Multilingual advisory team',
    ],
  },
  {
    icon: 'lock',
    color: '#0EA5E9',
    light: 'rgba(14,165,233,0.12)',
    title: 'Confidential & Secure',
    desc: 'All engagements are covered by mutual NDAs from day one. Your business strategy, financial data, and competitive plans never leave our secure environment and are never shared — period.',
    bullets: [
      'NDA signed before any briefing',
      'SOC 2 Type II compliant infrastructure',
      'Data deleted post-engagement on request',
    ],
  },
  {
    icon: 'barChart',
    color: '#38BDF8',
    light: 'rgba(56,189,248,0.12)',
    title: 'Transparent Reporting',
    desc: 'No black-box deliverables. Every recommendation comes with the data behind it. Our client portal gives you live access to project progress, research findings, and model outputs — whenever you want them.',
    bullets: [
      'Live client portal access',
      'Methodology docs included',
      'Monthly executive summaries',
    ],
  },
];

const stats = [
  { value: '200+', label: 'Clients Served' },
  { value: '98%', label: 'Retention Rate' },
  { value: '40+', label: 'Countries' },
  { value: '12+', label: 'Years Experience' },
];

const testimonials = [
  {
    quote: 'ConsultPro didn\'t just hand us a strategy document — they helped us build the muscle to execute it ourselves. That\'s rare.',
    name: 'James Whitfield',
    role: 'CEO, Meridian Capital',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
  },
  {
    quote: 'The speed was what surprised us most. We had a prioritized action plan within two weeks and saw measurable lift within the quarter.',
    name: 'Priya Nair',
    role: 'COO, Helios Health',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80',
  },
  {
    quote: 'We\'ve worked with three other firms. ConsultPro is the only one that felt like they had actual skin in the game.',
    name: 'Marcus Oduya',
    role: 'Founder, StrideX Logistics',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export default function WhyChooseUsDetail() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="wcd-hero">
        <div className="wcd-hero-mesh" />
        <motion.div
          className="wcd-hero-inner"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="wcd-eyebrow">Why Choose ConsultPro</span>
          <h1 className="wcd-hero-title">
            The Advantage That<br />
            <span className="wcd-hero-accent">Actually Moves the Needle</span>
          </h1>
          <p className="wcd-hero-sub">
            Six reasons our clients consistently outperform their competition —
            and why they keep coming back.
          </p>
        </motion.div>
      </section>

      {/* ── Stats bar ── */}
      <section className="wcd-stats-bar">
        <div className="wcd-stats-inner">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="wcd-stat"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="wcd-pillars">
        <div className="wcd-pillars-inner">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              className="wcd-pillar"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              {/* Number */}
              <div className="wcd-pillar-num" style={{ color: p.color }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Icon */}
              <div className="wcd-pillar-icon" style={{ background: p.light }}>
                <Icon name={p.icon} size={28} color={p.color} />
              </div>

              <div className="wcd-pillar-content">
                <h3 className="wcd-pillar-title" style={{ '--pillar-color': p.color }}>
                  {p.title}
                </h3>
                <p className="wcd-pillar-desc">{p.desc}</p>
                <ul className="wcd-pillar-bullets">
                  {p.bullets.map((b) => (
                    <li key={b} style={{ '--bullet-color': p.color }}>
                      <span className="wcd-bullet-dot" style={{ background: p.color }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accent line */}
              <div className="wcd-pillar-line" style={{ background: p.color }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="wcd-testimonials">
        <div className="wcd-testimonials-inner">
          <motion.div
            className="wcd-section-label"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <span className="wcd-eyebrow">Client Stories</span>
            <h2 className="wcd-section-title">
              Don't take our word for it
            </h2>
          </motion.div>

          <div className="wcd-testi-grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="wcd-testi-card"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <div className="wcd-quote-mark">&ldquo;</div>
                <p className="wcd-testi-text">{t.quote}</p>
                <div className="wcd-testi-author">
                  <img src={t.avatar} alt={t.name} className="wcd-testi-avatar" />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="wcd-cta">
        <div className="wcd-cta-inner">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65 }}
          >
            <h2 className="wcd-cta-title">Ready to experience the difference?</h2>
            <p className="wcd-cta-sub">
              First consultation is free. No commitment, no sales pressure.
            </p>
            <div className="wcd-cta-btns">
              <Link to="/#contact" className="wcd-cta-primary">
                Book a Free Consultation
                <Icon name="arrowRight" size={16} />
              </Link>
              <Link to="/" className="wcd-cta-secondary">
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
