function hashInteger(x: number, y: number, seed: number): number {
  let value =
    Math.imul(x | 0, 374761393) +
    Math.imul(y | 0, 668265263) +
    Math.imul(seed | 0, 982451653);
  value = (value ^ (value >>> 13)) >>> 0;
  value = Math.imul(value, 1274126177) >>> 0;
  value = (value ^ (value >>> 16)) >>> 0;
  return value / 4294967296;
}

function smoothStep(value: number): number {
  return value * value * (3 - 2 * value);
}

export function valueNoise(x: number, y: number, seed: number): number {
  const left = Math.floor(x);
  const top = Math.floor(y);
  const fractionX = smoothStep(x - left);
  const fractionY = smoothStep(y - top);

  const topLeft = hashInteger(left, top, seed);
  const topRight = hashInteger(left + 1, top, seed);
  const bottomLeft = hashInteger(left, top + 1, seed);
  const bottomRight = hashInteger(left + 1, top + 1, seed);

  const topInterpolation = topLeft + (topRight - topLeft) * fractionX;
  const bottomInterpolation =
    bottomLeft + (bottomRight - bottomLeft) * fractionX;
  return (
    topInterpolation + (bottomInterpolation - topInterpolation) * fractionY
  );
}

export function fractionalBrownianMotion(
  x: number,
  y: number,
  seed: number,
  octaves: number,
  frequency: number = 1,
): number {
  let total = 0;
  let amplitude = 1;
  let currentFrequency = frequency;
  let normalization = 0;
  for (let octave = 0; octave < octaves; octave += 1) {
    total +=
      valueNoise(x * currentFrequency, y * currentFrequency, seed + octave) *
      amplitude;
    normalization += amplitude;
    amplitude *= 0.5;
    currentFrequency *= 2;
  }
  return total / normalization;
}
