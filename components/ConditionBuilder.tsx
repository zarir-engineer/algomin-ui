import React, { useEffect, useState } from 'react';
import SymbolSelect from './SymbolSelect';

export interface Condition {
  symbol: { symbol: string; token: string };
  operator: string;
  value: number;
}

export interface ConditionBuilderProps {
  onChange: (conds: Condition[]) => void;
}

const OPERATORS = ['>', '<', '>=', '<=', '==', '!='];

export default function ConditionBuilder({ onChange }: ConditionBuilderProps) {
  const [conditions, setConditions] = useState<Condition[]>([
    { symbol: { symbol: '', token: '' }, operator: '', value: 0 },
  ]);

  useEffect(() => {
    onChange(conditions);
  }, [conditions, onChange]);

  // Explicitly type the `updateCondition` function
  const updateCondition = <K extends keyof Condition>(
    index: number,  // `index` is a number because it's an array index
    field: K,       // `field` is a key of the `Condition` interface (symbol, operator, value)
    newValue: Condition[K]  // `newValue` must be the correct type for the specific field
  ): void => {
    setConditions(old => {
      const copy = [...old];
      // Update the condition at the specified index immutably
      copy[index] = { ...copy[index], [field]: newValue };
      return copy;
    });
  };

  const addCondition = () =>
    setConditions(prev => [
      ...prev,
      {
        symbol: { symbol: '', token: '' },
        operator: '>',
        value: 0,
      },
    ]);

  const removeCondition = (i: number) =>
    setConditions(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {conditions.map((c, i) => (
        <div key={i} className="flex gap-2 items-center">
          <SymbolSelect
            value={c.symbol}
            onChange={val => updateCondition(i, 'symbol', val)}
            placeholder="Select a trading symbol"
          />
          <select
            value={c.operator}
            onChange={e => updateCondition(i, 'operator', e.target.value)}
          >
            {OPERATORS.map(op => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={c.value}
            onChange={e => updateCondition(i, 'value', parseFloat(e.target.value))}
          />
          <button
            onClick={() => removeCondition(i)}
            disabled={conditions.length === 1}
          >
            Remove
          </button>
        </div>
      ))}
      <button onClick={addCondition}>+ Add Condition</button>
    </div>
  );
}
