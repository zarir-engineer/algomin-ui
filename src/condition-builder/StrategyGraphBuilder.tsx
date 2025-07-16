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

function RootGroupNode({ data }: any) {
  const [showCondition, setShowCondition] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="bg-gray-100 rounded shadow p-4 w-[calc(100vw-32px)] h-[calc(100vh-32px)] border">
      <div className="flex justify-between items-center mb-2 text-xs">
        <select defaultValue={data.operator} className="border rounded px-2 py-1">
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <div className="flex gap-2">
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
          <input
            type="text"
            placeholder="Choose"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border rounded px-2 py-1 text-xs bg-white shadow w-64"
          />
        )}
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
    position: { x: 16, y: 16 },
    data: { operator: 'AND' },
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
    instance.fitView();
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
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
