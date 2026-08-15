import { useEffect, useRef } from 'react';
import './Particles.css';

export default function Particles() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight * 0.6; // responsive height (60vh)

    const DPR = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(DPR, DPR);

    const particles = [];
    const count = Math.max(24, Math.floor(w / 60));

    function rand(min, max) { return Math.random() * (max - min) + min; }

    for (let i = 0; i < count; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(1.2, 4.2),
        vx: rand(-0.2, 0.6),
        vy: rand(-0.2, 0.6),
        alpha: rand(0.08, 0.35)
      });
    }

    let raf = null;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.beginPath();
        ctx.fillStyle = `rgba(212,166,58, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    draw();

    function onResize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight * 0.6; // responsive height
      const DPR = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(DPR, DPR);
    }

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="particles-root" aria-hidden>
      <canvas ref={ref} />
    </div>
  );
}
