import React from 'react';
import { LiveDataPanel } from './LiveDataPanel';
import { DummyTickPanel } from './DummyTickPanel';
import { useSettings } from '@/context/SettingsContext';

export interface MarketDataPanelProps {
  symbol: string;
  broker: string;
}

/**
 * Renders live or dummy tick/chart panel based on user settings.
 */
export default function MarketDataPanel({ symbol, broker }: MarketDataPanelProps) {
  const { useDummyTicks } = useSettings();

  if (!broker) {
    return (
      <div className="p-4 text-red-600">
        No broker token provided.
      </div>
    );
  }

  return useDummyTicks ? (
    <DummyTickPanel symbol={symbol} broker={broker} />
  ) : (
    <LiveDataPanel symbol={symbol} broker={broker} useDummy={false} />
  );
}
