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

export const vibrantFoodplaceTokens: PartialTokens = {
  colors: {
    primary: '#be185d',        // pink-700 (vibrant magenta)
    primaryHover: '#9d174d',   // pink-800
    secondary: '#ec4899',      // pink-500
    surface: '#ffffff',
    surfaceElevated: '#fdf2f8', // pink-50
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#1c1917',      // stone-900
    accent: '#f59e0b',         // amber-500
    background: '#fef7ed',     // orange-50 (warm peach background)
    border: '#fce7f3',         // pink-100
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Inter, system-ui, sans-serif',
  },
};