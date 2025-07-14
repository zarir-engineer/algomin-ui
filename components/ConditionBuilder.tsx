// Enhanced ConditionBuilder.tsx with nested group support
'use client';

import React, { useEffect } from 'react';
import SymbolSelect from './SymbolSelect';

const OPERATORS = ['>', '<', '>=', '<=', '==', '!='];

// Define types
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

// Update helper
const updateNode = (nodes: ConditionNode[], index: number, newNode: ConditionNode): ConditionNode[] => {
  return [...nodes.slice(0, index), newNode, ...nodes.slice(index + 1)];
};

export default function ConditionBuilder({ node, onChange }: ConditionBuilderProps) {
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
    onChange({ ...node, conditions: [...node.conditions, newCond] });
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

  return (
    <div className="space-y-4 border-l-4 border-blue-200 pl-4">
      <div className="flex items-center gap-2">
        <label className="font-medium">Logic:</label>
        <select
          value={node.logic}
          onChange={e => onChange({ ...node, logic: e.target.value as 'AND' | 'OR' })}
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
      </div>

      {node.conditions.map((c, i) => (
        <div key={i} className="flex flex-col border p-2 bg-gray-50 rounded">
          {'symbol' in c ? (
            <div className="flex gap-2 items-center">
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
            <ConditionBuilder
              node={c}
              onChange={updated => updateChild(i, updated)}
            />
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <button onClick={addCondition}>+ Condition</button>
        <button onClick={addGroup}>+ Group</button>
      </div>
    </div>
  );
}
