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
  const [ticks, setTicks] = useState<{ time: string; price: number }[]>([]);
  useEffect(() => {
    let price = 1000;
    const interval = setInterval(() => {
      price = Math.max(0, price + (Math.random() - 0.5) * 20);
      const time = new Date().toLocaleTimeString();
      setTicks(prev => [...prev.slice(-49), { time, price: parseFloat((price/100).toFixed(2)) }]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
