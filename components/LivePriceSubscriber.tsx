// components/LivePriceSubscriber.tsx
'use client';

import { useEffect } from 'react';
import useLiveTicks from '@/hooks/useLiveTicks';

interface Props {
  symbol: string;
  onUpdate: (symbol: string, ltp: number) => void;
}

export default function LivePriceSubscriber({ symbol, onUpdate }: Props) {
  // ✅ Hook at top‐level of this component
  const tick = useLiveTicks(symbol, 'DUMMY', true);

  useEffect(() => {
    if (tick?.ltp !== undefined) {
      onUpdate(symbol, tick.ltp);
    }
  }, [tick, symbol, onUpdate]);

  return null; // this component renders nothing visible
}
