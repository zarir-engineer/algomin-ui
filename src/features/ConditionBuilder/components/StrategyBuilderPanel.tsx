// StrategyBuilderPanel.tsx updated for nested conditions
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ConditionBuilder, { ConditionGroup, ConditionNode } from './ConditionBuilder';
import LivePriceSubscriber from './LivePriceSubscriber';
import { Card, CardContent, CardHeader } from '@/components/ui';

export interface StrategyBuilderPanelProps {
  minRules?: number;
}

function evaluateCondition(cond: any, livePrices: Record<string, number>) {
  const ltp = livePrices[cond.symbol.symbol];
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
    const result = cond.type === 'group'
      ? evaluateGroup(cond, livePrices)
      : evaluateCondition(cond, livePrices);
    return group.logic === 'AND' ? acc && result : acc || result;
  }, group.logic === 'AND');
}

export default function StrategyBuilderPanel({ minRules = 1 }: StrategyBuilderPanelProps) {
  const [rootGroup, setRootGroup] = useState<ConditionGroup>({
    type: 'group',
    logic: 'AND',
    conditions: [],
  });
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [symbols, setSymbols] = useState<string[]>([]);

  useEffect(() => {
    const extractSymbols = (node: ConditionNode): string[] => {
      if (node.type === 'group') {
        return node.conditions.flatMap(extractSymbols);
      }
      return node.symbol.symbol ? [node.symbol.symbol] : [];
    };
    const allSymbols = Array.from(new Set(extractSymbols(rootGroup)));
    setSymbols(allSymbols);
  }, [rootGroup]);

  const subscribers = symbols.map(symbol => (
    <LivePriceSubscriber
      key={symbol}
      symbol={symbol}
      onUpdate={(sym, ltp) => setLivePrices(prev => ({ ...prev, [sym]: ltp }))}
    />
  ));

  const allMet = rootGroup.conditions.length >= minRules && evaluateGroup(rootGroup, livePrices);

  return (
    <Card>
      <CardHeader>Strategy Builder</CardHeader>
      <CardContent>
        {/*ConditionBuilderV2 onChange={handleConditionsChange} */}
        <ConditionBuilder node={rootGroup} onChange={setRootGroup} />
        {subscribers}
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
