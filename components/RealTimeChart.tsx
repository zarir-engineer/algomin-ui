'use client'
import {
  createChart,
  IChartApi,
  SeriesOptions,
  CandlestickSeries,         // the class/enum for candlesticks
  ISeriesApi,
  UTCTimestamp,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import useLiveTicks from '@/hooks/useLiveTicks';

interface Props {
  symbol: string;
  broker: string;
  height?: number;
}

export default function RealTimeChart({
  symbol,
  broker,
  height = 400,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // ISeriesApi<'Candlestick'> is the correct series-type interface:
  const series = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const tick = useLiveTicks(symbol, broker);

  // 1️⃣ Create chart & series once
  useEffect(() => {
    if (!containerRef.current) return;

    // apply height via style, so we can remove `height` from deps
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      rightPriceScale: { scaleMargins: { top: 0.3, bottom: 0.25 } },
      timeScale: { timeVisible: true, secondsVisible: false },
    }) as IChartApi;

    // ❌ remove any `as any` cast—use the generic addSeries API:
    series.current = chart.addSeries(CandlestickSeries as any) as ISeriesApi<'Candlestick'>;

    return () => chart.remove();
  }, []); // only run on mount/unmount

  // 2️⃣ Load 1m history when `symbol` changes
  useEffect(() => {
    if (!symbol || !series.current) return;

    fetch(`/api/candles?symbol=${symbol}&interval=1m&limit=100`)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((bars: { ts: number; o: number; h: number; l: number; c: number }[]) => {
        const chartData = bars.map(bar => ({
          time: Math.floor(bar.ts / 1000) as UTCTimestamp,
          open: bar.o,
          high: bar.h,
          low: bar.l,
          close: bar.c,
        }));
        series.current!.setData(chartData);
      })
      .catch(err => {
        console.error('Failed to load historical candles', err);
      });
  }, [symbol]);

  // 3️⃣ Append/update on each tick
  useEffect(() => {
    if (!tick || !series.current) return;

    const t = Math.floor(new Date(tick.timestamp).getTime() / 1000) as UTCTimestamp;
    const price = tick.ltp;

    series.current.update({
      time: t,
      open: price,
      high: price,
      low: price,
      close: price,
    });
  }, [tick]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: `${height}px` }}  // actually apply height
    />
  );
}
