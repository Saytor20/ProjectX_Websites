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

export const fiolaTokens: PartialTokens = {
  colors: {
    primary: '#b91c1c',        // wine-red-700
    primaryHover: '#991b1b',   // wine-red-800
    secondary: '#dc2626',      // red-600
    surface: '#fefefe',        // warm white
    surfaceElevated: '#fef7ed', // orange-50
    onPrimary: '#ffffff',
    onSecondary: '#ffffff', 
    onSurface: '#1c1917',      // stone-900
    accent: '#f59e0b',         // amber-500
    background: '#fef7ed',     // warm orange-50
    border: '#fed7aa',         // orange-200
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Playfair Display, serif',
  },
};