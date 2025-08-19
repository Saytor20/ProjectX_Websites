import yaml from 'js-yaml'
import { ComponentMapping, RestaurantData } from './component-renderer'
import fs from 'fs/promises'
import path from 'path'

export interface SkinMapping {
  meta?: {
    name: string
    description: string
    version: string
    author?: string
  }
  page: {
    layout: ComponentMapping[]
  }
  design_tokens?: Record<string, any>
  responsive?: Record<string, string>
  performance?: Record<string, any>
  accessibility?: Record<string, boolean>
}

export interface QuantumMapping {
  meta: {
    name: string
    description: string
    version: string
    author?: string
  }
  layout: Record<string, any>
  sections: Array<{
    id: string
    component: string
    variant?: string
    layout?: string
    props?: Record<string, any>
    content?: Record<string, any>
  }>
  design_tokens?: Record<string, any>
  responsive?: Record<string, string>
  performance?: Record<string, any>
  accessibility?: Record<string, boolean>
}

// Convert restaurant data to internal format
export function normalizeRestaurantData(rawData: any): RestaurantData {
  // Handle both old and new data formats
  const restaurantInfo = rawData.restaurant_info || rawData.business || {}
  const menuData = rawData.menu || []
  
  // Convert menu array to sections format
  let menuSections: any[] = []
  if (Array.isArray(menuData)) {
    // Group by category
    const grouped = menuData.reduce((acc: any, item: any) => {
      const category = item.category || 'Main Menu'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push({
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image
      })
      return acc
    }, {})
    
    menuSections = Object.entries(grouped).map(([name, items]) => ({
      name,
      items
    }))
  } else if (menuData.sections) {
    menuSections = menuData.sections
  }
  
  return {
    business: {
      name: restaurantInfo.name || 'Restaurant',
      tagline: restaurantInfo.tagline || restaurantInfo.description,
      description: restaurantInfo.description || '',
      logo: restaurantInfo.logo,
      social: restaurantInfo.social || {}
    },
    menu: {
      sections: menuSections,
      currency: menuData.currency || 'SAR'
    },
    gallery: {
      hero: rawData.gallery?.hero,
      images: rawData.gallery?.images || []
    },
    locations: [{
      address: restaurantInfo.address || '',
      phone: restaurantInfo.phone,
      hours: restaurantInfo.working_hours || restaurantInfo.hours,
      mapsUrl: restaurantInfo.mapsUrl,
      timezone: 'Asia/Riyadh'
    }],
    metadata: {
      locale: rawData.metadata?.locale || 'en',
      direction: rawData.metadata?.direction || 'ltr'
    }
  }
}

// Convert quantum-style mapping to component mapping
function convertQuantumMapping(quantum: QuantumMapping): ComponentMapping[] {
  return quantum.sections.map(section => {
    const mapping: ComponentMapping = {
      as: section.component,
      props: {
        id: section.id,
        ...section.props
      }
    }
    
    if (section.variant) {
      mapping.variant = section.variant
    }
    
    // Convert content to props based on component type
    if (section.content) {
      switch (section.component) {
        case 'Navbar':
          if (section.content.logo) {
            mapping.props.brand = {
              name: '$.business.name',
              logo: '$.business.logo'
            }
          }
          if (section.content.navigation) {
            mapping.props.navigation = section.content.navigation.items || []
          }
          break
          
        case 'Hero':
          if (section.content.title) {
            mapping.props.title = '$.business.name'
          }
          if (section.content.subtitle) {
            mapping.props.subtitle = '$.business.tagline'
          }
          if (section.content.stats) {
            mapping.props.showStats = true
          }
          break
          
        case 'MenuList':
          mapping.props.title = section.content.title?.text || 'Our Menu'
          mapping.props.sections = '$.menu.sections'
          mapping.props.currency = '$.menu.currency'
          mapping.props.showImages = true
          mapping.props.showDescriptions = true
          break
          
        case 'Gallery':
          mapping.props.title = section.content.title?.text || 'Gallery'
          mapping.props.images = '$.gallery.images'
          mapping.props.showLightbox = true
          break
          
        case 'Hours':
          mapping.props.title = section.content.title?.text || 'Hours'
          mapping.props.hours = '$.locations[0].hours'
          mapping.props.timezone = '$.locations[0].timezone'
          break
          
        case 'LocationMap':
          mapping.props.title = section.content.title?.text || 'Location'
          mapping.props.location = '$.locations[0]'
          mapping.props.height = '400px'
          break
          
        case 'CTA':
          mapping.props.title = section.content.title?.text || 'Visit Us'
          mapping.props.description = 'Experience great food'
          if (section.content.button) {
            mapping.props.primaryButton = {
              text: section.content.button.text || 'Order Now',
              href: '#menu'
            }
          }
          break
          
        case 'Footer':
          mapping.props.business = '$.business'
          mapping.props.locations = '$.locations'
          mapping.props.social = '$.business.social'
          mapping.props.copyrightText = 'All rights reserved.'
          break
      }
    }
    
    return mapping
  })
}

// Parse YAML mapping file
export function parseMapping(yamlContent: string): ComponentMapping[] {
  try {
    const parsed = yaml.load(yamlContent) as any
    
    // Handle different mapping formats
    if (parsed.page && parsed.page.layout) {
      // Standard cafert-style mapping
      return parsed.page.layout
    } else if (parsed.sections) {
      // Quantum-style mapping
      return convertQuantumMapping(parsed as QuantumMapping)
    } else {
      console.warn('Unknown mapping format, using default')
      return []
    }
  } catch (error) {
    console.error('Failed to parse mapping YAML:', error)
    return []
  }
}

// Load and process skin mapping
export async function loadSkinMapping(skinId: string): Promise<ComponentMapping[]> {
  try {
    // Read mapping file directly from filesystem (more reliable than HTTP)
    const skinDirectory = path.join(process.cwd(), 'skins', skinId)
    const mapPath = path.join(skinDirectory, 'map.yml')
    
    // Check if mapping file exists
    const mapExists = await fs.access(mapPath).then(() => true).catch(() => false)
    if (!mapExists) {
      throw new Error(`Mapping file not found for skin: ${skinId}`)
    }
    
    // Read the mapping file
    const yamlContent = await fs.readFile(mapPath, 'utf8')
    return parseMapping(yamlContent)
  } catch (error) {
    console.error(`Error loading mapping for ${skinId}:`, error)
    
    // Return basic fallback mapping
    return [
      {
        as: 'Navbar',
        props: {
          brand: { name: '$.business.name' },
          navigation: [
            { label: 'Home', href: '#home' },
            { label: 'Menu', href: '#menu' },
            { label: 'Contact', href: '#contact' }
          ]
        }
      },
      {
        as: 'Hero',
        props: {
          title: '$.business.name',
          subtitle: '$.business.tagline',
          backgroundType: 'gradient'
        }
      },
      {
        as: 'MenuList',
        props: {
          title: 'Our Menu',
          sections: '$.menu.sections',
          currency: '$.menu.currency'
        },
        when: '$.menu.sections[*]'
      },
      {
        as: 'Footer',
        props: {
          business: '$.business',
          locations: '$.locations'
        }
      }
    ]
  }
}

// Validate mapping structure
export function validateMapping(mapping: ComponentMapping[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const validComponents = ['Navbar', 'Hero', 'MenuList', 'Gallery', 'Hours', 'LocationMap', 'CTA', 'Footer', 'RichText', 'Section']
  
  for (const [index, item] of mapping.entries()) {
    if (!item.as) {
      errors.push(`Item ${index}: Missing 'as' property`)
      continue
    }
    
    if (!validComponents.includes(item.as)) {
      errors.push(`Item ${index}: Invalid component '${item.as}'`)
    }
    
    if (!item.props || typeof item.props !== 'object') {
      errors.push(`Item ${index}: Missing or invalid 'props' object`)
    }
    
    // Validate children recursively
    if (item.children) {
      const childValidation = validateMapping(item.children)
      if (!childValidation.valid) {
        errors.push(...childValidation.errors.map(err => `Item ${index} -> ${err}`))
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}