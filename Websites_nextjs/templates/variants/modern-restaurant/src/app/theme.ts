'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35', // Electric coral/orange - vibrant and modern
      light: '#FF8A63',
      dark: '#E5531F',
    },
    secondary: {
      main: '#4ECDC4', // Turquoise - cool complement to orange
      light: '#7DD3CC',
      dark: '#3BA99F',
    },
    background: {
      default: '#0A0A0B', // Deep black with slight blue undertone
      paper: '#1A1A1D', // Dark charcoal for cards
    },
    text: {
      primary: '#FFFFFF', // Pure white for contrast
      secondary: '#B8B8B8', // Light gray
    },
    info: {
      main: '#6C5CE7', // Purple accent
      light: '#8B7BEE',
      dark: '#5A4FCF',
    },
    success: {
      main: '#00D9FF', // Cyan blue
      light: '#33E1FF',
      dark: '#00C2E5',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
    h1: {
      fontSize: '4.5rem',
      fontWeight: 800,
      lineHeight: 0.95,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.0,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2.75rem',
      fontWeight: 700,
      lineHeight: 1.1,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.6,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'uppercase',
          fontWeight: 700,
          padding: '16px 48px',
          fontSize: '0.875rem',
          letterSpacing: '0.1em',
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
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          boxShadow: '0 8px 32px rgba(255, 107, 53, 0.4)',
          color: '#000000',
          '&:hover': {
            background: 'linear-gradient(135deg, #E5531F 0%, #E8891D 100%)',
            boxShadow: '0 12px 40px rgba(255, 107, 53, 0.6)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          border: '2px solid #4ECDC4',
          color: '#4ECDC4',
          '&:hover': {
            border: '2px solid #4ECDC4',
            backgroundColor: 'rgba(78, 205, 196, 0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: '#1A1A1D',
          border: '1px solid #333333',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7)',
            '&::before': {
              opacity: 1,
            },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #FF6B35, #4ECDC4, #6C5CE7)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: '#1A1A1D',
          border: '1px solid #333333',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
          '@media (min-width: 600px)': {
            paddingLeft: '48px',
            paddingRight: '48px',
          },
          '@media (min-width: 1200px)': {
            paddingLeft: '64px',
            paddingRight: '64px',
          },
        },
      },
    },
  },
});