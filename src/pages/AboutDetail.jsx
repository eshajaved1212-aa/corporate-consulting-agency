import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Icon from '../components/Icons';
import { fetchTeam } from '../api';
import { team as staticTeam } from '../data';
import '../components/Section.css';
import './AboutDetail.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.65, ease: 'easeOut', delay },
});

const values = [
  {
    icon: 'target',
    title: 'Client-First Thinking',
    desc: 'Every decision we make starts with one question: what is best for the client? We never push solutions — we listen, diagnose, and tailor.',
  },
  {
    icon: 'lightbulb',
    title: 'Insight-Driven',
    desc: 'We back every recommendation with rigorous data analysis, market research, and proven frameworks — no guesswork, ever.',
  },
  {
    icon: 'handshake',
    title: 'True Partnership',
    desc: 'We embed ourselves in your team. Your challenges become our challenges. Success is only meaningful when it is shared.',
  },
  {
    icon: 'zap',
    title: 'Bias for Action',
    desc: 'Strategy without execution is just a document. We move fast, iterate, and deliver tangible results within weeks.',
  },
  {
    icon: 'lock',
    title: 'Integrity & Trust',
    desc: 'We hold ourselves to the highest ethical standards. Confidentiality, honesty, and transparency are non-negotiable.',
  },
  {
    icon: 'globe',
    title: 'Global Perspective',
    desc: 'With experience across 40+ markets, we bring a broad world view while keeping your local context at the forefront.',
  },
];

const timeline = [
  {
    year: '2009',
    title: 'Founded in New York',
    desc: 'ConsultPro was established with a team of 5 consultants and a mission to make world-class strategy accessible to growing businesses.',
    side: 'left',
  },
  {
    year: '2012',
    title: 'Expanded to 3 Continents',
    desc: 'Opened offices in London and Singapore, bringing our expertise to clients across Europe and Asia-Pacific.',
    side: 'right',
  },
  {
    year: '2015',
    title: 'Launched Digital Practice',
    desc: 'Recognized the shift early — built a dedicated digital transformation practice to help clients modernize operations at scale.',
    side: 'left',
  },
  {
    year: '2018',
    title: 'Reached 100 Clients',
    desc: 'Crossed a landmark milestone of 100 active client engagements, spanning Fortune 500 companies to high-growth startups.',
    side: 'right',
  },
  {
    year: '2021',
    title: 'Named Top 10 Consulting Firm',
    desc: 'Recognized by Global Consulting Review as one of the top 10 boutique consulting firms for strategy and innovation.',
    side: 'left',
  },
  {
    year: '2024',
    title: '200+ Clients & Growing',
    desc: 'Today we serve 200+ clients worldwide, with a team of 80+ senior consultants delivering measurable impact every day.',
    side: 'right',
  },
];

export default function AboutDetail() {
  const navigate = useNavigate();
  const [team, setTeam] = useState(staticTeam);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchTeam()
      .then((res) => setTeam(res.data))
      .catch(() => setTeam(staticTeam)); // fallback to static on error
  }, []);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="about-detail-hero">
        <img
          className="about-detail-hero-img"
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=80"
          alt="Modern office"
        />
        <div className="about-detail-hero-overlay" />
        <div className="about-detail-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="section-tag">About ConsultPro</span>
            <h1>
              15 Years of Turning
              <span className="highlight"> Bold Ideas</span>
              <br />into Measurable Growth
            </h1>
            <p>
              We are a full-service consulting agency built on one belief — that
              the right strategy, executed with precision, can transform any
              organization. Here is our story.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="about-stats-bar">
        <div className="about-stats-bar-inner">
          {[
            ['200+', 'Clients Worldwide'],
            ['15+', 'Years of Experience'],
            ['98%', 'Client Retention Rate'],
            ['40+', 'Countries Reached'],
          ].map(([num, label], i) => (
            <motion.div
              key={label}
              className="about-stat-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            >
              <strong>{num}</strong>
              <span>{label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Mission / Vision ── */}
      <div className="about-mv">
        <motion.div className="about-mv-card" {...fadeUp(0)}>
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80"
            alt="Our Mission"
          />
          <div className="about-mv-card-overlay" />
          <div className="about-mv-card-body">
            <div className="about-mv-icon">
              <Icon name="rocket" size={28} color="#fff" />
            </div>
            <h3>Our Mission</h3>
            <p>
              To empower businesses of all sizes with the strategic clarity,
              operational excellence, and innovative thinking needed to compete
              and win in today's fast-moving markets. We partner with leaders
              who are serious about growth and committed to change.
            </p>
          </div>
        </motion.div>

        <motion.div className="about-mv-card" {...fadeUp(0.15)}>
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
            alt="Our Vision"
          />
          <div className="about-mv-card-overlay" />
          <div className="about-mv-card-body">
            <div className="about-mv-icon">
              <Icon name="star" size={28} color="#fff" />
            </div>
            <h3>Our Vision</h3>
            <p>
              To be the most trusted consulting partner for ambitious
              organizations worldwide — known not just for the strategies we
              create, but for the lasting transformations we help our clients
              achieve. We measure our success by your success.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Timeline / Story ── */}
      <section className="about-story">
        <div className="about-story-inner">
          <motion.div className="about-story-header" {...fadeUp()}>
            <span className="section-tag">Our Journey</span>
            <h2 className="section-title">How We Got Here</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              From a small team with big ambitions to a global consulting firm
              trusted by hundreds of organizations worldwide.
            </p>
          </motion.div>

          <div className="timeline">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                className={`timeline-item ${item.side}`}
                {...fadeUp(i * 0.08)}
              >
                {item.side === 'right' && <div className="timeline-empty" />}
                <div className="timeline-dot">
                  <div className="timeline-dot-inner">{item.year.slice(2)}</div>
                </div>
                <div className="timeline-content">
                  <span className="tl-year">{item.year}</span>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
                {item.side === 'left' && <div className="timeline-empty" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-values">
        <motion.div className="about-values-header" {...fadeUp()}>
          <span className="section-tag">What We Stand For</span>
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            These principles guide every engagement, every recommendation,
            and every relationship we build.
          </p>
        </motion.div>

        <div className="values-grid">
          {values.map((v, i) => (
            <motion.div key={v.title} className="value-card" {...fadeUp(i * 0.07)}>
              <div className="value-card-accent" />
              <div className="value-icon">
                <Icon name={v.icon} size={28} color="#2563eb" />
              </div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Team preview ── */}
      <section className="about-team-preview">
        <div className="about-team-preview-inner">
          <motion.div className="about-team-header" {...fadeUp()}>
            <span className="section-tag">The People Behind It</span>
            <h2 className="section-title">Meet Our Leadership Team</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Seasoned professionals with decades of combined experience across
              strategy, finance, technology, and operations.
            </p>
          </motion.div>

          <div className="about-team-grid">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="about-team-card"
                {...fadeUp(i * 0.1)}
              >
                <div className="about-team-photo">
                  <img src={member.img} alt={member.name} />
                </div>
                <div className="about-team-info">
                  <h4>{member.name}</h4>
                  <span>{member.role}</span>
                  <div className="about-team-bar" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="about-cta">
        <img
          className="about-cta-img"
          src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1600&q=80"
          alt="Work together"
        />
        <div className="about-cta-overlay" />
        <motion.div className="about-cta-content" {...fadeUp()}>
          <h2>
            Ready to Build Something
            <span> Extraordinary?</span>
          </h2>
          <p>
            Let's talk about your challenges and how ConsultPro can help you
            unlock the next level of growth. First consultation is on us.
          </p>
          <div className="about-cta-btns">
            <button
              className="cta-btn"
              onClick={() => { navigate('/'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
            >
              Get in Touch →
            </button>
            <Link to="/" className="about-cta-secondary">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
