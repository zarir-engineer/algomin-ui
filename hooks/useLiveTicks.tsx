// hooks/useLiveTicks.ts
'use client'

import { useEffect, useState } from 'react';

interface Tick {
  symbol: string;
  token: string;
  ltp: number;
  timestamp: string;
}

export default function useLiveTicks(symbol: string, broker: string) {
  const [tick, setTick] = useState<Tick | null>(null);

  useEffect(() => {
    if (!symbol || !broker) return;

    const socket = new WebSocket(`wss://web-production-4e6e.up.railway.app/ws/stream?broker=${broker}`);

    socket.onopen = () => {
      socket.send(JSON.stringify({ action: 'subscribe', symbol }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.symbol === symbol) setTick(data);
      } catch (err) {
        console.error("Invalid WebSocket message", err);
      }
    };

    return () => {
      socket.send(JSON.stringify({ action: 'unsubscribe', symbol }));
      socket.close();
    };
  }, [symbol, broker]);

  return tick;
}
