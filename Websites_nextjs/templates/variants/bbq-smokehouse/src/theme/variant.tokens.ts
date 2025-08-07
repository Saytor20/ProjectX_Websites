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

export const bbqSmokehouseTokens: PartialTokens = {
  colors: {
    primary: '#92400e',        // amber-800 (rustic brown)
    primaryHover: '#78350f',   // amber-900
    secondary: '#d97706',      // amber-600
    surface: '#ffffff',
    surfaceElevated: '#fef3c7', // amber-100
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#1c1917',      // stone-900
    accent: '#dc2626',         // red-600 (bbq fire red)
    background: '#fef7ed',     // orange-50 (warm wood background)
    border: '#f3e8ff',         // purple-50
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Inter, system-ui, sans-serif',
  },
};