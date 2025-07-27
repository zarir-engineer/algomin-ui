// app/test-condition/page.tsx
'use client';

import React, { useState } from 'react';
import ConditionBuilder, { ConditionGroup } from '../../src/features/ConditionBuilder/components/ConditionBuilder';

export default function TestConditionPage() {
  const [rootNode, setRootNode] = useState<ConditionGroup>({
    type: 'group',
    logic: 'AND',
    conditions: [],
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">🧪 Test: Condition Builder</h2>

      <ConditionBuilder node={rootNode} onChange={setRootNode} />

      <pre className="bg-gray-100 text-xs p-2 mt-4 rounded overflow-auto">
        {JSON.stringify(rootNode, null, 2)}
      </pre>
    </div>
  );
}
