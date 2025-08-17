/**
 * Skin Loader System
 * 
 * Manages loading, validation, and processing of website skins.
 * Handles CSS scoping, token validation, and mapping compilation.
 */

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import * as yaml from 'js-yaml';
import { CSSScoper, scopeCSSString } from './css-scoper';
import { MappingProcessor, type MappingConfig } from './mapping-dsl';
import type { SiteSchema } from '@/schema/core';

// Skin metadata schema
const SkinMetaSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/),
  author: z.string().max(100).optional(),
  tags: z.array(z.string().max(20)).max(10).default([]),
  preview: z.string().regex(/\.(jpg|jpeg|png|webp)$/).optional(),
  created: z.string().datetime().optional(),
  updated: z.string().datetime().optional(),
});

// Skin tokens schema (simplified version)
const SkinTokensSchema = z.object({
  meta: SkinMetaSchema,
  colors: z.record(z.any()).refine(
    (colors) => colors.primary && colors.background && colors.text,
    { message: "Must have primary, background, and text colors" }
  ),
  typography: z.record(z.any()).refine(
    (typography) => typography.fontFamily && typography.fontSize,
    { message: "Must have fontFamily and fontSize" }
  ),
  spacing: z.record(z.string()).refine(
    (spacing) => spacing.md,
    { message: "Must have md spacing value" }
  ),
}).passthrough();

// Skin configuration
export interface SkinConfig {
  meta: z.infer<typeof SkinMetaSchema>;
  tokens: z.infer<typeof SkinTokensSchema>;
  mapping: MappingConfig;
  css: string;
  behavior?: string;
}

// Processing result
export interface SkinProcessingResult {
  config: SkinConfig;
  processedCSS: string;
  cssHash: string;
  stats: {
    cssSize: number;
    cssGzippedSize?: number;
    rulesProcessed: number;
    tokensValidated: number;
    mappingNodes: number;
  };
}

// Skin discovery result
export interface SkinInfo {
  id: string;
  name: string;
  description?: string;
  version: string;
  author?: string;
  tags: string[];
  path: string;
  isValid: boolean;
  errors?: string[];
}

// Main skin loader class
export class SkinLoader {
  private skinsDirectory: string;
  private cache: Map<string, SkinProcessingResult>;
  private discoveryCache: Map<string, SkinInfo>;

  constructor(skinsDirectory: string = './skins') {
    this.skinsDirectory = path.resolve(skinsDirectory);
    this.cache = new Map();
    this.discoveryCache = new Map();
  }

  // Discover all available skins
  async discoverSkins(): Promise<SkinInfo[]> {
    try {
      const entries = await fs.readdir(this.skinsDirectory, { withFileTypes: true });
      const skinDirs = entries.filter(entry => entry.isDirectory());

      const skins: SkinInfo[] = [];

      for (const dir of skinDirs) {
        const skinId = dir.name;
        const skinPath = path.join(this.skinsDirectory, skinId);
        
        try {
          const skinInfo = await this.validateSkinStructure(skinId, skinPath);
          skins.push(skinInfo);
          this.discoveryCache.set(skinId, skinInfo);
        } catch (error) {
          console.warn(`Skipping invalid skin ${skinId}:`, error);
          skins.push({
            id: skinId,
            name: skinId,
            version: '0.0.0',
            tags: [],
            path: skinPath,
            isValid: false,
            errors: [error instanceof Error ? error.message : 'Unknown error'],
          });
        }
      }

      return skins.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      throw new Error(`Failed to discover skins: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Load and process a specific skin
  async loadSkin(skinId: string): Promise<SkinProcessingResult> {
    // Check cache first
    if (this.cache.has(skinId)) {
      return this.cache.get(skinId)!;
    }

    const skinPath = path.join(this.skinsDirectory, skinId);
    
    try {
      // Validate skin exists and has proper structure
      await this.validateSkinExists(skinId, skinPath);

      // Load all skin components
      const [tokens, mapping, css, behavior] = await Promise.all([
        this.loadTokens(skinPath),
        this.loadMapping(skinPath),
        this.loadCSS(skinPath),
        this.loadBehavior(skinPath).catch(() => undefined), // Optional
      ]);

      // Create skin config
      const config: SkinConfig = {
        meta: tokens.meta,
        tokens,
        mapping,
        css,
        behavior,
      };

      // Process CSS with scoping
      const cssResult = await scopeCSSString(css, skinId);
      
      // Create processing result
      const result: SkinProcessingResult = {
        config,
        processedCSS: cssResult.css,
        cssHash: cssResult.hash,
        stats: {
          cssSize: cssResult.stats.size,
          cssGzippedSize: cssResult.stats.sizeGzipped,
          rulesProcessed: cssResult.stats.rulesProcessed,
          tokensValidated: this.countTokens(tokens),
          mappingNodes: this.countMappingNodes(mapping),
        },
      };

      // Cache the result
      this.cache.set(skinId, result);
      
      return result;
    } catch (error) {
      throw new Error(`Failed to load skin ${skinId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate skin structure and return info
  private async validateSkinStructure(skinId: string, skinPath: string): Promise<SkinInfo> {
    const errors: string[] = [];

    // Check required files
    const requiredFiles = ['tokens.json', 'skin.css', 'map.yml'];
    for (const file of requiredFiles) {
      const filePath = path.join(skinPath, file);
      try {
        await fs.access(filePath);
      } catch {
        errors.push(`Missing required file: ${file}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Load and validate tokens for metadata
    try {
      const tokens = await this.loadTokens(skinPath);
      
      return {
        id: skinId,
        name: tokens.meta.name,
        description: tokens.meta.description,
        version: tokens.meta.version,
        author: tokens.meta.author,
        tags: tokens.meta.tags,
        path: skinPath,
        isValid: true,
      };
    } catch (error) {
      throw new Error(`Invalid tokens.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate skin exists
  private async validateSkinExists(skinId: string, skinPath: string): Promise<void> {
    try {
      const stat = await fs.stat(skinPath);
      if (!stat.isDirectory()) {
        throw new Error(`Skin ${skinId} is not a directory`);
      }
    } catch (error) {
      throw new Error(`Skin ${skinId} not found at ${skinPath}`);
    }
  }

  // Load and validate tokens.json
  private async loadTokens(skinPath: string): Promise<z.infer<typeof SkinTokensSchema>> {
    const tokensPath = path.join(skinPath, 'tokens.json');
    
    try {
      const tokensContent = await fs.readFile(tokensPath, 'utf8');
      const tokens = JSON.parse(tokensContent);
      
      return SkinTokensSchema.parse(tokens);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid tokens.json: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
      }
      throw new Error(`Failed to load tokens.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Load and validate map.yml
  private async loadMapping(skinPath: string): Promise<MappingConfig> {
    const mappingPath = path.join(skinPath, 'map.yml');
    
    try {
      const mappingContent = await fs.readFile(mappingPath, 'utf8');
      const processor = new MappingProcessor();
      
      return processor.loadMapping(mappingContent);
    } catch (error) {
      throw new Error(`Failed to load map.yml: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Load skin.css
  private async loadCSS(skinPath: string): Promise<string> {
    const cssPath = path.join(skinPath, 'skin.css');
    
    try {
      return await fs.readFile(cssPath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to load skin.css: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Load behavior.ts (optional)
  private async loadBehavior(skinPath: string): Promise<string> {
    const behaviorPath = path.join(skinPath, 'behavior.ts');
    
    try {
      return await fs.readFile(behaviorPath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to load behavior.ts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate component mappings for a site
  async generateMappings(skinId: string, siteData: SiteSchema): Promise<any[]> {
    const result = await this.loadSkin(skinId);
    const processor = new MappingProcessor(
      siteData.metadata.locale,
      siteData.locations[0]?.timezone || 'UTC'
    );

    const mappings = processor.processMapping(result.config.mapping, siteData);
    const diagnostics = processor.getDiagnostics();

    if (diagnostics.length > 0) {
      console.warn(`Mapping diagnostics for ${skinId}:`, diagnostics);
    }

    return mappings;
  }

  // Get skin by ID (from cache or discovery)
  async getSkinInfo(skinId: string): Promise<SkinInfo | null> {
    if (this.discoveryCache.has(skinId)) {
      return this.discoveryCache.get(skinId)!;
    }

    // Try to discover if not cached
    const skins = await this.discoverSkins();
    return skins.find(skin => skin.id === skinId) || null;
  }

  // Get available skin IDs
  async getAvailableSkinIds(): Promise<string[]> {
    const skins = await this.discoverSkins();
    return skins.filter(skin => skin.isValid).map(skin => skin.id);
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    this.discoveryCache.clear();
  }

  // Count tokens for statistics
  private countTokens(tokens: any): number {
    let count = 0;
    
    const countObject = (obj: any): void => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          countObject(value);
        } else {
          count++;
        }
      }
    };

    countObject(tokens);
    return count;
  }

  // Count mapping nodes for statistics
  private countMappingNodes(mapping: MappingConfig): number {
    let count = 0;
    
    const countNodes = (nodes: any[]): void => {
      for (const node of nodes) {
        count++;
        if (node.children) {
          countNodes(node.children);
        }
        if (node.else) {
          countNodes(node.else);
        }
      }
    };

    if (mapping.page?.layout) {
      countNodes(mapping.page.layout);
    }

    return count;
  }

  // Validate skin compatibility with site data
  async validateSkinCompatibility(skinId: string, siteData: SiteSchema): Promise<{
    compatible: boolean;
    warnings: string[];
    suggestions: string[];
  }> {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      const result = await this.loadSkin(skinId);
      const skinInfo = await this.getSkinInfo(skinId);

      // Check locale compatibility
      if (siteData.metadata.locale === 'ar' && !skinInfo?.tags.includes('rtl')) {
        warnings.push('Skin may not fully support Arabic/RTL layout');
        suggestions.push('Consider using an RTL-compatible skin');
      }

      // Check data requirements
      const mappings = await this.generateMappings(skinId, siteData);
      if (mappings.length === 0) {
        warnings.push('Skin mapping produced no components');
        suggestions.push('Check if site data matches skin requirements');
      }

      // Check required data fields
      if (!siteData.business?.name && result.config.mapping.page.layout.some((node: any) => 
        node.props?.title?.includes('business.name')
      )) {
        warnings.push('Business name is required but missing');
      }

      if (!siteData.menu?.sections?.length && result.config.mapping.page.layout.some((node: any) => 
        node.as === 'MenuList'
      )) {
        warnings.push('Menu sections are expected but missing');
      }

      return {
        compatible: warnings.length === 0,
        warnings,
        suggestions,
      };
    } catch (error) {
      return {
        compatible: false,
        warnings: [`Failed to validate compatibility: ${error instanceof Error ? error.message : 'Unknown error'}`],
        suggestions: ['Try a different skin or fix the skin configuration'],
      };
    }
  }
}

// Singleton instance
export const skinLoader = new SkinLoader();

// Utility functions
export async function listAvailableSkins(): Promise<SkinInfo[]> {
  return skinLoader.discoverSkins();
}

export async function loadSkinForSite(skinId: string, siteData: SiteSchema): Promise<{
  css: string;
  mappings: any[];
  meta: any;
}> {
  const [result, mappings] = await Promise.all([
    skinLoader.loadSkin(skinId),
    skinLoader.generateMappings(skinId, siteData),
  ]);

  return {
    css: result.processedCSS,
    mappings,
    meta: result.config.meta,
  };
}

export async function validateSkin(skinId: string): Promise<{ valid: boolean; errors: string[] }> {
  try {
    await skinLoader.loadSkin(skinId);
    return { valid: true, errors: [] };
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}