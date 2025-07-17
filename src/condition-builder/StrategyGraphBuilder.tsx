// components/StrategyGraphBuilder.tsx
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
import 'reactflow/dist/style.css';
import { GROUPS } from '@/src/config/conditionGroups';

function RootGroupNode({ data }: any) {
  const [showCondition, setShowCondition] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filtered, setFiltered] = useState<{ label: string; options: string[] }[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

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
    <div className="bg-gray-100 rounded shadow p-4 w-full h-full border relative overflow-auto">
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
            onClick={() => setShowCondition(true)}
          >
            + Condition
          </button>
          <button className="text-xs px-2 py-1 bg-blue-200 rounded">+ Group</button>
          <button className="text-xs px-2 py-1 bg-red-200 rounded">×</button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {showCondition && (
          <div className="relative">
            <input
              type="text"
              placeholder="Choose"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border rounded px-2 py-1 text-xs bg-white shadow w-64"
            />
            {filtered.length > 0 && (
              <ul className="absolute z-10 mt-1 bg-white border rounded shadow text-xs w-64 max-h-40 overflow-auto">
                {filtered.map((group, gi) => (
                  <React.Fragment key={gi}>
                    <li className="px-2 py-1 font-semibold text-gray-500 cursor-default bg-gray-50">
                      {group.label}
                    </li>
                    {group.options.map((opt, i) => (
                      <li
                        key={i}
                        className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleSelectOption(opt)}
                      >
                        {opt}
                      </li>
                    ))}
                  </React.Fragment>
                ))}
              </ul>
            )}
          </div>
        )}

        {selectedConditions.map((cond, index) => (
          <div
            key={index}
            className="relative border rounded px-3 py-2 text-xs bg-white shadow w-fit flex items-center gap-2"
          >
            <button className="absolute top-0 left-0 text-xs" title="Duplicate">+</button>
            <span className="text-blue-700 font-semibold">{cond}</span>
            <button
              className="absolute top-0 right-0 text-xs"
              title="Delete"
              onClick={() => handleRemove(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
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
    style: { width: '100vw', height: '100vh' },
  },
];

const initialEdges: Edge[] = [];

export default function StrategyGraphBuilder() {
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
    instance.zoomTo(1);
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
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
