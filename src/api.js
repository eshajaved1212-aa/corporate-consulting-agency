import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ─────────────────────────────────────────────────
   Axios instance with interceptors
   - Request interceptor: attaches `Authorization:
     Bearer <jwt>` from localStorage to every call.
   - Response interceptor: unwraps { success, data }
     and redirects to /admin on 401 (expired token).
   ───────────────────────────────────────────────── */

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const ADMIN_TOKEN_KEY = 'consultpro_admin_token';

let onUnauthorized = null; // optional callback set by Auth UI

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — unwrap data, handle 401
api.interceptors.response.use(
  (response) => ({ status: response.status, ...response.data }),
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired / invalid — clear and bounce to login
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      if (onUnauthorized && typeof window !== 'undefined') {
        onUnauthorized();
      }
    }
    const message = error.response?.data?.error || error.message || 'Network error.';
    return Promise.reject(new Error(message));
  }
);

/* ── Auth ── */
export const adminLogin = (username, password) =>
  api.post('/auth/login', { username, password });

export const fetchCurrentUser = () =>
  api.get('/auth/me');

/* ── Contact ── */
export const submitContact = (form) =>
  api.post('/contacts', form);

/* ── Newsletter ── */
export const subscribeNewsletter = (email) =>
  api.post('/newsletter', { email });

export const unsubscribeNewsletter = (email) =>
  api.delete('/newsletter/unsubscribe', { data: { email } });

/* ── Services ── */
export const fetchServices = () => api.get('/services');

export const fetchService = (id) => api.get(`/services/${id}`);

export const submitServiceInquiry = (id, form) =>
  api.post(`/services/${id}/inquire`, form);

/* ── Team ── */
export const fetchTeam = () => api.get('/team');

export const fetchTeamMember = (id) => api.get(`/team/${id}`);

/* ── Blog ── */
export const fetchBlogPosts = (params = {}) =>
  api.get('/blog', { params });

export const fetchBlogPost = (slug) => api.get(`/blog/${slug}`);

/* ── Blog Admin ── */
export const fetchAllBlogPosts = (params = {}) =>
  api.get('/blog', { params });

export const createBlogPost = (data) =>
  api.post('/blog', data);

export const updateBlogPost = (id, data) =>
  api.patch(`/blog/${id}`, data);

export const deleteBlogPost = (id) =>
  api.delete(`/blog/${id}`);

/* ── Admin Services CRUD ── */
export const fetchAdminServices = () =>
  api.get('/services');

export const createService = (data) =>
  api.post('/admin/services', data);

export const updateService = (id, data) =>
  api.patch(`/admin/services/${id}`, data);

export const deleteService = (id) =>
  api.delete(`/admin/services/${id}`);

/* ── Portfolio ── */
export const fetchPortfolio = () => api.get('/portfolio');

export const fetchPortfolioEntry = (id) => api.get(`/portfolio/${id}`);

/* ── Health ── */
export const checkHealth = () => api.get('/health');

export default api;

