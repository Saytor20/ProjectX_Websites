'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF8A00', // Vibrant orange - appetizing and energetic
      light: '#FFA533',
      dark: '#E67300',
    },
    secondary: {
      main: '#FFB347', // Peach orange - warm and inviting
      light: '#FFC470',
      dark: '#E69A1A',
    },
    background: {
      default: '#FFF8F0', // Warm cream background
      paper: '#FFFFFF', // Pure white for cards
    },
    text: {
      primary: '#2C1810', // Dark brown for excellent contrast
      secondary: '#8B4513', // Medium brown
    },
    info: {
      main: '#FF6B6B', // Coral accent - vibrant and friendly
      light: '#FF8A8A',
      dark: '#E55555',
    },
    success: {
      main: '#4CAF50', // Fresh green
      light: '#81C784',
      dark: '#388E3C',
    },
    warning: {
      main: '#FFD54F', // Bright yellow
      light: '#FFF176',
      dark: '#FBC02D',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Segoe UI", system-ui, sans-serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 800,
      lineHeight: 0.9,
      fontFamily: '"Poppins", "Inter", system-ui, sans-serif',
      letterSpacing: '-0.02em',
      color: '#2C1810',
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.0,
      fontFamily: '"Poppins", "Inter", system-ui, sans-serif',
      letterSpacing: '-0.01em',
      color: '#2C1810',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.1,
      fontFamily: '"Poppins", "Inter", system-ui, sans-serif',
      letterSpacing: '-0.01em',
      color: '#2C1810',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
      fontFamily: '"Poppins", "Inter", system-ui, sans-serif',
      color: '#2C1810',
    },
    h5: {
      fontSize: '1.375rem',
      fontWeight: 600,
      lineHeight: 1.3,
      fontFamily: '"Poppins", "Inter", system-ui, sans-serif',
      color: '#2C1810',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"Poppins", "Inter", system-ui, sans-serif',
      color: '#2C1810',
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
      fontFamily: '"Inter", system-ui, sans-serif',
      fontWeight: 400,
      color: '#2C1810',
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontFamily: '"Inter", system-ui, sans-serif',
      fontWeight: 400,
      color: '#8B4513',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: 'none',
          fontWeight: 600,
          padding: '16px 32px',
          fontSize: '1rem',
          letterSpacing: '0.02em',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '"Poppins", "Inter", system-ui, sans-serif',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transition: 'left 0.6s',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)',
          boxShadow: '0 8px 25px rgba(255, 138, 0, 0.4)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #E67300 0%, #E69A1A 100%)',
            boxShadow: '0 12px 35px rgba(255, 138, 0, 0.6)',
            transform: 'translateY(-3px)',
          },
        },
        outlined: {
          border: '2px solid #FF8A00',
          color: '#FF8A00',
          backgroundColor: 'transparent',
          '&:hover': {
            border: '2px solid #E67300',
            backgroundColor: 'rgba(255, 138, 0, 0.1)',
            color: '#E67300',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          border: 'none',
          boxShadow: '0 15px 35px rgba(255, 138, 0, 0.15)',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 25px 50px rgba(255, 138, 0, 0.25)',
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
            height: '6px',
            background: 'linear-gradient(90deg, #FF8A00, #FFB347, #FF6B6B)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 15,
          backgroundColor: '#FFFFFF',
          border: 'none',
          boxShadow: '0 10px 25px rgba(255, 138, 0, 0.1)',
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
            paddingLeft: '60px',
            paddingRight: '60px',
          },
        },
      },
    },
  },
});