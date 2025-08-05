// src/features/ConditionBuilder/models/conditionGroups.ts

export interface ConditionOption {
  key: string;
  label: string;
  params: string[]; // Options in Tulip => the indicator inputs
}

export interface ConditionGroup {
  label: string;
  options: ConditionOption[];
}

export const GROUPS: ConditionGroup[] = [
  {
    label: 'Basic Price',
    options: [
      { key: 'avgprice', label: 'Average Price', params: [] },
      { key: 'medprice', label: 'Median Price', params: [] },
      { key: 'typprice', label: 'Typical Price', params: [] },
    ],
  },
  {
    label: 'Volatility',
    options: [
      { key: 'atr', label: 'Average True Range (ATR)', params: [{ name: 'period', type: 'number' }] },
      { key: 'natr', label: 'Normalized ATR', params: [{ name: 'period', type: 'number' }] },
      { key: 'bbands', label: 'Bollinger Bands', params: [{ name: 'period', type: 'number' }, { name: 'series', type: 'series' }] },
      { key: 'var', label: 'Variance Over Period', params: [{ name: 'period', type: 'number' }] },
    ],
  },
  {
    label: 'Momentum & Oscillators',
    options: [
      { key: 'rsi', label: 'RSI', params: [{ name: 'period', type: 'number' }] },
      { key: 'cmo', label: 'Chande Momentum Oscillator (CMO)', params: [{ name: 'period', type: 'number' }, { name: 'series', type: 'series' }] },
      { key: 'macd', label: 'MACD', params: [
        { name: 'fast', type: 'number' },
        { name: 'slow', type: 'number' },
        { name: 'signal', type: 'number' }
      ] },
      { key: 'mfi', label: 'Money Flow Index (MFI)', params: [{ name: 'period', type: 'number' }] },
      { key: 'stoch', label: 'Stochastic Oscillator', params: [
        { name: 'fastK', type: 'number' },
        { name: 'slowK', type: 'number' },
        { name: 'slowD', type: 'number' }
      ] },
      { key: 'ultosc', label: 'Ultimate Oscillator', params: [
        { name: 'period1', type: 'number' },
        { name: 'period2', type: 'number' },
        { name: 'period3', type: 'number' }
      ] },
    ],
  },
  {
    label: 'Trend & Smoothing',
    options: [
      { key: 'ema', label: 'Exponential Moving Avg (EMA)', params: [{ name: 'period', type: 'number' }] },
      { key: 'sma', label: 'Simple Moving Avg (SMA)', params: [{ name: 'period', type: 'number' }] },
      { key: 'tema', label: 'Triple EMA (TEMA)', params: [{ name: 'period', type: 'number' }] },
      { key: 'dema', label: 'Double EMA (DEMA)', params: [{ name: 'period', type: 'number' }] },
//       { key: 'linreg', label: 'Linear Regression', params: [{ name: 'period', type: 'number' }] },
      {
        key: 'linreg',
        label: 'Linear Regression',
        params: [
          { name: 'series', type: 'series' },
          { name: 'period', type: 'number' }
        ]
      },
      {
        key: 'linregangle',
        label: 'Linear Regression Angle',
        params: [
          { name: 'series', type: 'series' },
          { name: 'period', type: 'number' }
        ]
      },
      {
        key: 'linregintercept',
        label: 'Linear Regression Intercept',
        params: [
          { name: 'series', type: 'series' },
          { name: 'period', type: 'number' }
        ]
      },
      {
        key: 'linregslope',
        label: 'Linear Regression Slope',
        params: [
          { name: 'series', type: 'series' },
          { name: 'period', type: 'number' }
        ]
      }
    ],
  },
];
