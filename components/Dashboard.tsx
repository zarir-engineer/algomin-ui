import React, { useState } from 'react';
import OrderForm from './OrderForm';
import MarketDataPanel from './MarketDataPanel';
import StrategyBuilderPanel from './StrategyBuilderPanel';

export default function Dashboard() {
  const [selection, setSelection] = useState<{ symbol: string; token: string }>({
    symbol: '',
    token: '',
  });

  const { symbol, token } = selection;

  return (
    <div className="flex flex-col h-full">
      {/* Top row: left (OrderForm) and right (MarketDataPanel) */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-shrink-0 w-[320px] bg-white border-r overflow-auto">
          <OrderForm selection={selection} onChange={setSelection} />
        </div>
        <div className="flex-1 p-4 bg-gray-50 overflow-auto">
          {symbol && token ? (
            <MarketDataPanel symbol={symbol} broker={token} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a symbol to view market data
            </div>
          )}
        </div>
      </div>

      {/* Bottom panel: Strategy Builder */}
      <div className="bg-white border-t p-4 overflow-auto">
        <StrategyBuilderPanel minRules={2} />
      </div>
    </div>
  );
}
