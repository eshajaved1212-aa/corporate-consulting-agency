import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './StaticPages.css';

const faqs = [
  {
    q: 'What does ConsultPro do?',
    a: 'ConsultPro is a full-service management consulting firm that helps businesses accelerate growth, optimize operations, and achieve sustainable competitive advantage through data-driven strategies and hands-on execution.',
  },
  {
    q: 'How much does a consulting engagement cost?',
    a: 'Engagement costs vary based on scope, complexity, and duration. We offer flexible pricing models including fixed-fee projects, retainer-based engagements, and outcome-based arrangements. Contact us for a free initial consultation and custom proposal.',
  },
  {
    q: 'How long does a typical engagement last?',
    a: 'Most engagements run between 8–16 weeks, depending on the scope. We also offer shorter diagnostic engagements (2–4 weeks) for organizations that need rapid assessment, and long-term retainer partnerships for ongoing strategic support.',
  },
  {
    q: 'What industries do you serve?',
    a: 'We have experience across 40+ industries including financial services, healthcare, technology, manufacturing, retail, energy, and professional services. Our consultants bring deep domain expertise to every engagement.',
  },
  {
    q: 'Do you work with small businesses or only large enterprises?',
    a: 'We work with organizations of all sizes — from high-growth startups to Fortune 500 companies. Every engagement is tailored to the client\'s specific needs, budget, and growth stage.',
  },
  {
    q: 'What is the first step to working with ConsultPro?',
    a: 'The first step is a free, no-obligation 30-minute consultation call. We\'ll discuss your challenges, goals, and explore how we can help. If there\'s a fit, we\'ll provide a detailed proposal with scope, timeline, and pricing.',
  },
  {
    q: 'Who will I be working with?',
    a: 'Every engagement is led by a named senior consultant who serves as your primary point of contact. You\'ll have direct access to them throughout the project — no account managers or middlemen.',
  },
  {
    q: 'Do you guarantee results?',
    a: 'We stand behind our work with a results-oriented approach. While every engagement is different, we define clear KPIs at the outset and provide transparent reporting throughout. Our average client sees a 3× ROI within 12 months.',
  },
  {
    q: 'Is my information kept confidential?',
    a: 'Absolutely. We sign mutual NDAs before any engagement begins. All client data, strategies, and proprietary information are protected under strict confidentiality agreements and SOC 2 Type II compliant infrastructure.',
  },
  {
    q: 'Can I cancel an engagement early?',
    a: 'Yes. Our engagements include flexible terms. If at any point you feel the engagement isn\'t delivering value, you can cancel with 14 days\' notice. We believe our work should speak for itself.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <Navbar />
      <section className="sp-hero">
        <div className="sp-hero-bg">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=85" alt="" aria-hidden="true" />
          <div className="sp-hero-overlay" />
        </div>
        <motion.div className="sp-hero-content" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Link to="/" className="sp-back-link">← Back to Home</Link>
          <span className="sp-eyebrow">Help Center</span>
          <h1 className="sp-hero-title">Frequently Asked <span className="sp-gold">Questions</span></h1>
          <p className="sp-hero-sub">Everything you need to know about working with ConsultPro.</p>
        </motion.div>
      </section>

      <section className="sp-content-section">
        <div className="sp-content-container sp-content-narrow">
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className={`faq-item ${openIndex === i ? 'open' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className="faq-arrow">
                    <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
                      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="sp-cta-box">
            <h2>Still have questions?</h2>
            <p>We're here to help. Reach out to our team for a personal response.</p>
            <Link to="/contact" className="sp-cta-btn">Contact Us →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
