'use client';
import { Box, Container, Typography, Button, Grid, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import { restaurantData } from '@/data/restaurant';
import LanguageIcon from '@mui/icons-material/Language';

export default function TiagoCoffeeHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    setIsVisible(true);
    // Check for saved language preference
    const savedLang = localStorage.getItem('preferred-language') as 'en' | 'ar' | null;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    localStorage.setItem('preferred-language', newLang);
  };

  // Extended restaurant data with bilingual support
  const bilingualData = {
    name: {
      en: restaurantData.name,
      ar: restaurantData.name // Will be replaced with actual Arabic name if available
    },
    description: {
      en: restaurantData.description,
      ar: 'تجربة قهوة استثنائية وطعام لذيذ في جو دافئ ومرحب. مستوحى من جمالية تياغو كوفي المحبوبة.' // Example Arabic description
    },
    address: {
      en: restaurantData.address,
      ar: restaurantData.address // Address usually stays the same
    },
    buttons: {
      viewMenu: { en: 'View Menu', ar: 'عرض القائمة' },
      callNow: { en: 'Call Now', ar: 'اتصل الآن' }
    }
  };

  return (
    <Box
      id="home"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, rgba(233, 30, 99, 0.02) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(141, 110, 99, 0.03) 100%)`,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${restaurantData.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.08,
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.03) 0%, rgba(255, 255, 255, 0.95) 100%)',
          zIndex: 1,
        }
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          py: { xs: 8, md: 12 },
        }}
      >
        {/* Language Toggle */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 3,
          }}
        >
          <IconButton
            onClick={toggleLanguage}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#E91E63',
              '&:hover': {
                background: 'rgba(233, 30, 99, 0.1)',
              },
              backdropFilter: 'blur(10px)',
            }}
          >
            <LanguageIcon />
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 0.5,
              color: '#666',
              fontWeight: 500,
            }}
          >
            {language === 'en' ? 'العربية' : 'EN'}
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: '0.2s',
                direction: language === 'ar' ? 'rtl' : 'ltr',
                textAlign: language === 'ar' ? 'right' : 'center',
              }}
            >
              {/* Main Restaurant Name */}
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 600,
                  color: '#2E2E2E',
                  mb: 2,
                  fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '4px',
                    background: 'var(--gradient-warm)',
                    borderRadius: '2px',
                  }
                }}
              >
                {bilingualData.name[language]}
              </Typography>

              {/* Tagline/Description */}
              <Typography
                variant="h5"
                component="p"
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                  fontWeight: 400,
                  color: '#666666',
                  mb: 4,
                  fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
                  lineHeight: 1.6,
                  maxWidth: '600px',
                  mx: 'auto',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0.4s',
                }}
              >
                {bilingualData.description[language].length > 120 
                  ? bilingualData.description[language].substring(0, 120) + '...'
                  : bilingualData.description[language]
                }
              </Typography>

              {/* Location */}
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#8D6E63',
                  mb: 4,
                  fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0.6s',
                }}
              >
                📍 {bilingualData.address[language]}
              </Typography>

              {/* Call to Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 3 },
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0.8s',
                }}
              >
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
                    fontWeight: 600,
                    borderRadius: '50px',
                    background: 'var(--gradient-warm)',
                    boxShadow: '0 8px 25px rgba(233, 30, 99, 0.25)',
                    textTransform: 'none',
                    fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #C2185B 0%, #E91E63 100%)',
                      boxShadow: '0 12px 35px rgba(233, 30, 99, 0.35)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {bilingualData.buttons.viewMenu[language]}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  href={`tel:${restaurantData.phone}`}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    borderRadius: '50px',
                    border: '2px solid #E91E63',
                    color: '#E91E63',
                    textTransform: 'none',
                    fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
                    '&:hover': {
                      border: '2px solid #C2185B',
                      backgroundColor: 'rgba(233, 30, 99, 0.05)',
                      color: '#C2185B',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  {bilingualData.buttons.callNow[language]}
                </Button>
              </Box>

              {/* Contact Info */}
              <Box
                sx={{
                  mt: 6,
                  pt: 4,
                  borderTop: '1px solid rgba(233, 30, 99, 0.1)',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 2, md: 4 },
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '1s',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666666',
                    fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
                    fontWeight: 500,
                  }}
                >
                  📞 {restaurantData.phone}
                </Typography>
                
                {restaurantData.email && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666666',
                      fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    ✉️ {restaurantData.email}
                  </Typography>
                )}

                {restaurantData.website && (
                  <Typography
                    component="a"
                    href={restaurantData.website.startsWith('http') ? restaurantData.website : `https://${restaurantData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body2"
                    sx={{
                      color: '#E91E63',
                      fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    🌐 {restaurantData.website}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDelay: '1.2s',
        }}
      >
        <Box
          sx={{
            width: '2px',
            height: '30px',
            background: 'var(--gradient-warm)',
            borderRadius: '1px',
            animation: 'scrollIndicator 2s ease-in-out infinite',
            '@keyframes scrollIndicator': {
              '0%, 100%': { transform: 'translateY(0)', opacity: 1 },
              '50%': { transform: 'translateY(10px)', opacity: 0.5 },
            },
          }}
        />
      </Box>
    </Box>
  );
}