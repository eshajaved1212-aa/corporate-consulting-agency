import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Icon from '../components/Icons';
import { fetchServices } from '../api';
import { services as staticServices } from '../data';
import './ServicesPage.css';

export default function ServicesPage() {
  const [services, setServices] = useState(staticServices);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchServices()
      .then(res => setServices(res.data))
      .catch(() => setServices(staticServices))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      {/* ── Hero banner ── */}
      <section className="sp-hero">
        <div className="sp-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=85"
            alt=""
            aria-hidden="true"
          />
          <div className="sp-hero-overlay" />
        </div>
        <motion.div
          className="sp-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="sp-eyebrow">What We Do</span>
          <h1 className="sp-hero-title">
            Our <span className="sp-gold">Services</span>
          </h1>
          <p className="sp-hero-sub">
            End-to-end consulting across strategy, finance, technology, and operations —
            designed to deliver measurable results from day one.
          </p>
        </motion.div>
      </section>

      {/* ── Stats bar ── */}
      <div className="sp-stats-bar">
        {[['200+','Clients Served'],['98%','Retention Rate'],['6','Service Areas'],['40+','Countries']].map(([n, l], i) => (
          <motion.div key={l} className="sp-stat"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}>
            <strong>{n}</strong>
            <span>{l}</span>
          </motion.div>
        ))}
      </div>

      {/* ── Services grid ── */}
      <section className="sp-section">
        <div className="sp-container">
          <motion.div className="sp-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}>
            <span className="sp-tag">Full-Service Advisory</span>
            <h2 className="sp-section-title">Solutions Built Around Your Business</h2>
            <p className="sp-section-sub">
              From strategy to execution — every engagement is tailored, measurable, and built to last.
            </p>
          </motion.div>

          {loading ? (
            <div className="sp-loading">
              {[...Array(6)].map((_, i) => <div key={i} className="sp-skeleton" />)}
            </div>
          ) : (
            <div className="sp-grid">
              {services.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: i * 0.07 }}>
                  <Link to={`/services/${s.id}`} className="sp-card">
                    <div className="sp-card-img">
                      <img src={s.img} alt={s.title} />
                      <div className="sp-card-img-overlay" />
                      <div className="sp-card-icon">
                        <Icon name={s.icon} size={24} color="#fff" />
                      </div>
                      <span className="sp-card-num">0{i + 1}</span>
                    </div>
                    <div className="sp-card-body">
                      <h3>{s.title}</h3>
                      <p>{s.short}</p>
                      <ul className="sp-card-points">
                        {s.points.slice(0, 2).map(pt => (
                          <li key={pt}>
                            <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                              <path d="M3 8l4 4 6-6" stroke="var(--gold-bright)" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {pt}
                          </li>
                        ))}
                      </ul>
                      <div className="sp-card-cta">
                        <span>Learn More</span>
                        <span className="sp-card-arrow">→</span>
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
      <section className="sp-cta-section">
        <div className="sp-cta-bg">
          <img src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1600&q=80" alt="" />
          <div className="sp-cta-overlay" />
        </div>
        <motion.div className="sp-cta-content"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65 }}>
          <h2>Not Sure Which Service You Need?</h2>
          <p>Our advisors will help you identify the right engagement in a free 30-minute consultation.</p>
          <Link to="/contact" className="sp-cta-btn">Book a Free Consultation →</Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
