import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <section className="nf-page">
        <motion.div
          className="nf-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="nf-code">404</span>
          <h1 className="nf-title">Page Not Found</h1>
          <p className="nf-desc">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
          <div className="nf-actions">
            <Link to="/" className="cta-btn">← Back to Home</Link>
            <Link to="/contact" className="nf-link">Contact Us</Link>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}

