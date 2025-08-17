/**
 * Core Schema Definition - Single Source of Truth
 * Version: 1.0.0
 * 
 * This schema defines the canonical structure for all restaurant data.
 * All restaurant websites are generated from data matching this schema.
 */

import { z } from 'zod';

// Schema versioning for migrations
export const CURRENT_SCHEMA_VERSION = '1.0.0';

// Coordinate system
export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// Business information
export const BusinessInfoSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/), // URL-safe identifier
  logo: z.string().url().optional(),
  tagline: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  currency: z.string().length(3).default('SAR'), // ISO currency code
  type: z.string().default('Restaurant'), // Restaurant type/cuisine
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
});

// Navigation links
export const NavLinkSchema = z.object({
  text: z.string(),
  href: z.string(),
  external: z.boolean().default(false),
});

// Social media links
export const SocialLinkSchema = z.object({
  platform: z.enum(['facebook', 'instagram', 'twitter', 'whatsapp', 'tiktok']),
  url: z.string().url(),
  handle: z.string().optional(),
});

// Image asset (reusable for menu galleries, etc.)
export const ImageAssetSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
});

// Menu item structure
export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  nameAr: z.string().optional(), // Arabic name
  description: z.string().optional(),
  descriptionAr: z.string().optional(), // Arabic description
  price: z.number().min(0),
  offerPrice: z.number().min(0).optional(),
  currency: z.string().length(3).default('SAR'),
  image: z.string().url().optional(),
  // Optional multiple images per item (for lightbox/gallery or alt views)
  images: z.array(ImageAssetSchema).optional(),
  alt: z.string().optional(), // Required for accessibility
  tags: z.array(z.string()).default([]), // vegan, spicy, etc.
  available: z.boolean().default(true),
});

// Menu section/category
export const MenuSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  titleAr: z.string().optional(),
  description: z.string().optional(),
  items: z.array(MenuItemSchema),
  order: z.number().default(0), // Display order
});

// Gallery image
export const GalleryImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1), // Required for accessibility
  caption: z.string().optional(),
  captionAr: z.string().optional(),
  order: z.number().default(0),
});

// Menu display configuration (layout and imagery controls)
export const MenuDisplayConfigSchema = z.object({
  variant: z.enum(['grid-photos', 'table-clean', 'cards-compact']).default('grid-photos'),
  paginateThreshold: z.number().int().min(0).default(24),
  grid: z.object({
    columns: z.number().int().min(1).max(6).default(3),
    imageShape: z.enum(['boxed', 'rounded', 'circle']).default('boxed'),
  }).optional(),
  showImages: z.boolean().default(true),
  imageMode: z.enum(['from-data', 'static-path']).default('from-data'),
  imagesBasePath: z.string().default('/images/menu'),
  showDescriptions: z.boolean().default(true),
});

// Operating hours
export const OpeningHoursSchema = z.object({
  monday: z.array(z.object({
    open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM
    close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })).default([]),
  tuesday: z.array(z.object({
    open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })).default([]),
  wednesday: z.array(z.object({
    open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })).default([]),
  thursday: z.array(z.object({
    open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })).default([]),
  friday: z.array(z.object({
    open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })).default([]),
  saturday: z.array(z.object({
    open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })).default([]),
  sunday: z.array(z.object({
    open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })).default([]),
});

// Location information
export const LocationInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  addressAr: z.string().optional(),
  city: z.string(),
  region: z.string(),
  state: z.string().optional(), // Added state field
  country: z.string().default('SA'), // ISO country code
  postalCode: z.string().optional(),
  coordinates: CoordinatesSchema,
  timezone: z.string().default('Asia/Riyadh'), // IANA timezone
  hours: OpeningHoursSchema,
  phone: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

// SEO configuration
export const SEOConfigSchema = z.object({
  title: z.string().max(60).optional(),
  titleAr: z.string().max(60).optional(),
  description: z.string().max(160).optional(),
  descriptionAr: z.string().max(160).optional(),
  keywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().url().optional(),
  robots: z.string().default('index,follow'),
  ogImage: z.string().url().optional(),
});

// Site metadata
export const SiteMetadataSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  skinId: z.string().regex(/^[a-z0-9-]+$/),
  locale: z.enum(['en', 'ar']).default('en'),
  direction: z.enum(['ltr', 'rtl']).default('ltr'),
  isDraft: z.boolean().default(false),
  lastModified: z.string().datetime(),
  buildVersion: z.string().optional(),
});

// Root schema - Single source of truth
export const SiteSchemaV1 = z.object({
  schemaVersion: z.string().default(CURRENT_SCHEMA_VERSION),
  metadata: SiteMetadataSchema,
  business: BusinessInfoSchema,
  menu: z.object({
    sections: z.array(MenuSectionSchema),
    currency: z.string().length(3).default('SAR'),
    display: MenuDisplayConfigSchema.optional(),
  }),
  locations: z.array(LocationInfoSchema).min(1),
  gallery: z.object({
    hero: z.string().url().optional(), // Featured hero image
    images: z.array(GalleryImageSchema),
  }),
  seo: SEOConfigSchema,
});

// Export types for TypeScript
export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type BusinessInfo = z.infer<typeof BusinessInfoSchema>;
export type NavLink = z.infer<typeof NavLinkSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type MenuSection = z.infer<typeof MenuSectionSchema>;
export type GalleryImage = z.infer<typeof GalleryImageSchema>;
export type OpeningHours = z.infer<typeof OpeningHoursSchema>;
export type LocationInfo = z.infer<typeof LocationInfoSchema>;
export type SEOConfig = z.infer<typeof SEOConfigSchema>;
export type SiteMetadata = z.infer<typeof SiteMetadataSchema>;
export type SiteSchema = z.infer<typeof SiteSchemaV1>;

// Schema registry for versioning
export const SCHEMA_REGISTRY = {
  '1.0.0': SiteSchemaV1,
} as const;

export type SchemaVersion = keyof typeof SCHEMA_REGISTRY;