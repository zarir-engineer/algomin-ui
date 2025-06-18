'use client'

import { createChart, ISeriesApi, IChartApi, UTCTimestamp } from 'lightweight-charts'
import { useEffect, useRef } from 'react'
import useLiveTicks from '@/hooks/useLiveTicks'

interface Props {
  symbol: string
  broker: string
  height?: number
}

export default function RealTimeChart({
  symbol,
  broker,
  height = 400,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const series = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const tick   = useLiveTicks(symbol, broker)  // 1-sec dummy/live ticks

  // 1️⃣ Create chart & series once
  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        textColor: '#ddd',
        background: { color: '#000' },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
    }) as IChartApi & { addCandlestickSeries: typeof chart['addCandlestickSeries'] }

    series.current = chart.addCandlestickSeries()
    return () => chart.remove()
  }, [height])

  // 2️⃣ Fetch historical candles on symbol change
  useEffect(() => {
    if (!symbol || !series.current) return

    fetch(`/api/candles?symbol=${symbol}&interval=1m&limit=100`)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`)
        return res.json()
      })
      .then((bars: { ts: number; o: number; h: number; l: number; c: number }[]) => {
        const chartData = bars.map(bar => ({
          time: Math.floor(bar.ts / 1000) as UTCTimestamp,
          open: bar.o,
          high: bar.h,
          low: bar.l,
          close: bar.c,
        }))
        series.current!.setData(chartData)
      })
      .catch(err => {
        console.error('Failed to load historical candles', err)
      })
  }, [symbol])

  // 3️⃣ Append or update on each tick
  useEffect(() => {
    if (!tick || !series.current) return

    const t     = Math.floor(new Date(tick.timestamp).getTime() / 1000) as UTCTimestamp
    const price = tick.ltp

    // here we treat each tick as its own 1-second bar;
    // for true 1-minute candles you could bucket by minute instead
    series.current.update({
      time: t,
      open:  price,
      high:  price,
      low:   price,
      close: price,
    })
  }, [tick])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
