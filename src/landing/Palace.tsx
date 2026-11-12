import type { ReactNode } from 'react';

/**
 * Palace of Culture and Science (Warsaw), east elevation, drawn in the
 * Skyline's coordinate space: centred on x = 800, ground at y = 606,
 * spire tip at y ≈ 52.
 *
 * Built from its characteristic parts: long low wings, a base block with a
 * columned entrance, one tall shaft with stepped corners, a projecting
 * central bay and ~30 floors of windows, decorative parapets ("attics")
 * lined with small spires at every setback, a short clock tower with slit
 * windows, an arcaded crown and the spire.
 */

export interface PalaceColors {
  face: string; // main wall fill (can be a gradient url)
  window: string;
  windowOpacity: number;
  light: string; // projecting pilasters, cornices, pinnacles
  shade: string; // recesses and shadow edges
  spire: string;
  stroke?: string;
}

const MID = 800;
const mirror = (x: number, w: number) => 2 * MID - x - w;

export default function Palace({ c, detailed }: { c: PalaceColors; detailed: boolean }) {
  const out: ReactNode[] = [];
  let k = 0;
  const key = () => k++;
  const sw = c.stroke ? 0.8 : 0;

  const rect = (x: number, y: number, w: number, h: number, fill: string, opacity = 1) =>
    out.push(<rect key={key()} x={x} y={y} width={w} height={h} fill={fill} opacity={opacity} />);

  const face = (x1: number, x2: number, top: number, bottom: number) =>
    out.push(
      <rect key={key()} x={x1} y={top} width={x2 - x1} height={bottom - top} fill={c.face} stroke={c.stroke} strokeWidth={sw} />,
    );

  /** Windows at the given column x positions, from y1 to y2 every `step`. */
  const windows = (cols: number[], y1: number, y2: number, step: number, w: number, h: number) => {
    if (!detailed) return;
    for (let y = y1; y + h <= y2; y += step) {
      for (const x of cols) rect(x, y, w, h, c.window, c.windowOpacity);
    }
  };

  /** Evenly spaced columns between x1 and x2 (symmetric about the middle). */
  const cols = (x1: number, x2: number, step: number, w: number) => {
    const out: number[] = [];
    const n = Math.floor((x2 - x1 - w) / step) + 1;
    const start = x1 + (x2 - x1 - ((n - 1) * step + w)) / 2;
    for (let i = 0; i < n; i++) out.push(start + i * step);
    return out;
  };

  const cornice = (x1: number, x2: number, y: number) => rect(x1 - 1.5, y - 1.5, x2 - x1 + 3, 2.6, c.light);

  /** Decorative parapet: a band topped with a row of small spires. */
  const attic = (x1: number, x2: number, y: number, step: number, h: number) => {
    rect(x1, y - 3, x2 - x1, 3, c.light);
    for (let x = x1 + step / 2; x < x2; x += step) {
      out.push(
        <path
          key={key()}
          d={`M${x - 1.1} ${y - 3}V${y - 3 - h * 0.55}L${x} ${y - 3 - h}L${x + 1.1} ${y - 3 - h * 0.55}V${y - 3}Z`}
          fill={c.light}
        />,
      );
    }
  };

  /** Corner turret: shaft + pointed cap. */
  const turret = (x: number, y: number, w: number, h: number) =>
    out.push(
      <g key={key()} fill={c.light} stroke={c.stroke} strokeWidth={sw * 0.6}>
        <rect x={x - w / 2} y={y - h} width={w} height={h} />
        <path d={`M${x - w / 2 - 0.8} ${y - h}L${x} ${y - h - h * 0.75}L${x + w / 2 + 0.8} ${y - h}Z`} />
      </g>,
    );

  // ---- Spire (behind everything) -------------------------------------------
  out.push(<path key={key()} d="M797.4 156L800 50L802.6 156Z" fill={c.spire} stroke={c.stroke} strokeWidth={sw * 0.6} />);
  rect(796.6, 138, 6.8, 2.4, c.light);
  rect(797.4, 118, 5.2, 2, c.light);
  rect(798, 96, 4, 1.6, c.light);

  // ---- Outer wings ---------------------------------------------------------
  face(592, 1008, 578, 606);
  windows(cols(596, 1004, 6, 2.2), 583, 604, 7.5, 2.2, 3.4);
  cornice(592, 1008, 578);

  // ---- Inner wings ---------------------------------------------------------
  face(646, 954, 556, 606);
  windows(cols(650, 950, 6, 2.2), 561, 604, 7.5, 2.2, 3.6);
  attic(646, 954, 556, 7, 4);

  // ---- Base block with columned entrance -------------------------------------
  face(710, 890, 500, 606);
  rect(710, 500, 7, 106, c.light, 0.8);
  rect(883, 500, 7, 106, c.light, 0.8);
  // upper floors
  windows(cols(720, 880, 7, 2.6), 508, 552, 8.6, 2.6, 4.6);
  // ground floors either side of the portico
  windows(
    cols(720, 880, 7, 2.6).filter((x) => x < 766 || x > 832),
    562,
    602,
    8.6,
    2.6,
    5,
  );
  // portico: shaded recess, six columns, entablature
  rect(768, 558, 64, 48, c.shade, detailed ? 0.55 : 0.35);
  for (let i = 0; i < 6; i++) rect(772 + i * 10.2, 560, 3.2, 46, c.light);
  rect(765, 553, 70, 5, c.light);
  rect(780, 545, 40, 8, c.face);
  rect(780, 545, 40, 1.6, c.light);
  cornice(710, 890, 500);
  attic(710, 890, 500, 6.5, 6);
  turret(714, 497, 7, 15);
  turret(886, 497, 7, 15);

  // ---- Main shaft ------------------------------------------------------------
  face(752, 848, 252, 500);
  // stepped corners: outer projecting strip + inner shadowed step
  rect(752, 252, 6, 248, c.light, 0.85);
  rect(mirror(752, 6), 252, 6, 248, c.light, 0.85);
  rect(758, 252, 3, 248, c.shade, 0.35);
  rect(mirror(758, 3), 252, 3, 248, c.shade, 0.35);
  // projecting central bay with its own edges
  rect(787, 252, 26, 248, c.light, 0.35);
  rect(787, 252, 1.6, 248, c.light);
  rect(mirror(787, 1.6), 252, 1.6, 248, c.light);
  rect(mirror(787, 1.6) + 1.6, 252, 1.6, 248, c.shade, 0.4);
  // window columns: four on each side, three in the central bay (~30 floors)
  const side = [764.5, 770, 775.5, 781];
  const shaftCols = [...side, 791.2, 798.7, 806.2, ...side.map((x) => mirror(x, 2.4))];
  windows(shaftCols, 260, 496, 7.8, 2.4, 4.4);
  // belt courses
  cornice(752, 848, 340);
  cornice(752, 848, 420);
  cornice(752, 848, 252);
  attic(752, 848, 252, 6, 7);
  turret(756, 249, 7, 17);
  turret(844, 249, 7, 17);

  // ---- Clock tower -------------------------------------------------------------
  face(770, 830, 198, 252);
  rect(770, 198, 5, 54, c.light, 0.85);
  rect(mirror(770, 5), 198, 5, 54, c.light, 0.85);
  // tall slit windows below the clock
  if (detailed) {
    for (const x of cols(777, 823, 7.4, 2.2)) rect(x, 228, 2.2, 19, c.window, c.windowOpacity);
  }
  out.push(
    <g key={key()}>
      <circle cx={MID} cy="212" r="6.2" fill={detailed ? '#fff7e6' : c.light} stroke={detailed ? '#9b7a52' : c.stroke} strokeWidth="1" />
      {detailed && <path d="M800 212V207.6M800 212L803.2 213.6" stroke="#5f4529" strokeWidth="0.9" strokeLinecap="round" />}
    </g>,
  );
  cornice(770, 830, 198);
  attic(770, 830, 198, 5, 5);
  turret(773.5, 195, 6, 14);
  turret(826.5, 195, 6, 14);

  // ---- Arcaded crown -----------------------------------------------------------
  face(782, 818, 168, 198);
  out.push(
    <g key={key()} fill={c.shade} opacity={detailed ? 0.55 : 0.4}>
      {[786, 796, 806].map((x) => (
        <path key={x} d={`M${x} 195V181a4 4 0 0 1 8 0V195Z`} />
      ))}
    </g>,
  );
  cornice(782, 818, 168);
  turret(784.5, 165, 4, 11);
  turret(815.5, 165, 4, 11);

  // ---- Lantern -----------------------------------------------------------------
  face(790, 810, 156, 168);
  if (detailed) {
    rect(794, 159, 2, 6, c.window, c.windowOpacity);
    rect(804, 159, 2, 6, c.window, c.windowOpacity);
  }
  cornice(790, 810, 156);

  return <g>{out}</g>;
}
