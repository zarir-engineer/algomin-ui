// /components/ui/index.ts
export * from './Table';
export * from './Card';

import { SettingsProvider } from '@/context/SettingsContext';

ReactDOM.render(
  <SettingsProvider>
    <App />
  </SettingsProvider>,
  document.getElementById('root')
);
