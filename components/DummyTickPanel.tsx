import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Table, Card, CardContent, CardHeader } from '@/components/ui';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DummyTickPanel() {
  const { symbol } = useParams<{ symbol: string }>();
  const location = useLocation();
  const token = (location.state as { token?: string })?.token;

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
  }, []);

  if (!token) {
    return <div className="p-4 text-red-600">No token provided for dummy ticks.</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Dummy Ticks: {symbol}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Raw ticks table on the left */}
        <Table className="h-64 overflow-y-auto">
          <Table.Head>
            <Table.HeadCell>Time</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {ticks.map((tick, idx) => (
              <Table.Row key={idx}>
                <Table.Cell>{tick.time}</Table.Cell>
                <Table.Cell>{tick.price.toFixed(2)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Chart view on the right */}
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ticks}>
              <XAxis dataKey="time" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line type="monotone" dataKey="price" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
