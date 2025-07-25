// components/SettingsModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/SettingsContext';
import { isMarketClosed } from '@/utils/market';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { broker, useDummyTicks, setBroker, setUseDummyTicks } = useSettings();
  // localBroker as string to accept any value
  const [localBroker, setLocalBroker] = useState<string>(broker);
  const [localUseDummy, setLocalUseDummy] = useState(useDummyTicks);
  const marketClosed = isMarketClosed();
  const [brokerList, setBrokerList] = useState<string[]>([]);

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/brokers");
        const data = await res.json();
        setBrokerList(data.brokers || []);
      } catch (err) {
        console.error("❌ Failed to fetch brokers list", err);
      }
    };
    fetchBrokers();
  }, []);

  useEffect(() => {
    setLocalBroker(broker);
    setLocalUseDummy(useDummyTicks);
  }, [broker, useDummyTicks]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="broker" className="block text-sm font-medium mb-1">
              Broker
            </label>
            <select
              id="broker"
              value={localBroker}
              onChange={(e) => setLocalBroker(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select Broker</option>
              {brokerList.map(broker => (
                <option key={broker} value={broker.toLowerCase().replace(/\s+/g, "_")}>
                  {broker}
                </option>
              ))}
            </select>            
          </div>
          <div className="flex items-center">
            <input
              id="useDummy"
              type="checkbox"
              checked={useDummyTicks}
              onChange={(e) => setUseDummyTicks(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="useDummy" className="text-sm">
              Use Dummy Ticks {marketClosed && '(market closed, forced)'}
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            // cast localBroker to expected union type
            setBroker(localBroker as 'angel_one' | 'zerodha');
            setUseDummyTicks(localUseDummy);
            onClose();
          }}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
