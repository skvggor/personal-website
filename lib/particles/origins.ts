export function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let temporary = Math.imul(state ^ (state >>> 15), 1 | state);
    temporary =
      (temporary + Math.imul(temporary ^ (temporary >>> 7), 61 | temporary)) ^
      temporary;
    return ((temporary ^ (temporary >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ResampledStage {
  readonly positions: Float32Array;
  readonly colors: Float32Array;
}

export function resampleStage(
  sourcePositions: Float32Array,
  sourceColors: Float32Array,
  targetCount: number,
  seed: number,
): ResampledStage {
  const positions = new Float32Array(targetCount * 2);
  const colors = new Float32Array(targetCount * 3);
  const sourceCount = sourcePositions.length / 2;
  if (sourceCount === 0 || targetCount <= 0) {
    return { positions, colors };
  }
  const random = createRandom(seed);
  for (let index = 0; index < targetCount; index++) {
    const sourceIndex = Math.floor(random() * sourceCount);
    positions[index * 2] = sourcePositions[sourceIndex * 2];
    positions[index * 2 + 1] = sourcePositions[sourceIndex * 2 + 1];
    colors[index * 3] = sourceColors[sourceIndex * 3];
    colors[index * 3 + 1] = sourceColors[sourceIndex * 3 + 1];
    colors[index * 3 + 2] = sourceColors[sourceIndex * 3 + 2];
  }
  return { positions, colors };
}
