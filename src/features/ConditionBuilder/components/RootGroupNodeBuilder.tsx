// components/RootGroupNodeBuilder.tsx
'use client';

import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import RootGroupNode, { ChooseBlockData } from './RootGroupNode';

const nodeTypes = { rootGroupNode: RootGroupNode };

const initialNodes: Node<unknown, { operator: 'AND' | 'OR' }>[] = [
  {
    id: 'root-1',
    type: 'rootGroupNode',
    position: { x: 0, y: 0 },
    data: { operator: 'AND' },
    style: { width: '100vw', height: '100vh' },
  },
];

const initialEdges: Edge[] = [];

export default function RootGroupNodeBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const onConnect = useCallback((params: Edge | Connection) => setEdges(eds => addEdge(params, eds)), []);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
    instance.setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 0 });
  }, []);

  return (
    <ReactFlowProvider>
      <div ref={reactFlowWrapper} className="w-full h-screen overflow-hidden">
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
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>

  );
}
