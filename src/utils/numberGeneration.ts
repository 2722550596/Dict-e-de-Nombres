export function generateNumbers(range: [number, number], quantity: number): number[] {
  const [min, max] = range;
  
  // 特殊处理整十数
  if (min === 10 && max === 90) {
    return generateTensNumbers(quantity);
  }
  
  const fullRange = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const result: number[] = [];

  while (result.length < quantity) {
    const shuffledCycle = [...fullRange].sort(() => Math.random() - 0.5);
    const remainingNeeded = quantity - result.length;
    result.push(...shuffledCycle.slice(0, remainingNeeded));
  }
  
  return result;
}

function generateTensNumbers(quantity: number): number[] {
  const tens = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const result: number[] = [];

  while (result.length < quantity) {
    const shuffledCycle = [...tens].sort(() => Math.random() - 0.5);
    const remainingNeeded = quantity - result.length;
    result.push(...shuffledCycle.slice(0, remainingNeeded));
  }
  
  return result;
}
