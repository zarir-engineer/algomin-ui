// components/ChooseBlock.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { X, Copy } from 'lucide-react';

interface ChooseBlockProps {
  onDelete: () => void;
  inputValue: string;
  onChange: (val: string) => void;
  onSelectOption: (option: string) => void;
  groups: { label: string; options: string[] }[];
}

export default function ChooseBlock({ onDelete, inputValue, onChange, onSelectOption, groups }: ChooseBlockProps) {
  const [filtered, setFiltered] = useState<typeof groups>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFiltered([]);
      return;
    }
    const search = inputValue.toLowerCase();
    const matches = groups
      .map(group => ({
        label: group.label,
        options: group.options.filter(opt => opt.toLowerCase().includes(search)),
      }))
      .filter(group => group.options.length > 0);
    setFiltered(matches);
  }, [inputValue, groups]);

  const handleSelect = (opt: string) => {
    setSelected(opt);
    onSelectOption(opt);
    setFiltered([]);
  };

  return (
    <div className="relative w-full max-w-6xl mt-8 ml-8 rounded-md border border-gray-300 bg-gray-100 shadow-md overflow-visible h-auto pb-6">
      {/* Floating Copy Icon (Top Left) */}
      <button
        className="absolute -top-3 -left-3 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow"
        title="Duplicate"
      >
        <Copy className="w-3.5 h-3.5 text-blue-600" />
      </button>

      {/* Floating Delete Icon (Top Right) */}
      <button
        onClick={onDelete}
        className="absolute -top-3 -right-3 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow"
        title="Remove"
      >
        <X className="w-3.5 h-3.5 text-red-600" />
      </button>

      {/* Gray left bar */}
      <div className="bg-gray-300 w-12 h-full rounded-l-md float-left" />

      {/* Choose input field and condition block */}
      <div className="pl-16 pr-6 pt-5 flex items-start">
        {/* Choose field */}
        <div className="flex flex-col gap-2 shrink-0">
          {!selected && (
            <>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Choose"
                className="w-48 border border-gray-300 rounded px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />

              {/* Suggestions dropdown */}
              {filtered.length > 0 && (
                <ul className="mt-1 bg-white border rounded shadow text-xs w-48 max-h-40 overflow-auto z-10">
                  {filtered.map((group, gi) => (
                    <React.Fragment key={gi}>
                      <li className="px-2 py-1 font-semibold text-gray-500 bg-gray-50 cursor-default">
                        {group.label}
                      </li>
                      {group.options.map((opt, i) => (
                        <li
                          key={i}
                          className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                          onClick={() => handleSelect(opt)}
                        >
                          {opt}
                        </li>
                      ))}
                    </React.Fragment>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* Render selected preview block */}
        {selected && (
          <div className="ml-6 mt-1">
            <div className="relative bg-white border border-blue-200 shadow-inner rounded p-3 text-sm text-blue-700 inline-block">
              {/* Inner floating Copy Icon */}
              <button
                className="absolute -top-3 -left-3 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                title="Duplicate Block"
              >
                <Copy className="w-3.5 h-3.5 text-blue-600" />
              </button>

              {/* Inner floating Delete Icon */}
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-3 -right-3 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                title="Remove Block"
              >
                <X className="w-3.5 h-3.5 text-red-600" />
              </button>

              <div className="font-semibold mb-1 flex justify-center">{selected}</div>
              <div className="text-xs text-gray-700">
                {selected} ( Symbol ( Instrument Name ( ), day, All ), 15, 15 ), 0
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
