export const math = {
  //linear interpolation func
  // will use it to create same fake data
  lerp: (a: number, b: number, t: number) => {
    return a + (b - a) * t;
  },
  //format numbers
  formatnumber: (n: number, dec = 0) => {
    return n.toFixed(dec);
  },
  invLerp: (a: number, b: number, v: number) => {
    return (v - a) / (b - a);
  },
  remap: (
    oldA: number,
    oldB: number,
    newA: number,
    newB: number,
    v: number
  ) => {
    return math.lerp(newA, newB, math.invLerp(oldA, oldB, v));
  },
  remapPoint: (
    oldBounds: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    },
    newBounds: typeof oldBounds,
    point: number[]
  ): [number, number] => {
    return [
      math.remap(
        oldBounds.left,
        oldBounds.right,
        newBounds.left,
        newBounds.right,
        point[0]
      ),
      math.remap(
        oldBounds.top,
        oldBounds.bottom,
        newBounds.top,
        newBounds.bottom,
        point[1]
      ),
    ];
  },
  add: (p1: number[], p2: number[]) => {
    return [p1[0] + p2[0], p1[1] + p2[1]];
  },

  subtract: (p1: number[], p2: number[]) => {
    return [p1[0] - p2[0], p1[1] - p2[1]];
  },

  scale: (p: number[], scaler: number) => {
    return [p[0] * scaler, p[1] * scaler];
  },
};
