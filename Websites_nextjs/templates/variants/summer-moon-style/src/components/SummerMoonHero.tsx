'use client';
import { Box, Container, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { restaurantData } from '@/data/restaurant';

export default function SummerMoonHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box
      id="home"
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--gradient-light)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          py: { xs: 6, md: 8 },
        }}
      >
        <Box
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Simple Restaurant Name */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontWeight: 300,
              color: '#374151',
              mb: 2,
              fontFamily: '"Inter", system-ui, sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            {restaurantData.name}
          </Typography>

          {/* Simple Description */}
          <Typography
            variant="h6"
            component="p"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              fontWeight: 400,
              color: '#6B7280',
              mb: 4,
              maxWidth: '500px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Discover our fresh menu selection
          </Typography>

          {/* Call to Action */}
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              const menuSection = document.getElementById('menu');
              if (menuSection) {
                menuSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 500,
              borderRadius: '12px',
              background: 'var(--gradient-fresh)',
              textTransform: 'none',
              boxShadow: '0 8px 25px rgba(5, 150, 105, 0.25)',
              '&:hover': {
                boxShadow: '0 12px 35px rgba(5, 150, 105, 0.35)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            View Our Menu
          </Button>
        </Box>
      </Container>
    </Box>
  );
}