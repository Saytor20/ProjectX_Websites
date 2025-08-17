/**
 * Component Kit - Main Export File
 * 
 * Exports all components in the kit with their types.
 * This is the single source of truth for the component registry.
 */

// Core components
export { Navbar } from './Navbar';
export { Hero } from './Hero';
export { MenuList } from './MenuList';
export { Gallery } from './Gallery';
export { Hours } from './Hours';
export { LocationMap } from './LocationMap';
export { CTA, ReservationCTA, OrderCTA, ContactCTA } from './CTA';
export { Footer } from './Footer';
export { RichText, LeadText, CaptionText, textToRichText, richTextToPlainText, truncateRichText } from './RichText';
export { Section, ContainedSection, FullWidthSection, CenteredSection, HeroSection, ContentSection } from './Section';

// Types
export type {
  BaseComponentProps,
  NavbarProps,
  HeroProps,
  MenuListProps,
  MenuSection,
  MenuItem,
  GalleryProps,
  GalleryImageItem,
  HoursProps,
  OpeningHours,
  TimeSlot,
  LocationMapProps,
  CTAProps,
  FooterProps,
  RichTextProps,
  SectionProps,
  NavLink,
  SocialLink,
  ComponentRegistry,
  ComponentMapping,
  SkinConfig,
} from './types';

// Component registry for dynamic rendering
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { MenuList } from './MenuList';
import { Gallery } from './Gallery';
import { Hours } from './Hours';
import { LocationMap } from './LocationMap';
import { CTA } from './CTA';
import { Footer } from './Footer';
import { RichText } from './RichText';
import { Section } from './Section';
import type { ComponentRegistry } from './types';

export const COMPONENT_REGISTRY: ComponentRegistry = {
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
} as const;

// Component kit version for compatibility checking
export const COMPONENT_KIT_VERSION = '1.0.0';

// Supported component variants
export const COMPONENT_VARIANTS = {
  Navbar: ['default', 'minimal', 'centered'] as const,
  Hero: ['image-left', 'minimal', 'gradient', 'fullscreen'] as const,
  MenuList: ['compact-columns', 'accordion', 'grid', 'masonry'] as const,
  Gallery: ['grid', 'masonry', 'carousel', 'lightbox'] as const,
  Hours: ['compact', 'detailed', 'today-only'] as const,
  LocationMap: ['embedded', 'popup', 'static'] as const,
  CTA: ['reservation', 'order', 'contact', 'custom'] as const,
  Footer: ['simple', 'detailed', 'minimal'] as const,
  RichText: ['body', 'lead', 'caption'] as const,
  Section: ['default', 'contained', 'full-width', 'centered'] as const,
} as const;

// Utility function to get component by name
export function getComponent(name: keyof ComponentRegistry) {
  return COMPONENT_REGISTRY[name];
}

// Utility function to validate component variant
export function isValidVariant<T extends keyof typeof COMPONENT_VARIANTS>(
  component: T,
  variant: string
): variant is typeof COMPONENT_VARIANTS[T][number] {
  return (COMPONENT_VARIANTS[component] as readonly string[]).includes(variant);
}

// Default props for components
export const DEFAULT_COMPONENT_PROPS = {
  Navbar: {
    variant: 'default',
    links: [],
    social: [],
  },
  Hero: {
    variant: 'minimal',
  },
  MenuList: {
    variant: 'compact-columns',
    currency: 'SAR',
    showImages: true,
    showPrices: true,
    showDescriptions: true,
  },
  Gallery: {
    variant: 'grid',
    columns: 3,
    aspectRatio: 'square',
  },
  Hours: {
    variant: 'detailed',
    showTimezone: false,
  },
  LocationMap: {
    variant: 'embedded',
    zoom: 15,
    showDirections: true,
  },
  CTA: {
    variant: 'custom',
    size: 'medium',
    style: 'primary',
  },
  Footer: {
    variant: 'detailed',
    links: [],
    social: [],
  },
  RichText: {
    variant: 'body',
    sanitize: true,
  },
  Section: {
    variant: 'default',
    background: 'transparent',
    padding: 'medium',
  },
} as const;