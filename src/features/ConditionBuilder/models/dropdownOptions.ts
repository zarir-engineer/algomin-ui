// src/features/ConditionBuilder/models/dropdownOptions.ts

export const DROPDOWN_OPTIONS: Record<string, string[]> = {
  symbol: ['SBIN', 'NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'],
  length: ['5', '10', '14', '20', '21', '50', '100', '200'],
  period: ['3', '5', '10', '14', '20', '50', '100'],
  timeframe: ['1m', '5m', '15m', '30m', '1h', '1d', '1w'],
  series: [
    'LTP',
    'VWAP',
    'SMA',
    'EMA',
    'MACD',
    'RSI',
    'Supertrend',
    'Volume',
    'Bid Price',
    'Ask Price',
    'ADX',
    'OBV',
    'ATR',
    'CMO',
  ],
};
