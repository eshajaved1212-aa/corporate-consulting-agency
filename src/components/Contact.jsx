import { motion } from 'framer-motion';
import { useState } from 'react';
import Icon from './Icons';
import { submitContact } from '../api';
import './Contact.css';

const contactInfo = [
  {
    icon: 'mail',
    label: 'Email Us',
    value: 'eshajaved191@gmail.com',
    note: 'We reply within 24 hours',
  },
  {
    icon: 'phone',
    label: 'Call Us',
    value: '+92 3147566191',
    note: 'Mon–Fri, 9am – 6pm EST',
  },
{
    icon: 'mapPin',
    label: 'Visit Us',
    value: 'Vehari, Punjab, Pakistan',
    note: 'Walk-ins welcome',
  },
];

const services = [
  'Strategy Consulting',
  'Financial Advisory',
  'Digital Transformation',
  'HR Consulting',
  'Marketing Strategy',
  'Risk Management',
];

const emptyForm = { name: '', email: '', company: '', service: '', message: '' };

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [active, setActive]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await submitContact(form);
      // Show success only when the API responds with 200 or 201.
      if (res && (res.status === 200 || res.status === 201)) {
        setSubmitted(true);
        // Reset all input fields after a successful submission.
        setForm(emptyForm);
      } else {
        throw new Error(res?.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="ct-section">

{/* ── Full-bleed background image with subtle overlay ── */}
      <div className="ct-bg">
        <img
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=85"
          alt=""
          aria-hidden="true"
        />
        <div className="ct-bg-overlay" />
      </div>

      <div className="ct-container">

        {/* ── Top header ── */}
        <motion.div
          className="ct-header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65 }}
        >
          <span className="ct-eyebrow">Get In Touch</span>
          <h2 className="ct-heading">
            Let's Talk About<br />
            <span className="ct-heading-accent">Your Next Move</span>
          </h2>
          <p className="ct-subtext">
            Whether you have a specific challenge or want to explore options —
            no pressure, no jargon. Just a real conversation with senior advisors.
          </p>
        </motion.div>

        {/* ── Two-column body ── */}
        <div className="ct-body">

          {/* ── LEFT: image card + contact info ── */}
          <motion.div
            className="ct-left"
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            {/* Office photo card */}
            <div className="ct-photo-card">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80"
                alt="Corporate Consulting office"
              />
              <div className="ct-photo-overlay" />
              <div className="ct-photo-badge">
                <span className="ct-badge-dot" />
                <span>Available for new projects</span>
              </div>
            </div>

            {/* Contact info rows */}
            <div className="ct-info-list">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="ct-info-row"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                >
                  <div className="ct-info-icon">
<Icon name={item.icon} size={18} color="#0EA5E9" />
                  </div>
                  <div className="ct-info-text">
                    <span className="ct-info-label">{item.label}</span>
                    <strong className="ct-info-value">{item.value}</strong>
                    <span className="ct-info-note">{item.note}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social row */}
            <div className="ct-socials">
              {[
                { label: 'LinkedIn', href: 'https://www.linkedin.com/company/consultpro' },
                { label: 'Twitter', href: 'https://twitter.com/consultpro' },
                { label: 'Instagram', href: 'https://instagram.com/consultpro' },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="ct-social-pill">{s.label}</a>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: form ── */}
          <motion.div
            className="ct-form-wrap"
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {submitted ? (
              <motion.div
                className="ct-success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
              >
                <div className="ct-success-icon">
                  <svg viewBox="0 0 52 52" fill="none" width="56" height="56">
                    <circle cx="26" cy="26" r="25" stroke="#0EA5E9" strokeWidth="2" />
                    <path d="M14 26l9 9 15-15" stroke="#0EA5E9" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3>Message Received!</h3>
                <p>A senior consultant will be in touch within one business day.</p>
                <button
                  className="ct-reset-btn"
                  onClick={() => { setSubmitted(false); setForm(emptyForm); }}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form className="ct-form" onSubmit={handleSubmit} noValidate>
                <h3 className="ct-form-title">Send Us a Message</h3>
                <p className="ct-form-sub">Fill in your details and we'll get back to you within 24 hours.</p>

                <div className="ct-row">
                  <div className={`ct-field ${active === 'name' ? 'is-active' : ''}`}>
                    <label htmlFor="ct-name">Full Name <span className="ct-req">*</span></label>
                    <input
                      id="ct-name" name="name" type="text" placeholder="John Smith"
                      value={form.name} onChange={handleChange} required
                      onFocus={() => setActive('name')} onBlur={() => setActive('')}
                    />
                  </div>
                  <div className={`ct-field ${active === 'email' ? 'is-active' : ''}`}>
                    <label htmlFor="ct-email">Email Address <span className="ct-req">*</span></label>
                    <input
                      id="ct-email" name="email" type="email" placeholder="john@company.com"
                      value={form.email} onChange={handleChange} required
                      onFocus={() => setActive('email')} onBlur={() => setActive('')}
                    />
                  </div>
                </div>

                <div className="ct-row">
                  <div className={`ct-field ${active === 'company' ? 'is-active' : ''}`}>
                    <label htmlFor="ct-company">Company</label>
                    <input
                      id="ct-company" name="company" type="text" placeholder="Your Company"
                      value={form.company} onChange={handleChange}
                      onFocus={() => setActive('company')} onBlur={() => setActive('')}
                    />
                  </div>
                  <div className={`ct-field ${active === 'service' ? 'is-active' : ''}`}>
                    <label htmlFor="ct-service">Service Needed</label>
                    <select
                      id="ct-service" name="service" value={form.service}
                      onChange={handleChange}
                      onFocus={() => setActive('service')} onBlur={() => setActive('')}
                    >
                      <option value="">Select a service…</option>
                      {services.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className={`ct-field ct-field-full ${active === 'message' ? 'is-active' : ''}`}>
                  <label htmlFor="ct-message">Your Message <span className="ct-req">*</span></label>
                  <textarea
                    id="ct-message" name="message" rows="5"
                    placeholder="Tell us about your challenge or project…"
                    value={form.message} onChange={handleChange} required
                    onFocus={() => setActive('message')} onBlur={() => setActive('')}
                  />
                </div>

                {error && (
                  <p className="ct-error" role="alert">
                    <Icon name="alertCircle" size={14} color="#f87171" />
                    {error}
                  </p>
                )}

                <div className="ct-form-footer">
                  <p className="ct-privacy">
<Icon name="lock" size={12} color="#64748B" />
                    Confidential — your info is never shared.
                  </p>
                  <button type="submit" className="ct-submit" disabled={loading}>
                    {loading ? 'Sending…' : 'Send Message'}
                    {!loading && (
                      <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                        <path d="M3 10h14M11 4l6 6-6 6" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
