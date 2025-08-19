import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'
import { loadSkinMapping, normalizeRestaurantData } from '@/lib/mapping-dsl'
import { renderPageLayout } from '@/lib/component-renderer'

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
  const skinId = search.skin as string || 'cafert-modern'
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

  // Normalize data for component system
  const data = normalizeRestaurantData(rawData)
  
  // Load skin mapping
  let componentMappings
  try {
    componentMappings = await loadSkinMapping(skinId)
  } catch (error) {
    console.error('Failed to load skin mapping, using fallback:', error)
    // Fallback to default mapping if skin mapping fails
    componentMappings = [
      {
        as: 'Navbar' as const,
        props: {
          brand: { name: data.business.name },
          navigation: [
            { label: 'Home', href: '#home' },
            { label: 'Menu', href: '#menu' },
            { label: 'Contact', href: '#contact' }
          ]
        }
      },
      {
        as: 'Hero' as const,
        props: {
          title: data.business.name,
          subtitle: data.business.tagline || data.business.description,
          backgroundType: 'gradient'
        }
      },
      {
        as: 'MenuList' as const,
        props: {
          title: 'Our Menu',
          sections: data.menu.sections,
          currency: data.menu.currency,
          showImages: true,
          showDescriptions: true
        },
        when: data.menu.sections.length > 0 ? undefined : 'false'
      },
      {
        as: 'Footer' as const,
        props: {
          business: data.business,
          locations: data.locations,
          copyrightText: 'All rights reserved.'
        }
      }
    ]
  }

  return (
    <>
      {/* Load skin CSS if specified */}
      {skinId && (
        <link
          rel="stylesheet"
          href={`/api/skins/${skinId}/css?t=${Date.now()}`}
          key={skinId}
        />
      )}
      
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
      
      <div data-skin={skinId} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Preview indicator */}
        {isPreview && (
          <div className="preview-indicator">
            📱 {device.toUpperCase()} PREVIEW
          </div>
        )}
        
        {renderPageLayout(componentMappings, data)}
      </div>
      
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