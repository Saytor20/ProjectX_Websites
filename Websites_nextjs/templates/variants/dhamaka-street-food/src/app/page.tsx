'use client';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Hero2Minimal from '@/components/Hero2-Minimal';
import { Box, Fade } from '@mui/material';

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
          background: 'linear-gradient(135deg, #0A0A0B 0%, #1A1A1D 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            fontSize: '2rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 50%, #6C5CE7 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'pulse 1.5s ease-in-out infinite',
            textAlign: 'center',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Loading Experience...
        </Box>
      </Box>
    );
  }

  return (
    <Fade in={showContent} timeout={1000}>
      <main className="cyber-grid">
        <Navigation />
        <Hero2Minimal />
        <About />
        <Menu />
        <Gallery />
        <Contact />
        <Footer />
      </main>
    </Fade>
  );
}