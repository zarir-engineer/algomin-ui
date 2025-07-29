// components/RootGroupNode.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { GROUPS } from '@/src/features/ConditionBuilder/models/conditionGroups';
import ChooseBlock from '@/src/features/ConditionBuilder/components/ChooseBlock';
import { v4 as uuidv4 } from 'uuid';
import { useReactFlow } from 'reactflow';

export type ChooseBlockData = {
  id: string;
  inputValue: string;
  keyword: string;
  contextParams: Record<string, string>;
  selectedItems: { id: string; label: string }[];
};

export default function RootGroupNode({ data }: any) {
  const [chooseBlocks, setChooseBlocks] = useState<ChooseBlockData[]>([]);
  const [logic, setLogic] = useState<'AND' | 'OR'>('AND');
  const { setNodes } = useReactFlow();
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nodeRef.current) return;

    const height = nodeRef.current.offsetHeight;

    setNodes((nds) =>
      nds.map((node) =>
        node.id === data.id // make sure data.id is passed correctly
          ? { ...node, style: { ...node.style, height } }
          : node
      )
    );
  }, [chooseBlocks.length]); // you can also include showCondition if needed

  const addCondition = () => {
    setChooseBlocks(prev => [
      ...prev,
      { id: uuidv4(), inputValue: '', keyword: '', contextParams: {}, selectedItems: [] }
    ]);
  };


  return (
    <div ref={nodeRef} className="bg-gray-100 p-4 w-full">
      <div className="bg-gray-100 p-4 overflow-visible w-full" style={{ minHeight: '100%', height: 'auto' }}>
        <div className="border rounded bg-gray-100 shadow p-4 overflow-visible pt-6 w-full h-full">
          <div className="flex justify-end items-center mb-2 pr-8 text-xs sticky top-0 bg-gray-100 z-20 pb-2">
            <button onClick={addCondition} className="text-xs px-2 py-1 bg-green-200 rounded">
              + Condition
            </button>
            <button className="ml-2 text-xs px-2 py-1 bg-blue-200 rounded">+ Group</button>
            <button className="ml-2 text-xs px-2 py-1 bg-red-200 rounded">×</button>
            {/* future +Group and delete buttons here */}
          </div>

          {chooseBlocks.length > 1 && (
            <div className="relative pl-6 mb-2">
              <div className="absolute left-80 top-0 bottom-2 w-px bg-gray-400" />
              <div className="mb-1 flex items-center gap-2 relative z-10 mt-8"> {/* mt 8 is moving switch margin making it visible */}
                <div className="absolute left-1/6 -translate-x-1/2 -top-6 inline-flex border rounded overflow-hidden text-xs bg-white z-20 shadow">
                  <button
                    className={`px-2 py-1 ${logic === 'AND' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setLogic('AND')}
                  >AND</button>
                  <button
                    className={`px-2 py-1 ${logic === 'OR' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setLogic('OR')}
                  >OR</button>
                </div>
              </div>
              <div className="flex flex-col gap-2 relative z-10">
                {chooseBlocks.map(block => (
                  <div key={block.id} className="relative">
                    <div className="absolute left-74 top-4 w-4 h-px bg-gray-400" />
                    <ChooseBlock
                      inputValue={block.inputValue}
                      onChange={val => setChooseBlocks(prev => prev.map(b => b.id === block.id ? { ...b, inputValue: val } : b))}
                      onDelete={() => setChooseBlocks(prev => prev.filter(b => b.id !== block.id))}
                      groups={GROUPS}
                      selectedKeyword={block.keyword}
                      onKeywordChange={val => setChooseBlocks(prev => prev.map(b => b.id === block.id ? { ...b, keyword: val } : b))}
                      contextParams={block.contextParams}
                      onContextParamsChange={params => setChooseBlocks(prev => prev.map(b => b.id === block.id ? { ...b, contextParams: params } : b))}
                      selectedItems={block.selectedItems}
                      onSelectedItemsChange={items => setChooseBlocks(prev => prev.map(b => b.id === block.id ? { ...b, selectedItems: items } : b))}
                      onSelectOption={opt => console.log('Selected:', opt)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 flex-grow overflow-y-auto">
            {chooseBlocks.length === 1 && (
              <ChooseBlock
                inputValue={chooseBlocks[0].inputValue}
                onChange={val => setChooseBlocks(prev => [{ ...prev[0], inputValue: val }])}
                onDelete={() => setChooseBlocks([])}
                groups={GROUPS}
                selectedKeyword={chooseBlocks[0].keyword}
                onKeywordChange={val => setChooseBlocks(prev => [{ ...prev[0], keyword: val }])}
                contextParams={chooseBlocks[0].contextParams}
                onContextParamsChange={params => setChooseBlocks(prev => [{ ...prev[0], contextParams: params }])}
                selectedItems={chooseBlocks[0].selectedItems}
                onSelectedItemsChange={items => setChooseBlocks(prev => [{ ...prev[0], selectedItems: items }])}
                onSelectOption={opt => console.log('Selected:', opt)}
              />
            )}
          </div>
          {/* ✅ Submit at end of content */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => console.log("Submit pressed")}
              className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
            >
              Submit
            </button>
          </div>

          <Handle type="source" position={Position.Bottom} />
          <Handle type="target" position={Position.Top} />
        </div>
      </div>
    </div>
  );
}