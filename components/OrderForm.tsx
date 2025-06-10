// app/components/OrderForm.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SymbolSelect from "@/components/SymbolSelect";
import { Dashboard } from "@/components/Dashboard";

type OrderFormData = {
  tradingsymbol: string;
  symboltoken: string;
  transactiontype: string;
  quantity: string;
  price: string;
  stoploss: string;
  squareoff: string;
  ordertype: string;
  trailing_sl: boolean;
  is_exit: boolean;
  broker: string;
  exchange: string;
  variety: string;
  producttype: string;
  duration: string;
};

type Props = {
  form: OrderFormData;
  setForm: React.Dispatch<React.SetStateAction<OrderFormData>>;
  setResponseLog: (msg: string) => void;
  setModal: React.Dispatch<React.SetStateAction<{ open: boolean; title: string; content: string }>>;
};

export default function OrderForm({ form, setForm, setResponseLog, setModal }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!form.tradingsymbol || !form.symboltoken || !form.transactiontype || !form.exchange || !form.ordertype || !form.producttype || !form.variety || !form.duration || !form.quantity) {
      setModal({ open: true, title: "❌ Missing Fields", content: "Please complete all required fields before submitting." });
      return;
    }

    if (!['MARKET'].includes(form.ordertype) && (!form.price || Number(form.price) <= 0)) {
      setModal({ open: true, title: "❌ Invalid Price", content: `Price is required for ${form.ordertype} orders.` });
      return;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const res = await fetch(`${apiBaseUrl}/order/place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResponseLog(data);
      setModal({ open: true, title: "✅ Order Placed", content: JSON.stringify(data, null, 2) });
    } catch (err) {
      if (err instanceof Error) {
        setResponseLog(err.message);
        setModal({ open: true, title: "❌ Order Failed", content: err.message });
      } else {
        setResponseLog(String(err));
        setModal({ open: true, title: "❌ Order Failed", content: String(err) });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <div className="col-span-2 flex gap-2" title="Exchange">
        {['NSE', 'BSE'].map(ex => (
          <label key={ex} className="inline-flex items-center">
            <input type="radio" name="exchange" value={ex} checked={form.exchange === ex} onChange={handleChange} />
            <span className="ml-2">{ex}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-2 col-span-2" title="Order Type">
        {['MARKET', 'LIMIT', 'SL', 'SL-M'].map((type) => (
          <button
            key={type}
            type="button"
            className={`px-3 py-1 rounded-full text-sm font-medium ${form.ordertype === type ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setForm({ ...form, ordertype: type })}
          >
            {type}
          </button>
        ))}
      </div>
      <Dashboard
        value={{ symbol: form.tradingsymbol, token: form.symboltoken }}
        onChange={({ symbol, token }) =>
          setForm(prev => ({ ...prev, tradingsymbol: symbol, symboltoken: token }))
        }
      />
      {form.symboltoken && (
        <div className="col-span-2 text-xs text-gray-500 ml-1 ">
          Token: <span className="font-mono">{form.symboltoken}</span>
        </div>
      )}

      <div className="col-span-2 flex gap-4" title="Transaction Type">
        {['BUY', 'SELL', 'INQ'].map(type => (
          <label key={type} className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="transactiontype"
              value={type}
              checked={form.transactiontype === type}
              onChange={handleChange}
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-3 gap-2">
          <select
            name="variety"
            value={form.variety}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            <option value="NORMAL">NORMAL</option>
            <option value="STOPLOSS">STOPLOSS</option>
            <option value="ROBO">ROBO</option>
          </select>

          <select
            name="producttype"
            value={form.producttype}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            <option value="INTRADAY">INTRADAY</option>
            <option value="DELIVERY">DELIVERY</option>
          </select>

          <select
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            <option value="DAY">DAY</option>
            <option value="IOC">IOC</option>
          </select>
        </div>
      </div>

      {/* Row 2: Conditional Quantity/Price/StopLoss */}
      {form.ordertype === 'MARKET' && (
        <div className="grid grid-cols-1 gap-2 mb-2">
          <Input name="quantity" placeholder="Quantity" type="number" onChange={handleChange} />
        </div>
      )}

      {form.ordertype === 'LIMIT' && (
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input name="quantity" placeholder="Quantity" type="number" onChange={handleChange} />
            <Input name="price" placeholder="Price" onChange={handleChange} />
          </div>
        </div>
      )}

      {form.ordertype === 'SL' && (
        <div className="grid grid-cols-3 gap-2 mb-2 col-span-2">
          <Input
            name="stoploss"
            placeholder="Stop Loss"
            onChange={handleChange}
            className="w-full"
          />
          <Input
            name="quantity"
            placeholder="Quantity"
            type="number"
            onChange={handleChange}
            className="w-full"
          />
          <Input
            name="price"
            placeholder="Price"
            onChange={handleChange}
            className="w-full"
          />
        </div>
      )}


      {form.ordertype === 'ROBO' && (
        <>
          <Input name="stoploss" placeholder="Stop Loss" onChange={handleChange} />
          <Input name="squareoff" placeholder="Square Off" onChange={handleChange} />
        </>
      )}

      <div className="col-span-2 flex items-center gap-4">
        <label className="flex items-center gap-2" title="Trailing Stop Loss">
          <input type="checkbox" name="trailing_sl" checked={form.trailing_sl} onChange={handleChange} /> Trailing SL
        </label>
        <label className="flex items-center gap-2" title="Exit Order">
          <input type="checkbox" name="is_exit" checked={form.is_exit} onChange={handleChange} /> Exit Order
        </label>
      </div>
    </form>
  );
}
