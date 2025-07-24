// src/features/models/KeywordMeta.ts

/** Defines a single parameter for a keyword’s context UI. */
export interface ParamDef {
  name: string;
  label: string;
  type: 'select' | 'number' | 'text';
  options?: string[];
}

/** Metadata for each keyword’s context form fields and title. */
export interface KeywordMeta {
  title: string;
  params: ParamDef[];
}

/**
 * Exhaustive map of supported keywords to their context metadata.
 * Extend this to add or remove keywords.
 */
export const KEYWORD_META: Record<string, KeywordMeta> = {
  position: {
    title: 'Position',
    params: [
      { name: 'series', label: 'Series', type: 'select', options: ['ADX Smooth', 'VWAP', 'Supertrend', 'RSI', 'MACD'] },
      { name: 'position', label: 'Position', type: 'number' }
    ],
  },
  vwap: {
    title: 'VWAP',
    params: [
      { name: 'instrument', label: 'Instrument', type: 'select', options: ['NSE', 'NFO', 'MCX', 'BSE'] }
    ],
  },
  ohlcsum: {
    title: 'OHLC Sum',
    params: [
      { name: 'inst1', label: 'Instrument 1', type: 'select', options: ['NSE', 'NFO', 'MCX', 'BSE'] },
      { name: 'inst2', label: 'Instrument 2', type: 'select', options: ['NSE', 'NFO', 'MCX', 'BSE'] },
      { name: 'candle', label: 'Candle Type', type: 'select', options: ['1m', '5m', '15m', '30m', '1h', 'day'] }
    ],
  },
  adx_smooth: {
    title: 'ADX Smooth',
    params: [
      { name: 'instrument', label: 'Instrument', type: 'select', options: ['NSE', 'NFO', 'MCX'] },
      { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['1m', '5m', '15m', '30m', '1h', 'day'] },
      { name: 'period', label: 'Smoothing Period', type: 'number' }
    ],
  },
  supertrend: {
    title: 'Supertrend',
    params: [
      { name: 'instrument', label: 'Instrument', type: 'select', options: ['NSE', 'NFO', 'MCX'] },
      { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['1m', '5m', '15m', '30m', '1h', 'day'] },
      { name: 'factor', label: 'Factor', type: 'number' },
      { name: 'atr_period', label: 'ATR Period', type: 'number' }
    ],
  },
  rsi: {
    title: 'RSI',
    params: [
      { name: 'instrument', label: 'Instrument', type: 'select', options: ['NSE', 'NFO', 'MCX'] },
      { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['1m', '5m', '15m', '30m', '1h', 'day'] },
      { name: 'period', label: 'Period', type: 'number' }
    ],
  },
  macd: {
    title: 'MACD',
    params: [
      { name: 'instrument', label: 'Instrument', type: 'select', options: ['NSE', 'NFO', 'MCX'] },
      { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['1m', '5m', '15m', '30m', '1h', 'day'] },
      { name: 'fast_period', label: 'Fast Period', type: 'number' },
      { name: 'slow_period', label: 'Slow Period', type: 'number' },
      { name: 'signal_period', label: 'Signal Period', type: 'number' }
    ],
  },
  sma: {
    title: 'Simple Moving Average (SMA)',
    params: [
      { name: 'instrument', label: 'Instrument', type: 'select', options: ['NSE', 'NFO', 'MCX'] },
      { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['1m', '5m', '15m', '30m', '1h', 'day'] },
      { name: 'period', label: 'Period', type: 'number' }
    ],
  },
  ema: {
    title: 'Exponential Moving Average (EMA)',
    params: [
      { name: 'instrument', label: 'Instrument', type: 'select', options: ['NSE', 'NFO', 'MCX'] },
      { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['1m', '5m', '15m', '30m', '1h', 'day'] },
      { name: 'period', label: 'Period', type: 'number' }
    ],
  },
  atr: {
    title: 'Average True Range (ATR)',
    params: [
      { name: 'instrument', label: 'Instrument', type: 'select', options: ['NSE', 'NFO', 'MCX'] },
      { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['1m', '5m', '15m', '30m', '1h', 'day'] },
      { name: 'period', label: 'Period', type: 'number' }
    ],
  },
  cci: {
    title: 'Commodity Channel Index (CCI)',
    params: [
      { name: 'instrument', label: 'Instrument', type: 'select', options: ['NSE', 'NFO', 'MCX'] },
      { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['1m', '5m', '15m', '30m', '1h', 'day'] },
      { name: 'period', label: 'Period', type: 'number' }
    ],
  },
  stochastic: {
    title: 'Stochastic Oscillator',
    params: [
      { name: 'instrument', label: 'Instrument', type: 'select', options: ['NSE', 'NFO', 'MCX'] },
      { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['1m', '5m', '15m', '30m', '1h', 'day'] },
      { name: 'k_period', label: '%K Period', type: 'number' },
      { name: 'd_period', label: '%D Period', type: 'number' }
    ],
  },
  bollinger_bands: {
    title: 'Bollinger Bands',
    params: [
      { name: 'instrument', label: 'Instrument', type: 'select', options: ['NSE', 'NFO', 'MCX'] },
      { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['1m', '5m', '15m', '30m', '1h', 'day'] },
      { name: 'length', label: 'Length', type: 'number' },
      { name: 'multiplier', label: 'Multiplier', type: 'number' }
    ],
  }
};
