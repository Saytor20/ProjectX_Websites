'use client';
import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Hero1SplitScreen from '../components/Hero1-SplitScreen';
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

    // Loading animation sequence
    setLoaded(true);
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

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
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          {/* Animated food icons */}
          <Box
            sx={{
              position: 'absolute',
              fontSize: '3rem',
              animation: 'warmBounce 1.5s ease-in-out infinite',
              animationDelay: '0s',
            }}
          >
            🍕
          </Box>
          <Box
            sx={{
              position: 'absolute',
              fontSize: '3rem',
              animation: 'warmBounce 1.5s ease-in-out infinite',
              animationDelay: '0.3s',
              left: '60px',
            }}
          >
            🍔
          </Box>
          <Box
            sx={{
              position: 'absolute',
              fontSize: '3rem',
              animation: 'warmBounce 1.5s ease-in-out infinite',
              animationDelay: '0.6s',
              right: '60px',
            }}
          >
            🌮
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'var(--primary)',
            textAlign: 'center',
            letterSpacing: '0.1em',
            mb: 2,
            fontFamily: '"Poppins", "Inter", system-ui, sans-serif',
          }}
        >
          Preparing Your Feast...
        </Typography>

        <Box
          sx={{
            width: '200px',
            height: '6px',
            background: 'rgba(255, 138, 0, 0.2)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: '60px',
              height: '100%',
              background: 'var(--gradient-warm)',
              borderRadius: '3px',
              animation: 'menuShimmer 1.5s ease-in-out infinite',
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Fade in={showContent} timeout={1000}>
      <main className="spice-pattern">
        <Navigation />
        <Hero1SplitScreen />
        <About />
        <Menu />
        <Gallery />
        <Contact />
        <Footer />
      </main>
    </Fade>
  );
}