// components/StrategyBuilderPanel.tsx
'use client';

import { useState } from 'react';

const indicators = ['EMA', 'SMA', 'MACD'];
const operators = ['<', '>', '<=', '>=', '=='];
const targetFields = ['Last Traded Price', 'Open', 'Close'];

export default function StrategyBuilderPanel() {
  const [rules, setRules] = useState([
    { indicator: '', operator: '', field: '', value: '' },
  ]);

  const updateRule = (index: number, key: string, value: string) => {
    setRules(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const addRule = () => {
    setRules(prev => [...prev, { indicator: '', operator: '', field: '', value: '' }]);
  };

  return (
    <div className="mt-4 p-4 bg-white border rounded shadow">
      <h3 className="text-md font-semibold mb-3">Strategy Builder</h3>
      {rules.map((rule, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <select
            className="border rounded px-2 py-1"
            value={rule.indicator}
            onChange={(e) => updateRule(index, 'indicator', e.target.value)}
          >
            <option value="">Indicator</option>
            {indicators.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          <select
            className="border rounded px-2 py-1"
            value={rule.operator}
            onChange={(e) => updateRule(index, 'operator', e.target.value)}
          >
            <option value="">Operator</option>
            {operators.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>

          <select
            className="border rounded px-2 py-1"
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
            className="border rounded px-2 py-1 w-24"
            value={rule.value}
            onChange={(e) => updateRule(index, 'value', e.target.value)}
          />
        </div>
      ))}

      <button
        onClick={addRule}
        className="mt-2 text-sm text-blue-600 hover:underline"
      >
        + Add Another Condition
      </button>
    </div>
  );
}
