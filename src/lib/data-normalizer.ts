import { RestaurantData } from './component-renderer'

// Convert restaurant data to internal format
export function normalizeRestaurantData(rawData: any): RestaurantData {
  // Handle both old and new data formats
  const restaurantInfo = rawData.restaurant_info || rawData.business || {}
  const menuData = rawData.menu || []
  
  // Convert menu array to sections format
  let menuSections = []
  
  if (Array.isArray(menuData)) {
    // Old format: menu is an array of items
    if (menuData.length > 0 && menuData[0].section_name) {
      // Group by section_name
      const grouped = menuData.reduce((acc: any, item: any) => {
        const sectionName = item.section_name || 'Main Menu'
        if (!acc[sectionName]) {
          acc[sectionName] = []
        }
        acc[sectionName].push({
          name: item.item_name || item.name,
          description: item.description,
          price: item.price,
          image: item.image_url || item.image
        })
        return acc
      }, {})
      
      menuSections = Object.entries(grouped).map(([name, items]) => ({
        name,
        items: items as any[]
      }))
    } else {
      // Flat array of items
      menuSections = [{
        name: 'Menu',
        items: menuData.map((item: any) => ({
          name: item.item_name || item.name,
          description: item.description,
          price: item.price,
          image: item.image_url || item.image
        }))
      }]
    }
  } else if (menuData.sections) {
    // New format: already has sections
    menuSections = menuData.sections
  }
  
  // Convert locations
  const locations = rawData.locations || []
  const normalizedLocations = Array.isArray(locations) ? locations : [locations].filter(Boolean)
  
  // If no location data, create from restaurant_info
  if (normalizedLocations.length === 0 && restaurantInfo.address) {
    normalizedLocations.push({
      address: restaurantInfo.address,
      phone: restaurantInfo.phone,
      hours: restaurantInfo.hours || restaurantInfo.opening_hours,
      mapsUrl: restaurantInfo.maps_url
    })
  }
  
  return {
    business: {
      name: restaurantInfo.name || 'Restaurant',
      tagline: restaurantInfo.tagline || restaurantInfo.description,
      description: restaurantInfo.description,
      logo: restaurantInfo.logo_url || restaurantInfo.logo,
      social: restaurantInfo.social_media || {}
    },
    menu: {
      sections: menuSections,
      currency: rawData.currency || 'USD'
    },
    gallery: {
      hero: restaurantInfo.hero_image,
      images: rawData.gallery_images || []
    },
    locations: normalizedLocations.map((loc: any) => ({
      address: loc.address || loc.location,
      phone: loc.phone,
      hours: loc.hours || loc.opening_hours,
      mapsUrl: loc.maps_url || loc.google_maps_url,
      timezone: loc.timezone
    })),
    metadata: {
      locale: rawData.locale || 'en-US',
      direction: rawData.direction || 'ltr'
    }
  }
}