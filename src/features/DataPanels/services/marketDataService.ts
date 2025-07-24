// utils/market.ts
export function isMarketClosed() {
  const now = new Date();
  const istOffset = 5.5 * 60; // minutes offset for IST
  const local = new Date(now.getTime() + istOffset * 60000);

  const day = local.getDay(); // Sunday = 0, Saturday = 6
  const hours = local.getHours();
  const minutes = local.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  return (
    day === 0 || // Sunday
    day === 6 || // Saturday
    totalMinutes < (9 * 60 + 15) || // before 9:15 AM
    totalMinutes > (15 * 60 + 30)   // after 3:30 PM
  );
}
