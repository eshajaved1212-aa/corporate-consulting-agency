import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './StaticPages.css';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <section className="sp-hero">
        <div className="sp-hero-bg">
          <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=85" alt="" aria-hidden="true" />
          <div className="sp-hero-overlay" />
        </div>
        <motion.div className="sp-hero-content" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="sp-eyebrow">Legal</span>
          <h1 className="sp-hero-title">Terms & <span className="sp-gold">Conditions</span></h1>
          <p className="sp-hero-sub">Last updated: January 1, 2025</p>
        </motion.div>
      </section>

      <section className="sp-content-section">
        <div className="sp-content-container sp-content-narrow">
          <div className="sp-legal-content">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using the ConsultPro website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.</p>

            <h2>2. Services Description</h2>
            <p>ConsultPro provides management consulting services including but not limited to strategy consulting, financial advisory, digital transformation, HR consulting, marketing strategy, and risk management. The specific scope of services will be defined in a separate engagement agreement.</p>

            <h2>3. Intellectual Property</h2>
            <p>All content on this website — including text, graphics, logos, images, and software — is the property of ConsultPro and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.</p>

            <h2>4. Confidentiality</h2>
            <p>Both parties agree to maintain the confidentiality of all proprietary information shared during the course of an engagement. Confidentiality obligations survive the termination of any engagement agreement.</p>

            <h2>5. Limitation of Liability</h2>
            <p>ConsultPro shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability is limited to the fees paid for the specific engagement giving rise to the claim.</p>

            <h2>6. Client Responsibilities</h2>
            <p>Clients agree to:</p>
            <ul>
              <li>Provide accurate and timely information necessary for the engagement</li>
              <li>Make key personnel available for meetings and collaboration</li>
              <li>Provide access to relevant systems and data (subject to security protocols)</li>
              <li>Pay fees in accordance with the agreed payment schedule</li>
            </ul>

            <h2>7. Payment Terms</h2>
            <p>Fees are outlined in the engagement agreement. Invoices are due within 30 days of receipt. Late payments may incur interest at a rate of 1.5% per month. All fees are non-refundable unless otherwise specified in the engagement agreement.</p>

            <h2>8. Termination</h2>
            <p>Either party may terminate an engagement with 14 days' written notice. Upon termination, the client shall pay for all services rendered up to the effective date of termination. Sections on confidentiality, intellectual property, and limitation of liability survive termination.</p>

            <h2>9. Independent Contractor</h2>
            <p>ConsultPro operates as an independent contractor, not as an employee, joint venture partner, or agent of the client. We are responsible for the management and direction of our own personnel.</p>

            <h2>10. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of New York County.</p>

            <h2>11. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of our services after changes constitutes acceptance of the new terms.</p>

            <h2>12. Contact</h2>
            <p>For questions about these terms, please contact us at:</p>
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
