import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (id) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">

        {/* ── Brand ── */}
        <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <img src="/logo.svg" alt="Business Consulting logo" className="nav-logo-svg" />
          <div className="nav-brand-text">
            <span className="nav-brand-name">BUSINESS</span>
            <span className="nav-brand-sub">CONSULTING</span>
          </div>
        </Link>

        {/* ── Links — each opens its own page ── */}
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/why-choose-us" className={location.pathname === '/why-choose-us' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Why Us</Link>
          <Link to="/services" className={location.pathname.startsWith('/services') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Services</Link>
<Link to="/team" className={location.pathname === '/team' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Team</Link>
          <Link to="/portfolio" className={location.pathname.startsWith('/portfolio') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Portfolio</Link>
          <Link to="/blog" className={location.pathname.startsWith('/blog') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link to="/contact" className={`nav-contact-btn ${location.pathname === '/contact' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Contact Us
          </Link>
        </nav>

        {/* ── Hamburger ── */}
        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}