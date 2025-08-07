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

export const dhamakaTokens: PartialTokens = {
  colors: {
    primary: '#c2410c',        // orange-700 (vibrant street food)
    primaryHover: '#9a3412',   // orange-800
    secondary: '#ea580c',      // orange-600
    surface: '#ffffff',
    surfaceElevated: '#fff7ed', // orange-50
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#1c1917',      // stone-900
    accent: '#eab308',         // yellow-500 (spicy yellow)
    background: '#fefce8',     // yellow-50 (warm turmeric background)
    border: '#fed7aa',         // orange-200
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Inter, system-ui, sans-serif',
  },
};