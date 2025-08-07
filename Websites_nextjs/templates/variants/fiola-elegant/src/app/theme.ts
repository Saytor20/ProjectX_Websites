'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8B0000', // Wine red
      light: '#B22222',
      dark: '#660000',
    },
    secondary: {
      main: '#D4AF37', // Elegant gold
      light: '#FFD700',
      dark: '#B8860B',
    },
    background: {
      default: '#FDF5E6', // Warm white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C1810', // Elegant gray
      secondary: '#5D4E37', // Muted brown
    },
    info: {
      main: '#8D6E63', // Soft gray
      light: '#A1887F',
      dark: '#6D4C41',
    },
    success: {
      main: '#388E3C', // Classic green
      light: '#4CAF50',
      dark: '#2E7D32',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Georgia", serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 700,
      lineHeight: 1.1,
      fontFamily: '"Playfair Display", "Georgia", serif',
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 600,
      lineHeight: 1.2,
      fontFamily: '"Playfair Display", "Georgia", serif',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      fontFamily: '"Playfair Display", "Georgia", serif',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: '"Playfair Display", "Georgia", serif',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 32px',
          fontSize: '1rem',
          fontFamily: '"Inter", "Roboto", sans-serif',
        },
        contained: {
          boxShadow: '0 4px 16px rgba(139, 115, 85, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(139, 115, 85, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(196, 164, 132, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
          '@media (min-width: 600px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
        },
      },
    },
  },
});