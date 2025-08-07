'use client';
import { Box, Container, Typography, Card, CardContent, Grid } from '@mui/material';
import { restaurantData } from '@/data/restaurant';

export default function SimpleMenuDisplay() {
  // Group menu items by category
  const menuByCategory = restaurantData.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof restaurantData.menu>);

  return (
    <Box
      id="menu"
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        background: 'var(--background)',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 400,
              color: '#374151',
              mb: 2,
              fontFamily: '"Inter", system-ui, sans-serif',
            }}
          >
            Our Menu
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              color: '#6B7280',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Fresh ingredients, carefully crafted dishes
          </Typography>
        </Box>

        {/* Menu Categories */}
        {Object.entries(menuByCategory).map(([category, items]) => (
          <Box key={category} mb={6}>
            {/* Category Title */}
            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 500,
                color: '#374151',
                mb: 3,
                textAlign: 'center',
              }}
            >
              {category}
            </Typography>

            {/* Menu Items Grid - Simple List Style */}
            <Grid container spacing={2}>
              {items.map((item) => (
                <Grid size={{ xs: 12, md: 6 }} key={item.id}>
                  <Card
                    sx={{
                      background: 'var(--surface)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(5, 150, 105, 0.1)',
                      borderRadius: '12px',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(5, 150, 105, 0.1)',
                        borderColor: 'rgba(5, 150, 105, 0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Item Name and Price */}
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={1}
                      >
                        <Typography
                          variant="h6"
                          component="h4"
                          sx={{
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: '#374151',
                            flex: 1,
                            pr: 2,
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: '#059669',
                            flexShrink: 0,
                          }}
                        >
                          ${item.price}
                        </Typography>
                      </Box>

                      {/* Item Description */}
                      {item.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#6B7280',
                            lineHeight: 1.6,
                          }}
                        >
                          {item.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
    </Box>
  );
}