// components/FallbackChart.tsx
import React from 'react';
import {
  Chart,
  BarSeries,
  LineSeries,
  TimeScale,
  CrosshairMode,
  PriceScale,
} from 'react-lightweight-charts';
import { makeDummyTicks } from '@/lib/dummyTicks'; // from previous snippet

export interface FallbackChartProps {
  type: 'Line' | 'Candlestick' | 'Bar';
  width: number;
  height: number;
}

export default function FallbackChart({
  type,
  width,
  height,
}: FallbackChartProps) {
  const data = makeDummyTicks(60, 100, 2).map(d => ({
    time: Math.floor(d.time / 1000), // lightweight-charts wants UNIX seconds
    value: d.price,
    open: d.price * 0.99,
    high: d.price * 1.01,
    low: d.price * 0.98,
    close: d.price,
  }));

  return (
    <Chart
      width={width}
      height={height}
      timeScale={{ timeVisible: true }}
      crosshair={{ mode: CrosshairMode.Normal }}
    >
      <PriceScale position="right" />
      <TimeScale />
      {type === 'Line' && <LineSeries data={data} />}
      {type === 'Bar' && <BarSeries data={data} />}
      {/* Candlestick & Area would need CandlestickSeries, etc. */}
    </Chart>
  );
}
