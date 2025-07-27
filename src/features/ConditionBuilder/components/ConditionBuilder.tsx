'use client';

import React from 'react';

interface ConditionBuilderProps {
  id: string;
  onDelete: () => void;
}

export default function ConditionBuilder({ id, onDelete }: ConditionBuilderProps) {
  return (
    <div className="bg-white border rounded-md p-4 shadow-md flex justify-between items-center">
      <span className="text-gray-800 text-sm">Condition Block ID: {id}</span>
      <button
        onClick={onDelete}
        className="red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
      >
        ❌
      </button>
    </div>
  );
}
