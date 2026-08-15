import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { portfolio as staticPortfolio } from '../data';
import './Portfolio.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Portfolio() {
  const [entries, setEntries] = useState(staticPortfolio);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...new Set(staticPortfolio.map(e => e.category))];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetch(`${API_BASE}/portfolio`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data.length > 0) setEntries(res.data);
      })
      .catch(() => setEntries(staticPortfolio))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? entries
    : entries.filter(e => e.category === activeFilter);

  return (
    <>
      <Navbar />

      {/* ── Hero banner ── */}
      <section className="pf-hero">
        <div className="pf-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&q=85"
            alt=""
            aria-hidden="true"
          />
          <div className="pf-hero-overlay" />
        </div>
        <motion.div
          className="pf-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Link to="/" className="pf-back">← Back to Home</Link>
          <span className="pf-eyebrow">Our Work</span>
          <h1 className="pf-hero-title">
            Our <span className="pf-accent">Portfolio</span>
          </h1>
          <p className="pf-hero-sub">
            Discover how we've helped organizations across industries achieve measurable,
            transformative results through strategic consulting engagements.
          </p>
        </motion.div>
      </section>

      {/* ── Stats bar ── */}
      <div className="pf-stats-bar">
        {[
          [`${entries.length}+`, 'Projects Delivered'],
          ['98%', 'Client Satisfaction'],
          ['6', 'Industries Served'],
          ['40+', 'Countries'],
        ].map(([n, l], i) => (
          <motion.div
            key={l}
            className="pf-stat"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
          >
            <strong>{n}</strong>
            <span>{l}</span>
          </motion.div>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <section className="pf-section">
        <div className="pf-container">
          <motion.div
            className="pf-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <span className="pf-tag">Case Studies</span>
            <h2 className="pf-section-title">Transforming Businesses Across Industries</h2>
            <p className="pf-section-sub">
              Each engagement is a partnership — explore our most impactful projects.
            </p>
          </motion.div>

          <div className="pf-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`pf-filter-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="pf-loading">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="pf-skeleton" />
              ))}
            </div>
          ) : (
            <div className="pf-grid">
              {filtered.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: i * 0.07 }}
                >
                  <Link to={`/portfolio/${entry.id}`} className="pf-card">
                    <div className="pf-card-img">
                      <img
                        src={entry.thumbnail || entry.image}
                        alt={entry.title}
                        loading="lazy"
                      />
                      <div className="pf-card-img-overlay" />
                      <div className="pf-card-category">{entry.category}</div>
                      <span className="pf-card-num">0{i + 1}</span>
                    </div>
                    <div className="pf-card-body">
                      <span className="pf-card-client">{entry.client}</span>
                      <h3>{entry.title}</h3>
                      <p>{entry.description.substring(0, 120)}...</p>
                      <div className="pf-card-results">
                        {entry.results.slice(0, 2).map((r, ri) => (
                          <span key={ri} className="pf-result-chip">{r}</span>
                        ))}
                      </div>
                      <div className="pf-card-cta">
                        <span>View Case Study</span>
                        <span className="pf-card-arrow">→</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="pf-cta-section">
        <div className="pf-cta-bg">
          <img
            src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1600&q=80"
            alt=""
          />
          <div className="pf-cta-overlay" />
        </div>
        <motion.div
          className="pf-cta-content"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65 }}
        >
          <h2>Ready to Write Your Success Story?</h2>
          <p>Let's discuss how we can help your business achieve remarkable results.</p>
          <Link to="/contact" className="pf-cta-btn">Start Your Journey →</Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
