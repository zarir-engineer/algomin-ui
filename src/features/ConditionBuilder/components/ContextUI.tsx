// src/features/ConditionBuilder/components/ContextUI.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { DROPDOWN_OPTIONS } from '../models/dropdownOptions';
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

  useEffect(() => {
    setLocalParams(params);
  }, [params]);

  if (!option) {
    return null;
  }

  const handleChange = (key: string, value: string) => {
    setLocalParams(prev => ({ ...prev, [key]: value }));
    onParamChange(key, value);
  };

  const isDropdownParam = (param: string) => {
    return ['symbol', 'length', 'period', 'timeframe'].includes(param);
  };


  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h4 className="text-lg font-semibold mb-4">Configure: {option.label}</h4>
        <div className="space-y-3">
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
                  {DROPDOWN_OPTIONS[param]?.map((opt) => (
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
        </div>

        <div className="pt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="border border-gray-300 bg-white px-4 py-1 rounded shadow-sm text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(option.label)}
            className="bg-blue-600 text-white px-4 py-1 rounded shadow-sm text-sm hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
