import React, { ComponentType } from 'react';
import { Restaurant } from '@/lib/schema';

// Template imports
import BistlyTemplate from './bistly/Template';
import bistlyManifest from './bistly/manifest.json';
import SimpleModernTemplate from './simple-modern/Template';
import simpleModernManifest from './simple-modern/manifest.json';

// Template component interface
export interface TemplateComponent {
  (props: { restaurant: Restaurant }): React.JSX.Element;
}

// Template manifest interface
export interface TemplateManifest {
  id: string;
  name: string;
  description?: string;
  slots: string[];
  version: string;
  author?: string;
  tags?: string[];
  preview?: string;
}

// Template registry entry
export interface TemplateRegistryEntry {
  id: string;
  component: ComponentType<{ restaurant: Restaurant }>;
  manifest: TemplateManifest;
}

// Registry of all templates
const templateRegistry: Record<string, TemplateRegistryEntry> = {
  bistly: {
    id: 'bistly',
    component: BistlyTemplate,
    manifest: bistlyManifest as TemplateManifest,
  },
  'simple-modern': {
    id: 'simple-modern',
    component: SimpleModernTemplate,
    manifest: simpleModernManifest as TemplateManifest,
  },
};

/**
 * Get a template by ID
 */
export function getTemplate(id: string): TemplateRegistryEntry | null {
  const template = templateRegistry[id];
  return template || null;
}

/**
 * Get all available templates
 */
export function listTemplates(): TemplateManifest[] {
  return Object.values(templateRegistry).map(entry => entry.manifest);
}

/**
 * Check if a template exists
 */
export function hasTemplate(id: string): boolean {
  return id in templateRegistry;
}

/**
 * Get template IDs
 */
export function getTemplateIds(): string[] {
  return Object.keys(templateRegistry);
}

/**
 * Get template count
 */
export function getTemplateCount(): number {
  return Object.keys(templateRegistry).length;
}