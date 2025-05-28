// components/SymbolSelect.tsx
'use client'

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface SymbolSelectProps {
  value: { symbol: string; token: string };
  onChange: (val: { symbol: string; token: string }) => void;
}

export default function SymbolSelect({ value, onChange }: SymbolSelectProps) {
  const [symbols, setSymbols] = useState<{ symbol: string; token: string }[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_SYMBOLS_URL!);
        const data = await res.json();
        setSymbols(data);
      } catch (err) {
        console.error("❌ Failed to fetch symbols.json", err);
      }
    };
    fetchSymbols();
  }, []);

  const filtered = symbols.filter(s => s.symbol.toLowerCase().startsWith(search.toLowerCase()));

  const handleSelect = (symbol: string) => {
    const match = symbols.find(s => s.symbol === symbol);
    if (match) onChange(match);
  };

  return (
    <div className="flex flex-col relative">
      <label className="text-sm mb-1">Select Trading Symbol</label>

      <Input
        value={search}
        onChange={(e) => {
          const val = e.target.value;
          setSearch(val);
          const match = symbols.find(s => s.symbol === val);
          if (match) onChange(match);
        }}
        list="symbol-list"
        placeholder="Start typing symbol..."
      />

      <datalist id="symbol-list">
        {filtered.map((s) => (
          <option key={s.symbol} value={s.symbol} />
        ))}
      </datalist>
    </div>
  );
}
