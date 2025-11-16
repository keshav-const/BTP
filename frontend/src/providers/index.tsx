'use client';

import React from 'react';
import { HydrationProvider } from './hydration-provider';
import { ThemeProvider } from './theme-provider';

export { useTheme } from './theme-provider';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <HydrationProvider>{children}</HydrationProvider>
    </ThemeProvider>
  );
};
