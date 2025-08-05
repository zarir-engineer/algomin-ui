export const PARAM_OPTIONS: Record<string, string[]> = {
  // For indicators that require price series
  series: [
    'CLOSE',
    'OPEN',
    'HIGH',
    'LOW',
    'VOLUME',
    'OHLC4',    // (Open + High + Low + Close) / 4
    'HL2',      // (High + Low) / 2
    'HLC3',     // (High + Low + Close) / 3
    'WMA',      // Weighted Moving Average
  ],

  // For symbol dropdowns
  underlying: [
    'NSE:NIFTY',
    'NSE:BANKNIFTY',
    'NSE:RELIANCE',
    'NSE:TCS',
    'NSE:INFY',
  ],

  synthetic: [
    'FUTURE:NIFTY',
    'FUTURE:BANKNIFTY',
    'SPREAD:NIFTY-BANKNIFTY',
    'OPTIONS:CALL-SELL',
    'OPTIONS:PUT-BUY',
  ],

  // Standard timeframes for candles
  timeframe: [
    '1min',
    '3min',
    '5min',
    '15min',
    '30min',
    '1h',
    '1d',
  ],

  // Common options for trend direction
  direction: ['UP', 'DOWN', 'SIDEWAYS'],

  // Useful for boolean-like flags
  signal: ['BUY', 'SELL', 'NEUTRAL'],

  // Future extensions...
  sector: ['IT', 'BANKING', 'PHARMA', 'AUTO', 'ENERGY'],
  exchange: ['NSE', 'BSE', 'MCX', 'CDS'],
};
