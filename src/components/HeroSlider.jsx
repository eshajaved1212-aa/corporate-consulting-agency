import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HeroSlider.css';

const SLIDES = [
  {
    id: 's1',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1920&auto=format&fit=crop',
    title: 'Premium consulting for ambitious brands',
    subtitle: 'Executive advisory, modern strategy and elegant visuals across every page.',
    cta: 'Explore Services',
    link: '/services'
  },
  {
    id: 's2',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop',
    title: 'Designing business transitions with clarity',
    subtitle: 'Strategic plans and sophisticated execution for market-leading teams.',
    cta: 'Learn About Us',
    link: '/about'
  },
  {
    id: 's3',
    image: 'https://images.unsplash.com/photo-1485988412941-77a35537dae4?q=80&w=1920&auto=format&fit=crop',
    title: 'Position your company for premium growth',
    subtitle: 'A modern brand presence built to impress executives and customers alike.',
    cta: 'Meet the Team',
    link: '/team'
  }
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hs-hero">
      <div className="hs-overlay" />
      <AnimatePresence initial={false} mode="wait">
        {SLIDES.map((s, i) => (
          i === index && (
            <motion.div
              key={s.id}
              className="hs-slide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              style={{ backgroundImage: `url(${s.image})` }}
            >
              <div className="hs-inner">
                <motion.h1
                  className="hs-title"
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18, duration: 0.7 }}
                >{s.title}</motion.h1>

                <motion.p
                  className="hs-sub"
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.32, duration: 0.7 }}
                >{s.subtitle}</motion.p>

                <motion.a
                  className="hs-cta"
                  href={s.link}
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.48, duration: 0.6 }}
                >{s.cta}</motion.a>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      <div className="hs-controls">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            className={`hs-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
