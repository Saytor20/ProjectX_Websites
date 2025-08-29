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
import { RawHTML } from '@/components/kit/RawHTML'
// Removed Inspectable import - no longer using Shadow DOM editor

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
  Section,
  RawHTML
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

// Apply pipe operations to resolved values
function applyPipes(value: any, pipeStr: string): any {
  const pipes = pipeStr.split('|').map(p => p.trim()).filter(p => p)
  
  let result = value
  for (const pipe of pipes) {
    const match = pipe.match(/^(\w+)(?:\(([^)]*)\))?$/)
    if (!match) continue
    
    const [, operation, params] = match
    const paramList = params ? params.split(',').map(p => p.trim()) : []
    
    if (Array.isArray(result)) {
      switch (operation) {
        case 'first':
          const firstN = paramList[0] ? parseInt(paramList[0]) : 1
          result = result.slice(0, firstN)
          break
        case 'truncate':
          const truncateN = paramList[0] ? parseInt(paramList[0]) : result.length
          result = result.slice(0, truncateN)
          break
        case 'join':
          const separator = paramList[0]?.replace(/['"]/g, '') || ''
          result = result.join(separator)
          break
      }
    }
  }
  
  return result
}

// Process string interpolation ${$.path} syntax
function processInterpolation(template: string, data: RestaurantData): string {
  return template.replace(/\$\{(\$\.[^}]+)\}/g, (match, path) => {
    const resolved = resolvePath(data, path)
    return resolved !== null && resolved !== undefined ? String(resolved) : ''
  })
}

// Filter array items by 'when' condition
function filterByWhen(items: any[]): any[] {
  return items.filter(item => {
    if (typeof item === 'object' && item !== null && 'when' in item) {
      return item.when !== false && item.when !== null && item.when !== undefined
    }
    return true
  })
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
      let resolvedValue: any = null
      
      // Handle default values with ?? (both spaced and non-spaced)
      if (value.includes('??')) {
        const [pathPart, defaultPart] = value.split('??').map(s => s.trim())
        
        // Check for pipes in the path part
        if (pathPart.includes('|')) {
          const [path, pipeStr] = pathPart.split('|').map(s => s.trim())
          const resolved = resolvePath(data, path)
          resolvedValue = resolved !== null && resolved !== undefined ? 
            applyPipes(resolved, pipeStr) : 
            defaultPart.replace(/^['"]|['"]$/g, '') // Strip quotes from default
        } else {
          const resolved = resolvePath(data, pathPart)
          resolvedValue = resolved !== null && resolved !== undefined ? 
            resolved : 
            defaultPart.replace(/^['"]|['"]$/g, '') // Strip quotes from default
        }
      } else if (value.includes('|')) {
        // Handle pipes without defaults
        const [path, pipeStr] = value.split('|').map(s => s.trim())
        const resolved = resolvePath(data, path)
        resolvedValue = resolved !== null && resolved !== undefined ? 
          applyPipes(resolved, pipeStr) : 
          null
      } else {
        // Simple path resolution
        resolvedValue = resolvePath(data, value)
      }
      
      // Apply array filtering if result is array
      if (Array.isArray(resolvedValue)) {
        resolvedValue = filterByWhen(resolvedValue)
      }
      
      processed[key] = resolvedValue
    } else if (typeof value === 'string' && value.includes('${$.')) {
      // Handle string interpolation
      processed[key] = processInterpolation(value, data)
    } else if (Array.isArray(value)) {
      const processedArray = value.map(item => {
        if (typeof item === 'object' && item !== null) {
          return processProps(item, data)
        }
        return item
      })
      // Apply when filtering to processed array
      processed[key] = filterByWhen(processedArray)
    } else if (typeof value === 'object' && value !== null) {
      processed[key] = processProps(value, data)
    } else {
      processed[key] = value
    }

    // Sanitize invalid or unresolved hrefs to safe anchors
    if (key === 'href') {
      const v = processed[key]
      if (
        v === null || v === undefined ||
        (typeof v === 'string' && (
          v.trim() === '' ||
          v === 'null' || v === 'undefined' ||
          /\/restaurant\/(null|undefined)(\b|\/|\?|#|$)/.test(v)
        ))
      ) {
        processed[key] = '#'
      }
    }
  }
  
  // Apply property aliasing
  const aliases = {
    alignment: 'textAlign',
    background: 'backgroundColor',
    colour: 'color'
  }
  
  for (const [alias, realProp] of Object.entries(aliases)) {
    if (alias in processed) {
      processed[realProp] = processed[alias]
      delete processed[alias]
    }
  }
  
  return processed
}

// Render a single component mapping with hierarchical paths
export function renderComponent(
  mapping: ComponentMapping, 
  data: RestaurantData, 
  path: string = '0',
  key?: string
): React.ReactNode {
  // Check condition
  if (!evaluateCondition(mapping.when, data)) {
    return null
  }
  
  const Component = componentRegistry[mapping.as as keyof typeof componentRegistry]
  if (!Component) {
    console.warn(`Component ${mapping.as} not found in registry`)
    return null
  }
  
  // Process props and sanitize hrefs in design mode
  const processedProps = processProps(mapping.props, data)
  
  // Add variant if specified
  if (mapping.variant) {
    processedProps.variant = mapping.variant
  }
  
  // Add deterministic editor ID stamping function
  processedProps.editorId = path
  
  // Render children if any
  let children = null
  if (mapping.children && mapping.children.length > 0) {
    children = mapping.children.map((child, childIndex) => {
      const childPath = `${path}:child-${childIndex}`
      return renderComponent(child, data, childPath, `child-${childIndex}`)
    }).filter(Boolean)
  }
  
  // Filter out editorId from DOM props and create component element with deterministic nested data-editor-ids
  const { editorId: _, ...domProps } = processedProps;
  const element = React.createElement(Component as any, { 
    key, 
    ...domProps,
    'data-editor-id': path 
  }, children)
  
  // Direct return - no longer wrapping with Inspectable
  return element
}

// Render complete page layout
export function renderPageLayout(mappings: ComponentMapping[], data: RestaurantData): React.ReactNode {
  return mappings.map((mapping, index) => 
    renderComponent(mapping, data, String(index), `component-${index}`)
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
