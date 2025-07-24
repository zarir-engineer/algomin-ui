// src/lib/dummyTicks.ts
export interface Tick { time: number; price: number; }

export function makeDummyTicks(
  length = 50,
  basePrice = 100,
  volatility = 1
): Tick[] {
  const now = Date.now();
  const interval = 60_000; // 1 minute
  let price = basePrice;
  const ticks: Tick[] = [];

  for (let i = length - 1; i >= 0; i--) {
    // step back i * interval
    const time = now - i * interval;
    // small random walk
    price = price + (Math.random() * volatility * 2 - volatility);
    ticks.push({ time, price: Math.max(0, price) });
  }
  return ticks;
}
