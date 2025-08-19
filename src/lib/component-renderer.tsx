import React from 'react'
import { Navbar } from '@/components/kit/Navbar'
import { Hero } from '@/components/kit/Hero'
import { MenuList } from '@/components/kit/MenuList'
import { Gallery } from '@/components/kit/Gallery'
import { Hours } from '@/components/kit/Hours'
import { LocationMap } from '@/components/kit/LocationMap'
import { CTA } from '@/components/kit/CTA'
import { Footer } from '@/components/kit/Footer'
import { RichText } from '@/components/kit/RichText'
import { Section } from '@/components/kit/Section'

// Component registry for dynamic rendering
const componentRegistry = {
  Navbar,
  Hero,
  MenuList,
  Gallery,
  Hours,
  LocationMap,
  CTA,
  Footer,
  RichText,
  Section
}

export interface ComponentMapping {
  as: string
  variant?: string
  props: Record<string, any>
  when?: string
  children?: ComponentMapping[]
}

export interface RestaurantData {
  business: {
    name: string
    tagline?: string
    description?: string
    logo?: string
    social?: Record<string, string>
  }
  menu: {
    sections: Array<{
      name: string
      items: Array<{
        name: string
        description?: string
        price?: string | number
        image?: string
      }>
    }>
    currency?: string
  }
  gallery?: {
    hero?: string
    images: Array<{
      url: string
      alt?: string
    }>
  }
  locations: Array<{
    address: string
    phone?: string
    hours?: string
    mapsUrl?: string
    timezone?: string
  }>
  metadata: {
    locale?: string
    direction?: 'ltr' | 'rtl'
  }
}

// Simple JSONPath-like resolver
function resolvePath(data: any, path: string): any {
  if (!path || path === '$.') return data
  
  // Remove leading $. and split path
  const cleanPath = path.replace(/^\$\./, '')
  const parts = cleanPath.split('.')
  
  let current = data
  for (const part of parts) {
    if (current === null || current === undefined) return null
    
    // Handle array notation like sections[0] or sections[*]
    if (part.includes('[')) {
      const [key, indexPart] = part.split('[')
      const index = indexPart.replace(']', '')
      
      if (current[key]) {
        if (index === '*') {
          return current[key] // Return the whole array for existence check
        } else {
          current = current[key][parseInt(index)]
        }
      } else {
        return null
      }
    } else {
      current = current[part]
    }
  }
  
  return current
}

// Evaluate when conditions
function evaluateCondition(condition: string | undefined, data: RestaurantData): boolean {
  if (!condition) return true
  
  const value = resolvePath(data, condition)
  
  // Check if value exists and is not empty
  if (Array.isArray(value)) {
    return value.length > 0
  }
  
  return value !== null && value !== undefined && value !== ''
}

// Process mapping props to resolve data paths
function processProps(props: Record<string, any>, data: RestaurantData): Record<string, any> {
  const processed: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(props)) {
    // Skip invalid React props
    if (key === 'style' && typeof value === 'string') {
      // Don't pass string style props to React components
      // These are template-specific styling identifiers, not React inline styles
      continue
    }
    
    // Skip template-specific props that aren't valid React props
    if (['position', 'animation', 'layout'].includes(key) && typeof value === 'string') {
      continue
    }
    
    if (typeof value === 'string' && value.startsWith('$.')) {
      // Handle default values with ??
      if (value.includes(' ?? ')) {
        const [path, defaultValue] = value.split(' ?? ')
        const resolved = resolvePath(data, path.trim())
        processed[key] = resolved !== null && resolved !== undefined ? resolved : defaultValue.replace(/"/g, '')
      } else {
        processed[key] = resolvePath(data, value)
      }
    } else if (Array.isArray(value)) {
      processed[key] = value.map(item => {
        if (typeof item === 'object' && item !== null) {
          return processProps(item, data)
        }
        return item
      })
    } else if (typeof value === 'object' && value !== null) {
      processed[key] = processProps(value, data)
    } else {
      processed[key] = value
    }
  }
  
  return processed
}

// Render a single component mapping
export function renderComponent(mapping: ComponentMapping, data: RestaurantData, key?: string): React.ReactNode {
  // Check condition
  if (!evaluateCondition(mapping.when, data)) {
    return null
  }
  
  const Component = componentRegistry[mapping.as as keyof typeof componentRegistry]
  if (!Component) {
    console.warn(`Component ${mapping.as} not found in registry`)
    return null
  }
  
  // Process props
  const processedProps = processProps(mapping.props, data)
  
  // Add variant if specified
  if (mapping.variant) {
    processedProps.variant = mapping.variant
  }
  
  // Render children if any
  let children = null
  if (mapping.children && mapping.children.length > 0) {
    children = mapping.children.map((child, index) => 
      renderComponent(child, data, `${key}-child-${index}`)
    ).filter(Boolean)
  }
  
  // Use any to bypass TypeScript strict typing for dynamic components
  return React.createElement(Component as any, { key, ...processedProps }, children)
}

// Render complete page layout
export function renderPageLayout(mappings: ComponentMapping[], data: RestaurantData): React.ReactNode {
  return mappings.map((mapping, index) => 
    renderComponent(mapping, data, `component-${index}`)
  ).filter(Boolean)
}

// Default mapping for fallback
export const defaultMapping: ComponentMapping[] = [
  {
    as: 'Navbar',
    variant: 'modern',
    props: {
      brand: {
        name: '$.business.name',
        logo: '$.business.logo ?? null'
      },
      navigation: [
        { label: 'Home', href: '#home' },
        { label: 'Menu', href: '#menu' },
        { label: 'Contact', href: '#contact' }
      ],
      social: '$.business.social'
    }
  },
  {
    as: 'Hero',
    variant: 'image-left',
    props: {
      title: '$.business.name',
      subtitle: '$.business.tagline ?? $.business.type',
      description: '$.business.description',
      ctaButton: {
        text: 'View Menu',
        href: '#menu'
      },
      backgroundType: 'gradient'
    }
  },
  {
    as: 'Section',
    props: {
      id: 'menu',
      className: 'menu-section'
    },
    when: '$.menu.sections[*]',
    children: [
      {
        as: 'MenuList',
        variant: 'accordion',
        props: {
          title: 'Our Menu',
          sections: '$.menu.sections',
          currency: '$.menu.currency ?? SAR',
          showImages: true,
          showDescriptions: true
        }
      }
    ]
  },
  {
    as: 'Footer',
    variant: 'modern',
    props: {
      business: '$.business',
      locations: '$.locations',
      social: '$.business.social',
      copyrightText: 'All rights reserved.'
    }
  }
]