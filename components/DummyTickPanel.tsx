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
    // ADHD Tip: This effect runs only once on mount
    let price = 1000;

    const interval = window.setInterval(() => {
      // ADHD Tip: Simulate price fluctuation every second
      price = Math.max(0, price + (Math.random() - 0.5) * 20);
      const time = new Date().toLocaleTimeString();

      setTicks(prev => {
        // ADHD Tip: Ensure `prev` is an array
        const safePrev = Array.isArray(prev) ? prev : [];
        // ADHD Tip: Keep last 49 entries
        const recent = safePrev.slice(-49);
        // Return new array only inside interval
        return [...recent, { time, price: parseFloat((price / 100).toFixed(2)) }];
      });
    }, 1000);

    // ADHD Tip: Clean up interval on unmount
    return () => clearInterval(interval);
  }, []); // <-- empty deps: runs once

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
