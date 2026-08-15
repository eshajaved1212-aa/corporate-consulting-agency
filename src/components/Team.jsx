import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { fetchTeam } from '../api';
import { team as staticTeam } from '../data';
import './Team.css';

export default function Team() {
  const [team, setTeam] = useState(staticTeam);

  useEffect(() => {
    fetchTeam()
      .then((res) => setTeam(res.data))
      .catch(() => setTeam(staticTeam)); // fallback to static on error
  }, []);
  return (
    <section id="team" className="team-section">

      {/* Animated gradient mesh bg */}
      <div className="team-mesh" />
      <motion.div
        className="team-orb team-orb1"
        animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="team-orb team-orb2"
        animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="team-inner">

        {/* Header */}
        <motion.div
          className="team-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <span className="team-tag">Our Team</span>
          <h2 className="team-title">
            Meet the <span className="team-accent">Experts</span> Behind Your Success
          </h2>
          <p className="team-subtitle">
            A team of seasoned consultants, strategists, and industry experts
            dedicated to delivering measurable growth for your business.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="team-grid">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className="team-card"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.12 }}
            >
              {/* Photo */}
              <div className="team-photo-wrap">
                <div className={`team-photo ${member.name === 'Esha Javed' ? 'team-photo--hands' : ''} ${member.name === 'Waseem Manzoor' ? 'team-photo--waseem' : ''}`}>
                  <img src={member.img} alt={member.name} />
                </div>
              </div>

              {/* Info */}
              <div className="team-info">
                <h3>{member.name}</h3>
                <span className="team-role">{member.role}</span>
              </div>

              {/* Hover glow */}
              <div className="team-card-glow" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          className="team-cta-strip"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <p>Want to join our world-class team?</p>
          <a href="#contact" className="team-cta-btn">
            View Open Positions →
          </a>
        </motion.div>

      </div>
    </section>
  );
}
