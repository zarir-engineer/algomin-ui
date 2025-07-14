// components/Dashboard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import OrderForm, { OrderFormData } from './OrderForm';
import MarketDataPanel from './MarketDataPanel';
import StrategyBuilderPanel from './StrategyBuilderPanel';
import SettingsModal from './SettingsModal';
import { useSettings } from '@/context/SettingsContext';

export default function Dashboard() {
  // form state for OrderForm
  const [form, setForm] = useState<OrderFormData>({
    tradingsymbol: '',
    symboltoken: '',
    transactiontype: '',
    quantity: '',
    price: '',
    stoploss: '',
    squareoff: '',
    ordertype: '',
    trailing_sl: false,
    is_exit: false,
    broker: '',
    exchange: '',
    variety: '',
    producttype: '',
    duration: '',
  });
  const [responseLog, setResponseLog] = useState<string>('');
  const [modal, setModal] = useState<{ open: boolean; title: string; content: string }>({
    open: false,
    title: '',
    content: '',
  });

  const [showSettings, setShowSettings] = useState(false);
  const { tradingsymbol: symbol } = form;
  const { broker } = useSettings();

  useEffect(() => {
    console.log('Rendering MarketDataPanel with', { symbol, broker });
  }, [symbol, broker]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <h1 className="text-xl font-semibold">Algomin</h1>
        <SettingsIcon
          className="w-6 h-6 text-gray-500 cursor-pointer"
          onClick={() => setShowSettings(true)}
        />
      </header>

      {/* Settings Modal */}
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />

      {/* Top row: left (OrderForm) and right (MarketDataPanel) */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-shrink-0 w-[320px] bg-white border-r overflow-auto">
          <OrderForm
            form={form}
            setForm={setForm}
            setResponseLog={setResponseLog}
            setModal={setModal}
          />
        </div>
        <div className="flex-1 p-4 bg-gray-50 overflow-auto">
          {symbol && broker ? (
            <MarketDataPanel symbol={symbol} broker={broker} />
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
