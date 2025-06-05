'use client';

import { useEffect, useState } from 'react';

interface Tick {
  symbol: string;
  token: string;
  ltp: number;
  timestamp: string;
}

function isMarketClosed() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6 || hour < 9 || hour >= 16;
}

export default function useLiveTicks(symbol: string, broker: string, useDummy = false) {
  const [tick, setTick] = useState<Tick | null>(null);

  useEffect(() => {
    if (!symbol || !broker) return;

    if (useDummy || isMarketClosed()) {
      let ltp = 100 + Math.random() * 50;

      const interval = setInterval(() => {
        const change = (Math.random() - 0.5) * 2;
        ltp = Math.max(10, ltp + change);

        setTick({
          symbol,
          token: "DUMMY",
          ltp: parseFloat(ltp.toFixed(2)),
          timestamp: new Date().toISOString(),
        });
      }, 1000);

      return () => clearInterval(interval);
    }

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
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: 'unsubscribe', symbol }));
        socket.close();
      }
    };
  }, [symbol, broker, useDummy]);

  return tick;
}
