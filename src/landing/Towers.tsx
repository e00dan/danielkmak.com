import type { ReactNode } from 'react';

/**
 * Warsaw's high-rises around the Palace of Culture, seen from the east, in the
 * Skyline's coordinate space (ground at y = 606, palace centred on x = 800).
 *
 * Heights use real values scaled by distance: the city-centre towers by
 * 1.88 units/m, the Wola cluster (further west) by 1.46 units/m. Left of the
 * palace sits the south-west group, right of it the north-west group and Wola.
 */

const G = 606;
const C = 1.88; // city centre
const WL = 1.46; // Wola cluster
const y = (m: number, f: number) => G - m * f;

type Material = 'blue' | 'dark' | 'bronze' | 'teal' | 'concrete' | 'light';

interface Tower {
  name: string;
  x: number;
  w: number;
  top: number; // main roof line
  mat: Material;
  shape?: (x: number, w: number, top: number) => string;
  extras?: (x: number, w: number, top: number, ink: string) => ReactNode;
  far?: boolean;
}

const box = (x: number, w: number, top: number) => `M${x} ${G}V${top}H${x + w}V${G}Z`;
const slope = (drop: number, highLeft = true) => (x: number, w: number, top: number) =>
  highLeft ? `M${x} ${G}V${top}L${x + w} ${top + drop}V${G}Z` : `M${x} ${G}V${top + drop}L${x + w} ${top}V${G}Z`;

/** Thin mast with crossbars from (cx, from) up to `to`. */
const mast = (cx: number, from: number, to: number, ink: string, bars = 3) => (
  <g stroke={ink} fill="none">
    <path d={`M${cx} ${from}V${to}`} strokeWidth="1.2" />
    {Array.from({ length: bars }, (_, i) => {
      const yy = from - ((from - to) * (i + 1)) / (bars + 1);
      return <path key={i} d={`M${cx - 2.5} ${yy}H${cx + 2.5}`} strokeWidth="0.8" />;
    })}
  </g>
);

/** Open frame rising above a roof (Rondo 1, Cosmopolitan). */
const frame = (x: number, w: number, top: number, h: number, ink: string, inset = 2) => (
  <g fill={ink}>
    <rect x={x + inset} y={top - h} width="3.2" height={h} />
    <rect x={x + w - inset - 3.2} y={top - h} width="3.2" height={h} />
    <rect x={x + inset} y={top - h} width={w - inset * 2} height="3" />
  </g>
);

const TOWERS: Tower[] = [
  // ---- Wola cluster (further west: smaller and hazier, drawn first) ----
  { name: 'Mennica Legacy Tower', x: 1100, w: 36, top: y(140, WL), mat: 'light', far: true },
  { name: 'Towarowa 22 (AFI)', x: 1574, w: 30, top: y(150, WL), mat: 'blue', far: true, shape: slope(8, false) },
  { name: 'Upper One', x: 1538, w: 32, top: y(131.5, WL), mat: 'light', far: true },
  { name: 'The Bridge', x: 1498, w: 34, top: y(166, WL), mat: 'light', far: true,
    extras: (x, w, top, ink) => (
      <g fill={ink}>
        {[0.2, 0.5, 0.8].map((f) => (
          <rect key={f} x={x + w * f - 1} y={top - 11} width="2" height="11" />
        ))}
      </g>
    ) },
  { name: 'Warsaw Trade Tower', x: 1460, w: 32, top: y(175, WL), mat: 'teal', far: true,
    shape: (x, w, top) => `M${x} ${G}V${top}L${x + w / 2} ${y(187.2, WL)}L${x + w} ${top}V${G}Z` },
  { name: 'Generation Park Y', x: 1422, w: 32, top: y(140, WL), mat: 'blue', far: true, shape: slope(8, false) },
  { name: 'Warsaw HUB', x: 1352, w: 62, top: y(130.3, WL), mat: 'blue', far: true,
    // twin towers on a shared base
    shape: (x, w, top) =>
      `M${x} ${G}V${top}H${x + 24}V${y(40, WL)}H${x + w - 24}V${top}H${x + w}V${G}Z` },
  { name: 'Skyliner II', x: 1316, w: 30, top: y(130, WL), mat: 'blue', far: true, shape: slope(10, true) },
  { name: 'Skyliner', x: 1276, w: 34, top: y(181, WL), mat: 'blue', far: true,
    shape: (x, w, top) => `M${x} ${G}V${y(195.1, WL)}L${x + w} ${top}V${G}Z` },
  { name: 'Warsaw UNIT', x: 1232, w: 38, top: y(200.7, WL), mat: 'light', far: true,
    shape: (x, w, top) => `M${x} ${G}V${top + 9}Q${x} ${top} ${x + 9} ${top}H${x + w - 9}Q${x + w} ${top} ${x + w} ${top + 9}V${G}Z` },
  { name: 'Q22', x: 1190, w: 36, top: y(155, WL), mat: 'blue', far: true,
    shape: (x, w, top) => `M${x} ${G}V${top + 34}L${x + w * 0.42} ${top}H${x + w}V${G}Z` },
  { name: 'Warsaw Spire', x: 1128, w: 50, top: y(180, WL), mat: 'teal', far: true,
    shape: (x, w, top) => `M${x} ${G}V${top}C${x + w * 0.35} ${top - 2} ${x + w * 0.75} ${top - 14} ${x + w} ${y(200, WL)}V${G}Z`,
    extras: (x, w, _top, ink) => mast(x + w - 2, y(200, WL), y(220, WL), ink, 2) },

  // ---- North-west of the palace (right) ----
  { name: 'Spektrum Tower', x: 1084, w: 38, top: y(116, C), mat: 'dark', shape: slope(12, true) },
  { name: 'Warsaw Financial Center', x: 1032, w: 44, top: y(132, C), mat: 'dark',
    shape: (x, w, top) =>
      `M${x} ${G}V${top}H${x + 6}V${top - 11}H${x + 12}V${y(143.9, C)}H${x + w - 12}V${top - 11}H${x + w - 6}V${top}H${x + w}V${G}Z` },
  { name: 'Rondo 1', x: 978, w: 48, top: y(144, C), mat: 'dark',
    extras: (x, w, top, ink) => frame(x, w, top, top - y(159.2, C), ink) },
  { name: 'Skysawa', x: 930, w: 40, top: y(155, C), mat: 'blue',
    shape: (x, w, top) => `M${x} ${G}V${top + 10}H${x + 10}V${top}H${x + w}V${G}Z` },
  // Varso (Foster + Partners): three slender volumes of different heights
  // stepping into one; the middle one is tallest (230 m, observation deck),
  // with a thin needle spire rising to 310 m.
  { name: 'Varso Tower', x: 870, w: 48, top: y(230, C), mat: 'light',
    shape: (x, w, top) =>
      `M${x} ${G}V${y(204, C)}H${x + 15}V${top}H${x + w - 13}V${y(216, C)}H${x + w}V${G}Z`,
    extras: (x, w, top, ink) => (
      <g>
        <path d={`M${x + 25.6} ${top}L${x + 27.5} ${y(310, C)}L${x + 29.4} ${top}Z`} fill={ink} />
        <rect x={x + 22} y={top - 4} width="11" height="4" fill={ink} />
        {/* grooves between the three volumes */}
        <rect x={x + 14.4} y={y(204, C)} width="1.2" height={G - y(204, C)} fill="#55697e" opacity="0.35" />
        <rect x={x + w - 13.6} y={y(216, C)} width="1.2" height={G - y(216, C)} fill="#55697e" opacity="0.35" />
      </g>
    ) },

  // ---- South-west of the palace (left) ----
  { name: 'Cosmopolitan', x: 404, w: 30, top: y(152, C), mat: 'dark',
    extras: (x, w, top, ink) => frame(x, w, top, top - y(165.4, C), ink, 1) },
  { name: 'Oxford Tower', x: 444, w: 52, top: y(132, C), mat: 'concrete',
    extras: (x, w, top, ink) => <rect x={x + w * 0.3} y={top - 13} width={w * 0.4} height="13" fill={ink} opacity="0.7" /> },
  // Roma Tower (170 m, under way): final visuals unpublished, so a plain slender
  // tower with the planted lower floors described in the press.
  { name: 'Roma Tower', x: 504, w: 34, top: y(170, C), mat: 'light',
    extras: (x, w, _top, _ink) => <rect x={x - 6} y={y(16, C)} width={w + 12} height={G - y(16, C)} fill="#6b7a3a" /> },
  { name: 'Marriott (LIM Center)', x: 546, w: 64, top: y(140, C), mat: 'bronze',
    extras: (x, w, top, ink) => mast(x + w / 2, top, y(170, C), ink, 4) },
  { name: 'Złota 44', x: 626, w: 62, top: y(192, C), mat: 'light',
    shape: (x, w, top) => `M${x} ${G}V${top + 150}C${x} ${top + 70} ${x + w * 0.35} ${top + 16} ${x + w} ${top}V${G}Z`,
    extras: (x, w, top, ink) => (
      <path d={`M${x + 6} ${G}V${top + 152}C${x + 6} ${top + 78} ${x + w * 0.4} ${top + 26} ${x + w - 2} ${top + 6}`} fill="none" stroke={ink} strokeWidth="1" opacity="0.6" />
    ) },
  { name: 'InterContinental', x: 698, w: 34, top: y(156, C), mat: 'teal',
    shape: (x, w, top) => `M${x} ${G}V${top}L${x + w} ${y(163.5, C)}V${G}Z` },
];


const GRADIENTS: Record<Material, [string, string, string]> = {
  blue: ['#7f98b4', '#a9b9c9', '#e3c9a4'],
  dark: ['#55697e', '#7f8e9e', '#c9ad8a'],
  bronze: ['#6e5a49', '#8e7663', '#cba57c'],
  teal: ['#6f8fa0', '#9fb5bf', '#dcc5a2'],
  concrete: ['#ddd4c8', '#d2c5b3', '#e6cba5'],
  light: ['#93a9bf', '#bcc8d3', '#ead1ad'],
};

export default function Towers({ id, detailed, sketch }: { id: string; detailed: boolean; sketch?: { fill: string; stroke: string } }) {
  const ref = (n: string) => `url(#${id}-${n})`;
  const ink = detailed ? '#c9d3dc' : sketch?.stroke ?? '#c9b7a1';

  const drawTower = (t: Tower, i: number) => {
    const d = (t.shape ?? box)(t.x, t.w, t.top);
    const clip = `${id}-tw${i}`;
    const sunLeft = t.x + t.w / 2 > 830; // rim light on the side facing the sun
    return (
      <g key={t.name}>
        {t.extras?.(t.x, t.w, t.top, detailed ? (t.mat === 'concrete' ? '#a99a88' : '#d7dee5') : ink)}
        <path d={d} fill={detailed ? ref(`m-${t.mat}`) : sketch?.fill} stroke={detailed ? undefined : sketch?.stroke} strokeWidth={detailed ? 0 : 1} />
        {detailed && (
          <>
            <clipPath id={clip}>
              <path d={d} />
            </clipPath>
            <g clipPath={`url(#${clip})`}>
              {t.mat === 'concrete' ? (
                <rect x={t.x} y={t.top - 30} width={t.w} height={G - t.top + 30} fill={ref('ribbons')} />
              ) : (
                <>
                  <rect x={t.x} y={t.top - 60} width={t.w} height={G - t.top + 60} fill={ref('floors')} />
                  <rect x={t.x} y={t.top - 60} width={t.w} height={G - t.top + 60} fill={ref('mullions')} />
                </>
              )}
              <rect x={sunLeft ? t.x : t.x + t.w - 3} y={t.top - 60} width="3" height={G - t.top + 60} fill="#ffe9c4" opacity="0.6" />
              <rect x={sunLeft ? t.x + t.w - 5 : t.x} y={t.top - 60} width="5" height={G - t.top + 60} fill="#3f4c5a" opacity="0.12" />
            </g>
          </>
        )}
      </g>
    );
  };

  const far = TOWERS.filter((t) => t.far);
  const near = TOWERS.filter((t) => !t.far);

  return (
    <g>
      {detailed && (
        <defs>
          {(Object.keys(GRADIENTS) as Material[]).map((m) => (
            <linearGradient key={m} id={`${id}-m-${m}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={GRADIENTS[m][0]} />
              <stop offset="0.55" stopColor={GRADIENTS[m][1]} />
              <stop offset="1" stopColor={GRADIENTS[m][2]} />
            </linearGradient>
          ))}
          <pattern id={`${id}-floors`} width="6" height="5" patternUnits="userSpaceOnUse">
            <rect width="6" height="0.9" fill="#ffffff" opacity="0.3" />
          </pattern>
          <pattern id={`${id}-mullions`} width="5" height="6" patternUnits="userSpaceOnUse">
            <rect width="0.7" height="6" fill="#ffffff" opacity="0.18" />
          </pattern>
          <pattern id={`${id}-ribbons`} width="6" height="6" patternUnits="userSpaceOnUse">
            <rect y="2" width="6" height="2.6" fill="#5d5650" opacity="0.55" />
          </pattern>
        </defs>
      )}
      {/* Wola sits further away: slightly faded into the haze */}
      <g opacity={detailed ? 0.82 : 1}>{far.map((t) => drawTower(t, TOWERS.indexOf(t)))}</g>
      {near.map((t) => drawTower(t, TOWERS.indexOf(t)))}
    </g>
  );
}
