'use client';
import React from 'react';
import { ThemeTokens, defaultTokens } from '@/theme/tokens';

export const ThemeContext = React.createContext<ThemeTokens>(defaultTokens);

export function useTheme() {
  return React.useContext(ThemeContext);
}

type PartialTokens = {
  colors?: Partial<ThemeTokens['colors']>;
  layout?: Partial<ThemeTokens['layout']>;
  typography?: {
    fontFamily?: string;
    headingFamily?: string;
  };
  spacing?: Partial<ThemeTokens['spacing']>;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Deprecated dynamic tokens. We now rely on static CSS variables.
  return (
    <ThemeContext.Provider value={defaultTokens}>
      <div className="min-h-screen">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}