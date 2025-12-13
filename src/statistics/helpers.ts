export function difficultyToNumber (difficulty: string): number {
    const map: Record<string, number> = {
        FÁCIL: 1,
        MEDIO: 2,
        DIFÍCIL: 3
    };
    return map[difficulty.toUpperCase()] ?? 0;
    }

export function correlation(xs: number[], ys: number[]) : number {
    const n = xs.length;
    if (n === 0 || ys.length !== n) return 0;

    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;

    const numerator = xs.reduce((sum, x, i) => 
    sum + (x - meanX) * (ys[i] - meanY), 0);

    const denominator = Math.sqrt(
        xs.reduce((s,x) => s + (x - meanX) ** 2, 0) *
        ys.reduce((s,y) => s + (y - meanY) ** 2, 0)
    );

    return denominator === 0 ? 0 : numerator / denominator;
}    

export function balanceScore(values: number[]): number {
  const sum = values.reduce((a, b) => a + b, 0);
  if (sum === 0) return 0;

  const mean = sum / values.length;
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
  const maxVariance = Math.pow(mean, 2); // referencia
  return 1 - Math.min(1, variance / maxVariance);
}

export function subtopicVarietyScore(subtopicCounts: Record<number, number>): number {
  const values = Object.values(subtopicCounts);
  if (values.length === 0) return 0;

  const maxCount = Math.max(...values);
  const minCount = Math.min(...values);

  if (maxCount === 0) return 0;

  return minCount / maxCount; // simple, eficaz
}

export function normalizeDate(d: Date) {
  d.setMilliseconds(0);
  return d;
}
