// app/page.tsx
'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import OrderForm from "@/components/OrderForm";
import LiveDataPanel from "@/components/LiveDataPanel";

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
    broker: 'angel_one'
  });

  const [modal, setModal] = useState<{ open: boolean; title: string; content: string }>({ open: false, title: "", content: "" });
  const [responseLog, setResponseLog] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showOrderPanel, setShowOrderPanel] = useState(true);
  const [showLiveDataPanel, setShowLiveDataPanel] = useState(false);

  const handleCopyLog = () => {
    navigator.clipboard.writeText(JSON.stringify(responseLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl bg-white shadow-xl space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm">Broker:</label>
          <select
            value={form.broker}
            onChange={(e) => setForm(prev => ({ ...prev, broker: e.target.value }))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="angel_one">AngelOne</option>
            <option value="zerodha">Zerodha</option>
          </select>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowOrderPanel(!showOrderPanel)}>
            {showOrderPanel ? "Hide Order" : "Show Order"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowLiveDataPanel(!showLiveDataPanel)}>
            {showLiveDataPanel ? "Hide Live Data" : "Show Live Data"}
          </Button>
        </div>
      </div>

      {showOrderPanel && (
        <OrderForm
          form={form}
          setForm={setForm}
          setResponseLog={setResponseLog}
          setModal={setModal}
        />
      )}

      {showLiveDataPanel && (
        <LiveDataPanel symbol={form.tradingsymbol} broker={form.broker} />
      )}

      {responseLog && (
        <div className="mt-6 bg-gray-100 border rounded p-3 text-xs relative max-h-64 overflow-auto">
          <button onClick={handleCopyLog} className="absolute top-2 right-2 text-xs text-gray-400 hover:text-black">
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <pre className="whitespace-pre-wrap break-words">{JSON.stringify(responseLog, null, 2)}</pre>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">{modal.title}</h2>
            <p className="text-gray-700 text-sm whitespace-pre-wrap max-h-64 overflow-auto">{modal.content}</p>
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
