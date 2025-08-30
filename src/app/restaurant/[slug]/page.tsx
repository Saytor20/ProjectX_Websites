import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'
// Legacy imports removed - using Template Package system only
import { getTemplate } from '../../../../templates/registry'
import { validateRestaurant } from '@/lib/schema'

// Load restaurant data
async function getRestaurantData(slug: string) {
  try {
    // Validate slug parameter
    if (!slug || slug === 'null' || slug === 'undefined') {
      console.error('Invalid slug parameter:', slug)
      return null
    }
    
    const restaurantPath = path.join(process.cwd(), 'restaurant_data', `${slug}.json`)
    const content = await fs.readFile(restaurantPath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Failed to load restaurant:', slug, error)
    return null
  }
}

// Metadata generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const data = await getRestaurantData(slug)
  
  if (!data) {
    return { title: 'Restaurant Not Found' }
  }
  
  return {
    title: `${data.restaurant_info?.name || 'Restaurant'} - Menu & Info`,
    description: data.restaurant_info?.description || 'Restaurant menu and information'
  }
}

export default async function RestaurantPage({ params, searchParams }: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params
  const search = await searchParams
  const templateId = search.template as string || 'bistly' // Default to bistly template
  const isPreview = search.preview === 'true'
  const device = search.device as string || 'desktop'
  
  // Additional slug validation
  if (!slug || slug === 'null' || slug === 'undefined' || slug.trim() === '') {
    console.error('Invalid restaurant slug:', slug)
    notFound()
  }
  
  const rawData = await getRestaurantData(slug)
  
  if (!rawData) {
    notFound()
  }

  // Always use Template Package system (Phase 2: legacy skins removed)
  const template = getTemplate(templateId)
  
  if (!template) {
    console.error('Template not found:', templateId)
    notFound()
  }

  // Adapt restaurant data to match template schema
  let restaurantData
  try {
    // Transform existing data format to match the template schema
    const adaptedData = {
      restaurant_info: {
        id: slug,
        name: rawData.restaurant_info?.name || 'Restaurant',
        region: rawData.restaurant_info?.address?.split(',')[0] || 'City',
        state: rawData.restaurant_info?.address?.split(',')[1]?.trim() || 'State', 
        country: 'Saudi Arabia',
        coordinates: {
          latitude: 24.7136,
          longitude: 46.6753
        },
        rating: rawData.restaurant_info?.rating || 4.0,
        review_count: Math.floor(Math.random() * 500) + 50,
        type_of_food: Array.isArray(rawData.restaurant_info?.cuisine_type) 
          ? rawData.restaurant_info.cuisine_type[0] 
          : rawData.restaurant_info?.cuisine_type || 'Restaurant',
        hungerstation_url: undefined
      },
      menu_categories: rawData.menu_categories || {}
    };

    restaurantData = validateRestaurant(adaptedData)
  } catch (error) {
    console.error('Failed to validate restaurant data for template:', error)
    notFound()
  }

  function transformMenuData(menuArray: any[]) {
    const categories: Record<string, any[]> = {};
    
    menuArray.forEach((item) => {
      const category = item.category || 'Menu';
      if (!categories[category]) {
        categories[category] = [];
      }
      
      categories[category].push({
        item_en: item.name,
        item_ar: item.name, // Fallback to English name
        price: parseFloat(item.price) || 0,
        currency: 'SAR',
        description: item.description,
        image: item.image,
        offer_price: null,
        discount: undefined,
        menu_id: parseInt(item.id) || 0
      });
    });
    
    return categories;
  }

  const TemplateComponent = template.component

  return (
    <>
      {/* Preview mode styles */}
      {isPreview && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .preview-indicator {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 9999;
                font-family: monospace;
              }
              
              ${device === 'tablet' ? 'body { max-width: 768px; margin: 0 auto; }' : ''}
              ${device === 'mobile' ? 'body { max-width: 375px; margin: 0 auto; }' : ''}
            `
          }}
        />
      )}
      
      {/* Preview indicator */}
      {isPreview && (
        <div className="preview-indicator">
          📱 {device.toUpperCase()} TEMPLATE PREVIEW: {template.manifest.name}
        </div>
      )}
      
      <TemplateComponent restaurant={restaurantData} />
      
      {/* Preview mode JavaScript */}
      {isPreview && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Hide preview indicator after 3 seconds
              setTimeout(() => {
                const indicator = document.querySelector('.preview-indicator');
                if (indicator) {
                  indicator.style.opacity = '0';
                  indicator.style.transition = 'opacity 0.5s ease';
                }
              }, 3000);
            `
          }}
        />
      )}
    </>
  )
}