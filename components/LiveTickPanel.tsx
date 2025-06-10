'use client';
import React, { useEffect, useState } from 'react';
import useLiveTicks from '@/hooks/useLiveTicks';
// import { useSettings } from '@/context/SettingsContext'
import { Table, Card, CardContent, CardHeader } from '@/components/ui';
import ChartPanel, { ChartPoint } from './ChartPanel';


// 1️⃣ Define the props you expect from Dashboard
export interface LiveTickPanelProps {
  symbol: string;
  broker: string;
  useDummy?: boolean;
}

export function LiveTickPanel({
  symbol,
  broker,
  useDummy = false,
}: LiveTickPanelProps) {
   // now you have exactly what you need from props:
  const latestTick = useLiveTicks(symbol, broker, useDummy);
  // your chart’s history
  const [ticks, setTicks] = useState<{ time: string; price: number }[]>([]);

  useEffect(() => {
    if (!latestTick) return;

    // convert to display form
    const time = new Date(latestTick.timestamp).toLocaleTimeString();
    const price = latestTick.ltp;

    setTicks(prev => [
      ...prev.slice(-49),       // keep last 49
      { time, price },          // push new one
    ]);
  }, [latestTick]);

  return (
    <Card>
      <CardHeader>Live {symbol} Ticks</CardHeader>
      <CardContent>
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

        <ResponsiveContainer width="100%" height={200}>
          <ChartPanel data={ticks.map(t => ({ time: t.time, value: t.price }))} height={200} />
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
