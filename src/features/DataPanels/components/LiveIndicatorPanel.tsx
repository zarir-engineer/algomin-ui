// components/LiveIndicatorPanel.tsx
'use client'

import { useState } from "react";
import SymbolSelect from "@/components/SymbolSelect";

export default function LiveIndicatorPanel() {
  const [selectedSymbol, setSelectedSymbol] = useState<{ symbol: string, token: string }>({ symbol: "", token: "" });
  const [indicators, setIndicators] = useState({
    sma: false,
    ema: false,
    vwap: false,
    supertrend: false,
  });

  return (
    <div className="p-4 rounded-xl shadow bg-white space-y-4">
      <h2 className="text-lg font-semibold">📈 Live Market Panel</h2>

      <SymbolSelect value={selectedSymbol} onChange={setSelectedSymbol} placeholder="Type to search"/>

      <div className="flex gap-4 flex-wrap">
        {Object.keys(indicators).map((key) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={indicators[key as keyof typeof indicators]}
              onChange={() =>
                setIndicators((prev) => ({
                  ...prev,
                  [key]: !prev[key as keyof typeof indicators],
                }))
              }
            />
            {key.toUpperCase()}
          </label>
        ))}
      </div>

      <div className="p-2 bg-gray-100 rounded text-xs">
        <p>💡 Strategy Rules Preview</p>
        <ul>
          {indicators.ema && <li>→ EMA Cross</li>}
          {indicators.supertrend && <li>→ Supertrend Buy/Sell Signal</li>}
          {indicators.sma && <li>→ SMA Condition</li>}
          {indicators.vwap && <li>→ VWAP Threshold</li>}
        </ul>
      </div>
    </div>
  );
}
