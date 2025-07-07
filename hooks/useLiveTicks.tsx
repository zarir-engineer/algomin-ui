import { useEffect, useState } from 'react';
import { isMarketClosed } from '@/utils/market';
import { WS_URL } from "@/lib/config";

interface Tick {

    symbol: string;
    token: string;
    ltp: number;
    timestamp: string;
}

export default function useLiveTicks(
    symbol: string,
    broker: string,
    useDummy = false
): Tick | null {
    const [tick, setTick] = useState<Tick | null>(null);

    useEffect(() => {

        console.log('[useLiveTicks] → Effect start', { symbol, broker, useDummy });

        if (!symbol || !broker) {
            setTick(null);
            return;
        }
        const url = `${WS_URL}?broker=${broker}`;
        console.log('[useLiveTicks] connecting to', url);

        setTick(null); // clear previous tick

        if (useDummy || isMarketClosed()) {
            let ltp = 100 + Math.random() * 50;

            const interval = setInterval(() => {
                const change = (Math.random() - 0.5) * 2;
                ltp = Math.max(10, ltp + change);
                setTick({
                    symbol,
                    token: 'DUMMY',
                    ltp: parseFloat(ltp.toFixed(2)),
                    timestamp: new Date().toISOString(),
                });
            }, 1000);

            return () => clearInterval(interval);
        }


        let socket: WebSocket;

        try {
            socket = new WebSocket(url);

            socket.onopen = () => {
                console.log("✅ WebSocket connected:", url);
            };

            socket.onmessage = (msg) => {
                console.log("📨 WS message:", msg.data);
            };

            socket.onerror = (event) => {
                console.error("❌ WebSocket error", event);
                // Optional: show this in UI or trigger a reconnect
            };

            socket.onclose = (event) => {
                console.warn("🔌 WebSocket closed", {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean,
                });
            };

        } catch (e) {
            console.error("🚫 WS constructor threw", e);
            return;
        }

        socket.onopen = () => {
            console.log('WS opened, subscribing to', symbol, broker);
            socket.send(JSON.stringify({ action: 'subscribe', symbol }));
        };
        socket.onerror = (err) => console.error('WS error', err);
        socket.onclose = (e) => {
            console.error(
                'WS closed:',
                'code=', e.code,
                'reason=', e.reason || '(no reason provided)',
                'wasClean=', e.wasClean
            );
        };

        socket.onmessage = (event) => {
            console.log('[useLiveTicks] → WS onmessage raw', event.data);
            let data;
            try {
                data = JSON.parse(event.data);
                console.log('[useLiveTicks] → Parsed tick', data);
            } catch (err) {
                console.error('Invalid WebSocket message', err);
                return;
            }
            if (data.symbol === symbol) {
                console.log('[useLiveTicks] → setTick', data);
                setTick(data);
            } else {
                console.warn(
                    '[useLiveTicks] → Ignoring tick for other symbol',
                    data.symbol
                );
            }
        };

        return () => {
            // only send if the socket is actually open
            console.log('[useLiveTicks] → Cleanup: unsubscribing & closing socket');
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ action: 'unsubscribe', symbol }));
                console.log('[useLiveTicks] → Sent unsubscribe');
            }
            // always attempt to close (no-op if already closed)
            socket.close();
        };
    }, [symbol, broker, useDummy]);

    return tick;
}
