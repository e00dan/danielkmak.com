import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  opacityStep: number;
}

const SPEED = 0.5;
const MAX_RADIUS = 2.5;
const OPACITY_SPEED = 0.05;

/**
 * Twinkling, slowly drifting white dots. A dependency-free replacement for the
 * particles.js 1.x setup the Ember site used (100 dots, 40 on small screens).
 */
export default function Particles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const count = window.matchMedia('(max-width: 456px)').matches ? 40 : 100;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() - 0.5,
      vy: Math.random() - 0.5,
      radius: Math.random() * MAX_RADIUS,
      opacity: Math.random(),
      opacityStep: OPACITY_SPEED * Math.random() * (Math.random() < 0.5 ? -1 : 1),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const p of particles) {
        p.x += p.vx * SPEED;
        p.y += p.vy * SPEED;
        if (p.x - p.radius > width) p.x = -p.radius;
        else if (p.x + p.radius < 0) p.x = width + p.radius;
        if (p.y - p.radius > height) p.y = -p.radius;
        else if (p.y + p.radius < 0) p.y = height + p.radius;

        p.opacity += p.opacityStep;
        if (p.opacity >= 1 || p.opacity <= 0) {
          p.opacity = Math.min(1, Math.max(0, p.opacity));
          p.opacityStep = -p.opacityStep;
        }
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    if (reducedMotion) draw();
    else frame = requestAnimationFrame(step);

    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
