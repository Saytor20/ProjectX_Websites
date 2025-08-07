'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#E91E63', // Tiago Coffee pink/rose - warm and inviting
      light: '#F06292',
      dark: '#C2185B',
    },
    secondary: {
      main: '#8D6E63', // Warm coffee brown - complementary earth tone
      light: '#A1887F',
      dark: '#6D4C41',
    },
    background: {
      default: '#FAFAFA', // Warm off-white - cozy and welcoming
      paper: 'rgba(255, 255, 255, 0.95)', // Clean white with subtle transparency
    },
    text: {
      primary: '#2E2E2E', // Soft black - readable and warm
      secondary: '#666666', // Medium gray for secondary text
    },
    info: {
      main: '#FFB74D', // Warm amber - coffee/pastry inspired
      light: '#FFCC80',
      dark: '#FF9800',
    },
    success: {
      main: '#66BB6A', // Soft green - natural and organic
      light: '#81C784',
      dark: '#4CAF50',
    },
    warning: {
      main: '#FFA726', // Warm orange - cozy accent
      light: '#FFCC80',
      dark: '#FF9800',
    },
    error: {
      main: '#F44336', // Soft red
      light: '#EF5350',
      dark: '#E53935',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", "Arial", system-ui, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 600, // Bold for coffee shop impact
      lineHeight: 1.1,
      fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
      letterSpacing: '-0.02em',
      color: '#2E2E2E',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 500,
      lineHeight: 1.2,
      fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
      letterSpacing: '-0.01em',
      color: '#2E2E2E',
    },
    h3: {
      fontSize: '2.125rem',
      fontWeight: 400,
      lineHeight: 1.3,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      color: '#2E2E2E',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
      color: '#2E2E2E',
    },
    h5: {
      fontSize: '1.375rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
      color: '#2E2E2E',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
      color: '#2E2E2E',
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
      fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
      fontWeight: 400,
      color: '#2E2E2E',
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
      fontWeight: 400,
      color: '#666666',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '14px 28px',
          fontSize: '1rem',
          fontFamily: '"Inter", system-ui, sans-serif',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
          boxShadow: '0 8px 25px rgba(233, 30, 99, 0.25)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #C2185B 0%, #E91E63 100%)',
            boxShadow: '0 12px 35px rgba(233, 30, 99, 0.35)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          border: '2px solid #E91E63',
          color: '#E91E63',
          backgroundColor: 'transparent',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            border: '2px solid #C2185B',
            backgroundColor: 'rgba(233, 30, 99, 0.05)',
            color: '#C2185B',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(52, 152, 219, 0.5), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '20px',
          paddingRight: '20px',
          '@media (min-width: 600px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
          '@media (min-width: 1200px)': {
            paddingLeft: '48px',
            paddingRight: '48px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});