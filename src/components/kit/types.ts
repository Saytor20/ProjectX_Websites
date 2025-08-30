// Component Kit Types
// Shared interfaces for all restaurant website components

export interface BaseComponentProps {
  id?: string
  className?: string
  variant?: string
  style?: React.CSSProperties
}

export interface BusinessInfo {
  name: string
  tagline?: string
  description?: string
  logo?: string
  social?: Record<string, string>
}

export interface Location {
  address: string
  phone?: string
  hours?: string
  mapsUrl?: string
  timezone?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface MenuItem {
  name: string
  description?: string
  price?: string | number
  image?: string
  category?: string
  available?: boolean
}

export interface MenuSection {
  name: string
  description?: string
  items: MenuItem[]
}

export interface GalleryImage {
  url: string
  alt?: string
  caption?: string
  thumbnail?: string
}

export interface NavigationItem {
  label: string
  href: string
  target?: string
  icon?: string
}

export interface CTAButton {
  text: string
  href: string
  target?: string
  variant?: 'primary' | 'secondary' | 'outline'
}