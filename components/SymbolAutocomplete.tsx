// components/SymbolAutocomplete.tsx

"use client"

import { useEffect, useState } from "react"

interface SymbolEntry {
  symbol: string
  token: string
}

export default function SymbolAutocomplete({
  onSelect,
}: {
  onSelect: (entry: SymbolEntry) => void
}) {
  const [input, setInput] = useState("")
  const [symbols, setSymbols] = useState<SymbolEntry[]>([])
  const [filtered, setFiltered] = useState<SymbolEntry[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    fetch("/symbols.json")
      .then((res) => res.json())
      .then(setSymbols)
      .catch((err) => console.error("Failed to load symbols.json", err))
  }, [])

  useEffect(() => {
    if (!input) {
      setFiltered([])
      return
    }

    const match = symbols
      .filter((s) =>
        s.symbol.toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, 10)

    setFiltered(match)
    setShowDropdown(match.length > 0)
  }, [input, symbols])

  return (
    <div className="relative">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search Trading Symbol"
        className="w-full p-2 border border-gray-300 rounded"
        onFocus={() => input && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-64 overflow-auto">
          {filtered.map((s) => (
            <li
              key={s.token}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setInput(s.symbol)
                setShowDropdown(false)
                onSelect(s)
              }}
            >
              {s.symbol} <span className="text-xs text-gray-500">({s.token})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
