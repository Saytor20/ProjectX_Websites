import { createTheme } from '@mui/material/styles';

// Simple theme without complex functions that cause serialization issues
const simpleTheme = createTheme({
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
  },
  typography: {
    fontFamily: '"Inter", "Playfair Display", sans-serif',
  },
});

export default simpleTheme;