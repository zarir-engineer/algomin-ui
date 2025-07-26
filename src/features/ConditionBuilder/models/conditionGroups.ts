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
      { key: 'avgprice', label: 'Average Price', params: [] },        // no params :contentReference[oaicite:1]{index=1}
      { key: 'medprice', label: 'Median Price', params: [] },         // no params :contentReference[oaicite:2]{index=2}
      { key: 'typprice', label: 'Typical Price', params: [] },         // no params :contentReference[oaicite:3]{index=3}
    ],
  },
  {
    label: 'Volatility',
    options: [
      { key: 'atr', label: 'Average True Range (ATR)', params: ['symbol', 'period'] },    // 1 option period :contentReference[oaicite:4]{index=4}
      { key: 'natr', label: 'Normalized ATR', params: ['symbol', 'period'] },            // requires period :contentReference[oaicite:5]{index=5}
      { key: 'bbands', label: 'Bollinger Bands', params: ['symbol', 'timeperiod', 'stdDev'] }, // 2 options :contentReference[oaicite:6]{index=6}
      { key: 'var', label: 'Variance Over Period', params: ['symbol', 'period'] },        // requires period :contentReference[oaicite:7]{index=7}
    ],
  },
  {
    label: 'Momentum & Oscillators',
    options: [
      { key: 'rsi', label: 'RSI', params: ['symbol', 'period'] },             // optInTimePeriod :contentReference[oaicite:8]{index=8}
      { key: 'cmo', label: 'Chande Momentum Oscillator (CMO)', params: ['series', 'period'] }, // [optInTimePeriod] :contentReference[oaicite:9]{index=9}
      { key: 'macd', label: 'MACD', params: ['symbol', 'fast', 'slow', 'signal'] }, // 3 options :contentReference[oaicite:10]{index=10}
      { key: 'mfi', label: 'Money Flow Index (MFI)', params: ['symbol', 'period'] },      // 1 option periods :contentReference[oaicite:11]{index=11}
      { key: 'stoch', label: 'Stochastic Oscillator', params: ['symbol', 'fastK', 'slowK', 'slowD'] }, // 3 opt :contentReference[oaicite:12]{index=12}
      { key: 'ultosc', label: 'Ultimate Oscillator', params: ['symbol', 'period1', 'period2', 'period3'] }, // 3 opt :contentReference[oaicite:13]{index=13}
    ],
  },
  {
    label: 'Trend & Smoothing',
    options: [
      { key: 'ema', label: 'Exponential Moving Avg (EMA)', params: ['symbol', 'period'] }, // :contentReference[oaicite:14]{index=14}
      { key: 'sma', label: 'Simple Moving Avg (SMA)', params: ['symbol', 'period'] },       // :contentReference[oaicite:15]{index=15}
      { key: 'tema', label: 'Triple EMA (TEMA)', params: ['symbol', 'period'] },           // 1 opt :contentReference[oaicite:16]{index=16}
      { key: 'dema', label: 'Double EMA (DEMA)', params: ['symbol', 'period'] },           // :contentReference[oaicite:17]{index=17}
      { key: 'linreg', label: 'Linear Regression', params: ['symbol', 'period'] },         // 1 opt period :contentReference[oaicite:18]{index=18}
    ],
  },
];
