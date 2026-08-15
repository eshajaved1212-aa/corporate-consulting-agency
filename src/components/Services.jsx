import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices } from '../api';
import { services as staticServices } from '../data';
import Icon from './Icons';
import './Services.css';

export default function Services() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const [services, setServices] = useState(staticServices);

  useEffect(() => {
    fetchServices()
      .then((res) => setServices(res.data))
      .catch(() => setServices(staticServices)); // fallback to static on error
  }, []);

  return (
    <section id="services" className="services-section" ref={ref}>

      {/* Parallax background */}
      <motion.div className="services-bg" style={{ y: bgY }} />
      <div className="services-overlay" />

      {/* Floating orbs */}
      <motion.div className="srv-orb srv-orb1"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="srv-orb srv-orb2"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="services-inner">
        {/* Header */}
        <motion.div
          className="services-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <span className="srv-tag">Our Services</span>
          <h2>Solutions Built Around<br /><span className="srv-title-accent">Your Business</span></h2>
          <p>From strategy to execution — end-to-end consulting designed to help your business grow, adapt, and thrive.</p>
        </motion.div>

        {/* Cards grid */}
        <div className="services-grid">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.09 }}
            >
              <Link to={`/services/${s.id}`} className="srv-card">
                {/* Image with overlay */}
                <div className="srv-card-img">
                  <img src={s.img} alt={s.title} />
                  <div className="srv-card-img-overlay" />
                  <span className="srv-card-emoji">
                    <Icon name={s.icon} size={26} color="#fff" />
                  </span>
                </div>

                {/* Body */}
                <div className="srv-card-body">
                  <h3>{s.title}</h3>
                  <p>{s.short}</p>
                  <div className="srv-card-footer">
                    <span className="srv-learn">Learn more</span>
                    <span className="srv-arrow">→</span>
                  </div>
                </div>

                {/* Hover shine */}
                <div className="srv-card-shine" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
