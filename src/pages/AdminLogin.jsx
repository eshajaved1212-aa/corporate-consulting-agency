import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminLogin } from '../api';
import './Admin.css';

const ADMIN_TOKEN_KEY = 'consultpro_admin_token';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminLogin(form.username, form.password);
      // Store JWT and redirect to dashboard
      localStorage.setItem(ADMIN_TOKEN_KEY, res.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg">
        <div className="admin-login-mesh" />
      </div>

      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="admin-login-header">
          <svg viewBox="0 0 40 40" fill="none" className="admin-login-logo">
            <rect width="40" height="40" rx="8" fill="#3B82F6" />
            <path d="M20 8l12 8v8L20 32 8 24V16l12-8z" fill="#0B2447" stroke="#fff" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="4" fill="white" />
          </svg>
          <h1>Admin Access</h1>
          <p>Sign in with your admin credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              name="username"
              type="text"
              placeholder="admin"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <motion.p
              className="admin-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <p className="admin-login-hint">
          Default credentials are <code>admin</code> / <code>admin123</code>.
          Configure <code>ADMIN_USERNAME</code> &amp; <code>ADMIN_PASSWORD</code> in your server's <code>.env</code>.
        </p>
      </motion.div>
    </div>
  );
}
