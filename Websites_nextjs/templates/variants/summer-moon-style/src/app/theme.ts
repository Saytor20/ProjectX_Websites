'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#059669', // Fresh green - clean and natural
      light: '#10B981',
      dark: '#047857',
    },
    secondary: {
      main: '#0EA5E9', // Light blue - fresh and clean
      light: '#38BDF8',
      dark: '#0284C7',
    },
    background: {
      default: '#F0FDF4', // Very light green - fresh and airy
      paper: 'rgba(255, 255, 255, 0.95)', // Clean white for content areas
    },
    text: {
      primary: '#374151', // Soft dark gray for excellent readability
      secondary: '#6B7280', // Medium gray for secondary text
    },
    info: {
      main: '#06B6D4', // Light teal - clean accent
      light: '#67E8F9',
      dark: '#0891B2',
    },
    success: {
      main: '#10B981', // Light green - positive actions
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B', // Soft amber - gentle warnings
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444', // Soft red - not harsh
      light: '#F87171',
      dark: '#DC2626',
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
      color: '#374151',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 400,
      lineHeight: 1.2,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      letterSpacing: '-0.01em',
      color: '#374151',
    },
    h3: {
      fontSize: '2.125rem',
      fontWeight: 500,
      lineHeight: 1.3,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      color: '#374151',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      color: '#374151',
    },
    h5: {
      fontSize: '1.375rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      color: '#374151',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      color: '#374151',
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
      fontFamily: '"Inter", system-ui, sans-serif',
      fontWeight: 400,
      color: '#374151',
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontFamily: '"Inter", system-ui, sans-serif',
      fontWeight: 400,
      color: '#6B7280',
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
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          boxShadow: '0 8px 25px rgba(5, 150, 105, 0.25)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
            boxShadow: '0 12px 35px rgba(5, 150, 105, 0.35)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          border: '2px solid #059669',
          color: '#059669',
          backgroundColor: 'transparent',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            border: '2px solid #047857',
            backgroundColor: 'rgba(5, 150, 105, 0.05)',
            color: '#047857',
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