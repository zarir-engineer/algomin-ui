// utils/market.ts
export function isMarketClosed(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  // Market open Monday–Friday from 9:00 to 15:30
  const afterOpen  = hour > 9  || (hour === 9  && now.getMinutes() >= 0);
  const beforeClose = hour < 15 || (hour === 15 && now.getMinutes() < 30);
  return day === 0 || day === 6 || !(afterOpen && beforeClose);
}
