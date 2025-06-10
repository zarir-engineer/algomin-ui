// components/ChartPanel.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { createChart, IChartApi, ISeriesApi, ColorType } from 'lightweight-charts';


export interface ChartPoint {
  time: string;   // e.g. '2025-06-10' or UNIX timestamp
  value: number;  // price or metric
}

export interface ChartPanelProps {
  data: ChartPoint[];
  height?: number;
}

export default function ChartPanel({ data, height = 300 }: ChartPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);


  useEffect(() => {
    if (!containerRef.current) return;
    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      localization: {
        dateFormat: 'HH:mm',
      },
      timeScale: {
        borderColor: '#ccc',
        rightOffset: 5,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
      },
      rightPriceScale: {
        borderColor: '#ccc',
        mode: 1,
      },
    });

    seriesRef.current = chartRef.current.addSeries({
      lineColor: '#1976d2',
      lineWidth: 2,
    });
    seriesRef.current.setData(data.map(pt => ({ time: pt.time, value: pt.value })));
    chartRef.current.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.setData(data.map(pt => ({ time: pt.time, value: pt.value })));
      chartRef.current?.timeScale().fitContent();
    }
  }, [data]);

  return <div ref={containerRef} />;
}
