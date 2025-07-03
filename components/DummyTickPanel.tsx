// components/DummyTickPanel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui';
import ChartPanel from './ChartPanel';

export interface DummyTickPanelProps {
  symbol: string;
  broker: string;
}

export function DummyTickPanel({ symbol, broker }: DummyTickPanelProps) {
  // ADHD Tip: Think of `ticks` as a real box (array). Initialize it as [] so it's never undefined.
  const [ticks, setTicks] = useState<{ time: string; price: number }[]>([]);

  useEffect(() => {
    // ADHD Tip: This effect runs once on mount and sets up an interval to update `ticks`.
    let price = 1000;
    const interval = setInterval(() => {
      // ADHD Tip: Simulate price fluctuation every second.
      price = Math.max(0, price + (Math.random() - 0.5) * 20);
      const time = new Date().toLocaleTimeString();

      setTicks(prev => {
        // ADHD Tip: Guard `prev` to ensure it's an array before slicing.
        const safePrev = Array.isArray(prev) ? prev : [];
        // ADHD Tip: Keep only the last 49 entries to prevent unlimited growth.
        const recent = safePrev.slice(-49);
        // ADHD Tip: Return a new array (no in-place mutations).
        return [...recent, { time, price: parseFloat((price / 100).toFixed(2)) }];
      });
    }, 1000);

    // ADHD Tip: Cleanup on unmount to stop the timer and avoid leaks.
    return () => clearInterval(interval);
  }, []); // ADHD Tip: Empty dependency array ensures this runs only once, preventing infinite loops.

  return (
    <Card>
      <CardHeader>Dummy {symbol} Ticks</CardHeader>
      <CardContent>
        {ticks.length === 0 ? (
          <div className="p-4 text-gray-500">Generating dummy data...</div>
        ) : (
          <div className="mt-4 h-64">
            <ChartPanel symbol={symbol} height={200} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
