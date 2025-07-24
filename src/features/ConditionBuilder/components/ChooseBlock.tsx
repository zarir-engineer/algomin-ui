// components/ChooseBlock.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { X, Copy, ClipboardPaste } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getClipboard, setClipboard } from '@/src/utils/clipboard';

interface ChooseBlockProps {
  onDelete: () => void;
  inputValue: string;
  onChange: (val: string) => void;
  onSelectOption: (option: string) => void;
  groups: { label: string; options: string[] }[];
}

interface PreviewBlockProps {
  id: string;
  content: string;
  onRemove: (id: string) => void;
}

function generateUniqueId(base: string): string {
  return `${base}-${Math.random().toString(36).substring(2, 9)}`;
}

function PreviewBlock({ id, content, onRemove }: PreviewBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative bg-white border border-blue-300 shadow-md rounded-md p-2 text-sm text-blue-700 w-fit min-w-[160px]"
    >
      <button
        onClick={() => setClipboard(content)}
        className="absolute -top-3 -left-3 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow  group-hover:scale-110 transition-transform"
        title="Copy Block"
      >
        <Copy className="w-3.5 h-3.5 text-blue-600 group-hover:text-green-600" />
      </button>
      <button
        onClick={() => onRemove(id)}
        className="absolute -top-3 -right-3 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow"
        title="Remove Block"
      >
        <X className="w-3.5 h-3.5 text-red-600" />
      </button>

      <div className="font-bold text-center text-blue-700 mb-1">SelectionPreviewBlock</div>
      <div className="text-xs text-gray-700 text-center whitespace-nowrap">{content}</div>

    </div>
  );
}

export default function ChooseBlock({ onDelete, inputValue, onChange, onSelectOption, groups }: ChooseBlockProps) {
  const [filtered, setFiltered] = useState<typeof groups>([]);
  const [selectedItems, setSelectedItems] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFiltered([]);
      return;
    }
    const search = inputValue.toLowerCase();
    const matches = groups
      .map(group => ({
        label: group.label,
        options: group.options.filter(opt => opt.toLowerCase().includes(search)),
      }))
      .filter(group => group.options.length > 0);
    setFiltered(matches);
  }, [inputValue, groups]);

  const handleSelect = (opt: string) => {
    const uniqueId = generateUniqueId(opt);
    setSelectedItems(prev => [...prev, { id: uniqueId, label: opt }]);
    onSelectOption(opt);
    setFiltered([]);
  };

  const handlePaste = () => {
    const data = getClipboard();
    if (data) {
      const uniqueId = generateUniqueId(data);
      setSelectedItems(prev => [...prev, { id: uniqueId, label: data }]);
      onSelectOption(data);
      setFiltered([]);
    }
    setClipboard(null);
  };

  const handleRemove = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = selectedItems.findIndex(item => item.id === active.id);
      const newIndex = selectedItems.findIndex(item => item.id === over.id);
      setSelectedItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="w-full max-w-6xl mt-8 mx-auto rounded-md border border-gray-300 bg-white shadow-md overflow-visible min-h-[160px] pb-6">
      <div className="relative">
        <button
          onClick={handlePaste}
          className="absolute -top-3 right-6 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow"
          title="Paste"
        >
          <ClipboardPaste className="w-3.5 h-3.5 text-green-600" />
        </button>
        <button
          onClick={onDelete}
          className="absolute -top-3 -right-3 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow"
          title="Remove"
        >
          <X className="w-3.5 h-3.5 text-red-600" />
        </button>
      </div>

      <div className="flex items-start gap-6 px-4 pt-6">
        {/* Choose field */}
        <div className="flex flex-col gap-2 shrink-0 z-10 w-48">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Choose"
            className="border border-gray-300 rounded px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />

          {filtered.length > 0 && (
            <ul className="mt-1 bg-white border rounded shadow text-xs max-h-40 overflow-auto z-10">
              {filtered.map((group, gi) => (
                <React.Fragment key={gi}>
                  <li className="px-2 py-1 font-semibold text-gray-500 bg-gray-50 cursor-default">
                    {group.label}
                  </li>
                  {group.options.map((opt, i) => (
                    <li
                      key={i}
                      className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleSelect(opt)}
                    >
                      {opt}
                    </li>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          )}
        </div>

        {/* Sortable preview blocks */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={selectedItems.map(item => item.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex flex-wrap gap-4">
              {selectedItems.map((item) => (
                <PreviewBlock
                  key={item.id}
                  id={item.id}
                  content={`${item.label} ( Symbol (InstrumentName () , day All ) , 15, 15 ) 0`}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
