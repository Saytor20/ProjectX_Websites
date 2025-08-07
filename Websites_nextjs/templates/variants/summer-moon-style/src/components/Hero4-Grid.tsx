import { restaurantData } from '@/data/restaurant';
import { Box, Container, Grid, Typography, Card, CardContent, Button, Chip } from '@mui/material';
import { AccessTime, LocationOn } from '@mui/icons-material';

export default function Hero4Grid() {
  return (
    <Box 
      component="section" 
      id="home" 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: 'grey.50', 
        pt: 8 
      }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        
        {/* Header */}
        <Box textAlign="center" mb={8}>
          <Chip 
            label="Premium Italian Experience"
            sx={{ 
              bgcolor: 'transparent',
              color: '#d97706',
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              mb: 2
            }}
          />
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 'bold',
              color: 'grey.900',
              mt: 2,
              mb: 3
            }}
          >
            Welcome to <Box component="span" sx={{ color: '#d97706' }}>{restaurantData.name}</Box>
          </Typography>
        </Box>
        
        {/* Grid Layout */}
        <Grid container spacing={4} sx={{ minHeight: { lg: '600px' } }}>
          
          {/* Main Content Card */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 6,
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <CardContent sx={{ p: { xs: 4, lg: 6 } }}>
                <Box mb={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Box sx={{ width: 8, height: 8, bgcolor: '#d97706', borderRadius: '50%' }} />
                    <Box sx={{ width: 16, height: 8, bgcolor: '#d97706', borderRadius: '50%' }} />
                    <Box sx={{ width: 8, height: 8, bgcolor: '#d97706', borderRadius: '50%' }} />
                  </Box>
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontSize: { xs: '1.5rem', lg: '1.875rem' },
                      fontWeight: 'bold',
                      color: 'grey.900',
                      mb: 2,
                      lineHeight: 1.2
                    }}
                  >
                    Authentic Italian Dining Experience
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'grey.600',
                      lineHeight: 1.6,
                      mb: 4
                    }}
                  >
                    {restaurantData.description}
                  </Typography>
                </Box>
                
                <Box>
                  <Button 
                    href="#menu" 
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ 
                      bgcolor: '#d97706',
                      '&:hover': { bgcolor: '#b45309' },
                      borderRadius: 3,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                  >
                    View Full Menu
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Main Image */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box position="relative">
              <Box 
                sx={{ 
                  height: { xs: '16rem', lg: '100%' },
                  bgcolor: 'grey.200',
                  borderRadius: 6,
                  overflow: 'hidden',
                  '& img': {
                    transition: 'transform 0.7s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}
              >
                <img 
                  src={restaurantData.heroImage} 
                  alt="Restaurant ambiance"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Card 
                sx={{ 
                  position: 'absolute',
                  bottom: -16,
                  right: -16,
                  bgcolor: '#d97706',
                  color: 'white',
                  boxShadow: 3
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h4" fontWeight="bold">4.9</Typography>
                  <Typography variant="body2">★★★★★</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>280+ Reviews</Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
          
          {/* Side Cards */}
          <Grid size={{ xs: 12, lg: 3 }}>
            <Box display="flex" flexDirection="column" gap={4}>
            
            {/* Hours Card */}
            <Card sx={{ bgcolor: 'grey.900', color: 'white', borderRadius: 6 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2} display="flex" alignItems="center">
                  <AccessTime sx={{ mr: 1, color: '#fbbf24' }} />
                  Opening Hours
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Mon - Thu</Typography>
                    <Typography variant="body2" sx={{ color: '#fbbf24' }}>5:00 PM - 10:00 PM</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Fri - Sat</Typography>
                    <Typography variant="body2" sx={{ color: '#fbbf24' }}>5:00 PM - 11:00 PM</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Sunday</Typography>
                    <Typography variant="body2" sx={{ color: '#fbbf24' }}>4:00 PM - 9:00 PM</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            {/* Location Card */}
            <Card sx={{ bgcolor: '#fef3c7', borderRadius: 6 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="grey.900" mb={2} display="flex" alignItems="center">
                  <LocationOn sx={{ mr: 1, color: '#d97706' }} />
                  Find Us
                </Typography>
                <Typography variant="body2" color="grey.700" mb={1.5}>
                  {restaurantData.address}
                </Typography>
                <Typography variant="body2" sx={{ color: '#d97706', fontWeight: 500 }}>
                  {restaurantData.phone}
                </Typography>
              </CardContent>
            </Card>
            
            </Box>
          </Grid>
        </Grid>
        
        {/* Bottom Stats */}
        <Grid container spacing={4} sx={{ mt: 8, pt: 6, borderTop: 1, borderColor: 'grey.200' }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#d97706' }}>25+</Typography>
              <Typography variant="body2" color="grey.600">Years of Excellence</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#d97706' }}>50+</Typography>
              <Typography variant="body2" color="grey.600">Signature Dishes</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#d97706' }}>10k+</Typography>
              <Typography variant="body2" color="grey.600">Happy Customers</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#d97706' }}>Michelin</Typography>
              <Typography variant="body2" color="grey.600">Recommended</Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}