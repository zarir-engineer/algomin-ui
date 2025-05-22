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

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
//       const res = await axios.post('https://your-backend-url/order/place', form);
      const res = await axios.post('http://localhost:8000/order/place', form);
      setResult(res.data);
    } catch (error: any) {
      setResult(error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl bg-white shadow-xl space-y-4">
      <h1 className="text-xl font-bold mb-4">📤 Place Order</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <Input name="tradingsymbol" placeholder="Trading Symbol" onChange={handleChange} />
        <Input name="symboltoken" placeholder="Symbol Token" onChange={handleChange} />

        <Select name="transactiontype" onValueChange={val => setForm(prev => ({ ...prev, transactiontype: val }))}>
          <SelectTrigger><SelectValue placeholder="Transaction" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="BUY">BUY</SelectItem>
            <SelectItem value="SELL">SELL</SelectItem>
          </SelectContent>
        </Select>

        <Select name="ordertype" onValueChange={val => setForm(prev => ({ ...prev, ordertype: val }))}>
          <SelectTrigger><SelectValue placeholder="Order Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="MARKET">MARKET</SelectItem>
            <SelectItem value="LIMIT">LIMIT</SelectItem>
            <SelectItem value="SL">SL</SelectItem>
            <SelectItem value="SL-M">SL-M</SelectItem>
          </SelectContent>
        </Select>

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

      {result && (
        <div className="bg-gray-100 p-4 rounded mt-6">
          <h2 className="font-semibold">Server Response:</h2>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
