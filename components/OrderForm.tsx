"use client"

import { useState } from "react"
import axios from "axios"
import SymbolSelect from "@/components/SymbolSelect"

export default function OrderForm() {
  const [form, setForm] = useState({
    tradingsymbol: "",
    symboltoken: "",
    transactiontype: "BUY",
    exchange: "NSE",
    ordertype: "LIMIT",
    quantity: 1,
    price: "0",
    producttype: "INTRADAY",
    duration: "DAY",
    variety: "NORMAL",
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.tradingsymbol || !form.symboltoken) {
      setError("Please select a valid trading symbol before placing an order.")
      return
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/place`,
        form
      )

      if (res.data?.orderid) {
        setSuccess(`✅ Order placed! Order ID: ${res.data.orderid}`)
      } else {
        setError("⚠️ Order response did not include an order ID.")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.error || "❌ Failed to place order")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        error={!form.tradingsymbol}
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Place Order
        </button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
    </form>
  )
}
