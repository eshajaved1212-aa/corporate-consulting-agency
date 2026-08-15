import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { portfolio as staticPortfolio } from '../data';
import './PortfolioDetail.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PortfolioDetail() {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetch(`${API_BASE}/portfolio/${id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) setEntry(res.data);
        else setEntry(staticPortfolio.find(p => p.id === id) || null);
      })
      .catch(() => setEntry(staticPortfolio.find(p => p.id === id) || null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pfd-loading-page">
        <Navbar />
        <div className="pfd-loading">Loading...</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="pfd-loading-page">
        <Navbar />
        <div className="pfd-not-found">
          <h2>Portfolio entry not found</h2>
          <Link to="/portfolio" className="pfd-back-link">← Back to Portfolio</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pfd-hero">
        <div className="pfd-hero-bg">
          <img src={entry.image} alt={entry.title} />
          <div className="pfd-hero-overlay" />
        </div>
        <motion.div
          className="pfd-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Link to="/portfolio" className="pfd-back">← Back to Portfolio</Link>
          <span className="pfd-category">{entry.category}</span>
          <h1 className="pfd-title">{entry.title}</h1>
          <p className="pfd-client">Client: <strong>{entry.client}</strong></p>
          {entry.timeline && <p className="pfd-timeline">Timeline: {entry.timeline}</p>}
        </motion.div>
      </section>

      {/* ── Overview ── */}
      <section className="pfd-section">
        <div className="pfd-container">
          <motion.div
            className="pfd-overview"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="pfd-section-tag">Overview</span>
            <h2>About This Project</h2>
            <p>{entry.description}</p>
          </motion.div>

          {/* ── Results ── */}
          <motion.div
            className="pfd-results"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="pfd-section-tag">Results</span>
            <h2>Key Outcomes</h2>
            <div className="pfd-results-grid">
              {entry.results.map((result, i) => (
                <motion.div
                  key={i}
                  className="pfd-result-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="pfd-result-icon">
                    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                      <path d="M5 13l4 4L19 7" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>{result}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Challenge & Solution ── */}
          <div className="pfd-challenge-solution">
            <motion.div
              className="pfd-cs-block"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <span className="pfd-section-tag">Challenge</span>
              <h2>The Problem</h2>
              <p>{entry.challenge}</p>
            </motion.div>
            <motion.div
              className="pfd-cs-block"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <span className="pfd-section-tag">Solution</span>
              <h2>Our Approach</h2>
              <p>{entry.solution}</p>
            </motion.div>
          </div>

          {/* ── Results Image ── */}
          {entry.results_img && (
            <motion.div
              className="pfd-results-img-wrap"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <img src={entry.results_img} alt="Results visualization" />
            </motion.div>
          )}

          {/* ── Testimonial ── */}
          {entry.testimonial && (
            <motion.div
              className="pfd-testimonial"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="pfd-testimonial-icon">
                <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                  <path d="M3 21c3 0 6-2 6-6V9H3v6h2c0 2-1 3-2 3v3zm12 0c3 0 6-2 6-6V9h-6v6h2c0 2-1 3-2 3v3z"
                    fill="#38BDF8" opacity="0.3"/>
                </svg>
              </div>
              <blockquote>"{entry.testimonial}"</blockquote>
              <cite>— {entry.testimonialAuthor}</cite>
            </motion.div>
          )}

          {/* ── CTA ── */}
          <motion.div
            className="pfd-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/contact" className="pfd-cta-btn">
              Start a Similar Project →
            </Link>
            <Link to="/portfolio" className="pfd-cta-secondary">
              View All Projects
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
