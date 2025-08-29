import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'
import { loadSkinMapping } from '@/lib/mapping-dsl'
import { normalizeRestaurantData } from '@/lib/data-normalizer'
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
  const isDesignMode = search.design === 'true'
  const device = search.device as string || 'desktop'
  // Menu display overrides from query (optional)
  const menuVariant = (search.menuVariant as string) || undefined
  const menuShowImages = (search.menuShowImages as string) === 'true' ? true : (search.menuShowImages === 'false' ? false : undefined)
  const menuShowDescriptions = (search.menuShowDescriptions as string) === 'true' ? true : (search.menuShowDescriptions === 'false' ? false : undefined)
  const menuItemsPerRow = search.menuItemsPerRow ? parseInt(search.menuItemsPerRow as string, 10) : undefined
  
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
  let data
  try {
    data = normalizeRestaurantData(rawData)
  } catch (error) {
    console.error('Failed to normalize restaurant data:', error)
    notFound()
  }
  
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

  // Apply Menu Settings overrides to first MenuList found
  if (componentMappings && Array.isArray(componentMappings)) {
    const applyOverrides = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.as === 'MenuList') {
          node.props = node.props || {}
          if (typeof menuVariant === 'string') node.variant = menuVariant
          if (typeof menuShowImages === 'boolean') node.props.showImages = menuShowImages
          if (typeof menuShowDescriptions === 'boolean') node.props.showDescriptions = menuShowDescriptions
          if (typeof menuItemsPerRow === 'number' && !Number.isNaN(menuItemsPerRow)) node.props.itemsPerRow = menuItemsPerRow
          break
        }
        if (Array.isArray(node.children)) applyOverrides(node.children)
      }
    }
    applyOverrides(componentMappings as any)
  }

  return (
    <>
      {/* Load skin CSS if specified */}
      {skinId && skinId !== 'null' && skinId !== 'undefined' && (
        <link
          rel="stylesheet"
          href={`/api/skins/${skinId}/css?t=${Date.now()}`}
          key={skinId}
        />
      )}
      
      {/* Load saved design overrides per skin/restaurant - only if both skinId and slug exist */}
      {skinId && slug && slug !== 'null' && slug !== 'undefined' && (
        <link
          rel="stylesheet"
          href={`/api/overrides/${skinId}/${slug}.css?t=${Date.now()}`}
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

      {/* Design mode styles */}
      {isDesignMode && (
        <style
          data-design-mode
          dangerouslySetInnerHTML={{
            __html: `
              .design-indicator {
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(34, 197, 94, 0.15);
                color: #16a34a;
                padding: 6px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 9999;
                font-family: monospace;
                border: 1px solid rgba(22, 163, 74, 0.4);
              }
              
              /* Design-mode CSS freeze: disable transitions/hover transforms so Moveable's transforms are authoritative */
              [data-editor-id] {
                transition: none !important;
                animation: none !important;
                transform-origin: center !important;
              }
              [data-editor-id]:hover {
                transform: none !important;
                scale: none !important;
              }
              [data-editor-id] button:hover, [data-editor-id] a:hover {
                opacity: 1 !important;
                background: var(--original-bg, inherit) !important;
              }
              
              /* Make sure elements can be selected */
              [data-editor-id] {
                cursor: pointer !important;
              }
            `
          }}
        />
      )}
      
      <div data-skin={skinId} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Preview indicator */
        }
        {isPreview && (
          <div className="preview-indicator">
            📱 {device.toUpperCase()} PREVIEW
          </div>
        )}

        {/* Design indicator */}
        {isDesignMode && (
          <div className="design-indicator">🛠️ Design Mode</div>
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
      
      {/* Design mode safety JavaScript */}
      {isDesignMode && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Updated click policy: prevent link navigation but preserve selection event flow
              document.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                  e.preventDefault();
                  // Don't stopPropagation - let Selecto/Moveable handle it
                }
                if (e.target.closest('button') || e.target.closest('form') || (e.target instanceof HTMLInputElement && e.target.type === 'submit')) {
                  e.preventDefault();
                }
              }, { capture: false });
              
              // Move selection handling to pointerdown for better capture timing
              document.addEventListener('pointerdown', (e) => {
                // Selection logic will be handled by Selecto in MoveableEditor
              }, { capture: true });
              
              // Handle image and CSS loading errors
              document.addEventListener('error', (e) => {
                if (e.target.tagName === 'IMG') {
                  console.log('Image failed to load:', e.target.src);
                  e.target.style.display = 'none';
                } else if (e.target.tagName === 'LINK' && e.target.rel === 'stylesheet') {
                  console.log('CSS failed to load (this is normal for new sites):', e.target.href);
                }
              }, true);
              
              document.addEventListener('submit', (e)=>{ e.preventDefault(); }, true);
            `
          }}
        />
      )}
    </>
  )
}
