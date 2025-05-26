// algomin-ui scaffold (React + Tailwind + Railway ready)

// 1. Create your app
// $ npx create-next-app@latest algomin-ui --typescript --tailwind

// 2. Install ShadCN UI (optional for clean components)
// $ npx shadcn-ui@latest init

// 3. File: app/page.tsx or src/pages/index.tsx (depending on layout)

'use client'
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import axios from 'axios';
import SymbolAutocomplete from "@/components/SymbolAutocomplete";
import SymbolSelect from "@/components/SymbolSelect";
// const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("+++ ✅ API Base URL from env:", apiBaseUrl);

export default function Home() {
  const [form, setForm] = useState({
    tradingsymbol: '',
    symboltoken: '',
    transactiontype: 'BUY',
    exchange: 'NSE',
    ordertype: 'LIMIT',
    variety: 'NORMAL',
    producttype: 'INTRADAY',
    duration: 'DAY',
    quantity: 1,
    price: '',
    stoploss: '',
    squareoff: '',
    trailing_sl: false,
    is_exit: false,
  });
  const [result, setResult] = useState<any>(null);

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

  const [modal, setModal] = useState({ open: false, title: '', content: '' });
  const [responseLog, setResponseLog] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/place`, form);

      setResponseLog(res.data);

      if (res.data?.orderid) {
        setModal({
          open: true,
          title: "✅ Order Placed",
          content: `Order ID: ${res.data.orderid}`,
        });
      } else {
        setModal({
          open: true,
          title: "⚠️ No Order ID",
          content: "Order may not have been accepted by broker.",
        });
      }
    } catch (err) {
      console.error("❌ Order Error", err);

      const safeMessage =
        typeof err?.response?.data === "string"
          ? "Unexpected server error"
          : JSON.stringify(err?.response?.data || err.message, null, 2);

      setResponseLog(err?.response?.data || err.message);

      setModal({
        open: true,
        title: "❌ Order Failed",
        content: safeMessage,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl bg-white shadow-xl space-y-4">
      <h1 className="text-xl font-bold mb-4">📤 Place Order</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <SymbolSelect
          value={{
            symbol: form.tradingsymbol,
            token: form.symboltoken,
          }}
          onChange={({ symbol, token }) =>
            setForm((prev) => ({
              ...prev,
              tradingsymbol: symbol,
              symboltoken: token,
            }))
          }
        />

        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input type="radio" name="transactiontype" value="BUY" checked={form.transactiontype === "BUY"} onChange={handleChange} />
            <span className="ml-2 text-green-600 font-medium">Buy</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="transactiontype" value="SELL" checked={form.transactiontype === "SELL"} onChange={handleChange} />
            <span className="ml-2 text-red-600 font-medium">Sell</span>
          </label>
        </div>


        <div className="flex gap-2">
          {["MARKET", "LIMIT", "SL", "SL-M"].map((type) => (
            <button
              key={type}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                form.ordertype === type ? "bg-black text-white" : "bg-gray-100 text-gray-800"
              }`}
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

      {/* 🔽 PLACE THIS RIGHT AFTER THE FORM */}
      {responseLog && (
        <div className="mt-6 bg-gray-100 border rounded p-3 text-xs relative max-h-64 overflow-auto">
          <button
            onClick={handleCopyLog}
            className="absolute top-2 right-2 text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-800"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>

          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(responseLog, null, 2)}
          </pre>
        </div>
      )}

      {/* 🔽 PLACE THIS ANYWHERE INSIDE THE JSX, usually after form */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">{modal.title}</h2>
            <p className="text-gray-700 text-sm whitespace-pre-wrap max-h-64 overflow-auto">{modal.content}</p>
            <button
              className="mt-4 px-4 py-2 bg-black text-white rounded"
              onClick={() => setModal({ open: false, title: "", content: "" })}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-gray-100 p-4 rounded mt-6">
          <h2 className="font-semibold">Server Response:</h2>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
