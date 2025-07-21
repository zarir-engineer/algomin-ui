// components/ChooseBlock.tsx
'use client';

import React from 'react';
import { X, Copy } from 'lucide-react';

interface ChooseBlockProps {
  onDelete: () => void;
}

export default function ChooseBlock({ onDelete }: ChooseBlockProps) {
  return (
    <div className="relative w-full max-w-6xl mt-8 ml-8 rounded-md border border-gray-300 bg-gray-100 shadow-md overflow-hidden h-24">
      {/* Floating Copy Icon (Top Left) */}
      <button
        className="absolute -top-3 -left-3 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow"
        title="Duplicate"
      >
        <Copy className="w-3.5 h-3.5 text-blue-600" />
      </button>

      {/* Floating Delete Icon (Top Right) */}
      <button
        onClick={onDelete}
        className="absolute -top-3 -right-3 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow"
        title="Remove"
      >
        <X className="w-3.5 h-3.5 text-red-600" />
      </button>

      <div className="bg-gray-300 w-12 h-full rounded-l-md float-left flex items-center justify-center">
        {/* Left visual bar only, no icon */}
      </div>
    </div>
  );
}
