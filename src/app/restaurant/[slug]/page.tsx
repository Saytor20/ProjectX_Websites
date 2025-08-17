/**
 * Individual Restaurant Page with ISR
 * 
 * Dynamically generates restaurant pages with ISR support
 * Enables per-restaurant revalidation without full rebuild
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// Import individual components for server-side rendering (named exports)
import { Navbar } from '@/components/kit/Navbar'
import { Hero } from '@/components/kit/Hero'
import { MenuList } from '@/components/kit/MenuList'
import { Gallery } from '@/components/kit/Gallery'
import { Footer } from '@/components/kit/Footer'
import { skinLoader } from '@/lib/skin-loader'
import { migrateLegacyData } from '@/schema/validator'
import fs from 'fs/promises'
import path from 'path'
import type { SiteSchema } from '@/schema/core'

// ISR configuration - revalidate every hour by default
export const revalidate = 3600 // 1 hour

// Dynamic params for static generation
export async function generateStaticParams() {
  try {
    const restaurantDir = path.join(process.cwd(), 'data/restaurants')
    const files = await fs.readdir(restaurantDir)
    const restaurantFiles = files.filter(file => 
      file.endsWith('.json') && 
      !file.includes('_processing_summary') &&
      !file.startsWith('_')
    )

    return restaurantFiles.map(file => ({
      slug: file.replace('.json', '')
    }))
  } catch (error) {
    console.warn('Failed to generate static params:', error)
    return []
  }
}

// Load restaurant data with caching
async function getRestaurantData(slug: string): Promise<SiteSchema | null> {
  try {
    const restaurantPath = path.join(process.cwd(), 'data/restaurants', `${slug}.json`)
    const restaurantContent = await fs.readFile(restaurantPath, 'utf8')
    const legacyData = JSON.parse(restaurantContent)
    
    // Migrate to new schema
    const siteData = migrateLegacyData(legacyData)
    return siteData
  } catch (error) {
    console.error(`Failed to load restaurant data for ${slug}:`, error)
    return null
  }
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const siteData = await getRestaurantData(slug)
  
  if (!siteData) {
    return {
      title: 'Restaurant Not Found',
      description: 'The requested restaurant page could not be found.'
    }
  }

  return {
    title: `${siteData.business.name} - Restaurant Website`,
    description: siteData.business.description || `Visit ${siteData.business.name} for delicious ${siteData.business.type} food.`,
    keywords: [
      siteData.business.name,
      siteData.business.type,
      'restaurant',
      'food',
      siteData.locations[0]?.city || 'Saudi Arabia'
    ].join(', '),
    openGraph: {
      title: siteData.business.name,
      description: siteData.business.description || `Visit ${siteData.business.name} for great food.`,
      type: 'website',
      locale: siteData.metadata.locale,
      siteName: siteData.business.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteData.business.name,
      description: siteData.business.description || `Visit ${siteData.business.name} for great food.`,
    },
    alternates: {
      canonical: `/restaurant/${slug}`,
    },
  }
}

// Main restaurant page component
export default async function RestaurantPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>
  searchParams: Promise<{ skin?: string }>
}) {
  // Await params and searchParams
  const { slug } = await params
  const { skin } = await searchParams
  
  // Load restaurant data
  const siteData = await getRestaurantData(slug)
  
  if (!siteData) {
    notFound()
  }

  // Determine skin to use (from URL param or default)
  const skinId = skin || 'cafert-modern'
  
  try {
    // Load skin and generate mappings
    const [skinResult, mappings] = await Promise.all([
      skinLoader.loadSkin(skinId),
      skinLoader.generateMappings(skinId, siteData)
    ])

    // Simple server-side component rendering
    // For now, render a basic layout directly
    const components = (
      <>
        <Navbar 
          brandName={siteData.business.name}
          logo={siteData.business.logo || undefined}
          logoAlt={`${siteData.business.name} logo`}
          links={[
            { text: 'Home', href: '#hero' },
            { text: 'Menu', href: '#menu' },
            { text: 'Gallery', href: '#gallery' },
            { text: 'Contact', href: '#contact' }
          ]}
          social={[]}
        />
        
        <Hero
          variant="gradient"
          title={siteData.business.name}
          subtitle={siteData.business.description || `Welcome to ${siteData.business.name}`}
          ctaText="View Menu"
          ctaHref="#menu"
          image={siteData.gallery?.hero || siteData.gallery?.images?.[0]?.url || undefined}
          imageAlt={`${siteData.business.name} restaurant`}
        />
        
        <MenuList
          variant="compact-columns"
          sections={siteData.menu?.sections?.map(section => ({
            id: section.id,
            title: section.title,
            items: (section.items || []).map((item, index) => ({
              ...item,
              id: item.id || `${section.id}-item-${index}`,
              name: item.name || `Item ${index + 1}`,
              price: item.price || 0,
              currency: item.currency || 'SAR'
            }))
          })) || []}
          currency="SAR"
          showPrices={true}
          showDescriptions={true}
        />
        
        {siteData.gallery?.images && siteData.gallery.images.length > 0 && (
          <Gallery
            images={siteData.gallery.images.slice(0, 6).map((image, index) => ({
              url: image.url,
              alt: image.alt || `${siteData.business.name} image ${index + 1}`,
              caption: image.caption || `${siteData.business.name} gallery`
            }))}
            variant="grid"
            columns={3}
            aspectRatio="landscape"
          />
        )}
        
        <Footer
          brandName={siteData.business.name}
          logo={siteData.business.logo || undefined}
          logoAlt={`${siteData.business.name} logo`}
          address={siteData.locations?.[0]?.address}
          phone={siteData.locations?.[0]?.phone}
          email={siteData.business.email}
          social={[]}
          copyright={`© 2024 ${siteData.business.name}. All rights reserved.`}
        />
      </>
    )

    return (
      <div 
        data-skin={skinId}
        data-restaurant={slug}
        className="min-h-screen"
      >
        {/* Inject skin CSS */}
        <style dangerouslySetInnerHTML={{ __html: skinResult.processedCSS }} />
        
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="skip-link sr-only focus:not-sr-only"
        >
          Skip to main content
        </a>
        
        {/* Main content */}
        <main id="main-content">
          {components}
        </main>

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant", 
              "name": siteData.business.name,
              "description": siteData.business.description,
              "url": `/restaurant/${slug}`,
              "telephone": siteData.locations[0]?.phone,
              "address": siteData.locations[0] ? {
                "@type": "PostalAddress",
                "streetAddress": siteData.locations[0].address,
                "addressLocality": siteData.locations[0].city,
                "addressRegion": siteData.locations[0].state,
                "addressCountry": siteData.locations[0].country
              } : undefined,
              "geo": siteData.locations[0]?.coordinates ? {
                "@type": "GeoCoordinates",
                "latitude": siteData.locations[0].coordinates.latitude,
                "longitude": siteData.locations[0].coordinates.longitude
              } : undefined,
              "servesCuisine": siteData.business.type,
              "priceRange": "$$",
              "aggregateRating": siteData.business.rating ? {
                "@type": "AggregateRating",
                "ratingValue": siteData.business.rating,
                "reviewCount": siteData.business.reviewCount || 1
              } : undefined
            })
          }}
        />

        {/* Development info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded opacity-75">
            Skin: {skinId} | Restaurant: {slug}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error(`Failed to render restaurant page for ${slug}:`, error)
    
    // Fallback error page
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to Load Restaurant
          </h1>
          <p className="text-gray-600 mb-4">
            There was an error loading the restaurant page for "{slug}".
          </p>
          <p className="text-sm text-gray-500">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <div className="mt-6">
            <a 
              href="/" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    )
  }
}