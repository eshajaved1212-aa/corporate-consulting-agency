import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Icon from '../components/Icons';
import './CareersPage.css';

const perks = [
  {
    icon: 'rocket',
    title: 'Growth Opportunities',
    desc: 'Structured career ladders, mentorship programs, and $5,000 annual learning budgets to help you reach your full potential.',
  },
  {
    icon: 'target',
    title: 'Flexible Work',
    desc: 'Hybrid and remote-first working models, flexible hours, and a culture built around outcomes — not face time.',
  },
  {
    icon: 'globe',
    title: 'Global Impact',
    desc: 'Work with clients across 40+ industries and 20+ countries on engagements that reshape how businesses operate.',
  },
  {
    icon: 'award',
    title: 'Rewarding Compensation',
    desc: 'Competitive salary, performance bonuses, equity options, and comprehensive health & retirement benefits.',
  },
  {
    icon: 'users',
    title: 'World-Class Team',
    desc: 'Collaborate with former top-tier consultants, technologists, and operators who are the best at what they do.',
  },
  {
    icon: 'lightbulb',
    title: 'Wellbeing First',
    desc: 'Generous paid time off, parental leave, wellness stipends, and a supportive environment that values work-life balance.',
  },
];

const openPositions = [
  {
    title: 'Senior Management Consultant',
    dept: 'Consulting',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    tags: ['Strategy', 'Operations', 'Client-Facing'],
  },
  {
    title: 'Financial Advisory Associate',
    dept: 'Financial Advisory',
    location: 'London, UK',
    type: 'Full-time',
    tags: ['Financial Modeling', 'Due Diligence', 'M&A'],
  },
  {
    title: 'Digital Transformation Lead',
    dept: 'Technology',
    location: 'Remote (US)',
    type: 'Full-time',
    tags: ['Cloud', 'Automation', 'Change Management'],
  },
  {
    title: 'Data Analytics Consultant',
    dept: 'Consulting',
    location: 'Singapore',
    type: 'Full-time',
    tags: ['SQL', 'Python', 'BI Tools'],
  },
  {
    title: 'Marketing Strategy Manager',
    dept: 'Marketing',
    location: 'San Francisco, CA',
    type: 'Full-time',
    tags: ['Brand Strategy', 'GTM', 'Analytics'],
  },
  {
    title: 'HR Transformation Consultant',
    dept: 'HR Consulting',
    location: 'London, UK (Hybrid)',
    type: 'Contract',
    tags: ['Org Design', 'HRIS', 'People Ops'],
  },
];

const steps = [
  { num: '01', title: 'Apply Online', desc: 'Submit your resume and a brief cover letter through our application form.' },
  { num: '02', title: 'Intro Call', desc: 'A 30-minute conversation with a member of our talent team to learn about your goals.' },
  { num: '03', title: 'Case Interview', desc: 'A realistic business case exercise to see how you approach complex problems.' },
  { num: '04', title: 'Panel Interview', desc: 'Meet leaders and future teammates to assess mutual fit and alignment.' },
  { num: '05', title: 'Offer & Onboarding', desc: 'Receive your offer, then join our structured onboarding to hit the ground running.' },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="cp-hero">
        <div className="cp-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=85"
            alt=""
            aria-hidden="true"
          />
          <div className="cp-hero-overlay" />
        </div>
        <motion.div
          className="cp-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="cp-eyebrow">Join Our Team</span>
          <h1 className="cp-hero-title">
            Build Your Future at <span className="cp-gold">ConsultPro</span>
          </h1>
          <p className="cp-hero-sub">
            We're looking for exceptional consultants, technologists, and operators
            who are passionate about delivering real results for our clients.
          </p>
        </motion.div>
      </section>

      {/* ── Stats bar ── */}
      <div className="cp-stats-bar">
        {[
          ['500+', 'Employees Globally'],
          ['40+', 'Industries Served'],
          ['25+', 'Countries'],
          ['92%', 'Employee Retention'],
        ].map(([num, label], i) => (
          <motion.div
            key={label}
            className="cp-stat"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
          >
            <strong>{num}</strong>
            <span>{label}</span>
          </motion.div>
        ))}
      </div>

      {/* ── Why work here (perks) ── */}
      <section className="cp-section">
        <div className="cp-container">
          <motion.div
            className="cp-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <span className="cp-tag">Life at ConsultPro</span>
            <h2 className="cp-section-title">Why Work Here?</h2>
            <p className="cp-section-sub">
              We invest in our people because they're the heart of everything we deliver.
            </p>
          </motion.div>

          <div className="cp-perks-grid">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                className="cp-perk-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
              >
                <div className="cp-perk-icon"><Icon name={perk.icon} size={28} /></div>
                <h3>{perk.title}</h3>
                <p>{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open positions ── */}
      <section className="cp-positions">
        <div className="cp-container">
          <motion.div
            className="cp-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <span className="cp-tag">Open Roles</span>
            <h2 className="cp-section-title">Current Open Positions</h2>
            <p className="cp-section-sub">
              Don't see the perfect fit? Send us your CV anyway — we're always looking for great talent.
            </p>
          </motion.div>

          <div className="cp-jobs-list">
            {openPositions.map((job, i) => (
              <motion.div
                key={job.title}
                className="cp-job-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <div className="cp-job-info">
                  <div className="cp-job-tag">{job.dept}</div>
                  <h3>{job.title}</h3>
                  <p className="cp-job-meta">
                    <span>📍 {job.location}</span>
                    <span>⏰ {job.type}</span>
                  </p>
                  <div className="cp-job-tags">
                    {job.tags.map(t => (
                      <span key={t} className="cp-job-chip">{t}</span>
                    ))}
                  </div>
                </div>
                <Link to="/contact" className="cp-apply-btn">Apply Now →</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hiring process ── */}
      <section className="cp-section cp-process">
        <div className="cp-container">
          <motion.div
            className="cp-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <span className="cp-tag">Our Process</span>
            <h2 className="cp-section-title">How Hiring Works</h2>
            <p className="cp-section-sub">
              A transparent, respectful process designed to bring out the best in you.
            </p>
          </motion.div>

          <div className="cp-steps">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="cp-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <span className="cp-step-num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cp-cta">
        <div className="cp-cta-bg">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80"
            alt=""
            aria-hidden="true"
          />
          <div className="cp-cta-overlay" />
        </div>
        <motion.div
          className="cp-cta-content"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65 }}
        >
          <h2>Ready to Make an Impact?</h2>
          <p>Join a team that's shaping the future of business consulting worldwide.</p>
          <Link to="/contact" className="cp-cta-btn">Get in Touch →</Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}

