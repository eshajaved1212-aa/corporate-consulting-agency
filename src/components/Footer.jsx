/* ================================================================
   Footer — Premium Enterprise Consulting Footer
   Fully responsive 5-column layout using Bootstrap 5 grid.
   ================================================================ */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaLinkedin,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from 'react-icons/fa6';
import {
  HiMapPin,
  HiPhone,
  HiEnvelope,
  HiClock,
} from 'react-icons/hi2';
import { subscribeNewsletter } from '../api';
import './Footer.css';

/* ── Navigation Data ── */

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Team', to: '/team' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const servicesLinks = [
  { label: 'Business Strategy', to: '/services/strategy-consulting' },
  { label: 'Financial Advisory', to: '/services/financial-advisory' },
  { label: 'Market Research', to: '/services/marketing-strategy' },
  { label: 'Risk Management', to: '/services/risk-management' },
  { label: 'IT Consulting', to: '/services/digital-transformation' },
  { label: 'Operations Consulting', to: '/services/digital-transformation' },
];

const companyLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Leadership', to: '/team' },
  { label: 'News & Insights', to: '/news' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms & Conditions', to: '/terms' },
];

const socialLinks = [
  { icon: FaLinkedin, href: 'https://www.linkedin.com/company/consultpro', label: 'LinkedIn' },
  { icon: FaFacebookF, href: 'https://www.facebook.com/consultpro', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://www.instagram.com/consultpro', label: 'Instagram' },
  { icon: FaXTwitter, href: 'https://x.com/consultpro', label: 'X / Twitter' },
];

const contactInfo = [
  { icon: HiMapPin, text: 'Vehari, Punjab, Pakistan' },
  { icon: HiPhone, text: '+92 3147566191' },
  { icon: HiEnvelope, text: 'eshajaved191@gmail.com' },
  { icon: HiClock, text: 'Mon – Fri: 8:00 AM – 6:00 PM' },
];

/* ── Component ── */

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterMsg('Please enter a valid email address.');
      return;
    }
    setNewsletterLoading(true);
    setNewsletterMsg('');
    try {
      const res = await subscribeNewsletter(newsletterEmail);
      setNewsletterMsg(res.message || 'Subscribed successfully!');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterMsg(err.message || 'Subscription failed. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* ===================== Main Grid ===================== */}
        <div className="row footer-grid gy-5 gy-lg-0">
          {/* ---- Column 1: Brand + Social + Newsletter ---- */}
          <div className="col-lg-3">
            <div className="footer-brand">
              {/* Premium Logo Mark */}
              <svg
                className="footer-logo-svg"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                <rect width="40" height="40" rx="8" fill="#3B82F6" />
                <path
                  d="M20 8l12 8v8L20 32 8 24V16l12-8z"
                  fill="#0B2447"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <circle cx="20" cy="20" r="4" fill="white" />
              </svg>

              <div>
                <h3 className="footer-company-name">ConsultPro</h3>
                <span className="footer-tagline">Your Partner in Growth</span>
              </div>
            </div>

            <p className="footer-description">
              We empower businesses worldwide with data-driven strategies,
              innovative solutions, and unmatched industry expertise to
              accelerate growth and deliver measurable results.
            </p>

            {/* Newsletter Signup */}
            <div className="footer-newsletter">
              <h4 className="footer-heading">Stay Updated</h4>
              <p className="footer-newsletter-text">Get the latest insights and trends delivered to your inbox.</p>
              <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => { setNewsletterEmail(e.target.value); setNewsletterMsg(''); }}
                  className="footer-newsletter-input"
                  required
                />
                <button type="submit" className="footer-newsletter-btn" disabled={newsletterLoading}>
                  {newsletterLoading ? '...' : '→'}
                </button>
              </form>
              {newsletterMsg && (
                <p className={`footer-newsletter-msg ${newsletterMsg.includes('fail') || newsletterMsg.includes('valid') ? 'error' : 'success'}`}>
                  {newsletterMsg}
                </p>
              )}
            </div>

            {/* Social Icons */}
            <div className="footer-socials">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="footer-social-link"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ---- Column 2: Quick Links ---- */}
          <div className="col-lg">
            <div className="footer-column">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                {quickLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="footer-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---- Column 3: Services ---- */}
          <div className="col-lg">
            <div className="footer-column">
              <h4 className="footer-heading">Services</h4>
<ul className="footer-links">
                {servicesLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="footer-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---- Column 4: Company ---- */}
          <div className="col-lg">
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                {companyLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="footer-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---- Column 5: Contact Info ---- */}
          <div className="col-lg-3">
            <div className="footer-column">
              <h4 className="footer-heading">Contact Us</h4>
              <ul className="footer-contact-list">
                {contactInfo.map(({ icon: Icon, text }, idx) => (
                  <li key={idx} className="footer-contact-item">
                    <span className="footer-contact-icon">
                      <Icon />
                    </span>
                    <span className="footer-contact-text">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ===================== Divider ===================== */}
        <hr className="footer-divider" />

        {/* ===================== Bottom Bar ===================== */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; 2026 ConsultPro. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

