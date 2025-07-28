'use client';

import React from 'react';
// import { Toaster } from 'sonner';
// import { SettingsProvider } from '@/context/SettingsContext';
// import Dashboard from '@/src/features/Dashboard/Dashboard'
// export default function Page() {
//   return (
//     <SettingsProvider>
//       <Toaster position="top-right" />
//       <Dashboard />
//     </SettingsProvider>
//   );
// }


import RootGroupNodeBuilder from '@/src/features/ConditionBuilder/components/RootGroupNodeBuilder';

export default function HomePage() {
  return (
    <div className="p-4">
      <RootGroupNodeBuilder />
    </div>
  );
}
