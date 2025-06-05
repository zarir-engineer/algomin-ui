'use client';

import { useEffect, useRef, useState } from "react";
import useLiveTicks from "@/hooks/useLiveTicks";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface LiveDataPanelProps {
  symbol: string;
  broker: string;
}

export default function LiveDataPanel({ symbol, broker }: LiveDataPanelProps) {
  const tick = useLiveTicks(symbol, broker);
  const [trend, setTrend] = useState<"up" | "down" | null>(null);

  const prevLtp = useRef<number | null>(null);

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

  if (!tick) return null;

  return (
    <div className="text-sm mt-4 flex items-center gap-2 text-gray-800">
      <span>
        Live Tick: <strong>{tick.symbol}</strong> ₹{tick.ltp}
      </span>
      {trend === "up" && <ArrowUpRight className="text-green-600 w-4 h-4" />}
      {trend === "down" && <ArrowDownRight className="text-red-600 w-4 h-4" />}
    </div>
  );
}
