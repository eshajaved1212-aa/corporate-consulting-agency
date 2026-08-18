import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './StaticPages.css';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <section className="sp-hero">
        <div className="sp-hero-bg">
          <img src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1920&q=85" alt="" aria-hidden="true" />
          <div className="sp-hero-overlay" />
        </div>
        <motion.div className="sp-hero-content" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="sp-eyebrow">Legal</span>
          <h1 className="sp-hero-title">Privacy <span className="sp-gold">Policy</span></h1>
          <p className="sp-hero-sub">Last updated: January 1, 2025</p>
        </motion.div>
      </section>

      <section className="sp-content-section">
        <div className="sp-content-container sp-content-narrow">
          <div className="sp-legal-content">
            <h2>1. Introduction</h2>
            <p>ConsultPro ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>

            <h2>2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, phone number, company name, and job title when you fill out our contact form or inquire about services.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and referring URLs.</li>
              <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your browsing experience and analyze site traffic.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>To respond to your inquiries and provide consulting services</li>
              <li>To send periodic emails regarding our services, insights, and industry updates (with your consent)</li>
              <li>To improve our website and service offerings</li>
              <li>To comply with legal obligations and protect our rights</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
            <ul>
              <li>Trusted service providers who assist us in operating our website and business, subject to confidentiality agreements</li>
              <li>Law enforcement or regulatory authorities when required by law</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>We implement industry-standard security measures including encryption, access controls, and secure server infrastructure to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>

            <h2>6. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
             <p>To exercise these rights, please contact us at <a href="mailto:eshajaved191@gmail.com">eshajaved191@gmail.com</a>.</p>

            <h2>7. Cookies</h2>
            <p>We use cookies to improve your experience on our website. You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of our website.</p>

            <h2>8. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.</p>

            <h2>9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.</p>

            <h2>10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>
              <strong>ConsultPro</strong><br />
              200 Park Avenue, Suite 1500<br />
              New York, NY 10166, USA<br />
               Email: <a href="mailto:eshajaved191@gmail.com">eshajaved191@gmail.com</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
