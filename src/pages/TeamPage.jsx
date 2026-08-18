import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchTeam } from '../api';
import { team as staticTeam } from '../data';
import './TeamPage.css';

export default function TeamPage() {
  const [team, setTeam]     = useState(staticTeam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchTeam()
      .then(res => setTeam(res.data))
      .catch(() => setTeam(staticTeam))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="tp-hero">
        <div className="tp-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=85"
            alt=""
            aria-hidden="true"
          />
          <div className="tp-hero-overlay" />
        </div>
        <motion.div className="tp-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}>
          <span className="tp-eyebrow">The People Behind It</span>
          <h1 className="tp-hero-title">
            Meet Our <span className="tp-gold">Leadership</span>
          </h1>
          <p className="tp-hero-sub">
            Seasoned consultants with decades of combined experience across strategy,
            finance, technology, and operations — dedicated to your success.
          </p>
        </motion.div>
      </section>

      {/* ── Stats bar ── */}
      <div className="tp-stats-bar">
        {[['80+','Senior Consultants'],['20+','Years Avg. Experience'],['40+','Industries'],['200+','Clients Served']].map(([n, l], i) => (
          <motion.div key={l} className="tp-stat"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}>
            <strong>{n}</strong>
            <span>{l}</span>
          </motion.div>
        ))}
      </div>

      {/* ── Team grid ── */}
      <section className="tp-section">
        <div className="tp-container">
          <motion.div className="tp-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}>
            <span className="tp-tag">Our Experts</span>
            <h2 className="tp-section-title">The Minds Driving Your Results</h2>
            <p className="tp-section-sub">
              Every engagement is led by a named senior consultant — no juniors, no outsourcing.
            </p>
          </motion.div>

          {loading ? (
            <div className="tp-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="tp-skeleton" />)}
            </div>
          ) : (
            <div className="tp-grid">
              {team.map((member, i) => (
                <motion.div key={member.name} className="tp-card"
                  initial={{ opacity: 0, y: 48 }}
                  whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, amount: 0.2 }}
                   transition={{ duration: 0.6, delay: i * 0.1 }}>

                   {/* Photo */}
                   <div className="tp-photo-wrap">
                     <div className={`tp-photo ${member.name === 'Esha Javed' ? 'tp-photo--esha' : ''} ${member.name === 'Waseem Manzoor' ? 'tp-photo--waseem' : ''}`}>
                       <img src={member.img} alt={member.name} />
                     </div>
                   </div>

                   {/* Info */}
                   <div className="tp-info">
                    <h3>{member.name}</h3>
                    <span className="tp-role">{member.role}</span>

                    {member.bio && (
                      <p className="tp-bio">{member.bio}</p>
                    )}
                  </div>

                  <div className="tp-card-glow" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Join CTA ── */}
      <section className="tp-join">
        <div className="tp-join-inner">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}>
            <h2>Want to Join Our World-Class Team?</h2>
            <p>We're always looking for exceptional consultants who share our passion for client results.</p>
            <Link to="/contact" className="tp-join-btn">View Open Positions &rarr;</Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}

