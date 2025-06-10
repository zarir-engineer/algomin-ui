import React from 'react';
import { setHours, setMinutes, isBefore } from 'date-fns';
import SymbolSelect from '@/components/SymbolSelect';
import { LiveTickPanel, LiveTickPanelProps } from '@/components/LiveTickPanel';
import { DummyTickPanel, DummyTickPanelProps } from '@/components/DummyTickPanel';
import { useSettings } from '@/context/SettingsContext';

// 1) Define the props shape
export interface DashboardProps {
  value: { symbol: string; token: string };
  onChange: (v: { symbol: string; token: string }) => void;
}

export function Dashboard({ value, onChange }: DashboardProps) {
  const { useDummyTicks } = useSettings();
  const { symbol, token } = value;

  const handleSelect = (sel: { symbol: string; token: string }) => {
    onChange(sel);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <SymbolSelect
        value={value}
        onChange={handleSelect}
        error={!token}
      />
    </div>
  );
}
