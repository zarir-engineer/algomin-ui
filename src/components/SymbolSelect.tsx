'use client';

import { Input } from "@/components/ui/input";
import { SYMBOLS_URL } from "@/lib/config";

import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface SymbolSelectProps {
  value: { symbol: string; token: string };
  onChange: (s: { symbol: string; token: string }) => void;
  placeholder?: string;
  error?: boolean;
}

export default React.memo(function SymbolSelect({
  value,
  onChange,
  placeholder = 'Search symbol…',
  error = false,
}: SymbolSelectProps) {
  const [symbols, setSymbols] = useState<{ symbol: string; token: string }[]>([]);
  const [search, setSearch] = useState(value.symbol || '');

  // 1️⃣ fetch ONCE
  useEffect(() => {
    let cancelled = false;
    console.log('🔎 About to fetch symbols from:', SYMBOLS_URL);
    fetch(SYMBOLS_URL!)
      .then((r) => r.json())
      .then((data) => !cancelled && setSymbols(data))
      .catch((err) => console.error('❌ Failed to fetch symbols.json', err));
    return () => {
      cancelled = true;
    };
  }, []); // ← no deps, fires only on mount

  // 2️⃣ keep `search` in sync with external `value`
  useEffect(() => {
    if (value.symbol !== search) {
      setSearch(value.symbol);
    }
  }, [value.symbol, search]);

  // 3️⃣ memoize the filtered list
  const filtered = useMemo(
    () =>
      symbols.filter((s) =>
        s.symbol.toLowerCase().startsWith(search.toLowerCase())
      ),
    [symbols, search]
  );

  // 4️⃣ stabilize your change handler
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearch(val);

      const match = symbols.find((s) => s.symbol === val);
      if (match) {
        onChange(match);
      } else {
        onChange({ symbol: val, token: '' });
      }
    },
    [symbols, onChange]
  );


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
});
