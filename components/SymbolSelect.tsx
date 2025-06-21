'use client';

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SYMBOLS_URL } from "@/lib/config";

export interface SymbolSelectProps {
  value: { symbol: string; token: string };
  onChange: (val: { symbol: string; token: string }) => void;
  placeholder: string;
  error?: boolean;
}

export default function SymbolSelect({
  value,
  onChange,
  placeholder,
  error = false,
}: SymbolSelectProps) {
  const [symbols, setSymbols] = useState<{ symbol: string; token: string }[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        console.log("🔎 About to fetch symbols from:", SYMBOLS_URL);
        console.log("Symbols URL →", SYMBOLS_URL);
        const res = await fetch(SYMBOLS_URL!);
        const data = await res.json();
        setSymbols(data);
      } catch (err) {
        console.error("❌ Failed to fetch symbols.json", err);
      }
    };
    fetchSymbols();
  }, []);

  // Keep input in sync with selected symbol
  useEffect(() => {
    if (value?.symbol) {
      setSearch(value.symbol); // Set search to selected symbol
    }
  }, [value.symbol]);

  const filtered = symbols.filter(s => s.symbol.toLowerCase().startsWith(search.toLowerCase()));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);

    const match = symbols.find(s => s.symbol === val);
    if (match) {
      onChange(match);
    } else {
      // Clear symboltoken if symbol doesn't match
      onChange({ symbol: val, token: "" });
    }
  };

  return (
    <div className="flex flex-col relative">
      <label className="font-medium text-gray-700 whitespace-nowrap">
        Select Trading Symbol
      </label>

      <Input
        value={search}
        onChange={handleChange}
        list="symbol-list"
        placeholder={placeholder}
        className={error ? 'border-red-500' : ''}
      />
      <datalist id="symbol-list">
        {filtered.map((s) => (
          <option key={s.symbol} value={s.symbol} />
        ))}
      </datalist>
    </div>
);
}
