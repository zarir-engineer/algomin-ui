// Combined Final Page: app/page.tsx

'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import SymbolSelect from "@/components/SymbolSelect";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("+++ ✅ API Base URL from env:", apiBaseUrl);

export default function Page() {
  const [form, setForm] = useState({
    tradingsymbol: '',
    symboltoken: '',
    transactiontype: '',
    exchange: 'NSE',
    ordertype: '',
    variety: '',
    producttype: '',
    duration: '',
    quantity: '',
    price: '',
    stoploss: '',
    squareoff: '',
    trailing_sl: false,
    is_exit: false,
  });

  const [modal, setModal] = useState({ open: false, title: '', content: '' });
  const [responseLog, setResponseLog] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLog = () => {
    navigator.clipboard.writeText(JSON.stringify(responseLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const getRadioClass = (type: string) => {
    if (form.transactiontype === type) {
      if (type === 'BUY') return 'text-green-600 font-semibold transition-colors';
      if (type === 'SELL') return 'text-red-600 font-semibold transition-colors';
      if (type === 'INQ') return 'text-gray-600 font-semibold transition-colors';
    }
    return 'text-gray-300 font-medium transition-colors';
  };

  const getRingClass = (type: string) => {
    if (form.transactiontype === type) {
      if (type === 'BUY') return 'accent-green-600';
      if (type === 'SELL') return 'accent-red-600';
      if (type === 'INQ') return 'accent-gray-500';
    }
    return 'accent-gray-300';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tradingsymbol || !form.symboltoken) {
      setModal({ open: true, title: "❌ Missing Symbol", content: "Please select a valid trading symbol and token." });
      return;
    }
    if (!form.transactiontype) {
      setModal({ open: true, title: "❌ Missing Transaction Type", content: "Please select a transaction type." });
      return;
    }
    if (!form.exchange) {
      setModal({ open: true, title: "❌ Missing Exchange", content: "Please select an exchange." });
      return;
    }
    if (!form.ordertype) {
      setModal({ open: true, title: "❌ Missing Order Type", content: "Please select an order type." });
      return;
    }
    if (!form.variety || !form.producttype || !form.duration) {
      setModal({ open: true, title: "❌ Incomplete Order", content: "Please complete all order configuration fields (variety, producttype, duration)." });
      return;
    }
    if (!form.quantity || Number(form.quantity) <= 0) {
      setModal({ open: true, title: "❌ Invalid Quantity", content: "Quantity must be a positive number." });
      return;
    }
    if (!['MARKET'].includes(form.ordertype) && (!form.price || Number(form.price) <= 0)) {
      setModal({ open: true, title: "❌ Invalid Price", content: `Price is required for ${form.ordertype} orders.` });
      return;
    }

    try {
      const res = await axios.post(`${apiBaseUrl}/order/place`, form);
      setResponseLog(res.data);

      if (res.data?.orderid) {
        setModal({ open: true, title: "✅ Order Placed", content: `Order ID: ${res.data.orderid}` });
      } else {
        setModal({ open: true, title: "⚠️ No Order ID", content: "Order may not have been accepted by broker." });
      }
    } catch (err) {
      const safeMessage = typeof err?.response?.data === 'string' ? 'Unexpected server error' : JSON.stringify(err?.response?.data || err.message, null, 2);
      setResponseLog(err?.response?.data || err.message);
      setModal({ open: true, title: "❌ Order Failed", content: safeMessage });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl bg-white shadow-xl space-y-4">
      <h1 className="text-xl font-bold mb-4">📤 Place Order</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <SymbolSelect
          value={{ symbol: form.tradingsymbol, token: form.symboltoken }}
          onChange={({ symbol, token }) => setForm((prev) => ({ ...prev, tradingsymbol: symbol, symboltoken: token }))}
        />

        <div className="flex gap-4">
          {['BUY', 'SELL', 'INQ'].map(type => (
            <label key={type} className="inline-flex items-center transition-colors">
              <input type="radio" name="transactiontype" value={type} checked={form.transactiontype === type} onChange={handleChange} className={getRingClass(type)} />
              <span className={`ml-2 ${getRadioClass(type)}`}>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input type="radio" name="exchange" value="NSE" checked={form.exchange === "NSE"} onChange={handleChange} />
            <span className="ml-2 text-blue-600 font-medium">NSE</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="exchange" value="BSE" checked={form.exchange === "BSE"} onChange={handleChange} />
            <span className="ml-2 text-orange-600 font-medium">BSE</span>
          </label>
        </div>

        <div className="flex gap-2 col-span-2">
          {['MARKET', 'LIMIT', 'SL', 'SL-M'].map((type) => (
            <button
              key={type}
              type="button"
              className={`px-3 py-1 rounded-full text-sm font-medium ${form.ordertype === type ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'} transition-colors`}
              onClick={() => setForm({ ...form, ordertype: type })}
            >
              {type}
            </button>
          ))}
        </div>

        <Input name="price" placeholder="Price (for LIMIT/SL)" onChange={handleChange} />
        <Input name="quantity" placeholder="Quantity" type="number" onChange={handleChange} />
        <Input name="stoploss" placeholder="Stop Loss (SL/ROBO)" onChange={handleChange} />
        <Input name="squareoff" placeholder="Square Off (ROBO)" onChange={handleChange} />

        <div className="col-span-2 flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="trailing_sl" onChange={handleChange} /> Trailing SL
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_exit" onChange={handleChange} /> Exit Order
          </label>
        </div>

        <Button className="col-span-2" type="submit">Submit Order</Button>
      </form>

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
