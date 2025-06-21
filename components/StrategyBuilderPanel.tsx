'use client';

import { useState, useEffect } from 'react';

const indicators = ['EMA', 'SMA', 'MACD'];
const operators = ['<', '>', '<=', '>=', '=='];
const targetFields = ['LTP', 'Open', 'Close'];
import { PlusCircle, MinusCircle } from "lucide-react";

interface Rule {
  indicator: string;
  operator: string;
  field: string;
  value: string;
}

interface StrategyBuilderProps {
  minRules?: number;
}

export default function StrategyBuilderPanel({ minRules = 2 }: StrategyBuilderProps) {
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    if (rules.length < minRules) {
      const initialRules = Array.from({ length: minRules }, () => ({
        indicator: '',
        operator: '',
        field: '',
        value: ''
      }));
      setRules(initialRules);
    }
  }, [minRules]);

  const updateRule = (index: number, key: keyof Rule, value: string) => {
    setRules(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const addRule = () => {
    setRules(prev => [...prev, { indicator: '', operator: '', field: '', value: '' }]);
  };

  const removeRule = (index: number) => {
    if (rules.length > minRules) {
      setRules(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="mt-4 p-4 bg-white border rounded shadow">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Strategy Builder</h3>
      <div className="flex flex-col gap-2">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-center gap-2">
            <select
              className="text-sm border rounded px-2 py-1 w-[120px]"
              value={rule.indicator}
              onChange={(e) => updateRule(index, 'indicator', e.target.value)}
            >
              <option value="">Indicator</option>
              {indicators.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>

            <select
              className="text-sm border rounded px-2 py-1 w-[100px]"
              value={rule.operator}
              onChange={(e) => updateRule(index, 'operator', e.target.value)}
            >
              <option value="">Operator</option>
              {operators.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>

            <select
              className="text-sm border rounded px-2 py-1 w-[120px]"
              value={rule.field}
              onChange={(e) => updateRule(index, 'field', e.target.value)}
            >
              <option value="">Target Field</option>
              {targetFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Value"
              className="text-sm border rounded px-2 py-1 w-[100px]"
              value={rule.value}
              onChange={(e) => updateRule(index, 'value', e.target.value)}
            />

            {/* Show minus icon if more than minRules */}
            {index >= minRules && (
              <button
                type="button"
                onClick={() => removeRule(index)}
                className="text-xl text-red-500 hover:text-red-700 px-2"
                title="Remove"
              >
                <MinusCircle size={20} />
                <img src="/minus.png" alt="Minus" className="w-5 h-5" />
              </button>
            )}

            {/* Show plus icon only on the last row */}
            {index === rules.length - 1 && (
              <button
                type="button"
                onClick={addRule}
                title="Add condition"
                className="hover:scale-105 transition-transform"
              >
                <PlusCircle size={20} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
