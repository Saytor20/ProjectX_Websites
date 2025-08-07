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

export const fiolaDcClonedTokens: PartialTokens = {
  colors: {
    primary: '#7c3aed',        // violet-600 (elegant purple)
    primaryHover: '#6d28d9',   // violet-700
    secondary: '#a855f7',      // purple-500
    surface: '#ffffff',
    surfaceElevated: '#faf5ff', // purple-50
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#1c1917',      // stone-900
    accent: '#f59e0b',         // amber-500
    background: '#fef7ed',     // orange-50 (warm luxurious background)
    border: '#e9d5ff',         // purple-200
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Playfair Display, serif',
  },
};