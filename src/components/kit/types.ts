/**
 * Component Kit Types
 * 
 * Stable prop interfaces for all components in the kit.
 * These interfaces MUST remain backward compatible.
 * Use semver versioning for any changes.
 */

import { ReactNode } from 'react';
import { SiteSchema, MenuItem as SchemaMenuItem, LocationInfo, GalleryImage } from '@/schema/core';

// Base component props
export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
  locale?: 'en' | 'ar';
  direction?: 'ltr' | 'rtl';
}

// Navigation link
export interface NavLink {
  text: string;
  href: string;
  external?: boolean;
  'aria-label'?: string;
}

// Social media link
export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'whatsapp' | 'tiktok';
  url: string;
  handle?: string;
  'aria-label'?: string;
}

// Navbar component props
export interface NavbarProps extends BaseComponentProps {
  logo?: string;
  logoAlt?: string;
  brandName: string;
  brandHref?: string;
  links: NavLink[];
  social?: SocialLink[];
  variant?: 'default' | 'minimal' | 'centered';
}

// Hero component props  
export interface HeroProps extends BaseComponentProps {
  variant: 'image-left' | 'minimal' | 'gradient' | 'fullscreen';
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
}

// Menu list component props
export interface MenuListProps extends BaseComponentProps {
  variant: 'grid-photos' | 'table-clean' | 'cards-compact' | 'compact-columns' | 'accordion' | 'grid' | 'masonry';
  sections: MenuSection[];
  currency: string;
  showImages?: boolean;
  showPrices?: boolean;
  showDescriptions?: boolean;
  paginateThreshold?: number;
  grid?: {
    columns?: number;
    imageShape?: 'boxed' | 'rounded' | 'circle';
  };
}

export interface MenuSection {
  id: string;
  title: string;
  titleAr?: string;
  description?: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  offerPrice?: number;
  currency: string;
  image?: string;
  alt?: string;
  tags?: string[];
  available?: boolean;
}

// Gallery component props
export interface GalleryProps extends BaseComponentProps {
  images: GalleryImageItem[];
  variant?: 'grid' | 'masonry' | 'carousel' | 'lightbox';
  columns?: 2 | 3 | 4 | 6;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export interface GalleryImageItem {
  url: string;
  alt: string;
  caption?: string;
  captionAr?: string;
}

// Hours component props
export interface HoursProps extends BaseComponentProps {
  hours: OpeningHours;
  timezone: string;
  variant?: 'compact' | 'detailed' | 'today-only';
  showTimezone?: boolean;
}

export interface OpeningHours {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  open: string; // HH:MM format
  close: string; // HH:MM format
}

// Location Map component props
export interface LocationMapProps extends BaseComponentProps {
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  zoom?: number;
  variant?: 'embedded' | 'popup' | 'static';
  showDirections?: boolean;
  apiKey?: string;
}

// CTA (Call-to-Action) component props
export interface CTAProps extends BaseComponentProps {
  variant: 'reservation' | 'order' | 'contact' | 'custom';
  text: string;
  href?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: 'primary' | 'secondary' | 'outline';
  icon?: ReactNode;
  disabled?: boolean;
}

// Footer component props
export interface FooterProps extends BaseComponentProps {
  brandName: string;
  brandHref?: string;
  logo?: string;
  logoAlt?: string;
  address?: string;
  phone?: string;
  email?: string;
  social?: SocialLink[];
  links?: NavLink[];
  copyright?: string;
  variant?: 'simple' | 'detailed' | 'minimal';
}

// Rich Text component props
export interface RichTextProps extends BaseComponentProps {
  content: string;
  variant?: 'body' | 'lead' | 'caption';
  sanitize?: boolean; // Always true in production
  allowedTags?: string[];
}

// Section wrapper component props
export interface SectionProps extends BaseComponentProps {
  children: ReactNode;
  variant?: 'default' | 'contained' | 'full-width' | 'centered';
  background?: 'transparent' | 'primary' | 'secondary' | 'accent';
  padding?: 'none' | 'small' | 'medium' | 'large';
  id?: string;
  'aria-labelledby'?: string;
}

// Component registry for dynamic rendering
export interface ComponentRegistry {
  Navbar: React.ComponentType<NavbarProps>;
  Hero: React.ComponentType<HeroProps>;
  MenuList: React.ComponentType<MenuListProps>;
  Gallery: React.ComponentType<GalleryProps>;
  Hours: React.ComponentType<HoursProps>;
  LocationMap: React.ComponentType<LocationMapProps>;
  CTA: React.ComponentType<CTAProps>;
  Footer: React.ComponentType<FooterProps>;
  RichText: React.ComponentType<RichTextProps>;
  Section: React.ComponentType<SectionProps>;
}

// Mapping configuration for skins
export interface ComponentMapping {
  as: keyof ComponentRegistry;
  variant?: string;
  props: Record<string, any>;
  when?: string; // JSONPath condition
  each?: string; // JSONPath array to iterate
}

// Skin configuration
export interface SkinConfig {
  id: string;
  name: string;
  version: string;
  schemaVersion: string; // Compatibility range: ">=1.0.0 <2.0.0"
  description?: string;
  author?: string;
  license: {
    type: string;
    proof?: string; // Path to license file
    url?: string;
  };
  performance: {
    cssSize: string; // "45KB"
    jsSize?: string;
  };
  features: {
    rtl: boolean;
    mobile: boolean;
    darkMode?: boolean;
  };
}