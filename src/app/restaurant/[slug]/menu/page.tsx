import { notFound } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'
import { migrateLegacyData } from '@/schema/validator'
import { MenuList } from '@/components/kit/MenuList'

async function getRestaurantData(slug: string) {
  try {
    const restaurantPath = path.join(process.cwd(), 'data/restaurants', `${slug}.json`)
    const restaurantContent = await fs.readFile(restaurantPath, 'utf8')
    const legacyData = JSON.parse(restaurantContent)
    return migrateLegacyData(legacyData)
  } catch (error) {
    return null
  }
}

export default async function FullMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const siteData = await getRestaurantData(slug)
  if (!siteData) {
    notFound()
  }

  const display = siteData.menu?.display ?? {}
  const restaurantName = siteData.business?.name || 'Restaurant'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {restaurantName} - Full Menu
          </h1>
          <p className="text-gray-600">
            Browse our complete menu with all available items
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-6xl mx-auto p-6">
        {siteData.menu?.sections && siteData.menu.sections.length > 0 ? (
          <MenuList
            variant={(display as any).variant ?? 'grid-photos'}
            sections={siteData.menu.sections as any}
            currency={siteData.menu?.currency ?? 'SAR'}
            showImages={(display as any).showImages ?? true}
            showPrices={true}
            showDescriptions={(display as any).showDescriptions ?? true}
            paginateThreshold={(display as any).paginateThreshold ?? 8}
            grid={(display as any).grid ?? { columns: 3, imageShape: 'boxed' }}
            locale={siteData.metadata?.locale ?? 'en'}
            direction={siteData.metadata?.direction ?? 'ltr'}
          />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Menu Available</h2>
            <p className="text-gray-600">This restaurant's menu is not yet available.</p>
          </div>
        )}
      </div>

      {/* Back to Restaurant Link */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <a 
          href={`/restaurant/${slug}`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          ← Back to {restaurantName}
        </a>
      </div>
    </div>
  )
}
