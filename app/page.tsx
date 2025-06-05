// app/page.tsx
'use client';

import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import OrderForm from '@/components/OrderForm';
import LiveDataPanel from '@/components/LiveDataPanel';
import StrategyBuilderPanel from '@/components/StrategyBuilderPanel';

export default function Page() {
  const [form, setForm] = useState({
    tradingsymbol: '',
    symboltoken: '',
    transactiontype: '',
    exchange: 'NSE',
    ordertype: '',
    variety: 'NORMAL',
    producttype: 'INTRADAY',
    duration: 'DAY',
    quantity: '',
    price: '',
    stoploss: '',
    squareoff: '',
    trailing_sl: false,
    is_exit: false,
    broker: 'angel_one',
  });

  const [modal, setModal] = useState<{ open: boolean; title: string; content: string }>({
    open: false,
    title: '',
    content: '',
  });
  const [showOrderPanel, setShowOrderPanel] = useState(true);
  const [showLiveDataPanel, setShowLiveDataPanel] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [responseLog, setResponseLog] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [useDummyTicks, setUseDummyTicks] = useState(false);

  const handleCopyLog = () => {
    navigator.clipboard.writeText(JSON.stringify(responseLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleSubmitOrder = () => {
    setModal({ open: true, title: 'Order Submitted', content: 'Your order has been submitted.' });
    toast.success('Order submitted successfully');
  };

  return (
    <div className="flex flex-row h-screen w-full bg-gray-100">
      <Toaster position="top-right" />

      {/* Left Panel (Full Height) */}
      <div className={`flex flex-col min-w-[320px] max-w-[320px] bg-white shadow-xl border-r
                       transition-transform duration-500 ease-in-out
                       ${showOrderPanel ? 'translate-x-0' : '-translate-x-full'}`}>
        {showOrderPanel && (
          <div className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
            <h2 className="text-md font-semibold text-gray-800">Place Order</h2>
            <div className="flex-1 overflow-y-auto">
              <OrderForm
                form={form}
                setForm={setForm}
                setResponseLog={setResponseLog}
                setModal={setModal}
              />
            </div>
            <div className="sticky bottom-0 left-0 bg-white border-t p-4">
              <button
                disabled={!form.tradingsymbol || !form.symboltoken || !form.quantity}
                className="w-full py-2 rounded transition-all duration-300 text-white font-semibold
                  disabled:bg-gray-400 disabled:cursor-not-allowed
                  enabled:bg-black enabled:hover:bg-gray-800"
                onClick={handleSubmitOrder}
              >
                Submit Order
              </button>
            </div>
            <button
              onClick={() => setShowOrderPanel(false)}
              className="absolute top-24 right-[-16px] bg-white border shadow rounded-full w-8 h-8 flex items-center justify-center transition-transform duration-300 hover:scale-105"
              title="Hide panel"
            >
              ◀
            </button>
          </div>
        )}
      </div>
      {!showOrderPanel && (
        <button
          onClick={() => setShowOrderPanel(true)}
          className="fixed top-24 left-0 bg-white border shadow rounded-full w-8 h-8 flex items-center justify-center z-10 transition-transform duration-300 hover:scale-105"
          title="Show panel"
        >
          ▶
        </button>
      )}

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="ml-[18px] w-[calc(100%-35px)] flex justify-between items-center p-4 bg-white shadow z-10 relative">
          <h1 className="text-lg font-semibold">Algomin</h1>
          <button
            onClick={() => setShowSettings(true)}
            title="Settings"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
          >
            <img src="settings.png" alt="Settings" className="w-6 h-6" />
          </button>
        </div>

        {/* Live Chart Panel */}
        <div className="w-full p-4 relative">
          {showLiveDataPanel && (
            <div className="w-full min-h-[384px] bg-white border rounded shadow relative">
              {form.tradingsymbol ? (
                <LiveDataPanel
                  symbol={form.tradingsymbol}
                  broker={form.broker}
                  useDummy={useDummyTicks}
                />

              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <img src="placeholder_chart.png" alt="No symbol selected" className="opacity-40" />
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setShowLiveDataPanel(!showLiveDataPanel)}
            className="absolute top-4 right-4 bg-white border shadow rounded-full w-8 h-8 flex items-center justify-center transition-transform duration-300"
            title={showLiveDataPanel ? 'Hide chart' : 'Show chart'}
          >
            {showLiveDataPanel ? '▲' : '▼'}
          </button>
        </div>

        {/* Strategy Builder Panel */}
        <div className="w-full px-4">
          <StrategyBuilderPanel minRules={2} />
        </div>

        {/* Response Log */}
        {responseLog && (
          <div className="p-4">
            <div className="mt-6 bg-gray-100 border rounded p-3 text-xs relative max-h-64 overflow-auto">
              <button
                onClick={handleCopyLog}
                className="absolute top-2 right-2 text-xs text-gray-400 hover:text-black"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <pre className="whitespace-pre-wrap break-words">{JSON.stringify(responseLog, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
        {showSettings && (
          <div className="p-4 bg-gray-50 border-b text-sm text-gray-700 flex items-center gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useDummyTicks}
                onChange={(e) => setUseDummyTicks(e.target.checked)}
              />
              Use Dummy Ticks
            </label>
          </div>
        )}
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <label className="block text-sm mb-1">Select Broker</label>
            <select
              value={form.broker}
              onChange={(e) => setForm(prev => ({ ...prev, broker: e.target.value }))}
              className="w-full border rounded px-2 py-1 mb-4"
            >
              <option value="angel_one">AngelOne</option>
              <option value="zerodha">Zerodha</option>
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useDummyTicks}
                onChange={(e) => setUseDummyTicks(e.target.checked)}
              />
              Use Dummy Ticks
            </label>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generic Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">{modal.title}</h2>
            <p className="text-gray-700 text-sm whitespace-pre-wrap max-h-64 overflow-auto">
              {modal.content}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-black text-white rounded"
              onClick={() => setModal({ open: false, title: '', content: '' })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
