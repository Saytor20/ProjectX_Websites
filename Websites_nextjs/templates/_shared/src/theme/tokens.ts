export type ThemeTokens = {
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    surface: string;
    surfaceElevated: string;
    onPrimary: string;
    onSecondary: string;
    onSurface: string;
    accent?: string;
    background: string;
    border: string;
  };
  layout: {
    containerMax: string;   // e.g. '1280px'
    gutterX: string;        // e.g. '1rem'
    sectionY: string;       // e.g. '4rem'
    headerHeight: string;   // e.g. '5rem'
    borderRadius: string;   // e.g. '0.5rem'
  };
  typography: {
    fontFamily: string;
    headingFamily?: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
};

export const defaultTokens: ThemeTokens = {
  colors: {
    primary: '#ea580c',        // orange-600
    primaryHover: '#dc2626',   // red-600
    secondary: '#f97316',      // orange-500
    surface: '#ffffff',
    surfaceElevated: '#f8fafc',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#0f172a',
    background: '#fef7ed',     // orange-50
    border: '#fed7aa',         // orange-200
  },
  layout: {
    containerMax: '80rem',     // 1280px
    gutterX: '1rem',
    sectionY: '4rem',
    headerHeight: '5rem',
    borderRadius: '0.75rem',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
};