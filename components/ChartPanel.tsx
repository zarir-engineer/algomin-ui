// components/ChartPanel.tsx
'use client';
import React, { useState } from 'react';

import FallbackChart from './FallbackChart';
import { AdvancedChart } from 'react-tradingview-embed';
import { isMarketClosed } from '@/utils/market';

export type SeriesType = 'Line' | 'Area' | 'Candlestick' | 'Bar';

export interface ChartPanelProps {
  symbol: string; // e.g. "NASDAQ:AAPL" or "BTCUSD"
  height?: number;
}

// Map our SeriesType to TradingView style codes (must be strings)
const styleMap: Record<SeriesType, string> = {
  Line: '2',        // 2 = Line
  Area: '3',        // 3 = Area
  Candlestick: '1', // 1 = Candles
  Bar: '0',         // 0 = Bars
};

const chartOptions: SeriesType[] = ['Line', 'Area', 'Candlestick', 'Bar'];

export default function ChartPanel({ symbol, height = 400 }: ChartPanelProps) {
  const [seriesType, setSeriesType] = useState<SeriesType>('Line');
  const marketOpen = !isMarketClosed();

  return (
    <div style={{ height }}>
      <div className="mb-2 flex items-center gap-2">
        <label className="font-medium">Chart Type:</label>
        <select
          value={seriesType}
          onChange={e => setSeriesType(e.target.value as SeriesType)}
          className="border rounded px-2 py-1"
        >
          {chartOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

    {marketOpen ? (
      <AdvancedChart
        widgetProps={{
          symbol,
          interval: "1",
          theme: "dark",
          style: styleMap[seriesType],
          locale: "en",
          autosize: true,
        }}
      />
      ) : (
        <FallbackChart
          type={seriesType}
          width={window.innerWidth}   // or a fixed width/container size
          height={height}
        />
      )}
    </div>
  );
}
