'use client';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import TiagoCoffeeHero from '@/components/TiagoCoffeeHero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Box, Fade, Typography } from '@mui/material';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Scroll to top on page load/refresh
    window.scrollTo(0, 0);
    
    // Also clear any hash from URL that might cause scrolling
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Sophisticated loading animation sequence
    setLoaded(true);
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'var(--background)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {/* Minimalist loading indicator */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          {/* Sophisticated geometric loading animation */}
          <Box
            sx={{
              width: '60px',
              height: '60px',
              border: '2px solid rgba(44, 62, 80, 0.1)',
              borderTop: '2px solid var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
          
          {/* Inner circle */}
          <Box
            sx={{
              position: 'absolute',
              width: '30px',
              height: '30px',
              border: '2px solid rgba(52, 152, 219, 0.2)',
              borderBottom: '2px solid var(--secondary)',
              borderRadius: '50%',
              animation: 'spin-reverse 0.8s linear infinite',
              '@keyframes spin-reverse': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(-360deg)' },
              },
            }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 400,
            color: 'var(--primary)',
            textAlign: 'center',
            letterSpacing: '0.05em',
            mb: 2,
            fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
            opacity: 0.8,
          }}
        >
          Brewing Excellence...
        </Typography>

        {/* Sophisticated progress bar */}
        <Box
          sx={{
            width: '180px',
            height: '2px',
            background: 'rgba(44, 62, 80, 0.1)',
            borderRadius: '1px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              background: 'var(--gradient-warm)',
              borderRadius: '1px',
              animation: 'sophisticatedProgress 1.5s ease-in-out infinite',
              '@keyframes sophisticatedProgress': {
                '0%': { width: '10%', left: '0%' },
                '50%': { width: '60%', left: '20%' },
                '100%': { width: '10%', left: '90%' },
              },
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Fade in={showContent} timeout={1200}>
      <main className="minimal-hover" style={{ minHeight: '100vh' }}>
        <Navigation />
        <TiagoCoffeeHero />
        <About />
        <Menu />
        <Gallery />
        <Contact />
        <Footer />
      </main>
    </Fade>
  );
}