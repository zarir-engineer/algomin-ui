// components/ChooseBlock.tsx
'use client';

import React, { useEffect } from 'react';
import { X, Copy, ClipboardPaste } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getClipboard, setClipboard } from '@/src/utils/clipboard';
import { GROUPS } from '@/src/features/ConditionBuilder/models/conditionGroups';
import ContextUI from './ContextUI';

interface ChooseBlockProps {
  onDelete: () => void;
  inputValue: string;
  onChange: (val: string) => void;
  onSelectOption: (option: string) => void;
  groups: { label: string; options: { key: string; label: string }[] }[];
  selectedKeyword: string;
  onKeywordChange: (val: string) => void;
  contextParams: Record<string, string>;
  onContextParamsChange: (params: Record<string, string>) => void;
  selectedItems: { id: string; label: string }[];
  onSelectedItemsChange: (items: { id: string; label: string }[]) => void;
}

function generateUniqueId(base: string): string {
  return `${base}-${Math.random().toString(36).substring(2, 9)}`;
}

function PreviewBlock({ id, label, content, onRemove }: { id: string; label: string; content: string; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="relative bg-white border border-blue-300 shadow-md rounded-md p-2 text-sm text-blue-700 w-fit min-w-[160px] min-h-[60px] flex items-center"
    >
      <button onClick={() => setClipboard(content)} className="absolute -top-3 -left-3 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow" title="Copy Block">
        <Copy className="w-3.5 h-3.5 text-blue-600" />
      </button>
      <button onClick={() => onRemove(id)} className="absolute -top-3 -right-3 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow" title="Remove Block">
        <X className="w-3.5 h-3.5 text-red-600" />
      </button>

      <div className="font-bold text-center text-blue-700 mb-1">{label}</div>
      <div className="text-xs text-gray-700 text-center whitespace-nowrap">{content}</div>
    </div>
  );
}

export default function ChooseBlock({
  onDelete,
  inputValue,
  onChange,
  onSelectOption,
  groups,
  selectedKeyword,
  onKeywordChange,
  contextParams,
  onContextParamsChange,
  selectedItems,
  onSelectedItemsChange,
}: ChooseBlockProps) {
  const [filtered, setFiltered] = React.useState<typeof groups>([]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setFiltered([]);
      return;
    }
    const search = inputValue.toLowerCase();
    const matches = groups.map(group => ({
      label: group.label,
      options: group.options.filter(opt => opt.label.toLowerCase().includes(search)),
    })).filter(g => g.options.length > 0);
    setFiltered(matches);
  }, [inputValue, groups]);

  const handleSelect = (optLabel: string) => {
    const uniqueId = generateUniqueId(optLabel);
    onSelectedItemsChange([...selectedItems, { id: uniqueId, label: optLabel }]);
    onSelectOption(optLabel);
    setFiltered([]);
  };

  const handlePaste = () => {
    const data = getClipboard();
    if (data) {
      const uniqueId = generateUniqueId(data);
      onSelectedItemsChange([...selectedItems, { id: uniqueId, label: data }]);
      onSelectOption(data);
      setFiltered([]);
    }
    setClipboard(null);
  };

  const handleRemove = (id: string) => {
    onSelectedItemsChange(selectedItems.filter(item => item.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = selectedItems.findIndex(item => item.id === active.id);
      const newIndex = selectedItems.findIndex(item => item.id === over.id);
      const newOrder = arrayMove(selectedItems, oldIndex, newIndex);
      onSelectedItemsChange(newOrder);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto border border-gray-200 bg-white shadow-sm overflow-visible p-1">
      <div className="relative">
        <button onClick={handlePaste} className="absolute -top-3 right-6 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow" title="Paste">
          <ClipboardPaste className="w-3.5 h-3.5 text-green-600" />
        </button>
        <button onClick={onDelete} className="absolute -top-3 -right-3 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow" title="Remove">
          <X className="w-3.5 h-3.5 text-red-600" />
        </button>
      </div>

      <div className="flex items-start gap-4 px-2 pt-2">
        <div className="flex flex-col gap-2 shrink-0 z-10 w-48">
          <select
            value={selectedKeyword || ''}
            onChange={e => {
              const key = e.target.value;
              onKeywordChange(key);
              onContextParamsChange({});
              onChange(key);
              onSelectOption(key);
            }}
          >
            <option value="">Choose...</option>
            {GROUPS.map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </optgroup>
            ))}
          </select>

          {filtered.length > 0 && (
            <ul className="mt-1 bg-white border rounded shadow text-xs max-h-40 overflow-auto z-10">
              {filtered.map((group, gi) => (
                <React.Fragment key={gi}>
                  <li className="px-2 py-1 font-semibold text-gray-500 bg-gray-50 cursor-default">{group.label}</li>
                  {group.options.map((opt, i) => (
                    <li key={i} className="px-2 py-1 hover:bg-blue-100 cursor-pointer" onClick={() => handleSelect(opt.label)}>
                      {opt.label}
                    </li>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          )}
        </div>

        {selectedKeyword && (
          <ContextUI
            keyword={selectedKeyword}
            params={contextParams}
            onParamChange={(k, v) => onContextParamsChange({ ...contextParams, [k]: v })}
            onConfirm={(label) => {
              const uniqueId = generateUniqueId(selectedKeyword);
              onSelectedItemsChange([...selectedItems, { id: uniqueId, label }]);
              onKeywordChange('');
              onContextParamsChange({});
            }}
            onCancel={() => {
              onKeywordChange('');
              onContextParamsChange({});
            }}
          />
        )}

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={selectedItems.map(item => item.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex flex-wrap gap-4 items-stretch min-h-[80px]">
              {selectedItems.map(item => (
                <PreviewBlock key={item.id} id={item.id} label={item.label} content={item.label} onRemove={handleRemove} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
