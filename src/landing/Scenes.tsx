import { useId, useMemo, type ReactNode } from 'react';
import { rng } from './random';

const useUid = (prefix: string) => `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

/** Golden-hour backdrop shared by the card scenes (viewBox 0 0 300 170). */
function Backdrop({ id, seed, children }: { id: string; seed: number; children: ReactNode }) {
  const haze = useMemo(() => {
    const r = rng(seed);
    const out: { x: number; w: number; h: number }[] = [];
    for (let x = 0; x < 300; ) {
      const w = 6 + r() * 12;
      out.push({ x, w, h: 8 + r() * 38 });
      x += w + r() * 3;
    }
    return out;
  }, [seed]);
  return (
    <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#97b0cc" />
          <stop offset="0.5" stopColor="#ecd6bb" />
          <stop offset="1" stopColor="#f3c181" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.5" cy="0.82" r="0.6">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.4" stopColor="#ffe3b3" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffe3b3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d93ad" />
          <stop offset="1" stopColor="#d6bf9f" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe7c2" />
          <stop offset="0.5" stopColor="#e2b36d" />
          <stop offset="1" stopColor="#b9853f" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="300" height="170" fill={`url(#${id}-sky)`} />
      <rect width="300" height="170" fill={`url(#${id}-sun)`} />
      <g fill="#c9ad98" opacity="0.55">
        {haze.map((b) => (
          <rect key={b.x} x={b.x} y={140 - b.h} width={b.w} height={b.h} />
        ))}
      </g>
      {children}
    </svg>
  );
}

export function BridgeScene() {
  const id = useUid('br');
  return (
    <Backdrop id={id} seed={11}>
      <path d="M0 132C100 126 200 126 300 130V170H0Z" fill="#e7c48f" />
      {[
        [26, 52, 30],
        [244, 46, 32],
      ].map(([x, top, w]) => (
        <g key={x}>
          <rect x={x} y={top} width={w} height={132 - top} fill={`url(#${id}-glass)`} />
          <rect x={x + w - 4} y={top + 4} width="4" height={128 - top} fill="#f3e6d2" opacity="0.6" />
        </g>
      ))}
      <g stroke="#fbf3e6" fill="none">
        <path d="M56 118C120 112 180 112 244 118" strokeWidth="3" />
        <path d="M118 120L124 46L130 120" strokeWidth="2.4" />
        <path d="M172 120L178 46L184 120" strokeWidth="2.4" />
        {[70, 86, 102].map((x) => (
          <path key={x} d={`M124 52L${x} 117`} strokeWidth="0.8" />
        ))}
        {[142, 150, 160].map((x) => (
          <path key={x} d={`M124 52L${x} 114`} strokeWidth="0.8" />
        ))}
        {[198, 214, 230].map((x) => (
          <path key={x} d={`M178 52L${x} 116`} strokeWidth="0.8" />
        ))}
      </g>
      <g fill="#fff6dc" filter={`url(#${id}-glow)`}>
        {[78, 112, 150, 196, 228].map((x, i) => (
          <circle key={x} cx={x} cy={116 - (i % 2)} r="2.2" />
        ))}
      </g>
      <g fill="#6b7a3a">
        {Array.from({ length: 26 }, (_, i) => (
          <circle key={i} cx={i * 12 + 4} cy={150 + (i % 3) * 4} r={7 + (i % 4)} />
        ))}
      </g>
    </Backdrop>
  );
}

export function TokensScene() {
  const id = useUid('tk');
  const coins: [number, number, number][] = [
    [82, 76, 22],
    [150, 50, 26],
    [220, 82, 22],
  ];
  return (
    <Backdrop id={id} seed={23}>
      <g fill="none" stroke="#fffaf0" strokeWidth="1.4" strokeDasharray="3 4" opacity="0.9">
        <path d="M100 66C112 46 128 40 128 44" />
        <path d="M172 44C188 40 204 56 206 66" />
        <path d="M100 86C130 110 172 112 202 92" />
      </g>
      {coins.map(([x, y, r]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={r + 6} fill="#fff2d6" opacity="0.45" />
          <circle cx={x} cy={y} r={r} fill={`url(#${id}-gold)`} stroke="#fff4dc" strokeWidth="1.5" />
          <circle cx={x} cy={y} r={r - 6} fill="none" stroke="#fff4dc" strokeWidth="1" opacity="0.8" />
          <path
            d={`M${x} ${y - r * 0.42}L${x + r * 0.36} ${y - r * 0.21}V${y + r * 0.21}L${x} ${y + r * 0.42}L${x - r * 0.36} ${y + r * 0.21}V${y - r * 0.21}Z`}
            fill="#fff8ea"
            opacity="0.9"
          />
        </g>
      ))}
      <g fill="#6b7a3a">
        {Array.from({ length: 26 }, (_, i) => (
          <circle key={i} cx={i * 12 + 6} cy={152 + (i % 3) * 4} r={7 + (i % 4)} />
        ))}
      </g>
    </Backdrop>
  );
}

export function ToolingScene() {
  const id = useUid('tl');
  const lines: [number, number, string][] = [
    [62, 70, '#b9853f'],
    [62, 112, '#7d93ad'],
    [80, 90, '#7d93ad'],
    [80, 64, '#b9853f'],
    [62, 96, '#7d93ad'],
  ];
  return (
    <Backdrop id={id} seed={31}>
      <rect x="44" y="24" width="212" height="118" rx="9" fill="#ffffff" opacity="0.62" stroke="#ffffff" />
      <rect x="44" y="24" width="212" height="20" rx="9" fill="#ffffff" opacity="0.6" />
      {[58, 70, 82].map((x) => (
        <circle key={x} cx={x} cy="34" r="3.2" fill="#d6b88e" />
      ))}
      <path d="M58 60L64 64L58 68" fill="none" stroke="#b9853f" strokeWidth="2" strokeLinecap="round" />
      {lines.map(([x, w, c], i) => (
        <rect key={i} x={x + 12} y={60 + i * 14} width={w} height="5" rx="2.5" fill={c} opacity="0.75" />
      ))}
      <rect x="74" y="130" width="8" height="5" fill="#b9853f" />
    </Backdrop>
  );
}

function Slab({ cx, cy, light }: { cx: number; cy: number; light: string }) {
  return (
    <g>
      <path d={`M${cx - 52} ${cy}L${cx} ${cy + 22}V${cy + 36}L${cx - 52} ${cy + 14}Z`} fill="#d7c1a1" />
      <path d={`M${cx + 52} ${cy}L${cx} ${cy + 22}V${cy + 36}L${cx + 52} ${cy + 14}Z`} fill="#bf9f76" />
      <path d={`M${cx} ${cy - 22}L${cx + 52} ${cy}L${cx} ${cy + 22}L${cx - 52} ${cy}Z`} fill="#f8f0e4" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={cx + 14 + i * 10} cy={cy + 21 - i * 4} r="1.8" fill={light} />
      ))}
    </g>
  );
}

export function InfraScene() {
  const id = useUid('in');
  return (
    <Backdrop id={id} seed={47}>
      <g stroke="#fffaf0" strokeWidth="1.2" fill="none" opacity="0.85">
        <path d="M150 74L60 52M150 74L240 50M150 98L54 112M150 98L246 116" strokeDasharray="2 3" />
      </g>
      {[
        [60, 52],
        [240, 50],
        [54, 112],
        [246, 116],
      ].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="7" fill="#fff6e4" opacity="0.6" />
          <circle cx={x} cy={y} r="3.6" fill="#b9853f" />
        </g>
      ))}
      <Slab cx={150} cy={112} light="#7fae6a" />
      <Slab cx={150} cy={86} light="#e2b36d" />
      <Slab cx={150} cy={60} light="#7fae6a" />
    </Backdrop>
  );
}

/** Large featured illustration: a bridge, half blueprint and half rendered. */
export function FeaturedScene() {
  const id = useUid('ft');
  const leftClip = 'M0 0H262L196 340H0Z';
  const rightClip = 'M262 0H600V340H196Z';

  const structure = (wire: boolean) => {
    const glass = wire ? 'none' : `url(#${id}-glass)`;
    const deck = wire ? '#7f93a6' : '#fbf1df';
    const sw = wire ? 1.2 : 1;
    const towers: [number, number, number][] = [
      [24, 120, 44],
      [78, 160, 30],
      [470, 96, 40],
      [520, 140, 34],
      [556, 112, 30],
    ];
    return (
      <g stroke={wire ? '#7f93a6' : 'none'} strokeWidth={sw}>
        {towers.map(([x, top, w]) => (
          <rect key={x} x={x} y={top} width={w} height={272 - top} fill={glass} />
        ))}
        <path d="M40 252C200 230 400 230 580 250" fill="none" stroke={deck} strokeWidth={wire ? 1.4 : 5} />
        <path d="M292 254L300 40L308 254" fill={wire ? 'none' : '#f6ead6'} stroke={wire ? '#7f93a6' : 'none'} />
        <g fill="none" stroke={deck} strokeWidth={wire ? 0.9 : 1.2}>
          {[90, 140, 190, 240, 270].map((x) => (
            <path key={x} d={`M300 ${54 + (270 - x) * 0.03}L${x} ${246 - (x - 40) * 0.02}`} />
          ))}
          {[330, 370, 420, 470, 520].map((x) => (
            <path key={x} d={`M300 54L${x} 242`} />
          ))}
        </g>
        {wire && (
          <g strokeDasharray="4 4" opacity="0.7">
            <path d="M0 254H600M300 0V340M40 272H580" />
            <circle cx="300" cy="54" r="26" fill="none" />
          </g>
        )}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8eaacb" />
          <stop offset="0.55" stopColor="#ecd5b8" />
          <stop offset="1" stopColor="#f2bd7c" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.55" cy="0.75" r="0.6">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.45" stopColor="#ffe1ad" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffe1ad" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d93ad" />
          <stop offset="1" stopColor="#d9bf9b" />
        </linearGradient>
        <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#c4d0da" strokeWidth="0.8" />
        </pattern>
        <clipPath id={`${id}-l`}>
          <path d={leftClip} />
        </clipPath>
        <clipPath id={`${id}-r`}>
          <path d={rightClip} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-r)`}>
        <rect width="600" height="340" fill={`url(#${id}-sky)`} />
        <rect width="600" height="340" fill={`url(#${id}-sun)`} />
        <path d="M0 262C200 250 400 250 600 258V340H0Z" fill="#e5c08a" />
        {structure(false)}
        <g fill="#687639">
          {Array.from({ length: 44 }, (_, i) => (
            <circle key={i} cx={i * 14 + 4} cy={300 + (i % 4) * 6} r={9 + (i % 5)} />
          ))}
        </g>
      </g>
      <g clipPath={`url(#${id}-l)`}>
        <rect width="600" height="340" fill="#eef1f3" />
        <rect width="600" height="340" fill={`url(#${id}-grid)`} />
        {structure(true)}
      </g>
      <path d="M262 0L196 340" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
    </svg>
  );
}

/** Small square thumbnails for the featured panel (viewBox 0 0 100 80). */
export function ThumbBlocks() {
  return (
    <svg viewBox="0 0 100 80" aria-hidden="true">
      <rect width="100" height="80" fill="#e7e3de" />
      {[
        [54, 38, 26],
        [30, 46, 16],
        [74, 50, 12],
        [44, 58, 10],
      ].map(([cx, cy, h]) => (
        <g key={`${cx}-${cy}`}>
          <path d={`M${cx - 12} ${cy - h}L${cx} ${cy - h + 6}V${cy + 6}L${cx - 12} ${cy}Z`} fill="#cfc8bf" />
          <path d={`M${cx + 12} ${cy - h}L${cx} ${cy - h + 6}V${cy + 6}L${cx + 12} ${cy}Z`} fill="#b5ada3" />
          <path d={`M${cx} ${cy - h - 6}L${cx + 12} ${cy - h}L${cx} ${cy - h + 6}L${cx - 12} ${cy - h}Z`} fill="#f4f1ed" />
        </g>
      ))}
    </svg>
  );
}

export function ThumbBlueprint() {
  return (
    <svg viewBox="0 0 100 80" aria-hidden="true">
      <rect width="100" height="80" fill="#8a97a3" />
      <g stroke="#c6d0d8" strokeWidth="0.5" opacity="0.6">
        {Array.from({ length: 10 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 10} 0V80`} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 10}H100`} />
        ))}
      </g>
      <g fill="none" stroke="#f3f6f8" strokeWidth="1.2">
        <path d="M6 62C26 26 46 26 50 62C54 26 74 26 94 62" />
        <path d="M6 62H94" />
        {[16, 26, 36, 64, 74, 84].map((x) => (
          <path key={x} d={`M${x} 62V${x < 50 ? 62 - Math.sin(((x - 6) / 44) * Math.PI) * 26 : 62 - Math.sin(((x - 50) / 44) * Math.PI) * 26}`} />
        ))}
      </g>
    </svg>
  );
}

export function ThumbChain() {
  const id = useUid('tc');
  return (
    <svg viewBox="0 0 100 80" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-st`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#efe2cf" />
          <stop offset="0.5" stopColor="#d5bc97" />
          <stop offset="1" stopColor="#a9865c" />
        </linearGradient>
      </defs>
      <rect width="100" height="80" fill={`url(#${id}-st)`} />
      <path d="M0 80L100 0" stroke="#fff8ec" strokeWidth="10" opacity="0.35" />
      <g fill="none" stroke="#fffaf0" strokeWidth="4">
        <rect x="18" y="30" width="38" height="20" rx="10" />
        <rect x="44" y="30" width="38" height="20" rx="10" />
      </g>
    </svg>
  );
}
