"use client"

import { useEffect, useState } from "react"

interface SymbolEntry {
  symbol: string
  token: string
}

export default function SymbolSelect({
  value,
  onChange,
  error,
}: {
  value?: SymbolEntry
  onChange: (entry: SymbolEntry) => void
  error?: boolean
}) {
  const [input, setInput] = useState(value?.symbol || "")
  const [symbols, setSymbols] = useState<SymbolEntry[]>([])
  const [filtered, setFiltered] = useState<SymbolEntry[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)

  useEffect(() => {
    fetch("/symbols.json")
      .then((res) => res.json())
      .then(setSymbols)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!input) return setFiltered([])

    const match = symbols.filter((s) =>
      s.symbol.toLowerCase().includes(input.toLowerCase())
    )
    setFiltered(match.slice(0, 10))
    setShowDropdown(true)
  }, [input, symbols])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && filtered[highlightIndex]) {
      const selected = filtered[highlightIndex]
      setInput(selected.symbol)
      onChange(selected)
      setShowDropdown(false)
    }
  }

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        Trading Symbol
      </label>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search (e.g. SBIN)"
        className={`w-full p-2 border rounded ${error ? "border-red-500" : "border-gray-300"}`}
        onFocus={() => input && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onKeyDown={handleKeyDown}
      />

      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-64 overflow-auto">
          {filtered.map((s, idx) => (
            <li
              key={s.token}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                idx === highlightIndex ? "bg-gray-100" : ""
              }`}
              onMouseDown={() => {
                setInput(s.symbol)
                onChange(s)
                setShowDropdown(false)
              }}
            >
              {s.symbol} <span className="text-xs text-gray-500">({s.token})</span>
            </li>
          ))}
        </ul>
      )}

      {value?.token && (
        <p className="mt-2 text-sm text-gray-600">
          <strong>Symbol Token:</strong> {value.token}
        </p>
      )}
    </div>
  )
}
