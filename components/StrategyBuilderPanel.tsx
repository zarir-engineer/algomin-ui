// components/StrategyBuilderPanel.tsx
'use client';

import { useState, useEffect } from 'react';

const indicators = ['EMA', 'SMA', 'MACD'];
const operators = ['<', '>', '<=', '>=', '=='];
const targetFields = ['LTP', 'Open', 'Close'];

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
      <h3 className="text-md font-semibold text-gray-800 mb-2">Conditions</h3>
      <div className="flex flex-col gap-2">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-center gap-2">
            <select
              className="text-sm px-2 py-1 border rounded"
              value={rule.indicator}
              onChange={(e) => updateRule(index, 'indicator', e.target.value)}
            >
              <option value="">Indicator</option>
              {indicators.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>

            <select
              className="text-sm px-2 py-1 border rounded"
              value={rule.operator}
              onChange={(e) => updateRule(index, 'operator', e.target.value)}
            >
              <option value="">Operator</option>
              {operators.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>

            <select
              className="text-sm px-2 py-1 border rounded"
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
              className="text-sm px-2 py-1 border rounded w-24"
              value={rule.value}
              onChange={(e) => updateRule(index, 'value', e.target.value)}
            />

            {rules.length > minRules && (
              <button
                onClick={() => removeRule(index)}
                className="text-xl text-red-500 hover:text-red-700"
                title="Remove condition"
              >
                &minus;
              </button>
            )}
          </div>
        ))}
        <div>
          <button
            onClick={addRule}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            + Add Another Condition
          </button>
        </div>
      </div>
    </div>
  );
}
