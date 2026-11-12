import { rng } from './random';

type Pt = [number, number];

/** Smooth closed path through points (quadratic curves via midpoints). */
function smooth(points: Pt[]) {
  const n = points.length;
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M${mid(points[n - 1], points[0]).map((v) => v.toFixed(1)).join(' ')}`;
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const m = mid(p, points[(i + 1) % n]);
    d += `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

/**
 * Italian cypress: a narrow flame, widest about a third of the way up,
 * tapering to a point, with slightly irregular foliage edges.
 */
export function Cypress({ x, base, h, w, seed }: { x: number; base: number; h: number; w: number; seed: number }) {
  const r = rng(seed);
  const steps = 14;
  const profile = (t: number) => (t < 0.3 ? 0.72 + 0.28 * (t / 0.3) : Math.pow((1 - t) / 0.7, 0.8));
  const left: Pt[] = [];
  const right: Pt[] = [];
  const lean = (r() - 0.5) * w * 0.25; // slight lean of the tip
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const yy = base - t * h;
    const cx = x + lean * t * t;
    const half = (w / 2) * profile(t);
    left.push([cx - half * (1 + (r() - 0.5) * 0.3), yy]);
    right.push([cx + half * (1 + (r() - 0.5) * 0.3), yy]);
  }
  const tip: Pt = [x + lean, base - h - 4];
  const outline = smooth([...left.slice(0, -1), tip, ...right.slice(0, -1).reverse()]);
  // Sunlit right flank: right edge down, back up along an inner line.
  const inner = right.slice(0, -1).map(([px, py], i): Pt => {
    const t = i / steps;
    const cx = x + lean * t * t;
    return [cx + (px - cx) * (0.2 + r() * 0.15), py];
  });
  const lit = smooth([...inner, tip, ...right.slice(0, -1).reverse()]);
  return (
    <g>
      <rect x={x - 1.4} y={base - 4} width="2.8" height="6" fill="#4a3b26" />
      <path d={outline} fill="#3f4c26" />
      <path d={lit} fill="#7c8944" opacity="0.62" />
    </g>
  );
}

/** Low, irregular shrub clump sitting on a terrace edge. */
export function Shrub({ x, base, rx, ry, seed }: { x: number; base: number; rx: number; ry: number; seed: number }) {
  const r = rng(seed);
  const n = 12;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = Math.PI + (Math.PI * i) / n; // upper half, left to right
    const k = 1 + (r() - 0.5) * 0.35;
    pts.push([x + Math.cos(a) * rx * k, base + Math.sin(a) * ry * k]);
  }
  pts.push([x + rx, base], [x - rx, base]);
  const lit: Pt[] = pts.slice(5, 13).map(([px, py]) => [px - rx * 0.08, py + ry * 0.12]);
  lit.push([x + rx * 0.7, base - ry * 0.25], [x + rx * 0.05, base - ry * 0.5]);
  return (
    <g>
      <path d={smooth(pts)} fill="#56662f" />
      <path d={smooth(lit)} fill="#8a9550" opacity="0.55" />
    </g>
  );
}
