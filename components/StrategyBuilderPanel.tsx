// components/StrategyBuilderPanel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import ConditionBuilder from './ConditionBuilder';
import useLiveTicks from '@/hooks/useLiveTicks';
import SymbolSelect from './SymbolSelect';

export interface StrategyBuilderPanelProps {
  minRules?: number;
}

interface Condition {
  symbol: string;
  operator: string;
  value: number;
}

interface ConditionGroup {
  type: 'AND' | 'OR';
  conditions: (Condition | ConditionGroup)[];
}

function evaluateCondition(cond: Condition, livePrices: Record<string, number>) {
  const ltp = livePrices[cond.symbol];
  if (ltp === undefined) return false;
  switch (cond.operator) {
    case '>': return ltp > cond.value;
    case '<': return ltp < cond.value;
    case '>=': return ltp >= cond.value;
    case '<=': return ltp <= cond.value;
    case '==': return ltp === cond.value;
    case '!=': return ltp !== cond.value;
    default: return false;
  }
}

function evaluateGroup(group: ConditionGroup, livePrices: Record<string, number>): boolean {
  return group.conditions.reduce((acc, cond, i) => {
    const result = 'type' in cond
      ? evaluateGroup(cond as ConditionGroup, livePrices)
      : evaluateCondition(cond as Condition, livePrices);
    return group.type === 'AND' ? acc && result : acc || result;
  }, group.type === 'AND');
}

export default function StrategyBuilderPanel({ minRules = 1 }: StrategyBuilderPanelProps) {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [symbols, setSymbols] = useState<string[]>([]);

  // Collect unique symbols and fetch their ticks
  useEffect(() => {
    const unique = Array.from(new Set(conditions.map(c => c.symbol).filter(Boolean)));
    setSymbols(unique);
  }, [conditions]);

  // Subscribe to live prices using useLiveTicks for each symbol
  useEffect(() => {
    const prices: Record<string, number> = {};
    const timers = symbols.map(symbol => {
      const tick = useLiveTicks(symbol, 'DUMMY', true); // replace 'DUMMY' and true with real broker/useDummy as needed
      if (tick?.ltp !== undefined) prices[symbol] = tick.ltp;
    });
    setLivePrices(prices);
  }, [symbols]);

  const handleConditionsChange = (conds: any[]) => {
    setConditions(conds);
  };

  const allMet = conditions.every(c => evaluateCondition(c, livePrices));

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="text-lg font-semibold mb-4">Strategy Builder</h2>
      <ConditionBuilder onChange={handleConditionsChange} />
      <div className="mt-4">
        <span className="text-sm font-medium">Evaluation Result: </span>
        <span className={allMet ? 'text-green-600' : 'text-red-600'}>
          {allMet ? 'All conditions met' : 'Not met'}
        </span>
      </div>
    </div>
  );
}
