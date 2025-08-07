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

export const summerMoonTokens: PartialTokens = {
  colors: {
    primary: '#0891b2',        // cyan-600 (coffee shop blue)
    primaryHover: '#0e7490',   // cyan-700
    secondary: '#06b6d4',      // cyan-500
    surface: '#ffffff',
    surfaceElevated: '#ecfeff', // cyan-50
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#1c1917',      // stone-900
    accent: '#f59e0b',         // amber-500
    background: '#fefce8',     // yellow-50 (warm coffee background)
    border: '#a7f3d0',         // emerald-200
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Inter, system-ui, sans-serif',
  },
};