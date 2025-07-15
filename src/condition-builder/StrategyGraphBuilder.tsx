// components/StrategyGraphBuilder.tsx
'use client';

import React, { useCallback } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';

const CANDLE_FIELDS = ['Open', 'High', 'Low', 'Close'];
const OPERATORS = ['>', '<', '>=', '<=', '==', '!='];
const OFFSETS = ['0', '-1', '-2'];

function ConditionNode({ data }: any) {
  return (
    <div className="bg-white rounded shadow p-3 text-xs w-56">
      <div className="font-semibold mb-2">Condition Node</div>
      <div className="flex flex-col gap-1">
        <label>Candle Field:</label>
        <select defaultValue={data.left || 'Close'} className="border rounded px-2 py-1">
          {CANDLE_FIELDS.map(f => <option key={f}>{f}</option>)}
        </select>

        <label>Offset:</label>
        <select defaultValue={data.offset || '0'} className="border rounded px-2 py-1">
          {OFFSETS.map(o => <option key={o}>{o}</option>)}
        </select>

        <label>Operator:</label>
        <select defaultValue={data.operator || '>'} className="border rounded px-2 py-1">
          {OPERATORS.map(op => <option key={op}>{op}</option>)}
        </select>

        <label>Compare To:</label>
        <input type="number" defaultValue={data.value || 0} className="border rounded px-2 py-1" />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function LogicOperatorNode({ data }: any) {
  return (
    <div className="bg-black text-white rounded shadow px-4 py-2">
      LogicOperatorNode: {data.operator}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  conditionNode: ConditionNode,
  logicNode: LogicOperatorNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'conditionNode',
    position: { x: 50, y: 100 },
    data: { left: 'Close', offset: '0', operator: '>', value: 2500 },
  },
  {
    id: '2',
    type: 'conditionNode',
    position: { x: 250, y: 100 },
    data: { left: 'Close', offset: '0', operator: '<', value: 16000 },
  },
  {
    id: '3',
    type: 'logicNode',
    position: { x: 150, y: 250 },
    data: { operator: 'AND' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function StrategyGraphBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
