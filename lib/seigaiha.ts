export function seigaihaArcs(
  width: number,
  height: number,
  radius: number,
): string[] {
  const radii = [radius, (radius * 2) / 3, radius / 3];
  const paths: string[] = [];

  let row = 0;
  for (let y = 0; y <= height + radius; y += radius) {
    const offset = row % 2 ? radius : 0;
    for (let x = -radius + offset; x <= width + radius; x += 2 * radius) {
      for (const r of radii) {
        paths.push(
          `M${(x - r).toFixed(2)},${y.toFixed(2)} A${r.toFixed(2)},${r.toFixed(2)} 0 0 0 ${(x + r).toFixed(2)},${y.toFixed(2)}`,
        );
      }
    }
    row++;
  }

  return paths;
}
