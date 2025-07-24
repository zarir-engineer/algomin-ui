import { useEffect, useState, useRef } from 'react';
import { WS_URL } from '@/lib/config';

interface Tick {
  symbol: string;
  token: string;
  ltp: number;
  timestamp: string;
}

export default function useLiveTicks(
  symbol: string,
  broker: string
): Tick | null {
  const [tick, setTick] = useState<Tick | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 5;

  useEffect(() => {
    console.log('[useLiveTicks] → Effect start', { symbol, broker });

    // Only connect when symbol is complete
    if (!symbol || symbol.length < 3) {
      console.log(`[useLiveTicks] → Symbol incomplete (${symbol}), waiting`);
      setTick(null);
      return;
    }

    // Validate inputs
    if (!broker || !WS_URL) {
      console.warn('[useLiveTicks] → Missing broker or WS_URL, aborting');
      setTick(null);
      return;
    }

    const url = `${WS_URL}?broker=${broker}`;
    let shouldReconnect = true;

    const connect = () => {
      if (retryCountRef.current >= MAX_RETRIES) {
        console.warn(
          `[useLiveTicks] → Reached max retries (${MAX_RETRIES}), stopping attempts`
        );
        return;
      }
      console.log(
        `[useLiveTicks] → Attempt ${retryCountRef.current + 1} to connect`,
        url
      );
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('✅ WS opened, subscribing to', symbol, broker);
        retryCountRef.current = 0;
        socket.send(JSON.stringify({ action: 'subscribe', symbol }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.symbol === symbol) {
            setTick(data);
          }
        } catch {
          console.warn('[useLiveTicks] → Invalid WS message');
        }
      };

      // Simplified error logging to avoid error overlay
      socket.onerror = () => {
        console.warn('[useLiveTicks] → WS encountered an error');
        shouldReconnect = false;
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
        socket.close();
      };

      socket.onclose = (e) => {
        console.warn('[useLiveTicks] → WS closed', e);
        if (shouldReconnect) {
          retryCountRef.current += 1;
          console.log(
            `[useLiveTicks] → Retrying in 5s (retry ${retryCountRef.current})`
          );
          retryTimerRef.current = window.setTimeout(connect, 5000);
        }
      };
    };

    connect();

    return () => {
      console.log('[useLiveTicks] → Cleanup: stopping and closing socket');
      shouldReconnect = false;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [symbol, broker]);

  return tick;
}
