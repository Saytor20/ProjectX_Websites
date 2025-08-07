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

export const modernRestaurantTokens: PartialTokens = {
  colors: {
    primary: '#dc2626',        // red-600 (warm red instead of cyber blue)
    primaryHover: '#b91c1c',   // red-700
    secondary: '#f97316',      // orange-500
    surface: '#ffffff',
    surfaceElevated: '#fef7ed', // orange-50
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#1c1917',      // stone-900
    accent: '#f59e0b',         // amber-500
    background: '#fff7ed',     // orange-50 (warm peach background)
    border: '#fed7aa',         // orange-200
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Inter, system-ui, sans-serif',
  },
};