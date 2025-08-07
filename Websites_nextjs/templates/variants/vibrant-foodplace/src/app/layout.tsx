import type { Metadata } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vibrant Food Place - Delicious Experience Awaits',
  description: 'Discover amazing flavors in our vibrant and welcoming restaurant. Fresh ingredients, bold tastes, and unforgettable dining moments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Montserrat:wght@300;400;600;700&display=swap" 
          rel="stylesheet" 
        />
        <meta name="theme-color" content="#FF6B47" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}