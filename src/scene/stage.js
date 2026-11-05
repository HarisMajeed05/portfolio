import { hold } from "../scroll";

// Where everything sits along the flight path. The camera only ever moves
// forward (down -z), each chapter is a stop on the way.
export const GATE_Z0 = -48;
export const GATE_GAP = 17;
export const GX = [1.1, -1.3, 1.4, -1.0, 1.3, -0.5];
export const RING_Z = -190;
export const RING_R = 9.9;
export const ORBIT_Z = -262;
export const END_Z = -332;

const lerp = (a, b, t) => a + (b - a) * t;

export function tunnelX(p) {
  const k = Math.min(GX.length - 2, Math.max(0, Math.floor(p)));
  return lerp(GX[k], GX[k + 1], p - k);
}

// camera pose for chapter i at inner progress u
export function pose(i, u, wide) {
  const shift = wide ? 0.2 : 0;
  switch (i) {
    case 0:
      return { x: 0, y: 0, z: 10, shift };
    case 1:
      return { x: 0, y: 0, z: 9, shift: wide ? 0.24 : 0 };
    case 2: {
      const p = hold(u, GX.length);
      return {
        x: tunnelX(p),
        y: Math.sin(p * 1.7) * 0.25,
        z: GATE_Z0 + (wide ? 10 : 15) - GATE_GAP * p,
        shift: wide ? 0.17 : 0,
      };
    }
    case 3:
      // a little off center so the front card stays as big as before
      // on phones the card sits higher, the caption needs the lower half
      return { x: 0, y: wide ? -0.5 : -1.3, z: RING_Z - 1.4, shift: 0 };
    case 4:
      return { x: 0, y: 0.1, z: ORBIT_Z + 15, shift: wide ? 0.12 : 0 };
    default:
      return { x: 0, y: 0, z: END_Z + 10, shift };
  }
}
