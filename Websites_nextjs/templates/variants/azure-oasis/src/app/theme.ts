'use client';

export const azureTheme = {
  colors: {
    primary: '#7C4DFF', // Jacaranda purple
    primaryHover: '#6A3DED',
    secondary: '#5AC8FA',
    surface: 'rgba(255,255,255,0.75)',
    surfaceElevated: 'rgba(255,255,255,0.9)',
    onPrimary: '#ffffff',
    onSecondary: '#0b1b2b',
    onSurface: '#0f172a',
    accent: '#A78BFA',
    background: '#F5F7FB',
    border: 'rgba(124, 77, 255, 0.18)'
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Inter, system-ui, sans-serif'
  },
  layout: {
    containerMax: '80rem',
    gutterX: '1rem',
    sectionY: '4rem',
    headerHeight: '5rem',
    borderRadius: '1rem'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem'
  }
};

export type AzureTheme = typeof azureTheme;

