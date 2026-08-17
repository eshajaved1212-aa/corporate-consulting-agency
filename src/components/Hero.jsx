import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from './Icons';
import './Hero.css';

/* ── Small trust / credibility stats ── */
const STATS = [
  { value: '500+', label: 'Projects Completed' },
  { value: '98%', label: 'Success Rate' },
  { value: '15+', label: 'Years Experience' },
];

const FLOATING_CARDS = [
  { label: '500+ Projects Completed', top: '12%', right: '-8%', delay: '0s' },
  { label: '98% Success Rate', bottom: '18%', left: '-6%', delay: '1.5s' },
];

export default function Hero() {
  const [activeBtn, setActiveBtn] = useState(null);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleRipple = (e, btn) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'hero-ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    e.currentTarget.appendChild(ripple);
    setActiveBtn(btn);
    setTimeout(() => ripple.remove(), 650);
  };

  return (
    <section id="home" className="hero">
      <div className="hero-bg-img" />
      <div className="hero-bg-overlay" />
      <div className="hero-bg-glow hero-bg-glow--1" />
      <div className="hero-bg-glow hero-bg-glow--2" />

      <div className="hero-inner">
        <div className="hero-grid">
          <div className="hero-copy">
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span className="hero-badge-dot" />
              <span className="hero-badge-text">Trusted Business Growth Partner</span>
            </motion.div>

            <h1 className="hero-heading">
              <span className="hero-heading-gradient">Strategic Consulting</span>
              <br />
              for Business
              <br />
              <span className="hero-heading-accent">Excellence</span>
            </h1>

            <motion.p
              className="hero-founder"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.55 }}
            >
              <span className="hero-founder-label">Founded &amp; Led by</span> <span className="hero-founder-name">Esha Javed</span>
            </motion.p>

            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 }}
            >
              We help organizations transform, innovate and grow
              with data-driven strategies and customized solutions
              that deliver measurable results.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <button
                className={`hero-btn hero-btn-primary ${activeBtn === 'primary' ? 'active' : ''}`}
                onClick={(e) => { handleRipple(e, 'primary'); scrollTo('contact'); }}
              >
                <span className="hero-btn-text">Get Free Consultation</span>
                <Icon name="arrowRight" size={17} className="hero-btn-arrow" />
              </button>

              <Link
                to="/portfolio"
                className={`hero-btn hero-btn-ghost ${activeBtn === 'ghost' ? 'active' : ''}`}
                onClick={(e) => handleRipple(e, 'ghost')}
              >
                <span className="hero-btn-text">View Case Studies</span>
                <Icon name="arrowRight" size={17} className="hero-btn-arrow" />
              </Link>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15 }}
            >
              {STATS.map((s) => (
                <div className="hero-stat" key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="hero-visual">
            <div className="hero-img-wrap">
              <img
                className="hero-img"
                src="/src/assets/mm.jpg"
                alt="Professional business consulting team collaboration"
                loading="lazy"
              />
              {FLOATING_CARDS.map((card, i) => (
                <motion.div
                  key={i}
                  className={`hero-float-card hero-float-card--${i}`}
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 1.3 + i * 0.2 }}
                >
                  <span className="hero-float-card-value">{card.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
