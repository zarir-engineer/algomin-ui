// components/ContextForm.tsx
'use client';

import React, { useState } from 'react';
import { KEYWORD_META, ParamDef } from './KeywordMeta';

interface ContextFormProps {
  keyword: string;
  onSubmit: (values: Record<string, any>) => void;
  onCancel: () => void;
}

export default function ContextForm({ keyword, onSubmit, onCancel }: ContextFormProps) {
  const meta = KEYWORD_META[keyword];
  const initial: Record<string, any> = {};
  meta.params.forEach(p => { initial[p.name] = ''; });
  const [values, setValues] = useState(initial);

  return (
    <div className="absolute bg-white border rounded shadow-lg p-4 z-20 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">{meta.title} Parameters</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-800">×</button>
      </div>
      {meta.params.map((p: ParamDef) => (
        <div key={p.name} className="mb-3">
          <label className="block text-sm mb-1">{p.label}</label>
          {p.type === 'select' ? (
            <select
              value={values[p.name]}
              onChange={e => setValues(v => ({ ...v, [p.name]: e.target.value }))}
              className="border rounded w-full px-2 py-1"
            >
              <option value="">Select {p.label}</option>
              {p.options!.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input
              type={p.type}
              value={values[p.name]}
              onChange={e => setValues(v => ({ ...v, [p.name]: e.target.value }))}
              className="border rounded w-full px-2 py-1"
            />
          )}
        </div>
      ))}
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-1">Cancel</button>
        <button
          onClick={() => onSubmit(values)}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          OK
        </button>
      </div>
    </div>
  );
}
