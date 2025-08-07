'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1A1A1A', // Deep charcoal - sophisticated and elegant
      light: '#4A4A4A',
      dark: '#000000',
    },
    secondary: {
      main: '#4A4A4A', // Medium gray complement
      light: '#6B6B6B',
      dark: '#2A2A2A',
    },
    background: {
      default: '#FFFFFF', // Pure white background
      paper: '#F9F9F9', // Off-white for cards
    },
    text: {
      primary: '#1A1A1A', // High contrast dark text
      secondary: '#4A4A4A', // Medium gray for secondary text
    },
    info: {
      main: '#D4A574', // Golden accent for highlights
      light: '#E1B88A',
      dark: '#B8925F',
    },
    success: {
      main: '#2E8B57', // Muted green
      light: '#3CB371',
      dark: '#228B22',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 400,
      lineHeight: 1.1,
      fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 400,
      lineHeight: 1.2,
      fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
      letterSpacing: '-0.015em',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 500,
      lineHeight: 1.3,
      fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
    },
    h5: {
      fontSize: '1.375rem',
      fontWeight: 500,
      lineHeight: 1.5,
      fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
      fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          fontWeight: 500,
          padding: '14px 32px',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease-out',
        },
        contained: {
          backgroundColor: '#1A1A1A',
          boxShadow: 'none',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#4A4A4A',
            boxShadow: 'none',
          },
        },
        outlined: {
          border: '1px solid #1A1A1A',
          color: '#1A1A1A',
          '&:hover': {
            border: '1px solid #1A1A1A',
            backgroundColor: 'rgba(26, 26, 26, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: '#F9F9F9',
          border: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease-out',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(26, 26, 26, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: '#F9F9F9',
          border: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '20px',
          paddingRight: '20px',
          '@media (min-width: 600px)': {
            paddingLeft: '40px',
            paddingRight: '40px',
          },
          '@media (min-width: 1200px)': {
            paddingLeft: '80px',
            paddingRight: '80px',
          },
        },
      },
    },
  },
});