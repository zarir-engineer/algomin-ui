// components/LiveTickPanel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import useLiveTicks from '@/hooks/useLiveTicks';
import { Card, CardHeader, CardContent, Table } from '@/components/ui';
import ChartPanel from './ChartPanel';

export interface LiveTickPanelProps {
  symbol: string;
  broker: string;
  useDummy?: boolean;
}

export function LiveTickPanel({ symbol, broker, useDummy = false }: LiveTickPanelProps) {
  const latestTick = useLiveTicks(symbol, broker, useDummy);
  const [ticks, setTicks] = useState<{ timestamp: string; time: string; price: number }[]>([]);

  useEffect(() => {
    if (!latestTick) return;
    const ts = latestTick.timestamp;
    const timeLabel = new Date(ts).toLocaleTimeString();
    const price = latestTick.ltp;
    setTicks(prev => [...prev.slice(-49), { timestamp: ts, time: timeLabel, price }]);
  }, [latestTick]);

  return (
    <Card>
      <CardHeader>Live {symbol} Ticks</CardHeader>
      <CardContent>
        {ticks.length === 0 ? (
          <div className="p-4 text-gray-500">Waiting for live data...</div>
        ) : (
          <>
            <Table className="h-64 overflow-y-auto">
              <Table.Head>
                <Table.HeadCell>Time</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {ticks.map((t, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{t.time}</Table.Cell>
                    <Table.Cell>{t.price.toFixed(2)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div className="mt-4 h-64">
              <ChartPanel symbol={symbol} height={200} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
);
}
