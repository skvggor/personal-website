import { describe, expect, it } from "vitest";
import { computeStageState } from "@/lib/particles/timeline";

const OPTIONS = {
  morphMilliseconds: 600,
  holdMilliseconds: 400,
  stageCount: 7,
};

describe("computeStageState", () => {
  it("starts at the first stage with zero progress", () => {
    const state = computeStageState({ ...OPTIONS, elapsedMilliseconds: 0 });
    expect(state.fromIndex).toBe(0);
    expect(state.toIndex).toBe(1);
    expect(state.rawProgress).toBe(0);
    expect(state.floatingFactor).toBe(0);
    expect(state.settled).toBe(false);
  });

  it("morphs within the morph window and holds after it", () => {
    const midMorph = computeStageState({
      ...OPTIONS,
      elapsedMilliseconds: 300,
    });
    expect(midMorph.fromIndex).toBe(0);
    expect(midMorph.toIndex).toBe(1);
    expect(midMorph.rawProgress).toBeCloseTo(0.5, 5);

    const duringHold = computeState(700);
    expect(duringHold.rawProgress).toBe(1);
    expect(duringHold.fromIndex).toBe(0);
    expect(duringHold.toIndex).toBe(1);
  });

  it("advances to the next transition after one full step", () => {
    const state = computeState(1000);
    expect(state.fromIndex).toBe(1);
    expect(state.toIndex).toBe(2);
    expect(state.rawProgress).toBe(0);
  });

  it("settles on the final stage with full floating", () => {
    const state = computeState(6000);
    expect(state.settled).toBe(true);
    expect(state.toIndex).toBe(6);
    expect(state.rawProgress).toBe(1);
    expect(state.floatingFactor).toBe(1);
  });

  it("ramps floating only across the final transition", () => {
    expect(computeState(4000).floatingFactor).toBe(0);
    expect(computeState(5500).floatingFactor).toBeCloseTo(0.5, 5);
    expect(computeState(6000).floatingFactor).toBe(1);
  });

  it("handles a single stage gracefully", () => {
    const state = computeStageState({
      elapsedMilliseconds: 100,
      morphMilliseconds: 600,
      holdMilliseconds: 400,
      stageCount: 1,
    });
    expect(state.settled).toBe(true);
    expect(state.rawProgress).toBe(1);
  });
});

function computeState(elapsedMilliseconds: number) {
  return computeStageState({ ...OPTIONS, elapsedMilliseconds });
}
