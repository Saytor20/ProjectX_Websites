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

export const romansNycTokens: PartialTokens = {
  colors: {
    primary: '#7c2d12',        // orange-800 (italian brick red)
    primaryHover: '#9a3412',   // orange-900
    secondary: '#dc2626',      // red-600
    surface: '#ffffff',
    surfaceElevated: '#fef7ed', // orange-50
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#1c1917',      // stone-900
    accent: '#059669',         // emerald-600 (italian basil green)
    background: '#fef7ed',     // orange-50 (warm tuscan background)
    border: '#fed7aa',         // orange-200
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Playfair Display, serif',
  },
};