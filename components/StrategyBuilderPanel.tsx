// components/StrategyBuilderPanel.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ConditionBuilder from './ConditionBuilder';
import LivePriceSubscriber from './LivePriceSubscriber';
import { Card, CardContent, CardHeader } from '@/components/ui';


export interface StrategyBuilderPanelProps {
  minRules?: number;
}

type Condition = {
  symbol: string | { symbol: string; token: string };
  operator: string;
  value: number;
};


interface ConditionGroup {
  type: 'AND' | 'OR';
  conditions: (Condition | ConditionGroup)[];
}

function evaluateCondition(cond: Condition, livePrices: Record<string, number>) {
  const symbolKey = typeof cond.symbol === 'string' ? cond.symbol : cond.symbol.symbol;
  const ltp = livePrices[symbolKey];

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
    const unique = Array.from(
      new Set(
        conditions
          .map(c => typeof c.symbol === 'string' ? c.symbol : c.symbol.symbol)
          .filter(Boolean)
      )
    );
    setSymbols(unique);

  }, [conditions]);

  // ✅ Render one subscriber per symbol; each will call the hook correctly
  //    and push its latest LTP back up via onUpdate.
  const handleConditionsChange = useCallback((conds: Condition[]) => {
    setConditions(conds);
  }, []);

  // render subscribers for each symbol
  const subscribers = symbols.map(symbol => (
    <LivePriceSubscriber
      key={symbol}
      symbol={symbol}
      onUpdate={(sym, ltp) => setLivePrices(prev => ({ ...prev, [sym]: ltp }))}
    />
  ));

  // check if all conditions are met
  const allMet =
    conditions.length >= minRules &&
    conditions.every(c => evaluateCondition(c, livePrices));


  return (
    <Card>
      <CardHeader>Strategy Builder</CardHeader>
      <CardContent>
	{/* ADHD Tip: ConditionBuilder calls onChange when rules update */}    
	<ConditionBuilder onChange={handleConditionsChange} />
	{/* ADHD Tip: Render subscribers invisibly to update livePrices */}     
	{subscribers}
	{/* ADHD Tip: Show result when rules can be evaluated */}
	<div className="mt-4">
	  <span className="text-sm font-medium">Result: </span>
	  <span className={allMet ? 'text-green-600' : 'text-red-600'}>
	    {allMet ? 'All conditions met' : 'Not met'}
	  </span>	
	</div>
    </CardContent>
    </Card>
  );
}
