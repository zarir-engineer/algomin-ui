'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { SettingsProvider } from '@/context/SettingsContext';
import Dashboard from '@/components/Dashboard';

export default function Page() {
  return (
    <SettingsProvider>
      <Toaster position="top-right" />
      <Dashboard />
    </SettingsProvider>
  );
}
