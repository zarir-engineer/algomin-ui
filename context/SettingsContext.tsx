// SettingsContext.tsx: Provides shared user settings (dummy ticks and broker choice) via React context.
// UI for settings (e.g., SettingsModal) should live in a separate component that consumes this context.
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { isMarketClosed } from '@/src/features/DataPanels/services/marketDataService'
interface SettingsContextType {
  /** Whether the app should use dummy tick data */
  useDummyTicks: boolean;
  /** Update flag to switch between live and dummy ticks */
  setUseDummyTicks: (value: boolean) => void;
  /** Selected broker identifier */
  broker: 'angel_one' | 'zerodha';
  /** Update the selected broker */
  setBroker: (value: 'angel_one' | 'zerodha') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [broker, setBroker] = useState<'angel_one' | 'zerodha'>('angel_one');
  const [useDummyTicks, setUseDummyTicks] = useState(() => isMarketClosed());

  return (
    <SettingsContext.Provider value={{ useDummyTicks, setUseDummyTicks, broker, setBroker }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
