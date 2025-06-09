import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { setHours, setMinutes, isBefore } from 'date-fns';
import SymbolSelect from '@/components/SymbolSelect';
import LiveTickPanel from '@/components/LiveTickPanel';
import DummyTickPanel from '@/components/DummyTickPanel';
import { useSettings } from '@/context/SettingsContext';


interface Selection {
  symbol: string;
  token: string;
}


interface DashboardProps {
  value: Selection;
  onChange: (sel: Selection) => void;
}


export default function Dashboard() {
  const navigate = useNavigate();
  const { useDummyTicks } = useSettings();
  const [selection, setSelection] = useState<{ symbol: string; token: string }>({ symbol: '', token: '' });

  const handleSelect = (sel: { symbol: string; token: string }) => {
    setSelection(sel);
    const { symbol, token } = sel;
    if (!token) return; // only navigate when token is valid

    const now = new Date();
    const marketClose = setHours(setMinutes(new Date(), 30), 15); // today at 15:30
    const isWorkingDay = now.getDay() >= 1 && now.getDay() <= 5;

    if (useDummyTicks) {
      navigate(`/dummy-ticks/${symbol}`, { state: { token } });
    } else if (isWorkingDay && isBefore(now, marketClose)) {
      navigate(`/live-ticks/${symbol}`, { state: { token } });
    } else {
      navigate(`/dummy-ticks/${symbol}`, { state: { token } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Pass controlled value and onChange to SymbolSelect */}
      <SymbolSelect
        value={selection}
        onChange={handleSelect}
        error={!selection.token}
      />

      <div className="mt-6">
        <Routes>
          <Route path="live-ticks/:symbol" element={<LiveTickPanel />} />
          <Route path="dummy-ticks/:symbol" element={<DummyTickPanel />} />
        </Routes>
      </div>
    </div>
  );
}
