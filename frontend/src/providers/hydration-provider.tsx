'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store';

export const HydrationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    let mounted = true;
    hydrate();
    if (mounted) {
      setIsHydrated(true);
    }
    return () => {
      mounted = false;
    };
  }, [hydrate]);

  return isHydrated ? children : null;
};
