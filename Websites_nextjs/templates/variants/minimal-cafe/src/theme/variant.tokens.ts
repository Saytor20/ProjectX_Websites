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

export const minimalCafeTokens: PartialTokens = {
  colors: {
    primary: '#0369a1',        // sky-700 (warm blue)
    primaryHover: '#0284c7',   // sky-600
    secondary: '#0ea5e9',      // sky-500
    surface: '#ffffff',
    surfaceElevated: '#f0f9ff', // sky-50
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#0f172a',      // slate-900
    accent: '#f59e0b',         // amber-500
    background: '#fefce8',     // yellow-50 (warm, creamy background)
    border: '#fed7aa',         // orange-200
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
  },
};