// src/features/ConditionBuilder/components/ContextUI.tsx

'use client';
import React, { useState } from 'react';
import { GROUPS } from '../models/conditionGroups';

export interface ContextUIProps {
  keyword: string;
  params: Record<string, string>;
  onParamChange: (key: string, value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function getOptionMeta(keyword: string) {
  for (const group of GROUPS) {
    for (const opt of group.options) {
      if (opt.key === keyword) return opt;
    }
  }
  return null;
}

export default function ContextUI({ keyword, params, onParamChange, onConfirm, onCancel }: ContextUIProps) {
  const option = getOptionMeta(keyword);
  const [localParams, setLocalParams] = useState<Record<string, string>>(params);

  if (!option) {
    return <div className="text-red-500">Unknown keyword: {keyword}</div>;
  }

  const handleChange = (key: string, value: string) => {
    setLocalParams(prev => ({ ...prev, [key]: value }));
    onParamChange(key, value);
  };

  const isDropdownParam = (param: string) => {
    return ['symbol', 'length', 'period', 'timeframe'].includes(param);
  };

  const dropdownOptions: Record<string, string[]> = {
    symbol: ['SBIN', 'NIFTY', 'BANKNIFTY', 'RELIANCE'],
    length: ['5', '10', '14', '21'],
    period: ['3', '5', '10', '20'],
    timeframe: ['1m', '5m', '15m', '1d'],
  };

  return (
    <div className="p-4 bg-gray-50 border rounded-lg shadow space-y-2">
      <h4 className="text-sm font-semibold mb-2">Parameters for {option.label}</h4>
      {option.params.map((param) => (
        <div key={param} className="flex flex-col gap-1">
          <label className="text-xs text-gray-600 capitalize">{param}</label>
          {isDropdownParam(param) ? (
            <select
              className="border px-2 py-1 rounded w-full text-sm"
              value={localParams[param] || ''}
              onChange={(e) => handleChange(param, e.target.value)}
            >
              <option value="">Select {param}</option>
              {dropdownOptions[param]?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              className="border px-2 py-1 rounded w-full text-sm"
              value={localParams[param] || ''}
              onChange={(e) => handleChange(param, e.target.value)}
              placeholder={`Enter ${param}`}
            />
          )}
        </div>
      ))}

      <div className="pt-4 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="border border-gray-300 bg-white px-3 py-1 rounded shadow-sm text-sm hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-blue-600 text-white px-4 py-1 rounded shadow-sm text-sm hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    </div>
  );
}
