'use client';

import { useEffect, useRef, useState } from "react";
import useLiveTicks from "@/hooks/useLiveTicks";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface LiveDataPanelProps {
  symbol: string;
  broker: string;
  useDummy?: boolean;
}

export default function LiveDataPanel({ symbol, broker, useDummy = false }: LiveDataPanelProps) {
  // 🔒 Guard: don't use hook if no symbol or broker
  if (!symbol || !broker) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-gray-500 text-sm bg-white border rounded shadow">
        No symbol selected.
      </div>
    );
  }

  const tick = useLiveTicks(symbol, broker, useDummy);
  const prevLtp = useRef<number | null>(null);
  const [trend, setTrend] = useState<"up" | "down" | null>(null);
  const [noDataTimeout, setNoDataTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!tick) setNoDataTimeout(true);
    }, 5000); // Wait 5 seconds before showing fallback

    return () => clearTimeout(timer);
  }, [tick]);

  useEffect(() => {
    if (tick?.ltp !== undefined) {
      if (prevLtp.current !== null) {
        if (tick.ltp > prevLtp.current) setTrend("up");
        else if (tick.ltp < prevLtp.current) setTrend("down");
        else setTrend(null);
      }
      prevLtp.current = tick.ltp;
    }
  }, [tick]);

  // ⏳ Show loading first
  if (!tick && !noDataTimeout) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-white border rounded shadow text-gray-500 text-sm">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-400 mb-2"></div>
        <p>Waiting for live data…</p>
      </div>
    );
  }

  // ❌ Show fallback after timeout
  if (!tick && noDataTimeout) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-white border rounded shadow text-gray-500 text-sm">
        <img src="placeholder_chart.png" alt="No symbol selected" className="opacity-30 mb-2" />
        <p>No live data available. Market may be closed.</p>
      </div>
    );
  }

  return (
    <div className="text-sm mt-4 flex items-center gap-2 text-gray-800">
      <span>
        Live Tick: <strong>{tick!.symbol}</strong> ₹{tick!.ltp}
      </span>
      {trend === "up" && <ArrowUpRight className="text-green-600 w-4 h-4" />}
      {trend === "down" && <ArrowDownRight className="text-red-600 w-4 h-4" />}
    </div>
  );
}
