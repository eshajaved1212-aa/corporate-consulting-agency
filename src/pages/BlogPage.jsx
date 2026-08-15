import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchBlogPosts } from '../api';
import eshaPhoto from '../assets/my-photo.jpg';
import waseemPhoto from '../assets/waseem .jpg';
import haseebPhoto from '../assets/haseeb.jpg';
import samiPhoto from '../assets/sami.jpg';
import './BlogPage.css';

const fallbackPosts = [
  {
    _id: '1',
    title: '5 Strategic Trends Shaping Business in 2025',
    slug: 'strategic-trends-2025',
    excerpt: 'From AI-driven decision-making to sustainable business models — discover the key trends that will define corporate strategy this year.',
    author: 'Esha Javed',
    authorAvatar: eshaPhoto,
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    category: 'Strategy',
    readTime: 6,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'How Digital Transformation Drives Operational Efficiency',
    slug: 'digital-transformation-efficiency',
    excerpt: 'Learn how companies are leveraging automation, cloud infrastructure, and AI to streamline operations and reduce costs.',
    author: 'Waseem Manzoor',
    authorAvatar: waseemPhoto,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    category: 'Technology',
    readTime: 8,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    title: 'The CFO\'s Guide to Risk Management in Uncertain Markets',
    slug: 'cfo-guide-risk-management',
    excerpt: 'A practical framework for identifying, assessing, and mitigating financial risks in today\'s volatile economic landscape.',
    author: 'Abdul Haseeb',
    authorAvatar: haseebPhoto,
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    category: 'Finance',
    readTime: 7,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '4',
    title: 'Building a High-Performance Culture: Lessons from Top CEOs',
    slug: 'building-high-performance-culture',
    excerpt: 'What separates high-performing teams from the rest? Insights from leaders who have built award-winning cultures.',
    author: 'Abdul Sami',
    authorAvatar: samiPhoto,
    coverImage: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&q=80',
    category: 'Leadership',
    readTime: 5,
    createdAt: new Date().toISOString(),
  },
];

const categories = ['All', 'Strategy', 'Technology', 'Finance', 'Leadership', 'Operations'];

export default function BlogPage() {
  const [posts, setPosts] = useState(fallbackPosts);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const params = activeCategory !== 'All' ? { category: activeCategory } : {};
    fetchBlogPosts(params)
      .then(res => setPosts(res.data))
      .catch(() => setPosts(fallbackPosts))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="bp-hero">
        <div className="bp-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168d2c?w=1920&q=85"
            alt=""
            aria-hidden="true"
          />
          <div className="bp-hero-overlay" />
        </div>
        <motion.div
          className="bp-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Link to="/" className="bp-back">← Back to Home</Link>
          <span className="bp-eyebrow">News & Insights</span>
          <h1 className="bp-hero-title">
            Our <span className="bp-gold">Blog</span>
          </h1>
          <p className="bp-hero-sub">
            Expert insights, industry trends, and practical advice to help your business stay ahead of the curve.
          </p>
        </motion.div>
      </section>

      {/* ── Category filter ── */}
      <div className="bp-categories-bar">
        <div className="bp-categories-inner">
          {categories.map(cat => (
            <button
              key={cat}
              className={`bp-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Blog grid ── */}
      <section className="bp-section">
        <div className="bp-container">
          {loading ? (
            <div className="bp-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bp-skeleton" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bp-empty">
              <h3>No posts found</h3>
              <p>Check back soon for new articles in this category.</p>
            </div>
          ) : (
            <div className="bp-grid">
              {filtered.map((post, i) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: i * 0.07 }}
                >
                  <Link to={`/blog/${post.slug}`} className="bp-card">
                    <div className="bp-card-img">
                      <img
                        src={post.coverImage || 'https://images.unsplash.com/photo-1504711434969-e33886168d2c?w=600&q=80'}
                        alt={post.title}
                      />
                      <div className="bp-card-img-overlay" />
                      {post.category && (
                        <span className="bp-card-category">{post.category}</span>
                      )}
                    </div>
                    <div className="bp-card-body">
                      <div className="bp-card-meta">
                        <span className="bp-card-date">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </span>
                        <span className="bp-card-read">{post.readTime || 5} min read</span>
                      </div>
                      <h3 className="bp-card-title">{post.title}</h3>
                      <p className="bp-card-excerpt">{post.excerpt}</p>
                      <div className="bp-card-footer">
                        <div className="bp-card-author">
                          {post.authorAvatar && (
                            <img src={post.authorAvatar} alt={post.author} className="bp-author-avatar" />
                          )}
                          <span>{post.author}</span>
                        </div>
                        <span className="bp-card-arrow">→</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="bp-cta-section">
        <div className="bp-cta-bg">
          <img src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1600&q=80" alt="" />
          <div className="bp-cta-overlay" />
        </div>
        <motion.div
          className="bp-cta-content"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65 }}
        >
          <h2>Stay Ahead of the Curve</h2>
          <p>Get the latest insights and trends delivered straight to your inbox.</p>
          <Link to="/#contact" className="bp-cta-btn">Subscribe to Our Newsletter →</Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}

