// src/lib/marketHours.ts

/**
 * Returns true if the current local time is within regular market hours:
 *   - Monday–Friday
 *   - 09:15–15:30
 */
export function isMarketOpen(now: Date = new Date()): boolean {
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, … 6 = Saturday
  if (day === 0 || day === 6) {
    return false; // weekend
  }

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const hm = hours * 100 + minutes; // e.g. 9:30 → 930

  // open at 09:15 (915) and close at 15:30 (1530), inclusive
  return hm >= 915 && hm <= 1530;
}
