import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8B4513',
      light: '#D2691E',
      dark: '#654321',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#DEB887',
      light: '#F5DEB3',
      dark: '#CD853F',
      contrastText: '#2C1810',
    },
    background: {
      default: '#FEFEFE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C1810',
      secondary: '#8B4513',
    },
    error: {
      main: '#D32F2F',
    },
    success: {
      main: '#228B22',
    },
    warning: {
      main: '#FF8C00',
    },
    info: {
      main: '#1976D2',
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
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      color: '#2C1810',
    },
    h2: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 400,
      fontSize: '2.25rem',
      lineHeight: 1.3,
      letterSpacing: '-0.005em',
      color: '#2C1810',
    },
    h3: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 500,
      fontSize: '1.875rem',
      lineHeight: 1.4,
      color: '#8B4513',
    },
    h4: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.5,
      color: '#8B4513',
    },
    h5: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.6,
      color: '#2C1810',
    },
    h6: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#2C1810',
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#2C1810',
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#5D4037',
    },
    button: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    caption: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#8B4513',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.05em',
          padding: '10px 20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #A0522D 0%, #FF7F50 100%)',
            boxShadow: '0 6px 16px rgba(139, 69, 19, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: '#8B4513',
          color: '#8B4513',
          '&:hover': {
            borderColor: '#D2691E',
            color: '#D2691E',
            backgroundColor: 'rgba(139, 69, 19, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(139, 69, 19, 0.1)',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(139, 69, 19, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(254, 254, 254, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(139, 69, 19, 0.1)',
          color: '#2C1810',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(34, 139, 34, 0.1)',
          color: '#228B22',
          fontWeight: 600,
          '&.MuiChip-filled': {
            backgroundColor: '#228B22',
            color: '#FFFFFF',
          },
        },
      },
    },
  },
});

export default theme;