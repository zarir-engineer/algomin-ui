// Enhanced ConditionBuilder.tsx with nested group support + segmented toggle
'use client';

import React, { useEffect } from 'react';
import SymbolSelect from './SymbolSelect';

const OPERATORS = ['>', '<', '>=', '<=', '==', '!='];

export interface Condition {
  type: 'condition';
  symbol: { symbol: string; token: string };
  operator: string;
  value: number;
}

export interface ConditionGroup {
  type: 'group';
  logic: 'AND' | 'OR';
  conditions: ConditionNode[];
}

export type ConditionNode = Condition | ConditionGroup;

export interface ConditionBuilderProps {
  node: ConditionGroup;
  onChange: (node: ConditionGroup) => void;
}

const updateNode = (nodes: ConditionNode[], index: number, newNode: ConditionNode): ConditionNode[] => {
  return [...nodes.slice(0, index), newNode, ...nodes.slice(index + 1)];
};

export default function ConditionBuilder({ node, onChange }: ConditionBuilderProps) {
  console.log("🚨 ConditionBuilder mounted"); // <== Add this
  useEffect(() => {
    onChange(node);
  }, [node, onChange]);

  const addCondition = () => {
    const newCond: Condition = {
      type: 'condition',
      symbol: { symbol: '', token: '' },
      operator: '>',
      value: 0,
    };
    const updated = { ...node, conditions: [...node.conditions, newCond] };
    console.log("🔥🔥🔥 NEW CONDITION ADDED", updated);
    onChange(updated);
  };

  const addGroup = () => {
    const newGroup: ConditionGroup = {
      type: 'group',
      logic: 'AND',
      conditions: [],
    };
    onChange({ ...node, conditions: [...node.conditions, newGroup] });
  };

  const removeNode = (index: number) => {
    const copy = node.conditions.filter((_, i) => i !== index);
    onChange({ ...node, conditions: copy });
  };

  const updateChild = (index: number, updated: ConditionNode) => {
    const newConds = updateNode(node.conditions, index, updated);
    onChange({ ...node, conditions: newConds });
  };

  const conditionCount = node.conditions.filter(c => c.type === 'condition').length;

  return (
    <div className="space-y-4 border-l-4 border-blue-200 pl-4">
      {conditionCount > 1 && (
        <div className="flex gap-0 rounded overflow-hidden w-fit border border-blue-600 text-xs font-semibold mb-2">
          {['AND', 'OR'].map((val) => (
            <button
              key={val}
              onClick={() => onChange({ ...node, logic: val as 'AND' | 'OR' })}
              className={`px-3 py-1 transition-colors ${
                node.logic === val ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      )}

      {node.conditions.map((c, i) => (
        <div key={i} className="relative ml-4 pl-4 border-l-2 border-blue-200 mb-4">
          {'symbol' in c ? (
            <div className="flex gap-2 items-center border p-2 bg-gray-50 rounded mb-2">
              <SymbolSelect
                value={c.symbol}
                onChange={val => updateChild(i, { ...c, symbol: val })}
                placeholder="Select symbol"
              />
              <select
                value={c.operator}
                onChange={e => updateChild(i, { ...c, operator: e.target.value })}
              >
                {OPERATORS.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
              <input
                type="number"
                value={c.value}
                onChange={e => updateChild(i, { ...c, value: parseFloat(e.target.value) })}
              />
              <button onClick={() => removeNode(i)}>🗑</button>
            </div>
          ) : (
            <div className="ml-2">
              <ConditionBuilder
                node={c}
                onChange={updated => updateChild(i, updated)}
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        <button onClick={addCondition}>+ Condition</button>
        <button onClick={addGroup}>+ Group</button>
      </div>
    </div>
  );
}
