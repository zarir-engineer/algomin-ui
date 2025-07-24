// components/FallbackChart.tsx
'use client';

import React, { useRef, useEffect } from 'react';
// import { createChart, UTCTimestamp, CrosshairMode, LineStyle } from 'lightweight-charts';
import { makeDummyTicks } from '@/lib/dummyTicks';
import {
  createChart,
  IChartApi,
  UTCTimestamp,
  CrosshairMode,
  LineStyle,

  // series types
  CandlestickSeries,
  BarSeries,
  AreaSeries,
  LineSeries,

  // option types (if you need to pass options)
  CandlestickSeriesOptions,
  BarSeriesOptions,
  AreaSeriesOptions,
  LineSeriesOptions,
} from 'lightweight-charts';


interface FallbackChartProps {
  type: 'Line' | 'Area' | 'Candlestick' | 'Bar';
  width: number;
  height: number;
}

export default function FallbackChart({ type, width, height }: FallbackChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  // Initialize chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width,
      height,
      layout: {
        background: {
          color: '#000',
        },
        textColor: '#fff',
      },
      timeScale: { timeVisible: true },
      crosshair: { mode: CrosshairMode.Normal },
    }) as IChartApi;

    chartRef.current = chart;

    // Create initial series
    if (type === 'Candlestick') {
      seriesRef.current = chart.addSeries(CandlestickSeries,
        {}
        );
    } else if (type === 'Bar') {
      seriesRef.current = chart.addSeries(BarSeries,
        {}
        );
    } else if (type === 'Area') {
      seriesRef.current = chart.addSeries(AreaSeries, { topColor: 'rgba(33, 150, 243, 0.56)', bottomColor: 'rgba(33, 150, 243, 0.04)' });
    } else {
      seriesRef.current = chart.addSeries(LineSeries, { lineStyle: LineStyle.Solid });
    }

    return () => chart.remove();
  }, []); // run once

  // Update series when type, width, or height changes (and feed dummy data)
  useEffect(() => {
    if (!chartRef.current || !seriesRef.current) return;

    chartRef.current.applyOptions({ width, height });

    // Re-create series if type changed
    seriesRef.current && chartRef.current.removeSeries(seriesRef.current);

    if (type === 'Candlestick') {
      seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {});
    } else if (type === 'Bar') {
      seriesRef.current = chartRef.current.addSeries(BarSeries, {});
    } else if (type === 'Area') {
      seriesRef.current = chartRef.current.addSeries(AreaSeries, { topColor: 'rgba(33, 150, 243, 0.56)', bottomColor: 'rgba(33, 150, 243, 0.04)' });
    } else {
      seriesRef.current = chartRef.current.addSeries(LineSeries, { lineStyle: LineStyle.Solid });
    }

    // Generate dummy data
    const raw = makeDummyTicks().map(d => ({
      time: (d.time / 1000) as UTCTimestamp,
      value: d.price,
      open: d.price * 0.98,
      high: d.price * 1.02,
      low: d.price * 0.97,
      close: d.price,
    }));

    if (type === 'Candlestick' || type === 'Bar') {
      seriesRef.current.setData(raw);
    } else {
      seriesRef.current.setData(raw.map(r => ({ time: r.time, value: r.value })));
    }
  }, [type, width, height]);

  return <div ref={containerRef} style={{ width, height }} />;
}
