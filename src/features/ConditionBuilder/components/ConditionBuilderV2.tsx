// components/ConditionBuilderV2.tsx
'use client';

import React, { useEffect, useState } from 'react';
import SymbolSelect from './SymbolSelect';
import TechnicalsConfig from './TechnicalsConfig';

export interface Condition {
  type: 'price' | 'technical';
  symbol: { symbol: string; token: string };
  operator: string;
  value: number;
  technicals?: {
    indicator: string;
    period: number;
  };
}

interface ConditionBuilderProps {
  onChange: (conds: Condition[]) => void;
}

const OPERATORS = ['>', '<', '>=', '<=', '==', '!='];

export default function ConditionBuilderV2({ onChange }: ConditionBuilderProps) {
  const [conditions, setConditions] = useState<Condition[]>([{
    type: 'price',
    symbol: { symbol: '', token: '' },
    operator: '>',
    value: 0,
  }]);

  useEffect(() => {
    onChange(conditions);
  }, [conditions, onChange]);

  const updateCondition = <K extends keyof Condition>(
    index: number,
    field: K,
    newValue: Condition[K]
  ) => {
    setConditions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: newValue };
      return copy;
    });
  };

  const addCondition = () => {
    setConditions(prev => [...prev, {
      type: 'price',
      symbol: { symbol: '', token: '' },
      operator: '>',
      value: 0,
    }]);
  };

  const removeCondition = (index: number) => {
    setConditions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {conditions.map((c, i) => (
        <div key={i} className="rounded-md border flex items-stretch overflow-hidden bg-white shadow">
          {/* Left icon block */}
          <div className="bg-gray-300 p-3 flex items-center justify-center">
            <div className="text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16h8M8 12h8m-8-4h8" />
              </svg>
            </div>
          </div>

          {/* Main form section */}
          <div className="flex-1 px-4 py-3 space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Type:</label>
              <select
                value={c.type}
                onChange={(e) => updateCondition(i, 'type', e.target.value as 'price' | 'technical')}
                className="border px-2 py-1 rounded"
              >
                <option value="price">Price</option>
                <option value="technical">Technical</option>
              </select>
            </div>

            <SymbolSelect
              value={c.symbol}
              onChange={val => updateCondition(i, 'symbol', val)}
              placeholder="Select trading symbol"
              error={false}
            />

            {c.type === 'price' && (
              <div className="flex items-center gap-3">
                <select
                  value={c.operator}
                  onChange={e => updateCondition(i, 'operator', e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  {OPERATORS.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={c.value}
                  onChange={e => updateCondition(i, 'value', parseFloat(e.target.value))}
                  className="border px-2 py-1 rounded w-32"
                />
              </div>
            )}

            {c.type === 'technical' && (
              <TechnicalsConfig
                value={c.technicals}
                onChange={(val) => updateCondition(i, 'technicals', val)}
              />
            )}
          </div>

          {/* Right delete button */}
          <div className="flex items-start p-2">
            <button
              onClick={() => removeCondition(i)}
              disabled={conditions.length === 1}
              className="text-red-600 hover:text-red-800"
            >
              &#x2716;
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addCondition}
        className="bg-blue-600 text-white px-3 py-1 rounded shadow"
      >
        + Add Condition
      </button>
    </div>
  );
}
