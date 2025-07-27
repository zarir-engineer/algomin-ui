// components/RootGroupNodeBuilder.tsx
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css'
import { GROUPS } from '@/src/features/ConditionBuilder/models/conditionGroups'
import ChooseBlock from '@/src/features/ConditionBuilder/components/ChooseBlock'
import ConditionBuilder from './ConditionBuilder';
import { v4 as uuidv4 } from 'uuid';


function RootGroupNode({ data }: any) {
  const [chooseBlocks, setChooseBlocks] = useState<{ id: string; inputValue: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filtered, setFiltered] = useState<{ label: string; options: string[] }[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [logic, setLogic] = useState<'AND' | 'OR'>('AND');


  useEffect(() => {
    if (inputValue.trim() === '') {
      setFiltered([]);
      return;
    }
    const search = inputValue.toLowerCase();
    const matches = GROUPS.map(group => ({
      label: group.label,
      options: group.options.filter(opt => opt.toLowerCase().includes(search)),
    })).filter(group => group.options.length > 0);
    setFiltered(matches);
  }, [inputValue]);

  const handleSelectOption = (opt: string) => {
    setSelectedConditions(prev => [...prev, opt]);
    setInputValue('');
    setFiltered([]);
  };

  const handleRemove = (index: number) => {
    setSelectedConditions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="border rounded bg-gray-100 shadow p-4 overflow-auto"
      style={{ width: 'calc(100vw - 32px)', height: 'calc(100vh - 32px)' }}
    >
      <div className="flex justify-between items-center mb-2 text-xs sticky top-0 bg-gray-100 z-10">
        {selectedConditions.length > 1 && (
          <select defaultValue={data.operator} className="border rounded px-2 py-1">
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        )}
        <div className="flex gap-2 ml-auto">
          <button
            className="text-xs px-2 py-1 bg-green-200 rounded"
            onClick={() =>
              setChooseBlocks(prev => [...prev, { id: crypto.randomUUID(), inputValue: '' }])
            }
          >
            + Condition
          </button>
          <button className="text-xs px-2 py-1 bg-blue-200 rounded">+ Group</button>
          <button className="text-xs px-2 py-1 bg-red-200 rounded">×</button>
        </div>
      </div>

      {chooseBlocks.length > 1 && (
        <div className="relative pl-6 mb-2">
          {/* vertical bracket line */}
          <div className="absolute left-2 top-0 bottom-2 w-px bg-gray-400 z-0" />

          {/* AND/OR logic toggle */}
          <div className="mb-1 flex items-center gap-2 z-10 relative">
            <label className="text-xs font-semibold text-gray-700">Logic:</label>
            <div className="inline-flex border rounded overflow-hidden text-xs">
              <button
                className={`px-2 py-1 ${logic === 'AND' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setLogic('AND')}
              >
                AND
              </button>
              <button
                className={`px-2 py-1 ${logic === 'OR' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setLogic('OR')}
              >
                OR
              </button>
            </div>
          </div>

          {/* block list with elbow lines */}
          <div className="flex flex-col gap-[2px] relative z-10">
            {chooseBlocks.map(block => (
              <div key={block.id} className="relative">
                {/* elbow connector */}
                <div className="absolute -left-4 top-4 w-4 h-px bg-gray-400" />
                <ChooseBlock
                  key={block.id}
                  inputValue={block.inputValue}
                  onChange={(val) =>
                    setChooseBlocks(prev =>
                      prev.map(b => b.id === block.id ? { ...b, inputValue: val } : b)
                    )
                  }
                  onDelete={() =>
                    setChooseBlocks(prev => prev.filter(b => b.id !== block.id))
                  }
                  groups={GROUPS}
                  onSelectOption={(opt) => {
                    console.log('Selected:', opt, 'in block:', block.id);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback when only one block or zero */}
      {chooseBlocks.length <= 1 && (
        <div className="flex flex-col gap-2">
          {chooseBlocks.map(block => (
            <ChooseBlock
              key={block.id}
              inputValue={block.inputValue}
              onChange={(val) =>
                setChooseBlocks(prev =>
                  prev.map(b => b.id === block.id ? { ...b, inputValue: val } : b)
                )
              }
              onDelete={() =>
                setChooseBlocks(prev => prev.filter(b => b.id !== block.id))
              }
              groups={GROUPS}
              onSelectOption={(opt) => {
                console.log('Selected:', opt, 'in block:', block.id);
              }}
            />
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
}

const nodeTypes = {
  rootGroupNode: RootGroupNode,
};

const initialNodes: Node[] = [
  {
    id: 'root-1',
    type: 'rootGroupNode',
    position: { x: 0, y: 0 },
    data: { operator: 'AND' },
  },
];

const initialEdges: Edge[] = [];

export default function RootGroupNodeBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
    instance.setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 0 }); // prevent zoomTo(0.5)
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        nodesDraggable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        fitView={true}
        preventScrolling={false} // ← allows page scroll but not canvas move
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
