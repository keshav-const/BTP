'use client';

import React from 'react';
import { HydrationProvider } from './hydration-provider';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <HydrationProvider>{children}</HydrationProvider>;
};
