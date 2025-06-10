import React, { useEffect, useState } from 'react';
import { Table, Card, CardContent, CardHeader } from '@/components/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface DummyTickPanelProps {
  symbol: string;
  broker: string;
}

export function DummyTickPanel({symbol, broker }: DummyTickPanelProps) {
  // now just use symbol and broker directly

  if (!broker) {
    return <div className="p-4 text-red-600">
      No broker token provided for dummy ticks.
    </div>;
  }

  const [ticks, setTicks] = useState<{ time: string; price: number }[]>([]);

  useEffect(() => {
    let price = 1000;
    const interval = setInterval(() => {
      // simulate price change
      price = Math.max(0, price + (Math.random() - 0.5) * 20);
      const time = new Date().toLocaleTimeString();
      const p = price / 100;
      setTicks(prev => [...prev.slice(-49), { time, price: parseFloat(p.toFixed(2)) }]);
    }, 1000);
    return () => clearInterval(interval);
  }, [symbol]);     // restart simulation if symbol changes

  return (
    <Card>
      <CardHeader>Dummy Ticks: {symbol}</CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticks}>
                <XAxis dataKey="time" />
                <YAxis domain={['auto','auto']} />
                <Tooltip />
                <Line dataKey="price" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>  );
}
