'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50', // Sophisticated dark blue-gray - cool and elegant
      light: '#34495E',
      dark: '#1A252F',
    },
    secondary: {
      main: '#3498DB', // Cool blue - modern and refreshing
      light: '#5DADE2',
      dark: '#2980B9',
    },
    background: {
      default: '#F8FAFB', // Very light cool gray - minimal and clean
      paper: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white for glass effect
    },
    text: {
      primary: '#2C3E50', // Dark blue-gray for excellent readability
      secondary: '#5D6D7E', // Medium cool gray
    },
    info: {
      main: '#17A2B8', // Cool teal accent
      light: '#58D3E8',
      dark: '#138496',
    },
    success: {
      main: '#27AE60', // Cool green
      light: '#58D68D',
      dark: '#229954',
    },
    warning: {
      main: '#F39C12', // Warm accent for contrast
      light: '#F7DC6F',
      dark: '#E67E22',
    },
    error: {
      main: '#E74C3C', // Muted red
      light: '#EC7063',
      dark: '#C0392B',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", system-ui, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 300, // Light weight for elegance
      lineHeight: 1.1,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      letterSpacing: '-0.02em',
      color: '#2C3E50',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 300,
      lineHeight: 1.2,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      letterSpacing: '-0.01em',
      color: '#2C3E50',
    },
    h3: {
      fontSize: '2.125rem',
      fontWeight: 400,
      lineHeight: 1.3,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      color: '#2C3E50',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      color: '#2C3E50',
    },
    h5: {
      fontSize: '1.375rem',
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      color: '#2C3E50',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      color: '#2C3E50',
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.8,
      fontFamily: '"Inter", system-ui, sans-serif',
      fontWeight: 400,
      color: '#2C3E50',
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.7,
      fontFamily: '"Inter", system-ui, sans-serif',
      fontWeight: 400,
      color: '#5D6D7E',
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
          background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
          boxShadow: '0 8px 25px rgba(44, 62, 80, 0.25)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #1A252F 0%, #2C3E50 100%)',
            boxShadow: '0 12px 35px rgba(44, 62, 80, 0.35)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          border: '2px solid #2C3E50',
          color: '#2C3E50',
          backgroundColor: 'transparent',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            border: '2px solid #1A252F',
            backgroundColor: 'rgba(44, 62, 80, 0.05)',
            color: '#1A252F',
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