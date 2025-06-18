'use client';

import { createChart, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import useLiveTicks from '@/hooks/useLiveTicks';

interface Props { symbol: string; broker: string; height?: number; }

export default function RealTimeChart({ symbol, broker, height = 400 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const series = useRef<ISeriesApi<'Candlestick'>>();
  const last = useRef<{ time: UTCTimestamp; open: number; high: number; low: number; close: number }>();
  const tick = useLiveTicks(symbol, broker);               // 1-sec updates

  /* create chart once */
  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, {
      height,
      layout: { textColor: '#ddd', background: { type: 'solid', color: '#000' } },
      timeScale: { timeVisible: true, secondsVisible: false },
    });
    series.current = chart.addCandlestickSeries();
    return () => chart.remove();
  }, [height]);

  /* push every tick */
  useEffect(() => {
    if (!tick || !series.current) return;
    const t = Math.floor(new Date(tick.timestamp).getTime() / 60000) * 60 as UTCTimestamp; // minute bucket
    const p = tick.ltp;

    if (last.current?.time === t) {
      last.current.high = Math.max(last.current.high, p);
      last.current.low  = Math.min(last.current.low,  p);
      last.current.close = p;
      series.current.update(last.current);
    } else {
      last.current = { time: t, open: p, high: p, low: p, close: p };
      series.current.update(last.current);
    }
  }, [tick]);

  return <div ref={ref} className="w-full" style={{ height }} />;
}
