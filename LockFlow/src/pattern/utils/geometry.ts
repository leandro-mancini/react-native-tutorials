export type Point = { x: number; y: number };

export const GRID_INDEXES = [...Array(9).keys()];
export const BOX_SIZE = 300;
export const PADDING = 48;
export const DOT_R = 12;
export const MOVE_HIT_R = 24; // raio de acerto para arrasto

export function idxToRC(i: number) { return { r: Math.floor(i / 3), c: i % 3 }; }

export function isAdjacentOrTwoSteps(a: number, b: number) {
  const A = idxToRC(a), B = idxToRC(b);
  const dr = Math.abs(B.r - A.r);
  const dc = Math.abs(B.c - A.c);
  return (
    (dr <= 1 && dc <= 1 && (dr + dc) > 0) ||
    (dr === 2 && dc === 0) || (dr === 0 && dc === 2) || (dr === 2 && dc === 2)
  );
}

export function intermediateIndex(a: number, b: number): number | null {
  const A = idxToRC(a), B = idxToRC(b);
  const dr = B.r - A.r, dc = B.c - A.c;
  const isStraightTwo =
    (A.r === B.r && Math.abs(dc) === 2) ||
    (A.c === B.c && Math.abs(dr) === 2) ||
    (Math.abs(dr) === 2 && Math.abs(dc) === 2);
  if (!isStraightTwo) return null;
  const mid = { r: (A.r + B.r) / 2, c: (A.c + B.c) / 2 };
  return (Number.isInteger(mid.r) && Number.isInteger(mid.c)) ? (mid.r * 3 + mid.c) : null;
}

export function centersForGrid(): Point[] {
  const area = BOX_SIZE - PADDING * 2;
  const step = area / 2;
  const base = PADDING;
  const pts: Point[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
    pts.push({ x: base + c * step, y: base + r * step });
  return pts;
}

export function nearestIndexAny(p: Point, centers: Point[]) {
  let idx = 0, best = Number.MAX_VALUE;
  centers.forEach((c, i) => {
    const d = Math.hypot(p.x - c.x, p.y - c.y);
    if (d < best) { best = d; idx = i; }
  });
  return idx;
}

export function nearestIndexWithin(p: Point, centers: Point[], radius: number): number | null {
  let idx: number | null = null, best = Number.MAX_VALUE;
  centers.forEach((c, i) => {
    const d = Math.hypot(p.x - c.x, p.y - c.y);
    if (d < best) { best = d; idx = i; }
  });
  return best <= radius ? idx : null;
}

export function buildPointsString(indices: number[], centers: Point[], tail?: Point) {
  const base = indices.map(i => `${centers[i].x},${centers[i].y}`).join(' ');
  return tail ? (base ? `${base} ${tail.x},${tail.y}` : `${tail.x},${tail.y}`) : base;
}
