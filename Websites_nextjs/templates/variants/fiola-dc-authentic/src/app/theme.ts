import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C9A961',
      light: '#F4D03F',
      dark: '#8B7355',
      contrastText: '#000000',
    },
    secondary: {
      main: '#F4F4F2',
      light: '#FFFFFF',
      dark: '#E0E0E0',
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#0F0F0F',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#F4F4F2',
      secondary: '#C9A961',
    },
    error: {
      main: '#FF6B6B',
    },
    success: {
      main: '#4ECDC4',
    },
    warning: {
      main: '#FFE66D',
    },
    info: {
      main: '#95E1D3',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Playfair Display',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 300,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#F4F4F2',
    },
    h2: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 400,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: '#F4F4F2',
    },
    h3: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 500,
      fontSize: '2rem',
      lineHeight: 1.4,
      color: '#F4F4F2',
    },
    h4: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.5,
      color: '#C9A961',
    },
    h5: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.6,
      color: '#F4F4F2',
    },
    h6: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#F4F4F2',
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#F4F4F2',
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#E0E0E0',
    },
    button: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    caption: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#C9A961',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  shape: {
    borderRadius: 2,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.1em',
          padding: '12px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: 'linear-gradient(135deg, #C9A961 0%, #F4D03F 100%)',
          color: '#000000',
          boxShadow: '0 4px 15px rgba(201, 169, 97, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #F4D03F 0%, #C9A961 100%)',
            boxShadow: '0 6px 20px rgba(201, 169, 97, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: '#C9A961',
          color: '#C9A961',
          '&:hover': {
            borderColor: '#F4D03F',
            color: '#F4D03F',
            backgroundColor: 'rgba(201, 169, 97, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(201, 169, 97, 0.2)',
          borderRadius: 8,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 15, 15, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(201, 169, 97, 0.2)',
        },
      },
    },
  },
});

export default theme;