import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchBlogPost } from '../api';
import eshaPhoto from '../assets/my-photo.jpg';
import './BlogDetail.css';

const fallbackPost = {
  _id: '1',
  title: '5 Strategic Trends Shaping Business in 2025',
  slug: 'strategic-trends-2025',
  excerpt: 'From AI-driven decision-making to sustainable business models.',
  content: `
    <h2>The Future of Business Strategy</h2>
    <p>The business landscape is evolving faster than ever. Companies that fail to adapt risk being left behind. In this post, we explore the key trends that are reshaping industries worldwide.</p>
    <h3>1. AI-Powered Decision Making</h3>
    <p>Artificial intelligence is no longer a futuristic concept — it's a business imperative. From predictive analytics to automated reporting, AI is helping leaders make faster, more informed decisions.</p>
    <h3>2. Sustainable Business Models</h3>
    <p>Consumers and investors alike are demanding sustainability. Companies that integrate ESG principles into their core strategy are seeing stronger brand loyalty and better long-term performance.</p>
    <h3>3. Remote-First Operations</h3>
    <p>The pandemic permanently shifted how we work. Organizations that embrace flexible, remote-first models are accessing broader talent pools and reducing overhead costs.</p>
    <h3>4. Data-Driven Customer Experience</h3>
    <p>Personalization at scale is the new competitive advantage. Companies leveraging customer data to tailor experiences are seeing higher retention and lifetime value.</p>
    <h3>5. Agile Strategy Execution</h3>
    <p>Traditional annual planning cycles are giving way to agile, quarterly strategy reviews. This allows businesses to pivot quickly in response to market changes.</p>
    <p>At ConsultPro, we help organizations navigate these trends with confidence. <a href="/contact">Contact us</a> to learn how we can support your strategic journey.</p>
  `,
  author: 'Esha Javed',
  authorAvatar: eshaPhoto,
  coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
  category: 'Strategy',
  readTime: 6,
  createdAt: new Date().toISOString(),
};

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchBlogPost(slug)
      .then(res => setPost(res.data))
      .catch(() => setPost(fallbackPost))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bd-loading">
          <div className="bd-skeleton-hero" />
          <div className="bd-container">
            <div className="bd-skeleton-content">
              <div className="bd-skeleton-line bd-skeleton-line--short" />
              <div className="bd-skeleton-line" />
              <div className="bd-skeleton-line" />
              <div className="bd-skeleton-line bd-skeleton-line--medium" />
              <div className="bd-skeleton-line" />
              <div className="bd-skeleton-line" />
              <div className="bd-skeleton-line bd-skeleton-line--long" />
              <div className="bd-skeleton-line bd-skeleton-line--short" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="bd-not-found">
          <h2>Post not found</h2>
          <Link to="/blog" className="bd-back-link">← Back to Blog</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="bd-hero">
        <div className="bd-hero-bg">
          <img src={post.coverImage} alt={post.title} />
          <div className="bd-hero-overlay" />
        </div>
        <motion.div
          className="bd-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Link to="/blog" className="bd-back-link">← Back to Blog</Link>
          {post.category && <span className="bd-category">{post.category}</span>}
          <h1 className="bd-title">{post.title}</h1>
          <div className="bd-meta">
            <div className="bd-author">
              {post.authorAvatar && <img src={post.authorAvatar} alt={post.author} />}
              <span>{post.author}</span>
            </div>
            <span className="bd-dot">·</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}</span>
            <span className="bd-dot">·</span>
            <span>{post.readTime || 5} min read</span>
          </div>
        </motion.div>
      </section>

      {/* ── Content ── */}
      <section className="bd-section">
        <div className="bd-container">
          <motion.div
            className="bd-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ── Share / Tags ── */}
          <div className="bd-footer">
            <div className="bd-tags">
              {post.tags && post.tags.map(tag => (
                <span key={tag} className="bd-tag">{tag}</span>
              ))}
            </div>
            <div className="bd-share">
              <span>Share:</span>
              {['LinkedIn', 'Twitter', 'Facebook'].map(s => (
                <a key={s} href="#" className="bd-share-btn">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bd-cta">
        <motion.div
          className="bd-cta-inner"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Want to dive deeper?</h2>
          <p>Our consultants can help you apply these insights to your specific business context.</p>
          <Link to="/contact" className="bd-cta-btn">Talk to an Expert →</Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}

