/**
 * Schema Validation & Migration System
 * 
 * Handles validation of restaurant data against the canonical schema
 * and provides automatic migration between schema versions with production-grade sanitization.
 */

import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
import validator from 'validator';
import { 
  SiteSchema, 
  SiteSchemaV1, 
  SCHEMA_REGISTRY, 
  CURRENT_SCHEMA_VERSION,
  type SchemaVersion 
} from './core';

export class SchemaValidationError extends Error {
  constructor(
    message: string, 
    public issues: z.ZodIssue[] = [],
    public schemaVersion?: string
  ) {
    super(message);
    this.name = 'SchemaValidationError';
  }
}

export class SchemaMigrationError extends Error {
  constructor(message: string, public fromVersion?: string, public toVersion?: string) {
    super(message);
    this.name = 'SchemaMigrationError';
  }
}

/**
 * Validates data against the current schema version
 */
export function validateSiteData(data: unknown): SiteSchema {
  try {
    return SiteSchemaV1.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new SchemaValidationError(
        `Schema validation failed: ${error.issues.map(i => i.message).join(', ')}`,
        error.issues,
        CURRENT_SCHEMA_VERSION
      );
    }
    throw error;
  }
}

/**
 * Validates data against a specific schema version
 */
export function validateSiteDataVersion(data: unknown, version: SchemaVersion): SiteSchema {
  const schema = SCHEMA_REGISTRY[version];
  if (!schema) {
    throw new SchemaValidationError(`Unknown schema version: ${version}`);
  }

  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new SchemaValidationError(
        `Schema validation failed for version ${version}: ${error.issues.map(i => i.message).join(', ')}`,
        error.issues,
        version
      );
    }
    throw error;
  }
}

/**
 * Checks if a schema version is compatible with a range
 * Supports semver-style ranges: ">=1.0.0 <2.0.0"
 */
export function isVersionCompatible(version: string, range: string): boolean {
  // Simple version comparison - in production, use semver library
  const cleanVersion = version.replace(/[^\d.]/g, '');
  const [major, minor, patch] = cleanVersion.split('.').map(Number);
  
  // Parse range (simplified - supports >= and <)
  const rangeMatch = range.match(/>=\s*(\d+\.\d+\.\d+)\s*<\s*(\d+\.\d+\.\d+)/);
  if (!rangeMatch) return true; // If no range specified, assume compatible
  
  const [, minVersion, maxVersion] = rangeMatch;
  const [minMajor, minMinor, minPatch] = minVersion.split('.').map(Number);
  const [maxMajor, maxMinor, maxPatch] = maxVersion.split('.').map(Number);
  
  const versionNum = major * 10000 + minor * 100 + patch;
  const minVersionNum = minMajor * 10000 + minMinor * 100 + minPatch;
  const maxVersionNum = maxMajor * 10000 + maxMinor * 100 + maxPatch;
  
  return versionNum >= minVersionNum && versionNum < maxVersionNum;
}

/**
 * Migrates data from legacy format to current schema
 */
export function migrateLegacyData(legacyData: any): SiteSchema {
  // Check if data already has schemaVersion
  if (legacyData.schemaVersion) {
    const version = legacyData.schemaVersion as SchemaVersion;
    if (version === CURRENT_SCHEMA_VERSION) {
      return validateSiteData(legacyData);
    }
    
    // Future: Add migration logic between versions
    throw new SchemaMigrationError(
      `Migration from ${version} to ${CURRENT_SCHEMA_VERSION} not yet implemented`
    );
  }

  // Migrate from legacy restaurant_data format
  if (legacyData.restaurant_info && legacyData.menu_categories) {
    return migrateLegacyRestaurantData(legacyData);
  }

  throw new SchemaMigrationError('Unknown legacy data format');
}

/**
 * Migrates from the old restaurant_data JSON format
 */
function migrateLegacyRestaurantData(legacyData: any): SiteSchema {
  const { restaurant_info, menu_categories = {}, generated_at, source } = legacyData;
  
  // Transform menu categories to new format
  const menuSections: any[] = [];
  let sectionOrder = 0;
  
  Object.entries(menu_categories).forEach(([categoryName, items]: [string, any[]]) => {
    menuSections.push({
      id: categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      title: categoryName,
      description: '',
      items: items.map((item: any, index: number) => ({
        id: `${categoryName.toLowerCase()}-${index}`,
        name: item.item_en || item.name || 'Menu Item',
        nameAr: item.item_ar,
        description: item.description || '',
        price: parseFloat(item.price) || 0,
        offerPrice: item.offer_price ? parseFloat(item.offer_price) : undefined,
        currency: item.currency || 'SAR',
        image: item.image || undefined,
        alt: item.item_en || item.name || 'Menu Item',
        tags: [],
        available: true,
      })),
      order: sectionOrder++,
    });
  });

  // Create slug from restaurant name
  const slug = restaurant_info.name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');

  // Build new schema
  const migratedData: SiteSchema = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    metadata: {
      slug,
      skinId: 'cafert-original', // Default skin
      locale: 'en',
      direction: 'ltr',
      isDraft: false,
      lastModified: generated_at || new Date().toISOString(),
      buildVersion: '1.0.0',
    },
    business: {
      name: restaurant_info.name,
      slug,
      tagline: `Delicious ${restaurant_info.type_of_food} cuisine`,
      description: `Experience authentic ${restaurant_info.type_of_food} dishes at ${restaurant_info.name}`,
      currency: 'SAR',
      phone: undefined,
      email: undefined,
      website: restaurant_info.hungerstation_url,
    },
    menu: {
      sections: menuSections,
      currency: 'SAR',
    },
    locations: [{
      id: 'primary',
      name: restaurant_info.name,
      address: `${restaurant_info.region}, ${restaurant_info.state}`,
      city: restaurant_info.region,
      region: restaurant_info.state,
      country: restaurant_info.country === 'Saudi Arabia' ? 'SA' : restaurant_info.country,
      coordinates: restaurant_info.coordinates || { latitude: 24.7136, longitude: 46.6753 }, // Default to Riyadh
      timezone: 'Asia/Riyadh',
      hours: {
        monday: [{ open: '09:00', close: '22:00' }],
        tuesday: [{ open: '09:00', close: '22:00' }],
        wednesday: [{ open: '09:00', close: '22:00' }],
        thursday: [{ open: '09:00', close: '22:00' }],
        friday: [{ open: '14:00', close: '22:00' }],
        saturday: [{ open: '09:00', close: '22:00' }],
        sunday: [{ open: '09:00', close: '22:00' }],
      },
      isPrimary: true,
    }],
    gallery: {
      images: [],
    },
    seo: {
      title: restaurant_info.name,
      description: `${restaurant_info.name} - ${restaurant_info.type_of_food} Restaurant in ${restaurant_info.region}`,
      keywords: [restaurant_info.type_of_food, 'restaurant', restaurant_info.region, 'food delivery'],
      robots: 'index,follow',
    },
  };

  return validateSiteData(migratedData);
}

/**
 * Validates and normalizes data from external sources
 */
export function normalizeExternalData(data: unknown, source: 'google-places' | 'ocr-menu' | 'manual'): Partial<SiteSchema> {
  // Future: Add specific normalization logic for different data sources
  switch (source) {
    case 'google-places':
      // Normalize Google Places API data
      break;
    case 'ocr-menu':
      // Normalize OCR menu extraction data
      break;
    case 'manual':
      // Validate manual data entry
      break;
  }
  
  return {};
}

/**
 * Generates helpful diagnostics for validation errors
 */
export function generateValidationDiagnostics(error: SchemaValidationError): string[] {
  const diagnostics: string[] = [];
  
  error.issues.forEach(issue => {
    const path = issue.path.join('.');
    
    switch (issue.code) {
      case 'invalid_type':
        diagnostics.push(`${path}: Expected ${issue.expected}, got ${issue.received}`);
        break;
      case 'too_small':
        if (issue.type === 'string') {
          diagnostics.push(`${path}: Text must be at least ${issue.minimum} characters`);
        } else if (issue.type === 'array') {
          diagnostics.push(`${path}: Must have at least ${issue.minimum} items`);
        }
        break;
      case 'too_big':
        if (issue.type === 'string') {
          diagnostics.push(`${path}: Text must be at most ${issue.maximum} characters`);
        }
        break;
      case 'invalid_string':
        if (issue.validation === 'email') {
          diagnostics.push(`${path}: Must be a valid email address`);
        } else if (issue.validation === 'url') {
          diagnostics.push(`${path}: Must be a valid URL`);
        } else if (issue.validation === 'regex') {
          diagnostics.push(`${path}: Format is invalid`);
        }
        break;
      default:
        diagnostics.push(`${path}: ${issue.message}`);
    }
  });
  
  return diagnostics;
}

/**
 * Production Data Sanitization & Validation
 */

export interface SanitizedValidationResult {
  success: boolean;
  data: any;
  warnings: string[];
  errors?: z.ZodIssue[];
}

/**
 * HTML Sanitization configuration for different content types
 */
const sanitizationConfig = {
  richText: {
    allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    allowedAttributes: {},
    disallowedTagsMode: 'discard' as const,
    allowedSchemes: [],
  },
  basicText: {
    allowedTags: ['strong', 'em'],
    allowedAttributes: {},
    disallowedTagsMode: 'discard' as const,
    allowedSchemes: [],
  },
  noHtml: {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard' as const,
  }
};

/**
 * Approved image domains for validation
 */
const approvedImageDomains = new Set([
  'images.unsplash.com',
  'www.unsplash.com',
  'unsplash.com'
]);

/**
 * Sanitizes text content removing dangerous HTML and scripts
 */
function sanitizeText(text: string | null | undefined, allowHtml = false): string {
  if (!text) return '';
  
  const config = allowHtml ? sanitizationConfig.basicText : sanitizationConfig.noHtml;
  
  let sanitized = sanitizeHtml(text, config);
  
  // Remove any remaining script attempts
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  return sanitized.trim().substring(0, 500); // Limit length
}

/**
 * Sanitizes rich text content (descriptions, etc.)
 */
function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return '';
  
  let sanitized = sanitizeHtml(html, sanitizationConfig.richText);
  
  // Additional security checks
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  return sanitized.trim().substring(0, 2000); // Limit length for descriptions
}

/**
 * Validates and sanitizes image URLs
 */
function validateImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  try {
    // Basic URL validation
    if (!validator.isURL(url, { require_protocol: true })) {
      return null;
    }
    
    const urlObj = new URL(url);
    
    // Check against approved domains
    if (!approvedImageDomains.has(urlObj.hostname)) {
      console.warn(`Image URL from unapproved domain: ${urlObj.hostname}`);
      return null; // Will fall back to placeholder
    }
    
    return url;
  } catch {
    return null;
  }
}

/**
 * Normalizes and validates price values
 */
function normalizePrice(price: any): number {
  if (typeof price === 'number') {
    return Math.max(0, Math.min(price, 99999));
  }
  
  if (typeof price === 'string') {
    // Extract numeric value from string (handles currency symbols)
    const match = price.match(/[\d.,]+/);
    if (match) {
      const numeric = parseFloat(match[0].replace(',', '.'));
      return Math.max(0, Math.min(numeric || 0, 99999));
    }
  }
  
  return 0;
}

/**
 * Validates and normalizes phone numbers (Saudi Arabia format)
 */
function normalizePhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Saudi Arabia phone number patterns
  const saudiPatterns = [
    /^\+966[1-9]\d{8}$/,  // +966 followed by 9 digits
    /^966[1-9]\d{8}$/,    // 966 followed by 9 digits
    /^0[1-9]\d{8}$/,      // 0 followed by 9 digits
    /^[1-9]\d{8}$/        // 9 digits
  ];
  
  // Try to match and normalize
  for (const pattern of saudiPatterns) {
    if (pattern.test(cleaned)) {
      // Normalize to +966 format
      let normalized = cleaned;
      if (normalized.startsWith('0')) {
        normalized = '+966' + normalized.slice(1);
      } else if (normalized.startsWith('966')) {
        normalized = '+' + normalized;
      } else if (!normalized.startsWith('+966')) {
        normalized = '+966' + normalized;
      }
      return normalized;
    }
  }
  
  // Return original if no pattern matches, with basic cleanup
  return cleaned.substring(0, 20);
}

/**
 * Production Restaurant Data Schema with Sanitization
 */
export const ProductionRestaurantSchema = z.object({
  restaurant_info: z.object({
    name: z.string()
      .min(1, 'Restaurant name required')
      .max(100, 'Restaurant name too long')
      .transform(text => sanitizeText(text)),
      
    description: z.string()
      .optional()
      .transform(html => html ? sanitizeRichText(html) : ''),
      
    address: z.string()
      .optional()
      .transform(text => sanitizeText(text)),
      
    phone: z.string()
      .optional()
      .transform(normalizePhoneNumber),
      
    email: z.string()
      .optional()
      .refine(email => !email || validator.isEmail(email), 'Invalid email format')
      .transform(email => email ? email.toLowerCase().trim() : undefined),
      
    website: z.string()
      .optional()
      .refine(url => !url || validator.isURL(url), 'Invalid website URL'),
      
    photo_url: z.string()
      .optional()
      .transform(validateImageUrl),
      
    type_of_food: z.string()
      .optional()
      .transform(text => sanitizeText(text)),
      
    region: z.string()
      .optional()
      .transform(text => sanitizeText(text)),
      
    state: z.string()
      .optional()
      .transform(text => sanitizeText(text)),
      
    country: z.string()
      .optional()
      .transform(text => sanitizeText(text)),
      
    coordinates: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180)
    }).optional(),
    
    rating: z.number()
      .min(0)
      .max(5)
      .optional(),
      
    review_count: z.number()
      .min(0)
      .optional()
  }),
  
  menu_categories: z.record(
    z.array(z.object({
      item_en: z.string()
        .transform(text => sanitizeText(text)),
        
      item_ar: z.string()
        .optional()
        .transform(text => text ? sanitizeText(text) : undefined),
        
      description: z.string()
        .optional()
        .transform(html => html ? sanitizeRichText(html) : ''),
        
      price: z.union([z.number(), z.string()])
        .transform(normalizePrice),
        
      offer_price: z.union([z.number(), z.string()])
        .optional()
        .transform(price => price ? normalizePrice(price) : undefined),
        
      currency: z.string()
        .default('SAR')
        .transform(text => sanitizeText(text) || 'SAR'),
        
      image: z.string()
        .optional()
        .transform(validateImageUrl),
        
      available: z.boolean()
        .default(true),
        
      spicy: z.boolean()
        .optional(),
        
      vegetarian: z.boolean()
        .optional()
    }))
  ).optional(),
  
  contact_info: z.object({
    phone: z.string()
      .optional()
      .transform(normalizePhoneNumber),
      
    email: z.string()
      .optional()
      .refine(email => !email || validator.isEmail(email), 'Invalid email format')
      .transform(email => email ? email.toLowerCase().trim() : undefined),
      
    facebook: z.string()
      .optional()
      .refine(url => !url || validator.isURL(url), 'Invalid Facebook URL'),
      
    instagram: z.string()
      .optional()
      .refine(url => !url || validator.isURL(url), 'Invalid Instagram URL'),
      
    twitter: z.string()
      .optional()
      .refine(url => !url || validator.isURL(url), 'Invalid Twitter URL'),
      
    hours: z.record(z.string())
      .optional()
  }).optional(),
  
  generated_at: z.string()
    .optional(),
    
  source: z.string()
    .optional()
    .transform(text => sanitizeText(text))
});

/**
 * Validates and sanitizes restaurant data with production-grade security
 */
export async function validateRestaurantDataProduction(data: unknown): Promise<SanitizedValidationResult> {
  try {
    const validated = await ProductionRestaurantSchema.parseAsync(data);
    const warnings: string[] = [];
    
    // Generate warnings for missing or problematic data
    if (!validated.restaurant_info.photo_url) {
      warnings.push('Missing restaurant photo - using fallback image');
    }
    
    if (!validated.menu_categories || Object.keys(validated.menu_categories).length === 0) {
      warnings.push('No menu categories found');
    }
    
    if (!validated.restaurant_info.phone && !validated.contact_info?.phone) {
      warnings.push('No phone number provided');
    }
    
    if (!validated.restaurant_info.address) {
      warnings.push('No address provided');
    }
    
    // Check for items with invalid images (will use fallbacks)
    if (validated.menu_categories) {
      Object.entries(validated.menu_categories).forEach(([category, items]) => {
        items.forEach(item => {
          if (!item.image) {
            warnings.push(`Menu item "${item.item_en}" in ${category} has no image`);
          }
        });
      });
    }
    
    return {
      success: true,
      data: validated,
      warnings
    };
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        warnings: [],
        errors: error.errors
      };
    }
    
    throw error;
  }
}

/**
 * Batch validates multiple restaurant data files
 */
export async function validateRestaurantsBatch(dataArray: unknown[]): Promise<{
  successful: number;
  failed: number;
  results: SanitizedValidationResult[];
  summary: string;
}> {
  const results = await Promise.all(
    dataArray.map(data => validateRestaurantDataProduction(data))
  );
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  const summary = `Validation completed: ${successful} successful, ${failed} failed out of ${dataArray.length} total`;
  
  return {
    successful,
    failed,
    results,
    summary
  };
}

/**
 * Formats validation errors for human readability
 */
export function formatValidationErrors(errors: z.ZodIssue[]): string[] {
  return errors.map(error => {
    const path = error.path.join('.');
    
    switch (error.code) {
      case 'invalid_type':
        return `${path}: Expected ${error.expected}, received ${error.received}`;
      case 'too_small':
        return `${path}: Must be at least ${error.minimum} characters`;
      case 'too_big':
        return `${path}: Must be at most ${error.maximum} characters`;
      case 'invalid_string':
        if (error.validation === 'email') {
          return `${path}: Must be a valid email address`;
        } else if (error.validation === 'url') {
          return `${path}: Must be a valid URL`;
        }
        return `${path}: Invalid format`;
      default:
        return `${path}: ${error.message}`;
    }
  });
}