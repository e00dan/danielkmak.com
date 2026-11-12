import { useId, useMemo } from 'react';
import Palace from './Palace';
import Towers from './Towers';
import { Cypress, Shrub } from './Plants';
import { rng } from './random';

const W = 1600;
const H = 760;
const GROUND = 600; // skyline base line


interface Palette {
  sky: boolean;
  haze: string;
  hazeOpacity: number;
  stone: string;
  stoneShade: string;
  stroke?: string;
  tree: string[];
  treeOpacity: number;
  river: string;
  details: boolean;
}

export default function Skyline({
  variant = 'hero',
  className,
}: {
  variant?: 'hero' | 'sketch';
  className?: string;
}) {
  const id = `sk${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const u = (name: string) => `url(#${id}-${name})`;
  const hero = variant === 'hero';

  const p: Palette = hero
    ? {
        sky: true,
        haze: '#c6aa98',
        hazeOpacity: 0.5,
        stone: u('stone'),
        stoneShade: '#b7946b',
        tree: ['#5f6a34', '#77783c', '#8f8843', '#a99a4c', '#c2a65a', '#6d7a3f'],
        treeOpacity: 1,
        river: u('river'),
        details: true,
      }
    : {
        sky: false,
        haze: '#e6dccf',
        hazeOpacity: 0.9,
        stone: '#ece2d4',
        stoneShade: '#ddd0bd',
        stroke: '#c9b7a1',
        tree: ['#e4d9c9', '#ddd1bf', '#e9e0d3'],
        treeOpacity: 0.95,
        river: '#efe7dc',
        details: false,
      };

  const { haze, trees } = useMemo(() => {
    const r = rng(7);
    const haze: { x: number; w: number; h: number }[] = [];
    for (let x = 0; x < W; ) {
      const w = 12 + r() * 26;
      haze.push({ x, w, h: 24 + r() * 96 });
      x += w + r() * 6;
    }
    const trees: { x: number; y: number; r: number; c: number }[] = [];
    for (let i = 0; i < 950; i++) {
      const x = r() * W;
      const y = 590 + Math.pow(r(), 0.75) * 140;
      // keep the river (right side) mostly clear
      if (x > 1070 && y > 622 && y < 690) continue;
      trees.push({ x, y, r: 5 + r() * 7, c: Math.floor(r() * 6) });
    }
    trees.sort((a, b) => a.y - b.y);
    return { haze, trees };
  }, []);

  const s = p.stroke;
  const sw = s ? 1 : 0;
  const top = hero ? 120 : 0; // extra sky above the scene

  return (
    <svg
      className={className}
      viewBox={`0 ${-top} ${W} ${H + top}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7193bd" />
          <stop offset="0.32" stopColor="#a8bad1" />
          <stop offset="0.58" stopColor="#e9d3ba" />
          <stop offset="0.74" stopColor="#f6cd96" />
          <stop offset="1" stopColor="#f1b877" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.52" cy="0.72" r="0.42">
          <stop offset="0" stopColor="#fffaf0" stopOpacity="1" />
          <stop offset="0.25" stopColor="#ffe6bd" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#ffd59a" stopOpacity="0.25" />
          <stop offset="1" stopColor="#ffd59a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1ddb8" />
          <stop offset="1" stopColor="#d6b588" />
        </linearGradient>
        <linearGradient id={`${id}-river`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8deb0" />
          <stop offset="0.45" stopColor="#d7c6b0" />
          <stop offset="1" stopColor="#8ea2b5" />
        </linearGradient>
        <linearGradient id={`${id}-terrace`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7efe3" />
          <stop offset="1" stopColor="#dccab0" />
        </linearGradient>
        <filter id={`${id}-blur`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Sky, sun and clouds */}
      {p.sky && (
        <>
          <rect y={-top} width={W} height={H + top} fill={u('sky')} />
          <rect y={-top} width={W} height={H + top} fill={u('sun')} />
          <g filter={u('blur')}>
            {[
              [1250, 210, 190, 52],
              [1390, 168, 160, 58],
              [1500, 236, 180, 48],
              [1150, 270, 150, 38],
              [1430, 312, 210, 42],
              [1290, 340, 170, 32],
              [1540, 120, 120, 40],
              [240, 120, 240, 26],
              [470, 86, 190, 20],
            ].map(([cx, cy, rx, ry]) => (
              <g key={`${cx}-${cy}`}>
                <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff7ec" opacity="0.8" />
                <ellipse cx={cx + 10} cy={cy + ry * 0.6} rx={rx * 0.8} ry={ry * 0.5} fill="#f3c48a" opacity="0.5" />
              </g>
            ))}
          </g>
        </>
      )}

      {/* Distant haze buildings */}
      <g fill={p.haze} opacity={p.hazeOpacity} stroke={s} strokeWidth={sw * 0.6}>
        {haze.map((b) => (
          <rect key={b.x} x={b.x} y={GROUND - b.h} width={b.w} height={b.h} />
        ))}
      </g>

      {/* Warsaw high-rises (behind the palace) */}
      <Towers id={id} detailed={p.details} sketch={p.details ? undefined : { fill: '#efe7dc', stroke: '#c9b7a1' }} />

      {/* Palace of Culture and Science */}
      <Palace
        detailed={p.details}
        c={
          p.details
            ? {
                face: p.stone,
                window: '#5e4630',
                windowOpacity: 0.55,
                light: '#f6e7c9',
                shade: '#8f6c45',
                spire: '#c9a476',
              }
            : {
                face: p.stone,
                window: p.stoneShade,
                windowOpacity: 1,
                light: '#f5efe6',
                shade: p.stoneShade,
                spire: p.stoneShade,
                stroke: s,
              }
        }
      />

      {/* Ground under the canopy */}
      <rect x="0" y="616" width={W} height={H - 616} fill={hero ? '#5b6631' : '#e6dccf'} />

      {/* River and cable-stayed bridge */}
      <path d="M1060 640C1200 618 1400 614 1600 618V694H1060Z" fill={p.river} stroke={s} strokeWidth={sw} />
      {hero && (
        <g stroke="#fff6e6" strokeLinecap="round" opacity="0.7">
          {[
            [1150, 662, 90],
            [1300, 656, 140],
            [1480, 660, 80],
            [1220, 676, 70],
            [1400, 674, 120],
            [1540, 684, 50],
          ].map(([x, y, w]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y}h${w}`} strokeWidth="1.6" />
          ))}
        </g>
      )}
      <g stroke={p.details ? '#f7ecd9' : s ?? '#d9cab6'} fill="none">
        <path d="M1110 652C1260 640 1440 636 1600 640" strokeWidth="4" stroke={p.details ? '#e9d7bb' : s} />
        <path d="M1396 652L1404 520L1412 652" strokeWidth="3" stroke={p.details ? '#f3e7d2' : s} />
        {[1180, 1230, 1280, 1330, 1370].map((x) => (
          <path key={x} d={`M1404 ${528 + (1370 - x) * 0.05}L${x} ${648 - (x - 1110) * 0.02}`} strokeWidth="1.4" />
        ))}
        {[1440, 1480, 1520, 1560].map((x) => (
          <path key={x} d={`M1404 ${528 + (x - 1440) * 0.05}L${x} 640`} strokeWidth="1.4" />
        ))}
      </g>

      {/* Tree canopy */}
      <g opacity={p.treeOpacity}>
        {trees.map((t, i) => (
          <g key={i}>
            <circle cx={t.x} cy={t.y} r={t.r} fill={p.tree[t.c % p.tree.length]} />
            {hero && (
              <circle cx={t.x + t.r * 0.3} cy={t.y - t.r * 0.35} r={t.r * 0.5} fill="#e2c477" opacity="0.25" />
            )}
          </g>
        ))}
      </g>

      {/* Foreground: stepped stone terraces with cypresses and lamps (hero only) */}
      {p.details && (
        <g>
          <path
            d="M0 400H96V440H170V482H246V522H322V560H398V600H468V760H0Z"
            fill={u('terrace')}
          />
          <g fill="#fbf6ee">
            {[
              [0, 400, 96],
              [96, 440, 74],
              [170, 482, 76],
              [246, 522, 76],
              [322, 560, 76],
              [398, 600, 70],
            ].map(([x, y, w]) => (
              <rect key={x} x={x} y={y} width={w} height="5" />
            ))}
          </g>
          <g fill="#cdb796" opacity="0.6">
            {[96, 170, 246, 322, 398].map((x) => (
              <rect key={x} x={x} y="400" width="3" height="360" />
            ))}
          </g>
          {/* Diagonal staircase */}
          <path d="M120 760L170 760L452 600L420 600Z" fill="#f4ebdd" />
          <g stroke="#d6c3a5" strokeWidth="1.2">
            {Array.from({ length: 22 }, (_, i) => {
              const t = i / 22;
              const xa = 120 + (420 - 120) * t;
              const xb = 170 + (452 - 170) * t;
              const y = 760 - 160 * t;
              return <path key={i} d={`M${xa} ${y}H${xb}`} />;
            })}
          </g>
          {/* Cypress clusters and shrubs, back terraces first */}
          {[
            { t: 'c', x: 26, base: 400, h: 168, w: 26 },
            { t: 'c', x: 55, base: 400, h: 126, w: 21 },
            { t: 's', x: 82, base: 400, rx: 14, ry: 10 },
            { t: 's', x: 110, base: 440, rx: 12, ry: 8 },
            { t: 'c', x: 136, base: 440, h: 116, w: 22 },
            { t: 'c', x: 194, base: 482, h: 98, w: 19 },
            { t: 'c', x: 213, base: 482, h: 134, w: 23 },
            { t: 'c', x: 234, base: 482, h: 86, w: 17 },
            { t: 's', x: 264, base: 522, rx: 13, ry: 9 },
            { t: 'c', x: 300, base: 522, h: 94, w: 18 },
            { t: 'c', x: 342, base: 560, h: 82, w: 16 },
            { t: 'c', x: 359, base: 560, h: 60, w: 13 },
            { t: 's', x: 384, base: 560, rx: 11, ry: 7 },
            { t: 's', x: 420, base: 600, rx: 12, ry: 8 },
            { t: 's', x: 447, base: 600, rx: 9, ry: 6 },
          ].map((pl, i) =>
            pl.t === 'c' ? (
              <Cypress key={i} x={pl.x} base={pl.base} h={pl.h!} w={pl.w!} seed={101 + i * 7} />
            ) : (
              <Shrub key={i} x={pl.x} base={pl.base} rx={pl.rx!} ry={pl.ry!} seed={211 + i * 5} />
            ),
          )}
          {/* Warm lamps */}
          <g fill="#ffd894" filter={u('glow')}>
            {[
              [60, 432],
              [132, 474],
              [206, 514],
              [282, 553],
              [358, 592],
              [434, 632],
            ].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="2.6" />
            ))}
          </g>
        </g>
      )}
    </svg>
  );
}
