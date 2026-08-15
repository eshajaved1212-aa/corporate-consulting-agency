import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { newsArticles } from '../data/news';
import './NewsDetail.css';

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const found = newsArticles.find((a) => a.id === id) || null;
    setArticle(found);
  }, [id]);

  if (!article) {
    return (
      <>
        <Navbar />
        <section className="nd-not-found">
          <div className="nd-container">
            <h2>Article not found</h2>
            <p>The news article you're looking for doesn't exist or has been moved.</p>
            <Link to="/news" className="nd-back-link">← Back to News & Insights</Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const related = newsArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="nd-hero">
        <div className="nd-hero-bg">
          <img src={article.image} alt={article.title} />
          <div className="nd-hero-overlay" />
        </div>
        <motion.div
          className="nd-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Link to="/news" className="nd-back-link">← Back to News & Insights</Link>
          {article.category && <span className="nd-category">{article.category}</span>}
          <h1 className="nd-title">{article.title}</h1>
          <div className="nd-meta">
            <span>{article.date}</span>
            <span className="nd-dot">·</span>
            <span>{article.readTime}</span>
          </div>
        </motion.div>
      </section>

      {/* ── Content ── */}
      <section className="nd-section">
        <div className="nd-container">
          <motion.div
            className="nd-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="nd-lead">{article.content}</p>

            {article.sections.map((sec, i) => (
              <motion.div
                key={sec.heading}
                className="nd-section-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <h2>{sec.heading}</h2>
                <p>{sec.body}</p>
              </motion.div>
            ))}

            {/* ── Share ── */}
            <div className="nd-footer">
              <span>Share this article:</span>
              <div className="nd-share">
                {['LinkedIn', 'Twitter', 'Facebook'].map((s) => (
                  <a key={s} href="#" className="nd-share-btn">{s}</a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Related articles ── */}
      <section className="nd-related">
        <div className="nd-container">
          <motion.div
            className="nd-related-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <span className="nd-eyebrow">Keep Reading</span>
            <h2>More News &amp; Insights</h2>
          </motion.div>

          <div className="nd-related-grid">
            {related.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link to={`/news/${a.id}`} className="nd-related-card">
                  <div className="nd-related-img">
                    <img src={a.image} alt={a.title} />
                    <div className="nd-related-overlay" />
                    <span className="nd-related-category">{a.category}</span>
                  </div>
                  <div className="nd-related-body">
                    <div className="nd-related-meta">
                      <span>{a.date}</span>
                      <span>{a.readTime}</span>
                    </div>
                    <h3>{a.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="nd-cta">
        <motion.div
          className="nd-cta-inner"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Want to learn more?</h2>
          <p>Our consultants can help you apply these insights to your business context.</p>
          <Link to="/contact" className="nd-cta-btn">Talk to an Expert →</Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
