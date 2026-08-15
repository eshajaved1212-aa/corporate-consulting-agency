import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from './Icons';
import './WhyChooseUs.css';

const reasons = [
  {
    icon: 'target',
    title: 'Proven Results',
    text: 'Data-backed strategies with a track record of delivering measurable ROI for our clients.',
    color: '#2563EB',
    light: 'rgba(37,99,235,0.10)',
  },
  {
    icon: 'shield',
    title: 'Dedicated Partnership',
    text: 'We work as an extension of your team, providing expert guidance and steady execution.',
    color: '#0284C7',
    light: 'rgba(2,132,199,0.10)',
  },
  {
    icon: 'zap',
    title: 'Fast Execution',
    text: 'Agile methodology means insights turn into action in weeks, not months.',
    color: '#0369A1',
    light: 'rgba(3,105,161,0.10)',
  },
  {
    icon: 'globe',
    title: 'Global Expertise',
    text: 'Experience across 40+ industries and markets worldwide.',
    color: '#1D4ED8',
    light: 'rgba(29,78,216,0.10)',
  },
  {
    icon: 'lock',
    title: 'Confidential & Secure',
    text: 'Your business data and strategy stay protected under strict confidentiality.',
    color: '#0EA5E9',
    light: 'rgba(14,165,233,0.10)',
  },
  {
    icon: 'barChart',
    title: 'Transparent Reporting',
    text: 'Clear dashboards and reports so you always know where things stand.',
    color: '#38BDF8',
    light: 'rgba(56,189,248,0.10)',
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="why-section">

      {/* Animated bg lines */}
      <div className="why-lines">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="why-line"
            animate={{ scaleY: [0.4, 1, 0.4] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            style={{ left: `${10 + i * 16}%` }}
          />
        ))}
      </div>

      <div className="why-inner">

        {/* Left: sticky heading + image */}
        <motion.div
          className="why-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75 }}
        >
          <span className="why-tag">Why Choose Us</span>
          <h2 className="why-title">
            The <span className="why-accent">Corporate Consulting</span><br />Advantage
          </h2>
          <p className="why-desc">
            We combine strategic thinking with hands-on execution to deliver
            results you can measure — not just recommendations that sit on a shelf.
          </p>

          {/* Stats pills */}
          <div className="why-pills">
            {[['200+','Clients'],['98%','Retention'],['40+','Countries']].map(([n,l])=>(
              <div key={l} className="why-pill">
                <strong>{n}</strong><span>{l}</span>
              </div>
            ))}
          </div>

          {/* Feature image - using inline SVG that always loads */}
          <div className="why-img-wrap">
            <svg className="why-img-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a5f"/>
                  <stop offset="100%" stopColor="#1D4ED8"/>
                </linearGradient>
                <linearGradient id="tableGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60A5FA"/>
                  <stop offset="100%" stopColor="#93C5FD"/>
                </linearGradient>
              </defs>
              <rect width="800" height="400" fill="url(#bgGrad)"/>
              {/* Table */}
              <rect x="60" y="250" width="680" height="12" rx="4" fill="url(#tableGrad)" opacity="0.9"/>
              {/* People silhouettes */}
              <circle cx="190" cy="180" r="32" fill="#ffffff" opacity="0.15"/>
              <rect x="158" y="212" width="64" height="80" rx="8" fill="#ffffff" opacity="0.12"/>
              <circle cx="400" cy="160" r="36" fill="#ffffff" opacity="0.2"/>
              <rect x="364" y="196" width="72" height="96" rx="8" fill="#ffffff" opacity="0.16"/>
              <circle cx="610" cy="170" r="34" fill="#ffffff" opacity="0.18"/>
              <rect x="576" y="204" width="68" height="88" rx="8" fill="#ffffff" opacity="0.14"/>
              {/* Chart */}
              <rect x="120" y="190" width="24" height="60" rx="3" fill="#93C5FD" opacity="0.5"/>
              <rect x="155" y="170" width="24" height="80" rx="3" fill="#93C5FD" opacity="0.65"/>
              <rect x="190" y="200" width="24" height="50" rx="3" fill="#93C5FD" opacity="0.4"/>
              {/* Glow */}
              <circle cx="400" cy="180" r="120" fill="#60A5FA" opacity="0.08"/>
            </svg>
            <div className="why-img-badge">
              <span>★★★★★</span>
              <p>Rated #1 Consulting Firm 2024</p>
            </div>
          </div>

          <Link to="/why-choose-us" className="why-learn-more-btn">
            Learn More About Our Advantage
            <Icon name="arrowRight" size={16} />
          </Link>
        </motion.div>

        {/* Right: colorful cards */}
        <div className="why-cards">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              className="why-card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              whileHover={{ x: 8, scale: 1.02 }}
              style={{ '--card-color': r.color, '--card-light': r.light }}
            >
              <div className="why-card-icon" style={{ background: r.light, color: r.color }}>
                <Icon name={r.icon} size={26} color={r.color} />
              </div>
              <div className="why-card-text">
                <h3 style={{ color: '#fff' }}>{r.title}</h3>
                <p>{r.text}</p>
              </div>
              <div className="why-card-line" style={{ background: r.color }} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
