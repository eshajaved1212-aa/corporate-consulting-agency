import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { newsArticles as articles, newsCategories as categories } from '../data/news';
import './NewsPage.css';

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="np-hero">
        <div className="np-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168d2c?w=1920&q=85"
            alt=""
            aria-hidden="true"
          />
          <div className="np-hero-overlay" />
        </div>
        <motion.div
          className="np-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="np-eyebrow">Stay Informed</span>
          <h1 className="np-hero-title">
            News & <span className="np-gold">Insights</span>
          </h1>
          <p className="np-hero-sub">
            The latest company announcements, achievements, and expert perspectives
            from the world of business consulting.
          </p>
        </motion.div>
      </section>

      {/* ── Category filter ── */}
      <div className="np-categories-bar">
        <div className="np-categories-inner">
          {categories.map(cat => (
            <button
              key={cat}
              className={`np-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── News grid ── */}
      <section className="np-section">
        <div className="np-container">
          {filtered.length === 0 ? (
            <div className="np-empty">
              <h3>No items found</h3>
              <p>Check back soon for new news and insights in this category.</p>
            </div>
          ) : (
            <div className="np-grid">
              {filtered.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: i * 0.07 }}
                >
<Link to={`/news/${article.id}`} className="np-card">
                    <div className="np-card-img">
                      <img src={article.image} alt={article.title} />
                      <div className="np-card-img-overlay" />
                      <span className="np-card-category">{article.category}</span>
                    </div>
                    <div className="np-card-body">
                      <div className="np-card-meta">
                        <span>{article.date}</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="np-card-title">{article.title}</h3>
                      <p className="np-card-excerpt">{article.excerpt}</p>
                      <span className="np-card-link">
                        Read More <span className="np-card-arrow">→</span>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="np-cta-section">
        <div className="np-cta-bg">
          <img
            src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1600&q=80"
            alt=""
          />
          <div className="np-cta-overlay" />
        </div>
        <motion.div
          className="np-cta-content"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65 }}
        >
          <h2>Never Miss an Update</h2>
          <p>Get our latest news, insights, and industry trends delivered straight to your inbox.</p>
          <Link to="/contact" className="np-cta-btn">Subscribe to Our Newsletter →</Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
