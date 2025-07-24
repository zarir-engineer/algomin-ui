// stores/settingsStore.ts
import { create } from 'zustand';

type Broker = 'angel_one' | 'zerodha' | '';

interface SettingsState {
  broker: Broker;
  useDummyTicks: boolean;
  setBroker: (broker: Broker) => void;
  setUseDummyTicks: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  broker: '',
  useDummyTicks: false,
  setBroker: (broker) => set({ broker }),
  setUseDummyTicks: (val) => set({ useDummyTicks: val }),
}));
