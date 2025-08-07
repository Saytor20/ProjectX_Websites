import { createTheme } from '@mui/material/styles';

// Simple theme without complex functions that cause serialization issues
const simpleTheme = createTheme({
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
  },
  typography: {
    fontFamily: '"Inter", "Playfair Display", sans-serif',
  },
});

export default simpleTheme;