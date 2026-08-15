import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api, { setUnauthorizedHandler } from '../api';
import './Admin.css';

const ADMIN_TOKEN_KEY = 'consultpro_admin_token';

/* ── Use the shared Axios client for admin calls ── */
async function adminFetch(url, options = {}) {
  // options.method defaults to GET; options.body is a string → parse to object
  const method = options.method || 'GET';
  const data = options.body ? JSON.parse(options.body) : undefined;
  // The axios instance already has baseURL ending in /api — strip the /api prefix
  const cleanUrl = url.startsWith('/api') ? url.replace(/^\/api/, '') : url;
  return api({ url: cleanUrl, method, data });
}

/* ── Formatting ── */
const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/* ── Empty form for blog creation ── */
const emptyBlogForm = {
  title: '',
  excerpt: '',
  content: '',
  author: '',
  authorAvatar: '',
  coverImage: '',
  category: 'General',
  tags: '',
  status: 'published',
  readTime: 5,
};

/* ── Empty form for service creation ── */
const emptyServiceForm = {
  id: '',
  icon: '',
  img: '',
  title: '',
  short: '',
  description: '',
  pointsInput: '',
};

/* ── Empty form for portfolio creation ── */
const emptyPortfolioForm = {
  id: '',
  title: '',
  client: '',
  category: '',
  image: '',
  thumbnail: '',
  description: '',
  resultsInput: '',
  challenge: '',
  solution: '',
  timeline: '',
  testimonial: '',
  testimonialAuthor: '',
  results_img: '',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [summary, setSummary] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [serviceFormMode, setServiceFormMode] = useState('create');
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [serviceFormLoading, setServiceFormLoading] = useState(false);
  const [serviceFormError, setServiceFormError] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogForm, setBlogForm] = useState(emptyBlogForm);
  const [blogFormMode, setBlogFormMode] = useState('create'); // 'create' | 'edit'
  const [blogFormOpen, setBlogFormOpen] = useState(false);
  const [blogFormLoading, setBlogFormLoading] = useState(false);
  const [blogFormError, setBlogFormError] = useState('');
  const [portfolioEntries, setPortfolioEntries] = useState([]);
  const [portfolioForm, setPortfolioForm] = useState(emptyPortfolioForm);
  const [portfolioFormMode, setPortfolioFormMode] = useState('create');
  const [portfolioFormOpen, setPortfolioFormOpen] = useState(false);
  const [portfolioFormLoading, setPortfolioFormLoading] = useState(false);
  const [portfolioFormError, setPortfolioFormError] = useState('');
const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyTarget, setReplyTarget] = useState(null); // inquiry being replied to
  const [replyMessage, setReplyMessage] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyError, setReplyError] = useState('');
const [replySuccess, setReplySuccess] = useState('');
  const [contactReplyTarget, setContactReplyTarget] = useState(null); // contact being replied to
  const [contactReplyMessage, setContactReplyMessage] = useState('');
  const [contactReplySending, setContactReplySending] = useState(false);
  const [contactReplyError, setContactReplyError] = useState('');
  const [contactReplySuccess, setContactReplySuccess] = useState('');

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      navigate('/admin');
      return false;
    }
    return true;
  }, [navigate]);

  const fetchSummary = useCallback(async () => {
    try {
      const data = await adminFetch('/api/admin/summary');
      setSummary(data.data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      const data = await adminFetch('/api/admin/contacts?limit=50');
      setContacts(data.data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchSubscribers = useCallback(async () => {
    try {
      const data = await adminFetch('/api/admin/newsletter');
      setSubscribers(data.data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchInquiries = useCallback(async () => {
    try {
      const data = await adminFetch('/api/admin/inquiries');
      setInquiries(data.data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const data = await adminFetch('/api/admin/services');
      setServices(data.data || []);
    } catch (err) {
      // silent fail
    }
  }, []);

const fetchBlogPosts = useCallback(async () => {
    try {
      const data = await adminFetch('/api/blog');
      setBlogPosts(data.data || []);
    } catch (err) {
      // silent fail — blog may not be set up yet
    }
  }, []);

  const fetchPortfolioEntries = useCallback(async () => {
    try {
      const data = await adminFetch('/api/admin/portfolio');
      setPortfolioEntries(data.data || []);
    } catch (err) {
      // silent fail
    }
  }, []);

  // Redirect to /admin when the API returns 401 (expired/invalid JWT)
  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      navigate('/admin');
    });
    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  useEffect(() => {
    if (!checkAuth()) return;
    setLoading(true);
    Promise.all([fetchSummary(), fetchContacts(), fetchSubscribers(), fetchInquiries(), fetchServices(), fetchBlogPosts(), fetchPortfolioEntries()])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [checkAuth, fetchSummary, fetchContacts, fetchSubscribers, fetchInquiries, fetchServices, fetchBlogPosts, fetchPortfolioEntries]);

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate('/admin');
  };

  const handleDeleteContact = async (id) => {
    if (!confirm('Delete this contact entry?')) return;
    try {
      await adminFetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      setContacts(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateInquiryStatus = async (id, status) => {
    try {
      await adminFetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setInquiries(prev => prev.map(i => i._id === id ? { ...i, status } : i));
    } catch (err) {
      alert(err.message);
    }
  };

/* ── Inquiry reply handlers ── */
  const openReplyModal = (inquiry) => {
    setReplyTarget(inquiry);
    setReplyMessage('');
    setReplyError('');
    setReplySuccess('');
  };

  const closeReplyModal = () => {
    setReplyTarget(null);
    setReplyMessage('');
    setReplyError('');
    setReplySuccess('');
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      setReplyError('Please enter a reply message.');
      return;
    }
    setReplySending(true);
    setReplyError('');
    setReplySuccess('');
    try {
      await adminFetch(`/api/admin/inquiries/${replyTarget._id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ replyMessage: replyMessage.trim() }),
      });
      setReplySuccess('Reply sent successfully to ' + replyTarget.email + '. Status set to In Review.');
      // Update inquiry status to in-review in local state
      setInquiries(prev => prev.map(i => i._id === replyTarget._id ? { ...i, status: 'in-review' } : i));
      setTimeout(closeReplyModal, 1600);
    } catch (err) {
      setReplyError(err.message);
    } finally {
      setReplySending(false);
    }
  };

/* ── Contact reply handlers ── */
  const openContactReplyModal = (contact) => {
    setContactReplyTarget(contact);
    setContactReplyMessage('');
    setContactReplyError('');
    setContactReplySuccess('');
  };

  const closeContactReplyModal = () => {
    setContactReplyTarget(null);
    setContactReplyMessage('');
    setContactReplyError('');
    setContactReplySuccess('');
  };

  const handleSendContactReply = async (e) => {
    e.preventDefault();
    if (!contactReplyMessage.trim()) {
      setContactReplyError('Please enter a reply message.');
      return;
    }
    setContactReplySending(true);
    setContactReplyError('');
    setContactReplySuccess('');
    try {
      await adminFetch(`/api/admin/contacts/${contactReplyTarget._id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ replyMessage: contactReplyMessage.trim() }),
      });
      setContactReplySuccess('Reply sent successfully to ' + contactReplyTarget.email + '.');
      setTimeout(closeContactReplyModal, 1600);
    } catch (err) {
      setContactReplyError(err.message);
    } finally {
      setContactReplySending(false);
    }
  };

  /* ── Blog handlers ── */
  const openBlogForm = (post = null) => {
    if (post) {
      setBlogForm({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        author: post.author || '',
        authorAvatar: post.authorAvatar || '',
        coverImage: post.coverImage || '',
        category: post.category || 'General',
        tags: (post.tags || []).join(', '),
        status: post.status || 'published',
        readTime: post.readTime || 5,
      });
      setBlogFormMode('edit');
    } else {
      setBlogForm(emptyBlogForm);
      setBlogFormMode('create');
    }
    setBlogFormOpen(true);
    setBlogFormError('');
  };

  const handleBlogFormChange = (e) => {
    setBlogFormError('');
    setBlogForm({ ...blogForm, [e.target.name]: e.target.value });
  };

  const handleBlogFormSubmit = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content || !blogForm.author) {
      setBlogFormError('Title, excerpt, content, and author are required.');
      return;
    }
    setBlogFormLoading(true);
    setBlogFormError('');
    try {
      const payload = {
        ...blogForm,
        tags: blogForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        readTime: parseInt(blogForm.readTime) || 5,
      };

      if (blogFormMode === 'create') {
        await adminFetch('/api/blog', { method: 'POST', body: JSON.stringify(payload) });
      } else {
        // Find the editing post by matching title in form state — store editing ID
        const editingPost = blogPosts.find(p => p.title === blogForm.title && p.author === blogForm.author);
        if (editingPost && editingPost._id) {
          await adminFetch(`/api/blog/${editingPost._id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        } else {
          // Fallback: try to find by slug or just create
          await adminFetch('/api/blog', { method: 'POST', body: JSON.stringify(payload) });
        }
      }
      setBlogFormOpen(false);
      setBlogForm(emptyBlogForm);
      // Refresh blog list
      const data = await adminFetch('/api/blog');
      setBlogPosts(data.data || []);
    } catch (err) {
      setBlogFormError(err.message);
    } finally {
      setBlogFormLoading(false);
    }
  };

  const handleDeleteBlogPost = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await adminFetch(`/api/blog/${id}`, { method: 'DELETE' });
      setBlogPosts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  /* ── Portfolio handlers ── */
  const openPortfolioForm = (entry = null) => {
    if (entry) {
      setPortfolioForm({
        id: entry.id || '',
        title: entry.title || '',
        client: entry.client || '',
        category: entry.category || '',
        image: entry.image || '',
        thumbnail: entry.thumbnail || '',
        description: entry.description || '',
        resultsInput: (entry.results || []).join('\n'),
        challenge: entry.challenge || '',
        solution: entry.solution || '',
        timeline: entry.timeline || '',
        testimonial: entry.testimonial || '',
        testimonialAuthor: entry.testimonialAuthor || '',
        results_img: entry.results_img || '',
      });
      setPortfolioFormMode('edit');
    } else {
      setPortfolioForm(emptyPortfolioForm);
      setPortfolioFormMode('create');
    }
    setPortfolioFormOpen(true);
    setPortfolioFormError('');
  };

  const handlePortfolioFormChange = (e) => {
    setPortfolioFormError('');
    setPortfolioForm({ ...portfolioForm, [e.target.name]: e.target.value });
  };

  const handlePortfolioFormSubmit = async (e) => {
    e.preventDefault();
    if (!portfolioForm.id || !portfolioForm.title || !portfolioForm.client || !portfolioForm.category || !portfolioForm.description) {
      setPortfolioFormError('ID, title, client, category, and description are required.');
      return;
    }
    setPortfolioFormLoading(true);
    setPortfolioFormError('');
    try {
      const results = portfolioForm.resultsInput
        ? portfolioForm.resultsInput.split('\n').map(r => r.trim()).filter(Boolean)
        : [];

      const payload = {
        id: portfolioForm.id,
        title: portfolioForm.title,
        client: portfolioForm.client,
        category: portfolioForm.category,
        image: portfolioForm.image,
        thumbnail: portfolioForm.thumbnail,
        description: portfolioForm.description,
        results,
        challenge: portfolioForm.challenge,
        solution: portfolioForm.solution,
        timeline: portfolioForm.timeline,
        testimonial: portfolioForm.testimonial,
        testimonialAuthor: portfolioForm.testimonialAuthor,
        results_img: portfolioForm.results_img,
      };

      if (portfolioFormMode === 'create') {
        await adminFetch('/api/admin/portfolio', { method: 'POST', body: JSON.stringify(payload) });
      } else {
        await adminFetch(`/api/admin/portfolio/${portfolioForm.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      }

      setPortfolioFormOpen(false);
      setPortfolioForm(emptyPortfolioForm);
      // Refresh portfolio list
      const data = await adminFetch('/api/admin/portfolio');
      setPortfolioEntries(data.data || []);
    } catch (err) {
      setPortfolioFormError(err.message);
    } finally {
      setPortfolioFormLoading(false);
    }
  };

  const handleDeletePortfolioEntry = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await adminFetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
      setPortfolioEntries(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const statCards = summary ? [
    { label: 'Contact Submissions', value: summary.contacts, color: '#3B82F6' },
    { label: 'Active Subscribers', value: summary.activeSubscribers, color: '#10B981' },
    { label: 'Service Inquiries', value: summary.serviceInquiries, color: '#F59E0B' },
  ] : [];

  if (!checkAuth()) return null;

  return (
    <div className="admin-dashboard-page">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <svg viewBox="0 0 40 40" fill="none" className="admin-logo-svg">
            <rect width="40" height="40" rx="8" fill="#3B82F6" />
            <path d="M20 8l12 8v8L20 32 8 24V16l12-8z" fill="#0B2447" stroke="#fff" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="4" fill="white" />
          </svg>
          <span>ConsultPro Admin</span>
        </div>

        <nav className="admin-sidebar-nav">
{[
            { key: 'dashboard', label: 'Dashboard', icon: '📊' },
            { key: 'contacts', label: 'Contacts', icon: '✉️' },
            { key: 'newsletter', label: 'Newsletter', icon: '📧' },
            { key: 'inquiries', label: 'Inquiries', icon: '📋' },
            { key: 'services', label: 'Services', icon: '⚙️' },
            { key: 'portfolio', label: 'Portfolio', icon: '📁' },
            { key: 'blog', label: 'Blog', icon: '📝' },
          ].map(item => (
            <button
              key={item.key}
              className={`admin-nav-btn ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">🚪 Logout</button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="admin-main">
        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : error ? (
          <div className="admin-error-banner">{error}</div>
        ) : (
          <>
            {/* ── Dashboard Tab ── */}
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="admin-page-title">Dashboard Overview</h1>
                <div className="admin-stats-grid">
                  {statCards.map((card, i) => (
                    <motion.div
                      key={card.label}
                      className="admin-stat-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className="admin-stat-value" style={{ color: card.color }}>
                        {card.value}
                      </div>
                      <div className="admin-stat-label">{card.label}</div>
                    </motion.div>
                  ))}
                </div>

<div className="admin-quick-links">
                  <h2>Quick Actions</h2>
                  <div className="admin-quick-grid">
                    <button onClick={() => setActiveTab('contacts')} className="admin-quick-btn">
                      View Contact Submissions
                    </button>
                    <button onClick={() => setActiveTab('newsletter')} className="admin-quick-btn">
                      Manage Newsletter
                    </button>
                    <button onClick={() => setActiveTab('inquiries')} className="admin-quick-btn">
                      Review Service Inquiries
                    </button>
                  </div>
                </div>

                {/* ── Recent Contact Submissions (Admin Review) ── */}
                <div className="admin-recent-section">
                  <div className="admin-recent-header">
                    <h2>Recent Contact Submissions</h2>
                    <button className="admin-view-all-btn" onClick={() => setActiveTab('contacts')}>
                      View All →
                    </button>
                  </div>
                  {contacts.length === 0 ? (
                    <p className="admin-empty">No contact submissions yet.</p>
                  ) : (
                    <div className="admin-recent-list">
                      {contacts.slice(0, 5).map(c => (
                        <div key={c._id} className="admin-recent-item">
                          <div className="admin-recent-avatar">
                            {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="admin-recent-body">
                            <div className="admin-recent-top">
                              <strong>{c.name}</strong>
                              <span className="admin-recent-date">{formatDate(c.createdAt)}</span>
                            </div>
                            <a href={`mailto:${c.email}`} className="admin-recent-email">{c.email}</a>
                            <p className="admin-recent-msg">
                              {c.message.length > 90 ? c.message.substring(0, 90) + '…' : c.message}
                            </p>
                          </div>
                          <button
                            className="admin-recent-reply"
                            onClick={() => { setActiveTab('contacts'); openContactReplyModal(c); }}
                          >
                            Reply
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Contacts Tab ── */}
            {activeTab === 'contacts' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="admin-tab-header">
                  <h1 className="admin-page-title">Contact Submissions ({contacts.length})</h1>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Service</th>
                        <th>Message</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map(c => (
                        <tr key={c._id}>
                          <td>{formatDate(c.createdAt)}</td>
                          <td>{c.name}</td>
                          <td><a href={`mailto:${c.email}`}>{c.email}</a></td>
                          <td>{c.company || '-'}</td>
                          <td>{c.service || '-'}</td>
<td className="admin-msg-cell">{c.message.substring(0, 60)}{c.message.length > 60 ? '...' : ''}</td>
                          <td>
                            <div className="admin-action-btns">
                              <button className="admin-edit-btn" onClick={() => openContactReplyModal(c)}>Reply</button>
                              <button className="admin-del-btn" onClick={() => handleDeleteContact(c._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {contacts.length === 0 && (
                        <tr><td colSpan="7" className="admin-empty">No contacts yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {contactReplyTarget && (
                  <div className="admin-modal-backdrop" onClick={closeContactReplyModal}>
                    <div className="admin-reply-modal" onClick={(e) => e.stopPropagation()}>
                      <div className="admin-reply-header">
                        <h3>Reply to Contact</h3>
                        <button className="admin-modal-close" onClick={closeContactReplyModal}>&times;</button>
                      </div>
                      <div className="admin-reply-meta">
                        <p><strong>To:</strong> {contactReplyTarget.name} ({contactReplyTarget.email})</p>
                        {contactReplyTarget.company && <p><strong>Company:</strong> {contactReplyTarget.company}</p>}
                        <p><strong>Original message:</strong> {contactReplyTarget.message}</p>
                      </div>
                      {contactReplySuccess && <p className="admin-reply-success">{contactReplySuccess}</p>}
                      {contactReplyError && <p className="admin-form-error">{contactReplyError}</p>}
                      <form onSubmit={handleSendContactReply}>
                        <div className="admin-field">
                          <label>Reply Message *</label>
                          <textarea
                            rows={5}
                            value={contactReplyMessage}
                            onChange={(e) => { setContactReplyMessage(e.target.value); setContactReplyError(''); }}
                            placeholder="Type your reply here. This will be emailed to the user's Gmail from the admin's Gmail."
                            required
                          />
                        </div>
                        <div className="admin-form-actions">
                          <button type="submit" className="admin-save-btn" disabled={contactReplySending}>
                            {contactReplySending ? 'Sending...' : 'Send Reply'}
                          </button>
                          <button type="button" className="admin-cancel-btn" onClick={closeContactReplyModal}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Newsletter Tab ── */}
            {activeTab === 'newsletter' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="admin-tab-header">
                  <h1 className="admin-page-title">Newsletter Subscribers ({subscribers.length})</h1>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Email</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map(s => (
                        <tr key={s._id}>
                          <td>{formatDate(s.createdAt)}</td>
                          <td><a href={`mailto:${s.email}`}>{s.email}</a></td>
                          <td>
                            <span className={`admin-status-badge ${s.isActive ? 'active' : 'inactive'}`}>
                              {s.isActive ? 'Active' : 'Unsubscribed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {subscribers.length === 0 && (
                        <tr><td colSpan="3" className="admin-empty">No subscribers yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Inquiries Tab ── */}
            {activeTab === 'inquiries' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="admin-tab-header">
                  <h1 className="admin-page-title">Service Inquiries ({inquiries.length})</h1>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Service</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map(inq => (
                        <tr key={inq._id}>
                          <td>{formatDate(inq.createdAt)}</td>
                          <td>{inq.name}</td>
                          <td><a href={`mailto:${inq.email}`}>{inq.email}</a></td>
                          <td>{inq.serviceTitle}</td>
                          <td className="admin-msg-cell">{inq.message.substring(0, 60)}{inq.message.length > 60 ? '...' : ''}</td>
                          <td>
                            <span className={`admin-status-badge ${inq.status}`}>
                              {inq.status}
                            </span>
                          </td>
<td>
                            <div className="admin-action-btns">
                              <button className="admin-edit-btn" onClick={() => openReplyModal(inq)}>Reply</button>
                              <select
                                className="admin-status-select"
                                value={inq.status}
                                onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                              >
                                <option value="new">New</option>
                                <option value="in-review">In Review</option>
                                <option value="closed">Closed</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {inquiries.length === 0 && (
                        <tr><td colSpan="7" className="admin-empty">No inquiries yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {replyTarget && (
                  <div className="admin-modal-backdrop" onClick={closeReplyModal}>
                    <div className="admin-reply-modal" onClick={(e) => e.stopPropagation()}>
                      <div className="admin-reply-header">
                        <h3>Reply to Inquiry</h3>
                        <button className="admin-modal-close" onClick={closeReplyModal}>&times;</button>
                      </div>
                      <div className="admin-reply-meta">
<p><strong>To:</strong> {replyTarget.name} ({replyTarget.email})</p>
                        <p><strong>Service:</strong> {replyTarget.serviceTitle}</p>
                        <p><strong>Original message:</strong> {replyTarget.message}</p>
                      </div>
                      {replySuccess && <p className="admin-reply-success">{replySuccess}</p>}
                      {replyError && <p className="admin-form-error">{replyError}</p>}
                      <form onSubmit={handleSendReply}>
                        <div className="admin-field">
                          <label>Reply Message *</label>
                          <textarea
                            rows={5}
                            value={replyMessage}
                            onChange={(e) => { setReplyMessage(e.target.value); setReplyError(''); }}
                            placeholder="Type your reply here. This will be emailed to the user's Gmail from the admin's Gmail."
                            required
                          />
                        </div>
                        <div className="admin-form-actions">
                          <button type="submit" className="admin-save-btn" disabled={replySending}>
                            {replySending ? 'Sending...' : 'Send Reply'}
                          </button>
                          <button type="button" className="admin-cancel-btn" onClick={closeReplyModal}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            {/* ── Blog Tab ── */}
            {activeTab === 'blog' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="admin-tab-header">
                  <h1 className="admin-page-title">Blog Management ({blogPosts.length})</h1>
                  <button className="admin-create-btn" onClick={() => openBlogForm()}>
                    + New Post
                  </button>
                </div>

                {blogFormOpen && (
                  <div className="admin-blog-form">
                    <h3>{blogFormMode === 'create' ? 'Create New Post' : 'Edit Post'}</h3>
                    <form onSubmit={handleBlogFormSubmit}>
                      <div className="admin-form-row">
                        <div className="admin-field">
                          <label>Title *</label>
                          <input name="title" value={blogForm.title} onChange={handleBlogFormChange} placeholder="Post title" required />
                        </div>
                        <div className="admin-field">
                          <label>Author *</label>
                          <input name="author" value={blogForm.author} onChange={handleBlogFormChange} placeholder="Author name" required />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-field">
                          <label>Category</label>
                          <input name="category" value={blogForm.category} onChange={handleBlogFormChange} placeholder="e.g. Strategy, Technology" />
                        </div>
                        <div className="admin-field">
                          <label>Read Time (min)</label>
                          <input name="readTime" type="number" value={blogForm.readTime} onChange={handleBlogFormChange} />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-field">
                          <label>Status</label>
                          <select name="status" value={blogForm.status} onChange={handleBlogFormChange}>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>
                        <div className="admin-field">
                          <label>Tags (comma separated)</label>
                          <input name="tags" value={blogForm.tags} onChange={handleBlogFormChange} placeholder="e.g. strategy, growth, AI" />
                        </div>
                      </div>
                      <div className="admin-field">
                        <label>Cover Image URL</label>
                        <input name="coverImage" value={blogForm.coverImage} onChange={handleBlogFormChange} placeholder="https://..." />
                      </div>
                      <div className="admin-field">
                        <label>Author Avatar URL</label>
                        <input name="authorAvatar" value={blogForm.authorAvatar} onChange={handleBlogFormChange} placeholder="https://..." />
                      </div>
                      <div className="admin-field">
                        <label>Excerpt *</label>
                        <textarea name="excerpt" value={blogForm.excerpt} onChange={handleBlogFormChange} placeholder="Brief summary..." rows={2} required />
                      </div>
                      <div className="admin-field">
                        <label>Content * (HTML)</label>
                        <textarea name="content" value={blogForm.content} onChange={handleBlogFormChange} placeholder="Full post content with HTML..." rows={8} required />
                      </div>
                      {blogFormError && <p className="admin-form-error">{blogFormError}</p>}
                      <div className="admin-form-actions">
                        <button type="submit" className="admin-save-btn" disabled={blogFormLoading}>
                          {blogFormLoading ? 'Saving...' : blogFormMode === 'create' ? 'Create Post' : 'Update Post'}
                        </button>
                        <button type="button" className="admin-cancel-btn" onClick={() => setBlogFormOpen(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...blogPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(post => (
                        <tr key={post._id}>
                          <td>{formatDate(post.createdAt)}</td>
                          <td><strong>{post.title}</strong></td>
                          <td>{post.author}</td>
                          <td>{post.category || '-'}</td>
                          <td>
                            <span className={`admin-status-badge ${post.status === 'published' ? 'active' : 'inactive'}`}>
                              {post.status || 'published'}
                            </span>
                          </td>
                          <td>
                            <div className="admin-action-btns">
                              <button className="admin-edit-btn" onClick={() => openBlogForm(post)}>Edit</button>
                              <button className="admin-del-btn" onClick={() => handleDeleteBlogPost(post._id, post.title)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {blogPosts.length === 0 && (
                        <tr><td colSpan="6" className="admin-empty">No blog posts yet. Click "+ New Post" to create one.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
)}
            {/* ── Portfolio Tab ── */}
            {activeTab === 'portfolio' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="admin-tab-header">
                  <h1 className="admin-page-title">Portfolio Management ({portfolioEntries.length})</h1>
                  <button className="admin-create-btn" onClick={() => {
                    setPortfolioForm(emptyPortfolioForm);
                    setPortfolioFormMode('create');
                    setPortfolioFormOpen(true);
                    setPortfolioFormError('');
                  }}>
                    + New Entry
                  </button>
                </div>

                {portfolioFormOpen && (
                  <div className="admin-blog-form">
                    <h3>{portfolioFormMode === 'create' ? 'Create New Portfolio Entry' : 'Edit Portfolio Entry'}</h3>
                    <form onSubmit={handlePortfolioFormSubmit}>
                      <div className="admin-form-row">
                        <div className="admin-field">
                          <label>ID *</label>
                          <input name="id" value={portfolioForm.id} onChange={handlePortfolioFormChange} placeholder="e.g. my-project-slug" required />
                        </div>
                        <div className="admin-field">
                          <label>Title *</label>
                          <input name="title" value={portfolioForm.title} onChange={handlePortfolioFormChange} placeholder="Project title" required />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-field">
                          <label>Client *</label>
                          <input name="client" value={portfolioForm.client} onChange={handlePortfolioFormChange} placeholder="Client name" required />
                        </div>
                        <div className="admin-field">
                          <label>Category *</label>
                          <input name="category" value={portfolioForm.category} onChange={handlePortfolioFormChange} placeholder="e.g. Branding, Strategy" required />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-field">
                          <label>Image URL</label>
                          <input name="image" value={portfolioForm.image} onChange={handlePortfolioFormChange} placeholder="https://..." />
                        </div>
                        <div className="admin-field">
                          <label>Thumbnail URL</label>
                          <input name="thumbnail" value={portfolioForm.thumbnail} onChange={handlePortfolioFormChange} placeholder="https://..." />
                        </div>
                      </div>
                      <div className="admin-field">
                        <label>Description *</label>
                        <textarea name="description" value={portfolioForm.description} onChange={handlePortfolioFormChange} placeholder="Project description..." rows={3} required />
                      </div>
                      <div className="admin-field">
                        <label>Results (one per line)</label>
                        <textarea name="resultsInput" value={portfolioForm.resultsInput} onChange={handlePortfolioFormChange} placeholder="210% increase in qualified leads&#10;3x social media engagement&#10;..." rows={3} />
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-field">
                          <label>Challenge</label>
                          <textarea name="challenge" value={portfolioForm.challenge} onChange={handlePortfolioFormChange} placeholder="Describe the challenge..." rows={3} />
                        </div>
                        <div className="admin-field">
                          <label>Solution</label>
                          <textarea name="solution" value={portfolioForm.solution} onChange={handlePortfolioFormChange} placeholder="Describe the solution..." rows={3} />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-field">
                          <label>Timeline</label>
                          <input name="timeline" value={portfolioForm.timeline} onChange={handlePortfolioFormChange} placeholder="e.g. 6 months" />
                        </div>
                        <div className="admin-field">
                          <label>Results Image URL</label>
                          <input name="results_img" value={portfolioForm.results_img} onChange={handlePortfolioFormChange} placeholder="https://..." />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-field">
                          <label>Testimonial</label>
                          <textarea name="testimonial" value={portfolioForm.testimonial} onChange={handlePortfolioFormChange} placeholder="Client testimonial quote..." rows={2} />
                        </div>
                        <div className="admin-field">
                          <label>Testimonial Author</label>
                          <input name="testimonialAuthor" value={portfolioForm.testimonialAuthor} onChange={handlePortfolioFormChange} placeholder="e.g. John Doe, CEO" />
                        </div>
                      </div>
                      {portfolioFormError && <p className="admin-form-error">{portfolioFormError}</p>}
                      <div className="admin-form-actions">
                        <button type="submit" className="admin-save-btn" disabled={portfolioFormLoading}>
                          {portfolioFormLoading ? 'Saving...' : portfolioFormMode === 'create' ? 'Create Entry' : 'Update Entry'}
                        </button>
                        <button type="button" className="admin-cancel-btn" onClick={() => setPortfolioFormOpen(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Client</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...portfolioEntries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(entry => (
                        <tr key={entry._id}>
                          <td>{formatDate(entry.createdAt)}</td>
                          <td><strong>{entry.title}</strong></td>
                          <td>{entry.client}</td>
                          <td>
                            <span className="admin-status-badge active">{entry.category}</span>
                          </td>
                          <td>
                            <div className="admin-action-btns">
                              <button className="admin-edit-btn" onClick={() => openPortfolioForm(entry)}>Edit</button>
                              <button className="admin-del-btn" onClick={() => handleDeletePortfolioEntry(entry.id, entry.title)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {portfolioEntries.length === 0 && (
                        <tr><td colSpan="5" className="admin-empty">No portfolio entries yet. Click "+ New Entry" to create one.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
