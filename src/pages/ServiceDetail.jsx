import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchService, submitServiceInquiry } from '../api';
import { services } from '../data';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Icon from '../components/Icons';
import './ServiceDetail.css';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inquiry form state
  const emptyInquiry = { name: '', email: '', phone: '', message: '' };
  const [inquiry, setInquiry] = useState(emptyInquiry);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryDone, setInquiryDone] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setLoading(true);
    setInquiryDone(false);
    setInquiry(emptyInquiry);
    fetchService(id)
      .then((res) => setService(res.data))
      .catch(() => {
        // fallback to static data
        const found = services.find((s) => s.id === id);
        setService(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleInquiryChange = (e) => {
    setInquiryError('');
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryLoading(true);
    setInquiryError('');
    try {
      await submitServiceInquiry(id, inquiry);
      setInquiryDone(true);
    } catch (err) {
      setInquiryError(err.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setInquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="not-found"><p>Loading…</p></div>
      </>
    );
  }

  if (!service) {
    return (
      <>
        <Navbar />
        <div className="not-found">
          <h2>Service not found</h2>
          <button className="cta-btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="service-detail-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="service-detail-icon">
            <Icon name={service.icon} size={40} color="#fff" />
          </span>
          <h1>{service.title}</h1>
          <p>{service.short}</p>
        </motion.div>
      </section>

      <section className="section service-detail-body">
        <motion.div
          className="service-detail-main"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Overview</h2>
          <p>{service.description}</p>

          <h2>What's Included</h2>
          <ul className="service-points">
            {service.points.map((p) => (
              <li key={p}>✔ {p}</li>
            ))}
          </ul>

          {/* ── Inquiry form ── */}
          <div className="service-inquiry-wrap">
            <h2>Inquire About This Service</h2>
            {inquiryDone ? (
              <motion.div
                className="service-inquiry-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                ✓ Inquiry sent! We'll be in touch within one business day.
              </motion.div>
            ) : (
              <form className="service-inquiry-form" onSubmit={handleInquirySubmit}>
                <div className="si-row">
                  <div className="si-field">
                    <label>Name *</label>
                    <input name="name" type="text" placeholder="Your Name"
                      value={inquiry.name} onChange={handleInquiryChange} required />
                  </div>
                  <div className="si-field">
                    <label>Email *</label>
                    <input name="email" type="email" placeholder="your@email.com"
                      value={inquiry.email} onChange={handleInquiryChange} required />
                  </div>
                </div>
                <div className="si-field">
                  <label>Phone (optional)</label>
                  <input name="phone" type="tel" placeholder="+1 (555) 000-0000"
                    value={inquiry.phone} onChange={handleInquiryChange} />
                </div>
                <div className="si-field">
                  <label>Message *</label>
                  <textarea name="message" rows="4" placeholder="Tell us about your challenge…"
                    value={inquiry.message} onChange={handleInquiryChange} required />
                </div>
                {inquiryError && (
                  <p className="si-error" role="alert">{inquiryError}</p>
                )}
                <button type="submit" className="cta-btn" disabled={inquiryLoading}>
                  {inquiryLoading ? 'Sending…' : 'Send Inquiry →'}
                </button>
              </form>
            )}
          </div>

          <Link to="/" className="cta-btn service-detail-cta">
            ← Back to Home
          </Link>
        </motion.div>

        <div className="service-detail-nav">
          <h3>Other Services</h3>
          {services
            .filter((s) => s.id !== id)
            .map((s) => (
              <Link key={s.id} to={`/services/${s.id}`} className="service-detail-nav-item">
                <Icon name={s.icon} size={16} /> {s.title}
              </Link>
            ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
