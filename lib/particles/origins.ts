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

type SourceIndexResolver = (index: number, sourceCount: number) => number;

function buildResampledStage(
  sourcePositions: Float32Array,
  sourceColors: Float32Array,
  targetCount: number,
  resolveSourceIndex: SourceIndexResolver,
): ResampledStage {
  const positions = new Float32Array(targetCount * 2);
  const colors = new Float32Array(targetCount * 3);
  const sourceCount = sourcePositions.length / 2;
  if (sourceCount === 0 || targetCount <= 0) {
    return { positions, colors };
  }
  for (let index = 0; index < targetCount; index++) {
    const sourceIndex = resolveSourceIndex(index, sourceCount);
    positions[index * 2] = sourcePositions[sourceIndex * 2];
    positions[index * 2 + 1] = sourcePositions[sourceIndex * 2 + 1];
    colors[index * 3] = sourceColors[sourceIndex * 3];
    colors[index * 3 + 1] = sourceColors[sourceIndex * 3 + 1];
    colors[index * 3 + 2] = sourceColors[sourceIndex * 3 + 2];
  }
  return { positions, colors };
}

export function resampleStage(
  sourcePositions: Float32Array,
  sourceColors: Float32Array,
  targetCount: number,
  seed: number,
): ResampledStage {
  const random = createRandom(seed);
  return buildResampledStage(
    sourcePositions,
    sourceColors,
    targetCount,
    (_index, sourceCount) => Math.floor(random() * sourceCount),
  );
}

export function uniformResampleStage(
  sourcePositions: Float32Array,
  sourceColors: Float32Array,
  targetCount: number,
): ResampledStage {
  const sourceCount = sourcePositions.length / 2;
  return buildResampledStage(
    sourcePositions,
    sourceColors,
    targetCount,
    (index) =>
      Math.min(
        sourceCount - 1,
        Math.floor((index * sourceCount) / targetCount),
      ),
  );
}
