import type { ThemeTokens } from '@/theme/tokens';

type PartialTokens = {
  colors?: Partial<ThemeTokens['colors']>;
  layout?: Partial<ThemeTokens['layout']>;
  typography?: {
    fontFamily?: string;
    headingFamily?: string;
  };
  spacing?: Partial<ThemeTokens['spacing']>;
};

export const tiagoCoffeeTokens: PartialTokens = {
  colors: {
    primary: '#065f46',        // emerald-800 (coffee green)
    primaryHover: '#064e3b',   // emerald-900
    secondary: '#059669',      // emerald-600
    surface: '#ffffff',
    surfaceElevated: '#ecfdf5', // emerald-50
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#1c1917',      // stone-900
    accent: '#d97706',         // amber-600
    background: '#fefce8',     // yellow-50 (warm coffee cream background)
    border: '#a7f3d0',         // emerald-200
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Inter, system-ui, sans-serif',
  },
};