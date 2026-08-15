import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from './Icons';
import '../components/Section.css';
import './About.css';

export default function About() {
  return (
    <section id="about" className="about-section">

      {/* ── Label above ── */}
      <motion.div
        className="about-label"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <span className="section-tag">About Us</span>
      </motion.div>

<div className="about-inner">

        {/* ── LEFT: Image stack ── */}
        <motion.div
          className="about-visuals"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75 }}
        >
          <div className="about-img-primary">
            <img
              src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=900&auto=format&fit=crop"
              alt="Modern business workspace"
            />
          </div>

          <div className="about-img-secondary">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=500&auto=format&fit=crop"
              alt="Corporate planning"
            />
          </div>

          {/* Floating experience badge */}
          <div className="about-exp-badge">
            <strong>15+</strong>
            <span>Years of<br/>Excellence</span>
          </div>

          {/* Floating clients badge */}
          <div className="about-clients-badge">
            <div className="badge-avatars">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="" />
              <img src="https://randomuser.me/api/portraits/men/32.jpg"   alt="" />
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="" />
            </div>
            <div>
              <strong>200+</strong>
              <span>Happy Clients</span>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT: Content ── */}
        <motion.div
          className="about-content"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, delay: 0.1 }}
        >
          <h2 className="about-title">
            We Turn Business Challenges<br />
            into <span className="about-title-accent">Growth Opportunities</span>
          </h2>

          <p className="about-para">
            Corporate Consulting is a full-service advisory firm helping organisations
            navigate change, optimise operations, and build strategies that
            deliver measurable results. Our multidisciplinary team combines deep
            industry expertise with a precision-driven, collaborative approach.
          </p>

          {/* Checklist */}
          <ul className="about-list">
            {[
              'Tailored strategies built around your goals',
              'Cross-industry expertise across 40+ sectors',
              'Transparent process with measurable outcomes',
              'Dedicated senior consultants on every engagement',
            ].map((item) => (
              <li key={item}>
                <span className="about-check">
                  <Icon name="checkCircle" size={22} color="var(--accent)" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* Mini stats strip */}
          <div className="about-mini-stats">
            {[
              { num: '98%', label: 'Client Retention' },
              { num: '40+', label: 'Countries' },
              { num: '80+', label: 'Consultants' },
            ].map((s) => (
              <div key={s.label} className="about-mini-stat">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <Link to="/about" className="about-cta-btn">
            Discover Our Full Story
            <Icon name="arrowRight" size={18} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
